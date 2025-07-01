const { ethers } = require("ethers");

const url = process.env.SEPOLIA_RPC_URL;
const provider = new ethers.JsonRpcProvider(url);

async function main() {
  try {
    const block = await provider.getBlockNumber();
    console.log("Connected! Latest block:", block);
  } catch (e) {
    console.error("RPC connection failed:", e);
  }
}

main();
