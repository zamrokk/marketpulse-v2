# CICD

There plenty of CICD tools on the market to build pipelines

Here is an example of one using the **Github** config files and [Vercel](https://vercel.com/) for free hosting

1. create a Github pipeline

   ```bash
   mkdir /github
   mkdir /github/workflows
   touch /github/workflows/polymarkteth.yml
   ```

1. Edit the file to include a CI / CD pipeline

   ```yml
   name: CI
   on: push
   permissions:
     contents: read
     pages: write
     id-token: write
   concurrency:
     group: "pages"
     cancel-in-progress: false
   jobs:
     build-contract:
       runs-on: ubuntu-latest
       steps:
         - name: Check out repository code
           uses: actions/checkout@v3
         - name: Use node
           env:
             DEPLOYER_PRIVATE_KEY:
           uses: actions/setup-node@v4
           with:
             node-version: 18
             cache: "npm"
         - run: npm ci
         - run: HARDHAT_VAR_DEPLOYER_PRIVATE_KEY=${{ secrets.DEPLOYER_PRIVATE_KEY }} npx hardhat compile
         - run: HARDHAT_VAR_DEPLOYER_PRIVATE_KEY=${{ secrets.DEPLOYER_PRIVATE_KEY }} npx hardhat test
         - name: Cache build-hardhat-artifacts
           uses: actions/upload-artifact@v4
           with:
             name: ${{ runner.os }}-build-hardhat-artifacts
             path: artifacts
             retention-days: 1
     deploy-contract:
       needs: build-contract
       runs-on: ubuntu-latest
       steps:
         - name: Check out repository code
           uses: actions/checkout@v3
         - name: Restore build-hardhat-artifacts
           uses: actions/download-artifact@v4
           with:
             name: ${{ runner.os }}-build-hardhat-artifacts
             path: artifacts
         - name: Use node
           uses: actions/setup-node@v4
           with:
             node-version: 18
             cache: "npm"
         - run: npm ci
         - run: yes | HARDHAT_VAR_DEPLOYER_PRIVATE_KEY=${{ secrets.DEPLOYER_PRIVATE_KEY }}  npx hardhat ignition deploy ignition/modules/Polymarkteth.ts --verify --reset --network etherlinkTestnet
         - name: Cache hardhat-ignition
           uses: actions/upload-artifact@v4
           with:
             name: ${{ runner.os }}-deploy-hardhat-ignition
             path: ignition
             retention-days: 1
     build-app:
       needs: deploy-contract
       runs-on: ubuntu-latest
       steps:
         - name: Check out repository code
           uses: actions/checkout@v3
         - name: Restore hardhat-artifacts
           uses: actions/download-artifact@v4
           with:
             name: ${{ runner.os }}-build-hardhat-artifacts
             path: artifacts
         - name: Restore hardhat-ignition
           uses: actions/download-artifact@v4
           with:
             name: ${{ runner.os }}-deploy-hardhat-ignition
             path: ignition
         - name: Use node
           uses: actions/setup-node@v4
           with:
             node-version: 18
             cache: "npm"
         - run: npm ci
           working-directory: ./polymarkteth
         - run: more ./ignition/deployments/chain-128123/deployed_addresses.json
         - run: npm run build
           working-directory: ./polymarkteth
         - name: Cache app build
           uses: actions/upload-artifact@v4
           with:
             name: ${{ runner.os }}-build-app-artifacts
             path: ./polymarkteth/dist
             retention-days: 1
     deploy-app:
       needs: build-app
       runs-on: ubuntu-latest
       steps:
         - name: Check out repository code
           uses: actions/checkout@v3
         - name: Use node
           uses: actions/setup-node@v4
           with:
             node-version: 18
             cache: "npm"
         - name: Install Vercel CLI
           run: npm install -g vercel
         - name: Link to Vercel
           env:
             VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
           run: vercel link --yes --token=$VERCEL_TOKEN --cwd ./app --project polymarkteth
         - name: Restore hardhat-artifacts
           uses: actions/download-artifact@v4
           with:
             name: ${{ runner.os }}-build-hardhat-artifacts
             path: artifacts
         - name: Restore hardhat-ignition
           uses: actions/download-artifact@v4
           with:
             name: ${{ runner.os }}-deploy-hardhat-ignition
             path: ignition
         - name: Prepare build for Vercel
           env:
             VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
           run: vercel build --prod --yes --token=$VERCEL_TOKEN --cwd=./polymarkteth
         - name: Deploy to Vercel
           env:
             VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
           run: vercel deploy --prebuilt --prod --yes --token=$VERCEL_TOKEN --cwd=./polymarkteth
   ```

1. There a different jobs :

   - build-contract : build Solidity code with Hardhat
   - deploy-contract : deploy the contract with Hardhat ignition
   - build-app : build the app for production into a dist folder with vite
   - deploy-app : use Vercel to link the project, prepare the deployment and deploys it

1. The pipeline requires some configuration :

   - DEPLOYER_PRIVATE_KEY : It is the Etherlink account secret private key you need to use to deploy with hardhat. It overrides the default env var mechanism of hardhat. Use the [Github action extension for vscode](https://marketplace.visualstudio.com/items?itemName=GitHub.vscode-github-actions) or your Github's project settings web page (i.e https://github.com/<MY_ALIAS>/<MY_PROJECT>/settings/secrets/actions)
   - VERCEL configuration can be found [here](https://vercel.com/guides/how-can-i-use-github-actions-with-vercel) 
     - VERCEL_TOKEN: Your personal Vercel token that your need to create on your Vercel's account

1. Each time that you push your code, github action will run all the jobs. Once the run is finish, you can follow the deployment on the Vercel deployment page (i.e https://vercel.com/<ORG_NAME>/<PROJECT_NAME>/deployments) and the get the url of your application
