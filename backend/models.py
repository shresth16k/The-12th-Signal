from datetime import datetime, timezone
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict

class SourceTypeEnum(str, Enum):
    voice = "voice"
    app_tap = "app_tap"
    AR = "AR"
    social = "social"

class LanguageEnum(str, Enum):
    en = "en"
    es = "es"
    fr = "fr"
    de = "de"
    ja = "ja"
    zh = "zh"
    pt = "pt"
    ar = "ar"
    hi = "hi"
    English = "English"
    Spanish = "Spanish"
    French = "French"
    German = "German"

class FanSignal(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(..., max_length=100, description="Unique identifier for the fan signal")
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Time the signal was captured")
    source_type: SourceTypeEnum = Field(..., description="The input source of the signal")
    location_zone: str = Field(..., max_length=100, description="Stadium zone location (e.g., Zone A, Section 104)")
    raw_text: Optional[str] = Field(None, max_length=1000, description="Raw transcription or text input from the fan")
    sentiment_score: float = Field(..., ge=-1.0, le=1.0, description="Polarity score from -1.0 (very negative) to 1.0 (very positive)")

class SignalCluster(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(..., max_length=100, description="Unique identifier for the signal cluster")
    signal_ids: List[str] = Field(..., description="List of FanSignal IDs that belong to this cluster")
    zone: str = Field(..., max_length=100, description="Stadium zone where the signal cluster is centered")
    topic: str = Field(..., max_length=200, description="Identified topic/theme of the cluster (e.g., crowd congestion, temperature)")
    confidence_score: float = Field(..., ge=0.0, le=1.0, description="Clustering algorithm confidence level (0.0 to 1.0)")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Time the cluster was created")

class AgentOpinion(BaseModel):
    model_config = ConfigDict(extra="forbid")

    agent_name: str = Field(..., max_length=100, description="Name of the GenAI agent giving the opinion")
    cluster_id: str = Field(..., max_length=100, description="ID of the SignalCluster being reviewed")
    recommendation: str = Field(..., max_length=2000, description="Recommended course of action")
    reasoning: str = Field(..., max_length=4000, description="Supporting logic for the recommendation")
    constraints: List[str] = Field(..., description="Operational constraints noted by the agent")

class Consensus(BaseModel):
    model_config = ConfigDict(extra="forbid")

    cluster_id: str = Field(..., max_length=100, description="ID of the SignalCluster being addressed")
    final_action: str = Field(..., max_length=4000, description="Determined consensus action to execute")
    contributing_opinions: List[AgentOpinion] = Field(..., description="List of agent opinions reviewed to reach consensus")
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc), description="Time consensus was reached")

class FanProfile(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str = Field(..., max_length=100, description="Unique identifier for the fan profile")
    language: LanguageEnum = Field(..., description="Preferred language of the fan")
    mobility_needs: Optional[str] = Field(None, max_length=500, description="Accessibility or mobility needs (e.g. wheelchair access)")
    seat_zone: str = Field(..., max_length=100, description="Stadium zone / seat section location (e.g., Section 104)")
    food_preferences: List[str] = Field(default_factory=list, description="Food restrictions or preferences (e.g. vegetarian, halal)")
    arrival_time: Optional[datetime] = Field(None, description="Expected or actual arrival time at the stadium")
