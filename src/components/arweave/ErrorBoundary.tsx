import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ArweaveError } from '../../types/ArweaveTypes';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
}

/**
 * Global error boundary for Arweave uploader components
 */
export class ArweaveErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorId: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    this.logError(error, errorInfo);
    
    // Update state with error info
    this.setState({
      errorInfo
    });

    // Call onError callback if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetOnPropsChange, resetKeys } = this.props;
    const { hasError } = this.state;

    // Reset error boundary when resetKeys change
    if (hasError && resetOnPropsChange && resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (resetKey, idx) => prevProps.resetKeys?.[idx] !== resetKey
      );

      if (hasResetKeyChanged) {
        this.resetErrorBoundary();
      }
    }
  }

  componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  logError = (error: Error, errorInfo: ErrorInfo) => {
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      errorId: this.state.errorId
    };

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Arweave Uploader Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Error Details:', errorDetails);
      console.groupEnd();
    }

    // In production, you might want to send this to an error reporting service
    // Example: Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'production') {
      this.reportErrorToService(errorDetails);
    }
  };

  reportErrorToService = (errorDetails: any) => {
    // Example error reporting - replace with your preferred service
    try {
      // Sentry example:
      // Sentry.captureException(error, { extra: errorDetails });
      
      // Custom API example:
      // fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorDetails)
      // });
      
      console.warn('Error reporting not configured');
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  resetErrorBoundary = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: ''
    });
  };

  handleRetry = () => {
    this.resetErrorBoundary();
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <ErrorFallbackComponent
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          errorId={this.state.errorId}
          onRetry={this.handleRetry}
          onReload={this.handleReload}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Default error fallback component
 */
function ErrorFallbackComponent({
  error,
  errorInfo,
  errorId,
  onRetry,
  onReload
}: {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  onRetry: () => void;
  onReload: () => void;
}) {
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center mb-4">
          <svg className="w-8 h-8 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <h2 className="text-lg font-semibold text-red-900">
            Something went wrong
          </h2>
        </div>

        <p className="text-red-700 mb-4">
          The Arweave uploader encountered an unexpected error. This has been logged for investigation.
        </p>

        <div className="space-y-3 mb-4">
          <button
            onClick={onRetry}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Try Again
          </button>

          <button
            onClick={onReload}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Reload Page
          </button>
        </div>

        <div className="border-t border-red-200 pt-4">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-red-600 hover:text-red-800 underline focus:outline-none"
          >
            {showDetails ? 'Hide' : 'Show'} technical details
          </button>

          {showDetails && (
            <div className="mt-3 p-3 bg-red-100 rounded text-xs">
              <div className="mb-2">
                <strong>Error ID:</strong> {errorId}
              </div>
              {error && (
                <div className="mb-2">
                  <strong>Message:</strong> {error.message}
                </div>
              )}
              {error?.stack && (
                <details className="mt-2">
                  <summary className="cursor-pointer font-medium">Stack Trace</summary>
                  <pre className="mt-1 text-xs overflow-auto max-h-32 whitespace-pre-wrap">
                    {error.stack}
                  </pre>
                </details>
              )}
              {errorInfo?.componentStack && (
                <details className="mt-2">
                  <summary className="cursor-pointer font-medium">Component Stack</summary>
                  <pre className="mt-1 text-xs overflow-auto max-h-32 whitespace-pre-wrap">
                    {errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Hook for using error boundary functionality
 */
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const captureError = React.useCallback((error: Error | ArweaveError) => {
    console.error('Captured error:', error);
    
    // Convert ArweaveError to Error if needed
    const errorToThrow = error instanceof Error ? error : new Error(error.message);
    setError(errorToThrow);
    
    // Throw to trigger error boundary
    throw errorToThrow;
  }, []);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return {
    captureError,
    resetError,
    hasError: !!error
  };
}

/**
 * Higher-order component for wrapping components with error boundary
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ArweaveErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ArweaveErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

/**
 * Automatic retry mechanism for network-related errors
 */
export class AutoRetryManager {
  private retryAttempts: Map<string, number> = new Map();
  private retryTimeouts: Map<string, NodeJS.Timeout> = new Map();

  constructor(
    private maxRetries: number = 3,
    private baseDelay: number = 1000,
    private maxDelay: number = 30000
  ) {}

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    operationId: string,
    shouldRetry: (error: any) => boolean = () => true
  ): Promise<T> {
    const attempts = this.retryAttempts.get(operationId) || 0;

    try {
      const result = await operation();
      
      // Success - reset retry count
      this.retryAttempts.delete(operationId);
      this.clearRetryTimeout(operationId);
      
      return result;
    } catch (error) {
      console.error(`Operation ${operationId} failed (attempt ${attempts + 1}):`, error);

      // Check if we should retry
      if (attempts >= this.maxRetries || !shouldRetry(error)) {
        this.retryAttempts.delete(operationId);
        this.clearRetryTimeout(operationId);
        throw error;
      }

      // Calculate delay with exponential backoff
      const delay = Math.min(
        this.baseDelay * Math.pow(2, attempts),
        this.maxDelay
      );

      // Update retry count
      this.retryAttempts.set(operationId, attempts + 1);

      // Wait and retry
      await this.delay(delay);
      return this.executeWithRetry(operation, operationId, shouldRetry);
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private clearRetryTimeout(operationId: string) {
    const timeout = this.retryTimeouts.get(operationId);
    if (timeout) {
      clearTimeout(timeout);
      this.retryTimeouts.delete(operationId);
    }
  }

  reset(operationId?: string) {
    if (operationId) {
      this.retryAttempts.delete(operationId);
      this.clearRetryTimeout(operationId);
    } else {
      this.retryAttempts.clear();
      this.retryTimeouts.forEach(timeout => clearTimeout(timeout));
      this.retryTimeouts.clear();
    }
  }

  getRetryCount(operationId: string): number {
    return this.retryAttempts.get(operationId) || 0;
  }
}

/**
 * Global retry manager instance
 */
export const globalRetryManager = new AutoRetryManager();

/**
 * Error recovery utilities
 */
export const ErrorRecoveryUtils = {
  /**
   * Check if error is recoverable
   */
  isRecoverable(error: any): boolean {
    if (!error) return false;
    
    const message = error.message?.toLowerCase() || '';
    const type = error.type;
    
    // Network errors are usually recoverable
    if (type === 'network' || message.includes('network') || message.includes('timeout')) {
      return true;
    }
    
    // Temporary server errors
    if (message.includes('502') || message.includes('503') || message.includes('504')) {
      return true;
    }
    
    // Rate limiting
    if (message.includes('rate limit') || message.includes('429')) {
      return true;
    }
    
    return false;
  },

  /**
   * Get recovery suggestion for error
   */
  getRecoverySuggestion(error: any): string {
    if (!error) return 'Please try again';
    
    const message = error.message?.toLowerCase() || '';
    const type = error.type;
    
    if (type === 'network' || message.includes('network')) {
      return 'Check your internet connection and try again';
    }
    
    if (type === 'balance' || message.includes('balance')) {
      return 'Add more AR tokens to your wallet';
    }
    
    if (type === 'validation' || message.includes('invalid')) {
      return 'Check your wallet key and file format';
    }
    
    if (message.includes('rate limit')) {
      return 'Please wait a moment before trying again';
    }
    
    if (message.includes('file') && message.includes('large')) {
      return 'Try uploading a smaller file';
    }
    
    return 'Please try again or contact support if the problem persists';
  },

  /**
   * Create user-friendly error message
   */
  createUserFriendlyMessage(error: any): string {
    if (!error) return 'An unknown error occurred';
    
    const message = error.message?.toLowerCase() || '';
    
    if (message.includes('network') || message.includes('timeout')) {
      return 'Connection problem. Please check your internet and try again.';
    }
    
    if (message.includes('balance') || message.includes('insufficient')) {
      return 'Not enough AR tokens in your wallet for this upload.';
    }
    
    if (message.includes('invalid') && message.includes('wallet')) {
      return 'The wallet key file appears to be invalid or corrupted.';
    }
    
    if (message.includes('file') && message.includes('large')) {
      return 'The file is too large for upload. Please try a smaller file.';
    }
    
    if (message.includes('cancelled')) {
      return 'Upload was cancelled.';
    }
    
    return error.message || 'An unexpected error occurred';
  }
};