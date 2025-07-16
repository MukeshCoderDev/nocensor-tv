import { useState, useCallback, useRef } from 'react';
import { 
  UploadProgress, 
  ArweaveWalletKey, 
  UseUploadProgressReturn,
  ArweaveError 
} from '../types/ArweaveTypes';
import Arweave from 'arweave';

/**
 * Custom hook for tracking Arweave upload progress
 */
export function useUploadProgress(): UseUploadProgressReturn {
  const [progress, setProgress] = useState<UploadProgress>({
    percentage: 0,
    status: 'idle',
    bytesUploaded: 0,
    totalBytes: 0
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const arweave = useRef(Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https'
  }));

  /**
   * Starts the upload process with progress tracking
   */
  const startUpload = useCallback(async (
    file: File, 
    wallet: ArweaveWalletKey
  ): Promise<string> => {
    // Create new abort controller for this upload
    abortControllerRef.current = new AbortController();
    
    setProgress({
      percentage: 0,
      status: 'preparing',
      bytesUploaded: 0,
      totalBytes: file.size,
      estimatedTimeRemaining: undefined
    });

    try {
      // Step 1: Prepare transaction
      const fileBuffer = await readFileAsArrayBuffer(file);
      
      if (abortControllerRef.current.signal.aborted) {
        throw new Error('Upload cancelled');
      }

      setProgress(prev => ({
        ...prev,
        percentage: 10,
        status: 'preparing'
      }));

      // Step 2: Create transaction
      const transaction = await arweave.current.createTransaction({
        data: fileBuffer
      }, wallet);

      if (abortControllerRef.current.signal.aborted) {
        throw new Error('Upload cancelled');
      }

      // Add tags for video metadata
      transaction.addTag('Content-Type', file.type);
      transaction.addTag('File-Name', file.name);
      transaction.addTag('App-Name', 'NoCensor-TV');
      transaction.addTag('App-Version', '1.0.0');
      transaction.addTag('Upload-Timestamp', new Date().toISOString());

      setProgress(prev => ({
        ...prev,
        percentage: 20,
        status: 'preparing'
      }));

      // Step 3: Sign transaction
      await arweave.current.transactions.sign(transaction, wallet);

      if (abortControllerRef.current.signal.aborted) {
        throw new Error('Upload cancelled');
      }

      setProgress(prev => ({
        ...prev,
        percentage: 30,
        status: 'uploading'
      }));

      // Step 4: Upload with progress tracking
      const startTime = Date.now();
      let lastProgressTime = startTime;
      let lastBytesUploaded = 0;

      const uploader = await arweave.current.transactions.getUploader(transaction);

      while (!uploader.isComplete) {
        if (abortControllerRef.current.signal.aborted) {
          throw new Error('Upload cancelled');
        }

        await uploader.uploadChunk();

        const currentTime = Date.now();
        const bytesUploaded = uploader.uploadedChunks * uploader.chunkSize;
        const percentage = Math.min(30 + (bytesUploaded / file.size) * 60, 90);

        // Calculate estimated time remaining
        let estimatedTimeRemaining: number | undefined;
        if (currentTime - lastProgressTime > 1000) { // Update every second
          const bytesPerSecond = (bytesUploaded - lastBytesUploaded) / ((currentTime - lastProgressTime) / 1000);
          const remainingBytes = file.size - bytesUploaded;
          estimatedTimeRemaining = bytesPerSecond > 0 ? Math.ceil(remainingBytes / bytesPerSecond) : undefined;
          
          lastProgressTime = currentTime;
          lastBytesUploaded = bytesUploaded;
        }

        setProgress(prev => ({
          ...prev,
          percentage,
          bytesUploaded,
          estimatedTimeRemaining
        }));

        // Small delay to prevent overwhelming the UI
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      if (abortControllerRef.current.signal.aborted) {
        throw new Error('Upload cancelled');
      }

      setProgress(prev => ({
        ...prev,
        percentage: 95,
        status: 'confirming'
      }));

      // Step 5: Wait for network confirmation
      await waitForConfirmation(transaction.id);

      setProgress({
        percentage: 100,
        status: 'completed',
        bytesUploaded: file.size,
        totalBytes: file.size,
        transactionId: transaction.id
      });

      return transaction.id;

    } catch (error) {
      console.error('Upload error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown upload error';
      
      setProgress(prev => ({
        ...prev,
        status: 'failed'
      }));

      if (errorMessage === 'Upload cancelled') {
        throw createUploadError('upload', 'Upload was cancelled', 'You can restart the upload if needed', true);
      }

      throw createUploadError('upload', `Upload failed: ${errorMessage}`, 'Please try again', true);
    }
  }, []);

  /**
   * Cancels the current upload
   */
  const cancelUpload = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setProgress(prev => ({
      ...prev,
      status: 'failed'
    }));
  }, []);

  /**
   * Resets progress to initial state
   */
  const resetProgress = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setProgress({
      percentage: 0,
      status: 'idle',
      bytesUploaded: 0,
      totalBytes: 0
    });
  }, []);

  /**
   * Retries a failed upload
   */
  const retryUpload = useCallback(async (
    file: File, 
    wallet: ArweaveWalletKey
  ): Promise<string> => {
    resetProgress();
    return startUpload(file, wallet);
  }, [startUpload, resetProgress]);

  return {
    progress,
    startUpload,
    cancelUpload,
    resetProgress,
    retryUpload
  };
}

/**
 * Hook for simpler upload progress without full control
 */
export function useSimpleUploadProgress() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadWithProgress = useCallback(async (
    file: File,
    wallet: ArweaveWalletKey,
    onProgress?: (progress: number) => void
  ): Promise<string> => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const arweave = Arweave.init({
        host: 'arweave.net',
        port: 443,
        protocol: 'https'
      });

      // Create and sign transaction
      const fileBuffer = await readFileAsArrayBuffer(file);
      const transaction = await arweave.createTransaction({ data: fileBuffer }, wallet);
      
      transaction.addTag('Content-Type', file.type);
      transaction.addTag('App-Name', 'NoCensor-TV');
      
      await arweave.transactions.sign(transaction, wallet);

      // Upload with basic progress tracking
      const uploader = await arweave.transactions.getUploader(transaction);

      while (!uploader.isComplete) {
        await uploader.uploadChunk();
        
        const progress = Math.floor((uploader.uploadedChunks / uploader.totalChunks) * 100);
        setUploadProgress(progress);
        
        if (onProgress) {
          onProgress(progress);
        }
      }

      setUploadProgress(100);
      return transaction.id;

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Upload failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, []);

  return {
    uploadWithProgress,
    isUploading,
    uploadProgress,
    error,
    clearError: () => setError(null)
  };
}

// Helper functions

/**
 * Reads a file as ArrayBuffer
 */
function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        resolve(event.target.result as ArrayBuffer);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Waits for transaction confirmation on the Arweave network
 */
async function waitForConfirmation(transactionId: string, maxAttempts: number = 10): Promise<void> {
  const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https'
  });

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const status = await arweave.transactions.getStatus(transactionId);
      
      if (status.status === 200) {
        return; // Transaction confirmed
      }
      
      if (status.status === 404) {
        // Transaction not yet propagated, wait and retry
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      }
      
      // Other status codes indicate potential issues
      if (status.status >= 400) {
        throw new Error(`Transaction failed with status: ${status.status}`);
      }
      
    } catch (error) {
      if (attempt === maxAttempts - 1) {
        // Last attempt failed
        console.warn('Transaction confirmation timeout, but upload may still succeed');
        return; // Don't fail the entire upload for confirmation timeout
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

/**
 * Creates a standardized upload error
 */
function createUploadError(
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