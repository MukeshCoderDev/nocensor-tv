
import React from 'react';
import Section from '../components/Section';
import VideoCard from '../components/VideoCard';
import Icon from '../components/Icon';
import { TRENDING_VIDEOS, THEME_COLORS } from '../constants';
import { Video } from '../types';

interface TrendingPageProps {
  onPlayVideo: (video: Video) => void;
}

const TrendingPage: React.FC<TrendingPageProps> = ({ onPlayVideo }) => {
  const topThreeVideos = TRENDING_VIDEOS.filter(v => v.isTopTrend).slice(0, 3);
  const otherTrendingVideos = TRENDING_VIDEOS.filter(v => !v.isTopTrend || topThreeVideos.length >=3 && topThreeVideos.find(tv => tv.id === v.id) === undefined );

  return (
    <div className="text-[#f5f5f5]">
      {/* Holographic Leaderboard Concept - Top 3 Videos */}
      <Section 
        title="Today's Viral Velocity Leaders"
        headerContent={
          <p className="text-sm text-gray-400 hidden md:block">
            <Icon name="fas fa-rocket" className="mr-2 text-pink-500" />
            Highest on-chain engagement &amp; viewership spikes.
          </p>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {topThreeVideos.map((video, index) => (
            <div key={video.id} className={`${index === 0 ? 'lg:col-span-1' : ''} ${index === 1 ? 'lg:col-span-1' : ''} ${index === 2 ? 'lg:col-span-1' : ''}`}>
               <VideoCard item={video} type="video" onClick={() => onPlayVideo(video)} />
            </div>
          ))}
        </div>
         {topThreeVideos.length === 0 && TRENDING_VIDEOS.length > 0 && ( /* Fallback if no isTopTrend */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {TRENDING_VIDEOS.slice(0,3).map(video => (
                     <VideoCard key={video.id} item={{...video, isTopTrend: true}} type="video" onClick={() => onPlayVideo(video)} />
                ))}
            </div>
        )}
      </Section>

      {/* Other Trending Content */}
      <Section title="Explore All Trending Content">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {otherTrendingVideos.map(video => (
            <VideoCard key={video.id} item={video} type="video" onClick={() => onPlayVideo(video)} />
          ))}
          {TRENDING_VIDEOS.length === 0 && (
             <p className="col-span-full text-center text-gray-400 py-10">No trending videos at the moment. Check back soon!</p>
          )}
        </div>
      </Section>

      {/* Blockchain Analytics Integration Placeholder */}
      <Section 
        title="Real-Time Blockchain Analytics Feed"
        headerContent={
            <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-xs font-semibold rounded-full shadow-md">
                <Icon name="fas fa-cogs" className="mr-1.5" /> Oracle Network Live
            </span>
        }
       >
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-[15px] p-6 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-xl">
          <div className="flex flex-col items-center text-center p-4 bg-[#121212] rounded-lg border border-[#2a2a2a] hover:border-pink-500 transition-colors">
            <Icon name="fas fa-tachometer-alt" className="text-4xl text-pink-500 mb-3" />
            <h4 className="text-lg font-semibold text-white mb-1">Token Velocity Meter</h4>
            <p className="text-xs text-gray-400">ETH/SOL flow between creator/viewer wallets. (Coming Soon)</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-[#121212] rounded-lg border border-[#2a2a2a] hover:border-purple-500 transition-colors">
            <Icon name="fas fa-balance-scale-right" className="text-4xl text-purple-500 mb-3" />
            <h4 className="text-lg font-semibold text-white mb-1">Content Valuation Panel</h4>
            <p className="text-xs text-gray-400">Real-time NFT floor price impacts on video value. (Coming Soon)</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-[#121212] rounded-lg border border-[#2a2a2a] hover:border-indigo-500 transition-colors">
            <Icon name="fas fa-globe-americas" className="text-4xl text-indigo-500 mb-3" />
            <h4 className="text-lg font-semibold text-white mb-1">Cross-Chain Trend Map</h4>
            <p className="text-xs text-gray-400">Geolocated heatmap of global viewing activity. (Coming Soon)</p>
          </div>
        </div>
      </Section>

      {/* Premium Engagement Features Placeholder */}
      <Section 
        title="Premium Engagement & Curation Tools"
        headerContent={
            <span className="px-3 py-1 bg-gradient-to-r from-teal-500 to-cyan-500 text-xs font-semibold rounded-full shadow-md">
                <Icon name="fas fa-star" className="mr-1.5" /> Elevate Your Experience
            </span>
        }
      >
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-[15px] p-6 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-xl">
          <div className="flex flex-col items-center text-center p-4 bg-[#121212] rounded-lg border border-[#2a2a2a] hover:border-teal-500 transition-colors">
            <Icon name="fas fa-hand-holding-usd" className="text-4xl text-teal-500 mb-3" />
            <h4 className="text-lg font-semibold text-white mb-1">Bid-to-Boost System</h4>
            <p className="text-xs text-gray-400">Token staking to promote videos in trending. (DAO Governed)</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-[#121212] rounded-lg border border-[#2a2a2a] hover:border-cyan-500 transition-colors">
            <Icon name="fas fa-water" className="text-4xl text-cyan-500 mb-3" />
            <h4 className="text-lg font-semibold text-white mb-1">Liquidity Pool Display</h4>
            <p className="text-xs text-gray-400">Show ETH pools backing top content. (DeFi Integration)</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-[#121212] rounded-lg border border-[#2a2a2a] hover:border-green-500 transition-colors">
            <Icon name="fas fa-vote-yea" className="text-4xl text-green-500 mb-3" />
            <h4 className="text-lg font-semibold text-white mb-1">DAO Curation Panel</h4>
            <p className="text-xs text-gray-400">Voting power indicators from governance tokens. (Community Driven)</p>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default TrendingPage;
