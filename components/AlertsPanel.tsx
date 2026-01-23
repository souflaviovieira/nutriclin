import React from 'react';
import { Info, AlertTriangle, AlertCircle, Bell } from 'lucide-react';
import { MOCK_ALERTS } from '../constants';

const AlertsPanel: React.FC = () => {
  return (
    <div className="card-coral p-4 lg:p-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-coral-500 lg:hidden" />
          <h3 className="text-base lg:text-lg font-display font-bold text-slate-warm-800 tracking-tight">Alertas</h3>
          <span className="bg-coral-100 text-coral-600 text-[10px] font-bold px-2 py-0.5 rounded-full border border-coral-200">
            {MOCK_ALERTS.length}
          </span>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-2 lg:space-y-3 flex-1 overflow-y-auto max-h-[300px] lg:max-h-none pr-1 custom-scrollbar">
        {MOCK_ALERTS.map((alert, index) => (
          <div 
            key={alert.id} 
            className="p-3 lg:p-4 rounded-xl border border-cream-200 bg-cream-50 hover:bg-white hover:border-coral-200 hover:shadow-soft-sm transition-all duration-300 flex gap-3 items-start group animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Icon */}
            <div className={`
              mt-0.5 flex-shrink-0 p-1.5 rounded-lg transition-colors duration-300
              ${alert.severity === 'high' ? 'bg-red-50 text-red-500' :
                alert.severity === 'medium' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'}
            `}>
              {alert.severity === 'high' ? <AlertCircle size={16} strokeWidth={2.5} /> :
                alert.severity === 'medium' ? <AlertTriangle size={16} strokeWidth={2.5} /> : <Info size={16} strokeWidth={2.5} />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-warm-700 font-medium leading-snug group-hover:text-slate-warm-900 transition-colors">
                {alert.message}
              </p>
              <span className="text-[10px] text-slate-warm-400 mt-1.5 block font-bold uppercase tracking-wider">
                {alert.date}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsPanel;