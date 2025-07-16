#!/usr/bin/env node

// Simple E2E test using your existing ContentStorage contract
import { ethers } from "ethers";
import fs from "fs";

async function testE2E() {
  console.log("🧪 Simple E2E Test with existing contracts...\n");

  try {
    // Your deployed ContentStorage address
    const contractAddress = process.env.CONTRACT_ADDRESS || "0x9Fc0552df6fA4ca99b2701cfD8bBDbD3F98723E8";
    const rpcUrl = process.env.SEPOLIA_RPC_URL || "https://rpc.sepolia.org";
    
    // SAFE: Using environment variable for private key
    const privateKey = process.env.PRIVATE_KEY;
    
    if (!privateKey) {
      throw new Error("Please set PRIVATE_KEY environment variable");
    }
    
    console.log("📡 Connecting to Sepolia...");
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    
    console.log(`Using wallet: ${wallet.address}`);
    
    // Check if we can connect
    const balance = await provider.getBalance(wallet.address);
    console.log(`Wallet balance: ${ethers.formatEther(balance)} ETH`);
    
    // Test contract interaction
    const contractABI = [
      "function storeContentId(uint256 _videoId, string memory _arweaveTxId) public",
      "function getContentId(uint256 _videoId) public view returns (string memory)"
    ];
    
    const contract = new ethers.Contract(contractAddress, contractABI, wallet);
    
    console.log("\n🔍 Testing contract read...");
    try {
      const testResult = await contract.getContentId(0);
      console.log(`Content ID for video 0: ${testResult || "empty"}`);
      console.log("✅ Contract read test successful!");
    } catch (error) {
      console.log("❌ Contract read failed:", error.message);
    }
    
    console.log("\n✅ Basic connectivity test completed!");
    console.log("\n💡 Next steps:");
    console.log("1. Make sure your private key is exactly 64 characters long");
    console.log("2. Deploy the ContentStorage contract");
    console.log("3. Run the full E2E test");
    
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

testE2E();