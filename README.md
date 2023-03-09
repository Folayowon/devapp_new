# Project Title:

Decentralized Voting Application (Devapp)

# Project Description:

The Decentralized Voting Application (Devapp) is a platform that allows individuals to cast their votes in a secure and transparent manner. The platform makes use of blockchain technology, ensuring that each vote is recorded immutably and verifiably, making the voting process tamper-proof. The use of blockchain technology enables the votes to be recorded on a distributed ledger, making the results of the election or decision-making process accurate and reliable.

The application will allow users to create and vote in polls, with the option to make them public or private. Users can also view the results of polls in real-time, ensuring transparency and accuracy. Additionally, the application will use smart contracts to ensure that only eligible voters are able to cast their ballots and that each voter can only vote once.

The decentralized nature of the application means that it will not be controlled by any single entity, and it will be able to operate independently of any centralized server or authority. This will prevent potential interference or manipulation of the voting process.

Overall, this decentralized voting application aims to provide a reliable and trustworthy way for individuals to participate in democratic processes, and to promote transparency, security, and accessibility.

# Logo Description:

The logo for the Decentralized Voting Application (Devapp) combines the symbol of electrical power, representing authority, with a hexagonal object symbolizing the hexadecimal addresses used in blockchain technology and cryptocurrency. This imagery encapsulates the decentralization aspect of distributed ledger technology, which is a unique feature of this platform.

# Project Requirements:

- Node.js: The project requires version 12.2.1 or higher of Node.js. This is a JavaScript runtime that allows you to run JavaScript on the command line and is necessary to run the project locally.

- npm: npm is the package manager for Node.js and is required to install the project's dependencies. The project requires version 6.14.8 or higher of npm.

- Browser: The project is compatible with the latest versions of common web browsers such as Google Chrome, Mozilla Firefox, and Safari.

- Hardhat: Hardhat is an open-source development environment for Ethereum smart contracts that allows you to test, debug, and deploy your contracts. The project requires version 2.10.1 or higher of Hardhat.

- Metamask(Ethereum client): The project uses a local Ethereum client to interact with the blockchain. To run the project locally, you will need to have a local Ethereum client such as Ganache or Geth installed on your machine.

- IPFS: The project uses IPFS to store the images of the poll options. So you will need to have IPFS installed on your machine to run the project locally.

* The project uses certain npm packages like @openzeppelin/contracts, ethers, web3modal and ipfs-http-client which are required to run the project.

* The project uses certain environment variable like INFURA_ID and MNEMONIC which you need to set in order to run the project.

# Project Snapshot:


[Devapp.webm](https://user-images.githubusercontent.com/93780999/214534371-d4677370-efb4-40eb-ab9a-7dcaf4e83b34.webm)


# Project Website Link:

https://main--radiant-bubblegum-fa88d4.netlify.app/

# Project Author:

https://github.com/Folayowon

# How to Install and Run the Project:

To run this project on a localhost, the project repository can be either be dowloaded from my Github repository or cloned on VS code.

Once this is done:

*STEP 1: install the required dependencies:*

` npm install @openzeppelin/contracts `

`npm install axios`

`npm install dotenv`

`npm install ethers`

`npm install ipfs-http-client`

`npm install next": "12.2.1`

`npm install react`

`npm install react-countdown`

`npm install react-dom`

`npm install react-dropzone`

`npm install react-icons`

` npm install @openzeppelin/contracts `

`npm install axios`

`npm install dotenv`

`npm install ethers`

`npm install ipfs-http-client`

`npm install next": "12.2.1`

`npm install react`

`npm install react-countdown`

`npm install react-dom`

`npm install react-dropzone`

`npm install react-icons`

`npm install web3modal`

* NB: these dependencies are necessary to initialize the environment.
* NB: these dependencies are necessary to initialize the environment.

*STEP 2: Initializing dependencies for hardhat :*

To initialize hardhat run this command line:

`npm install @nomicfoundation/hardhat-toolbox`

*_or_*

`npm install --save-dev "hardhat@^2.10.1" "@nomicfoundation/hardhat-toolbox@^1.0.1"`

*STEP 3: Run this command line in your terminal:*

`npm run dev`
`npm run dev`

*STEP 4: Split your terminal and run this command line (this will run the hardhat node in the local terminal ):*

`npx hardhat node`
`npx hardhat node`

NB: This will generate 20 demo accounts that can be used for testing. Copy the accounts(both the private and the public keys) you can easily access it. And it is successful, there would be a prompt like this in the terminal:

    Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)

    Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

    Account #1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (10000 ETH)

    Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d

*STEP 5: Split your terminal and run this command line in your terminal:*

`npx hardhat run scripts/deploy.js --network localhost`

  NB: This is the deploy command of devapp smart contract.
  If well-deployed there will be a prompt like this in the terminal:

    Compiled 3 Solidity files
    successfully
    Lock with 1 ETH deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3

# Usage:

# License
This project is subject to the terms and conditions of the Grandida License. Please refer to the LICENSE.md file for more information.
