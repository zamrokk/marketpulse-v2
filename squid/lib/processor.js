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
exports.processor = void 0;
const evm_processor_1 = require("@subsquid/evm-processor");
const contractAbi = __importStar(require("./abi/Marketpulse"));
exports.processor = new evm_processor_1.EvmBatchProcessor()
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
