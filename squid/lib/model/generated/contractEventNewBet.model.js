"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractEventNewBet = void 0;
const typeorm_1 = require("typeorm");
const _bet_1 = require("./_bet");
let ContractEventNewBet = class ContractEventNewBet {
    constructor(props) {
        Object.assign(this, props);
    }
};
exports.ContractEventNewBet = ContractEventNewBet;
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], ContractEventNewBet.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)("int4", { nullable: false }),
    __metadata("design:type", Number)
], ContractEventNewBet.prototype, "blockNumber", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)("timestamp with time zone", { nullable: false }),
    __metadata("design:type", Date)
], ContractEventNewBet.prototype, "blockTimestamp", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)("text", { nullable: false }),
    __metadata("design:type", String)
], ContractEventNewBet.prototype, "transactionHash", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)("text", { nullable: false }),
    __metadata("design:type", String)
], ContractEventNewBet.prototype, "contract", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)("text", { nullable: false }),
    __metadata("design:type", String)
], ContractEventNewBet.prototype, "eventName", void 0);
__decorate([
    (0, typeorm_1.Column)("jsonb", { transformer: { to: obj => obj.toJSON(), from: obj => obj == null ? undefined : new _bet_1.Bet(undefined, obj) }, nullable: false }),
    __metadata("design:type", _bet_1.Bet)
], ContractEventNewBet.prototype, "bet", void 0);
exports.ContractEventNewBet = ContractEventNewBet = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [Object])
], ContractEventNewBet);
