import { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';

export default function WalletButton() {
  const { connectWallet, account, active, ageVerified, verifyAge } = useWeb3();
  const [isConnecting, setIsConnecting] = useState(false);

  const formatAddress = (addr: string) =>
    `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connectWallet();
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      {!active ? (
        <button
          onClick={handleConnect}
          disabled={isConnecting}
          className="nocensor-gradient px-4 py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isConnecting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Connecting...</span>
            </>
          ) : (
            <span>Connect Wallet</span>
          )}
        </button>
      ) : !ageVerified ? (
        <button
          onClick={verifyAge}
          className="bg-yellow-500 px-4 py-2 rounded-lg font-medium hover:bg-yellow-600"
        >
          Verify Age
        </button>
      ) : (
        <div className="flex items-center space-x-2">
          <div className="bg-green-500 w-3 h-3 rounded-full animate-pulse"></div>
          <div className="bg-gray-700 px-3 py-2 rounded-lg text-green-400 font-medium">
            {account && formatAddress(account)}
          </div>
          <span className="text-green-400 text-sm font-medium">Connected</span>
        </div>
      )}
    </div>
  );
}
