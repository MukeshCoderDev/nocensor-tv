
import React from 'react';
import { User } from '../types';
import Icon from './Icon';
import { Link } from 'react-router-dom';
import { THEME_COLORS } from '../constants';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
  onConnectWallet: () => void;
  walletConnected: boolean;
  currentUser: User | null;
}

const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar, onConnectWallet, walletConnected, currentUser }) => {
  return (
    <header
      className="fixed top-0 left-0 w-full h-[60px] bg-[rgba(10,10,10,0.95)] flex items-center px-2 sm:px-4 z-[100] border-b border-[#6a0dad]"
    >
      <button
        className="text-[#f5f5f5] text-2xl cursor-pointer mr-4 lg:hidden"
        onClick={onToggleMobileSidebar}
        aria-label="Toggle menu"
      >
        <Icon name="fas fa-bars" />
      </button>
      <Link
        to="/"
        className="flex items-center gap-2.5 font-['Poppins'] font-bold text-2xl text-[#f5f5f5] cursor-pointer"
      >
        <Icon name="fas fa-play-circle" className="text-[#ff6b8b]" />
        <span className="hidden sm:inline">NoCensor TV</span>
      </Link>
      <div
        className="flex-1 max-w-xl mx-4 sm:mx-8 flex"
      >
        <input
          type="text"
          placeholder="Search videos, creators, and NFTs..."
          className="bg-[#121212] border border-[#2a2a2a] px-5 py-3 rounded-l-[30px] w-full text-[#f5f5f5] text-base focus:outline-none focus:border-[#8a2be2]"
        />
        <button
          className="bg-gradient-to-r from-[#8a2be2] to-[#6a0dad] text-white px-6 rounded-r-[30px] cursor-pointer transition-all duration-300 hover:opacity-80"
        >
          <Icon name="fas fa-search" />
        </button>
      </div>
      <div
        className="flex items-center gap-4 ml-auto pr-2"
      >
        <button
          onClick={onConnectWallet}
          className={`text-white border-none px-4 sm:px-6 py-2.5 rounded-[30px] font-semibold cursor-pointer transition-all duration-300 flex items-center gap-2
            ${walletConnected ? 'bg-gradient-to-r from-[#00c853] to-[#00a152]' : 'bg-gradient-to-r from-[#8a2be2] to-[#6a0dad]'}
            hover:shadow-[0_5px_15px_rgba(106,13,173,0.4)] hover:-translate-y-0.5`}
        >
          <Icon name={walletConnected ? "fas fa-check" : "fas fa-wallet"} />
          <span className="hidden sm:inline">{walletConnected ? 'Wallet Connected' : 'Connect Wallet'}</span>
        </button>
        {walletConnected && currentUser && (
          <div
            className="flex items-center gap-2 cursor-pointer"
          >
            <div
              className="w-10 h-10 rounded-full bg-gradient-to-r from-[#8a2be2] to-[#ff6b8b] flex items-center justify-center font-semibold text-white"
            >
              {currentUser.avatarChar}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

