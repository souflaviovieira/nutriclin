import React, { useState } from 'react';
import { Plus, X, UserPlus, Calendar, Sparkles } from 'lucide-react';

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
              className="flex items-center gap-3 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Label */}
              <span className="px-4 py-2 bg-slate-warm-800 text-white text-xs font-bold rounded-xl shadow-soft-lg whitespace-nowrap">
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
                  shadow-soft-lg transition-all duration-300 
                  active:scale-95 hover:scale-105
                  ${action.color || 'bg-white text-coral-500 border border-coral-100'}
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
          className="fixed inset-0 bg-slate-warm-900/10 backdrop-blur-sm -z-10 animate-fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main FAB - Coral Gradient */}
      <button
        onClick={handleMainClick}
        className={`
          w-14 h-14 rounded-full flex items-center justify-center
          transition-all duration-300
          active:scale-95 hover:scale-105
          ${isOpen 
            ? 'bg-slate-warm-800 rotate-45 shadow-soft-xl' 
            : 'bg-gradient-to-br from-coral-400 to-coral-500 shadow-[0_8px_24px_rgba(224,123,94,0.35)] hover:shadow-[0_12px_32px_rgba(224,123,94,0.45)]'
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
