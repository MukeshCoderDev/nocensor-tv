// Minimal valid hardhat.config.js
require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.20",
  networks: {
    // Only define localhost - no external networks
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    }
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v5"
  }
};