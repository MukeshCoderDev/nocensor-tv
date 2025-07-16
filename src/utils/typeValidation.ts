import { ArweaveWalletKey, FileValidationResult, FileValidationOptions } from '../types/ArweaveTypes';

/**
 * Validates if an object matches the ArweaveWalletKey interface structure
 */
export function isValidArweaveWalletKey(obj: any): obj is ArweaveWalletKey {
  if (!obj || typeof obj !== 'object') {
    return false;
  }

  const requiredFields = ['kty', 'n', 'e', 'd', 'p', 'q', 'dp', 'dq', 'qi'];
  
  for (const field of requiredFields) {
    if (!(field in obj) || typeof obj[field] !== 'string' || obj[field].length === 0) {
      return false;
    }
  }

  // Validate key type
  if (obj.kty !== 'RSA') {
    return false;
  }

  return true;
}

/**
 * Validates file format and basic properties
 */
export function validateVideoFile(file: File, options: FileValidationOptions = {}): FileValidationResult {
  const {
    maxSize = 500 * 1024 * 1024, // 500MB default
    allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/avi', 'video/mov']
  } = options;

  // Check file size
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `File size (${formatFileSize(file.size)}) exceeds maximum allowed size (${formatFileSize(maxSize)})`
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type "${file.type}" is not supported. Allowed types: ${allowedTypes.join(', ')}`
    };
  }

  // Check if file is empty
  if (file.size === 0) {
    return {
      isValid: false,
      error: 'File is empty'
    };
  }

  return {
    isValid: true,
    fileInfo: {
      size: file.size,
      type: file.type
    }
  };
}

/**
 * Validates wallet key file format
 */
export function validateWalletKeyFile(file: File): { isValid: boolean; error?: string } {
  // Check file extension
  if (!file.name.toLowerCase().endsWith('.json')) {
    return {
      isValid: false,
      error: 'Wallet key file must be a JSON file (.json extension)'
    };
  }

  // Check file size (wallet keys should be small)
  if (file.size > 10 * 1024) { // 10KB max
    return {
      isValid: false,
      error: 'Wallet key file is too large. Expected size is less than 10KB'
    };
  }

  if (file.size === 0) {
    return {
      isValid: false,
      error: 'Wallet key file is empty'
    };
  }

  return { isValid: true };
}

/**
 * Formats file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Validates wallet address format
 */
export function isValidArweaveAddress(address: string): boolean {
  // Arweave addresses are 43 characters long and base64url encoded
  const addressRegex = /^[A-Za-z0-9_-]{43}$/;
  return addressRegex.test(address);
}

/**
 * Formats wallet address for display (truncated)
 */
export function formatWalletAddress(address: string): string {
  if (!address || address.length < 10) {
    return address;
  }
  
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Validates transaction ID format
 */
export function isValidTransactionId(txId: string): boolean {
  // Arweave transaction IDs are 43 characters long and base64url encoded
  const txIdRegex = /^[A-Za-z0-9_-]{43}$/;
  return txIdRegex.test(txId);
}