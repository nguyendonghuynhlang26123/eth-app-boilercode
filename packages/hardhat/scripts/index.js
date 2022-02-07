const hre = require('hardhat');

async function main() {
  // We get the contract to deploy
  const MyNFT = await hre.ethers.getContractFactory('MyNFT');
  const nftContract = await MyNFT.deploy();

  await nftContract.deployed();

  console.log('MyNFT deployed to:', nftContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
