import useNetworkStats from '../hooks/useNetworkStats';

export default function DecentralizedAnalytics({ cid }) {
  const stats = useNetworkStats(cid);
  return (
    <div className="decentralized-analytics">
      <h3>Network Performance</h3>
      <p>Peers: {stats.peers || 0}</p>
      <p>Download Rate: {stats.downloadRate || 0} MB/s</p>
      <p>Data Served: {stats.bytesServed || 0} MB</p>
    </div>
  );
}
