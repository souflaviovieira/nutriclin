
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  Users, 
  Download, 
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Target,
  PieChart as PieChartIcon,
  CreditCard,
  UserPlus,
  CheckCircle2,
  CalendarCheck,
  RotateCcw,
  BarChart3,
  LineChart as LineChartIcon,
  ChevronRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Legend,
  ComposedChart
} from 'recharts';

interface FinanceManagerProps {
  onBack: () => void;
}

// --- MOCK DATA ---

const STATS_DATA = {
  weekly: [
    { label: 'Novos Pacientes', value: '12', trend: 8, icon: <UserPlus size={18} /> },
    { label: 'Consultas Agendadas', value: '28', trend: 4, icon: <Calendar size={18} /> },
    { label: 'Consultas Realizadas', value: '24', trend: 2, icon: <CheckCircle2 size={18} /> },
    { label: 'Retornos', value: '8', trend: -5, icon: <RotateCcw size={18} /> },
  ],
  monthly: [
    { label: 'Novos Pacientes', value: '48', trend: 12.5, icon: <UserPlus size={18} /> },
    { label: 'Consultas Agendadas', value: '112', trend: 4.2, icon: <Calendar size={18} /> },
    { label: 'Consultas Realizadas', value: '104', trend: 2.1, icon: <CheckCircle2 size={18} /> },
    { label: 'Retornos', value: '32', trend: 11, icon: <RotateCcw size={18} /> },
  ],
  yearly: [
    { label: 'Novos Pacientes', value: '542', trend: 15, icon: <UserPlus size={18} /> },
    { label: 'Consultas Agendadas', value: '1.240', trend: 8, icon: <Calendar size={18} /> },
    { label: 'Consultas Realizadas', value: '1.180', trend: 9, icon: <CheckCircle2 size={18} /> },
    { label: 'Retornos', value: '380', trend: 5, icon: <RotateCcw size={18} /> },
  ]
};

const REVENUE_SOURCES = [
  { name: 'Primeira Consulta', value: 4500, color: '#84d1c1' },
  { name: 'Acompanhamento Mensal', value: 3800, color: '#60A5FA' },
  { name: 'Avaliação Corporal', value: 2100, color: '#A78BFA' },
  { name: 'Laudo / Receitas', value: 1200, color: '#FACC15' },
  { name: 'Outros', value: 800, color: '#9CA3AF' },
];

const PROJECTION_DATA = [
  { name: 'Jan', real: 12000, proj: 12000 },
  { name: 'Fev', real: 13500, proj: 13500 },
  { name: 'Mar', real: 15420, proj: 15420 },
  { name: 'Abr', real: 0, proj: 17200 },
  { name: 'Mai', real: 0, proj: 18500 },
  { name: 'Jun', real: 0, proj: 20000 },
];

const ATTENDANCE_DONUTS = {
  pacientes: [
    { name: 'Ativos', value: 124, color: '#84d1c1' },
    { name: 'Inativos', value: 42, color: '#E5E7EB' },
  ],
  consultas: [
    { name: 'Agendadas', value: 28, color: '#60A5FA' },
    { name: 'Realizadas', value: 104, color: '#84d1c1' },
  ],
  retornos: [
    { name: 'Novo agendamento', value: 32, color: '#A78BFA' },
    { name: 'Inativos', value: 18, color: '#E5E7EB' },
  ]
};

const EVOLUTION_DATA = [
  { name: 'Sem 1', pacientes: 8, atendimentos: 12, receita: 3200, meta: 3000 },
  { name: 'Sem 2', pacientes: 10, atendimentos: 15, receita: 3800, meta: 3500 },
  { name: 'Sem 3', pacientes: 12, atendimentos: 14, receita: 3500, meta: 4000 },
  { name: 'Sem 4', pacientes: 15, atendimentos: 20, receita: 4920, meta: 4500 },
];

const PAYMENT_METHODS = [
  { name: 'PIX', value: 65, color: '#84d1c1' },
  { name: 'Cartão de Crédito', value: 25, color: '#60A5FA' },
  { name: 'Dinheiro', value: 10, color: '#9CA3AF' },
];

// --- COMPONENTS ---

const SectionHeader = ({ title, period, setPeriod, options = ['semana', 'mês', 'ano'] }: any) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
    <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{title}</h3>
    <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
      {options.map((opt: string) => (
        <button
          key={opt}
          onClick={() => setPeriod(opt)}
          className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
            period === opt ? 'bg-white text-nutri-blue shadow-sm' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  </div>
);

const FinanceManager: React.FC<FinanceManagerProps> = ({ onBack }) => {
  const [statsPeriod, setStatsPeriod] = useState('mês');
  const [attendPeriod, setAttendPeriod] = useState('mês');
  const [evolPeriod, setEvolPeriod] = useState('mês');
  const [goalPeriod, setGoalPeriod] = useState('Mensal');

  const currentStats = statsPeriod === 'semana' ? STATS_DATA.weekly : statsPeriod === 'ano' ? STATS_DATA.yearly : STATS_DATA.monthly;

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-24 px-1 md:px-4">
      
      {/* HEADER PRINCIPAL */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 hover:text-nutri-blue transition-all border border-transparent hover:border-slate-100">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tighter">Relatórios</h1>
            <p className="text-slate-500 text-sm font-medium">Acompanhe a performance estratégica e os indicadores da sua clínica.</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
            <Download size={18} /> Exportar Planilha
          </button>
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-8 py-3.5 bg-nutri-blue text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-nutri-blue/20 hover:bg-nutri-blue-hover transition-all active:scale-95">
            <Filter size={18} strokeWidth={2.5} /> Filtrar Data
          </button>
        </div>
      </header>

      {/* QUADRO ESTATÍSTICAS */}
      <section className="bg-white p-6 md:p-10 rounded-[40px] border border-slate-100 shadow-sm">
        <SectionHeader title="Quadro Estatísticas" period={statsPeriod} setPeriod={setStatsPeriod} />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {currentStats.map((stat, idx) => (
            <div key={idx} className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50 hover:border-nutri-blue/20 hover:bg-white transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white rounded-2xl text-nutri-blue shadow-sm group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full ${stat.trend > 0 ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                  {stat.trend > 0 ? <ArrowUpRight size={10} /> : <ArrowDownRight size={10} />}
                  {Math.abs(stat.trend)}%
                </div>
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
              <h2 className="text-3xl font-black text-slate-800 mt-2 tracking-tighter">{stat.value}</h2>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Origem Receitas */}
          <div className="space-y-6">
             <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                   <BarChart3 size={16} className="text-nutri-blue" /> Barra Origem Receitas
                </h4>
             </div>
             <div className="bg-slate-50/30 p-8 rounded-[32px] border border-slate-100 space-y-6">
                {REVENUE_SOURCES.map((source, i) => {
                  const percentage = (source.value / 12400) * 100;
                  return (
                    <div key={i} className="space-y-2">
                       <div className="flex justify-between text-[11px] font-black uppercase tracking-tighter">
                          <span className="text-slate-500">{source.name}</span>
                          <span className="text-slate-800">R$ {source.value.toLocaleString('pt-BR')}</span>
                       </div>
                       <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-1000" 
                            style={{ width: `${percentage}%`, backgroundColor: source.color }}
                          ></div>
                       </div>
                    </div>
                  );
                })}
             </div>
          </div>

          {/* Projeções Faturamento */}
          <div className="space-y-6">
             <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp size={16} className="text-nutri-blue" /> Projeções Faturamento
             </h4>
             <div className="bg-slate-50/30 p-8 rounded-[32px] border border-slate-100 h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={PROJECTION_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} tickFormatter={v => `R$${v/1000}k`} />
                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="real" name="Realizado" fill="#84d1c1" radius={[6, 6, 0, 0]} />
                    <Line type="monotone" dataKey="proj" name="Projeção" stroke="#60A5FA" strokeWidth={3} strokeDasharray="5 5" dot={{ r: 4, fill: '#60A5FA' }} />
                  </ComposedChart>
                </ResponsiveContainer>
             </div>
          </div>
        </div>
      </section>

      {/* QUADRO ATENDIMENTOS */}
      <section className="bg-white p-6 md:p-10 rounded-[40px] border border-slate-100 shadow-sm">
        <SectionHeader title="Quadro Atendimentos" period={attendPeriod} setPeriod={setAttendPeriod} />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { label: 'Rosca Pacientes', data: ATTENDANCE_DONUTS.pacientes },
             { label: 'Rosca Consultas', data: ATTENDANCE_DONUTS.consultas },
             { label: 'Rosca Retornos', data: ATTENDANCE_DONUTS.retornos }
           ].map((donut, idx) => (
             <div key={idx} className="bg-slate-50/30 p-8 rounded-[32px] border border-slate-100 flex flex-col items-center">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">{donut.label}</h4>
                <div className="h-48 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={donut.data}
                        innerRadius={50}
                        outerRadius={75}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                      >
                        {donut.data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend 
                        verticalAlign="bottom" 
                        align="center" 
                        iconType="circle"
                        formatter={(value) => <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{value}</span>} 
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 text-center">
                   <p className="text-2xl font-black text-slate-800 tracking-tighter">{donut.data.reduce((s, d) => s + d.value, 0)}</p>
                   <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mt-1">Total</p>
                </div>
             </div>
           ))}
        </div>
      </section>

      {/* QUADRO EVOLUÇÕES */}
      <section className="bg-white p-6 md:p-10 rounded-[40px] border border-slate-100 shadow-sm">
        <SectionHeader title="Quadro Evoluções" period={evolPeriod} setPeriod={setEvolPeriod} options={['semana', 'mês', 'semestre', 'ano']} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Pacientes & Atendimentos */}
          <div className="space-y-6">
             <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <LineChartIcon size={16} className="text-nutri-blue" /> Evolução de Volume
             </h4>
             <div className="bg-slate-50/30 p-8 rounded-[32px] border border-slate-100 h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={EVOLUTION_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                    <Tooltip contentStyle={{ borderRadius: '20px', border: 'none' }} />
                    <Legend iconType="circle" />
                    <Line type="monotone" dataKey="pacientes" name="Pacientes" stroke="#84d1c1" strokeWidth={4} dot={{ r: 6, fill: '#84d1c1', strokeWidth: 2, stroke: '#fff' }} />
                    <Line type="monotone" dataKey="atendimentos" name="Atendimentos" stroke="#60A5FA" strokeWidth={4} dot={{ r: 6, fill: '#60A5FA', strokeWidth: 2, stroke: '#fff' }} />
                  </LineChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Resultados x Meta */}
          <div className="space-y-6">
             <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                   <Target size={16} className="text-nutri-blue" /> Resultados x Meta
                </h4>
                <div className="flex bg-slate-50 p-1 rounded-xl">
                  {['Semanal', 'Mensal', 'Trimestral'].map(p => (
                    <button 
                      key={p} 
                      onClick={() => setGoalPeriod(p)}
                      className={`px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${goalPeriod === p ? 'bg-white text-nutri-blue shadow-sm' : 'text-slate-400'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
             </div>
             <div className="bg-slate-50/30 p-8 rounded-[32px] border border-slate-100 h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={EVOLUTION_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} tickFormatter={v => `R$${v/1000}k`} />
                    <Tooltip />
                    <Bar dataKey="receita" name="Receita Real" fill="#84d1c1" radius={[6, 6, 0, 0]} />
                    <Line type="stepAfter" dataKey="meta" name="Meta Estipulada" stroke="#A78BFA" strokeWidth={3} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Método de Pagamento */}
          <div className="space-y-6 lg:col-span-2">
             <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <CreditCard size={16} className="text-nutri-blue" /> Gráfico pizza Método de Pagamento
             </h4>
             <div className="bg-slate-50/30 p-10 rounded-[32px] border border-slate-100 flex flex-col md:flex-row items-center justify-center gap-12">
                <div className="h-64 w-64">
                   <ResponsiveContainer width="100%" height="100%">
                     <PieChart>
                       <Pie
                         data={PAYMENT_METHODS}
                         innerRadius={60}
                         outerRadius={100}
                         paddingAngle={8}
                         dataKey="value"
                         stroke="none"
                       >
                         {PAYMENT_METHODS.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={entry.color} />
                         ))}
                       </Pie>
                       <Tooltip />
                     </PieChart>
                   </ResponsiveContainer>
                </div>
                <div className="flex-1 max-w-md space-y-6">
                   {PAYMENT_METHODS.map((method, idx) => (
                     <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                           <span className="text-slate-400 flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: method.color}}></div>
                              {method.name}
                           </span>
                           <span className="text-slate-800">{method.value}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                           <div className="h-full rounded-full transition-all duration-1000" style={{backgroundColor: method.color, width: `${method.value}%`}}></div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* TABELA TRANSAÇÕES RECENTES */}
      <section className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 md:p-10 border-b border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-slate-100 rounded-2xl text-slate-500">
                <CreditCard size={22} />
             </div>
             <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">Transações Recentes</h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Controle de caixa detalhado</p>
             </div>
          </div>
          <button className="text-xs font-black text-nutri-blue uppercase tracking-widest hover:underline">Ver todas</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Paciente</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Serviço</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Método</th>
                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Valor</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {[
                { patient: 'Ana Maria Silva', service: 'Acompanhamento Mensal', date: 'Hoje, 09:45', method: 'PIX', amount: '250,00' },
                { patient: 'Ricardo Santos', service: 'Primeira Consulta', date: 'Hoje, 11:30', method: 'Cartão', amount: '420,00' },
                { patient: 'Beatriz Oliveira', service: 'Avaliação Corporal', date: 'Ontem', method: 'Boleto', amount: '180,00' },
                { patient: 'Marcos Pereira', service: 'Retorno Nutricional', date: 'Ontem', method: 'PIX', amount: '180,00' },
              ].map((t, idx) => (
                <tr key={idx} className="hover:bg-slate-50/30 transition-colors group cursor-pointer">
                  <td className="px-10 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xs font-black text-slate-400 group-hover:bg-nutri-blue/10 group-hover:text-nutri-blue transition-colors">
                        {t.patient.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-slate-700">{t.patient}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-500">{t.service}</td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-500">{t.date}</td>
                  <td className="px-8 py-5">
                    <span className="text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                      {t.method}
                    </span>
                  </td>
                  <td className="px-10 py-5 text-right">
                    <span className="text-base font-black text-slate-800">R$ {t.amount}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* QUICK TIP FOOTER */}
      <footer className="text-center opacity-40 hover:opacity-100 transition-opacity">
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] flex items-center justify-center gap-3">
            <TrendingUp size={14}/> NutriDash Business Intelligence
         </p>
      </footer>
    </div>
  );
};

export default FinanceManager;
