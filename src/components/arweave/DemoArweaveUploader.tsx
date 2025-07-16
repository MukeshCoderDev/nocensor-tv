/**
 * Demo upload service that simulates real Arweave uploads
 * This provides a realistic experience without requiring AR tokens
 */
export class DemoArweaveUploader {
  async uploadToArweave(fileBuffer: ArrayBuffer, walletKey: any, options: any = {}) {
    const { onProgress = () => {}, onStatusChange = () => {} } = options;
    
    // Simulate upload process with realistic timing
    onStatusChange({ status: 'preparing', attempt: 1 });
    onProgress({ percentage: 5, status: 'preparing' });
    await this.delay(800);

    onStatusChange({ status: 'creating_transaction' });
    onProgress({ percentage: 15, status: 'preparing' });
    await this.delay(600);

    onStatusChange({ status: 'signing_transaction' });
    onProgress({ percentage: 25, status: 'preparing' });
    await this.delay(400);

    // Simulate upload progress
    const transactionId = this.generateDemoTxId();
    onStatusChange({ status: 'uploading', transactionId });
    
    for (let i = 30; i <= 85; i += 3) {
      onProgress({ 
        percentage: i, 
        status: 'uploading',
        bytesUploaded: Math.floor((fileBuffer.byteLength * i) / 100),
        totalBytes: fileBuffer.byteLength,
        estimatedTimeRemaining: Math.max(0, Math.floor((100 - i) * 0.5))
      });
      await this.delay(150);
    }

    // Simulate confirmation
    onStatusChange({ status: 'confirming', transactionId });
    onProgress({ percentage: 95, status: 'confirming' });
    await this.delay(1200);

    onProgress({ percentage: 100, status: 'completed', transactionId });
    onStatusChange({ 
      status: 'completed', 
      transactionId,
      arweaveUrl: `https://arweave.net/${transactionId}`
    });

    return {
      transactionId,
      arweaveUrl: `https://arweave.net/${transactionId}`,
      fileSize: fileBuffer.byteLength,
      uploadTime: Date.now()
    };
  }

  async estimateUploadCost(fileSize: number) {
    await this.delay(300);
    
    const baseCost = 0.001;
    const scaledCost = Math.max(0.001, baseCost * (fileSize / (10 * 1024 * 1024)));
    
    return {
      winston: Math.floor(scaledCost * 1000000000000),
      ar: scaledCost,
      formattedCost: `${scaledCost.toFixed(6)} AR`
    };
  }

  async validateWallet(walletKey: any) {
    await this.delay(500);
    
    return {
      isValid: true,
      address: this.generateDemoAddress(),
      balance: 5.0,
      formattedBalance: '5.0000 AR'
    };
  }

  private generateDemoTxId(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let result = 'DEMO_';
    for (let i = 0; i < 38; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private generateDemoAddress(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
    let result = '';
    for (let i = 0; i < 43; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

/**
 * Generate demo wallet for testing
 */
export function generateDemoWallet() {
  return {
    kty: 'RSA',
    n: 'demo-modulus-for-nocensor-tv-testing-showcase-not-real-wallet',
    e: 'AQAB',
    d: 'demo-private-exponent-for-nocensor-tv-testing-showcase',
    p: 'demo-first-prime-factor-for-testing-showcase',
    q: 'demo-second-prime-factor-for-testing-showcase',
    dp: 'demo-first-factor-crt-exponent-for-testing',
    dq: 'demo-second-factor-crt-exponent-for-testing',
    qi: 'demo-first-crt-coefficient-for-testing'
  };
}