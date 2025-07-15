// Arweave Wallet Key Interface
export interface ArweaveWalletKey {
  kty: string;
  n: string;
  e: string;
  d: string;
  p: string;
  q: string;
  dp: string;
  dq: string;
  qi: string;
}

// Wallet Validation Result
export interface WalletValidationResult {
  isValid: boolean;
  error?: string;
  walletAddress?: string;
  keyData?: ArweaveWalletKey;
}

// Wallet Information
export interface WalletInfo {
  address: string;
  formattedAddress: string;
  balance: number;
  formattedBalance: string;
}

// Cost Estimation
export interface CostEstimate {
  estimatedCost: number;
  formattedCost: string;
  currency: 'AR' | 'USD';
  confidence: 'high' | 'medium' | 'low';
  lastUpdated: Date;
}

// Error Types
export interface ArweaveError {
  type: 'validation' | 'network' | 'balance' | 'upload' | 'unknown';
  message: string;
  details?: string;
  recoverable: boolean;
  suggestedAction?: string;
}

// Upload Progress
export interface UploadProgress {
  progress: number;
  status: string;
  bytesUploaded: number;
  totalBytes: number;
  estimatedTimeRemaining?: number;
}

// Component State Interfaces
export interface ArweaveUploaderState {
  currentStep: 1 | 2 | 3;
  selectedVideo: File | null;
  walletKey: ArweaveWalletKey | null;
  walletInfo: WalletInfo | null;
  uploadProgress: number;
  isProcessing: boolean;
  error: ArweaveError | null;
  costEstimate: CostEstimate | null;
}

// File Validation Result
export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  fileInfo?: {
    name: string;
    size: number;
    type: string;
    duration?: number;
  };
}