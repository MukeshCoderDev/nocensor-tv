import { EnhancedArweaveUploader, ArweaveErrorTypes } from '../../../arweave-uploader.js';

// Mock Arweave
const mockUploader = {
  isComplete: false,
  uploadedChunks: 0,
  totalChunks: 10,
  chunkSize: 1024,
  uploadChunk: jest.fn()
};

const mockTransaction = {
  id: 'test-transaction-id',
  addTag: jest.fn(),
  reward: '1000000000'
};

const mockArweave = {
  createTransaction: jest.fn(),
  transactions: {
    sign: jest.fn(),
    getUploader: jest.fn(),
    getStatus: jest.fn(),
    post: jest.fn()
  },
  wallets: {
    jwkToAddress: jest.fn(),
    getBalance: jest.fn()
  },
  ar: {
    winstonToAr: jest.fn()
  }
};

jest.mock('arweave', () => ({
  init: jest.fn(() => mockArweave)
}));

describe('EnhancedArweaveUploader', () => {
  let uploader;
  const mockWallet = {
    kty: 'RSA',
    n: 'test-n-value',
    e: 'AQAB',
    d: 'test-d-value'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    uploader = new EnhancedArweaveUploader();
    
    // Reset mock states
    mockUploader.isComplete = false;
    mockUploader.uploadedChunks = 0;
    mockUploader.totalChunks = 10;
    
    mockArweave.createTransaction.mockResolvedValue(mockTransaction);
    mockArweave.transactions.sign.mockResolvedValue(undefined);
    mockArweave.transactions.getUploader.mockResolvedValue(mockUploader);
    mockArweave.transactions.getStatus.mockResolvedValue({ status: 200 });
    mockArweave.wallets.jwkToAddress.mockResolvedValue('test-address');
    mockArweave.wallets.getBalance.mockResolvedValue('1000000000000');
    mockArweave.ar.winstonToAr.mockReturnValue('1.000000000000');
  });

  describe('uploadToArweave', () => {
    it('should successfully upload with progress tracking', async () => {
      const fileBuffer = new ArrayBuffer(1024);
      const onProgress = jest.fn();
      const onStatusChange = jest.fn();

      // Mock successful upload progression
      mockUploader.uploadChunk.mockImplementation(async () => {
        mockUploader.uploadedChunks += 1;
        if (mockUploader.uploadedChunks >= mockUploader.totalChunks) {
          mockUploader.isComplete = true;
        }
      });

      const result = await uploader.uploadToArweave(fileBuffer, mockWallet, {
        onProgress,
        onStatusChange
      });

      expect(result.transactionId).toBe('test-transaction-id');
      expect(result.arweaveUrl).toBe('https://arweave.net/test-transaction-id');
      expect(onProgress).toHaveBeenCalledWith(expect.objectContaining({
        percentage: 100,
        status: 'completed'
      }));
      expect(onStatusChange).toHaveBeenCalledWith(expect.objectContaining({
        status: 'completed',
        transactionId: 'test-transaction-id'
      }));
    });

    it('should handle upload cancellation', async () => {
      const fileBuffer = new ArrayBuffer(1024);
      const abortController = new AbortController();
      
      // Cancel immediately
      abortController.abort();

      await expect(
        uploader.uploadToArweave(fileBuffer, mockWallet, {
          abortSignal: abortController.signal
        })
      ).rejects.toMatchObject({
        type: ArweaveErrorTypes.UPLOAD_ERROR,
        message: 'Upload was cancelled'
      });
    });

    it('should retry on network errors', async () => {
      const fileBuffer = new ArrayBuffer(1024);
      const onStatusChange = jest.fn();

      // First attempt fails, second succeeds
      mockArweave.createTransaction
        .mockRejectedValueOnce(new Error('Network timeout'))
        .mockResolvedValueOnce(mockTransaction);

      mockUploader.uploadChunk.mockImplementation(async () => {
        mockUploader.uploadedChunks += 1;
        if (mockUploader.uploadedChunks >= mockUploader.totalChunks) {
          mockUploader.isComplete = true;
        }
      });

      const result = await uploader.uploadToArweave(fileBuffer, mockWallet, {
        onStatusChange
      });

      expect(result.transactionId).toBe('test-transaction-id');
      expect(onStatusChange).toHaveBeenCalledWith(expect.objectContaining({
        status: 'retrying',
        attempt: 1
      }));
    });

    it('should not retry on validation errors', async () => {
      const fileBuffer = new ArrayBuffer(1024);
      
      mockArweave.createTransaction.mockRejectedValue(new Error('Invalid wallet key'));

      await expect(
        uploader.uploadToArweave(fileBuffer, mockWallet)
      ).rejects.toMatchObject({
        type: ArweaveErrorTypes.VALIDATION_ERROR,
        recoverable: false
      });

      expect(mockArweave.createTransaction).toHaveBeenCalledTimes(1);
    });

    it('should add proper tags to transaction', async () => {
      const fileBuffer = new ArrayBuffer(1024);
      const customTags = { 'Custom-Tag': 'test-value' };

      mockUploader.uploadChunk.mockImplementation(async () => {
        mockUploader.isComplete = true;
      });

      await uploader.uploadToArweave(fileBuffer, mockWallet, {
        contentType: 'video/webm',
        tags: customTags
      });

      expect(mockTransaction.addTag).toHaveBeenCalledWith('Content-Type', 'video/webm');
      expect(mockTransaction.addTag).toHaveBeenCalledWith('App-Name', 'NoCensor-TV');
      expect(mockTransaction.addTag).toHaveBeenCalledWith('Custom-Tag', 'test-value');
      expect(mockTransaction.addTag).toHaveBeenCalledWith('File-Size', '1024');
    });

    it('should handle confirmation timeout gracefully', async () => {
      const fileBuffer = new ArrayBuffer(1024);
      
      // Mock status check to always return 404 (not found)
      mockArweave.transactions.getStatus.mockResolvedValue({ status: 404 });

      mockUploader.uploadChunk.mockImplementation(async () => {
        mockUploader.isComplete = true;
      });

      // Should not throw error even with confirmation timeout
      const result = await uploader.uploadToArweave(fileBuffer, mockWallet);
      expect(result.transactionId).toBe('test-transaction-id');
    });
  });

  describe('estimateUploadCost', () => {
    it('should calculate upload cost correctly', async () => {
      const fileSize = 1024 * 1024; // 1MB

      const result = await uploader.estimateUploadCost(fileSize);

      expect(result.winston).toBeGreaterThan(0);
      expect(result.ar).toBeGreaterThan(0);
      expect(result.formattedCost).toContain('AR');
    });

    it('should handle cost estimation errors', async () => {
      mockArweave.createTransaction.mockRejectedValue(new Error('Network error'));

      await expect(uploader.estimateUploadCost(1024)).rejects.toMatchObject({
        type: ArweaveErrorTypes.NETWORK_ERROR
      });
    });
  });

  describe('validateWallet', () => {
    it('should validate correct wallet', async () => {
      const result = await uploader.validateWallet(mockWallet);

      expect(result.isValid).toBe(true);
      expect(result.address).toBe('test-address');
      expect(result.balance).toBe(1);
      expect(result.formattedBalance).toContain('AR');
    });

    it('should handle invalid wallet', async () => {
      mockArweave.wallets.jwkToAddress.mockRejectedValue(new Error('Invalid key'));

      const result = await uploader.validateWallet(mockWallet);

      expect(result.isValid).toBe(false);
      expect(result.error).toMatchObject({
        type: ArweaveErrorTypes.VALIDATION_ERROR
      });
    });
  });

  describe('error categorization', () => {
    it('should categorize network errors correctly', () => {
      const error = new Error('Network timeout occurred');
      const categorized = uploader._categorizeError(error);

      expect(categorized.type).toBe(ArweaveErrorTypes.NETWORK_ERROR);
      expect(categorized.recoverable).toBe(true);
      expect(categorized.suggestedAction).toContain('internet connection');
    });

    it('should categorize balance errors correctly', () => {
      const error = new Error('Insufficient balance for transaction');
      const categorized = uploader._categorizeError(error);

      expect(categorized.type).toBe(ArweaveErrorTypes.BALANCE_ERROR);
      expect(categorized.recoverable).toBe(false);
      expect(categorized.suggestedAction).toContain('AR tokens');
    });

    it('should categorize validation errors correctly', () => {
      const error = new Error('Invalid wallet key format');
      const categorized = uploader._categorizeError(error);

      expect(categorized.type).toBe(ArweaveErrorTypes.VALIDATION_ERROR);
      expect(categorized.recoverable).toBe(false);
    });
  });

  describe('retry logic', () => {
    it('should retry recoverable errors', () => {
      const networkError = { type: ArweaveErrorTypes.NETWORK_ERROR, recoverable: true };
      expect(uploader._shouldRetry(networkError)).toBe(true);
    });

    it('should not retry non-recoverable errors', () => {
      const validationError = { type: ArweaveErrorTypes.VALIDATION_ERROR, recoverable: false };
      expect(uploader._shouldRetry(validationError)).toBe(false);
    });

    it('should not retry balance errors', () => {
      const balanceError = { type: ArweaveErrorTypes.BALANCE_ERROR, recoverable: true };
      expect(uploader._shouldRetry(balanceError)).toBe(false);
    });
  });

  describe('constructor options', () => {
    it('should use custom options', () => {
      const customUploader = new EnhancedArweaveUploader({
        maxRetries: 5,
        retryDelay: 5000,
        timeout: 60000
      });

      expect(customUploader.maxRetries).toBe(5);
      expect(customUploader.retryDelay).toBe(5000);
    });

    it('should use default options', () => {
      expect(uploader.maxRetries).toBe(3);
      expect(uploader.retryDelay).toBe(2000);
    });
  });
});