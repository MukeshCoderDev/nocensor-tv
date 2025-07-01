import { useEffect, useState } from 'react';
import { create } from 'helia';

export default function useNetworkStats(cid) {
  const [stats, setStats] = useState({});
  useEffect(() => {
    const monitorNetwork = async () => {
      const helia = await create();
      const start = Date.now();
      let bytesReceived = 0;
      const updateStats = () => {
        const elapsed = (Date.now() - start) / 1000;
        setStats({
          downloadRate: (bytesReceived / 1024 / 1024 / elapsed).toFixed(2),
          peers: helia.libp2p.getPeers().length,
          cid
        });
      };
      const interval = setInterval(updateStats, 2000);
      try {
        for await (const chunk of helia.fs.cat(cid)) {
          bytesReceived += chunk.length;
          updateStats();
        }
      } finally {
        clearInterval(interval);
        await helia.stop();
      }
    };
    if (cid) monitorNetwork();
  }, [cid]);
  return stats;
}
