# Etherlink setup

> Etherlink is 100% compatible with Ethereum technology, you can use any tool for development among Hardhat, Foundry, Truffle Suite or Remix IDE: [Developer toolkits](https://docs.etherlink.com/building-on-etherlink/development-toolkits)

In this tutorial, we use [Hardhat](https://hardhat.org/tutorial/creating-a-new-hardhat-project)

1. [Install npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)

1. Initialize the project

    ```bash
    npm init
    npm install -D typescript @types/node ts-node
    ```

1. Install hardhat and initialize it

    ```bash
    npm install -D hardhat
    npx hardhat init
    ```

1. Select `Create a TypeScript project (with Viem)`

1. On `Do you want to install this sample project's dependencies with npm (@nomicfoundation/hardhat-toolbox-viem)? (Y/n)` answer : y

    > Viem : A lightweight, type-safe Ethereum library for JavaScript/TypeScript. It provides low-level, efficient blockchain interactions with minimal abstraction

1. Install @openzeppelin/contracts to use the Math library for safe calculation

    ```bash
    npm i @openzeppelin/contracts
    ```

1. Install dev libraries for viem and verify. Viem 

    ```bash
    npm i -D @nomicfoundation/hardhat-verify
    ```

    > Verify : a feature to verify a contract on an Ethereum Blockchain explorer. It brings source code transparency and verification 

1. (Optional) On VsCode, you have a useful Hardhat/Solidity plugin from Nomic

    [Solidity plugin for VsCode](https://marketplace.visualstudio.com/items?itemName=NomicFoundation.hardhat-solidity)