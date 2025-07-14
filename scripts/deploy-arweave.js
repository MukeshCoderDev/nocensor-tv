import Bundlr from '@bundlr-network/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Your Arweave wallet
const privateKey = JSON.parse(fs.readFileSync(path.join(__dirname, '../arweave-key.json')).toString());

async function deploy() {
  // Initialize Bundlr
  const bundlr = new Bundlr(
    "http://localhost:1984", // Point to ArLocal
    "arweave",
    privateKey
  );

  // Get folder to upload
  const buildFolder = path.join(__dirname, '../dist');
  console.log(`Uploading build folder: ${buildFolder}`);

  // Get all files in build folder
  const files = [];
  function getFiles(dir) {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        getFiles(fullPath);
      } else {
        files.push(fullPath);
      }
    }
  }
  getFiles(buildFolder);

  // Upload each file
  for (const filePath of files) {
    const data = fs.readFileSync(filePath);
    const relativePath = path.relative(buildFolder, filePath);
    
    console.log(`Uploading: ${relativePath}`);
    const tags = [{ name: 'Content-Type', value: getContentType(relativePath) }];
    const tx = await bundlr.upload(data, { tags });
    console.log(`Uploaded: http://localhost:1984/${tx.id}`);
  }

  console.log('Deployment complete!');
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.html': return 'text/html';
    case '.css': return 'text/css';
    case '.js': return 'application/javascript';
    case '.json': return 'application/json';
    case '.png': return 'image/png';
    case '.jpg': case '.jpeg': return 'image/jpeg';
    case '.svg': return 'image/svg+xml';
    case '.ico': return 'image/x-icon';
    default: return 'application/octet-stream';
  }
}

deploy().catch(console.error);