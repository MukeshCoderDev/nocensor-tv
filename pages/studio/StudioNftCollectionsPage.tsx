
import React from 'react';
import Icon from '../../components/Icon';
import { THEME_COLORS } from '../../constants';

const NFTStudioFeature: React.FC<{ title: string; description: string; iconName: string; status: string; children?: React.ReactNode; featureColor?: string }> = ({ title, description, iconName, status, children, featureColor = THEME_COLORS.primary }) => (
  <div 
    className="rounded-xl p-6 shadow-2xl border transition-all duration-300 hover:shadow-lg flex flex-col glassmorphic-panel hover:border-opacity-70"
    style={{
        background: 'rgba(30, 30, 30, 0.5)', // Darker base for NFT studio
        backdropFilter: 'blur(25px)',
        borderWidth: '1px', 
        borderColor: featureColor, // Use feature color for border accent
    }}
  >
    <div className="flex items-center mb-4">
      <Icon name={iconName} className={`text-4xl mr-4 p-2 rounded-lg bg-white/5 text-[${featureColor}]`} />
      <div>
        <h3 className="text-xl font-bold" style={{ color: THEME_COLORS.platinum }}>{title}</h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-400">{status}</span>
      </div>
    </div>
    <p className="text-sm text-gray-300 mb-4 flex-grow">{description}</p>
    {children && <div className="mt-auto">{children}</div>}
  </div>
);

const StudioNftCollectionsPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 text-white min-h-screen">
      <div 
        className="mb-8 p-6 rounded-2xl shadow-xl border"
        style={{
            background: `linear-gradient(160deg, ${THEME_COLORS.darker} 30%, ${THEME_COLORS.holoPurple} 110%)`,
            borderColor: THEME_COLORS.platinum,
        }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-platinum to-pink-400">
            <Icon name="fas fa-meteor" className="mr-3" />NoCensor NFT Foundry & Tokenomics Lab
        </h2>
        <p className="text-center text-gray-300 mt-2 text-sm">Architect, mint, and manage next-generation NFT collections with unparalleled control and cross-chain capabilities.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
        {/* Generative Art Architect */}
        <NFTStudioFeature
          title="Generative Art & 3D Asset Studio"
          description="Craft stunning NFT collections. Design with a drag-and-drop trait matrix, simulate rarity probabilities, and preview 3D assets with advanced lighting controls."
          iconName="fas fa-palette"
          status="Professional Minting Suite - Q1 2025"
          featureColor={THEME_COLORS.secondary}
        >
          <div className="mt-4 space-y-3">
             <div className="text-center my-4">
                <Icon name="fas fa-cubes-stacked" className={`text-6xl opacity-30 text-[${THEME_COLORS.secondary}]`}/>
                <p className="text-xs text-gray-400">(Placeholder: Trait Matrix & 3D Previewer)</p>
            </div>
            <button className="w-full text-xs bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 py-2 px-3 rounded-full transition-colors"><Icon name="fas fa-drafting-compass" className="mr-1.5" />Open Trait Designer</button>
            <button className="w-full mt-2 text-xs bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 py-2 px-3 rounded-full transition-colors"><Icon name="fas fa-eye" className="mr-1.5" />Launch 3D Previewer</button>
          </div>
        </NFTStudioFeature>

        {/* Tokenomics Simulator */}
        <NFTStudioFeature
          title="Advanced Tokenomics Modeler"
          description="Engineer robust token economies. Model bonding curves in a sandbox environment, forecast liquidity pool impacts, and calculate staking APY with variable inputs."
          iconName="fas fa-brain"
          status="DeFi Strategy Tools - Q2 2025"
          featureColor={THEME_COLORS.primary}
        >
            <div className="mt-4 space-y-3">
                <div className="text-center my-4">
                    <Icon name="fas fa-chart-pie" className={`text-6xl opacity-30 text-[${THEME_COLORS.primary}]`} />
                    <p className="text-xs text-gray-400">(Placeholder: Bonding Curve & APY Simulators)</p>
                </div>
                <div className="text-xs p-3 bg-black/20 rounded-lg">
                    <p>Bonding Curve Model: <span className="font-semibold text-purple-300">Exponential</span></p>
                    <p>Projected Staking APY: <span className="font-semibold text-purple-300">8% - 25%</span></p>
                </div>
                <button className="w-full mt-2 text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 py-2 px-3 rounded-full transition-colors"><Icon name="fas fa-flask" className="mr-1.5" />Open Tokenomics Sandbox</button>
            </div>
        </NFTStudioFeature>

        {/* Multi-Chain Deployment Suite */}
        <NFTStudioFeature
          title="Multi-Chain Deployment Suite"
          description="Seamlessly launch and manage your collections across leading blockchains. One-click deployment to Ethereum, Polygon, Arbitrum. Configure royalty waterfalls and manage batch minting with allowlists."
          iconName="fas fa-network-wired"
          status="Cross-Chain Operations - Q3 2025"
          featureColor={THEME_COLORS.success}
        >
            <div className="mt-4 space-y-3">
                <div className="text-center my-4">
                    <Icon name="fas fa-rocket" className={`text-6xl opacity-30 text-[${THEME_COLORS.success}]`} />
                </div>
                <p className="text-xs text-center text-gray-400">Deploy to:</p>
                <div className="flex justify-center gap-2">
                    <button className="text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 py-1.5 px-3 rounded-full">ETH</button>
                    <button className="text-xs bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 py-1.5 px-3 rounded-full">POLY</button>
                    <button className="text-xs bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 py-1.5 px-3 rounded-full">ARB</button>
                </div>
                <button className="w-full mt-2 text-xs bg-green-500/20 hover:bg-green-500/30 text-green-300 py-2 px-3 rounded-full transition-colors"><Icon name="fas fa-cogs" className="mr-1.5" />Configure Deployment</button>
            </div>
        </NFTStudioFeature>
      </div>
      <p className="text-center text-xs text-gray-500 mt-10">
            <Icon name="fas fa-shield-alt" className="mr-1" /> Minting, deployment, and management tools are designed with enterprise-grade security and smart contract best practices. Expect platinum-accented interfaces and haptic feedback on critical actions in the full release.
        </p>
    </div>
  );
};

export default StudioNftCollectionsPage;
