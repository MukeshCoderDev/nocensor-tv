require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  typechain: {
    outDir: "src/contracts/typechain-types",
    target: "ethers-v6"
  },
  paths: {
    sources: "./contracts",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  },
  networks: {
    hardhat: {
      chainId: 31337,
      allowUnlimitedContractSize: true
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : []
    }
  }
};