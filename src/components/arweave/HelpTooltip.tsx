import React, { useState, useRef, useEffect } from 'react';
import { HelpTooltipProps } from '../../types/ArweaveTypes';

/**
 * Help tooltip component with wallet key guidance and accessibility support
 */
export function HelpTooltip({ 
  content, 
  title, 
  placement = 'top', 
  children,
  className = ''
}: HelpTooltipProps & { className?: string }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Show tooltip when hovered or focused
  const shouldShow = isHovered || isFocused;

  useEffect(() => {
    setIsVisible(shouldShow);
  }, [shouldShow]);

  // Handle click outside to close tooltip
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        tooltipRef.current && 
        triggerRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsHovered(false);
        setIsFocused(false);
      }
    }

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVisible]);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsFocused(false);
      setIsHovered(false);
    }
  };

  const getTooltipPosition = () => {
    switch (placement) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  const getArrowPosition = () => {
    switch (placement) {
      case 'top':
        return 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900';
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-gray-900';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900';
      default:
        return 'top-full left-1/2 transform -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent border-t-gray-900';
    }
  };

  return (
    <div className={`relative inline-block ${className}`}>
      <div
        ref={triggerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-describedby={isVisible ? 'tooltip' : undefined}
        aria-expanded={isVisible}
        className="cursor-help focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 rounded"
      >
        {children}
      </div>

      {isVisible && (
        <div
          ref={tooltipRef}
          id="tooltip"
          role="tooltip"
          className={`absolute z-50 ${getTooltipPosition()}`}
        >
          <div className="bg-gray-900 text-white text-sm rounded-lg shadow-lg max-w-xs w-max">
            <div className="px-3 py-2">
              {title && (
                <div className="font-semibold text-white mb-1">{title}</div>
              )}
              <div className="text-gray-200">{content}</div>
            </div>
          </div>
          
          {/* Arrow */}
          <div
            className={`absolute w-0 h-0 border-4 ${getArrowPosition()}`}
            style={{ borderWidth: '4px' }}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Wallet key help tooltip with specific guidance
 */
export function WalletKeyHelpTooltip({ children, className = '' }: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <HelpTooltip
      title="Arweave Wallet Key"
      content="Select your Arweave wallet key file (.json). This file contains your private key and is used to sign transactions. Keep it secure and never share it with others."
      placement="top"
      className={className}
    >
      {children}
    </HelpTooltip>
  );
}

/**
 * Cost estimation help tooltip
 */
export function CostEstimationHelpTooltip({ children, className = '' }: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <HelpTooltip
      title="Upload Cost"
      content="The cost is calculated based on file size and current network fees. Larger files cost more to store permanently on Arweave. The estimate includes a small buffer for fee fluctuations."
      placement="top"
      className={className}
    >
      {children}
    </HelpTooltip>
  );
}

/**
 * Balance help tooltip
 */
export function BalanceHelpTooltip({ children, className = '' }: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <HelpTooltip
      title="Wallet Balance"
      content="Your current AR token balance. You need sufficient AR tokens to pay for permanent storage on the Arweave network. You can purchase AR tokens from exchanges like Binance or KuCoin."
      placement="top"
      className={className}
    >
      {children}
    </HelpTooltip>
  );
}

/**
 * File format help tooltip
 */
export function FileFormatHelpTooltip({ children, className = '' }: { 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <HelpTooltip
      title="Supported Formats"
      content="Supported video formats: MP4, WebM, OGG, AVI, MOV. Maximum file size is 500MB. For best compatibility, use MP4 format with H.264 video codec."
      placement="top"
      className={className}
    >
      {children}
    </HelpTooltip>
  );
}

/**
 * Help icon component for consistent styling
 */
export function HelpIcon({ className = '' }: { className?: string }) {
  return (
    <svg 
      className={`w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors ${className}`} 
      fill="currentColor" 
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path 
        fillRule="evenodd" 
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" 
        clipRule="evenodd" 
      />
    </svg>
  );
}

/**
 * Expandable help section for detailed guidance
 */
export function ExpandableHelp({ 
  title, 
  children, 
  defaultExpanded = false,
  className = ''
}: {
  title: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  className?: string;
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className={`border border-gray-200 rounded-lg ${className}`}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset rounded-lg transition-colors"
        aria-expanded={isExpanded}
      >
        <span className="font-medium text-gray-900">{title}</span>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${
            isExpanded ? 'transform rotate-180' : ''
          }`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      
      {isExpanded && (
        <div className="px-4 pb-4 text-sm text-gray-700 border-t border-gray-200 pt-3">
          {children}
        </div>
      )}
    </div>
  );
}

/**
 * Quick help guide for the upload process
 */
export function UploadProcessHelp({ className = '' }: { className?: string }) {
  return (
    <ExpandableHelp 
      title="How to Upload to Arweave" 
      className={className}
    >
      <div className="space-y-3">
        <div>
          <h4 className="font-medium text-gray-900 mb-1">Step 1: Choose Your Video</h4>
          <p className="text-gray-600">
            Select a video file from your computer. Supported formats include MP4, WebM, OGG, AVI, and MOV. 
            Maximum file size is 500MB.
          </p>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-1">Step 2: Load Wallet Key</h4>
          <p className="text-gray-600">
            Select your Arweave wallet key file (.json). This file is generated when you create an Arweave wallet. 
            If you don't have one, you can create it using the Arweave web wallet.
          </p>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-900 mb-1">Step 3: Upload Video</h4>
          <p className="text-gray-600">
            Review the upload cost and confirm the transaction. Your video will be permanently stored on the 
            Arweave network and accessible via a unique transaction ID.
          </p>
        </div>
        
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> Uploads to Arweave are permanent and cannot be deleted. Make sure you want 
            to store your content permanently before proceeding.
          </p>
        </div>
      </div>
    </ExpandableHelp>
  );
}