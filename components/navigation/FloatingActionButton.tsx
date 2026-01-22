import React, { useState } from 'react';
import { Plus, X, UserPlus, Calendar, FileText, Sparkles } from 'lucide-react';

interface FABAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  color?: string;
}

interface FloatingActionButtonProps {
  actions?: FABAction[];
  onMainClick?: () => void;
  showSpeedDial?: boolean;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ 
  actions = [],
  onMainClick,
  showSpeedDial = true
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMainClick = () => {
    if (showSpeedDial && actions.length > 0) {
      setIsOpen(!isOpen);
    } else if (onMainClick) {
      onMainClick();
    }
  };

  return (
    <div className="fixed bottom-24 right-4 z-40 lg:bottom-8 lg:right-8">
      {/* Speed Dial Actions */}
      {showSpeedDial && isOpen && (
        <div className="absolute bottom-16 right-0 flex flex-col-reverse gap-3 mb-2">
          {actions.map((action, index) => (
            <div 
              key={action.id}
              className="flex items-center gap-3 animate-in slide-in-from-bottom-2 fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Label */}
              <span className="px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-lg shadow-lg whitespace-nowrap">
                {action.label}
              </span>
              
              {/* Mini FAB */}
              <button
                onClick={() => {
                  action.onClick();
                  setIsOpen(false);
                }}
                className={`
                  w-12 h-12 rounded-full flex items-center justify-center
                  shadow-lg shadow-slate-900/20 transition-all duration-200
                  active:scale-95 hover:scale-105
                  ${action.color || 'bg-white text-nutri-blue'}
                `}
              >
                {action.icon}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Backdrop when open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main FAB */}
      <button
        onClick={handleMainClick}
        className={`
          w-14 h-14 rounded-full flex items-center justify-center
          shadow-xl shadow-nutri-blue/30 transition-all duration-300
          active:scale-95 hover:scale-105 hover:shadow-2xl hover:shadow-nutri-blue/40
          ${isOpen 
            ? 'bg-slate-800 rotate-45' 
            : 'bg-nutri-blue'
          }
        `}
      >
        {isOpen ? (
          <X size={24} className="text-white" strokeWidth={2.5} />
        ) : (
          <Plus size={24} className="text-white" strokeWidth={2.5} />
        )}
      </button>
    </div>
  );
};

export default FloatingActionButton;
