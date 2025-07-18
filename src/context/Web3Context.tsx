import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { ethers } from 'ethers';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import { chains, projectId, sepolia } from '../config/chains';

interface Web3ContextType {
  connectWallet: () => Promise<void>;
  account: string | null;
  active: boolean;
  library?: ethers.BrowserProvider;
  ageVerified: boolean;
  verifyAge: () => Promise<boolean>;
  userType: string;
  setUserType: (type: string) => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// 1. Get projectId at https://cloud.walletconnect.com
const metadata = {
  name: 'Nocensor.tv',
  description: 'Decentralized Video Platform',
  url: 'https://nocensor.tv', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
};

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: chains,
  projectId,
  enableAnalytics: true, // Optional - defaults to your Cloud configuration
  themeMode: 'dark',
  defaultChain: sepolia,
});

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [library, setLibrary] = useState<ethers.BrowserProvider | undefined>(undefined);
  const [active, setActive] = useState(false);
  const [ageVerified, setAgeVerified] = useState(false);
  const [userType, setUserType] = useState('viewer');

  const connectWallet = useCallback(async () => {
    try {
      // WalletConnect will handle the connection logic
      // The modal will open automatically when useWeb3Modal is called
      // No direct MetaMask check needed here as WalletConnect handles it
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    }
  }, []);

  const verifyAge = async () => {
    setAgeVerified(true);
    return true;
  };

  // Check if wallet is already connected on page load
  // WalletConnect handles connection status, so we'll use its hooks
  // For now, we'll keep a simplified useEffect for initial account check if MetaMask is present
  useEffect(() => {
    const checkMetaMaskConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            setLibrary(provider);
            setAccount(accounts[0]);
            setActive(true);
          }
        } catch (error) {
          console.error('Error checking MetaMask connection:', error);
        }
      }
    };
    checkMetaMaskConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      // WalletConnect hooks will manage account and chain changes more robustly
      // For direct MetaMask interaction, keep these listeners
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setActive(true);
          const provider = new ethers.BrowserProvider(window.ethereum);
          setLibrary(provider);
        } else {
          setAccount(null);
          setActive(false);
          setAgeVerified(false);
          setLibrary(undefined);
        }
      };

      const handleChainChanged = (chainId: string) => {
        console.log('Chain changed to:', chainId);
        // WalletConnect handles network switching, but we can update our state
        if (typeof window.ethereum !== 'undefined') {
          const provider = new ethers.BrowserProvider(window.ethereum);
          setLibrary(provider);
          // Optionally, re-check account if needed
          window.ethereum.request({ method: 'eth_accounts' }).then((accounts: string[]) => {
            if (accounts.length > 0) {
              setAccount(accounts[0]);
              setActive(true);
            }
          });
        }
      };

      if (window.ethereum) {
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);

        return () => {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
          window.ethereum.removeListener('chainChanged', handleChainChanged);
        };
      }
    }
  }, []);

  useEffect(() => {
    if (account) {
      const isCreator = localStorage.getItem(`creator_${account}`);
      if (isCreator) setUserType('creator');
    }
  }, [account]);

  return (
    <Web3Context.Provider value={{
      connectWallet,
      account: account || null,
      active,
      library,
      ageVerified,
      verifyAge,
      userType,
      setUserType
    }}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = () => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
