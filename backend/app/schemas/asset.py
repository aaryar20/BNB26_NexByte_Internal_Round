from pydantic import BaseModel


class AssetResponse(BaseModel):
    id: str
    project_id: str
    filename: str
    filepath: str
    asset_type: str
    duration: float | None = None

    class Config:
        from_attributes = True