# Usage of an indexer

Blockchain RPC API proposes very basic level of service to query Blockchain data, and it is often costly

Indexers can help rebuilding a relational database on top of contracts events. Thus, developer can use Rest or GraphQL to execute complex queries on indexed data or calculate statistics over historical data

For example : list all bets from a single user instead of querying the smart contract that will load all data into memory and looping over the bet array

## Etherlink indexers

Here is a comparison of the main providers [**TheGraph**](https://thegraph.com/) , [**SQD**](https://www.sqd.dev/) (SubSquid) and [**Dipdup**](https://dipdup.io/)

|      | thegraph                                                                                                                                                                                                                                                                                                                    | sqd                                                                                                                                                                                                                   | dipdup |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| pros | Scan abi and autogenerate files from events with the CLI. Quickly deploy to production. Share revenue with other indexer providers                                                                                                                                                                                          | Scan abi and autogenerate files from events with the CLI. Easily customizable as there is a from scratch tutorial. Cloud setup is really simple and has free plan. Can also be deploy locally                         |        |
| cons | Slow setup on the Cloud part (Need to get token for Arbitrum ETH, to request Arbitrum Sepolia ETH on faucets). Etherlink is not eligible to Signal tips on the network, so there is no community indexer providers. Economic model not easy to understand first. When ABI changes, need to restart the project from scratch | Takes more time to prepare the first subgraph and configure the infrastructure locally. It requires minimum devops skill. Documentation on commands.json and cloud secrets is not very clear. No shared revenue model |        |

> Note : For an generic example of indexation with 
> - TheGraph : look [here](https://docs.etherlink.com/building-on-etherlink/indexing-graph)
> - DipDup  : look [here](https://dipdup.io/docs/supported-networks/etherlink)
> - Otherwise, continue with the next section using SQD (SubSquid)

## Subsquid

### Local setup

> Note : We don't start from a template but from scratch to understand each steps and be able to customize it

1. Create a simple typescript sub-project

   ```bash
   mkdir squid && cd squid
   npm init
   touch .gitignore
   ```

1. Edit **.gitignore** file

   ```gitignore
   /node_modules
   package-lock.json
   .env
   ```

1. Install **subsquid** libs

   ```bash
   npm i dotenv typeorm @subsquid/evm-processor @subsquid/typeorm-store @subsquid/typeorm-migration @subsquid/graphql-server @subsquid/evm-abi

   npm i typescript @subsquid/typeorm-codegen @subsquid/evm-typegen @subsquid/squid-gen-evm --save-dev
   ```

1. Prepare typescript config file

   ```bash
   touch tsconfig.json
   ```

1. Edit **tsconfig.json**

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

1. Generate **graphql schema** and all entities from ABI. Replace below the **address** with your deployed contract address and **from** with your smart contract deployment block number

   ```bash
   npx squid-gen-abi --event NewBet --abi ../artifacts/contracts/Marketpulse.sol/Marketpulse.json --address 0x386Dc5E8e0f8252880cFA9B9e607C749899bf13a --archive https://v2.archive.subsquid.io/network/etherlink-testnet --from 16297152
   ```

1. Override JSON generic type on graphQL to a well structured one. Later, we can do GraphQL query on Bet fields, otherwise it is impossible with an array of values

   ```graphQL
   type ContractEventNewBet @entity {
       id: ID!
       blockNumber: Int! @index
       blockTimestamp: DateTime! @index
       transactionHash: String! @index
       contract: String! @index
       eventName: String! @index
       bet: Bet!
   }

   type Bet {
           id: ID! # uint256
           owner: String! # address
           option: String! # string
           amount: BigInt! # uint256
   }
   ```

1. Replace the generic JSON Bet code of `./src/mapping/contract.ts:30` by this one. It persists a structured object.

   ```typescript
   bet: new Bet({
       id: e.bet.id.toString(),
       amount: e.bet.amount,
       option: e.bet.option,
       owner: e.bet.owner,
       }),
   ```

1. Regenerate ORM files for the DB

   ```bash
   npx squid-typeorm-codegen
   ```

1. Create the local **.env** file

   ```bash
   touch .env
   ```

1. Edit the **.env** file

   ```env
   DB_NAME=squid
   DB_PORT=23798
   GQL_PORT=4350
   RPC_URL=https://node.ghostnet.etherlink.com
   ```

1. Prepare local Postgres DB on Docker

   ```bash
   touch docker-compose.yaml
   ```

1. Edit **docker-compose.yaml**

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

1. Start the database

   ```bash
   docker compose up -d
   ```

1. Compile the project

   ```bash
   npx tsc
   ```

   > Note : you may have some errors during compilation as the generator is not always up to date with last libraries. example of encountered errors :
   >
   > ```logs
   > Errors  Files
   >  1  src/main.ts:36
   >  3  src/mapping/contract.ts:22
   > ```
   >
   > - src/main.ts:36 : remove the status line
   > - src/main.ts:25 : replace `contract.parseFunction(ctx, transaction)` with `console.log("Contract received tx",transaction);`
   > - src/mapping/contract.ts:22 : replace `log.transactionHash` with `log["transactionHash"]`
   > - src/mapping/contract.ts:39 : remove `parseFunction`
   > - src/processor.ts:16 : replace the block `setDataSource(...)` with `.setGateway("https://v2.archive.subsquid.io/network/etherlink-testnet").setRpcEndpoint({url: process.env.RPC_URL,rateLimit: 10,})
.setFinalityConfirmation(75)`

1. Generate the DB scripts to create the database and tables

   ```bash
   npx squid-typeorm-migration generate
   ```

1. Run the DB scripts

   ```bash
   npx squid-typeorm-migration apply
   ```

1. Run the processor locally

   ```bash
   node -r dotenv/config lib/main.js
   ```

1. Run the GraphQL server locally

   ```bash
   npx squid-graphql-server
   ```

1. Go to localhost:4350/graphql

1. Play with graphQL queries, like this one gather all bets from a same user

   ```graphQL
    query MyQuery {
        contractEventNewBets(where: {bet: {owner_eq: "0xa73fEb91fE6dF51a6E36f2566030A0AB5C67646d"}}) {
            bet {
                amount
                id
                option
                owner
            }
        }
    }
   ```

   It should return all the bets you have already indexed (check on the processor logs to see which blocks have been already processed... If you are sync at 100%, all bets should appear)

> Important note : As we used the default SQD generator, it indexes all blocks and transactions, not only your smart contract events, so it can take some hours to index. We recommend to remove/comments all **Block** and **Transaction** entities persistency from the processor work on the **./src/main.ts** file. I.E : all starting with `EntityBuffer.add(new Block...` or `EntityBuffer.add(new Transaction({`

> Trick : If you are familiar with GraphQL, you can skip the `squid-gen-abi` command earlier and start writing a simplier GraphQL file from scratch, then generate the ORM files with the `squid-typeorm-codegen` command like earlier and `squid-evm-typegen` for the ABI types. You will have to rewrite the main and processor yourself. An example can be found [here](https://docs.sqd.dev/sdk/how-to-start/squid-from-scratch/)

## Deploy to SQD Cloud

> Note : Read quickly the SQD Cloud documentation [here](https://docs.sqd.dev/cloud/overview)

1. Install the **SQD CLI**

   ```bash
   npm install -g @subsquid/cli
   ```

1. Create new account on SQD Cloud, then create an api token (https://app.subsquid.io/profile/api-tokens)

1. Authenticate locally with your new generated token from previous step, replacing **<TOKEN>**

   ```bash
   sqd auth -k <TOKEN>
   ```

1. Add Etherlink Ghostnet to secrets on https://app.subsquid.io/ , submenu **Secrets**

   ```log
   name : RPC_URL
   value : https://node.ghostnet.etherlink.com
   ```

1. Prepare the Squid deployment config file **squid.yaml**

   ```bash
   touch squid.yaml
   ```

1. Edit the file **squid.yaml**

   ```yaml
   manifest_version: subsquid.io/v0.1
   name: marketpulse

   build:

   deploy:
     env:
       RPC_URL: ${{ secrets.RPC_URL }}
     addons:
       postgres:
     processor:
       cmd: ["node", "lib/main.js"]
     api:
       cmd:
         [
           "npx",
           "squid-graphql-server",
           "--dumb-cache",
           "in-memory",
           "--dumb-cache-ttl",
           "1000",
           "--dumb-cache-size",
           "100",
           "--dumb-cache-max-age",
           "1000",
         ]
   ```

1. Edit **package.json** to add a build script

   ```json
   "scripts": {
       "build": "npm i && tsc"
   },
   ```

1. Deploy your squid

   ```bash
   sqd deploy
   ```

1. Wait until it is completely sync at 100% , and then on the [GraphQL UI > General > URL](https://app.subsquid.io/squids/) and query `contractEventNewBets` (if there is any already on your contract)

# Update the frontend

Now that we have all bets indexed, we will add a counter on each option representing the number of bets the connected user has made on each candidate.

> Note : Other great ideas would be to 
> - Change the `calculateOdds` function and use aggregated bet amounts directly from the indexer API to faster dapp execution and avoid to loop on teh array of bets 
> - Store historical odds data to be able to display great graphs


1. Go bask to your frontend app

   ```bash
   cd app
   ```

1. Install GraphQL client libraries

   ```bash
   npm install @apollo/client graphql
   ```

1. 


