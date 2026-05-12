# pyrefly: ignore [missing-import]
from pydantic import BaseModel, Field, EmailStr, ConfigDict
# pyrefly: ignore [missing-import]
from decimal import Decimal
from typing import Optional
from uuid import UUID


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)
