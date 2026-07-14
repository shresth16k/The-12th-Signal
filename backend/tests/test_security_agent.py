import os
import sys
import json
from datetime import datetime, timezone
import pytest
from unittest.mock import patch, MagicMock

# Add paths to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'agents')))

from models import SignalCluster, FanSignal, AgentOpinion
from agents.security_agent import get_security_opinion

def get_sample_cluster():
    """Return a sample SignalCluster for testing."""
    return SignalCluster(
        id="clus_test_security",
        signal_ids=["sig_1", "sig_2"],
        zone="Zone C",
        topic="Major Restroom Flooding",
        confidence_score=0.97,
        created_at=datetime.now(timezone.utc)
    )

def get_sample_signals():
    """Return sample FanSignals corresponding to the cluster."""
    return [
        FanSignal(
            id="sig_1",
            source_type="social",
            location_zone="Zone C",
            raw_text="Restroom in Zone C is flooded, water is leaking into the concourse.",
            sentiment_score=-0.89,
            timestamp=datetime.now(timezone.utc)
        ),
        FanSignal(
            id="sig_2",
            source_type="voice",
            location_zone="Zone C",
            raw_text="Huge puddle outside the washrooms in Zone C.",
            sentiment_score=-0.75,
            timestamp=datetime.now(timezone.utc)
        )
    ]

@patch('agents.security_agent.Anthropic')
def test_get_security_opinion_success(mock_anthropic_class):
    """Test get_security_opinion returns a valid AgentOpinion when the Anthropic API call succeeds."""
    # Ensure the API key check is bypassed
    os.environ["ANTHROPIC_API_KEY"] = "mock_key_for_testing"
    
    cluster = get_sample_cluster()
    signals = get_sample_signals()
    
    # Mock Anthropic Client and response
    mock_client = MagicMock()
    mock_response = MagicMock()
    mock_block = MagicMock()
    
    claude_json_response = {
        "recommendation": "Deploy security marshals to redirect pedestrian flow from Zone C main corridor to the outer gates.",
        "reasoning": "The water leak has created slippage hazards and crowd bottlenecks, compromising emergency evacuation routes.",
        "constraints": [
            "Keep emergency route 4 completely clear.",
            "Deploy wet floor warning signs.",
            "Coordinate redirection with medical first aid responders."
        ]
    }
    
    mock_block.text = json.dumps(claude_json_response)
    mock_response.content = [mock_block]
    mock_client.messages.create.return_value = mock_response
    mock_anthropic_class.return_value = mock_client
    
    # Execute the agent function
    opinion = get_security_opinion(cluster, signals)
    
    # Assertions
    assert isinstance(opinion, AgentOpinion)
    assert opinion.agent_name == "SecurityAgent"
    assert opinion.cluster_id == cluster.id
    assert opinion.recommendation == claude_json_response["recommendation"]
    assert opinion.reasoning == claude_json_response["reasoning"]
    assert opinion.constraints == claude_json_response["constraints"]
    
    # Verify Claude was called with the correct prompt elements
    mock_client.messages.create.assert_called_once()
    call_kwargs = mock_client.messages.create.call_args[1]
    prompt = call_kwargs["messages"][0]["content"]
    assert cluster.id in prompt
    assert cluster.zone in prompt
    assert "Restroom in Zone C is flooded" in prompt

def test_get_security_opinion_missing_api_key():
    """Test get_security_opinion returns the fallback stub opinion if ANTHROPIC_API_KEY is not set."""
    # Temporarily remove key
    old_key = os.environ.get("ANTHROPIC_API_KEY")
    if "ANTHROPIC_API_KEY" in os.environ:
        del os.environ["ANTHROPIC_API_KEY"]
        
    try:
        cluster = get_sample_cluster()
        opinion = get_security_opinion(cluster)
        
        assert isinstance(opinion, AgentOpinion)
        assert opinion.agent_name == "SecurityAgent"
        assert opinion.cluster_id == cluster.id
        assert "stub opinion" in opinion.recommendation or "Dispatch" in opinion.recommendation
        assert "missing API key" in opinion.reasoning or "stub" in opinion.reasoning.lower()
        assert len(opinion.constraints) > 0
    finally:
        if old_key:
            os.environ["ANTHROPIC_API_KEY"] = old_key

@patch('agents.security_agent.Anthropic')
def test_get_security_opinion_api_error_fallback(mock_anthropic_class):
    """Test get_security_opinion falls back to a safe default AgentOpinion if an API exception occurs."""
    os.environ["ANTHROPIC_API_KEY"] = "mock_key_for_testing"
    
    cluster = get_sample_cluster()
    
    # Force the API call to throw an exception
    mock_client = MagicMock()
    mock_client.messages.create.side_effect = Exception("Anthropic API rate limit exceeded")
    mock_anthropic_class.return_value = mock_client
    
    opinion = get_security_opinion(cluster)
    
    assert isinstance(opinion, AgentOpinion)
    assert opinion.agent_name == "SecurityAgent"
    assert opinion.cluster_id == cluster.id
    assert "Inspect the zone" in opinion.recommendation or "Dispatch" in opinion.recommendation
    assert "failed due to exception" in opinion.reasoning
    assert "Maintain contact with lead stadium commander" in opinion.constraints
