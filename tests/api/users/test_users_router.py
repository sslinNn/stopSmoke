# import pytest
# from fastapi.testclient import TestClient
# import io
#
# def test_upload_avatar(client: TestClient, auth_headers):
#     # Создаем тестовый файл
#     file_content = io.BytesIO(b"fake image content")
#     files = {"file": ("test.jpg", file_content, "image/jpeg")}
#
#     response = client.post(
#         "/api/users/update/avatar",
#         files=files,
#         headers=auth_headers
#     )
#
#     assert response.status_code == 200
#     assert "avatar_url" in response.json()