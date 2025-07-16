import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ArweaveErrorBoundary, useErrorHandler, AutoRetryManager, ErrorRecoveryUtils } from '../ErrorBoundary';

// Mock console methods to avoid noise in tests
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeAll(() => {
  console.error = jest.fn();
  console.warn = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Test component that throws an error
const ThrowError = ({ shouldThrow = false }: { shouldThrow?: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return <div>No error</div>;
};

describe('ArweaveErrorBoundary', () => {
  it('should render children when there is no error', () => {
    render(
      <ArweaveErrorBoundary>
        <div>Test content</div>
      </ArweaveErrorBoundary>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should render error UI when child component throws', () => {
    render(
      <ArweaveErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ArweaveErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText(/The Arweave uploader encountered an unexpected error/)).toBeInTheDocument();
  });

  it('should call onError callback when error occurs', () => {
    const onError = jest.fn();
    
    render(
      <ArweaveErrorBoundary onError={onError}>
        <ThrowError shouldThrow={true} />
      </ArweaveErrorBoundary>
    );

    expect(onError).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String)
      })
    );
  });

  it('should render custom fallback when provided', () => {
    const customFallback = <div>Custom error message</div>;
    
    render(
      <ArweaveErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ArweaveErrorBoundary>
    );

    expect(screen.getByText('Custom error message')).toBeInTheDocument();
  });

  it('should reset error boundary when retry is clicked', () => {
    const { rerender } = render(
      <ArweaveErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ArweaveErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Try Again'));

    rerender(
      <ArweaveErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ArweaveErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });

  it('should show technical details when requested', () => {
    render(
      <ArweaveErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ArweaveErrorBoundary>
    );

    fireEvent.click(screen.getByText('Show technical details'));

    expect(screen.getByText(/Error ID:/)).toBeInTheDocument();
    expect(screen.getByText(/Message:/)).toBeInTheDocument();
  });

  it('should reset on props change when configured', () => {
    let shouldThrow = true;
    const { rerender } = render(
      <ArweaveErrorBoundary resetOnPropsChange={true} resetKeys={[shouldThrow]}>
        <ThrowError shouldThrow={shouldThrow} />
      </ArweaveErrorBoundary>
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    shouldThrow = false;
    rerender(
      <ArweaveErrorBoundary resetOnPropsChange={true} resetKeys={[shouldThrow]}>
        <ThrowError shouldThrow={shouldThrow} />
      </ArweaveErrorBoundary>
    );

    expect(screen.getByText('No error')).toBeInTheDocument();
  });
});

describe('useErrorHandler', () => {
  const TestComponent = () => {
    const { captureError, resetError, hasError } = useErrorHandler();

    return (
      <div>
        <div>Has error: {hasError.toString()}</div>
        <button onClick={() => captureError(new Error('Test error'))}>
          Throw Error
        </button>
        <button onClick={resetError}>Reset</button>
      </div>
    );
  };

  it('should handle errors correctly', () => {
    render(
      <ArweaveErrorBoundary>
        <TestComponent />
      </ArweaveErrorBoundary>
    );

    expect(screen.getByText('Has error: false')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Throw Error'));

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });
});

describe('AutoRetryManager', () => {
  let retryManager: AutoRetryManager;

  beforeEach(() => {
    retryManager = new AutoRetryManager(3, 100, 1000);
  });

  it('should execute operation successfully on first try', async () => {
    const operation = jest.fn().mockResolvedValue('success');
    
    const result = await retryManager.executeWithRetry(operation, 'test-op');
    
    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure and eventually succeed', async () => {
    const operation = jest.fn()
      .mockRejectedValueOnce(new Error('First failure'))
      .mockRejectedValueOnce(new Error('Second failure'))
      .mockResolvedValueOnce('success');
    
    const result = await retryManager.executeWithRetry(
      operation, 
      'test-op',
      () => true // Always retry
    );
    
    expect(result).toBe('success');
    expect(operation).toHaveBeenCalledTimes(3);
  });

  it('should stop retrying when shouldRetry returns false', async () => {
    const operation = jest.fn().mockRejectedValue(new Error('Non-retryable error'));
    
    await expect(
      retryManager.executeWithRetry(
        operation,
        'test-op',
        () => false // Never retry
      )
    ).rejects.toThrow('Non-retryable error');
    
    expect(operation).toHaveBeenCalledTimes(1);
  });

  it('should stop retrying after max attempts', async () => {
    const operation = jest.fn().mockRejectedValue(new Error('Persistent error'));
    
    await expect(
      retryManager.executeWithRetry(operation, 'test-op')
    ).rejects.toThrow('Persistent error');
    
    expect(operation).toHaveBeenCalledTimes(4); // Initial + 3 retries
  });

  it('should track retry counts correctly', async () => {
    const operation = jest.fn()
      .mockRejectedValueOnce(new Error('First failure'))
      .mockResolvedValueOnce('success');
    
    await retryManager.executeWithRetry(operation, 'test-op');
    
    expect(retryManager.getRetryCount('test-op')).toBe(0); // Reset after success
  });

  it('should reset retry counts', () => {
    retryManager['retryAttempts'].set('test-op', 2);
    
    retryManager.reset('test-op');
    
    expect(retryManager.getRetryCount('test-op')).toBe(0);
  });
});

describe('ErrorRecoveryUtils', () => {
  describe('isRecoverable', () => {
    it('should identify recoverable network errors', () => {
      const networkError = { type: 'network', message: 'Network timeout' };
      expect(ErrorRecoveryUtils.isRecoverable(networkError)).toBe(true);
    });

    it('should identify recoverable server errors', () => {
      const serverError = { message: '502 Bad Gateway' };
      expect(ErrorRecoveryUtils.isRecoverable(serverError)).toBe(true);
    });

    it('should identify non-recoverable validation errors', () => {
      const validationError = { type: 'validation', message: 'Invalid wallet key' };
      expect(ErrorRecoveryUtils.isRecoverable(validationError)).toBe(false);
    });

    it('should handle null/undefined errors', () => {
      expect(ErrorRecoveryUtils.isRecoverable(null)).toBe(false);
      expect(ErrorRecoveryUtils.isRecoverable(undefined)).toBe(false);
    });
  });

  describe('getRecoverySuggestion', () => {
    it('should provide network error suggestions', () => {
      const networkError = { type: 'network' };
      const suggestion = ErrorRecoveryUtils.getRecoverySuggestion(networkError);
      expect(suggestion).toContain('internet connection');
    });

    it('should provide balance error suggestions', () => {
      const balanceError = { type: 'balance' };
      const suggestion = ErrorRecoveryUtils.getRecoverySuggestion(balanceError);
      expect(suggestion).toContain('AR tokens');
    });

    it('should provide validation error suggestions', () => {
      const validationError = { type: 'validation' };
      const suggestion = ErrorRecoveryUtils.getRecoverySuggestion(validationError);
      expect(suggestion).toContain('wallet key');
    });

    it('should provide rate limit suggestions', () => {
      const rateLimitError = { message: 'Rate limit exceeded' };
      const suggestion = ErrorRecoveryUtils.getRecoverySuggestion(rateLimitError);
      expect(suggestion).toContain('wait a moment');
    });
  });

  describe('createUserFriendlyMessage', () => {
    it('should create friendly network error messages', () => {
      const networkError = { message: 'Network timeout occurred' };
      const message = ErrorRecoveryUtils.createUserFriendlyMessage(networkError);
      expect(message).toContain('Connection problem');
    });

    it('should create friendly balance error messages', () => {
      const balanceError = { message: 'Insufficient balance for transaction' };
      const message = ErrorRecoveryUtils.createUserFriendlyMessage(balanceError);
      expect(message).toContain('Not enough AR tokens');
    });

    it('should create friendly validation error messages', () => {
      const validationError = { message: 'Invalid wallet key format' };
      const message = ErrorRecoveryUtils.createUserFriendlyMessage(validationError);
      expect(message).toContain('wallet key file appears to be invalid');
    });

    it('should handle unknown errors', () => {
      const unknownError = { message: 'Something weird happened' };
      const message = ErrorRecoveryUtils.createUserFriendlyMessage(unknownError);
      expect(message).toBe('Something weird happened');
    });

    it('should handle null/undefined errors', () => {
      expect(ErrorRecoveryUtils.createUserFriendlyMessage(null)).toBe('An unknown error occurred');
      expect(ErrorRecoveryUtils.createUserFriendlyMessage(undefined)).toBe('An unknown error occurred');
    });
  });
});