
import React from 'react';
import { MoreVertical, Clock } from 'lucide-react';
import { MOCK_APPOINTMENTS } from '../constants';

const AppointmentsList: React.FC = () => {
  // Show only first 4 appointments on mobile, all on desktop
  const displayAppointments = MOCK_APPOINTMENTS.slice(0, 4);

  return (
    <div className="bg-white p-4 lg:p-6 rounded-xl lg:rounded-2xl border border-slate-100 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-nutri-blue lg:hidden" />
          <h3 className="text-base lg:text-lg font-bold text-nutri-text">Próximos</h3>
        </div>
        <button className="text-xs lg:text-sm font-bold text-nutri-blue hover:text-nutri-blue-hover active:opacity-70 transition-all">
          Ver tudo
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-2 lg:space-y-4">
        {displayAppointments.map((appointment, index) => (
          <div 
            key={appointment.id} 
            className={`
              flex items-center gap-3 lg:gap-4 p-3 rounded-xl 
              hover:bg-nutri-secondary transition-colors group
              ${index === 0 ? 'bg-nutri-blue/5 border border-nutri-blue/10' : ''}
            `}
          >
            {/* Time Badge */}
            <div className={`
              px-3 py-2 rounded-lg text-center min-w-[52px]
              ${index === 0 
                ? 'bg-nutri-blue text-white' 
                : 'bg-nutri-secondary text-nutri-text-sec'
              }
            `}>
              <span className={`text-sm font-bold ${index === 0 ? 'text-white' : 'text-nutri-text'}`}>
                {appointment.time}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-nutri-text text-sm truncate">
                {appointment.patientName}
              </h4>
              <p className="text-xs text-nutri-text-sec truncate">
                {appointment.type}
              </p>
            </div>

            {/* Status - Desktop only */}
            <div className="hidden sm:flex items-center gap-2">
              <span className={`
                text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full
                ${appointment.status === 'Confirmado'
                  ? 'bg-nutri-success/10 text-nutri-success border border-nutri-success/20'
                  : 'bg-nutri-warning/10 text-nutri-warning border border-nutri-warning/20'
                }
              `}>
                {appointment.status}
              </span>
            </div>

            {/* Mobile: Mini status indicator */}
            <div className="sm:hidden">
              <div className={`
                w-2 h-2 rounded-full
                ${appointment.status === 'Confirmado' ? 'bg-nutri-success' : 'bg-nutri-warning'}
              `} />
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: Show count if more */}
      {MOCK_APPOINTMENTS.length > 4 && (
        <p className="lg:hidden text-center text-xs text-nutri-text-dis mt-3 font-medium">
          +{MOCK_APPOINTMENTS.length - 4} agendamentos hoje
        </p>
      )}
    </div>
  );
};

export default AppointmentsList;