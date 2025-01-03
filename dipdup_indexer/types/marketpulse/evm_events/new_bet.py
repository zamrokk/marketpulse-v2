# generated by DipDup 8.1.2

from __future__ import annotations

from typing import Any, Dict

from pydantic import BaseModel, ConfigDict


class NewBetPayload(BaseModel):
    model_config = ConfigDict(
        extra='forbid',
    )
    bet: Dict[str, Any]
