import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import {} from "@graphprotocol/graph-ts"
import { NewBet } from "../generated/schema"
import { NewBet as NewBetEvent } from "../generated/Marketpulse/Marketpulse"
import { handleNewBet } from "../src/marketpulse"
import { createNewBetEvent } from "./marketpulse-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/developer/matchstick/#tests-structure-0-5-0

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let bet = "ethereum.Tuple Not implemented"
    let newNewBetEvent = createNewBetEvent(bet)
    handleNewBet(newNewBetEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/developer/matchstick/#write-a-unit-test

  test("NewBet created and stored", () => {
    assert.entityCount("NewBet", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function
    assert.fieldEquals(
      "NewBet",
      "0xa16081f360e3847006db660bae1c6d1b2e17ec2a-1",
      "bet",
      "ethereum.Tuple Not implemented"
    )

    // More assert options:
    // https://thegraph.com/docs/en/developer/matchstick/#asserts
  })
})
