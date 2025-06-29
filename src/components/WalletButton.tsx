import { useWeb3 } from '../context/Web3Context';

export default function WalletButton() {
  const { connectWallet, account, active, ageVerified, verifyAge } = useWeb3();

  const formatAddress = (addr: string) =>
    `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  return (
    <div className="flex items-center space-x-3">
      {!active ? (
        <button
          onClick={connectWallet}
          className="nocensor-gradient px-4 py-2 rounded-lg font-medium hover:opacity-90"
        >
          Connect Wallet
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
          <div className="bg-green-500 w-3 h-3 rounded-full"></div>
          <div className="bg-gray-700 px-3 py-2 rounded-lg">
            {account && formatAddress(account)}
          </div>
        </div>
      )}
    </div>
  );
}
