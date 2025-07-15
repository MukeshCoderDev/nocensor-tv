#!/usr/bin/env node

import { Bundlr } from "@bundlr-network/client";
import Arweave from "arweave";
import { ethers } from "ethers";
import fs from "fs";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

const argv = yargs(hideBin(process.argv))
  .option("network", { 
    type: "string", 
    demandOption: true, 
    describe: "Network to use (local or mainnet)",
    choices: ["local", "mainnet"]
  })
  .option("rpcUrl", { 
    type: "string", 
    demandOption: true, 
    describe: "Ethereum RPC URL"
  })
  .option("ethPrivateKey", { 
    type: "string", 
    demandOption: true, 
    describe: "Ethereum private key (hex format)"
  })
  .option("arweaveKey", { 
    type: "string", 
    demandOption: true, 
    describe: "Path to Arweave key JSON file"
  })
  .option("videoPath", { 
    type: "string", 
    demandOption: true, 
    describe: "Path to video file to upload"
  })
  .option("contract", { 
    type: "string", 
    demandOption: true, 
    describe: "ContentStorage contract address"
  })
  .option("videoId", { 
    type: "number", 
    default: 0, 
    describe: "Video ID to use for storage"
  })
  .help()
  .argv;

async function main() {
  try {
    console.log("🚀 Starting E2E Test...\n");

    // Validate files exist
    if (!fs.existsSync(argv.videoPath)) {
      throw new Error(`Video file not found: ${argv.videoPath}`);
    }
    if (!fs.existsSync(argv.arweaveKey)) {
      throw new Error(`Arweave key file not found: ${argv.arweaveKey}`);
    }

    // 1) Initialize Arweave + Bundlr
    console.log("📡 Initializing Arweave and Bundlr...");
    
    const arweave = Arweave.init({
      host: argv.network === "local" ? "localhost" : "arweave.net",
      port: argv.network === "local" ? 1984 : 443,
      protocol: argv.network === "local" ? "http" : "https",
    });

    const arweaveKey = JSON.parse(fs.readFileSync(argv.arweaveKey, 'utf8'));
    
    const bundlrUrl = argv.network === "local" 
      ? "http://localhost:1984" 
      : "https://node1.bundlr.network";
    
    const bundlr = new Bundlr(bundlrUrl, "arweave", arweaveKey);
    
    console.log("✅ Arweave and Bundlr initialized");

    // 2) Upload Video to Arweave
    console.log("\n📤 Uploading video to Arweave...");
    
    const videoData = fs.readFileSync(argv.videoPath);
    console.log(`Video size: ${(videoData.length / 1024 / 1024).toFixed(2)} MB`);
    
    // Check balance if not local
    if (argv.network !== "local") {
      const balance = await bundlr.getLoadedBalance();
      console.log(`Bundlr balance: ${bundlr.utils.fromAtomic(balance)} AR`);
      
      const price = await bundlr.getPrice(videoData.length);
      console.log(`Upload cost: ${bundlr.utils.fromAtomic(price)} AR`);
      
      if (balance.lt(price)) {
        throw new Error("Insufficient Bundlr balance for upload");
      }
    }

    const uploadResult = await bundlr.upload(videoData, {
      tags: [
        { name: "Content-Type", value: "video/mp4" },
        { name: "App-Name", value: "NoCensor-TV" },
        { name: "Video-ID", value: argv.videoId.toString() }
      ]
    });
    
    const arweaveTxId = uploadResult.id;
    console.log(`✅ Video uploaded to Arweave: ${arweaveTxId}`);

    // 3) Store on-chain via ContentStorage contract
    console.log("\n⛓️  Storing content ID on-chain...");
    
    const provider = new ethers.JsonRpcProvider(argv.rpcUrl);
    const wallet = new ethers.Wallet(argv.ethPrivateKey, provider);
    
    console.log(`Using wallet: ${wallet.address}`);
    
    const contractABI = [
      "function storeContentId(uint256 _videoId, string memory _arweaveTxId) public",
      "function getContentId(uint256 _videoId) public view returns (string memory)",
      "function owner() public view returns (address)"
    ];
    
    const contract = new ethers.Contract(argv.contract, contractABI, wallet);
    
    // Check if wallet is owner
    try {
      const owner = await contract.owner();
      console.log(`Contract owner: ${owner}`);
      if (owner.toLowerCase() !== wallet.address.toLowerCase()) {
        console.warn("⚠️  Warning: Wallet is not contract owner, transaction may fail");
      }
    } catch (error) {
      console.warn("⚠️  Could not check contract owner");
    }

    // Estimate gas
    const gasEstimate = await contract.storeContentId.estimateGas(argv.videoId, arweaveTxId);
    console.log(`Estimated gas: ${gasEstimate.toString()}`);

    const tx = await contract.storeContentId(argv.videoId, arweaveTxId, {
      gasLimit: gasEstimate * 120n / 100n // Add 20% buffer
    });
    
    console.log(`Transaction sent: ${tx.hash}`);
    console.log("⏳ Waiting for confirmation...");
    
    const receipt = await tx.wait();
    console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);
    console.log(`Gas used: ${receipt.gasUsed.toString()}`);

    // 4) Retrieve and verify on-chain storage
    console.log("\n🔍 Verifying on-chain storage...");
    
    const storedTxId = await contract.getContentId(argv.videoId);
    console.log(`Stored Arweave TxID: ${storedTxId}`);
    
    if (storedTxId !== arweaveTxId) {
      throw new Error("Stored TxID doesn't match uploaded TxID!");
    }
    console.log("✅ On-chain storage verified");

    // 5) Download video from Arweave and save locally
    console.log("\n⬇️  Downloading video from Arweave...");
    
    const downloadUrl = argv.network === "local"
      ? `http://localhost:1984/${storedTxId}`
      : `https://arweave.net/${storedTxId}`;
    
    console.log(`Download URL: ${downloadUrl}`);
    
    const response = await fetch(downloadUrl);
    if (!response.ok) {
      throw new Error(`Download failed: ${response.status} ${response.statusText}`);
    }
    
    const downloadedData = await response.arrayBuffer();
    const downloadPath = `downloaded-${argv.videoId}.mp4`;
    
    fs.writeFileSync(downloadPath, Buffer.from(downloadedData));
    console.log(`✅ Video downloaded to: ${downloadPath}`);
    
    // Verify file sizes match
    const originalSize = videoData.length;
    const downloadedSize = downloadedData.byteLength;
    
    console.log(`Original size: ${originalSize} bytes`);
    console.log(`Downloaded size: ${downloadedSize} bytes`);
    
    if (originalSize === downloadedSize) {
      console.log("✅ File sizes match - integrity verified");
    } else {
      console.warn("⚠️  File sizes don't match - possible corruption");
    }

    console.log("\n🎉 E2E Test completed successfully!");
    console.log("\nSummary:");
    console.log(`- Video ID: ${argv.videoId}`);
    console.log(`- Arweave TxID: ${arweaveTxId}`);
    console.log(`- Ethereum TxHash: ${tx.hash}`);
    console.log(`- Downloaded file: ${downloadPath}`);

  } catch (error) {
    console.error("\n❌ E2E Test failed:");
    console.error(error.message);
    if (error.code) {
      console.error(`Error code: ${error.code}`);
    }
    if (error.reason) {
      console.error(`Reason: ${error.reason}`);
    }
    process.exit(1);
  }
}

main();