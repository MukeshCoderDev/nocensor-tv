import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ethers } from 'ethers';

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

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [library, setLibrary] = useState<ethers.BrowserProvider | undefined>(undefined);
  const [active, setActive] = useState(false);
  const [ageVerified, setAgeVerified] = useState(false);
  const [userType, setUserType] = useState('viewer');

  const connectWallet = async () => {
    try {
      // Check if MetaMask is installed
      if (typeof window.ethereum === 'undefined') {
        alert('MetaMask is not installed! Please install MetaMask to continue.');
        window.open('https://metamask.io/download/', '_blank');
        return;
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length > 0) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        setLibrary(provider);
        setAccount(accounts[0]);
        setActive(true);
        
        // Check if we're on the right network (Sepolia)
        const network = await provider.getNetwork();
        if (network.chainId !== 11155111n) {
          try {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0xaa36a7' }], // Sepolia chainId in hex
            });
          } catch (switchError: any) {
            // This error code indicates that the chain has not been added to MetaMask
            if (switchError.code === 4902) {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0xaa36a7',
                  chainName: 'Sepolia Test Network',
                  nativeCurrency: {
                    name: 'ETH',
                    symbol: 'ETH',
                    decimals: 18,
                  },
                  rpcUrls: ['https://rpc.sepolia.org'],
                  blockExplorerUrls: ['https://sepolia.etherscan.io'],
                }],
              });
            }
          }
        }
        
        console.log('Wallet connected:', accounts[0]);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    }
  };

  const verifyAge = async () => {
    setAgeVerified(true);
    return true;
  };

  // Check if wallet is already connected on page load
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          });
          
          if (accounts.length > 0) {
            const provider = new ethers.BrowserProvider(window.ethereum);
            setLibrary(provider);
            setAccount(accounts[0]);
            setActive(true);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkConnection();
  }, []);

  // Listen for account changes
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setActive(true);
        } else {
          setAccount(null);
          setActive(false);
          setAgeVerified(false);
        }
      };

      const handleChainChanged = () => {
        // Reload the page when chain changes
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
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
