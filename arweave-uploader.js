import Arweave from 'arweave';
import { Buffer } from 'buffer';

// Enhanced error types for better categorization
export const ArweaveErrorTypes = {
  NETWORK_ERROR: 'network',
  VALIDATION_ERROR: 'validation',
  BALANCE_ERROR: 'balance',
  UPLOAD_ERROR: 'upload',
  TIMEOUT_ERROR: 'timeout',
  UNKNOWN_ERROR: 'unknown'
};

// Enhanced upload service with comprehensive error handling and progress tracking
export class EnhancedArweaveUploader {
  constructor(options = {}) {
    this.arweave = Arweave.init({
      host: options.host || 'arweave.net',
      port: options.port || 443,
      protocol: options.protocol || 'https',
      timeout: options.timeout || 30000
    });
    
    this.maxRetries = options.maxRetries || 3;
    this.retryDelay = options.retryDelay || 2000;
    this.chunkSize = options.chunkSize || 256 * 1024; // 256KB chunks
  }

  /**
   * Enhanced upload with progress tracking and retry logic
   */
  async uploadToArweave(fileBuffer, arweaveKey, options = {}) {
    const {
      onProgress = () => {},
      onStatusChange = () => {},
      contentType = 'video/mp4',
      tags = {},
      abortSignal = null
    } = options;

    let attempt = 0;
    let lastError = null;

    while (attempt < this.maxRetries) {
      try {
        attempt++;
        
        onStatusChange({
          status: 'preparing',
          attempt,
          maxAttempts: this.maxRetries
        });

        const result = await this._performUpload(
          fileBuffer, 
          arweaveKey, 
          {
            onProgress,
            onStatusChange,
            contentType,
            tags,
            abortSignal,
            attempt
          }
        );

        return result;

      } catch (error) {
        lastError = this._categorizeError(error);
        
        console.error(`Upload attempt ${attempt} failed:`, lastError);
        
        // Don't retry for certain error types
        if (!this._shouldRetry(lastError) || attempt >= this.maxRetries) {
          break;
        }

        // Wait before retry with exponential backoff
        const delay = this.retryDelay * Math.pow(2, attempt - 1);
        onStatusChange({
          status: 'retrying',
          attempt,
          maxAttempts: this.maxRetries,
          retryDelay: delay,
          error: lastError
        });

        await this._delay(delay);
      }
    }

    // All retries failed
    throw this._createEnhancedError(
      lastError?.type || ArweaveErrorTypes.UPLOAD_ERROR,
      `Upload failed after ${this.maxRetries} attempts: ${lastError?.message}`,
      lastError?.details,
      false
    );
  }

  /**
   * Perform the actual upload with detailed progress tracking
   */
  async _performUpload(fileBuffer, arweaveKey, options) {
    const { onProgress, onStatusChange, contentType, tags, abortSignal, attempt } = options;

    try {
      // Check abort signal
      if (abortSignal?.aborted) {
        throw new Error('Upload cancelled by user');
      }

      onStatusChange({ status: 'creating_transaction', attempt });
      onProgress({ percentage: 5, status: 'preparing' });

      // Create transaction
      const transaction = await this.arweave.createTransaction({
        data: Buffer.from(fileBuffer)
      }, arweaveKey);

      if (abortSignal?.aborted) {
        throw new Error('Upload cancelled by user');
      }

      // Add comprehensive tags
      transaction.addTag('Content-Type', contentType);
      transaction.addTag('App-Name', 'NoCensor-TV');
      transaction.addTag('App-Version', '1.0.0');
      transaction.addTag('Upload-Timestamp', new Date().toISOString());
      transaction.addTag('File-Size', fileBuffer.length.toString());
      
      // Add custom tags
      Object.entries(tags).forEach(([key, value]) => {
        transaction.addTag(key, value);
      });

      onProgress({ percentage: 15, status: 'preparing' });

      // Sign transaction
      onStatusChange({ status: 'signing_transaction', attempt });
      await this.arweave.transactions.sign(transaction, arweaveKey);

      if (abortSignal?.aborted) {
        throw new Error('Upload cancelled by user');
      }

      onProgress({ percentage: 25, status: 'uploading' });

      // Upload with progress tracking
      onStatusChange({ status: 'uploading', attempt, transactionId: transaction.id });
      
      const uploader = await this.arweave.transactions.getUploader(transaction);
      let lastProgressUpdate = Date.now();

      while (!uploader.isComplete) {
        if (abortSignal?.aborted) {
          throw new Error('Upload cancelled by user');
        }

        await uploader.uploadChunk();

        // Update progress (25% to 85% for upload)
        const uploadProgress = (uploader.uploadedChunks / uploader.totalChunks) * 60;
        const totalProgress = 25 + uploadProgress;

        // Throttle progress updates to avoid overwhelming UI
        const now = Date.now();
        if (now - lastProgressUpdate > 500) { // Update every 500ms
          onProgress({
            percentage: Math.min(totalProgress, 85),
            status: 'uploading',
            bytesUploaded: uploader.uploadedChunks * uploader.chunkSize,
            totalBytes: fileBuffer.length
          });
          lastProgressUpdate = now;
        }

        // Small delay to prevent overwhelming the network
        await this._delay(50);
      }

      onProgress({ percentage: 90, status: 'confirming' });

      // Verify upload
      onStatusChange({ status: 'confirming', attempt, transactionId: transaction.id });
      await this._waitForConfirmation(transaction.id, onProgress);

      onProgress({ percentage: 100, status: 'completed' });
      onStatusChange({ 
        status: 'completed', 
        attempt, 
        transactionId: transaction.id,
        arweaveUrl: `https://arweave.net/${transaction.id}`
      });

      console.log(`Successfully uploaded to Arweave: https://arweave.net/${transaction.id}`);
      
      return {
        transactionId: transaction.id,
        arweaveUrl: `https://arweave.net/${transaction.id}`,
        fileSize: fileBuffer.length,
        uploadTime: Date.now()
      };

    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  /**
   * Wait for transaction confirmation with timeout
   */
  async _waitForConfirmation(transactionId, onProgress, maxWaitTime = 30000) {
    const startTime = Date.now();
    const checkInterval = 2000; // Check every 2 seconds

    while (Date.now() - startTime < maxWaitTime) {
      try {
        const status = await this.arweave.transactions.getStatus(transactionId);
        
        if (status.status === 200) {
          return; // Confirmed
        }
        
        if (status.status >= 400 && status.status !== 404) {
          throw new Error(`Transaction failed with status: ${status.status}`);
        }

        // Update progress during confirmation
        const elapsed = Date.now() - startTime;
        const confirmationProgress = Math.min((elapsed / maxWaitTime) * 10, 10);
        onProgress({ 
          percentage: 90 + confirmationProgress, 
          status: 'confirming',
          confirmationTime: elapsed
        });

        await this._delay(checkInterval);
        
      } catch (error) {
        if (error.message.includes('Transaction failed')) {
          throw error;
        }
        // Continue waiting for other errors (network issues, etc.)
      }
    }

    // Timeout reached - don't fail the upload, just warn
    console.warn('Transaction confirmation timeout, but upload likely succeeded');
  }

  /**
   * Categorize errors for better handling
   */
  _categorizeError(error) {
    const message = error.message?.toLowerCase() || '';
    
    if (message.includes('cancelled') || message.includes('abort')) {
      return this._createEnhancedError(
        ArweaveErrorTypes.UPLOAD_ERROR,
        'Upload was cancelled',
        error.message,
        false
      );
    }
    
    if (message.includes('network') || message.includes('timeout') || message.includes('fetch')) {
      return this._createEnhancedError(
        ArweaveErrorTypes.NETWORK_ERROR,
        'Network connection error',
        error.message,
        true
      );
    }
    
    if (message.includes('insufficient') || message.includes('balance')) {
      return this._createEnhancedError(
        ArweaveErrorTypes.BALANCE_ERROR,
        'Insufficient wallet balance',
        error.message,
        false
      );
    }
    
    if (message.includes('invalid') || message.includes('malformed')) {
      return this._createEnhancedError(
        ArweaveErrorTypes.VALIDATION_ERROR,
        'Invalid data or wallet key',
        error.message,
        false
      );
    }
    
    return this._createEnhancedError(
      ArweaveErrorTypes.UNKNOWN_ERROR,
      error.message || 'Unknown upload error',
      error.stack,
      true
    );
  }

  /**
   * Create enhanced error object
   */
  _createEnhancedError(type, message, details, recoverable) {
    return {
      type,
      message,
      details,
      recoverable,
      timestamp: new Date().toISOString(),
      suggestedAction: this._getSuggestedAction(type)
    };
  }

  /**
   * Get suggested action for error type
   */
  _getSuggestedAction(errorType) {
    switch (errorType) {
      case ArweaveErrorTypes.NETWORK_ERROR:
        return 'Check your internet connection and try again';
      case ArweaveErrorTypes.BALANCE_ERROR:
        return 'Add more AR tokens to your wallet';
      case ArweaveErrorTypes.VALIDATION_ERROR:
        return 'Check your wallet key and file format';
      case ArweaveErrorTypes.TIMEOUT_ERROR:
        return 'Try again with a smaller file or better connection';
      default:
        return 'Please try again or contact support';
    }
  }

  /**
   * Determine if error should trigger a retry
   */
  _shouldRetry(error) {
    const nonRetryableTypes = [
      ArweaveErrorTypes.VALIDATION_ERROR,
      ArweaveErrorTypes.BALANCE_ERROR
    ];
    
    return !nonRetryableTypes.includes(error.type) && error.recoverable;
  }

  /**
   * Utility delay function
   */
  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get upload cost estimate
   */
  async estimateUploadCost(fileSize) {
    try {
      const dummyData = new Uint8Array(Math.min(fileSize, 1024));
      const transaction = await this.arweave.createTransaction({ data: dummyData });
      const fee = parseInt(transaction.reward);
      
      // Scale fee based on actual file size
      const scaledFee = Math.ceil((fee * fileSize) / dummyData.length);
      const arCost = parseFloat(this.arweave.ar.winstonToAr(scaledFee.toString()));
      
      return {
        winston: scaledFee,
        ar: arCost,
        formattedCost: `${arCost.toFixed(6)} AR`
      };
    } catch (error) {
      throw this._categorizeError(error);
    }
  }

  /**
   * Validate wallet key
   */
  async validateWallet(walletKey) {
    try {
      const address = await this.arweave.wallets.jwkToAddress(walletKey);
      const balance = await this.arweave.wallets.getBalance(address);
      
      return {
        isValid: true,
        address,
        balance: parseFloat(this.arweave.ar.winstonToAr(balance)),
        formattedBalance: `${parseFloat(this.arweave.ar.winstonToAr(balance)).toFixed(4)} AR`
      };
    } catch (error) {
      return {
        isValid: false,
        error: this._categorizeError(error)
      };
    }
  }
}

// Production-ready function for real Arweave uploads
export async function uploadToArweave(fileBuffer, arweaveKey, options = {}) {
  // Force production mode - always use real Arweave uploads
  console.log('🚀 Production Mode: Using real Arweave uploads');
  
  const uploader = new EnhancedArweaveUploader();
  const result = await uploader.uploadToArweave(fileBuffer, arweaveKey, options);
  return result.transactionId;
}
