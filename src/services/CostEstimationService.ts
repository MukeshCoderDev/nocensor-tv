import Arweave from 'arweave';
import { 
  CostEstimate, 
  ArweaveWalletKey, 
  ArweaveError 
} from '../types/ArweaveTypes';
import { ArweaveWalletService } from './ArweaveWalletService';

/**
 * Service class for estimating Arweave upload costs and validating wallet balance
 */
export class CostEstimationService {
  private static arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https'
  });

  // Cache for price data to avoid excessive API calls
  private static priceCache: {
    arPrice?: { value: number; timestamp: number };
    feeCache: Map<number, { fee: number; timestamp: number }>;
  } = {
    feeCache: new Map()
  };

  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private static readonly BYTES_PER_AR = 1024 * 1024 * 1024; // Rough estimate: 1GB per AR
  private static readonly MIN_FEE_MULTIPLIER = 1.1; // 10% buffer for fee fluctuations

  /**
   * Estimates the cost to upload a file to Arweave
   */
  static async estimateUploadCost(fileSize: number): Promise<CostEstimate> {
    try {
      // Get the current network fee for the file size
      const networkFee = await this.getNetworkFee(fileSize);
      
      // Add a small buffer for fee fluctuations
      const estimatedCostWinston = Math.ceil(networkFee * this.MIN_FEE_MULTIPLIER);
      const estimatedCostAR = parseFloat(this.arweave.ar.winstonToAr(estimatedCostWinston.toString()));

      // Determine confidence based on file size and network conditions
      const confidence = this.determineConfidence(fileSize);

      return {
        estimatedCost: estimatedCostAR,
        formattedCost: this.formatCost(estimatedCostAR),
        currency: 'AR',
        confidence,
        lastUpdated: new Date()
      };

    } catch (error) {
      console.error('Cost estimation error:', error);
      
      // Fallback to rough estimation if network call fails
      const fallbackCost = this.getFallbackCostEstimate(fileSize);
      
      return {
        estimatedCost: fallbackCost,
        formattedCost: this.formatCost(fallbackCost),
        currency: 'AR',
        confidence: 'low',
        lastUpdated: new Date()
      };
    }
  }

  /**
   * Checks if a wallet has sufficient balance for the estimated cost
   */
  static async checkSufficientBalance(
    wallet: ArweaveWalletKey, 
    estimatedCost: number
  ): Promise<{ sufficient: boolean; balance: number; shortfall?: number; recommendation?: string }> {
    try {
      const balance = await ArweaveWalletService.checkBalance(wallet);
      const sufficient = balance >= estimatedCost;
      
      const result = {
        sufficient,
        balance,
        shortfall: sufficient ? undefined : estimatedCost - balance,
        recommendation: undefined as string | undefined
      };

      if (!sufficient) {
        result.recommendation = this.getBalanceRecommendation(balance, estimatedCost);
      }

      return result;

    } catch (error) {
      console.error('Balance check error:', error);
      throw this.createCostError(
        'network',
        'Unable to check wallet balance',
        'Please check your internet connection and try again',
        true
      );
    }
  }

  /**
   * Formats cost for display with appropriate precision
   */
  static formatCost(cost: number): string {
    if (cost === 0) {
      return '0 AR';
    }
    
    if (cost < 0.000001) {
      return `${cost.toExponential(2)} AR`;
    }
    
    if (cost < 0.001) {
      return `${cost.toFixed(6)} AR`;
    }
    
    if (cost < 1) {
      return `${cost.toFixed(4)} AR`;
    }
    
    return `${cost.toFixed(3)} AR`;
  }

  /**
   * Gets cost estimate with USD conversion if available
   */
  static async getCostWithUSDEstimate(fileSize: number): Promise<CostEstimate & { usdEstimate?: string }> {
    const arCost = await this.estimateUploadCost(fileSize);
    
    try {
      const arPrice = await this.getARPriceInUSD();
      const usdCost = arCost.estimatedCost * arPrice;
      
      return {
        ...arCost,
        usdEstimate: `~$${usdCost.toFixed(2)} USD`
      };
    } catch (error) {
      // Return without USD estimate if price fetch fails
      return arCost;
    }
  }

  /**
   * Validates if the estimated cost is reasonable for the file size
   */
  static validateCostEstimate(fileSize: number, estimatedCost: number): {
    isReasonable: boolean;
    warning?: string;
  } {
    const minExpectedCost = (fileSize / this.BYTES_PER_AR) * 0.5; // Very conservative minimum
    const maxExpectedCost = (fileSize / this.BYTES_PER_AR) * 5; // Liberal maximum

    if (estimatedCost < minExpectedCost) {
      return {
        isReasonable: false,
        warning: 'Estimated cost seems unusually low. Network fees may have changed.'
      };
    }

    if (estimatedCost > maxExpectedCost) {
      return {
        isReasonable: false,
        warning: 'Estimated cost seems unusually high. Consider checking network conditions.'
      };
    }

    return { isReasonable: true };
  }

  // Private helper methods

  /**
   * Gets the current network fee for a given data size
   */
  private static async getNetworkFee(dataSize: number): Promise<number> {
    const cacheKey = Math.floor(dataSize / (1024 * 1024)); // Cache by MB
    const cached = this.priceCache.feeCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.fee;
    }

    try {
      // Create a dummy transaction to get fee estimate
      const dummyData = new Uint8Array(Math.min(dataSize, 1024)); // Use small sample for fee calculation
      const transaction = await this.arweave.createTransaction({ data: dummyData });
      const fee = parseInt(transaction.reward);
      
      // Scale fee based on actual data size vs dummy data size
      const scaledFee = Math.ceil((fee * dataSize) / dummyData.length);
      
      // Cache the result
      this.priceCache.feeCache.set(cacheKey, {
        fee: scaledFee,
        timestamp: Date.now()
      });
      
      return scaledFee;
    } catch (error) {
      console.error('Network fee estimation failed:', error);
      throw error;
    }
  }

  /**
   * Gets AR price in USD from a price API
   */
  private static async getARPriceInUSD(): Promise<number> {
    const cached = this.priceCache.arPrice;
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.value;
    }

    try {
      // Try CoinGecko API first
      const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=arweave&vs_currencies=usd');
      const data = await response.json();
      
      if (data.arweave?.usd) {
        const price = data.arweave.usd;
        this.priceCache.arPrice = {
          value: price,
          timestamp: Date.now()
        };
        return price;
      }
      
      throw new Error('Invalid price data');
    } catch (error) {
      console.error('Failed to fetch AR price:', error);
      // Fallback to a reasonable estimate if API fails
      return 10; // Rough fallback price
    }
  }

  /**
   * Provides a fallback cost estimate when network calls fail
   */
  private static getFallbackCostEstimate(fileSize: number): number {
    // Very rough estimation: assume 1GB costs about 0.5-2 AR
    const gbSize = fileSize / (1024 * 1024 * 1024);
    return Math.max(0.001, gbSize * 1.5); // Conservative estimate
  }

  /**
   * Determines confidence level based on file size and conditions
   */
  private static determineConfidence(fileSize: number): 'high' | 'medium' | 'low' {
    // Smaller files have more predictable costs
    if (fileSize < 10 * 1024 * 1024) { // < 10MB
      return 'high';
    }
    
    if (fileSize < 100 * 1024 * 1024) { // < 100MB
      return 'medium';
    }
    
    return 'low'; // Large files have more variable costs
  }

  /**
   * Provides balance recommendations when insufficient funds
   */
  private static getBalanceRecommendation(currentBalance: number, requiredAmount: number): string {
    const shortfall = requiredAmount - currentBalance;
    const recommendedAmount = shortfall * 1.2; // 20% buffer
    
    if (shortfall < 0.01) {
      return `You need approximately ${this.formatCost(recommendedAmount)} more AR. Consider adding a small amount to your wallet.`;
    }
    
    if (shortfall < 1) {
      return `You need ${this.formatCost(recommendedAmount)} more AR. You can purchase AR from exchanges like Binance, KuCoin, or use the Arweave web wallet.`;
    }
    
    return `You need ${this.formatCost(recommendedAmount)} more AR. Consider purchasing AR from a major exchange or check if you have other wallets with sufficient balance.`;
  }

  /**
   * Creates a standardized cost estimation error
   */
  private static createCostError(
    type: ArweaveError['type'],
    message: string,
    suggestedAction: string,
    recoverable: boolean
  ): ArweaveError {
    return {
      type,
      message,
      suggestedAction,
      recoverable
    };
  }
}