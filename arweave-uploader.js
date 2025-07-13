import Arweave from 'arweave';
import Bundlr from '@bundlr-network/client';
import { Buffer } from 'buffer';

export async function uploadToArweave(fileBuffer, arweaveKey) {
  const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https'
  });

  const bundlr = new Bundlr("http://node2.bundlr.network", "arweave", arweaveKey);

  try {
    const dataStream = Buffer.from(fileBuffer);
    const tx = await bundlr.uploader.upload(dataStream, {
      tags: [
        { name: "Content-Type", value: "video/mp4" } // Assuming video/mp4, adjust as needed
      ]
    });
    console.log(`Uploaded to Arweave: https://arweave.net/${tx.id}`);
    return tx.id;
  } catch (e) {
    console.error("Error uploading to Arweave:", e);
    throw e;
  }
}
