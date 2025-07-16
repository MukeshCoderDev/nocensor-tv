import React from 'react';
import { ProgressIndicatorProps, UploadProgress } from '../../types/ArweaveTypes';

/**
 * Progress indicator component for visual upload progress with step-by-step visualization
 */
export function ProgressIndicator({ 
  currentStep, 
  uploadProgress, 
  className = '' 
}: ProgressIndicatorProps) {
  const steps = [
    { number: 1, title: 'Choose Video', description: 'Select your video file' },
    { number: 2, title: 'Load Wallet Key', description: 'Select your Arweave wallet' },
    { number: 3, title: 'Upload Video', description: 'Upload to Arweave network' }
  ];

  const getStepStatus = (stepNumber: number) => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepIcon = (stepNumber: number, status: string) => {
    if (status === 'completed') {
      return (
        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      );
    }
    
    if (status === 'current') {
      return (
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
      );
    }
    
    return (
      <span className="text-gray-500 font-medium">{stepNumber}</span>
    );
  };

  const getStepClasses = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 border-green-500';
      case 'current':
        return 'bg-purple-600 border-purple-600';
      default:
        return 'bg-white border-gray-300';
    }
  };

  const getConnectorClasses = (stepNumber: number) => {
    const isCompleted = stepNumber < currentStep;
    return `flex-1 h-0.5 ${isCompleted ? 'bg-green-500' : 'bg-gray-300'}`;
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Step indicators */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => {
          const status = getStepStatus(step.number);
          
          return (
            <React.Fragment key={step.number}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${getStepClasses(status)}`}
                >
                  {getStepIcon(step.number, status)}
                </div>
                <div className="mt-2 text-center">
                  <div className={`text-sm font-medium ${
                    status === 'current' ? 'text-purple-600' : 
                    status === 'completed' ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {step.description}
                  </div>
                </div>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className={getConnectorClasses(step.number)} />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Upload progress details */}
      {currentStep === 3 && uploadProgress && (
        <UploadProgressDetails progress={uploadProgress} />
      )}
    </div>
  );
}

/**
 * Detailed upload progress component
 */
function UploadProgressDetails({ progress }: { progress: UploadProgress }) {
  const getStatusColor = (status: UploadProgress['status']) => {
    switch (status) {
      case 'preparing':
        return 'text-blue-600';
      case 'uploading':
        return 'text-purple-600';
      case 'confirming':
        return 'text-yellow-600';
      case 'completed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusMessage = (status: UploadProgress['status']) => {
    switch (status) {
      case 'preparing':
        return 'Preparing upload...';
      case 'uploading':
        return 'Uploading to Arweave...';
      case 'confirming':
        return 'Confirming transaction...';
      case 'completed':
        return 'Upload completed successfully!';
      case 'failed':
        return 'Upload failed';
      default:
        return 'Ready to upload';
    }
  };

  const formatBytes = (bytes: number) => {
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

  return (
    <div className="bg-gray-50 rounded-lg p-4 space-y-4">
      {/* Status message */}
      <div className="flex items-center justify-between">
        <span className={`font-medium ${getStatusColor(progress.status)}`}>
          {getStatusMessage(progress.status)}
        </span>
        <span className="text-sm text-gray-500">
          {Math.round(progress.percentage)}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${
            progress.status === 'failed' ? 'bg-red-500' :
            progress.status === 'completed' ? 'bg-green-500' : 'bg-purple-600'
          }`}
          style={{ width: `${progress.percentage}%` }}
        />
      </div>

      {/* Upload details */}
      {progress.status === 'uploading' && (
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Uploaded:</span>{' '}
            {formatBytes(progress.bytesUploaded)} / {formatBytes(progress.totalBytes)}
          </div>
          {progress.estimatedTimeRemaining && (
            <div>
              <span className="font-medium">Time remaining:</span>{' '}
              {formatTime(progress.estimatedTimeRemaining)}
            </div>
          )}
        </div>
      )}

      {/* Transaction ID */}
      {progress.status === 'completed' && progress.transactionId && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <div className="text-sm text-green-800">
            <span className="font-medium">Transaction ID:</span>
            <div className="mt-1 font-mono text-xs break-all">
              {progress.transactionId}
            </div>
            <div className="mt-2 flex space-x-2">
              <a
                href={`https://arweave.net/${progress.transactionId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-green-700 hover:text-green-900 underline"
              >
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                  <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                </svg>
                View on Arweave
              </a>
              <button
                onClick={() => navigator.clipboard.writeText(progress.transactionId!)}
                className="inline-flex items-center text-green-700 hover:text-green-900 underline"
              >
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                  <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                </svg>
                Copy ID
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Compact progress indicator for smaller spaces
 */
export function CompactProgressIndicator({ 
  currentStep, 
  className = '' 
}: Pick<ProgressIndicatorProps, 'currentStep' | 'className'>) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="text-sm text-gray-500">Step</span>
      <div className="flex space-x-1">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`w-2 h-2 rounded-full ${
              step <= currentStep ? 'bg-purple-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
      <span className="text-sm text-gray-500">{currentStep}/3</span>
    </div>
  );
}

/**
 * Circular progress indicator
 */
export function CircularProgress({ 
  percentage, 
  size = 40, 
  strokeWidth = 4,
  className = ''
}: {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-gray-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="text-purple-600 transition-all duration-300"
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium text-gray-700">
          {Math.round(percentage)}%
        </span>
      </div>
    </div>
  );
}

/**
 * Loading spinner component
 */
export function LoadingSpinner({ 
  size = 'md', 
  className = '' 
}: { 
  size?: 'sm' | 'md' | 'lg'; 
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${className}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}