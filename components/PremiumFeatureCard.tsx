import React, { useState } from 'react';
import Icon from './Icon';
import { Feature } from '../types';

interface PremiumFeatureCardProps {
  feature: Feature;
  index: number;
}

const PremiumFeatureCard: React.FC<PremiumFeatureCardProps> = ({ feature, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200);
  };

  // Animation delay based on index for staggered entrance
  const animationDelay = `${index * 100}ms`;

  return (
    <div 
      className={`
        relative group cursor-pointer transform transition-all duration-500 ease-out
        hover:scale-105 hover:-translate-y-2
        ${isClicked ? 'scale-95' : ''}
      `}
      style={{ animationDelay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      {/* Main Card */}
      <div className={`
        relative overflow-hidden rounded-2xl p-6 h-full
        bg-gradient-to-br ${feature.gradient || 'from-purple-600 to-pink-600'}
        shadow-xl group-hover:shadow-2xl
        border border-white/10 group-hover:border-white/20
        backdrop-blur-sm
      `}>
        
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className={`
            absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent
            transform -skew-x-12 transition-transform duration-1000
            ${isHovered ? 'translate-x-full' : '-translate-x-full'}
          `} />
        </div>

        {/* Floating Particles Effect */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className={`
                absolute w-1 h-1 bg-white/30 rounded-full
                transition-all duration-1000 ease-out
                ${isHovered ? 'animate-pulse' : ''}
              `}
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + i * 12}%`,
                animationDelay: `${i * 200}ms`,
                transform: isHovered ? `translateY(-${i * 5}px)` : 'translateY(0)'
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className={`
              w-14 h-14 rounded-xl flex items-center justify-center
              bg-white/20 backdrop-blur-sm border border-white/30
              transition-all duration-300 group-hover:scale-110 group-hover:rotate-6
            `}>
              <Icon 
                name={feature.icon} 
                className="text-2xl text-white drop-shadow-lg" 
              />
            </div>
            
            {/* Highlight Badge */}
            {feature.highlight && (
              <div className={`
                px-3 py-1 rounded-full text-xs font-bold
                bg-white/20 text-white border border-white/30
                backdrop-blur-sm animate-pulse
              `}>
                {feature.highlight}
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-3 leading-tight">
            {feature.title}
          </h3>

          {/* Description */}
          <p className="text-white/90 text-sm leading-relaxed mb-4 line-clamp-3">
            {feature.description}
          </p>

          {/* Stats & Badge Row */}
          <div className="flex items-center justify-between">
            {/* Stats */}
            {feature.stats && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white/80 text-sm font-medium">
                  {feature.stats}
                </span>
              </div>
            )}

            {/* Badge */}
            <div className={`
              px-3 py-1 rounded-full text-xs font-medium
              bg-white/10 text-white/90 border border-white/20
              backdrop-blur-sm transition-all duration-300
              group-hover:bg-white/20 group-hover:scale-105
            `}>
              {feature.badge}
            </div>
          </div>

          {/* Interactive Elements */}
          <div className={`
            mt-4 flex items-center justify-between
            transition-all duration-300 transform
            ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
          `}>
            <div className="flex space-x-2">
              {/* Action Buttons */}
              <button className={`
                w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm
                flex items-center justify-center text-white/80
                hover:bg-white/30 hover:scale-110 transition-all duration-200
              `}>
                <Icon name="fas fa-arrow-right" className="text-xs" />
              </button>
              
              <button className={`
                w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm
                flex items-center justify-center text-white/80
                hover:bg-white/30 hover:scale-110 transition-all duration-200
              `}>
                <Icon name="fas fa-info-circle" className="text-xs" />
              </button>
            </div>

            {/* Progress Indicator */}
            <div className="flex space-x-1">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`
                    w-1 h-1 rounded-full bg-white/40
                    transition-all duration-300
                    ${i <= index % 4 ? 'bg-white/80 scale-125' : ''}
                  `}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Glow Effect */}
        <div className={`
          absolute inset-0 rounded-2xl
          bg-gradient-to-br ${feature.gradient || 'from-purple-600 to-pink-600'}
          opacity-0 group-hover:opacity-20 transition-opacity duration-500
          blur-xl transform scale-110
        `} />
      </div>

      {/* Enhanced Shadow */}
      <div className={`
        absolute inset-0 rounded-2xl
        bg-gradient-to-br ${feature.gradient || 'from-purple-600 to-pink-600'}
        opacity-20 blur-2xl transform scale-95 -z-10
        transition-all duration-500 group-hover:scale-105 group-hover:opacity-30
      `} />
    </div>
  );
};

export default PremiumFeatureCard;