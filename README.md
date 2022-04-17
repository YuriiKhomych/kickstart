# Blockchain Kickstart app
The project implements a prototype of a crowdfunding website that is triggered by a smart contract written in solidity.

A decentralised web application where a user can either create fundraising campaigns to receive donations in ether or donate to some existing campaigns.

###Detailed description and working:
* A user first needs to login to his metamask account.
* If the user wishes to create a campaign to receive donations in ether, he needs to set a minimum contribution value and give a description about the campaign.
* If the owner of the campaign wishes to spend these received donations, he needs to create a request mentioning the details where the tokens will be used along with the account address where the requested amount of tokens will be transfered.
* The donators of this campaign can vote for the request and if the count of received votes is more than or equal to half of the donators, campaign owner can finalize the request and requested amount will be transfered to the mentioned account address.
* Other users can donate to this campaign in ether using their metamask accounts. The donators of a particular campaign can also vote for a request created in the same campaign as well.

### Languages and Frameworks used:
* Solidity -- 0.8.12
* React.js
* Web3.js
* Next.js
* Ganache
* Mocha
* semantic-ui-react

### Setup steps

#### 1. Create .env file and set such environment variables
```
MNEMONIC_PHRASE - your account mnemonic phrase
PROVIDER_URL - Set infura endpoint url (Create an account [here](https://infura.io/) to setup the endpoint) for rinkeby test network as mentioned in the file. 
NEXT_PUBLIC_PROVIDER_URL - Set the same infura endpoint url for react app
NEXT_PUBLIC_ADDRESS - your deployed contract public address from step 4
```

#### 2. Install the required dependencies
```
npm install
```

#### 3. Inside ethereum directory Run the compile.js file. This will generate a build folder in the same directory storing the json equivalent of the created contracts.
```
node compile.js
```

#### 4. Run the deploy.js to deploy contract to the rinkeby network.
```
node deploy.js
```

#### 5. All set. Run the project.
```
npm run dev
```
