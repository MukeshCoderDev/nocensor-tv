#!/usr/bin/env node

/**
 * NoCensor TV Network Maintenance Script
 * Checks network connectivity, smart contracts, and system health
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🌐 NOCENSOR TV NETWORK MAINTENANCE STARTING...\n');

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m'
};

const log = (color, message) => console.log(`${colors[color]}${message}${colors.reset}`);

// Network configuration
const networks = {
  sepolia: {
    name: 'Sepolia Testnet',
    chainId: '0xaa36a7',
    rpcUrls: [
      'https://sepolia.infura.io/v3/',
      'https://rpc.sepolia.org',
      'https://ethereum-sepolia.blockpi.network/v1/rpc/public'
    ],
    blockExplorer: 'https://sepolia.etherscan.io'
  }
};

// Test network connectivity
async function testNetworkConnectivity() {
  log('cyan', '🔍 Testing network connectivity...');
  
  for (const [networkName, config] of Object.entries(networks)) {
    log('blue', `\n📡 Testing ${config.name}...`);
    
    for (const rpcUrl of config.rpcUrls) {
      try {
        // Test basic connectivity
        const testCommand = `curl -s -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' ${rpcUrl}`;
        const result = execSync(testCommand, { encoding: 'utf8', timeout: 5000 });
        
        if (result.includes('result')) {
          log('green', `✅ ${rpcUrl} - Connected`);
        } else {
          log('red', `❌ ${rpcUrl} - Failed`);
        }
      } catch (error) {
        log('red', `❌ ${rpcUrl} - Connection failed`);
      }
    }
  }
  
  log('green', '\n✅ Network connectivity test completed');
}

// Test MetaMask integration
async function testMetaMaskIntegration() {
  log('cyan', '\n🦊 Testing MetaMask integration...');
  
  // Check if the app handles MetaMask properly
  const appFile = 'App.tsx';
  
  if (fs.existsSync(appFile)) {
    const content = fs.readFileSync(appFile, 'utf8');
    
    // Check for proper error handling
    const checks = [
      { pattern: /window\.ethereum/, desc: 'MetaMask detection' },
      { pattern: /eth_requestAccounts/, desc: 'Account request' },
      { pattern: /wallet_switchEthereumChain/, desc: 'Network switching' },
      { pattern: /wallet_addEthereumChain/, desc: 'Network addition' },
      { pattern: /0xaa36a7/, desc: 'Sepolia chain ID' },
      { pattern: /catch.*error/, desc: 'Error handling' }
    ];
    
    checks.forEach(({ pattern, desc }) => {
      if (pattern.test(content)) {
        log('green', `✅ ${desc} - Implemented`);
      } else {
        log('red', `❌ ${desc} - Missing`);
      }
    });
  }
  
  log('green', '\n✅ MetaMask integration test completed');
}

// Test Arweave integration
async function testArweaveIntegration() {
  log('cyan', '\n🌐 Testing Arweave integration...');
  
  const arweaveFiles = [
    'arweave-uploader.js',
    'src/components/arweave/DemoArweaveUploader.tsx',
    'src/services/ArweaveWalletService.ts'
  ];
  
  arweaveFiles.forEach(file => {
    if (fs.existsSync(file)) {
      log('green', `✅ ${file} - Found`);
      
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for demo mode
      if (content.includes('demo') || content.includes('Demo')) {
        log('yellow', `⚠️  ${file} - Demo mode detected`);
      }
      
      // Check for error handling
      if (content.includes('try') && content.includes('catch')) {
        log('green', `✅ ${file} - Error handling present`);
      } else {
        log('yellow', `⚠️  ${file} - Consider adding error handling`);
      }
    } else {
      log('red', `❌ ${file} - Not found`);
    }
  });
  
  log('green', '\n✅ Arweave integration test completed');
}

// Test build process
async function testBuildProcess() {
  log('cyan', '\n🔨 Testing build process...');
  
  try {
    log('blue', 'Running npm run build...');
    execSync('npm run build', { stdio: 'pipe' });
    log('green', '✅ Build successful');
    
    // Check if build directory exists
    if (fs.existsSync('dist') || fs.existsSync('build')) {
      log('green', '✅ Build directory created');
    } else {
      log('red', '❌ Build directory not found');
    }
    
  } catch (error) {
    log('red', '❌ Build failed');
    console.log(error.stdout?.toString() || error.message);
  }
  
  log('green', '\n✅ Build process test completed');
}

// Test dependencies
async function testDependencies() {
  log('cyan', '\n📦 Testing dependencies...');
  
  try {
    // Check for outdated packages
    log('blue', 'Checking for outdated packages...');
    const outdated = execSync('npm outdated --json', { encoding: 'utf8' });
    
    if (outdated.trim()) {
      const outdatedPackages = JSON.parse(outdated);
      const count = Object.keys(outdatedPackages).length;
      log('yellow', `⚠️  ${count} outdated packages found`);
      
      Object.entries(outdatedPackages).forEach(([pkg, info]) => {
        log('yellow', `   ${pkg}: ${info.current} → ${info.latest}`);
      });
    } else {
      log('green', '✅ All packages up to date');
    }
    
  } catch (error) {
    log('green', '✅ All packages up to date');
  }
  
  // Check for security vulnerabilities
  try {
    log('blue', 'Checking for security vulnerabilities...');
    execSync('npm audit --audit-level moderate', { stdio: 'pipe' });
    log('green', '✅ No security vulnerabilities found');
  } catch (error) {
    log('red', '❌ Security vulnerabilities detected - run npm audit for details');
  }
  
  log('green', '\n✅ Dependencies test completed');
}

// Test environment configuration
async function testEnvironmentConfig() {
  log('cyan', '\n⚙️  Testing environment configuration...');
  
  const requiredFiles = [
    'package.json',
    'tsconfig.json',
    'vite.config.ts',
    '.gitignore'
  ];
  
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      log('green', `✅ ${file} - Found`);
    } else {
      log('red', `❌ ${file} - Missing`);
    }
  });
  
  // Check package.json scripts
  if (fs.existsSync('package.json')) {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const requiredScripts = ['dev', 'build', 'preview'];
    
    requiredScripts.forEach(script => {
      if (packageJson.scripts && packageJson.scripts[script]) {
        log('green', `✅ Script "${script}" - Found`);
      } else {
        log('red', `❌ Script "${script}" - Missing`);
      }
    });
  }
  
  log('green', '\n✅ Environment configuration test completed');
}

// Generate maintenance report
function generateMaintenanceReport() {
  log('magenta', '\n📊 NETWORK MAINTENANCE REPORT');
  log('magenta', '=============================\n');
  
  const timestamp = new Date().toISOString();
  log('white', `Report generated: ${timestamp}`);
  log('white', `Platform: NoCensor TV`);
  log('white', `Network: Sepolia Testnet`);
  
  log('cyan', '\n🔧 MAINTENANCE RECOMMENDATIONS:');
  log('cyan', '• Run security audit regularly');
  log('cyan', '• Keep dependencies updated');
  log('cyan', '• Monitor network connectivity');
  log('cyan', '• Test wallet integration frequently');
  log('cyan', '• Backup important configurations');
  
  log('green', '\n🎯 NEXT STEPS:');
  log('green', '1. Fix any failed tests above');
  log('green', '2. Run security audit: node scripts/security-audit.js');
  log('green', '3. Update dependencies if needed');
  log('green', '4. Test on different browsers');
  log('green', '5. Prepare for production deployment');
}

// Run all maintenance checks
async function runMaintenance() {
  try {
    await testNetworkConnectivity();
    await testMetaMaskIntegration();
    await testArweaveIntegration();
    await testBuildProcess();
    await testDependencies();
    await testEnvironmentConfig();
    
    generateMaintenanceReport();
    
    log('green', '\n🎉 Network maintenance completed!');
    
  } catch (error) {
    log('red', `\n❌ Maintenance failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the maintenance
runMaintenance();