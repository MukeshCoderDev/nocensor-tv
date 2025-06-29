
import React from 'react';
import { Feature } from '../types';
import Icon from './Icon';
import { THEME_COLORS } from '../constants';

interface FeatureCardProps {
  feature: Feature;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ feature }) => {
  return (
    <div className="bg-[rgba(138,43,226,0.1)] border border-[#8a2be2] rounded-[10px] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(138,43,226,0.2)]">
      <Icon name={feature.icon} className="text-3xl text-[#ff6b8b] mb-4" />
      <h3 className="text-lg font-semibold mb-2 text-[#f5f5f5]">{feature.title}</h3>
      <p className="text-[#aaa] text-sm mb-4">{feature.description}</p>
      <span className="bg-[#6a0dad] text-white px-3 py-1 rounded-full text-xs inline-block">{feature.badge}</span>
    </div>
  );
};

export default FeatureCard;

