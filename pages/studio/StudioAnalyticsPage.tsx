
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
  return (
    <div className="p-4 sm:p-6 text-white min-h-screen">
      <div 
        className="mb-8 p-6 rounded-2xl shadow-xl border"
        style={{
            background: `linear-gradient(135deg, ${THEME_COLORS.holoPurple} 0%, ${THEME_COLORS.holoPink} 100%)`,
            borderColor: THEME_COLORS.platinum,
            borderWidth: '1px'
        }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300">
            <Icon name="fas fa-rocket" className="mr-3" />Creator Performance & Valuation Hub
        </h2>
        <p className="text-center text-gray-300 mt-2 text-sm">Unlock institutional-grade insights into your content's global reach, market value, and revenue potential.</p>
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
