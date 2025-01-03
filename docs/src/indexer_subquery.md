# Subquery

This tutorial is based on the SubQuery official Ethereum tutorial you can find below, but adapted for Etherlink:

- https://academy.subquery.network/indexer/quickstart/quickstart.html
- https://academy.subquery.network/indexer/quickstart/quickstart_chains/ethereum-gravatar.html

Prerequisites:

- NodeJS: A modern (e.g. the LTS version) installation of NodeJS.
- Docker: This tutorial will use Docker to run a local version of SubQuery's node.

1. Install some dev dependencies to be able to call the initialization

   ```bash
   npm install -D @subql/cli @subql/common-ethereum
   ```

1. Test that it was installed correctly

   ```bash
   npx subql --help
   ```

1. Run the initialization of the project

   ```bash
   npx subql init
   ```

   Enter this options:

   - Project name: subquery_indexer
   - Select a network family: EVM
   - Select a network: Etherlink Testnet
   - Select a template project: etherlink-testnet-starter
   - RPC endpoint : https://node.ghostnet.etherlink.com
   - Do you want to generate scaffolding from an existing contract abi? y
   - Path to ABI: ./artifacts/contracts/Marketpulse.sol/Marketpulse.json
   - Please provide a contract address: 0x386Dc5E8e0f8252880cFA9B9e607C749899bf13a
   - Please provide startBlock when the contract was deployed or first used: 16297152
   - Select event: All
   - Select function: All

1. Go to the project and build it

   ```bash
   cd subquery_indexer
   npm i
   npm run build:develop
   ```

1. On the root of the project `subquery_indexer`, you have a config file named `project.ts` where all transaction calls and events are registered. By default, the EVM template will create an ORM model for `Transfer` and `Approval` entities. Let's modify it to only register `Bet` entity. Replace `schema.graphql` with this content :

   ```graphql
   type Bet @entity {
     id: ID! # uint256
     owner: String! # address
     option: String! # string
     amount: BigInt! # uint256
   }
   ```

1. Rebuild the project

   ```bash
   npm run build:develop
   ```

   The `./src/types` directory has been updated. You can find your new ORM model `Bet.ts` under the `models` folder

1. Navigate to the default mapping function in the `./src/mappings/MarketpulseHandlers.ts` directory to persist the Bets. Replace the event-based function `handleNewBetMarketpulseLog` with this content :

   ```typescript
   export async function handleNewBetMarketpulseLog(
     log: NewBetLog
   ): Promise<void> {
     logger.info("New Bet at block " + log.blockNumber.toString());

     assert(log.args, "Require args on the logs");

     const bet = Bet.create({
       id: log.args.bet.id.toHexString()!,
       owner: log.args.bet.owner,
       amount: log.args.bet.amount.toBigInt(),
       option: log.args.bet.option,
     });

     await bet.save();
   }
   ```

1. Change the rate limit as there is one on the default Etherlink testnet node. Update the `docker-compose.yml` replacing the value of `batch-size` with `5`

   ```yaml
   - --batch-size=5
   ```

1. Rebuild the project

   ```bash
   npm run build:develop
   ```

1. Run the local infrastructure with Docker compose

   ```bash
   run docker compose
   ```

1. Run the indexer process

   ```bash
   npm run start:docker
   ```

1. Open the graphql playground and run this query

   ```graphql
   query MyQuery {
     bets {
       nodes {
         amount
         id
         option
         owner
       }
     }
   }
   ```

1. (Optional) To publish to the SubQuery Cloud managed service, [follow these steps](https://academy.subquery.network/indexer/run_publish/publish.html)
