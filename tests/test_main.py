import os
import sys

from starlette.testclient import TestClient

from app import app

test_client = TestClient(app)
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

def test_get_user():
    response = test_client.get('routers/users/me')
    return response.status_code


def test_500():
    assert test_get_user() == 500

def test_200():
    assert test_get_user() == 200


