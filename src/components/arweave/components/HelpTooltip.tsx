import React, { useState } from 'react';
import Icon from '../../../../components/Icon';

interface HelpTooltipProps {
  content: string;
  title?: string;
  className?: string;
}

const HelpTooltip: React.FC<HelpTooltipProps> = ({
  content,
  title,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className={`help-tooltip relative inline-block ${className}`}>
      <button
        type="button"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="text-gray-400 hover:text-[#8a2be2] transition-colors"
      >
        <Icon name="fas fa-question-circle" className="text-sm" />
      </button>
      
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 bg-[#2a2a2a] border border-gray-600 rounded-lg p-3 shadow-lg z-10">
          {title && (
            <h4 className="text-[#f5f5f5] font-medium mb-2 text-sm">{title}</h4>
          )}
          <p className="text-gray-300 text-xs leading-relaxed">{content}</p>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-600"></div>
        </div>
      )}
    </div>
  );
};

export default HelpTooltip;