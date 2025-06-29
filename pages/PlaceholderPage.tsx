
import React from 'react';
import { useLocation } from 'react-router-dom';

const PlaceholderPage: React.FC = () => {
  const location = useLocation();
  const pageName = location.pathname === '/' ? 'Home' : location.pathname.substring(1).replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold text-[#f5f5f5] mb-4">Welcome to {pageName}</h1>
      <p className="text-lg text-gray-400">This page is under construction.</p>
      <img src="https://picsum.photos/seed/placeholder/600/400" alt="Under Construction" className="mt-8 rounded-lg shadow-lg mx-auto" />
    </div>
  );
};

export default PlaceholderPage;
