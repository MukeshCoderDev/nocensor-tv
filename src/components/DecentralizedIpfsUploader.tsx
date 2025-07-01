import React, { useState } from 'react';
import { uploadToIPFS } from '../../ipfs-uploader.js';
import { publishToIPNS } from '../utils/ipns-publish';

const DecentralizedIpfsUploader: React.FC = () => {
  const [cid, setCid] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [ipnsAddress, setIpnsAddress] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setCid(null);
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer);
      const cid = await uploadToIPFS(uint8);
      setCid(cid);
      // Publish to IPNS
      const ipnsAddr = await publishToIPNS(cid);
      setIpnsAddress(ipnsAddr);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '2rem auto', padding: 24, border: '1px solid #eee', borderRadius: 8 }}>
      <h2>Decentralized IPFS Uploader (Helia + libp2p)</h2>
      <input type="file" onChange={handleFileChange} />
      {loading && <p>Uploading to IPFS...</p>}
      {cid && (
        <div>
          <p><strong>CID:</strong> {cid}</p>
          <a href={`https://ipfs.io/ipfs/${cid}`} target="_blank" rel="noopener noreferrer">
            View on IPFS
          </a>
          {ipnsAddress && (
            <div style={{ marginTop: 12 }}>
              <p><strong>IPNS Address:</strong> {ipnsAddress}</p>
              <a href={`https://ipfs.io/ipns/${ipnsAddress}`} target="_blank" rel="noopener noreferrer">
                View Latest via IPNS
              </a>
            </div>
          )}
        </div>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default DecentralizedIpfsUploader;
