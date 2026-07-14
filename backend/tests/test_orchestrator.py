import os
import sys
import json
from datetime import datetime, timezone
import pytest
from unittest.mock import patch, MagicMock

# Add paths to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from models import SignalCluster, AgentOpinion, Consensus
from orchestrator import negotiate

def get_sample_cluster():
    """Return a sample SignalCluster for testing."""
    return SignalCluster(
        id="clus_test_orchestration",
        signal_ids=["sig_1", "sig_2"],
        zone="Zone C",
        topic="Major Restroom Flooding",
        confidence_score=0.97,
        created_at=datetime.now(timezone.utc)
    )

def create_mock_opinion(agent_name, cluster_id):
    """Helper to create a standard mock AgentOpinion."""
    return AgentOpinion(
        agent_name=agent_name,
        cluster_id=cluster_id,
        recommendation=f"{agent_name} recommends action.",
        reasoning=f"{agent_name} logic justification.",
        constraints=[f"{agent_name} constraint 1"]
    )

@patch('orchestrator.detect_rumor')
@patch('orchestrator.get_security_opinion')
@patch('orchestrator.get_concessions_opinion')
@patch('orchestrator.get_medical_opinion')
@patch('orchestrator.get_transit_opinion')
@patch('orchestrator.get_broadcast_opinion')
@patch('orchestrator.Anthropic')
def test_negotiate_success(
    mock_anthropic_class,
    mock_get_broadcast,
    mock_get_transit,
    mock_get_medical,
    mock_get_concessions,
    mock_get_security,
    mock_detect_rumor
):
    """Test negotiate() calls all 5 agents and synthesizes a Consensus with final action and contributing opinions."""
    # Ensure ANTHROPIC_API_KEY check passes
    os.environ["ANTHROPIC_API_KEY"] = "mock_key_for_testing"
    
    cluster = get_sample_cluster()
    
    # 1. Mock rumor agent (no rumor detected)
    mock_detect_rumor.return_value = None
    
    # 2. Mock 5 agent opinions
    mock_get_security.return_value = create_mock_opinion("SecurityAgent", cluster.id)
    mock_get_concessions.return_value = create_mock_opinion("ConcessionsAgent", cluster.id)
    mock_get_medical.return_value = create_mock_opinion("MedicalAgent", cluster.id)
    mock_get_transit.return_value = create_mock_opinion("TransitAgent", cluster.id)
    mock_get_broadcast.return_value = create_mock_opinion("BroadcastAgent", cluster.id)
    
    # 3. Mock Anthropic Client response
    mock_client = MagicMock()
    mock_response = MagicMock()
    mock_block = MagicMock()
    
    claude_json_response = {
        "final_action": "Unified Plan: Dispatch plumbing, guide crowd away from Zone C, place medics, adjust media feeds."
    }
    
    mock_block.text = json.dumps(claude_json_response)
    mock_response.content = [mock_block]
    mock_client.messages.create.return_value = mock_response
    mock_anthropic_class.return_value = mock_client
    
    # 4. Execute orchestrator negotiation
    consensus = negotiate(cluster)
    
    # 5. Assertions
    assert isinstance(consensus, Consensus)
    assert consensus.cluster_id == cluster.id
    assert consensus.final_action == claude_json_response["final_action"]
    
    # Ensure all 5 opinions are captured in the contributing_opinions list
    assert len(consensus.contributing_opinions) == 5
    agent_names = [o.agent_name for o in consensus.contributing_opinions]
    assert "SecurityAgent" in agent_names
    assert "ConcessionsAgent" in agent_names
    assert "MedicalAgent" in agent_names
    assert "TransitAgent" in agent_names
    assert "BroadcastAgent" in agent_names
    
    # Check that rumor detection and agent functions were called
    mock_detect_rumor.assert_called_once_with(cluster, None)
    mock_get_security.assert_called_once_with(cluster, None)
    mock_get_concessions.assert_called_once_with(cluster, None)
    mock_get_medical.assert_called_once_with(cluster, None)
    mock_get_transit.assert_called_once_with(cluster, None)
    mock_get_broadcast.assert_called_once_with(cluster, None)
    
    # Check that Chief Operations prompt was generated and sent
    mock_client.messages.create.assert_called_once()
    call_kwargs = mock_client.messages.create.call_args[1]
    assert "Chief Operations Coordinator" in call_kwargs["messages"][0]["content"]

@patch('orchestrator.detect_rumor')
@patch('orchestrator.get_security_opinion')
@patch('orchestrator.get_concessions_opinion')
@patch('orchestrator.get_medical_opinion')
@patch('orchestrator.get_transit_opinion')
@patch('orchestrator.get_broadcast_opinion')
def test_negotiate_rumor_short_circuit(
    mock_get_broadcast,
    mock_get_transit,
    mock_get_medical,
    mock_get_concessions,
    mock_get_security,
    mock_detect_rumor
):
    """Test negotiate() short-circuits and immediately returns a correction consensus if a rumor is detected."""
    cluster = get_sample_cluster()
    
    # Mock rumor agent to trigger (returns alert description)
    mock_detect_rumor.return_value = "Alert: False alarm evacuation rumor in Zone C concourse."
    
    consensus = negotiate(cluster)
    
    assert isinstance(consensus, Consensus)
    assert consensus.cluster_id == cluster.id
    assert consensus.final_action == "push verified correction"
    assert consensus.contributing_opinions == []
    
    # Verify that agent opinion functions were NOT called since rumor short-circuited them
    mock_get_security.assert_not_called()
    mock_get_concessions.assert_not_called()
    mock_get_medical.assert_not_called()
    mock_get_transit.assert_not_called()
    mock_get_broadcast.assert_not_called()
