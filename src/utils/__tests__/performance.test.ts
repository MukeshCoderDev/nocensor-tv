import { renderHook, act } from '@testing-library/react';
import {
  useDebounce,
  useThrottle,
  useMemoizedFileProcessing,
  useOptimizedProgressTracking,
  FileChunker,
  OptimizedFileReader,
  OptimizedWalletValidator,
  PerformanceMonitor,
  ThumbnailGenerator
} from '../performanceOptimizations';

// Mock performance.now for consistent testing
const mockPerformanceNow = jest.fn();
Object.defineProperty(global.performance, 'now', {
  value: mockPerformanceNow
});

describe('Performance Optimizations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPerformanceNow.mockReturnValue(0);
  });

  describe('useDebounce', () => {
    it('should debounce function calls', async () => {
      const mockFn = jest.fn();
      const { result } = renderHook(() => useDebounce(mockFn, 100));

      // Call multiple times rapidly
      act(() => {
        result.current('call1');
        result.current('call2');
        result.current('call3');
      });

      // Should not have been called yet
      expect(mockFn).not.toHaveBeenCalled();

      // Wait for debounce delay
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
      });

      // Should have been called only once with the last argument
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('call3');
    });

    it('should cancel previous timeout on new calls', async () => {
      const mockFn = jest.fn();
      const { result } = renderHook(() => useDebounce(mockFn, 100));

      act(() => {
        result.current('call1');
      });

      // Wait 50ms (less than debounce delay)
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
      });

      act(() => {
        result.current('call2');
      });

      // Wait for full debounce delay
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
      });

      // Should only be called once with the second call
      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('call2');
    });
  });

  describe('useThrottle', () => {
    it('should throttle function calls', async () => {
      const mockFn = jest.fn();
      const { result } = renderHook(() => useThrottle(mockFn, 100));

      // First call should execute immediately
      act(() => {
        result.current('call1');
      });

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('call1');

      // Subsequent calls within throttle period should be delayed
      act(() => {
        result.current('call2');
        result.current('call3');
      });

      // Should still be only one call
      expect(mockFn).toHaveBeenCalledTimes(1);

      // Wait for throttle period
      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 150));
      });

      // Should now have the throttled call
      expect(mockFn).toHaveBeenCalledTimes(2);
      expect(mockFn).toHaveBeenLastCalledWith('call3');
    });
  });

  describe('useMemoizedFileProcessing', () => {
    it('should cache processed files', async () => {
      const mockProcessor = jest.fn().mockResolvedValue('processed');
      const { result } = renderHook(() => useMemoizedFileProcessing());

      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      // First call should process the file
      let result1: any;
      await act(async () => {
        result1 = await result.current.processFile(file, mockProcessor);
      });

      expect(result1).toBe('processed');
      expect(mockProcessor).toHaveBeenCalledTimes(1);

      // Second call with same file should use cache
      let result2: any;
      await act(async () => {
        result2 = await result.current.processFile(file, mockProcessor);
      });

      expect(result2).toBe('processed');
      expect(mockProcessor).toHaveBeenCalledTimes(1); // Still only called once
    });

    it('should clear cache when requested', async () => {
      const mockProcessor = jest.fn().mockResolvedValue('processed');
      const { result } = renderHook(() => useMemoizedFileProcessing());

      const file = new File(['content'], 'test.txt', { type: 'text/plain' });

      // Process file
      await act(async () => {
        await result.current.processFile(file, mockProcessor);
      });

      // Clear cache
      act(() => {
        result.current.clearCache();
      });

      // Process same file again - should call processor again
      await act(async () => {
        await result.current.processFile(file, mockProcessor);
      });

      expect(mockProcessor).toHaveBeenCalledTimes(2);
    });
  });

  describe('FileChunker', () => {
    it('should chunk files correctly', async () => {
      const chunker = new FileChunker(10); // 10 byte chunks
      const file = new File(['0123456789abcdefghij'], 'test.txt'); // 20 bytes

      const chunks = [];
      for await (const chunk of chunker.chunkFile(file)) {
        chunks.push(chunk);
      }

      expect(chunks).toHaveLength(2);
      expect(chunks[0].index).toBe(0);
      expect(chunks[0].total).toBe(2);
      expect(chunks[0].chunk.size).toBe(10);
      expect(chunks[1].index).toBe(1);
      expect(chunks[1].total).toBe(2);
      expect(chunks[1].chunk.size).toBe(10);
    });

    it('should process files in chunks with progress', async () => {
      const chunker = new FileChunker(5);
      const file = new File(['0123456789'], 'test.txt'); // 10 bytes
      const mockProcessor = jest.fn().mockResolvedValue('chunk-result');
      const mockProgress = jest.fn();

      const results = await chunker.processFileInChunks(
        file,
        mockProcessor,
        mockProgress
      );

      expect(results).toHaveLength(2);
      expect(results).toEqual(['chunk-result', 'chunk-result']);
      expect(mockProcessor).toHaveBeenCalledTimes(2);
      expect(mockProgress).toHaveBeenCalledWith(50); // After first chunk
      expect(mockProgress).toHaveBeenCalledWith(100); // After second chunk
    });
  });

  describe('OptimizedFileReader', () => {
    it('should read files sequentially to avoid memory issues', async () => {
      const reader = OptimizedFileReader.getInstance();
      const file1 = new File(['content1'], 'test1.txt');
      const file2 = new File(['content2'], 'test2.txt');

      // Mock FileReader
      const mockFileReader = {
        readAsArrayBuffer: jest.fn(),
        onload: null as any,
        onerror: null as any,
        result: null as any
      };

      global.FileReader = jest.fn(() => mockFileReader) as any;

      const promise1 = reader.readFile(file1);
      const promise2 = reader.readFile(file2);

      // Simulate successful file reading
      setTimeout(() => {
        mockFileReader.result = new ArrayBuffer(8);
        if (mockFileReader.onload) mockFileReader.onload();
      }, 10);

      const results = await Promise.all([promise1, promise2]);
      
      expect(results).toHaveLength(2);
      expect(mockFileReader.readAsArrayBuffer).toHaveBeenCalledTimes(2);
    });
  });

  describe('OptimizedWalletValidator', () => {
    it('should cache validation results', async () => {
      const validator = new OptimizedWalletValidator();
      const wallet = { kty: 'RSA', n: 'test' };

      // First validation
      const result1 = await validator.validateWallet(wallet);
      expect(result1).toEqual({ isValid: true, address: 'test-address' });

      // Second validation should use cache (would be faster in real implementation)
      const result2 = await validator.validateWallet(wallet);
      expect(result2).toEqual({ isValid: true, address: 'test-address' });
    });
  });

  describe('PerformanceMonitor', () => {
    it('should track timing metrics', () => {
      const monitor = new PerformanceMonitor();
      
      mockPerformanceNow
        .mockReturnValueOnce(0)   // Start time
        .mockReturnValueOnce(100); // End time

      const endTiming = monitor.startTiming('test-operation');
      endTiming();

      const metrics = monitor.getMetrics();
      expect(metrics['test-operation']).toEqual({
        average: 100,
        count: 1,
        latest: 100
      });
    });

    it('should calculate average times correctly', () => {
      const monitor = new PerformanceMonitor();
      
      // Mock multiple timing measurements
      mockPerformanceNow
        .mockReturnValueOnce(0).mockReturnValueOnce(100)   // 100ms
        .mockReturnValueOnce(0).mockReturnValueOnce(200)   // 200ms
        .mockReturnValueOnce(0).mockReturnValueOnce(150);  // 150ms

      const endTiming1 = monitor.startTiming('test-op');
      endTiming1();
      
      const endTiming2 = monitor.startTiming('test-op');
      endTiming2();
      
      const endTiming3 = monitor.startTiming('test-op');
      endTiming3();

      expect(monitor.getAverageTime('test-op')).toBe(150); // (100+200+150)/3
    });

    it('should limit stored measurements', () => {
      const monitor = new PerformanceMonitor();
      
      // Add more than 100 measurements
      for (let i = 0; i < 150; i++) {
        mockPerformanceNow
          .mockReturnValueOnce(0)
          .mockReturnValueOnce(i);
        
        const endTiming = monitor.startTiming('test-op');
        endTiming();
      }

      const metrics = monitor.getMetrics();
      expect(metrics['test-op'].count).toBe(100); // Should be limited to 100
    });
  });

  describe('ThumbnailGenerator', () => {
    it('should generate thumbnails from video files', async () => {
      const generator = new ThumbnailGenerator();
      
      // Mock video element and canvas
      const mockVideo = {
        preload: '',
        src: '',
        currentTime: 0,
        onseeked: null as any,
        onerror: null as any
      };

      const mockCanvas = {
        width: 0,
        height: 0,
        getContext: jest.fn(() => ({
          drawImage: jest.fn()
        })),
        toDataURL: jest.fn(() => 'data:image/jpeg;base64,thumbnail')
      };

      global.document.createElement = jest.fn((tagName) => {
        if (tagName === 'video') return mockVideo as any;
        if (tagName === 'canvas') return mockCanvas as any;
        return {} as any;
      });

      global.URL.createObjectURL = jest.fn(() => 'mock-url');
      global.URL.revokeObjectURL = jest.fn();

      const file = new File(['video content'], 'test.mp4', { type: 'video/mp4' });
      
      const thumbnailPromise = generator.generateThumbnail(file, {
        width: 160,
        height: 90,
        quality: 0.8,
        seekTime: 1
      });

      // Simulate video loaded and seeked
      setTimeout(() => {
        if (mockVideo.onseeked) mockVideo.onseeked();
      }, 10);

      const thumbnail = await thumbnailPromise;
      
      expect(thumbnail).toBe('data:image/jpeg;base64,thumbnail');
      expect(mockCanvas.width).toBe(160);
      expect(mockCanvas.height).toBe(90);
      expect(mockCanvas.toDataURL).toHaveBeenCalledWith('image/jpeg', 0.8);
    });
  });
});

describe('Performance Benchmarks', () => {
  it('should measure file processing performance', async () => {
    const startTime = Date.now();
    
    // Simulate file processing
    const file = new File(['x'.repeat(1000000)], 'large.txt'); // 1MB file
    const processor = async (file: File) => {
      return new Promise(resolve => {
        setTimeout(() => resolve('processed'), 10);
      });
    };

    const { result } = renderHook(() => useMemoizedFileProcessing());
    
    await act(async () => {
      await result.current.processFile(file, processor);
    });

    const processingTime = Date.now() - startTime;
    
    // Should complete within reasonable time (adjust threshold as needed)
    expect(processingTime).toBeLessThan(1000); // 1 second
  });

  it('should measure chunking performance', async () => {
    const chunker = new FileChunker(64 * 1024); // 64KB chunks
    const file = new File(['x'.repeat(1024 * 1024)], 'large.txt'); // 1MB file
    
    const startTime = Date.now();
    
    const chunks = [];
    for await (const chunk of chunker.chunkFile(file)) {
      chunks.push(chunk);
    }
    
    const chunkingTime = Date.now() - startTime;
    
    expect(chunks.length).toBeGreaterThan(0);
    expect(chunkingTime).toBeLessThan(500); // Should be fast
  });

  it('should measure debounce effectiveness', async () => {
    const mockFn = jest.fn();
    const { result } = renderHook(() => useDebounce(mockFn, 50));

    const startTime = Date.now();
    
    // Simulate rapid calls
    for (let i = 0; i < 100; i++) {
      act(() => {
        result.current(`call-${i}`);
      });
    }

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
    });

    const totalTime = Date.now() - startTime;
    
    // Should have been called only once despite 100 calls
    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith('call-99');
    expect(totalTime).toBeLessThan(200); // Should be efficient
  });
});