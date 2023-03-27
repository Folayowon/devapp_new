const { ethers } = require("ethers");


const hre = require("hardhat");


async function main() {
  const Devapp = await hre.ethers.getContractFactory("Devapp");
  const devapp = await Devapp.deploy();

  await devapp.deployed();

  console.log("Lock with 1 ETH deployed to:", devapp.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

