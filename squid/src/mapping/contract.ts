import {DataHandlerContext} from '@subsquid/evm-processor'
import {toJSON} from '@subsquid/util-internal-json'
import {Store} from '../db'
import {EntityBuffer} from '../entityBuffer'
import {Bet, ContractEventNewBet} from '../model'
import * as spec from '../abi/Marketpulse'
import {Log, Transaction} from '../processor'

const address = '0x386dc5e8e0f8252880cfa9b9e607c749899bf13a'


export function parseEvent(ctx: DataHandlerContext<Store>, log: Log) {
    try {
        switch (log.topics[0]) {
            case spec.events['NewBet'].topic: {
                let e = spec.events.NewBet.decode(log)

                

                console.log("e",e);
                console.log("log",log);
                EntityBuffer.add(
                    new ContractEventNewBet({
                        id: log.id,
                        blockNumber: log.block.height,
                        blockTimestamp: new Date(log.block.timestamp),
                        transactionHash: log["transactionHash"],
                        contract: log.address,
                        eventName: 'NewBet',
                        bet: new Bet({
                            id: e.bet.id.toString(),
                            amount: e.bet.amount,
                            option: e.bet.option,
                            owner: e.bet.owner,
                          }),
                    })
                )
                break
            }
        }
    }
    catch (error) {
        ctx.log.error({error, blockNumber: log.block.height, blockHash: log.block.hash, address}, `Unable to decode event "${log.topics[0]}"`)
    }
}

