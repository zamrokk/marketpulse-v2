import {
  NewBet as NewBetEvent,
  Pong as PongEvent
} from "../generated/Marketpulse/Marketpulse"
import { NewBet, Pong } from "../generated/schema"

export function handleNewBet(event: NewBetEvent): void {
  let entity = new NewBet(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.bet_id = event.params.bet.id
  entity.bet_owner = event.params.bet.owner
  entity.bet_option = event.params.bet.option
  entity.bet_amount = event.params.bet.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePong(event: PongEvent): void {
  let entity = new Pong(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
