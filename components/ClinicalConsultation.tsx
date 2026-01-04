
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  ArrowLeft, Clipboard, Ruler, Activity, FlaskConical, FileText,
  CheckCircle2, User, AlertTriangle, Info,
  Clock, Heart, Zap, Coffee, Moon, Cigarette, Wine, Brain, Utensils,
  Calculator, ChevronRight, Target, Droplets, Gauge, Flame, FileUp,
  Calendar, Thermometer, Microscope
} from 'lucide-react';
import LoadingSpinner from './ui/LoadingSpinner';

interface ClinicalConsultationProps {
  patientId: string;
  patientName: string;
  onClose: () => void;
  onFinish: (data: any) => void;
}

const ClinicalConsultation: React.FC<ClinicalConsultationProps> = ({
  patientId, patientName, onClose, onFinish
}) => {
  const [activeTab, setActiveTab] = useState('anamnese');
  const [isSaving, setIsSaving] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    anamnese: {
      recordatorioBasico: {
        hidratacao: '',
        numRefeicoes: '',
        atividadeFisica: { tipo: '', frequencia: '', duracao: '' },
        sono: { tempo: '', qualidade: 'boa' },
        alergias: [] as string[],
        alergiasOutros: ''
      },
      historiaClinica: {
        doencasAtuais: '',
        doencasAnteriores: '',
        medicamentos: '',
        suplementos: '',
        cirurgias: '',
        historicoFamiliar: [] as string[]
      },
      habitosVida: {
        tabagismo: 'não',
        etilismo: 'não',
        estresse: 'baixo',
        evacuacao: { frequencia: '', aspecto: '' }
      },
      preferenciasAlimentares: {
        frequencia: 'moderada',
        local: 'casa',
        mastigacao: 'moderada',
        liquidosRefeicao: 'não',
        preferidos: '',
        naoAceitos: '',
        restricoes: '',
        recall24h: [
          { refeicao: 'Café da Manhã', horario: '07:30', descricao: '' },
          { refeicao: 'Lanche Manhã', horario: '10:00', descricao: '' },
          { refeicao: 'Almoço', horario: '12:30', descricao: '' },
          { refeicao: 'Lanche Tarde', horario: '16:00', descricao: '' },
          { refeicao: 'Jantar', horario: '20:00', descricao: '' }
        ]
      },
      comportamentoAlimentar: {
        comeAnsiedade: 'não',
        belisca: 'não',
        pulaRefeicoes: 'não',
        recompensa: 'não',
        compulsao: 'não'
      }
    },
    medicoes: {
      basicas: {
        peso: '',
        altura: '165',
        cintura: '',
        quadril: '',
        toraxica: '',
        bracoDireito: '',
        bracoEsquerdo: '',
        coxaDireita: '',
        coxaEsquerda: '',
        panturrilhaDireita: '',
        panturrilhaEsquerda: ''
      },
      corporais: {
        diametroFemur: '',
        diametroPunho: '',
        diametroCotovelo: '',
        diametroTornozelo: '',
        gorduraAbdominal: '',
        perimetroAbdominal: '',
        perimetroCefalico: '',
        perimetroCoxaMedia: '',
        perimetroCoxaSuperior: '',
        perimetroPanturrilha: '',
        perimetroAntebraco: '',
        perimetroBraco: '',
        perimetroBracoFletido: '',
        perimetroBracoRelaxado: '',
        perimetroOmbro: '',
        perimetroPeito: '',
        perimetroPescoco: '',
        perimetroPulso: ''
      },
      dobras: {
        iliocristal: '',
        supraespinal: '',
        abdominal: '',
        axilarMedia: '',
        biceps: '',
        coxa: '',
        panturrilha: '',
        peitoral: '',
        subescapular: '',
        suprailica: '',
        tricipital: ''
      }
    },
    bioimpedancia: {
      indicadores: {
        peso: '',
        imc: '',
        gorduraPerc: '',
        musculoPerc: '',
        visceralNivel: '',
        tmb: '',
        idadeMetabolica: ''
      },
      percentuais: {
        gordaPerc: '',
        visceralPerc: '',
        magraPerc: '',
        muscularPerc: '',
        osseaPerc: '',
        residualPerc: '',
        livreGorduraPerc: ''
      },
      composicao: {
        magraMassa: '',
        muscularMassa: '',
        osseaMassa: '',
        residualMassa: '',
        celularMassa: '',
        livreGorduraMassa: '',
        gordaMassa: ''
      },
      agua: {
        total: '',
        intra: '',
        extra: '',
        totalPerc: '',
        intraPerc: '',
        extraPerc: ''
      }
    },
    exames: {
      dataColeta: new Date().toISOString().split('T')[0],
      anexos: [] as string[],
      bioquimica: {
        glicemiaJejum: '',
        glicose: '',
        hbA1c: '',
        insulina: '',
        colesterolTotal: '',
        hdl: '',
        ldl: '',
        triglicerideos: '',
        acidoUrico: '',
        creatinina: '',
        ureia: '',
        pcr: '',
        albumina: '',
        preAlbumina: ''
      },
      hemograma: {
        hemacias: '',
        hemoglobina: '',
        hematocrito: '',
        leucocitos: '',
        neutrofilos: '',
        linfocitos: '',
        monocitos: '',
        eosinofilos: '',
        basofilos: '',
        plaquetas: ''
      },
      hormonios: {
        tsh: '',
        t3: '',
        t4: '',
        pth: '',
        prolactina: '',
        glucagon: ''
      },
      vitaminas: {
        vitA: '',
        vitB6: '',
        vitB12: '',
        vitC: '',
        vitD: '',
        vitE: '',
        acidoFolico: '',
        ferro: '',
        ferritina: '',
        zinco: '',
        magnesio: '',
        calcio: '',
        fosforo: '',
        sodio: '',
        potassio: ''
      },
      sinaisVitais: {
        paSistolica: '',
        paDiastolica: '',
        fc: '',
        fcMax: '',
        phArterial: ''
      }
    },
    observacoes: ''
  });

  // Cálculos Automáticos
  const calculatedMetrics = useMemo(() => {
    const { basicas, dobras } = formData.medicoes;
    const { indicadores } = formData.bioimpedancia;

    const weight = parseFloat((indicadores.peso || basicas.peso).replace(',', '.')) || 0;
    const height = parseFloat(basicas.altura.replace(',', '.')) || 0;
    const imc = height > 0 ? (weight / Math.pow(height / 100, 2)).toFixed(1) : '';

    const waist = parseFloat(basicas.cintura.replace(',', '.')) || 0;
    const hip = parseFloat(basicas.quadril.replace(',', '.')) || 0;

    const waistHeightRatio = height > 0 ? (waist / height).toFixed(2) : '0.00';
    const waistHipRatio = hip > 0 ? (waist / hip).toFixed(2) : '0.00';

    const dAb = parseFloat(dobras.abdominal.replace(',', '.')) || 0;
    const dBi = parseFloat(dobras.biceps.replace(',', '.')) || 0;
    const dTri = parseFloat(dobras.tricipital.replace(',', '.')) || 0;
    const dSub = parseFloat(dobras.subescapular.replace(',', '.')) || 0;
    const dSupraI = parseFloat(dobras.suprailica.replace(',', '.')) || 0;
    const dSupraE = parseFloat(dobras.supraespinal.replace(',', '.')) || 0;
    const dCoxa = parseFloat(dobras.coxa.replace(',', '.')) || 0;
    const dPant = parseFloat(dobras.panturrilha.replace(',', '.')) || 0;

    const sum5 = (dTri + dSub + dSupraI + dAb + dCoxa).toFixed(1);
    const sum8 = (dTri + dSub + dBi + dSupraI + dSupraE + dAb + dCoxa + dPant).toFixed(1);

    let imcStatus = 'Adequado';
    const imcVal = parseFloat(imc);
    if (!imc) imcStatus = '-';
    else if (imcVal < 18.5) imcStatus = 'Baixo Peso';
    else if (imcVal >= 25 && imcVal < 30) imcStatus = 'Sobrepeso';
    else if (imcVal >= 30) imcStatus = 'Obesidade';

    return {
      waistHeightRatio,
      waistHipRatio,
      sum5,
      sum8,
      imc: imc || '0.0',
      imcStatus
    };
  }, [formData.medicoes, formData.bioimpedancia.indicadores.peso]);

  const handleInputChange = (path: string, value: string) => {
    setFormData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      const keys = path.split('.');
      let current = newData as any;
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const toggleArrayItem = (path: string, item: string) => {
    const keys = path.split('.');
    let current = formData as any;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    const currentArray = current[keys[keys.length - 1]] as string[];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];

    handleInputChange(path, newArray as any);
  };

  const tabs = [
    { id: 'anamnese', label: 'Anamnese', icon: <Clipboard size={18} /> },
    { id: 'medicoes', label: 'Medições', icon: <Ruler size={18} /> },
    { id: 'bioimpedancia', label: 'Bioimpedância', icon: <Activity size={18} /> },
    { id: 'exames', label: 'Exames', icon: <FlaskConical size={18} /> },
    { id: 'observacoes', label: 'Análise', icon: <FileText size={18} /> },
  ];

  const inputClasses = "w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-nutri-blue/10 focus:border-nutri-blue outline-none text-sm font-semibold text-slate-800 transition-all placeholder:text-slate-300";
  const labelClasses = "text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-1.5 block leading-tight";
  const sectionTitleClasses = "text-xs font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-100 pb-4 mb-6 flex items-center gap-2";

  const SegmentedControl = ({ options, value, onChange, label }: { options: string[], value: string, onChange: (v: string) => void, label?: string }) => (
    <div className="space-y-1.5">
      {label && <label className={labelClasses}>{label}</label>}
      <div className="flex bg-slate-100 p-1 rounded-xl">
        {options.map(opt => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`flex-1 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${value === opt ? 'bg-white text-nutri-blue shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );

  const MeasurementInput = ({ label, unit, path, value, icon, placeholder = "0.0" }: { label: string, unit: string, path: string, value: string, icon?: React.ReactNode, placeholder?: string }) => (
    <div>
      <label className={labelClasses}>{label}</label>
      <div className="relative group">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-nutri-blue transition-colors">
            {icon}
          </div>
        )}
        <input
          type="text"
          inputMode="decimal"
          pattern="[0-9]*[.,]?[0-9]*"
          placeholder={placeholder}
          value={value}
          onFocus={(e) => e.currentTarget.select()}
          onChange={(e) => handleInputChange(path, e.target.value)}
          className={inputClasses + (icon ? " pl-11" : "") + " pr-12"}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase pointer-events-none group-focus-within:text-nutri-blue transition-colors">
          {unit}
        </span>
      </div>
    </div>
  );

  const CustomNumericInput = ({ label, path, value, placeholder = "0.0" }: { label: string, path: string, value: string, placeholder?: string }) => (
    <div>
      <label className={labelClasses}>{label}</label>
      <input
        type="text"
        inputMode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        placeholder={placeholder}
        value={value}
        onFocus={(e) => e.currentTarget.select()}
        onChange={(e) => handleInputChange(path, e.target.value)}
        className={inputClasses}
      />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-4 md:space-y-6 animate-in slide-in-from-right-4 duration-500 pb-20 px-1">
      {/* Header */}
      <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button onClick={onClose} className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors border border-transparent hover:border-slate-100"><ArrowLeft size={20} /></button>
          <div className="w-12 h-12 bg-nutri-blue rounded-2xl flex items-center justify-center text-white shadow-lg shadow-nutri-blue/10 shrink-0"><User size={24} /></div>
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-slate-800 truncate">Consulta Clínica</h2>
            <p className="text-[10px] text-nutri-blue font-black uppercase tracking-widest truncate">{patientName}</p>
          </div>
        </div>
        <button
          onClick={() => { setIsSaving(true); setTimeout(() => onFinish({ id: Date.now(), date: new Date().toISOString(), ...formData }), 1000); }}
          disabled={isSaving}
          className="w-full md:w-auto px-8 py-3.5 bg-nutri-blue text-white rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-nutri-blue/20 hover:bg-nutri-blue-hover transition-all active:scale-95 disabled:opacity-50"
        >
          {isSaving ? <LoadingSpinner size={20} color="white" /> : <CheckCircle2 size={20} />}
          Finalizar Consulta
        </button>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 p-1.5 bg-white rounded-2xl border border-slate-100 shadow-sm sticky top-2 z-10 mx-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-nutri-blue text-white shadow-lg shadow-nutri-blue/20' : 'text-slate-400 hover:text-slate-600'}`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white p-6 md:p-10 rounded-3xl border border-slate-100 shadow-sm min-h-[600px]">
        {activeTab === 'anamnese' && (
          <div className="space-y-12 animate-in fade-in duration-500">
            {/* RECORDATÓRIO BÁSICO */}
            <section>
              <h3 className={sectionTitleClasses}><Coffee size={16} className="text-nutri-blue" /> Recordatório Básico</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <CustomNumericInput label="Hidratação (L/dia)" path="anamnese.recordatorioBasico.hidratacao" value={formData.anamnese.recordatorioBasico.hidratacao} placeholder="Ex: 2.5" />
                <CustomNumericInput label="Refeições / dia" path="anamnese.recordatorioBasico.numRefeicoes" value={formData.anamnese.recordatorioBasico.numRefeicoes} placeholder="Ex: 5" />
                <CustomNumericInput label="Sono (Horas)" path="anamnese.recordatorioBasico.sono.tempo" value={formData.anamnese.recordatorioBasico.sono.tempo} placeholder="Ex: 8" />
                <SegmentedControl label="Qualidade do Sono" options={['ruim', 'regular', 'boa']} value={formData.anamnese.recordatorioBasico.sono.qualidade} onChange={(v) => handleInputChange('anamnese.recordatorioBasico.sono.qualidade', v)} />
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  <label className={labelClasses}>Atividade Física</label>
                  <div className="grid grid-cols-3 gap-3">
                    <input placeholder="Tipo (ex: Musculação)" value={formData.anamnese.recordatorioBasico.atividadeFisica.tipo} onChange={(e) => handleInputChange('anamnese.recordatorioBasico.atividadeFisica.tipo', e.target.value)} className={inputClasses} />
                    <input placeholder="Frequência / sem" inputMode="decimal" pattern="[0-9]*[.,]?[0-9]*" value={formData.anamnese.recordatorioBasico.atividadeFisica.frequencia} onFocus={(e) => e.currentTarget.select()} onChange={(e) => handleInputChange('anamnese.recordatorioBasico.atividadeFisica.frequencia', e.target.value)} className={inputClasses} />
                    <input placeholder="Duração (min)" inputMode="decimal" pattern="[0-9]*[.,]?[0-9]*" value={formData.anamnese.recordatorioBasico.atividadeFisica.duracao} onFocus={(e) => e.currentTarget.select()} onChange={(e) => handleInputChange('anamnese.recordatorioBasico.atividadeFisica.duracao', e.target.value)} className={inputClasses} />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className={labelClasses}>Alergias / Intolerâncias</label>
                  <div className="flex flex-wrap gap-2">
                    {['Glúten', 'Lactose', 'Ovo', 'Soja'].map(a => (
                      <button key={a} type="button" onClick={() => toggleArrayItem('anamnese.recordatorioBasico.alergias', a)} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border transition-all ${formData.anamnese.recordatorioBasico.alergias.includes(a) ? 'bg-nutri-blue/10 border-nutri-blue text-nutri-blue' : 'bg-white border-slate-200 text-slate-400'}`}>
                        {a}
                      </button>
                    ))}
                  </div>
                  <input placeholder="Outras..." value={formData.anamnese.recordatorioBasico.alergiasOutros} onChange={(e) => handleInputChange('anamnese.recordatorioBasico.alergiasOutros', e.target.value)} className={inputClasses} />
                </div>
              </div>
            </section>

            {/* HISTÓRIA CLÍNICA */}
            <section>
              <h3 className={sectionTitleClasses}><Heart size={16} className="text-rose-500" /> História Clínica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div><label className={labelClasses}>Doenças Atuais</label><textarea rows={2} value={formData.anamnese.historiaClinica.doencasAtuais} onChange={(e) => handleInputChange('anamnese.historiaClinica.doencasAtuais', e.target.value)} className={inputClasses + " resize-none"} /></div>
                  <div><label className={labelClasses}>Doenças Anteriores</label><textarea rows={2} value={formData.anamnese.historiaClinica.doencasAnteriores} onChange={(e) => handleInputChange('anamnese.historiaClinica.doencasAnteriores', e.target.value)} className={inputClasses + " resize-none"} /></div>
                </div>
                <div className="space-y-4">
                  <div><label className={labelClasses}>Medicamentos em uso</label><input value={formData.anamnese.historiaClinica.medicamentos} onChange={(e) => handleInputChange('anamnese.historiaClinica.medicamentos', e.target.value)} className={inputClasses} /></div>
                  <div><label className={labelClasses}>Suplementos em uso</label><input value={formData.anamnese.historiaClinica.suplementos} onChange={(e) => handleInputChange('anamnese.historiaClinica.suplementos', e.target.value)} className={inputClasses} /></div>
                  <div>
                    <label className={labelClasses}>Histórico Familiar (Checklist)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {['Obesidade', 'Diabetes', 'HAS', 'Dislipidemia'].map(h => (
                        <button key={h} type="button" onClick={() => toggleArrayItem('anamnese.historiaClinica.historicoFamiliar', h)} className={`px-3 py-2 rounded-xl text-[9px] font-black uppercase border transition-all ${formData.anamnese.historiaClinica.historicoFamiliar.includes(h) ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white border-slate-100 text-slate-400'}`}>
                          {h}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* HÁBITOS DE VIDA */}
            <section>
              <h3 className={sectionTitleClasses}><Moon size={16} className="text-amber-500" /> Hábitos de Vida</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SegmentedControl label="Tabagismo" options={['não', 'ex-fumante', 'sim']} value={formData.anamnese.habitosVida.tabagismo} onChange={(v) => handleInputChange('anamnese.habitosVida.tabagismo', v)} />
                <SegmentedControl label="Etilismo" options={['não', 'social', 'frequente']} value={formData.anamnese.habitosVida.etilismo} onChange={(v) => handleInputChange('anamnese.habitosVida.etilismo', v)} />
                <SegmentedControl label="Estresse" options={['baixo', 'moderado', 'alto']} value={formData.anamnese.habitosVida.estresse} onChange={(v) => handleInputChange('anamnese.habitosVida.estresse', v)} />
                <div className="space-y-3">
                  <label className={labelClasses}>Evacuação</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input placeholder="Frequência" value={formData.anamnese.habitosVida.evacuacao.frequencia} onChange={(e) => handleInputChange('anamnese.habitosVida.evacuacao.frequencia', e.target.value)} className={inputClasses + " py-2"} />
                    <input placeholder="Aspecto" value={formData.anamnese.habitosVida.evacuacao.aspecto} onChange={(e) => handleInputChange('anamnese.habitosVida.evacuacao.aspecto', e.target.value)} className={inputClasses + " py-2"} />
                  </div>
                </div>
              </div>
            </section>

            {/* HÁBITOS E PREFERÊNCIAS ALIMENTARES */}
            <section>
              <h3 className={sectionTitleClasses}><Utensils size={16} className="text-emerald-500" /> Hábitos e Preferências</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-6">
                  <SegmentedControl label="Frequência Alimentar" options={['baixa', 'moderada', 'alta']} value={formData.anamnese.preferenciasAlimentares.frequencia} onChange={(v) => handleInputChange('anamnese.preferenciasAlimentares.frequencia', v)} />
                  <SegmentedControl label="Mastigação" options={['lenta', 'moderada', 'rápida']} value={formData.anamnese.preferenciasAlimentares.mastigacao} onChange={(v) => handleInputChange('anamnese.preferenciasAlimentares.mastigacao', v)} />
                  <SegmentedControl label="Líquidos na refeição" options={['sim', 'não']} value={formData.anamnese.preferenciasAlimentares.liquidosRefeicao} onChange={(v) => handleInputChange('anamnese.preferenciasAlimentares.liquidosRefeicao', v)} />
                </div>
                <div className="md:col-span-2 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className={labelClasses}>Alimentos Preferidos</label><input value={formData.anamnese.preferenciasAlimentares.preferidos} onChange={(e) => handleInputChange('anamnese.preferenciasAlimentares.preferidos', e.target.value)} className={inputClasses} /></div>
                    <div><label className={labelClasses}>Aversões / Intoleráveis</label><input value={formData.anamnese.preferenciasAlimentares.naoAceitos} onChange={(e) => handleInputChange('anamnese.preferenciasAlimentares.naoAceitos', e.target.value)} className={inputClasses} /></div>
                  </div>
                  <div><label className={labelClasses}>Recordatório 24h (Estruturado)</label>
                    <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl space-y-4">
                      {formData.anamnese.preferenciasAlimentares.recall24h.map((item, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center pb-3 border-b border-slate-200/40 last:border-0 last:pb-0">
                          <div className="sm:w-28 shrink-0">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block leading-tight">{item.refeicao}</span>
                          </div>
                          <div className="flex gap-2 flex-1">
                            <input
                              type="text"
                              placeholder="00:00"
                              value={item.horario}
                              onChange={(e) => {
                                const newRecall = [...formData.anamnese.preferenciasAlimentares.recall24h];
                                newRecall[idx].horario = e.target.value;
                                handleInputChange('anamnese.preferenciasAlimentares.recall24h', newRecall as any);
                              }}
                              className="w-20 sm:w-24 bg-white border border-slate-100 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-nutri-blue/10 focus:border-nutri-blue/40 shrink-0"
                            />
                            <input
                              placeholder="Descrição..."
                              value={item.descricao}
                              onChange={(e) => {
                                const newRecall = [...formData.anamnese.preferenciasAlimentares.recall24h];
                                newRecall[idx].descricao = e.target.value;
                                handleInputChange('anamnese.preferenciasAlimentares.recall24h', newRecall as any);
                              }}
                              className="flex-1 min-w-0 bg-white border border-slate-100 rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-nutri-blue/10 focus:border-nutri-blue/40"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* COMPORTAMENTO ALIMENTAR */}
            <section>
              <h3 className={sectionTitleClasses}><Brain size={16} className="text-purple-500" /> Comportamento Alimentar</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SegmentedControl label="Come por Ansiedade/Tédio?" options={['não', 'às vezes', 'sim']} value={formData.anamnese.comportamentoAlimentar.comeAnsiedade} onChange={(v) => handleInputChange('anamnese.comportamentoAlimentar.comeAnsiedade', v)} />
                <SegmentedControl label="Belisca entre refeições?" options={['não', 'sim']} value={formData.anamnese.comportamentoAlimentar.belisca} onChange={(v) => handleInputChange('anamnese.comportamentoAlimentar.belisca', v)} />
                <SegmentedControl label="Pula refeições?" options={['não', 'sim']} value={formData.anamnese.comportamentoAlimentar.pulaRefeicoes} onChange={(v) => handleInputChange('anamnese.comportamentoAlimentar.pulaRefeicoes', v)} />
                <SegmentedControl label="Comida como recompensa?" options={['não', 'sim']} value={formData.anamnese.comportamentoAlimentar.recompensa} onChange={(v) => handleInputChange('anamnese.comportamentoAlimentar.recompensa', v)} />
                <SegmentedControl label="Episódios de compulsão?" options={['não', 'ocasional', 'frequente']} value={formData.anamnese.comportamentoAlimentar.compulsao} onChange={(v) => handleInputChange('anamnese.comportamentoAlimentar.compulsao', v)} />
              </div>
            </section>

          </div>
        )}

        {activeTab === 'medicoes' && (
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* MEDIÇÕES BÁSICAS */}
            <section>
              <h3 className={sectionTitleClasses}><Target size={16} className="text-nutri-blue" /> Medições Básicas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
                <MeasurementInput label="Peso" unit="kg" path="medicoes.basicas.peso" value={formData.medicoes.basicas.peso} />
                <MeasurementInput label="Altura" unit="cm" path="medicoes.basicas.altura" value={formData.medicoes.basicas.altura} />
                <MeasurementInput label="Cintura" unit="cm" path="medicoes.basicas.cintura" value={formData.medicoes.basicas.cintura} />
                <MeasurementInput label="Quadril" unit="cm" path="medicoes.basicas.quadril" value={formData.medicoes.basicas.quadril} />
                <MeasurementInput label="Toráxica" unit="cm" path="medicoes.basicas.toraxica" value={formData.medicoes.basicas.toraxica} />
                <MeasurementInput label="Braço Direito" unit="cm" path="medicoes.basicas.bracoDireito" value={formData.medicoes.basicas.bracoDireito} />
                <MeasurementInput label="Braço Esquerdo" unit="cm" path="medicoes.basicas.bracoEsquerdo" value={formData.medicoes.basicas.bracoEsquerdo} />
                <MeasurementInput label="Coxa Direito" unit="cm" path="medicoes.basicas.coxaDireita" value={formData.medicoes.basicas.coxaDireita} />
                <MeasurementInput label="Coxa Esquerdo" unit="cm" path="medicoes.basicas.coxaEsquerda" value={formData.medicoes.basicas.coxaEsquerda} />
                <MeasurementInput label="Panturrilha Direita" unit="cm" path="medicoes.basicas.panturrilhaDireita" value={formData.medicoes.basicas.panturrilhaDireita} />
                <MeasurementInput label="Panturrilha Esquerda" unit="cm" path="medicoes.basicas.panturrilhaEsquerda" value={formData.medicoes.basicas.panturrilhaEsquerda} />
              </div>
            </section>

            {/* MEDIÇÕES CORPORAIS */}
            <section>
              <h3 className={sectionTitleClasses}><Ruler size={16} className="text-nutri-blue" /> Medições Corporais</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
                <MeasurementInput label="Diam. Fêmur" unit="cm" path="medicoes.corporais.diametroFemur" value={formData.medicoes.corporais.diametroFemur} />
                <MeasurementInput label="Diam. Punho" unit="mm" path="medicoes.corporais.diametroPunho" value={formData.medicoes.corporais.diametroPunho} />
                <MeasurementInput label="Diam. Cotovelo" unit="cm" path="medicoes.corporais.diametroCotovelo" value={formData.medicoes.corporais.diametroCotovelo} />
                <MeasurementInput label="Diam. Tornozelo" unit="cm" path="medicoes.corporais.diametroTornozelo" value={formData.medicoes.corporais.diametroTornozelo} />
                <MeasurementInput label="Gordura Subcut. Abd" unit="mm" path="medicoes.corporais.gorduraAbdominal" value={formData.medicoes.corporais.gorduraAbdominal} />
                <MeasurementInput label="Perímetro Abdominal" unit="cm" path="medicoes.corporais.perimetroAbdominal" value={formData.medicoes.corporais.perimetroAbdominal} />
                <MeasurementInput label="Perímetro Cefálico" unit="cm" path="medicoes.corporais.perimetroCefalico" value={formData.medicoes.corporais.perimetroCefalico} />
                <MeasurementInput label="Coxa Média" unit="cm" path="medicoes.corporais.perimetroCoxaMedia" value={formData.medicoes.corporais.perimetroCoxaMedia} />
                <MeasurementInput label="Coxa Superior" unit="cm" path="medicoes.corporais.perimetroCoxaSuperior" value={formData.medicoes.corporais.perimetroCoxaSuperior} />
                <MeasurementInput label="Panturrilha" unit="cm" path="medicoes.corporais.perimetroPanturrilha" value={formData.medicoes.corporais.perimetroPanturrilha} />
                <MeasurementInput label="Antebraço" unit="cm" path="medicoes.corporais.perimetroAntebraco" value={formData.medicoes.corporais.perimetroAntebraco} />
                <MeasurementInput label="Braço" unit="cm" path="medicoes.corporais.perimetroBraco" value={formData.medicoes.corporais.perimetroBraco} />
                <MeasurementInput label="Braço Fletido" unit="cm" path="medicoes.corporais.perimetroBracoFletido" value={formData.medicoes.corporais.perimetroBracoFletido} />
                <MeasurementInput label="Braço Relaxado" unit="cm" path="medicoes.corporais.perimetroBracoRelaxado" value={formData.medicoes.corporais.perimetroBracoRelaxado} />
                <MeasurementInput label="Ombro" unit="cm" path="medicoes.corporais.perimetroOmbro" value={formData.medicoes.corporais.perimetroOmbro} />
                <MeasurementInput label="Peito" unit="cm" path="medicoes.corporais.perimetroPeito" value={formData.medicoes.corporais.perimetroPeito} />
                <MeasurementInput label="Pescoço" unit="cm" path="medicoes.corporais.perimetroPescoco" value={formData.medicoes.corporais.perimetroPescoco} />
                <MeasurementInput label="Pulso" unit="cm" path="medicoes.corporais.perimetroPulso" value={formData.medicoes.corporais.perimetroPulso} />
              </div>

              {/* Índices Calculados */}
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-nutri-blue"><Calculator size={16} /></div>
                    <span className="text-xs font-bold text-slate-600 uppercase">Relação Cintura-Estatura</span>
                  </div>
                  <span className="text-lg font-black text-slate-900">{calculatedMetrics.waistHeightRatio}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-nutri-blue"><Calculator size={16} /></div>
                    <span className="text-xs font-bold text-slate-600 uppercase">Relação Cintura-Quadril</span>
                  </div>
                  <span className="text-lg font-black text-slate-900">{calculatedMetrics.waistHipRatio}</span>
                </div>
              </div>
            </section>

            {/* DOBRAS CUTÂNEAS */}
            <section>
              <h3 className={sectionTitleClasses}><Activity size={16} className="text-nutri-blue" /> Dobras Cutâneas</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-8">
                <MeasurementInput label="Iliocristal" unit="mm" path="medicoes.dobras.iliocristal" value={formData.medicoes.dobras.iliocristal} />
                <MeasurementInput label="Supraespinal" unit="mm" path="medicoes.dobras.supraespinal" value={formData.medicoes.dobras.supraespinal} />
                <MeasurementInput label="Abdominal" unit="mm" path="medicoes.dobras.abdominal" value={formData.medicoes.dobras.abdominal} />
                <MeasurementInput label="Axilar Média" unit="mm" path="medicoes.dobras.axilarMedia" value={formData.medicoes.dobras.axilarMedia} />
                <MeasurementInput label="Bíceps" unit="mm" path="medicoes.dobras.biceps" value={formData.medicoes.dobras.biceps} />
                <MeasurementInput label="Coxa" unit="mm" path="medicoes.dobras.coxa" value={formData.medicoes.dobras.coxa} />
                <MeasurementInput label="Panturrilha" unit="mm" path="medicoes.dobras.panturrilha" value={formData.medicoes.dobras.panturrilha} />
                <MeasurementInput label="Peitoral" unit="mm" path="medicoes.dobras.peitoral" value={formData.medicoes.dobras.peitoral} />
                <MeasurementInput label="Subescapular" unit="mm" path="medicoes.dobras.subescapular" value={formData.medicoes.dobras.subescapular} />
                <MeasurementInput label="Suprailíaca" unit="mm" path="medicoes.dobras.suprailica" value={formData.medicoes.dobras.suprailica} />
                <MeasurementInput label="Tricipital" unit="mm" path="medicoes.dobras.tricipital" value={formData.medicoes.dobras.tricipital} />
              </div>

              {/* Somatórios Calculados */}
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-nutri-blue"><Calculator size={16} /></div>
                    <span className="text-xs font-bold text-slate-600 uppercase">Somatório de 5 dobras</span>
                  </div>
                  <span className="text-lg font-black text-slate-900">{calculatedMetrics.sum5} <span className="text-[10px] text-slate-500">mm</span></span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm text-nutri-blue"><Calculator size={16} /></div>
                    <span className="text-xs font-bold text-slate-600 uppercase">Somatório de 8 dobras</span>
                  </div>
                  <span className="text-lg font-black text-slate-900">{calculatedMetrics.sum8} <span className="text-[10px] text-slate-500">mm</span></span>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'bioimpedancia' && (
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* INDICADORES CHAVE */}
            <section>
              <h3 className={sectionTitleClasses}><Activity size={16} className="text-nutri-blue" /> Indicadores de Bioimpedância</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MeasurementInput icon={<Target size={16} />} label="Peso Corporal" unit="kg" path="bioimpedancia.indicadores.peso" value={formData.bioimpedancia.indicadores.peso} />
                <div>
                  <label className={labelClasses}>IMC Estimado</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"><Gauge size={16} /></div>
                    <input readOnly value={calculatedMetrics.imc} className={inputClasses + " bg-slate-50 border-slate-100 pl-11 cursor-default"} />
                    <span className={`absolute right-3 top-1 text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md ${calculatedMetrics.imcStatus === 'Adequado' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{calculatedMetrics.imcStatus}</span>
                  </div>
                </div>
                <MeasurementInput icon={<Heart size={16} />} label="% Gordura Corporal" unit="%" path="bioimpedancia.indicadores.gorduraPerc" value={formData.bioimpedancia.indicadores.gorduraPerc} />
                <MeasurementInput icon={<Zap size={16} />} label="% Massa Muscular" unit="%" path="bioimpedancia.indicadores.musculoPerc" value={formData.bioimpedancia.indicadores.musculoPerc} />
                <MeasurementInput icon={<AlertTriangle size={16} />} label="Gordura Visceral" unit="nv" path="bioimpedancia.indicadores.visceralNivel" value={formData.bioimpedancia.indicadores.visceralNivel} />
                <MeasurementInput icon={<Flame size={16} />} label="TMB Estimada" unit="kcal" path="bioimpedancia.indicadores.tmb" value={formData.bioimpedancia.indicadores.tmb} />
                <MeasurementInput icon={<Clock size={16} />} label="Idade Metabólica" unit="anos" path="bioimpedancia.indicadores.idadeMetabolica" value={formData.bioimpedancia.indicadores.idadeMetabolica} />
              </div>
            </section>

            {/* PERCENTUAIS CORPORAIS */}
            <section>
              <h3 className={sectionTitleClasses}><Activity size={16} className="text-nutri-blue" /> Percentuais Corporais</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MeasurementInput label="% Massa Gorda" unit="%" path="bioimpedancia.percentuais.gordaPerc" value={formData.bioimpedancia.percentuais.gordaPerc} />
                <MeasurementInput label="% Gordura Visceral" unit="%" path="bioimpedancia.percentuais.visceralPerc" value={formData.bioimpedancia.percentuais.visceralPerc} />
                <MeasurementInput label="% Massa Magra" unit="%" path="bioimpedancia.percentuais.magraPerc" value={formData.bioimpedancia.percentuais.magraPerc} />
                <MeasurementInput label="% Massa Muscular" unit="%" path="bioimpedancia.percentuais.muscularPerc" value={formData.bioimpedancia.percentuais.muscularPerc} />
                <MeasurementInput label="% Massa Óssea" unit="%" path="bioimpedancia.percentuais.osseaPerc" value={formData.bioimpedancia.percentuais.osseaPerc} />
                <MeasurementInput label="% Massa Residual" unit="%" path="bioimpedancia.percentuais.residualPerc" value={formData.bioimpedancia.percentuais.residualPerc} />
                <MeasurementInput label="% Livre de Gordura" unit="%" path="bioimpedancia.percentuais.livreGorduraPerc" value={formData.bioimpedancia.percentuais.livreGorduraPerc} />
              </div>
            </section>

            {/* COMPOSIÇÃO CORPORAL (ABS) */}
            <section>
              <h3 className={sectionTitleClasses}><Ruler size={16} className="text-nutri-blue" /> Composição Tecidual (kg)</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MeasurementInput label="Massa Corp. Magra" unit="kg" path="bioimpedancia.composicao.magraMassa" value={formData.bioimpedancia.composicao.magraMassa} />
                <MeasurementInput label="Massa Muscular" unit="kg" path="bioimpedancia.composicao.muscularMassa" value={formData.bioimpedancia.composicao.muscularMassa} />
                <MeasurementInput label="Massa Óssea" unit="kg" path="bioimpedancia.composicao.osseaMassa" value={formData.bioimpedancia.composicao.osseaMassa} />
                <MeasurementInput label="Massa Residual" unit="kg" path="bioimpedancia.composicao.residualMassa" value={formData.bioimpedancia.composicao.residualMassa} />
                <MeasurementInput label="Massa Celular" unit="kg" path="bioimpedancia.composicao.celularMassa" value={formData.bioimpedancia.composicao.celularMassa} />
                <MeasurementInput label="Massa Livre Gordura" unit="kg" path="bioimpedancia.composicao.livreGorduraMassa" value={formData.bioimpedancia.composicao.livreGorduraMassa} />
                <MeasurementInput label="Massa Gorda Total" unit="kg" path="bioimpedancia.composicao.gordaMassa" value={formData.bioimpedancia.composicao.gordaMassa} />
              </div>
            </section>

            {/* ÁGUA CORPORAL */}
            <section>
              <h3 className={sectionTitleClasses}><Droplets size={16} className="text-blue-500" /> Hidratação e Fluidos</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-4 p-6 bg-blue-50/30 rounded-2xl border border-blue-100">
                  <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-4">Volumes de Água (L)</p>
                  <MeasurementInput label="Água Corporal Total" unit="L" path="bioimpedancia.agua.total" value={formData.bioimpedancia.agua.total} />
                  <MeasurementInput label="Fluído Intracelular" unit="L" path="bioimpedancia.agua.intra" value={formData.bioimpedancia.agua.intra} />
                  <MeasurementInput label="Fluído Extracelular" unit="L" path="bioimpedancia.agua.extra" value={formData.bioimpedancia.agua.extra} />
                </div>
                <div className="space-y-4 p-6 bg-slate-50/50 rounded-2xl border border-slate-100 lg:col-span-2">
                  <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-4">Percentuais de Água (%)</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <MeasurementInput label="% Água Corporal" unit="%" path="bioimpedancia.agua.totalPerc" value={formData.bioimpedancia.agua.totalPerc} />
                    <MeasurementInput label="% Fluído Intra" unit="%" path="bioimpedancia.agua.intraPerc" value={formData.bioimpedancia.agua.intraPerc} />
                    <MeasurementInput label="% Fluído Extra" unit="%" path="bioimpedancia.agua.extraPerc" value={formData.bioimpedancia.agua.extraPerc} />
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeTab === 'exames' && (
          <div className="space-y-12 animate-in fade-in duration-300">
            {/* CONTROLES TÉCNICOS */}
            <div className="flex flex-col md:flex-row gap-6 p-6 bg-slate-50 rounded-3xl border border-slate-100 items-end">
              <div className="flex-1 w-full">
                <label className={labelClasses}><Calendar size={12} className="inline mr-1" /> Data da Coleta dos Exames</label>
                <input
                  type="date"
                  value={formData.exames.dataColeta}
                  onChange={(e) => handleInputChange('exames.dataColeta', e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>

            {/* BIOQUÍMICA E METABÓLICA */}
            <section>
              <h3 className={sectionTitleClasses}><Microscope size={16} className="text-nutri-blue" /> Bioquímica e Metabólica</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <MeasurementInput label="Glicemia de Jejum" unit="mg/dL" path="exames.bioquimica.glicemiaJejum" value={formData.exames.bioquimica.glicemiaJejum} />
                <MeasurementInput label="Glicose" unit="mg/dL" path="exames.bioquimica.glicose" value={formData.exames.bioquimica.glicose} />
                <MeasurementInput label="HbA1c" unit="%" path="exames.bioquimica.hbA1c" value={formData.exames.bioquimica.hbA1c} />
                <MeasurementInput label="Insulina" unit="uUI/mL" path="exames.bioquimica.insulina" value={formData.exames.bioquimica.insulina} />
                <MeasurementInput label="Colesterol Total" unit="mg/dL" path="exames.bioquimica.colesterolTotal" value={formData.exames.bioquimica.colesterolTotal} />
                <MeasurementInput label="HDL" unit="mg/dL" path="exames.bioquimica.hdl" value={formData.exames.bioquimica.hdl} />
                <MeasurementInput label="LDL" unit="mg/dL" path="exames.bioquimica.ldl" value={formData.exames.bioquimica.ldl} />
                <MeasurementInput label="Triglicerídeos" unit="mg/dL" path="exames.bioquimica.triglicerideos" value={formData.exames.bioquimica.triglicerideos} />
                <MeasurementInput label="Ácido Úrico" unit="mg/dL" path="exames.bioquimica.acidoUrico" value={formData.exames.bioquimica.acidoUrico} />
                <MeasurementInput label="Creatinina" unit="mg/dL" path="exames.bioquimica.creatinina" value={formData.exames.bioquimica.creatinina} />
                <MeasurementInput label="Uréia" unit="mg/dL" path="exames.bioquimica.ureia" value={formData.exames.bioquimica.ureia} />
                <MeasurementInput label="PCR" unit="mg/L" path="exames.bioquimica.pcr" value={formData.exames.bioquimica.pcr} />
                <MeasurementInput label="Albumina" unit="g/dL" path="exames.bioquimica.albumina" value={formData.exames.bioquimica.albumina} />
                <MeasurementInput label="Pré-albumina" unit="mg/dL" path="exames.bioquimica.preAlbumina" value={formData.exames.bioquimica.preAlbumina} />
              </div>
            </section>

            {/* HEMOGRAMA */}
            <section>
              <h3 className={sectionTitleClasses}><Activity size={16} className="text-rose-500" /> Hemograma</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <MeasurementInput label="Hemácias" unit="M/mm³" path="exames.hemograma.hemacias" value={formData.exames.hemograma.hemacias} />
                <MeasurementInput label="Hemoglobina" unit="g/dL" path="exames.hemograma.hemoglobina" value={formData.exames.hemograma.hemoglobina} />
                <MeasurementInput label="Hematócrito" unit="%" path="exames.hemograma.hematocrito" value={formData.exames.hemograma.hematocrito} />
                <MeasurementInput label="Leucócitos" unit="un/mm³" path="exames.hemograma.leucocitos" value={formData.exames.hemograma.leucocitos} />
                <MeasurementInput label="Neutrófilos" unit="%" path="exames.hemograma.neutrofilos" value={formData.exames.hemograma.neutrofilos} />
                <MeasurementInput label="Linfócitos" unit="%" path="exames.hemograma.linfocitos" value={formData.exames.hemograma.linfocitos} />
                <MeasurementInput label="Monócitos" unit="%" path="exames.hemograma.monocitos" value={formData.exames.hemograma.monocitos} />
                <MeasurementInput label="Eosinófilos" unit="%" path="exames.hemograma.eosinofilos" value={formData.exames.hemograma.eosinofilos} />
                <MeasurementInput label="Basófilos" unit="%" path="exames.hemograma.basofilos" value={formData.exames.hemograma.basofilos} />
                <MeasurementInput label="Plaquetas" unit="mil/mm³" path="exames.hemograma.plaquetas" value={formData.exames.hemograma.plaquetas} />
              </div>
            </section>

            {/* HORMÔNIOS */}
            <section>
              <h3 className={sectionTitleClasses}><Zap size={16} className="text-amber-500" /> Hormônios</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <MeasurementInput label="TSH" unit="uUI/mL" path="exames.hormonios.tsh" value={formData.exames.hormonios.tsh} />
                <MeasurementInput label="T3" unit="ng/dL" path="exames.hormonios.t3" value={formData.exames.hormonios.t3} />
                <MeasurementInput label="T4" unit="ng/dL" path="exames.hormonios.t4" value={formData.exames.hormonios.t4} />
                <MeasurementInput label="PTH" unit="pg/mL" path="exames.hormonios.pth" value={formData.exames.hormonios.pth} />
                <MeasurementInput label="Prolactina" unit="ng/mL" path="exames.hormonios.prolactina" value={formData.exames.hormonios.prolactina} />
                <MeasurementInput label="Glucagon" unit="pg/mL" path="exames.hormonios.glucagon" value={formData.exames.hormonios.glucagon} />
              </div>
            </section>

            {/* VITAMINAS E MINERAIS */}
            <section>
              <h3 className={sectionTitleClasses}><Droplets size={16} className="text-emerald-500" /> Vitaminas e Minerais</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <MeasurementInput label="Vitamina A" unit="ug/dL" path="exames.vitaminas.vitA" value={formData.exames.vitaminas.vitA} />
                <MeasurementInput label="Vitamina B6" unit="ng/mL" path="exames.vitaminas.vitB6" value={formData.exames.vitaminas.vitB6} />
                <MeasurementInput label="Vitamina B12" unit="pg/mL" path="exames.vitaminas.vitB12" value={formData.exames.vitaminas.vitB12} />
                <MeasurementInput label="Vitamina C" unit="mg/dL" path="exames.vitaminas.vitC" value={formData.exames.vitaminas.vitC} />
                <MeasurementInput label="Vitamina D" unit="ng/mL" path="exames.vitaminas.vitD" value={formData.exames.vitaminas.vitD} />
                <MeasurementInput label="Vitamina E" unit="mg/dL" path="exames.vitaminas.vitE" value={formData.exames.vitaminas.vitE} />
                <MeasurementInput label="Ácido Folico" unit="ng/mL" path="exames.vitaminas.acidoFolico" value={formData.exames.vitaminas.acidoFolico} />
                <MeasurementInput label="Ferro" unit="ug/dL" path="exames.vitaminas.ferro" value={formData.exames.vitaminas.ferro} />
                <MeasurementInput label="Ferritina" unit="ng/mL" path="exames.vitaminas.ferritina" value={formData.exames.vitaminas.ferritina} />
                <MeasurementInput label="Zinco" unit="ug/dL" path="exames.vitaminas.zinco" value={formData.exames.vitaminas.zinco} />
                <MeasurementInput label="Magnésio" unit="mg/dL" path="exames.vitaminas.magnesio" value={formData.exames.vitaminas.magnesio} />
                <MeasurementInput label="Cálcio" unit="mg/dL" path="exames.vitaminas.calcio" value={formData.exames.vitaminas.calcio} />
                <MeasurementInput label="Fósforo" unit="mg/dL" path="exames.vitaminas.fosforo" value={formData.exames.vitaminas.fosforo} />
                <MeasurementInput label="Sódio" unit="mEq/L" path="exames.vitaminas.sodio" value={formData.exames.vitaminas.sodio} />
                <MeasurementInput label="Potássio" unit="mEq/L" path="exames.vitaminas.potassio" value={formData.exames.vitaminas.potassio} />
              </div>
            </section>

            {/* SINAIS VITAIS */}
            <section>
              <h3 className={sectionTitleClasses}><Heart size={16} className="text-blue-500" /> Sinais Vitais</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <MeasurementInput label="PA Sistólica" unit="mmHg" path="exames.sinaisVitais.paSistolica" value={formData.exames.sinaisVitais.paSistolica} />
                <MeasurementInput label="PA Diastólica" unit="mmHg" path="exames.sinaisVitais.paDiastolica" value={formData.exames.sinaisVitais.paDiastolica} />
                <MeasurementInput label="Freq. Cardíaca" unit="bpm" path="exames.sinaisVitais.fc" value={formData.exames.sinaisVitais.fc} />
                <MeasurementInput label="Freq. Cardíaca Máx" unit="bpm" path="exames.sinaisVitais.fcMax" value={formData.exames.sinaisVitais.fcMax} />
                <MeasurementInput label="pH Arterial" unit="ph" path="exames.sinaisVitais.phArterial" value={formData.exames.sinaisVitais.phArterial} />
              </div>
            </section>
          </div>
        )}

        {activeTab === 'observacoes' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h3 className={sectionTitleClasses}><FileText size={16} className="text-nutri-blue" /> Análise Clínica</h3>
            <textarea rows={12} value={formData.observacoes} onChange={(e) => handleInputChange('observacoes', e.target.value)} className={inputClasses + " resize-none p-6"} placeholder="Feedback subjetivo..." />
          </div>
        )}
      </div>
    </div>
  );
};

export default ClinicalConsultation;
