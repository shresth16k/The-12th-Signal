import os
import sys
import pytest
from fastapi.testclient import TestClient

# Add backend directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from main import app

client = TestClient(app)

# --- 1. Payload validation tests (Oversized / Malformed) ---

def test_oversized_payload_rejected():
    """Asserts that oversized strings (longer than maximum length limits) are rejected with 422."""
    oversized_text = "A" * 2000  # max length is 1000
    payload = {
        "source_type": "voice",
        "location_zone": "Zone A",
        "raw_text": oversized_text,
        "sentiment_score": 0.5
    }
    response = client.post("/api/signals", json=payload)
    assert response.status_code == 422

def test_malformed_payload_extra_fields():
    """Asserts that payloads with unexpected extra fields are rejected with 422."""
    payload = {
        "source_type": "voice",
        "location_zone": "Zone A",
        "raw_text": "Help needed",
        "sentiment_score": 0.5,
        "extra_malicious_field": "attack-vector"  # ConfigDict(extra="forbid") should trigger 422
    }
    response = client.post("/api/signals", json=payload)
    assert response.status_code == 422

def test_invalid_enum_source_type():
    """Asserts that invalid source_type values are rejected with 422."""
    payload = {
        "source_type": "telepathy",  # not in the Enum
        "location_zone": "Zone A",
        "raw_text": "Help needed",
        "sentiment_score": 0.5
    }
    response = client.post("/api/signals", json=payload)
    assert response.status_code == 422

def test_invalid_enum_language():
    """Asserts that invalid language values in FanProfile are rejected with 422."""
    payload = {
        "id": "fan_1",
        "language": "klingon",  # not in the LanguageEnum
        "seat_zone": "Section 104"
    }
    response = client.post("/api/day-plan", json=payload)
    assert response.status_code == 422


# --- 2. Rate limiting tests ---

def test_rate_limiting_signals():
    """Asserts that rate limiting kicks in after the configured threshold (20 requests/minute)."""
    # Make 20 requests (which should succeed or be accepted depending on state)
    # Then the 21st request should trigger a 429 Too Many Requests.
    status_codes = []
    payload = {
        "source_type": "voice",
        "location_zone": "Zone A",
        "raw_text": "Quick signal",
        "sentiment_score": 0.0
    }
    
    for _ in range(30):
        res = client.post("/api/signals", json=payload)
        status_codes.append(res.status_code)
        
    assert 429 in status_codes


# --- 3. Authentication tests on Admin Action endpoints ---

def test_admin_action_endpoints_reject_unauthenticated():
    """Asserts that admin action endpoints reject requests without a valid auth token."""
    # Enable auth check bypass override
    os.environ["DISABLE_TEST_AUTH_BYPASS"] = "1"
    try:
        endpoints = [
            "/api/actions/announcement",
            "/api/actions/deploy-staff",
            "/api/actions/emergency-protocol",
            "/api/actions/view-cameras"
        ]
        for endpoint in endpoints:
            # 1. No token provided
            res = client.post(endpoint)
            assert res.status_code == 401
            
            # 2. Invalid token provided
            res2 = client.post(endpoint, headers={"X-Ops-Token": "bad-token-123"})
            assert res2.status_code == 401
            
            # 3. Valid token succeeds
            res3 = client.post(endpoint, headers={"X-Ops-Token": "ops-secure-token-2026"})
            assert res3.status_code == 200
    finally:
        # Restore default bypass behavior for other tests
        if "DISABLE_TEST_AUTH_BYPASS" in os.environ:
            del os.environ["DISABLE_TEST_AUTH_BYPASS"]
