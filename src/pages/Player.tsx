import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';
import AccessControl from '../components/AccessControl';
import { getContract } from '../utils/contracts';
import { fetchFromIPFS } from '../utils/ipfs';
import { ethers } from 'ethers'; // Ensure ethers is imported
import DecentralizedVideoPlayer from '../components/DecentralizedVideoPlayer.jsx';

interface Video {
    id: string;
    title: string;
    description: string;
    creator: {
        name: string;
        address: string;
        subscribers: string;
    };
    views: string;
    price: number;
    accessType: number;
    cid: string;
    videoUrl?: string; // Added for video source
}

export default function Player() {
  const { id } = useParams<{ id: string }>(); // Keep type for useParams
  const { account, library } = useWeb3();
  const [video, setVideo] = useState<Video | null>(null); // Keep type for useState
  const [accessGranted, setAccessGranted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        if (!id) return; // Keep this check
        // In production, get from ContentRegistry
        const mockVideo: Video = { // Keep type for mockVideo
          id,
          title: 'Private Session #42 - Full Unedited Experience',
          description: 'Exclusive uncut footage from the latest session',
          creator: {
            name: 'Midnight Jay',
            address: '0xmidnightjay',
            subscribers: '182K'
          },
          views: '18.2K',
          price: 0.15,
          accessType: 2, // PPV
          cid: 'Qm...'
        };

        // Fetch video metadata from IPFS
        const metadata = await fetchFromIPFS(mockVideo.cid);

        setVideo({
          ...mockVideo,
          ...metadata
        });

        // Check access
        if (account && library) { // Keep this check
          const moduleManager = getContract('moduleManager', library.getSigner() as unknown as ethers.Signer);
          const hasAccess = await moduleManager.checkAccess(id, account);
          setAccessGranted(hasAccess);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading video:', error);
        setLoading(false);
      }
    };

    loadVideo();
  }, [id, account, library]);

  const purchaseAccess = async () => {
    if (!video || !library) return; // Keep this check
    try {
      const moduleManager = getContract('moduleManager', library.getSigner() as unknown as ethers.Signer);
      const tx = await moduleManager.execute(id, {
        value: ethers.parseEther(video.price.toString()) // Changed to ethers.parseEther
      });
      await tx.wait();
      setAccessGranted(true);
    } catch (error) {
      console.error('Purchase failed:', error);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading...</div>;
  }

  if (!video) { // Keep this check
    return <div className="container mx-auto p-4 text-center">Video not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {!accessGranted ? (
        <AccessControl 
          contentId={Number(video.id)} 
          price={video.price} 
          accessType={video.accessType === 2 ? 'PPV' : video.accessType === 1 ? 'SUBSCRIPTION' : 'NFT'} 
        />
      ) : (
        <div>
          <div className="bg-black rounded-xl mb-6">
            {/* Decentralized video playback */}
            <DecentralizedVideoPlayer cid={video.cid} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <h1 className="text-2xl font-bold mb-2">{video.title}</h1>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gray-700 mr-3"></div>
                  <div>
                    <h3 className="font-bold">{video.creator.name}</h3>
                    <p className="text-gray-400">{video.creator.subscribers} subscribers</p>
                  </div>
                  <button className="nocensor-gradient ml-4 px-4 py-2 rounded-full text-sm">
                    Subscribe
                  </button>
                </div>
                <div className="flex space-x-3">
                  <button className="bg-gray-700 px-4 py-2 rounded-full">
                    Like
                  </button>
                  <button className="bg-gray-700 px-4 py-2 rounded-full">
                    Tip
                  </button>
                </div>
              </div>

              <div className="bg-gray-800 rounded-xl p-4 mb-6">
                <h3 className="font-bold mb-2">Description</h3>
                <p className="text-gray-300">{video.description}</p>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">More from {video.creator.name}</h2>
              {/* Recommended videos would go here */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
