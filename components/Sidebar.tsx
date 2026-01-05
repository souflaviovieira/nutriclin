
import React from 'react';
import { NAV_ITEMS } from '../constants';
import { LogOut, Apple, ChevronLeft, Sparkles, User as UserIcon } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, toggleSidebar }) => {
  const { profile } = useUser();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-nutri-text/40 backdrop-blur-sm z-[45] lg:hidden animate-in fade-in duration-300" onClick={toggleSidebar}></div>
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-nutri-secondary transform transition-transform duration-500 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="flex flex-col h-full">
          {/* Header Sidebar */}
          <div className="p-8 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-nutri-blue p-2.5 rounded-2xl text-white shadow-nutri-soft rotate-3">
                <Apple size={24} fill="white" />
              </div>
              <span className="text-2xl font-black text-nutri-text tracking-tighter uppercase italic">NutriClin</span>
            </div>
            <button onClick={toggleSidebar} className="lg:hidden p-2 text-nutri-text-sec hover:text-nutri-text transition-colors">
              <ChevronLeft size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto no-scrollbar">
            <p className="text-[10px] font-black text-nutri-text-dis uppercase tracking-[0.2em] px-4 mb-4">Plataforma</p>
            {NAV_ITEMS.map((item, index) => {
              const isActive = activeTab === item.id;
              const isAi = item.id === 'ai-assistant';

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (window.innerWidth < 1024) toggleSidebar();
                  }}
                  className={`w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl transition-all group relative ${isActive
                      ? 'bg-nutri-main text-nutri-blue shadow-nutri-soft font-bold scale-[1.02]'
                      : 'text-nutri-text-sec hover:bg-nutri-main/50 hover:text-nutri-text border border-transparent'
                    }`}
                >
                  <div className={`${isActive ? 'text-nutri-blue' : 'text-nutri-text-dis group-hover:text-nutri-blue transition-colors'}`}>
                    {item.icon}
                  </div>
                  <span className={`text-sm tracking-tight ${isActive ? 'font-bold' : ''}`}>
                    {item.label}
                  </span>
                  {isAi && !isActive && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-nutri-blue rounded-full shadow-sm"></span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Profile / Logout Footer */}
          <div className="p-6">
            <div className="flex items-center gap-3.5 px-4 py-3 mb-4 bg-nutri-main/60 backdrop-blur-sm rounded-2xl shadow-sm border border-white/40">
              <div className="relative">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} className="w-11 h-11 rounded-xl object-cover ring-2 ring-nutri-blue/20 shadow-sm" alt="Profile" />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-nutri-blue/10 flex items-center justify-center text-nutri-blue ring-2 ring-nutri-blue/20">
                    <UserIcon size={20} />
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-nutri-success border-2 border-white rounded-full"></span>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-black text-nutri-text truncate tracking-tight">{profile?.display_name || 'Usuário'}</span>
                <span className="text-[9px] font-black text-nutri-blue uppercase tracking-widest">{profile?.specialty || 'Profissional'}</span>
              </div>
            </div>
            <button className="w-full flex items-center gap-3.5 px-5 py-3.5 text-nutri-text-sec hover:text-nutri-error hover:bg-red-50 rounded-2xl transition-all group border border-transparent">
              <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-bold">Encerrar Sessão</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;