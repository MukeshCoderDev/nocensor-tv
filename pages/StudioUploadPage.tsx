
import React, { useState, useCallback } from 'react';
import Icon from '../components/Icon';
import { STUDIO_NAV_ITEMS, THEME_COLORS } from '../constants';
import { StudioNavItem } from '../types';
import { uploadToArweave } from '../arweave-uploader.js';
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
      const transactionId = await uploadToArweave(uint8Array, arweaveKey);
      
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
      showNotification('Upload failed. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  };


  const renderStudioContent = () => {
    // For now, only upload content is fully fleshed out
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

            {/* Step 5: Load Arweave Wallet */}
            <div className="bg-[#2a2a2a] rounded-[15px] p-6 border-l-4 border-[#10b981]">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-[#10b981] rounded-full flex items-center justify-center text-white font-bold mr-3">5</div>
                <h4 className="text-xl font-semibold text-[#f5f5f5]">Load Your Arweave Wallet</h4>
                <span className="ml-2 text-xs bg-[#10b981] text-white px-2 py-1 rounded-full">WEB3</span>
              </div>
              
              <div className="bg-[#121212] rounded-[10px] p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="fas fa-shield-alt" className="text-[#10b981] text-xl" />
                  <div>
                    <h5 className="text-[#f5f5f5] font-medium">Permanent Blockchain Storage</h5>
                    <p className="text-gray-400 text-sm">Your video will be stored forever on Arweave - no one can delete it!</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <Icon name="fas fa-wallet" className="text-[#8a2be2] text-xl" />
                  <div>
                    <h5 className="text-[#f5f5f5] font-medium">Authorize Your Upload</h5>
                    <p className="text-gray-400 text-sm">Load your wallet key to authorize the decentralized upload</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Icon name="fas fa-rocket" className="text-[#ff6b8b] text-xl" />
                  <div>
                    <h5 className="text-[#f5f5f5] font-medium">True Web3 Freedom</h5>
                    <p className="text-gray-400 text-sm">No centralized servers, no censorship, complete creator control!</p>
                  </div>
                </div>
              </div>

              {/* Integrated Wallet Key Loader */}
              <WalletKeyLoader
                onWalletLoaded={handleWalletLoaded}
                onError={handleWalletError}
                walletInfo={walletInfo}
                isLoading={isValidatingWallet}
                isDisabled={isUploading}
              />

              {walletError && (
                <div className="mt-4">
                  <ErrorDisplay
                    error={walletError}
                    onRetry={() => {
                      setWalletError(null);
                      // Retry will be handled by WalletKeyLoader component
                    }}
                    onDismiss={() => setWalletError(null)}
                  />
                </div>
              )}
            </div>

            {/* Upload Button */}
            <div className="text-center pt-6">
              <button 
                type="submit" 
                onClick={handleFormSubmit}
                disabled={isUploading || !selectedVideoFile || !videoTitle || !arweaveKey}
                className={`py-4 px-8 rounded-[15px] text-lg font-bold transition-all duration-300 flex items-center gap-3 mx-auto ${
                  isUploading || !selectedVideoFile || !videoTitle || !arweaveKey
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
                {selectedVideoFile && videoTitle && arweaveKey
                  ? "Your video will be stored permanently on the blockchain"
                  : !selectedVideoFile 
                    ? "Please select a video file to continue"
                    : !videoTitle
                      ? "Please enter a video title to continue"
                      : !arweaveKey
                        ? "Please load your Arweave wallet key to continue"
                        : "Complete all steps to publish your video"
                }
              </p>
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

