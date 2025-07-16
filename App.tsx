
import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import TrendingPage from './pages/TrendingPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import NftAccessPage from './pages/NftAccessPage';
import StudioUploadPage from './pages/StudioUploadPage';
import HistoryPage from './pages/HistoryPage';
import WatchLaterPage from './pages/WatchLaterPage';
import ShortsPage from './pages/ShortsPage';
import LivePage from './pages/LivePage';
import CategoryPage from './pages/CategoryPage';
import StudioAnalyticsPage from './pages/studio/StudioAnalyticsPage';
import StudioEarningsPage from './pages/studio/StudioEarningsPage';
import StudioNftCollectionsPage from './pages/studio/StudioNftCollectionsPage';
import StudioSubscribersPage from './pages/studio/StudioSubscribersPage';
import SettingsPage from './pages/settings/SettingsPage';
import PrivacyPage from './pages/settings/PrivacyPage';
import HelpPage from './pages/HelpPage';
import PlaceholderPage from './pages/PlaceholderPage'; // For other routes
// Removed MetamaskPopup - using real MetaMask popup instead
import VideoPlayerModal from './components/VideoPlayerModal';
import Notification from './components/Notification';
import { User, Video, PageId } from './types';
import { SIDEBAR_MENU, RECOMMENDED_VIDEOS } from './constants'; 

const App: React.FC = () => {
  const [isSidebarLGExpanded, setIsSidebarLGExpanded] = useState<boolean>(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Removed isMetamaskPopupOpen state - using real MetaMask popup instead
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  const location = useLocation();

  const handleShowNotification = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type, isVisible: true });
  }, []);

  const handleCloseNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  }, []);

  const handleConnectWallet = async () => {
    if (!walletConnected) {
      try {
        console.log('🔗 Attempting wallet connection...');
        
        // Check if MetaMask is installed
        if (typeof window.ethereum === 'undefined') {
          console.error('❌ MetaMask not detected');
          handleShowNotification('MetaMask is not installed! Please install MetaMask to continue.', 'error');
          window.open('https://metamask.io/download/', '_blank');
          return;
        }

        console.log('✅ MetaMask detected, requesting accounts...');
        
        // Request account access - This will show MetaMask popup
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        });

        console.log('📝 Accounts received:', accounts.length);

        if (accounts.length > 0) {
          console.log('🌐 Checking network...');
          
          // Get current chain ID
          const currentChainId = await window.ethereum.request({
            method: 'eth_chainId',
          });
          
          console.log('Current chain ID:', currentChainId);
          console.log('Target chain ID (Sepolia):', '0xaa36a7');

          // Check if we're on the right network (Sepolia)
          if (currentChainId !== '0xaa36a7') {
            console.log('🔄 Switching to Sepolia network...');
            try {
              await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0xaa36a7' }], // Sepolia chainId in hex
              });
              console.log('✅ Successfully switched to Sepolia');
            } catch (switchError: any) {
              console.log('Switch error code:', switchError.code);
              // This error code indicates that the chain has not been added to MetaMask
              if (switchError.code === 4902) {
                console.log('➕ Adding Sepolia network to MetaMask...');
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [{
                    chainId: '0xaa36a7',
                    chainName: 'Sepolia Test Network',
                    nativeCurrency: {
                      name: 'ETH',
                      symbol: 'ETH',
                      decimals: 18,
                    },
                    rpcUrls: ['https://sepolia.infura.io/v3/', 'https://rpc.sepolia.org'],
                    blockExplorerUrls: ['https://sepolia.etherscan.io'],
                  }],
                });
                console.log('✅ Sepolia network added successfully');
              } else {
                throw switchError;
              }
            }
          }
          
          console.log('🎉 Processing wallet connection...');
          processWalletConnection(accounts[0]);
        } else {
          throw new Error('No accounts returned from MetaMask');
        }
      } catch (error: any) {
        console.error('❌ Wallet connection failed:', error);
        
        let errorMessage = 'Failed to connect wallet. ';
        
        if (error.code === 4001) {
          errorMessage += 'Connection rejected by user.';
        } else if (error.code === -32002) {
          errorMessage += 'Connection request already pending. Please check MetaMask.';
        } else if (error.message?.includes('User rejected')) {
          errorMessage += 'Connection rejected by user.';
        } else {
          errorMessage += 'Please make sure MetaMask is unlocked and try again.';
        }
        
        handleShowNotification(errorMessage, 'error');
      }
    }
  };

  const processWalletConnection = (account: string) => {
    setWalletConnected(true);
    const formatAddress = (addr: string) => `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
    setCurrentUser({ 
      name: formatAddress(account), 
      avatarChar: account.substring(2, 4).toUpperCase() 
    });
    handleShowNotification('Wallet connected successfully!', 'success');
  };

  const handlePlayVideo = (video: Video) => {
    setSelectedVideo(video);
    setIsVideoPlayerOpen(true);
  };
  
  const handleToggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 992) { 
        setIsSidebarLGExpanded(false); 
      } else if (screenWidth < 1200) { 
        setIsSidebarLGExpanded(false); 
      } else {
        setIsSidebarLGExpanded(true); 
      }
      if(screenWidth >= 992) { 
        setIsMobileSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); 
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    setIsMobileSidebarOpen(false);
    window.scrollTo(0, 0); // Scroll to top on page change
  }, [location.pathname]);

  const mainContentMargin = isMobileSidebarOpen || window.innerWidth < 992 
    ? 'ml-0' 
    : (isSidebarLGExpanded ? 'ml-[240px]' : 'ml-[80px]');

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
      <Header
        onToggleMobileSidebar={handleToggleMobileSidebar}
        onConnectWallet={handleConnectWallet}
        walletConnected={walletConnected}
        currentUser={currentUser}
      />
      <div className="flex flex-1 pt-[60px]">
        <Sidebar 
            menu={SIDEBAR_MENU} 
            isExpanded={isSidebarLGExpanded} 
            isMobileOpen={isMobileSidebarOpen}
            onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)}
        />
        <main className={`flex-1 p-4 sm:p-6 transition-all duration-300 ease-in-out ${mainContentMargin} overflow-y-auto`}>
          <Routes>
            <Route path="/" element={<HomePage onPlayVideo={handlePlayVideo}/>} />
            <Route path="/trending" element={<TrendingPage onPlayVideo={handlePlayVideo}/>} />
            <Route path="/subscriptions" element={<SubscriptionsPage onPlayVideo={handlePlayVideo}/>} />
            <Route path="/nft-access" element={<NftAccessPage onPlayVideo={handlePlayVideo}/>} />
            <Route path="/history" element={<HistoryPage onPlayVideo={handlePlayVideo} />} />
            <Route path="/watch-later" element={<WatchLaterPage onPlayVideo={handlePlayVideo} />} />
            <Route path="/shorts" element={<ShortsPage />} />
            <Route path="/live" element={<LivePage />} />
            <Route path="/category/:categoryName" element={<CategoryPage onPlayVideo={handlePlayVideo} />} />
            
            <Route path="/studio/upload" element={<StudioUploadPage showNotification={handleShowNotification} />} />
            <Route path="/studio/analytics" element={<StudioAnalyticsPage />} />
            <Route path="/studio/earnings" element={<StudioEarningsPage />} />
            <Route path="/studio/nft-collections" element={<StudioNftCollectionsPage />} />
            <Route path="/studio/subscribers" element={<StudioSubscribersPage />} />
            
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/privacy" element={<PrivacyPage />} />
            <Route path="/help" element={<HelpPage />} />
            
            {/* Fallback/other placeholders */}
            <Route path="/recommended" element={<PlaceholderPage />} />
            <Route path="/creators" element={<PlaceholderPage />} />
            <Route path="*" element={<PlaceholderPage />} /> 
          </Routes>
        </main>
      </div>

      {/* MetamaskPopup removed - using real MetaMask popup instead */}
      <VideoPlayerModal
        isOpen={isVideoPlayerOpen}
        onClose={() => setIsVideoPlayerOpen(false)}
        video={selectedVideo}
      />
      <Notification
        message={notification.message}
        isVisible={notification.isVisible}
        type={notification.type}
        onClose={handleCloseNotification}
      />
    </div>
  );
};

export default App;
