import React, { useState, useRef } from 'react';
import Icon from '../../../../components/Icon';
import HelpTooltip from './HelpTooltip';
import ErrorDisplay from './ErrorDisplay';

interface WalletKeyLoaderProps {
  onWalletLoaded: (wallet: any) => void;
  onError: (error: any) => void;
  isDisabled?: boolean;
  walletInfo?: any;
  isLoading?: boolean;
}

const WalletKeyLoader: React.FC<WalletKeyLoaderProps> = ({
  onWalletLoaded,
  onError,
  isDisabled = false,
  walletInfo,
  isLoading = false
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [validationError, setValidationError] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setValidationError(null);
    
    try {
      // Validate file type
      if (!file.name.endsWith('.json')) {
        throw new Error('Please select a valid JSON wallet key file');
      }

      // Read and parse the file
      const fileText = await file.text();
      const walletKey = JSON.parse(fileText);

      // Basic validation of wallet key structure
      const requiredFields = ['kty', 'n', 'e', 'd', 'p', 'q', 'dp', 'dq', 'qi'];
      const missingFields = requiredFields.filter(field => !walletKey[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Invalid wallet key format. Missing fields: ${missingFields.join(', ')}`);
      }

      onWalletLoaded(walletKey);
    } catch (error) {
      const errorObj = {
        type: 'validation',
        message: error instanceof Error ? error.message : 'Failed to load wallet key',
        recoverable: true,
        suggestedAction: 'Please select a valid Arweave wallet key file (.json)'
      };
      setValidationError(errorObj);
      onError(errorObj);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);
    
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    if (!isDisabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRetry = () => {
    setValidationError(null);
    handleClick();
  };

  return (
    <div className="wallet-key-loader">
      <div className="flex items-center mb-3">
        <h3 className="text-lg font-semibold text-[#f5f5f5]">Load Wallet Key</h3>
        <HelpTooltip
          title="Arweave Wallet Key"
          content="Your Arweave wallet key is a JSON file that authorizes uploads to the Arweave network. It should contain cryptographic keys (kty, n, e, d, p, q, dp, dq, qi). You can generate one at arweave.app or use the Arweave CLI."
          className="ml-2"
        />
      </div>

      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300
          ${dragOver ? 'border-[#8a2be2] bg-[rgba(138,43,226,0.1)]' : 'border-gray-600 hover:border-[#8a2be2]'}
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${walletInfo ? 'border-green-500 bg-[rgba(34,197,94,0.1)]' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
          disabled={isDisabled}
        />

        {isLoading ? (
          <div className="flex flex-col items-center">
            <Icon name="fas fa-spinner" className="text-3xl text-[#8a2be2] mb-3 animate-spin" />
            <p className="text-[#f5f5f5] font-medium">Validating wallet key...</p>
            <p className="text-gray-400 text-sm mt-1">Please wait while we verify your wallet</p>
          </div>
        ) : walletInfo ? (
          <div className="flex flex-col items-center">
            <Icon name="fas fa-check-circle" className="text-3xl text-green-400 mb-3" />
            <p className="text-green-400 font-medium mb-2">Wallet Key Loaded Successfully!</p>
            <div className="bg-[#2a2a2a] rounded-lg p-3 text-left">
              <p className="text-gray-300 text-sm">
                <span className="text-gray-400">Address:</span> {walletInfo.formattedAddress || 'Loading...'}
              </p>
              {walletInfo.formattedBalance && (
                <p className="text-gray-300 text-sm mt-1">
                  <span className="text-gray-400">Balance:</span> {walletInfo.formattedBalance}
                </p>
              )}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
              className="mt-3 text-[#8a2be2] hover:text-[#6a0dad] text-sm underline"
            >
              Load Different Key
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Icon name="fas fa-key" className="text-3xl text-[#8a2be2] mb-3" />
            <p className="text-[#f5f5f5] font-medium mb-2">Select Arweave Wallet Key</p>
            <p className="text-gray-400 text-sm mb-4">
              Drag and drop your wallet key file (.json) or click to browse
            </p>
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center">
                <Icon name="fas fa-file-code" className="mr-1" />
                JSON format
              </span>
              <span className="flex items-center">
                <Icon name="fas fa-shield-alt" className="mr-1" />
                Secure validation
              </span>
            </div>
          </div>
        )}
      </div>

      {validationError && (
        <div className="mt-4">
          <ErrorDisplay
            error={validationError}
            onRetry={handleRetry}
            onDismiss={() => setValidationError(null)}
          />
        </div>
      )}
    </div>
  );
};

export default WalletKeyLoader;