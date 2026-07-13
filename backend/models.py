from datetime import datetime, timezone
from typing import List, Literal, Optional
from pydantic import BaseModel, Field

class FanSignal(BaseModel):
    id: str = Field(..., description="Unique identifier for the fan signal")
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Time the signal was captured")
    source_type: Literal["voice", "app_tap", "AR", "social"] = Field(..., description="The input source of the signal")
    location_zone: str = Field(..., description="Stadium zone location (e.g., Zone A, Section 104)")
    raw_text: Optional[str] = Field(None, description="Raw transcription or text input from the fan")
    sentiment_score: float = Field(..., description="Polarity score from -1.0 (very negative) to 1.0 (very positive)")

class SignalCluster(BaseModel):
    id: str = Field(..., description="Unique identifier for the signal cluster")
    signal_ids: List[str] = Field(..., description="List of FanSignal IDs that belong to this cluster")
    zone: str = Field(..., description="Stadium zone where the signal cluster is centered")
    topic: str = Field(..., description="Identified topic/theme of the cluster (e.g., crowd congestion, temperature)")
    confidence_score: float = Field(..., description="Clustering algorithm confidence level (0.0 to 1.0)")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Time the cluster was created")

class AgentOpinion(BaseModel):
    agent_name: str = Field(..., description="Name of the GenAI agent giving the opinion")
    cluster_id: str = Field(..., description="ID of the SignalCluster being reviewed")
    recommendation: str = Field(..., description="Recommended course of action")
    reasoning: str = Field(..., description="Supporting logic for the recommendation")
    constraints: List[str] = Field(..., description="Operational constraints noted by the agent")

class Consensus(BaseModel):
    cluster_id: str = Field(..., description="ID of the SignalCluster being addressed")
    final_action: str = Field(..., description="Determined consensus action to execute")
    contributing_opinions: List[AgentOpinion] = Field(..., description="List of agent opinions reviewed to reach consensus")
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Time consensus was reached")
