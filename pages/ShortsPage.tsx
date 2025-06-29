
import React, { useState } from 'react';
import Icon from '../components/Icon';
import { MOCK_SHORTS, THEME_COLORS } from '../constants';
import { Short as ShortType } from '../types';

const ShortsPage: React.FC = () => {
  const [currentShortIndex, setCurrentShortIndex] = useState(0);

  const currentShort = MOCK_SHORTS[currentShortIndex];

  const nextShort = () => {
    setCurrentShortIndex((prevIndex) => (prevIndex + 1) % MOCK_SHORTS.length);
  };

  const prevShort = () => {
    setCurrentShortIndex((prevIndex) => (prevIndex - 1 + MOCK_SHORTS.length) % MOCK_SHORTS.length);
  };

  if (!currentShort) {
    return <div className="flex items-center justify-center h-full text-white text-2xl">No shorts available.</div>;
  }

  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-black relative overflow-hidden">
      {/* Background blurred image */}
      <img 
        src={currentShort.thumbnailUrl} 
        alt="Blurred background" 
        className="absolute inset-0 w-full h-full object-cover filter blur-2xl opacity-30"
      />

      <div className="relative w-full max-w-sm h-[calc(100vh-120px)] sm:h-[calc(100vh-160px)] max-h-[700px] bg-[#0a0a0a] rounded-xl shadow-2xl overflow-hidden flex flex-col items-center justify-center border border-[#2a2a2a]">
        {/* Mock Video Player Area */}
        <div 
            className="w-full h-full bg-cover bg-center flex items-center justify-center"
            style={{ backgroundImage: `url(${currentShort.thumbnailUrl})` }}
        >
            <Icon name="fas fa-play-circle" className="text-white text-6xl opacity-70" />
        </div>

        {/* Overlay Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <h3 className="text-white text-lg font-semibold truncate">{currentShort.title}</h3>
          <p className="text-gray-300 text-sm">@{currentShort.creator}
            {currentShort.creatorTokenSymbol && <span className="ml-2 px-1.5 py-0.5 bg-[#8a2be2] text-white text-xs rounded-full">{currentShort.creatorTokenSymbol}</span>}
          </p>
          {currentShort.isNftGated && (
            <div className="mt-1 inline-flex items-center gap-1 bg-[#ff6b8b] text-white text-xs px-2 py-1 rounded-full">
              <Icon name="fas fa-gem" /> NFT Gated
            </div>
          )}
        </div>

        {/* Interaction Buttons (mock for shorts) */}
        <div className="absolute right-2 bottom-20 flex flex-col gap-4">
            <button className="text-white text-2xl flex flex-col items-center"><Icon name="fas fa-heart" /><span className="text-xs">1.2K</span></button>
            <button className="text-white text-2xl flex flex-col items-center"><Icon name="fas fa-comment-dots" /><span className="text-xs">305</span></button>
            <button className="text-white text-2xl flex flex-col items-center"><Icon name="fas fa-share" /><span className="text-xs">Share</span></button>
            <button className="text-white text-2xl flex flex-col items-center"><Icon name="fas fa-coins" /><span className="text-xs">Tip</span></button>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="absolute top-1/2 left-2 transform -translate-y-1/2">
        <button 
          onClick={prevShort} 
          className="bg-[rgba(0,0,0,0.5)] text-white p-3 rounded-full hover:bg-[rgba(0,0,0,0.7)] transition-colors"
          aria-label="Previous short"
        >
          <Icon name="fas fa-chevron-left" className="text-2xl" />
        </button>
      </div>
      <div className="absolute top-1/2 right-2 transform -translate-y-1/2">
        <button 
          onClick={nextShort} 
          className="bg-[rgba(0,0,0,0.5)] text-white p-3 rounded-full hover:bg-[rgba(0,0,0,0.7)] transition-colors"
          aria-label="Next short"
        >
          <Icon name="fas fa-chevron-right" className="text-2xl" />
        </button>
      </div>
      
      <div className="absolute bottom-4 text-center w-full">
        <p className="text-xs text-gray-400">Use arrow keys or swipe (on touch devices) for navigation.</p>
        <p className="text-xs text-gray-500 mt-1">Micro-tipping & on-chain interactions coming soon!</p>
      </div>
    </div>
  );
};

export default ShortsPage;
