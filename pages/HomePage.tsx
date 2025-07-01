
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Section from '../components/Section';
import VideoCard from '../components/VideoCard';
import FeatureCard from '../components/FeatureCard';
import Icon from '../components/Icon';
import { RECOMMENDED_VIDEOS, TOP_CREATORS, PLATFORM_FEATURES, THEME_COLORS } from '../constants';
import { Video } from '../types';

// Import the decentralized IPFS uploader
import DecentralizedIpfsUploader from '../src/components/DecentralizedIpfsUploader';

interface HomePageProps {
  onPlayVideo: (video: Video) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onPlayVideo }) => {
  const navigate = useNavigate();

  return (
    <div className="text-[#f5f5f5]">
      {/* Banner */}
      <div className="bg-gradient-to-r from-[rgba(138,43,226,0.7)] to-[rgba(255,107,139,0.6)] rounded-[15px] p-8 sm:p-12 mb-8 relative overflow-hidden">
        <div className="max-w-3xl relative z-[2]">
          <h1 className="font-['Poppins'] text-3xl sm:text-4xl font-bold mb-4">Decentralized. Uncensorable. Empowering.</h1>
          <p className="text-base sm:text-lg mb-6 text-gray-200">
            NoCensor TV is the first truly decentralized adult content platform built on blockchain technology. Creators keep 90% of earnings, fans enjoy exclusive content with no intermediaries.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => navigate('/studio/upload')}
              className="px-7 py-3 rounded-full font-semibold text-base bg-gradient-to-r from-[#8a2be2] to-[#6a0dad] text-white border-none inline-flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(0,0,0,0.3)] transition-all duration-300"
            >
              <Icon name="fas fa-video" /> Start Creating
            </button>
            <button className="px-7 py-3 rounded-full font-semibold text-base bg-transparent text-white border-2 border-white inline-flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(0,0,0,0.3)] transition-all duration-300">
              <Icon name="fas fa-star" /> Explore Content
            </button>
          </div>
        </div>
      </div>

      {/* Decentralized IPFS Uploader for build deployment */}
      <div className="my-8">
        <DecentralizedIpfsUploader />
      </div>

      {/* Platform Features */}
      <Section title="Platform Features" headerContent={<p className="text-sm text-gray-400 hidden md:block">Everything creators and viewers need</p>}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {PLATFORM_FEATURES.map(feature => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </Section>

      {/* Recommended Videos */}
      <Section title="Recommended For You" viewAllLink="/recommended">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {RECOMMENDED_VIDEOS.map(video => (
            <VideoCard key={video.id} item={video} type="video" onClick={() => onPlayVideo(video)} />
          ))}
        </div>
      </Section>

      {/* Top Creators */}
      <Section title="Top Creators" viewAllLink="/creators">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {TOP_CREATORS.map(creator => (
            <VideoCard key={creator.id} item={creator} type="creator" />
          ))}
        </div>
      </Section>
    </div>
  );
};

export default HomePage;
