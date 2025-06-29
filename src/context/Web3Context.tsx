import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { ethers, Signer } from 'ethers';
import { useWeb3React, Web3ReactProvider } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

interface Web3ContextType {
  connectWallet: () => Promise<void>;
  account: string | null;
  active: boolean;
  library?: ethers.providers.Web3Provider;
  ageVerified: boolean;
  verifyAge: () => Promise<boolean>;
  userType: string;
  setUserType: (type: string) => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const injected = new InjectedConnector({ 
  supportedChainIds: [11155111] // Sepolia
});

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  const { activate, account, library, active } = useWeb3React();
  const [ageVerified, setAgeVerified] = useState(false);
  const [userType, setUserType] = useState('viewer');

  const connectWallet = async () => {
    try {
      await activate(injected);
    } catch (error) {
      console.error(error);
    }
  };

  const verifyAge = async () => {
    setAgeVerified(true);
    return true;
  };

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
