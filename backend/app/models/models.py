from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship

from app.database.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    assets = relationship(
        "Asset",
        back_populates="project",
        cascade="all, delete-orphan"
    )

    scripts = relationship(
        "Script",
        back_populates="project",
        cascade="all, delete-orphan"
    )


class Asset(Base):
    __tablename__ = "assets"

    id = Column(String, primary_key=True)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)

    filename = Column(String, nullable=False)
    filepath = Column(String, nullable=False)
    asset_type = Column(String, nullable=False)

    duration = Column(Float, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship(
        "Project",
        back_populates="assets"
    )


class Script(Base):
    __tablename__ = "scripts"

    id = Column(String, primary_key=True)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)

    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship(
        "Project",
        back_populates="scripts"
    )

    beats = relationship(
        "ScriptBeat",
        back_populates="script",
        cascade="all, delete-orphan"
    )


class ScriptBeat(Base):
    __tablename__ = "script_beats"

    id = Column(String, primary_key=True)
    script_id = Column(String, ForeignKey("scripts.id"), nullable=False)

    beat_type = Column(String, nullable=False)
    text = Column(Text, nullable=False)
    order_index = Column(Integer, nullable=False)

    script = relationship(
        "Script",
        back_populates="beats"
    )


class Clip(Base):
    __tablename__ = "clips"

    id = Column(String, primary_key=True)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)

    start_time = Column(Float, nullable=False)
    end_time = Column(Float, nullable=False)

    score = Column(Float, nullable=True)
    hook = Column(Text, nullable=True)
    reason = Column(Text, nullable=True)

    status = Column(
        String,
        default="ai_suggested"
    )


class Edit(Base):
    __tablename__ = "edits"

    id = Column(String, primary_key=True)
    clip_id = Column(String, ForeignKey("clips.id"), nullable=False)

    operation_type = Column(String, nullable=False)
    parameters = Column(Text, nullable=False)

    status = Column(
        String,
        default="ai_suggested"
    )


class TranscriptSegment(Base):
    __tablename__ = "transcript_segments"

    id = Column(String, primary_key=True)
    asset_id = Column(
        String,
        ForeignKey("assets.id"),
        nullable=False
    )

    start_time = Column(Float, nullable=False)
    end_time = Column(Float, nullable=False)
    text = Column(Text, nullable=False)