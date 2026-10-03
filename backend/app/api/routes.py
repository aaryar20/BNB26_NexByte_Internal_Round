import os
import shutil
import uuid

from fastapi import (
    APIRouter,
    Depends,
    File,
    UploadFile,
    HTTPException
)

from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.models import Project, Asset, Script
from app.schemas.project import ProjectCreate, ProjectResponse
from app.schemas.asset import AssetResponse
from app.schemas.script import ScriptCreate, ScriptResponse
from app.services.transcription import TranscriptionService
from app.services.content_pipeline import ContentPipeline
from app.services.mock_transcript import get_mock_transcript
from app.services.content_pipeline import ContentPipeline
from app.services.mock_transcript import get_mock_transcript


router = APIRouter()


@router.get("/health")
def health():
    return {
        "status": "healthy",
        "service": "creator-ai-backend"
    }


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

    return project


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

    if extension in [".mp4", ".mov", ".avi", ".mkv", ".webm"]:
        asset_type = "video"

    elif extension in [".jpg", ".jpeg", ".png", ".webp"]:
        asset_type = "image"

    elif extension in [".mp3", ".wav", ".m4a"]:
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


@router.post("/projects/{project_id}/analyze")
def analyze_project(
    project_id: str,
    db: Session = Depends(get_db)
):
    # Find project
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

    # Find latest script
    script = (
        db.query(Script)
        .filter(
            Script.project_id == project_id
        )
        .order_by(Script.created_at.desc())
        .first()
    )

    if not script:
        raise HTTPException(
            status_code=404,
            detail="No script found for this project"
        )

    # Temporary transcript
    # Whisper will replace this later.
    transcript = get_mock_transcript()

    # Run AI pipeline
    pipeline = ContentPipeline()

    result = pipeline.analyze(
        script=script.content,
        transcript=transcript
    )

    return {
        "project_id": project_id,
        "status": "completed",
        "analysis": result
    }