#!/usr/bin/env bash
# Robust deploy script for NoCensorTV dApp (Sepolia)
# Requires: Node.js, npm, Python, Slither, MythX, Hardhat, Fleek CLI, .env
set -e

# 1. Compile contracts with optimizations
echo "[1/7] Compiling contracts..."
npm run compile

# 2. Run Slither static analysis
echo "[2/7] Running Slither security scan..."
slither ./contracts || { echo "Slither failed"; exit 1; }

# 3. Run MythX analysis (if MYTHX_API_KEY is set)
if [ -n "$MYTHX_API_KEY" ]; then
  echo "[3/7] Running MythX security scan..."
  npx mythxjs analyze ./contracts || { echo "MythX failed"; exit 1; }
else
  echo "[3/7] Skipping MythX (no API key)"
fi

# 4. Deploy contracts to Sepolia and verify
if [ -z "$ETHERSCAN_API_KEY" ]; then
  echo "ETHERSCAN_API_KEY not set in .env. Exiting."
  exit 1
fi
echo "[4/7] Deploying contracts to Sepolia..."
npm run deploy --network sepolia || { echo "Deployment failed"; exit 1; }

# 5. Generate Typechain types
echo "[5/7] Generating Typechain types..."
npm run typechain

# 6. Build React frontend
echo "[6/7] Building frontend..."
npm run build

# 7. Deploy frontend to IPFS via Fleek CLI
echo "[7/7] Deploying frontend to IPFS (Fleek)..."
fleek sites deploy --site $FLEEK_SITE_ID --api-key $FLEEK_API_KEY --dir dist || { echo "Fleek deploy failed"; exit 1; }

echo "\nDeployment complete!"
echo "Contracts deployed to Sepolia. Frontend live on Fleek."
