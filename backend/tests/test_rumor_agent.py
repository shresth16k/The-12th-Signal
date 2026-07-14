import os
import sys
import json
from datetime import datetime, timezone
import pytest
from unittest.mock import patch, MagicMock

# Add paths to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from models import SignalCluster, FanSignal, AgentOpinion, Consensus
from agents.rumor_agent import detect_rumor, RumorAlert
from orchestrator import negotiate

def get_sample_cluster(id_="clus_test_rumor", topic="Unverified Report"):
    """Return a sample SignalCluster for testing."""
    return SignalCluster(
        id=id_,
        signal_ids=["sig_panic_1"],
        zone="Zone B",
        topic=topic,
        confidence_score=0.90,
        created_at=datetime.now(timezone.utc)
    )

def get_panic_signals():
    """Return sample FanSignals with panic language."""
    return [
        FanSignal(
            id="sig_panic_1",
            source_type="social",
            location_zone="Zone B",
            raw_text="Bomb threat in Zone B! Evacuate immediately!",
            sentiment_score=-0.99,
            timestamp=datetime.now(timezone.utc)
        )
    ]

def get_normal_signals():
    """Return normal, non-panic FanSignals."""
    return [
        FanSignal(
            id="sig_panic_1",  # Reuse ID for cluster matching
            source_type="app_tap",
            location_zone="Zone B",
            raw_text="Restroom lock is broken in Zone B stall 3.",
            sentiment_score=-0.50,
            timestamp=datetime.now(timezone.utc)
        )
    ]

# --- detect_rumor Unit Tests ---

@patch('agents.rumor_agent.Anthropic')
def test_detect_rumor_flags_panic(mock_anthropic_class):
    """Test that detect_rumor flags a cluster containing panic-language contradicting verified status."""
    os.environ["ANTHROPIC_API_KEY"] = "mock_key_for_testing"
    
    cluster = get_sample_cluster()
    signals = get_panic_signals()
    
    mock_client = MagicMock()
    mock_response = MagicMock()
    mock_block = MagicMock()
    
    claude_json_response = {
        "suspected_claim": "Rumor of a bomb threat in Zone B.",
        "suggested_correction": "Factual Correction: Security has swept Zone B and verified there is no active threat. Please remain calm."
    }
    
    mock_block.text = json.dumps(claude_json_response)
    mock_response.content = [mock_block]
    mock_client.messages.create.return_value = mock_response
    mock_anthropic_class.return_value = mock_client
    
    # Run rumor detection
    alert = detect_rumor(cluster, signals)
    
    assert isinstance(alert, RumorAlert)
    assert alert.cluster_id == cluster.id
    assert alert.suspected_claim == claude_json_response["suspected_claim"]
    assert alert.suggested_correction == claude_json_response["suggested_correction"]
    
    # Check that Claude was called
    mock_client.messages.create.assert_called_once()

def test_detect_rumor_normal_cluster():
    """Test that detect_rumor returns None early for a normal cluster without calling the API."""
    os.environ["ANTHROPIC_API_KEY"] = "mock_key_for_testing"
    
    cluster = get_sample_cluster(topic="Restroom Maintenance")
    signals = get_normal_signals()
    
    # Run rumor detection
    # If the fast-check optimization works, it will return None immediately since no panic words exist
    with patch('agents.rumor_agent.Anthropic') as mock_anthropic:
        alert = detect_rumor(cluster, signals)
        assert alert is None
        mock_anthropic.assert_not_called()

@patch('agents.rumor_agent.Anthropic')
def test_detect_rumor_claude_returns_null(mock_anthropic_class):
    """Test that detect_rumor returns None if Claude decides it is a normal operational issue."""
    os.environ["ANTHROPIC_API_KEY"] = "mock_key_for_testing"
    
    cluster = get_sample_cluster()
    signals = get_panic_signals() # Has panic keyword to bypass fast-check
    
    mock_client = MagicMock()
    mock_response = MagicMock()
    mock_block = MagicMock()
    
    # Claude decides it's not a rumor
    mock_block.text = "null"
    mock_response.content = [mock_block]
    mock_client.messages.create.return_value = mock_response
    mock_anthropic_class.return_value = mock_client
    
    alert = detect_rumor(cluster, signals)
    assert alert is None

# --- negotiate Integration Tests ---

@patch('orchestrator.detect_rumor')
@patch('orchestrator.get_security_opinion')
def test_negotiate_short_circuits_on_rumor(mock_get_security, mock_detect_rumor):
    """Test that negotiate() short-circuits to correction consensus and bypasses agent flows if a rumor is detected."""
    cluster = get_sample_cluster()
    
    # Mock rumor agent to return a RumorAlert
    mock_detect_rumor.return_value = RumorAlert(
        cluster_id=cluster.id,
        suspected_claim="Active shooter rumor.",
        suggested_correction="Factual Correction: False alarm."
    )
    
    consensus = negotiate(cluster)
    
    assert isinstance(consensus, Consensus)
    assert consensus.cluster_id == cluster.id
    assert consensus.final_action == "push verified correction"
    assert consensus.contributing_opinions == []
    
    # Ensure agent functions were bypassed
    mock_get_security.assert_not_called()

@patch('orchestrator.detect_rumor')
@patch('orchestrator.get_security_opinion')
@patch('orchestrator.get_concessions_opinion')
@patch('orchestrator.get_medical_opinion')
@patch('orchestrator.get_transit_opinion')
@patch('orchestrator.get_broadcast_opinion')
@patch('orchestrator.Anthropic')
def test_negotiate_runs_full_flow_no_rumor(
    mock_anthropic_class,
    mock_get_broadcast,
    mock_get_transit,
    mock_get_medical,
    mock_get_concessions,
    mock_get_security,
    mock_detect_rumor
):
    """Test that negotiate() runs the full 5-agent flow when no rumor is detected."""
    os.environ["ANTHROPIC_API_KEY"] = "mock_key_for_testing"
    
    cluster = get_sample_cluster()
    
    # 1. No rumor detected
    mock_detect_rumor.return_value = None
    
    # 2. Return mock agent opinions
    mock_get_security.return_value = AgentOpinion(
        agent_name="SecurityAgent", cluster_id=cluster.id, recommendation="R1", reasoning="Re1", constraints=[]
    )
    mock_get_concessions.return_value = AgentOpinion(
        agent_name="ConcessionsAgent", cluster_id=cluster.id, recommendation="R2", reasoning="Re2", constraints=[]
    )
    mock_get_medical.return_value = AgentOpinion(
        agent_name="MedicalAgent", cluster_id=cluster.id, recommendation="R3", reasoning="Re3", constraints=[]
    )
    mock_get_transit.return_value = AgentOpinion(
        agent_name="TransitAgent", cluster_id=cluster.id, recommendation="R4", reasoning="Re4", constraints=[]
    )
    mock_get_broadcast.return_value = AgentOpinion(
        agent_name="BroadcastAgent", cluster_id=cluster.id, recommendation="R5", reasoning="Re5", constraints=[]
    )
    
    # 3. Mock Coordinator response
    mock_client = MagicMock()
    mock_response = MagicMock()
    mock_block = MagicMock()
    mock_block.text = json.dumps({"final_action": "Standard Action Plan"})
    mock_response.content = [mock_block]
    mock_client.messages.create.return_value = mock_response
    mock_anthropic_class.return_value = mock_client
    
    # Run negotiation
    consensus = negotiate(cluster)
    
    assert isinstance(consensus, Consensus)
    assert consensus.cluster_id == cluster.id
    assert consensus.final_action == "Standard Action Plan"
    assert len(consensus.contributing_opinions) == 5
    
    # Ensure all agent calls were made
    mock_get_security.assert_called_once()
    mock_get_concessions.assert_called_once()
    mock_get_medical.assert_called_once()
    mock_get_transit.assert_called_once()
    mock_get_broadcast.assert_called_once()
