
import React, { useEffect } from 'react';
import Icon from './Icon';
import { THEME_COLORS } from '../constants';

interface NotificationProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: 'success' | 'error' | 'info';
}

const Notification: React.FC<NotificationProps> = ({ message, isVisible, onClose, type = 'success' }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  let bgColor = 'bg-[#8a2be2]'; // Default to primary/info
  let iconName = 'fas fa-info-circle';

  if (type === 'success') {
    bgColor = 'bg-[#00c853]';
    iconName = 'fas fa-check-circle';
  } else if (type === 'error') {
    bgColor = 'bg-red-600';
    iconName = 'fas fa-exclamation-circle';
  }


  return (
    <div 
      className={`fixed bottom-5 right-5 ${bgColor} text-white px-6 py-4 rounded-[10px] shadow-[0_5px_15px_rgba(0,0,0,0.3)] z-[1000] flex items-center gap-3 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <Icon name={iconName} />
      <span>{message}</span>
    </div>
  );
};

export default Notification;

