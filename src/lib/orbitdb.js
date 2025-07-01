import { createHelia } from 'helia';
import { createOrbitDB } from '@orbitdb/core';

export const initOrbitDB = async () => {
  const helia = await createHelia();
  const orbitdb = await createOrbitDB({ ipfs: helia });
  const db = await orbitdb.open('nocensor.metadata', { type: 'keyvalue' });
  await db.load();
  return db;
};
