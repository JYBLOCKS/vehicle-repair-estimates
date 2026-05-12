from uuid import UUID
# pyrefly: ignore [missing-import]
from sqlalchemy import select, update, delete
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import selectinload
# pyrefly: ignore [missing-import]
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.estimate import Estimate, EstimateItem


class SqlAlchemyEstimateRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, **data) -> Estimate:
        items_data = data.pop("items", [])
        estimate = Estimate(**data)
        self.session.add(estimate)
        await self.session.flush()
        for item in items_data:
            self.session.add(EstimateItem(estimate_id=estimate.id, **item))
        await self.session.commit()
        # Return with items eagerly loaded to avoid async lazy-load issues
        res = await self.session.execute(
            select(Estimate)
            .options(selectinload(Estimate.items))
            .where(Estimate.id == estimate.id)
        )
        return res.scalar_one()

    async def get_by_id(self, estimate_id: UUID) -> Estimate | None:
        res = await self.session.execute(
            select(Estimate)
            .options(selectinload(Estimate.items))
            .where(Estimate.id == estimate_id)
        )
        return res.scalar_one_or_none()

    async def list(
        self,
        limit: int = 50,
        offset: int = 0,
        status: str | None = None,
    ) -> list[Estimate]:
        stmt = (
            select(Estimate)
            .options(selectinload(Estimate.items))
            .offset(offset)
            .limit(limit)
            .where(Estimate.status == status if status else True)
        )
        res = await self.session.execute(stmt)
        return list(res.scalars())

    async def update(self, estimate_id: UUID, **data) -> Estimate | None:
        items_data = data.pop("items", None)

        if data:
            await self.session.execute(
                update(Estimate)
                .where(Estimate.id == estimate_id)
                .values(**data)
            )

        if items_data is not None:
            existing_res = await self.session.execute(
                select(EstimateItem).where(
                    EstimateItem.estimate_id == estimate_id
                )
            )

            existing_items = {
                str(item.id): item
                for item in existing_res.scalars().all()
            }

            incoming_ids = set()

            for raw_item in items_data:
                item_data = dict(raw_item)
                item_id = item_data.pop("id", None)

                if item_id:
                    item_id = str(item_id)

                if item_id and item_id in existing_items:
                    incoming_ids.add(item_id)

                    await self.session.execute(
                        update(EstimateItem)
                        .where(EstimateItem.id == UUID(item_id))
                        .where(EstimateItem.estimate_id == estimate_id)
                        .values(**item_data)
                    )
                else:
                    new_item = EstimateItem(
                        estimate_id=estimate_id,
                        **item_data,
                    )

                    self.session.add(new_item)
                    await self.session.flush()

                    incoming_ids.add(str(new_item.id))

            items_to_delete = [
                UUID(item_id)
                for item_id in existing_items.keys()
                if item_id not in incoming_ids
            ]

            if items_to_delete:
                await self.session.execute(
                    delete(EstimateItem).where(
                        EstimateItem.id.in_(items_to_delete)
                    )
                )

        await self.session.commit()

        return await self.get_by_id(estimate_id)

    async def delete(self, estimate_id: UUID) -> None:
        await self.session.execute(delete(EstimateItem).where(EstimateItem.estimate_id == estimate_id))
        await self.session.execute(delete(Estimate).where(Estimate.id == estimate_id))
        await self.session.commit()
