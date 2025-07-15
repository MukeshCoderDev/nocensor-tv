import React from 'react';
import Icon from '../../../../components/Icon';

interface ErrorDisplayProps {
  error: any;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  onDismiss,
  className = ''
}) => {
  if (!error) return null;

  return (
    <div className={`error-display bg-red-900/20 border border-red-500 rounded-lg p-4 ${className}`}>
      <div className="flex items-start space-x-3">
        <Icon name="fas fa-exclamation-triangle" className="text-red-400 text-lg mt-0.5" />
        <div className="flex-1">
          <h4 className="text-red-400 font-medium mb-1">Error</h4>
          <p className="text-red-300 text-sm mb-3">
            {error.message || 'An unexpected error occurred'}
          </p>
          {error.details && (
            <p className="text-red-200 text-xs mb-3">{error.details}</p>
          )}
          <div className="flex space-x-2">
            {onRetry && (
              <button
                onClick={onRetry}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
              >
                Retry
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;