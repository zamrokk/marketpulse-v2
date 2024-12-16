import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import { ContractFunctionExecutionError, parseEther } from "viem";
const ODD_DECIMALS = 10;
let initAliceAmount = 0n;
let initBobAmount = 0n;

//crap copy pasta from Solidity code
enum BET_RESULT {
  WIN = 0,
  DRAW = 1,
  PENDING = 2,
}

describe("Polymarkteth", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployContractFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, bob] = await hre.viem.getWalletClients();

    // Set block base fee to zero
    await hre.network.provider.send("hardhat_setNextBlockBaseFeePerGas", [
      "0x0",
    ]);

    const polymarktethContract = await hre.viem.deployContract(
      "Polymarkteth",
      []
    );

    const publicClient = await hre.viem.getPublicClient();

    initAliceAmount = await publicClient.getBalance({
      address: owner.account.address,
    });

    initBobAmount = await publicClient.getBalance({
      address: bob.account.address,
    });

    return {
      polymarktethContract,
      owner,
      bob,
      publicClient,
    };
  }

  describe("init function", function () {
    it("should be initialized", async function () {
      const { polymarktethContract, owner } = await loadFixture(
        deployContractFixture
      );

      const ownerFromStorage = await polymarktethContract.read.admin();
      console.log("ownerFromStorage", ownerFromStorage);
      expect(ownerFromStorage.toLowerCase()).to.equal(
        owner.account.address.toLowerCase()
      ); //trick to remove capital letters
    });

    it("should return Pong", async function () {
      const { polymarktethContract, publicClient } = await loadFixture(
        deployContractFixture
      );

      await polymarktethContract.write.ping({ gasPrice: 0n });

      const logs = await publicClient.getContractEvents({
        abi: polymarktethContract.abi,
        eventName: "Pong",
      });
      console.log(logs);
      expect(logs.length).to.equal(1);
    });
  });

  // BET SCENARIO

  //FIXME test suite is so crap that a full scenario should be contained inside the same 'it' , otherwise the full context is reset
  describe("scenario", () => {
    let betTrump1Id: bigint = BigInt(0);
    let betKamala2Id: string = "";
    let bets: any[] = [];

    it("should run the full scenario", async () => {
      console.log("should return a list of empty bets");
      const {
        polymarktethContract,
        owner: alice,
        publicClient,
        bob,
      } = await loadFixture(deployContractFixture);

      expect(await polymarktethContract.read.bets.length).to.equal(0);

      console.log("should return 200");

      const betTrump1IdHash = await polymarktethContract.write.bet(
        ["trump", parseEther("1")],
        { value: parseEther("1"), gasPrice: 0n }
      );
      expect(betTrump1IdHash).not.null;

      // Wait for the transaction receipt
      let receipt = await publicClient.waitForTransactionReceipt({
        hash: betTrump1IdHash,
      });

      expect(receipt.status).equals("success");

      bets = [...(await polymarktethContract.read.bets())];
      console.log("betKeys", betKeys);

      betTrump1Id = betKeys[0];

      console.log("should find the bet");

      const betTrump1 = await polymarktethContract.read.getBets([betTrump1Id]);

      expect(betTrump1).not.null;

      expect(betTrump1.owner.toLowerCase()).equals(
        alice.account.address.toLowerCase()
      );
      expect(betTrump1.option).equals("trump");
      expect(betTrump1.amount).equals(parseEther("1"));

      console.log("should get a correct odd of 0.9 (including fees)");

      let odd = await polymarktethContract.read.calculateOdds([
        "trump",
        parseEther("1"),
      ]);

      expect(odd).equals(BigInt(Math.floor(0.9 * 10 ** ODD_DECIMALS))); //rounding

      console.log("should return 200");

      // Set block base fee to zero
      await hre.network.provider.send("hardhat_setNextBlockBaseFeePerGas", [
        "0x0",
      ]);

      const betKamala2IdHash = await polymarktethContract.write.bet(
        ["kamala", parseEther("2")],
        { value: parseEther("2"), account: bob.account.address, gasPrice: 0n }
      );
      expect(betKamala2IdHash).not.null;

      // Wait for the transaction receipt
      receipt = await publicClient.waitForTransactionReceipt({
        hash: betKamala2IdHash,
      });

      expect(receipt.status).equals("success");

      betKeys = [...(await polymarktethContract.read.getBetKeys())];
      console.log("betKeys", betKeys);

      const betKamala2Id = betKeys[1];

      console.log("should find the bet");

      const betKamala2 = await polymarktethContract.read.getBets([
        betKamala2Id,
      ]);

      expect(betKamala2).not.null;

      expect(betKamala2.owner.toLowerCase()).equals(
        bob.account.address.toLowerCase()
      );
      expect(betKamala2.option).equals("kamala");
      expect(betKamala2.amount).equals(parseEther("2"));

      console.log("should get a correct odd of 1.9 for trump (including fees)");

      odd = await polymarktethContract.read.calculateOdds([
        "trump",
        parseEther("1"),
      ]);

      expect(odd).equals(BigInt(Math.floor(1.9 * 10 ** ODD_DECIMALS)));

      console.log(
        "should get a correct odd of 1.23333 for kamala (including fees)"
      );

      odd = await polymarktethContract.read.calculateOdds([
        "kamala",
        parseEther("1"),
      ]);

      expect(odd).equals(
        BigInt(Math.floor((1 + 1 / 3 - 0.1) * 10 ** ODD_DECIMALS))
      );

      console.log("should return 200 with all correct balances");

      await polymarktethContract.write.resolveResult(
        ["trump", BET_RESULT.WIN],
        { gasPrice: 0n }
      );

      expect(
        await publicClient.getBalance({
          address: polymarktethContract.address,
        })
      ).equals(parseEther("0.1"));
      expect(
        await publicClient.getBalance({ address: alice.account.address })
      ).equals(initAliceAmount + parseEther("1.9")); // -1+2.9

      expect(
        await publicClient.getBalance({ address: bob.account.address })
      ).equals(initBobAmount - parseEther("2")); //-2

      console.log("should have state finalized");

      const result = await polymarktethContract.read.status();
      expect(result).not.null;
      expect(result).equals(BET_RESULT.WIN);

      console.log("should return 500 if we try to reapply results");

      try {
        await polymarktethContract.write.resolveResult(
          ["trump", BET_RESULT.WIN],
          { gasPrice: 0n }
        );
      } catch (e) {
        expect((e as ContractFunctionExecutionError).details).equals(
          "VM Exception while processing transaction: reverted with reason string 'Result is already given and bets are resolved : \x00'"
        );
      }
    });
  });
});
