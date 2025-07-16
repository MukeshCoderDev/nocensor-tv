import React, { useState, useCallback, useEffect, useRef } from 'react';
import { 
  ArweaveUploaderProps, 
  ArweaveUploaderState, 
  ArweaveWalletKey, 
  ArweaveError 
} from '../../types/ArweaveTypes';
import { ProgressIndicator } from './ProgressIndicator';
import { VideoSelector } from './VideoSelector';
import { WalletKeyLoader } from './WalletKeyLoader';
import { UploadProcessor } from './UploadProcessor';
import { ErrorDisplay, ErrorToast } from './ErrorDisplay';
import { UploadProcessHelp } from './HelpTooltip';
import { useAccessibility } from '../../hooks/useAccessibility';
import { ArweaveErrorBoundary } from './ErrorBoundary';

/**
 * Main container component that orchestrates the three-step upload workflow
 */
export function ArweaveUploaderContainer({ 
  onUploadComplete, 
  onError, 
  className = '' 
}: ArweaveUploaderProps) {
  const [state, setState] = useState<ArweaveUploaderState>({
    currentStep: 1,
    selectedVideo: null,
    walletKey: null,
    uploadProgress: {
      percentage: 0,
      status: 'idle',
      bytesUploaded: 0,
      totalBytes: 0
    },
    isProcessing: false,
    error: null
  });

  const [showErrorToast, setShowErrorToast] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const stepContentRef = useRef<HTMLDivElement>(null);
  
  // Accessibility hooks
  const {
    announceStepChange,
    announceUploadProgress,
    announceError,
    announceSuccess,
    trapFocus,
    addSkipLink,
    prefersReducedMotion
  } = useAccessibility();

  // Accessibility effects
  useEffect(() => {
    // Announce step changes
    const stepNames = ['Choose Video', 'Load Wallet Key', 'Upload Video'];
    announceStepChange(state.currentStep, stepNames[state.currentStep - 1]);
    
    // Focus management for step transitions
    if (stepContentRef.current && !prefersReducedMotion) {
      stepContentRef.current.focus();
    }
  }, [state.currentStep, announceStepChange, prefersReducedMotion]);

  useEffect(() => {
    // Announce upload progress
    if (state.currentStep === 3 && state.uploadProgress.status !== 'idle') {
      announceUploadProgress(state.uploadProgress.percentage, state.uploadProgress.status);
    }
  }, [state.uploadProgress.percentage, state.uploadProgress.status, announceUploadProgress, state.currentStep]);

  useEffect(() => {
    // Announce errors
    if (state.error) {
      announceError(state.error.message);
    }
  }, [state.error, announceError]);

  useEffect(() => {
    // Announce success
    if (state.uploadProgress.status === 'completed' && state.uploadProgress.transactionId) {
      announceSuccess('Video uploaded successfully to Arweave network');
    }
  }, [state.uploadProgress.status, state.uploadProgress.transactionId, announceSuccess]);

  useEffect(() => {
    // Add skip links
    const removeSkipToContent = addSkipLink('upload-content', 'Skip to upload content');
    const removeSkipToHelp = addSkipLink('upload-help', 'Skip to help section');
    
    return () => {
      removeSkipToContent();
      removeSkipToHelp();
    };
  }, [addSkipLink]);

  // Step 1: Video selection handlers
  const handleVideoSelected = useCallback((file: File | null) => {
    setState(prev => ({
      ...prev,
      selectedVideo: file,
      currentStep: file ? 2 : 1,
      error: null
    }));
  }, []);

  const handleVideoError = useCallback((error: ArweaveError) => {
    setState(prev => ({ ...prev, error }));
    setShowErrorToast(true);
    
    if (onError) {
      onError(error);
    }
  }, [onError]);

  // Step 2: Wallet loading handlers
  const handleWalletLoaded = useCallback((wallet: ArweaveWalletKey) => {
    setState(prev => ({
      ...prev,
      walletKey: wallet,
      currentStep: 3,
      error: null
    }));
  }, []);

  const handleWalletError = useCallback((error: ArweaveError) => {
    setState(prev => ({ ...prev, error }));
    setShowErrorToast(true);
    
    if (onError) {
      onError(error);
    }
  }, [onError]);

  // Step 3: Upload handlers
  const handleUploadComplete = useCallback((transactionId: string) => {
    setState(prev => ({
      ...prev,
      uploadProgress: {
        ...prev.uploadProgress,
        status: 'completed',
        percentage: 100,
        transactionId
      },
      isProcessing: false,
      error: null
    }));

    if (onUploadComplete) {
      onUploadComplete(transactionId);
    }
  }, [onUploadComplete]);

  const handleUploadError = useCallback((error: ArweaveError) => {
    setState(prev => ({
      ...prev,
      isProcessing: false,
      error
    }));
    
    setShowErrorToast(true);
    
    if (onError) {
      onError(error);
    }
  }, [onError]);

  const handleUploadCancel = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentStep: 2,
      isProcessing: false,
      uploadProgress: {
        percentage: 0,
        status: 'idle',
        bytesUploaded: 0,
        totalBytes: 0
      }
    }));
  }, []);

  // Navigation handlers
  const handleStepNavigation = useCallback((step: 1 | 2 | 3) => {
    if (state.isProcessing) return; // Prevent navigation during upload
    
    // Validate step requirements
    if (step >= 2 && !state.selectedVideo) return;
    if (step >= 3 && !state.walletKey) return;
    
    setState(prev => ({
      ...prev,
      currentStep: step,
      error: null
    }));
  }, [state.isProcessing, state.selectedVideo, state.walletKey]);

  // Reset entire flow
  const handleReset = useCallback(() => {
    setState({
      currentStep: 1,
      selectedVideo: null,
      walletKey: null,
      uploadProgress: {
        percentage: 0,
        status: 'idle',
        bytesUploaded: 0,
        totalBytes: 0
      },
      isProcessing: false,
      error: null
    });
    setShowErrorToast(false);
  }, []);

  const handleDismissError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
    setShowErrorToast(false);
  }, []);

  const canNavigateToStep = useCallback((step: number) => {
    if (state.isProcessing) return false;
    if (step >= 2 && !state.selectedVideo) return false;
    if (step >= 3 && !state.walletKey) return false;
    return true;
  }, [state.isProcessing, state.selectedVideo, state.walletKey]);

  return (
    <ArweaveErrorBoundary>
      <div 
        ref={containerRef}
        className={`w-full max-w-4xl mx-auto ${className}`}
        role="main"
        aria-labelledby="uploader-title"
        aria-describedby="uploader-description"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 
            id="uploader-title"
            className="text-2xl font-bold text-gray-900 mb-2"
          >
            Decentralized Arweave Uploader
          </h1>
          <p 
            id="uploader-description"
            className="text-gray-600"
          >
            Upload your video permanently to the censorship-resistant Arweave network
          </p>
        </div>

      {/* Progress indicator */}
      <div className="mb-8">
        <ProgressIndicator 
          currentStep={state.currentStep}
          uploadProgress={state.currentStep === 3 ? state.uploadProgress : undefined}
        />
      </div>

      {/* Main content area */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Step navigation (clickable when allowed) */}
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex space-x-6">
              {[1, 2, 3].map((step) => {
                const isActive = state.currentStep === step;
                const isClickable = canNavigateToStep(step);
                const stepTitles = ['Choose Video', 'Load Wallet', 'Upload'];
                
                return (
                  <button
                    key={step}
                    onClick={() => isClickable ? handleStepNavigation(step as 1 | 2 | 3) : undefined}
                    disabled={!isClickable}
                    className={`
                      text-sm font-medium transition-colors
                      ${isActive ? 'text-purple-600 border-b-2 border-purple-600 pb-1' : ''}
                      ${isClickable && !isActive ? 'text-gray-600 hover:text-purple-600 cursor-pointer' : ''}
                      ${!isClickable ? 'text-gray-400 cursor-not-allowed' : ''}
                    `}
                  >
                    {step}. {stepTitles[step - 1]}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={handleReset}
              disabled={state.isProcessing}
              className={`
                text-sm text-gray-500 hover:text-gray-700 transition-colors
                ${state.isProcessing ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              `}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Step content */}
        <div className="p-6">
          {/* Global error display */}
          {state.error && !showErrorToast && (
            <div className="mb-6">
              <ErrorDisplay 
                error={state.error}
                onDismiss={handleDismissError}
              />
            </div>
          )}

          {/* Step 1: Video Selection */}
          {state.currentStep === 1 && (
            <div>
              <VideoSelector
                onVideoSelected={handleVideoSelected}
                onError={handleVideoError}
                selectedVideo={state.selectedVideo}
                isDisabled={state.isProcessing}
              />
            </div>
          )}

          {/* Step 2: Wallet Key Loading */}
          {state.currentStep === 2 && (
            <div>
              <WalletKeyLoader
                onWalletLoaded={handleWalletLoaded}
                onError={handleWalletError}
                isDisabled={state.isProcessing}
                selectedVideo={state.selectedVideo}
              />
            </div>
          )}

          {/* Step 3: Upload Processing */}
          {state.currentStep === 3 && state.selectedVideo && state.walletKey && (
            <div>
              <UploadProcessor
                video={state.selectedVideo}
                walletKey={state.walletKey}
                onUploadComplete={handleUploadComplete}
                onError={handleUploadError}
                onCancel={handleUploadCancel}
              />
            </div>
          )}
        </div>
      </div>

      {/* Help section */}
      <div className="mt-8">
        <UploadProcessHelp />
      </div>

      {/* Error toast */}
      {showErrorToast && state.error && (
        <ErrorToast 
          error={state.error}
          onDismiss={() => setShowErrorToast(false)}
        />
      )}
    </div>
    </ArweaveErrorBoundary>
  );
}

/**
 * Compact version of the uploader for smaller spaces
 */
export function CompactArweaveUploader({ 
  onUploadComplete, 
  onError, 
  className = '' 
}: ArweaveUploaderProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [walletKey, setWalletKey] = useState<ArweaveWalletKey | null>(null);
  const [error, setError] = useState<ArweaveError | null>(null);

  const handleVideoSelected = useCallback((file: File | null) => {
    setSelectedVideo(file);
    if (file) setCurrentStep(2);
    setError(null);
  }, []);

  const handleWalletLoaded = useCallback((wallet: ArweaveWalletKey) => {
    setWalletKey(wallet);
    setCurrentStep(3);
    setError(null);
  }, []);

  const handleError = useCallback((err: ArweaveError) => {
    setError(err);
    if (onError) onError(err);
  }, [onError]);

  const handleUploadComplete = useCallback((transactionId: string) => {
    if (onUploadComplete) onUploadComplete(transactionId);
  }, [onUploadComplete]);

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-gray-900">Arweave Upload</h3>
          <div className="text-sm text-gray-500">Step {currentStep}/3</div>
        </div>

        {error && (
          <div className="mb-4">
            <ErrorDisplay 
              error={error}
              onDismiss={() => setError(null)}
            />
          </div>
        )}

        {currentStep === 1 && (
          <VideoSelector
            onVideoSelected={handleVideoSelected}
            onError={handleError}
            selectedVideo={selectedVideo}
          />
        )}

        {currentStep === 2 && (
          <WalletKeyLoader
            onWalletLoaded={handleWalletLoaded}
            onError={handleError}
            selectedVideo={selectedVideo}
          />
        )}

        {currentStep === 3 && selectedVideo && walletKey && (
          <UploadProcessor
            video={selectedVideo}
            walletKey={walletKey}
            onUploadComplete={handleUploadComplete}
            onError={handleError}
            onCancel={() => setCurrentStep(2)}
          />
        )}
      </div>
    </div>
  );
}

/**
 * Modal version of the uploader
 */
export function ArweaveUploaderModal({ 
  isOpen, 
  onClose, 
  onUploadComplete, 
  onError 
}: ArweaveUploaderProps & { 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal content */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Upload to Arweave
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <ArweaveUploaderContainer
              onUploadComplete={(txId) => {
                if (onUploadComplete) onUploadComplete(txId);
                onClose();
              }}
              onError={onError}
            />
          </div>
        </div>
      </div>
    </div>
  );
}