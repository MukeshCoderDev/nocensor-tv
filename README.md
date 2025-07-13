# NoCensor TV - Decentralized Adult Content Platform

[![Web3](https://img.shields.io/badge/Web3-Pure_Decentralization-brightgreen)](https://nocensor.tv)
[![License: Polyform Shield 1.0.0](https://img.shields.io/badge/License-Polyform_Shield_1.0.0-blue.svg)](https://polyformproject.org/licenses/shield/1.0.0/)

## The First Truly Decentralized Adult Content Platform

NoCensor TV is built on:
- 🌐 Helia for browser-native IPFS
- 🔗 Ethereum/Polygon blockchain
- 💰 90% creator revenue model
- 🛡️ Censorship-resistant architecture

## Features
- P2P video streaming with no central servers
- **Decentralized Arweave Video Uploader**: Enjoy free, experimental uploads on testnet, with permanent, censorship-resistant storage on Arweave mainnet. Features a professional, step-by-step UI with real-time progress indication.
- NFT-based content access control
- DAO governance for platform decisions
- Encrypted content storage
- Real-time analytics

## How Video Storage Works

### Testnet (Sepolia/Mumbai):
Uploading videos on our test networks is completely free. There is no cost or token requirement—feel free to experiment and make sure everything works as expected.

### Mainnet (Arweave):
When you’re ready to go live, each video upload becomes a permanent, one‑time purchase of decentralized storage on the Arweave network. You will be prompted to fund your Arweave wallet with the exact amount of AR tokens needed to store your file forever. Once the upload completes, your video is immutably stored across a global, censorship‑resistant network—no recurring fees, no middlemen, and no possibility of takedown.

Note: You only pay Arweave storage fees once per video. Any excess AR you deposit but don’t use will be automatically returned to your wallet.

## Getting Started

### Prerequisites
- Node.js v18+
- MetaMask wallet
- IPFS Companion browser extension

### Installation
```
git clone https://github.com/MukeshCoderDev/nocensor-tv.git
cd nocensor-tv
npm install
```

### Configuration
1. Copy `.env.example` to `.env`
2. Add your keys:
   - WEB3_STORAGE_TOKEN
   - CRUST_CHAIN_RPC
   - DAO_CONTRACT_ADDRESS

### Running Locally
```
npm run dev
```

### Deployment
```
# Deploy contracts to Polygon
npm run deploy:contracts

# Deploy frontend to IPFS
npm run deploy:frontend
```

## Architecture
![System Architecture](docs/architecture.png)

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License
Protected by [Polyform Shield 1.0.0](https://polyformproject.org/licenses/shield/1.0.0/)
