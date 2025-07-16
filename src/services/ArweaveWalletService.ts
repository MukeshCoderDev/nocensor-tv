import Arweave from 'arweave';
import { 
  ArweaveWalletKey, 
  WalletValidationResult, 
  WalletInfo, 
  WalletError 
} from '../types/ArweaveTypes';
import { 
  isValidArweaveWalletKey, 
  validateWalletKeyFile, 
  formatWalletAddress 
} from '../utils/typeValidation';

/**
 * Service class for Arweave wallet operations and validation
 */
export class ArweaveWalletService {
  private static arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https'
  });

  /**
   * Validates an Arweave wallet key file and returns validation result
   */
  static async validateWalletKey(keyFile: File): Promise<WalletValidationResult> {
    try {
      // First validate the file format
      const fileValidation = validateWalletKeyFile(keyFile);
      if (!fileValidation.isValid) {
        return {
          isValid: false,
          error: fileValidation.error
        };
      }

      // Read and parse the file content
      const fileContent = await this.readFileAsText(keyFile);
      let walletKey: ArweaveWalletKey;

      try {
        walletKey = JSON.parse(fileContent);
      } catch (parseError) {
        return {
          isValid: false,
          error: 'Invalid JSON format in wallet key file'
        };
      }

      // Validate the wallet key structure
      if (!isValidArweaveWalletKey(walletKey)) {
        return {
          isValid: false,
          error: 'Invalid Arweave wallet key format. Please ensure you have selected a valid Arweave wallet key file.'
        };
      }

      // Generate wallet address to verify the key works
      try {
        const address = await this.arweave.wallets.jwkToAddress(walletKey);
        
        return {
          isValid: true,
          walletAddress: address
        };
      } catch (addressError) {
        return {
          isValid: false,
          error: 'Unable to generate wallet address from the provided key. The wallet key may be corrupted.'
        };
      }

    } catch (error) {
      console.error('Wallet validation error:', error);
      return {
        isValid: false,
        error: 'An unexpected error occurred while validating the wallet key'
      };
    }
  }

  /**
   * Gets comprehensive wallet information including balance
   */
  static async getWalletInfo(wallet: ArweaveWalletKey): Promise<WalletInfo> {
    try {
      const address = await this.arweave.wallets.jwkToAddress(wallet);
      const balance = await this.checkBalance(wallet);

      return {
        address,
        formattedAddress: formatWalletAddress(address),
        balance,
        formattedBalance: this.formatBalance(balance)
      };
    } catch (error) {
      console.error('Error getting wallet info:', error);
      throw this.createWalletError(
        'network',
        'Unable to retrieve wallet information',
        'Please check your internet connection and try again',
        true
      );
    }
  }

  /**
   * Checks the AR balance of a wallet
   */
  static async checkBalance(wallet: ArweaveWalletKey): Promise<number> {
    try {
      const address = await this.arweave.wallets.jwkToAddress(wallet);
      const winstonBalance = await this.arweave.wallets.getBalance(address);
      
      // Convert from winston to AR (1 AR = 1e12 winston)
      return parseFloat(this.arweave.ar.winstonToAr(winstonBalance));
    } catch (error) {
      console.error('Error checking balance:', error);
      throw this.createWalletError(
        'network',
        'Unable to check wallet balance',
        'Please check your internet connection and try again',
        true
      );
    }
  }

  /**
   * Formats wallet address for display
   */
  static formatWalletAddress(address: string): string {
    return formatWalletAddress(address);
  }

  /**
   * Formats AR balance for display
   */
  static formatBalance(balance: number): string {
    if (balance === 0) {
      return '0 AR';
    }
    
    if (balance < 0.001) {
      return `${balance.toFixed(6)} AR`;
    }
    
    if (balance < 1) {
      return `${balance.toFixed(4)} AR`;
    }
    
    return `${balance.toFixed(2)} AR`;
  }

  /**
   * Validates if a wallet has sufficient balance for a transaction
   */
  static async validateSufficientBalance(
    wallet: ArweaveWalletKey, 
    requiredAmount: number
  ): Promise<{ sufficient: boolean; balance: number; shortfall?: number }> {
    try {
      const balance = await this.checkBalance(wallet);
      const sufficient = balance >= requiredAmount;
      
      return {
        sufficient,
        balance,
        shortfall: sufficient ? undefined : requiredAmount - balance
      };
    } catch (error) {
      console.error('Error validating balance:', error);
      throw error;
    }
  }

  /**
   * Gets the owner address from a wallet key
   */
  static async getOwnerAddress(wallet: ArweaveWalletKey): Promise<string> {
    try {
      return await this.arweave.wallets.jwkToAddress(wallet);
    } catch (error) {
      console.error('Error getting owner address:', error);
      throw this.createWalletError(
        'validation',
        'Unable to extract wallet address',
        'The wallet key may be invalid or corrupted',
        false
      );
    }
  }

  /**
   * Validates wallet key and returns basic info quickly
   */
  static async quickValidate(wallet: ArweaveWalletKey): Promise<{ isValid: boolean; address?: string }> {
    try {
      if (!isValidArweaveWalletKey(wallet)) {
        return { isValid: false };
      }

      const address = await this.arweave.wallets.jwkToAddress(wallet);
      return { isValid: true, address };
    } catch (error) {
      return { isValid: false };
    }
  }

  // Private helper methods

  /**
   * Reads a file as text content
   */
  private static readFileAsText(file: File): Promise<string> {
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
  private static createWalletError(
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
}