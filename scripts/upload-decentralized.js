import { createHelia } from 'helia';
import { unixfs } from '@helia/unixfs';
// import { Crust } from '@crustio/type-definitions'; // Uncomment and configure if using Crust

export const uploadToDecentralized = async (file) => {
  // 1. Helia browser node
  const helia = await createHelia();
  const fs = unixfs(helia);
  const { cid } = await fs.addBytes(file);

  return { cid };
};

// const pinToCrust = async (cid, size) => {
//   const api = await Crust.connect();
//   await api.tx.market.placeStorageOrder(cid, size, 0).signAndSend();
//   return { service: 'crust', cid };
// };
