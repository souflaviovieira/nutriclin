
import React from 'react';
import { Clock, MapPin, Video, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';

interface NextAppointmentProps {
  patientName?: string;
  patientAvatar?: string;
  time?: string;
  type?: string;
  isOnline?: boolean;
  onStartConsultation: () => void;
  onViewProfile: () => void;
}

const NextAppointmentCard: React.FC<NextAppointmentProps> = ({
  patientName = "Ana Sophia Oliveira",
  patientAvatar,
  time = "14:00",
  type = "Retorno (45min)",
  isOnline = true,
  onStartConsultation,
  onViewProfile
}) => {
  return (
    <div className="w-full relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-warm-800 to-slate-warm-900 shadow-soft-xl group">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-coral-500 rounded-full blur-[80px] opacity-20 -mr-16 -mt-16 group-hover:opacity-30 transition-opacity duration-700" />
      <div className="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500 rounded-full blur-[60px] opacity-10 -ml-10 -mb-10" />
      
      <div className="relative p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        
        {/* Left: Time & Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-500/10 border border-coral-500/20 text-coral-400 text-xs font-bold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-coral-500"></span>
              </span>
              Em breve
            </span>
            <span className="text-slate-warm-400 text-xs font-medium uppercase tracking-wider flex items-center gap-1">
              <Clock size={12} /> Começa em 15 min
            </span>
          </div>
          
          <div className="flex items-center gap-5 mb-4">
             <div className="relative flex-shrink-0">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-warm-700 border-4 border-white/5 overflow-hidden shadow-2xl">
                    {patientAvatar ? (
                        <img src={patientAvatar} alt={patientName} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20 font-display font-bold text-2xl">
                            {patientName.charAt(0)}
                        </div>
                    )}
                </div>
                {/* Status dot */}
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-warm-900 shadow-sm"></div>
             </div>
             
             <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-2 tracking-tight leading-none">
                    {patientName}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-slate-warm-300 text-sm">
                    <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 text-xs font-medium">
                        <FileText size={12} className="text-coral-400" /> {type}
                    </span>
                    <span className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 text-xs font-medium">
                        {isOnline ? <Video size={12} className="text-emerald-400" /> : <MapPin size={12} className="text-emerald-400" />}
                        {isOnline ? 'Online' : 'Presencial'}
                    </span>
                </div>
             </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto mt-2 md:mt-0">
          <button 
            onClick={onViewProfile}
            className="px-6 py-4 rounded-2xl bg-white/5 text-white border border-white/10 font-bold hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Ver Prontuário
          </button>
          
          <button 
            onClick={onStartConsultation}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-coral-500 to-coral-600 text-white font-bold shadow-lg shadow-coral-500/20 hover:shadow-coral-500/40 hover:scale-[1.02] transition-all active:scale-95 flex items-center justify-center gap-2 group/btn"
          >
            <CheckCircle2 size={20} />
            Iniciar Atendimento
            <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NextAppointmentCard;
