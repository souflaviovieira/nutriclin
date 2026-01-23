
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Filter, 
  CheckCircle2,
  X
} from 'lucide-react';
import { MOCK_APPOINTMENTS } from '../constants';
import { Appointment } from '../types';
import AppointmentForm from './AppointmentForm';

type CalendarView = 'dia' | 'semana' | 'mes';

const ScheduleManager: React.FC = () => {
  const [view, setView] = useState<CalendarView>('dia');
  const [selectedDate, setSelectedDate] = useState(new Date()); // Data atual automática
  const [isAddingAppointment, setIsAddingAppointment] = useState(false);
  const [preSelectedData, setPreSelectedData] = useState<{date?: string, time?: string} | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ type: 'Todos', status: 'Todos' });
  
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS as unknown as Appointment[]);
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);

  // --- Helper Functions ---
  const formatDate = (date: Date) => date.toISOString().split('T')[0];

  const getWeekDays = (date: Date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  const getMonthDays = (date: Date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const days = [];
    
    const startPadding = start.getDay();
    for (let i = startPadding - 1; i >= 0; i--) {
      const d = new Date(start);
      d.setDate(start.getDate() - i - 1);
      days.push({ date: d, currentMonth: false });
    }
    
    for (let i = 1; i <= end.getDate(); i++) {
      days.push({ date: new Date(date.getFullYear(), date.getMonth(), i), currentMonth: true });
    }
    
    return days;
  };

  // --- Drag & Drop Handlers ---
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedAppId(id);
    e.dataTransfer.setData('appointmentId', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => setDraggedAppId(null);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newDate: string, newTime?: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('appointmentId');
    if (!id) return;
    setAppointments(prev => prev.map(app => 
      app.id === id ? { ...app, date: newDate, time: newTime || app.time } : app
    ));
    setDraggedAppId(null);
  };

  // --- Filtered Data ---
  const visibleAppointments = useMemo(() => {
    let list = appointments;
    
    if (view === 'dia') {
      list = list.filter(a => a.date === formatDate(selectedDate));
    } else if (view === 'semana') {
      const week = getWeekDays(selectedDate).map(formatDate);
      list = list.filter(a => week.includes(a.date));
    } else if (view === 'mes') {
      list = list.filter(a => {
        const d = new Date(a.date);
        return d.getMonth() === selectedDate.getMonth() && d.getFullYear() === selectedDate.getFullYear();
      });
    }

    if (filters.type !== 'Todos') list = list.filter(a => a.type === filters.type);
    if (filters.status !== 'Todos') list = list.filter(a => a.status === filters.status);

    return list;
  }, [selectedDate, view, filters, appointments]);

  // --- Actions ---
  const handleOpenAppointment = (date?: string, time?: string) => {
    setPreSelectedData({ date, time });
    setIsAddingAppointment(true);
  };

  const changePeriod = (offset: number) => {
    const next = new Date(selectedDate);
    if (view === 'dia') next.setDate(selectedDate.getDate() + offset);
    if (view === 'semana') next.setDate(selectedDate.getDate() + (offset * 7));
    if (view === 'mes') next.setMonth(selectedDate.getMonth() + offset);
    setSelectedDate(next);
  };

  const statusColors: Record<string, string> = {
    'Confirmado': 'bg-emerald-50 text-emerald-700 border-emerald-100',
    'Pendente': 'bg-amber-50 text-amber-700 border-amber-100',
    'Realizada': 'bg-blue-50 text-blue-700 border-blue-100',
    'Cancelado': 'bg-rose-50 text-rose-700 border-rose-100'
  };

  if (isAddingAppointment) {
    return (
      <AppointmentForm 
        initialDate={preSelectedData?.date}
        initialTime={preSelectedData?.time}
        onCancel={() => {
          setIsAddingAppointment(false);
          setPreSelectedData(null);
        }} 
        onSave={(data) => {
          setAppointments(prev => [...prev, { ...data, id: Date.now().toString() }]);
          setIsAddingAppointment(false);
          setPreSelectedData(null);
        }} 
      />
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-24 lg:pb-8">
      
      {/* Mobile-First Control Bar */}
      <section className="bg-white/90 backdrop-blur-sm p-3 lg:p-4 rounded-xl lg:rounded-2xl border border-cream-200 shadow-soft-sm sticky top-0 z-20">
        {/* View Tabs */}
        <div className="flex justify-center mb-3 lg:mb-0 lg:hidden">
          <div className="flex bg-cream-100 p-1 rounded-xl w-full">
            {(['dia', 'semana', 'mes'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
                  view === v 
                  ? 'bg-white text-coral-500 shadow-sm shadow-coral-100' 
                  : 'text-slate-warm-400'
                }`}
              >
                {v === 'dia' ? 'Dia' : v === 'semana' ? 'Sem' : 'Mês'}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between gap-4">
          <div className="flex bg-cream-100 p-1 rounded-xl">
            {(['dia', 'semana', 'mes'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-6 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
                  view === v ? 'bg-white text-coral-500 shadow-sm' : 'text-slate-warm-400 hover:text-slate-warm-600'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => changePeriod(-1)} className="p-2 hover:bg-cream-100 rounded-lg text-slate-warm-400 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <div className="text-center min-w-[180px]">
              <h3 className="text-sm font-display font-bold text-slate-warm-800">
                {view === 'dia' && selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                {view === 'semana' && `Semana de ${getWeekDays(selectedDate)[0].getDate()} a ${getWeekDays(selectedDate)[6].getDate()}`}
                {view === 'mes' && selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </h3>
            </div>
            <button onClick={() => changePeriod(1)} className="p-2 hover:bg-cream-100 rounded-lg text-slate-warm-400 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${showFilters ? 'bg-coral-50 border-coral-200 text-coral-500' : 'bg-white border-cream-200 text-slate-warm-600'}`}
            >
              <Filter size={16} /> Filtros
            </button>
            <button 
              onClick={() => handleOpenAppointment()}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-br from-coral-400 to-coral-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-coral-200 hover:shadow-coral-300 transition-all active:scale-95"
            >
              <Plus size={16} strokeWidth={3} /> Nova Consulta
            </button>
          </div>
        </div>

        {/* Mobile Date Navigator */}
        <div className="flex items-center justify-between lg:hidden">
          <button onClick={() => changePeriod(-1)} className="p-2 text-slate-warm-400 active:bg-cream-100 rounded-lg">
            <ChevronLeft size={22} />
          </button>
          <div className="text-center flex-1">
            <h3 className="text-sm font-bold text-slate-warm-800">
              {view === 'dia' && selectedDate.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
              {view === 'semana' && `${getWeekDays(selectedDate)[0].getDate()} - ${getWeekDays(selectedDate)[6].getDate()} ${selectedDate.toLocaleDateString('pt-BR', { month: 'short' })}`}
              {view === 'mes' && selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </h3>
          </div>
          <button onClick={() => changePeriod(1)} className="p-2 text-slate-warm-400 active:bg-cream-100 rounded-lg">
            <ChevronRight size={22} />
          </button>
        </div>
      </section>

      {/* Filter Panel - Mobile Bottom Sheet Style */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-slate-warm-900/20 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 space-y-4 animate-slide-up pb-safe">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold font-display text-slate-warm-800">Filtros</h3>
              <button onClick={() => setShowFilters(false)} className="p-2 text-slate-warm-400 hover:bg-cream-100 rounded-full">
                <X size={24} />
              </button>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-warm-400 uppercase block mb-2 tracking-wide">Status</label>
              <div className="flex flex-wrap gap-2">
                {['Todos', 'Confirmado', 'Pendente', 'Realizada'].map(s => (
                  <button
                    key={s}
                    onClick={() => setFilters({...filters, status: s})}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      filters.status === s 
                        ? 'bg-coral-500 text-white border-coral-500 shadow-md shadow-coral-200' 
                        : 'bg-white text-slate-warm-600 border-cream-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-warm-400 uppercase block mb-2 tracking-wide">Tipo</label>
              <div className="flex flex-wrap gap-2">
                {['Todos', 'Primeira Consulta', 'Retorno', 'Avaliação'].map(t => (
                  <button
                    key={t}
                    onClick={() => setFilters({...filters, type: t})}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      filters.type === t 
                        ? 'bg-coral-500 text-white border-coral-500 shadow-md shadow-coral-200' 
                        : 'bg-white text-slate-warm-600 border-cream-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <button 
              onClick={() => setShowFilters(false)}
              className="w-full mt-4 py-3 bg-slate-warm-800 text-white rounded-xl font-bold"
            >
              Aplicar Filtros
            </button>
          </div>
        </div>
      )}

      {/* Appointments List - Mobile View */}
      {view === 'dia' && (
        <section className="lg:hidden space-y-3">
          {visibleAppointments.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-cream-200 text-center shadow-soft-sm">
              <CalendarIcon size={40} className="mx-auto text-cream-300 mb-3" />
              <p className="text-sm font-bold text-slate-warm-600">Nenhuma consulta</p>
              <p className="text-xs text-slate-warm-400 mt-1">Toque no + para agendar</p>
            </div>
          ) : (
            visibleAppointments.sort((a,b) => a.time.localeCompare(b.time)).map((app, idx) => (
              <div 
                key={app.id}
                className={`p-4 rounded-2xl border shadow-soft-sm flex items-center gap-4 active:scale-[0.98] transition-all bg-white animate-slide-up`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="text-center min-w-[50px]">
                  <p className="text-lg font-display font-bold text-slate-warm-800">{app.time}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate text-slate-warm-900">{app.patientName}</h4>
                  <p className="text-[10px] text-slate-warm-500 font-bold uppercase tracking-wide">{app.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                    app.status === 'Confirmado' ? 'bg-emerald-500' : 
                    app.status === 'Pendente' ? 'bg-amber-500' : 'bg-slate-warm-300'
                  }`} />
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {/* Desktop Calendar Views */}
      <section className="hidden lg:block bg-white rounded-3xl border border-cream-200 shadow-soft-medium overflow-hidden min-h-[600px]">
        {/* VIEW: DIA */}
        {view === 'dia' && (
          <div className="flex flex-col">
            <div className="p-4 border-b border-cream-100 bg-cream-50/50 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-warm-400 uppercase tracking-widest">Cronograma</span>
              <span className="text-[10px] font-bold text-coral-500 bg-coral-50 px-2 py-1 rounded-lg border border-coral-100">Agora</span>
            </div>
            <div className="divide-y divide-cream-100">
              {Array.from({ length: 12 }, (_, i) => i + 7).map(hour => {
                const hourStr = `${hour.toString().padStart(2, '0')}:00`;
                const apps = visibleAppointments.filter(a => a.time.startsWith(hour.toString().padStart(2, '0')));
                
                return (
                  <div 
                    key={hour} 
                    className="flex min-h-[80px] group hover:bg-cream-50/30 transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, formatDate(selectedDate), hourStr)}
                  >
                    <div className="w-20 p-4 text-[12px] font-medium text-slate-warm-400 text-right border-r border-cream-100 font-display">
                      {hourStr}
                    </div>
                    <div className="flex-1 p-2 relative group-hover:bg-coral-50/10 transition-colors">
                      {apps.length > 0 ? (
                        apps.map(app => (
                          <div 
                            key={app.id} 
                            draggable
                            onDragStart={(e) => handleDragStart(e, app.id)}
                            onDragEnd={handleDragEnd}
                            className={`p-3 mb-2 rounded-xl border border-cream-200 shadow-soft-xs bg-white hover:shadow-soft-md hover:border-coral-200 transition-all cursor-grab active:cursor-grabbing hover:translate-y-[-2px] flex items-center justify-between group/card`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-coral-100 to-coral-50 text-coral-600 flex items-center justify-center font-bold text-xs shadow-inner">
                                {app.patientName.charAt(0)}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold tracking-tight text-slate-warm-800">{app.patientName}</h4>
                                <p className="text-[10px] text-slate-warm-500 font-bold uppercase">{app.type} • {app.time}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                app.status === 'Confirmado' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                'bg-amber-50 text-amber-600 border-amber-100'
                              }`}>
                                {app.status}
                              </span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <button 
                          onClick={() => handleOpenAppointment(formatDate(selectedDate), hourStr)}
                          className="h-full w-full flex items-center px-4 text-[10px] font-bold text-slate-warm-300 hover:text-coral-400 opacity-0 group-hover:opacity-100 transition-all border-2 border-dashed border-transparent hover:border-coral-200 rounded-xl"
                        >
                          <Plus size={14} className="mr-1" /> Adicionar na agenda
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW: SEMANA */}
        {view === 'semana' && (
          <div className="grid grid-cols-7 h-full divide-x divide-cream-100">
            {getWeekDays(selectedDate).map((day, idx) => {
              const dateStr = formatDate(day);
              const isToday = dateStr === formatDate(new Date());
              const dayApps = visibleAppointments.filter(a => a.date === dateStr);
              
              return (
                <div 
                  key={idx} 
                  className={`flex flex-col min-h-[500px] group/day ${isToday ? 'bg-coral-50/30' : ''}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, dateStr)}
                >
                  <div className={`p-4 border-b border-cream-100 text-center ${isToday ? 'bg-coral-50/50' : 'bg-white'}`}>
                    <p className="text-[9px] font-black text-slate-warm-400 uppercase tracking-widest mb-1">
                      {day.toLocaleDateString('pt-BR', { weekday: 'short' })}
                    </p>
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-base font-black transition-all ${isToday ? 'bg-coral-500 text-white shadow-md shadow-coral-200' : 'text-slate-warm-700'}`}>
                      {day.getDate()}
                    </div>
                  </div>
                  <div className="flex-1 p-2 space-y-2 overflow-y-auto no-scrollbar">
                    {dayApps.sort((a,b) => a.time.localeCompare(b.time)).map(app => (
                      <div 
                        key={app.id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, app.id)}
                        onDragEnd={handleDragEnd}
                        className={`p-2 rounded-lg border bg-white hover:border-coral-200 hover:shadow-md transition-all cursor-grab flex flex-col gap-1 group/card`}
                      >
                         <div className="flex justify-between items-center">
                            <span className="font-bold text-xs text-coral-600 bg-coral-50 px-1.5 rounded-md">{app.time.slice(0,5)}</span>
                            <div className={`w-1.5 h-1.5 rounded-full ${app.status === 'Confirmado' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                         </div>
                        <span className="truncate text-xs font-bold text-slate-warm-700">{app.patientName.split(' ')[0]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW: MES */}
        {view === 'mes' && (
          <div className="flex flex-col">
            <div className="grid grid-cols-7 bg-cream-50/50 border-b border-cream-100">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
                <div key={d} className="p-3 text-[10px] font-bold text-slate-warm-400 uppercase text-center tracking-widest">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 flex-1 divide-x divide-y divide-cream-100">
              {getMonthDays(selectedDate).map((dayObj, idx) => {
                const dateStr = formatDate(dayObj.date);
                const dayApps = appointments.filter(a => a.date === dateStr);
                const isToday = dateStr === formatDate(new Date());

                return (
                  <div 
                    key={idx} 
                    onClick={() => { setSelectedDate(dayObj.date); setView('dia'); }}
                    className={`min-h-[100px] p-2 cursor-pointer hover:bg-coral-50/20 flex flex-col items-center transition-colors group ${!dayObj.currentMonth ? 'opacity-30 bg-slate-50' : 'bg-white'}`}
                  >
                    <span className={`text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full transition-all ${isToday ? 'bg-coral-500 text-white shadow-md shadow-coral-200' : 'text-slate-warm-500 group-hover:text-coral-500 group-hover:bg-coral-50'}`}>
                      {dayObj.date.getDate()}
                    </span>
                    
                    <div className="mt-2 flex flex-col gap-1 w-full px-1">
                      {dayApps.slice(0, 2).map(app => (
                        <div key={app.id} className="h-1.5 rounded-full bg-coral-200 w-full opacity-60 flex items-center justify-center overflow-hidden">
                           <div className={`w-full h-full ${app.status === 'Confirmado' ? 'bg-coral-400' : 'bg-amber-300'}`} />
                        </div>
                      ))}
                      {dayApps.length > 2 && (
                        <span className="text-[8px] font-bold text-slate-warm-400 text-center">+{dayApps.length - 2}</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Tip Footer */}
      <footer className="hidden lg:block text-center">
        <p className="text-[10px] text-slate-warm-400 font-medium flex items-center justify-center gap-1">
          <CheckCircle2 size={12} className="text-coral-400" /> Arraste uma consulta para remarcar rapidamente (Drag & Drop)
        </p>
      </footer>
    </div>
  );
};

export default ScheduleManager;
