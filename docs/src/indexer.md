# Usage of an indexer

Rebuild the relational DB behind the contract.
For example : list all bets from same users without loading into memory and looping all bets

## The graph

https://docs.etherlink.com/building-on-etherlink/indexing-graph/

npm install -g @graphprotocol/graph-cli

graph init marketpulse thegraph --protocol=ethereum

> Note : buggy if contract is buggy too --network=etherlink-testnet

> Note : buggy verify on --from-contract=0x70Ad27abcCc0596be6507fc61c18364699564f6b

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


##
