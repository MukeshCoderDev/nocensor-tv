#!/usr/bin/env node

/**
 * NoCensor TV Security Audit Script
 * Comprehensive security check for the entire platform
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('🛡️  NOCENSOR TV SECURITY AUDIT STARTING...\n');

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

// Audit results
const auditResults = {
  critical: [],
  high: [],
  medium: [],
  low: [],
  info: []
};

function addFinding(severity, category, description, file = null, line = null) {
  const finding = {
    category,
    description,
    file,
    line,
    timestamp: new Date().toISOString()
  };
  auditResults[severity].push(finding);
}

// 1. Check for sensitive data exposure
function checkSensitiveData() {
  log('cyan', '🔍 Checking for sensitive data exposure...');
  
  const sensitivePatterns = [
    { pattern: /api[_-]?key/i, desc: 'API Key reference' },
    { pattern: /secret/i, desc: 'Secret reference' },
    { pattern: /password/i, desc: 'Password reference' },
    { pattern: /private[_-]?key/i, desc: 'Private key reference' },
    { pattern: /0x[a-fA-F0-9]{64}/g, desc: 'Potential private key' },
    { pattern: /sk_[a-zA-Z0-9]{24,}/g, desc: 'Stripe secret key' },
    { pattern: /AIza[0-9A-Za-z\\-_]{35}/g, desc: 'Google API key' }
  ];

  function scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        sensitivePatterns.forEach(({ pattern, desc }) => {
          if (pattern.test(line) && !line.includes('// SAFE:') && !line.includes('example')) {
            addFinding('high', 'Sensitive Data', `${desc} found: ${line.trim()}`, filePath, index + 1);
          }
        });
      });
    } catch (error) {
      // Skip files that can't be read
    }
  }

  // Scan all JS/TS files
  function scanDirectory(dir) {
    try {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
          scanDirectory(filePath);
        } else if (file.match(/\.(js|ts|tsx|jsx|env)$/)) {
          scanFile(filePath);
        }
      });
    } catch (error) {
      // Skip directories that can't be read
    }
  }

  scanDirectory('.');
  log('green', '✅ Sensitive data check completed');
}

// 2. Check wallet integration security
function checkWalletSecurity() {
  log('cyan', '🔍 Checking wallet integration security...');
  
  const walletFiles = [
    'App.tsx',
    'src/components/arweave/ArweaveUploaderContainer.tsx',
    'src/services/ArweaveWalletService.ts',
    'arweave-uploader.js'
  ];

  walletFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for proper error handling
      if (!content.includes('try') || !content.includes('catch')) {
        addFinding('medium', 'Wallet Security', 'Missing error handling in wallet operations', file);
      }
      
      // Check for user rejection handling
      if (content.includes('eth_requestAccounts') && !content.includes('4001')) {
        addFinding('medium', 'Wallet Security', 'Missing user rejection error handling', file);
      }
      
      // Check for network validation
      if (content.includes('wallet_switchEthereumChain') && !content.includes('chainId')) {
        addFinding('low', 'Wallet Security', 'Network validation could be improved', file);
      }
    }
  });
  
  log('green', '✅ Wallet security check completed');
}

// 3. Check for XSS vulnerabilities
function checkXSSVulnerabilities() {
  log('cyan', '🔍 Checking for XSS vulnerabilities...');
  
  function scanForXSS(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');
      
      lines.forEach((line, index) => {
        // Check for dangerous innerHTML usage
        if (line.includes('dangerouslySetInnerHTML') && !line.includes('DOMPurify')) {
          addFinding('high', 'XSS', 'Dangerous innerHTML without sanitization', filePath, index + 1);
        }
        
        // Check for direct HTML insertion
        if (line.includes('.innerHTML') && !line.includes('sanitize')) {
          addFinding('medium', 'XSS', 'Direct innerHTML usage without sanitization', filePath, index + 1);
        }
        
        // Check for eval usage
        if (line.includes('eval(') && !line.includes('// SAFE:')) {
          addFinding('critical', 'XSS', 'Use of eval() function', filePath, index + 1);
        }
      });
    } catch (error) {
      // Skip files that can't be read
    }
  }

  // Scan React components
  function scanComponents(dir) {
    try {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
          scanComponents(filePath);
        } else if (file.match(/\.(tsx|jsx)$/)) {
          scanForXSS(filePath);
        }
      });
    } catch (error) {
      // Skip directories that can't be read
    }
  }

  scanComponents('.');
  log('green', '✅ XSS vulnerability check completed');
}

// 4. Check file upload security
function checkFileUploadSecurity() {
  log('cyan', '🔍 Checking file upload security...');
  
  const uploadFiles = [
    'pages/StudioUploadPage.tsx',
    'src/components/arweave/VideoSelector.tsx',
    'arweave-uploader.js'
  ];

  uploadFiles.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8');
      
      // Check for file type validation
      if (content.includes('accept=') && !content.includes('video/*')) {
        addFinding('medium', 'File Upload', 'File type restrictions could be more specific', file);
      }
      
      // Check for file size validation
      if (!content.includes('size') && content.includes('File')) {
        addFinding('medium', 'File Upload', 'Missing file size validation', file);
      }
      
      // Check for malicious file detection
      if (!content.includes('validate') && content.includes('upload')) {
        addFinding('low', 'File Upload', 'Consider adding malicious file detection', file);
      }
    }
  });
  
  log('green', '✅ File upload security check completed');
}

// 5. Check dependencies for vulnerabilities
function checkDependencies() {
  log('cyan', '🔍 Checking dependencies for vulnerabilities...');
  
  try {
    // Run npm audit
    const auditOutput = execSync('npm audit --json', { encoding: 'utf8' });
    const auditData = JSON.parse(auditOutput);
    
    if (auditData.vulnerabilities) {
      Object.entries(auditData.vulnerabilities).forEach(([pkg, vuln]) => {
        const severity = vuln.severity;
        addFinding(severity, 'Dependencies', `${pkg}: ${vuln.title}`, 'package.json');
      });
    }
  } catch (error) {
    addFinding('info', 'Dependencies', 'Could not run npm audit - please run manually');
  }
  
  log('green', '✅ Dependencies check completed');
}

// 6. Check environment configuration
function checkEnvironmentConfig() {
  log('cyan', '🔍 Checking environment configuration...');
  
  // Check for .env files
  const envFiles = ['.env', '.env.local', '.env.development', '.env.production'];
  
  envFiles.forEach(file => {
    if (fs.existsSync(file)) {
      addFinding('info', 'Environment', `Environment file found: ${file}`, file);
      
      const content = fs.readFileSync(file, 'utf8');
      if (content.includes('localhost') || content.includes('127.0.0.1')) {
        addFinding('low', 'Environment', 'Development URLs in environment file', file);
      }
    }
  });
  
  // Check if .env is in .gitignore
  if (fs.existsSync('.gitignore')) {
    const gitignore = fs.readFileSync('.gitignore', 'utf8');
    if (!gitignore.includes('.env')) {
      addFinding('high', 'Environment', '.env files not in .gitignore');
    }
  }
  
  log('green', '✅ Environment configuration check completed');
}

// 7. Check smart contract integration
function checkSmartContractSecurity() {
  log('cyan', '🔍 Checking smart contract integration...');
  
  const contractFiles = fs.readdirSync('.').filter(file => 
    file.includes('contract') || file.includes('abi') || file.endsWith('.sol')
  );
  
  contractFiles.forEach(file => {
    addFinding('info', 'Smart Contracts', `Contract file found: ${file}`, file);
  });
  
  // Check for hardcoded addresses
  function checkHardcodedAddresses(dir) {
    try {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
          checkHardcodedAddresses(filePath);
        } else if (file.match(/\.(js|ts|tsx|jsx)$/)) {
          try {
            const content = fs.readFileSync(filePath, 'utf8');
            const addressPattern = /0x[a-fA-F0-9]{40}/g;
            const matches = content.match(addressPattern);
            
            if (matches && matches.length > 0) {
              matches.forEach(address => {
                addFinding('medium', 'Smart Contracts', `Hardcoded address found: ${address}`, filePath);
              });
            }
          } catch (error) {
            // Skip files that can't be read
          }
        }
      });
    } catch (error) {
      // Skip directories that can't be read
    }
  }
  
  checkHardcodedAddresses('.');
  log('green', '✅ Smart contract security check completed');
}

// Generate audit report
function generateReport() {
  log('magenta', '\n📊 SECURITY AUDIT REPORT');
  log('magenta', '========================\n');
  
  const totalFindings = Object.values(auditResults).reduce((sum, findings) => sum + findings.length, 0);
  
  log('white', `Total findings: ${totalFindings}\n`);
  
  // Summary by severity
  Object.entries(auditResults).forEach(([severity, findings]) => {
    if (findings.length > 0) {
      const color = {
        critical: 'red',
        high: 'red',
        medium: 'yellow',
        low: 'blue',
        info: 'cyan'
      }[severity];
      
      log(color, `${severity.toUpperCase()}: ${findings.length} findings`);
    }
  });
  
  console.log('\n');
  
  // Detailed findings
  Object.entries(auditResults).forEach(([severity, findings]) => {
    if (findings.length > 0) {
      const color = {
        critical: 'red',
        high: 'red',
        medium: 'yellow',
        low: 'blue',
        info: 'cyan'
      }[severity];
      
      log(color, `\n${severity.toUpperCase()} FINDINGS:`);
      log(color, '='.repeat(severity.length + 10));
      
      findings.forEach((finding, index) => {
        console.log(`${index + 1}. [${finding.category}] ${finding.description}`);
        if (finding.file) {
          console.log(`   File: ${finding.file}${finding.line ? `:${finding.line}` : ''}`);
        }
        console.log('');
      });
    }
  });
  
  // Security score
  const criticalWeight = auditResults.critical.length * 10;
  const highWeight = auditResults.high.length * 5;
  const mediumWeight = auditResults.medium.length * 2;
  const lowWeight = auditResults.low.length * 1;
  
  const totalWeight = criticalWeight + highWeight + mediumWeight + lowWeight;
  const securityScore = Math.max(0, 100 - totalWeight);
  
  const scoreColor = securityScore >= 90 ? 'green' : securityScore >= 70 ? 'yellow' : 'red';
  
  log('white', '\n🏆 SECURITY SCORE');
  log('white', '================');
  log(scoreColor, `${securityScore}/100`);
  
  if (securityScore >= 90) {
    log('green', '✅ Excellent security posture!');
  } else if (securityScore >= 70) {
    log('yellow', '⚠️  Good security, but improvements needed');
  } else {
    log('red', '🚨 Security improvements required before production');
  }
  
  // Recommendations
  log('white', '\n💡 RECOMMENDATIONS');
  log('white', '==================');
  
  if (auditResults.critical.length > 0) {
    log('red', '🚨 Address all CRITICAL issues immediately');
  }
  if (auditResults.high.length > 0) {
    log('red', '⚠️  Fix HIGH severity issues before deployment');
  }
  if (auditResults.medium.length > 0) {
    log('yellow', '📋 Plan to address MEDIUM issues in next release');
  }
  
  log('cyan', '🔄 Run this audit regularly during development');
  log('cyan', '🛡️  Consider professional security audit for production');
  log('cyan', '📚 Keep dependencies updated');
  
  // Save report to file
  const reportData = {
    timestamp: new Date().toISOString(),
    totalFindings,
    securityScore,
    findings: auditResults
  };
  
  fs.writeFileSync('security-audit-report.json', JSON.stringify(reportData, null, 2));
  log('green', '\n📄 Report saved to security-audit-report.json');
}

// Run all checks
async function runAudit() {
  try {
    checkSensitiveData();
    checkWalletSecurity();
    checkXSSVulnerabilities();
    checkFileUploadSecurity();
    checkDependencies();
    checkEnvironmentConfig();
    checkSmartContractSecurity();
    
    generateReport();
    
    log('green', '\n🎉 Security audit completed!');
    
  } catch (error) {
    log('red', `\n❌ Audit failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the audit
runAudit();