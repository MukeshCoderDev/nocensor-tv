
import React from 'react';
import Icon from '../../components/Icon';
import { THEME_COLORS } from '../../constants';

const EarningsFeaturePanel: React.FC<{ title: string; description: string; iconName: string; status: string; children?: React.ReactNode; panelStyle?: React.CSSProperties }> = ({ title, description, iconName, status, children, panelStyle }) => (
  <div 
    className="rounded-xl p-6 shadow-2xl border transition-all duration-300 hover:shadow-lg h-full flex flex-col glassmorphic-panel"
    style={{
        background: 'rgba(255, 255, 255, 0.05)', // Base for glassmorphism
        backdropFilter: 'blur(20px)',
        borderWidth: '1px', 
        borderColor: THEME_COLORS.platinum,
        ...panelStyle
    }}
  >
    <div className="flex items-start mb-4">
      <Icon name={iconName} className={`text-4xl mr-4 text-[${THEME_COLORS.platinum}] p-2 bg-white/10 rounded-lg`} />
      <div>
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-sky-400">{title}</h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-gray-300">{status}</span>
      </div>
    </div>
    <p className="text-sm text-gray-300 mb-4 flex-grow">{description}</p>
    {children && <div className="mt-auto">{children}</div>}
  </div>
);

const StudioEarningsPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 text-white min-h-screen">
      <div 
        className="mb-8 p-6 rounded-2xl shadow-xl border"
        style={{
            background: `linear-gradient(145deg, ${THEME_COLORS.dark} 20%, ${THEME_COLORS.holoPurple} 100%)`,
            borderColor: THEME_COLORS.platinum,
        }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-br from-gray-100 via-platinum to-gray-300">
            <Icon name="fas fa-landmark" className="mr-3" />Institutional Earnings & Treasury
        </h2>
        <p className="text-center text-gray-300 mt-2 text-sm">Comprehensive oversight of your decentralized revenue streams, royalty distributions, and on-chain financial health.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8">
        {/* Token Flow Waterfall */}
        <EarningsFeaturePanel
          title="Live Revenue Waterfall"
          description="Visualize animated ETH/Platform Token streams from primary sales, secondary market royalties, and staking. Interactive breakdown by content, time period, and source. Includes staking APY projections."
          iconName="fas fa-water"
          status="Live Financial Dashboard - Q1 2025"
          panelStyle={{background: `radial-gradient(circle, ${THEME_COLORS.holoPink} 0%, transparent 70%)`}}
        >
          <div className="mt-4 space-y-3">
            <div className="text-center my-4">
                <Icon name="fas fa-chart-area" className={`text-6xl text-[${THEME_COLORS.secondary}] opacity-40`} />
                <p className="text-xs text-gray-400">(Placeholder: Animated Token Flow Chart)</p>
            </div>
            <select className="w-full bg-white/5 text-white py-2 px-3 rounded-md border border-white/20 text-xs backdrop-blur-sm">
              <option>Breakdown by: All Sources</option>
              <option>Content Type</option>
              <option>Time Period</option>
            </select>
            <p className="text-center font-semibold text-sm">Staking APY: <span className="text-green-400">12.5% (Projected)</span></p>
          </div>
        </EarningsFeaturePanel>

        {/* Royalty Split Editor */}
        <EarningsFeaturePanel
          title="Automated Royalty Distribution"
          description="Effortlessly manage royalty splits. Drag-and-drop beneficiary allocation, real-time distribution impact preview, and an integrated tax efficiency analyzer."
          iconName="fas fa-sitemap"
          status="Smart Distribution - Q2 2025"
          panelStyle={{background: `radial-gradient(circle, ${THEME_COLORS.holoPurple} 0%, transparent 70%)`}}
        >
            <div className="mt-4 space-y-3">
                <div className="text-center my-4">
                    <Icon name="fas fa-users-cog" className={`text-6xl text-[${THEME_COLORS.primary}] opacity-40`} />
                    <p className="text-xs text-gray-400">(Placeholder: Drag & Drop Interface)</p>
                </div>
                <div className="text-xs p-2 bg-black/20 rounded">
                    <p>Preview: Creator: 70% | Collab A: 20% | DAO Fund: 10%</p>
                    <p>Tax Efficiency: <span className="text-yellow-400">Moderate (Optimize?)</span></p>
                </div>
                 <button className="w-full mt-2 text-xs bg-purple-500/30 hover:bg-purple-500/40 text-purple-300 py-2 px-3 rounded-full backdrop-blur-sm transition-colors"><Icon name="fas fa-edit" className="mr-1.5" />Edit Allocations</button>
            </div>
        </EarningsFeaturePanel>

        {/* On-Chain Audit Explorer */}
        <EarningsFeaturePanel
          title="On-Chain Audit & Compliance"
          description="Maintain transparency with our holographic transaction visualizer. Exportable compliance reports and an integrated dispute resolution panel with DAO governance."
          iconName="fas fa-receipt"
          status="Enterprise Grade - Q3 2025"
           panelStyle={{background: `radial-gradient(circle, rgba(0,200,83,0.2) 0%, transparent 70%)`}}
        >
            <div className="mt-4 space-y-3">
                 <div className="text-center my-4">
                    <Icon name="fas fa-cubes" className={`text-6xl text-[${THEME_COLORS.success}] opacity-40`} />
                    <p className="text-xs text-gray-400">(Placeholder: Holographic Transaction Visualizer)</p>
                </div>
                <button className="w-full text-xs bg-green-500/20 hover:bg-green-500/30 text-green-300 py-2 px-3 rounded-full backdrop-blur-sm transition-colors"><Icon name="fas fa-file-export" className="mr-1.5" />Export Compliance Report</button>
                <button className="w-full mt-2 text-xs bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 py-2 px-3 rounded-full backdrop-blur-sm transition-colors"><Icon name="fas fa-gavel" className="mr-1.5" />DAO Dispute Resolution</button>
            </div>
        </EarningsFeaturePanel>
      </div>
      <p className="text-center text-xs text-gray-500 mt-10">
            <Icon name="fas fa-lock" className="mr-1" /> All financial data is sourced directly from immutable blockchain records, ensuring utmost transparency and security. Diamond particle effects and sensory UX enhancements planned for full release.
        </p>
    </div>
  );
};

export default StudioEarningsPage;
