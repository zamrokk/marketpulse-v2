# Subquery

https://academy.subquery.network/indexer/quickstart/quickstart.html

https://academy.subquery.network/indexer/quickstart/quickstart_chains/ethereum-gravatar.html

Prereq

- NodeJS: A modern (e.g. the LTS version) installation of NodeJS.
- Docker: This tutorial will use Docker to run a local version of SubQuery's node.


# NPM
//npm install -g @subql/cli
npm install -D @subql/cli  @subql/common-ethereum


# Test that it was installed correctly
npx subql --help


```
npx subql init
```

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


npm i 

npm run build:develop

On the root of the new inner project `subquery_indexer` , you have the config file named `project.ts` where all transaction calls and events are registered

By default, the EVM template will create an ORM model for Transfer and Approval entities. Let's modify it to only register Bets

Edit schema.graphql with

```
type Bet @entity {
  id: ID! # uint256
  owner: String! # address
  option: String! # string
  amount: BigInt! # uint256
}
```


rebuild with

npm run build:develop

it has updated the `./src/types` directory where you can find your new ORM model `Bet.ts` (under the `models` folder)

Navigate to the default mapping function in the `src/mappings/MarketpulseHandlers.ts` directory to persist the Bets. Edit the event-based function `handleNewBetMarketpulseLog` with 

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

Change the rate limit as there is one on default etherlink


Update the docker-compose.yml, replace the value of batch-size by 5

```yaml
      - --batch-size=5
```


rebuild

```
npm run build:develop
```

run docker compose

```
npm run start:docker
```

open the graphql editor and enter this query 

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


Publish to a Cloud managed service : https://academy.subquery.network/indexer/run_publish/publish.html

