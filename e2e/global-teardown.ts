import { FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global teardown for Arweave Uploader E2E tests...');

  // Clean up temporary test files if needed
  const tempFiles = [
    path.join(__dirname, 'fixtures', 'temp-test-video.mp4'),
    path.join(__dirname, 'fixtures', 'temp-wallet.json')
  ];

  for (const tempFile of tempFiles) {
    if (fs.existsSync(tempFile)) {
      fs.unlinkSync(tempFile);
      console.log(`🗑️  Cleaned up temporary file: ${path.basename(tempFile)}`);
    }
  }

  // Generate test report summary
  const resultsPath = path.join(process.cwd(), 'test-results', 'results.json');
  if (fs.existsSync(resultsPath)) {
    try {
      const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
      const summary = {
        total: results.suites?.reduce((acc: number, suite: any) => acc + (suite.specs?.length || 0), 0) || 0,
        passed: results.suites?.reduce((acc: number, suite: any) => 
          acc + (suite.specs?.filter((spec: any) => spec.ok).length || 0), 0) || 0,
        failed: results.suites?.reduce((acc: number, suite: any) => 
          acc + (suite.specs?.filter((spec: any) => !spec.ok).length || 0), 0) || 0,
        duration: results.stats?.duration || 0
      };

      console.log('📊 Test Results Summary:');
      console.log(`   Total tests: ${summary.total}`);
      console.log(`   Passed: ${summary.passed}`);
      console.log(`   Failed: ${summary.failed}`);
      console.log(`   Duration: ${Math.round(summary.duration / 1000)}s`);

      if (summary.failed > 0) {
        console.log('❌ Some tests failed. Check the HTML report for details.');
      } else {
        console.log('✅ All tests passed!');
      }
    } catch (error) {
      console.log('⚠️  Could not parse test results');
    }
  }

  console.log('🎉 Global teardown completed');
}

export default globalTeardown;