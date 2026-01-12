
import React from 'react';
import { Users, DollarSign, Calendar, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Metric } from '../types';

const Icons: Record<string, any> = {
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
};

const StatsCard: React.FC<{ metric: Metric }> = ({ metric }) => {
  const IconComponent = Icons[metric.icon];
  const isPositive = metric.trend > 0;

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100/60 transition-all group overflow-hidden relative">
      <div className="flex items-start justify-between relative z-10">
        <div className={`p-4 rounded-xl transition-all duration-300 ${metric.color.split(' ')[0]} ${metric.color.split(' ')[1]} border group-hover:scale-110 group-hover:rotate-3`}>
          <IconComponent size={24} strokeWidth={2.5} />
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.1em] px-2.5 py-1.5 rounded-full ${isPositive ? 'bg-nutri-success/10 text-nutri-success border border-nutri-success/20' : 'bg-nutri-error/10 text-nutri-error border border-nutri-error/20'}`}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {Math.abs(metric.trend)}%
        </div>
      </div>
      <div className="mt-6 relative z-10">
        <h3 className="text-[10px] font-black text-nutri-text-sec uppercase tracking-[0.2em]">{metric.label}</h3>
        <p className="text-2xl font-black text-nutri-text mt-1 tracking-tight group-hover:text-nutri-blue transition-colors">{metric.value}</p>
      </div>

      {/* Subtle background glow effect based on color */}
      <div className={`absolute -right-8 -bottom-8 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-10 transition-opacity ${metric.color.split(' ')[0]}`}></div>
    </div>
  );
};

export default StatsCard;