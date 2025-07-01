import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs';

let helia: any;

export const initIPFS = async () => {
  helia = await createHelia();
};

export const uploadToIPFS = async (file: File) => {
  if (!helia) await initIPFS();
  const fs = unixfs(helia);
  const { cid } = await fs.addBytes(await file.arrayBuffer());
  return cid.toString();
};

export const fetchFromIPFS = async (cid: string) => {
  if (!helia) await initIPFS();
  const fs = unixfs(helia);
  const chunks = [];
  for await (const chunk of fs.cat(cid)) {
    chunks.push(chunk);
  }
  return new Blob(chunks);
};
