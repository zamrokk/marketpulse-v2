"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleNewBetEvent = handleNewBetEvent;
const util_internal_json_1 = require("@subsquid/util-internal-json");
const Marketpulse_1 = require("../abi/Marketpulse");
const entityBuffer_1 = require("../entityBuffer");
const model_1 = require("../model");
function handleNewBetEvent(ctx, log) {
    const e = Marketpulse_1.events['NewBet'].decode(log);
    entityBuffer_1.EntityBuffer.add(new model_1.ContractEventNewBet({
        id: log.id,
        blockNumber: log.block.height,
        blockTimestamp: new Date(log.block.timestamp),
        transactionHash: log.transaction.hash,
        contract: log.address,
        eventName: 'NewBet',
        bet: (0, util_internal_json_1.toJSON)(e.bet),
    }));
}
