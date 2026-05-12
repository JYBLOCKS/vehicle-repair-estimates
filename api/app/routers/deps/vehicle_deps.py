# pyrefly: ignore [missing-import]
from fastapi import Depends
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.db import get_session
from app.repositories.vehicle_repo import SqlAlchemyVehicleRepository
from app.services.vehicle_service import VehicleService


def get_vehicle_service(db: AsyncSession = Depends(get_session)) -> VehicleService:
    repo = SqlAlchemyVehicleRepository(db)
    return VehicleService(repo)
