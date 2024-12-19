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
exports.parseEvent = parseEvent;
const entityBuffer_1 = require("../entityBuffer");
const model_1 = require("../model");
const spec = __importStar(require("../abi/Marketpulse"));
const address = '0x386dc5e8e0f8252880cfa9b9e607c749899bf13a';
function parseEvent(ctx, log) {
    try {
        switch (log.topics[0]) {
            case spec.events['NewBet'].topic: {
                let e = spec.events.NewBet.decode(log);
                console.log("e", e);
                console.log("log", log);
                entityBuffer_1.EntityBuffer.add(new model_1.ContractEventNewBet({
                    id: log.id,
                    blockNumber: log.block.height,
                    blockTimestamp: new Date(log.block.timestamp),
                    transactionHash: log["transactionHash"],
                    contract: log.address,
                    eventName: 'NewBet',
                    bet: new model_1.Bet({
                        id: e.bet.id.toString(),
                        amount: e.bet.amount,
                        option: e.bet.option,
                        owner: e.bet.owner,
                    }),
                }));
                break;
            }
        }
    }
    catch (error) {
        ctx.log.error({ error, blockNumber: log.block.height, blockHash: log.block.hash, address }, `Unable to decode event "${log.topics[0]}"`);
    }
}
