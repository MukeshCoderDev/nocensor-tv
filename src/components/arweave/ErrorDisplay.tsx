import React from 'react';
import { ErrorDisplayProps, ArweaveError } from '../../types/ArweaveTypes';

/**
 * Error display component for user-friendly error messages with recovery suggestions
 */
export function ErrorDisplay({ 
  error, 
  onRetry, 
  onDismiss, 
  className = '' 
}: ErrorDisplayProps) {
  if (!error) return null;

  const getErrorIcon = (errorType: ArweaveError['type']) => {
    switch (errorType) {
      case 'validation':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'network':
        return (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'balance':
        return (
          <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
          </svg>
        );
      case 'upload':
        return (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getErrorTitle = (errorType: ArweaveError['type']) => {
    switch (errorType) {
      case 'validation':
        return 'Validation Error';
      case 'network':
        return 'Network Error';
      case 'balance':
        return 'Insufficient Balance';
      case 'upload':
        return 'Upload Error';
      default:
        return 'Error';
    }
  };

  const getErrorBgColor = (errorType: ArweaveError['type']) => {
    switch (errorType) {
      case 'validation':
        return 'bg-yellow-50 border-yellow-200';
      case 'network':
        return 'bg-red-50 border-red-200';
      case 'balance':
        return 'bg-orange-50 border-orange-200';
      case 'upload':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const showRetryButton = error.recoverable && onRetry;
  const showHelpLink = error.type === 'balance' || error.type === 'validation';

  return (
    <div className={`rounded-lg border p-4 ${getErrorBgColor(error.type)} ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getErrorIcon(error.type)}
        </div>
        
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-gray-900">
            {getErrorTitle(error.type)}
          </h3>
          
          <div className="mt-1 text-sm text-gray-700">
            <p>{error.message}</p>
            
            {error.details && (
              <details className="mt-2">
                <summary className="cursor-pointer text-xs text-gray-500 hover:text-gray-700">
                  Show technical details
                </summary>
                <p className="mt-1 text-xs text-gray-600 font-mono bg-gray-100 p-2 rounded">
                  {error.details}
                </p>
              </details>
            )}
          </div>

          {error.suggestedAction && (
            <div className="mt-2 text-sm text-gray-600">
              <strong>Suggestion:</strong> {error.suggestedAction}
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            {showRetryButton && (
              <button
                onClick={onRetry}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              >
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Try Again
              </button>
            )}

            {showHelpLink && (
              <a
                href={getHelpUrl(error.type)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              >
                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                Get Help
              </a>
            )}

            {onDismiss && (
              <button
                onClick={onDismiss}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>

        {onDismiss && (
          <div className="ml-auto pl-3">
            <button
              onClick={onDismiss}
              className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 rounded"
            >
              <span className="sr-only">Dismiss</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Compact error display for inline use
 */
export function CompactErrorDisplay({ 
  error, 
  onRetry, 
  className = '' 
}: Omit<ErrorDisplayProps, 'onDismiss'>) {
  if (!error) return null;

  return (
    <div className={`flex items-center space-x-2 text-sm ${className}`}>
      <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      
      <span className="text-red-700 flex-1">{error.message}</span>
      
      {error.recoverable && onRetry && (
        <button
          onClick={onRetry}
          className="text-purple-600 hover:text-purple-800 font-medium underline focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
        >
          Retry
        </button>
      )}
    </div>
  );
}

/**
 * Toast-style error notification
 */
export function ErrorToast({ 
  error, 
  onDismiss, 
  className = '' 
}: Pick<ErrorDisplayProps, 'error' | 'onDismiss' | 'className'>) {
  if (!error) return null;

  return (
    <div className={`fixed top-4 right-4 max-w-sm w-full bg-white shadow-lg rounded-lg border border-red-200 z-50 ${className}`}>
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-gray-900">Error</p>
            <p className="mt-1 text-sm text-gray-700">{error.message}</p>
          </div>
          
          {onDismiss && (
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={onDismiss}
                className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 rounded"
              >
                <span className="sr-only">Close</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to get help URLs
function getHelpUrl(errorType: ArweaveError['type']): string {
  switch (errorType) {
    case 'balance':
      return 'https://docs.arweave.org/info/wallets/arweave-wallet';
    case 'validation':
      return 'https://docs.arweave.org/info/wallets/generating-wallet';
    default:
      return 'https://docs.arweave.org/';
  }
}