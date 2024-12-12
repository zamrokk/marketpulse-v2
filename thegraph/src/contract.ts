import { Pong as PongEvent } from "../generated/Contract/Contract"
import { Pong } from "../generated/schema"

export function handlePong(event: PongEvent): void {
  let entity = new Pong(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
