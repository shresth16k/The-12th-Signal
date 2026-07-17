import os
import sys
from datetime import datetime, timezone
from unittest.mock import patch

import pytest
from fastapi.testclient import TestClient

# Add path to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from agents.rumor_agent import RumorAlert
from main import app, clusters_db, rumors_history, signals_db
from models import AgentOpinion, Consensus, SignalCluster

# Initialize the TestClient
client = TestClient(app)


@pytest.fixture(autouse=True)
def clean_databases():
    """Fixture to reset in-memory databases before each test."""
    signals_db.clear()
    clusters_db.clear()
    # Keep only the original mock rumor to match default state
    rumors_history.clear()
    rumors_history.append(
        RumorAlert(
            cluster_id="mock_rumor_1",
            suspected_claim="Evacuation panic warning flagged in Zone C.",
            suggested_correction="Factual Correction: Stadium security has verified that there is no active hazard in Zone C.",
        )
    )
    yield


# --- GET / Root Endpoint ---


def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "OK"
    assert "Backend API is running" in data["message"]
    assert data["ingested_signals_count"] == 0


# --- POST /api/signals ---


def test_create_signal_valid():
    payload = {
        "source_type": "voice",
        "location_zone": "Zone A",
        "raw_text": "Need directions to concession stand",
        "sentiment_score": 0.1,
    }
    response = client.post("/api/signals", json=payload)
    assert response.status_code == 201

    data = response.json()
    assert data["id"].startswith("sig_")
    assert data["source_type"] == "voice"
    assert data["location_zone"] == "Zone A"
    assert data["raw_text"] == "Need directions to concession stand"
    assert data["sentiment_score"] == 0.1
    assert "timestamp" in data

    # Verify it was added to the database
    assert len(signals_db) == 1
    assert signals_db[0].id == data["id"]


def test_create_signal_invalid_payload():
    # Missing location_zone and invalid source_type literal
    payload = {"source_type": "invalid_source", "sentiment_score": 0.5}
    response = client.post("/api/signals", json=payload)
    assert response.status_code == 422  # Unprocessable Entity

    # Missing required sentiment_score and wrong type
    payload = {"source_type": "voice", "location_zone": "Zone B", "sentiment_score": "not-a-number"}
    response = client.post("/api/signals", json=payload)
    assert response.status_code == 422


# --- GET /api/clusters ---


@patch("main.cluster_signals")
def test_get_clusters(mock_cluster_signals):
    # Mock cluster signals response
    mock_cluster = SignalCluster(
        id="clus_123",
        signal_ids=["sig_1"],
        zone="Zone C",
        topic="Concessions Outage",
        confidence_score=0.9,
        created_at=datetime.now(timezone.utc),
    )
    mock_cluster_signals.return_value = [mock_cluster]

    response = client.get("/api/clusters")
    assert response.status_code == 200

    data = response.json()
    assert len(data) == 1
    assert data[0]["id"] == "clus_123"
    assert data[0]["zone"] == "Zone C"
    assert data[0]["topic"] == "Concessions Outage"

    # Check that main module db is updated
    assert len(clusters_db) == 1
    assert clusters_db[0].id == "clus_123"


# --- POST /api/negotiate ---


@patch("main.negotiate")
def test_post_negotiate_valid(mock_negotiate):
    # Seed a cluster in main.clusters_db to be found
    mock_cluster = SignalCluster(
        id="clus_find_me",
        signal_ids=["sig_1"],
        zone="Zone C",
        topic="Water Leak",
        confidence_score=0.95,
        created_at=datetime.now(timezone.utc),
    )
    clusters_db.append(mock_cluster)

    # Mock negotiate return Consensus
    mock_opinion = AgentOpinion(
        agent_name="SecurityAgent",
        cluster_id="clus_find_me",
        recommendation="Action",
        reasoning="Reasoning",
        constraints=[],
    )
    mock_consensus = Consensus(
        cluster_id="clus_find_me",
        final_action="Synthesized Plan",
        contributing_opinions=[mock_opinion],
        timestamp=datetime.now(timezone.utc),
    )
    mock_negotiate.return_value = mock_consensus

    payload = {"cluster_id": "clus_find_me"}
    response = client.post("/api/negotiate", json=payload)
    assert response.status_code == 200

    data = response.json()
    assert data["cluster_id"] == "clus_find_me"
    assert data["final_action"] == "Synthesized Plan"
    assert len(data["contributing_opinions"]) == 1
    assert data["contributing_opinions"][0]["agent_name"] == "SecurityAgent"


def test_post_negotiate_not_found():
    payload = {"cluster_id": "clus_non_existent"}
    response = client.post("/api/negotiate", json=payload)
    assert response.status_code == 404
    assert response.json()["error"] == "Cluster with ID clus_non_existent not found"


def test_post_negotiate_invalid_payload():
    payload = {"wrong_key": "some-id"}
    response = client.post("/api/negotiate", json=payload)
    assert response.status_code == 422


# --- POST /api/day-plan ---


@patch("main.get_day_plan")
def test_post_day_plan_valid(mock_get_day_plan):
    mock_get_day_plan.return_value = "Here is your personalized operations/game day guide."

    payload = {
        "id": "fan_1",
        "language": "en",
        "seat_zone": "Section 104",
        "food_preferences": ["halal"],
        "mobility_needs": "wheelchair",
    }
    response = client.post("/api/day-plan", json=payload)
    assert response.status_code == 200

    data = response.json()
    assert data["plan"] == "Here is your personalized operations/game day guide."


def test_post_day_plan_invalid_payload():
    payload = {
        "id": "fan_1",
        "language": "en",
        # Missing required seat_zone
    }
    response = client.post("/api/day-plan", json=payload)
    assert response.status_code == 422


# --- GET /api/rumors ---


@patch("main.detect_rumor")
@patch("main.cluster_signals")
def test_get_rumors(mock_cluster_signals, mock_detect_rumor):
    # Seed active cluster
    mock_cluster = SignalCluster(
        id="clus_rumor_active",
        signal_ids=["sig_1"],
        zone="Zone B",
        topic="Panic reports",
        confidence_score=0.9,
        created_at=datetime.now(timezone.utc),
    )
    mock_cluster_signals.return_value = [mock_cluster]

    # Mock rumor agent to trigger
    mock_detect_rumor.return_value = RumorAlert(
        cluster_id="clus_rumor_active", suspected_claim="False fire report.", suggested_correction="No fire detected."
    )

    response = client.get("/api/rumors")
    assert response.status_code == 200

    data = response.json()
    # Should include default seeded rumor and the newly detected rumor
    assert len(data) == 2
    assert data[0]["cluster_id"] == "mock_rumor_1"
    assert data[1]["cluster_id"] == "clus_rumor_active"
    assert data[1]["suspected_claim"] == "False fire report."


# --- POST /api/actions/* Action Endpoints ---


def test_action_endpoints(bypass_ops_auth):
    endpoints = [
        "/api/actions/announcement",
        "/api/actions/deploy-staff",
        "/api/actions/emergency-protocol",
        "/api/actions/view-cameras",
    ]

    for endpoint in endpoints:
        response = client.post(endpoint)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert len(data["message"]) > 0
