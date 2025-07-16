import { CostEstimationService } from '../CostEstimationService';
import { ArweaveWalletService } from '../ArweaveWalletService';
import { ArweaveWalletKey } from '../../types/ArweaveTypes';

// Mock Arweave
jest.mock('arweave', () => ({
  init: jest.fn(() => ({
    createTransaction: jest.fn(),
    ar: {
      winstonToAr: jest.fn()
    }
  }))
}));

// Mock ArweaveWalletService
jest.mock('../ArweaveWalletService');

// Mock fetch for price API
global.fetch = jest.fn();

describe('CostEstimationService', () => {
  const mockWallet: ArweaveWalletKey = {
    kty: 'RSA',
    n: 'test-n-value',
    e: 'AQAB',
    d: 'test-d-value',
    p: 'test-p-value',
    q: 'test-q-value',
    dp: 'test-dp-value',
    dq: 'test-dq-value',
    qi: 'test-qi-value'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (fetch as jest.Mock).mockClear();
  });

  describe('estimateUploadCost', () => {
    it('should estimate cost for a small file', async () => {
      const mockArweave = require('arweave').init();
      mockArweave.createTransaction.mockResolvedValue({
        reward: '1000000000' // 0.001 AR in winston
      });
      mockArweave.ar.winstonToAr.mockReturnValue('0.001100000000'); // With buffer

      const fileSize = 1024 * 1024; // 1MB
      const result = await CostEstimationService.estimateUploadCost(fileSize);

      expect(result.estimatedCost).toBeCloseTo(0.0011);
      expect(result.currency).toBe('AR');
      expect(result.confidence).toBe('high');
      expect(result.formattedCost).toContain('AR');
      expect(result.lastUpdated).toBeInstanceOf(Date);
    });

    it('should handle network errors with fallback estimation', async () => {
      const mockArweave = require('arweave').init();
      mockArweave.createTransaction.mockRejectedValue(new Error('Network error'));

      const fileSize = 10 * 1024 * 1024; // 10MB
      const result = await CostEstimationService.estimateUploadCost(fileSize);

      expect(result.confidence).toBe('low');
      expect(result.estimatedCost).toBeGreaterThan(0);
      expect(result.currency).toBe('AR');
    });

    it('should provide different confidence levels based on file size', async () => {
      const mockArweave = require('arweave').init();
      mockArweave.createTransaction.mockResolvedValue({ reward: '1000000000' });
      mockArweave.ar.winstonToAr.mockReturnValue('0.001100000000');

      // Small file - high confidence
      const smallResult = await CostEstimationService.estimateUploadCost(5 * 1024 * 1024);
      expect(smallResult.confidence).toBe('high');

      // Medium file - medium confidence
      const mediumResult = await CostEstimationService.estimateUploadCost(50 * 1024 * 1024);
      expect(mediumResult.confidence).toBe('medium');

      // Large file - low confidence
      const largeResult = await CostEstimationService.estimateUploadCost(200 * 1024 * 1024);
      expect(largeResult.confidence).toBe('low');
    });
  });

  describe('checkSufficientBalance', () => {
    it('should return sufficient balance when wallet has enough AR', async () => {
      (ArweaveWalletService.checkBalance as jest.Mock).mockResolvedValue(5.0);

      const result = await CostEstimationService.checkSufficientBalance(mockWallet, 2.0);

      expect(result.sufficient).toBe(true);
      expect(result.balance).toBe(5.0);
      expect(result.shortfall).toBeUndefined();
      expect(result.recommendation).toBeUndefined();
    });

    it('should return insufficient balance with shortfall and recommendation', async () => {
      (ArweaveWalletService.checkBalance as jest.Mock).mockResolvedValue(1.0);

      const result = await CostEstimationService.checkSufficientBalance(mockWallet, 3.0);

      expect(result.sufficient).toBe(false);
      expect(result.balance).toBe(1.0);
      expect(result.shortfall).toBe(2.0);
      expect(result.recommendation).toContain('more AR');
    });

    it('should handle balance check errors', async () => {
      (ArweaveWalletService.checkBalance as jest.Mock).mockRejectedValue(new Error('Network error'));

      await expect(CostEstimationService.checkSufficientBalance(mockWallet, 1.0))
        .rejects
        .toMatchObject({
          type: 'network',
          message: 'Unable to check wallet balance'
        });
    });
  });

  describe('formatCost', () => {
    it('should format zero cost', () => {
      expect(CostEstimationService.formatCost(0)).toBe('0 AR');
    });

    it('should format very small costs with scientific notation', () => {
      expect(CostEstimationService.formatCost(0.0000001)).toBe('1.00e-7 AR');
    });

    it('should format small costs with 6 decimals', () => {
      expect(CostEstimationService.formatCost(0.000123)).toBe('0.000123 AR');
    });

    it('should format medium costs with 4 decimals', () => {
      expect(CostEstimationService.formatCost(0.1234)).toBe('0.1234 AR');
    });

    it('should format large costs with 3 decimals', () => {
      expect(CostEstimationService.formatCost(12.3456)).toBe('12.346 AR');
    });
  });

  describe('getCostWithUSDEstimate', () => {
    it('should include USD estimate when price API is available', async () => {
      const mockArweave = require('arweave').init();
      mockArweave.createTransaction.mockResolvedValue({ reward: '1000000000' });
      mockArweave.ar.winstonToAr.mockReturnValue('0.001100000000');

      (fetch as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve({
          arweave: { usd: 15.50 }
        })
      });

      const result = await CostEstimationService.getCostWithUSDEstimate(1024 * 1024);

      expect(result.usdEstimate).toContain('$');
      expect(result.usdEstimate).toContain('USD');
      expect(result.currency).toBe('AR');
    });

    it('should work without USD estimate when price API fails', async () => {
      const mockArweave = require('arweave').init();
      mockArweave.createTransaction.mockResolvedValue({ reward: '1000000000' });
      mockArweave.ar.winstonToAr.mockReturnValue('0.001100000000');

      (fetch as jest.Mock).mockRejectedValue(new Error('Price API error'));

      const result = await CostEstimationService.getCostWithUSDEstimate(1024 * 1024);

      expect(result.usdEstimate).toBeUndefined();
      expect(result.currency).toBe('AR');
      expect(result.estimatedCost).toBeGreaterThan(0);
    });
  });

  describe('validateCostEstimate', () => {
    it('should validate reasonable cost estimates', () => {
      const fileSize = 100 * 1024 * 1024; // 100MB
      const reasonableCost = 0.1; // Reasonable cost for 100MB

      const result = CostEstimationService.validateCostEstimate(fileSize, reasonableCost);

      expect(result.isReasonable).toBe(true);
      expect(result.warning).toBeUndefined();
    });

    it('should flag unusually low costs', () => {
      const fileSize = 1024 * 1024 * 1024; // 1GB
      const lowCost = 0.001; // Unusually low for 1GB

      const result = CostEstimationService.validateCostEstimate(fileSize, lowCost);

      expect(result.isReasonable).toBe(false);
      expect(result.warning).toContain('unusually low');
    });

    it('should flag unusually high costs', () => {
      const fileSize = 1024 * 1024; // 1MB
      const highCost = 10; // Unusually high for 1MB

      const result = CostEstimationService.validateCostEstimate(fileSize, highCost);

      expect(result.isReasonable).toBe(false);
      expect(result.warning).toContain('unusually high');
    });
  });

  describe('caching behavior', () => {
    it('should cache fee estimates to reduce API calls', async () => {
      const mockArweave = require('arweave').init();
      mockArweave.createTransaction.mockResolvedValue({ reward: '1000000000' });
      mockArweave.ar.winstonToAr.mockReturnValue('0.001100000000');

      const fileSize = 1024 * 1024; // 1MB

      // First call
      await CostEstimationService.estimateUploadCost(fileSize);
      expect(mockArweave.createTransaction).toHaveBeenCalledTimes(1);

      // Second call with same size should use cache
      await CostEstimationService.estimateUploadCost(fileSize);
      expect(mockArweave.createTransaction).toHaveBeenCalledTimes(1); // Still 1, not 2
    });

    it('should cache AR price to reduce API calls', async () => {
      const mockArweave = require('arweave').init();
      mockArweave.createTransaction.mockResolvedValue({ reward: '1000000000' });
      mockArweave.ar.winstonToAr.mockReturnValue('0.001100000000');

      (fetch as jest.Mock).mockResolvedValue({
        json: () => Promise.resolve({
          arweave: { usd: 15.50 }
        })
      });

      // First call
      await CostEstimationService.getCostWithUSDEstimate(1024 * 1024);
      expect(fetch).toHaveBeenCalledTimes(1);

      // Second call should use cached price
      await CostEstimationService.getCostWithUSDEstimate(2 * 1024 * 1024);
      expect(fetch).toHaveBeenCalledTimes(1); // Still 1, not 2
    });
  });
});