from app import app
from fastapi.testclient import TestClient

client = TestClient(app)

def test_app():
    response = client.get("/")
    assert response.status_code == 200

def test_app_message():
    response = client.get("/")
    assert response.json() == {"message": "Hello World"}