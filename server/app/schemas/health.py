from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str = Field(default="healthy", examples=["healthy"])
    environment: str
    database: str = Field(default="connected", examples=["connected"])
    version: str
