import { useCallback, useRef, useMemo, useEffect } from 'react';

/**
 * Debounce hook for performance optimization
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  return useCallback((...args: Parameters<T>) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]) as T;
}

/**
 * Throttle hook for performance optimization
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCallRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastCall = now - lastCallRef.current;
    
    if (timeSinceLastCall >= delay) {
      lastCallRef.current = now;
      callback(...args);
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        lastCallRef.current = Date.now();
        callback(...args);
      }, delay - timeSinceLastCall);
    }
  }, [callback, delay]) as T;
}

/**
 * Memoized file processing for large files
 */
export function useMemoizedFileProcessing() {
  const processedFiles = useRef(new Map<string, any>());
  
  const processFile = useCallback(async (file: File, processor: (file: File) => Promise<any>) => {
    const fileKey = `${file.name}-${file.size}-${file.lastModified}`;
    
    if (processedFiles.current.has(fileKey)) {
      return processedFiles.current.get(fileKey);
    }
    
    const result = await processor(file);
    processedFiles.current.set(fileKey, result);
    
    // Limit cache size to prevent memory leaks
    if (processedFiles.current.size > 50) {
      const firstKey = processedFiles.current.keys().next().value;
      processedFiles.current.delete(firstKey);
    }
    
    return result;
  }, []);
  
  const clearCache = useCallback(() => {
    processedFiles.current.clear();
  }, []);
  
  return { processFile, clearCache };
}

/**
 * Optimized upload progress tracking with debouncing
 */
export function useOptimizedProgressTracking() {
  const lastUpdateRef = useRef<number>(0);
  const progressBufferRef = useRef<number[]>([]);
  
  const updateProgress = useThrottle((percentage: number, callback: (progress: number) => void) => {
    const now = Date.now();
    
    // Buffer progress updates to smooth out rapid changes
    progressBufferRef.current.push(percentage);
    
    // Only update UI every 100ms minimum
    if (now - lastUpdateRef.current >= 100) {
      const averageProgress = progressBufferRef.current.reduce((a, b) => a + b, 0) / progressBufferRef.current.length;
      callback(Math.round(averageProgress));
      
      lastUpdateRef.current = now;
      progressBufferRef.current = [];
    }
  }, 100);
  
  return { updateProgress };
}

/**
 * File chunking for large uploads
 */
export class FileChunker {
  private chunkSize: number;
  
  constructor(chunkSize: number = 256 * 1024) { // 256KB default
    this.chunkSize = chunkSize;
  }
  
  async *chunkFile(file: File): AsyncGenerator<{ chunk: Blob; index: number; total: number }> {
    const totalChunks = Math.ceil(file.size / this.chunkSize);
    
    for (let i = 0; i < totalChunks; i++) {
      const start = i * this.chunkSize;
      const end = Math.min(start + this.chunkSize, file.size);
      const chunk = file.slice(start, end);
      
      yield {
        chunk,
        index: i,
        total: totalChunks
      };
    }
  }
  
  async processFileInChunks<T>(
    file: File,
    processor: (chunk: Blob, index: number, total: number) => Promise<T>,
    onProgress?: (progress: number) => void
  ): Promise<T[]> {
    const results: T[] = [];
    
    for await (const { chunk, index, total } of this.chunkFile(file)) {
      const result = await processor(chunk, index, total);
      results.push(result);
      
      if (onProgress) {
        const progress = ((index + 1) / total) * 100;
        onProgress(progress);
      }
    }
    
    return results;
  }
}

/**
 * Memory-efficient file reader
 */
export class OptimizedFileReader {
  private static instance: OptimizedFileReader;
  private readQueue: Array<{
    file: File;
    resolve: (result: ArrayBuffer) => void;
    reject: (error: Error) => void;
  }> = [];
  private isProcessing = false;
  
  static getInstance(): OptimizedFileReader {
    if (!OptimizedFileReader.instance) {
      OptimizedFileReader.instance = new OptimizedFileReader();
    }
    return OptimizedFileReader.instance;
  }
  
  async readFile(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      this.readQueue.push({ file, resolve, reject });
      this.processQueue();
    });
  }
  
  private async processQueue() {
    if (this.isProcessing || this.readQueue.length === 0) {
      return;
    }
    
    this.isProcessing = true;
    
    while (this.readQueue.length > 0) {
      const { file, resolve, reject } = this.readQueue.shift()!;
      
      try {
        const result = await this.readFileInternal(file);
        resolve(result);
      } catch (error) {
        reject(error as Error);
      }
      
      // Small delay to prevent blocking the main thread
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    this.isProcessing = false;
  }
  
  private readFileInternal(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to read file as ArrayBuffer'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('File reading failed'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  }
}

/**
 * Wallet validation performance optimization
 */
export class OptimizedWalletValidator {
  private validationCache = new Map<string, { result: any; timestamp: number }>();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  
  async validateWallet(walletKey: any): Promise<any> {
    const walletHash = this.hashWallet(walletKey);
    const cached = this.validationCache.get(walletHash);
    
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      return cached.result;
    }
    
    // Perform actual validation (this would call the real validation service)
    const result = await this.performValidation(walletKey);
    
    this.validationCache.set(walletHash, {
      result,
      timestamp: Date.now()
    });
    
    // Clean up old cache entries
    this.cleanupCache();
    
    return result;
  }
  
  private hashWallet(walletKey: any): string {
    // Simple hash for caching - in production, use a proper hash function
    return JSON.stringify(walletKey).slice(0, 50);
  }
  
  private async performValidation(walletKey: any): Promise<any> {
    // This would be replaced with actual validation logic
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({ isValid: true, address: 'test-address' });
      }, 100);
    });
  }
  
  private cleanupCache() {
    const now = Date.now();
    for (const [key, value] of this.validationCache.entries()) {
      if (now - value.timestamp > this.CACHE_DURATION) {
        this.validationCache.delete(key);
      }
    }
  }
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private metrics = new Map<string, number[]>();
  
  startTiming(label: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (!this.metrics.has(label)) {
        this.metrics.set(label, []);
      }
      
      this.metrics.get(label)!.push(duration);
      
      // Keep only last 100 measurements
      const measurements = this.metrics.get(label)!;
      if (measurements.length > 100) {
        measurements.shift();
      }
    };
  }
  
  getAverageTime(label: string): number {
    const measurements = this.metrics.get(label);
    if (!measurements || measurements.length === 0) {
      return 0;
    }
    
    return measurements.reduce((a, b) => a + b, 0) / measurements.length;
  }
  
  getMetrics(): Record<string, { average: number; count: number; latest: number }> {
    const result: Record<string, { average: number; count: number; latest: number }> = {};
    
    for (const [label, measurements] of this.metrics.entries()) {
      result[label] = {
        average: this.getAverageTime(label),
        count: measurements.length,
        latest: measurements[measurements.length - 1] || 0
      };
    }
    
    return result;
  }
  
  clearMetrics() {
    this.metrics.clear();
  }
}

/**
 * Memory usage optimization
 */
export function useMemoryOptimization() {
  const cleanupFunctions = useRef<(() => void)[]>([]);
  
  const addCleanup = useCallback((cleanup: () => void) => {
    cleanupFunctions.current.push(cleanup);
  }, []);
  
  const cleanup = useCallback(() => {
    cleanupFunctions.current.forEach(fn => fn());
    cleanupFunctions.current = [];
  }, []);
  
  useEffect(() => {
    return cleanup;
  }, [cleanup]);
  
  return { addCleanup, cleanup };
}

/**
 * Optimized image/video thumbnail generation
 */
export class ThumbnailGenerator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }
  
  async generateThumbnail(
    file: File,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      seekTime?: number;
    } = {}
  ): Promise<string> {
    const {
      width = 160,
      height = 90,
      quality = 0.8,
      seekTime = 1
    } = options;
    
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const url = URL.createObjectURL(file);
      
      video.preload = 'metadata';
      video.src = url;
      video.currentTime = seekTime;
      
      video.onseeked = () => {
        try {
          this.canvas.width = width;
          this.canvas.height = height;
          
          this.ctx.drawImage(video, 0, 0, width, height);
          
          const thumbnail = this.canvas.toDataURL('image/jpeg', quality);
          
          URL.revokeObjectURL(url);
          resolve(thumbnail);
        } catch (error) {
          URL.revokeObjectURL(url);
          reject(error);
        }
      };
      
      video.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load video'));
      };
    });
  }
}

// Global instances
export const fileChunker = new FileChunker();
export const optimizedFileReader = OptimizedFileReader.getInstance();
export const optimizedWalletValidator = new OptimizedWalletValidator();
export const performanceMonitor = new PerformanceMonitor();
export const thumbnailGenerator = new ThumbnailGenerator();