
import { MenuSection, Video, Feature, Creator, StudioNavItem, Comment, HistoryItem, WatchLaterItem, Short, LiveStream, NftCollectionItem } from './types';

export const THEME_COLORS = {
  primary: '#8a2be2', // Deep Purple
  primaryDark: '#6a0dad', // Darker Purple
  secondary: '#ff6b8b', // Vibrant Pink
  dark: '#121212', // Very Dark Gray (almost black)
  darker: '#0a0a0a', // True Black
  light: '#f5f5f5', // Light Gray (for text)
  gray: '#2a2a2a', // Medium Gray (borders, dividers)
  cardBg: '#1e1e1e', // Dark Gray (card backgrounds)
  success: '#00c853', // Green
  warning: '#ffab00', // Amber
  // New premium/financial theme colors
  gold: '#ffd700',
  platinum: '#e5e4e2',
  cyan: '#00bcd4',
  teal: '#009688',
  indigo: '#3f51b5',
  pink: '#e91e63',
  // Holographic colors from prompt
  holoPurple: 'rgba(138, 43, 226, 0.3)', // holo-purple
  holoPink: 'rgba(255, 107, 139, 0.2)',  // holo-pink
  holoBlue: 'rgba(0, 123, 255, 0.2)', // holo-blue added
};

export const SIDEBAR_MENU: MenuSection[] = [
  {
    items: [
      { id: 'homePage', label: 'Home', icon: 'fas fa-home', path: '/' },
      { id: 'trendingPage', label: 'Trending', icon: 'fas fa-fire', path: '/trending' },
      { id: 'subscriptionsPage', label: 'Subscriptions', icon: 'fas fa-users', path: '/subscriptions' },
      { id: 'nftAccessPage', label: 'NFT Access', icon: 'fas fa-gem', path: '/nft-access' },
      { id: 'historyPage', label: 'History', icon: 'fas fa-history', path: '/history' },
      { id: 'watchLaterPage', label: 'Watch Later', icon: 'fas fa-clock', path: '/watch-later' },
      { id: 'shortsPage', label: 'Shorts', icon: 'fas fa-mobile-alt', path: '/shorts' },
    ],
  },
  {
    title: 'Categories',
    items: [
      { id: 'musicPage', label: 'Music', icon: 'fas fa-music', path: '/category/music' },
      { id: 'gamingPage', label: 'Gaming', icon: 'fas fa-gamepad', path: '/category/gaming' },
      { id: 'moviesPage', label: 'Movies', icon: 'fas fa-film', path: '/category/movies' },
      { id: 'livePage', label: 'Live', icon: 'fas fa-star', path: '/live' },
    ],
  },
  {
    title: 'Creator Studio',
    items: [
      { id: 'studioPage', label: 'Upload Video', icon: 'fas fa-video', path: '/studio/upload' },
      { id: 'analyticsPage', label: 'Analytics', icon: 'fas fa-chart-line', path: '/studio/analytics' },
      { id: 'earningsPage', label: 'Earnings', icon: 'fas fa-wallet', path: '/studio/earnings' },
      { id: 'nftCollectionsPage', label: 'NFT Collections', icon: 'fas fa-gem', path: '/studio/nft-collections' },
      { id: 'subscribersPage', label: 'Subscribers', icon: 'fas fa-users', path: '/studio/subscribers' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { id: 'settingsPage', label: 'Settings', icon: 'fas fa-cog', path: '/settings' },
      { id: 'privacyPage', label: 'Privacy', icon: 'fas fa-shield-alt', path: '/settings/privacy' },
      { id: 'helpPage', label: 'Help', icon: 'fas fa-question-circle', path: '/help' },
    ],
  },
];

export const PLATFORM_FEATURES: Feature[] = [
  { 
    icon: 'fas fa-shield-alt', 
    title: 'Permanent Arweave Storage', 
    description: 'Your content lives forever on the blockchain - truly censorship-resistant and creator-owned', 
    badge: '🔥 Web3 Power',
    gradient: 'from-purple-600 via-purple-700 to-pink-600',
    stats: '∞ Forever',
    highlight: 'REVOLUTIONARY'
  },
  { 
    icon: 'fas fa-coins', 
    title: 'Direct Creator Payments', 
    description: 'Instant ETH payments with zero middlemen - creators keep 95% of earnings', 
    badge: '💰 DeFi Native',
    gradient: 'from-green-500 via-emerald-600 to-teal-600',
    stats: '95% Revenue',
    highlight: 'GAME CHANGER'
  },
  { 
    icon: 'fas fa-gem', 
    title: 'NFT-Gated Content', 
    description: 'Exclusive access through NFT ownership - the future of premium memberships', 
    badge: '💎 NFT Exclusive',
    gradient: 'from-pink-500 via-rose-600 to-red-600',
    stats: 'Web3 Access',
    highlight: 'EXCLUSIVE'
  },
  { 
    icon: 'fas fa-rocket', 
    title: 'Decentralized Streaming', 
    description: 'No servers, no downtime, no censorship - powered by blockchain technology', 
    badge: '🚀 Unstoppable',
    gradient: 'from-blue-500 via-indigo-600 to-purple-600',
    stats: '100% Uptime',
    highlight: 'UNSTOPPABLE'
  },
  { 
    icon: 'fas fa-chart-trending-up', 
    title: 'Real-Time Analytics', 
    description: 'Advanced creator insights with blockchain-verified view counts and earnings', 
    badge: '📊 Transparent',
    gradient: 'from-orange-500 via-amber-600 to-yellow-600',
    stats: 'Live Data',
    highlight: 'TRANSPARENT'
  },
  { 
    icon: 'fas fa-users-crown', 
    title: 'Community Governance', 
    description: 'Token holders vote on platform decisions - true decentralized governance', 
    badge: '🏛️ DAO Powered',
    gradient: 'from-cyan-500 via-blue-600 to-indigo-600',
    stats: 'Your Voice',
    highlight: 'DEMOCRATIC'
  },
];

export const RECOMMENDED_VIDEOS: Video[] = [
  { id: '1', title: 'Midnight Fantasy Collection - Exclusive Behind the Scenes', creator: 'Crystal Rose', creatorAvatar: 'CR', creatorSubs: '245K subscribers', views: '24.5K views', price: '0.25 ETH', duration: '24:18', thumbnailUrl: 'https://picsum.photos/seed/rec1/400/225', badge: 'NFT Access', badgeIcon: 'fas fa-gem', badgeColor: 'bg-gradient-to-r from-[#8a2be2] to-[#6a0dad]', description: 'Go behind the scenes of the latest Midnight Fantasy shoot. Exclusive for NFT holders.' },
  { id: '2', title: 'Private Session #42 - Full Unedited Experience', creator: 'Midnight Jay', creatorAvatar: 'MJ', creatorSubs: '182K subscribers', views: '18.2K views', price: '0.15 ETH', duration: '18:42', thumbnailUrl: 'https://picsum.photos/seed/rec2/400/225', description: 'The complete, unedited footage from Private Session #42. Pure, raw, and intense.' },
  { id: '3', title: 'Behind the Scenes: Vol 3 - Creating My Latest NFT Collection', creator: 'Scarlet Goddess', creatorAvatar: 'SG', creatorSubs: '327K subscribers', views: '32.7K views', price: '0.08 ETH', duration: '32:15', thumbnailUrl: 'https://picsum.photos/seed/rec3/400/225', badge: 'NFT Access', badgeIcon: 'fas fa-gem', badgeColor: 'bg-gradient-to-r from-[#8a2be2] to-[#6a0dad]', description: 'Join Scarlet Goddess in her creative process for her new groundbreaking NFT collection.' },
  { id: '4', title: 'Tropical Getaway - Beach Shoot Special', creator: 'Tropical Storm', creatorAvatar: 'TS', creatorSubs: '89K subscribers', views: '8.9K views', price: '0.12 ETH', duration: '15:33', thumbnailUrl: 'https://picsum.photos/seed/rec4/400/225', description: 'Escape to a tropical paradise with Tropical Storm in this stunning beach shoot.' },
];

export const TOP_CREATORS: Creator[] = [
    { id: 'c1', name: 'Crystal Rose', username: '@crystalrose', avatarChar: 'CR', subscribers: '245K subscribers', views: '1.2M views', nftCollections: 4, thumbnailUrl: 'https://picsum.photos/seed/creator1/400/225', verified: true },
    { id: 'c2', name: 'Midnight Jay', username: '@midnightjay', avatarChar: 'MJ', subscribers: '182K subscribers', views: '845K views', nftCollections: 2, thumbnailUrl: 'https://picsum.photos/seed/creator2/400/225', verified: true },
    { id: 'c3', name: 'Scarlet Goddess', username: '@scarletgoddess', avatarChar: 'SG', subscribers: '327K subscribers', views: '2.1M views', nftCollections: 7, thumbnailUrl: 'https://picsum.photos/seed/creator3/400/225', verified: true },
    { id: 'c4', name: 'Tropical Storm', username: '@tropicalstorm', avatarChar: 'TS', subscribers: '89K subscribers', views: '324K views', nftCollections: 1, thumbnailUrl: 'https://picsum.photos/seed/creator4/400/225' },
];

export const TRENDING_VIDEOS: Video[] = [
    { 
      id: '5', title: 'Summer Vibes - Exclusive Pool Party', creator: 'Summer Vibes', creatorAvatar: 'SV', creatorSubs: '120K subscribers', 
      views: '95.3K views', price: '0.18 ETH', duration: '12:45', thumbnailUrl: 'https://picsum.photos/seed/trend1/400/225', 
      badge: 'Top #1 Trend', badgeIcon: 'fas fa-rocket', badgeColor: 'bg-gradient-to-br from-pink-500 via-purple-600 to-indigo-700',
      isTopTrend: true, trendingScore: 99.8, tokenVelocity: 'high', nftValueImpact: 25, lastActivity: 'TX: 0x123...abc 1m ago'
    },
    { 
      id: '6', title: 'Cosmic Fantasy - Space Adventure', creator: 'Cosmic Fantasy', creatorAvatar: 'CF', creatorSubs: '215K subscribers', 
      views: '142K views', price: '0.22 ETH', duration: '28:30', thumbnailUrl: 'https://picsum.photos/seed/trend2/400/225', 
      badge: 'Top #2 Trend', badgeIcon: 'fas fa-bolt', badgeColor: 'bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600',
      isTopTrend: true, trendingScore: 97.2, tokenVelocity: 'high', nftValueImpact: 18, lastActivity: 'TX: 0x456...def 5m ago'
    },
    { 
      id: '7', title: 'Midnight Rendezvous - Urban Adventure', creator: 'Midnight Rendezvous', creatorAvatar: 'MR', creatorSubs: '185K subscribers', 
      views: '78.4K views', price: '0.15 ETH', duration: '15:22', thumbnailUrl: 'https://picsum.photos/seed/trend3/400/225', 
      badge: 'Top #3 Trend', badgeIcon: 'fas fa-meteor', badgeColor: 'bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-500',
      isTopTrend: true, trendingScore: 95.5, tokenVelocity: 'medium', nftValueImpact: 12, lastActivity: 'TX: 0x789...ghi 12m ago'
    },
    { 
      id: '8', title: 'Desert Dreams - Oasis Fantasy', creator: 'Desert Dreams', creatorAvatar: 'DD', creatorSubs: '95K subscribers', 
      views: '64.2K views', price: '0.20 ETH', duration: '21:17', thumbnailUrl: 'https://picsum.photos/seed/trend4/400/225', 
      badge: 'Trending Now', badgeIcon: 'fas fa-fire-alt', badgeColor: 'bg-gradient-to-r from-orange-500 to-red-500',
      trendingScore: 89.1, tokenVelocity: 'medium', nftValueImpact: 8
    },
     { 
      id: 'trend5', title: 'Neon Nights: Cyberpunk City Tour', creator: 'Synth Rider', creatorAvatar: 'SR', creatorSubs: '300K subscribers', 
      views: '250K views', price: '0.3 ETH', duration: '35:10', thumbnailUrl: 'https://picsum.photos/seed/trend5/400/225', 
      badge: 'Hot Pick', badgeIcon: 'fas fa-burn', badgeColor: 'bg-gradient-to-r from-red-600 to-yellow-500',
      trendingScore: 92.5, tokenVelocity: 'high', nftValueImpact: 20
    },
];

export const SUBSCRIPTIONS_VIDEOS: Video[] = [
    { 
      id: '9', title: 'Private Show - Diamond Tier Exclusive', creator: 'Crystal Rose', creatorAvatar: 'CR', creatorSubs: '245K subscribers', 
      views: 'Diamond Only', duration: '18:30', thumbnailUrl: 'https://picsum.photos/seed/sub1/400/225', 
      badge: 'Diamond Access', badgeIcon: 'fas fa-gem', exclusive: true, badgeColor: 'bg-gradient-to-r from-teal-400 to-cyan-600',
      creatorDAOTokens: "10,500 CRR", stakedValue: "5.5 ETH", collateralized: true, creatorTier: 'Diamond', lastActivity: 'Mint: #123 2h ago'
    },
    { 
      id: '10', title: 'Behind the Curtain - Platinum Creation Process', creator: 'Scarlet Goddess', creatorAvatar: 'SG', creatorSubs: '327K subscribers', 
      views: 'Platinum Only', duration: '25:45', thumbnailUrl: 'https://picsum.photos/seed/sub2/400/225', 
      badge: 'Platinum Access', badgeIcon: 'fas fa-star', exclusive: true, badgeColor: 'bg-gradient-to-r from-gray-400 to-blue-gray-500',
      creatorDAOTokens: "8,200 SGT", stakedValue: "3.1 ETH", collateralized: false, creatorTier: 'Platinum', lastActivity: 'Vote: #45 1d ago'
    },
    { 
      id: '11', title: 'Tropical Nights - Gold Member Special', creator: 'Tropical Storm', creatorAvatar: 'TS', creatorSubs: '89K subscribers', 
      views: 'Gold Only', duration: '14:20', thumbnailUrl: 'https://picsum.photos/seed/sub3/400/225', 
      badge: 'Gold Access', badgeIcon: 'fas fa-medal', exclusive: true, badgeColor: 'bg-gradient-to-r from-yellow-400 to-amber-500',
      creatorDAOTokens: "3,100 TST", stakedValue: "1.2 ETH", collateralized: false, creatorTier: 'Gold', lastActivity: 'Tip: 0.1ETH 5h ago'
    },
    { 
      id: '12', title: 'Midnight Secrets - Unseen Vault Footage', creator: 'Midnight Jay', creatorAvatar: 'MJ', creatorSubs: '182K subscribers', 
      views: 'Subscriber Only', duration: '19:55', thumbnailUrl: 'https://picsum.photos/seed/sub4/400/225', 
      badge: 'Core Subscriber', badgeIcon: 'fas fa-user-check', exclusive: true, badgeColor: 'bg-gradient-to-r from-indigo-500 to-purple-500',
      creatorDAOTokens: "1,500 MJT", stakedValue: "0.8 ETH", collateralized: true
    },
];

export const MOCK_NFT_COLLECTIONS: NftCollectionItem[] = [
    { id: 'nftcol1', name: 'Cyber Dreams Collection', creator: 'Crystal Rose', imageUrl: 'https://picsum.photos/seed/nftcol1/300/300', floorPrice: '1.5 ETH', totalVolume: '250 ETH', description: 'A limited collection exploring the fusion of human desire and cybernetic augmentation. Each piece is a unique 1/1 artwork.', authenticationCertificateUrl: '#' },
    { id: 'nftcol2', name: 'Celestial Bodies', creator: 'Scarlet Goddess', imageUrl: 'https://picsum.photos/seed/nftcol2/300/300', floorPrice: '2.1 ETH', totalVolume: '420 ETH', description: 'Scarlet Goddess presents a breathtaking series of NFTs inspired by cosmic beauty and divine forms. Holders gain exclusive access to virtual events.', authenticationCertificateUrl: '#' },
    { id: 'nftcol3', name: 'Storm Chasers - Genesis', creator: 'Tropical Storm', imageUrl: 'https://picsum.photos/seed/nftcol3/300/300', floorPrice: '0.8 ETH', totalVolume: '150 ETH', description: 'The first NFT drop from Tropical Storm, capturing raw energy and untamed passion. Future utility includes token-gated content.', authenticationCertificateUrl: '#' },
    { id: 'nftcol4', name: 'Midnight Protocol', creator: 'Midnight Jay', imageUrl: 'https://picsum.photos/seed/nftcol4/300/300', floorPrice: '1.2 ETH', totalVolume: '190 ETH', description: 'Unlock the secrets of the night with Midnight Jay\'s exclusive NFT collection. Each token grants access to a chapter in an unfolding narrative.', authenticationCertificateUrl: '#' },
];

export const NFT_ACCESS_VIDEOS: Video[] = RECOMMENDED_VIDEOS.filter(v => v.badge === 'NFT Access').map(v => ({...v, views: 'NFT Holders Only'}));


export const STUDIO_NAV_ITEMS: StudioNavItem[] = [
    { id: 'upload', label: 'Upload Video', icon: 'fas fa-upload' },
    { id: 'myVideos', label: 'My Videos', icon: 'fas fa-film' },
    { id: 'analytics', label: 'Analytics', icon: 'fas fa-chart-line' },
    { id: 'earnings', label: 'Earnings', icon: 'fas fa-wallet' },
    { id: 'nftCollections', label: 'NFT Collections', icon: 'fas fa-gem' },
    { id: 'subscribers', label: 'Subscribers', icon: 'fas fa-users' },
];

export const MOCK_COMMENTS: Comment[] = [
    { id: 'comment1', author: 'Crystal Rose', avatarChar: 'CR', time: '2 days ago', text: 'Amazing behind the scenes! The NFT collection looks incredible 🔥', likes: 24, dislikes: 1 },
    { id: 'comment2', author: 'Midnight Jay', avatarChar: 'MJ', time: '1 day ago', text: 'The production quality is insane! Can\'t wait for the drop.', likes: 18, dislikes: 0 },
];

export const MOCK_HISTORY_ITEMS: HistoryItem[] = [
    { ...RECOMMENDED_VIDEOS[0], watchedDate: '2024-07-20', transactionHash: '0x123...abc', gasFee: '0.001 ETH', onChainVerified: true, id:'hist1' },
    { ...TRENDING_VIDEOS[1], watchedDate: '2024-07-19', id:'hist2' },
    { ...SUBSCRIPTIONS_VIDEOS[2], watchedDate: '2024-07-18', transactionHash: '0x456...def', onChainVerified: true, id:'hist3'},
    { ...RECOMMENDED_VIDEOS[3], watchedDate: '2024-07-17', id:'hist4' },
];

export const MOCK_WATCH_LATER_ITEMS: WatchLaterItem[] = [
    { ...TRENDING_VIDEOS[0], addedDate: '2024-07-15', priority: 'high', notes: 'Watch this before the pool party ends!', id:'wl1' },
    { ...RECOMMENDED_VIDEOS[1], addedDate: '2024-07-10', priority: 'medium', id:'wl2' },
    { ...SUBSCRIPTIONS_VIDEOS[0], addedDate: '2024-07-05', notes: 'Subscriber exclusive, save for later.', id:'wl3' },
];

export const MOCK_SHORTS: Short[] = [
    { ...RECOMMENDED_VIDEOS[0], id: 'short1', duration: '0:58', isNftGated: true, creatorTokenSymbol: 'CRPT', title:"Short Clip: Midnight Fantasy Teaser" },
    { ...TRENDING_VIDEOS[1], id: 'short2', duration: '0:45', title: "Cosmic Quick Look" },
    { ...RECOMMENDED_VIDEOS[2], id: 'short3', duration: '1:00', isNftGated: false, creatorTokenSymbol: 'SGOD', title: "NFT Art Process Snippet"},
    { ...TRENDING_VIDEOS[3], id: 'short4', duration: '0:33', title: "Desert Dreams Fast Cut"},
];

export const MOCK_LIVE_STREAMS: LiveStream[] = [
    { id: 'live1', title: 'Live Q&A with Crystal Rose', creator: 'Crystal Rose', creatorAvatar: 'CR', viewers: '1.2K', thumbnailUrl: 'https://picsum.photos/seed/live1/400/225', isMultiCam: true, tags: ['Q&A', 'Interactive'], category: 'General' },
    { id: 'live2', title: 'Midnight Jay: Unfiltered Coding Session', creator: 'Midnight Jay', creatorAvatar: 'MJ', viewers: '875', thumbnailUrl: 'https://picsum.photos/seed/live2/400/225', tags: ['Gaming', 'Live Coding'], category: 'Gaming' },
    { id: 'live3', title: 'Scarlet Goddess NFT Reveal Party', creator: 'Scarlet Goddess', creatorAvatar: 'SG', viewers: '2.5K', thumbnailUrl: 'https://picsum.photos/seed/live3/400/225', isMultiCam: true, tags: ['NFT', 'Art', 'Reveal'], category: 'General' },
    { id: 'live4', title: 'Tropical Storm Chill Stream', creator: 'Tropical Storm', creatorAvatar: 'TS', viewers: '630', thumbnailUrl: 'https://picsum.photos/seed/live4/400/225', tags: ['Music', 'Chill'], category: 'Music' },
];

export const MOCK_MUSIC_VIDEOS: Video[] = RECOMMENDED_VIDEOS.slice(0,2).map(v => ({...v, id: `music-${v.id}`, title: `Music Video: ${v.title}`}));
export const MOCK_GAMING_VIDEOS: Video[] = TRENDING_VIDEOS.slice(0,2).map(v => ({...v, id: `gaming-${v.id}`, title: `Gameplay: ${v.title}`}));
export const MOCK_MOVIES_VIDEOS: Video[] = SUBSCRIPTIONS_VIDEOS.slice(0,2).map(v => ({...v, id: `movie-${v.id}`, title: `Short Film: ${v.title}`}));

export const CATEGORY_DATA_MAP: Record<string, { title: string; videos: Video[] }> = {
  music: { title: 'Music Videos', videos: MOCK_MUSIC_VIDEOS },
  gaming: { title: 'Gaming Content', videos: MOCK_GAMING_VIDEOS },
  movies: { title: 'Short Films & Movies', videos: MOCK_MOVIES_VIDEOS },
};
