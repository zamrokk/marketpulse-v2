import {contract} from './mapping'
import {processor} from './processor'
import {db, Store} from './db'
import {EntityBuffer} from './entityBuffer'
import {Block, Transaction} from './model'

processor.run(db, async (ctx) => {
    for (let block of ctx.blocks) {
       /* EntityBuffer.add(
            new Block({
                id: block.header.id,
                number: block.header.height,
                timestamp: new Date(block.header.timestamp),
            })
        )*/

        for (let log of block.logs) {
            if (log.address === '0x386dc5e8e0f8252880cfa9b9e607c749899bf13a') {
                contract.parseEvent(ctx, log)
            }
        }
/*
        for (let transaction of block.transactions) {
            if (transaction.to === '0x386dc5e8e0f8252880cfa9b9e607c749899bf13a') {
                console.log("Contract received tx",transaction);
            }

            EntityBuffer.add(
                new Transaction({
                    id: transaction.id,
                    blockNumber: block.header.height,
                    blockTimestamp: new Date(block.header.timestamp),
                    hash: transaction.hash,
                    to: transaction.to,
                    from: transaction.from,
                })
            )
        }*/
    }

    for (let entities of EntityBuffer.flush()) {
        await ctx.store.insert(entities)
    }
})
