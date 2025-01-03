import { EvmBatchProcessor } from "@subsquid/evm-processor";
import { TypeormDatabase } from "@subsquid/typeorm-store";
import * as MarketpulseAbi from "./abi/Marketpulse";
import { Bet } from "./model";

console.info("*** process.env.ETH_HTTP", process.env.ETH_HTTP);

const processor = new EvmBatchProcessor()
  .setGateway("https://v2.archive.subsquid.io/network/etherlink-testnet")
  .setRpcEndpoint({
    // set RPC endpoint in .env
    url: process.env.ETH_HTTP,
    rateLimit: 10,
  })
  .setFinalityConfirmation(75) // 15 mins to finality
  .addLog({
    address: ["0x386Dc5E8e0f8252880cFA9B9e607C749899bf13a"],
    topic0: [MarketpulseAbi.events.NewBet.topic],
  });

const db = new TypeormDatabase();

processor.run(db, async (ctx) => {
  const bets: Bet[] = [];
  for (let block of ctx.blocks) {
    for (let log of block.logs) {
      let decoded_bet = MarketpulseAbi.events.NewBet.decode(log);
      console.log("decoded_bet", decoded_bet);
      bets.push(
        new Bet({
          id: decoded_bet.bet.id.toString(),
          amount: decoded_bet.bet.amount,
          option: decoded_bet.bet.option,
          owner: decoded_bet.bet.owner,
        })
      );
    }
  }
  await ctx.store.insert(bets);
});