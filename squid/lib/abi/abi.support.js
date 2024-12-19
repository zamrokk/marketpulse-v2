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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractBase = exports.Func = exports.LogEvent = void 0;
exports.isFunctionResultDecodingError = isFunctionResultDecodingError;
const assert_1 = __importDefault(require("assert"));
const ethers = __importStar(require("ethers"));
class LogEvent {
    constructor(abi, topic) {
        this.abi = abi;
        this.topic = topic;
        let fragment = abi.getEvent(topic);
        (0, assert_1.default)(fragment != null, 'Missing fragment');
        this.fragment = fragment;
    }
    is(rec) {
        return rec.topics[0] === this.topic;
    }
    decode(rec) {
        return this.abi.decodeEventLog(this.fragment, rec.data, rec.topics);
    }
}
exports.LogEvent = LogEvent;
class Func {
    constructor(abi, sighash) {
        this.abi = abi;
        this.sighash = sighash;
        let fragment = abi.getFunction(sighash);
        (0, assert_1.default)(fragment != null, 'Missing fragment');
        this.fragment = fragment;
    }
    is(rec) {
        let sighash = rec.sighash ? rec.sighash : rec.input.slice(0, 10);
        return sighash === this.sighash;
    }
    decode(inputOrRec) {
        const input = ethers.isBytesLike(inputOrRec) ? inputOrRec : inputOrRec.input;
        return this.abi.decodeFunctionData(this.fragment, input);
    }
    encode(args) {
        return this.abi.encodeFunctionData(this.fragment, args);
    }
    decodeResult(output) {
        const decoded = this.abi.decodeFunctionResult(this.fragment, output);
        return decoded.length > 1 ? decoded : decoded[0];
    }
    tryDecodeResult(output) {
        try {
            return this.decodeResult(output);
        }
        catch (err) {
            return undefined;
        }
    }
}
exports.Func = Func;
function isFunctionResultDecodingError(val) {
    if (!(val instanceof Error))
        return false;
    let err = val;
    return err.code == 'CALL_EXCEPTION'
        && typeof err.data == 'string'
        && !err.errorArgs
        && !err.errorName;
}
class ContractBase {
    constructor(ctx, blockOrAddress, address) {
        this._chain = ctx._chain;
        if (typeof blockOrAddress === 'string') {
            this.blockHeight = ctx.block.height;
            this.address = ethers.getAddress(blockOrAddress);
        }
        else {
            if (address == null) {
                throw new Error('missing contract address');
            }
            this.blockHeight = blockOrAddress.height;
            this.address = ethers.getAddress(address);
        }
    }
    async eth_call(func, args) {
        let data = func.encode(args);
        let result = await this._chain.client.call('eth_call', [
            { to: this.address, data },
            '0x' + this.blockHeight.toString(16)
        ]);
        return func.decodeResult(result);
    }
}
exports.ContractBase = ContractBase;
