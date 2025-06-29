import React, { useCallback, useEffect, useState } from "react";
import { useWeb3Contracts } from "../hooks/useWeb3Contracts";
import { CONTRACT_ADDRESSES } from "../contracts/addresses";
import { ethers } from "ethers";

interface TokenGatedPlayerProps {
  contentId: number;
  cid: string;
  accessType: "NFT" | "SUB" | "PPV";
}

const IPFS_GATEWAY = "https://ipfs.io/ipfs/";

export const TokenGatedPlayer: React.FC<TokenGatedPlayerProps> = ({ contentId, cid, accessType }) => {
  const { contracts, loading: contractsLoading, error: contractsError } = useWeb3Contracts();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [ppvPrice, setPpvPrice] = useState<string>("");
  const [purchaseLoading, setPurchaseLoading] = useState(false);

  // Access check logic
  const checkAccess = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (!contracts.ModuleManager) throw new Error("ModuleManager not loaded");
      if (accessType === "PPV" && !contracts.PayPerViewModule) throw new Error("PayPerViewModule not loaded");
      const signer = contracts.ModuleManager.runner;
      if (!signer) throw new Error("Wallet not connected");
      if (accessType === "PPV") {
        const canAccess = await contracts.PayPerViewModule.canAccess(contentId, await signer.getAddress());
        setHasAccess(canAccess);
        if (!canAccess) {
          // Get price for PPV
          const price = await contracts.PayPerViewModule.prices(contentId);
          setPpvPrice(ethers.formatEther(price));
        }
      } else if (accessType === "NFT") {
        if (!contracts.CreatorRegistry) throw new Error("CreatorRegistry not loaded");
        const balance = await contracts.CreatorRegistry.balanceOf(await signer.getAddress());
        setHasAccess(Number(balance) > 0);
      } else if (accessType === "SUB") {
        if (!contracts.SubscriptionModule) throw new Error("SubscriptionModule not loaded");
        const isSub = await contracts.SubscriptionModule.isSubscribed(contentId, await signer.getAddress());
        setHasAccess(isSub);
      }
    } catch (e: any) {
      setError(e.message || "Access check failed");
    } finally {
      setLoading(false);
    }
  }, [contracts, contentId, accessType]);

  // Purchase flow for PPV
  const handlePurchase = useCallback(async () => {
    setPurchaseLoading(true);
    setError(null);
    try {
      if (!contracts.PayPerViewModule) throw new Error("PayPerViewModule not loaded");
      const signer = contracts.PayPerViewModule.runner;
      const price = await contracts.PayPerViewModule.prices(contentId);
      const tx = await contracts.PayPerViewModule.execute(contentId, "0x", { value: price });
      await tx.wait();
      setHasAccess(true);
    } catch (e: any) {
      setError(e.message || "Purchase failed");
    } finally {
      setPurchaseLoading(false);
    }
  }, [contracts, contentId]);

  // Load video from IPFS
  const loadVideo = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // For simplicity, use public gateway
      setVideoUrl(`${IPFS_GATEWAY}${cid}`);
    } catch (e: any) {
      setError(e.message || "Failed to load video");
    } finally {
      setLoading(false);
    }
  }, [cid]);

  useEffect(() => {
    if (!contractsLoading && !contractsError) {
      checkAccess();
    }
  }, [contractsLoading, contractsError, checkAccess]);

  useEffect(() => {
    if (hasAccess) {
      loadVideo();
    }
  }, [hasAccess, loadVideo]);

  // UI
  if (contractsLoading || loading) {
    return <div className="flex items-center justify-center h-64 text-lg">Loading...</div>;
  }
  if (contractsError || error) {
    return <div className="flex items-center justify-center h-64 text-red-500">{contractsError || error}</div>;
  }
  if (!hasAccess) {
    if (accessType === "PPV") {
      return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <div className="text-lg">This is pay-per-view content.</div>
          <div>Price: <span className="font-bold">{ppvPrice} ETH</span></div>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            onClick={handlePurchase}
            disabled={purchaseLoading}
          >
            {purchaseLoading ? "Processing..." : "Purchase Access"}
          </button>
        </div>
      );
    }
    return <div className="flex items-center justify-center h-64 text-yellow-600">Access required to view this content.</div>;
  }
  return (
    <div className="w-full flex flex-col items-center">
      <video controls className="w-full max-w-2xl rounded shadow-lg">
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};
