import { chromium, FullConfig } from '@playwright/test';
import fs from 'fs';
import path from 'path';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global setup for Arweave Uploader E2E tests...');

  // Create test video file if it doesn't exist
  const testVideoPath = path.join(__dirname, 'fixtures', 'test-video.mp4');
  if (!fs.existsSync(testVideoPath)) {
    console.log('📹 Creating test video file...');
    
    // Create a minimal MP4 file for testing
    // This is a very basic MP4 structure - in real tests you'd use a proper video file
    const minimalMp4 = Buffer.from([
      0x00, 0x00, 0x00, 0x20, 0x66, 0x74, 0x79, 0x70, // ftyp box
      0x69, 0x73, 0x6F, 0x6D, 0x00, 0x00, 0x02, 0x00,
      0x69, 0x73, 0x6F, 0x6D, 0x69, 0x73, 0x6F, 0x32,
      0x61, 0x76, 0x63, 0x31, 0x6D, 0x70, 0x34, 0x31,
      // Add minimal mdat box
      0x00, 0x00, 0x00, 0x08, 0x6D, 0x64, 0x61, 0x74
    ]);
    
    fs.writeFileSync(testVideoPath, minimalMp4);
    console.log('✅ Test video file created');
  }

  // Create large test video file for performance tests
  const largeVideoPath = path.join(__dirname, 'fixtures', 'large-test-video.mp4');
  if (!fs.existsSync(largeVideoPath)) {
    console.log('📹 Creating large test video file...');
    
    // Create a larger file by repeating the minimal structure
    const baseVideo = fs.readFileSync(testVideoPath);
    const largeVideo = Buffer.concat(Array(1000).fill(baseVideo)); // ~40KB file
    
    fs.writeFileSync(largeVideoPath, largeVideo);
    console.log('✅ Large test video file created');
  }

  // Verify test fixtures exist
  const requiredFixtures = [
    'test-wallet.json',
    'invalid-wallet.json',
    'test-document.pdf',
    'test-video.mp4',
    'large-test-video.mp4'
  ];

  for (const fixture of requiredFixtures) {
    const fixturePath = path.join(__dirname, 'fixtures', fixture);
    if (!fs.existsSync(fixturePath)) {
      throw new Error(`Required test fixture missing: ${fixture}`);
    }
  }

  console.log('✅ All test fixtures verified');

  // Start a browser to warm up the system
  const browser = await chromium.launch();
  await browser.close();

  console.log('🎉 Global setup completed successfully');
}

export default globalSetup;