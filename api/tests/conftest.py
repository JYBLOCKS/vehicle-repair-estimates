from app.core.db import Base, engine

# pyrefly: ignore [missing-import]
import pytest_asyncio


@pytest_asyncio.fixture(autouse=True)
async def _prepare_database():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    try:
        yield
    finally:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
