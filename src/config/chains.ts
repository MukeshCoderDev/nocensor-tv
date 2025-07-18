import { sepolia, polygon, bnbSmartChain, arbitrum, optimism, avalanche } from '@web3modal/ethers/chains';

export { sepolia }; // Export sepolia specifically

export const chains = [
  sepolia,
  polygon,
  bnbSmartChain,
  arbitrum,
  optimism,
  avalanche,
];

export const projectId = 'YOUR_PROJECT_ID'; // Replace with your WalletConnect Project ID

if (!projectId) {
  throw new Error('You need to provide your WalletConnect Project ID in src/config/chains.ts');
}