from dipdup.context import HandlerContext
from dipdup.models.evm import EvmEvent
from dipdup_indexer import models as models
from dipdup_indexer.types.marketpulse.evm_events.new_bet import NewBetPayload
from tortoise.exceptions import DoesNotExist


async def on_newbet(
    ctx: HandlerContext,
    event: EvmEvent[NewBetPayload],
) -> None:
    try:
        bet = await models.Bet.cached_get(pk=event.payload.id)
    except DoesNotExist:
        bet = models.Bet(
            id=event.payload.id,
            owner=event.payload.owner,
            option=event.payload.option,
            amount=event.payload.amount
        )
        bet.cache()
    await bet.save()
