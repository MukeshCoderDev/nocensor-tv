import { ArweaveWalletService } from '../ArweaveWalletService';
import { ArweaveWalletKey } from '../../types/ArweaveTypes';

// Mock Arweave
jest.mock('arweave', () => ({
  init: jest.fn(() => ({
    wallets: {
      jwkToAddress: jest.fn(),
      getBalance: jest.fn()
    },
    ar: {
      winstonToAr: jest.fn()
    }
  }))
}));

describe('ArweaveWalletService', () => {
  const mockValidWallet: ArweaveWalletKey = {
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

  const mockAddress = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNO_-';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateWalletKey', () => {
    it('should validate a correct wallet key file', async () => {
      const mockFile = new File([JSON.stringify(mockValidWallet)], 'wallet.json', {
        type: 'application/json'
      });

      // Mock Arweave methods
      const mockArweave = require('arweave').init();
      mockArweave.wallets.jwkToAddress.mockResolvedValue(mockAddress);

      const result = await ArweaveWalletService.validateWalletKey(mockFile);

      expect(result.isValid).toBe(true);
      expect(result.walletAddress).toBe(mockAddress);
      expect(result.error).toBeUndefined();
    });

    it('should reject non-JSON files', async () => {
      const mockFile = new File(['not json'], 'wallet.txt', {
        type: 'text/plain'
      });

      const result = await ArweaveWalletService.validateWalletKey(mockFile);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must be a JSON file');
    });

    it('should reject files with invalid JSON', async () => {
      const mockFile = new File(['{ invalid json }'], 'wallet.json', {
        type: 'application/json'
      });

      const result = await ArweaveWalletService.validateWalletKey(mockFile);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid JSON format');
    });

    it('should reject invalid wallet key structure', async () => {
      const invalidWallet = { kty: 'RSA', n: 'test' }; // Missing required fields
      const mockFile = new File([JSON.stringify(invalidWallet)], 'wallet.json', {
        type: 'application/json'
      });

      const result = await ArweaveWalletService.validateWalletKey(mockFile);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Invalid Arweave wallet key format');
    });

    it('should handle address generation errors', async () => {
      const mockFile = new File([JSON.stringify(mockValidWallet)], 'wallet.json', {
        type: 'application/json'
      });

      const mockArweave = require('arweave').init();
      mockArweave.wallets.jwkToAddress.mockRejectedValue(new Error('Address generation failed'));

      const result = await ArweaveWalletService.validateWalletKey(mockFile);

      expect(result.isValid).toBe(false);
      expect(result.error).toContain('Unable to generate wallet address');
    });
  });

  describe('getWalletInfo', () => {
    it('should return complete wallet information', async () => {
      const mockArweave = require('arweave').init();
      mockArweave.wallets.jwkToAddress.mockResolvedValue(mockAddress);
      mockArweave.wallets.getBalance.mockResolvedValue('1000000000000'); // 1 AR in winston
      mockArweave.ar.winstonToAr.mockReturnValue('1.000000000000');

      const result = await ArweaveWalletService.getWalletInfo(mockValidWallet);

      expect(result.address).toBe(mockAddress);
      expect(result.formattedAddress).toBe('abcdef...O_-');
      expect(result.balance).toBe(1);
      expect(result.formattedBalance).toBe('1.00 AR');
    });

    it('should handle network errors', async () => {
      const mockArweave = require('arweave').init();
      mockArweave.wallets.jwkToAddress.mockRejectedValue(new Error('Network error'));

      await expect(ArweaveWalletService.getWalletInfo(mockValidWallet))
        .rejects
        .toMatchObject({
          type: 'network',
          message: 'Unable to retrieve wallet information'
        });
    });
  });

  describe('checkBalance', () => {
    it('should return balance in AR', async () => {
      const mockArweave = require('arweave').init();
      mockArweave.wallets.jwkToAddress.mockResolvedValue(mockAddress);
      mockArweave.wallets.getBalance.mockResolvedValue('2500000000000'); // 2.5 AR in winston
      mockArweave.ar.winstonToAr.mockReturnValue('2.500000000000');

      const balance = await ArweaveWalletService.checkBalance(mockValidWallet);

      expect(balance).toBe(2.5);
    });

    it('should handle balance check errors', async () => {
      const mockArweave = require('arweave').init();
      mockArweave.wallets.jwkToAddress.mockRejectedValue(new Error('Balance check failed'));

      await expect(ArweaveWalletService.checkBalance(mockValidWallet))
        .rejects
        .toMatchObject({
          type: 'network',
          message: 'Unable to check wallet balance'
        });
    });
  });

  describe('formatBalance', () => {
    it('should format zero balance', () => {
      expect(ArweaveWalletService.formatBalance(0)).toBe('0 AR');
    });

    it('should format small balances with more decimals', () => {
      expect(ArweaveWalletService.formatBalance(0.000123)).toBe('0.000123 AR');
    });

    it('should format medium balances with 4 decimals', () => {
      expect(ArweaveWalletService.formatBalance(0.1234)).toBe('0.1234 AR');
    });

    it('should format large balances with 2 decimals', () => {
      expect(ArweaveWalletService.formatBalance(12.3456)).toBe('12.35 AR');
    });
  });

  describe('validateSufficientBalance', () => {
    it('should return sufficient balance info when balance is adequate', async () => {
      const mockArweave = require('arweave').init();
      mockArweave.wallets.jwkToAddress.mockResolvedValue(mockAddress);
      mockArweave.wallets.getBalance.mockResolvedValue('5000000000000'); // 5 AR
      mockArweave.ar.winstonToAr.mockReturnValue('5.000000000000');

      const result = await ArweaveWalletService.validateSufficientBalance(mockValidWallet, 3);

      expect(result.sufficient).toBe(true);
      expect(result.balance).toBe(5);
      expect(result.shortfall).toBeUndefined();
    });

    it('should return insufficient balance info when balance is inadequate', async () => {
      const mockArweave = require('arweave').init();
      mockArweave.wallets.jwkToAddress.mockResolvedValue(mockAddress);
      mockArweave.wallets.getBalance.mockResolvedValue('1000000000000'); // 1 AR
      mockArweave.ar.winstonToAr.mockReturnValue('1.000000000000');

      const result = await ArweaveWalletService.validateSufficientBalance(mockValidWallet, 3);

      expect(result.sufficient).toBe(false);
      expect(result.balance).toBe(1);
      expect(result.shortfall).toBe(2);
    });
  });

  describe('getOwnerAddress', () => {
    it('should return wallet address', async () => {
      const mockArweave = require('arweave').init();
      mockArweave.wallets.jwkToAddress.mockResolvedValue(mockAddress);

      const address = await ArweaveWalletService.getOwnerAddress(mockValidWallet);

      expect(address).toBe(mockAddress);
    });

    it('should handle address extraction errors', async () => {
      const mockArweave = require('arweave').init();
      mockArweave.wallets.jwkToAddress.mockRejectedValue(new Error('Address extraction failed'));

      await expect(ArweaveWalletService.getOwnerAddress(mockValidWallet))
        .rejects
        .toMatchObject({
          type: 'validation',
          message: 'Unable to extract wallet address'
        });
    });
  });

  describe('quickValidate', () => {
    it('should quickly validate a correct wallet', async () => {
      const mockArweave = require('arweave').init();
      mockArweave.wallets.jwkToAddress.mockResolvedValue(mockAddress);

      const result = await ArweaveWalletService.quickValidate(mockValidWallet);

      expect(result.isValid).toBe(true);
      expect(result.address).toBe(mockAddress);
    });

    it('should reject invalid wallet structure', async () => {
      const invalidWallet = { kty: 'RSA' } as any; // Missing required fields

      const result = await ArweaveWalletService.quickValidate(invalidWallet);

      expect(result.isValid).toBe(false);
      expect(result.address).toBeUndefined();
    });

    it('should handle address generation errors gracefully', async () => {
      const mockArweave = require('arweave').init();
      mockArweave.wallets.jwkToAddress.mockRejectedValue(new Error('Address generation failed'));

      const result = await ArweaveWalletService.quickValidate(mockValidWallet);

      expect(result.isValid).toBe(false);
      expect(result.address).toBeUndefined();
    });
  });

  describe('formatWalletAddress', () => {
    it('should format long addresses correctly', () => {
      const formatted = ArweaveWalletService.formatWalletAddress(mockAddress);
      expect(formatted).toBe('abcdef...O_-');
    });

    it('should return short addresses unchanged', () => {
      const shortAddress = 'short';
      const formatted = ArweaveWalletService.formatWalletAddress(shortAddress);
      expect(formatted).toBe('short');
    });
  });
});