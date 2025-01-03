// SPDX-License-Identifier: Apache-2.0

// Auto-generated

import assert from "assert";
import {
  AddressToStringTransaction,
  BetTransaction,
  PingTransaction,
  ResolveResultTransaction,
  NewBetLog,
  PongLog,
} from "../types/abi-interfaces/Marketpulse";
import { Bet } from "../types";

export async function handleAddressToStringMarketpulseTx(
  tx: AddressToStringTransaction
): Promise<void> {
  // Place your code logic here
}

export async function handleBetMarketpulseTx(
  tx: BetTransaction
): Promise<void> {
  // Place your code logic here
}

export async function handlePingMarketpulseTx(
  tx: PingTransaction
): Promise<void> {
  // Place your code logic here
}

export async function handleResolveResultMarketpulseTx(
  tx: ResolveResultTransaction
): Promise<void> {
  // Place your code logic here
}

export async function handleNewBetMarketpulseLog(
  log: NewBetLog
): Promise<void> {
  logger.info("New Bet at block " + log.blockNumber.toString());

  assert(log.args, "Require args on the logs");

  const bet = Bet.create({
    id: log.args.bet.id.toHexString()!,
    owner: log.args.bet.owner,
    amount: log.args.bet.amount.toBigInt(),
    option: log.args.bet.option,
  });

  await bet.save();
}

export async function handlePongMarketpulseLog(log: PongLog): Promise<void> {
  // Place your code logic here
}
