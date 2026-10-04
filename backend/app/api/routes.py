import os
import shutil
import uuid
import json
import httpx

from fastapi import (
    APIRouter,
    Depends,
    File,
    UploadFile,
    HTTPException
)
from pydantic import BaseModel

from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.models import (
    Project,
    Asset,
    Script,
    Clip,
    Edit
)

from app.schemas.project import ProjectCreate, ProjectResponse
from app.schemas.asset import AssetResponse
from app.schemas.script import ScriptCreate, ScriptResponse

from app.services.transcription import TranscriptionService
from app.services.content_pipeline import ContentPipeline
from app.services.mock_transcript import get_mock_transcript


router = APIRouter()


# ============================================================
# HEALTH
# ============================================================

@router.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "creator-ai-backend"
    }


# ============================================================
# PROJECTS
# ============================================================

@router.post(
    "/projects",
    response_model=ProjectResponse
)
def create_project(
    project_data: ProjectCreate,
    db: Session = Depends(get_db)
):
    project = Project(
        id=str(uuid.uuid4()),
        name=project_data.name,
        description=project_data.description
    )

    db.add(project)
    db.commit()
    db.refresh(project)

    return project


@router.get("/projects")
def get_projects(
    db: Session = Depends(get_db)
):
    projects = (
        db.query(Project)
        .order_by(Project.created_at.desc())
        .all()
    )

    return projects


@router.get(
    "/projects/{project_id}",
    response_model=ProjectResponse
)
def get_project(
    project_id: str,
    db: Session = Depends(get_db)
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    return project


# ============================================================
# ASSETS
# ============================================================

@router.post(
    "/projects/{project_id}/assets",
    response_model=AssetResponse
)
def upload_asset(
    project_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    asset_id = str(uuid.uuid4())

    project_upload_dir = os.path.join(
        "uploads",
        project_id
    )

    os.makedirs(
        project_upload_dir,
        exist_ok=True
    )

    file_path = os.path.join(
        project_upload_dir,
        f"{asset_id}_{file.filename}"
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    extension = (
        os.path.splitext(file.filename)[1]
        .lower()
    )

    if extension in [
        ".mp4",
        ".mov",
        ".avi",
        ".mkv",
        ".webm"
    ]:
        asset_type = "video"

    elif extension in [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    ]:
        asset_type = "image"

    elif extension in [
        ".mp3",
        ".wav",
        ".m4a"
    ]:
        asset_type = "audio"

    else:
        asset_type = "other"

    asset = Asset(
        id=asset_id,
        project_id=project_id,
        filename=file.filename,
        filepath=file_path,
        asset_type=asset_type
    )

    db.add(asset)
    db.commit()
    db.refresh(asset)

    return asset


# ============================================================
# SCRIPTS
# ============================================================

@router.post(
    "/projects/{project_id}/scripts",
    response_model=ScriptResponse
)
def create_script(
    project_id: str,
    script_data: ScriptCreate,
    db: Session = Depends(get_db)
):
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    script = Script(
        id=str(uuid.uuid4()),
        project_id=project_id,
        content=script_data.content
    )

    db.add(script)
    db.commit()
    db.refresh(script)

    return script


# ============================================================
# TRANSCRIPTION
# ============================================================

@router.post("/assets/{asset_id}/transcribe")
def transcribe_asset(
    asset_id: str,
    db: Session = Depends(get_db)
):
    asset = (
        db.query(Asset)
        .filter(Asset.id == asset_id)
        .first()
    )

    if not asset:
        raise HTTPException(
            status_code=404,
            detail=f"Asset not found: {asset_id}"
        )

    if asset.asset_type != "video":
        raise HTTPException(
            status_code=400,
            detail="Only video assets can be transcribed"
        )

    service = TranscriptionService()

    transcript = service.transcribe(
        asset.filepath
    )

    return {
        "asset_id": asset.id,
        "filename": asset.filename,
        "transcript": transcript
    }


# ============================================================
# AI ANALYSIS
# ============================================================

@router.post(
    "/projects/{project_id}/analyze"
)
def analyze_project(
    project_id: str,
    db: Session = Depends(get_db)
):
    # --------------------------------------------------------
    # 1. Find project
    # --------------------------------------------------------

    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    # --------------------------------------------------------
    # 2. Find latest script
    # --------------------------------------------------------

    script = (
        db.query(Script)
        .filter(
            Script.project_id == project_id
        )
        .order_by(
            Script.created_at.desc()
        )
        .first()
    )

    if not script:
        raise HTTPException(
            status_code=404,
            detail="No script found for this project"
        )

    # --------------------------------------------------------
    # 3. Remove previous AI-generated results
    #
    # This prevents duplicate clips and edits if /analyze
    # is called multiple times for the same project.
    #
    # Clip -> Edit has cascade="all, delete-orphan", so
    # deleting a Clip also removes its associated Edits.
    # --------------------------------------------------------

    existing_clips = (
        db.query(Clip)
        .filter(
            Clip.project_id == project_id
        )
        .all()
    )

    for existing_clip in existing_clips:
        db.delete(existing_clip)

    db.commit()

    # --------------------------------------------------------
    # 4. Temporary transcript
    #
    # Whisper will replace this later.
    # --------------------------------------------------------

    transcript = get_mock_transcript()

    # --------------------------------------------------------
    # 5. Run AI pipeline
    # --------------------------------------------------------

    pipeline = ContentPipeline()

    result = pipeline.analyze(
        script=script.content,
        transcript=transcript
    )

    # --------------------------------------------------------
    # 6. Save generated clips and edit operations
    # --------------------------------------------------------

    for generated_clip in result["clips"]:

        clip = Clip(
            id=str(uuid.uuid4()),
            project_id=project_id,
            start_time=generated_clip["start"],
            end_time=generated_clip["end"],
            score=generated_clip.get("score"),
            hook=(
                generated_clip["hooks"][0]["text"]
                if generated_clip.get("hooks")
                else None
            ),
            reason=generated_clip.get(
                "source_text"
            ),
            status="ai_suggested"
        )

        db.add(clip)

        # Make sure the Clip gets its ID before
        # creating related Edit records.
        db.flush()

        # ----------------------------------------------------
        # Save every AI-suggested edit operation
        # ----------------------------------------------------

        edit_plan = generated_clip.get(
            "edit_plan",
            {}
        )

        operations = edit_plan.get(
            "operations",
            []
        )

        for operation in operations:

            edit = Edit(
                id=str(uuid.uuid4()),
                clip_id=clip.id,
                operation_type=operation["type"],
                parameters=json.dumps(
                    operation
                ),
                status=operation.get(
                    "status",
                    "ai_suggested"
                )
            )

            db.add(edit)

    # --------------------------------------------------------
    # 7. Commit all clips and edits
    # --------------------------------------------------------

    db.commit()

    # --------------------------------------------------------
    # 8. Return existing analysis response
    # --------------------------------------------------------

    return {
        "project_id": project_id,
        "status": "completed",
        "analysis": result
    }

# ============================================================
# PERSISTED PROJECT ANALYSIS
# ============================================================

@router.get("/projects/{project_id}/analysis")
def get_project_analysis(
    project_id: str,
    db: Session = Depends(get_db)
):
    # Check project exists
    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    # Get saved clips
    clips = (
        db.query(Clip)
        .filter(
            Clip.project_id == project_id
        )
        .order_by(
            Clip.score.desc()
        )
        .all()
    )

    if not clips:
        raise HTTPException(
            status_code=404,
            detail="No analysis found for this project"
        )

    persisted_clips = []

    for clip in clips:

        edits = (
            db.query(Edit)
            .filter(
                Edit.clip_id == clip.id
            )
            .all()
        )

        clip_data = {
            "clip_id": clip.id,
            "start": clip.start_time,
            "end": clip.end_time,
            "score": clip.score,
            "hook": clip.hook,
            "reason": clip.reason,
            "status": clip.status,
            "edits": []
        }

        for edit in edits:

            try:
                parameters = json.loads(
                    edit.parameters
                )
            except (TypeError, json.JSONDecodeError):
                parameters = edit.parameters

            clip_data["edits"].append({
                "id": edit.id,
                "operation_type": edit.operation_type,
                "parameters": parameters,
                "status": edit.status
            })

        persisted_clips.append(clip_data)

    return {
        "project_id": project_id,
        "status": "completed",
        "clips": persisted_clips
    }
# ============================================================
# VIDEO RENDERING
# ============================================================

class RenderClipRequest(BaseModel):
    clip_id: str
    format: str = "9:16"

@router.post("/projects/{project_id}/render")
def render_project_clip(
    project_id: str,
    render_request: RenderClipRequest,
    db: Session = Depends(get_db)
):
    # --------------------------------------------------------
    # 1. Check project exists
    # --------------------------------------------------------

    project = (
        db.query(Project)
        .filter(Project.id == project_id)
        .first()
    )

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    # --------------------------------------------------------
    # 2. Find selected clip
    # --------------------------------------------------------

    clip = (
        db.query(Clip)
        .filter(
            Clip.id == render_request.clip_id,
            Clip.project_id == project_id
        )
        .first()
    )

    if not clip:
        raise HTTPException(
            status_code=404,
            detail="Clip not found for this project"
        )

    # --------------------------------------------------------
    # 3. Find video asset for this project
    # --------------------------------------------------------

    asset = (
        db.query(Asset)
        .filter(
            Asset.project_id == project_id,
            Asset.asset_type == "video"
        )
        .first()
    )

    if not asset:
        raise HTTPException(
            status_code=404,
            detail="No video asset found for this project"
        )

    # --------------------------------------------------------
    # 4. Resolve absolute source path
    #
    # The main backend owns the uploaded video.
    # The video engine needs a filesystem path it can access.
    # --------------------------------------------------------

    source_path = os.path.abspath(asset.filepath)

    if not os.path.exists(source_path):
        raise HTTPException(
            status_code=404,
            detail=f"Source video not found: {source_path}"
        )

    # --------------------------------------------------------
    # 5. Build video-engine render payload
    # --------------------------------------------------------

    render_payload = {
        "clips": [
            {
                "source": source_path,
                "start": float(clip.start_time),
                "end": float(clip.end_time)
            }
        ],
        "original_audio": None,
        "format": render_request.format,
        "rotation": 0,
        "fit_mode": "cover"
    }

    # --------------------------------------------------------
    # 6. Send render request to video engine
    # --------------------------------------------------------

    video_engine_url = "http://127.0.0.1:9000/render"

    try:
        with httpx.Client(timeout=300.0) as client:
            response = client.post(
                video_engine_url,
                json=render_payload
            )

    except httpx.RequestError as error:
        raise HTTPException(
            status_code=503,
            detail=f"Video engine unavailable: {str(error)}"
        )

    # --------------------------------------------------------
    # 7. Handle video-engine errors
    # --------------------------------------------------------

    if response.status_code != 200:
        try:
            error_data = response.json()
        except Exception:
            error_data = response.text

        raise HTTPException(
            status_code=502,
            detail={
                "message": "Video rendering failed",
                "video_engine_response": error_data
            }
        )

    # --------------------------------------------------------
    # 8. Return render result
    # --------------------------------------------------------

    result = response.json()

    video_url = result.get("video_url")

    if video_url:
        result["video_url"] = (
            f"http://127.0.0.1:9000{video_url}"
        )

    result["project_id"] = project_id
    result["clip_id"] = clip.id

    return result