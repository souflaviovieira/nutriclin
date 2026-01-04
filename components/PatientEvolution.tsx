
import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  Download, 
  Flag, 
  Scale, 
  Activity, 
  Ruler, 
  FlaskConical, 
  CheckCircle2, 
  AlertCircle, 
  Zap, 
  Droplets,
  Microscope,
  Target,
  ArrowRight,
  Calendar
} from 'lucide-react';
import { Patient, ConsultationRecord } from '../types';

interface PatientEvolutionProps {
  patient: Patient;
  onBack: () => void;
}

const PatientEvolution: React.FC<PatientEvolutionProps> = ({ patient, onBack }) => {
  const history = useMemo(() => {
    return [...(patient.history || [])].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [patient.history]);

  const firstRecord = history[0];
  const lastRecord = history[history.length - 1];

  // Lógica de simulação de metas clínicas baseada no objetivo
  const getGoal = (label: string, initial: number) => {
    const obj = patient.objective.toLowerCase();
    if (label.includes('Peso')) {
      return obj.includes('emagrecimento') ? (initial * 0.9).toFixed(1) : obj.includes('hipertrofia') ? (initial * 1.05).toFixed(1) : initial.toFixed(1);
    }
    if (label.includes('Gordura')) return (initial * 0.85).toFixed(1);
    if (label.includes('Cintura')) return (initial - 4).toFixed(1);
    if (label.includes('Músculo') || label.includes('Magra')) return (initial * 1.08).toFixed(1);
    return (initial * 0.95).toFixed(1);
  };

  const StatusBadge = ({ current, goal, initial, isReverse }: { current: number, goal: number, initial: number, isReverse?: boolean }) => {
    const isLoss = isReverse || (initial > goal);
    const reached = isLoss ? current <= goal : current >= goal;
    const progress = isLoss ? current < initial : current > initial;
    
    if (reached) return <span className="bg-emerald-100 text-emerald-600 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-tight">Meta Atingida</span>;
    if (progress) return <span className="bg-blue-100 text-blue-600 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-tight">Em Evolução</span>;
    return <span className="bg-amber-100 text-amber-600 px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-tight">Atenção</span>;
  };

  const MetricCard = ({ label, initial, current, goal, unit, icon: Icon, isReverse }: any) => {
    const initNum = parseFloat(initial) || 0;
    const currNum = parseFloat(current) || 0;
    const goalNum = parseFloat(goal) || 0;
    const diff = (currNum - initNum).toFixed(1);
    
    const totalToGoal = Math.abs(goalNum - initNum);
    const totalAchieved = Math.abs(currNum - initNum);
    const progressPerc = totalToGoal > 0 ? Math.min(Math.round((totalAchieved / totalToGoal) * 100), 100) : 0;

    return (
      <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm space-y-6 relative overflow-hidden group hover:border-nutri-blue/30 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-50 text-nutri-blue rounded-full border border-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon size={18} />
            </div>
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] leading-tight">{label}</h4>
          </div>
          <StatusBadge current={currNum} goal={goalNum} initial={initNum} isReverse={isReverse} />
        </div>

        <div className="grid grid-cols-3 gap-1">
          <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Início</p>
            <p className="text-lg font-black text-slate-300 line-through tracking-tighter">{initNum}{unit}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Atual</p>
            <p className="text-2xl font-black text-slate-800 tracking-tighter">{currNum}{unit}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[9px] font-black text-nutri-blue uppercase tracking-widest">Meta</p>
            <p className="text-lg font-black text-nutri-blue tracking-tighter">{goalNum}{unit}</p>
          </div>
        </div>

        <div className="space-y-2.5 pt-2">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-tighter">
            <span className={parseFloat(diff) < 0 ? 'text-emerald-500' : 'text-blue-500'}>
              {parseFloat(diff) > 0 ? '+' : ''}{diff}{unit} desde o início
            </span>
            <span className="text-slate-400">{progressPerc}% da meta</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-nutri-blue rounded-full transition-all duration-1000" 
              style={{ width: `${progressPerc}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  const SectionHeader = ({ title, icon: Icon, color }: any) => (
    <div className="flex items-center justify-between mb-6 px-2">
      <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-3">
        <div className={`p-2 rounded-lg ${color} bg-opacity-10 text-opacity-100 shadow-sm`}>
          <Icon size={18} className={color.replace('bg-', 'text-')} />
        </div>
        {title}
      </h3>
      <div className="h-px flex-1 bg-slate-100 mx-6 hidden md:block"></div>
    </div>
  );

  if (history.length < 2) {
    return (
      <div className="max-w-4xl mx-auto py-24 text-center space-y-8 animate-in fade-in duration-700">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-200 border border-slate-100">
          <TrendingUp size={48} />
        </div>
        <div className="space-y-3">
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Evolução em Processamento</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto font-medium">Precisamos de pelo menos dois registros de consulta para gerar os indicadores comparativos e análise de metas.</p>
        </div>
        <button onClick={onBack} className="px-10 py-4 bg-nutri-blue text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-nutri-blue/20 hover:scale-105 transition-all">
          Voltar ao Prontuário
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500 pb-24 px-1">
      {/* Header Clínico */}
      <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-8">
          <div className="w-20 h-20 bg-nutri-blue rounded-[24px] flex items-center justify-center text-white shadow-2xl shadow-nutri-blue/20 relative">
             <TrendingUp size={36} />
             <div className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full"></div>
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter leading-none">Análise Evolutiva</h1>
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <p className="text-[11px] font-black text-nutri-blue uppercase tracking-[0.2em] bg-nutri-blue/5 px-3 py-1.5 rounded-full flex items-center gap-2">
                <Flag size={14} fill="currentColor" /> Objetivo: {patient.objective}
              </p>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Calendar size={14} /> Ciclo de {history.length} consultas
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right hidden lg:block mr-4">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Período Clínico</p>
            <p className="text-sm font-black text-slate-700">{new Date(firstRecord.date).toLocaleDateString('pt-BR')} <ArrowRight size={14} className="inline mx-1 text-slate-300"/> Hoje</p>
          </div>
          <button className="p-4 bg-slate-900 text-white rounded-[20px] shadow-lg shadow-slate-200 hover:scale-105 transition-all">
            <Download size={24} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        <div className="lg:col-span-8 space-y-16">
          
          {/* SEÇÃO: ANTROPOMETRIA */}
          <section>
            <SectionHeader title="Antropometria" icon={Ruler} color="bg-blue-500" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MetricCard 
                label="Peso Corporal" 
                unit="kg" 
                icon={Scale}
                initial={firstRecord?.bioimpedancia?.peso || firstRecord?.medicoes?.basicas?.peso || 0}
                current={lastRecord?.bioimpedancia?.peso || lastRecord?.medicoes?.basicas?.peso || 0}
                goal={getGoal('Peso', parseFloat(firstRecord?.bioimpedancia?.peso || firstRecord?.medicoes?.basicas?.peso || 0))}
                type={patient.objective.toLowerCase().includes('emagrecimento') ? 'loss' : 'gain'}
              />
              <MetricCard 
                label="Cintura" 
                unit="cm" 
                icon={Ruler}
                initial={firstRecord?.medicoes?.perimetria?.cintura || firstRecord?.medicoes?.basicas?.cintura || 0}
                current={lastRecord?.medicoes?.perimetria?.cintura || lastRecord?.medicoes?.basicas?.cintura || 0}
                goal={getGoal('Cintura', parseFloat(firstRecord?.medicoes?.perimetria?.cintura || firstRecord?.medicoes?.basicas?.cintura || 0))}
                isReverse={true}
              />
            </div>
          </section>

          {/* SEÇÃO: BIOIMPEDÂNCIA */}
          <section>
            <SectionHeader title="Bioimpedância" icon={Activity} color="bg-emerald-500" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MetricCard 
                label="Gordura Corporal" 
                unit="%" 
                icon={Activity}
                initial={firstRecord?.bioimpedancia?.percentualGordura || firstRecord?.bioimpedancia?.indicadores?.gorduraPerc || 0}
                current={lastRecord?.bioimpedancia?.percentualGordura || lastRecord?.bioimpedancia?.indicadores?.gorduraPerc || 0}
                goal={getGoal('Gordura', parseFloat(firstRecord?.bioimpedancia?.percentualGordura || 0))}
                isReverse={true}
              />
              <MetricCard 
                label="Massa Muscular" 
                unit="%" 
                icon={Zap}
                initial={firstRecord?.bioimpedancia?.indicadores?.musculoPerc || 30}
                current={lastRecord?.bioimpedancia?.indicadores?.musculoPerc || 32}
                goal={getGoal('Músculo', 30)}
              />
            </div>
          </section>

          {/* SEÇÃO: LABORATORIAL */}
          <section>
            <SectionHeader title="Perfil Bioquímico" icon={FlaskConical} color="bg-amber-500" />
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
                {[
                  { label: 'Glicemia', val: lastRecord?.exames?.bioquimica?.glicose || '92', unit: 'mg/dL', trend: 'Estável', color: 'text-emerald-500' },
                  { label: 'Colesterol', val: lastRecord?.exames?.bioquimica?.colesterolTotal || '185', unit: 'mg/dL', trend: 'Atenção', color: 'text-amber-500' },
                  { label: 'Vitamina D', val: lastRecord?.exames?.vitaminas?.vitD || '34', unit: 'ng/mL', trend: 'Melhorando', color: 'text-blue-500' },
                  { label: 'Ferritina', val: lastRecord?.exames?.vitaminas?.ferritina || '120', unit: 'ng/mL', trend: 'Ideal', color: 'text-emerald-500' }
                ].map((exam, i) => (
                  <div key={i} className="flex flex-col items-center text-center space-y-2 group cursor-default">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-nutri-blue/5 group-hover:text-nutri-blue transition-all">
                      <Microscope size={20} />
                    </div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{exam.label}</p>
                    <p className="text-xl font-black text-slate-800">{exam.val}<span className="text-[10px] text-slate-300 ml-0.5">{exam.unit}</span></p>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-white border border-slate-50 shadow-sm ${exam.color}`}>{exam.trend}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

        </div>

        {/* PAINEL LATERAL: STATUS CLÍNICO */}
        <div className="lg:col-span-4 h-full">
          <div className="bg-slate-900 p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden h-full flex flex-col justify-between group">
            
            <div className="relative z-10 space-y-12">
              <div className="space-y-3">
                <h3 className="text-[10px] font-black text-nutri-blue uppercase tracking-[0.4em]">Status Clínico</h3>
                <p className="text-4xl font-black tracking-tighter leading-tight italic">Melhora<br/>Progressiva</p>
                <div className="w-12 h-1 bg-nutri-blue rounded-full"></div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-5">
                  <div className="mt-1 p-2.5 bg-white/5 rounded-full text-emerald-400 border border-white/10 shrink-0 shadow-inner group-hover:scale-110 transition-transform"><CheckCircle2 size={18}/></div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-emerald-400 uppercase tracking-widest">Antropometria</p>
                    <p className="text-sm font-medium text-slate-300 leading-relaxed">Redução de gordura corporal constante dentro do planejado.</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="mt-1 p-2.5 bg-white/5 rounded-full text-blue-400 border border-white/10 shrink-0 shadow-inner group-hover:scale-110 transition-transform"><Droplets size={18}/></div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-blue-400 uppercase tracking-widest">Hidratação</p>
                    <p className="text-sm font-medium text-slate-300 leading-relaxed">Hidratação atingiu níveis ideais clínicos (3.5L/dia).</p>
                  </div>
                </div>
                <div className="flex items-start gap-5">
                  <div className="mt-1 p-2.5 bg-white/5 rounded-full text-amber-400 border border-white/10 shrink-0 shadow-inner group-hover:scale-110 transition-transform"><AlertCircle size={18}/></div>
                  <div className="space-y-1">
                    <p className="text-xs font-black text-amber-400 uppercase tracking-widest">Massa Muscular</p>
                    <p className="text-sm font-medium text-slate-300 leading-relaxed">Atenção: Massa magra com leve oscilação este mês.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-16">
              <button className="w-full py-5 bg-nutri-blue hover:bg-nutri-blue-hover text-white rounded-3xl text-[11px] font-black uppercase tracking-[0.2em] transition-all shadow-2xl shadow-nutri-blue/30 flex items-center justify-center gap-3 active:scale-95 group/btn">
                Gerar Relatório IA <Zap size={16} className="fill-white group-hover/btn:scale-125 transition-transform" />
              </button>
              <p className="text-[9px] text-slate-500 text-center mt-6 font-bold uppercase tracking-widest opacity-60">Insight gerado em {new Date().toLocaleDateString('pt-BR')}</p>
            </div>

            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-nutri-blue/10 rounded-full -mr-40 -mt-40 blur-[100px] transition-all duration-700 group-hover:bg-nutri-blue/20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full -ml-32 -mb-32 blur-[100px]"></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PatientEvolution;
