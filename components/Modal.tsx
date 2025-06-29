
import React from 'react';
import Icon from './Icon';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
  showCloseButton?: boolean;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title, className = 'w-full max-w-md', showCloseButton = true }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.8)] z-[999] flex items-center justify-center p-4">
      <div className={`bg-[#1e1e1e] rounded-[15px] shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden ${className}`}>
        {title || showCloseButton ? (
          <div className="flex justify-between items-center p-4 sm:p-6 bg-[rgba(10,10,10,0.9)] border-b border-[#2a2a2a]">
            {title && <h3 className="text-xl font-semibold text-[#f5f5f5]">{title}</h3>}
            <div className="flex-grow"></div> {/* Spacer if title is not present but close button is */}
            {showCloseButton && (
              <button onClick={onClose} className="text-[#f5f5f5] text-2xl hover:text-[#ff6b8b] transition-colors">
                <Icon name="fas fa-times" />
              </button>
            )}
          </div>
        ) : null}
        <div className="p-4 sm:p-6 text-[#f5f5f5]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;

