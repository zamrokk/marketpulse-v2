import * as p from '@subsquid/evm-codec'
import { event, fun, viewFun, indexed, ContractBase } from '@subsquid/evm-abi'
import type { EventParams as EParams, FunctionArguments, FunctionReturn } from '@subsquid/evm-abi'

export const events = {
    NewBet: event("0x3da3958a2d60288c66fc825e0a5e95a83e03662afbe1595a85c7a47742264293", "NewBet((uint256,address,string,uint256))", {"bet": p.struct({"id": p.uint256, "owner": p.address, "option": p.string, "amount": p.uint256})}),
    Pong: event("0x4d015fcc2a20c24d7be893b3a525eac864b5a53a5f88ef7201a600465c73314e", "Pong()", {}),
}

export const functions = {
    FEES: viewFun("0x8b7b23ee", "FEES()", {}, p.uint256),
    ODD_DECIMALS: viewFun("0x08888c0a", "ODD_DECIMALS()", {}, p.uint256),
    addressToString: viewFun("0x5e57966d", "addressToString(address)", {"_addr": p.address}, p.string),
    admin: viewFun("0xf851a440", "admin()", {}, p.address),
    bet: fun("0xe9c20cb9", "bet(string,uint256)", {"selection": p.string, "odds": p.uint256}, p.uint256),
    betKeys: viewFun("0xbb0b6443", "betKeys(uint256)", {"_0": p.uint256}, p.uint256),
    bets: viewFun("0x22af00fa", "bets(uint256)", {"_0": p.uint256}, {"id": p.uint256, "owner": p.address, "option": p.string, "amount": p.uint256}),
    calculateOdds: viewFun("0x1d86be88", "calculateOdds(string,uint256)", {"option": p.string, "betAmount": p.uint256}, p.uint256),
    getBetKeys: viewFun("0xf65e6501", "getBetKeys()", {}, p.array(p.uint256)),
    getBets: viewFun("0x1ccf6955", "getBets(uint256)", {"betId": p.uint256}, p.struct({"id": p.uint256, "owner": p.address, "option": p.string, "amount": p.uint256})),
    ping: fun("0x5c36b186", "ping()", {}, ),
    resolveResult: fun("0x7a4f4e9c", "resolveResult(string,uint8)", {"optionResult": p.string, "result": p.uint8}, ),
    status: viewFun("0x200d2ed2", "status()", {}, p.uint8),
    winner: viewFun("0xdfbf53ae", "winner()", {}, p.string),
}

export class Contract extends ContractBase {

    FEES() {
        return this.eth_call(functions.FEES, {})
    }

    ODD_DECIMALS() {
        return this.eth_call(functions.ODD_DECIMALS, {})
    }

    addressToString(_addr: AddressToStringParams["_addr"]) {
        return this.eth_call(functions.addressToString, {_addr})
    }

    admin() {
        return this.eth_call(functions.admin, {})
    }

    betKeys(_0: BetKeysParams["_0"]) {
        return this.eth_call(functions.betKeys, {_0})
    }

    bets(_0: BetsParams["_0"]) {
        return this.eth_call(functions.bets, {_0})
    }

    calculateOdds(option: CalculateOddsParams["option"], betAmount: CalculateOddsParams["betAmount"]) {
        return this.eth_call(functions.calculateOdds, {option, betAmount})
    }

    getBetKeys() {
        return this.eth_call(functions.getBetKeys, {})
    }

    getBets(betId: GetBetsParams["betId"]) {
        return this.eth_call(functions.getBets, {betId})
    }

    status() {
        return this.eth_call(functions.status, {})
    }

    winner() {
        return this.eth_call(functions.winner, {})
    }
}

/// Event types
export type NewBetEventArgs = EParams<typeof events.NewBet>
export type PongEventArgs = EParams<typeof events.Pong>

/// Function types
export type FEESParams = FunctionArguments<typeof functions.FEES>
export type FEESReturn = FunctionReturn<typeof functions.FEES>

export type ODD_DECIMALSParams = FunctionArguments<typeof functions.ODD_DECIMALS>
export type ODD_DECIMALSReturn = FunctionReturn<typeof functions.ODD_DECIMALS>

export type AddressToStringParams = FunctionArguments<typeof functions.addressToString>
export type AddressToStringReturn = FunctionReturn<typeof functions.addressToString>

export type AdminParams = FunctionArguments<typeof functions.admin>
export type AdminReturn = FunctionReturn<typeof functions.admin>

export type BetParams = FunctionArguments<typeof functions.bet>
export type BetReturn = FunctionReturn<typeof functions.bet>

export type BetKeysParams = FunctionArguments<typeof functions.betKeys>
export type BetKeysReturn = FunctionReturn<typeof functions.betKeys>

export type BetsParams = FunctionArguments<typeof functions.bets>
export type BetsReturn = FunctionReturn<typeof functions.bets>

export type CalculateOddsParams = FunctionArguments<typeof functions.calculateOdds>
export type CalculateOddsReturn = FunctionReturn<typeof functions.calculateOdds>

export type GetBetKeysParams = FunctionArguments<typeof functions.getBetKeys>
export type GetBetKeysReturn = FunctionReturn<typeof functions.getBetKeys>

export type GetBetsParams = FunctionArguments<typeof functions.getBets>
export type GetBetsReturn = FunctionReturn<typeof functions.getBets>

export type PingParams = FunctionArguments<typeof functions.ping>
export type PingReturn = FunctionReturn<typeof functions.ping>

export type ResolveResultParams = FunctionArguments<typeof functions.resolveResult>
export type ResolveResultReturn = FunctionReturn<typeof functions.resolveResult>

export type StatusParams = FunctionArguments<typeof functions.status>
export type StatusReturn = FunctionReturn<typeof functions.status>

export type WinnerParams = FunctionArguments<typeof functions.winner>
export type WinnerReturn = FunctionReturn<typeof functions.winner>

