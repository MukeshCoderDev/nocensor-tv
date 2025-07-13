import React, { useState } from 'react';
import { uploadToArweave } from '../../arweave-uploader.js';
// import { publishToIPNS } from '../utils/ipns-publish'; // IPNS is not directly applicable to Arweave

const DecentralizedIpfsUploader: React.FC = () => {
  const [arweaveTxId, setArweaveTxId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [arweaveKey, setArweaveKey] = useState<any>(null); // State to hold the Arweave key
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setArweaveTxId(null);
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleKeyFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const key = JSON.parse(e.target?.result as string);
          setArweaveKey(key);
          alert("Arweave wallet key loaded successfully!");
        } catch (error) {
          alert("Invalid Arweave wallet key file.");
          console.error("Error parsing Arweave key file:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }
    if (!arweaveKey) {
      alert("Please load your Arweave wallet key first.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer);
      const txId = await uploadToArweave(uint8, arweaveKey);
      setArweaveTxId(txId);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleUpload(); }} style={{ maxWidth: 500, margin: '2rem auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h2>Decentralized Arweave Uploader</h2>
      <div className="mb-4">
        <label htmlFor="videoFile" className="block text-sm font-medium text-gray-300">
          Select Video File
        </label>
        <input type="file" id="videoFile" onChange={handleFileChange} accept="video/*" className="mt-1 block w-full text-sm text-gray-400
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-violet-50 file:text-violet-700
                       hover:file:bg-violet-100" />
      </div>

      {!arweaveKey && (
        <div className="mb-4">
          <label htmlFor="arweaveKeyUpload" className="block text-sm font-medium text-gray-300">
            Load Arweave Wallet Key (JSON)
          </label>
          <input
            type="file"
            id="arweaveKeyUpload"
            accept=".json"
            onChange={handleKeyFileChange}
            className="mt-1 block w-full text-sm text-gray-400
                       file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-violet-50 file:text-violet-700
                       hover:file:bg-violet-100"
          />
        </div>
      )}

      {loading && <p>Uploading to Arweave...</p>}
      {arweaveTxId && (
        <div>
          <p><strong>Arweave Transaction ID:</strong> {arweaveTxId}</p>
          <a href={`https://arweave.net/${arweaveTxId}`} target="_blank" rel="noopener noreferrer">
            View on Arweave
          </a>
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button
        type="submit"
        disabled={loading || !selectedFile || !arweaveKey}
        className={`mt-4 px-4 py-2 rounded-md text-white font-semibold
                    ${loading || !selectedFile || !arweaveKey ? 'bg-gray-600 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
      >
        {loading ? 'Uploading...' : 'Upload Video to Arweave'}
      </button>
    </form>
  );
};

export default DecentralizedIpfsUploader;
