
import React from 'react';
import Icon from '../../components/Icon';
import { THEME_COLORS } from '../../constants';

const FeaturePanel: React.FC<{ title: string; description: string; iconName: string; status: string; children?: React.ReactNode; bgColor?: string; borderColor?: string; textColor?: string }> = ({ title, description, iconName, status, children, bgColor = THEME_COLORS.holoPurple, borderColor = THEME_COLORS.primary, textColor=THEME_COLORS.light }) => (
  <div 
    className="rounded-xl p-6 shadow-2xl border transition-all duration-300 hover:shadow-[0_0_30px_rgba(138,43,226,0.5)] h-full flex flex-col"
    style={{ 
        backgroundColor: bgColor, 
        borderColor: borderColor,
        borderWidth: '1px', 
        color: textColor 
    }}
  >
    <div className="flex items-center mb-4">
      <Icon name={iconName} className={`text-3xl mr-4 text-[${THEME_COLORS.platinum}]`} />
      <div>
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-300 to-indigo-400">{title}</h3>
        <span className={`text-xs px-2 py-0.5 rounded-full bg-opacity-50 text-opacity-80`} style={{backgroundColor: 'rgba(255,255,255,0.1)', color: THEME_COLORS.platinum}}>{status}</span>
      </div>
    </div>
    <p className="text-sm mb-4 text-gray-300 flex-grow">{description}</p>
    {children && <div className="mt-auto">{children}</div>}
  </div>
);


const StudioAnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = React.useState('7d');
  const [selectedMetric, setSelectedMetric] = React.useState('views');

  // Mock data - in real app, this would come from your analytics API
  const analyticsData = {
    totalViews: 125420,
    totalEarnings: 15.67,
    subscribers: 2847,
    engagement: 8.4,
    topVideos: [
      { title: "Midnight Fantasy Collection", views: 24500, earnings: 3.2, duration: "24:18" },
      { title: "Private Session #42", views: 18200, earnings: 2.8, duration: "18:42" },
      { title: "Behind the Scenes Vol 3", views: 32700, earnings: 4.1, duration: "32:15" }
    ],
    viewsData: [120, 150, 180, 220, 190, 250, 280],
    earningsData: [2.1, 2.8, 3.2, 4.1, 3.7, 4.8, 5.2]
  };

  return (
    <div className="p-4 sm:p-6 text-white min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      {/* Header */}
      <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30">
        <h2 className="text-3xl font-bold text-center mb-2">
          <Icon name="fas fa-chart-line" className="mr-3 text-purple-400" />
          Creator Analytics Dashboard
        </h2>
        <p className="text-center text-gray-300">Track your performance, earnings, and audience growth</p>
      </div>

      {/* Time Range Selector */}
      <div className="flex justify-center mb-8">
        <div className="bg-gray-800 rounded-lg p-1 flex">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                timeRange === range
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      
      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-2">
            <Icon name="fas fa-eye" className="text-2xl text-purple-400" />
            <span className="text-green-400 text-sm">+12.5%</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{analyticsData.totalViews.toLocaleString()}</h3>
          <p className="text-gray-400 text-sm">Total Views</p>
        </div>

        <div className="bg-gradient-to-br from-green-600/20 to-green-800/20 rounded-xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between mb-2">
            <Icon name="fas fa-dollar-sign" className="text-2xl text-green-400" />
            <span className="text-green-400 text-sm">+8.3%</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{analyticsData.totalEarnings} ETH</h3>
          <p className="text-gray-400 text-sm">Total Earnings</p>
        </div>

        <div className="bg-gradient-to-br from-pink-600/20 to-pink-800/20 rounded-xl p-6 border border-pink-500/30">
          <div className="flex items-center justify-between mb-2">
            <Icon name="fas fa-users" className="text-2xl text-pink-400" />
            <span className="text-green-400 text-sm">+15.7%</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{analyticsData.subscribers.toLocaleString()}</h3>
          <p className="text-gray-400 text-sm">Subscribers</p>
        </div>

        <div className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 rounded-xl p-6 border border-blue-500/30">
          <div className="flex items-center justify-between mb-2">
            <Icon name="fas fa-heart" className="text-2xl text-blue-400" />
            <span className="text-green-400 text-sm">+5.2%</span>
          </div>
          <h3 className="text-2xl font-bold text-white">{analyticsData.engagement}%</h3>
          <p className="text-gray-400 text-sm">Engagement Rate</p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Views Chart */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Icon name="fas fa-chart-area" className="mr-2 text-purple-400" />
            Views Over Time
          </h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analyticsData.viewsData.map((value, index) => (
              <div key={index} className="flex-1 bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-md relative group">
                <div 
                  className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-md transition-all duration-300 hover:from-purple-500 hover:to-purple-300"
                  style={{ height: `${(value / Math.max(...analyticsData.viewsData)) * 100}%` }}
                ></div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {value}K
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-gray-400 text-sm mt-2">
            <span>7 days ago</span>
            <span>Today</span>
          </div>
        </div>

        {/* Earnings Chart */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center">
            <Icon name="fas fa-coins" className="mr-2 text-green-400" />
            Earnings Over Time
          </h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analyticsData.earningsData.map((value, index) => (
              <div key={index} className="flex-1 bg-gradient-to-t from-green-600 to-green-400 rounded-t-md relative group">
                <div 
                  className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-md transition-all duration-300 hover:from-green-500 hover:to-green-300"
                  style={{ height: `${(value / Math.max(...analyticsData.earningsData)) * 100}%` }}
                ></div>
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {value} ETH
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-gray-400 text-sm mt-2">
            <span>7 days ago</span>
            <span>Today</span>
          </div>
        </div>
      </div>

      {/* Top Videos */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-8">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
          <Icon name="fas fa-trophy" className="mr-2 text-yellow-400" />
          Top Performing Videos
        </h3>
        <div className="space-y-4">
          {analyticsData.topVideos.map((video, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 transition-colors">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded flex items-center justify-center">
                  <Icon name="fas fa-play" className="text-white text-sm" />
                </div>
                <div>
                  <h4 className="text-white font-medium">{video.title}</h4>
                  <p className="text-gray-400 text-sm">{video.duration}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">{video.views.toLocaleString()} views</p>
                <p className="text-green-400 text-sm">{video.earnings} ETH earned</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
        {/* 3D Wallet Clustering Visualization */}
        <FeaturePanel
          title="Global Engagement Matrix"
          description="Interactive 3D globe visualizing anonymous viewer wallet concentrations, engagement heatmaps, and spending hotspots. Filter by token holdings, chain activity, and content preferences."
          iconName="fas fa-globe-americas"
          status="Advanced Visualization - Coming Q1 2025"
          bgColor="rgba(138, 43, 226, 0.2)"
          borderColor="rgba(229, 228, 226, 0.3)"
        >
          <div className="mt-4 space-y-3">
            <div className="text-center">
                 <Icon name="fas fa-street-view" className={`text-6xl text-[${THEME_COLORS.primary}] opacity-30 mb-2`} />
                 <p className="text-xs text-gray-400"> (Placeholder: 3D Globe Visualization Area)</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <button className="text-xs bg-white/10 hover:bg-white/20 text-white py-1.5 px-3 rounded-full backdrop-blur-sm transition-colors"><Icon name="fas fa-coins" className="mr-1.5" />Token Holdings</button>
              <button className="text-xs bg-white/10 hover:bg-white/20 text-white py-1.5 px-3 rounded-full backdrop-blur-sm transition-colors"><Icon name="fas fa-link" className="mr-1.5" />Chain Activity</button>
              <button className="text-xs bg-white/10 hover:bg-white/20 text-white py-1.5 px-3 rounded-full backdrop-blur-sm transition-colors"><Icon name="fas fa-video" className="mr-1.5" />Content Type</button>
            </div>
          </div>
        </FeaturePanel>

        {/* Content Valuation Simulator */}
        <FeaturePanel
          title="Content Valuation Simulator"
          description="Dynamically assess your content's market value. Real-time valuation graph with ETH/Platform Token price feeds. Adjust parameters like duration, exclusivity, and creator reputation. Project NFT floor price impacts."
          iconName="fas fa-chart-line"
          status="Financial Modeling Engine - Coming Q2 2025"
          bgColor="rgba(255, 107, 139, 0.15)"
          borderColor="rgba(229, 228, 226, 0.3)"
        >
            <div className="mt-4 space-y-3">
                <div className="text-center">
                    <Icon name="fas fa-search-dollar" className={`text-6xl text-[${THEME_COLORS.secondary}] opacity-30 mb-2`} />
                    <p className="text-xs text-gray-400"> (Placeholder: Real-time Valuation Graph)</p>
                </div>
                <div className="space-y-2 text-xs">
                    <p>Duration: <input type="range" className="w-full accent-pink-500" /></p>
                    <p>Exclusivity: <input type="range" className="w-full accent-pink-500" /></p>
                    <p className="font-semibold text-center mt-2 text-sm">Projected NFT Impact: <span className="text-green-400">+15%</span></p>
                </div>
            </div>
        </FeaturePanel>

        {/* Royalty Optimization Engine */}
        <FeaturePanel
          title="Royalty Optimization Engine"
          description="Maximize your earnings with intelligent smart contract configurations. Gas fee calculator with optimization suggestions, cross-chain royalty comparisons, and a smart contract config generator with preview."
          iconName="fas fa-cogs"
          status="Smart Contract Toolkit - Coming Q3 2025"
          bgColor="rgba(0, 200, 83, 0.1)"
          borderColor="rgba(229, 228, 226, 0.3)"
        >
            <div className="mt-4 space-y-3 text-xs">
                <div className="text-center">
                    <Icon name="fas fa-gas-pump" className={`text-6xl text-[${THEME_COLORS.success}] opacity-30 mb-2`} />
                </div>
                <p>Gas Fee: <span className="font-bold text-green-400">0.005 ETH (Optimized)</span></p>
                <p>Cross-Chain (Avg. Royalty): ETH: 5% | SOL: 4.5% | ARB: 5.2%</p>
                <button className="w-full mt-2 text-xs bg-green-500/20 hover:bg-green-500/30 text-green-300 py-2 px-3 rounded-full backdrop-blur-sm transition-colors"><Icon name="fas fa-file-code" className="mr-1.5" />Generate Optimal Config</button>
            </div>
        </FeaturePanel>
      </div>
       <p className="text-center text-xs text-gray-500 mt-10">
            <Icon name="fas fa-info-circle" className="mr-1" /> All visualizations and simulations are based on aggregated, anonymized on-chain data and advanced predictive modeling. Haptic feedback and spatial audio notifications will enhance key interactions upon full release.
        </p>
    </div>
  );
};

export default StudioAnalyticsPage;
