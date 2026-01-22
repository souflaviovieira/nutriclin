
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Filter, 
  MoreVertical,
  CheckCircle2,
  X
} from 'lucide-react';
import { MOCK_APPOINTMENTS } from '../constants';
import { Appointment } from '../types';
import AppointmentForm from './AppointmentForm';

type CalendarView = 'dia' | 'semana' | 'mes';

const ScheduleManager: React.FC = () => {
  const [view, setView] = useState<CalendarView>('dia');
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 2, 20));
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
      <section className="bg-white p-3 lg:p-4 rounded-xl lg:rounded-2xl border border-slate-100 shadow-sm">
        {/* View Tabs */}
        <div className="flex justify-center mb-3 lg:mb-0 lg:hidden">
          <div className="flex bg-slate-100 p-1 rounded-xl w-full">
            {(['dia', 'semana', 'mes'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
                  view === v 
                  ? 'bg-white text-nutri-blue shadow-sm' 
                  : 'text-slate-400'
                }`}
              >
                {v === 'dia' ? 'Dia' : v === 'semana' ? 'Sem' : 'Mês'}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-between gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(['dia', 'semana', 'mes'] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-6 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
                  view === v ? 'bg-white text-nutri-blue shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => changePeriod(-1)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
              <ChevronLeft size={20} />
            </button>
            <div className="text-center min-w-[180px]">
              <h3 className="text-sm font-bold text-slate-800">
                {view === 'dia' && selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                {view === 'semana' && `Semana de ${getWeekDays(selectedDate)[0].getDate()} a ${getWeekDays(selectedDate)[6].getDate()}`}
                {view === 'mes' && selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
              </h3>
            </div>
            <button onClick={() => changePeriod(1)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${showFilters ? 'bg-nutri-blue/10 border-nutri-blue text-nutri-blue' : 'bg-white border-slate-200 text-slate-600'}`}
            >
              <Filter size={16} /> Filtros
            </button>
            <button 
              onClick={() => handleOpenAppointment()}
              className="flex items-center gap-2 px-6 py-2 bg-nutri-blue text-white rounded-xl text-xs font-bold shadow-lg shadow-nutri-blue/10 hover:bg-nutri-blue-hover transition-all active:scale-95"
            >
              <Plus size={16} strokeWidth={3} /> Nova Consulta
            </button>
          </div>
        </div>

        {/* Mobile Date Navigator */}
        <div className="flex items-center justify-between lg:hidden">
          <button onClick={() => changePeriod(-1)} className="p-2 text-slate-400 active:bg-slate-50 rounded-lg">
            <ChevronLeft size={22} />
          </button>
          <div className="text-center flex-1">
            <h3 className="text-sm font-bold text-slate-800">
              {view === 'dia' && selectedDate.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric', month: 'short' })}
              {view === 'semana' && `${getWeekDays(selectedDate)[0].getDate()} - ${getWeekDays(selectedDate)[6].getDate()} ${selectedDate.toLocaleDateString('pt-BR', { month: 'short' })}`}
              {view === 'mes' && selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </h3>
          </div>
          <button onClick={() => changePeriod(1)} className="p-2 text-slate-400 active:bg-slate-50 rounded-lg">
            <ChevronRight size={22} />
          </button>
        </div>
      </section>

      {/* Filter Panel - Mobile Bottom Sheet Style */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 space-y-4 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Filtros</h3>
              <button onClick={() => setShowFilters(false)} className="p-2 text-slate-400">
                <X size={24} />
              </button>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Status</label>
              <div className="flex flex-wrap gap-2">
                {['Todos', 'Confirmado', 'Pendente', 'Realizada'].map(s => (
                  <button
                    key={s}
                    onClick={() => setFilters({...filters, status: s})}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      filters.status === s 
                        ? 'bg-nutri-blue text-white' 
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-slate-400 uppercase block mb-2">Tipo</label>
              <div className="flex flex-wrap gap-2">
                {['Todos', 'Primeira Consulta', 'Retorno', 'Avaliação'].map(t => (
                  <button
                    key={t}
                    onClick={() => setFilters({...filters, type: t})}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      filters.type === t 
                        ? 'bg-nutri-blue text-white' 
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointments List - Mobile View */}
      {view === 'dia' && (
        <section className="lg:hidden space-y-3">
          {visibleAppointments.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-slate-100 text-center">
              <CalendarIcon size={40} className="mx-auto text-slate-200 mb-3" />
              <p className="text-sm font-bold text-slate-600">Nenhuma consulta</p>
              <p className="text-xs text-slate-400 mt-1">Toque no + para agendar</p>
            </div>
          ) : (
            visibleAppointments.sort((a,b) => a.time.localeCompare(b.time)).map(app => (
              <div 
                key={app.id}
                className={`p-4 rounded-xl border shadow-sm flex items-center gap-4 active:scale-[0.99] transition-all ${statusColors[app.status]}`}
              >
                <div className="text-center min-w-[50px]">
                  <p className="text-lg font-black">{app.time}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate">{app.patientName}</h4>
                  <p className="text-[10px] opacity-70 font-bold uppercase">{app.type}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold">R$ {app.price}</span>
                  <button className="p-2 rounded-lg hover:bg-black/5">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </section>
      )}

      {/* Desktop Calendar Views */}
      <section className="hidden lg:block bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[600px]">
        {/* VIEW: DIA */}
        {view === 'dia' && (
          <div className="flex flex-col">
            <div className="p-4 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cronograma</span>
              <span className="text-[10px] font-bold text-nutri-blue bg-nutri-blue/10 px-2 py-1 rounded-lg">Agora</span>
            </div>
            <div className="divide-y divide-slate-50">
              {Array.from({ length: 12 }, (_, i) => i + 7).map(hour => {
                const hourStr = `${hour.toString().padStart(2, '0')}:00`;
                const apps = visibleAppointments.filter(a => a.time.startsWith(hour.toString().padStart(2, '0')));
                
                return (
                  <div 
                    key={hour} 
                    className="flex min-h-[70px] group"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, formatDate(selectedDate), hourStr)}
                  >
                    <div className="w-20 p-4 text-[10px] font-bold text-slate-400 text-right border-r border-slate-50">
                      {hourStr}
                    </div>
                    <div className="flex-1 p-2 relative bg-slate-50/10 group-hover:bg-nutri-blue/5 transition-colors">
                      {apps.length > 0 ? (
                        apps.map(app => (
                          <div 
                            key={app.id} 
                            draggable
                            onDragStart={(e) => handleDragStart(e, app.id)}
                            onDragEnd={handleDragEnd}
                            className={`p-3 rounded-xl border shadow-sm flex items-center justify-between transition-all cursor-grab active:cursor-grabbing hover:scale-[1.01] ${statusColors[app.status]}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-white/50 flex items-center justify-center font-bold text-xs">
                                {app.patientName.charAt(0)}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold tracking-tight">{app.patientName}</h4>
                                <p className="text-[10px] opacity-70 font-bold uppercase">{app.type} • {app.time}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold">R$ {app.price}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <button 
                          onClick={() => handleOpenAppointment(formatDate(selectedDate), hourStr)}
                          className="h-full w-full flex items-center px-4 text-[10px] font-bold text-slate-300 hover:text-nutri-blue opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Plus size={12} className="mr-1" /> Horário livre
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
          <div className="grid grid-cols-7 h-full divide-x divide-slate-100">
            {getWeekDays(selectedDate).map((day, idx) => {
              const dateStr = formatDate(day);
              const isToday = dateStr === formatDate(new Date());
              const dayApps = visibleAppointments.filter(a => a.date === dateStr);
              
              return (
                <div 
                  key={idx} 
                  className={`flex flex-col min-h-[500px] group/day ${isToday ? 'bg-nutri-blue/5' : ''}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, dateStr)}
                >
                  <div className={`p-4 border-b border-slate-50 text-center ${isToday ? 'bg-nutri-blue/10' : 'bg-white'}`}>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                      {day.toLocaleDateString('pt-BR', { weekday: 'short' })}
                    </p>
                    <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-base font-black ${isToday ? 'bg-nutri-blue text-white' : 'text-slate-700'}`}>
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
                        className={`p-2 rounded-lg border flex items-center gap-2 text-xs shadow-sm cursor-grab ${statusColors[app.status]}`}
                      >
                        <span className="font-bold">{app.time.slice(0,5)}</span>
                        <span className="truncate">{app.patientName.split(' ')[0]}</span>
                      </div>
                    ))}
                    {dayApps.length === 0 && (
                      <div className="h-full flex items-center justify-center opacity-10">
                        <CalendarIcon size={32} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW: MES */}
        {view === 'mes' && (
          <div className="flex flex-col">
            <div className="grid grid-cols-7 bg-slate-50/50 border-b border-slate-50">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
                <div key={d} className="p-3 text-[10px] font-bold text-slate-400 uppercase text-center">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 flex-1 divide-x divide-y divide-slate-50">
              {getMonthDays(selectedDate).map((dayObj, idx) => {
                const dateStr = formatDate(dayObj.date);
                const dayApps = appointments.filter(a => a.date === dateStr);
                const isToday = dateStr === formatDate(new Date());

                return (
                  <div 
                    key={idx} 
                    onClick={() => { setSelectedDate(dayObj.date); setView('dia'); }}
                    className={`min-h-[80px] p-2 cursor-pointer hover:bg-nutri-blue/5 flex flex-col items-center ${!dayObj.currentMonth ? 'opacity-30' : ''}`}
                  >
                    <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-nutri-blue text-white' : 'text-slate-500'}`}>
                      {dayObj.date.getDate()}
                    </span>
                    <div className="flex gap-0.5 mt-2">
                      {dayApps.slice(0, 3).map(app => (
                        <div key={app.id} className="w-1.5 h-1.5 rounded-full bg-nutri-blue/50" />
                      ))}
                    </div>
                    {dayApps.length > 3 && (
                      <span className="text-[8px] font-bold text-slate-400 mt-1">+{dayApps.length - 3}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Mobile Week/Month Views - Simplified */}
      {view === 'semana' && (
        <section className="lg:hidden">
          <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2 -mx-4 px-4">
            {getWeekDays(selectedDate).map((day, idx) => {
              const dateStr = formatDate(day);
              const isToday = dateStr === formatDate(new Date());
              const isSelected = dateStr === formatDate(selectedDate);
              const dayApps = appointments.filter(a => a.date === dateStr);
              
              return (
                <button 
                  key={idx}
                  onClick={() => { setSelectedDate(day); setView('dia'); }}
                  className={`flex flex-col items-center p-3 rounded-2xl min-w-[60px] transition-all ${
                    isSelected 
                      ? 'bg-nutri-blue text-white' 
                      : isToday 
                        ? 'bg-nutri-blue/10 text-nutri-blue border border-nutri-blue/20' 
                        : 'bg-white border border-slate-100'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase opacity-70">
                    {day.toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0,3)}
                  </span>
                  <span className="text-lg font-black mt-1">{day.getDate()}</span>
                  {dayApps.length > 0 && (
                    <span className={`text-[10px] font-bold mt-1 ${isSelected ? 'text-white/80' : 'text-nutri-blue'}`}>
                      {dayApps.length} cons
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {view === 'mes' && (
        <section className="lg:hidden bg-white rounded-2xl border border-slate-100 p-4">
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d, i) => (
              <span key={i} className="text-[10px] font-bold text-slate-400">{d}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {getMonthDays(selectedDate).map((dayObj, idx) => {
              const dateStr = formatDate(dayObj.date);
              const isToday = dateStr === formatDate(new Date());
              const dayApps = appointments.filter(a => a.date === dateStr);
              
              return (
                <button
                  key={idx}
                  onClick={() => { setSelectedDate(dayObj.date); setView('dia'); }}
                  className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-bold transition-all ${
                    !dayObj.currentMonth 
                      ? 'text-slate-300' 
                      : isToday 
                        ? 'bg-nutri-blue text-white' 
                        : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {dayObj.date.getDate()}
                  {dayApps.length > 0 && dayObj.currentMonth && (
                    <div className={`w-1 h-1 rounded-full mt-0.5 ${isToday ? 'bg-white' : 'bg-nutri-blue'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Tip Footer */}
      <footer className="hidden lg:block text-center">
        <p className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1">
          <CheckCircle2 size={12} className="text-nutri-blue" /> Arraste uma consulta para remarcar
        </p>
      </footer>
    </div>
  );
};

export default ScheduleManager;
