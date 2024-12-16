# Usage of an indexer : TheGraph


## The graph

https://docs.etherlink.com/building-on-etherlink/indexing-graph/

npm install -g @graphprotocol/graph-cli

graph init polymarkteth thegraph --protocol=ethereum 



> Note : buggy if contract is buggy too --network=etherlink-testnet 

> Note : buggy verify on  --from-contract=0xC8787327e1864f5ab5BED66e302Cb123D68ED30f 

> Note : buggy --abi==artifacts/contracts/Polymarkteth.sol/Polymarkteth.json


------
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

---------

graph codegen
graph build

graph auth <DEPLOY_KEY>

graph deploy polymarkteth

Note : very boring to get minimum 0.001 ETH on Arbitrum mainnet, then go to the faucet (https://www.alchemy.com/faucets/arbitrum-sepolia) and register on Alchemy ...

Go to thegraph website and 
test 

then publish your graph   and  .... wait , take a coffee or two ... or three ... 1h ?

