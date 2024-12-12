import { newMockEvent } from "matchstick-as"
import { ethereum } from "@graphprotocol/graph-ts"
import { Pong } from "../generated/Contract/Contract"

export function createPongEvent(): Pong {
  let pongEvent = changetype<Pong>(newMockEvent())

  pongEvent.parameters = new Array()

  return pongEvent
}
