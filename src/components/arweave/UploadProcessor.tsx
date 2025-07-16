import React, { useState, useCallback, useEffect } from 'react';
import { UploadProcessorProps } from '../../types/ArweaveTypes';
import { useUploadProgress } from '../../hooks/useUploadProgress';
import { CostEstimationService } from '../../services/CostEstimationService';
import { CircularProgress, LoadingSpinner } from './ProgressIndicator';
import { ErrorDisplay } from './ErrorDisplay';

/**
 * Upload processor component for step 3 of upload process
 */
export function UploadProcessor({ 
  video, 
  walletKey, 
  onUploadComplete, 
  onError, 
  onCancel 
}: UploadProcessorProps) {
  const [costEstimate, setCostEstimate] = useState<any>(null);
  const [isEstimatingCost, setIsEstimatingCost] = useState(true);
  const [showConfirmation, setShowConfirmation] = useState(true);
  const [uploadError, setUploadError] = useState<any>(null);

  const {
    progress,
    startUpload,
    cancelUpload,
    retryUpload
  } = useUploadProgress();

  // Get cost estimate on component mount
  useEffect(() => {
    estimateCost();
  }, [video]);

  const estimateCost = useCallback(async () => {
    setIsEstimatingCost(true);
    
    try {
      const estimate = await CostEstimationService.getCostWithUSDEstimate(video.size);
      setCostEstimate(estimate);
      
      // Check balance
      const balanceCheck = await CostEstimationService.checkSufficientBalance(
        walletKey, 
        estimate.estimatedCost
      );
      
      if (!balanceCheck.sufficient) {
        onError({
          type: 'balance',
          message: `Insufficient balance. You need ${estimate.formattedCost} but only have ${balanceCheck.balance.toFixed(4)} AR`,
          suggestedAction: balanceCheck.recommendation || 'Please add more AR tokens to your wallet',
          recoverable: false
        });
      }
    } catch (err) {
      console.error('Cost estimation error:', err);
      onError({
        type: 'network',
        message: 'Failed to estimate upload cost',
        suggestedAction: 'Please check your internet connection and try again',
        recoverable: true
      });
    } finally {
      setIsEstimatingCost(false);
    }
  }, [video, walletKey, onError]);

  const handleConfirmUpload = useCallback(async () => {
    setShowConfirmation(false);
    setUploadError(null);
    
    try {
      const transactionId = await startUpload(video, walletKey);
      onUploadComplete(transactionId);
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadError(error);
    }
  }, [startUpload, video, walletKey, onUploadComplete]);

  const handleCancelUpload = useCallback(() => {
    if (progress.status === 'uploading' || progress.status === 'preparing') {
      cancelUpload();
    }
    onCancel();
  }, [cancelUpload, onCancel, progress.status]);

  const handleRetryUpload = useCallback(async () => {
    setUploadError(null);
    
    try {
      const transactionId = await retryUpload(video, walletKey);
      onUploadComplete(transactionId);
    } catch (error: any) {
      console.error('Retry upload error:', error);
      setUploadError(error);
    }
  }, [retryUpload, video, walletKey, onUploadComplete]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Show cost confirmation dialog
  if (showConfirmation) {
    return (
      <div className="w-full">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Confirm Upload
          </h3>

          {/* Video details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Video Details</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>File name:</span>
                <span className="font-medium">{video.name}</span>
              </div>
              <div className="flex justify-between">
                <span>File size:</span>
                <span className="font-medium">{formatFileSize(video.size)}</span>
              </div>
              <div className="flex justify-between">
                <span>File type:</span>
                <span className="font-medium">{video.type}</span>
              </div>
            </div>
          </div>

          {/* Cost estimate */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-blue-900 mb-2">Upload Cost</h4>
            
            {isEstimatingCost ? (
              <div className="flex items-center space-x-2">
                <LoadingSpinner size="sm" className="text-blue-600" />
                <span className="text-blue-700">Calculating cost...</span>
              </div>
            ) : costEstimate ? (
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-blue-700">Estimated cost:</span>
                  <span className="font-semibold text-blue-900 text-lg">
                    {costEstimate.formattedCost}
                  </span>
                </div>
                
                {costEstimate.usdEstimate && (
                  <div className="flex justify-between items-center">
                    <span className="text-blue-700">USD equivalent:</span>
                    <span className="font-medium text-blue-800">
                      {costEstimate.usdEstimate}
                    </span>
                  </div>
                )}
                
                <div className="text-xs text-blue-600 mt-2">
                  Confidence: {costEstimate.confidence} • Includes network fee buffer
                </div>
              </div>
            ) : (
              <div className="text-blue-700">
                Cost estimation unavailable
              </div>
            )}
          </div>

          {/* Important notice */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="text-sm">
                <p className="font-medium text-yellow-800">Important Notice</p>
                <p className="text-yellow-700 mt-1">
                  This upload will permanently store your video on the Arweave network. 
                  The transaction cannot be reversed once confirmed.
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleConfirmUpload}
              disabled={isEstimatingCost}
              className={`
                flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white
                ${isEstimatingCost ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700'}
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors
              `}
            >
              {isEstimatingCost ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Calculating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Confirm & Upload
                </>
              )}
            </button>
            
            <button
              onClick={handleCancelUpload}
              className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show upload progress
  return (
    <div className="w-full">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="text-center mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {getStatusTitle(progress.status)}
          </h3>
          <p className="text-gray-600">
            {getStatusDescription(progress.status)}
          </p>
        </div>

        {/* Progress visualization */}
        <div className="flex justify-center mb-6">
          <CircularProgress 
            percentage={progress.percentage} 
            size={120} 
            strokeWidth={8}
          />
        </div>

        {/* Progress details */}
        {progress.status === 'uploading' && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Uploaded:</span>
                <div className="font-medium">
                  {formatFileSize(progress.bytesUploaded)} / {formatFileSize(progress.totalBytes)}
                </div>
              </div>
              
              {progress.estimatedTimeRemaining && (
                <div>
                  <span className="text-gray-600">Time remaining:</span>
                  <div className="font-medium">
                    {formatTime(progress.estimatedTimeRemaining)}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Success state */}
        {progress.status === 'completed' && progress.transactionId && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <div className="text-center">
              <svg className="w-12 h-12 text-green-500 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              
              <h4 className="font-medium text-green-900 mb-2">Upload Successful!</h4>
              <p className="text-green-700 text-sm mb-4">
                Your video has been permanently stored on the Arweave network.
              </p>
              
              <div className="bg-white border border-green-200 rounded p-3 mb-4">
                <div className="text-xs text-green-700 mb-1">Transaction ID:</div>
                <div className="font-mono text-xs text-green-800 break-all">
                  {progress.transactionId}
                </div>
              </div>
              
              <div className="flex justify-center space-x-3">
                <a
                  href={`https://arweave.net/${progress.transactionId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-2 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                    <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                  </svg>
                  View on Arweave
                </a>
                
                <button
                  onClick={() => navigator.clipboard.writeText(progress.transactionId!)}
                  className="inline-flex items-center px-3 py-2 border border-green-300 text-sm font-medium rounded-md text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                  Copy ID
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error state */}
        {uploadError && (
          <div className="mb-4">
            <ErrorDisplay 
              error={uploadError}
              onRetry={handleRetryUpload}
              onDismiss={() => setUploadError(null)}
            />
          </div>
        )}

        {/* Action buttons */}
        <div className="flex justify-center space-x-3">
          {(progress.status === 'uploading' || progress.status === 'preparing') && (
            <button
              onClick={handleCancelUpload}
              className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Cancel Upload
            </button>
          )}
          
          {progress.status === 'failed' && !uploadError && (
            <button
              onClick={handleRetryUpload}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
              Retry Upload
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getStatusTitle(status: string) {
  switch (status) {
    case 'preparing':
      return 'Preparing Upload';
    case 'uploading':
      return 'Uploading to Arweave';
    case 'confirming':
      return 'Confirming Transaction';
    case 'completed':
      return 'Upload Complete';
    case 'failed':
      return 'Upload Failed';
    default:
      return 'Processing';
  }
}

function getStatusDescription(status: string) {
  switch (status) {
    case 'preparing':
      return 'Creating transaction and preparing your video for upload...';
    case 'uploading':
      return 'Uploading your video to the Arweave network...';
    case 'confirming':
      return 'Waiting for network confirmation...';
    case 'completed':
      return 'Your video has been successfully uploaded and is now permanently stored.';
    case 'failed':
      return 'The upload process encountered an error.';
    default:
      return 'Processing your request...';
  }
}