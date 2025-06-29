import { useEffect, useState } from 'react';
import VideoCard from '../components/VideoCard';
import { fetchFromIPFS } from '../utils/ipfs';
import { getContract } from '../utils/contracts';

const mockVideos = [
  {
    id: '1',
    title: 'Midnight Fantasy Collection - Exclusive Crystal Rose',
    duration: '24:18',
    thumbnail: 'https://via.placeholder.com/300',
    creator: {
      name: 'Crystal Rose',
      address: '0xcrystalrose',
      avatar: 'https://via.placeholder.com/40'
    },
    views: '24.5K',
    price: 0.25,
    accessType: 3 // NFT
  },
  // Add more mock videos
];

export default function Home() {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production, replace with actual contract calls
    const loadVideos = async () => {
      try {
        // Simulate loading time
        setTimeout(() => {
          setVideos(mockVideos);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error loading videos:', error);
        setLoading(false);
      }
    };

    loadVideos();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="nocensor-gradient rounded-2xl p-8 mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Decentralized. Uncensorable. Empowering.</h1>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          NoCensor TV is the first truly decentralized adult content platform built on blockchain technology.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-white text-purple-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-100">
            Start Creating
          </button>
          <button className="bg-black bg-opacity-30 px-6 py-3 rounded-lg font-bold hover:bg-opacity-40">
            Explore Content
          </button>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Recommended For You</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-xl h-80 animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videos.map(video => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Top Creators</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-800 rounded-xl p-4 text-center">
              <div className="w-20 h-20 rounded-full mx-auto bg-gray-700 mb-3"></div>
              <h3 className="font-bold">Creator Name</h3>
              <p className="text-gray-400">245K subscribers</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
