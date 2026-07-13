from datetime import datetime, timezone
import uuid
from typing import List, Literal, Optional
from fastapi import FastAPI, status, HTTPException
from pydantic import BaseModel, Field
from models import FanSignal, SignalCluster, Consensus, FanProfile
from clustering import cluster_signals
from orchestrator import negotiate
from assistant import get_day_plan
from agents.rumor_agent import detect_rumor, RumorAlert


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

# In-memory storage for clusters
clusters_db: List[SignalCluster] = []

@app.get("/api/clusters", response_model=List[SignalCluster])
def get_clusters():
    global clusters_db
    clusters_db = cluster_signals(signals_db)
    return clusters_db

class NegotiateRequest(BaseModel):
    cluster_id: str

@app.post("/api/negotiate", response_model=Consensus)
def post_negotiate(request: NegotiateRequest):
    global clusters_db
    # Find the cluster in clusters_db
    cluster = next((c for c in clusters_db if c.id == request.cluster_id), None)
    if not cluster:
        # Fallback: try to run clustering on the fly to find it
        clusters_db = cluster_signals(signals_db)
        cluster = next((c for c in clusters_db if c.id == request.cluster_id), None)
        
    if not cluster:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Cluster with ID {request.cluster_id} not found")
        
    consensus = negotiate(cluster, signals_db)
    return consensus

class DayPlanResponse(BaseModel):
    plan: str

@app.post("/api/day-plan", response_model=DayPlanResponse)
def post_day_plan(profile: FanProfile):
    plan_text = get_day_plan(profile)
    return {"plan": plan_text}

# In-memory history for rumors detected
rumors_history: List[RumorAlert] = [
    RumorAlert(
        cluster_id="mock_rumor_1",
        suspected_claim="Evacuation panic warning flagged in Zone C.",
        suggested_correction="Factual Correction: Stadium security has verified that there is no active hazard in Zone C. Please follow official instructions and remain calm."
    )
]

@app.get("/api/rumors", response_model=List[RumorAlert])
def get_rumors():
    global clusters_db
    # Dynamically scan current active clusters for rumors
    if not clusters_db:
        clusters_db = cluster_signals(signals_db)
    
    for cluster in clusters_db:
        alert = detect_rumor(cluster, signals_db)
        if alert:
            # Check if this cluster is already recorded to avoid duplicates
            if not any(h.cluster_id == alert.cluster_id for h in rumors_history):
                rumors_history.append(alert)
                
    return rumors_history

