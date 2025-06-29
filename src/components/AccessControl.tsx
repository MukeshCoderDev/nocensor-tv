import { useState, useEffect } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { purchaseAccess, checkAccess } from '../utils/contracts';
import { ethers } from 'ethers';

interface AccessControlProps {
  contentId: number;
  price: number;
  accessType: 'PPV' | 'SUBSCRIPTION' | 'NFT';
}

const AccessControl = ({ contentId, price, accessType }: AccessControlProps) => {
  const { account, library } = useWeb3();
  const [accessStatus, setAccessStatus] = useState<'none' | 'pending' | 'granted'>('none');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyAccess = async () => {
      if (account && library) {
        try {
          const hasAccess = await checkAccess(library.getSigner(), contentId, account);
          setAccessStatus(hasAccess ? 'granted' : 'none');
        } catch (err) {
          setError('Failed to check access status');
          console.error(err);
        }
      }
    };
    
    verifyAccess();
  }, [account, contentId, library]);

  const handlePurchase = async () => {
    if (!account || !library) return;
    
    setAccessStatus('pending');
    setError(null);
    
    try {
      let amount;
      if (accessType === 'PPV') {
        amount = ethers.utils.parseEther(price.toString());
      }
      
      await purchaseAccess(
        library.getSigner(),
        contentId,
        accessType,
        amount
      );
      
      setAccessStatus('granted');
    } catch (err) {
      setAccessStatus('none');
      setError('Purchase failed. Please try again.');
      console.error('Purchase error:', err);
    }
  };

  if (accessStatus === 'granted') {
    return <div className="text-green-500">Access granted! Enjoy your content.</div>;
  }

  return (
    <div className="border rounded-lg p-4 bg-gray-800">
      <h3 className="text-xl font-bold mb-2">Purchase Access</h3>
      <p className="mb-4">
        {accessType === 'PPV' 
          ? `Pay ${price} tokens to access this content`
          : accessType === 'SUBSCRIPTION'
          ? 'Subscribe to access this content'
          : 'Own the required NFT to access this content'}
      </p>
      
      {error && <div className="text-red-500 mb-2">{error}</div>}
      
      <button
        onClick={handlePurchase}
        disabled={accessStatus === 'pending'}
        className={`nocensor-gradient text-white py-2 px-4 rounded-md ${
          accessStatus === 'pending' ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
        }`}
      >
        {accessStatus === 'pending' ? 'Processing...' : 'Purchase Access'}
      </button>
    </div>
  );
};

export default AccessControl;
