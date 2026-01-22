import React from 'react';
import { Home, Calendar, Users, BookOpen, Settings } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Início', icon: Home },
  { id: 'appointments', label: 'Agenda', icon: Calendar },
  { id: 'patients', label: 'Clientes', icon: Users },
  { id: 'alimentos', label: 'Recursos', icon: BookOpen },
  { id: 'settings', label: 'Config', icon: Settings },
];

const BottomNavigation: React.FC<BottomNavigationProps> = ({ activeTab, onTabChange }) => {
  // Map sub-tabs to main tabs for highlighting
  const getActiveMain = () => {
    if (['dashboard'].includes(activeTab)) return 'dashboard';
    if (['appointments'].includes(activeTab)) return 'appointments';
    if (['patients', 'patient-detail', 'new-patient', 'edit-patient'].includes(activeTab)) return 'patients';
    if (['alimentos', 'alimentos-suplementos', 'receitas-minhas', 'substituicoes', 'modelos-planos', 'modelos-recomendacoes', 'plans-library'].includes(activeTab)) return 'alimentos';
    if (activeTab.startsWith('settings')) return 'settings';
    return activeTab;
  };

  const currentMain = getActiveMain();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      {/* Gradient backdrop blur */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/95 to-white/80 backdrop-blur-xl border-t border-slate-100" />
      
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
                transition-all duration-300 min-w-[64px] relative
                ${isActive 
                  ? 'text-nutri-blue' 
                  : 'text-slate-400 active:scale-95'
                }
              `}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-nutri-blue rounded-full" />
              )}
              
              <div className={`
                p-2 rounded-xl transition-all duration-300
                ${isActive ? 'bg-nutri-blue/10 scale-110' : 'bg-transparent'}
              `}>
                <Icon 
                  size={22} 
                  strokeWidth={isActive ? 2.5 : 2}
                  className="transition-all duration-300"
                />
              </div>
              
              <span className={`
                text-[10px] font-bold tracking-tight transition-all duration-300
                ${isActive ? 'opacity-100' : 'opacity-70'}
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
