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
   > Source: smart contract
   > Contract address: 0x386Dc5E8e0f8252880cFA9B9e607C749899bf13a
   > abi: artifacts/contracts/Marketpulse.sol/Marketpulse.json
   > Start block: 16297152 
   > Index contract events as entities: Y

---

1. Add a new event to the 

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
