
import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Activity, Database, Flame, Droplets, Zap, Ruler } from 'lucide-react';

export interface HouseholdMeasure {
  id: string;
  singular: string;
  plural: string;
  quantity: string;
  totalGrams: string;
  ediblePart: string;
}

export interface Food {
  id: string;
  name: string;
  energy: number;
  fat: number;
  carbs: number;
  protein: number;
  fiber: number;
  sodium: number;
  group?: string;
  measures?: HouseholdMeasure[];
  isSupplement?: boolean;
  // Micronutrients
  cholesterol?: number;
  water?: number;
  vitA?: number;
  vitB6?: number;
  vitB12?: number;
  vitC?: number;
  vitD?: number;
  vitE?: number;
  vitK?: number;
  starch?: number;
  lactose?: number;
  alcohol?: number;
  caffeine?: number;
  sugars?: number;
  calcium?: number;
  iron?: number;
  magnesium?: number;
  phosphorus?: number;
  potassium?: number;
  zinc?: number;
  copper?: number;
  fluorine?: number;
  manganese?: number;
  selenium?: number;
  thiamine?: number;
  riboflavin?: number;
  niacin?: number;
  pantothenicAcid?: number;
  folate?: number;
  folicAcid?: number;
  transFat?: number;
  saturatedFat?: number;
  monounsaturatedFat?: number;
  polyunsaturatedFat?: number;
  chloride?: number;
  choline?: number;
  betaine?: number;
  dha?: number;
  epa?: number;
  creatineMonohydrate?: number;
  biotin?: number;
  chromium?: number;
  iodine?: number;
  cla?: number;
  inositol?: number;
  creatine?: number;
  glutamine?: number;
  lecithin?: number;
  hyaluronicAcid?: number;
  chondroitinSulfate?: number;
  collagenComplex?: number;
  msm?: number;
  betaAlanine?: number;
  hmb?: number;
  // Aminogram
  tryptophan?: number;
  threonine?: number;
  isoleucine?: number;
  leucine?: number;
  lysine?: number;
  methionine?: number;
  cysteine?: number;
  phenylalanine?: number;
  tyrosine?: number;
  valine?: number;
  arginine?: number;
  histidine?: number;
  alanine?: number;
  aspartate?: number;
  glutamate?: number;
  glycine?: number;
  proline?: number;
  serine?: number;
}

interface FoodFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (food: Food) => void;
  isSupplement?: boolean;
  initialFood?: Food | null;
}

const FOOD_GROUPS = [
  "Laticínios e produtos a base de ovo",
  "Ervas e Temperos",
  "Comida para bebê",
  "Óleos e gorduras",
  "Produtos avícolas",
  "Sopas, molhos e caldos",
  "Salsichas, Embutidos e Frios",
  "Cereais matinais",
  "Frutas e Sucos",
  "Produtos Suínos",
  "Vegetais, Verduras e derivados",
  "Nozes e sementes oleaginosas",
  "Produtos bovinos",
  "Bebidas",
  "Peixes e frutos do mar",
  "Legumes e derivados",
  "Cordeiro, Vitela e Caça",
  "Produtos de padaria e rotisseria",
  "Doces",
  "Grãos e Massas",
  "Fast Foods",
  "Refeições, Entradas e Acompanhamentos",
  "Salgadinhos e aperitivos",
  "Alimentos nativos Indio-Americanos/Alaska",
  "Comida de restaurante"
];

const MICRONUTRIENTS_LIST = [
  { label: 'Colesterol', unit: 'mg', key: 'cholesterol' },
  { label: 'Fibra alimentar', unit: 'g', key: 'fiber' },
  { label: 'Sódio', unit: 'mg', key: 'sodium' },
  { label: 'Água', unit: 'g', key: 'water' },
  { label: 'Vitamina A', unit: 'ug', key: 'vitA' },
  { label: 'Vitamina B6', unit: 'mg', key: 'vitB6' },
  { label: 'Vitamina B12', unit: 'ug', key: 'vitB12' },
  { label: 'Vitamina C', unit: 'mg', key: 'vitC' },
  { label: 'Vitamina D', unit: 'ug', key: 'vitD' },
  { label: 'Vitamina E', unit: 'mg', key: 'vitE' },
  { label: 'Vitamina K', unit: 'ug', key: 'vitK' },
  { label: 'Amido', unit: 'g', key: 'starch' },
  { label: 'Lactose', unit: 'g', key: 'lactose' },
  { label: 'Álcool', unit: 'g', key: 'alcohol' },
  { label: 'Cafeína', unit: 'mg', key: 'caffeine' },
  { label: 'Açúcares', unit: 'g', key: 'sugars' },
  { label: 'Cálcio', unit: 'mg', key: 'calcium' },
  { label: 'Ferro', unit: 'mg', key: 'iron' },
  { label: 'Magnésio', unit: 'mg', key: 'magnesium' },
  { label: 'Fósforo', unit: 'mg', key: 'phosphorus' },
  { label: 'Potássio', unit: 'mg', key: 'potassium' },
  { label: 'Zinco', unit: 'mg', key: 'zinc' },
  { label: 'Cobre', unit: 'mg', key: 'copper' },
  { label: 'Flúor', unit: 'ug', key: 'fluorine' },
  { label: 'Manganês', unit: 'mg', key: 'manganese' },
  { label: 'Selênio', unit: 'ug', key: 'selenium' },
  { label: 'Tiamina', unit: 'mg', key: 'thiamine' },
  { label: 'Riboflavina', unit: 'mg', key: 'riboflavin' },
  { label: 'Niacina', unit: 'mg', key: 'niacin' },
  { label: 'Ácido Pantotênico', unit: 'mg', key: 'pantothenicAcid' },
  { label: 'Folato', unit: 'ug', key: 'folate' },
  { label: 'Ácido fólico', unit: 'ug', key: 'folicAcid' },
  { label: 'Gorduras trans', unit: 'g', key: 'transFat' },
  { label: 'Gorduras saturadas', unit: 'g', key: 'saturatedFat' },
  { label: 'Gorduras monoinsaturadas', unit: 'g', key: 'monounsaturatedFat' },
  { label: 'Gorduras poliinsaturadas', unit: 'g', key: 'polyunsaturatedFat' },
  { label: 'Cloreto', unit: 'mg', key: 'chloride' },
  { label: 'Colina', unit: 'mg', key: 'choline' },
  { label: 'Betaína', unit: 'mg', key: 'betaine' },
  { label: 'DHA', unit: 'g', key: 'dha' },
  { label: 'EPA', unit: 'g', key: 'epa' },
  { label: 'Monohidrato de creatina', unit: 'g', key: 'creatineMonohydrate' },
  { label: 'Biotina', unit: 'ug', key: 'biotin' },
  { label: 'Crômio', unit: 'ug', key: 'chromium' },
  { label: 'Iodo', unit: 'ug', key: 'iodine' },
  { label: 'CLA', unit: 'g', key: 'cla' },
  { label: 'Inositol', unit: 'mg', key: 'inositol' },
  { label: 'Creatina', unit: 'g', key: 'creatine' },
  { label: 'Glutamina', unit: 'mg', key: 'glutamine' },
  { label: 'Lecitina', unit: 'mg', key: 'lecithin' },
  { label: 'Ácido Hialurônico', unit: 'mg', key: 'hyaluronicAcid' },
  { label: 'Sulfato de condroitina', unit: 'mg', key: 'chondroitinSulfate' },
  { label: 'Complexo de colagéno', unit: 'mg', key: 'collagenComplex' },
  { label: 'Metilsulfonilmetano', unit: 'mg', key: 'msm' },
  { label: 'Beta-Alanina', unit: 'ug', key: 'betaAlanine' },
  { label: 'HMB', unit: 'mg', key: 'hmb' },
];

const AMINOGRAM_LIST = [
  { label: 'Triptofano', unit: 'g', key: 'tryptophan' },
  { label: 'Treonina', unit: 'g', key: 'threonine' },
  { label: 'Isoleucina', unit: 'g', key: 'isoleucine' },
  { label: 'Leucina', unit: 'g', key: 'leucine' },
  { label: 'Lisina', unit: 'g', key: 'lysine' },
  { label: 'Metionina', unit: 'g', key: 'methionine' },
  { label: 'Cisteína', unit: 'g', key: 'cysteine' },
  { label: 'Fenilalanina', unit: 'g', key: 'phenylalanine' },
  { label: 'Tirosina', unit: 'g', key: 'tyrosine' },
  { label: 'Valina', unit: 'g', key: 'valine' },
  { label: 'Arginina', unit: 'g', key: 'arginine' },
  { label: 'Histidina', unit: 'g', key: 'histidine' },
  { label: 'Alanina', unit: 'g', key: 'alanine' },
  { label: 'Aspartato', unit: 'g', key: 'aspartate' },
  { label: 'Glutamato', unit: 'g', key: 'glutamate' },
  { label: 'Glicina', unit: 'g', key: 'glycine' },
  { label: 'Prolina', unit: 'g', key: 'proline' },
  { label: 'Serina', unit: 'g', key: 'serine' },
];

const FoodFormModal: React.FC<FoodFormModalProps> = ({ isOpen, onClose, onSave, isSupplement, initialFood }) => {
  const [activeTab, setActiveTab] = useState<'nutrition' | 'measures'>('nutrition');
  const [formData, setFormData] = useState<Record<string, any>>({
    name: '',
    source: 'Meus alimentos',
    group: '',
    quantity: '100',
    energy: '',
    fat: '',
    carbs: '',
    protein: '',
    fiber: '',
    sodium: '',
  });

  const [measures, setMeasures] = useState<HouseholdMeasure[]>([]);

  useEffect(() => {
    if (initialFood && isOpen) {
      const newFormData: any = {
        name: initialFood.name,
        source: 'Meus alimentos',
        group: initialFood.group || '',
        quantity: '100',
        energy: initialFood.energy?.toString() || '',
        fat: initialFood.fat?.toString() || '',
        carbs: initialFood.carbs?.toString() || '',
        protein: initialFood.protein?.toString() || '',
        fiber: initialFood.fiber?.toString() || '',
        sodium: initialFood.sodium?.toString() || '',
      };
      
      // Populate micronutrients and aminogram
      [...MICRONUTRIENTS_LIST, ...AMINOGRAM_LIST].forEach(item => {
        if ((initialFood as any)[item.key] !== undefined) {
          newFormData[item.key] = (initialFood as any)[item.key].toString();
        }
      });
      
      setFormData(newFormData);
      setMeasures(initialFood.measures || []);
    } else if (isOpen) {
      // Reset for new entry
      setFormData({
        name: '',
        source: 'Meus alimentos',
        group: '',
        quantity: '100',
        energy: '',
        fat: '',
        carbs: '',
        protein: '',
        fiber: '',
        sodium: '',
      });
      setMeasures([]);
      setActiveTab('nutrition');
    }
  }, [initialFood, isOpen]);

  if (!isOpen) return null;

  const addMeasure = () => {
    setMeasures([...measures, {
      id: Date.now().toString(),
      singular: '',
      plural: '',
      quantity: '1',
      totalGrams: '',
      ediblePart: '100'
    }]);
  };

  const updateMeasure = (id: string, field: keyof HouseholdMeasure, value: string) => {
    setMeasures(measures.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const removeMeasure = (id: string) => {
    setMeasures(measures.filter(m => m.id !== id));
  };

  const inputClasses = "w-full px-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-nutri-blue/20 focus:border-nutri-blue outline-none text-sm font-medium text-slate-700 transition-all";
  const labelClasses = "block text-[11px] font-bold text-slate-500 mb-1.5 ml-0.5";

  const handleFieldChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-[24px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800">
            {initialFood ? 'Editar' : 'Adicionar novo'} {isSupplement ? 'suplemento' : 'alimento'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 transition-colors"><X size={20}/></button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 no-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClasses}>Nome</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Activity size={16}/></div>
                <input value={formData.name} onChange={e => handleFieldChange('name', e.target.value)} placeholder={`Nome do ${isSupplement ? 'suplemento' : 'alimento'}`} className={inputClasses + " pl-10"} />
              </div>
            </div>
            <div>
              <label className={labelClasses}>Fonte</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Database size={16}/></div>
                <input value={formData.source} readOnly className={inputClasses + " pl-10 bg-slate-50"} />
              </div>
            </div>
            <div>
              <label className={labelClasses}>Grupo</label>
              <select value={formData.group} onChange={e => handleFieldChange('group', e.target.value)} className={inputClasses}>
                <option value="">Selecione o grupo do {isSupplement ? 'suplemento' : 'alimento'}</option>
                {FOOD_GROUPS.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClasses}>Quantidade</label>
              <div className="flex gap-2">
                <input value={formData.quantity} readOnly className={inputClasses + " flex-1 text-center font-bold bg-slate-50"} />
                <div className={inputClasses + " flex-1 bg-slate-50 flex items-center justify-center font-bold"}>
                  gramas
                </div>
              </div>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('nutrition')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'nutrition' ? 'bg-white text-nutri-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
               Valor nutricional por 100 g
            </button>
            <button 
              onClick={() => setActiveTab('measures')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${activeTab === 'measures' ? 'bg-white text-nutri-blue shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
               Medidas caseiras
            </button>
          </div>

          {activeTab === 'nutrition' ? (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <Activity size={14} className="text-nutri-blue" /> Macronutrientes
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className={labelClasses}>Energia</label>
                    <div className="relative">
                      <input value={formData.energy} onChange={e => handleFieldChange('energy', e.target.value)} placeholder="0" className={inputClasses + " pr-12 text-right"} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">kcal</span>
                    </div>
                  </div>
                  <div>
                    <label className={labelClasses}>Gordura</label>
                    <div className="relative">
                      <input value={formData.fat} onChange={e => handleFieldChange('fat', e.target.value)} placeholder="0" className={inputClasses + " pr-12 text-right"} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">g</span>
                    </div>
                  </div>
                  <div>
                    <label className={labelClasses}>Carboidratos</label>
                    <div className="relative">
                      <input value={formData.carbs} onChange={e => handleFieldChange('carbs', e.target.value)} placeholder="0" className={inputClasses + " pr-12 text-right"} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">g</span>
                    </div>
                  </div>
                  <div>
                    <label className={labelClasses}>Proteína</label>
                    <div className="relative">
                      <input value={formData.protein} onChange={e => handleFieldChange('protein', e.target.value)} placeholder="0" className={inputClasses + " pr-12 text-right"} />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">g</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <Zap size={14} className="text-nutri-blue" /> Micronutrientes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                  {MICRONUTRIENTS_LIST.map((mic) => (
                    <div key={mic.key}>
                      <label className={labelClasses}>{mic.label}</label>
                      <div className="relative">
                        <input 
                          value={formData[mic.key] || ''} 
                          onChange={e => handleFieldChange(mic.key, e.target.value)}
                          placeholder="0" 
                          className={inputClasses + " pr-12 text-right"} 
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">{mic.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6 pt-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                  <Activity size={14} className="text-nutri-blue" /> Aminograma
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
                  {AMINOGRAM_LIST.map((amin) => (
                    <div key={amin.key}>
                      <label className={labelClasses}>{amin.label}</label>
                      <div className="relative">
                        <input 
                          value={formData[amin.key] || ''} 
                          onChange={e => handleFieldChange(amin.key, e.target.value)}
                          placeholder="0" 
                          className={inputClasses + " pr-12 text-right"} 
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">{amin.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-300">
              <button 
                onClick={addMeasure}
                className="w-full py-3.5 bg-blue-400 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2"
              >
                Adicionar nova medida caseira <Plus size={18} />
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {measures.map((measure, idx) => (
                  <div key={measure.id} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm space-y-6 relative group transition-all hover:border-nutri-blue/30">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-black text-slate-700">Medida caseira {idx + 1}</h4>
                      <button onClick={() => removeMeasure(measure.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className={labelClasses}>Nome no singular</label>
                        <input 
                          value={measure.singular} 
                          onChange={e => updateMeasure(measure.id, 'singular', e.target.value)}
                          placeholder="Ex: colher" 
                          className={inputClasses} 
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>Nome no plural</label>
                        <input 
                          value={measure.plural} 
                          onChange={e => updateMeasure(measure.id, 'plural', e.target.value)}
                          placeholder="Ex: colheres" 
                          className={inputClasses} 
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>Quantidade</label>
                        <input 
                          value={measure.quantity} 
                          onChange={e => updateMeasure(measure.id, 'quantity', e.target.value)}
                          placeholder="1" 
                          className={inputClasses} 
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelClasses}>Gramas totais</label>
                          <input 
                            value={measure.totalGrams} 
                            onChange={e => updateMeasure(measure.id, 'totalGrams', e.target.value)}
                            placeholder="50" 
                            className={inputClasses} 
                          />
                        </div>
                        <div>
                          <label className={labelClasses}>Parte comestível (%)</label>
                          <input 
                            value={measure.ediblePart} 
                            onChange={e => updateMeasure(measure.id, 'ediblePart', e.target.value)}
                            placeholder="100" 
                            className={inputClasses} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <button onClick={onClose} className="px-6 py-2.5 text-slate-600 font-bold text-sm hover:bg-slate-100 rounded-xl transition-all">Cancelar</button>
          <button 
            onClick={() => {
              const nutritionData: any = {
                id: initialFood?.id || Date.now().toString(),
                name: formData.name,
                energy: Number(formData.energy.toString().replace(',', '.')),
                fat: Number(formData.fat.toString().replace(',', '.')),
                carbs: Number(formData.carbs.toString().replace(',', '.')),
                protein: Number(formData.protein.toString().replace(',', '.')),
                fiber: Number(formData.fiber.toString().replace(',', '.')),
                sodium: Number(formData.sodium.toString().replace(',', '.')),
                group: formData.group,
                measures: measures.length > 0 ? measures : undefined,
                isSupplement: isSupplement
              };
              
              // Map all other numeric micronutrients
              [...MICRONUTRIENTS_LIST, ...AMINOGRAM_LIST].forEach(item => {
                if (formData[item.key] !== undefined && formData[item.key] !== '') {
                  nutritionData[item.key] = Number(formData[item.key].toString().replace(',', '.'));
                }
              });

              onSave(nutritionData);
            }}
            disabled={!formData.name}
            className="px-8 py-2.5 bg-nutri-blue hover:bg-nutri-blue-hover disabled:opacity-50 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-nutri-blue/20"
          >
            {initialFood ? 'Atualizar e fechar' : 'Salvar e fechar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodFormModal;
