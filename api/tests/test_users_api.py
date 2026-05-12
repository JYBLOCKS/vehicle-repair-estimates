# pyrefly: ignore [missing-import]
import pytest
import uuid
# pyrefly: ignore [missing-import]
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_create_and_get_user():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        email = f"{uuid.uuid4().hex[:8]}@example.com"
        r = await ac.post("/users", json={"email": email, "name": "Jose Arredondo", "password": "password"})
        assert r.status_code == 201
        user = r.json()
        gid = user["id"]
        r2 = await ac.get(f"/users/{gid}")
        assert r2.status_code == 200
        assert r2.json()["email"] == email
