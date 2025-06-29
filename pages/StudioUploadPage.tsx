
import React, { useState, useCallback } from 'react';
import Icon from '../components/Icon';
import { STUDIO_NAV_ITEMS, THEME_COLORS } from '../constants';
import { StudioNavItem } from '../types';

interface StudioUploadPageProps {
    showNotification: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const StudioUploadPage: React.FC<StudioUploadPageProps> = ({ showNotification }) => {
  const [activeStudioTab, setActiveStudioTab] = useState<string>('upload');
  const [videoTitle, setVideoTitle] = useState('');
  const [price, setPrice] = useState('');
   const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [chapters, setChapters] = useState('');
  const [isShorts, setIsShorts] = useState('no');
  const [collaborators, setCollaborators] = useState('');
  const [accessControl, setAccessControl] = useState('public');


  const handleFileUpload = useCallback((files: FileList | null) => {
    if (files && files.length > 0) {
      showNotification(`Video file "${files[0].name}" added! Ready for upload to IPFS.`, 'success');
    }
  }, [showNotification]);

  const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.style.borderColor = THEME_COLORS.secondary;
    event.currentTarget.style.backgroundColor = 'rgba(255,107,139,0.1)';
  }, []);

  const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.style.borderColor = THEME_COLORS.primary;
    event.currentTarget.style.backgroundColor = '';
  }, []);
  
  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.style.borderColor = THEME_COLORS.primary;
    event.currentTarget.style.backgroundColor = '';
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      handleFileUpload(event.dataTransfer.files);
      event.dataTransfer.clearData();
    }
  }, [handleFileUpload]);

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!videoTitle) {
      showNotification('Please enter a video title', 'error');
      return;
    }
    let accessMessage = '';
    switch(accessControl) {
        case 'public': accessMessage = 'Public video uploaded successfully!'; break;
        case 'nft': accessMessage = 'NFT Access video uploaded successfully!'; break;
        case 'subscriber': accessMessage = 'Subscriber-only video uploaded successfully!'; break;
    }
    showNotification(accessMessage, 'success');
    // Reset form or navigate away
  };


  const renderStudioContent = () => {
    // For now, only upload content is fully fleshed out
    if (activeStudioTab === 'upload') {
      return (
        <div>
          <h3 className="text-xl font-semibold mb-6 text-[#f5f5f5]">Upload New Content</h3>
          <div 
            className="border-2 border-dashed border-[#8a2be2] rounded-[15px] p-8 sm:p-12 text-center mb-8 cursor-pointer transition-all duration-300 hover:bg-[rgba(138,43,226,0.1)]"
            onClick={() => document.getElementById('fileUploadInput')?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Icon name="fas fa-cloud-upload-alt" className="text-5xl text-[#8a2be2] mb-4" />
            <h3 className="text-lg font-semibold text-[#f5f5f5]">Drag and drop video files to upload</h3>
            <p className="text-sm text-gray-400">Your videos will be uploaded to IPFS for decentralized storage</p>
            <p className="mt-4 text-[#ff6b8b] text-sm"><Icon name="fas fa-lock" /> All content is encrypted before storage</p>
            <button className="mt-6 bg-[#8a2be2] hover:bg-[#6a0dad] text-white px-6 py-2.5 rounded-md font-semibold flex items-center gap-2 mx-auto">
              <Icon name="fas fa-folder-open" /> Select Files
            </button>
            <input type="file" id="fileUploadInput" className="hidden" accept="video/*" onChange={(e) => handleFileUpload(e.target.files)} />
          </div>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="form-group flex flex-col gap-2">
                <label htmlFor="title" className="font-medium text-[#f5f5f5]">Video Title</label>
                <input type="text" id="title" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} placeholder="Enter video title" className="bg-[#121212] border border-[#2a2a2a] px-4 py-3 rounded-[10px] text-[#f5f5f5] text-base focus:outline-none focus:border-[#8a2be2]" />
              </div>
              <div className="form-group flex flex-col gap-2">
                <label htmlFor="price" className="font-medium text-[#f5f5f5]">Price (ETH)</label>
                <input type="number" id="price" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" step="0.01" min="0" className="bg-[#121212] border border-[#2a2a2a] px-4 py-3 rounded-[10px] text-[#f5f5f5] text-base focus:outline-none focus:border-[#8a2be2]" />
              </div>
            </div>
            <div className="form-group flex flex-col gap-2">
              <label htmlFor="description" className="font-medium text-[#f5f5f5]">Description</label>
              <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell viewers about your video" rows={3} className="bg-[#121212] border border-[#2a2a2a] px-4 py-3 rounded-[10px] text-[#f5f5f5] text-base resize-none focus:outline-none focus:border-[#8a2be2]"></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group flex flex-col gap-2">
                    <label htmlFor="thumbnail" className="font-medium text-[#f5f5f5]">Thumbnail</label>
                    <input type="file" id="thumbnail" accept="image/*" className="bg-[#121212] border border-[#2a2a2a] px-4 py-2.5 rounded-[10px] text-[#f5f5f5] text-base file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#8a2be2] file:text-white hover:file:bg-[#6a0dad] focus:outline-none focus:border-[#8a2be2]" />
                </div>
                <div className="form-group flex flex-col gap-2">
                    <label htmlFor="category" className="font-medium text-[#f5f5f5]">Category</label>
                    <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="bg-[#121212] border border-[#2a2a2a] px-4 py-3 rounded-[10px] text-[#f5f5f5] text-base focus:outline-none focus:border-[#8a2be2]">
                        <option value="">Select category</option>
                        <option value="music">Music</option> <option value="gaming">Gaming</option> <option value="movies">Movies</option> <option value="live">Live</option> <option value="education">Education</option>
                    </select>
                </div>
            </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group flex flex-col gap-2">
                    <label htmlFor="chapters" className="font-medium text-[#f5f5f5]">Video Chapters</label>
                    <textarea id="chapters" value={chapters} onChange={(e) => setChapters(e.target.value)} placeholder="Add timestamps for chapters (e.g. 0:00 Introduction)" rows={2} className="bg-[#121212] border border-[#2a2a2a] px-4 py-3 rounded-[10px] text-[#f5f5f5] text-base resize-none focus:outline-none focus:border-[#8a2be2]"></textarea>
                </div>
                <div className="form-group flex flex-col gap-2">
                    <label htmlFor="shorts" className="font-medium text-[#f5f5f5]">Shorts Video</label>
                    <select id="shorts" value={isShorts} onChange={(e) => setIsShorts(e.target.value)} className="bg-[#121212] border border-[#2a2a2a] px-4 py-3 rounded-[10px] text-[#f5f5f5] text-base focus:outline-none focus:border-[#8a2be2]">
                        <option value="no">No</option>
                        <option value="yes">Yes (60 seconds or less)</option>
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="form-group flex flex-col gap-2">
                    <label htmlFor="subtitles" className="font-medium text-[#f5f5f5]">Subtitles/CC</label>
                     <input type="file" id="subtitles" accept=".srt,.vtt" className="bg-[#121212] border border-[#2a2a2a] px-4 py-2.5 rounded-[10px] text-[#f5f5f5] text-base file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#8a2be2] file:text-white hover:file:bg-[#6a0dad] focus:outline-none focus:border-[#8a2be2]" />
                </div>
                <div className="form-group flex flex-col gap-2">
                    <label htmlFor="collaborators" className="font-medium text-[#f5f5f5]">Collaborators</label>
                    <input type="text" id="collaborators" value={collaborators} onChange={(e) => setCollaborators(e.target.value)} placeholder="@username1, @username2" className="bg-[#121212] border border-[#2a2a2a] px-4 py-3 rounded-[10px] text-[#f5f5f5] text-base focus:outline-none focus:border-[#8a2be2]" />
                </div>
            </div>
             <div className="form-group flex flex-col gap-2">
                <label htmlFor="watermark" className="font-medium text-[#f5f5f5]">Video Watermark</label>
                <input type="file" id="watermark" accept="image/*" className="bg-[#121212] border border-[#2a2a2a] px-4 py-2.5 rounded-[10px] text-[#f5f5f5] text-base file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#8a2be2] file:text-white hover:file:bg-[#6a0dad] focus:outline-none focus:border-[#8a2be2]" />
            </div>
            <div className="form-group flex flex-col gap-2">
                <label className="font-medium text-[#f5f5f5]">Access Control</label>
                <div className="flex flex-wrap gap-4 mt-1 text-sm">
                    <label className="flex items-center gap-2 text-gray-300"><input type="radio" name="access" value="public" checked={accessControl === 'public'} onChange={(e) => setAccessControl(e.target.value)} className="form-radio text-[#8a2be2] bg-[#121212] border-[#2a2a2a] focus:ring-[#8a2be2]" /> Public</label>
                    <label className="flex items-center gap-2 text-gray-300"><input type="radio" name="access" value="nft" checked={accessControl === 'nft'} onChange={(e) => setAccessControl(e.target.value)} className="form-radio text-[#8a2be2] bg-[#121212] border-[#2a2a2a] focus:ring-[#8a2be2]" /> NFT Access Only</label>
                    <label className="flex items-center gap-2 text-gray-300"><input type="radio" name="access" value="subscriber" checked={accessControl === 'subscriber'} onChange={(e) => setAccessControl(e.target.value)} className="form-radio text-[#8a2be2] bg-[#121212] border-[#2a2a2a] focus:ring-[#8a2be2]" /> Subscribers Only</label>
                </div>
            </div>
            <div className="form-group flex flex-col gap-2">
                <label className="font-medium text-[#f5f5f5]">Revenue Split</label>
                <div className="flex items-center gap-4 mt-1">
                    <div className="flex-1 bg-[#121212] p-3 rounded-[10px]">
                        <div className="flex justify-between mb-1 text-sm text-gray-300"><span>Creator (You)</span><span>90%</span></div>
                        <div className="h-1.5 bg-[#8a2be2] rounded-full"></div>
                    </div>
                     <div className="flex-1 bg-[#121212] p-3 rounded-[10px]">
                        <div className="flex justify-between mb-1 text-sm text-gray-300"><span>Platform</span><span>10%</span></div>
                        <div className="h-1.5 bg-[#2a2a2a] rounded-full"></div>
                    </div>
                </div>
            </div>
            <button type="submit" className="bg-gradient-to-r from-[#8a2be2] to-[#6a0dad] text-white py-3.5 px-6 rounded-[10px] text-lg font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_20px_rgba(106,13,173,0.4)] mt-4 self-start">
              <Icon name="fas fa-upload" /> Upload to Blockchain
            </button>
          </form>
        </div>
      );
    }
    return <div className="text-xl text-center p-10 text-gray-400">Content for {activeStudioTab}</div>;
  };

  return (
    <div className="bg-[#1e1e1e] rounded-[15px] p-4 sm:p-8 text-[#f5f5f5]">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 pb-6 border-b border-[#2a2a2a]">Creator Studio</h2>
      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        <div className="lg:border-r border-[#2a2a2a] lg:pr-8">
          <ul className="list-none">
            {STUDIO_NAV_ITEMS.map((item: StudioNavItem) => (
              <li
                key={item.id}
                onClick={() => setActiveStudioTab(item.id)}
                className={`flex items-center gap-3 p-4 rounded-[10px] mb-2 cursor-pointer transition-colors duration-300 ${activeStudioTab === item.id ? 'bg-[rgba(138,43,226,0.1)] text-[#8a2be2]' : 'hover:bg-[rgba(138,43,226,0.05)] text-gray-300'}`}
              >
                <Icon name={item.icon} className="text-lg" />
                <span className="font-medium">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:pl-8">
          {renderStudioContent()}
        </div>
      </div>
    </div>
  );
};

export default StudioUploadPage;

