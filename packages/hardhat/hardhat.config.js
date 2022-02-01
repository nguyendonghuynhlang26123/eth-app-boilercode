require('@nomiclabs/hardhat-waffle');
require('dotenv').config({ path: '../../.env' });

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task('accounts', 'Prints the list of accounts', async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task('funding', 'Fund an account').setAction(async (taskArgs, { network, ethers }) => {
  const address = ethers.utils.getAddress(process.env.FUNDING_ACCOUNT);
  const amount = '100';
  if (!address) throw new Error('User should provide the funding account address');

  const signer = (await ethers.getSigners())[0];
  const tx = {
    to: address,
    value: ethers.utils.parseEther(amount),
  };
  console.log('💵 Sending ' + amount + ' ETH to ' + address + ' using deployer account ' + signer.address);

  await signer.sendTransaction(tx);
  console.log('Funding complete, account balance = ' + ethers.utils.formatEther(await ethers.provider.getBalance(address)));
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const DEPLOYER = process.env.DEPLOYING_ACCOUNT;
const INFURA_ID = process.env.INFURA_ID;
module.exports = {
  solidity: '0.8.4',
  defaultNetwork: 'localhost',
  networks: {
    localhost: {
      url: 'http://127.0.0.1:8545',
      chainId: 1005,
    },
    hardhat: {
      chainId: 1005,
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_ID}`,
      accounts: [DEPLOYER],
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${INFURA_ID}`,
      accounts: [DEPLOYER],
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_ID}`,
      accounts: [DEPLOYER],
    },
  },
  solidity: {
    version: '0.8.6',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
  mocha: {
    timeout: 40000,
  },
};
