
import React from 'react';
import { Calendar, MoreVertical } from 'lucide-react';
import { MOCK_APPOINTMENTS } from '../constants';

const AppointmentsList: React.FC = () => {
  return (
    <div className="bg-nutri-card p-6 rounded-2xl border border-nutri-border shadow-nutri-soft">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-nutri-text">Próximos Atendimentos</h3>
        <button className="text-sm font-medium text-nutri-blue hover:text-nutri-blue-hover">Ver agenda completa</button>
      </div>
      <div className="space-y-4">
        {MOCK_APPOINTMENTS.map((appointment) => (
          <div key={appointment.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-nutri-secondary transition-colors group">
            <div className="bg-nutri-secondary p-3 rounded-lg text-nutri-text-sec font-bold text-xs flex flex-col items-center justify-center min-w-[50px]">
              <span className="text-nutri-text text-sm">{appointment.time}</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-nutri-text text-sm">{appointment.patientName}</h4>
              <p className="text-xs text-nutri-text-sec">{appointment.type}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                appointment.status === 'Confirmado' 
                ? 'bg-nutri-success/10 text-nutri-success border border-nutri-success/20' 
                : 'bg-nutri-warning/10 text-nutri-warning border border-nutri-warning/20'
              }`}>
                {appointment.status}
              </span>
              <button className="text-nutri-text-dis opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentsList;