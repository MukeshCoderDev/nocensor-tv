
import React from 'react';
import Icon from '../components/Icon';
import { THEME_COLORS } from '../constants';

interface HelpPanelProps {
  title: string;
  iconName: string;
  children: React.ReactNode;
  accentColor?: string;
}

const HelpPanel: React.FC<HelpPanelProps> = ({ title, iconName, children, accentColor = THEME_COLORS.secondary }) => (
  <div 
    className="bg-gray-800/30 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,107,139,0.3)] h-full flex flex-col"
    style={{borderColor: `${accentColor}50`, background: `radial-gradient(circle at top left, ${accentColor}1A, ${THEME_COLORS.darker} 70%)`}}
  >
    <div className="flex items-center mb-4">
      <Icon name={iconName} className={`text-3xl mr-3 p-2 rounded-lg bg-white/5 text-[${accentColor}]`} />
      <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-pink-300 to-rose-400">{title}</h3>
    </div>
    <div className="flex-grow space-y-4">{children}</div>
  </div>
);

const GemProgressTracker: React.FC<{ label: string; progress: number }> = ({ label, progress }) => (
    <div className="my-2">
        <div className="flex justify-between text-xs text-gray-300 mb-0.5">
            <span>{label}</span>
            <span>{progress}%</span>
        </div>
        <div className="w-full bg-black/30 rounded-full h-2.5 border border-pink-500/30 p-0.5">
            <div className="bg-gradient-to-r from-pink-500 to-rose-600 h-1.5 rounded-full shadow-[0_0_5px_#ff6b8b]" style={{width: `${progress}%`}}></div>
        </div>
    </div>
);


const HelpPage: React.FC = () => {
  return (
    <div className="p-4 sm:p-6 text-white min-h-screen">
       <div 
        className="mb-8 p-6 rounded-2xl shadow-xl border relative overflow-hidden"
        style={{
            background: `linear-gradient(135deg, ${THEME_COLORS.darker} 20%, ${THEME_COLORS.secondary}BB 110%)`,
            borderColor: THEME_COLORS.pink,
        }}
      >
        <Icon name="fas fa-life-ring" className="absolute -top-8 -right-8 text-9xl text-pink-500 opacity-10 blur-md" />
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-br from-gray-100 via-pink-300 to-rose-400 relative z-10">
            <Icon name="fas fa-hands-helping" className="mr-3" />Immersive Help & Support Ecosystem
        </h2>
        <p className="text-center text-gray-300 mt-2 text-sm relative z-10">Your intelligent guide to navigating NoCensor TV and the Web3 landscape.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* AI-Powered Support Assistant */}
        <HelpPanel title="AI-Powered Support Assistant" iconName="fas fa-robot" accentColor={THEME_COLORS.primary}>
            <div className="flex items-center gap-3 mb-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center border-2 border-white/20 shadow-lg">
                     <Icon name="fas fa-user-astronaut" className="text-3xl text-white" title="3D Assistant Avatar Placeholder"/>
                </div>
                <p className="text-xs text-gray-300 flex-1">Ask me anything about NoCensor TV, blockchain, or NFTs! (Lip-sync animation planned)</p>
            </div>
            <textarea placeholder="Natural language blockchain troubleshooting..." rows={2} className="w-full bg-black/30 border border-purple-500/50 rounded-lg p-2 text-xs text-gray-200 focus:border-purple-400 outline-none"></textarea>
            <div className="grid grid-cols-2 gap-2 mt-2">
                <button className="text-xs bg-purple-500/30 hover:bg-purple-500/40 text-purple-300 py-2 px-2.5 rounded-lg transition-colors"><Icon name="fas fa-video" className="mr-1"/>Video Walkthrough</button>
                <button className="text-xs bg-purple-500/30 hover:bg-purple-500/40 text-purple-300 py-2 px-2.5 rounded-lg transition-colors"><Icon name="fas fa-bug" className="mr-1"/>Live Contract Debugger</button>
            </div>
        </HelpPanel>

        {/* Community Wisdom Vault */}
        <HelpPanel title="Community Wisdom Vault" iconName="fas fa-book-reader" accentColor={THEME_COLORS.gold}>
            <button className="w-full text-xs bg-yellow-600/30 hover:bg-yellow-600/40 text-yellow-300 py-2.5 px-3 rounded-lg transition-colors mb-2">
                <Icon name="fas fa-lock" className="mr-1.5" />Token-Curated Knowledge Base (Stake LIB)
            </button>
            <GemProgressTracker label="Creator Masterclass Progress" progress={60} />
            <GemProgressTracker label="DAO Governance Tutorial" progress={30} />
             <div className="mt-3 p-3 bg-black/30 rounded-lg text-xs text-center text-gray-400 italic">
                <Icon name="fas fa-vr-cardboard" className="text-3xl text-yellow-500 opacity-50 mb-1"/>
                (Holographic FAQ Explorer with spatial navigation coming soon)
            </div>
        </HelpPanel>

        {/* Crisis Resolution Center */}
        <HelpPanel title="Crisis Resolution Center" iconName="fas fa-shield-alt" accentColor={THEME_COLORS.success}>
             <button className="w-full text-xs bg-green-500/20 hover:bg-green-500/30 text-green-300 py-2.5 px-3 rounded-lg transition-colors"><Icon name="fas fa-search" className="mr-1.5" />Smart Contract Vulnerability Scanner</button>
             <button className="w-full text-xs bg-green-500/20 hover:bg-green-500/30 text-green-300 py-2.5 px-3 rounded-lg transition-colors mt-2"><Icon name="fas fa-undo" className="mr-1.5" />Fund Recovery Wizard (Beta)</button>
             <button className="w-full text-xs bg-green-500/20 hover:bg-green-500/30 text-green-300 py-2.5 px-3 rounded-lg transition-colors mt-2"><Icon name="fas fa-gavel" className="mr-1.5" />Dispute Escalation Dashboard</button>
        </HelpPanel>
      </div>
       <p className="text-center text-xs text-gray-500 mt-10">
            <Icon name="fas fa-info-circle" className="mr-1" /> Our help ecosystem is continuously learning and evolving. Gem-encrusted progress trackers provide visual feedback on learning paths.
        </p>
    </div>
  );
};

export default HelpPage;
