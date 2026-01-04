
import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  FileText, 
  CheckCircle2, 
  Download, 
  Layout, 
  Settings, 
  Image as ImageIcon,
  Printer,
  ShieldCheck,
  User,
  Activity,
  Droplets,
  Flame,
  Weight,
  Heart,
  Dna,
  Zap,
  CheckSquare,
  Utensils,
  TrendingUp,
  ClipboardCheck,
  FlaskConical,
  DollarSign,
  ChevronRight,
  Info,
  ChevronDown,
  Apple,
  Mail,
  Phone,
  MapPin,
  X
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Patient } from '../types';

interface ReportGeneratorProps {
  onBack: () => void;
  patient: Patient;
}

type DeliverableType = 'bioimpedancia' | 'plano' | 'evolucao' | 'clinico' | 'laudo' | 'exames' | 'recibo';

interface Deliverable {
  id: DeliverableType;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const DELIVERABLES: Deliverable[] = [
  { id: 'bioimpedancia', label: 'Avaliação Corporal (Bioimpedância)', description: 'Indicadores de composição corporal, TMB e idade metabólica.', icon: <Activity />, color: 'text-emerald-500 bg-emerald-50' },
  { id: 'plano', label: 'Plano Alimentar Completo', description: 'Cardápio, substituições, receitas e recomendações.', icon: <Utensils />, color: 'text-nutri-blue bg-nutri-blue/10' },
  { id: 'evolucao', label: 'Relatório de Evolução', description: 'Comparativo de resultados e progresso das metas.', icon: <TrendingUp />, color: 'text-blue-500 bg-blue-50' },
  { id: 'clinico', label: 'Relatório Clínico', description: 'Diagnóstico nutricional e conduta detalhada.', icon: <FileText />, color: 'text-amber-500 bg-amber-50' },
  { id: 'laudo', label: 'Laudo Nutricional', description: 'Documento formal para fins médicos ou judiciais.', icon: <ClipboardCheck />, color: 'text-purple-500 bg-purple-50' },
  { id: 'exames', label: 'Pedido de Exames', description: 'Solicitação estruturada de exames laboratoriais.', icon: <FlaskConical />, color: 'text-rose-500 bg-rose-50' },
  { id: 'recibo', label: 'Recibo de Pagamento', description: 'Comprovante fiscal de serviços prestados.', icon: <DollarSign />, color: 'text-slate-600 bg-slate-100' },
];

const A4Document: React.FC<{ 
  title: string; 
  patient: Patient; 
  children: React.ReactNode; 
  onClose: () => void;
}> = ({ title, patient, children, onClose }) => {
  const dateStr = new Date().toLocaleDateString('pt-BR');
  
  return (
    <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-start justify-center overflow-y-auto p-4 sm:p-6 no-scrollbar animate-in fade-in duration-300">
      <div className="bg-white w-full sm:w-[210mm] min-h-[297mm] shadow-2xl p-8 sm:p-[15mm] relative mb-20 animate-in zoom-in-95 duration-500">
        
        {/* Actions Overlay (Hidden on print) */}
        <div className="absolute right-4 top-4 flex gap-3 print:hidden">
          <button onClick={() => window.print()} className="p-3 bg-nutri-blue text-white rounded-full shadow-lg hover:bg-nutri-blue-hover transition-all"><Printer size={20} /></button>
          <button onClick={onClose} className="p-3 bg-white text-slate-400 rounded-full shadow-lg hover:text-slate-800 transition-all"><X size={20} /></button>
        </div>

        {/* Standard Header */}
        <header className="flex justify-between items-start border-b-2 border-slate-100 pb-8 mb-8">
           <div className="flex items-center gap-4">
              <div className="bg-nutri-blue p-2.5 rounded-xl text-white">
                 <Apple size={32} fill="white" />
              </div>
              <div>
                 <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">NutriDash Clinic</h1>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Gestão Nutricional Profissional</p>
              </div>
           </div>
           <div className="text-right space-y-1">
              <h2 className="text-sm font-black text-nutri-blue uppercase tracking-widest">{title}</h2>
              <p className="text-xs font-bold text-slate-500">Emitido em: {dateStr}</p>
           </div>
        </header>

        {/* Patient Box */}
        <div className="grid grid-cols-2 gap-8 bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-10">
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Paciente</p>
              <p className="text-sm font-black text-slate-800 uppercase">{patient.name}</p>
           </div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Objetivo Clínico</p>
              <p className="text-sm font-black text-slate-800 uppercase">{patient.objective}</p>
           </div>
        </div>

        {/* Document Content */}
        <div className="min-h-[180mm] prose prose-slate max-w-none">
           {children}
        </div>

        {/* Standard Footer */}
        <footer className="mt-auto pt-10 border-t border-slate-100">
           <div className="flex justify-between items-end gap-12">
              <div className="flex-1 space-y-2">
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Observações Legais</p>
                 <p className="text-[10px] text-slate-400 leading-relaxed italic">
                   Este documento é de uso exclusivo para fins informativos e clínicos. Sua validade depende da assinatura e carimbo do profissional habilitado. Gerado eletronicamente via NutriDash Pro.
                 </p>
              </div>
              <div className="text-center w-64 shrink-0">
                 <div className="w-full h-px bg-slate-200 mb-3"></div>
                 <p className="text-xs font-black text-slate-900">Dra. Letícia Rosa</p>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Nutricionista Clínica • CRN-3 12345/P</p>
                 <div className="mt-3 flex items-center justify-center gap-2 text-emerald-500 font-black text-[7px] uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                    <ShieldCheck size={10} /> Documento Autenticado
                 </div>
              </div>
           </div>
        </footer>
      </div>
    </div>
  );
};

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ onBack, patient }) => {
  const [activeType, setActiveType] = useState<DeliverableType | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Editor States
  const [clinicoContent, setClinicoContent] = useState('Paciente apresenta quadro de leve desidratação e necessidade de ajuste calórico para hipertrofia.');
  const [laudoContent, setLaudoContent] = useState('Declaro para os devidos fins que o paciente encontra-se sob acompanhamento nutricional regular.');
  const [examesContent, setExamesContent] = useState('- Hemograma Completo\n- Glicemia de Jejum\n- Perfil Lipídico\n- Vitamina D (25-hidroxi)');
  const [reciboValor, setReciboValor] = useState('250,00');

  const renderEditor = () => {
    switch (activeType) {
      case 'bioimpedancia':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 flex items-start gap-4">
              <Info className="text-emerald-600 shrink-0 mt-0.5" size={20} />
              <p className="text-sm text-emerald-700 leading-relaxed">
                Este relatório importa automaticamente os últimos dados registrados no histórico de Bioimpedância. Caso deseje alterar, edite no prontuário.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Peso Atual</p>
                <p className="text-lg font-black text-slate-800">68,0 kg</p>
              </div>
              <div className="p-4 bg-white border border-slate-100 rounded-xl shadow-sm">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">% Gordura</p>
                <p className="text-lg font-black text-slate-800">24,5 %</p>
              </div>
            </div>
          </div>
        );
      case 'clinico':
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Análise e Conduta Nutricional</label>
            <textarea 
              value={clinicoContent} 
              onChange={(e) => setClinicoContent(e.target.value)}
              className="w-full h-64 p-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-nutri-blue/10 focus:border-nutri-blue outline-none text-sm font-medium text-slate-700 resize-none transition-all"
            />
          </div>
        );
      case 'laudo':
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Conteúdo do Laudo</label>
            <textarea 
              value={laudoContent} 
              onChange={(e) => setLaudoContent(e.target.value)}
              className="w-full h-64 p-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-nutri-blue/10 focus:border-nutri-blue outline-none text-sm font-medium text-slate-700 resize-none transition-all"
            />
          </div>
        );
      case 'exames':
        return (
          <div className="space-y-4 animate-in fade-in duration-300">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lista de Exames Solicitados</label>
            <textarea 
              value={examesContent} 
              onChange={(e) => setExamesContent(e.target.value)}
              className="w-full h-64 p-6 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-nutri-blue/10 focus:border-nutri-blue outline-none text-sm font-bold text-slate-700 resize-none transition-all font-mono"
            />
          </div>
        );
      case 'recibo':
        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div className="max-w-xs">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Valor do Serviço (R$)</label>
              <div className="relative mt-2">
                 <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><DollarSign size={18}/></div>
                 <input 
                   type="text" 
                   value={reciboValor} 
                   onChange={(e) => setReciboValor(e.target.value)}
                   className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-nutri-blue/10 focus:border-nutri-blue text-lg font-black text-slate-800"
                 />
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
               <p className="text-xs text-slate-500">O recibo será emitido referente à consulta nutricional realizada na data de hoje.</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-4">
             <div className="w-16 h-16 bg-slate-100 text-slate-300 rounded-full flex items-center justify-center"><Layout size={32}/></div>
             <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-800">Selecione um entregável</h3>
                <p className="text-sm text-slate-500">Escolha um dos documentos ao lado para configurar e exportar.</p>
             </div>
          </div>
        );
    }
  };

  const renderPdfContent = () => {
    switch (activeType) {
      case 'bioimpedancia':
        return (
          <div className="space-y-12">
            <section className="grid grid-cols-3 gap-6">
              {[
                { label: 'Peso', val: '68,0', unit: 'kg' },
                { label: 'Gordura', val: '24,5', unit: '%' },
                { label: 'Muscular', val: '51,3', unit: 'kg' },
                { label: 'TMB', val: '1450', unit: 'kcal' },
                { label: 'Visceral', val: '4', unit: 'nv' },
                { label: 'Metabólica', val: '26', unit: 'anos' },
              ].map((m, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                   <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{m.label}</p>
                   <p className="text-xl font-black text-slate-800">{m.val} <span className="text-[10px] text-slate-400 font-bold">{m.unit}</span></p>
                </div>
              ))}
            </section>
            <section className="bg-emerald-50/50 p-8 rounded-2xl border border-emerald-100">
               <h3 className="text-xs font-black text-emerald-800 uppercase tracking-widest mb-4">Análise Sintética</h3>
               <p className="text-sm text-emerald-900 leading-relaxed">
                 Paciente apresenta composição corporal compatível com o estágio de treinamento atual. Redução de gordura visceral observada em relação à última avaliação.
               </p>
            </section>
          </div>
        );
      case 'clinico':
        return (
          <div className="space-y-8">
             <h3 className="text-sm font-black text-nutri-blue uppercase tracking-[0.2em] border-b border-slate-50 pb-2">Diagnóstico e Conduta</h3>
             <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{clinicoContent}</p>
          </div>
        );
      case 'laudo':
        return (
          <div className="space-y-8">
             <h3 className="text-sm font-black text-nutri-blue uppercase tracking-[0.2em] border-b border-slate-50 pb-2">Laudo Nutricional</h3>
             <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{laudoContent}</p>
          </div>
        );
      case 'exames':
        return (
          <div className="space-y-8">
             <h3 className="text-sm font-black text-nutri-blue uppercase tracking-[0.2em] border-b border-slate-50 pb-2">Solicitação de Exames</h3>
             <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                <p className="text-sm font-bold text-slate-700 leading-relaxed whitespace-pre-wrap font-mono">{examesContent}</p>
             </div>
             <p className="text-xs text-slate-400">Solicito a realização dos exames laboratoriais acima citados para fins de acompanhamento nutricional.</p>
          </div>
        );
      case 'recibo':
        return (
          <div className="space-y-12">
             <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-4">
                <p className="text-sm font-bold text-slate-700">Recebi de <span className="font-black uppercase">{patient.name}</span></p>
                <p className="text-sm text-slate-600">A quantia de:</p>
                <p className="text-3xl font-black text-slate-900">R$ {reciboValor}</p>
                <p className="text-xs text-slate-400 italic">Referente a serviços de consulta e assessoria nutricional.</p>
             </div>
             <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                <span>Local: São Paulo, SP</span>
                <span>CNPJ/CPF: 12.345.678/0001-90</span>
             </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {showPreview && activeType && (
        <A4Document 
          title={DELIVERABLES.find(d => d.id === activeType)?.label || 'Documento'} 
          patient={patient} 
          onClose={() => setShowPreview(false)}
        >
          {renderPdfContent()}
        </A4Document>
      )}

      {/* Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors border border-transparent hover:border-slate-100"><ArrowLeft size={20} /></button>
          <div className="min-w-0">
             <h1 className="text-xl font-black text-slate-800 tracking-tight leading-tight">Central de Entregáveis</h1>
             <p className="text-xs font-bold text-slate-400">Documentos profissionais para: <span className="text-nutri-blue">{patient.name}</span></p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
           {activeType && (
             <button 
               onClick={() => setShowPreview(true)}
               className="flex items-center gap-2 px-8 py-3 bg-nutri-blue text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-nutri-blue/20 hover:bg-nutri-blue-hover transition-all active:scale-95"
             >
                <Download size={18} /> Exportar Clínico
             </button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Selector Menu (4 columns) */}
        <div className="lg:col-span-4 space-y-3">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-4">Tipos de Documentos</h3>
          {DELIVERABLES.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveType(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group ${
                activeType === item.id 
                  ? 'bg-white border-nutri-blue shadow-lg shadow-nutri-blue/5' 
                  : 'bg-slate-50/50 border-transparent hover:bg-white hover:border-slate-200'
              }`}
            >
               <div className={`p-3 rounded-xl transition-all ${
                 activeType === item.id ? item.color : 'bg-white text-slate-300'
               }`}>
                  {item.icon}
               </div>
               <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-black tracking-tight leading-none ${activeType === item.id ? 'text-slate-800' : 'text-slate-500'}`}>{item.label}</h4>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium line-clamp-1">{item.description}</p>
               </div>
               <ChevronRight size={16} className={`transition-all ${activeType === item.id ? 'text-nutri-blue translate-x-1' : 'text-slate-200 opacity-0 group-hover:opacity-100'}`} />
            </button>
          ))}
        </div>

        {/* Right: Editor / Preview (8 columns) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
            <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
               <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <Settings size={14} className="text-nutri-blue" /> Configuração do Conteúdo
               </h3>
               {activeType && (
                 <div className="flex items-center gap-2 text-[9px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 px-2 py-1 rounded-lg">
                    <CheckCircle2 size={12} /> Dados Integrados
                 </div>
               )}
            </div>
            
            <div className="flex-1 p-8">
               {renderEditor()}
            </div>

            {activeType && (
              <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
                 <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Limpar Conteúdo</button>
                 <button 
                   onClick={() => setShowPreview(true)}
                   className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black transition-all transform active:scale-95"
                 >
                    Gerar Pré-visualização
                 </button>
              </div>
            )}
          </div>

          {/* Quick Tip Footer */}
          {!activeType && (
            <div className="bg-nutri-blue/5 p-8 rounded-3xl border border-nutri-blue/10 flex items-center gap-6">
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-nutri-blue shadow-sm shrink-0"><Info size={24}/></div>
               <p className="text-sm text-nutri-blue font-medium leading-relaxed">
                 Utilize a Central de Entregáveis para gerar documentos padronizados. Todos os arquivos são otimizados para impressão em folha A4 e salvamento em PDF.
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportGenerator;
