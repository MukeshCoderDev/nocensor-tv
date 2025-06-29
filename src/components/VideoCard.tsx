import { Link } from 'react-router-dom';

interface Video {
    id: string;
    title: string;
    duration: string;
    thumbnail: string;
    creator: {
        name: string;
        address: string;
        avatar: string;
    };
    views: string;
    price: number;
    accessType: number;
}

interface VideoCardProps {
    video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden hover:scale-[1.03] transition-transform">
      <Link to={`/video/${video.id}`}>
        <div className="relative">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-48 object-cover"
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 px-2 py-1 rounded">
            {video.duration}
          </div>
          {video.accessType > 0 && (
            <div className="absolute top-2 right-2 bg-purple-600 px-2 py-1 rounded text-xs font-bold">
              {video.accessType === 1 ? 'SUBSCRIBE' :
               video.accessType === 2 ? 'PPV' : 'NFT'}
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/video/${video.id}`}>
          <h3 className="font-semibold line-clamp-2">{video.title}</h3>
        </Link>
        <Link to={`/creator/${video.creator.address}`} className="mt-2 flex items-center">
          <img
            src={video.creator.avatar}
            alt={video.creator.name}
            className="w-8 h-8 rounded-full mr-2"
          />
          <span className="text-gray-400 hover:text-white">{video.creator.name}</span>
        </Link>
        <div className="mt-2 flex justify-between text-sm text-gray-400">
          <span>{video.views} views</span>
          <span>{video.price > 0 ? `${video.price} ETH` : 'FREE'}</span>
        </div>
      </div>
    </div>
  );
}
