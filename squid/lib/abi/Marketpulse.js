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
exports.Contract = exports.functions = exports.events = void 0;
const p = __importStar(require("@subsquid/evm-codec"));
const evm_abi_1 = require("@subsquid/evm-abi");
exports.events = {
    NewBet: (0, evm_abi_1.event)("0x3da3958a2d60288c66fc825e0a5e95a83e03662afbe1595a85c7a47742264293", "NewBet((uint256,address,string,uint256))", { "bet": p.struct({ "id": p.uint256, "owner": p.address, "option": p.string, "amount": p.uint256 }) }),
    Pong: (0, evm_abi_1.event)("0x4d015fcc2a20c24d7be893b3a525eac864b5a53a5f88ef7201a600465c73314e", "Pong()", {}),
};
exports.functions = {
    FEES: (0, evm_abi_1.viewFun)("0x8b7b23ee", "FEES()", {}, p.uint256),
    ODD_DECIMALS: (0, evm_abi_1.viewFun)("0x08888c0a", "ODD_DECIMALS()", {}, p.uint256),
    addressToString: (0, evm_abi_1.viewFun)("0x5e57966d", "addressToString(address)", { "_addr": p.address }, p.string),
    admin: (0, evm_abi_1.viewFun)("0xf851a440", "admin()", {}, p.address),
    bet: (0, evm_abi_1.fun)("0xe9c20cb9", "bet(string,uint256)", { "selection": p.string, "odds": p.uint256 }, p.uint256),
    betKeys: (0, evm_abi_1.viewFun)("0xbb0b6443", "betKeys(uint256)", { "_0": p.uint256 }, p.uint256),
    bets: (0, evm_abi_1.viewFun)("0x22af00fa", "bets(uint256)", { "_0": p.uint256 }, { "id": p.uint256, "owner": p.address, "option": p.string, "amount": p.uint256 }),
    calculateOdds: (0, evm_abi_1.viewFun)("0x1d86be88", "calculateOdds(string,uint256)", { "option": p.string, "betAmount": p.uint256 }, p.uint256),
    getBetKeys: (0, evm_abi_1.viewFun)("0xf65e6501", "getBetKeys()", {}, p.array(p.uint256)),
    getBets: (0, evm_abi_1.viewFun)("0x1ccf6955", "getBets(uint256)", { "betId": p.uint256 }, p.struct({ "id": p.uint256, "owner": p.address, "option": p.string, "amount": p.uint256 })),
    ping: (0, evm_abi_1.fun)("0x5c36b186", "ping()", {}),
    resolveResult: (0, evm_abi_1.fun)("0x7a4f4e9c", "resolveResult(string,uint8)", { "optionResult": p.string, "result": p.uint8 }),
    status: (0, evm_abi_1.viewFun)("0x200d2ed2", "status()", {}, p.uint8),
    winner: (0, evm_abi_1.viewFun)("0xdfbf53ae", "winner()", {}, p.string),
};
class Contract extends evm_abi_1.ContractBase {
    FEES() {
        return this.eth_call(exports.functions.FEES, {});
    }
    ODD_DECIMALS() {
        return this.eth_call(exports.functions.ODD_DECIMALS, {});
    }
    addressToString(_addr) {
        return this.eth_call(exports.functions.addressToString, { _addr });
    }
    admin() {
        return this.eth_call(exports.functions.admin, {});
    }
    betKeys(_0) {
        return this.eth_call(exports.functions.betKeys, { _0 });
    }
    bets(_0) {
        return this.eth_call(exports.functions.bets, { _0 });
    }
    calculateOdds(option, betAmount) {
        return this.eth_call(exports.functions.calculateOdds, { option, betAmount });
    }
    getBetKeys() {
        return this.eth_call(exports.functions.getBetKeys, {});
    }
    getBets(betId) {
        return this.eth_call(exports.functions.getBets, { betId });
    }
    status() {
        return this.eth_call(exports.functions.status, {});
    }
    winner() {
        return this.eth_call(exports.functions.winner, {});
    }
}
exports.Contract = Contract;
