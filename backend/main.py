from datetime import datetime, timezone
import uuid
from typing import List, Literal, Optional
from fastapi import FastAPI, status
from pydantic import BaseModel, Field
from models import FanSignal

app = FastAPI(title="The 12th Signal API", description="GenAI stadium-operations system for FIFA World Cup 2026")

# In-memory database for ingested fan signals
signals_db: List[FanSignal] = []

class FanSignalCreate(BaseModel):
    source_type: Literal["voice", "app_tap", "AR", "social"] = Field(..., description="Source medium of the signal")
    location_zone: str = Field(..., description="Stadium zone (e.g. Zone A)")
    raw_text: Optional[str] = Field(None, description="Transcribed text or raw content")
    sentiment_score: float = Field(..., description="Sentiment score from -1.0 to 1.0")

@app.get("/")
def read_root():
    return {
        "status": "OK", 
        "message": "The 12th Signal Backend API is running",
        "ingested_signals_count": len(signals_db)
    }

@app.post("/api/signals", response_model=FanSignal, status_code=status.HTTP_201_CREATED)
def create_signal(signal_input: FanSignalCreate):
    new_signal = FanSignal(
        id=f"sig_{uuid.uuid4().hex[:8]}",
        timestamp=datetime.now(timezone.utc),
        source_type=signal_input.source_type,
        location_zone=signal_input.location_zone,
        raw_text=signal_input.raw_text,
        sentiment_score=signal_input.sentiment_score
    )
    signals_db.append(new_signal)
    return new_signal
