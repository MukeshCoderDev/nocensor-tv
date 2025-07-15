# 🔐 Security Setup Guide

## ⚠️ IMPORTANT: Never commit private keys to GitHub!

This project is open source. All sensitive information must be kept local only.

## 🔑 Required Files (Local Only)

### 1. Create `.env` file (already in .gitignore)
```bash
# Ethereum Configuration
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
PRIVATE_KEY=YOUR_64_CHAR_METAMASK_PRIVATE_KEY_WITHOUT_0x
ETHERSCAN_API_KEY=YOUR_ETHERSCAN_API_KEY

# Deployed Contract Addresses
LIBERTY_TOKEN_ADDRESS=0x76404FEB7c5dA01881CCD1dB1E201D0351Ad6994
CREATOR_REGISTRY_ADDRESS=0x5cB5536CAA837f1B1B8Ed994deD3F939FadCb27d
CONTENT_REGISTRY_ADDRESS=0x9Fc0552df6fA4ca99b2701cfD8bBDbD3F98723E8
REVENUE_SPLITTER_ADDRESS=0xEAEdEe015e7cCd4f99161F85Ec9e4f6a6fb0e408
TIP_JAR_ADDRESS=0xC85a1A189Bfe4C602506b790EE1d98ec642c5EA9

# For E2E Testing
CONTENT_STORAGE_ADDRESS=0x9Fc0552df6fA4ca99b2701cfD8bBDbD3F98723E8

# Arweave Configuration
ARWEAVE_KEY_PATH=./arweave-key.json
```

### 2. Create `arweave-key.json` file (already in .gitignore)
```json
{
  "d": "YOUR_ARWEAVE_PRIVATE_KEY_D_VALUE",
  "dp": "YOUR_ARWEAVE_PRIVATE_KEY_DP_VALUE",
  "dq": "YOUR_ARWEAVE_PRIVATE_KEY_DQ_VALUE",
  "e": "AQAB",
  "ext": true,
  "kty": "RSA",
  "n": "YOUR_ARWEAVE_PRIVATE_KEY_N_VALUE",
  "p": "YOUR_ARWEAVE_PRIVATE_KEY_P_VALUE",
  "q": "YOUR_ARWEAVE_PRIVATE_KEY_Q_VALUE",
  "qi": "YOUR_ARWEAVE_PRIVATE_KEY_QI_VALUE"
}
```

## 🚀 How to Get Your Keys

### MetaMask Private Key
1. Open MetaMask
2. Click 3 dots → Account Details
3. Click "Show private key"
4. Enter your password
5. Copy the key (should be 64 characters, no 0x prefix for .env)

### Arweave Key
You already have this - just make sure it's in `arweave-key.json`

## 🧪 Running E2E Tests

### Local Testing (Recommended)
```bash
# 1. Install ArLocal
npm install -g arlocal

# 2. Start ArLocal (in separate terminal)
arlocal

# 3. Run E2E test
npm run test:e2e -- \
  --network local \
  --rpcUrl https://sepolia.infura.io/v3/YOUR_INFURA_KEY \
  --ethPrivateKey YOUR_PRIVATE_KEY_WITH_0x \
  --arweaveKey ./arweave-key.json \
  --videoPath ./sample-video.mp4 \
  --contract YOUR_CONTRACT_ADDRESS
```

### Mainnet Testing
```bash
npm run test:e2e -- \
  --network mainnet \
  --rpcUrl https://sepolia.infura.io/v3/YOUR_INFURA_KEY \
  --ethPrivateKey YOUR_PRIVATE_KEY_WITH_0x \
  --arweaveKey ./arweave-key.json \
  --videoPath ./sample-video.mp4 \
  --contract YOUR_CONTRACT_ADDRESS
```

## ✅ Security Checklist

- [ ] `.env` file is in `.gitignore`
- [ ] `arweave-key.json` is in `.gitignore`
- [ ] Never commit private keys
- [ ] Use environment variables in CI/CD
- [ ] Rotate keys if accidentally exposed

## 🔄 For Contributors

If you're contributing to this project:
1. Copy `.env.example` to `.env`
2. Fill in your own keys
3. Never commit the `.env` file
4. Test locally before submitting PRs