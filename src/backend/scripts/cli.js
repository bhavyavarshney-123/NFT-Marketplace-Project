const { ethers } = require("hardhat");

async function main() {
  const [deployer, buyer] = await ethers.getSigners();

  console.log("Deployer:", deployer.address);
  console.log("Buyer:", buyer.address);

  // Deploy contracts
  const NFT = await ethers.getContractFactory("NFT");
  const Marketplace = await ethers.getContractFactory("Marketplace");
  const nft = await NFT.deploy();
  const marketplace = await Marketplace.deploy(1);
  await nft.deployed();
  await marketplace.deployed();

  console.log("NFT at:", nft.address);
  console.log("Marketplace at:", marketplace.address);

  // Mint NFT
  await nft.mint("https://my-nft.com/metadata/1.json");
  console.log("NFT minted with ID 1");

  // Approve marketplace to handle NFT
  await nft.approve(marketplace.address, 1);
  console.log("Marketplace approved");

  // List NFT for sale
  await marketplace.makeItem(nft.address, 1, ethers.utils.parseEther("0.1"));
  console.log("NFT listed for 0.1 ETH");

  // Buyer purchases NFT
  await marketplace.connect(buyer).purchaseItem(1, { value: ethers.utils.parseEther("0.101") });
  console.log("NFT bought by buyer");

  // Check owner
  const owner = await nft.ownerOf(1);
  console.log("NFT owner now:", owner);
}

main().catch(console.error);
