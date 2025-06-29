import { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { uploadToIPFS } from '../utils/ipfs';
import { uploadContent } from '../utils/contracts';
import { ethers } from 'ethers'; // Keep ethers import

export default function Dashboard() {
  const { account, library, userType, setUserType } = useWeb3(); // Keep library
  const [content, setContent] = useState({
    title: '',
    description: '',
    price: 0,
    accessType: 0,
    file: null as File | null // Keep type
  });
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { // Keep type
    e.preventDefault();
    if (!content.file || !account || !library) return; // Keep checks

    setUploading(true);

    try {
      // Upload video to IPFS
      const cid = await uploadToIPFS(content.file);

      // Upload metadata to contract
      await uploadContent(library.getSigner() as unknown as ethers.Signer, { // Apply cast
        ...content,
        cid
      });

      alert('Content uploaded successfully!');
      setContent({
        title: '',
        description: '',
        price: 0,
        accessType: 0,
        file: null
      });
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (userType !== 'creator') {
    return (
      <div className="container mx-auto p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Creator Dashboard</h2>
        <p className="mb-6">You need to register as a creator to access this page</p>
        <button
          onClick={() => setUserType('creator')}
          className="nocensor-gradient px-6 py-3 rounded-lg font-bold"
        >
          Register as Creator
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Creator Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Upload New Content</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2">Title</label>
              <input
                type="text"
                value={content.title}
                onChange={(e) => setContent({...content, title: e.target.value})}
                className="w-full bg-gray-700 rounded-lg px-4 py-2"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block mb-2">Description</label>
              <textarea
                value={content.description}
                onChange={(e) => setContent({...content, description: e.target.value})}
                className="w-full bg-gray-700 rounded-lg px-4 py-2 min-h-[100px]"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block mb-2">Price (ETH)</label>
                <input
                  type="number"
                  value={content.price}
                  onChange={(e) => setContent({...content, price: parseFloat(e.target.value) || 0})}
                  min="0"
                  step="0.01"
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                />
              </div>

              <div>
                <label className="block mb-2">Access Type</label>
                <select
                  value={content.accessType}
                  onChange={(e) => setContent({...content, accessType: parseInt(e.target.value)})}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                >
                  <option value={0}>Free</option>
                  <option value={1}>Subscription</option>
                  <option value={2}>Pay-Per-View</option>
                  <option value={3}>NFT Access</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block mb-2">Video File</label>
              <input
                type="file"
                onChange={(e) => setContent({...content, file: e.target.files ? e.target.files[0] : null})} // Keep check
                className="w-full"
                required
              />
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="nocensor-gradient px-6 py-3 rounded-lg font-bold disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload Content'}
            </button>
          </form>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Channel Analytics</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span>Total Views</span>
              <span className="font-bold">24.5K</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Subscribers</span>
              <span className="font-bold">18.2K</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Total Earnings</span>
              <span className="font-bold">2.45 ETH</span>
            </div>
            <div className="pt-4 border-t border-gray-700">
              <h3 className="font-bold mb-2">Recent Transactions</h3>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span>Access to Video #{i+1}</span>
                    <span>0.0{i+1} ETH</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
