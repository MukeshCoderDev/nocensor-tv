
import React from 'react';
import { NavLink } from 'react-router-dom';
import { MenuSection, MenuItem as MenuItemType } from '../types';
import Icon from './Icon';
import { THEME_COLORS } from '../constants';

interface SidebarProps {
  menu: MenuSection[];
  isExpanded: boolean;
  isMobileOpen: boolean;
  onCloseMobileSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ menu, isExpanded, isMobileOpen, onCloseMobileSidebar }) => {
  const sidebarWidthClass = isExpanded ? 'w-[240px]' : 'w-[80px]';
  
  const MenuItem: React.FC<{ item: MenuItemType; isExpanded: boolean; onClick?: () => void }> = ({ item, isExpanded, onClick }) => (
    <li>
      <NavLink
        to={item.path}
        onClick={onClick}
        className={({ isActive }) =>
          `flex items-center gap-4 px-6 py-3 cursor-pointer transition-all duration-300 hover:bg-[rgba(138,43,226,0.1)] text-[#f5f5f5]
          ${isExpanded ? '' : 'justify-center'}
          ${isActive ? 'bg-[rgba(138,43,226,0.1)] border-l-4 border-[#8a2be2]' : 'border-l-4 border-transparent'}`
        }
      >
        <Icon name={item.icon} className="w-6 text-center text-lg" />
        {isExpanded && <span className="text-sm">{item.label}</span>}
      </NavLink>
    </li>
  );

  const sidebarContent = (onClickItem?: () => void) => (
    <div className="py-4 h-full overflow-y-auto">
      {menu.map((section, index) => (
        <div key={index} className="mb-6">
          {section.title && isExpanded && (
            <div className="px-6 py-2 text-xs text-[#888] uppercase tracking-wider">
              {section.title}
            </div>
          )}
          <ul className="list-none">
            {section.items.map((item) => (
              <MenuItem key={item.id} item={item} isExpanded={isExpanded} onClick={onClickItem} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:block fixed top-[60px] left-0 h-[calc(100vh-60px)] bg-[rgba(10,10,10,0.95)] z-[90] transition-all duration-300 ease-in-out ${sidebarWidthClass}`}>
        {sidebarContent()}
      </aside>

      {/* Mobile Sidebar */}
      {isMobileOpen && (
         <div className="lg:hidden fixed inset-0 bg-black/50 z-[98]" onClick={onCloseMobileSidebar}></div>
      )}
      <aside className={`lg:hidden fixed top-[60px] left-0 h-[calc(100vh-60px)] w-[240px] bg-[rgba(10,10,10,0.95)] z-[99] transition-transform duration-300 ease-in-out transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* For mobile, sidebar is always "expanded" in terms of content visibility */}
        {React.cloneElement(sidebarContent(onCloseMobileSidebar), {isExpanded: true})}
      </aside>
    </>
  );
};

export default Sidebar;

