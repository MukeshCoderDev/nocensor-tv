#!/usr/bin/env node

import hre from "hardhat";

async function main() {
  console.log("🚀 Deploying ContentStorage contract...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  
  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy ContentStorage
  console.log("📄 Deploying ContentStorage...");
  const ContentStorage = await hre.ethers.getContractFactory("ContentStorage");
  const contentStorage = await ContentStorage.deploy();
  
  await contentStorage.waitForDeployment();
  const address = await contentStorage.getAddress();
  
  console.log("✅ ContentStorage deployed to:", address);
  console.log("🔗 Transaction hash:", contentStorage.deploymentTransaction().hash);
  
  // Verify deployment
  console.log("\n🔍 Verifying deployment...");
  const owner = await contentStorage.owner();
  console.log("Contract owner:", owner);
  
  // Test basic functionality
  console.log("\n🧪 Testing basic functionality...");
  try {
    const testTxId = "test-arweave-tx-id-123";
    const testVideoId = 999;
    
    console.log(`Storing test content ID: ${testTxId} for video ID: ${testVideoId}`);
    const tx = await contentStorage.storeContentId(testVideoId, testTxId);
    await tx.wait();
    
    const retrievedTxId = await contentStorage.getContentId(testVideoId);
    console.log(`Retrieved content ID: ${retrievedTxId}`);
    
    if (retrievedTxId === testTxId) {
      console.log("✅ Basic functionality test passed!");
    } else {
      console.log("❌ Basic functionality test failed!");
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }

  console.log("\n📋 Summary:");
  console.log("Contract Address:", address);
  console.log("Network:", hre.network.name);
  console.log("Deployer:", deployer.address);
  console.log("Owner:", owner);
  
  console.log("\n💡 Next steps:");
  console.log("1. Save the contract address for your E2E tests");
  console.log("2. Update your .env files with the new address");
  console.log("3. Run the E2E test with this contract address");
  
  console.log("\n🧪 E2E Test command example:");
  console.log(`npm run test:e2e -- \\`);
  console.log(`  --network local \\`);
  console.log(`  --rpcUrl https://rpc.sepolia.org \\`);
  console.log(`  --ethPrivateKey YOUR_PRIVATE_KEY \\`);
  console.log(`  --arweaveKey ./arweave-key.json \\`);
  console.log(`  --videoPath ./sample-video.mp4 \\`);
  console.log(`  --contract ${address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });