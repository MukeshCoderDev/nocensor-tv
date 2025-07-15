# E2E Test Guide for NoCensor TV

This guide will help you run the complete end-to-end test that uploads a video to Arweave, stores the content ID on-chain, and downloads it back.

## Prerequisites

### 1. Install Dependencies
The required dependencies are already installed:
- `@bundlr-network/client` - For Arweave uploads
- `arweave` - Arweave client
- `ethers` - Ethereum interactions
- `yargs` - Command line argument parsing
- `node-fetch` - HTTP requests

### 2. Set Up Arweave Key
You need an Arweave wallet key file. If you don't have one:

```bash
# Generate a new Arweave key (you can use the Arweave CLI or create one programmatically)
# For testing, you can use your existing arweave-key.json
```

### 3. Set Up Ethereum Private Key
You need an Ethereum private key (hex format, with or without 0x prefix).

### 4. Deploy ContentStorage Contract
Make sure your ContentStorage contract is deployed. You can use:

```bash
npm run deploy
```

### 5. Start ArLocal (for local testing)
If testing locally, start ArLocal:

```bash
# Install ArLocal globally
npm install -g arlocal

# Start ArLocal
arlocal
```

## Running the E2E Test

### Local Testing (with ArLocal)

```bash
npm run test:e2e -- \
  --network local \
  --rpcUrl https://rpc.sepolia.org \
  --ethPrivateKey YOUR_ETH_PRIVATE_KEY \
  --arweaveKey ./arweave-key.json \
  --videoPath ./sample-video.mp4 \
  --contract YOUR_CONTENT_STORAGE_ADDRESS \
  --videoId 0
```

### Mainnet Testing

```bash
npm run test:e2e -- \
  --network mainnet \
  --rpcUrl https://rpc.sepolia.org \
  --ethPrivateKey YOUR_ETH_PRIVATE_KEY \
  --arweaveKey ./arweave-key.json \
  --videoPath ./sample-video.mp4 \
  --contract YOUR_CONTENT_STORAGE_ADDRESS \
  --videoId 1
```

## Example Commands

### Using Environment Variables
Create a `.env.test` file:

```bash
ETH_PRIVATE_KEY=0x1234567890abcdef...
CONTENT_STORAGE_ADDRESS=0xYourContractAddress...
SEPOLIA_RPC_URL=https://rpc.sepolia.org
```

Then run:

```bash
# Load environment and run test
npm run test:e2e -- \
  --network local \
  --rpcUrl $SEPOLIA_RPC_URL \
  --ethPrivateKey $ETH_PRIVATE_KEY \
  --arweaveKey ./arweave-key.json \
  --videoPath ./sample-video.mp4 \
  --contract $CONTENT_STORAGE_ADDRESS
```

## What the Test Does

1. **🚀 Initialization**: Sets up Arweave and Bundlr clients
2. **📤 Upload**: Uploads your video file to Arweave/ArLocal
3. **⛓️ Store**: Calls your ContentStorage contract to store the Arweave transaction ID
4. **🔍 Verify**: Retrieves the stored content ID from the contract
5. **⬇️ Download**: Downloads the video back from Arweave using the stored ID
6. **✅ Validate**: Compares file sizes to ensure integrity

## Expected Output

```
🚀 Starting E2E Test...

📡 Initializing Arweave and Bundlr...
✅ Arweave and Bundlr initialized

📤 Uploading video to Arweave...
Video size: 0.00 MB
✅ Video uploaded to Arweave: abc123...

⛓️ Storing content ID on-chain...
Using wallet: 0x1234...
Contract owner: 0x1234...
Estimated gas: 45000
Transaction sent: 0xdef456...
⏳ Waiting for confirmation...
✅ Transaction confirmed in block 12345
Gas used: 43000

🔍 Verifying on-chain storage...
Stored Arweave TxID: abc123...
✅ On-chain storage verified

⬇️ Downloading video from Arweave...
Download URL: http://localhost:1984/abc123...
✅ Video downloaded to: downloaded-0.mp4
Original size: 40 bytes
Downloaded size: 40 bytes
✅ File sizes match - integrity verified

🎉 E2E Test completed successfully!

Summary:
- Video ID: 0
- Arweave TxID: abc123...
- Ethereum TxHash: 0xdef456...
- Downloaded file: downloaded-0.mp4
```

## Troubleshooting

### Common Issues

1. **"Insufficient Bundlr balance"**
   - Fund your Arweave wallet with AR tokens
   - Or use local testing with ArLocal

2. **"Wallet is not contract owner"**
   - Make sure you're using the same private key that deployed the contract
   - Or update the contract owner

3. **"Download failed"**
   - Wait a few minutes for Arweave propagation
   - Check if ArLocal is running for local tests

4. **Gas estimation failed**
   - Check your RPC URL is correct
   - Ensure you have enough ETH for gas

### Debug Mode
Add more verbose logging by modifying the script or checking transaction details on Etherscan.

## Files Created
- `downloaded-{videoId}.mp4` - The downloaded video file
- Console logs with all transaction details

## Next Steps
After successful testing, you can:
1. Integrate this flow into your frontend
2. Add more sophisticated video metadata
3. Implement batch uploads
4. Add video transcoding pipeline