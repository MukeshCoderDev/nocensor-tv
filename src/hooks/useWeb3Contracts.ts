// @ts-ignore
declare global {
  interface Window {
    ethereum?: any;
  }
}

import { useCallback, useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import * as Factories from "../contracts/typechain-types/factories";

const SEPOLIA_CHAIN_ID = 11155111;
const SEPOLIA_PARAMS = {
  chainId: "0xaa36a7",
  chainName: "Sepolia",
  nativeCurrency: { name: "SepoliaETH", symbol: "ETH", decimals: 18 },
  rpcUrls: ["https://rpc.sepolia.org"],
  blockExplorerUrls: ["https://sepolia.etherscan.io"],
};

export function useWeb3Contracts() {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contracts, setContracts] = useState<any>({});

  // Connect wallet and set provider/signer
  const connectWallet = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!window.ethereum) throw new Error("No wallet found");
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      await browserProvider.send("eth_requestAccounts", []);
      const signer = await browserProvider.getSigner();
      const network = await browserProvider.getNetwork();
      setProvider(browserProvider);
      setSigner(signer);
      setChainId(Number(network.chainId));
    } catch (e: any) {
      setError(e.message || "Wallet connection failed");
    } finally {
      setLoading(false);
    }
  }, []);

  // Switch to Sepolia if not already
  const switchToSepolia = useCallback(async () => {
    if (!window.ethereum) return;
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: SEPOLIA_PARAMS.chainId }],
      });
    } catch (switchError: any) {
      // If not added, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [SEPOLIA_PARAMS],
        });
      } else {
        throw switchError;
      }
    }
  }, []);

  // Load contracts dynamically
  const loadContracts = useCallback(async () => {
    if (!signer) return;
    setLoading(true);
    setError(null);
    try {
      const addresses = await import("../contracts/addresses");
      const loaded: Record<string, any> = {};
      for (const [key, factory] of Object.entries(Factories)) {
        if (key.endsWith("__factory")) {
          const contractName = key.replace("__factory", "");
          if (addresses[contractName]) {
            loaded[contractName] = (factory as any).connect(addresses[contractName], signer);
          }
        }
      }
      setContracts(loaded);
    } catch (e: any) {
      setError(e.message || "Failed to load contracts");
    } finally {
      setLoading(false);
    }
  }, [signer]);

  useEffect(() => {
    connectWallet();
  }, [connectWallet]);

  useEffect(() => {
    if (chainId && chainId !== SEPOLIA_CHAIN_ID) {
      switchToSepolia().catch((e) => setError(e.message || "Network switch failed"));
    }
  }, [chainId, switchToSepolia]);

  useEffect(() => {
    if (signer) loadContracts();
  }, [signer, loadContracts]);

  const memoizedContracts = useMemo(() => contracts, [contracts]);

  return { contracts: memoizedContracts, loading, error };
}
