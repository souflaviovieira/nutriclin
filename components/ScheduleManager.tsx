
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
  DollarSign,
  TrendingUp,
  Search,
  ChevronDown,
  UserPlus
} from 'lucide-react';
import { MOCK_APPOINTMENTS } from '../constants';
import { Appointment } from '../types';
import AppointmentForm from './AppointmentForm';

type CalendarView = 'dia' | 'semana' | 'mes';

const ScheduleManager: React.FC = () => {
  const [view, setView] = useState<CalendarView>('dia');
  const [selectedDate, setSelectedDate] = useState(new Date(2024, 2, 20)); // Base: 20 de Março de 2024
  const [isAddingAppointment, setIsAddingAppointment] = useState(false);
  const [preSelectedData, setPreSelectedData] = useState<{date?: string, time?: string} | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ type: 'Todos', status: 'Todos' });
  
  // Estado local para permitir a manipulação dos agendamentos (Drag & Drop)
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
    
    // Adiciona uma classe visual ao elemento sendo arrastado após um pequeno delay
    const target = e.currentTarget as HTMLElement;
    setTimeout(() => {
      target.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    setDraggedAppId(null);
    const target = e.currentTarget as HTMLElement;
    target.style.opacity = '1';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newDate: string, newTime?: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('appointmentId');
    
    if (!id) return;

    setAppointments(prev => prev.map(app => {
      if (app.id === id) {
        return {
          ...app,
          date: newDate,
          time: newTime || app.time // Se não houver novo horário (ex: visão mês), mantém o anterior
        };
      }
      return app;
    }));
    
    setDraggedAppId(null);
  };

  // --- Filtered & In-View Data ---

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

  const financialSummary = useMemo(() => {
    const count = visibleAppointments.length;
    return { count };
  }, [visibleAppointments]);

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

  const statusColors: any = {
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
    <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto pb-20">
      
      {/* Unified Summary Header */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-5">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Total de Atendimentos</p>
            <h2 className="text-xl font-bold text-slate-800">{financialSummary.count} consultas agendadas</h2>
          </div>
        </div>
        <button 
          onClick={() => handleOpenAppointment()}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-nutri-blue text-white rounded-xl font-bold shadow-lg shadow-nutri-blue/20 hover:bg-nutri-blue-hover transition-all active:scale-95"
        >
          <Plus size={18} /> Nova Consulta
        </button>
      </section>

      {/* Control Bar */}
      <section className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {(['dia', 'semana', 'mes'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-6 py-2 rounded-lg text-xs font-bold transition-all uppercase tracking-wider ${
                view === v 
                ? 'bg-white text-nutri-blue shadow-sm' 
                : 'text-slate-400 hover:text-slate-600'
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
              {view === 'semana' && `Semana de ${getWeekDays(selectedDate)[0].getDate()} a ${getWeekDays(selectedDate)[6].getDate()} de Março`}
              {view === 'mes' && selectedDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </h3>
          </div>
          <button onClick={() => changePeriod(1)} className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border ${showFilters ? 'bg-nutri-blue/10 border-nutri-blue text-nutri-blue' : 'bg-white border-slate-200 text-slate-600'}`}
            >
              <Filter size={16} /> Filtros
            </button>
            {showFilters && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-100 shadow-xl rounded-2xl z-50 p-4 space-y-4 animate-in fade-in zoom-in duration-200">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Status</label>
                  <select 
                    value={filters.status}
                    onChange={(e) => setFilters({...filters, status: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-lg p-2 text-xs font-medium outline-none text-slate-800"
                  >
                    <option>Todos</option>
                    <option>Confirmado</option>
                    <option>Pendente</option>
                    <option>Realizada</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Atendimento</label>
                  <select 
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value})}
                    className="w-full bg-slate-50 border-none rounded-lg p-2 text-xs font-medium outline-none text-slate-800"
                  >
                    <option>Todos</option>
                    <option>Primeira Consulta</option>
                    <option>Retorno</option>
                    <option>Avaliação</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content View */}
      <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden min-h-[600px]">
        
        {/* VIEW: DIA */}
        {view === 'dia' && (
          <div className="flex flex-col">
            <div className="p-4 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cronograma Diário</span>
              <span className="text-[10px] font-bold text-nutri-blue bg-nutri-blue/10 px-2 py-1 rounded-lg">Agora: 10:45</span>
            </div>
            <div className="divide-y divide-slate-50">
              {Array.from({ length: 15 }, (_, i) => i + 7).map(hour => {
                const hourStr = `${hour.toString().padStart(2, '0')}:00`;
                const apps = visibleAppointments.filter(a => a.time.startsWith(hour.toString().padStart(2, '0')));
                
                return (
                  <div 
                    key={hour} 
                    className="flex min-h-[80px] group"
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
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold">R$ {app.price}</span>
                              <button className="p-1 hover:bg-black/5 rounded-lg opacity-40 hover:opacity-100 transition-all">
                                <MoreVertical size={16} />
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="h-full flex items-center px-4">
                          <button 
                            onClick={() => handleOpenAppointment(formatDate(selectedDate), hourStr)}
                            className="text-[10px] font-bold text-slate-300 hover:text-nutri-blue opacity-0 group-hover:opacity-100 transition-all flex items-center gap-1 uppercase tracking-widest"
                          >
                            <Plus size={12} /> Horário Livre
                          </button>
                        </div>
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
                  className={`flex flex-col min-h-[600px] group/day transition-colors ${isToday ? 'bg-nutri-blue/5' : ''}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, dateStr)}
                >
                  <div className={`p-5 border-b border-slate-50 text-center relative ${isToday ? 'bg-nutri-blue/10' : 'bg-white'}`}>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                      {day.toLocaleDateString('pt-BR', { weekday: 'short' })}
                    </p>
                    <div className={`inline-flex items-center justify-center w-9 h-9 rounded-full text-lg font-black transition-all ${isToday ? 'bg-nutri-blue text-white shadow-lg' : 'text-slate-700'}`}>
                      {day.getDate()}
                    </div>
                  </div>
                  <div className="flex-1 p-3 space-y-3 overflow-y-auto no-scrollbar relative bg-slate-50/20 group-hover/day:bg-nutri-blue/5 transition-colors">
                    {dayApps.sort((a,b) => a.time.localeCompare(b.time)).map(app => (
                      <div 
                        key={app.id} 
                        draggable
                        onDragStart={(e) => handleDragStart(e, app.id)}
                        onDragEnd={handleDragEnd}
                        className={`p-2.5 rounded-xl border flex items-center gap-3 shadow-sm transition-all cursor-grab active:cursor-grabbing hover:scale-[1.05] group ${statusColors[app.status]}`}
                      >
                        <div className="w-7 h-7 rounded-lg bg-white/60 flex items-center justify-center shrink-0 font-black text-[10px]">
                          {app.patientName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col min-w-0">
                           <span className="text-[10px] font-black truncate leading-tight uppercase tracking-tight">{app.patientName.split(' ')[0]}</span>
                           <span className="text-[9px] font-bold opacity-60 flex items-center gap-1"><Clock size={8}/> {app.time}</span>
                        </div>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => handleOpenAppointment(dateStr)}
                      className="w-full py-6 rounded-xl border-2 border-dashed border-transparent hover:border-nutri-blue/20 hover:bg-white flex items-center justify-center text-nutri-blue/40 opacity-0 group-hover/day:opacity-100 transition-all"
                    >
                      <Plus size={20} />
                    </button>

                    {dayApps.length === 0 && (
                      <div className="h-full flex items-center justify-center opacity-[0.03] pointer-events-none">
                        <CalendarIcon size={64} />
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
          <div className="flex flex-col h-full">
            <div className="grid grid-cols-7 bg-slate-50/50 border-b border-slate-50">
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
                <div key={d} className="p-3 text-[10px] font-bold text-slate-400 uppercase text-center tracking-widest">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 flex-1 divide-x divide-y divide-slate-50">
              {getMonthDays(selectedDate).map((dayObj, idx) => {
                const dateStr = formatDate(dayObj.date);
                const dayApps = visibleAppointments.filter(a => a.date === dateStr);
                const isToday = dateStr === formatDate(new Date());
                const isSelected = dateStr === formatDate(selectedDate);

                return (
                  <div 
                    key={idx} 
                    onClick={() => { setSelectedDate(dayObj.date); setView('dia'); }}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, dateStr)}
                    className={`min-h-[100px] p-2 transition-all cursor-pointer hover:bg-nutri-blue/5 flex flex-col items-center group relative ${!dayObj.currentMonth ? 'opacity-30 grayscale' : ''} ${isSelected ? 'ring-2 ring-nutri-blue/20 z-10' : ''}`}
                  >
                    <span className={`text-xs font-bold mb-2 w-7 h-7 flex items-center justify-center rounded-full transition-colors ${isToday ? 'bg-nutri-blue text-white' : 'text-slate-500 group-hover:text-nutri-blue'}`}>
                      {dayObj.date.getDate()}
                    </span>

                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        handleOpenAppointment(dateStr); 
                      }}
                      className="absolute bottom-2 right-2 p-1.5 bg-nutri-blue text-white rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all scale-75 hover:scale-100"
                    >
                      <Plus size={14} />
                    </button>
                    
                    <div className="flex flex-wrap gap-1 justify-center mt-auto mb-6">
                      {dayApps.slice(0, 3).map(app => (
                        <div 
                          key={app.id} 
                          draggable
                          onDragStart={(e) => handleDragStart(e, app.id)}
                          onDragEnd={handleDragEnd}
                          className="w-1.5 h-1.5 rounded-full bg-nutri-blue/50"
                        ></div>
                      ))}
                      {dayApps.length > 3 && <span className="text-[8px] font-bold text-slate-400">+{dayApps.length - 3}</span>}
                    </div>

                    {dayApps.length > 0 && dayObj.currentMonth && (
                      <div className="absolute bottom-2 left-2 text-[8px] font-bold text-slate-400 uppercase tracking-tighter hidden sm:block">
                        R$ {dayApps.reduce((s, a) => s + a.price, 0)}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Quick Help Footer */}
      <footer className="text-center space-y-2">
        <p className="text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1">
          <CheckCircle2 size={12} className="text-nutri-blue" /> Arraste uma consulta para remarcar o horário ou dia rapidamente
        </p>
      </footer>
    </div>
  );
};

export default ScheduleManager;
