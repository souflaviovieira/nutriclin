
import React, { useState } from 'react';
import { NAV_ITEMS } from '../constants';
import { LogOut, Apple, ChevronLeft, ChevronRight, User as UserIcon, Settings } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { supabase } from '../services/supabaseClient';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean; // Mobile toggle
  toggleSidebar: () => void;
  isCollapsed: boolean; // Desktop collapse
  toggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  toggleSidebar,
  isCollapsed,
  toggleCollapse
}) => {
  const { profile } = useUser();
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Group items by a categorization logic if available, or just render list for now.
  // We'll treat them as a flat list but with visual spacing if needed.

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[45] lg:hidden animate-in fade-in duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out
          border-r border-slate-200/50 shadow-2xl lg:shadow-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-64 bg-nutri-secondary/98 backdrop-blur-3xl lg:bg-nutri-secondary lg:backdrop-blur-none
        `}
      >
        <div className="flex flex-col h-full overflow-hidden">

          {/* Header */}
          <div className={`
             flex items-center justify-between transition-all duration-300
             ${isCollapsed ? 'p-4 justify-center' : 'p-6 pb-2'}
          `}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="bg-nutri-blue p-2.5 rounded-xl text-white shrink-0">
                <Apple size={24} fill="white" />
              </div>
              <div className={`
                  flex flex-col transition-all duration-300 origin-left
                  ${isCollapsed ? 'opacity-0 w-0 scale-95' : 'opacity-100 w-auto scale-100'}
                `}>
                <span className="text-xl font-bold text-slate-800 tracking-tighter uppercase leading-none">NutriClin</span>
                <span className="text-[9px] font-bold text-nutri-blue uppercase tracking-[0.2em]">Pro System</span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-600 bg-slate-200/50 rounded-full hover:bg-slate-200 transition-all">
              <ChevronLeft size={20} />
            </button>
          </div>

          {/* Desktop Collapse Toggle (Absolute, floating on border) */}
          <button
            onClick={toggleCollapse}
            className={`
               hidden lg:flex absolute -right-3 top-9 z-50 w-6 h-6 bg-white border border-slate-100 rounded-full 
               items-center justify-center text-slate-400 hover:text-nutri-blue hover:border-nutri-blue hover:shadow-md transition-all
             `}
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>

          {/* Navigation */}
          <nav className="flex-1 py-4 space-y-6 overflow-y-auto overflow-x-hidden no-scrollbar px-3">
            {NAV_ITEMS.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-1.5">
                {!isCollapsed && group.title && (
                  <p className="text-[10px] font-black text-slate-warm-500 uppercase tracking-[0.2em] px-4 mb-2 animate-in fade-in duration-500">
                    {group.title}
                  </p>
                )}
                {group.items.map((item) => {
                  const isActive = activeTab === item.id;

                  return (
                    <div key={item.id} className="relative group/item">
                      <button
                        onClick={() => {
                          setActiveTab(item.id);
                          if (window.innerWidth < 1024) toggleSidebar();
                        }}
                        onMouseEnter={() => setHoveredItem(item.id)}
                        onMouseLeave={() => setHoveredItem(null)}
                        className={`
                           w-full flex items-center gap-3.5 relative transition-all duration-200 group
                           ${isCollapsed ? 'justify-center px-0 py-3 rounded-2xl' : 'px-4 py-3 rounded-xl'}
                           ${isActive
                            ? 'bg-coral-100/50 text-coral-600 shadow-sm'
                            : 'text-slate-warm-700 hover:bg-white/60 hover:text-slate-warm-900'}
                         `}
                      >
                        {/* Active Indicator Line for Collapsed Mode (Optional) */}
                        {isCollapsed && isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-nutri-blue rounded-r-full"></div>
                        )}

                        <div className={`
                           relative z-10 transition-colors duration-200
                           ${isActive ? 'text-coral-600' : 'text-slate-warm-500 group-hover:text-coral-500'}
                         `}>
                          {item.icon}
                        </div>

                        {/* Label - visible only when expanded */}
                        <span
                          className={`
                             text-[13px] font-bold tracking-tight whitespace-nowrap transition-all duration-300 origin-left
                             ${isCollapsed ? 'opacity-0 w-0 translate-x-4 overflow-hidden' : 'opacity-100 w-auto translate-x-0'}
                             ${isActive ? 'text-coral-700' : 'text-slate-warm-800'}
                           `}
                        >
                          {item.label}
                        </span>

                        {/* Right Active Dot (Expanded only) */}
                        {!isCollapsed && isActive && (
                          <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-coral-500 shadow-sm animate-pulse"></div>
                        )}
                      </button>

                      {/* Tooltip for Collapsed Mode */}
                      {isCollapsed && hoveredItem === item.id && (
                        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xl whitespace-nowrap z-[60] animate-in fade-in slide-in-from-left-2 duration-200 pointer-events-none">
                          {item.label}
                          {/* Little arrow */}
                          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 -z-10"></div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </nav>

          {/* Footer / Settings Link */}
          <div className={`mt-auto border-t border-slate-50 transition-all duration-300 ${isCollapsed ? 'p-3' : 'p-4'}`}>
            <button
              onClick={() => {
                setActiveTab('settings');
                if (window.innerWidth < 1024) toggleSidebar();
              }}
              onMouseEnter={() => setHoveredItem('settings')}
              onMouseLeave={() => setHoveredItem(null)}
              className={`
                 w-full flex items-center gap-3.5 relative transition-all duration-200 group
                 ${isCollapsed ? 'justify-center p-3 rounded-2xl' : 'px-4 py-3.5 rounded-xl'}
                  ${activeTab === 'settings'
                  ? 'bg-coral-100/50 text-coral-600 shadow-sm'
                  : 'text-slate-warm-700 hover:bg-white/60 hover:text-slate-warm-900'}
               `}
            >
              {isCollapsed && activeTab === 'settings' && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-nutri-blue rounded-r-full"></div>
              )}
              <div className={`
                 relative z-10 transition-colors duration-200
                 ${activeTab === 'settings' ? 'text-coral-600' : 'text-slate-warm-500 group-hover:text-coral-500'}
               `}>
                <Settings size={20} />
              </div>
              <span
                className={`
                    text-[13px] font-bold tracking-tight whitespace-nowrap transition-all duration-300 origin-left
                    ${isCollapsed ? 'opacity-0 w-0 translate-x-4 overflow-hidden' : 'opacity-100 w-auto translate-x-0'}
                    ${activeTab === 'settings' ? 'text-coral-700' : 'text-slate-warm-800'}
                  `}
              >
                Configurações
              </span>
            </button>

            {/* Tooltip for Settings in Collapsed Mode */}
            {isCollapsed && hoveredItem === 'settings' && (
              <div className="absolute left-full bottom-8 ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xl whitespace-nowrap z-[60] animate-in fade-in slide-in-from-left-2 duration-200 pointer-events-none">
                Configurações
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-slate-800 rotate-45 -z-10"></div>
              </div>
            )}

            {/* Logout Button */}
            {!isCollapsed && (
              <button
                onClick={() => supabase.auth.signOut()}
                className="w-full mt-2 flex items-center justify-center gap-2 p-2 text-slate-400 hover:text-coral-500 hover:bg-coral-50 rounded-xl transition-all text-[10px] font-black uppercase tracking-widest"
              >
                <LogOut size={14} /> Sair
              </button>
            )}
          </div>

        </div>
      </aside >
    </>
  );
};

export default Sidebar;