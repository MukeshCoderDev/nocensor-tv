import React, { useState } from 'react';
import Icon from '../../components/Icon';

interface Chain {
  id: string;
  name: string;
  symbol: string;
  chainId: string;
  rpcUrl: string;
  blockExplorer: string;
  icon: string;
  color: string;
  description: string;
}

const SUPPORTED_CHAINS: Chain[] = [
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    chainId: '0x1',
    rpcUrl: 'https://mainnet.infura.io/v3/',
    blockExplorer: 'https://etherscan.io',
    icon: 'fab fa-ethereum',
    color: '#627eea',
    description: 'The original smart contract platform'
  },
  {
    id: 'polygon',
    name: 'Polygon',
    symbol: 'MATIC',
    chainId: '0x89',
    rpcUrl: 'https://polygon-rpc.com',
    blockExplorer: 'https://polygonscan.com',
    icon: 'fas fa-gem',
    color: '#8247e5',
    description: 'Fast and cheap Ethereum scaling'
  },
  {
    id: 'bsc',
    name: 'BNB Chain',
    symbol: 'BNB',
    chainId: '0x38',
    rpcUrl: 'https://bsc-dataseed.binance.org',
    blockExplorer: 'https://bscscan.com',
    icon: 'fas fa-coins',
    color: '#f3ba2f',
    description: 'Binance Smart Chain ecosystem'
  },
  {
    id: 'arbitrum',
    name: 'Arbitrum',
    symbol: 'ETH',
    chainId: '0xa4b1',
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    blockExplorer: 'https://arbiscan.io',
    icon: 'fas fa-layer-group',
    color: '#28a0f0',
    description: 'Ethereum Layer 2 scaling solution'
  },
  {
    id: 'optimism',
    name: 'Optimism',
    symbol: 'ETH',
    chainId: '0xa',
    rpcUrl: 'https://mainnet.optimism.io',
    blockExplorer: 'https://optimistic.etherscan.io',
    icon: 'fas fa-rocket',
    color: '#ff0420',
    description: 'Optimistic Ethereum rollup'
  },
  {
    id: 'avalanche',
    name: 'Avalanche',
    symbol: 'AVAX',
    chainId: '0xa86a',
    rpcUrl: 'https://api.avax.network/ext/bc/C/rpc',
    blockExplorer: 'https://snowtrace.io',
    icon: 'fas fa-mountain',
    color: '#e84142',
    description: 'High-performance blockchain platform'
  }
];

interface ChainSelectorProps {
  selectedChain: Chain | null;
  onChainSelected: (chain: Chain) => void;
  onChainSwitch: (chain: Chain) => void;
}

const ChainSelector: React.FC<ChainSelectorProps> = ({
  selectedChain,
  onChainSelected,
  onChainSwitch
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  const handleChainSelect = async (chain: Chain) => {
    if (selectedChain?.id === chain.id) {
      setIsOpen(false);
      return;
    }

    setIsSwitching(true);
    
    try {
      // Switch network in wallet
      if (typeof window.ethereum !== 'undefined') {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: chain.chainId }],
          });
        } catch (switchError: any) {
          // Chain not added to wallet, add it
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: chain.chainId,
                chainName: chain.name,
                nativeCurrency: {
                  name: chain.symbol,
                  symbol: chain.symbol,
                  decimals: 18,
                },
                rpcUrls: [chain.rpcUrl],
                blockExplorerUrls: [chain.blockExplorer],
              }],
            });
          } else {
            throw switchError;
          }
        }
      }
      
      onChainSelected(chain);
      onChainSwitch(chain);
      setIsOpen(false);
      
    } catch (error) {
      console.error('Failed to switch chain:', error);
    } finally {
      setIsSwitching(false);
    }
  };

  return (
    <div className="chain-selector relative">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[#f5f5f5] mb-2">
          <Icon name="fas fa-network-wired" className="mr-2 text-[#8a2be2]" />
          Select Blockchain Network
        </h3>
        <p className="text-gray-400 text-sm">Choose which blockchain to use for your uploads</p>
      </div>

      {selectedChain ? (
        <div className="bg-[#2a2a2a] rounded-[15px] p-4 border-l-4 border-[#4ade80]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: selectedChain.color }}
              >
                <Icon name={selectedChain.icon} />
              </div>
              <div>
                <h4 className="text-[#f5f5f5] font-semibold">{selectedChain.name}</h4>
                <p className="text-gray-400 text-sm">{selectedChain.description}</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-[#8a2be2] hover:bg-[#6a0dad] text-white px-4 py-2 rounded-[10px] text-sm font-medium transition-colors"
            >
              Switch Network
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-[#2a2a2a] hover:bg-[rgba(138,43,226,0.1)] border-2 border-dashed border-[#8a2be2] rounded-[15px] p-6 text-center transition-all duration-300"
        >
          <Icon name="fas fa-plus-circle" className="text-3xl text-[#8a2be2] mb-2" />
          <h4 className="text-[#f5f5f5] font-semibold mb-1">Select Blockchain</h4>
          <p className="text-gray-400 text-sm">Choose your preferred network</p>
        </button>
      )}

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#2a2a2a] rounded-[15px] border border-[#3a3a3a] shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="p-4">
            <h4 className="text-[#f5f5f5] font-semibold mb-3">Available Networks</h4>
            <div className="space-y-2">
              {SUPPORTED_CHAINS.map((chain) => (
                <button
                  key={chain.id}
                  onClick={() => handleChainSelect(chain)}
                  disabled={isSwitching}
                  className={`
                    w-full flex items-center gap-3 p-3 rounded-[10px] text-left
                    hover:bg-[rgba(138,43,226,0.1)] transition-colors
                    ${selectedChain?.id === chain.id ? 'bg-[rgba(138,43,226,0.2)] border border-[#8a2be2]' : 'border border-transparent'}
                    ${isSwitching ? 'opacity-50' : ''}
                  `}
                >
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                    style={{ backgroundColor: chain.color }}
                  >
                    <Icon name={chain.icon} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[#f5f5f5] font-medium">{chain.name}</span>
                      <span className="text-gray-400 text-xs">({chain.symbol})</span>
                      {selectedChain?.id === chain.id && (
                        <Icon name="fas fa-check-circle" className="text-[#4ade80] text-sm" />
                      )}
                    </div>
                    <p className="text-gray-400 text-xs">{chain.description}</p>
                  </div>
                  {isSwitching && (
                    <Icon name="fas fa-spinner" className="text-[#8a2be2] animate-spin" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          <div className="border-t border-[#3a3a3a] p-4">
            <button
              onClick={() => setIsOpen(false)}
              className="w-full text-gray-400 hover:text-[#f5f5f5] text-sm py-2 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      <div className="mt-4 text-center">
        <p className="text-gray-400 text-xs">
          <Icon name="fas fa-info-circle" className="mr-1" />
          Gas fees vary by network. Polygon and BSC offer lower costs.
        </p>
      </div>
    </div>
  );
};

export default ChainSelector;