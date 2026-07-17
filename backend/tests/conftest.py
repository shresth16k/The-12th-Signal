import pytest
from main import app, verify_ops_token

@pytest.fixture
def bypass_ops_auth():
    """Fixture to bypass the operations security token check in FastAPI endpoints."""
    app.dependency_overrides[verify_ops_token] = lambda: None
    yield
    app.dependency_overrides.pop(verify_ops_token, None)
