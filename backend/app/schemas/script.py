from pydantic import BaseModel


class ScriptCreate(BaseModel):
    content: str


class ScriptResponse(BaseModel):
    id: str
    project_id: str
    content: str

    class Config:
        from_attributes = True