## The graph

There is already a generic example of Etherlink configuration [here](https://docs.etherlink.com/building-on-etherlink/indexing-graph/)

> Note : you need to have Node version >= v20.18.1

1. Install the Graph CLI

   ```bash
   npm install -g @graphprotocol/graph-cli
   ```

1. Initialize the project

   ```bash
   graph init marketpulse thegraph_indexer --protocol=ethereum
   ```

   > Choose :
   > Network: etherlink-testnet
   > Source: Smart contract
   > Contract address: 0x386Dc5E8e0f8252880cFA9B9e607C749899bf13a
   > Start block: 16297152
   > Index contract events as entities: Y
   > Add another contract? : N

1. (Optional) All files have been generated, but if you need to modify and regenerate the new files, run :

   ```bash
   graph codegen
   graph build
   ```

1. Authenticate to the Graph Cloud replacing your API KEY `<DEPLOY_KEY>` below. To create it, [follow these steps first](https://thegraph.com/docs/en/subgraphs/querying/managing-api-keys/#create-and-manage-api-keys)

   ```bash
   graph auth <DEPLOY_KEY>
   ```

1. Go to the [Graph Studio website](https://thegraph.com/studio/) and create a subgraph named `marketpulse`

1. Deploy your graph version `0.0.1` to the Graph Studio

   ```bash
   graph deploy marketpulse -l 0.0.1
   ```

1. Go back to the [Graph Studio playground page](https://thegraph.com/studio/subgraph/marketpulse/playground) and query it

   ```graphQL
   {
   newBets {
       id
       bet_id
       bet_owner
       bet_option
   }
   }
   ```

1. (Optional) To publish your graph to the community and get other indexer workers to index it, you need first a minimum of 0.001 ETH on Arbitrum mainnet to claim testnet Sepolia tokens, and then you can claim Sepolia tokens on this [faucet](https://www.alchemy.com/faucets/arbitrum-sepolia)

