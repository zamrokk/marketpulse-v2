import {
  EthereumProject,
  EthereumDatasourceKind,
  EthereumHandlerKind,
} from "@subql/types-ethereum";

import * as dotenv from 'dotenv';
import path from 'path';

const mode = process.env.NODE_ENV || 'production';

// Load the appropriate .env file
const dotenvPath = path.resolve(__dirname, `.env${mode !== 'production' ? `.${mode}` : ''}`);
dotenv.config({ path: dotenvPath });

// Can expand the Datasource processor types via the generic param
const project: EthereumProject = {
  specVersion: "1.0.0",
  version: "0.0.1",
  name: "etherlink-testnet-starter",
  description:
    "This project can be use as a starting point for developing your new Etherlink SubQuery project",
  runner: {
    node: {
      name: "@subql/node-ethereum",
      version: ">=3.0.0",
    },
    query: {
      name: "@subql/query",
      version: "*",
    },
  },
  schema: {
    file: "./schema.graphql",
  },
  network: {
    /**
     * chainId is the EVM Chain ID, for Etherlink this is 128123
     * https://chainlist.org/chain/128123
     */
    chainId: process.env.CHAIN_ID!,
    /**
     * These endpoint(s) should be public non-pruned archive node
     * We recommend providing more than one endpoint for improved reliability, performance, and uptime
     * Public nodes may be rate limited, which can affect indexing speed
     * When developing your project we suggest getting a private API key
     * If you use a rate limited endpoint, adjust the --batch-size and --workers parameters
     * These settings can be found in your docker-compose.yaml, they will slow indexing but prevent your project being rate limited
     */
    endpoint: process.env.ENDPOINT!?.split(',') as string[] | string,
    
  },
  dataSources: [{
    kind: EthereumDatasourceKind.Runtime,
    startBlock: 16297152,
    options: {
      abi: 'Marketpulse',
      address: '0x386Dc5E8e0f8252880cFA9B9e607C749899bf13a',
    },
    assets: new Map([['Marketpulse', {file: './abis/Marketpulse.json'}]]),
    mapping: {
      file: './dist/index.js',
      handlers: [
  {
    handler: "handleAddressToStringMarketpulseTx",
    kind: EthereumHandlerKind.Call,
    filter: {
      function: "addressToString(address)"
    }
  },
  {
    handler: "handleBetMarketpulseTx",
    kind: EthereumHandlerKind.Call,
    filter: {
      function: "bet(string,uint256)"
    }
  },
  {
    handler: "handlePingMarketpulseTx",
    kind: EthereumHandlerKind.Call,
    filter: {
      function: "ping()"
    }
  },
  {
    handler: "handleResolveResultMarketpulseTx",
    kind: EthereumHandlerKind.Call,
    filter: {
      function: "resolveResult(string,uint8)"
    }
  },
  {
    handler: "handleNewBetMarketpulseLog",
    kind: EthereumHandlerKind.Event,
    filter: {
      topics: [
        "NewBet((uint256,address,string,uint256))"
      ]
    }
  },
  {
    handler: "handlePongMarketpulseLog",
    kind: EthereumHandlerKind.Event,
    filter: {
      topics: [
        "Pong()"
      ]
    }
  }
]
    }
  },],
  repository: "https://github.com/subquery/ethereum-subql-starter",
};

// Must set default to the project instance
export default project;
