# pyrefly: ignore [missing-import]
from fastapi import Depends
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_session
from app.repositories.user_repo import SqlAlchemyUserRepository
from app.services.user_service import UserService


def get_user_service(
    db: AsyncSession = Depends(get_session),
) -> UserService:
    repo = SqlAlchemyUserRepository(db)
    return UserService(repo)
