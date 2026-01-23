import React from 'react';
import { ArrowLeft, Edit2 } from 'lucide-react';

interface BackHeaderProps {
  title: string;
  subtitle?: string;
  onBack: () => void;
  actions?: React.ReactNode;
  showOnDesktop?: boolean;
}

const BackHeader: React.FC<BackHeaderProps> = ({ 
  title, 
  subtitle,
  onBack, 
  actions,
  showOnDesktop = false
}) => {
  return (
    <header className={`
      sticky top-0 z-30 bg-cream-100/80 backdrop-blur-xl border-b border-cream-200
      ${showOnDesktop ? '' : 'lg:hidden'}
    `}>
      <div className="flex items-center justify-between px-4 py-3 min-h-[56px]">
        {/* Left: Back button + Title */}
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            onClick={onBack}
            className="p-2.5 -ml-2 rounded-xl text-slate-warm-500 hover:bg-cream-200 active:scale-95 transition-all"
            aria-label="Voltar"
          >
            <ArrowLeft size={22} strokeWidth={2.5} />
          </button>
          
          <div className="min-w-0">
            <h1 className="text-base font-bold text-slate-warm-800 truncate leading-tight">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-slate-warm-500 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        {actions && (
          <div className="flex items-center gap-2 ml-2">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
};

export default BackHeader;
