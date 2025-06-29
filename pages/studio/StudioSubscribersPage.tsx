
import React, { useState } from 'react';
import Icon from '../../components/Icon';
import { THEME_COLORS } from '../../constants';

const FeatureCard: React.FC<{ title: string; description: string; iconName: string; children?: React.ReactNode; status?: string; accentColor?: string; }> = ({ title, description, iconName, children, status, accentColor = THEME_COLORS.primary }) => {
  return (
    <div 
        className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/10 transition-all duration-300 hover:shadow-[0_0_35px_rgba(138,43,226,0.3)] h-full flex flex-col"
        style={{borderColor: accentColor ? `${accentColor}40` : 'rgba(255,255,255,0.1)'}}
    >
        <div className="flex items-start mb-4">
            <Icon name={iconName} className={`text-3xl mr-4 p-2 rounded-lg bg-white/10 text-[${accentColor}]`} />
            <div>
                <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-white to-gray-300">{title}</h3>
                {status && <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400 mt-1 inline-block">{status}</span>}
            </div>
        </div>
        <p className="text-sm text-gray-300 mb-4 flex-grow">{description}</p>
        {children && <div className="mt-auto">{children}</div>}
    </div>
  );
};

const TierBadge: React.FC<{ tierName: string; iconName: string; libAmount: string; ltv: string; color: string; hoverColor: string; }> = ({ tierName, iconName, libAmount, ltv, color, hoverColor }) => (
    <div className={`group relative p-4 rounded-lg border-2 bg-black/30 transition-all duration-300 hover:shadow-xl cursor-pointer flex flex-col items-center text-center h-full`}
         style={{borderColor: color, '--hover-color': hoverColor} as React.CSSProperties}
         onMouseEnter={(e) => e.currentTarget.style.borderColor = hoverColor}
         onMouseLeave={(e) => e.currentTarget.style.borderColor = color}
    >
        <Icon name={iconName} className={`text-4xl mb-2 transition-colors duration-300 group-hover:text-[var(--hover-color)] text-[${color}]`}/>
        <h4 className={`text-lg font-semibold transition-colors duration-300 group-hover:text-[var(--hover-color)] text-[${color}]`}>{tierName}</h4>
        <p className="text-xs text-gray-400 mt-1">Avg. LIB: {libAmount}</p>
        <p className="text-xs text-gray-400">LTV: {ltv}</p>
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
             style={{boxShadow: `0 0 20px ${hoverColor}, 0 0 10px ${hoverColor} inset`}}>
        </div>
    </div>
);


const StudioSubscribersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="p-4 sm:p-6 text-white min-h-screen">
      <div 
        className="mb-8 p-6 rounded-2xl shadow-xl border"
        style={{
            background: `linear-gradient(135deg, ${THEME_COLORS.darker} 20%, ${THEME_COLORS.holoPurple} 120%)`,
            borderColor: THEME_COLORS.platinum,
            borderWidth: '1px'
        }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-platinum to-pink-400">
            <Icon name="fas fa-users-cog" className="mr-3" />Premium Subscriber Command Center
        </h2>
        <p className="text-center text-gray-300 mt-2 text-sm">Manage, engage, and reward your tokenized subscriber base with unparalleled insights.</p>
      </div>

      {/* Wealth Tier Visualization */}
      <section className="mb-12">
        <h3 className="text-2xl font-semibold mb-6 text-center text-gray-200">Subscriber Wealth Tiers & Value Matrix</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <TierBadge tierName="Bronze Tier" iconName="fas fa-shield-alt" libAmount="100 LIB" ltv="$50/yr" color={THEME_COLORS.gray} hoverColor="#cd7f32" />
            <TierBadge tierName="Silver Tier" iconName="fas fa-star" libAmount="500 LIB" ltv="$150/yr" color={THEME_COLORS.gray} hoverColor="#c0c0c0" />
            <TierBadge tierName="Gold Tier" iconName="fas fa-crown" libAmount="2,500 LIB" ltv="$500/yr" color={THEME_COLORS.gray} hoverColor={THEME_COLORS.gold} />
            <TierBadge tierName="Platinum Tier" iconName="fas fa-gem" libAmount="10,000 LIB" ltv="$1,500/yr" color={THEME_COLORS.gray} hoverColor={THEME_COLORS.platinum} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureCard title="Diamond-Shaped Tier Graph" description="Visualize subscriber distribution across wealth tiers. (Placeholder for interactive graph - e.g., Chart.js)" iconName="fas fa-chart-pie" accentColor={THEME_COLORS.platinum}>
                <div className="h-40 bg-white/5 rounded-lg flex items-center justify-center text-gray-500 text-sm italic">
                    <Icon name="fas fa-gem" className="text-5xl opacity-20"/> (Diamond Graph Area)
                </div>
            </FeatureCard>
            <FeatureCard title="Lifetime Value Forecasting" description="AI-powered LTV projections based on tier, engagement, and token velocity. (Powered by NoCensor Oracle)" iconName="fas fa-brain" accentColor={THEME_COLORS.cyan}>
                 <div className="h-40 bg-white/5 rounded-lg flex items-center justify-center text-gray-500 text-sm italic">
                     <Icon name="fas fa-chart-line" className="text-5xl opacity-20"/> (LTV Projection Dashboard)
                </div>
            </FeatureCard>
        </div>
        <p className="text-xs text-center text-gray-500 mt-4">Note: Interactive subscriber globe showing geographic distribution (Three.js integration) planned for Q4.</p>
      </section>

      {/* Engagement Analytics Hub */}
      <section className="mb-12">
        <h3 className="text-2xl font-semibold mb-6 text-center text-gray-200">Engagement & Loyalty Nexus</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard title="Consumption Heatmaps" description="Analyze content engagement by time of day, category, and subscriber tier. Identify popular content and peak activity times." iconName="fas fa-fire" status="Data Aggregation Active" accentColor={THEME_COLORS.secondary}>
                <div className="h-32 bg-white/5 rounded-lg flex items-center justify-center text-gray-500 text-sm italic">
                    <Icon name="fas fa-map-marked-alt" className="text-4xl opacity-20"/> (Heatmap Visualization)
                </div>
            </FeatureCard>
            <FeatureCard title="Reward Multiplier Calculator" description="Dynamically calculate and apply reward multipliers for highly active and loyal subscribers based on on-chain interactions." iconName="fas fa-calculator" status="Smart Contract Integration" accentColor={THEME_COLORS.success}>
                <input type="range" className="w-full mt-2 accent-green-500" defaultValue="1.5" min="1" max="5" step="0.1"/>
                <p className="text-xs text-center text-gray-400 mt-1">Current Multiplier: 1.5x</p>
            </FeatureCard>
            <FeatureCard title="Automated Loyalty Program" description="Configure and deploy automated loyalty programs with tiered benefits, NFT-gated perks, and token rewards." iconName="fas fa-robot" status="Configurable Rules Engine" accentColor={THEME_COLORS.warning}>
                 <button className="w-full bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 py-2 px-4 rounded-lg text-sm font-semibold transition-colors">
                    <Icon name="fas fa-cogs" className="mr-2"/>Configure Loyalty Program
                </button>
            </FeatureCard>
        </div>
      </section>

      {/* Token-Gated Community Space */}
      <section className="mb-12">
        <h3 className="text-2xl font-semibold mb-6 text-center text-gray-200">Exclusive Tokenized Community Suite</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard title="Multi-Sig Encrypted Chat" description="Secure, decentralized communication channels for specific subscriber tiers, requiring multi-signature access for critical announcements." iconName="fas fa-comments-dollar" status="ZK-Proofs Enabled" accentColor={THEME_COLORS.indigo}>
                 <div className="h-32 bg-white/5 rounded-lg flex items-center justify-center text-gray-500 text-sm italic">
                    <Icon name="fas fa-user-secret" className="text-4xl opacity-20"/> (Secure Chat Interface)
                </div>
            </FeatureCard>
            <FeatureCard title="Exclusive Content Drop Scheduler" description="Plan and announce token-gated content releases, early access, and NFT mints directly to eligible subscriber segments." iconName="fas fa-calendar-alt" status="Automated Notifications" accentColor={THEME_COLORS.teal}>
                <button className="w-full bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 py-2 px-4 rounded-lg text-sm font-semibold transition-colors">
                    <Icon name="fas fa-plus-circle" className="mr-2"/>Schedule New Drop
                </button>
            </FeatureCard>
            <FeatureCard title="Subscriber Token Airdrop Manager" description="Easily manage and execute token airdrops (LIB or custom creator tokens) to subscribers based on tier, loyalty, or specific actions." iconName="fas fa-parachute-box" status="Batch Transactions Ready" accentColor={THEME_COLORS.pink}>
                 <button className="w-full bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 py-2 px-4 rounded-lg text-sm font-semibold transition-colors">
                    <Icon name="fas fa-paper-plane" className="mr-2"/>Initiate Airdrop
                </button>
                <p className="text-xs text-center text-gray-500 mt-2">Diamond particle effects during distributions will be implemented.</p>
            </FeatureCard>
        </div>
      </section>

       <p className="text-center text-xs text-gray-500 mt-10">
            <Icon name="fas fa-shield-alt" className="mr-1" /> Subscriber data is anonymized and aggregated. All financial interactions are transparently recorded on the blockchain.
        </p>
    </div>
  );
};

export default StudioSubscribersPage;
