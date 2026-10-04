import os
import subprocess
import uuid
from typing import List, Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, ConfigDict

app = FastAPI(title="CreatorAI Video Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("inputs", exist_ok=True)
os.makedirs("outputs", exist_ok=True)
app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")

class ClipConfig(BaseModel):
    source: str
    start: float = 0.0
    end: Optional[float] = None

class TrimConfig(BaseModel):
    start: float = 0.0
    end: float = 8.0

class OriginalAudioConfig(BaseModel):
    enabled: bool = True
    volume: float = 100.0 

class BackgroundMusicConfig(BaseModel):
    source: Optional[str] = None
    volume: float = 25.0
    start: float = 0.0
    ducking: bool = True

class TextElement(BaseModel):
    text: str
    start: float
    end: float

class CaptionsConfig(BaseModel):
    enabled: bool = True
    text: Optional[str] = None          
    elements: List[TextElement] = []    
    style: str = "dynamic"

class ProductionPlanPayload(BaseModel):
    source: Optional[str] = None
    trim: Optional[TrimConfig] = None
    clips: Optional[List[ClipConfig]] = None
    original_audio: Optional[OriginalAudioConfig] = OriginalAudioConfig()
    background_music: Optional[BackgroundMusicConfig] = BackgroundMusicConfig(
        source="inputs/music.mp3"
    )
    captions: Optional[CaptionsConfig] = CaptionsConfig()
    
    format: str = "9:16"       # Supported: "9:16", "16:9", "1:1"
    rotation: int = 0          # Supported: 0, 90, -90, 180
    fit_mode: str = "fit"      # NEW: "fit" (black bars) or "fill" (zoom and crop)

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "clips": [
                    {
                        "source": "inputs/sample.mp4",
                        "start": 0.0,
                        "end": 4.0
                    }
                ],
                "format": "9:16",
                "rotation": 0,
                "fit_mode": "fit", 
                "original_audio": {"enabled": True, "volume": 100.0},
                "background_music": {
                    "source": "inputs/music.mp3",
                    "volume": 50.0,
                    "start": 35.0,
                    "ducking": True
                },
                "captions": {
                    "enabled": True,
                    "elements": [
                        {"text": "Original quality with black bars!", "start": 0.0, "end": 4.0}
                    ]
                }
            }
        }
    )

@app.get("/")
def health_check():
    return {"status": "ok"}

@app.post("/render")
def render_video(payload: ProductionPlanPayload):
    timeline: List[ClipConfig] = []
    if payload.clips and len(payload.clips) > 0:
        timeline = payload.clips
    elif payload.source:
        start_t = payload.trim.start if payload.trim else 0.0
        end_t = payload.trim.end if payload.trim else None
        timeline = [ClipConfig(source=payload.source, start=start_t, end=end_t)]
    else:
        raise HTTPException(status_code=400, detail="Provide either 'clips' or 'source'.")

    for idx, clip in enumerate(timeline):
        if not os.path.exists(clip.source):
            raise HTTPException(status_code=404, detail=f"Clip {idx+1} source '{clip.source}' not found.")

    output_filename = f"clip_{uuid.uuid4().hex[:6]}.mp4"
    output_path = os.path.join("outputs", output_filename)

    cmd = ["ffmpeg", "-y"]

    for clip in timeline:
        cmd.extend(["-i", clip.source])

    has_music = (
        payload.background_music
        and payload.background_music.source
        and os.path.exists(payload.background_music.source)
    )
    music_idx = len(timeline)
    if has_music:
        if payload.background_music.start > 0:
            cmd.extend(["-ss", str(payload.background_music.start)])
        cmd.extend(["-i", payload.background_music.source])

    # --------------------------------------------------------
    # Build FFmpeg filter graph
    #
    # Some source videos contain no audio stream.
    # Detect audio availability per source and only build
    # audio filters when audio actually exists.
    # --------------------------------------------------------

    source_has_audio = []

    for clip in timeline:
        probe_cmd = [
            "ffprobe",
            "-v", "error",
            "-select_streams", "a:0",
            "-show_entries", "stream=index",
            "-of", "csv=p=0",
            clip.source
        ]

        try:
            probe_result = subprocess.run(
                probe_cmd,
                check=False,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )

            has_audio = bool(
                probe_result.stdout.decode(
                    "utf-8",
                    errors="ignore"
                ).strip()
            )

        except Exception:
            has_audio = False

        source_has_audio.append(has_audio)

    any_audio = any(source_has_audio)

    filter_complex = ""

    for i, clip in enumerate(timeline):

        v_trim = f"trim=start={clip.start}"

        if clip.end is not None and clip.end > clip.start:
            v_trim += f":end={clip.end}"

        # ----------------------------------------------------
        # Rotation
        # ----------------------------------------------------

        rotate_filter = ""

        if payload.rotation == 90:
            rotate_filter = "transpose=1,"
        elif payload.rotation == -90 or payload.rotation == 270:
            rotate_filter = "transpose=2,"
        elif payload.rotation == 180:
            rotate_filter = "vflip,hflip,"

        # ----------------------------------------------------
        # Target dimensions
        # ----------------------------------------------------

        if payload.format == "9:16":
            target_w, target_h = 1080, 1920
        elif payload.format == "16:9":
            target_w, target_h = 1920, 1080
        elif payload.format == "1:1":
            target_w, target_h = 1080, 1080
        else:
            target_w, target_h = 1080, 1920

        # ----------------------------------------------------
        # Fit / Fill
        # ----------------------------------------------------

        if payload.fit_mode == "fill":
            aspect_filter = (
                f"{rotate_filter}"
                f"scale={target_w}:{target_h}:"
                f"force_original_aspect_ratio=increase,"
                f"crop={target_w}:{target_h},"
                f"setsar=1"
            )
        else:
            aspect_filter = (
                f"{rotate_filter}"
                f"scale={target_w}:{target_h}:"
                f"force_original_aspect_ratio=decrease,"
                f"pad={target_w}:{target_h}:"
                f"(ow-iw)/2:(oh-ih)/2:"
                f"color=black,setsar=1"
            )

        # ----------------------------------------------------
        # Video stream
        # ----------------------------------------------------

        filter_complex += (
            f"[{i}:v]{v_trim},"
            f"setpts=PTS-STARTPTS,"
            f"{aspect_filter}[v{i}];"
        )

        # ----------------------------------------------------
        # Audio stream — only if source has audio
        # ----------------------------------------------------

        if source_has_audio[i]:

            a_trim = f"atrim=start={clip.start}"

            if clip.end is not None and clip.end > clip.start:
                a_trim += f":end={clip.end}"

            filter_complex += (
                f"[{i}:a]{a_trim},"
                f"asetpts=PTS-STARTPTS,"
                f"aformat="
                f"sample_fmts=fltp:"
                f"sample_rates=44100:"
                f"channel_layouts=stereo"
                f"[a{i}];"
            )

    # --------------------------------------------------------
    # Concatenate video
    # --------------------------------------------------------

    video_concat_inputs = "".join(
        f"[v{i}]"
        for i in range(len(timeline))
    )

    if any_audio:
        audio_concat_inputs = "".join(
            f"[a{i}]"
            for i in range(len(timeline))
            if source_has_audio[i]
        )

        # Only use the audio-capable clips when constructing
        # the audio stream.
        #
        # For the current single silent-video demo this branch
        # is skipped entirely.
        if all(source_has_audio):
            filter_complex += (
                f"{video_concat_inputs}"
                f"{audio_concat_inputs}"
                f"concat=n={len(timeline)}:v=1:a=1"
                f"[v_stitched][a_stitched];"
            )
        else:
            # Mixed audio/no-audio sources:
            # create a silent audio stream for clips without
            # audio so the concat remains valid.
            for i, has_audio in enumerate(source_has_audio):
                if not has_audio:
                    filter_complex += (
                        f"anullsrc="
                        f"channel_layout=stereo:"
                        f"sample_rate=44100,"
                        f"atrim=duration="
                        f"{max(0, timeline[i].end - timeline[i].start):.3f},"
                        f"asetpts=PTS-STARTPTS"
                        f"[a{i}];"
                    )

            audio_concat_inputs = "".join(
                f"[a{i}]"
                for i in range(len(timeline))
            )

            filter_complex += (
                f"{video_concat_inputs}"
                f"{audio_concat_inputs}"
                f"concat=n={len(timeline)}:v=1:a=1"
                f"[v_stitched][a_stitched];"
            )

    else:
        filter_complex += (
            f"{video_concat_inputs}"
            f"concat=n={len(timeline)}:v=1:a=0"
            f"[v_stitched];"
        )

    # --------------------------------------------------------
    # Captions
    # --------------------------------------------------------

    if payload.captions and payload.captions.enabled:

        if (
            payload.captions.elements
            and len(payload.captions.elements) > 0
        ):
            text_filters = []

            for text_el in payload.captions.elements:

                clean_text = (
                    text_el.text
                    .replace("'", "")
                    .replace(":", "")
                    .replace('"', "")
                )

                text_filters.append(
                    f"drawtext="
                    f"fontfile='font.ttf':"
                    f"text='{clean_text}':"
                    f"fontsize=64:"
                    f"fontcolor=white:"
                    f"box=1:"
                    f"boxcolor=black@0.6:"
                    f"boxborderw=20:"
                    f"x=(w-text_w)/2:"
                    f"y=h-(h/4):"
                    f"enable='between(t,{text_el.start},{text_el.end})'"
                )

            filter_complex += (
                f"[v_stitched]"
                f"{','.join(text_filters)}"
                f"[vout];"
            )

        elif payload.captions.text:

            clean_text = (
                payload.captions.text
                .replace("'", "")
                .replace(":", "")
                .replace('"', "")
            )

            filter_complex += (
                f"[v_stitched]"
                f"drawtext="
                f"fontfile='font.ttf':"
                f"text='{clean_text}':"
                f"fontsize=64:"
                f"fontcolor=white:"
                f"box=1:"
                f"boxcolor=black@0.6:"
                f"boxborderw=20:"
                f"x=(w-text_w)/2:"
                f"y=h-(h/4)"
                f"[vout];"
            )

        else:
            filter_complex += (
                "[v_stitched]copy[vout];"
            )

    else:
        filter_complex += (
            "[v_stitched]copy[vout];"
        )

    # --------------------------------------------------------
    # Audio output
    # --------------------------------------------------------

    if any_audio:

        orig_vol = (
            payload.original_audio.volume / 100.0
            if (
                payload.original_audio
                and payload.original_audio.enabled
            )
            else 0.0
        )

        if has_music:

            music_vol = (
                payload.background_music.volume / 100.0
            )

            if (
                payload.background_music.ducking
                and orig_vol > 0.0
            ):
                music_vol *= 0.5

            filter_complex += (
                f"[a_stitched]"
                f"volume={orig_vol}"
                f"[orig_a];"
                f"[{music_idx}:a]"
                f"aformat="
                f"sample_fmts=fltp:"
                f"sample_rates=44100:"
                f"channel_layouts=stereo,"
                f"volume={music_vol}"
                f"[bgm];"
                f"[orig_a][bgm]"
                f"amix=inputs=2:"
                f"duration=first"
                f"[aout]"
            )

        else:

            filter_complex += (
                f"[a_stitched]"
                f"volume={orig_vol}"
                f"[aout]"
            )

    # --------------------------------------------------------
    # Build FFmpeg command
    # --------------------------------------------------------

    cmd.extend([
        "-filter_complex",
        filter_complex,
        "-map",
        "[vout]"
    ])

    if any_audio:
        cmd.extend([
            "-map",
            "[aout]",
            "-c:a",
            "aac"
        ])
    else:
        cmd.extend([
            "-an"
        ])

    cmd.extend([
        "-c:v",
        "libx264",
        "-preset",
        "ultrafast",
        output_path
    ])

    try:
        subprocess.run(
            cmd,
            check=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )

    except subprocess.CalledProcessError as e:

        error_msg = e.stderr.decode(
            "utf-8",
            errors="ignore"
        )

        raise HTTPException(
            status_code=500,
            detail=f"FFmpeg failed: {error_msg[-300:]}"
        )

    return {
        "status": "completed",
        "video_url": f"/outputs/{output_filename}",
        "full_url": f"http://127.0.0.1:8000/outputs/{output_filename}",
    }