import { createHelia } from 'helia'
import { unixfs } from '@helia/unixfs'
import { webSockets } from '@libp2p/websockets'
import { webRTC } from '@libp2p/webrtc'
import { noise } from '@chainsafe/libp2p-noise'
import { yamux } from '@chainsafe/libp2p-yamux'
import { bootstrap } from '@libp2p/bootstrap'

export async function uploadToIPFS(fileBuffer) {
  // Use the Helia browser preset for maximum compatibility
  const helia = await createHelia()
  const fs = unixfs(helia)
  const cid = await fs.addBytes(fileBuffer)
  await helia.pins.add(cid)
  await helia.stop()
  return cid.toString()
}
