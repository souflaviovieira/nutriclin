
import React, { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Clock,
  ChevronDown,
  ChevronUp,
  Save,
  Copy,
  Search,
  Zap,
  RotateCcw,
  X,
  Layout,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { mealPlanService } from '../services/mealPlanService';

interface FoodItem {
  id: string;
  name: string;
  quantity: string;
  unit: string;
  substitutions: string[];
}

interface Meal {
  id: string;
  name: string;
  time: string;
  items: FoodItem[];
  isOpen: boolean;
}

interface MealPlanModel {
  id: string;
  name: string;
  description: string;
  meals: Meal[];
}

interface MealPlanCreatorProps {
  onBack: () => void;
  patientName: string;
  patientId?: string;
}

const MOCK_MODELS: MealPlanModel[] = [
  {
    id: 'mod1',
    name: 'Plano alimentar cetogênico 1500 kcal',
    description: 'Foco em alta gordura e baixo carboidrato para indução de cetose.',
    meals: [
      {
        id: 'm1', name: 'Café da Manhã', time: '08:00', isOpen: true,
        items: [{ id: 'i1', name: 'Ovos mexidos na manteiga', quantity: '3', unit: 'unidades', substitutions: ['Omelete com queijo'] }]
      },
      {
        id: 'm2', name: 'Almoço', time: '12:30', isOpen: true,
        items: [{ id: 'i2', name: 'Sobrecoxa de frango assada', quantity: '150', unit: 'g', substitutions: ['Salmão grelhado'] }]
      }
    ]
  },
  {
    id: 'mod2',
    name: 'Plano alimentar de 2000 kcal (Hipertrofia)',
    description: 'Equilibrado em macros para ganho de massa magra.',
    meals: [
      {
        id: 'm1', name: 'Café da Manhã', time: '07:30', isOpen: true,
        items: [
          { id: 'i1', name: 'Pão Integral', quantity: '2', unit: 'fatias', substitutions: [] },
          { id: 'i2', name: 'Pasta de Amendoim', quantity: '1', unit: 'colher', substitutions: [] }
        ]
      },
      {
        id: 'm2', name: 'Almoço', time: '12:00', isOpen: true,
        items: [
          { id: 'i3', name: 'Arroz Integral', quantity: '150', unit: 'g', substitutions: [] },
          { id: 'i4', name: 'Feijão Carioca', quantity: '100', unit: 'g', substitutions: [] }
        ]
      }
    ]
  }
];

const MealPlanCreator: React.FC<MealPlanCreatorProps> = ({ onBack, patientName, patientId }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [meals, setMeals] = useState<Meal[]>([
    {
      id: '1',
      name: 'Café da Manhã',
      time: '07:30',
      isOpen: true,
      items: [
        { id: 'i1', name: 'Pão Integral', quantity: '2', unit: 'fatias', substitutions: ['Torrada integral', 'Tapioca (40g)'] },
        { id: 'i2', name: 'Ovo Mexido', quantity: '2', unit: 'unidades', substitutions: ['Queijo Branco (2 fatias)'] }
      ]
    },
    {
      id: '2',
      name: 'Almoço',
      time: '12:30',
      isOpen: false,
      items: []
    }
  ]);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [modelSearchTerm, setModelSearchTerm] = useState('');

  const toggleMeal = (id: string) => {
    setMeals(meals.map(m => m.id === id ? { ...m, isOpen: !m.isOpen } : m));
  };

  const addMeal = () => {
    const newMeal: Meal = {
      id: Date.now().toString(),
      name: 'Nova Refeição',
      time: '00:00',
      isOpen: true,
      items: []
    };
    setMeals([...meals, newMeal]);
  };

  const removeMeal = (id: string) => {
    setMeals(meals.filter(m => m.id !== id));
  };

  const addItem = (mealId: string) => {
    setMeals(meals.map(m => {
      if (m.id === mealId) {
        const newItem: FoodItem = {
          id: Date.now().toString(),
          name: '',
          quantity: '',
          unit: 'g',
          substitutions: []
        };
        return { ...m, items: [...m.items, newItem], isOpen: true };
      }
      return m;
    }));
  };

  const removeItem = (mealId: string, itemId: string) => {
    setMeals(meals.map(m => {
      if (m.id === mealId) {
        return { ...m, items: m.items.filter(i => i.id !== itemId) };
      }
      return m;
    }));
  };

  const updateItem = (mealId: string, itemId: string, field: keyof FoodItem, value: any) => {
    setMeals(meals.map(m => {
      if (m.id === mealId) {
        return {
          ...m,
          items: m.items.map(i => i.id === itemId ? { ...i, [field]: value } : i)
        };
      }
      return m;
    }));
  };

  const handleImportModel = (model: MealPlanModel) => {
    // Replace current structure with model structure
    // Adding unique IDs to avoid conflicts if multiple imports happen
    const importedMeals = model.meals.map(m => ({
      ...m,
      id: `imp-${m.id}-${Date.now()}`,
      items: m.items.map(i => ({ ...i, id: `imp-i-${i.id}-${Date.now()}` }))
    }));
    setMeals(importedMeals);
    setIsImportModalOpen(false);
  };

  const filteredModels = MOCK_MODELS.filter(m =>
    m.name.toLowerCase().includes(modelSearchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-cream-50 rounded-xl text-slate-400 hover:text-coral-500 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Plano Alimentar</h1>
            <p className="text-sm text-slate-500">Paciente: <span className="font-semibold text-coral-500">{patientName}</span></p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all shadow-sm"
          >
            <Copy size={18} /> Importar Modelo
          </button>
          <button
            onClick={async () => {
              try {
                setIsSaving(true);
                const payload = {
                  patient_id: patientId,
                  name: `Plano de ${patientName} - ${new Date().toLocaleDateString('pt-BR')}`,
                  meals: meals,
                  is_model: false
                };
                await mealPlanService.saveMealPlan(payload);
                alert("Plano alimentar salvo com sucesso!");
                onBack();
              } catch (err: any) {
                console.error(err);
                alert("Erro ao salvar plano: " + err.message);
              } finally {
                setIsSaving(false);
              }
            }}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-coral-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-coral-500/20 hover:bg-coral-600 transition-all disabled:opacity-50"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            Salvar Plano
          </button>
        </div>
      </div>

      {/* Meals List */}
      <div className="space-y-4">
        {meals.map((meal) => (
          <div key={meal.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300">
            {/* Meal Header */}
            <div className={`p-5 flex items-center justify-between cursor-pointer hover:bg-cream-50/50 transition-colors ${meal.isOpen ? 'border-b border-cream-100' : ''}`} onClick={() => toggleMeal(meal.id)}>
              <div className="flex items-center gap-4">
                <div className="bg-coral-50 p-2 rounded-lg text-coral-500">
                  <Clock size={20} />
                </div>
                <div>
                  <input
                    type="text"
                    value={meal.name}
                    onChange={(e) => {
                      e.stopPropagation();
                      setMeals(meals.map(m => m.id === meal.id ? { ...m, name: e.target.value } : m));
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="font-bold text-slate-800 bg-transparent border-none focus:ring-0 p-0 text-lg w-48"
                  />
                  <input
                    type="time"
                    value={meal.time}
                    onChange={(e) => {
                      e.stopPropagation();
                      setMeals(meals.map(m => m.id === meal.id ? { ...m, time: e.target.value } : m));
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="block text-xs font-bold text-slate-400 bg-transparent border-none focus:ring-0 p-0 mt-0.5"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={(e) => { e.stopPropagation(); removeMeal(meal.id); }}
                  className="p-2 text-slate-300 hover:text-rose-500 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
                <div className="text-slate-400">
                  {meal.isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </div>
            </div>

            {/* Meal Body */}
            {meal.isOpen && (
              <div className="p-5 space-y-6">
                <div className="space-y-4">
                  {meal.items.map((item) => (
                    <div key={item.id} className="p-4 rounded-xl border border-slate-50 bg-slate-50/30 space-y-3">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Alimento</label>
                          <div className="relative group">
                            <input
                              type="text"
                              value={item.name}
                              placeholder="Ex: Arroz Integral"
                              onChange={(e) => updateItem(meal.id, item.id, 'name', e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-nutri-blue/20 focus:border-nutri-blue outline-none transition-all"
                            />
                            <button className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-nutri-blue transition-colors">
                              <Search size={14} />
                            </button>
                          </div>
                        </div>
                        <div className="w-full md:w-32">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Quant.</label>
                          <input
                            type="text"
                            value={item.quantity}
                            placeholder="100"
                            onChange={(e) => updateItem(meal.id, item.id, 'quantity', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-nutri-blue/20 focus:border-nutri-blue outline-none"
                          />
                        </div>
                        <div className="w-full md:w-32">
                          <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Unidade</label>
                          <select
                            value={item.unit}
                            onChange={(e) => updateItem(meal.id, item.id, 'unit', e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-nutri-blue/20 focus:border-nutri-blue outline-none"
                          >
                            <option value="g">gramas (g)</option>
                            <option value="ml">ml</option>
                            <option value="unidades">unidades</option>
                            <option value="fatias">fatias</option>
                            <option value="colher">colher sopa</option>
                          </select>
                        </div>
                        <div className="flex items-end">
                          <button
                            onClick={() => removeItem(meal.id, item.id)}
                            className="p-2.5 text-slate-300 hover:text-rose-500 transition-colors mb-0.5"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>

                      {/* Substitutions */}
                      <div>
                        <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Substituições</label>
                        <div className="flex flex-wrap gap-2">
                          {item.substitutions.map((sub, sIdx) => (
                            <span key={sIdx} className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-100 rounded-full text-xs font-medium text-slate-600">
                              {sub}
                              <button onClick={() => {
                                const newSubs = item.substitutions.filter((_, idx) => idx !== sIdx);
                                updateItem(meal.id, item.id, 'substitutions', newSubs);
                              }}>
                                <Plus size={12} className="rotate-45 text-slate-400 hover:text-rose-500" />
                              </button>
                            </span>
                          ))}
                          <button
                            onClick={() => {
                              const promptVal = prompt("Digite a substituição:");
                              if (promptVal) {
                                updateItem(meal.id, item.id, 'substitutions', [...item.substitutions, promptVal]);
                              }
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-nutri-blue/10 text-nutri-blue rounded-full text-xs font-bold hover:bg-nutri-blue/20 transition-all"
                          >
                            <Plus size={12} /> Adicionar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => addItem(meal.id)}
                    className="flex-1 py-3 border-2 border-dashed border-slate-100 rounded-xl text-slate-400 hover:text-nutri-blue hover:border-nutri-blue/30 hover:bg-nutri-blue/5 transition-all text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <Plus size={18} /> Adicionar Alimento
                  </button>
                  <button className="p-3 border-2 border-dashed border-slate-100 rounded-xl text-slate-400 hover:text-blue-500 hover:border-blue-200 hover:bg-blue-50/30 transition-all" title="Copiar de outro plano">
                    <Copy size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions Footer */}
      <div className="flex items-center justify-between pt-4">
        <button
          onClick={addMeal}
          className="px-6 py-3 bg-nutri-blue text-white rounded-2xl text-sm font-bold shadow-lg shadow-nutri-blue/20 hover:bg-nutri-blue-hover transition-all flex items-center gap-2"
        >
          <Plus size={18} /> Adicionar Refeição
        </button>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-nutri-blue font-bold text-sm bg-nutri-blue/10 rounded-xl hover:bg-nutri-blue/20 transition-colors">
            <Zap size={18} /> Gerar Sugestão com IA
          </button>
        </div>
      </div>

      {/* Import Model Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-[100] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-300">
            <div className="p-6 md:p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-nutri-blue/10 text-nutri-blue rounded-xl">
                  <Layout size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-800 tracking-tight">Importar Modelo de Plano</h2>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">Selecione um guia para começar</p>
                </div>
              </div>
              <button onClick={() => setIsImportModalOpen(false)} className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-6 flex-1 overflow-y-auto no-scrollbar">
              <div className="relative group">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-nutri-blue transition-colors" />
                <input
                  type="text"
                  placeholder="Buscar modelos..."
                  value={modelSearchTerm}
                  onChange={(e) => setModelSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-nutri-blue/5 focus:border-nutri-blue focus:bg-white outline-none text-sm font-semibold text-slate-700 transition-all shadow-inner"
                />
              </div>

              <div className="grid grid-cols-1 gap-4">
                {filteredModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => handleImportModel(model)}
                    className="text-left p-6 bg-white border border-slate-100 rounded-[24px] shadow-sm hover:border-nutri-blue/30 hover:shadow-md transition-all group relative overflow-hidden"
                  >
                    <div className="relative z-10 space-y-2">
                      <h4 className="text-base font-black text-slate-800 group-hover:text-nutri-blue transition-colors">{model.name}</h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">{model.description}</p>
                      <div className="flex items-center gap-3 pt-2">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-1 rounded-lg">{model.meals.length} Refeições</span>
                      </div>
                    </div>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-100 group-hover:text-nutri-blue/10 transition-colors">
                      <CheckCircle2 size={48} />
                    </div>
                  </button>
                ))}
                {filteredModels.length === 0 && (
                  <div className="py-20 text-center space-y-4 opacity-50">
                    <Layout size={48} className="mx-auto text-slate-200" />
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Nenhum modelo encontrado</p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 md:p-8 border-t border-slate-50 bg-slate-50/20 flex justify-end">
              <button onClick={() => setIsImportModalOpen(false)} className="px-8 py-3 text-sm font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealPlanCreator;
