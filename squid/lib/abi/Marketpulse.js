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
exports.Contract = exports.functions = exports.events = exports.abi = void 0;
const ethers = __importStar(require("ethers"));
const abi_support_1 = require("./abi.support");
const Marketpulse_abi_1 = require("./Marketpulse.abi");
exports.abi = new ethers.Interface(Marketpulse_abi_1.ABI_JSON);
exports.events = {
    NewBet: new abi_support_1.LogEvent(exports.abi, '0x3da3958a2d60288c66fc825e0a5e95a83e03662afbe1595a85c7a47742264293'),
    Pong: new abi_support_1.LogEvent(exports.abi, '0x4d015fcc2a20c24d7be893b3a525eac864b5a53a5f88ef7201a600465c73314e'),
};
exports.functions = {
    FEES: new abi_support_1.Func(exports.abi, '0x8b7b23ee'),
    ODD_DECIMALS: new abi_support_1.Func(exports.abi, '0x08888c0a'),
    addressToString: new abi_support_1.Func(exports.abi, '0x5e57966d'),
    admin: new abi_support_1.Func(exports.abi, '0xf851a440'),
    bet: new abi_support_1.Func(exports.abi, '0xe9c20cb9'),
    betKeys: new abi_support_1.Func(exports.abi, '0xbb0b6443'),
    bets: new abi_support_1.Func(exports.abi, '0x22af00fa'),
    calculateOdds: new abi_support_1.Func(exports.abi, '0x1d86be88'),
    getBetKeys: new abi_support_1.Func(exports.abi, '0xf65e6501'),
    getBets: new abi_support_1.Func(exports.abi, '0x1ccf6955'),
    ping: new abi_support_1.Func(exports.abi, '0x5c36b186'),
    resolveResult: new abi_support_1.Func(exports.abi, '0x7a4f4e9c'),
    status: new abi_support_1.Func(exports.abi, '0x200d2ed2'),
    winner: new abi_support_1.Func(exports.abi, '0xdfbf53ae'),
};
class Contract extends abi_support_1.ContractBase {
    FEES() {
        return this.eth_call(exports.functions.FEES, []);
    }
    ODD_DECIMALS() {
        return this.eth_call(exports.functions.ODD_DECIMALS, []);
    }
    addressToString(_addr) {
        return this.eth_call(exports.functions.addressToString, [_addr]);
    }
    admin() {
        return this.eth_call(exports.functions.admin, []);
    }
    betKeys(arg0) {
        return this.eth_call(exports.functions.betKeys, [arg0]);
    }
    bets(arg0) {
        return this.eth_call(exports.functions.bets, [arg0]);
    }
    calculateOdds(option, betAmount) {
        return this.eth_call(exports.functions.calculateOdds, [option, betAmount]);
    }
    getBetKeys() {
        return this.eth_call(exports.functions.getBetKeys, []);
    }
    getBets(betId) {
        return this.eth_call(exports.functions.getBets, [betId]);
    }
    status() {
        return this.eth_call(exports.functions.status, []);
    }
    winner() {
        return this.eth_call(exports.functions.winner, []);
    }
}
exports.Contract = Contract;
