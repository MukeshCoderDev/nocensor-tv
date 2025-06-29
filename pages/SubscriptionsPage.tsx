
import React from 'react';
import Section from '../components/Section';
import VideoCard from '../components/VideoCard';
import Icon from '../components/Icon';
import { SUBSCRIPTIONS_VIDEOS, THEME_COLORS } from '../constants';
import { Video } from '../types';

interface SubscriptionsPageProps {
  onPlayVideo: (video: Video) => void;
}

const SubscriptionsPage: React.FC<SubscriptionsPageProps> = ({ onPlayVideo }) => {
  return (
    <div className="text-[#f5f5f5]">
      <Section 
        title="Your Exclusive Creator Ecosystem"
        headerContent={
          <p className="text-sm text-gray-400 hidden md:block">
            <Icon name="fas fa-shield-alt" className="mr-2 text-teal-400" />
            Access token-gated content & support your favorite creators.
          </p>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {SUBSCRIPTIONS_VIDEOS.map(video => (
            <VideoCard key={video.id} item={video} type="video" onClick={() => onPlayVideo(video)} />
          ))}
          {SUBSCRIPTIONS_VIDEOS.length === 0 && (
             <p className="col-span-full text-center text-gray-400 py-10">You are not subscribed to any exclusive content yet.</p>
          )}
        </div>
      </Section>

      {/* Creator Vault Financials Placeholder */}
      <Section 
        title="Creator Vault Financials"
        headerContent={
            <span className="px-3 py-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-xs font-semibold rounded-full shadow-md">
                <Icon name="fas fa-landmark" className="mr-1.5" /> Creator Economy Hub
            </span>
        }
      >
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-[15px] p-6 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-xl">
          <div className="flex flex-col items-center text-center p-4 bg-[#121212] rounded-lg border border-[#2a2a2a] hover:border-indigo-500 transition-colors">
            <Icon name="fas fa-piggy-bank" className="text-4xl text-indigo-500 mb-3" />
            <h4 className="text-lg font-semibold text-white mb-1">Auto-Compounding DAO Rewards</h4>
            <p className="text-xs text-gray-400">Track earned tokens staked in creator DAOs. (Coming Soon)</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-[#121212] rounded-lg border border-[#2a2a2a] hover:border-purple-500 transition-colors">
            <Icon name="fas fa-chart-pie" className="text-4xl text-purple-500 mb-3" />
            <h4 className="text-lg font-semibold text-white mb-1">Royalty Forecast Engine</h4>
            <p className="text-xs text-gray-400">AI-predicted earnings based on viewership patterns. (Coming Soon)</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-[#121212] rounded-lg border border-[#2a2a2a] hover:border-pink-500 transition-colors">
            <Icon name="fas fa-link" className="text-4xl text-pink-500 mb-3" />
            <h4 className="text-lg font-semibold text-white mb-1">Collateralized Content Mgt.</h4>
            <p className="text-xs text-gray-400">Manage videos backing creator's NFT loans. (DeFi Tools)</p>
          </div>
        </div>
      </Section>

      {/* Premium Membership Utilities Placeholder */}
      <Section 
        title="Exclusive Membership Utilities"
         headerContent={
            <span className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-green-500 text-xs font-semibold rounded-full shadow-md">
                <Icon name="fas fa-user-friends" className="mr-1.5" /> Next-Gen Fan Engagement
            </span>
        }
      >
        <div className="bg-[#1e1e1e] border border-[#2a2a2a] rounded-[15px] p-6 grid grid-cols-1 md:grid-cols-3 gap-6 shadow-xl">
          <div className="flex flex-col items-center text-center p-4 bg-[#121212] rounded-lg border border-[#2a2a2a] hover:border-cyan-500 transition-colors">
            <Icon name="fas fa-calendar-check" className="text-4xl text-cyan-500 mb-3" />
            <h4 className="text-lg font-semibold text-white mb-1">Token-Gated Calendars</h4>
            <p className="text-xs text-gray-400">Schedule exclusive content drops for subscribers. (Tiered Access)</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-[#121212] rounded-lg border border-[#2a2a2a] hover:border-teal-500 transition-colors">
            <Icon name="fas fa-users-cog" className="text-4xl text-teal-500 mb-3" />
            <h4 className="text-lg font-semibold text-white mb-1">Multi-Sig Content Vaults</h4>
            <p className="text-xs text-gray-400">Collaborative watch parties requiring N/M signatures. (Secure & Social)</p>
          </div>
          <div className="flex flex-col items-center text-center p-4 bg-[#121212] rounded-lg border border-[#2a2a2a] hover:border-green-500 transition-colors">
            <Icon name="fas fa-percentage" className="text-4xl text-green-500 mb-3" />
            <h4 className="text-lg font-semibold text-white mb-1">Yield-Bearing Subscriptions</h4>
            <p className="text-xs text-gray-400">Display APY% for staked subscription fees. (Earn While You Watch)</p>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default SubscriptionsPage;
