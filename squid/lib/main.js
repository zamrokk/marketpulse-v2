"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const evm_processor_1 = require("@subsquid/evm-processor");
const typeorm_store_1 = require("@subsquid/typeorm-store");
const MarketpulseAbi = __importStar(require("./abi/Marketpulse"));
const model_1 = require("./model");
console.info("*** process.env.ETH_HTTP", process.env.ETH_HTTP);
const processor = new evm_processor_1.EvmBatchProcessor()
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
const db = new typeorm_store_1.TypeormDatabase();
processor.run(db, async (ctx) => {
    const bets = [];
    for (let block of ctx.blocks) {
        for (let log of block.logs) {
            let decoded_bet = MarketpulseAbi.events.NewBet.decode(log);
            console.log("decoded_bet", decoded_bet);
            bets.push(new model_1.Bet({
                id: decoded_bet.bet.id.toString(),
                amount: decoded_bet.bet.amount,
                option: decoded_bet.bet.option,
                owner: decoded_bet.bet.owner,
            }));
        }
    }
    await ctx.store.insert(bets);
});
