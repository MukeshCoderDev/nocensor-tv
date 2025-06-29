
import React from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import { THEME_COLORS } from '../constants';

interface SectionProps {
  title: string;
  viewAllLink?: string;
  children: React.ReactNode;
  className?: string;
  headerContent?: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, viewAllLink, children, className = '', headerContent }) => {
  return (
    <section className={`mb-12 ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-['Poppins'] text-2xl font-semibold relative pl-4 text-[#f5f5f5]">
          <span className="absolute left-0 top-1/2 transform -translate-y-1/2 h-6 w-1 bg-[#ff6b8b]"></span>
          {title}
        </h2>
        {headerContent}
        {viewAllLink && (
          <Link to={viewAllLink} className="text-[#8a2be2] font-medium flex items-center gap-2 hover:underline">
            View All <Icon name="fas fa-chevron-right" className="text-xs" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
};

export default Section;

