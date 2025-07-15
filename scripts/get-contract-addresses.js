#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// This script helps you find deployed contract addresses
console.log('🔍 Looking for deployed contract addresses...\n');

// Check ignition deployments
const ignitionPath = './ignition/deployments';
if (fs.existsSync(ignitionPath)) {
  const networks = fs.readdirSync(ignitionPath);
  
  networks.forEach(network => {
    console.log(`📡 Network: ${network}`);
    const networkPath = path.join(ignitionPath, network);
    
    if (fs.existsSync(path.join(networkPath, 'deployed_addresses.json'))) {
      const addresses = JSON.parse(
        fs.readFileSync(path.join(networkPath, 'deployed_addresses.json'), 'utf8')
      );
      
      Object.entries(addresses).forEach(([contract, address]) => {
        console.log(`  ${contract}: ${address}`);
      });
    }
    console.log('');
  });
}

// Check for hardhat artifacts
const artifactsPath = './artifacts/contracts';
if (fs.existsSync(artifactsPath)) {
  console.log('📄 Available contracts:');
  
  function findContracts(dir) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const itemPath = path.join(dir, item);
      const stat = fs.statSync(itemPath);
      
      if (stat.isDirectory() && !item.includes('.dbg.json')) {
        findContracts(itemPath);
      } else if (item.endsWith('.json') && !item.includes('.dbg.json')) {
        const contractName = item.replace('.json', '');
        console.log(`  - ${contractName}`);
      }
    });
  }
  
  findContracts(artifactsPath);
}

console.log('\n💡 To get actual deployed addresses:');
console.log('1. Check your deployment logs');
console.log('2. Look in ignition/deployments/{network}/deployed_addresses.json');
console.log('3. Check your .env files for contract addresses');

// Check .env files for contract addresses
const envFiles = ['.env', '.env.development', '.env.local'];
envFiles.forEach(envFile => {
  if (fs.existsSync(envFile)) {
    console.log(`\n📋 Contract addresses in ${envFile}:`);
    const content = fs.readFileSync(envFile, 'utf8');
    const lines = content.split('\n');
    
    lines.forEach(line => {
      if (line.includes('CONTRACT') || line.includes('ADDRESS')) {
        console.log(`  ${line}`);
      }
    });
  }
});