import {
  isValidArweaveWalletKey,
  validateVideoFile,
  validateWalletKeyFile,
  formatFileSize,
  isValidArweaveAddress,
  formatWalletAddress,
  isValidTransactionId
} from '../typeValidation';

describe('typeValidation', () => {
  describe('isValidArweaveWalletKey', () => {
    it('should return true for valid wallet key', () => {
      const validWallet = {
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

      expect(isValidArweaveWalletKey(validWallet)).toBe(true);
    });

    it('should return false for invalid key type', () => {
      const invalidWallet = {
        kty: 'EC', // Should be RSA
        n: 'test-n-value',
        e: 'AQAB',
        d: 'test-d-value',
        p: 'test-p-value',
        q: 'test-q-value',
        dp: 'test-dp-value',
        dq: 'test-dq-value',
        qi: 'test-qi-value'
      };

      expect(isValidArweaveWalletKey(invalidWallet)).toBe(false);
    });

    it('should return false for missing required fields', () => {
      const incompleteWallet = {
        kty: 'RSA',
        n: 'test-n-value',
        e: 'AQAB'
        // Missing other required fields
      };

      expect(isValidArweaveWalletKey(incompleteWallet)).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(isValidArweaveWalletKey(null)).toBe(false);
      expect(isValidArweaveWalletKey(undefined)).toBe(false);
    });
  });

  describe('validateVideoFile', () => {
    it('should validate a valid video file', () => {
      const mockFile = new File(['video content'], 'test.mp4', {
        type: 'video/mp4'
      });

      const result = validateVideoFile(mockFile);
      expect(result.isValid).toBe(true);
      expect(result.fileInfo).toBeDefined();
      expect(result.fileInfo?.type).toBe('video/mp4');
    });

    it('should reject files that are too large', () => {
      const largeContent = new Array(600 * 1024 * 1024).fill('x').join(''); // 600MB
      const mockFile = new File([largeContent], 'large.mp4', {
        type: 'video/mp4'
      });

      const result = validateVideoFile(mockFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('exceeds maximum allowed size');
    });

    it('should reject unsupported file types', () => {
      const mockFile = new File(['content'], 'test.txt', {
        type: 'text/plain'
      });

      const result = validateVideoFile(mockFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('not supported');
    });

    it('should reject empty files', () => {
      const mockFile = new File([], 'empty.mp4', {
        type: 'video/mp4'
      });

      const result = validateVideoFile(mockFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('File is empty');
    });
  });

  describe('validateWalletKeyFile', () => {
    it('should validate a valid JSON wallet file', () => {
      const mockFile = new File(['{"kty":"RSA"}'], 'wallet.json', {
        type: 'application/json'
      });

      const result = validateWalletKeyFile(mockFile);
      expect(result.isValid).toBe(true);
    });

    it('should reject non-JSON files', () => {
      const mockFile = new File(['content'], 'wallet.txt', {
        type: 'text/plain'
      });

      const result = validateWalletKeyFile(mockFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must be a JSON file');
    });

    it('should reject files that are too large', () => {
      const largeContent = new Array(15 * 1024).fill('x').join(''); // 15KB
      const mockFile = new File([largeContent], 'large-wallet.json', {
        type: 'application/json'
      });

      const result = validateWalletKeyFile(mockFile);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('too large');
    });
  });

  describe('formatFileSize', () => {
    it('should format bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1024 * 1024)).toBe('1 MB');
      expect(formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
    });

    it('should handle decimal values', () => {
      expect(formatFileSize(1536)).toBe('1.5 KB'); // 1.5 KB
      expect(formatFileSize(1024 * 1024 * 1.5)).toBe('1.5 MB');
    });
  });

  describe('isValidArweaveAddress', () => {
    it('should validate correct Arweave addresses', () => {
      const validAddress = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNO_-';
      expect(isValidArweaveAddress(validAddress)).toBe(true);
    });

    it('should reject invalid addresses', () => {
      expect(isValidArweaveAddress('too-short')).toBe(false);
      expect(isValidArweaveAddress('this-address-is-way-too-long-for-arweave-format')).toBe(false);
      expect(isValidArweaveAddress('invalid@characters#here!')).toBe(false);
    });
  });

  describe('formatWalletAddress', () => {
    it('should format long addresses correctly', () => {
      const longAddress = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNO_-';
      const formatted = formatWalletAddress(longAddress);
      expect(formatted).toBe('abcdef...O_-');
    });

    it('should return short addresses unchanged', () => {
      const shortAddress = 'short';
      expect(formatWalletAddress(shortAddress)).toBe('short');
    });
  });

  describe('isValidTransactionId', () => {
    it('should validate correct transaction IDs', () => {
      const validTxId = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNO_-';
      expect(isValidTransactionId(validTxId)).toBe(true);
    });

    it('should reject invalid transaction IDs', () => {
      expect(isValidTransactionId('too-short')).toBe(false);
      expect(isValidTransactionId('this-transaction-id-is-way-too-long')).toBe(false);
      expect(isValidTransactionId('invalid@characters#here!')).toBe(false);
    });
  });
});