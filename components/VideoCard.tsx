
import React from 'react';
import { Video, Creator } from '../types';
import Icon from './Icon';
import { THEME_COLORS } from '../constants';

interface VideoCardProps {
  item: Video | Creator;
  type: 'video' | 'creator';
  onClick?: () => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ item, type, onClick }) => {
  const isVideo = type === 'video';
  const video = item as Video;
  const creator = item as Creator;

  const title = isVideo ? video.title : creator.name;
  const thumbnailUrl = isVideo ? video.thumbnailUrl : creator.thumbnailUrl;
  
  let badgeText = isVideo ? video.badge : (creator.verified ? 'Verified' : undefined);
  let badgeIcon = isVideo ? video.badgeIcon : (creator.verified ? 'fas fa-check' : undefined);
  let badgeColor = isVideo ? (video.badgeColor || 'bg-gradient-to-r from-purple-600 to-indigo-600') : 'bg-gradient-to-r from-green-500 to-teal-500';

  if (isVideo && video.isTopTrend) {
    badgeColor = video.badgeColor || 'bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700';
  } else if (isVideo && video.exclusive) {
     badgeColor = video.badgeColor || 'bg-gradient-to-r from-teal-400 to-cyan-600';
     badgeText = video.creatorTier ? `${video.creatorTier} Access` : video.badge || 'Exclusive';
     badgeIcon = video.creatorTier === 'Diamond' ? 'fas fa-gem' : video.creatorTier === 'Platinum' ? 'fas fa-star' : video.creatorTier === 'Gold' ? 'fas fa-medal' : video.badgeIcon || 'fas fa-lock';
  }


  const cardClasses = `bg-[#1e1e1e] rounded-[15px] overflow-hidden transition-all duration-300 border border-[#2a2a2a] relative shadow-[0_8px_25px_rgba(0,0,0,0.5)] hover:border-[#8a2be2] group cursor-pointer 
    ${isVideo && video.isTopTrend ? 'border-2 border-[#ffd700] shadow-[0_0_20px_rgba(255,215,0,0.3)] hover:shadow-[0_0_30px_rgba(255,215,0,0.5)] transform hover:scale-105' : 'hover:-translate-y-1.5'}`;

  return (
    <div 
      className={cardClasses}
      onClick={onClick}
      aria-label={`Play ${title}`}
    >
      <div className="h-[160px] sm:h-[180px] w-full relative overflow-hidden">
        <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        {isVideo && video.duration && (
          <div className="absolute bottom-2.5 right-2.5 bg-[rgba(0,0,0,0.8)] text-white px-2.5 py-1.5 rounded-md text-xs font-medium">
            {video.duration}
          </div>
        )}
        {badgeText && badgeIcon && (
          <div className={`absolute top-2.5 left-2.5 ${badgeColor} text-white px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 z-[2] shadow-lg`}>
            <Icon name={badgeIcon} /> {badgeText}
          </div>
        )}
         {isVideo && video.isTopTrend && video.trendingScore && (
            <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 z-[2] shadow-lg">
                 <Icon name="fas fa-arrow-trend-up" /> {video.trendingScore?.toFixed(1)}
            </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-base md:text-lg text-[#f5f5f5] font-semibold mb-2 h-[48px] overflow-hidden leading-tight group-hover:text-[#ff6b8b] transition-colors">{title}</h3>
        
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-9 h-9 rounded-full ${isVideo && video.isTopTrend ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gradient-to-r from-[#ff6b8b] to-[#8a2be2]'} flex items-center justify-center font-semibold text-sm shrink-0 text-white shadow-md`}>
            {isVideo ? video.creatorAvatar : creator.avatarChar}
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="font-medium text-[#f5f5f5] text-sm truncate">{isVideo ? video.creator : creator.username}</div>
            <div className="text-xs text-gray-400">{isVideo ? video.creatorSubs : creator.subscribers}</div>
          </div>
        </div>

        <div className="text-xs text-gray-400 space-y-1 mb-3 pt-2 border-t border-[#2a2a2a]">
            {isVideo && video.views && !video.exclusive && <p><Icon name="fas fa-eye" className="mr-1.5 text-[#8a2be2]" /> {video.views}</p>}
            {isVideo && video.views && video.exclusive && <p><Icon name="fas fa-eye-slash" className="mr-1.5 text-[#8a2be2]" /> {video.views}</p>}
            {!isVideo && creator.views && <p><Icon name="fas fa-chart-bar" className="mr-1.5 text-[#8a2be2]" /> {creator.views}</p>}
            
            {isVideo && video.tokenVelocity && (
                <p className="flex items-center">
                    <Icon name="fas fa-tachometer-alt" className="mr-1.5 text-[#ff6b8b]" /> Token Velocity: <span className={`ml-1 capitalize px-1.5 py-0.5 rounded-full text-[10px] ${video.tokenVelocity === 'high' ? 'bg-green-500/20 text-green-400' : video.tokenVelocity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>{video.tokenVelocity}</span>
                </p>
            )}
            {isVideo && video.nftValueImpact !== undefined && (
                 <p><Icon name="fas fa-gem" className="mr-1.5 text-[#00c853]" /> NFT Value Impact: +{video.nftValueImpact}%</p>
            )}
            {isVideo && video.creatorDAOTokens && (
                 <p><Icon name="fas fa-users-cog" className="mr-1.5 text-teal-400" /> Creator DAO: {video.creatorDAOTokens}</p>
            )}
             {isVideo && video.stakedValue && (
                 <p><Icon name="fas fa-piggy-bank" className="mr-1.5 text-cyan-400" /> Staked: {video.stakedValue}</p>
            )}
        </div>
        
        <div className="flex justify-between items-center text-gray-400 text-xs pt-2 border-t border-[#2a2a2a]">
          <div>
            {isVideo && video.price && (
                <span className="price-tag flex items-center gap-1 font-semibold text-[#00c853] text-sm">
                <Icon name="fab fa-ethereum" /> {video.price}
                </span>
            )}
            {!isVideo && (
                <span className="price-tag flex items-center gap-1 font-semibold text-teal-400 text-sm">
                <Icon name="fas fa-layer-group" /> {creator.nftCollections} Collections
                </span>
            )}
          </div>
          {isVideo && video.lastActivity && (
             <div className="text-gray-500 truncate" title={video.lastActivity}>
                <Icon name="fas fa-history" className="mr-1"/> {video.lastActivity.length > 20 ? video.lastActivity.substring(0,20) + "..." : video.lastActivity}
             </div>
          )}
           {isVideo && video.collateralized && (
             <div className="text-yellow-400" title="Content is collateralized">
                <Icon name="fas fa-link"/> Collateral
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoCard;

