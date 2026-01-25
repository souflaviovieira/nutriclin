import React from 'react';
import { Home, Calendar, Users, Sparkles } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Início', icon: Home },
  { id: 'appointments', label: 'Agenda', icon: Calendar },
  { id: 'patients', label: 'Clientes', icon: Users },
  { id: 'ai-assistant', label: 'Nutri AI', icon: Sparkles },
];

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  // Map sub-tabs to main tabs for highlighting
  const getActiveMain = () => {
    if (['dashboard'].includes(activeTab)) return 'dashboard';
    if (['appointments'].includes(activeTab)) return 'appointments';
    if (['patients', 'patient-detail', 'new-patient', 'edit-patient'].includes(activeTab)) return 'patients';
    if (['ai-assistant'].includes(activeTab)) return 'ai-assistant';
    return activeTab;
  };

  const currentMain = getActiveMain();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      {/* Coral Glass Background */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/98 to-white/90 backdrop-blur-xl border-t border-cream-200" />

      {/* Safe area for bottom notch */}
      <div className="relative flex items-center justify-around px-2 pb-safe pt-2">
        {NAV_ITEMS.map((item) => {
          const isActive = currentMain === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`
                flex flex-col items-center justify-center gap-1 py-2 px-4 rounded-2xl
                transition-all duration-300 min-w-[60px] relative
                ${isActive
                  ? 'text-coral-500'
                  : 'text-slate-warm-400 active:scale-95'
                }
              `}
            >
              {/* Active background glow */}
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-b from-coral-100 to-coral-50 rounded-2xl opacity-60" />
              )}

              {/* Active indicator dot */}
              {isActive && (
                <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-1 bg-coral-400 rounded-full animate-scale-in" />
              )}

              <div className={`
                relative z-10 p-2 rounded-xl transition-all duration-300
                ${isActive ? 'scale-110' : 'bg-transparent'}
              `}>
                <Icon
                  size={22}
                  strokeWidth={isActive ? 2.5 : 2}
                  className="transition-all duration-300"
                />
              </div>

              <span className={`
                relative z-10 text-[10px] font-bold tracking-tight transition-all duration-300
                ${isActive ? 'opacity-100' : 'opacity-60'}
              `}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
