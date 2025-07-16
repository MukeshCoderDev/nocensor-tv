// Core Arweave wallet key interface based on JWK format
export interface ArweaveWalletKey {
  kty: string;  // Key type, should be "RSA"
  n: string;    // Modulus
  e: string;    // Exponent
  d: string;    // Private exponent
  p: string;    // First prime factor
  q: string;    // Second prime factor
  dp: string;   // First factor CRT exponent
  dq: string;   // Second factor CRT exponent
  qi: string;   // First CRT coefficient
}

// Wallet validation result interface
export interface WalletValidationResult {
  isValid: boolean;
  error?: string;
  walletAddress?: string;
}

// Wallet information interface
export interface WalletInfo {
  address: string;
  formattedAddress: string;
  balance: number;
  formattedBalance: string;
}

// Cost estimation interface
export interface CostEstimate {
  estimatedCost: number;
  formattedCost: string;
  currency: 'AR' | 'USD';
  confidence: 'high' | 'medium' | 'low';
  lastUpdated: Date;
}

// Error handling interfaces
export interface ArweaveError {
  type: 'validation' | 'network' | 'balance' | 'upload' | 'unknown';
  message: string;
  details?: string;
  recoverable: boolean;
  suggestedAction?: string;
}

export interface WalletError extends ArweaveError {
  type: 'validation' | 'network' | 'balance';
}

// Upload progress interface
export interface UploadProgress {
  percentage: number;
  status: 'idle' | 'preparing' | 'uploading' | 'confirming' | 'completed' | 'failed';
  bytesUploaded: number;
  totalBytes: number;
  transactionId?: string;
  estimatedTimeRemaining?: number;
}

// Component prop interfaces
export interface ArweaveUploaderProps {
  onUploadComplete?: (transactionId: string) => void;
  onError?: (error: ArweaveError) => void;
  className?: string;
}

export interface ArweaveUploaderState {
  currentStep: 1 | 2 | 3;
  selectedVideo: File | null;
  walletKey: ArweaveWalletKey | null;
  uploadProgress: UploadProgress;
  isProcessing: boolean;
  error: ArweaveError | null;
}

export interface VideoSelectorProps {
  onVideoSelected: (file: File) => void;
  onError: (error: ArweaveError) => void;
  selectedVideo: File | null;
  isDisabled?: boolean;
}

export interface WalletKeyLoaderProps {
  onWalletLoaded: (wallet: ArweaveWalletKey) => void;
  onError: (error: WalletError) => void;
  isDisabled?: boolean;
  selectedVideo: File | null;
}

export interface WalletKeyLoaderState {
  isValidating: boolean;
  walletInfo: WalletInfo | null;
  validationError: string | null;
  showHelp: boolean;
  costEstimate: CostEstimate | null;
}

export interface UploadProcessorProps {
  video: File;
  walletKey: ArweaveWalletKey;
  onUploadComplete: (transactionId: string) => void;
  onError: (error: ArweaveError) => void;
  onCancel: () => void;
}

export interface ProgressIndicatorProps {
  currentStep: 1 | 2 | 3;
  uploadProgress?: UploadProgress;
  className?: string;
}

export interface ErrorDisplayProps {
  error: ArweaveError;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export interface HelpTooltipProps {
  content: string;
  title?: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
}

// File validation interfaces
export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  fileInfo?: {
    size: number;
    type: string;
    duration?: number;
    dimensions?: {
      width: number;
      height: number;
    };
  };
}

export interface FileValidationOptions {
  maxSize?: number; // in bytes
  allowedTypes?: string[];
  maxDuration?: number; // in seconds
}

// Hook return types
export interface UseArweaveWalletReturn {
  walletKey: ArweaveWalletKey | null;
  walletInfo: WalletInfo | null;
  isLoading: boolean;
  error: WalletError | null;
  loadWallet: (file: File) => Promise<void>;
  clearWallet: () => void;
  validateWallet: (wallet: ArweaveWalletKey) => Promise<WalletValidationResult>;
  refreshWalletInfo: () => Promise<void>;
  checkSufficientBalance: (requiredAmount: number) => Promise<{
    sufficient: boolean;
    balance: number;
    shortfall?: number;
  }>;
}

export interface UseFileValidationReturn {
  validateFile: (file: File, options?: FileValidationOptions) => Promise<FileValidationResult>;
  isValidating: boolean;
  lastValidation: FileValidationResult | null;
}

export interface UseUploadProgressReturn {
  progress: UploadProgress;
  startUpload: (file: File, wallet: ArweaveWalletKey) => Promise<string>;
  cancelUpload: () => void;
  resetProgress: () => void;
  retryUpload: (file: File, wallet: ArweaveWalletKey) => Promise<string>;
}

// Service method types
export type WalletValidationFunction = (keyFile: File) => Promise<WalletValidationResult>;
export type WalletInfoFunction = (wallet: ArweaveWalletKey) => Promise<WalletInfo>;
export type BalanceCheckFunction = (wallet: ArweaveWalletKey) => Promise<number>;
export type CostEstimationFunction = (fileSize: number) => Promise<CostEstimate>;
export type UploadFunction = (file: File, wallet: ArweaveWalletKey, onProgress?: (progress: UploadProgress) => void) => Promise<string>;

// Utility types
export type StepNumber = 1 | 2 | 3;
export type UploadStatus = UploadProgress['status'];
export type ErrorType = ArweaveError['type'];
export type Currency = CostEstimate['currency'];
export type Confidence = CostEstimate['confidence'];