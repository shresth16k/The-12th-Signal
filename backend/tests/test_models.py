import os
import sys
from datetime import datetime, timezone
import pytest
from pydantic import ValidationError

# Add backend directory to path to support importing models
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from models import FanSignal, SignalCluster, AgentOpinion, Consensus, FanProfile

# --- FanSignal Model Tests ---

def test_fan_signal_valid():
    """Test that FanSignal instantiates correctly with valid data."""
    data = {
        "id": "sig_1234",
        "source_type": "voice",
        "location_zone": "Zone A",
        "raw_text": "Need assistance in Zone A",
        "sentiment_score": -0.8
    }
    signal = FanSignal(**data)
    assert signal.id == "sig_1234"
    assert signal.source_type == "voice"
    assert signal.location_zone == "Zone A"
    assert signal.raw_text == "Need assistance in Zone A"
    assert signal.sentiment_score == -0.8
    assert isinstance(signal.timestamp, datetime)

def test_fan_signal_invalid_source_type():
    """Test that FanSignal rejects an invalid source_type value."""
    data = {
        "id": "sig_1234",
        "source_type": "invalid_source",  # literal check should fail
        "location_zone": "Zone A",
        "sentiment_score": -0.8
    }
    with pytest.raises(ValidationError) as excinfo:
        FanSignal(**data)
    assert "source_type" in str(excinfo.value)

def test_fan_signal_missing_required():
    """Test that FanSignal rejects missing required fields."""
    # Missing location_zone and sentiment_score
    data = {
        "id": "sig_1234",
        "source_type": "voice"
    }
    with pytest.raises(ValidationError) as excinfo:
        FanSignal(**data)
    assert "location_zone" in str(excinfo.value)
    assert "sentiment_score" in str(excinfo.value)

def test_fan_signal_invalid_types():
    """Test that FanSignal rejects incorrect types."""
    data = {
        "id": "sig_1234",
        "source_type": "voice",
        "location_zone": "Zone A",
        "sentiment_score": "not-a-float"  # invalid type
    }
    with pytest.raises(ValidationError) as excinfo:
        FanSignal(**data)
    assert "sentiment_score" in str(excinfo.value)


# --- SignalCluster Model Tests ---

def test_signal_cluster_valid():
    """Test that SignalCluster instantiates correctly with valid data."""
    data = {
        "id": "clus_5678",
        "signal_ids": ["sig_1", "sig_2"],
        "zone": "Zone C",
        "topic": "Water leak in restroom",
        "confidence_score": 0.95
    }
    cluster = SignalCluster(**data)
    assert cluster.id == "clus_5678"
    assert cluster.signal_ids == ["sig_1", "sig_2"]
    assert cluster.zone == "Zone C"
    assert cluster.topic == "Water leak in restroom"
    assert cluster.confidence_score == 0.95
    assert isinstance(cluster.created_at, datetime)

def test_signal_cluster_missing_required():
    """Test that SignalCluster rejects missing required fields."""
    data = {
        "id": "clus_5678",
        "zone": "Zone C"
    }
    with pytest.raises(ValidationError) as excinfo:
        SignalCluster(**data)
    assert "signal_ids" in str(excinfo.value)
    assert "topic" in str(excinfo.value)
    assert "confidence_score" in str(excinfo.value)

def test_signal_cluster_invalid_types():
    """Test that SignalCluster rejects incorrect type formats."""
    data = {
        "id": "clus_5678",
        "signal_ids": "not-a-list",  # invalid type
        "zone": "Zone C",
        "topic": "Water leak",
        "confidence_score": "invalid-float"
    }
    with pytest.raises(ValidationError) as excinfo:
        SignalCluster(**data)
    assert "signal_ids" in str(excinfo.value)
    assert "confidence_score" in str(excinfo.value)


# --- AgentOpinion Model Tests ---

def test_agent_opinion_valid():
    """Test that AgentOpinion instantiates correctly with valid data."""
    data = {
        "agent_name": "SecurityAgent",
        "cluster_id": "clus_5678",
        "recommendation": "Deploy marshals",
        "reasoning": "High density bottleneck detected",
        "constraints": ["Keep route 4 clear", "Use barriers"]
    }
    opinion = AgentOpinion(**data)
    assert opinion.agent_name == "SecurityAgent"
    assert opinion.cluster_id == "clus_5678"
    assert opinion.recommendation == "Deploy marshals"
    assert opinion.reasoning == "High density bottleneck detected"
    assert opinion.constraints == ["Keep route 4 clear", "Use barriers"]

def test_agent_opinion_missing_required():
    """Test that AgentOpinion rejects missing required fields."""
    data = {
        "agent_name": "SecurityAgent",
        "recommendation": "Deploy marshals"
    }
    with pytest.raises(ValidationError) as excinfo:
        AgentOpinion(**data)
    assert "cluster_id" in str(excinfo.value)
    assert "reasoning" in str(excinfo.value)
    assert "constraints" in str(excinfo.value)

def test_agent_opinion_invalid_types():
    """Test that AgentOpinion rejects incorrect types."""
    data = {
        "agent_name": "SecurityAgent",
        "cluster_id": "clus_5678",
        "recommendation": "Deploy marshals",
        "reasoning": "High density",
        "constraints": "should-be-a-list"  # invalid type
    }
    with pytest.raises(ValidationError) as excinfo:
        AgentOpinion(**data)
    assert "constraints" in str(excinfo.value)


# --- Consensus Model Tests ---

def test_consensus_valid():
    """Test that Consensus instantiates correctly with valid nested opinions."""
    opinion_data = {
        "agent_name": "SecurityAgent",
        "cluster_id": "clus_5678",
        "recommendation": "Deploy marshals",
        "reasoning": "Bottleneck",
        "constraints": ["Keep route 4 clear"]
    }
    opinion = AgentOpinion(**opinion_data)

    data = {
        "cluster_id": "clus_5678",
        "final_action": "Shut off pipe and redirect traffic",
        "contributing_opinions": [opinion]
    }
    consensus = Consensus(**data)
    assert consensus.cluster_id == "clus_5678"
    assert consensus.final_action == "Shut off pipe and redirect traffic"
    assert len(consensus.contributing_opinions) == 1
    assert consensus.contributing_opinions[0].agent_name == "SecurityAgent"
    assert isinstance(consensus.timestamp, datetime)

def test_consensus_missing_required():
    """Test that Consensus rejects missing required fields."""
    data = {
        "cluster_id": "clus_5678"
    }
    with pytest.raises(ValidationError) as excinfo:
        Consensus(**data)
    assert "final_action" in str(excinfo.value)
    assert "contributing_opinions" in str(excinfo.value)

def test_consensus_invalid_nested_type():
    """Test that Consensus rejects invalid nested objects in contributing_opinions."""
    data = {
        "cluster_id": "clus_5678",
        "final_action": "Shut off pipe",
        "contributing_opinions": ["invalid-opinion-object"]  # expects AgentOpinion list
    }
    with pytest.raises(ValidationError) as excinfo:
        Consensus(**data)
    assert "contributing_opinions" in str(excinfo.value)


# --- FanProfile Model Tests ---

def test_fan_profile_valid():
    """Test that FanProfile instantiates correctly with valid data."""
    data = {
        "id": "fan_9999",
        "language": "es",
        "seat_zone": "Section 104"
    }
    profile = FanProfile(**data)
    assert profile.id == "fan_9999"
    assert profile.language == "es"
    assert profile.seat_zone == "Section 104"
    assert profile.mobility_needs is None
    assert profile.food_preferences == []  # default factory
    assert profile.arrival_time is None

def test_fan_profile_valid_full():
    """Test FanProfile with all fields provided, including defaults overridden."""
    arrival = datetime(2026, 7, 13, 17, 30, 0, tzinfo=timezone.utc)
    data = {
        "id": "fan_9999",
        "language": "es",
        "mobility_needs": "wheelchair",
        "seat_zone": "Section 104",
        "food_preferences": ["halal", "vegetarian"],
        "arrival_time": arrival
    }
    profile = FanProfile(**data)
    assert profile.mobility_needs == "wheelchair"
    assert profile.food_preferences == ["halal", "vegetarian"]
    assert profile.arrival_time == arrival

def test_fan_profile_missing_required():
    """Test that FanProfile rejects missing required fields."""
    data = {
        "id": "fan_9999"
    }
    with pytest.raises(ValidationError) as excinfo:
        FanProfile(**data)
    assert "language" in str(excinfo.value)
    assert "seat_zone" in str(excinfo.value)

def test_fan_profile_invalid_arrival_time():
    """Test that FanProfile rejects incorrect format for arrival_time."""
    data = {
        "id": "fan_9999",
        "language": "es",
        "seat_zone": "Section 104",
        "arrival_time": "not-a-datetime"  # expects datetime or ISO format string
    }
    with pytest.raises(ValidationError) as excinfo:
        FanProfile(**data)
    assert "arrival_time" in str(excinfo.value)
