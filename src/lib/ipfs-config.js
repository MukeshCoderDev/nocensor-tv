import { createLibp2p } from 'libp2p';
import { webRTC } from '@libp2p/webrtc';
import { webSockets } from '@libp2p/websockets';
import { noise } from '@chainsafe/libp2p-noise';
import { yamux } from '@chainsafe/libp2p-yamux';
import { bootstrap } from '@libp2p/bootstrap';

export const createNode = async () => {
  return await createLibp2p({
    transports: [webRTC(), webSockets()],
    connectionEncryption: [noise()],
    streamMuxers: [yamux()],
    peerDiscovery: [
      bootstrap({
        list: [
          '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN'
        ]
      })
    ]
  });
};
