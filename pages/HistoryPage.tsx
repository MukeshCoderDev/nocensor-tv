
import React from 'react';
import Section from '../components/Section';
import Icon from '../components/Icon';
import { MOCK_HISTORY_ITEMS, THEME_COLORS } from '../constants';
import { HistoryItem, Video } from '../types';
import VideoCard from '../components/VideoCard'; // Re-use for consistency

interface HistoryPageProps {
  onPlayVideo: (video: Video) => void;
}

const HistoryListItem: React.FC<{ item: HistoryItem; onPlayVideo: (video: Video) => void }> = ({ item, onPlayVideo }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-[#1e1e1e] rounded-xl border border-[#2a2a2a] hover:border-[#8a2be2] transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-[#8a2be2]/20">
      <img 
        src={item.thumbnailUrl} 
        alt={item.title} 
        className="w-full sm:w-48 h-auto sm:h-28 object-cover rounded-lg cursor-pointer"
        onClick={() => onPlayVideo(item)}
      />
      <div className="flex-1">
        <h3 
            className="text-lg font-semibold text-white mb-1 cursor-pointer hover:text-[#ff6b8b]"
            onClick={() => onPlayVideo(item)}
        >
            {item.title}
        </h3>
        <p className="text-sm text-gray-400 mb-1">Watched on: {item.watchedDate}</p>
        <p className="text-xs text-gray-500 mb-2">Creator: {item.creator}</p>
        {item.onChainVerified && (
          <div className="mt-2 p-2 bg-[rgba(138,43,226,0.1)] rounded-md border border-[#8a2be2] text-xs">
            <p className="flex items-center text-[#00c853] font-medium mb-1">
              <Icon name="fas fa-check-circle" className="mr-2" /> On-Chain Verified View
            </p>
            {item.transactionHash && <p className="text-gray-400">Tx: <a href={`#`} className="text-[#8a2be2] hover:underline truncate block sm:inline">{item.transactionHash}</a></p>}
            {item.gasFee && <p className="text-gray-400">Gas Fee: {item.gasFee}</p>}
          </div>
        )}
      </div>
      <div className="flex flex-col sm:items-end justify-between mt-2 sm:mt-0">
          <p className="text-xs text-gray-500">{item.duration}</p>
          <button 
            onClick={() => onPlayVideo(item)}
            className="mt-2 sm:mt-0 bg-gradient-to-r from-[#8a2be2] to-[#6a0dad] text-white px-3 py-1.5 rounded-md text-xs font-semibold hover:opacity-90 transition-opacity"
          >
            Rewatch
          </button>
      </div>
    </div>
  );
};

const HistoryPage: React.FC<HistoryPageProps> = ({ onPlayVideo }) => {
  return (
    <div className="text-white">
      <Section 
        title="Viewing History" 
        headerContent={<p className="text-sm text-gray-400 hidden md:block">Your decentralized and transparent watch history.</p>}
      >
        {MOCK_HISTORY_ITEMS.length > 0 ? (
          <div className="space-y-6">
            {MOCK_HISTORY_ITEMS.map(item => (
              <HistoryListItem key={item.id} item={item} onPlayVideo={onPlayVideo} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-10">Your viewing history is empty.</p>
        )}
      </Section>
      <Section title="Advanced History Features (Coming Soon)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-[#1e1e1e] rounded-lg border border-[#2a2a2a]">
                <Icon name="fas fa-chart-pie" className="text-3xl text-[#ff6b8b] mb-3"/>
                <h4 className="text-lg font-semibold mb-2">Viewing Patterns Heatmap</h4>
                <p className="text-sm text-gray-400">Visualize your content consumption trends and preferences over time.</p>
            </div>
            <div className="p-6 bg-[#1e1e1e] rounded-lg border border-[#2a2a2a]">
                <Icon name="fas fa-coins" className="text-3xl text-[#00c853] mb-3"/>
                <h4 className="text-lg font-semibold mb-2">"Rewatch Earnings" Tracker</h4>
                <p className="text-sm text-gray-400">See potential token rewards for re-engaging with content you've enjoyed.</p>
            </div>
        </div>
      </Section>
    </div>
  );
};

export default HistoryPage;
