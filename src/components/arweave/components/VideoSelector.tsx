import React from 'react';

interface VideoSelectorProps {
  onVideoSelected: (file: File) => void;
  selectedVideo: File | null;
  isDisabled?: boolean;
}

const VideoSelector: React.FC<VideoSelectorProps> = ({
  onVideoSelected,
  selectedVideo,
  isDisabled = false
}) => {
  return (
    <div className="video-selector">
      {/* Video selector implementation will be added in later tasks */}
      <div className="text-center p-4 border border-gray-600 rounded-lg">
        <p className="text-gray-400">Video Selector Component</p>
        {selectedVideo && (
          <p className="text-green-400 mt-2">Selected: {selectedVideo.name}</p>
        )}
      </div>
    </div>
  );
};

export default VideoSelector;