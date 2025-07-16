import { test, expect, Page } from '@playwright/test';
import path from 'path';

// Test configuration
const TEST_VIDEO_PATH = path.join(__dirname, 'fixtures', 'test-video.mp4');
const TEST_WALLET_PATH = path.join(__dirname, 'fixtures', 'test-wallet.json');

// Helper functions
async function navigateToUploader(page: Page) {
  await page.goto('/studio/upload');
  await page.waitForSelector('[data-testid="arweave-uploader"]', { timeout: 10000 });
}

async function selectVideo(page: Page, videoPath: string) {
  const fileInput = page.locator('input[type="file"][accept="video/*"]');
  await fileInput.setInputFiles(videoPath);
  await page.waitForSelector('[data-testid="video-selected"]', { timeout: 5000 });
}

async function loadWallet(page: Page, walletPath: string) {
  const walletInput = page.locator('input[type="file"][accept=".json"]');
  await walletInput.setInputFiles(walletPath);
  await page.waitForSelector('[data-testid="wallet-loaded"]', { timeout: 5000 });
}

async function waitForUploadComplete(page: Page) {
  await page.waitForSelector('[data-testid="upload-complete"]', { timeout: 60000 });
}

test.describe('Arweave Uploader E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Set up test environment
    await page.goto('/');
    
    // Mock Arweave network calls for testing
    await page.route('**/arweave.net/**', route => {
      const url = route.request().url();
      
      if (url.includes('/tx/')) {
        // Mock transaction status
        route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ status: 200 })
        });
      } else if (url.includes('/wallet/')) {
        // Mock wallet balance
        route.fulfill({
          status: 200,
          contentType: 'text/plain',
          body: '1000000000000' // 1 AR in winston
        });
      } else {
        route.continue();
      }
    });
  });

  test('Complete upload workflow - happy path', async ({ page }) => {
    // Navigate to uploader
    await navigateToUploader(page);
    
    // Verify initial state
    await expect(page.locator('[data-testid="step-indicator"]')).toContainText('Step 1');
    await expect(page.locator('[data-testid="video-selector"]')).toBeVisible();
    
    // Step 1: Select video
    await selectVideo(page, TEST_VIDEO_PATH);
    
    // Verify step 1 completion
    await expect(page.locator('[data-testid="step-indicator"]')).toContainText('Step 2');
    await expect(page.locator('[data-testid="wallet-loader"]')).toBeVisible();
    
    // Step 2: Load wallet
    await loadWallet(page, TEST_WALLET_PATH);
    
    // Verify step 2 completion
    await expect(page.locator('[data-testid="step-indicator"]')).toContainText('Step 3');
    await expect(page.locator('[data-testid="upload-processor"]')).toBeVisible();
    
    // Verify cost estimation
    await expect(page.locator('[data-testid="cost-estimate"]')).toBeVisible();
    await expect(page.locator('[data-testid="wallet-balance"]')).toBeVisible();
    
    // Step 3: Confirm and upload
    await page.click('[data-testid="confirm-upload-button"]');
    
    // Verify upload progress
    await expect(page.locator('[data-testid="upload-progress"]')).toBeVisible();
    await expect(page.locator('[data-testid="progress-percentage"]')).toBeVisible();
    
    // Wait for upload completion
    await waitForUploadComplete(page);
    
    // Verify success state
    await expect(page.locator('[data-testid="upload-success"]')).toBeVisible();
    await expect(page.locator('[data-testid="transaction-id"]')).toBeVisible();
    await expect(page.locator('[data-testid="arweave-link"]')).toBeVisible();
  });

  test('Video selection with drag and drop', async ({ page }) => {
    await navigateToUploader(page);
    
    // Test drag and drop functionality
    const dropZone = page.locator('[data-testid="video-drop-zone"]');
    await expect(dropZone).toBeVisible();
    
    // Simulate file drop (Note: Playwright has limitations with file drag-drop)
    // This would typically be tested with a more sophisticated setup
    await selectVideo(page, TEST_VIDEO_PATH);
    
    // Verify video preview
    await expect(page.locator('[data-testid="video-preview"]')).toBeVisible();
    await expect(page.locator('[data-testid="video-metadata"]')).toBeVisible();
  });

  test('Video validation errors', async ({ page }) => {
    await navigateToUploader(page);
    
    // Try to upload invalid file type
    const invalidFile = path.join(__dirname, 'fixtures', 'test-document.pdf');
    const fileInput = page.locator('input[type="file"][accept="video/*"]');
    await fileInput.setInputFiles(invalidFile);
    
    // Verify error message
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-message"]')).toContainText('not supported');
    
    // Verify user can retry
    await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();
  });

  test('Wallet key validation', async ({ page }) => {
    await navigateToUploader(page);
    
    // Complete step 1
    await selectVideo(page, TEST_VIDEO_PATH);
    
    // Try invalid wallet file
    const invalidWallet = path.join(__dirname, 'fixtures', 'invalid-wallet.json');
    const walletInput = page.locator('input[type="file"][accept=".json"]');
    await walletInput.setInputFiles(invalidWallet);
    
    // Verify validation error
    await expect(page.locator('[data-testid="wallet-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="wallet-error"]')).toContainText('Invalid');
    
    // Load valid wallet
    await loadWallet(page, TEST_WALLET_PATH);
    
    // Verify success
    await expect(page.locator('[data-testid="wallet-info"]')).toBeVisible();
    await expect(page.locator('[data-testid="wallet-address"]')).toBeVisible();
  });

  test('Insufficient balance handling', async ({ page }) => {
    // Mock insufficient balance
    await page.route('**/wallet/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'text/plain',
        body: '100000000' // Very small balance
      });
    });
    
    await navigateToUploader(page);
    await selectVideo(page, TEST_VIDEO_PATH);
    await loadWallet(page, TEST_WALLET_PATH);
    
    // Verify insufficient balance warning
    await expect(page.locator('[data-testid="insufficient-balance"]')).toBeVisible();
    await expect(page.locator('[data-testid="balance-warning"]')).toContainText('insufficient');
    
    // Verify upload button is disabled
    await expect(page.locator('[data-testid="confirm-upload-button"]')).toBeDisabled();
  });

  test('Upload cancellation', async ({ page }) => {
    await navigateToUploader(page);
    await selectVideo(page, TEST_VIDEO_PATH);
    await loadWallet(page, TEST_WALLET_PATH);
    
    // Start upload
    await page.click('[data-testid="confirm-upload-button"]');
    
    // Cancel during upload
    await page.click('[data-testid="cancel-upload-button"]');
    
    // Verify cancellation
    await expect(page.locator('[data-testid="upload-cancelled"]')).toBeVisible();
    await expect(page.locator('[data-testid="step-indicator"]')).toContainText('Step 2');
  });

  test('Network error handling and retry', async ({ page }) => {
    // Mock network failure
    await page.route('**/arweave.net/**', route => {
      route.abort('failed');
    });
    
    await navigateToUploader(page);
    await selectVideo(page, TEST_VIDEO_PATH);
    await loadWallet(page, TEST_WALLET_PATH);
    
    // Attempt upload
    await page.click('[data-testid="confirm-upload-button"]');
    
    // Verify error handling
    await expect(page.locator('[data-testid="network-error"]')).toBeVisible();
    await expect(page.locator('[data-testid="retry-button"]')).toBeVisible();
    
    // Test retry functionality
    // Remove network mock for retry
    await page.unroute('**/arweave.net/**');
    await page.route('**/arweave.net/**', route => route.continue());
    
    await page.click('[data-testid="retry-button"]');
    
    // Verify retry attempt
    await expect(page.locator('[data-testid="upload-progress"]')).toBeVisible();
  });

  test('Step navigation', async ({ page }) => {
    await navigateToUploader(page);
    
    // Complete steps
    await selectVideo(page, TEST_VIDEO_PATH);
    await loadWallet(page, TEST_WALLET_PATH);
    
    // Test backward navigation
    await page.click('[data-testid="step-1-nav"]');
    await expect(page.locator('[data-testid="video-selector"]')).toBeVisible();
    
    await page.click('[data-testid="step-2-nav"]');
    await expect(page.locator('[data-testid="wallet-loader"]')).toBeVisible();
    
    await page.click('[data-testid="step-3-nav"]');
    await expect(page.locator('[data-testid="upload-processor"]')).toBeVisible();
  });

  test('Help and tooltips', async ({ page }) => {
    await navigateToUploader(page);
    
    // Test help tooltips
    await page.hover('[data-testid="video-help-icon"]');
    await expect(page.locator('[data-testid="video-help-tooltip"]')).toBeVisible();
    
    await selectVideo(page, TEST_VIDEO_PATH);
    
    await page.hover('[data-testid="wallet-help-icon"]');
    await expect(page.locator('[data-testid="wallet-help-tooltip"]')).toBeVisible();
    
    // Test expandable help section
    await page.click('[data-testid="help-expand-button"]');
    await expect(page.locator('[data-testid="help-content"]')).toBeVisible();
  });

  test('Accessibility features', async ({ page }) => {
    await navigateToUploader(page);
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
    
    // Test ARIA labels
    const uploader = page.locator('[data-testid="arweave-uploader"]');
    await expect(uploader).toHaveAttribute('role', 'main');
    await expect(uploader).toHaveAttribute('aria-labelledby');
    
    // Test screen reader announcements
    await selectVideo(page, TEST_VIDEO_PATH);
    
    // Verify live region updates
    await expect(page.locator('[aria-live="polite"]')).toBeVisible();
  });

  test('Progress tracking accuracy', async ({ page }) => {
    await navigateToUploader(page);
    await selectVideo(page, TEST_VIDEO_PATH);
    await loadWallet(page, TEST_WALLET_PATH);
    
    // Start upload
    await page.click('[data-testid="confirm-upload-button"]');
    
    // Monitor progress updates
    const progressBar = page.locator('[data-testid="progress-bar"]');
    const progressText = page.locator('[data-testid="progress-percentage"]');
    
    // Verify progress starts at 0
    await expect(progressText).toContainText('0%');
    
    // Wait for progress updates
    await page.waitForFunction(() => {
      const text = document.querySelector('[data-testid="progress-percentage"]')?.textContent;
      return text && parseInt(text) > 0;
    });
    
    // Verify progress increases
    await expect(progressText).not.toContainText('0%');
    
    // Verify final completion
    await waitForUploadComplete(page);
    await expect(progressText).toContainText('100%');
  });

  test('Mobile responsiveness', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await navigateToUploader(page);
    
    // Verify mobile layout
    await expect(page.locator('[data-testid="arweave-uploader"]')).toBeVisible();
    
    // Test mobile interactions
    await selectVideo(page, TEST_VIDEO_PATH);
    await expect(page.locator('[data-testid="video-preview"]')).toBeVisible();
    
    // Verify responsive design elements
    const stepIndicator = page.locator('[data-testid="step-indicator"]');
    await expect(stepIndicator).toBeVisible();
  });

  test('Error recovery flows', async ({ page }) => {
    await navigateToUploader(page);
    
    // Test recovery from video selection error
    const invalidFile = path.join(__dirname, 'fixtures', 'test-document.pdf');
    const fileInput = page.locator('input[type="file"][accept="video/*"]');
    await fileInput.setInputFiles(invalidFile);
    
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
    
    // Recover with valid file
    await selectVideo(page, TEST_VIDEO_PATH);
    await expect(page.locator('[data-testid="video-selected"]')).toBeVisible();
    
    // Test recovery from wallet error
    const invalidWallet = path.join(__dirname, 'fixtures', 'invalid-wallet.json');
    const walletInput = page.locator('input[type="file"][accept=".json"]');
    await walletInput.setInputFiles(invalidWallet);
    
    await expect(page.locator('[data-testid="wallet-error"]')).toBeVisible();
    
    // Recover with valid wallet
    await loadWallet(page, TEST_WALLET_PATH);
    await expect(page.locator('[data-testid="wallet-loaded"]')).toBeVisible();
  });

  test('Performance under load', async ({ page }) => {
    await navigateToUploader(page);
    
    // Test with large file
    const largeVideoPath = path.join(__dirname, 'fixtures', 'large-test-video.mp4');
    
    // Monitor performance
    const startTime = Date.now();
    
    await selectVideo(page, largeVideoPath);
    
    const selectionTime = Date.now() - startTime;
    
    // Verify reasonable performance (adjust threshold as needed)
    expect(selectionTime).toBeLessThan(5000); // 5 seconds
    
    // Verify UI remains responsive
    await expect(page.locator('[data-testid="video-metadata"]')).toBeVisible();
  });
});

test.describe('Integration with Main Application', () => {
  test('Navigation from main upload page', async ({ page }) => {
    await page.goto('/studio/upload');
    
    // Find and click Arweave upload option
    await page.click('[data-testid="arweave-upload-option"]');
    
    // Verify navigation to Arweave uploader
    await expect(page.locator('[data-testid="arweave-uploader"]')).toBeVisible();
  });

  test('Success notification integration', async ({ page }) => {
    await navigateToUploader(page);
    await selectVideo(page, TEST_VIDEO_PATH);
    await loadWallet(page, TEST_WALLET_PATH);
    
    // Complete upload
    await page.click('[data-testid="confirm-upload-button"]');
    await waitForUploadComplete(page);
    
    // Verify success notification
    await expect(page.locator('[data-testid="success-notification"]')).toBeVisible();
    await expect(page.locator('[data-testid="success-notification"]')).toContainText('successfully uploaded');
  });

  test('Error notification integration', async ({ page }) => {
    // Mock network failure
    await page.route('**/arweave.net/**', route => {
      route.abort('failed');
    });
    
    await navigateToUploader(page);
    await selectVideo(page, TEST_VIDEO_PATH);
    await loadWallet(page, TEST_WALLET_PATH);
    
    await page.click('[data-testid="confirm-upload-button"]');
    
    // Verify error notification
    await expect(page.locator('[data-testid="error-notification"]')).toBeVisible();
    await expect(page.locator('[data-testid="error-notification"]')).toContainText('failed');
  });
});