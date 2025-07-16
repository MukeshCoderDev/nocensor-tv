import { Page, expect } from '@playwright/test';
import path from 'path';

/**
 * Test data and constants
 */
export const TEST_DATA = {
  VIDEO_PATH: path.join(__dirname, '..', 'fixtures', 'test-video.mp4'),
  LARGE_VIDEO_PATH: path.join(__dirname, '..', 'fixtures', 'large-test-video.mp4'),
  WALLET_PATH: path.join(__dirname, '..', 'fixtures', 'test-wallet.json'),
  INVALID_WALLET_PATH: path.join(__dirname, '..', 'fixtures', 'invalid-wallet.json'),
  INVALID_FILE_PATH: path.join(__dirname, '..', 'fixtures', 'test-document.pdf'),
  
  SELECTORS: {
    // Main container
    UPLOADER: '[data-testid="arweave-uploader"]',
    STEP_INDICATOR: '[data-testid="step-indicator"]',
    
    // Video selection
    VIDEO_SELECTOR: '[data-testid="video-selector"]',
    VIDEO_DROP_ZONE: '[data-testid="video-drop-zone"]',
    VIDEO_INPUT: 'input[type="file"][accept="video/*"]',
    VIDEO_SELECTED: '[data-testid="video-selected"]',
    VIDEO_PREVIEW: '[data-testid="video-preview"]',
    VIDEO_METADATA: '[data-testid="video-metadata"]',
    VIDEO_HELP_ICON: '[data-testid="video-help-icon"]',
    VIDEO_HELP_TOOLTIP: '[data-testid="video-help-tooltip"]',
    
    // Wallet loading
    WALLET_LOADER: '[data-testid="wallet-loader"]',
    WALLET_INPUT: 'input[type="file"][accept=".json"]',
    WALLET_LOADED: '[data-testid="wallet-loaded"]',
    WALLET_INFO: '[data-testid="wallet-info"]',
    WALLET_ADDRESS: '[data-testid="wallet-address"]',
    WALLET_BALANCE: '[data-testid="wallet-balance"]',
    WALLET_ERROR: '[data-testid="wallet-error"]',
    WALLET_HELP_ICON: '[data-testid="wallet-help-icon"]',
    WALLET_HELP_TOOLTIP: '[data-testid="wallet-help-tooltip"]',
    
    // Upload processing
    UPLOAD_PROCESSOR: '[data-testid="upload-processor"]',
    COST_ESTIMATE: '[data-testid="cost-estimate"]',
    CONFIRM_UPLOAD_BUTTON: '[data-testid="confirm-upload-button"]',
    CANCEL_UPLOAD_BUTTON: '[data-testid="cancel-upload-button"]',
    UPLOAD_PROGRESS: '[data-testid="upload-progress"]',
    PROGRESS_BAR: '[data-testid="progress-bar"]',
    PROGRESS_PERCENTAGE: '[data-testid="progress-percentage"]',
    UPLOAD_COMPLETE: '[data-testid="upload-complete"]',
    UPLOAD_SUCCESS: '[data-testid="upload-success"]',
    UPLOAD_CANCELLED: '[data-testid="upload-cancelled"]',
    TRANSACTION_ID: '[data-testid="transaction-id"]',
    ARWEAVE_LINK: '[data-testid="arweave-link"]',
    
    // Error handling
    ERROR_MESSAGE: '[data-testid="error-message"]',
    ERROR_NOTIFICATION: '[data-testid="error-notification"]',
    SUCCESS_NOTIFICATION: '[data-testid="success-notification"]',
    NETWORK_ERROR: '[data-testid="network-error"]',
    INSUFFICIENT_BALANCE: '[data-testid="insufficient-balance"]',
    BALANCE_WARNING: '[data-testid="balance-warning"]',
    RETRY_BUTTON: '[data-testid="retry-button"]',
    
    // Navigation
    STEP_1_NAV: '[data-testid="step-1-nav"]',
    STEP_2_NAV: '[data-testid="step-2-nav"]',
    STEP_3_NAV: '[data-testid="step-3-nav"]',
    
    // Help
    HELP_EXPAND_BUTTON: '[data-testid="help-expand-button"]',
    HELP_CONTENT: '[data-testid="help-content"]'
  },
  
  TIMEOUTS: {
    SHORT: 5000,
    MEDIUM: 10000,
    LONG: 30000,
    UPLOAD: 60000
  }
};

/**
 * Page object for Arweave Uploader
 */
export class ArweaveUploaderPage {
  constructor(private page: Page) {}

  async navigateToUploader() {
    await this.page.goto('/studio/upload');
    await this.page.waitForSelector(TEST_DATA.SELECTORS.UPLOADER, { 
      timeout: TEST_DATA.TIMEOUTS.MEDIUM 
    });
  }

  async selectVideo(videoPath: string = TEST_DATA.VIDEO_PATH) {
    const fileInput = this.page.locator(TEST_DATA.SELECTORS.VIDEO_INPUT);
    await fileInput.setInputFiles(videoPath);
    await this.page.waitForSelector(TEST_DATA.SELECTORS.VIDEO_SELECTED, { 
      timeout: TEST_DATA.TIMEOUTS.SHORT 
    });
  }

  async loadWallet(walletPath: string = TEST_DATA.WALLET_PATH) {
    const walletInput = this.page.locator(TEST_DATA.SELECTORS.WALLET_INPUT);
    await walletInput.setInputFiles(walletPath);
    await this.page.waitForSelector(TEST_DATA.SELECTORS.WALLET_LOADED, { 
      timeout: TEST_DATA.TIMEOUTS.SHORT 
    });
  }

  async confirmUpload() {
    await this.page.click(TEST_DATA.SELECTORS.CONFIRM_UPLOAD_BUTTON);
  }

  async cancelUpload() {
    await this.page.click(TEST_DATA.SELECTORS.CANCEL_UPLOAD_BUTTON);
  }

  async waitForUploadComplete() {
    await this.page.waitForSelector(TEST_DATA.SELECTORS.UPLOAD_COMPLETE, { 
      timeout: TEST_DATA.TIMEOUTS.UPLOAD 
    });
  }

  async getCurrentStep(): Promise<number> {
    const stepText = await this.page.textContent(TEST_DATA.SELECTORS.STEP_INDICATOR);
    const match = stepText?.match(/Step (\d)/);
    return match ? parseInt(match[1]) : 1;
  }

  async getProgressPercentage(): Promise<number> {
    const progressText = await this.page.textContent(TEST_DATA.SELECTORS.PROGRESS_PERCENTAGE);
    const match = progressText?.match(/(\d+)%/);
    return match ? parseInt(match[1]) : 0;
  }

  async getTransactionId(): Promise<string | null> {
    return await this.page.textContent(TEST_DATA.SELECTORS.TRANSACTION_ID);
  }

  async hasError(): Promise<boolean> {
    return await this.page.isVisible(TEST_DATA.SELECTORS.ERROR_MESSAGE);
  }

  async getErrorMessage(): Promise<string | null> {
    return await this.page.textContent(TEST_DATA.SELECTORS.ERROR_MESSAGE);
  }

  async isUploadButtonDisabled(): Promise<boolean> {
    return await this.page.isDisabled(TEST_DATA.SELECTORS.CONFIRM_UPLOAD_BUTTON);
  }

  async navigateToStep(step: 1 | 2 | 3) {
    const selector = step === 1 ? TEST_DATA.SELECTORS.STEP_1_NAV :
                    step === 2 ? TEST_DATA.SELECTORS.STEP_2_NAV :
                    TEST_DATA.SELECTORS.STEP_3_NAV;
    await this.page.click(selector);
  }

  async expandHelp() {
    await this.page.click(TEST_DATA.SELECTORS.HELP_EXPAND_BUTTON);
  }

  async hoverVideoHelp() {
    await this.page.hover(TEST_DATA.SELECTORS.VIDEO_HELP_ICON);
  }

  async hoverWalletHelp() {
    await this.page.hover(TEST_DATA.SELECTORS.WALLET_HELP_ICON);
  }
}

/**
 * Mock Arweave network responses
 */
export async function setupArweaveMocks(page: Page, options: {
  walletBalance?: string;
  networkFailure?: boolean;
  transactionStatus?: number;
} = {}) {
  const {
    walletBalance = '1000000000000', // 1 AR in winston
    networkFailure = false,
    transactionStatus = 200
  } = options;

  if (networkFailure) {
    await page.route('**/arweave.net/**', route => {
      route.abort('failed');
    });
  } else {
    await page.route('**/arweave.net/**', route => {
      const url = route.request().url();
      
      if (url.includes('/tx/')) {
        // Mock transaction status
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ status: transactionStatus })
        });
      } else if (url.includes('/wallet/')) {
        // Mock wallet balance
        route.fulfill({
          status: 200,
          contentType: 'text/plain',
          body: walletBalance
        });
      } else {
        route.continue();
      }
    });
  }
}

/**
 * Assertion helpers
 */
export class ArweaveAssertions {
  constructor(private page: Page) {}

  async expectStep(expectedStep: number) {
    await expect(this.page.locator(TEST_DATA.SELECTORS.STEP_INDICATOR))
      .toContainText(`Step ${expectedStep}`);
  }

  async expectVideoSelected() {
    await expect(this.page.locator(TEST_DATA.SELECTORS.VIDEO_SELECTED)).toBeVisible();
    await expect(this.page.locator(TEST_DATA.SELECTORS.VIDEO_PREVIEW)).toBeVisible();
  }

  async expectWalletLoaded() {
    await expect(this.page.locator(TEST_DATA.SELECTORS.WALLET_LOADED)).toBeVisible();
    await expect(this.page.locator(TEST_DATA.SELECTORS.WALLET_INFO)).toBeVisible();
  }

  async expectUploadInProgress() {
    await expect(this.page.locator(TEST_DATA.SELECTORS.UPLOAD_PROGRESS)).toBeVisible();
    await expect(this.page.locator(TEST_DATA.SELECTORS.PROGRESS_PERCENTAGE)).toBeVisible();
  }

  async expectUploadComplete() {
    await expect(this.page.locator(TEST_DATA.SELECTORS.UPLOAD_SUCCESS)).toBeVisible();
    await expect(this.page.locator(TEST_DATA.SELECTORS.TRANSACTION_ID)).toBeVisible();
  }

  async expectError(errorMessage?: string) {
    await expect(this.page.locator(TEST_DATA.SELECTORS.ERROR_MESSAGE)).toBeVisible();
    if (errorMessage) {
      await expect(this.page.locator(TEST_DATA.SELECTORS.ERROR_MESSAGE))
        .toContainText(errorMessage);
    }
  }

  async expectInsufficientBalance() {
    await expect(this.page.locator(TEST_DATA.SELECTORS.INSUFFICIENT_BALANCE)).toBeVisible();
    await expect(this.page.locator(TEST_DATA.SELECTORS.CONFIRM_UPLOAD_BUTTON)).toBeDisabled();
  }

  async expectAccessibility() {
    // Check ARIA labels and roles
    await expect(this.page.locator(TEST_DATA.SELECTORS.UPLOADER))
      .toHaveAttribute('role', 'main');
    await expect(this.page.locator(TEST_DATA.SELECTORS.UPLOADER))
      .toHaveAttribute('aria-labelledby');
    
    // Check for live regions
    await expect(this.page.locator('[aria-live="polite"]')).toBeVisible();
  }
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  private startTime: number = 0;

  start() {
    this.startTime = Date.now();
  }

  getElapsed(): number {
    return Date.now() - this.startTime;
  }

  expectWithinTime(maxTime: number) {
    const elapsed = this.getElapsed();
    expect(elapsed).toBeLessThan(maxTime);
  }
}

/**
 * Test data generators
 */
export function generateTestWallet() {
  return {
    kty: 'RSA',
    n: `test-modulus-${Date.now()}`,
    e: 'AQAB',
    d: `test-private-${Date.now()}`,
    p: `test-prime1-${Date.now()}`,
    q: `test-prime2-${Date.now()}`,
    dp: `test-dp-${Date.now()}`,
    dq: `test-dq-${Date.now()}`,
    qi: `test-qi-${Date.now()}`
  };
}

export function generateInvalidWallet() {
  return {
    invalid: 'wallet',
    missing: 'required fields'
  };
}