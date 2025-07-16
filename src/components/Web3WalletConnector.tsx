import React, { useState, useEffect } from 'react';
import Icon from '../../components/Icon';

interface WalletOption {
  name: string;
  icon: string;
  id: string;
  description: string;
  color: string;
}

const SUPPORTED_WALLETS: WalletOption[] = [
  {
    name: 'MetaMask',
    icon: 'fas fa-fox',
    id: 'metamask',
    description: 'Most popular Ethereum wallet',
    color: '#f6851b'
  },
  {
    name: 'WalletConnect',
    icon: 'fas fa-qrcode',
    id: 'walletconnect',
    description: 'Connect any mobile wallet',
    color: '#3b99fc'
  },
  {
    name: 'Coinbase Wallet',
    icon: 'fas fa-coins',
    id: 'coinbase',
    description: 'Coinbase\'s self-custody wallet',
    color: '#0052ff'
  },
  {
    name: 'Phantom',
    icon: 'fas fa-ghost',
    id: 'phantom',
    description: 'Leading Solana wallet',
    color: '#ab9ff2'
  },
  {
    name: 'Trust Wallet',
    icon: 'fas fa-shield-alt',
    id: 'trust',
    description: 'Multi-chain mobile wallet',
    color: '#3375bb'
  },
  {
    name: 'Rainbow',
    icon: 'fas fa-rainbow',
    id: 'rainbow',
    description: 'Beautiful Ethereum wallet',
    color: '#ff6b6b'
  }
];

interface Web3WalletConnectorProps {
  onWalletConnected: (wallet: any) => void;
  onError: (error: string) => void;
}

const Web3WalletConnector: React.FC<Web3WalletConnectorProps> = ({
  onWalletConnected,
  onError
}) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [connectedWallet, setConnectedWallet] = useState<any>(null);

  const connectWallet = async (walletId: string) => {
    setIsConnecting(true);
    setSelectedWallet(walletId);
    
    try {
      let provider;
      let accounts;
      
      switch (walletId) {
        case 'metamask':
          if (typeof window.ethereum === 'undefined') {
            throw new Error('MetaMask is not installed! Please install MetaMask to continue.');
          }
          provider = window.ethereum;
          accounts = await provider.request({ method: 'eth_requestAccounts' });
          break;
          
        case 'walletconnect':
          // WalletConnect integration would go here
          throw new Error('WalletConnect integration coming soon!');
          
        case 'coinbase':
          // Coinbase Wallet integration would go here
          throw new Error('Coinbase Wallet integration coming soon!');
          
        case 'phantom':
          // Phantom wallet integration would go here
          if (typeof window.solana === 'undefined') {
            throw new Error('Phantom wallet is not installed!');
          }
          throw new Error('Phantom integration coming soon!');
          
        case 'trust':
          // Trust Wallet integration would go here
          throw new Error('Trust Wallet integration coming soon!');
          
        case 'rainbow':
          // Rainbow wallet integration would go here
          throw new Error('Rainbow wallet integration coming soon!');
          
        default:
          throw new Error('Unsupported wallet');
      }
      
      if (accounts && accounts.length > 0) {
        const walletInfo = {
          address: accounts[0],
          provider: provider,
          walletType: walletId,
          chainId: await provider.request({ method: 'eth_chainId' })
        };
        
        setConnectedWallet(walletInfo);
        onWalletConnected(walletInfo);
      }
      
    } catch (error) {
      console.error('Wallet connection failed:', error);
      onError(error instanceof Error ? error.message : 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
      setSelectedWallet(null);
    }
  };

  return (
    <div className="web3-wallet-connector">
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-[#f5f5f5] mb-2">
          <Icon name="fas fa-wallet" className="mr-3 text-[#8a2be2]" />
          Connect Your Web3 Wallet
        </h3>
        <p className="text-gray-400">Choose your preferred wallet to get started</p>
      </div>

      {connectedWallet ? (
        <div className="bg-[#2a2a2a] rounded-[15px] p-6 border-l-4 border-[#4ade80]">
          <div className="flex items-center gap-3 mb-4">
            <Icon name="fas fa-check-circle" className="text-[#4ade80] text-2xl" />
            <div>
              <h4 className="text-[#f5f5f5] font-semibold">Wallet Connected Successfully!</h4>
              <p className="text-gray-400 text-sm">You're ready to upload to the blockchain</p>
            </div>
          </div>
          
          <div className="bg-[#121212] rounded-[10px] p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Wallet Type:</span>
              <span className="text-[#f5f5f5] font-medium capitalize">{connectedWallet.walletType}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Address:</span>
              <span className="text-[#f5f5f5] font-mono text-sm">
                {`${connectedWallet.address.substring(0, 6)}...${connectedWallet.address.substring(connectedWallet.address.length - 4)}`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Network:</span>
              <span className="text-[#4ade80] text-sm">Connected</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SUPPORTED_WALLETS.map((wallet) => (
            <button
              key={wallet.id}
              onClick={() => connectWallet(wallet.id)}
              disabled={isConnecting}
              className={`
                relative p-6 bg-[#2a2a2a] rounded-[15px] border-2 border-transparent
                hover:border-[#8a2be2] hover:bg-[rgba(138,43,226,0.1)]
                transition-all duration-300 text-left
                ${isConnecting && selectedWallet === wallet.id ? 'opacity-50' : ''}
                ${isConnecting && selectedWallet !== wallet.id ? 'opacity-30' : ''}
              `}
            >
              <div className="flex items-center gap-4 mb-3">
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl"
                  style={{ backgroundColor: wallet.color }}
                >
                  <Icon name={wallet.icon} />
                </div>
                <div>
                  <h4 className="text-[#f5f5f5] font-semibold text-lg">{wallet.name}</h4>
                  <p className="text-gray-400 text-sm">{wallet.description}</p>
                </div>
              </div>
              
              {isConnecting && selectedWallet === wallet.id && (
                <div className="absolute inset-0 flex items-center justify-center bg-[rgba(42,42,42,0.9)] rounded-[15px]">
                  <div className="flex items-center gap-2 text-[#8a2be2]">
                    <Icon name="fas fa-spinner" className="animate-spin" />
                    <span className="font-medium">Connecting...</span>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
      
      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm mb-2">
          <Icon name="fas fa-shield-alt" className="mr-1 text-[#4ade80]" />
          Your wallet stays secure - we never store your private keys
        </p>
        <p className="text-gray-500 text-xs">
          New to Web3? <a href="#" className="text-[#8a2be2] hover:underline">Learn about wallets</a>
        </p>
      </div>
    </div>
  );
};

export default Web3WalletConnector;