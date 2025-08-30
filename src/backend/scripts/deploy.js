// Load Hardhat runtime environment explicitly
const hre = require("hardhat");

async function main() {
 
  const [deployer] = await hre.ethers.getSigners();

  console.log("Deploying contracts with account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  // Get the ContractFactories
  const NFT = await hre.ethers.getContractFactory("NFT");
  const Marketplace = await hre.ethers.getContractFactory("Marketplace");

  // Deploy contracts
  const marketplace = await Marketplace.deploy(1);
  await marketplace.deployed();
  const nft = await NFT.deploy();
  await nft.deployed();

  console.log("Marketplace deployed to:", marketplace.address);
  console.log("NFT deployed to:", nft.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
