
import React from 'react';
import { MoreVertical, Clock } from 'lucide-react';
import { MOCK_APPOINTMENTS } from '../constants';

const AppointmentsList: React.FC = () => {
  // Show only first 4 appointments on mobile
  const displayAppointments = MOCK_APPOINTMENTS.slice(0, 4);

  return (
    <div className="card-coral p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <div className="flex items-center gap-2">
          <Clock size={18} className="text-coral-500 lg:hidden" />
          <h3 className="text-base lg:text-lg font-display font-bold text-slate-warm-800 tracking-tight">Próximos</h3>
        </div>
        <button className="text-xs lg:text-sm font-bold text-coral-500 hover:text-coral-600 active:opacity-70 transition-all uppercase tracking-wide">
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
              transition-all duration-300 group
              ${index === 0 
                ? 'bg-gradient-to-r from-coral-50 to-white border border-coral-200 shadow-soft-sm' 
                : 'hover:bg-cream-100 border border-transparent hover:border-cream-200'
              }
            `}
          >
            {/* Time Badge */}
            <div className={`
              px-3 py-2 rounded-xl text-center min-w-[54px] shadow-sm transition-all duration-300
              ${index === 0 
                ? 'bg-gradient-to-br from-coral-400 to-coral-500 text-white' 
                : 'bg-cream-100 text-slate-warm-500 group-hover:bg-white'
              }
            `}>
              <span className={`text-sm font-bold ${index === 0 ? 'text-white' : 'text-slate-warm-600'}`}>
                {appointment.time}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-bold text-slate-warm-800 text-sm truncate tracking-tight">
                {appointment.patientName}
              </h4>
              <p className="text-xs text-slate-warm-500 truncate font-medium">
                {appointment.type}
              </p>
            </div>

            {/* Status - Desktop only */}
            <div className="hidden sm:flex items-center gap-2">
              <span className={`
                text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border
                ${appointment.status === 'Confirmado'
                  ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                  : 'bg-amber-50 text-amber-600 border-amber-100'
                }
              `}>
                {appointment.status}
              </span>
            </div>

            {/* Mobile: Mini status indicator */}
            <div className="sm:hidden">
              <div className={`
                w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm
                ${appointment.status === 'Confirmado' ? 'bg-emerald-500' : 'bg-amber-500'}
              `} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppointmentsList;