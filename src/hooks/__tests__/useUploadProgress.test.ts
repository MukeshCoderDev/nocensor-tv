import { renderHook, act } from '@testing-library/react';
import { useUploadProgress, useSimpleUploadProgress } from '../useUploadProgress';
import { ArweaveWalletKey } from '../../types/ArweaveTypes';

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
    getStatus: jest.fn()
  }
};

jest.mock('arweave', () => ({
  init: jest.fn(() => mockArweave)
}));

// Mock FileReader
const mockFileReader = {
  readAsArrayBuffer: jest.fn(),
  onload: null as any,
  onerror: null as any,
  result: null as any
};

global.FileReader = jest.fn(() => mockFileReader) as any;

describe('useUploadProgress', () => {
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
    jest.useFakeTimers();
    
    // Reset mock states
    mockUploader.isComplete = false;
    mockUploader.uploadedChunks = 0;
    mockUploader.totalChunks = 10;
    mockUploader.chunkSize = 1024;
    
    mockArweave.createTransaction.mockResolvedValue(mockTransaction);
    mockArweave.transactions.sign.mockResolvedValue(undefined);
    mockArweave.transactions.getUploader.mockResolvedValue(mockUploader);
    mockArweave.transactions.getStatus.mockResolvedValue({ status: 200 });
    
    mockFileReader.onload = null;
    mockFileReader.onerror = null;
    mockFileReader.result = null;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('useUploadProgress', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() => useUploadProgress());

      expect(result.current.progress).toEqual({
        percentage: 0,
        status: 'idle',
        bytesUploaded: 0,
        totalBytes: 0
      });
    });

    it('should successfully upload a file with progress tracking', async () => {
      const { result } = renderHook(() => useUploadProgress());
      const mockFile = new File(['video content'], 'test.mp4', { type: 'video/mp4' });

      // Mock successful upload progression
      mockUploader.uploadChunk.mockImplementation(async () => {
        mockUploader.uploadedChunks += 1;
        if (mockUploader.uploadedChunks >= mockUploader.totalChunks) {
          mockUploader.isComplete = true;
        }
      });

      let uploadPromise: Promise<string>;

      await act(async () => {
        uploadPromise = result.current.startUpload(mockFile, mockWallet);

        // Simulate FileReader success
        if (mockFileReader.onload) {
          mockFileReader.result = new ArrayBuffer(mockFile.size);
          mockFileReader.onload({ target: { result: mockFileReader.result } } as any);
        }

        // Fast-forward through upload chunks
        while (!mockUploader.isComplete) {
          await new Promise(resolve => setTimeout(resolve, 100));
          jest.advanceTimersByTime(100);
        }

        const transactionId = await uploadPromise;
        expect(transactionId).toBe('test-transaction-id');
      });

      expect(result.current.progress.status).toBe('completed');
      expect(result.current.progress.percentage).toBe(100);
      expect(result.current.progress.transactionId).toBe('test-transaction-id');
    });

    it('should handle upload preparation phase', async () => {
      const { result } = renderHook(() => useUploadProgress());
      const mockFile = new File(['video content'], 'test.mp4', { type: 'video/mp4' });

      act(() => {
        result.current.startUpload(mockFile, mockWallet);
      });

      expect(result.current.progress.status).toBe('preparing');
      expect(result.current.progress.totalBytes).toBe(mockFile.size);
    });

    it('should track upload progress correctly', async () => {
      const { result } = renderHook(() => useUploadProgress());
      const mockFile = new File(['video content'], 'test.mp4', { type: 'video/mp4' });

      mockUploader.uploadChunk.mockImplementation(async () => {
        mockUploader.uploadedChunks += 1;
        // Don't complete immediately to test progress tracking
      });

      await act(async () => {
        const uploadPromise = result.current.startUpload(mockFile, mockWallet);

        // Simulate FileReader success
        if (mockFileReader.onload) {
          mockFileReader.result = new ArrayBuffer(mockFile.size);
          mockFileReader.onload({ target: { result: mockFileReader.result } } as any);
        }

        // Simulate partial upload progress
        await new Promise(resolve => setTimeout(resolve, 100));
        jest.advanceTimersByTime(100);

        expect(result.current.progress.status).toBe('uploading');
        expect(result.current.progress.percentage).toBeGreaterThan(30);
      });
    });

    it('should handle upload cancellation', async () => {
      const { result } = renderHook(() => useUploadProgress());
      const mockFile = new File(['video content'], 'test.mp4', { type: 'video/mp4' });

      await act(async () => {
        const uploadPromise = result.current.startUpload(mockFile, mockWallet);

        // Cancel upload immediately
        result.current.cancelUpload();

        try {
          await uploadPromise;
        } catch (error) {
          expect(error).toMatchObject({
            type: 'upload',
            message: 'Upload was cancelled'
          });
        }
      });

      expect(result.current.progress.status).toBe('failed');
    });

    it('should reset progress correctly', () => {
      const { result } = renderHook(() => useUploadProgress());

      act(() => {
        result.current.resetProgress();
      });

      expect(result.current.progress).toEqual({
        percentage: 0,
        status: 'idle',
        bytesUploaded: 0,
        totalBytes: 0
      });
    });

    it('should handle file reading errors', async () => {
      const { result } = renderHook(() => useUploadProgress());
      const mockFile = new File(['video content'], 'test.mp4', { type: 'video/mp4' });

      await act(async () => {
        const uploadPromise = result.current.startUpload(mockFile, mockWallet);

        // Simulate FileReader error
        if (mockFileReader.onerror) {
          mockFileReader.onerror();
        }

        try {
          await uploadPromise;
        } catch (error) {
          expect(error).toMatchObject({
            type: 'upload',
            message: expect.stringContaining('Upload failed')
          });
        }
      });

      expect(result.current.progress.status).toBe('failed');
    });

    it('should handle transaction creation errors', async () => {
      mockArweave.createTransaction.mockRejectedValue(new Error('Transaction creation failed'));

      const { result } = renderHook(() => useUploadProgress());
      const mockFile = new File(['video content'], 'test.mp4', { type: 'video/mp4' });

      await act(async () => {
        const uploadPromise = result.current.startUpload(mockFile, mockWallet);

        // Simulate FileReader success
        if (mockFileReader.onload) {
          mockFileReader.result = new ArrayBuffer(mockFile.size);
          mockFileReader.onload({ target: { result: mockFileReader.result } } as any);
        }

        try {
          await uploadPromise;
        } catch (error) {
          expect(error).toMatchObject({
            type: 'upload',
            message: expect.stringContaining('Transaction creation failed')
          });
        }
      });
    });

    it('should retry failed uploads', async () => {
      const { result } = renderHook(() => useUploadProgress());
      const mockFile = new File(['video content'], 'test.mp4', { type: 'video/mp4' });

      // First attempt fails
      mockArweave.createTransaction.mockRejectedValueOnce(new Error('Network error'));
      // Second attempt succeeds
      mockArweave.createTransaction.mockResolvedValueOnce(mockTransaction);

      mockUploader.uploadChunk.mockImplementation(async () => {
        mockUploader.uploadedChunks += 1;
        if (mockUploader.uploadedChunks >= mockUploader.totalChunks) {
          mockUploader.isComplete = true;
        }
      });

      await act(async () => {
        // First attempt should fail
        try {
          const uploadPromise = result.current.startUpload(mockFile, mockWallet);
          
          if (mockFileReader.onload) {
            mockFileReader.result = new ArrayBuffer(mockFile.size);
            mockFileReader.onload({ target: { result: mockFileReader.result } } as any);
          }
          
          await uploadPromise;
        } catch (error) {
          expect(error).toMatchObject({
            type: 'upload',
            message: expect.stringContaining('Network error')
          });
        }

        // Reset for retry
        mockUploader.isComplete = false;
        mockUploader.uploadedChunks = 0;

        // Retry should succeed
        const retryPromise = result.current.retryUpload(mockFile, mockWallet);
        
        if (mockFileReader.onload) {
          mockFileReader.result = new ArrayBuffer(mockFile.size);
          mockFileReader.onload({ target: { result: mockFileReader.result } } as any);
        }

        while (!mockUploader.isComplete) {
          await new Promise(resolve => setTimeout(resolve, 100));
          jest.advanceTimersByTime(100);
        }

        const transactionId = await retryPromise;
        expect(transactionId).toBe('test-transaction-id');
      });
    });

    it('should add proper tags to transactions', async () => {
      const { result } = renderHook(() => useUploadProgress());
      const mockFile = new File(['video content'], 'test.mp4', { type: 'video/mp4' });

      mockUploader.uploadChunk.mockImplementation(async () => {
        mockUploader.isComplete = true;
      });

      await act(async () => {
        const uploadPromise = result.current.startUpload(mockFile, mockWallet);

        if (mockFileReader.onload) {
          mockFileReader.result = new ArrayBuffer(mockFile.size);
          mockFileReader.onload({ target: { result: mockFileReader.result } } as any);
        }

        await uploadPromise;
      });

      expect(mockTransaction.addTag).toHaveBeenCalledWith('Content-Type', 'video/mp4');
      expect(mockTransaction.addTag).toHaveBeenCalledWith('File-Name', 'test.mp4');
      expect(mockTransaction.addTag).toHaveBeenCalledWith('App-Name', 'NoCensor-TV');
      expect(mockTransaction.addTag).toHaveBeenCalledWith('App-Version', '1.0.0');
      expect(mockTransaction.addTag).toHaveBeenCalledWith('Upload-Timestamp', expect.any(String));
    });
  });

  describe('useSimpleUploadProgress', () => {
    it('should initialize with correct default state', () => {
      const { result } = renderHook(() => useSimpleUploadProgress());

      expect(result.current.isUploading).toBe(false);
      expect(result.current.uploadProgress).toBe(0);
      expect(result.current.error).toBe(null);
    });

    it('should upload with basic progress tracking', async () => {
      const { result } = renderHook(() => useSimpleUploadProgress());
      const mockFile = new File(['video content'], 'test.mp4', { type: 'video/mp4' });

      mockUploader.uploadChunk.mockImplementation(async () => {
        mockUploader.uploadedChunks += 1;
        if (mockUploader.uploadedChunks >= mockUploader.totalChunks) {
          mockUploader.isComplete = true;
        }
      });

      let transactionId: string;

      await act(async () => {
        const uploadPromise = result.current.uploadWithProgress(mockFile, mockWallet);

        if (mockFileReader.onload) {
          mockFileReader.result = new ArrayBuffer(mockFile.size);
          mockFileReader.onload({ target: { result: mockFileReader.result } } as any);
        }

        while (!mockUploader.isComplete) {
          await new Promise(resolve => setTimeout(resolve, 100));
          jest.advanceTimersByTime(100);
        }

        transactionId = await uploadPromise;
      });

      expect(transactionId).toBe('test-transaction-id');
      expect(result.current.uploadProgress).toBe(100);
      expect(result.current.isUploading).toBe(false);
    });

    it('should call progress callback', async () => {
      const { result } = renderHook(() => useSimpleUploadProgress());
      const mockFile = new File(['video content'], 'test.mp4', { type: 'video/mp4' });
      const onProgress = jest.fn();

      mockUploader.uploadChunk.mockImplementation(async () => {
        mockUploader.uploadedChunks += 1;
        if (mockUploader.uploadedChunks >= mockUploader.totalChunks) {
          mockUploader.isComplete = true;
        }
      });

      await act(async () => {
        const uploadPromise = result.current.uploadWithProgress(mockFile, mockWallet, onProgress);

        if (mockFileReader.onload) {
          mockFileReader.result = new ArrayBuffer(mockFile.size);
          mockFileReader.onload({ target: { result: mockFileReader.result } } as any);
        }

        while (!mockUploader.isComplete) {
          await new Promise(resolve => setTimeout(resolve, 100));
          jest.advanceTimersByTime(100);
        }

        await uploadPromise;
      });

      expect(onProgress).toHaveBeenCalledWith(expect.any(Number));
    });

    it('should handle upload errors', async () => {
      mockArweave.createTransaction.mockRejectedValue(new Error('Upload failed'));

      const { result } = renderHook(() => useSimpleUploadProgress());
      const mockFile = new File(['video content'], 'test.mp4', { type: 'video/mp4' });

      await act(async () => {
        try {
          const uploadPromise = result.current.uploadWithProgress(mockFile, mockWallet);

          if (mockFileReader.onload) {
            mockFileReader.result = new ArrayBuffer(mockFile.size);
            mockFileReader.onload({ target: { result: mockFileReader.result } } as any);
          }

          await uploadPromise;
        } catch (error) {
          expect(error).toBeInstanceOf(Error);
        }
      });

      expect(result.current.error).toBe('Upload failed');
      expect(result.current.isUploading).toBe(false);
    });

    it('should clear errors', () => {
      const { result } = renderHook(() => useSimpleUploadProgress());

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBe(null);
    });
  });
});