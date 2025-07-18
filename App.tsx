
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Web3Provider } from './src/context/Web3Context';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ShortsPage from './pages/ShortsPage';
import SubscriptionsPage from './pages/SubscriptionsPage';
import NftAccessPage from './pages/NftAccessPage';
import HistoryPage from './pages/HistoryPage';
import WatchLaterPage from './pages/WatchLaterPage';
import LivePage from './pages/LivePage';
import TrendingPage from './pages/TrendingPage';
import StudioUploadPage from './pages/StudioUploadPage';
import StudioAnalyticsPage from './pages/studio/StudioAnalyticsPage';
import StudioEarningsPage from './pages/studio/StudioEarningsPage';
import StudioNftCollectionsPage from './pages/studio/StudioNftCollectionsPage';
import StudioSubscribersPage from './pages/studio/StudioSubscribersPage';
import SettingsPage from './pages/settings/SettingsPage';
import PrivacyPage from './pages/settings/PrivacyPage';
import HelpPage from './pages/HelpPage';
import PlaceholderPage from './pages/PlaceholderPage';
import VideoPlayerModal from './components/VideoPlayerModal';
import Notification from './components/Notification';
import { useWeb3Modal } from '@web3modal/ethers/react';
import './index.css';
import { User, Video, PageId } from './types';
import { SIDEBAR_MENU, RECOMMENDED_VIDEOS } from './constants';

const App: React.FC = () => {
  const [isSidebarLGExpanded, setIsSidebarLGExpanded] = useState<boolean>(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  
  const [walletConnected, setWalletConnected] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = useState<boolean>(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false,
  });

  const location = useLocation();
  const { open } = useWeb3Modal();

  const handleShowNotification = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setNotification({ message, type, isVisible: true });
  }, []);

  const handleCloseNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, isVisible: false }));
  }, []);

  const handleConnectWallet = useCallback(async () => {
    try {
      await open(); // Open the WalletConnect modal
      // WalletConnect will handle the connection logic and update Web3Context
    } catch (error) {
      console.error('Failed to open wallet modal:', error);
      handleShowNotification('Failed to open wallet connection. Please try again.', 'error');
    }
  }, [open, handleShowNotification]);

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
    <Web3Provider>
      <Router>
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
      </Router>
    </Web3Provider>
  );
};

export default App;
