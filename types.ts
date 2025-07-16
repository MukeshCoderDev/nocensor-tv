
export type PageId =
  | 'homePage' | 'trendingPage' | 'subscriptionsPage' | 'nftAccessPage'
  | 'historyPage' | 'watchLaterPage' | 'shortsPage'
  | 'musicPage' | 'gamingPage' | 'moviesPage' | 'livePage'
  | 'studioPage' | 'analyticsPage' | 'earningsPage' | 'nftCollectionsPage' | 'subscribersPage'
  | 'settingsPage' | 'privacyPage' | 'helpPage' | 'playerPage';

export interface User {
  name: string;
  avatarChar: string;
}

export interface Video {
  id: string;
  title: string;
  creator: string;
  creatorAvatar: string;
  creatorSubs: string;
  views: string;
  price?: string;
  duration: string;
  thumbnailUrl: string;
  badge?: string;
  badgeIcon?: string;
  badgeColor?: string; // e.g. 'bg-purple-600' or 'bg-pink-500'
  exclusive?: boolean;
  description?: string; 

  // New properties for Trending/Subscription enhancements
  trendingScore?: number;
  tokenVelocity?: 'low' | 'medium' | 'high';
  nftValueImpact?: number; // e.g., percentage
  isTopTrend?: boolean; // For highlighting top 1-3 trending videos
  creatorDAOTokens?: string; // e.g., "5,200 CDT"
  stakedValue?: string; // e.g., "2.5 ETH"
  collateralized?: boolean;
  lastActivity?: string; // e.g., "TX: 0xabc...def 2m ago"
  creatorTier?: 'Gold' | 'Platinum' | 'Diamond'; // Mock tier for subscriptions
}

export interface Creator {
  id: string;
  name: string;
  username: string;
  avatarChar: string;
  subscribers: string;
  views: string;
  nftCollections: number;
  thumbnailUrl: string;
  verified?: boolean;
}

export interface Feature {
  icon: string;
  title: string;
  description: string;
  badge: string;
  gradient?: string;
  stats?: string;
  highlight?: string;
}

export interface MenuItem {
  id: PageId | string;
  label: string;
  icon: string;
  path: string;
}

export interface MenuSection {
  title?: string;
  items: MenuItem[];
}

export interface StudioNavItem {
  id: string;
  label: string;
  icon: string;
}

export interface Comment {
  id: string;
  author: string;
  avatarChar: string;
  time: string;
  text: string;
  likes: number;
  dislikes: number;
}

export interface HistoryItem extends Video {
  watchedDate: string;
  transactionHash?: string; // Optional: for on-chain verification
  gasFee?: string; // Optional
  onChainVerified?: boolean;
}

export interface WatchLaterItem extends Video {
  addedDate: string;
  priority?: 'high' | 'medium' | 'low'; // For AI-based sorting
  notes?: string;
}

export interface Short extends Video {
  isNftGated?: boolean;
  creatorTokenSymbol?: string;
}

export interface LiveStream {
  id: string;
  title: string;
  creator: string;
  creatorAvatar: string;
  viewers: string;
  thumbnailUrl: string;
  isMultiCam?: boolean;
  tags: string[];
  category: 'Music' | 'Gaming' | 'Movies' | 'General';
}

export interface NftCollectionItem {
  id: string;
  name: string;
  imageUrl: string;
  floorPrice?: string;
  totalVolume?: string;
  creator: string;
  description?: string;
  authenticationCertificateUrl?: string; // Mock URL
}
