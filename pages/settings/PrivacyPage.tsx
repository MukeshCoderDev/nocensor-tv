
import React, { useState } from 'react';
import Icon from '../../components/Icon';
import { THEME_COLORS } from '../../constants';

interface PrivacyPanelProps {
  title: string;
  iconName: string;
  children: React.ReactNode;
  accentColor?: string;
}

const PrivacyPanel: React.FC<PrivacyPanelProps> = ({ title, iconName, children, accentColor = THEME_COLORS.cyan }) => (
  <div 
    className="bg-black/40 backdrop-blur-2xl p-6 rounded-2xl shadow-2xl border border-white/10 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,200,220,0.4)] h-full flex flex-col"
    style={{borderColor: `${accentColor}50`}}
  >
    <div className="flex items-center mb-4">
      <Icon name={iconName} className={`text-3xl mr-3 p-2 rounded-lg bg-white/5 text-[${accentColor}]`} />
      <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-blue-300">{title}</h3>
    </div>
    <div className="flex-grow space-y-4">{children}</div>
  </div>
);

const PrivacyPage: React.FC = () => {
  const [anonymityScore, setAnonymityScore] = useState(85); // Mock score

  return (
    <div className="p-4 sm:p-6 text-white min-h-screen">
       <div 
        className="mb-8 p-6 rounded-2xl shadow-xl border relative overflow-hidden"
        style={{
            background: `linear-gradient(135deg, ${THEME_COLORS.darker} 30%, ${THEME_COLORS.holoBlue} 110%)`, 
            borderColor: THEME_COLORS.cyan,
        }}
      >
        <Icon name="fas fa-user-secret" className="absolute -top-5 -left-5 text-8xl text-cyan-500 opacity-10 blur-sm" />
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-cyan-300 to-sky-400 relative z-10">
            <Icon name="fas fa-shield-virus" className="mr-3" />Zero-Knowledge Privacy Control Center
        </h2>
        <p className="text-center text-gray-300 mt-2 text-sm relative z-10">Empowering you with sovereign control over your data and on-chain identity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* ZK-Proof Configuration Dashboard */}
        <PrivacyPanel title="ZK-Proof Configuration" iconName="fas fa-project-diagram" accentColor={THEME_COLORS.primary}>
            <button className="w-full text-xs bg-purple-500/30 hover:bg-purple-500/40 text-purple-300 py-2.5 px-3 rounded-lg transition-colors"><Icon name="fas fa-magic" className="mr-1.5" />Interactive Circuit Designer</button>
            <div className="p-3 bg-black/30 rounded-lg text-xs">
                <p className="text-gray-400">Gas Cost Simulator: <span className="text-purple-300 font-semibold">0.002 ETH</span> (for current privacy level)</p>
                <input type="range" title="Privacy Level" className="w-full accent-purple-500 h-1 my-1" defaultValue="3" min="1" max="5"/>
            </div>
            <div className="p-3 bg-black/30 rounded-lg text-xs text-center">
                 <p className="text-gray-300">Anonymity Score Tracker:</p>
                 <p className="text-3xl font-bold text-purple-400 my-1">{anonymityScore}%</p>
                 <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div className="bg-purple-500 h-2.5 rounded-full" style={{width: `${anonymityScore}%`}}></div>
                </div>
            </div>
        </PrivacyPanel>

        {/* Data Control Matrix */}
        <PrivacyPanel title="Data Control Matrix" iconName="fas fa-database" accentColor={THEME_COLORS.warning}>
            <div className="p-3 bg-black/30 rounded-lg text-xs text-center text-gray-400 italic">
                 <Icon name="fas fa-hand-paper" className="text-3xl text-yellow-500 opacity-50 mb-2"/>
                (Drag-and-drop data sharing permissions interface coming soon)
            </div>
             <button className="w-full text-xs bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 py-2.5 px-3 rounded-lg transition-colors"><Icon name="fas fa-user-slash" className="mr-1.5" />Third-Party Access Revocation</button>
            <div className="p-3 bg-black/30 rounded-lg text-xs text-center text-gray-400 italic">
                <Icon name="fas fa-binoculars" className="text-3xl text-yellow-500 opacity-50 mb-2"/>
                (On-chain data footprint visualizer with diamond-encrypted flow diagrams coming soon)
            </div>
        </PrivacyPanel>

        {/* Incognito Mode Suite */}
        <PrivacyPanel title="Incognito Mode Suite" iconName="fas fa-mask" accentColor={THEME_COLORS.teal}>
             <button className="w-full text-xs bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 py-2.5 px-3 rounded-lg transition-colors"><Icon name="fas fa-wallet" className="mr-1.5" />Temporary Wallet Address Generator</button>
             <button className="w-full text-xs bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 py-2.5 px-3 rounded-lg transition-colors mt-2"><Icon name="fas fa-history" className="mr-1.5" />Private Session History (Auto-Delete)</button>
             <button className="w-full text-xs bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 py-2.5 px-3 rounded-lg transition-colors mt-2"><Icon name="fas fa-shipping-fast" className="mr-1.5" />Decoy Transaction Creator</button>
             <div className="text-center mt-4">
                <button className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all text-sm">
                    <Icon name="fas fa-shield-alt" className="mr-2 animate-pulse"/> Activate Holographic Privacy Shield
                </button>
                <p className="text-xs text-gray-500 mt-1">(Conceptual Animation)</p>
            </div>
        </PrivacyPanel>
      </div>
       <p className="text-center text-xs text-gray-500 mt-10">
            <Icon name="fas fa-exclamation-triangle" className="mr-1 text-yellow-500" /> Real-time anonymity meter with threat indicators will be displayed in the header when active. Use privacy tools responsibly.
        </p>
    </div>
  );
};

export default PrivacyPage;
