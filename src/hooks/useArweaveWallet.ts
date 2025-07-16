import { useState, useCallback, useEffect } from 'react';
import { 
  ArweaveWalletKey, 
  WalletInfo, 
  WalletError, 
  WalletValidationResult,
  UseArweaveWalletReturn 
} from '../types/ArweaveTypes';
import { ArweaveWalletService } from '../services/ArweaveWalletService';

/**
 * Custom hook for managing Arweave wallet operations
 */
export function useArweaveWallet(): UseArweaveWalletReturn {
  const [walletKey, setWalletKey] = useState<ArweaveWalletKey | null>(null);
  const [walletInfo, setWalletInfo] = useState<WalletInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<WalletError | null>(null);

  /**
   * Loads and validates a wallet key from a file
   */
  const loadWallet = useCallback(async (file: File): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Validate the wallet key file
      const validationResult = await ArweaveWalletService.validateWalletKey(file);
      
      if (!validationResult.isValid) {
        throw createWalletError(
          'validation',
          validationResult.error || 'Invalid wallet key file',
          'Please select a valid Arweave wallet key file (.json format)',
          true
        );
      }

      // Parse the wallet key from the file
      const fileContent = await readFileAsText(file);
      const parsedWallet: ArweaveWalletKey = JSON.parse(fileContent);
      
      // Get wallet information
      const info = await ArweaveWalletService.getWalletInfo(parsedWallet);
      
      setWalletKey(parsedWallet);
      setWalletInfo(info);
      
    } catch (err) {
      console.error('Wallet loading error:', err);
      
      if (isWalletError(err)) {
        setError(err);
      } else {
        setError(createWalletError(
          'validation',
          'Failed to load wallet key',
          'Please check the file and try again',
          true
        ));
      }
      
      // Clear any partial state
      setWalletKey(null);
      setWalletInfo(null);
      
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Validates a wallet key object
   */
  const validateWallet = useCallback(async (wallet: ArweaveWalletKey): Promise<WalletValidationResult> => {
    try {
      return await ArweaveWalletService.quickValidate(wallet);
    } catch (err) {
      console.error('Wallet validation error:', err);
      return {
        isValid: false,
        address: undefined
      };
    }
  }, []);

  /**
   * Clears the current wallet and associated data
   */
  const clearWallet = useCallback(() => {
    setWalletKey(null);
    setWalletInfo(null);
    setError(null);
  }, []);

  /**
   * Refreshes wallet information (balance, etc.)
   */
  const refreshWalletInfo = useCallback(async (): Promise<void> => {
    if (!walletKey) {
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const info = await ArweaveWalletService.getWalletInfo(walletKey);
      setWalletInfo(info);
    } catch (err) {
      console.error('Wallet refresh error:', err);
      
      if (isWalletError(err)) {
        setError(err);
      } else {
        setError(createWalletError(
          'network',
          'Failed to refresh wallet information',
          'Please check your internet connection and try again',
          true
        ));
      }
    } finally {
      setIsLoading(false);
    }
  }, [walletKey]);

  /**
   * Checks if wallet has sufficient balance for a transaction
   */
  const checkSufficientBalance = useCallback(async (requiredAmount: number): Promise<{
    sufficient: boolean;
    balance: number;
    shortfall?: number;
  }> => {
    if (!walletKey) {
      throw createWalletError(
        'validation',
        'No wallet loaded',
        'Please load a wallet key first',
        true
      );
    }

    try {
      return await ArweaveWalletService.validateSufficientBalance(walletKey, requiredAmount);
    } catch (err) {
      console.error('Balance check error:', err);
      throw err;
    }
  }, [walletKey]);

  // Auto-refresh wallet info periodically when wallet is loaded
  useEffect(() => {
    if (!walletKey || isLoading) {
      return;
    }

    const refreshInterval = setInterval(() => {
      refreshWalletInfo();
    }, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(refreshInterval);
  }, [walletKey, isLoading, refreshWalletInfo]);

  return {
    walletKey,
    walletInfo,
    isLoading,
    error,
    loadWallet,
    clearWallet,
    validateWallet,
    refreshWalletInfo,
    checkSufficientBalance
  };
}

/**
 * Hook for wallet operations without automatic state management
 */
export function useArweaveWalletOperations() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<WalletError | null>(null);

  const validateWalletFile = useCallback(async (file: File): Promise<WalletValidationResult> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await ArweaveWalletService.validateWalletKey(file);
      return result;
    } catch (err) {
      console.error('Wallet file validation error:', err);
      
      const errorResult: WalletValidationResult = {
        isValid: false,
        error: 'Failed to validate wallet file'
      };
      
      if (isWalletError(err)) {
        setError(err);
        errorResult.error = err.message;
      } else {
        setError(createWalletError(
          'validation',
          'Wallet validation failed',
          'Please check the file and try again',
          true
        ));
      }
      
      return errorResult;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getWalletInfo = useCallback(async (wallet: ArweaveWalletKey): Promise<WalletInfo | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const info = await ArweaveWalletService.getWalletInfo(wallet);
      return info;
    } catch (err) {
      console.error('Get wallet info error:', err);
      
      if (isWalletError(err)) {
        setError(err);
      } else {
        setError(createWalletError(
          'network',
          'Failed to get wallet information',
          'Please check your internet connection and try again',
          true
        ));
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkBalance = useCallback(async (wallet: ArweaveWalletKey): Promise<number | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const balance = await ArweaveWalletService.checkBalance(wallet);
      return balance;
    } catch (err) {
      console.error('Check balance error:', err);
      
      if (isWalletError(err)) {
        setError(err);
      } else {
        setError(createWalletError(
          'network',
          'Failed to check wallet balance',
          'Please check your internet connection and try again',
          true
        ));
      }
      
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    validateWalletFile,
    getWalletInfo,
    checkBalance,
    isLoading,
    error,
    clearError: () => setError(null)
  };
}

// Helper functions

/**
 * Reads a file as text content
 */
function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as string);
      } else {
        reject(new Error('Failed to read file content'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Creates a standardized wallet error
 */
function createWalletError(
  type: WalletError['type'],
  message: string,
  suggestedAction: string,
  recoverable: boolean
): WalletError {
  return {
    type,
    message,
    suggestedAction,
    recoverable
  };
}

/**
 * Type guard to check if an error is a WalletError
 */
function isWalletError(error: any): error is WalletError {
  return error && 
         typeof error === 'object' && 
         'type' in error && 
         'message' in error && 
         'recoverable' in error;
}