
import React, { useState } from 'react';
import Icon from '../../components/Icon';
import { THEME_COLORS } from '../../constants';

interface SettingPanelProps {
  title: string;
  iconName: string;
  children: React.ReactNode;
  accentColor?: string;
}

const SettingPanel: React.FC<SettingPanelProps> = ({ title, iconName, children, accentColor = THEME_COLORS.platinum }) => (
  <div 
    className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/20 transition-all duration-300 hover:shadow-[0_0_30px_rgba(229,228,226,0.3)] h-full flex flex-col"
    style={{borderColor: `${accentColor}40`}}
  >
    <div className="flex items-center mb-4">
      <Icon name={iconName} className={`text-2xl mr-3 p-2 rounded-lg bg-white/5 text-[${accentColor}]`} />
      <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-white">{title}</h3>
    </div>
    <div className="flex-grow space-y-4">{children}</div>
  </div>
);

const ToggleSwitch: React.FC<{ label: string; enabled: boolean; onToggle: () => void }> = ({ label, enabled, onToggle }) => (
    <div className="flex items-center justify-between py-2">
        <span className="text-sm text-gray-300">{label}</span>
        <button 
            onClick={onToggle} 
            className={`w-12 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none shadow-inner ${enabled ? 'bg-gradient-to-r from-teal-400 to-cyan-500' : 'bg-gray-600'}`}
            style={{borderColor: THEME_COLORS.platinum, borderWidth: enabled ? '0px' : '1px'}}
        >
            <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${enabled ? 'translate-x-6' : 'translate-x-0'}`}></div>
        </button>
    </div>
);


const SettingsPage: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState<'dark' | 'light' | 'holographic'>('dark');
  const [hapticFeedback, setHapticFeedback] = useState(true);
  const [spatialAudio, setSpatialAudio] = useState(true);

  return (
    <div className="p-4 sm:p-6 text-white min-h-screen">
       <div 
        className="mb-8 p-6 rounded-2xl shadow-xl border"
        style={{
            background: `linear-gradient(135deg, ${THEME_COLORS.dark} 10%, ${THEME_COLORS.holoPurple} 100%)`,
            borderColor: THEME_COLORS.platinum,
        }}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-platinum to-gray-300">
            <Icon name="fas fa-cogs" className="mr-3" />Enterprise-Grade Settings Cockpit
        </h2>
        <p className="text-center text-gray-300 mt-2 text-sm">Full control over your NoCensor TV account, blockchain interactions, and platform experience.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Blockchain Account Manager */}
        <SettingPanel title="Blockchain Account Manager" iconName="fas fa-wallet" accentColor={THEME_COLORS.primary}>
            <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-300">Connected Wallets:</h4>
                <ul className="text-xs space-y-1.5 pl-2">
                    <li className="flex items-center justify-between p-2 bg-white/5 rounded-md"><Icon name="fab fa-ethereum" className="text-purple-400 mr-2" /> 0x123...abc <span className="text-green-400 text-[10px]">Primary</span></li>
                    <li className="flex items-center p-2 bg-white/5 rounded-md"><Icon name="fab fa-bitcoin" className="text-orange-400 mr-2" /> bc1q...xyz</li>
                </ul>
                <button className="w-full text-xs bg-purple-500/30 hover:bg-purple-500/40 text-purple-300 py-2 px-3 rounded-lg transition-colors"><Icon name="fas fa-plus-circle" className="mr-1.5" />Connect New Wallet</button>
            </div>
            <div>
                <h4 className="text-sm font-semibold text-gray-300 mt-3">Cross-Chain Balance Overview:</h4>
                <div className="p-3 bg-white/5 rounded-md text-xs text-gray-400 italic text-center">
                    (Cross-chain balance aggregation service coming soon)
                </div>
            </div>
             <div>
                <h4 className="text-sm font-semibold text-gray-300 mt-3">Hardware Wallet Integration:</h4>
                 <button className="w-full text-xs bg-gray-500/30 hover:bg-gray-500/40 text-gray-300 py-2 px-3 rounded-lg transition-colors"><Icon name="fas fa-hdd" className="mr-1.5" />Launch Hardware Wallet Wizard</button>
            </div>
            <div className="text-center mt-4">
                <Icon name="fas fa-shield-alt" className="text-4xl text-platinum opacity-50 animate-pulse" title="Animated Security Shield Concept"/>
                <p className="text-xs text-gray-500">Account Protection Active</p>
            </div>
        </SettingPanel>

        {/* Monetization Configurator */}
        <SettingPanel title="Monetization Configurator" iconName="fas fa-dollar-sign" accentColor={THEME_COLORS.success}>
            <div className="space-y-3">
                 <button className="w-full text-xs bg-green-500/20 hover:bg-green-500/30 text-green-300 py-2.5 px-3 rounded-lg transition-colors"><Icon name="fas fa-sliders-h" className="mr-1.5" />Dynamic Pricing Optimizer</button>
                 <button className="w-full text-xs bg-green-500/20 hover:bg-green-500/30 text-green-300 py-2.5 px-3 rounded-lg transition-colors"><Icon name="fas fa-sitemap" className="mr-1.5" />Royalty Split Automation Designer</button>
                 <button className="w-full text-xs bg-green-500/20 hover:bg-green-500/30 text-green-300 py-2.5 px-3 rounded-lg transition-colors"><Icon name="fas fa-gem" className="mr-1.5" />NFT-Gating Rule Engine</button>
            </div>
            <div className="mt-4 p-3 bg-black/20 rounded-lg text-xs text-gray-400">
                <p>Configure advanced monetization strategies, define custom royalty splits for collaborations, and set sophisticated rules for accessing your token-gated content and NFTs.</p>
            </div>
        </SettingPanel>

        {/* Experience Personalizer */}
        <SettingPanel title="Experience Personalizer" iconName="fas fa-paint-brush" accentColor={THEME_COLORS.secondary}>
            <div className="space-y-1">
                <h4 className="text-sm font-semibold text-gray-300 mb-1">UI Theme Studio:</h4>
                <div className="flex gap-2 mb-3">
                    {['dark', 'light', 'holographic'].map((theme) => (
                        <button 
                            key={theme}
                            onClick={() => setCurrentTheme(theme as any)}
                            className={`flex-1 text-xs py-2 rounded-md transition-all ${currentTheme === theme ? 'bg-pink-500 text-white shadow-lg' : 'bg-white/10 hover:bg-white/20 text-gray-300'}`}
                        >
                            {theme.charAt(0).toUpperCase() + theme.slice(1)}
                        </button>
                    ))}
                </div>
                <div className="h-24 bg-black/30 rounded-lg border border-white/10 p-2 text-center flex items-center justify-center">
                    <p className="text-xs text-gray-400 italic">Live Preview Area (Theme: {currentTheme})</p>
                </div>
            </div>
             <ToggleSwitch label="Haptic Feedback" enabled={hapticFeedback} onToggle={() => setHapticFeedback(!hapticFeedback)} />
             <input type="range" title="Haptic Intensity" className="w-full accent-pink-500 h-1 my-0.5" disabled={!hapticFeedback} />
             
             <ToggleSwitch label="Spatial Audio Preferences" enabled={spatialAudio} onToggle={() => setSpatialAudio(!spatialAudio)} />
             <select className="w-full bg-white/5 text-white py-1.5 px-2 rounded-md border border-white/20 text-xs backdrop-blur-sm mt-1 text-gray-400" disabled={!spatialAudio}>
                <option>Surround (Default)</option>
                <option>Stereo Enhanced</option>
             </select>
        </SettingPanel>
      </div>
      <p className="text-center text-xs text-gray-500 mt-10">
            <Icon name="fas fa-info-circle" className="mr-1" /> Settings are stored locally and/or on-chain where applicable. Platinum toggle switches feature micro-interactions (conceptual).
        </p>
    </div>
  );
};

export default SettingsPage;
