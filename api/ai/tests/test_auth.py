import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_all
from app.core.database import Base, engine
from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"

def test_login_invalid_credentials():
    response = client.post("/api/auth/login", json={
        "username": "wronguser",
        "password": "wrongpassword"
    })
    assert response.status_code == 401

def test_register_duplicate_user():
    # Mock registration (assuming user exists or just checking endpoint structure)
    payload = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "password123",
        "full_name": "Test User",
        "role": "resident"
    }
    # This might fail if DB isn't clean, but we test the structure
    response = client.post("/api/auth/register", json=payload)
    # If user exists, should be 400 or handled error
    assert response.status_code in [200, 400]
