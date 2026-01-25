
import React, { useState, useMemo, useEffect } from 'react';
import {
  ArrowLeft, Layout, Clipboard, TrendingUp, FileText, Utensils,
  User, Calendar, Edit2, Zap, Clock, Phone, Mail, ChevronRight
} from 'lucide-react';
import PatientRecord from './PatientRecord';
import PatientEvolution from './PatientEvolution';
import MealPlanCreator from './MealPlanCreator';
import ReportGenerator from './ReportGenerator';
import { BackHeader } from './navigation';
import { Patient } from '../types';
import { MOCK_PATIENTS } from '../constants';
import { supabase } from '../services/supabaseClient';

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
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatient();
  }, [patientId]);

  const fetchPatient = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .eq('id', patientId)
        .single();

      if (error || !data) {
        // Fallback to mock
        const mockPatient = MOCK_PATIENTS.find(p => p.id === patientId) || MOCK_PATIENTS[0];
        setPatient(mockPatient);
      } else {
        // Map DB fields
        setPatient({
          id: data.id,
          name: data.name,
          email: data.email || '',
          phone: data.phone || '',
          age: data.birth_date ? calculateAge(data.birth_date) : 0,
          objective: data.objective || 'Saúde Geral',
          lastConsultation: data.last_consultation || 'Nunca',
          avatar: data.avatar,
          cpf: data.cpf,
          birth_date: data.birth_date,
          gender: data.gender,
          profession: data.profession,
        });
      }
    } catch (err) {
      const mockPatient = MOCK_PATIENTS.find(p => p.id === patientId) || MOCK_PATIENTS[0];
      setPatient(mockPatient);
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const lastRecord = useMemo(() => {
    if (!patient?.history || patient.history.length === 0) return null;
    return patient.history[patient.history.length - 1];
  }, [patient?.history]);

  const tabs = [
    { id: 'resumo', label: 'Resumo', icon: <Layout size={16} /> },
    { id: 'prontuario', label: 'Prontuário', icon: <Clipboard size={16} /> },
    { id: 'evolucao', label: 'Evolução', icon: <TrendingUp size={16} /> },
    { id: 'planos', label: 'Planos', icon: <Utensils size={16} /> },
    { id: 'relatorios', label: 'Relatórios', icon: <FileText size={16} /> },
  ];

  if (loading || !patient) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-nutri-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 lg:space-y-6 animate-in fade-in duration-500 pb-24 lg:pb-8">
      {/* Mobile Back Header */}
      <div className="lg:hidden -mx-4 -mt-4">
        <BackHeader
          title={patient.name}
          subtitle={`${patient.age > 0 ? patient.age + ' anos • ' : ''}${patient.objective}`}
          onBack={onBack}
          actions={
            <button
              onClick={onEdit}
              className="p-2 text-nutri-blue"
            >
              <Edit2 size={20} />
            </button>
          }
        />
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block">
        <div className="bg-white p-6 rounded-xl border border-slate-100/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <button
                onClick={onBack}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <img
                src={patient.avatar || `https://i.pravatar.cc/150?u=${patientId}`}
                className="w-16 h-16 rounded-xl object-cover ring-4 ring-nutri-blue/5"
                alt="Paciente"
              />
              <div>
                <h2 className="text-xl font-bold text-slate-800">{patient.name}</h2>
                <div className="flex items-center gap-3 text-slate-500 font-bold text-xs mt-1">
                  {patient.age > 0 && <span>{patient.age} anos</span>}
                  <span className="w-1 h-1 bg-slate-200 rounded-full" />
                  <span className="text-nutri-blue">{patient.objective}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => onSchedule(patientId)}
                className="flex items-center gap-2 px-6 py-3 bg-slate-50 text-slate-700 rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-200"
              >
                <Calendar size={18} /> Agendar
              </button>
              <button
                onClick={() => onConsultNow(patientId)}
                className="flex items-center gap-2 px-6 py-3 bg-nutri-blue text-white rounded-lg text-[11px] font-black uppercase tracking-widest hover:bg-nutri-blue-hover transition-all active:scale-95"
              >
                <Zap size={18} className="text-white fill-white" /> Consultar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Quick Actions */}
      <div className="lg:hidden grid grid-cols-2 gap-3">
        <button
          onClick={() => onSchedule(patientId)}
          className="flex items-center justify-center gap-2 py-3 bg-white text-slate-700 rounded-xl text-xs font-bold border border-slate-100 active:bg-slate-50"
        >
          <Calendar size={16} className="text-nutri-blue" /> Agendar
        </button>
        <button
          onClick={() => onConsultNow(patientId)}
          className="flex items-center justify-center gap-2 py-3 bg-nutri-blue text-white rounded-xl text-xs font-bold active:bg-nutri-blue-hover"
        >
          <Zap size={16} /> Consultar
        </button>
      </div>

      {/* Mobile Contact Info */}
      <div className="lg:hidden bg-white p-4 rounded-xl border border-slate-100">
        <div className="flex items-center gap-4">
          <img
            src={patient.avatar || `https://i.pravatar.cc/150?u=${patientId}`}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-nutri-blue/10"
            alt="Paciente"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <Phone size={12} />
              <span className="truncate">{patient.phone || 'Sem telefone'}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
              <Mail size={12} />
              <span className="truncate">{patient.email || 'Sem e-mail'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs - Horizontal Scroll on Mobile */}
      <div className="sticky top-0 z-20 -mx-4 px-4 lg:mx-0 lg:px-0 py-2 lg:py-0 bg-white/90 backdrop-blur-lg lg:bg-transparent">
        <div className="flex overflow-x-auto no-scrollbar gap-1 p-1 bg-slate-50 lg:bg-white/60 lg:backdrop-blur-md rounded-xl lg:border lg:border-slate-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`
                flex items-center gap-2 px-4 lg:px-5 py-2.5 lg:py-3 rounded-lg 
                text-[11px] font-bold transition-all whitespace-nowrap flex-shrink-0
                ${activeTab === tab.id
                  ? 'bg-nutri-blue text-white'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white'
                }
              `}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label.toUpperCase()}</span>
              <span className="sm:hidden">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[400px] lg:min-h-[500px]">
        {activeTab === 'resumo' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 animate-in fade-in duration-300">
            <div className="lg:col-span-2 space-y-4 lg:space-y-6">
              {/* Stats Cards - Mobile Grid */}
              <div className="grid grid-cols-3 gap-3 lg:hidden">
                <div className="bg-white p-4 rounded-xl border border-slate-100 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Peso</p>
                  <p className="text-xl font-black text-slate-800 mt-1">
                    {lastRecord?.bioimpedancia?.peso || '0.0'}
                  </p>
                  <p className="text-[10px] text-slate-400">kg</p>
                </div>
                <div className="bg-nutri-blue/5 p-4 rounded-xl border border-nutri-blue/10 text-center">
                  <p className="text-[10px] font-bold text-nutri-blue/60 uppercase">Gordura</p>
                  <p className="text-xl font-black text-nutri-blue mt-1">
                    {lastRecord?.bioimpedancia?.percentualGordura || '0.0'}
                  </p>
                  <p className="text-[10px] text-nutri-blue/60">%</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 text-center">
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Cintura</p>
                  <p className="text-xl font-black text-slate-800 mt-1">
                    {lastRecord?.medicoes?.perimetria?.cintura || '0.0'}
                  </p>
                  <p className="text-[10px] text-slate-400">cm</p>
                </div>
              </div>

              {/* Desktop Stats */}
              <div className="hidden lg:block bg-white p-6 rounded-xl border border-slate-100/60">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-6 flex items-center gap-3">
                  <TrendingUp size={20} className="text-nutri-blue" /> Resumo Evolutivo
                </h3>
                <div className="grid grid-cols-3 gap-6">
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Peso Atual</p>
                    <p className="text-3xl font-black text-slate-800">
                      {lastRecord?.bioimpedancia?.peso || '0.0'} <span className="text-sm">kg</span>
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-nutri-blue/5 border border-nutri-blue/10">
                    <p className="text-[10px] font-black text-nutri-blue/60 uppercase tracking-widest mb-2">Gordura</p>
                    <p className="text-3xl font-black text-nutri-blue">
                      {lastRecord?.bioimpedancia?.percentualGordura || '0.0'}<span className="text-sm">%</span>
                    </p>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Cintura</p>
                    <p className="text-3xl font-black text-slate-800">
                      {lastRecord?.medicoes?.perimetria?.cintura || '0.0'}<span className="text-sm">cm</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Active Prescription */}
              <div className="bg-white p-4 lg:p-6 rounded-xl border border-slate-100/60">
                <div className="flex items-center justify-between mb-4 lg:mb-6">
                  <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Utensils size={16} className="text-nutri-blue" /> Prescrição
                  </h3>
                  <button
                    onClick={() => setActiveTab('planos')}
                    className="text-[10px] font-black text-nutri-blue uppercase tracking-widest flex items-center gap-1"
                  >
                    Ver tudo <ChevronRight size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2 lg:gap-4">
                  {['Café da Manhã', 'Almoço', 'Lanche', 'Jantar'].map((meal, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 lg:p-4 rounded-xl bg-slate-50 border border-slate-100 hover:bg-white transition-colors cursor-pointer group"
                    >
                      <span className="text-sm font-bold text-slate-700 group-hover:text-nutri-blue">{meal}</span>
                      <ChevronRight size={16} className="text-slate-300 group-hover:text-nutri-blue" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-4 lg:space-y-6">
              <div className="bg-white p-4 lg:p-6 rounded-xl border border-slate-100/60">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-4">Próx. Consulta</h3>
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 border-l-4 border-l-amber-400">
                  <p className="text-xs text-amber-700 font-medium">Verificar exames e evolução das medidas.</p>
                </div>
              </div>

              <div className="hidden lg:block bg-slate-900 p-6 rounded-2xl text-white relative overflow-hidden">
                <h3 className="text-[10px] font-black text-nutri-blue mb-4 uppercase tracking-[0.2em]">Insights</h3>
                <p className="text-sm text-slate-300 font-medium italic leading-relaxed">
                  "Mantenha o acompanhamento para ajustes finos na conduta nutricional."
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'prontuario' && <PatientRecord patient={patient} onBack={() => setActiveTab('resumo')} />}
        {activeTab === 'evolucao' && <PatientEvolution patient={patient} onBack={() => setActiveTab('resumo')} />}
        {activeTab === 'planos' && <MealPlanCreator patientId={patient.id} patientName={patient.name} onBack={() => setActiveTab('resumo')} />}
        {activeTab === 'relatorios' && <ReportGenerator patient={patient} onBack={() => setActiveTab('resumo')} />}
      </div>
    </div>
  );
};

export default PatientDetail;
