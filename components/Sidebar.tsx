
import React, { useState } from 'react';
import { NAV_ITEMS } from '../constants';
import { LogOut, Apple, ChevronLeft, ChevronRight, User as UserIcon } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

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
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-[45] lg:hidden animate-in fade-in duration-300"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-100/80 shadow-[4px_0_24px_-12px_rgba(0,0,0,0.05)]
          flex flex-col transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}
          w-72
        `}
      >
        <div className="flex flex-col h-full overflow-hidden">

          {/* Header */}
          <div className={`
             flex items-center justify-between transition-all duration-300
             ${isCollapsed ? 'p-4 justify-center' : 'p-6 pb-2'}
          `}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="bg-nutri-blue p-2.5 rounded-xl text-white shadow-nutri-soft shrink-0">
                <Apple size={24} fill="white" />
              </div>
              <div className={`
                  flex flex-col transition-all duration-300 origin-left
                  ${isCollapsed ? 'opacity-0 w-0 scale-95' : 'opacity-100 w-auto scale-100'}
                `}>
                <span className="text-xl font-black text-slate-800 tracking-tighter uppercase leading-none">NutriClin</span>
                <span className="text-[9px] font-black text-nutri-blue uppercase tracking-[0.2em]">Pro System</span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-400 hover:text-nutri-blue transition-colors">
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
          <nav className="flex-1 py-8 space-y-2 overflow-y-auto overflow-x-hidden no-scrollbar px-3">
            {!isCollapsed && (
              <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] px-4 mb-3 animate-in fade-in duration-500 delay-100">
                Menu Principal
              </p>
            )}

            {NAV_ITEMS.map((item) => {
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
                       ${isCollapsed ? 'justify-center px-0 py-3 rounded-2xl' : 'px-4 py-3.5 rounded-xl'}
                       ${isActive
                        ? 'bg-nutri-blue/5 text-nutri-blue'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                     `}
                  >
                    {/* Active Indicator Line for Collapsed Mode (Optional) */}
                    {isCollapsed && isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-nutri-blue rounded-r-full"></div>
                    )}

                    <div className={`
                       relative z-10 transition-colors duration-200
                       ${isActive ? 'text-nutri-blue' : 'text-slate-400 group-hover:text-nutri-blue'}
                     `}>
                      {item.icon}
                    </div>

                    {/* Label - visible only when expanded */}
                    <span
                      className={`
                         text-sm font-bold tracking-tight whitespace-nowrap transition-all duration-300 origin-left
                         ${isCollapsed ? 'opacity-0 w-0 translate-x-4 overflow-hidden' : 'opacity-100 w-auto translate-x-0'}
                       `}
                    >
                      {item.label}
                    </span>

                    {/* Right Active Dot (Expanded only) */}
                    {!isCollapsed && isActive && (
                      <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-nutri-blue shadow-sm"></div>
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
          </nav>

          {/* Footer / User Profile */}
          <div className={`mt-auto border-t border-slate-50 transition-all duration-300 ${isCollapsed ? 'p-3' : 'p-5'}`}>
            <div
              className={`
                flex items-center gap-3 transition-all duration-300 relative group cursor-pointer
                ${isCollapsed ? 'justify-center p-2 rounded-xl hover:bg-slate-50' : 'p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-nutri-blue/30'}
              `}
            >
              <div className="relative shrink-0">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} className="w-10 h-10 rounded-xl object-cover ring-2 ring-white shadow-sm" alt="Profile" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-nutri-blue/10 flex items-center justify-center text-nutri-blue">
                    <UserIcon size={20} />
                  </div>
                )}
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
              </div>

              <div className={`
                 flex flex-col min-w-0 transition-all duration-300 overflow-hidden
                 ${isCollapsed ? 'w-0 opacity-0 ml-0' : 'w-auto opacity-100'}
               `}>
                <span className="text-xs font-black text-slate-800 truncate">{profile?.display_name || 'Usuário'}</span>
                <span className="text-[10px] font-bold text-nutri-blue uppercase tracking-wider truncate">Ver Perfil</span>
              </div>

              {/* Collapsed Warning/Tooltip for User */}
              {isCollapsed && (
                <div className="absolute left-full bottom-0 ml-3 px-3 py-2 bg-white border border-slate-100 text-slate-600 text-xs font-bold rounded-xl shadow-xl w-32 z-[60] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
                  <p className="truncate">{profile?.display_name}</p>
                  <p className="text-[9px] text-nutri-blue uppercase">Configurações</p>
                </div>
              )}
            </div>

            {/* Logout Button */}
            {!isCollapsed && (
              <button className="w-full mt-2 flex items-center justify-center gap-2 p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all text-xs font-bold">
                <LogOut size={14} /> Sair
              </button>
            )}
          </div>

        </div>
      </aside>
    </>
  );
};

export default Sidebar;