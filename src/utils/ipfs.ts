import { createHelia } from 'helia';
import { http } from '@helia/http';

let helia: any;

export const initIPFS = async () => {
  helia = await createHelia({
    blockBrokers: [http()]
  });
};

export const uploadToIPFS = async (file: File) => {
  if (!helia) await initIPFS();
  const arrayBuffer = await file.arrayBuffer();
  const cid = await helia.blockstore.put(new Uint8Array(arrayBuffer));
  return cid.toString();
};

export const fetchFromIPFS = async (cid: string) => {
  if (!helia) await initIPFS();
  const response = await fetch(`https://ipfs.io/ipfs/${cid}`);
  return await response.json();
};
