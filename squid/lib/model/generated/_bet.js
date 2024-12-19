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
exports.Bet = void 0;
const assert_1 = __importDefault(require("assert"));
const marshal = __importStar(require("./marshal"));
class Bet {
    constructor(props, json) {
        Object.assign(this, props);
        if (json != null) {
            this._id = marshal.id.fromJSON(json.id);
            this._owner = marshal.string.fromJSON(json.owner);
            this._option = marshal.string.fromJSON(json.option);
            this._amount = marshal.bigint.fromJSON(json.amount);
        }
    }
    get id() {
        (0, assert_1.default)(this._id != null, 'uninitialized access');
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get owner() {
        (0, assert_1.default)(this._owner != null, 'uninitialized access');
        return this._owner;
    }
    set owner(value) {
        this._owner = value;
    }
    get option() {
        (0, assert_1.default)(this._option != null, 'uninitialized access');
        return this._option;
    }
    set option(value) {
        this._option = value;
    }
    get amount() {
        (0, assert_1.default)(this._amount != null, 'uninitialized access');
        return this._amount;
    }
    set amount(value) {
        this._amount = value;
    }
    toJSON() {
        return {
            id: this.id,
            owner: this.owner,
            option: this.option,
            amount: marshal.bigint.toJSON(this.amount),
        };
    }
}
exports.Bet = Bet;
