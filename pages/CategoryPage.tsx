
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Section from '../components/Section';
import VideoCard from '../components/VideoCard';
import Icon from '../components/Icon';
import { CATEGORY_DATA_MAP, THEME_COLORS } from '../constants';
import { Video } from '../types';

interface CategoryPageProps {
  onPlayVideo: (video: Video) => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ onPlayVideo }) => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [categoryData, setCategoryData] = useState<{ title: string; videos: Video[] } | null>(null);

  useEffect(() => {
    if (categoryName && CATEGORY_DATA_MAP[categoryName.toLowerCase()]) {
      setCategoryData(CATEGORY_DATA_MAP[categoryName.toLowerCase()]);
    } else {
      // Fallback or error handling for unknown category
      setCategoryData({ title: "Unknown Category", videos: [] });
    }
  }, [categoryName]);

  if (!categoryData) {
    return <div className="text-center text-white py-10">Loading category...</div>;
  }
  
  const pageTitle = categoryName ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1) : "Category";

  return (
    <div className="text-white">
      <div className="mb-10 p-8 rounded-lg bg-gradient-to-br from-[#8a2be2]/80 via-[#1e1e1e]/50 to-[#ff6b8b]/80 shadow-2xl">
        <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500 animate-pulse">
            {pageTitle} Showcase
        </h1>
        <p className="text-center text-gray-300 mt-2">Explore the best {pageTitle.toLowerCase()} content on NoCensor TV.</p>
      </div>

      <Section title={`Featured ${categoryData.title}`} viewAllLink={`/category/${categoryName}/all`}>
        {categoryData.videos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoryData.videos.map(video => (
              <VideoCard key={video.id} item={video} type="video" onClick={() => onPlayVideo(video)} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-400 py-10">No content available in this category yet.</p>
        )}
      </Section>

       <Section title={`More in ${pageTitle}`}>
        {/* Placeholder for more sub-sections or filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-[#1e1e1e] rounded-lg border border-[#2a2a2a] text-center">
                <Icon name="fas fa-sort-amount-down" className="text-3xl text-[#ff6b8b] mb-3"/>
                <h4 className="text-lg font-semibold mb-2">Advanced Sorting</h4>
                <p className="text-sm text-gray-400">Filter by popularity, date, or on-chain activity (soon).</p>
            </div>
             <div className="p-6 bg-[#1e1e1e] rounded-lg border border-[#2a2a2a] text-center">
                <Icon name="fas fa-tags" className="text-3xl text-[#8a2be2] mb-3"/>
                <h4 className="text-lg font-semibold mb-2">Genre Tags</h4>
                <p className="text-sm text-gray-400">Discover niche content through detailed genre tagging.</p>
            </div>
             <div className="p-6 bg-[#1e1e1e] rounded-lg border border-[#2a2a2a] text-center">
                <Icon name="fas fa-vr-cardboard" className="text-3xl text-[#00c853] mb-3"/>
                <h4 className="text-lg font-semibold mb-2">VR Previews</h4>
                <p className="text-sm text-gray-400">Experience immersive previews for supported content (token-gated).</p>
            </div>
        </div>
      </Section>
    </div>
  );
};

export default CategoryPage;
