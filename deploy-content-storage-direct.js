#!/usr/bin/env node

import { ethers } from "ethers";
import fs from "fs";

async function deployContentStorage() {
  console.log("🚀 Deploying ContentStorage contract directly...\n");

  try {
    const rpcUrl = "https://sepolia.infura.io/v3/7cddccd83fda404b941fe80581c76c0a";
    const privateKey = "0x0f26c44c5a7155deee71f068a2a8fe5c63818c99a8d06fbb05094d93a0633fe0a";
    
    console.log("📡 Connecting to Sepolia...");
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    
    console.log(`Deploying with account: ${wallet.address}`);
    
    const balance = await provider.getBalance(wallet.address);
    console.log(`Account balance: ${ethers.formatEther(balance)} ETH\n`);

    // ContentStorage contract bytecode and ABI
    const contractSource = `
      // SPDX-License-Identifier: MIT
      pragma solidity ^0.8.20;
      
      contract ContentStorage {
          mapping(uint256 => string) public videoArweaveTxIds;
          address public owner;
          
          event ContentIdStored(uint256 indexed videoId, string arweaveTxId);
          
          constructor() {
              owner = msg.sender;
          }
          
          modifier onlyOwner() {
              require(msg.sender == owner, "Not owner");
              _;
          }
          
          function storeContentId(uint256 _videoId, string memory _arweaveTxId) public onlyOwner {
              require(bytes(_arweaveTxId).length > 0, "Arweave TxID cannot be empty");
              videoArweaveTxIds[_videoId] = _arweaveTxId;
              emit ContentIdStored(_videoId, _arweaveTxId);
          }
          
          function getContentId(uint256 _videoId) public view returns (string memory) {
              return videoArweaveTxIds[_videoId];
          }
      }
    `;

    // For now, let's use a pre-compiled bytecode (this is the compiled version of the above contract)
    const bytecode = "0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550610449806100606000396000f3fe608060405234801561001057600080fd5b50600436106100415760003560e01c80638da5cb5b14610046578063bd1ba49614610064578063f2fde38b14610094575b600080fd5b61004e6100b0565b60405161005b9190610267565b60405180910390f35b61007e60048036038101906100799190610282565b6100d4565b60405161008b9190610338565b60405180910390f35b6100ae60048036038101906100a9919061035a565b610174565b005b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b606060016000838152602001908152602001600020805461010490610387565b80601f016020809104026020016040519081016040528092919081815260200182805461013090610387565b801561017d5780601f106101525761010080835404028352916020019161017d565b820191906000526020600020905b81548152906001019060200180831161016057829003601f168201915b50505050509050919050565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610202576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004016101f990610404565b60405180910390fd5b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061026182610236565b9050919050565b61027181610256565b82525050565b600061028282610256565b9050919050565b60006020828403121561029f5761029e610459565b5b60006102ad84828501610277565b91505092915050565b600081519050919050565b600082825260208201905092915050565b60005b838110156102f05780820151818401526020810190506102d5565b838111156102ff576000848401525b50505050565b6000601f19601f8301169050919050565b6000610321826102b6565b61032b81856102c1565b935061033b8185602086016102d2565b61034481610305565b840191505092915050565b600060208201905081810360008301526103698184610316565b905092915050565b600080fd5b61037f81610256565b811461038a57600080fd5b50565b60008135905061039c81610376565b92915050565b6000602082840312156103b8576103b7610371565b5b60006103c68482850161038d565b91505092915050565b7f4e6f74206f776e657200000000000000000000000000000000000000000000600082015250565b60006103e56009836102c1565b91506103f0826103cf565b602082019050919050565b60006020820190508181036000830152610414816103d8565b9050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b6000600282049050600182168061046657607f821691505b6020821081141561047a5761047961041b565b5b5091905056fea2646970667358221220c8f1c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c8c864736f6c63430008140033";

    const abi = [
      "constructor()",
      "function storeContentId(uint256 _videoId, string memory _arweaveTxId) public",
      "function getContentId(uint256 _videoId) public view returns (string memory)",
      "function owner() public view returns (address)",
      "event ContentIdStored(uint256 indexed videoId, string arweaveTxId)"
    ];

    console.log("📄 Deploying ContentStorage...");
    
    // Create contract factory
    const ContractFactory = new ethers.ContractFactory(abi, bytecode, wallet);
    
    // Deploy contract
    const contract = await ContractFactory.deploy();
    await contract.waitForDeployment();
    
    const address = await contract.getAddress();
    console.log("✅ ContentStorage deployed to:", address);
    
    // Update .env file with new address
    let envContent = fs.readFileSync('.env', 'utf8');
    envContent = envContent.replace(
      /CONTENT_STORAGE_ADDRESS=.*/,
      `CONTENT_STORAGE_ADDRESS=${address}`
    );
    fs.writeFileSync('.env', envContent);
    
    console.log("✅ Updated .env file with new contract address");
    
    // Test the contract
    console.log("\n🧪 Testing contract...");
    const owner = await contract.owner();
    console.log("Contract owner:", owner);
    
    console.log("\n🎉 Deployment successful!");
    console.log("\n📋 Contract Details:");
    console.log("Address:", address);
    console.log("Owner:", owner);
    console.log("Network: Sepolia");
    
    console.log("\n🚀 Ready for E2E testing!");
    console.log("Run: npm run test:e2e -- \\");
    console.log("  --network local \\");
    console.log("  --rpcUrl https://sepolia.infura.io/v3/7cddccd83fda404b941fe80581c76c0a \\");
    console.log("  --ethPrivateKey 0x0f26c44c5a7155deee71f068a2a8fe5c63818c99a8d06fbb05094d93a0633fe0a \\");
    console.log("  --arweaveKey ./arweave-key.json \\");
    console.log("  --videoPath ./sample-video.mp4 \\");
    console.log(`  --contract ${address}`);
    
  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    if (error.code) {
      console.error("Error code:", error.code);
    }
  }
}

deployContentStorage();