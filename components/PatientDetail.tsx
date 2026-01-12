
import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, Layout, Clipboard, TrendingUp, FileText, Utensils, 
  User, Calendar, Edit2, Zap, Clock 
} from 'lucide-react';
import PatientRecord from './PatientRecord';
import PatientEvolution from './PatientEvolution';
import MealPlanCreator from './MealPlanCreator';
import ReportGenerator from './ReportGenerator';
import { Patient } from '../types';
import { MOCK_PATIENTS } from '../constants';

interface PatientDetailProps {
  patientId: string;
  onBack: () => void;
  onEdit: () => void;
  onSchedule: (patientId: string) => void;
  onConsultNow: (patientId: string) => void;
}

type Tab = 'resumo' | 'prontuario' | 'evolucao' | 'planos' | 'relatorios';

const PatientDetail: React.FC<PatientDetailProps> = ({ 
  patientId, onBack, onEdit, onSchedule, onConsultNow
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('resumo');
  const patient = MOCK_PATIENTS.find(p => p.id === patientId) || MOCK_PATIENTS[0];

  const lastRecord = useMemo(() => {
    if (!patient.history || patient.history.length === 0) return null;
    return patient.history[patient.history.length - 1];
  }, [patient.history]);

  const tabs = [
    { id: 'resumo', label: 'Resumo', icon: <Layout size={18} /> },
    { id: 'prontuario', label: 'Prontuário', icon: <Clipboard size={18} /> },
    { id: 'evolucao', label: 'Evolução', icon: <TrendingUp size={18} /> },
    { id: 'planos', label: 'Planos', icon: <Utensils size={18} /> },
    { id: 'relatorios', label: 'Entregáveis', icon: <FileText size={18} /> },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-4 md:space-y-6 animate-in fade-in duration-500 pb-20 px-1">
      {/* Header Info simplified */}
      <div className="bg-white p-4 md:p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img src={patient.avatar || `https://i.pravatar.cc/150?u=${patientId}`} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-nutri-blue/5 shadow-sm" alt="Paciente" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-nutri-blue bg-nutri-blue/10 px-2.5 py-1 rounded-full uppercase tracking-widest border border-nutri-blue/20">Paciente Ativo</span>
              </div>
              <div className="flex items-center gap-3 text-slate-500 font-bold text-xs mt-1">
                <span>{patient.age} anos</span>
                <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                <span className="text-nutri-blue">{patient.objective}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3 w-full lg:w-auto shrink-0">
            <button onClick={() => onSchedule(patientId)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-slate-50 text-slate-700 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-200">
              <Calendar size={18} /> Agendar
            </button>
            <button onClick={() => onConsultNow(patientId)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-nutri-blue text-white rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-nutri-blue-hover transition-all shadow-xl shadow-nutri-blue/20 active:scale-95">
              <Zap size={18} className="text-white fill-white" /> Consultar
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-1.5 p-1.5 bg-white/60 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm sticky top-2 z-20 mx-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[11px] md:text-xs font-black transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-nutri-blue text-white shadow-lg shadow-nutri-blue/20 border border-nutri-blue-hover'
                : 'text-slate-500 hover:text-slate-800 hover:bg-white border border-transparent'
            }`}
          >
            {tab.icon}
            {tab.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[500px]">
        {activeTab === 'resumo' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-300">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 md:p-10 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
                  <TrendingUp size={20} className="text-nutri-blue" /> Resumo Evolutivo
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Peso Atual</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-3xl font-black text-slate-800">{lastRecord?.bioimpedancia?.peso || lastRecord?.medicoes?.basicas?.peso || '0.0'} <span className="text-sm">kg</span></p>
                    </div>
                    <span className="text-[10px] text-nutri-blue font-black mt-2 bg-nutri-blue/10 px-2 py-0.5 rounded-full w-fit">Acompanhamento</span>
                  </div>
                  <div className="p-6 rounded-2xl bg-nutri-blue/5 border border-nutri-blue/10 flex flex-col justify-center">
                    <p className="text-[10px] font-black text-nutri-blue/60 uppercase tracking-widest mb-2">Gordura</p>
                    <p className="text-3xl font-black text-nutri-blue">{lastRecord?.bioimpedancia?.percentualGordura || lastRecord?.bioimpedancia?.indicadores?.gorduraPerc || '0.0'}<span className="text-sm">%</span></p>
                    <span className="text-[10px] text-nutri-blue font-black mt-2">Atual</span>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Cintura</p>
                    <p className="text-3xl font-black text-slate-800">{lastRecord?.medicoes?.perimetria?.cintura || lastRecord?.medicoes?.basicas?.cintura || '0.0'}<span className="text-sm">cm</span></p>
                    <span className="text-[10px] text-nutri-blue font-black mt-2">Perimetria</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 md:p-10 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
                    <Utensils size={20} className="text-nutri-blue" /> Prescrição Ativa
                  </h3>
                  <button onClick={() => setActiveTab('planos')} className="text-[10px] font-black text-nutri-blue uppercase tracking-widest hover:underline">Detalhes</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {['Café da Manhã', 'Almoço', 'Lanche Tarde', 'Jantar'].map((meal, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white transition-colors cursor-pointer group">
                      <span className="text-sm font-bold text-slate-700 group-hover:text-nutri-blue">{meal}</span>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">Ativo</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">Pendente</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 border-l-4 border-l-amber-400">
                    <p className="text-xs font-black text-amber-800 uppercase tracking-widest mb-1">Próxima Consulta</p>
                    <p className="text-xs text-amber-600 font-medium leading-relaxed">Verificar exames e evolução das medidas antropométricas.</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="text-[10px] font-black text-nutri-blue mb-6 uppercase tracking-[0.3em]">Insights Clínicos</h3>
                  <p className="text-sm leading-relaxed text-slate-300 font-medium italic">"Mantenha o acompanhamento constante para ajustes finos na conduta nutricional conforme os objetivos estabelecidos."</p>
                </div>
                <div className="absolute top-0 right-0 w-48 h-48 bg-nutri-blue/10 rounded-full -mr-24 -mt-24 blur-3xl group-hover:bg-nutri-blue/20 transition-all duration-500"></div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'prontuario' && <PatientRecord patient={patient} onBack={() => setActiveTab('resumo')} />}
        {activeTab === 'evolucao' && <PatientEvolution patient={patient} onBack={() => setActiveTab('resumo')} />}
        {activeTab === 'planos' && <MealPlanCreator patientName={patient.name} onBack={() => setActiveTab('resumo')} />}
        {activeTab === 'relatorios' && <ReportGenerator patient={patient} onBack={() => setActiveTab('resumo')} />}
      </div>
    </div>
  );
};

export default PatientDetail;
