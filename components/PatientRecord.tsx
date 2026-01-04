
import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Clipboard, 
  Ruler, 
  Activity, 
  FlaskConical, 
  FileText, 
  User,
  Plus,
  History,
  TrendingUp,
  Download,
  Trash2,
  Check,
  X,
  Calendar,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Info,
  Clock,
  Coffee,
  Heart,
  Droplets,
  Zap,
  Microscope
} from 'lucide-react';
import { Patient, ConsultationRecord } from '../types';

interface PatientRecordProps {
  patient: Patient;
  onBack: () => void;
}

type RecordTab = 'anamnese' | 'medicoes' | 'bioimpedancia' | 'exames' | 'observacoes';

const PatientRecord: React.FC<PatientRecordProps> = ({ patient, onBack }) => {
  const [activeTab, setActiveTab] = useState<RecordTab>('anamnese');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);

  const history = useMemo(() => {
    return [...(patient.history || [])].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [patient.history]);

  const selectedRecord = useMemo(() => {
    if (!history.length) return null;
    return history.find(r => r.id === selectedRecordId) || history[0];
  }, [history, selectedRecordId]);

  const tabs: { id: RecordTab, label: string, icon: React.ReactNode }[] = [
    { id: 'anamnese', label: 'Anamnese', icon: <Clipboard size={18} /> },
    { id: 'medicoes', label: 'Medições', icon: <Ruler size={18} /> },
    { id: 'bioimpedancia', label: 'Bioimpedância', icon: <Activity size={18} /> },
    { id: 'exames', label: 'Exames', icon: <FlaskConical size={18} /> },
    { id: 'observacoes', label: 'Análise', icon: <FileText size={18} /> },
  ];

  const renderDataField = (label: string, value: any, unit: string = '') => {
    if (value === undefined || value === null || value === '') return null;
    return (
      <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm transition-all hover:border-nutri-blue/20">
        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</label>
        <p className="text-sm font-bold text-slate-800">
          {typeof value === 'object' ? JSON.stringify(value) : value} {unit}
        </p>
      </div>
    );
  };

  const renderSection = (title: string, icon: React.ReactNode, children: React.ReactNode) => (
    <div className="space-y-4">
      <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2 px-2">
        {icon} {title}
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {children}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-20">
      {/* Records Selection Sidebar and Main View */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Date Selector Sidebar */}
        <aside className="lg:w-64 shrink-0 space-y-4">
          <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm sticky top-24">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 mb-4 flex items-center gap-2">
              <History size={14} /> Histórico de Consultas
            </h3>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto no-scrollbar">
              {history.map((record) => (
                <button
                  key={record.id}
                  onClick={() => setSelectedRecordId(record.id)}
                  className={`w-full text-left p-4 rounded-2xl transition-all border flex items-center justify-between group ${
                    (selectedRecordId === record.id || (!selectedRecordId && record === history[0]))
                      ? 'bg-nutri-blue text-white border-nutri-blue shadow-lg shadow-nutri-blue/20'
                      : 'bg-slate-50 text-slate-600 border-transparent hover:border-slate-200'
                  }`}
                >
                  <div>
                    <p className="text-xs font-black uppercase tracking-tighter">
                      {new Date(record.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    <p className={`text-[10px] font-bold mt-0.5 ${
                      (selectedRecordId === record.id || (!selectedRecordId && record === history[0])) ? 'text-white/80' : 'text-slate-400'
                    }`}>
                      ID: #{record.id.toString().slice(-4)}
                    </p>
                  </div>
                  <ChevronRight size={16} className={(selectedRecordId === record.id || (!selectedRecordId && record === history[0])) ? 'text-white' : 'text-slate-300 group-hover:translate-x-0.5 transition-transform'} />
                </button>
              ))}
              {history.length === 0 && (
                <div className="text-center p-8 opacity-40 italic text-sm">Nenhum registro encontrado.</div>
              )}
            </div>
          </div>
        </aside>

        {/* Main Record Area */}
        <div className="flex-1 space-y-6">
          {/* Tabs Navigation (Internal) */}
          <div className="flex overflow-x-auto no-scrollbar gap-1.5 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-nutri-blue shadow-sm'
                    : 'text-slate-400 hover:text-slate-700'
                }`}
              >
                {tab.icon}
                {tab.label.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm min-h-[500px]">
            {!selectedRecord ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 py-20 text-center">
                <Info size={48} className="mb-4 opacity-20" />
                <p className="text-sm font-bold uppercase tracking-widest">Nenhuma consulta realizada</p>
                <p className="text-xs mt-1">Os dados aparecerão aqui após finalizar o primeiro atendimento.</p>
              </div>
            ) : (
              <div className="animate-in fade-in duration-500 space-y-12">
                
                {/* Tab: ANAMNESE */}
                {activeTab === 'anamnese' && (
                  <div className="space-y-12">
                    {renderSection('Recordatório Básico', <Coffee size={16} className="text-nutri-blue" />, (
                      <>
                        {renderDataField('Hidratação', selectedRecord.anamnese?.recordatorioBasico?.hidratacao, 'L/dia')}
                        {renderDataField('Refeições/dia', selectedRecord.anamnese?.recordatorioBasico?.numRefeicoes)}
                        {renderDataField('Tempo de Sono', selectedRecord.anamnese?.recordatorioBasico?.sono?.tempo, 'h')}
                        {renderDataField('Qualidade do Sono', selectedRecord.anamnese?.recordatorioBasico?.sono?.qualidade)}
                        {renderDataField('Alergias', selectedRecord.anamnese?.recordatorioBasico?.alergias?.join(', '))}
                        {renderDataField('Alergias (Outros)', selectedRecord.anamnese?.recordatorioBasico?.alergiasOutros)}
                      </>
                    ))}
                    
                    {renderSection('Atividade Física', <TrendingUp size={16} className="text-emerald-500" />, (
                      <>
                        {renderDataField('Tipo', selectedRecord.anamnese?.recordatorioBasico?.atividadeFisica?.tipo)}
                        {renderDataField('Frequência', selectedRecord.anamnese?.recordatorioBasico?.atividadeFisica?.frequencia, 'vezes/sem')}
                        {renderDataField('Duração', selectedRecord.anamnese?.recordatorioBasico?.atividadeFisica?.duracao, 'min')}
                      </>
                    ))}

                    {renderSection('História Clínica', <Heart size={16} className="text-rose-500" />, (
                      <>
                        {renderDataField('Doenças Atuais', selectedRecord.anamnese?.historiaClinica?.doencasAtuais)}
                        {renderDataField('Doenças Anteriores', selectedRecord.anamnese?.historiaClinica?.doencasAnteriores)}
                        {renderDataField('Medicamentos', selectedRecord.anamnese?.historiaClinica?.medicamentos)}
                        {renderDataField('Suplementos', selectedRecord.anamnese?.historiaClinica?.suplementos)}
                        {renderDataField('Checklist Familiar', selectedRecord.anamnese?.historiaClinica?.historicoFamiliar?.join(', '))}
                      </>
                    ))}

                    {renderSection('Hábitos de Vida', <Clock size={16} className="text-amber-500" />, (
                      <>
                        {renderDataField('Tabagismo', selectedRecord.anamnese?.habitosVida?.tabagismo)}
                        {renderDataField('Etilismo', selectedRecord.anamnese?.habitosVida?.etilismo)}
                        {renderDataField('Estresse', selectedRecord.anamnese?.habitosVida?.estresse)}
                        {renderDataField('Evacuação (Freq.)', selectedRecord.anamnese?.habitosVida?.evacuacao?.frequencia)}
                        {renderDataField('Evacuação (Aspecto)', selectedRecord.anamnese?.habitosVida?.evacuacao?.aspecto)}
                      </>
                    ))}
                  </div>
                )}

                {/* Tab: MEDIÇÕES */}
                {activeTab === 'medicoes' && (
                  <div className="space-y-12">
                    {renderSection('Antropometria Básica', <Ruler size={16} className="text-nutri-blue" />, (
                      <>
                        {renderDataField('Peso', selectedRecord.medicoes?.basicas?.peso || selectedRecord.bioimpedancia?.indicadores?.peso, 'kg')}
                        {renderDataField('Altura', selectedRecord.medicoes?.basicas?.altura, 'cm')}
                        {renderDataField('Cintura', selectedRecord.medicoes?.basicas?.cintura || selectedRecord.medicoes?.perimetria?.cintura, 'cm')}
                        {renderDataField('Quadril', selectedRecord.medicoes?.basicas?.quadril || selectedRecord.medicoes?.perimetria?.quadril, 'cm')}
                        {renderDataField('Toráxica', selectedRecord.medicoes?.basicas?.toraxica || selectedRecord.medicoes?.perimetria?.toracica, 'cm')}
                        {renderDataField('Braço D', selectedRecord.medicoes?.basicas?.bracoDireito || selectedRecord.medicoes?.perimetria?.bracoDireito, 'cm')}
                        {renderDataField('Braço E', selectedRecord.medicoes?.basicas?.bracoEsquerdo || selectedRecord.medicoes?.perimetria?.bracoEsquerdo, 'cm')}
                        {renderDataField('Coxa D', selectedRecord.medicoes?.basicas?.coxaDireita || selectedRecord.medicoes?.perimetria?.coxaDireita, 'cm')}
                        {renderDataField('Coxa E', selectedRecord.medicoes?.basicas?.coxaEsquerda || selectedRecord.medicoes?.perimetria?.coxaEsquerda, 'cm')}
                        {renderDataField('Panturrilha D', selectedRecord.medicoes?.basicas?.panturrilhaDireita || selectedRecord.medicoes?.perimetria?.panturrilhaDireita, 'cm')}
                        {renderDataField('Panturrilha E', selectedRecord.medicoes?.basicas?.panturrilhaEsquerda || selectedRecord.medicoes?.perimetria?.panturrilhaEsquerda, 'cm')}
                      </>
                    ))}

                    {selectedRecord.medicoes?.dobras && renderSection('Dobras Cutâneas', <Activity size={16} className="text-emerald-500" />, (
                      <>
                        {Object.entries(selectedRecord.medicoes.dobras).map(([key, value]) => renderDataField(key, value, 'mm'))}
                      </>
                    ))}
                  </div>
                )}

                {/* Tab: BIOIMPEDÂNCIA */}
                {activeTab === 'bioimpedancia' && (
                  <div className="space-y-12">
                    {renderSection('Indicadores Chave', <TrendingUp size={16} className="text-nutri-blue" />, (
                      <>
                        {renderDataField('Peso Bio', selectedRecord.bioimpedancia?.indicadores?.peso || selectedRecord.bioimpedancia?.peso, 'kg')}
                        {renderDataField('% Gordura', selectedRecord.bioimpedancia?.indicadores?.gorduraPerc || selectedRecord.bioimpedancia?.percentualGordura, '%')}
                        {renderDataField('% Músculo', selectedRecord.bioimpedancia?.indicadores?.musculoPerc, '%')}
                        {renderDataField('Gord. Visceral', selectedRecord.bioimpedancia?.indicadores?.visceralNivel || selectedRecord.bioimpedancia?.gorduraVisceral, 'nv')}
                        {renderDataField('TMB', selectedRecord.bioimpedancia?.indicadores?.tmb || selectedRecord.bioimpedancia?.tmb, 'kcal')}
                        {renderDataField('Idade Metabólica', selectedRecord.bioimpedancia?.indicadores?.idadeMetabolica || selectedRecord.bioimpedancia?.idadeMetabolica, 'anos')}
                      </>
                    ))}

                    {selectedRecord.bioimpedancia?.percentuais && renderSection('Percentuais Corporais', <Activity size={16} className="text-blue-500" />, (
                      <>
                        {Object.entries(selectedRecord.bioimpedancia.percentuais).map(([key, value]) => renderDataField(key.replace('Perc', ''), value, '%'))}
                      </>
                    ))}

                    {selectedRecord.bioimpedancia?.composicao && renderSection('Massa Absoluta', <Ruler size={16} className="text-slate-400" />, (
                      <>
                        {Object.entries(selectedRecord.bioimpedancia.composicao).map(([key, value]) => renderDataField(key.replace('Massa', ''), value, 'kg'))}
                      </>
                    ))}

                    {renderSection('Hidratação e Fluidos', <Droplets size={16} className="text-sky-500" />, (
                      <>
                        {renderDataField('Água Total', selectedRecord.bioimpedancia?.agua?.total, 'L')}
                        {renderDataField('Fluido Intra', selectedRecord.bioimpedancia?.agua?.intra, 'L')}
                        {renderDataField('Fluido Extra', selectedRecord.bioimpedancia?.agua?.extra, 'L')}
                      </>
                    ))}
                  </div>
                )}

                {/* Tab: EXAMES */}
                {activeTab === 'exames' && (
                  <div className="space-y-12">
                    {selectedRecord.exames?.dataColeta && (
                      <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <Calendar size={18} className="text-slate-400" />
                        <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Data da Coleta</p>
                          <p className="text-sm font-bold text-slate-800 mt-1">{new Date(selectedRecord.exames.dataColeta).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                    )}

                    {selectedRecord.exames?.bioquimica && renderSection('Bioquímica e Metabólica', <Microscope size={16} className="text-nutri-blue" />, (
                      <>
                        {Object.entries(selectedRecord.exames.bioquimica).map(([key, value]) => renderDataField(key, value))}
                      </>
                    ))}

                    {selectedRecord.exames?.hemograma && renderSection('Hemograma', <Activity size={16} className="text-rose-500" />, (
                      <>
                        {Object.entries(selectedRecord.exames.hemograma).map(([key, value]) => renderDataField(key, value))}
                      </>
                    ))}

                    {selectedRecord.exames?.hormonios && renderSection('Hormônios', <Zap size={16} className="text-amber-500" />, (
                      <>
                        {Object.entries(selectedRecord.exames.hormonios).map(([key, value]) => renderDataField(key, value))}
                      </>
                    ))}

                    {selectedRecord.exames?.sinaisVitais && renderSection('Sinais Vitais', <Heart size={16} className="text-blue-500" />, (
                      <>
                        {Object.entries(selectedRecord.exames.sinaisVitais).map(([key, value]) => renderDataField(key, value))}
                      </>
                    ))}
                  </div>
                )}

                {/* Tab: ANÁLISE (Observações) */}
                {activeTab === 'observacoes' && (
                  <div className="space-y-6">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2 px-2">
                      <FileText size={18} className="text-nutri-blue" /> Análise Clínica e Notas
                    </h4>
                    <div className="bg-slate-50/50 p-8 rounded-[24px] border border-slate-100 min-h-[300px] shadow-inner relative group transition-all hover:bg-white">
                      <p className="text-slate-700 leading-relaxed font-medium whitespace-pre-wrap">
                        {selectedRecord.observacoes || "Nenhuma observação registrada para este atendimento."}
                      </p>
                      {!selectedRecord.observacoes && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-10 grayscale">
                           <FileText size={80} />
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Se a aba atual não tiver dados no registro selecionado */}
                {!selectedRecord[activeTab] && activeTab !== 'observacoes' && (
                  <div className="h-full flex flex-col items-center justify-center text-slate-300 py-20 text-center grayscale opacity-50">
                    <X size={48} className="mb-4" />
                    <p className="text-sm font-bold uppercase tracking-widest">Sem dados registrados</p>
                    <p className="text-xs mt-1">Esta seção não foi preenchida durante esta consulta.</p>
                  </div>
                )}

              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PatientRecord;
