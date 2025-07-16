import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ArweaveUploaderContainer } from '../ArweaveUploaderContainer';

// Mock the child components
jest.mock('../VideoSelector', () => ({
  VideoSelector: ({ onVideoSelected, onError }: any) => (
    <div data-testid="video-selector">
      <button onClick={() => onVideoSelected(new File(['test'], 'test.mp4', { type: 'video/mp4' }))}>
        Select Video
      </button>
      <button onClick={() => onError({ type: 'validation', message: 'Test error', recoverable: true })}>
        Trigger Error
      </button>
    </div>
  )
}));

jest.mock('../WalletKeyLoader', () => ({
  WalletKeyLoader: ({ onWalletLoaded, onError }: any) => (
    <div data-testid="wallet-loader">
      <button onClick={() => onWalletLoaded({ kty: 'RSA', n: 'test' })}>
        Load Wallet
      </button>
      <button onClick={() => onError({ type: 'validation', message: 'Wallet error', recoverable: true })}>
        Trigger Wallet Error
      </button>
    </div>
  )
}));

jest.mock('../UploadProcessor', () => ({
  UploadProcessor: ({ onUploadComplete, onError, onCancel }: any) => (
    <div data-testid="upload-processor">
      <button onClick={() => onUploadComplete('test-transaction-id')}>
        Complete Upload
      </button>
      <button onClick={() => onError({ type: 'upload', message: 'Upload error', recoverable: true })}>
        Trigger Upload Error
      </button>
      <button onClick={onCancel}>
        Cancel Upload
      </button>
    </div>
  )
}));

jest.mock('../ProgressIndicator', () => ({
  ProgressIndicator: ({ currentStep }: any) => (
    <div data-testid="progress-indicator">Step {currentStep}</div>
  )
}));

jest.mock('../ErrorDisplay', () => ({
  ErrorDisplay: ({ error, onDismiss }: any) => (
    <div data-testid="error-display">
      {error.message}
      <button onClick={onDismiss}>Dismiss</button>
    </div>
  ),
  ErrorToast: ({ error, onDismiss }: any) => (
    <div data-testid="error-toast">
      {error.message}
      <button onClick={onDismiss}>Dismiss Toast</button>
    </div>
  )
}));

jest.mock('../HelpTooltip', () => ({
  UploadProcessHelp: () => <div data-testid="help-section">Help Content</div>
}));

describe('ArweaveUploaderContainer', () => {
  it('should render initial state correctly', () => {
    render(<ArweaveUploaderContainer />);
    
    expect(screen.getByText('Decentralized Arweave Uploader')).toBeInTheDocument();
    expect(screen.getByTestId('progress-indicator')).toHaveTextContent('Step 1');
    expect(screen.getByTestId('video-selector')).toBeInTheDocument();
    expect(screen.getByTestId('help-section')).toBeInTheDocument();
  });

  it('should progress through steps correctly', async () => {
    render(<ArweaveUploaderContainer />);
    
    // Step 1: Select video
    fireEvent.click(screen.getByText('Select Video'));
    
    await waitFor(() => {
      expect(screen.getByTestId('progress-indicator')).toHaveTextContent('Step 2');
      expect(screen.getByTestId('wallet-loader')).toBeInTheDocument();
    });

    // Step 2: Load wallet
    fireEvent.click(screen.getByText('Load Wallet'));
    
    await waitFor(() => {
      expect(screen.getByTestId('progress-indicator')).toHaveTextContent('Step 3');
      expect(screen.getByTestId('upload-processor')).toBeInTheDocument();
    });
  });

  it('should handle upload completion', async () => {
    const onUploadComplete = jest.fn();
    render(<ArweaveUploaderContainer onUploadComplete={onUploadComplete} />);
    
    // Progress through all steps
    fireEvent.click(screen.getByText('Select Video'));
    await waitFor(() => screen.getByTestId('wallet-loader'));
    
    fireEvent.click(screen.getByText('Load Wallet'));
    await waitFor(() => screen.getByTestId('upload-processor'));
    
    // Complete upload
    fireEvent.click(screen.getByText('Complete Upload'));
    
    await waitFor(() => {
      expect(onUploadComplete).toHaveBeenCalledWith('test-transaction-id');
    });
  });

  it('should handle errors correctly', async () => {
    const onError = jest.fn();
    render(<ArweaveUploaderContainer onError={onError} />);
    
    // Trigger error in step 1
    fireEvent.click(screen.getByText('Trigger Error'));
    
    await waitFor(() => {
      expect(screen.getByTestId('error-toast')).toHaveTextContent('Test error');
      expect(onError).toHaveBeenCalledWith({
        type: 'validation',
        message: 'Test error',
        recoverable: true
      });
    });
  });

  it('should allow step navigation when conditions are met', async () => {
    render(<ArweaveUploaderContainer />);
    
    // Initially, only step 1 should be clickable
    const step2Button = screen.getByText('2. Load Wallet');
    const step3Button = screen.getByText('3. Upload');
    
    expect(step2Button).toHaveClass('cursor-not-allowed');
    expect(step3Button).toHaveClass('cursor-not-allowed');
    
    // After selecting video, step 2 should be clickable
    fireEvent.click(screen.getByText('Select Video'));
    
    await waitFor(() => {
      expect(step2Button).not.toHaveClass('cursor-not-allowed');
      expect(step3Button).toHaveClass('cursor-not-allowed');
    });
  });

  it('should handle upload cancellation', async () => {
    render(<ArweaveUploaderContainer />);
    
    // Progress to upload step
    fireEvent.click(screen.getByText('Select Video'));
    await waitFor(() => screen.getByTestId('wallet-loader'));
    
    fireEvent.click(screen.getByText('Load Wallet'));
    await waitFor(() => screen.getByTestId('upload-processor'));
    
    // Cancel upload
    fireEvent.click(screen.getByText('Cancel Upload'));
    
    await waitFor(() => {
      expect(screen.getByTestId('progress-indicator')).toHaveTextContent('Step 2');
      expect(screen.getByTestId('wallet-loader')).toBeInTheDocument();
    });
  });

  it('should handle reset functionality', async () => {
    render(<ArweaveUploaderContainer />);
    
    // Progress through steps
    fireEvent.click(screen.getByText('Select Video'));
    await waitFor(() => screen.getByTestId('wallet-loader'));
    
    // Reset
    fireEvent.click(screen.getByText('Reset'));
    
    await waitFor(() => {
      expect(screen.getByTestId('progress-indicator')).toHaveTextContent('Step 1');
      expect(screen.getByTestId('video-selector')).toBeInTheDocument();
    });
  });

  it('should dismiss errors correctly', async () => {
    render(<ArweaveUploaderContainer />);
    
    // Trigger error
    fireEvent.click(screen.getByText('Trigger Error'));
    
    await waitFor(() => {
      expect(screen.getByTestId('error-toast')).toBeInTheDocument();
    });
    
    // Dismiss toast
    fireEvent.click(screen.getByText('Dismiss Toast'));
    
    await waitFor(() => {
      expect(screen.queryByTestId('error-toast')).not.toBeInTheDocument();
    });
  });

  it('should apply custom className', () => {
    const { container } = render(<ArweaveUploaderContainer className="custom-class" />);
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
});