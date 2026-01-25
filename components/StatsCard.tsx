
import React from 'react';
import { Users, DollarSign, Calendar, TrendingUp, CalendarDays, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Metric } from '../types';

const Icons: Record<string, any> = {
  Users,
  DollarSign,
  Calendar,
  CalendarRange: CalendarDays,
  TrendingUp,
};

// Map old colors to new Coral palette
const getIconStyle = (colorClass: string) => {
  if (colorClass.includes('emerald') || colorClass.includes('teal') || colorClass.includes('green')) {
    return 'bg-gradient-to-br from-coral-100 to-coral-50 text-coral-500 border-coral-100';
  }
  if (colorClass.includes('blue') || colorClass.includes('cyan')) {
    return 'bg-gradient-to-br from-cream-200 to-cream-100 text-slate-warm-600 border-cream-200';
  }
  if (colorClass.includes('amber') || colorClass.includes('yellow')) {
    return 'bg-gradient-to-br from-amber-100 to-amber-50 text-amber-600 border-amber-100';
  }
  if (colorClass.includes('purple') || colorClass.includes('violet')) {
    return 'bg-gradient-to-br from-coral-100 to-coral-50 text-coral-500 border-coral-100';
  }
  return 'bg-gradient-to-br from-cream-200 to-cream-100 text-slate-warm-600 border-cream-200';
};

const StatsCard: React.FC<{ metric: Metric }> = ({ metric }) => {
  const IconComponent = Icons[metric.icon] || Calendar; // Robust fallback to Calendar
  const isPositive = metric.trend > 0;
  const iconStyle = getIconStyle(metric.color || '');

  return (
    <div className="bg-white p-4 lg:p-6 rounded-2xl border border-cream-200 transition-all duration-300 group overflow-hidden relative hover:border-coral-200 hover:shadow-soft-md active:scale-[0.98] lg:active:scale-100">
      {/* Mobile Layout: Horizontal */}
      <div className="flex items-center gap-3 lg:hidden">
        {/* Icon */}
        <div className={`p-3 rounded-xl border ${iconStyle} flex-shrink-0 transition-transform duration-300 group-hover:scale-105`}>
          <IconComponent size={20} strokeWidth={2.5} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-[9px] xs:text-[10px] font-bold text-slate-warm-500 uppercase tracking-wider leading-tight mb-0.5">
            {metric.label}
          </h3>
          <p className="text-xl font-display font-bold text-slate-warm-800 tracking-tight">
            {metric.value}
          </p>
        </div>

        {/* Trend Badge - Compact */}
        <div className={`flex items-center gap-0.5 text-[10px] font-bold px-2.5 py-1.5 rounded-xl ${isPositive
            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
            : 'bg-red-50 text-red-500 border border-red-100'
          }`}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(metric.trend)}%
        </div>
      </div>

      {/* Desktop Layout: Vertical */}
      <div className="hidden lg:block">
        <div className="flex items-start justify-between relative z-10">
          <div className={`p-4 rounded-xl border transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 ${iconStyle}`}>
            <IconComponent size={24} strokeWidth={2.5} />
          </div>
          <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full border ${isPositive
              ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
              : 'bg-red-50 text-red-500 border-red-100'
            }`}>
            {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(metric.trend)}%
          </div>
        </div>
        <div className="mt-6 relative z-10">
          <h3 className="text-[10px] font-bold text-slate-warm-400 uppercase tracking-widest">{metric.label}</h3>
          <p className="text-3xl font-display font-bold text-slate-warm-800 mt-1 tracking-tight group-hover:text-coral-500 transition-colors">{metric.value}</p>
        </div>

        {/* Subtle coral glow on hover */}
        <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity bg-coral-300"></div>
      </div>
    </div>
  );
};

export default StatsCard;