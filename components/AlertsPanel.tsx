
import React from 'react';
import { Bell, Info, AlertTriangle, AlertCircle } from 'lucide-react';
import { MOCK_ALERTS } from '../constants';

const AlertsPanel: React.FC = () => {
  return (
    <div className="bg-nutri-card p-6 rounded-2xl border border-nutri-border shadow-nutri-soft h-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-nutri-text">Alertas e Pendências</h3>
          <span className="bg-nutri-error/10 text-nutri-error text-[10px] font-bold px-2 py-0.5 rounded-full border border-nutri-error/20">3</span>
        </div>
      </div>
      <div className="space-y-3">
        {MOCK_ALERTS.map((alert) => (
          <div key={alert.id} className="p-4 rounded-xl border border-nutri-border bg-nutri-secondary/50 flex gap-3">
            <div className={`mt-0.5 ${
              alert.severity === 'high' ? 'text-nutri-error' :
              alert.severity === 'medium' ? 'text-nutri-warning' : 'text-nutri-blue'
            }`}>
              {alert.severity === 'high' ? <AlertCircle size={18} /> : 
               alert.severity === 'medium' ? <AlertTriangle size={18} /> : <Info size={18} />}
            </div>
            <div>
              <p className="text-sm text-nutri-text font-medium leading-tight">{alert.message}</p>
              <span className="text-[10px] text-nutri-text-dis mt-1 block font-bold">{alert.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsPanel;