# Usage of an indexer

Blockchain RPC API proposes very basic level of service to query Blockchain data, and it is often costly

Indexers can help rebuilding a relational database on top of contracts events. Thus, developer can use Rest or GraphQL to execute complex queries on indexed data or calculate statistics over historical data

For example : list all bets from a single user instead of querying the smart contract that will load all data into memory and looping over the bet array

## Etherlink indexers

Here is a comparison of the main providers [**TheGraph**](https://thegraph.com/) , [**SQD**](https://www.sqd.dev/) (SubSquid) , [**Dipdup**](https://dipdup.io/) and [**SubQuery**](https://subquery.network/)

|      | thegraph                                                                                                                                                                                                                                                                       | sqd                                                                                                                                                                                                                                                                                                | dipdup                                                                                                                                                                       | subquery                                                                                                                                                                                                                                           |
| ---- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pros | Scan abi and autogenerate all files from events with the CLI. Quickly deploy to production. Share revenue with other indexer providers                                                                                                                                         | Autogenerate ORM and model files from graphQL with the CLI. Easily customizable as there is a from scratch tutorial. Cloud setup is really simple and has free plan. Can also be deploy locally                                                                                                    | Known indexer for people coming from Tezos. For Python devs                                                                                                                  | Autogenerate model files from ABI and ORM from GraphQL. Default GraphQL generation is quite rich with filters, order by and aggregations. Indexation is really fast because of parallelization and rate limit control. Can also be deploy locally. |
| cons | Slow setup on the Cloud part (Need to get token for Arbitrum ETH, to request Arbitrum Sepolia ETH on faucets). Etherlink is not eligible to Signal tips on the network, so there is no community indexer providers. When ABI changes, need to restart the project from scratch | Takes more time to prepare the first subgraph and configure the infrastructure locally. It requires minimum devops skill. Documentation on commands.json is not very clear and the code generator squid-gen-abi is for expert so you have to write the processor yourself. No shared revenue model | Need to code in Python the model, there is no generator from ABI or GraphQL. Quickstart documentation for database and graphQL in production lack of details. No Cloud offer | Default tutorial using global CLI setup does not work, it require to install dependencies as dev dependencies directly on the project. Hard to start the project if not using the default template                                                 |

> Note : Alternative indexation examples can be found here :
>
> - [TheGraph](./indexer_thegraph.md)
> - [DipDup](./indexer_dipdup.md)
> - [SubQuery](./indexer_subquery.md)
> - Otherwise, continue with the next section using SQD (SubSquid)

## Change the Solidity source code

All indexers work on specific triggers :

- transaction calls
- event emitted
- or other specific trigger

1. We need to add a new event every time a bet is created. On your `./contracts/Marketpulse.sol` contract file, add this new line event after the Pong event `event Pong();`

   ```Solidity
       event NewBet(Bet bet);
   ```

1. Edit the `bet` function to add the event emission `emit NewBet(newBet)`

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

        Bet memory newBet = Bet({
            id: betId,
            option: selection,
            amount: msg.value,
            owner: payable(msg.sender)
        });

        bets[betId] = newBet;
        betKeys.push(betId);

        emit NewBet(newBet);

        console.log("Bet %d placed", betId);

        console.log(
            "Bet placed: %d on %s at odds of %d",
            msg.value,
            selection,
            odds
        );

        //update aggregated amounts
        if (keccak256(bytes(newBet.option)) == keccak256(bytes("trump"))) {
            (bool success, uint256 result) = totalTrumpAmount.tryAdd(
                newBet.amount
            );
            require(success, "Cannot add totalTrumpAmount and bet.amount");
            totalTrumpAmount = result;
        } else {
            (bool success, uint256 result) = totalHarrisAmount.tryAdd(
                newBet.amount
            );
            require(success, "Cannot add totalHarrisAmount and bet.amount");
            totalHarrisAmount = result;
        }

        return betId;
    }
   ```

   > Note : in this tutorial, we don't delete bets but it might be possible on a real app

1. Optimization : We have to change the `calculateOdds` function to use precalculated amounts and avoid looping again on the keys array. It reduces the contract storage and also execution time. Add these lines at the end of the `bet` function before returning the `return betId;`

   ```Solidity
   //update aggregated amounts
         if (keccak256(bytes(newBet.option)) == keccak256(bytes("trump"))) {
               (bool success, uint256 result) = totalTrumpAmount.tryAdd(
                  newBet.amount
               );
               require(success, "Cannot add totalTrumpAmount and bet.amount");
               totalTrumpAmount = result;
         } else {
               (bool success, uint256 result) = totalHarrisAmount.tryAdd(
                  newBet.amount
               );
               require(success, "Cannot add totalHarrisAmount and bet.amount");
               totalHarrisAmount = result;
         }

   ```

1. Replace the `calculateOdds` function by this code

   ```Solidity
   /**
    *
   * @param option selected option
   * @param betAmount (Optional : default is 0) if user want to know the output gain after putting some money on it. Otherwise it gives actual gain without betting and influencing odds calculation
   * @return odds (in ODDS_DECIMAL unit)
   */
   function calculateOdds(
      string memory option,
      uint256 betAmount //wei
   ) public view returns (uint256) {
      console.log(
            "calculateOdds for option %s and bet amount is %d",
            option,
            betAmount
      );

      console.log("totalTrumpAmount : %d", totalTrumpAmount);
      console.log("totalHarrisAmount  : %d", totalHarrisAmount);

      uint256 totalLoserAmount = (keccak256(bytes("trump")) !=
            keccak256(bytes(option)))
            ? totalTrumpAmount
            : totalHarrisAmount; //wei
      uint256 totalWinnerAmount = (keccak256(bytes("trump")) ==
            keccak256(bytes(option)))
            ? totalTrumpAmount + betAmount
            : totalHarrisAmount + betAmount; //wei

      console.log("totalLoserAmount : %d", totalLoserAmount);
      console.log("totalWinnerAmount  : %d", totalWinnerAmount);

      uint256 part = Math.mulDiv(
            totalLoserAmount,
            10 ** ODD_DECIMALS,
            totalWinnerAmount
      );

      console.log("part per ODD_DECIMAL : %d", part);

      (bool success1, uint256 oddwithoutFees) = part.tryAdd(
            10 ** ODD_DECIMALS
      );
      require(success1, "Cannot add part and 1");

      console.log("oddwithoutFees  : %d", oddwithoutFees);

      (bool success2, uint256 odd) = oddwithoutFees.trySub(
            (FEES * 10 ** ODD_DECIMALS) / 100
      );
      require(success2, "Cannot remove fees from odd");

      console.log("odd  : %d", odd);

      return odd;
   }
   ```

## Subsquid

### Local setup

> Note : We don't start from a template but from scratch to understand each steps and be able to customize it

1. Create a simple typescript sub-project

   ```bash
   mkdir squid_indexer && cd squid_indexer && npm init && touch .gitignore
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

1. Create a `schema.graphql` file to define the events you want to persist

   ```bash
   touch schema.graphql
   ```

1. Edit this file

   ```graphQL
   type Bet @entity {
      id: ID! # uint256
      owner: String! # address
      option: String! # string
      amount: BigInt! # uint256
   }
   ```

   > Note : It is possible to use the sqd command `squid-gen-abi` to generate the complete ORM file, ABI types and processor. We do not recommend to do so if you are not expert with SQD because it index by default all blocks, transactions and a generic JSON representation of the events. Then, you have to redefine the generic JSON to a structured entity for querying it easily. Example :
   >
   > ```bash
   > npx squid-gen-abi --event NewBet --abi ../artifacts/contracts/Marketpulse.sol/> Marketpulse.json --address 0x386Dc5E8e0f8252880cFA9B9e607C749899bf13a --archive https://v2.archive.subsquid.io/network/etherlink-testnet --from 16297152
   > ```

1. Regenerate ORM files for the DB

   ```bash
   npx squid-typeorm-codegen
   ```

1. Regenerate the model from ABI

   ```bash
   npx squid-evm-typegen src/abi ../artifacts/contracts/Marketpulse.sol/Marketpulse.json
   ```

1. Create the `./src/main.ts` file

   ```bash
   touch src/main.ts
   ```

1. Edit this file

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

1. Create the local **.env** file

   ```bash
   touch .env
   ```

1. Edit the **.env** file

   ```env
   DB_NAME=squid
   DB_PORT=23798
   GQL_PORT=4350
   ETH_HTTP=https://node.ghostnet.etherlink.com
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

1. Run the GraphQL server locally on another terminal

   ```bash
   npx squid-graphql-server
   ```

1. Go to [GraphQL playground](http://localhost:4350/graphql)

1. Play with graphQL queries, like this one listing all bets

   ```graphQL
   query MyQuery {
      bets {
         id
         option
         owner
         amount
      }
   }
   ```

   It should return all the bets you have already indexed (check on the processor logs to see which blocks have been already processed... If you are sync at 100%, all bets should appear)

## Deploy to SQD Cloud

You can find the SQD Cloud documentation [here](https://docs.sqd.dev/cloud/overview)

1. Install the **SQD CLI**

   ```bash
   npm install -g @subsquid/cli
   ```

1. Create new account on SQD Cloud, then create an api token (https://app.subsquid.io/profile/api-tokens)

1. Authenticate locally with your new generated token from previous step, replacing `<TOKEN>` below

   ```bash
   sqd auth -k <TOKEN>
   ```

1. Add Etherlink Ghostnet to secrets on https://app.subsquid.io/ , submenu `Secrets`

   ```log
   name : ETH_HTTP
   value : https://node.ghostnet.etherlink.com
   ```

1. Prepare the Squid deployment config file `squid.yaml`

   ```bash
   touch squid.yaml
   ```

1. Edit the file `squid.yaml`

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

1. Edit `package.json` to replace the build script

   ```json
   "scripts": {
       "build": "npm i && tsc"
   },
   ```

1. Deploy your squid

   ```bash
   sqd deploy
   ```

1. Wait until it is completely sync at 100% , and then on the [GraphQL UI > General > URL](https://app.subsquid.io/squids/) and query `bets`

# Update the frontend

All bets are indexed, so there is no need to call the blockchain node RPC anymore.

> Note : Other great ideas would be to
>
> - Change the `calculateOdds` function and use aggregated bet amounts directly from the indexer API to faster dapp execution and avoid to loop on the bets arrays
> - Store historical odds data to be able to display great graphs on the frontend page

1.  Go bask to your frontend app

    ```bash
    cd app
    ```

1.  Install GraphQL client libraries

    ```bash
    npm install @apollo/client graphql
    ```

1.  Edit `./src/App.tsx`

    1. Add the GraphQl client initialization at the beginning of the file, after the imports. Replace `YOUR_SQUID_GRAPHQL_ENDPOINT` with your own value from SQD Cloud

       ```typescript
       const graphQlClient = new ApolloClient({
         uri: "YOUR_SQUID_GRAPHQL_ENDPOINT",
         cache: new InMemoryCache(),
       });
       ```

    1. Remove any reference to `dataBetKeys` as we don't need to read the smart contract values

       - `const [betKeys, setBetKeys] = useState<bigint[]>([]);`
       - `const dataBetKeys = await readContract...`
       - all block `useEffect(..., [betKeys]);`

    1. Update end of `reload` function with below code to fetch the bets from the indexer

       ```typescript
       const GET_BETS = gql`
         query MyQuery {
           bets {
             id
             amount
             option
             owner
           }
         }
       `;
       const response = await graphQlClient.query({ query: GET_BETS });

       const bets = (response.data.bets as Marketpulse.BetStruct[]).map(
         (betGraph) => {
           return {
             id: BigInt(betGraph.id),
             amount: BigInt(betGraph.amount),
             option: betGraph.option,
             owner: betGraph.owner,
           };
         }
       );
       setBets(bets);

       //fetch options
       let newOptions = new Map();
       setOptions(newOptions);
       bets.forEach((bet) => {
         if (newOptions.has(bet!.option)) {
           newOptions.set(
             bet!.option,
             newOptions.get(bet!.option)! + bet!.amount
           ); //acc
         } else {
           newOptions.set(bet!.option, bet!.amount);
         }
       });
       setOptions(newOptions);
       console.log("options", newOptions);

       console.log(
         "**********status, winner, fees, bets",
         status,
         winner,
         fees,
         bets
       );
       ```

1.  You are now able to customize the indexer and add more features
