
import React from 'react';
import { Info, AlertTriangle, AlertCircle, Bell } from 'lucide-react';
import { MOCK_ALERTS } from '../constants';

const AlertsPanel: React.FC = () => {
  return (
    <div className="bg-white p-4 lg:p-6 rounded-xl lg:rounded-2xl border border-slate-100 shadow-sm h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div className="flex items-center gap-2">
          <Bell size={18} className="text-nutri-error lg:hidden" />
          <h3 className="text-base lg:text-lg font-bold text-nutri-text">Alertas</h3>
          <span className="bg-nutri-error/10 text-nutri-error text-[10px] font-bold px-2 py-0.5 rounded-full border border-nutri-error/20">
            {MOCK_ALERTS.length}
          </span>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-2 lg:space-y-3">
        {MOCK_ALERTS.map((alert) => (
          <div 
            key={alert.id} 
            className="p-3 lg:p-4 rounded-xl border border-nutri-border/50 bg-nutri-secondary/30 flex gap-3 items-start active:bg-nutri-secondary transition-colors"
          >
            {/* Icon */}
            <div className={`
              mt-0.5 flex-shrink-0
              ${alert.severity === 'high' ? 'text-nutri-error' :
                alert.severity === 'medium' ? 'text-nutri-warning' : 'text-nutri-blue'}
            `}>
              {alert.severity === 'high' ? <AlertCircle size={16} /> :
                alert.severity === 'medium' ? <AlertTriangle size={16} /> : <Info size={16} />}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm text-nutri-text font-medium leading-snug">
                {alert.message}
              </p>
              <span className="text-[10px] text-nutri-text-dis mt-1 block font-bold">
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