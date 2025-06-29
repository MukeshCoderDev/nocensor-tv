
import React, { useState } from 'react';
import Section from '../components/Section';
import Icon from '../components/Icon';
import { MOCK_WATCH_LATER_ITEMS, THEME_COLORS } from '../constants';
import { WatchLaterItem, Video } from '../types';
import VideoCard from '../components/VideoCard'; // Re-use for consistency

interface WatchLaterPageProps {
  onPlayVideo: (video: Video) => void;
}

const WatchLaterCard: React.FC<{ item: WatchLaterItem; onPlayVideo: (video: Video) => void; onRemove: (id: string) => void }> = ({ item, onPlayVideo, onRemove }) => {
  return (
    <div className="bg-[#1e1e1e] rounded-xl border border-[#2a2a2a] hover:border-[#8a2be2] transition-all duration-300 shadow-lg group relative">
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        {item.priority && (
          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold
            ${item.priority === 'high' ? 'bg-red-500 text-white' : item.priority === 'medium' ? 'bg-yellow-500 text-black' : 'bg-green-500 text-white'}
          `}>
            {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority
          </span>
        )}
         <button onClick={() => onRemove(item.id)} className="bg-red-600 hover:bg-red-700 text-white w-6 h-6 rounded-full flex items-center justify-center transition-colors">
            <Icon name="fas fa-times" className="text-xs"/>
        </button>
      </div>
      <div className="h-[180px] w-full overflow-hidden rounded-t-xl">
        <img 
            src={item.thumbnailUrl} 
            alt={item.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
            onClick={() => onPlayVideo(item)}
        />
      </div>
      <div className="p-4">
        <h3 
            className="text-md font-semibold text-white mb-1 h-12 overflow-hidden cursor-pointer hover:text-[#ff6b8b]"
            onClick={() => onPlayVideo(item)}
        >
            {item.title}
        </h3>
        <p className="text-xs text-gray-400 mb-1">Added: {item.addedDate}</p>
        <p className="text-xs text-gray-500 mb-2 truncate">Creator: {item.creator}</p>
        {item.notes && <p className="text-xs bg-[rgba(255,255,255,0.05)] p-2 rounded-md text-gray-300 italic">Notes: {item.notes}</p>}
        <button 
            onClick={() => onPlayVideo(item)}
            className="mt-3 w-full bg-gradient-to-r from-[#8a2be2] to-[#6a0dad] text-white py-2 rounded-md text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            Watch Now
        </button>
      </div>
    </div>
  );
};


const WatchLaterPage: React.FC<WatchLaterPageProps> = ({ onPlayVideo }) => {
  const [watchList, setWatchList] = useState<WatchLaterItem[]>(MOCK_WATCH_LATER_ITEMS);
  const [sortOption, setSortOption] = useState<'date' | 'priority' | 'title'>('date');

  const handleRemoveItem = (id: string) => {
    setWatchList(currentList => currentList.filter(item => item.id !== id));
  };
  
  const sortedList = [...watchList].sort((a, b) => {
    if (sortOption === 'priority') {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return (priorityOrder[a.priority || 'low']) - (priorityOrder[b.priority || 'low']);
    }
    if (sortOption === 'title') {
      return a.title.localeCompare(b.title);
    }
    // Default to date (newest first)
    return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
  });


  return (
    <div className="text-white">
      <Section title="Watch Later Playlist">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-[#1e1e1e] rounded-lg border border-[#2a2a2a]">
            <div>
                <label htmlFor="sortWatchLater" className="mr-2 text-sm text-gray-300">Sort by:</label>
                <select 
                    id="sortWatchLater"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as any)}
                    className="bg-[#121212] border border-[#2a2a2a] px-3 py-2 rounded-md text-white text-sm focus:outline-none focus:border-[#8a2be2]"
                >
                    <option value="date">Date Added (Newest)</option>
                    <option value="priority">AI Priority</option>
                    <option value="title">Title (A-Z)</option>
                </select>
            </div>
            <button className="bg-transparent border-2 border-[#8a2be2] text-[#8a2be2] py-2 px-4 rounded-lg text-sm font-semibold hover:bg-[#8a2be2] hover:text-white transition-colors flex items-center gap-2">
                <Icon name="fas fa-share-alt" /> Create Shared Playlist (Token Gated)
            </button>
        </div>

        {sortedList.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedList.map(item => (
              <WatchLaterCard key={item.id} item={item} onPlayVideo={onPlayVideo} onRemove={handleRemoveItem} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-10">Your Watch Later list is empty.</p>
        )}
      </Section>
      <Section title="Premium Organization Features (Coming Soon)">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-[#1e1e1e] rounded-lg border border-[#2a2a2a]">
                <Icon name="fas fa-calendar-alt" className="text-3xl text-[#ff6b8b] mb-3"/>
                <h4 className="text-lg font-semibold mb-2">Scheduled Viewing Calendar</h4>
                <p className="text-sm text-gray-400">Integrate your watch list with a calendar and get reminders. Requires token staking.</p>
            </div>
            <div className="p-6 bg-[#1e1e1e] rounded-lg border border-[#2a2a2a]">
                <Icon name="fas fa-project-diagram" className="text-3xl text-[#8a2be2] mb-3"/>
                <h4 className="text-lg font-semibold mb-2">Collaborative Encrypted Playlists</h4>
                <p className="text-sm text-gray-400">Create and share watch lists with friends, secured by on-chain permissions.</p>
            </div>
        </div>
      </Section>
    </div>
  );
};

export default WatchLaterPage;
