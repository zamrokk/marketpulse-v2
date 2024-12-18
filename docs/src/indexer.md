# Usage of an indexer

Rebuild the relational DB behind the contract.
For example : list all bets from same users without loading into memory and looping all bets

## The graph

https://docs.etherlink.com/building-on-etherlink/indexing-graph/

npm install -g @graphprotocol/graph-cli

graph init marketpulse thegraph --protocol=ethereum

> Note : buggy if contract is buggy too --network=etherlink-testnet

> Note : buggy verify on --from-contract=0x0b201a037F3d4CEED1ceFaE8200721d950143Ff2

> Note : buggy --abi==artifacts/contracts/Marketpulse.sol/Marketpulse.json

---

Only events (call and blocks ) are caught, so we need to modify the source code to emit events when a bet is created

- add a new event

```Solidity
    event NewBet(Bet bet);
```

- remove the betKeys array field
- remove the getBetKeys function

- Edit `bet` funtion

```Solidity
/**
     * place bets and returns the betId
     */
    function bet(
        string calldata selection,
        uint256 odds
    ) public payable returns (uint256) {
        require(msg.value > 0, "Bet amount must be positive.");
        require(
            msg.value <= msg.sender.balance,
            "Insufficient balance to place this bet."
        );

        uint256 betId = generateBetId();

        Bet newBet = Bet({
            id: betId,
            option: selection,
            amount: msg.value,
            owner: payable(msg.sender)
        });
        bets.push(newBet);
        emit NewBet(newBet);

        console.log("Bet %d placed", betId);

        console.log(
            "Bet placed: %d on %s at odds of %d",
            msg.value,
            selection,
            odds
        );
        return betId;
    }
```

> Note : in this tutorial, we don't delete bets but it could be possible on a real app

Optimization : now we have to change the calculateOdds function has we cannot loop on the betKeys array anymore. It will reduce the contract storage and also execution time. Let's have a accumulator amount of bets per options

- Replace the calculateOdds function by this code

```Solidity

```

---

```bash
graph codegen
graph build

graph auth <DEPLOY_KEY>

graph deploy marketpulse
```

Note : very boring to get minimum 0.001 ETH on Arbitrum mainnet, then go to the faucet (https://www.alchemy.com/faucets/arbitrum-sepolia) and register on Alchemy ...

Go to thegraph website and
test

then publish your graph and .... wait ,it takes several hours on testnet ...

//if abi changed, regen it, delete the full project and try again
and then again graph init ...

## TEST BASE SEPOLIA

graph init marketpulse-base-sepolia thegraph --protocol=ethereum

> Note : buggy if contract is buggy too --network=etherlink-testnet

> Note : buggy verify on --from-contract=0x0b201a037F3d4CEED1ceFaE8200721d950143Ff2

> Note : buggy --abi==artifacts/contracts/Marketpulse.sol/Marketpulse.json

graph codegen
graph build
graph deploy marketpulse-base-sepolia

## TEST ARBITRUM SEPOLIA

graph init marketpulse-arbitrum-sepolia thegraph --protocol=ethereum

> Note : buggy if contract is buggy too --network=etherlink-testnet

> Note : buggy verify on --from-contract=0x0b201a037F3d4CEED1ceFaE8200721d950143Ff2

> Note : buggy --abi==artifacts/contracts/Marketpulse.sol/Marketpulse.json

graph codegen
graph build
graph deploy marketpulse-arbitrum-sepolia

## Subsquid

//TODO generate from ABI   npx squid-gen-abi --help

mkdir squid && cd squid
npm init

touch .gitignore

```gitignore
/node_modules
package-lock.json
.env
```

npm i dotenv typeorm @subsquid/evm-processor @subsquid/typeorm-store @subsquid/typeorm-migration @subsquid/graphql-server @subsquid/evm-abi
npm i typescript @subsquid/typeorm-codegen @subsquid/evm-typegen --save-dev

touch tsconfig.json

```json
{
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "lib",
    "module": "commonjs",
    "target": "es2020",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

touch schema.graphql

```graphql
type Bet @entity {
  id: ID! # uint256
  owner: String! # address
  option: String! # string
  amount: BigInt! # uint256
}
```

npx squid-typeorm-codegen

touch .env

```env
DB_NAME=squid
DB_PORT=23798
GQL_PORT=4350
ETH_HTTP=https://node.ghostnet.etherlink.com
```

touch docker-compose.yaml

```docker
version: "3"
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: "${DB_NAME}"
      POSTGRES_PASSWORD: postgres
    ports:
      - "${DB_PORT}:5432"
```

docker compose up -d

npx tsc

npx squid-typeorm-migration generate

npx squid-typeorm-migration apply

npx squid-evm-typegen src/abi ../artifacts/contracts/Marketpulse.sol/Marketpulse.json

touch src/main.ts

add imports

```typescript
import { EvmBatchProcessor } from "@subsquid/evm-processor";
import { TypeormDatabase } from "@subsquid/typeorm-store";
import * as MarketpulseAbi from "./abi/Marketpulse";
import { Bet } from "./model";

console.info("*** process.env.ETH_HTTP", process.env.ETH_HTTP);

const processor = new EvmBatchProcessor()
  .setGateway("https://v2.archive.subsquid.io/network/etherlink-testnet")
  .setRpcEndpoint({
    // set RPC endpoint in .env
    url: process.env.ETH_HTTP,
    rateLimit: 10,
  })
  .setFinalityConfirmation(75) // 15 mins to finality
  .addLog({
    address: ["0x386Dc5E8e0f8252880cFA9B9e607C749899bf13a"],
    topic0: [MarketpulseAbi.events.NewBet.topic],
  });

const db = new TypeormDatabase();

processor.run(db, async (ctx) => {
  const bets: Bet[] = [];
  for (let block of ctx.blocks) {
    for (let log of block.logs) {
      let decoded_bet = MarketpulseAbi.events.NewBet.decode(log);
      console.log("decoded_bet", decoded_bet);
      bets.push(
        new Bet({
          id: decoded_bet.bet.id.toString(),
          amount: decoded_bet.bet.amount,
          option: decoded_bet.bet.option,
          owner: decoded_bet.bet.owner,
        })
      );
    }
  }
  await ctx.store.insert(bets);
});
```

npx tsc

node -r dotenv/config lib/main.js

npx squid-graphql-server

go to localhost:4350/graphql

## Ready for the Cloud ?

https://docs.sqd.dev/cloud/overview/

install CLI

```bash
npm install -g @subsquid/cli
```

Create new account , then create api token (https://app.subsquid.io/profile/api-tokens)
Then auth locally

```bash
sqd auth -k <TOKEN>
```

then add etherlink to secrets on the ui > secrets

```log
name : ETH_HTTP
value : https://node.ghostnet.etherlink.com
```

touch squid.yaml

```yaml
manifest_version: subsquid.io/v0.1
name: marketpulse

build:

deploy:
  env:
    ETH_HTTP: ${{ secrets.ETH_HTTP }}
  addons:
    postgres:
  processor:
    cmd: ["sqd", "process:prod"]
  api:
    cmd: ["sqd", "serve:prod"]
```

touch commands.json

```json
{
  "$schema": "https://subsquid.io/schemas/commands.json",
  "commands": {
    "clean": {
      "description": "delete all build artifacts",
      "cmd": ["rm", "-rf", "lib"]
    },
    "build": {
      "description": "build the project",
      "deps": ["clean", "typegen"],
      "cmd": ["tsc"]
    },
    "migration:apply": {
      "description": "Apply the DB migrations",
      "cmd": ["squid-typeorm-migration", "apply"]
    },
    "migration:generate": {
      "description": "Generate a DB migration matching the TypeORM entities",
      "deps": ["build", "migration:clean"],
      "cmd": ["squid-typeorm-migration", "generate"]
    },
    "migration:clean": {
      "description": "Clean the migrations folder",
      "cmd": ["npx", "--yes", "rimraf", "./db/migrations"]
    },
    "migration": {
      "deps": ["build"],
      "cmd": ["squid-typeorm-migration", "generate"],
      "hidden": true
    },
    "codegen": {
      "description": "Generate TypeORM entities from the schema file",
      "cmd": ["squid-typeorm-codegen"]
    },
    "typegen": {
      "description": "generate abi file",
      "cmd": ["squid-evm-typegen", "src/abi", "./src/abi/Marketpulse.json"]
    },
    "process": {
      "description": "Load .env and start the squid processor",
      "deps": ["build", "migration:apply"],
      "cmd": ["node", "--require=dotenv/config", "lib/main.js"]
    },
    "process:prod": {
      "description": "Start the squid processor",
      "cmd": ["node", "lib/main.js"],
      "hidden": true
    },
    "serve": {
      "description": "Start the GraphQL API server",
      "cmd": ["squid-graphql-server"]
    },
    "serve:prod": {
      "description": "Start the GraphQL API server with caching and limits",
      "cmd": [
        "squid-graphql-server",
        "--dumb-cache",
        "in-memory",
        "--dumb-cache-ttl",
        "1000",
        "--dumb-cache-size",
        "100",
        "--dumb-cache-max-age",
        "1000"
      ]
    }
  }
}
```

then copy the abi file as it requires to be part of the docker files and execute locally the command for deployment

cp ../artifacts/contracts/Marketpulse.sol/Marketpulse.json ./src/abi && sqd deploy

wait until it is completely sync at 100% , and then on the ui go to the url for GraphQL ui, request `bets` (if there is any already on your contract)
