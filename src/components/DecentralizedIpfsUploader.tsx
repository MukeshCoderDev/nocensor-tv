import React, { useState } from 'react';
import { uploadToArweave } from '../../arweave-uploader.js';
import Icon from '../../components/Icon'; // Import the Icon component

const DecentralizedIpfsUploader: React.FC = () => {
  const [arweaveTxId, setArweaveTxId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [arweaveKey, setArweaveKey] = useState<any>(null); // State to hold the Arweave key
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoFileName, setVideoFileName] = useState<string | null>(null);
  const [keyFileName, setKeyFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0); // State for upload progress

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setArweaveTxId(null);
    setUploadProgress(0);
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setVideoFileName(file.name);
    } else {
      setSelectedFile(null);
      setVideoFileName(null);
    }
  };

  const handleKeyFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const key = JSON.parse(e.target?.result as string);
          setArweaveKey(key);
          setKeyFileName(file.name);
          // alert("Arweave wallet key loaded successfully!"); // Remove alert for better UX
        } catch (error) {
          setError("Invalid Arweave wallet key file.");
          setKeyFileName(null);
          console.error("Error parsing Arweave key file:", error);
        }
      };
      reader.readAsText(file);
    } else {
      setArweaveKey(null);
      setKeyFileName(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file to upload.");
      return;
    }
    if (!arweaveKey) {
      setError("Please load your Arweave wallet key first.");
      return;
    }

    setLoading(true);
    setError(null);
    setUploadProgress(0); // Reset progress at the start of upload

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer);

      // Simulate progress for now, as uploadToArweave doesn't provide it
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (progress <= 100) {
          setUploadProgress(progress);
        } else {
          clearInterval(interval);
        }
      }, 200);

      const txId = await uploadToArweave(uint8, arweaveKey);
      clearInterval(interval); // Clear interval once upload is complete
      setUploadProgress(100); // Ensure progress is 100% on completion
      setArweaveTxId(txId);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
      setUploadProgress(0); // Reset progress on error
    } finally {
      setLoading(false);
    }
  };

  const clearVideoFile = () => {
    setSelectedFile(null);
    setVideoFileName(null);
    setError(null);
    setArweaveTxId(null);
    setUploadProgress(0);
    const videoInput = document.getElementById('videoFile') as HTMLInputElement;
    if (videoInput) videoInput.value = '';
  };

  const clearKeyFile = () => {
    setArweaveKey(null);
    setKeyFileName(null);
    setError(null);
    const keyInput = document.getElementById('arweaveKeyUpload') as HTMLInputElement;
    if (keyInput) keyInput.value = '';
  };

  return (
    <div className="w-full max-w-5xl mx-auto my-8 p-6 bg-[rgba(138,43,226,0.1)] border border-[#8a2be2] rounded-[10px] shadow-[0_10px_20px_rgba(138,43,226,0.2)]">
      <h2 className="text-2xl font-bold text-white mb-3">Decentralized Arweave Uploader</h2>
      <p className="text-gray-300 text-sm mb-6">
        Enjoy free, experimental uploads on our testnet. On the mainnet, a one-time payment secures your video permanently on the censorship-resistant Arweave network.
      </p>

      <form onSubmit={(e) => { e.preventDefault(); handleUpload(); }}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-4 md:space-y-0 md:space-x-6 mb-6">
          {/* Step 1: Select Video File */}
          <div className="flex-1 flex flex-col items-center text-center p-3 border border-gray-700 rounded-md bg-gray-800 w-full md:w-auto">
            <div className="flex items-center mb-2">
              <span className="text-xl font-bold text-purple-400 mr-2">1.</span>
              <Icon name="video" className="text-3xl text-purple-400" />
            </div>
            <label htmlFor="videoFile" className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md flex items-center space-x-2 transition duration-300 text-sm">
              <span>Choose Video</span>
            </label>
            <input type="file" id="videoFile" onChange={handleFileChange} accept="video/*" className="hidden" />
            {videoFileName && (
              <div className="flex items-center text-green-400 text-xs mt-2">
                <Icon name="check-circle" className="text-base mr-1" />
                <span className="truncate max-w-[100px]">{videoFileName}</span>
                <button type="button" onClick={clearVideoFile} className="ml-2 text-gray-400 hover:text-white">
                  <Icon name="x-circle" className="text-base" />
                </button>
              </div>
            )}
          </div>

          <Icon name="chevron-right" className="text-2xl text-gray-500 hidden md:block" />

          {/* Step 2: Load Arweave Wallet Key (JSON) */}
          <div className="flex-1 flex flex-col items-center text-center p-3 border border-gray-700 rounded-md bg-gray-800 w-full md:w-auto">
            <div className="flex items-center mb-2">
              <span className="text-xl font-bold text-purple-400 mr-2">2.</span>
              <Icon name="key" className="text-3xl text-purple-400" />
              <span className="ml-2 text-gray-400 cursor-help relative group">
                <Icon name="info-circle" className="text-base" />
                <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-64 p-2 bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  Your Arweave wallet key authorizes the one-time, permanent storage of your video on the network.
                </div>
              </span>
            </div>
            <label htmlFor="arweaveKeyUpload" className="cursor-pointer bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md flex items-center space-x-2 transition duration-300 text-sm">
              <span>Load Wallet Key</span>
            </label>
            <input
              type="file"
              id="arweaveKeyUpload"
              accept=".json"
              onChange={handleKeyFileChange}
              className="hidden"
            />
            {keyFileName && (
              <div className="flex items-center text-green-400 text-xs mt-2">
                <Icon name="check-circle" className="text-base mr-1" />
                <span className="truncate max-w-[100px]">{keyFileName}</span>
                <button type="button" onClick={clearKeyFile} className="ml-2 text-gray-400 hover:text-white">
                  <Icon name="x-circle" className="text-base" />
                </button>
              </div>
            )}
          </div>

          <Icon name="chevron-right" className="text-2xl text-gray-500 hidden md:block" />

          {/* Step 3: Upload to Arweave */}
          <div className="flex-1 flex flex-col items-center text-center p-3 border border-gray-700 rounded-md bg-gray-800 w-full md:w-auto">
            <div className="flex items-center mb-2">
              <span className="text-xl font-bold text-purple-400 mr-2">3.</span>
              <Icon name="cloud-upload" className="text-3xl text-purple-400" />
            </div>
            <button
              type="submit"
              disabled={loading || !selectedFile || !arweaveKey}
              className={`w-full py-2 rounded-md text-white font-bold text-sm flex items-center justify-center space-x-2 transition duration-300
                          ${loading || !selectedFile || !arweaveKey ? 'bg-gray-600 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}`}
            >
              {loading ? (
                <>
                  <Icon name="spinner" className="animate-spin text-xl" />
                  <span>Uploading... ({uploadProgress}%)</span>
                </>
              ) : (
                <span>Upload Video</span>
              )}
            </button>
          </div>
        </div>

        {loading && uploadProgress > 0 && (
          <div className="mt-4 w-full bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-purple-500 h-2.5 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        {arweaveTxId && (
          <div className="mt-4 text-green-400 text-center">
            <p className="flex items-center justify-center">
              <Icon name="check-circle" className="text-xl mr-2" />
              <strong>Arweave Transaction ID:</strong> {arweaveTxId}
            </p>
            <a href={`https://arweave.net/${arweaveTxId}`} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline text-sm">
              View on Arweave
            </a>
          </div>
        )}
        {error && <p className="mt-4 text-red-500 flex items-center justify-center"><Icon name="exclamation-circle" className="text-xl mr-2" />{error}</p>}
      </form>
    </div>
  );
};

export default DecentralizedIpfsUploader;
