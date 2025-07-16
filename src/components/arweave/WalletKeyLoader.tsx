import React, { useCallback, useRef, useState, useEffect } from 'react';
import { WalletKeyLoaderProps } from '../../types/ArweaveTypes';
import { useArweaveWallet } from '../../hooks/useArweaveWallet';
import { CostEstimationService } from '../../services/CostEstimationService';
import { WalletKeyHelpTooltip, CostEstimationHelpTooltip, BalanceHelpTooltip, HelpIcon } from './HelpTooltip';
import { CompactErrorDisplay } from './ErrorDisplay';
import { LoadingSpinner } from './ProgressIndicator';

/**
 * Wallet key loader component for step 2 of upload process
 */
export function WalletKeyLoader({ 
  onWalletLoaded, 
  onError, 
  isDisabled = false,
  selectedVideo
}: WalletKeyLoaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [costEstimate, setCostEstimate] = useState<any>(null);
  const [isEstimatingCost, setIsEstimatingCost] = useState(false);
  
  const {
    walletKey,
    walletInfo,
    isLoading,
    error,
    loadWallet,
    clearWallet
  } = useArweaveWallet();

  const estimateUploadCost = useCallback(async () => {
    if (!selectedVideo) return;

    setIsEstimatingCost(true);
    
    try {
      const estimate = await CostEstimationService.getCostWithUSDEstimate(selectedVideo.size);
      setCostEstimate(estimate);
      
      // Check if wallet has sufficient balance
      if (walletKey) {
        const balanceCheck = await CostEstimationService.checkSufficientBalance(
          walletKey, 
          estimate.estimatedCost
        );
        
        if (!balanceCheck.sufficient) {
          onError({
            type: 'balance',
            message: `Insufficient balance. You need ${estimate.formattedCost} but only have ${walletInfo?.formattedBalance || '0 AR'}`,
            suggestedAction: balanceCheck.recommendation || 'Please add more AR tokens to your wallet',
            recoverable: true
          });
        }
      }
    } catch (err) {
      console.error('Cost estimation error:', err);
      // Don't show error for cost estimation failure, just continue without estimate
    } finally {
      setIsEstimatingCost(false);
    }
  }, [selectedVideo, walletKey, walletInfo, onError]);

  // Estimate cost when wallet and video are both available
  useEffect(() => {
    if (walletKey && selectedVideo && !costEstimate && !isEstimatingCost) {
      estimateUploadCost();
    }
  }, [walletKey, selectedVideo, costEstimate, isEstimatingCost, estimateUploadCost]);

  const handleFileInputChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && !isDisabled) {
      try {
        await loadWallet(file);
        if (walletKey) {
          onWalletLoaded(walletKey);
        }
      } catch (err) {
        // Error is handled by the hook
      }
    }
  }, [loadWallet, onWalletLoaded, walletKey, isDisabled]);

  const handleBrowseClick = useCallback(() => {
    if (!isDisabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [isDisabled]);

  const handleRemoveWallet = useCallback(() => {
    if (!isDisabled) {
      clearWallet();
      setCostEstimate(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [clearWallet, isDisabled]);

  const handleRetry = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  if (walletKey && walletInfo) {
    return <LoadedWalletDisplay 
      walletInfo={walletInfo}
      costEstimate={costEstimate}
      isEstimatingCost={isEstimatingCost}
      onRemove={handleRemoveWallet}
      onRetryEstimate={estimateUploadCost}
      isDisabled={isDisabled}
    />;
  }

  return (
    <div className="w-full">
      {/* File input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isDisabled}
      />

      {/* Wallet key loader */}
      <div className={`
        border-2 border-dashed border-gray-300 rounded-lg p-8 text-center
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-purple-400 hover:bg-gray-50 cursor-pointer'}
        ${isLoading ? 'pointer-events-none' : ''}
      `}>
        {isLoading ? (
          <div className="flex flex-col items-center">
            <LoadingSpinner size="lg" className="text-purple-600 mb-4" />
            <p className="text-gray-600">Validating wallet key...</p>
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H17a2 2 0 01-2-2V7zM9 20l6 6 6-6"
                />
              </svg>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Load your Arweave wallet key
            </h3>
            
            <p className="text-gray-600 mb-4">
              Select your wallet key file (.json) to sign the upload transaction
            </p>
            
            <button
              type="button"
              onClick={handleBrowseClick}
              disabled={isDisabled}
              className={`
                inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white
                ${isDisabled ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'}
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors
              `}
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              Browse Wallet File
            </button>
          </>
        )}
      </div>

      {/* Error display */}
      {error && (
        <div className="mt-4">
          <CompactErrorDisplay 
            error={error} 
            onRetry={handleRetry}
          />
        </div>
      )}

      {/* Help section */}
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          <span>Required: JSON wallet key file</span>
          <span>Secure validation</span>
        </div>
        
        <WalletKeyHelpTooltip>
          <HelpIcon />
        </WalletKeyHelpTooltip>
      </div>
    </div>
  );
}

/**
 * Component to display loaded wallet information with cost estimate
 */
function LoadedWalletDisplay({ 
  walletInfo, 
  costEstimate, 
  isEstimatingCost,
  onRemove, 
  onRetryEstimate,
  isDisabled 
}: {
  walletInfo: any;
  costEstimate: any;
  isEstimatingCost: boolean;
  onRemove: () => void;
  onRetryEstimate: () => void;
  isDisabled: boolean;
}) {
  const hasInsufficientBalance = costEstimate && walletInfo.balance < costEstimate.estimatedCost;

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-900">
              Wallet Connected
            </h4>
            <p className="text-sm text-gray-500">
              {walletInfo.formattedAddress}
            </p>
          </div>
        </div>

        <button
          onClick={onRemove}
          disabled={isDisabled}
          className={`
            p-1 rounded-full
            ${isDisabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'}
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors
          `}
          title="Remove wallet"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Wallet balance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Balance</span>
            <BalanceHelpTooltip>
              <HelpIcon className="w-3 h-3" />
            </BalanceHelpTooltip>
          </div>
          <div className={`text-lg font-semibold ${
            hasInsufficientBalance ? 'text-red-600' : 'text-gray-900'
          }`}>
            {walletInfo.formattedBalance}
          </div>
        </div>

        {/* Cost estimate */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Estimated Cost</span>
            <CostEstimationHelpTooltip>
              <HelpIcon className="w-3 h-3" />
            </CostEstimationHelpTooltip>
          </div>
          
          {isEstimatingCost ? (
            <div className="flex items-center space-x-2">
              <LoadingSpinner size="sm" className="text-purple-600" />
              <span className="text-sm text-gray-500">Calculating...</span>
            </div>
          ) : costEstimate ? (
            <div>
              <div className="text-lg font-semibold text-gray-900">
                {costEstimate.formattedCost}
              </div>
              {costEstimate.usdEstimate && (
                <div className="text-xs text-gray-500">
                  {costEstimate.usdEstimate}
                </div>
              )}
              <div className="text-xs text-gray-500 mt-1">
                Confidence: {costEstimate.confidence}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">Not available</span>
              <button
                onClick={onRetryEstimate}
                className="text-xs text-purple-600 hover:text-purple-800 underline"
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Balance warning */}
      {hasInsufficientBalance && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div className="text-sm">
              <p className="font-medium text-red-800">Insufficient Balance</p>
              <p className="text-red-700 mt-1">
                You need {costEstimate.formattedCost} but only have {walletInfo.formattedBalance}. 
                Please add more AR tokens to your wallet before proceeding.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Success indicator */}
      {!hasInsufficientBalance && costEstimate && (
        <div className="flex items-center text-sm text-green-600">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Wallet ready for upload
        </div>
      )}
    </div>
  );
}

/**
 * Compact wallet key loader for smaller spaces
 */
export function CompactWalletKeyLoader({ 
  onWalletLoaded, 
  onError, 
  isDisabled = false 
}: Omit<WalletKeyLoaderProps, 'selectedVideo'>) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { walletKey, walletInfo, isLoading, error, loadWallet } = useArweaveWallet();

  const handleFileInputChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && !isDisabled) {
      try {
        await loadWallet(file);
        if (walletKey) {
          onWalletLoaded(walletKey);
        }
      } catch (err) {
        // Error is handled by the hook
      }
    }
  }, [loadWallet, onWalletLoaded, walletKey, isDisabled]);

  const handleBrowseClick = useCallback(() => {
    if (!isDisabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [isDisabled]);

  return (
    <div className="flex items-center space-x-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isDisabled}
      />
      
      <button
        onClick={handleBrowseClick}
        disabled={isDisabled || isLoading}
        className={`
          inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md
          ${isDisabled || isLoading ? 'text-gray-400 bg-gray-100 cursor-not-allowed' : 'text-gray-700 bg-white hover:bg-gray-50'}
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors
        `}
      >
        {isLoading ? (
          <>
            <LoadingSpinner size="sm" className="mr-2" />
            Loading...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            Load Wallet
          </>
        )}
      </button>
      
      {walletInfo && (
        <span className="text-sm text-green-600 font-medium">
          {walletInfo.formattedAddress}
        </span>
      )}
      
      {error && (
        <span className="text-sm text-red-600">
          {error.message}
        </span>
      )}
    </div>
  );
}