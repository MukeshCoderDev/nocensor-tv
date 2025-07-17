
import React, { useState, useCallback } from 'react';
import Icon from '../components/Icon';
import { STUDIO_NAV_ITEMS, THEME_COLORS } from '../constants';
import { StudioNavItem } from '../types';
import { uploadToArweave } from '../arweave-uploader.js';
import { ArweaveFeatureCard } from '../src/components/arweave/ArweaveFeatureCard';
import WalletKeyLoader from '../src/components/arweave/components/WalletKeyLoader';
import ErrorDisplay from '../src/components/arweave/components/ErrorDisplay';

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
      setSelectedVideoFile(files[0]);
      showNotification(`Video file "${files[0].name}" added! Ready for upload to Arweave.`, 'success');
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

  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [arweaveKey, setArweaveKey] = useState<any>(null);
  const [walletInfo, setWalletInfo] = useState<any>(null);
  const [isValidatingWallet, setIsValidatingWallet] = useState(false);
  const [walletError, setWalletError] = useState<any>(null);

  const handleWalletLoaded = async (wallet: any) => {
    setIsValidatingWallet(true);
    setWalletError(null);
    
    try {
      setArweaveKey(wallet);
      
      // Simulate wallet info retrieval (this would be replaced with actual Arweave API calls)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate a mock wallet address from the key
      const mockAddress = `${wallet.n.substring(0, 43)}...`;
      const formattedAddress = `${mockAddress.substring(0, 6)}...${mockAddress.substring(mockAddress.length - 4)}`;
      
      setWalletInfo({
        address: mockAddress,
        formattedAddress,
        balance: 0.5,
        formattedBalance: '0.5 AR'
      });
      
      showNotification('Arweave wallet loaded successfully!', 'success');
    } catch (err) {
      setWalletError({
        type: 'network',
        message: 'Failed to retrieve wallet information',
        recoverable: true
      });
    } finally {
      setIsValidatingWallet(false);
    }
  };

  const handleWalletError = (error: any) => {
    setWalletError(error);
    setArweaveKey(null);
    setWalletInfo(null);
    showNotification('Failed to load wallet key. Please try again.', 'error');
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Validation
    if (!videoTitle) {
      showNotification('Please enter a video title', 'error');
      return;
    }
    
    if (!selectedVideoFile) {
      showNotification('Please select a video file first', 'error');
      return;
    }

    if (!arweaveKey) {
      showNotification('Please load your Arweave wallet key first', 'error');
      return;
    }

    setIsUploading(true);
    
    try {
      // Create metadata object
      const metadata = {
        title: videoTitle,
        description: description,
        category: category,
        price: price,
        accessControl: accessControl,
        collaborators: collaborators,
        isShorts: isShorts,
        uploadDate: new Date().toISOString(),
        platform: 'NoCensor TV',
        version: '1.0.0'
      };

      showNotification('Starting upload to Arweave blockchain...', 'info');
      
      // Convert file to buffer for Arweave upload
      const arrayBuffer = await selectedVideoFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Upload to Arweave with the user's actual wallet key and metadata
      const transactionId = await uploadToArweave(uint8Array, arweaveKey, {
        contentType: 'video/mp4',
        tags: {
          'Title': videoTitle,
          'Description': description,
          'Category': category,
          'Access-Control': accessControl,
          'Price': price || '0',
          'Creator': 'NoCensor-TV-Creator'
        }
      });
      
      showNotification(`Video uploaded to Arweave! Transaction ID: ${transactionId}`, 'success');
      
      let accessMessage = '';
      switch(accessControl) {
          case 'public': accessMessage = 'Public video uploaded successfully to Arweave!'; break;
          case 'nft': accessMessage = 'NFT Access video uploaded successfully to Arweave!'; break;
          case 'subscriber': accessMessage = 'Subscriber-only video uploaded successfully to Arweave!'; break;
      }
      
      showNotification(accessMessage, 'success');
      
      // Reset form
      setVideoTitle('');
      setDescription('');
      setCategory('');
      setPrice('');
      setSelectedVideoFile(null);
      
    } catch (error) {
      console.error('Upload error:', error);
      showNotification(`Upload failed: ${error.message || 'Please try again.'}`, 'error');
    } finally {
      setIsUploading(false);
    }
  };


  // Mock data for My Videos
  const myVideos = [
    {
      id: 1,
      title: "Midnight Fantasy Collection - Behind the Scenes",
      thumbnail: "https://picsum.photos/seed/video1/400/225",
      duration: "24:18",
      views: 24500,
      earnings: 3.2,
      status: "Published",
      uploadDate: "2024-07-15",
      arweaveTxId: "12pHuP4dj8wWXZT1E9eRptsyObsDuQ7j_QpJN54eE0"
    },
    {
      id: 2,
      title: "Private Session #42 - Full Experience",
      thumbnail: "https://picsum.photos/seed/video2/400/225",
      duration: "18:42",
      views: 18200,
      earnings: 2.8,
      status: "Published",
      uploadDate: "2024-07-12",
      arweaveTxId: "8xKmN2fj5kLpQr9sVt6wYz3cBnM4hG7eD1aF0iU5oP2q"
    },
    {
      id: 3,
      title: "Creating My Latest NFT Collection",
      thumbnail: "https://picsum.photos/seed/video3/400/225",
      duration: "32:15",
      views: 32700,
      earnings: 4.1,
      status: "Published",
      uploadDate: "2024-07-10",
      arweaveTxId: "9yLnO3gk6mMqRs0tWu7xZa4dCoN5iH8fE2bG1jV6pQ3r"
    }
  ];

  const renderStudioContent = () => {
    if (activeStudioTab === 'myVideos') {
      return (
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-[#f5f5f5] mb-2">
              <Icon name="fas fa-film" className="mr-3 text-[#8a2be2]" />
              My Videos
            </h3>
            <p className="text-gray-400 text-lg">Manage your uploaded content and track performance</p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#2a2a2a] rounded-xl p-6 border border-purple-500/30">
              <div className="flex items-center justify-between mb-2">
                <Icon name="fas fa-video" className="text-2xl text-purple-400" />
                <span className="text-green-400 text-sm">+2 this week</span>
              </div>
              <h4 className="text-2xl font-bold text-white">{myVideos.length}</h4>
              <p className="text-gray-400 text-sm">Total Videos</p>
            </div>

            <div className="bg-[#2a2a2a] rounded-xl p-6 border border-green-500/30">
              <div className="flex items-center justify-between mb-2">
                <Icon name="fas fa-eye" className="text-2xl text-green-400" />
                <span className="text-green-400 text-sm">+12.5%</span>
              </div>
              <h4 className="text-2xl font-bold text-white">{myVideos.reduce((sum, video) => sum + video.views, 0).toLocaleString()}</h4>
              <p className="text-gray-400 text-sm">Total Views</p>
            </div>

            <div className="bg-[#2a2a2a] rounded-xl p-6 border border-yellow-500/30">
              <div className="flex items-center justify-between mb-2">
                <Icon name="fas fa-coins" className="text-2xl text-yellow-400" />
                <span className="text-green-400 text-sm">+8.3%</span>
              </div>
              <h4 className="text-2xl font-bold text-white">{myVideos.reduce((sum, video) => sum + video.earnings, 0).toFixed(2)} ETH</h4>
              <p className="text-gray-400 text-sm">Total Earnings</p>
            </div>

            <div className="bg-[#2a2a2a] rounded-xl p-6 border border-pink-500/30">
              <div className="flex items-center justify-between mb-2">
                <Icon name="fas fa-chart-line" className="text-2xl text-pink-400" />
                <span className="text-green-400 text-sm">+15.7%</span>
              </div>
              <h4 className="text-2xl font-bold text-white">8.4%</h4>
              <p className="text-gray-400 text-sm">Avg Engagement</p>
            </div>
          </div>

          {/* Videos Grid */}
          <div className="space-y-6">
            {myVideos.map((video) => (
              <div key={video.id} className="bg-[#2a2a2a] rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Thumbnail */}
                  <div className="lg:w-80 flex-shrink-0">
                    <div className="relative rounded-lg overflow-hidden bg-gradient-to-br from-purple-600/20 to-pink-600/20">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-48 lg:h-32 object-cover"
                      />
                      <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/50">
                        <Icon name="fas fa-play" className="text-white text-2xl" />
                      </div>
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="flex-1">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-white mb-2">{video.title}</h4>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-3">
                          <span className="flex items-center">
                            <Icon name="fas fa-calendar" className="mr-1" />
                            {new Date(video.uploadDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <Icon name="fas fa-eye" className="mr-1" />
                            {video.views.toLocaleString()} views
                          </span>
                          <span className="flex items-center">
                            <Icon name="fas fa-coins" className="mr-1" />
                            {video.earnings} ETH earned
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            video.status === 'Published' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {video.status}
                          </span>
                          <a 
                            href={`https://arweave.net/${video.arweaveTxId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium hover:bg-purple-500/30 transition-colors"
                          >
                            <Icon name="fas fa-external-link-alt" className="mr-1" />
                            View on Arweave
                          </a>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col lg:flex-row gap-2 mt-4 lg:mt-0">
                        <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors">
                          <Icon name="fas fa-edit" className="mr-2" />
                          Edit
                        </button>
                        <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
                          <Icon name="fas fa-chart-bar" className="mr-2" />
                          Analytics
                        </button>
                        <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
                          <Icon name="fas fa-trash" className="mr-2" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {myVideos.length === 0 && (
            <div className="text-center py-16">
              <Icon name="fas fa-video" className="text-6xl text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">No videos uploaded yet</h3>
              <p className="text-gray-500 mb-6">Start creating content to build your audience</p>
              <button 
                onClick={() => setActiveStudioTab('upload')}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                <Icon name="fas fa-plus" className="mr-2" />
                Upload Your First Video
              </button>
            </div>
          )}
        </div>
      );
    }
    
    if (activeStudioTab === 'upload') {
      return (
        <div className="max-w-4xl mx-auto">
          {/* Welcome Header */}
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-[#f5f5f5] mb-2">
              <Icon name="fas fa-video" className="mr-3 text-[#8a2be2]" />
              Upload Your Video
            </h3>
            <p className="text-gray-400 text-lg">Share your content with the world in just a few simple steps</p>
          </div>

          {/* Step-by-Step Upload Process */}
          <div className="space-y-8">
            
            {/* Step 1: Upload Video */}
            <div className="bg-[#2a2a2a] rounded-[15px] p-6 border-l-4 border-[#8a2be2]">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-[#8a2be2] rounded-full flex items-center justify-center text-white font-bold mr-3">1</div>
                <h4 className="text-xl font-semibold text-[#f5f5f5]">Choose Your Video</h4>
              </div>
              
              <div 
                className="border-2 border-dashed border-[#8a2be2] rounded-[15px] p-8 text-center cursor-pointer transition-all duration-300 hover:bg-[rgba(138,43,226,0.1)] hover:border-[#ff6b8b]"
                onClick={() => document.getElementById('fileUploadInput')?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <Icon name="fas fa-cloud-upload-alt" className="text-4xl text-[#8a2be2] mb-3" />
                <h5 className="text-lg font-semibold text-[#f5f5f5] mb-2">Drop your video here or click to browse</h5>
                <p className="text-sm text-gray-400 mb-4">Supports MP4, MOV, AVI, and more • Max size: 2GB</p>
                <button type="button" className="bg-[#8a2be2] hover:bg-[#6a0dad] text-white px-6 py-2.5 rounded-full font-semibold flex items-center gap-2 mx-auto transition-all duration-300">
                  <Icon name="fas fa-folder-open" /> Browse Files
                </button>
                <input type="file" id="fileUploadInput" className="hidden" accept="video/*" onChange={(e) => handleFileUpload(e.target.files)} />
              </div>
            </div>

            {/* Step 2: Basic Information */}
            <div className="bg-[#2a2a2a] rounded-[15px] p-6 border-l-4 border-[#ff6b8b]">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-[#ff6b8b] rounded-full flex items-center justify-center text-white font-bold mr-3">2</div>
                <h4 className="text-xl font-semibold text-[#f5f5f5]">Tell Us About Your Video</h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label htmlFor="title" className="flex items-center gap-2 font-medium text-[#f5f5f5] mb-2">
                    <Icon name="fas fa-heading" className="text-[#8a2be2]" />
                    Video Title *
                  </label>
                  <input 
                    type="text" 
                    id="title" 
                    value={videoTitle} 
                    onChange={(e) => setVideoTitle(e.target.value)} 
                    placeholder="Give your video an awesome title..." 
                    className="w-full bg-[#121212] border border-[#2a2a2a] px-4 py-3 rounded-[10px] text-[#f5f5f5] text-base focus:outline-none focus:border-[#8a2be2] focus:ring-2 focus:ring-[rgba(138,43,226,0.2)]" 
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label htmlFor="description" className="flex items-center gap-2 font-medium text-[#f5f5f5] mb-2">
                    <Icon name="fas fa-align-left" className="text-[#8a2be2]" />
                    Description
                  </label>
                  <textarea 
                    id="description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)} 
                    placeholder="Describe your video to help viewers understand what it's about..." 
                    rows={4} 
                    className="w-full bg-[#121212] border border-[#2a2a2a] px-4 py-3 rounded-[10px] text-[#f5f5f5] text-base resize-none focus:outline-none focus:border-[#8a2be2] focus:ring-2 focus:ring-[rgba(138,43,226,0.2)]"
                  />
                </div>

                <div>
                  <label htmlFor="category" className="flex items-center gap-2 font-medium text-[#f5f5f5] mb-2">
                    <Icon name="fas fa-tags" className="text-[#8a2be2]" />
                    Category
                  </label>
                  <select 
                    id="category" 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)} 
                    className="w-full bg-[#121212] border border-[#2a2a2a] px-4 py-3 rounded-[10px] text-[#f5f5f5] text-base focus:outline-none focus:border-[#8a2be2] focus:ring-2 focus:ring-[rgba(138,43,226,0.2)]"
                  >
                    <option value="">Choose a category...</option>
                    <option value="music">🎵 Music</option>
                    <option value="gaming">🎮 Gaming</option>
                    <option value="movies">🎬 Movies & Entertainment</option>
                    <option value="education">📚 Education</option>
                    <option value="lifestyle">✨ Lifestyle</option>
                    <option value="comedy">😂 Comedy</option>
                    <option value="sports">⚽ Sports</option>
                    <option value="tech">💻 Technology</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="price" className="flex items-center gap-2 font-medium text-[#f5f5f5] mb-2">
                    <Icon name="fas fa-dollar-sign" className="text-[#8a2be2]" />
                    Price (ETH)
                  </label>
                  <input 
                    type="number" 
                    id="price" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    placeholder="0.00" 
                    step="0.001" 
                    min="0" 
                    className="w-full bg-[#121212] border border-[#2a2a2a] px-4 py-3 rounded-[10px] text-[#f5f5f5] text-base focus:outline-none focus:border-[#8a2be2] focus:ring-2 focus:ring-[rgba(138,43,226,0.2)]" 
                  />
                  <p className="text-xs text-gray-400 mt-1">Leave empty for free content</p>
                </div>
              </div>
            </div>

            {/* Step 3: Customize Your Video */}
            <div className="bg-[#2a2a2a] rounded-[15px] p-6 border-l-4 border-[#4ade80]">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-[#4ade80] rounded-full flex items-center justify-center text-white font-bold mr-3">3</div>
                <h4 className="text-xl font-semibold text-[#f5f5f5]">Customize Your Video</h4>
                <span className="ml-2 text-xs bg-[#4ade80] text-white px-2 py-1 rounded-full">Optional</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="thumbnail" className="flex items-center gap-2 font-medium text-[#f5f5f5] mb-2">
                    <Icon name="fas fa-image" className="text-[#8a2be2]" />
                    Custom Thumbnail
                  </label>
                  <div className="relative">
                    <input 
                      type="file" 
                      id="thumbnail" 
                      accept="image/*" 
                      className="w-full bg-[#121212] border border-[#2a2a2a] px-4 py-2.5 rounded-[10px] text-[#f5f5f5] text-base file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#8a2be2] file:text-white hover:file:bg-[#6a0dad] focus:outline-none focus:border-[#8a2be2]" 
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG • Recommended: 1280x720</p>
                </div>

                <div>
                  <label htmlFor="shorts" className="flex items-center gap-2 font-medium text-[#f5f5f5] mb-2">
                    <Icon name="fas fa-mobile-alt" className="text-[#8a2be2]" />
                    Video Type
                  </label>
                  <select 
                    id="shorts" 
                    value={isShorts} 
                    onChange={(e) => setIsShorts(e.target.value)} 
                    className="w-full bg-[#121212] border border-[#2a2a2a] px-4 py-3 rounded-[10px] text-[#f5f5f5] text-base focus:outline-none focus:border-[#8a2be2] focus:ring-2 focus:ring-[rgba(138,43,226,0.2)]"
                  >
                    <option value="no">📹 Regular Video</option>
                    <option value="yes">⚡ Short Video (60s or less)</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="subtitles" className="flex items-center gap-2 font-medium text-[#f5f5f5] mb-2">
                    <Icon name="fas fa-closed-captioning" className="text-[#8a2be2]" />
                    Subtitles/Captions
                  </label>
                  <input 
                    type="file" 
                    id="subtitles" 
                    accept=".srt,.vtt" 
                    className="w-full bg-[#121212] border border-[#2a2a2a] px-4 py-2.5 rounded-[10px] text-[#f5f5f5] text-base file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#8a2be2] file:text-white hover:file:bg-[#6a0dad] focus:outline-none focus:border-[#8a2be2]" 
                  />
                  <p className="text-xs text-gray-400 mt-1">SRT or VTT files</p>
                </div>

                <div>
                  <label htmlFor="collaborators" className="flex items-center gap-2 font-medium text-[#f5f5f5] mb-2">
                    <Icon name="fas fa-users" className="text-[#8a2be2]" />
                    Collaborators
                  </label>
                  <input 
                    type="text" 
                    id="collaborators" 
                    value={collaborators} 
                    onChange={(e) => setCollaborators(e.target.value)} 
                    placeholder="@username1, @username2" 
                    className="w-full bg-[#121212] border border-[#2a2a2a] px-4 py-3 rounded-[10px] text-[#f5f5f5] text-base focus:outline-none focus:border-[#8a2be2] focus:ring-2 focus:ring-[rgba(138,43,226,0.2)]" 
                  />
                </div>
              </div>
            </div>

            {/* Step 4: Privacy & Monetization */}
            <div className="bg-[#2a2a2a] rounded-[15px] p-6 border-l-4 border-[#f59e0b]">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-[#f59e0b] rounded-full flex items-center justify-center text-white font-bold mr-3">4</div>
                <h4 className="text-xl font-semibold text-[#f5f5f5]">Privacy & Earnings</h4>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 font-medium text-[#f5f5f5] mb-3">
                    <Icon name="fas fa-eye" className="text-[#8a2be2]" />
                    Who can watch your video?
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="flex items-center gap-3 p-4 bg-[#121212] rounded-[10px] cursor-pointer hover:bg-[#1a1a1a] transition-colors">
                      <input 
                        type="radio" 
                        name="access" 
                        value="public" 
                        checked={accessControl === 'public'} 
                        onChange={(e) => setAccessControl(e.target.value)} 
                        className="form-radio text-[#8a2be2] bg-[#121212] border-[#2a2a2a] focus:ring-[#8a2be2]" 
                      />
                      <div>
                        <div className="flex items-center gap-2 text-[#f5f5f5] font-medium">
                          <Icon name="fas fa-globe" className="text-[#4ade80]" />
                          Public
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Anyone can watch</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-3 p-4 bg-[#121212] rounded-[10px] cursor-pointer hover:bg-[#1a1a1a] transition-colors">
                      <input 
                        type="radio" 
                        name="access" 
                        value="subscriber" 
                        checked={accessControl === 'subscriber'} 
                        onChange={(e) => setAccessControl(e.target.value)} 
                        className="form-radio text-[#8a2be2] bg-[#121212] border-[#2a2a2a] focus:ring-[#8a2be2]" 
                      />
                      <div>
                        <div className="flex items-center gap-2 text-[#f5f5f5] font-medium">
                          <Icon name="fas fa-heart" className="text-[#ff6b8b]" />
                          Subscribers
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Only your fans</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-3 p-4 bg-[#121212] rounded-[10px] cursor-pointer hover:bg-[#1a1a1a] transition-colors">
                      <input 
                        type="radio" 
                        name="access" 
                        value="nft" 
                        checked={accessControl === 'nft'} 
                        onChange={(e) => setAccessControl(e.target.value)} 
                        className="form-radio text-[#8a2be2] bg-[#121212] border-[#2a2a2a] focus:ring-[#8a2be2]" 
                      />
                      <div>
                        <div className="flex items-center gap-2 text-[#f5f5f5] font-medium">
                          <Icon name="fas fa-gem" className="text-[#8a2be2]" />
                          NFT Holders
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Exclusive access</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2 font-medium text-[#f5f5f5] mb-3">
                    <Icon name="fas fa-chart-pie" className="text-[#8a2be2]" />
                    Revenue Split
                  </label>
                  <div className="bg-[#121212] rounded-[10px] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Icon name="fas fa-user" className="text-[#4ade80]" />
                        <span className="text-[#f5f5f5] font-medium">You (Creator)</span>
                      </div>
                      <span className="text-[#4ade80] font-bold text-lg">90%</span>
                    </div>
                    <div className="w-full bg-[#2a2a2a] rounded-full h-2 mb-4">
                      <div className="bg-[#4ade80] h-2 rounded-full" style={{width: '90%'}}></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon name="fas fa-building" className="text-gray-400" />
                        <span className="text-gray-400">Platform</span>
                      </div>
                      <span className="text-gray-400">10%</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-3 text-center">
                      <Icon name="fas fa-info-circle" className="mr-1" />
                      You keep 90% of all earnings - one of the best rates in the industry!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 5: Arweave Wallet Setup */}
            <div className="bg-[#2a2a2a] rounded-[15px] p-6 border-l-4 border-[#8a2be2]">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-[#8a2be2] rounded-full flex items-center justify-center text-white font-bold mr-3">5</div>
                <h4 className="text-xl font-semibold text-[#f5f5f5]">Arweave Wallet Setup</h4>
                <span className="ml-2 text-xs bg-[#8a2be2] text-white px-2 py-1 rounded-full">REQUIRED</span>
              </div>
              
              <WalletKeyLoader
                onWalletLoaded={(wallet) => {
                  console.log('Wallet loaded:', wallet);
                  showNotification('Arweave wallet loaded successfully!', 'success');
                }}
                onError={(error) => {
                  console.error('Wallet error:', error);
                  showNotification(error.message || 'Failed to load wallet', 'error');
                }}
                isDisabled={isUploading}
              />
            </div>

            {/* Step 6: Arweave Permanent Storage */}
            <div className="bg-[#2a2a2a] rounded-[15px] p-6 border-l-4 border-[#10b981]">
              <div className="flex items-center mb-6">
                <div className="w-8 h-8 bg-[#10b981] rounded-full flex items-center justify-center text-white font-bold mr-3">6</div>
                <h4 className="text-xl font-semibold text-[#f5f5f5]">Permanent Decentralized Storage</h4>
                <span className="ml-2 text-xs bg-[#10b981] text-white px-2 py-1 rounded-full">WEB3</span>
              </div>
              
              {/* Premium Arweave Feature Card */}
              <ArweaveFeatureCard />
            </div>

            {/* Upload Button */}
            <div className="text-center pt-6">
              <button 
                type="submit" 
                onClick={handleFormSubmit}
                disabled={isUploading || !selectedVideoFile || !videoTitle}
                className={`py-4 px-8 rounded-[15px] text-lg font-bold transition-all duration-300 flex items-center gap-3 mx-auto ${
                  isUploading || !selectedVideoFile || !videoTitle
                    ? 'bg-gray-600 cursor-not-allowed opacity-50'
                    : 'bg-gradient-to-r from-[#8a2be2] to-[#6a0dad] text-white cursor-pointer hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(138,43,226,0.4)]'
                }`}
              >
                {isUploading ? (
                  <>
                    <Icon name="fas fa-spinner" className="text-xl animate-spin" />
                    Uploading to Arweave...
                  </>
                ) : (
                  <>
                    <Icon name="fas fa-rocket" className="text-xl" />
                    Publish Your Video
                  </>
                )}
              </button>
              <p className="text-gray-400 text-sm mt-3">
                {selectedVideoFile && videoTitle
                  ? "Ready to upload! Use the Arweave feature above for permanent storage."
                  : !selectedVideoFile 
                    ? "Please select a video file to continue"
                    : !videoTitle
                      ? "Please enter a video title to continue"
                      : "Complete all steps to publish your video"
                }
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (activeStudioTab === 'earnings') {
      const earningsData = {
        totalEarnings: 15.67,
        thisMonth: 4.23,
        pendingPayouts: 1.85,
        transactions: [
          { date: '2024-07-15', video: 'Midnight Fantasy Collection', amount: 3.2, status: 'Paid', txHash: '0x123...abc' },
          { date: '2024-07-12', video: 'Private Session #42', amount: 2.8, status: 'Paid', txHash: '0x456...def' },
          { date: '2024-07-10', video: 'NFT Collection Behind Scenes', amount: 4.1, status: 'Pending', txHash: '0x789...ghi' },
        ]
      };

      return (
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-[#f5f5f5] mb-2">
              <Icon name="fas fa-wallet" className="mr-3 text-[#8a2be2]" />
              Earnings Dashboard
            </h3>
            <p className="text-gray-400 text-lg">Track your revenue and manage payouts</p>
          </div>

          {/* Earnings Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-xl p-6 border border-green-500/30">
              <div className="flex items-center justify-between mb-4">
                <Icon name="fas fa-coins" className="text-3xl text-green-400" />
                <span className="text-green-400 text-sm">+8.3% this month</span>
              </div>
              <h4 className="text-3xl font-bold text-white mb-2">{earningsData.totalEarnings} ETH</h4>
              <p className="text-gray-400">Total Earnings</p>
              <p className="text-green-400 text-sm mt-1">≈ ${(earningsData.totalEarnings * 2340).toLocaleString()} USD</p>
            </div>

            <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-xl p-6 border border-blue-500/30">
              <div className="flex items-center justify-between mb-4">
                <Icon name="fas fa-calendar-alt" className="text-3xl text-blue-400" />
                <span className="text-green-400 text-sm">+15.2%</span>
              </div>
              <h4 className="text-3xl font-bold text-white mb-2">{earningsData.thisMonth} ETH</h4>
              <p className="text-gray-400">This Month</p>
              <p className="text-blue-400 text-sm mt-1">≈ ${(earningsData.thisMonth * 2340).toLocaleString()} USD</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 rounded-xl p-6 border border-yellow-500/30">
              <div className="flex items-center justify-between mb-4">
                <Icon name="fas fa-clock" className="text-3xl text-yellow-400" />
                <span className="text-yellow-400 text-sm">Processing</span>
              </div>
              <h4 className="text-3xl font-bold text-white mb-2">{earningsData.pendingPayouts} ETH</h4>
              <p className="text-gray-400">Pending Payouts</p>
              <p className="text-yellow-400 text-sm mt-1">≈ ${(earningsData.pendingPayouts * 2340).toLocaleString()} USD</p>
            </div>
          </div>

          {/* Payout Options */}
          <div className="bg-[#2a2a2a] rounded-xl p-6 border border-gray-700 mb-8">
            <h4 className="text-xl font-bold text-white mb-4 flex items-center">
              <Icon name="fas fa-university" className="mr-2 text-purple-400" />
              Payout Settings
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Payout Method</label>
                <select className="w-full bg-[#121212] border border-[#2a2a2a] px-4 py-3 rounded-lg text-white">
                  <option>Direct to Wallet (ETH)</option>
                  <option>Convert to USDC</option>
                  <option>Bank Transfer (Coming Soon)</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-400 text-sm mb-2">Minimum Payout</label>
                <select className="w-full bg-[#121212] border border-[#2a2a2a] px-4 py-3 rounded-lg text-white">
                  <option>0.1 ETH</option>
                  <option>0.5 ETH</option>
                  <option>1.0 ETH</option>
                </select>
              </div>
            </div>
            <button className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">
              <Icon name="fas fa-download" className="mr-2" />
              Request Payout
            </button>
          </div>

          {/* Transaction History */}
          <div className="bg-[#2a2a2a] rounded-xl p-6 border border-gray-700">
            <h4 className="text-xl font-bold text-white mb-6 flex items-center">
              <Icon name="fas fa-history" className="mr-2 text-purple-400" />
              Transaction History
            </h4>
            <div className="space-y-4">
              {earningsData.transactions.map((tx, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${tx.status === 'Paid' ? 'bg-green-400' : 'bg-yellow-400'}`}></div>
                    <div>
                      <h5 className="text-white font-medium">{tx.video}</h5>
                      <p className="text-gray-400 text-sm">{new Date(tx.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">+{tx.amount} ETH</p>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        tx.status === 'Paid' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {tx.status}
                      </span>
                      <a 
                        href={`https://sepolia.etherscan.io/tx/${tx.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 text-xs"
                      >
                        <Icon name="fas fa-external-link-alt" />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (activeStudioTab === 'nftCollections') {
      const nftCollections = [
        {
          id: 1,
          name: "Midnight Fantasy Collection",
          description: "Exclusive behind-the-scenes content and rare moments",
          totalItems: 25,
          floorPrice: 0.15,
          totalVolume: 12.5,
          image: "https://picsum.photos/seed/nft1/300/300",
          status: "Active"
        },
        {
          id: 2,
          name: "Private Sessions Genesis",
          description: "First edition of private session NFTs",
          totalItems: 10,
          floorPrice: 0.25,
          totalVolume: 8.3,
          image: "https://picsum.photos/seed/nft2/300/300",
          status: "Active"
        }
      ];

      return (
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-[#f5f5f5] mb-2">
              <Icon name="fas fa-gem" className="mr-3 text-[#8a2be2]" />
              NFT Collections
            </h3>
            <p className="text-gray-400 text-lg">Create and manage your exclusive NFT collections</p>
          </div>

          {/* Create New Collection Button */}
          <div className="mb-8 text-center">
            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105">
              <Icon name="fas fa-plus" className="mr-2" />
              Create New Collection
            </button>
          </div>

          {/* Collections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {nftCollections.map((collection) => (
              <div key={collection.id} className="bg-[#2a2a2a] rounded-xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
                <div className="flex flex-col space-y-4">
                  <div className="relative">
                    <img 
                      src={collection.image} 
                      alt={collection.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
                        {collection.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xl font-bold text-white mb-2">{collection.name}</h4>
                    <p className="text-gray-400 text-sm mb-4">{collection.description}</p>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-white">{collection.totalItems}</p>
                        <p className="text-gray-400 text-xs">Items</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-400">{collection.floorPrice} ETH</p>
                        <p className="text-gray-400 text-xs">Floor Price</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-400">{collection.totalVolume} ETH</p>
                        <p className="text-gray-400 text-xs">Volume</p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors">
                        <Icon name="fas fa-eye" className="mr-2" />
                        View Collection
                      </button>
                      <button className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
                        <Icon name="fas fa-plus" className="mr-2" />
                        Add Items
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeStudioTab === 'subscribers') {
      const subscriberData = {
        totalSubscribers: 2847,
        newThisMonth: 342,
        topTierSubscribers: 156,
        subscribers: [
          { name: 'CryptoFan2024', avatar: 'CF', tier: 'Diamond', joinDate: '2024-06-15', totalSpent: 2.5 },
          { name: 'NFTCollector', avatar: 'NC', tier: 'Platinum', joinDate: '2024-06-20', totalSpent: 1.8 },
          { name: 'WebThreeEnthusiast', avatar: 'WE', tier: 'Gold', joinDate: '2024-07-01', totalSpent: 1.2 },
          { name: 'BlockchainBabe', avatar: 'BB', tier: 'Silver', joinDate: '2024-07-05', totalSpent: 0.8 },
        ]
      };

      return (
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-[#f5f5f5] mb-2">
              <Icon name="fas fa-users" className="mr-3 text-[#8a2be2]" />
              Subscriber Management
            </h3>
            <p className="text-gray-400 text-lg">Connect with your community and manage subscriber tiers</p>
          </div>

          {/* Subscriber Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-xl p-6 border border-purple-500/30">
              <div className="flex items-center justify-between mb-4">
                <Icon name="fas fa-users" className="text-3xl text-purple-400" />
                <span className="text-green-400 text-sm">+15.7%</span>
              </div>
              <h4 className="text-3xl font-bold text-white mb-2">{subscriberData.totalSubscribers.toLocaleString()}</h4>
              <p className="text-gray-400">Total Subscribers</p>
            </div>

            <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-xl p-6 border border-green-500/30">
              <div className="flex items-center justify-between mb-4">
                <Icon name="fas fa-user-plus" className="text-3xl text-green-400" />
                <span className="text-green-400 text-sm">+23.1%</span>
              </div>
              <h4 className="text-3xl font-bold text-white mb-2">{subscriberData.newThisMonth}</h4>
              <p className="text-gray-400">New This Month</p>
            </div>

            <div className="bg-gradient-to-br from-yellow-600/20 to-yellow-800/20 rounded-xl p-6 border border-yellow-500/30">
              <div className="flex items-center justify-between mb-4">
                <Icon name="fas fa-crown" className="text-3xl text-yellow-400" />
                <span className="text-yellow-400 text-sm">Premium</span>
              </div>
              <h4 className="text-3xl font-bold text-white mb-2">{subscriberData.topTierSubscribers}</h4>
              <p className="text-gray-400">Premium Subscribers</p>
            </div>
          </div>

          {/* Top Subscribers */}
          <div className="bg-[#2a2a2a] rounded-xl p-6 border border-gray-700">
            <h4 className="text-xl font-bold text-white mb-6 flex items-center">
              <Icon name="fas fa-star" className="mr-2 text-yellow-400" />
              Top Supporters
            </h4>
            <div className="space-y-4">
              {subscriberData.subscribers.map((subscriber, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                      {subscriber.avatar}
                    </div>
                    <div>
                      <h5 className="text-white font-medium">{subscriber.name}</h5>
                      <p className="text-gray-400 text-sm">Joined {new Date(subscriber.joinDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        subscriber.tier === 'Diamond' ? 'bg-cyan-500/20 text-cyan-400' :
                        subscriber.tier === 'Platinum' ? 'bg-gray-500/20 text-gray-400' :
                        subscriber.tier === 'Gold' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-600/20 text-gray-500'
                      }`}>
                        {subscriber.tier}
                      </span>
                    </div>
                    <p className="text-green-400 text-sm">{subscriber.totalSpent} ETH spent</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
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

