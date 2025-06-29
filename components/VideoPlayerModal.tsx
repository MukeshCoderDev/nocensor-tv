
import React, { useState } from 'react';
import { Video, Comment as CommentType } from '../types';
import Icon from './Icon';
import Modal from './Modal';
import { MOCK_COMMENTS, THEME_COLORS } from '../constants';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: Video | null;
}

const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({ isOpen, onClose, video }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null); // null, true (liked), false (disliked)

  if (!video) return null;

  const togglePlay = () => setIsPlaying(!isPlaying);
  const handleLike = () => setLiked(true);
  const handleDislike = () => setLiked(false);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={video.title} className="w-full max-w-3xl !p-0" showCloseButton={true}>
        <div className="player-video w-full h-[300px] sm:h-[450px] bg-cover bg-center" style={{backgroundImage: `url(${video.thumbnailUrl})`}}>
            {/* Placeholder for actual video element */}
        </div>
        <div className="player-controls p-4 bg-[rgba(10,10,10,0.9)]">
            <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-medium text-white">{video.title}</h4>
                <div className="flex gap-3">
                    <button onClick={handleLike} className={`player-action-btn text-lg ${liked === true ? 'text-[#00c853]' : 'text-gray-400 hover:text-white'}`}>
                        <Icon name="fas fa-thumbs-up" />
                    </button>
                    <button onClick={handleDislike} className={`player-action-btn text-lg ${liked === false ? 'text-[#ffab00]' : 'text-gray-400 hover:text-white'}`}>
                        <Icon name="fas fa-thumbs-down" />
                    </button>
                    <button className="player-action-btn text-gray-400 hover:text-white text-lg"><Icon name="fas fa-share" /></button>
                    <button className="player-action-btn text-gray-400 hover:text-white text-lg"><Icon name="fas fa-save" /></button>
                </div>
            </div>
            <div className="player-progress w-full h-1.5 bg-[#2a2a2a] rounded-full mb-4 relative cursor-pointer">
                <div className="player-progress-filled absolute top-0 left-0 h-full w-[30%] bg-[#ff6b8b] rounded-full"></div>
            </div>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <button onClick={togglePlay} className="player-action-btn text-white text-xl">
                        <Icon name={isPlaying ? "fas fa-pause" : "fas fa-play"} />
                    </button>
                    <button className="player-action-btn text-gray-400 hover:text-white text-lg"><Icon name="fas fa-step-backward" /></button>
                    <button className="player-action-btn text-gray-400 hover:text-white text-lg"><Icon name="fas fa-step-forward" /></button>
                    <Icon name="fas fa-volume-up" className="text-gray-400 text-lg" />
                </div>
                <div className="flex items-center gap-3">
                    <select className="player-speed bg-[#121212] text-white border border-[#2a2a2a] px-2 py-1 rounded text-xs cursor-pointer focus:outline-none">
                        <option>1x</option><option>1.25x</option><option>1.5x</option><option>2x</option>
                    </select>
                    <select className="player-resolution bg-[#121212] text-white border border-[#2a2a2a] px-2 py-1 rounded text-xs cursor-pointer focus:outline-none">
                        <option>1080p</option><option>720p</option><option>480p</option><option>360p</option>
                    </select>
                    <button className="player-action-btn text-gray-400 hover:text-white text-lg"><Icon name="fas fa-expand" /></button>
                </div>
            </div>
        </div>
        <div className="comment-section p-4 max-h-[300px] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-white">Comments ({MOCK_COMMENTS.length})</h3>
            {MOCK_COMMENTS.map(comment => (
                <div key={comment.id} className="comment flex gap-4 mb-6">
                    <div className="comment-avatar w-10 h-10 rounded-full bg-gradient-to-br from-[#8a2be2] to-[#ff6b8b] flex items-center justify-center font-semibold text-white shrink-0">
                        {comment.avatarChar}
                    </div>
                    <div className="comment-content flex-1">
                        <div className="comment-header flex justify-between items-center mb-1">
                            <span className="comment-author font-semibold text-white text-sm">{comment.author}</span>
                            <span className="comment-time text-gray-400 text-xs">{comment.time}</span>
                        </div>
                        <p className="comment-text text-gray-300 text-sm mb-2">{comment.text}</p>
                        <div className="comment-actions flex gap-4">
                            <button className="text-gray-400 hover:text-white text-xs flex items-center gap-1"><Icon name="fas fa-thumbs-up" /> {comment.likes}</button>
                            <button className="text-gray-400 hover:text-white text-xs flex items-center gap-1"><Icon name="fas fa-thumbs-down" /> {comment.dislikes}</button>
                            <button className="text-gray-400 hover:text-white text-xs">Reply</button>
                        </div>
                    </div>
                </div>
            ))}
            <div className="comment-form flex gap-3 mt-6">
                <input type="text" placeholder="Add a comment..." className="flex-1 bg-[#121212] border border-[#2a2a2a] px-4 py-2.5 rounded-full text-white text-sm focus:outline-none focus:border-[#8a2be2]" />
                <button className="bg-[#8a2be2] hover:bg-[#6a0dad] text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors">Comment</button>
            </div>
        </div>
    </Modal>
  );
};

export default VideoPlayerModal;


