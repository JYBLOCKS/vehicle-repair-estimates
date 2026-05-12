from app.models.estimate import Estimate
from uuid import UUID
from app.repositories.estimate_base import EstimateRepository
from app.schemas.estimate import (
    EstimateCreate,
    EstimateUpdate,
    EstimateOut,
)


class EstimateService:
    def __init__(self, repo: EstimateRepository):
        self.repo = repo

    async def create(self, dto: EstimateCreate, created_by_id: UUID | None = None) -> EstimateOut:
        payload = dto.model_dump(exclude_unset=True)
        if created_by_id:
            payload["created_by_id"] = created_by_id
        est = await self.repo.create(**payload)
        return EstimateOut.model_validate(est)

    async def get(self, estimate_id: UUID) -> EstimateOut:
        est = await self.repo.get_by_id(estimate_id)
        if not est:
            raise LookupError("estimate_not_found")
        return EstimateOut.model_validate(est)

    async def list(self, limit: int = 50, offset: int = 0, status: str | None = None) -> list[EstimateOut]:
        items = await self.repo.list(limit, offset, status)
        return [EstimateOut.model_validate(e) for e in items]

    async def update(self, estimate_id: UUID, data: dict):
        estimate = await self.repo.update(estimate_id, **data)
        if estimate is None:
            raise LookupError("estimate_not_found")
        return estimate

    async def delete(self, estimate_id: UUID) -> None:
        await self.repo.delete(estimate_id)
