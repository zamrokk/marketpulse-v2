import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './Marketpulse.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    NewBet: new LogEvent<([bet: ([id: bigint, owner: string, option: string, amount: bigint] & {id: bigint, owner: string, option: string, amount: bigint})] & {bet: ([id: bigint, owner: string, option: string, amount: bigint] & {id: bigint, owner: string, option: string, amount: bigint})})>(
        abi, '0x3da3958a2d60288c66fc825e0a5e95a83e03662afbe1595a85c7a47742264293'
    ),
    Pong: new LogEvent<[]>(
        abi, '0x4d015fcc2a20c24d7be893b3a525eac864b5a53a5f88ef7201a600465c73314e'
    ),
}

export const functions = {
    FEES: new Func<[], {}, bigint>(
        abi, '0x8b7b23ee'
    ),
    ODD_DECIMALS: new Func<[], {}, bigint>(
        abi, '0x08888c0a'
    ),
    addressToString: new Func<[_addr: string], {_addr: string}, string>(
        abi, '0x5e57966d'
    ),
    admin: new Func<[], {}, string>(
        abi, '0xf851a440'
    ),
    bet: new Func<[selection: string, odds: bigint], {selection: string, odds: bigint}, bigint>(
        abi, '0xe9c20cb9'
    ),
    betKeys: new Func<[_: bigint], {}, bigint>(
        abi, '0xbb0b6443'
    ),
    bets: new Func<[_: bigint], {}, ([id: bigint, owner: string, option: string, amount: bigint] & {id: bigint, owner: string, option: string, amount: bigint})>(
        abi, '0x22af00fa'
    ),
    calculateOdds: new Func<[option: string, betAmount: bigint], {option: string, betAmount: bigint}, bigint>(
        abi, '0x1d86be88'
    ),
    getBetKeys: new Func<[], {}, Array<bigint>>(
        abi, '0xf65e6501'
    ),
    getBets: new Func<[betId: bigint], {betId: bigint}, ([id: bigint, owner: string, option: string, amount: bigint] & {id: bigint, owner: string, option: string, amount: bigint})>(
        abi, '0x1ccf6955'
    ),
    ping: new Func<[], {}, []>(
        abi, '0x5c36b186'
    ),
    resolveResult: new Func<[optionResult: string, result: number], {optionResult: string, result: number}, []>(
        abi, '0x7a4f4e9c'
    ),
    status: new Func<[], {}, number>(
        abi, '0x200d2ed2'
    ),
    winner: new Func<[], {}, string>(
        abi, '0xdfbf53ae'
    ),
}

export class Contract extends ContractBase {

    FEES(): Promise<bigint> {
        return this.eth_call(functions.FEES, [])
    }

    ODD_DECIMALS(): Promise<bigint> {
        return this.eth_call(functions.ODD_DECIMALS, [])
    }

    addressToString(_addr: string): Promise<string> {
        return this.eth_call(functions.addressToString, [_addr])
    }

    admin(): Promise<string> {
        return this.eth_call(functions.admin, [])
    }

    betKeys(arg0: bigint): Promise<bigint> {
        return this.eth_call(functions.betKeys, [arg0])
    }

    bets(arg0: bigint): Promise<([id: bigint, owner: string, option: string, amount: bigint] & {id: bigint, owner: string, option: string, amount: bigint})> {
        return this.eth_call(functions.bets, [arg0])
    }

    calculateOdds(option: string, betAmount: bigint): Promise<bigint> {
        return this.eth_call(functions.calculateOdds, [option, betAmount])
    }

    getBetKeys(): Promise<Array<bigint>> {
        return this.eth_call(functions.getBetKeys, [])
    }

    getBets(betId: bigint): Promise<([id: bigint, owner: string, option: string, amount: bigint] & {id: bigint, owner: string, option: string, amount: bigint})> {
        return this.eth_call(functions.getBets, [betId])
    }

    status(): Promise<number> {
        return this.eth_call(functions.status, [])
    }

    winner(): Promise<string> {
        return this.eth_call(functions.winner, [])
    }
}
