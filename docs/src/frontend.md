# Frontend

> Prerequisites : Install [Deno](https://docs.deno.com/runtime/getting_started/installation/)

1. Create a frontend app. Here we use deno, vite and React to start a default project

   ```bash
   deno run -A npm:create-vite@latest
   ```

1. Choose a name (like **app**), **React** framework and **Typescript**

1. Run the commands of the output. Here is my case :

   ```bash
   cd app
   npm install
   npm run dev
   ```

   The server is running

1. Go back to your project and import the **Viem** library for blockchain interactions, **thirdweb** for the wallet connection, **bignumber** because we are doing calculations on large numbers

   ```bash
   npm i viem thirdweb bignumber.js
   ```

1. Add **typechain** library to dev dependency to generate your contracts structures and abi for Typescript

   ```bash
   npm i -D typechain @typechain/ethers-v6
   ```

1. Change your **./app/package.json** file to add this script below. It copied the output address of the last deployed contract into your source files and call typechain to generate types from your abi file

   ```json
    "postinstall": "cp ../ignition/deployments/chain-128123/deployed_addresses.json ./src  &&  typechain --target=ethers-v6 --out-dir=./src/typechain-types --show-stack-traces ../artifacts/contracts/Polymarkteth.sol/Polymarkteth.json",
   ```

1. Run **npm i** to call the postinstall script automatically. You should see new files on your **./app/src** folder

1. Create an utility file to manage Viem errors. Better to have nicer error display than technical and not helpful ones

   ```bash
   touch ./app/src/DecodeEvmTransactionLogsArgs.ts
   ```

1. Edit **./app/src/DecodeEvmTransactionLogsArgs.ts** with

   ```Typescript
   import {
   Abi,
   BaseError,
   ContractFunctionRevertedError,
   decodeErrorResult,
   } from "viem";

   // Type-Safe Error Handling Interface
   interface DetailedError {
   type: "DecodedError" | "RawError" | "UnknownError";
   message: string;
   details?: string;
   errorData?: any;
   }

   // Advanced Error Extraction Function
   export function extractErrorDetails(error: unknown, abi: Abi): DetailedError {
   // Type guard for BaseError
   if (error instanceof BaseError) {
       // Type guard for ContractFunctionRevertedError
       if (error.walk() instanceof ContractFunctionRevertedError) {
       try {
           // Safe data extraction
           const revertError = error.walk() as ContractFunctionRevertedError;

           // Extract error data safely
           const errorData = (revertError as any).data;

           // Attempt to decode error
           if (errorData) {
           try {
               // Generic error ABI for decoding
               const errorAbi = abi;

               const decodedError = decodeErrorResult({
               abi: errorAbi,
               data: errorData,
               });

               return {
               type: "DecodedError",
               message: decodedError.errorName || "Contract function reverted",
               details: decodedError.args?.toString(),
               errorData,
               };
           } catch {
               // Fallback if decoding fails
               return {
               type: "RawError",
               message: "Could not decode error",
               errorData,
               };
           }
           }
       } catch (extractionError) {
           // Fallback error extraction
           return {
           type: "UnknownError",
           message: error.shortMessage || "Unknown contract error",
           details: error.message,
           };
       }
       }

       // Generic BaseError handling
       return {
       type: "RawError",
       message: error.shortMessage || "Base error occurred",
       details: error.message,
       };
   }

   // Fallback for non-BaseError
   return {
       type: "UnknownError",
       message: String(error),
       details: error instanceof Error ? error.message : undefined,
   };
   }

   ```

1. Edit **./app/src/main.tsx**, an add **Thirdweb** provider around your application. You need to replace **<THIRDWEB_CLIENTID>** below by your own clientId configured on the [Thirdweb dashboard](https://portal.thirdweb.com/typescript/v4/getting-started#initialize-the-sdk)

   ```Typescript
   import { createRoot } from "react-dom/client";
   import { createThirdwebClient } from "thirdweb";
   import { ThirdwebProvider } from "thirdweb/react";
   import App from "./App.tsx";
   import "./index.css";

   const client = createThirdwebClient({
   clientId: "<THIRDWEB_CLIENTID>",
   });

   createRoot(document.getElementById("root")!).render(
   <ThirdwebProvider>
       <App thirdwebClient={client} />
   </ThirdwebProvider>
   );
   ```

1. Edit `App.tsx`

   ```Typescript
   import { Polymarkteth, Polymarkteth__factory } from "./typechain-types";

   import BigNumber from "bignumber.js";
   import { useEffect, useState } from "react";
   import "./App.css";

   import {
   defineChain,
   getContract,
   prepareContractCall,
   readContract,
   sendTransaction,
   ThirdwebClient,
   waitForReceipt,
   } from "thirdweb";
   import { ConnectButton, useActiveAccount } from "thirdweb/react";
   import { createWallet, inAppWallet } from "thirdweb/wallets";
   import { parseEther } from "viem";
   import { etherlinkTestnet } from "viem/chains";
   import { extractErrorDetails } from "./DecodeEvmTransactionLogsArgs";
   import CONTRACT_ADDRESS_JSON from "./deployed_addresses.json";

   const wallets = [
   inAppWallet({
       auth: {
       options: ["google", "email", "passkey", "phone"],
       },
   }),
   createWallet("io.metamask"),
   createWallet("com.coinbase.wallet"),
   createWallet("io.rabby"),
   createWallet("com.trustwallet.app"),
   createWallet("global.safe"),
   ];

   //copy pasta from Solidity code as Abi and Typechain does not export enum types
   enum BET_RESULT {
   WIN = 0,
   DRAW = 1,
   PENDING = 2,
   }

   interface AppProps {
   thirdwebClient: ThirdwebClient;
   }

   export default function App({ thirdwebClient }: AppProps) {
   console.log("*************App");

   const account = useActiveAccount();

   const [options, setOptions] = useState<Map<string, bigint>>(new Map());

   const [error, setError] = useState<string>("");

   const [status, setStatus] = useState<BET_RESULT>(BET_RESULT.PENDING);
   const [winner, setWinner] = useState<string | undefined>(undefined);
   const [fees, setFees] = useState<number>(0);
   const [betKeys, setBetKeys] = useState<bigint[]>([]);
   const [_bets, setBets] = useState<Polymarkteth.BetStruct[]>([]);

   const reload = async () => {
       if (!account?.address) {
       console.log("No address...");
       } else {
       const dataStatus = await readContract({
           contract: getContract({
           abi: Polymarkteth__factory.abi,
           client: thirdwebClient,
           chain: defineChain(etherlinkTestnet.id),
           address: CONTRACT_ADDRESS_JSON["PolymarktethModule#Polymarkteth"],
           }),
           method: "status",
           params: [],
       });

       const dataWinner = await readContract({
           contract: getContract({
           abi: Polymarkteth__factory.abi,
           client: thirdwebClient,
           chain: defineChain(etherlinkTestnet.id),
           address: CONTRACT_ADDRESS_JSON["PolymarktethModule#Polymarkteth"],
           }),
           method: "winner",
           params: [],
       });

       const dataFEES = await readContract({
           contract: getContract({
           abi: Polymarkteth__factory.abi,
           client: thirdwebClient,
           chain: defineChain(etherlinkTestnet.id),
           address: CONTRACT_ADDRESS_JSON["PolymarktethModule#Polymarkteth"],
           }),
           method: "FEES",
           params: [],
       });

       const dataBetKeys = await readContract({
           contract: getContract({
           abi: Polymarkteth__factory.abi,
           client: thirdwebClient,
           chain: defineChain(etherlinkTestnet.id),
           address: CONTRACT_ADDRESS_JSON["PolymarktethModule#Polymarkteth"],
           }),
           method: "getBetKeys",
           params: [],
       });

       setStatus(dataStatus as unknown as BET_RESULT);
       setWinner(dataWinner as unknown as string);
       setFees(Number(dataFEES as unknown as bigint) / 100);
       setBetKeys(dataBetKeys as unknown as bigint[]);

       console.log(
           "**********status, winner, fees, betKeys",
           status,
           winner,
           fees,
           betKeys
       );
       }
   };

   //first call to load data
   useEffect(() => {
       (() => reload())();
   }, [account?.address]);

   //fetch bets

   useEffect(() => {
       (async () => {
       if (!betKeys || betKeys.length === 0) {
           console.log("no dataBetKeys");
           setBets([]);
       } else {
           const bets = await Promise.all(
           betKeys.map(
               async (betKey) =>
               (await readContract({
                   contract: getContract({
                   abi: Polymarkteth__factory.abi,
                   client: thirdwebClient,
                   chain: defineChain(etherlinkTestnet.id),
                   address:
                       CONTRACT_ADDRESS_JSON["PolymarktethModule#Polymarkteth"],
                   }),
                   method: "getBets",
                   params: [betKey],
               })) as unknown as Polymarkteth.BetStruct
           )
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
       }
       })();
   }, [betKeys]);

   const Ping = () => {
       // Comprehensive error handling
       const handlePing = async () => {
       try {
           const preparedContractCall = await prepareContractCall({
           contract: getContract({
               abi: Polymarkteth__factory.abi,
               client: thirdwebClient,
               chain: defineChain(etherlinkTestnet.id),
               address: CONTRACT_ADDRESS_JSON["PolymarktethModule#Polymarkteth"],
           }),
           method: "ping",
           params: [],
           });

           console.log("preparedContractCall", preparedContractCall);

           const transaction = await sendTransaction({
           transaction: preparedContractCall,
           account: account!,
           });

           //wait for tx to be included on a block
           const receipt = await waitForReceipt({
           client: thirdwebClient,
           chain: defineChain(etherlinkTestnet.id),
           transactionHash: transaction.transactionHash,
           });

           console.log("receipt :", receipt);

           setError("");
       } catch (error) {
           const errorParsed = extractErrorDetails(
           error,
           Polymarkteth__factory.abi
           );
           setError(errorParsed.message);
       }
       };

       return (
       <span style={{ alignContent: "center", paddingLeft: 100 }}>
           <button onClick={handlePing}>Ping</button>
           {!error || error === "" ? <>&#128994;</> : <>&#128308;</>}
       </span>
       );
   };

   const BetFunction = () => {
       const [amount, setAmount] = useState<BigNumber>(BigNumber(0)); //in Ether decimals
       const [option, setOption] = useState("trump");

       const runFunction = async () => {
       try {
           const contract = getContract({
           abi: Polymarkteth__factory.abi,
           client: thirdwebClient,
           chain: defineChain(etherlinkTestnet.id),
           address: CONTRACT_ADDRESS_JSON["PolymarktethModule#Polymarkteth"],
           });

           const preparedContractCall = await prepareContractCall({
           contract,
           method: "bet",
           params: [option, parseEther(amount.toString(10))],
           value: parseEther(amount.toString(10)),
           });

           const transaction = await sendTransaction({
           transaction: preparedContractCall,
           account: account!,
           });

           //wait for tx to be included on a block
           const receipt = await waitForReceipt({
           client: thirdwebClient,
           chain: defineChain(etherlinkTestnet.id),
           transactionHash: transaction.transactionHash,
           });

           console.log("receipt :", receipt);

           await reload();

           setError("");
       } catch (error) {
           const errorParsed = extractErrorDetails(
           error,
           Polymarkteth__factory.abi
           );
           setError(errorParsed.message);
       }
       };

       const calculateOdds = (option: string, amount?: bigint): BigNumber => {
       //check option exists
       if (!options.has(option)) return new BigNumber(0);

       console.log(
           "actuel",
           options && options.size > 0
           ? new BigNumber(options.get(option)!.toString()).toString()
           : 0,
           "total",
           new BigNumber(
           [...options.values()]
               .reduce((acc, newValue) => acc + newValue, amount ? amount : 0n)
               .toString()
           ).toString()
       );

       return options && options.size > 0
           ? new BigNumber(options.get(option)!.toString(10))
               .plus(
               amount ? new BigNumber(amount.toString(10)) : new BigNumber(0)
               )
               .div(
               new BigNumber(
                   [...options.values()]
                   .reduce(
                       (acc, newValue) => acc + newValue,
                       amount ? amount : 0n
                   )
                   .toString(10)
               )
               )
               .plus(1)
               .minus(fees)
           : new BigNumber(0);
       };

       return (
       <span style={{ alignContent: "center", width: "100%" }}>
           {status && status === BET_RESULT.PENDING ? (
           <>
               <h3>Choose candidate</h3>

               <select
               name="options"
               onChange={(e) => setOption(e.target.value)}
               value={option}
               >
               <option value="trump">Donald Trump</option>
               <option value="harris">Kamala Harris</option>
               </select>
               <h3>Amount</h3>
               <input
               type="number"
               id="amount"
               name="amount"
               required
               onChange={(e) => {
                   if (e.target.value && !isNaN(Number(e.target.value))) {
                   //console.log("e.target.value",e.target.value)
                   setAmount(new BigNumber(e.target.value));
                   }
               }}
               />

               <hr />
               {account?.address ? <button onClick={runFunction}>Bet</button> : ""}

               <table style={{ fontWeight: "normal", width: "100%" }}>
               <tbody>
                   <tr>
                   <td style={{ textAlign: "left" }}>Avg price (decimal)</td>
                   <td style={{ textAlign: "right" }}>
                       {options && options.size > 0
                       ? calculateOdds(option, parseEther(amount.toString(10)))
                           .toFixed(3)
                           .toString()
                       : 0}
                   </td>
                   </tr>

                   <tr>
                   <td style={{ textAlign: "left" }}>Potential return</td>
                   <td style={{ textAlign: "right" }}>
                       XTZ{" "}
                       {amount
                       ? calculateOdds(option, parseEther(amount.toString(10)))
                           .multipliedBy(amount)
                           .toFixed(6)
                           .toString()
                       : 0}{" "}
                       (
                       {options && options.size > 0
                       ? calculateOdds(option, parseEther(amount.toString(10)))
                           .minus(new BigNumber(1))
                           .multipliedBy(100)
                           .toFixed(2)
                           .toString()
                       : 0}
                       %)
                   </td>
                   </tr>
               </tbody>
               </table>
           </>
           ) : (
           <>
               <span style={{ color: "#2D9CDB", fontSize: "1.125rem" }}>
               Outcome: {BET_RESULT[status]}
               </span>
               {winner ? <div style={{ color: "#858D92" }}>{winner}</div> : ""}
           </>
           )}
       </span>
       );
   };

   const resolve = async (option: string) => {
       try {
       const preparedContractCall = await prepareContractCall({
           contract: getContract({
           abi: Polymarkteth__factory.abi,
           client: thirdwebClient,
           chain: defineChain(etherlinkTestnet.id),
           address: CONTRACT_ADDRESS_JSON["PolymarktethModule#Polymarkteth"],
           }),
           method: "resolveResult",
           params: [option, BET_RESULT.WIN],
       });

       console.log("preparedContractCall", preparedContractCall);

       const transaction = await sendTransaction({
           transaction: preparedContractCall,
           account: account!,
       });

       //wait for tx to be included on a block
       const receipt = await waitForReceipt({
           client: thirdwebClient,
           chain: defineChain(etherlinkTestnet.id),
           transactionHash: transaction.transactionHash,
       });

       console.log("receipt :", receipt);

       await reload();

       setError("");
       } catch (error) {
       const errorParsed = extractErrorDetails(error, Polymarkteth__factory.abi);
       setError(errorParsed.message);
       }
   };

   return (
       <>
       <header>
           <span style={{ display: "flex" }}>
           <h1>Polymarktez </h1>

           <div className="flex items-center gap-4">
               <ConnectButton
               client={thirdwebClient}
               wallets={wallets}
               connectModal={{ size: "compact" }}
               chain={defineChain(etherlinkTestnet.id)}
               />
           </div>
           </span>
       </header>

       <div id="content" style={{ display: "flex", paddingTop: 10 }}>
           <div style={{ width: "calc(66vw - 4rem)" }}>
           <span style={{ display: "flex" }}>
               <img
               style={{ width: "72px", paddingRight: 15 }}
               src="https://polymarket.com/_next/image?url=https%3A%2F%2Fpolymarket-upload.s3.us-east-2.amazonaws.com%2Fpresidential-election-winner-2024-afdda358-219d-448a-abb5-ba4d14118d71.png&w=1018&q=100"
               ></img>
               <h2>Presidential Election Winner 2024</h2>
           </span>
          <img alt="" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABHEAAAGoCAYAAADB4XkBAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAAFiUAABYlAUlSJPAAAM9vSURBVHhe7N0HfBzVuTbwZ7Y37aqumiXLlmzJljvGxsYGYwymd0ILISEJ6Qkh7UsnCbk3pFySm3AvIYFcQoDQezFgjBvGvWJbrnKRrS6tyvbyzZkZeVfVkiyr2M/fv7HOlF3trnZnZ955z3ukvNI5MRARERERERER0bCm034SEREREREREdEwxiAOEREREREREdEIwCAOEREREREREdEIwCAOEREREREREdEIwCAOEREREREREdEIwCAOEREREREREdEIwCAOEdEQ0lvssBm1GSIiIiIioh5IeaVzYlp7yGTOuQbXT7Brc5poCP7mJhw6sA0btlWiOaItHy5KFuLLczNR8dEzeH23tqwnyvYOfPLGa1hZrS1LpN1frxzbgEfe2avNjGwTFt+KC3Mlba6DTs/TgIxJs7FgUg5SbAboYmEEmuqxa8NH+PiQT9ume+nnXY2bJjq0uQ5a9uLl5zagSpnRIW3qAlw9PRMWKYym8vV4dVk5WpV1qpSZV+DmyWGsf/ZdbPZqC4ehiZfdhgucic9No8/A/BsuRmlSWH4Pvym/h0/++g2+NMz/1KUoRRePv7/cM/Hpq8bB08PnVnnNcqqw4vEPsFNbdtq4Z+D2K4vhDB3Gu/9ajQPa4oGkHzsfn10wCsZ27/E4vSMPcxfMRHGGBQYphrDXg8M71mLZjnqEtG26p0NSwRQsOKcI2S6jPBdFqLUBe9Z+hI/KW5C429anTMSVl09GjkVCuPkIVry5GnsSPzvJU/Cp6ycivOlVvLR1OL4fiYiIiIiG3oBk4nw5w4E3x6Vj/+QsZRJtsaxvmrBv7SasbpvW78WhoBXjpl+E225dhOkpZ3jSUGVZ/Llr075GsaLD6yKmnQNyOjsMpCLVKQGNh9o/vy6fpw7Zcy7H9bPy4PAexkaxfvNB1OrTMe3iK3F1iVXbrnsZLjvgr8LWjr9Hua9D8GjbIfdcXHVOKlr2b5eXHwcKzsOVM13aSpllHOZNdKJl18bTHsCxzLwCSXf8AsnffFyZRFssOzVWTLzkwmEewDlLBIMIxoCoz9suSDhgbONwxdxR6DbRR6y/bh5Kk4M4vEN8FnZgv9eGglmX4uY5GdBrm3XHXrIAn1o4AW4c1z5Xu3Ek7ETpQvkzOSnxM5mFCy6biozWcqyXf8dh5GHB4ilI0dYCZkw8rxjJLXuwmgEcIiIiIqJunVJkZLRJrwRsfpSdhMlWI4ySpEyiLZaJdWKb3vHh2Cdl2H5i2oplr7+Kx17eimopA7OvXICJNm3TM1FjRcJzV6djSoCg4+siT4eblJuMfGlITQJajnd4fl09z+QpuHCCA5FjG/Hca2uxUazfsgGvv/gmNtQYkDtzJop6fKulId0lAfVHsKbj7xHT3hr4tS0z8zNhrdmJN1bukH/HKizb40Nqdi4sylodis6fitzQIaxeX6csOR10LrcasJl/K/TuMYDeoEyiLZaJdWKbvrNi4uIrMC/HgKZdy/EWAzhDq3EHXvi/Z/Doi5sHJtOoHSsmLZiG3Eg1jnW5y9Bh/Fx5vbEFn7z/Nt5dLz4LO7DstbfwUWUEzgmzcG6ytmlXLCW4ZE4m9A2f4KUXV2Ot8lnaindffA9bPDpkzZA/k9qmcI9CrrUOm5aIz+4OvLvyALwpWShQP1TQj52FOTlh7Pt4y2l4HYiIiIiIzhynFMT5n9EpSsCmO2Kd2OZURBp24vX396PFlIk5c/JPemWYRhC3CyK/xdNw8mBIekkekuHFvi1722csRFqwYcsh+E25mDTBrC3sSiqSHUCLp16bP4lI+ERXkmg0Jp+wWqDklrln4LzREio2b8Kh09jFz37V19TgTTfEOrFN34hspkWYl2tEy/5VeHVNTbvuLnRmyTxvEeZmhbFn1TY0dLWn1xeiOM+A6PHd+Kgyqi0UfNix9bD8vxPFk7O0ZV3Iz4JbEkmEO9CgLVJ50CQ+pAYjTOoCTQSh+IdK/s8Mm/KhSsPcmaOAYzvw0ZHEx0FERERERB3pXe68+7V2n4juUjelnLwLS6ZRD598XL7BG9SWdObIK8aEjCAObT6IGm1ZolhLLfSjJiDfrUODfHIRPw0X9RimYvHF87BgzlScO30SphXnIV3e4nC1D/HTAVFb4zpckRfAVm8+rr1yPi6YNRXnTB6HfFsLjhxtalf7QdSImHfpxbj0/OmYNWMyZpSORo7Zh4pjCdulj8HMPAeaj+zAnlptmWAbhfMWzcfieTMxW7ttmu84ynW5OCfPhJo9ZTjcy34TGUWTMTqptfPrIurnXDMZ1uNVcM69GFfPn4lS63FsOzoKV9+9GAszA9iwr32wQtQduvPSXHjb7qvtPioOQz9lIa5bNAvnzSjFJPkEv+ZgJZotozB/8cW4bN50+XUtxdSxyfAdqUCt6PvR7e3F8x2LfLsXFceblG4iPcorwdw8CUe2nvw1KZh0jvxa1GPXyi7eI6025E/LQXq4HpsPnugU1Z57LGaNT4Nn77r2f68u+M2ZmFKaC0ftIVRJefJ7YCysldux5nAE0xfORUFwN95ZdexE5s5AE92lTBPna3Pd09lTgHAA4WPd10dS3kPmeuz+5Jj8N7sI189IRezYRry4tH2Nnza9eu+LujK3XIjRvp2oc1+A6y+fg/PPkT97RS54D8vvkYgLky65FNdcMEO+D/GZzIGp/hCONieeoIv6RvNxzaXnYd7MKZg5bQImjklBpKoC1f62N44No0sL4ZY/z+LxJz7eXj3OrthzMEV+HwQ6fm4TdP25683jje9ndoXG4qrLz5f3M1nwifvp9jNrO3Gb+GfWgNzpF+FK+TOV+LtitcdR5e1dkEOfNRNXz8lCcPdyvPlJFHldvY5jSjF/jBP1ez7GzqoO4Tz5b5U2oQBZJi/27q5CQFvcTlMl9u3dj31VAYTaPSwXCqeOQ5ahEXvb9td+E3InFaPAXo+9NRLGyH+zEks11q2rQHTqfCwcHcK299fi0On6UBERERERnSH6nYlzdbKWB98Lfdm2awEcq5VPPQwpyD7Rg0RkFVyJ2xaWID3WVo9hB8o8JqWew6cXj0OHUskImsbg5kWjEdi/DWvk7bdWRpExYR6uPS9N20KWPAnX3zQPE1xe7N+s1kvZWm1A9uR5+NRFJ8kEso3D1TfMx7RMA6rLtiu33bg/gMx5l+GKgoEefkbC6AsW41xLLbas34T1B1q05X0RgrX0YsxNqcd2cR97m6B3T8Bl8yZg1uLzUaQ7ptae2V6FoDMfC64+F7naLVURZMy+EpeMlXBoS9trJSmv6acu6fz6d5SdlgTEWuFPmonrb78FX777NmW65/ZLMb/A0e61bvWJ00gLHE51vp2MZIjFRrOl27+PPt0Fh3z62hwrwRU334x72n7XZ67BFZNS29UMiexfjzXHTCi+9AZ89sY5GBPZjw/XV0I/diZmZHixa/W2DpkHA8tYPFtrnVxvt7Xkzca1czKBuk/w1nsdspna9Om9H0IsewEumxDG/o2b5fdIJQKOfFxw8SRMW7AIc5M92L5Ovo9NB9FoSMO0xRdh2ondgA5FF12L62dlQV+9W/k9qzcfRqstD/OuXYyZPXXhEU7lM9ovfXu8QecE3HpRrrafKcMxbXlvP7OZ512OK6enABXa71q3B5W6bMy9+nLMz+rFLlufgXkXjIOjZR+WravpNttKbzHJ7/swWpu7CtG0oEX0tLPa0e2fI+SHp6kZ3hNRMx0sSZmYIv+tpziDOLJuA/ZpaxApx4p1lTCPvxCfvf1KXDw6ip2rtqBCn495k9Pg3b0W65QaYERERERE1JN+B3FKLAatdXJ92bY7tR5x2tmWfi+fgMgnpZdOcMC7Zxn+9VJbPYYdWPn263h9VyuMuefgkkntu9eY0u2oXPY63lJqP5Rh7bsfYptHgrOgENnaNkXnTEB6tBofvbwEy7a0bfc63jsYhLmgCMXdniHKJ3pzpqr1Jd6RH8OaHcptN655H0+/XY6k7FRtu4Fig7ll84n6MGVVXV4rP4lkFDgO4JW3Nij3sXHlEnxwMADjmGmYhl14pa32zPoP8caOJvmELgtF7XpXOOG2Hsbr/058rV7FUxvroM+ZhoUlPXVv0iHNZZPPa904Z758wrv3Y7z2whK8vWonjoZTULrwMlyRUKz46NFahODC2OKEAsMKHUYX56pdnRxOpCvLOnOniC3sKJlbqmTVLHn1Dbz24XbsbTRiVKcirj7sXPIi/vHvN/DMCy/jHy+uw6FQNi6cPQo4tAUfdTW62ADSp+VprZPr1baWUbjgwrFw+g7gnTe24Xg3Z/V9e+/Lr1uWD6te0T578nvkpS310KWV4rzsKnzw4nJ1+Za1eHlNBUJSOvLHarsb5yTMGGOCt+wD/PvdrcrvEdu9+PIO1OqSUTIhIajahf5/Rvupj4/XJL/V9sn7AHU/U4F4bKI3n9lUFOU5oKvZiVeWab+rrc5MkwMTZo7XajN1x4wJiy7EBLsHW97b0O3fWkgXhb4RgLfLWFKzGsSxWE8ajFWI7Ky7b8Fnb16IWc5GbPrgHbzbod5S6+4P8Y9/vSx/pt7AP596AyuOhDB63jkYg6P4eN3pqy9FRERERHQm6XcQZ6iNGT8K1nAF1q2p6tB9Iorja9Zjr09C1rhipebKCd4K7GpXc8GDQ5Ve+dzKoY2SosPBD5/HI/9cih2Jow7pjahtaAIkB9K6Pb8chcJcYxf1JYBI5SZsOBLW5gZKGEd37+k6o6IPKvfvTriPKA4eV085aw+Utcs2aaish18+CXW2uywfQ+XOrZ1OFFu3bsc+vwHZBT1lRaQhTaTPxNSg11vrD+FYUz0O7dmKt178ALtajMiddS7Ga3cQ2f8JdjfHkDzpIlw5KRNJFoN61f/Sq7F4bCuqRdcYnzc+wlQ7WsBIfqdUrHkLL67cjUN1zTh2oOciriFvMzxNfuX9lTJ9Ooosddi05vDIqyPjbURtICa/z/MwY1x3XSD7/t5vObyvXV2g1oo6iHiA/8g+7EtYHqmoVd5LTpdWH6t1B158/Bn8a3X7LBGj/Nerl3+3w9VTwPNUPqNxuXPVTKyupgtytI3a9PXxNpRjS4d9gKo3n9lWtPrkv1V6IeYWOhMyxDz4+MVn8Ogbu3vsxmcvOR9zcyUcW7tscDNb6rbj1RfewIvvrcPmo3oUX3QNPnfrfIzvWIw+MXsneRJmjzWjevuGdu8XIiIiIiLqXr+DOLv9vQ9K9GXb7rS/apyKzFSDfLJUi8NdHvxXokqcNSanot35WGMDjmvNNkrR2hOiiMj3p7eko+jc83DF1Vfis5++GffcdQPumJ6eUGOnCxYH7PJD8nrquzjJj2L/sV4W1O217q6g90Wr/BJ2fbLZqYtFICQv7ciLuuqusgmqUC2fQOqcrm4zY4AaLP/3M3jkH69jZccT3kgNthzwAIZ0jDrxB6zD6leWYUudHrmzFuKO229Wrvqfl+HHrg/2oVEk2oRC3ZzgRrHjLfl3Pf5CF8Np+7BjdyVCcCJndDeZQ9qQ4o3b12Kz14ox86/SumPdgjsuKuhdpkIfROqOaK2T69W2uhZsenMjKoJG5M5Z1E2XnL6/9z11XVWwkt8VrR3emP5Q+0BrRP5dMCA5rwTzFy7EzbfcgM9/9jZ8/tZ5KLImfh67cgqf0QSVm0SWVdfT+o7DI/X18fp83QQTe/OZDWDLBx/jQKsN4y+8Ep//3M343C2X45r5U1HkNvfcVcw2EYvnuBE8tB5Ld5581DE1u7FjYLaNGWYRQfL7ehcojgTQ3NSMmiP7sXHNUvz7nf3w2kZh/tyCbh6zNqR4404s2+qDffRs3Cq/piKIds+nzu8c/CEiIiIiIkW/gzivN/a+AmVftu2aGTnp8qlyuAHHE7uyGAzymh7IZ3vts3ROzl6yAJ+57RIsHJcCQ+NRbFz3EV5+/iX87YNDCJ3s/HIYS1OCYL01EAGiU+NpEe8ZM+yJDztUhY9fexGPPf2adsL9Mv7x1BKsrLJAlF1qauxnl4wWn/yM5dPZtr567cSHFF+72QN94blYWCShfPUHeHH5QYTyzsOVMzt28To1obK1Wuvker2tdy/eemUjKkIOlC5ajFldBHIG6r3va2nWWt3QZ+D8G2/ErYsmI88eRGXZJ1j+zhv455NvYGPdyX/RQDzOiF9kWXU9+TpGYU/x8faZtxzvPvcsHvv3Ery9ehf21URgG12CRVddj9svyu++O5U2WpRVfk/emZBZ9OW7L0WpeGs7xuF6Mf+pmciUZyP+oLx/lGC2drUXTUVKkvzD15rQHSyRqH+TBFdS14GlSOV+HJL3IcbU9C4DuSeGFN+wAw36Alxw4RjojqzDa6+uQVkoBwsWT9GyI4mIiIiIKFG/gziP1LRgu+/kIRKxjdj2lCQXY5x8JhCqOISDyoJ6VNWH5eXpyO3yMm8WMsUZQLOn80hGPdGPw8I52dBVrMU/nn4br63ciu17KlDTHECWfIJklk+QuuVvQav8kGyu1C5OanQozBnomjhdCSDYZdKTdlV9wNmQ5u7qBDAT7mQg2uRB9wNBFeLKz8knlFeM7/IkcHSmSA9oQb12Bxmlc3HFpVORL28c8bdqJ9xqVyd9QZZ8oujH8SPdZTul4vyb5d9166wTtY8SWbJT4UAMDXVdBIE6DCk+piATxqoyLC2rQs3+dVi534dUd2bPGRJ95N/wFiLV6ju9J2IbsW1vRVr24K3396LJmIwZixZgYmK2w6m89/soc9YcTHbJ+4/XXsTTr6/Cyi1l2FfZDK8+F3lpJ9klDeLjbHNKj7evLBkoLi3G2BQdQl7RvXAHVn7wLv79r9ewqjIC+5gSTOguirP/Izzzwpt49qU3T2QVqdMq7BFdz0RwSMy/vV39XB6qRHUMSM/uottjsvwZln+Pv76mm6wiIyYsuAq33XR+P2oQdRhSfHQecgw12PbhfhyrK8fyNYfgTcnoZt9ORERERHR2O6UzkK8eaugxkCPWiW1Ohd4xFosvm4jUUBXWJNQj2bf7MHxSJs69YFRC3QhBjFp1LsZZw6jYVdbNCUg3UpKQJJ8ENlRVtMvg0TtKcM6YnsuJAkexvyIEXXYJ5nbIctBnzcDMvFMv7nxy2ogydnv7q9i2Qozpvl/TKZCQNXEacjsEiOxTJ6PIEsbx8p7qxxxFRY18BplZ3On1gm08po42I9pwCDu1IE69qLEzagJmTupQ00WMxDMlU/6j7ceWCm1ZJ/Uor/TL95uPmQnFkhXy7WcXpwHBCpTt15adYMX02UWw1XyCD3ar3cZCYdGXx3DiPWcyyGea0VgPz7N/Wt94uMdAjlgntumrSOUGvCrqSJkyMe/KmchuO1E+pfd+36Q6bSI6gKN1iZ2fDMidOR5ZJwvCDOLjbHNKj7evQskYP2sGFs0r6dBNzyd/XkQkRn7vmdQlnWj1ZjpPXnUI8GgIrWK+OaC+XyP7seuwvM/KmYB57T6DVkw8rwjJaMX+XR07oLYJYNfBWkQlN6bNSiwKrtJnFWK0Q37Ux4+iY+80+9RzMMFeh00r9qrdH0Nh+fHoYWz7UBn18rOMITrQHyoiIiIiojOA3uXOu19r95knEsPT9V745BOEZIMOqfIkzhV2+sN4rNaL+440KtucjCOvGBMy9AgFdbC705EpptwxmHbuTCw4dwxSYrVY99YybG9OuK/m46i2FGDiuCJMGuOCWWdDqjsbpXPmYc5oC0IVm/HG2mrtRM+G0aWFcAeOYcO+9tka6u8O4tDmg6jxxpBeMgajR42GWz6hsKSkI69oGhZcUAhdTa18omhE/Z4yHFaKRKRgfHE6ks1mhI06BGuacKwqhOziAhSOH4tsqxFmV4p6+/Oy4T3ugcVpQN2J259cRtFkjE5qVR+btkyRPgYz80yo6XRfPrTY8jFxdCayLV7UNEVgTBmLRYsnwhEIw2z2x++ru/vobrk9B1PGpyFwZAf2iMCKsp2E+tZUTJmWB6fegKS0dIyZPg+XlLgQObYJr3/c9vp3JYLKowH19SouRK7VAJP8emUWlOAi+QTWDQ82r1iD/S3q3zzWUI1AZhEmjh+HwhQTdPZk5T0ye/45GGtvxc5lq1GmbQtLIa689TJcVGzC0Z3HlZoezRV1sBYWobCoCEXJRkjtbu/HwdUrsb6ufRqTfuwcXF5qQNmyVdinvRYt+nRMKR2DXLP82qZPwMyJKWjevxk7K4PqBgMkFmhFcPuHQDgAyWqHziKGY48iUnsIwU1L4F3yN2Wbk1HeQ+Z67P7k2InaJiH5Pirlz05xbjaKcqI4vL8GvtY+vPc7vhfadLccaSiengNL7X5sOyq/R63ZmDI6G6Pz7NAbHEh3j8K0+XMxK6MZx5vsSAq3fU59sI+ahII0M8yQYIi1oK4m3IfPaBe6fYxxHT93vX+83e9nuv/MdrhNrB4eUwFKxuRhwon9mniO03H+xFQYGvdj5daqHosbd6b9DrR/H8i/DPVinzW+AGPlfZb6emaj+NxZOCfbhOZdK/BOmVfeSkjD+TdfiytnpKN1Tzlq5Y9KuPo4fPJncvzYQowflQSb0a4+1pKZuHR2Liy+w1jxwS6IpMkT9PlYeHExTHtX4d2DWt2eVh0yJxajOEfsS9Mwbfp4pLUcxJoy+TOvbkFERERERJoB6QsguktdubcWhdsrlUm0+96Fyomi2TNwfts0rQA5Jj/2b1mGZ/79PjY3JF4FF8QoVG/imQ92o1bKxlTldpNQaPOifN27+NeSvQknK71ViRWvr0WZR4ecSerjOKfQgoZ17+DFA1G0uwBeuwsbDrZCyhgvb1esFlD27sXrL63Elqow3MWTE27/Pl4/FMJg5OI0bFiG93Y1wTbuPNx401W4ZVEhQhuXYNnRLvtZnbLja97BisM6jJ6mvl5Ts3So2bUKz73Xi9dfeb0+wIaKEFLHTVJuP2dCFqT63Xj3lSVY167gsQ8733sH7+5ohJRbomx7/vQxSAkdxapX3uxUHDkWk089g0GcCK1EarDypXfw4d4mGNpuL7/HXPLtP3r9DSzZ36EQrL7rIcUjB1bjrW1NSC4Rvz8bKP8Yb28+SQ2YUyC6SzU/9XM0/vfdyiTafelC1TXx2Xkbb5a1QO+eiusuGQd7X977p8i/Yxne3FwDn7MA54q/w6zxyAoewnsvbUFDWzaGZs/WnagK2DB2xgycO1YUdhm8x9mmL493IFSte0vbr2Vh8iztOY5Lgr98I158bVu7UeNOWcI+K7tU/K7JmJAawlF5H/r8mvajcUWiMURjIVE/XCN/Jt95BS+uO4qgbZS2D5Yf62gzGvetw8svrsa+dtEmeT/R1ZDikcN4//1PUO8skm8/Cfk4gg/f29G3LEoiIiIiorOElFc6JyG9haiXShbiy3Md+OSN17Aysdg0EREREREREZ0WA5KJQ0REREREREREpxeDOEREREREREREIwCDOEREREREREREIwBr4hARERERERERjQDMxCEiIiIiIiIiGgEYxCEiIiIiIiIiGgEYxCEiIiIiIiIiGgEYxCEiIiIiIiIiGgEYxCEiIiIiIiIiGgEYxCEiIiIiIiIiGgEYxCEiIiIiIiIiGgEYxCEiIiIiIiIiGgEYxCEiIiIiIiIiGgEYxCEiIiIiIiIiGgEYxCEiIiIiIiIiGgEYxCEiIiIiIiIiGgEYxCEiIiIiIiIiGgEYxCEiIiIiIiIiGgEYxCEiIiIiIiIiGgEYxCEiIiIiIiIiGgEYxCEiIiIiIiIiGgEYxCEiIiIiIiIiGgEYxCEiIiIiIiIiGgEYxCEiIiIiIiIiGgEYxCEiIiIiIiIiGgEYxCEiIiIiIiIiGgEYxCEiIiIiIiIiGgEYxCEiIiIiIiIiGgEYxCEiIiIiIiIiGgEYxCEiIiIiIiIiGgEYxCEiIiIiIiIiGgEYxCEiIiIiIiIiGgEYxCEiIiIiIiIiGgEYxCEiIiIiIiIiGgEYxCEiIiIiIiIiGgGkvNI5Ma1NRERERERERDTspSS7MH/uTORkuZV5n8+H/eVHsWrNBmU+Ucn4QkyfMgEuZxJCoRAqjlfjw1Xr4Pf7tS0Ai8WCqxYvQHpaCmrrGrB67UYcr6zR1gILL5yDVPl3vvDqO9qSoaF3ufPu19pERERERERERMOaCLjccv3lkCQJH6/firK9BxCORDFpwjg4nUk4eOiotiUwdVIJ5s+ZiX0HDmPztp04VlmD4qICedsilO0rRzgcVra74tILEYlG8dHaTXAmOVA0ZjR2lu1T1mVnZeD82TPw3oer0dLiVZYNFXanIiIiIiIiIqIRY0rpeBiNRrzz/krs3rNfCdqIDJw9+8sxvrBA20o1c/oklB+uUNaL7cT27y5bDavVqqxrk5GWgu2flCnbiCwdkZHT5vzZ5yj3nZiZM1QYxCEiIiIiIiKiEcNkMik/Gxo9ys82wWBIa6nGjB6lBHtEpk4iEYw5VlmNvNwsbQlQU9eA4nFjlbYIEonuWcKsc6bA5XTgo7WblfmhxiAOEREREREREY0Yn+zaq9S2uWzRBUrXKkEEbEQ3KZF10yY3Rw3SJHavalPf4FFq5LRZv2kbcrPd+PLdt2HyxPFYu3G7ct+ivXrt5nb1c4YSa+IQERERERER0Yjh9wfQ6GlCaUkhzp0xGTOnT0bR2NGoqqnDm0s+1LYC8vNy4M5Iw4bNO7QlcR3XiVo3omZOXX0jPlq3BZVVNVi0YC5isRhWfLRe2WY4YCYOEREREREREY0YYrSpxRfPR4OnGUuWrlSmNes2I8WVhNtuuupEdk5/iKwdkXUjMnsK8nOxdPkabc3w0O8gTmZ2tjJ1xOUqLldxuYrLVVyu4nIVl6u4XMXlKi5XcbmKy1VcruJyFZerzoTlp2L2OZOVmjavvbVUCbqIaeuO3Xjt7WVKFylR0+ZUXTB3Jnbs2qvU3RHDi4tuVp+/8yZltKuhxEwcIiIiIiIiIhoxxMhSoqZNR22FjtsKH1ccq1R+iqyajlJTXCeKF3c0b85M5acY0UoEbcbk5yojVonaOGJEKzHk+FCR8krnxLQ2EREREREREdGwdtdt16HV68cLr76jLVGJ4Mq1VyzCpq2fYN3GbcoykT0jRp4SWTttUpJduOWGK5RMGxGoSSTW3XD1JfhgxcdKho8I6GS500/8rpuuvQx795crmT9DgYWNiYiIiIiIiGjECARDmFhShJzsTGVY8ZRkJ0bn5eDC82ehpdWL5avXIxwOK9tGo1FMLC6CUxuJKiszA/PnnAO9ToclS1ed2K7NpQvnwevzY+2Grcq8zWbFuMLR8PkDSE9LVdpbduxSCiEPBWbiEBEREREREdGIIrpITS4tRk6WW5kXXaOOHKvCR10MBy4KIU+fMuHEkOKins7Kjzac6H7VRmx3/uzpeOn199qtEzVxRJcqQYxmNVRZOAKDOEREREREREREIwALGxMRERERERERjQAM4hARERERERERjQAM4hARERERERERjQAM4hARERERERERjQAM4hARERERERERjQAM4hARERERERERjQAM4hARERERERERjQAM4hARERERERERjQAM4hARERERERERjQAM4hARERERERERjQAM4hARERERERERjQAM4hARERERERERjQAM4hARERERERERjQAM4hARERERERERjQAM4hARERERERERjQAM4hARERERERERjQAM4hARERERERERjQAM4hARERERERERjQAM4hARERERERERjQAM4hARERERERERjQAM4hARERERERERjQAM4hARERERERERjQAM4hARERERERERjQAM4hARERERERERjQAM4hARERERERERjQAM4hARERERERERjQAM4hARERER9ZKk06HAYdPmiIiIBheDOEREREREvZBpNeH9YjdWjHXhknSntpSIiGjwMIhD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AVd6chip4bV5DSslP1AFmzoR8Bzz1Gi/unfqN0v5baQGTjbBH2+IiGh9evmlz+l5qQBM8WNHDu7F8UeO6rT0m/Ot7/4YtTVVeO6px/Df//oHGBuf0I+tR+s+iLMR+CtqUfnsry+u6vJGp25Mp9/9BtLqBo+Ifr5FpfnbroeR6voAs2ffNGvXgoWK7YcRPPws7FRSNxvJTq/fC+laW8t88TaBlKY6qfNvYe7mxbIGJ/yRSqeJUNM2pK46fWoFdt6PzyERERFtJEsJ4ghpOtXW0qibWInffuWXSnaCvN4wiENEREREREREG9pSgzhe7ohWf/bqX5k169eygzgtbexjgYiIiIiIiIgWb6CvT8cTZL6alhvEqautwRd/5fO64+O+gWG8+Nln0NhQp5tZff/H76Cvf8hsuT6wJg4RERERERERbWgLdWzc0zeoOy8uJgGe+PSMfkyGKK+rrcbPPvgoNzz5f/nqa2bL9cFn5kREREREREREG1L39Zt6LkOKe0knxsFgEJe7rpk1eTK8eE11DG++/b5ejlVW4HZPv+4n5/0Pz+q/k5o66wmDOERERERERES0oUmzpxu3enTtGQnkbNuySQdwHjp6EMMjY7kOjF3SsfGjxw7h4wtXMDc3p9eNjk+gs6NV/608RyqVWncjVbE5FRERERERERH9XHA7KY5GozoIc/1WD949cToXqHE99/RxtDQ14NXXvm3WOIGdzzz3BNpbm9knDhERERERERERLR+bUxERERERERERbQAM4hARERERERERbQAM4hARERERERERbQAM4hARERERERERbQAM4hARERERERERbQAM4hARERERERERbQAM4hARERERERERbQAM4hARERERERERbQAM4hARERERERERbQAM4hARERERERERbQAM4hARERERERERbQAM4hARERERERERbQAM4hARERERERERbQAM4hARERERERERbQAM4hARERERERERbQBW54HjtknTffY7f+8Vkyrt9R/9FNdv3jFLC5PnW+rf0L25eZRKpfBfvvqaThf73PNPYevmDp3m8V//Xnn5RdRUV+HNt9/HpSvdZi2tB08efwgH9+3S6VNnzuP9D8/qtFddbQ2++Cuf1+nhkTG89j++p9O0/m3bsgmf/fSneJ7coJabf/K9bm1u5Hd1jUUiEfzdX/9lnf7Tv/gm5ubm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CvgySS2CQODu65zU2JDn4C/O5SWdF8s503uN804SCJe+Fl2L+f69e+K0nstIqd7z66H9u3PNQmh1SD9DkidSk1tq5bjfPfceUr5bZ85d1NvKPb2UESQ484uf/3RuW0nLOukI3ov3NeX37dff1IPOSBnNvf93j7V0ryDfLckz9wdgNw+lnCbnTm8eyv3JiQ8/1tt5yXdUtqFPHn9Nc+fvmzTdZzLO/+DwKG7d6TVr7pZOp3H12i001Ndi765tqkC6DY0q3aXWyVCP8rhLnu8ttc7n8+Ho4X1626pYhT5BfHDqrNmKlqI4j+bmEti6eZOulioXSFkW0unczu1bdGBnfGJST5IPu3ds0RdfOXH3DQzpIJD8yuJut7mzXVeNvTDPCFe0MlJg+JS6kMooGj19pYeClzb9B9RNbCQa0Tcybh8pklcPPXBA55+0F5dAqPc75+a5fL9odcj3obmpoeCYZjIZ/cux1LK5ei3ffFHySbjfHfl+yS/IUrCQfAmHQ/jpeyfRYtr6F3/HpC267OuHb76b+x7T6pNz6OOPHNV5YlnODxPeGlXX1HdORhY7/vADettEMqW/r3KedD8H850niz8DtPrulX9yLuwfHMI+dY587KEj+jwq38OR0fGC/EqlU7rQIefSgcFhfe2j1SfHVwLeb73zPuLx0n3YyPlUtotPz+rC+2K+f5LPkucN9XV44NA+/VmQ+5s3fvIeWluadc2Qe93H0tLI9yaVSmNTeysOH9ijj7fcQ07Fp3XeegfCkO+T5KXkoVwnZVvZ7t0TpwoCM4u9r6GVkeMoZTa5/5Afldw8kXLbsDovyv1GcY1iNw/lHOlun0gk9f2L955HzptS/pDvuGzjvU+iTwar88Bx26SJiKiI/Nol7cOlKRz9/HJrxkmHkUREVJoU+KVWQPE1UX4kkX7mTp05r2uQ0PrF+xqijY/NqYiI6BNLfu2S6shSKJGmdERENL9EIqGbe3ib7Ehg58XPPqOb0509f8VsSURE5cIgDhERfWJJXwMPHjmgmxKwQ2MionuTZjlup8hy/pTpiUePIplK4Ts/eEv360FEROXF5lRERERERERERBsAa+IQEREREREREW0ADOIQEREREREREW0ADOIQEREREREREW0ADOIQEREREREREW0ADOIQEREREREREW0ADOIQEREREREREW0ADOIQEREREREREW0ADOIQEREREREREW0ADOIQEREREREREW0ADOIQEREREREREW0ADOIQEREREREREW0ADOIQEREREREREW0ADOIQEREREREREW0ADOIQEREREREREa17wP8E+rd7ex0O6PUAAAAASUVORK5CYII=" />


           <hr />

           <table style={{ width: "inherit" }}>
               <thead>
               <tr>
                   <th>Outcome</th>
                   <th>% chance</th>
                   <th>action</th>
               </tr>
               </thead>
               <tbody>
               {options && options.size > 0 ? (
                   [...options.entries()].map(([option, amount]) => (
                   <tr key={option}>
                       <td className="tdTable">
                       <div className="picDiv">
                           <img
                           style={{ objectFit: "cover", height: "inherit" }}
                          src={option === "trump" ? "https://polymarket.com/_next/image?url=%2Fimages%2Felections%2Fpres-trump.png&w=256&q=75" : "https://polymarket.com/_next/image?url=%2Fimages%2Felections%2Fpres-kamala.png&w=256&q=75" }
                           ></img>
                       </div>
                       {option}
                       </td>
                       <td>
                       {new BigNumber(amount.toString())
                           .div(
                           new BigNumber(
                               [...options.values()]
                               .reduce((acc, newValue) => acc + newValue, 0n)
                               .toString()
                           )
                           )
                           .multipliedBy(100)
                           .toFixed(2)}
                       %
                       </td>

                       <td>
                       {status && status === BET_RESULT.PENDING ? (
                           <button onClick={() => resolve(option)}>Winner</button>
                       ) : (
                           ""
                       )}
                       </td>
                   </tr>
                   ))
               ) : (
                   <></>
               )}
               </tbody>
           </table>
           </div>

           <div
           style={{
               width: "calc(33vw - 4rem)",
               boxShadow: "",
               margin: "1rem",
               borderRadius: "12px",
               border: "1px solid #344452",
               padding: "1rem",
           }}
           >
           <span className="tdTable">{<BetFunction />}</span>
           </div>
       </div>

       <footer>
           <h3>Errors</h3>

           <textarea
           readOnly
           rows={10}
           style={{ width: "100%" }}
           value={error}
           ></textarea>

           {account?.address ? <Ping /> : ""}
       </footer>
       </>
   );
   }
   ```

   Explanations : 
   - **import { Polymarkteth, Polymarkteth__factory } from "./typechain-types";** : to have the contract ABI and contract structures
   - **import CONTRACT_ADDRESS_JSON from "./deployed_addresses.json";** : to find the last deployed address automatically
   - **const wallets = [inAppWallet(...),createWallet(...)}** : Here is the configuration for the thirdweb wallet. Look at the [Thirdweb playground](https://playground.thirdweb.com/connect/sign-in/button?tab=code) to play with the generator
   - **useActiveAccount** : Thirdweb React hooks and functions are just wrapper over the Viem library. Here is to get the active account
   - **const reload = async () => {** : function used to refresh the smart contract storage (status,winner,fees and mapping keys)
   - **useEffect...[betKeys]);** : React effect to reload all bets from the storage when betKeys is updated 
   - **const Ping = () => {** : This function is just a technical endpoint to test if your smart contract interaction works. It can be removed for production
   - **const BetFunction = () => {** : This function sends your bet to the smart contract, passing along the correct amount of XTZ
   - **const calculateOdds = (option: string, amount?: bigint): BigNumber => {** : Similar the the onchain function calculating odds


1. To fix the CSS for the page styling , edit `App.css` with

   ```css
   #root {
     margin: 0 auto;
     padding: 2rem;
     text-align: center;

     width: 100vw;
     height: calc(100vh - 4rem);
   }

   .logo {
     height: 6em;
     padding: 1.5em;
     will-change: filter;
     transition: filter 300ms;
   }

   .logo:hover {
     filter: drop-shadow(0 0 2em #646cffaa);
   }

   .logo.react:hover {
     filter: drop-shadow(0 0 2em #61dafbaa);
   }

   @keyframes logo-spin {
     from {
       transform: rotate(0deg);
     }

     to {
       transform: rotate(360deg);
     }
   }

   @media (prefers-reduced-motion: no-preference) {
     a:nth-of-type(2) .logo {
       animation: logo-spin infinite 20s linear;
     }
   }

   header {
     border-bottom: 1px solid #2c3f4f;
     height: 100px;
   }

   footer {
     border-top: 1px solid #2c3f4f;
     height: 100%;
   }

   hr {
     color: #2c3f4f;
     height: 1px;
   }

   .tdTable {
     align-items: center;
     gap: 1rem;
     width: 100%;
     flex: 3 1 0%;
     display: flex;
     font-weight: bold;
   }

   .picDiv {
     height: 40px;
     width: 40px;
     min-width: 40px;
     border-radius: 999px;
     position: relative;
     overflow: hidden;
   }

   .card {
     padding: 2em;
   }

   .read-the-docs {
     color: #888;
   }

   h1 {
     margin: unset;
   }
   ```

1. Edit also `index.css` with

   ```css
   :root {
     font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
     line-height: 1.5;
     font-weight: 400;

     color-scheme: light dark;
     color: rgba(255, 255, 255, 0.87);
     background-color: #1d2b39;

     font-synthesis: none;
     text-rendering: optimizeLegibility;
     -webkit-font-smoothing: antialiased;
     -moz-osx-font-smoothing: grayscale;
   }

   a {
     font-weight: 500;
     color: #646cff;
     text-decoration: inherit;
   }

   a:hover {
     color: #535bf2;
   }

   body {
     margin: 0;
     display: flex;
     place-items: center;
     min-width: 320px;
     min-height: 100vh;
   }

   h1 {
     font-size: 3.2em;
     line-height: 1.1;
   }

   button {
     border-radius: 8px;
     border: 1px solid transparent;
     padding: 0.6em 1.2em;
     font-size: 1em;
     font-weight: 500;
     font-family: inherit;
     background-color: #2d9cdb;
     cursor: pointer;
     transition: border-color 0.25s;
   }

   button:hover {
     border-color: #646cff;
   }

   button:focus,
   button:focus-visible {
     outline: 4px auto -webkit-focus-ring-color;
   }

   select {
     width: inherit;
     font-size: 0.875rem;
     color: #858d92;
     border-color: #344452;
     transition: color 0.2s;
     text-align: center;
     border-width: 1px;
     border-style: solid;
     align-self: center;
     padding: 1rem 1rem;
     background: #1d2b39;
     outline: none;
     outline-color: currentcolor;
     outline-style: none;
     outline-width: medium;
     border-radius: 8px;
   }

   input {
     width: calc(100% - 35px);
     font-size: 0.875rem;
     color: #858d92;
     border-color: #344452;
     transition: color 0.2s;
     text-align: center;
     border-width: 1px;
     border-style: solid;
     align-self: center;
     padding: 1rem 1rem;
     background: #1d2b39;
     outline: none;
     outline-color: currentcolor;
     outline-style: none;
     outline-width: medium;
     border-radius: 8px;
   }

   @media (prefers-color-scheme: light) {
     :root {
       color: #213547;
       background-color: #ffffff;
     }

     a:hover {
       color: #747bff;
     }

     button {
       background-color: #f9f9f9;
     }
   }
   ```

1. Run your app

   ```bash
   npm run dev
   ```

1. Click on the **Connect** to login with one of your wallet

1. Click on the Ping button at the bottom. It should stay green if you can interact with your smart contract with no error messages

1. Run a scenario

   1. Select **Donald Trump** on the select box on the right corner, choose a small amount like **0.00001 XTZ** and click on the **Bet button**.

   1. Confirm the transaction

   1. Disconnect and connect with another account

   1. Select **Kamala Harris** on the select box on the right corner, choose a small amount like **0.00001 XTZ** and click on the **Bet button**.

   1. Confirm the transaction

   1. Both candidates have 50% of chance to win. Note : Default platform fees have been set to 10%, odds calculation take it into account

   1. Click on one of the **Winner button** to resolve the poll

   1. The page's right corner refreshed and displays the winner option of the poll

   1. Find your transaction **resolveResult** on the explorer **https://testnet.explorer.etherlink.com**. In the **Transaction details>Internal txns**, you should see, if you are a winner, the expected amount transferred to you by the smart contract
