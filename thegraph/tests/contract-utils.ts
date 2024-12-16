import { newMockEvent } from "matchstick-as"
import { ethereum } from "@graphprotocol/graph-ts"
import { NewBet, Pong } from "../generated/Contract/Contract"

export function createNewBetEvent(bet: ethereum.Tuple): NewBet {
  let newBetEvent = changetype<NewBet>(newMockEvent())

  newBetEvent.parameters = new Array()

  newBetEvent.parameters.push(
    new ethereum.EventParam("bet", ethereum.Value.fromTuple(bet))
  )

  return newBetEvent
}

export function createPongEvent(): Pong {
  let pongEvent = changetype<Pong>(newMockEvent())

  pongEvent.parameters = new Array()

  return pongEvent
}
