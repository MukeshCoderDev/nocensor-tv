
import React from 'react';
import Section from '../components/Section';
import VideoCard from '../components/VideoCard';
import Icon from '../components/Icon';
import { NFT_ACCESS_VIDEOS, MOCK_NFT_COLLECTIONS, THEME_COLORS } from '../constants';
import { Video, NftCollectionItem } from '../types';

interface NftAccessPageProps {
  onPlayVideo: (video: Video) => void;
}

const NftCollectionCard: React.FC<{ collection: NftCollectionItem }> = ({ collection }) => (
  <div className="bg-[#1e1e1e] rounded-[15px] overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.5)] border border-[#2a2a2a] hover:border-[#8a2be2] transition-all duration-300 group">
    <div className="h-[250px] w-full overflow-hidden">
      <img src={collection.imageUrl} alt={collection.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
    </div>
    <div className="p-5">
      <h3 className="text-xl font-semibold text-white mb-2 truncate" title={collection.name}>{collection.name}</h3>
      <p className="text-sm text-gray-400 mb-1">By: <span className="text-[#ff6b8b]">{collection.creator}</span></p>
      <p className="text-xs text-gray-500 mb-3 h-10 overflow-hidden">{collection.description || "No description available."}</p>
      
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div>
            <p className="text-gray-400">Floor Price:</p>
            <p className="text-white font-medium">{collection.floorPrice || 'N/A'}</p>
        </div>
        <div>
            <p className="text-gray-400">Total Volume:</p>
            <p className="text-white font-medium">{collection.totalVolume || 'N/A'}</p>
        </div>
      </div>

      <div className="flex flex-col space-y-2">
        <button className="w-full bg-gradient-to-r from-[#8a2be2] to-[#6a0dad] text-white py-2.5 px-4 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
            <Icon name="fas fa-store" /> View Collection Items
        </button>
        {collection.authenticationCertificateUrl && (
             <a 
                href={collection.authenticationCertificateUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-transparent border-2 border-[#8a2be2] text-[#8a2be2] py-2 px-4 rounded-lg text-sm font-semibold hover:bg-[#8a2be2] hover:text-white transition-colors flex items-center justify-center gap-2"
             >
                <Icon name="fas fa-certificate" /> View Authentication
             </a>
        )}
      </div>
    </div>
  </div>
);


const NftAccessPage: React.FC<NftAccessPageProps> = ({ onPlayVideo }) => {
  return (
    <div className="text-white">
      <Section title="Featured NFT Collections" headerContent={
        <p className="text-sm text-gray-400 hidden md:block">Unlock exclusive content by owning NFTs from these collections.</p>
      }>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {MOCK_NFT_COLLECTIONS.map(collection => (
            <NftCollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </Section>

      <Section title="Exclusive Video Content for NFT Holders">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {NFT_ACCESS_VIDEOS.map(video => (
            <VideoCard key={video.id} item={video} type="video" onClick={() => onPlayVideo(video)} />
          ))}
          {NFT_ACCESS_VIDEOS.length === 0 && (
            <p className="col-span-full text-center text-gray-400">No NFT-gated videos currently available. Check back soon!</p>
          )}
        </div>
      </Section>

       <Section title="How NFT Access Works">
        <div className="bg-[#1e1e1e] p-6 rounded-lg border border-[#2a2a2a]">
            <h3 className="text-xl font-semibold mb-3 text-[#ff6b8b]">Seamless & Secure</h3>
            <p className="text-gray-300 mb-2">
                Connect your Web3 wallet (e.g., MetaMask) to NoCensor TV. Our platform automatically verifies your NFT holdings from supported collections.
            </p>
            <p className="text-gray-300 mb-2">
                If you own a required NFT, exclusive content is instantly unlocked for you. No extra steps, just pure, decentralized access.
            </p>
            <p className="text-gray-400 text-sm">
                <Icon name="fas fa-shield-alt" className="mr-2 text-[#8a2be2]"/> Your assets remain in your wallet. We only verify ownership.
            </p>
        </div>
      </Section>
    </div>
  );
};

export default NftAccessPage;
