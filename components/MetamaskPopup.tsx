
import React from 'react';
import Icon from './Icon';
import Modal from './Modal';
import { THEME_COLORS } from '../constants';

interface MetamaskPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
}

const MetamaskPopup: React.FC<MetamaskPopupProps> = ({ isOpen, onClose, onConnect }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="w-full max-w-sm" showCloseButton={false}>
      <div className="text-center">
        <div className="bg-[#6a0dad] py-6">
            <Icon name="fab fa-ethereum" className="text-[48px] text-[#f6851b] mb-4 mx-auto" />
            <h2 className="text-2xl font-semibold text-white">Connect Wallet</h2>
        </div>
        <div className="p-6">
            <p className="mb-6 text-center text-gray-300">
            Connect your wallet to access all features and make transactions.
            </p>
            <div className="flex gap-4">
            <button
                onClick={onClose}
                className="flex-1 py-3 px-4 border-none rounded-lg font-semibold cursor-pointer bg-[#2a2a2a] text-[#f5f5f5] hover:bg-[#3f3f3f] transition-colors"
            >
                Cancel
            </button>
            <button
                onClick={onConnect}
                className="flex-1 py-3 px-4 border-none rounded-lg font-semibold cursor-pointer bg-[#f6851b] text-white hover:bg-[#e0700a] transition-colors"
            >
                Connect
            </button>
            </div>
        </div>
      </div>
    </Modal>
  );
};

export default MetamaskPopup;

