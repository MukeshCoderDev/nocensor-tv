import { ipns } from '@helia/ipns';
import { getHeliaInstance } from './helia-instance';

export async function publishToIPNS(cid: string) {
  const helia = await getHeliaInstance();
  const ipnsInstance = ipns(helia);
  const key = await ipnsInstance.createKey();
  await ipnsInstance.publish(key, cid);
  return key.id.toString();
}
