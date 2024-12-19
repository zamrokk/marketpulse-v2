import {
  EvmBatchProcessor,
  EvmBatchProcessorFields,
  BlockHeader,
  Log as _Log,
  Transaction as _Transaction,
} from "@subsquid/evm-processor";
import * as contractAbi from "./abi/Marketpulse";

export const processor = new EvmBatchProcessor()
  .setGateway("https://v2.archive.subsquid.io/network/etherlink-testnet")
  .setRpcEndpoint({ url: process.env.RPC_URL, rateLimit: 10 })
  .setFinalityConfirmation(75)
  .setFields({
    log: {
      topics: true,
      data: true,
      transactionHash: true,
    },
    transaction: {
      hash: true,
      input: true,
      from: true,
      value: true,
      status: true,
    },
  })
  .addLog({
    address: ["0x386dc5e8e0f8252880cfa9b9e607c749899bf13a"],
    topic0: [contractAbi.events["NewBet"].topic],
    range: {
      from: 16297152,
    },
  });

export type Fields = EvmBatchProcessorFields<typeof processor>;
export type Block = BlockHeader<Fields>;
export type Log = _Log<Fields>;
export type Transaction = _Transaction<Fields>;
