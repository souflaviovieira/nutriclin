
import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Flame, 
  Droplets, 
  Circle, 
  Diamond, 
  ChevronRight, 
  ChevronLeft,
  Activity,
  X,
  Edit2,
  UserPlus,
  Trash2,
  GripVertical,
  Plus,
  Download,
  MoreVertical,
  ChevronUp,
  ListPlus,
  Search
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import FoodFormModal, { Food } from './FoodFormModal';

const INITIAL_REGISTERED_FOODS: Food[] = [
  { id: '1', name: 'Arroz Integral Cozido', energy: 124, fat: 1, carbs: 26, protein: 3, fiber: 2, sodium: 1, measures: [{ id: 'm0', singular: 'colher', plural: 'colheres', quantity: '1', totalGrams: '100', ediblePart: '100' }] },
  { id: '2', name: 'Feijão Carioca Cozido', energy: 76, fat: 0.5, carbs: 14, protein: 5, fiber: 8, sodium: 2 },
  { id: '3', name: 'Frango Grelhado (Peito)', energy: 159, fat: 2.5, carbs: 0, protein: 32, fiber: 0, sodium: 45 },
  { id: '4', name: 'Ovo de Galinha Cozido', energy: 155, fat: 11, carbs: 1.1, protein: 13, fiber: 0, sodium: 124, measures: [{ id: 'm1', singular: 'unidade', plural: 'unidades', quantity: '1', totalGrams: '50', ediblePart: '100' }] },
  { id: '5', name: 'Banana Nanica', energy: 92, fat: 0.3, carbs: 24, protein: 1.4, fiber: 2, sodium: 0, measures: [{ id: 'm2', singular: 'unidade média', plural: 'unidades médias', quantity: '1', totalGrams: '80', ediblePart: '100' }] },
  { id: '6', name: 'Tapioca (Goma)', energy: 240, fat: 0, carbs: 60, protein: 0, fiber: 0, sodium: 5, measures: [{ id: 'm3', singular: 'colher de sopa', plural: 'colheres de sopa', quantity: '1', totalGrams: '15', ediblePart: '100' }] },
  { id: '7', name: 'Azeite de Oliva Extra Virgem', energy: 884, fat: 100, carbs: 0, protein: 0, fiber: 0, sodium: 2 }
];

interface FoodItem {
  id: string;
  name: string;
  alternatives?: { id: string; name: string }[];
}

interface Meal {
  id: string;
  title: string;
  time: string;
  items: FoodItem[];
  notes?: string;
  macros: {
    energy: string;
    fat: string;
    carbs: string;
    protein: string;
    fiber: string;
  };
}

interface MealPlanModelViewProps {
  name: string;
  onBack: () => void;
}

const MealPlanModelView: React.FC<MealPlanModelViewProps> = ({ name, onBack }) => {
  const [mealStartIndex, setMealStartIndex] = useState(0);
  const [registeredFoods, setRegisteredFoods] = useState<Food[]>(INITIAL_REGISTERED_FOODS);
  
  const [addingAlternativeTo, setAddingAlternativeTo] = useState<{ mealId: string, foodId: string } | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Track inputs for each search result
  const [searchInputs, setSearchInputs] = useState<Record<string, { qty: string, measure: string }>>({});
  
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);

  const [meals, setMeals] = useState<Meal[]>([
    { 
      id: 'm1',
      title: 'Café da manhã', 
      time: '07:00', 
      items: [
        { 
          id: 'f1',
          name: '2 fatias de pão de forma de trigo integral (50 g)',
          alternatives: [{ id: 'alt1', name: '2 fatias de pão de forma industrializado (50 g)' }]
        },
        { id: 'f2', name: '1 colher de sopa cheia de queijo requeijão cremoso (30 g)' },
        { 
          id: 'f3',
          name: '1 copo pequeno cheio de suco de laranja da terra (165 ml)',
          alternatives: [{ id: 'alt2', name: '1 copo duplo cheio de suco de laranja pêra (240 ml)' }]
        }
      ],
      notes: '',
      macros: { energy: '280', fat: '9', carbs: '43', protein: '9', fiber: '3' }
    },
    { 
      id: 'm2',
      title: 'Lanche da manhã', 
      time: '10:00', 
      items: [
        { id: 'f4', name: '8 unidades de castanha-do-Brasil (32 g)' },
        { id: 'f5', name: '1 unidade de palito de queijo mussarela (38 g)' }
      ],
      macros: { energy: '323', fat: '29', carbs: '6', protein: '13', fiber: '3' }
    }
  ]);

  const globalMacros = [
    { name: 'Lipídios', value: 116.1, unit: 'g', color: '#f59e0b' },
    { name: 'Carboidratos', value: 35.3, unit: 'g', color: '#3b82f6' },
    { name: 'Proteínas', value: 84.5, unit: 'g', color: '#10b981' },
    { name: 'Fibra alimentar', value: 11.3, unit: 'g', color: '#94a3b8' }
  ];

  const filteredSearch = registeredFoods.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const addFoodToMeal = (mealId: string) => {
    setMeals(prev => prev.map(m => {
      if (m.id === mealId) {
        return {
          ...m,
          items: [...m.items, { id: `new-${Date.now()}`, name: 'Novo Alimento' }]
        };
      }
      return m;
    }));
  };

  const removeFoodFromMeal = (mealId: string, foodId: string) => {
    setMeals(prev => prev.map(m => {
      if (m.id === mealId) {
        return {
          ...m,
          items: m.items.filter(i => i.id !== foodId)
        };
      }
      return m;
    }));
  };

  const confirmAddAlternative = (food: Food) => {
    if (!addingAlternativeTo) return;
    const { mealId, foodId } = addingAlternativeTo;

    const inputs = searchInputs[food.id] || { qty: '', measure: '' };
    let formattedName = food.name;
    
    if (inputs.qty || inputs.measure) {
      // Basic weight calculation if measure is found
      let totalGrams = '';
      const qtyNum = parseFloat(inputs.qty.replace(',', '.')) || 0;
      
      if (qtyNum > 0) {
        const foundMeasure = food.measures?.find(m => 
          m.singular.toLowerCase() === inputs.measure.toLowerCase() || 
          m.plural.toLowerCase() === inputs.measure.toLowerCase()
        );
        
        if (foundMeasure) {
          const grams = (parseFloat(foundMeasure.totalGrams) / parseFloat(foundMeasure.quantity)) * qtyNum;
          totalGrams = ` (${Math.round(grams)}g)`;
        } else if (inputs.measure.toLowerCase() === 'g' || inputs.measure.toLowerCase() === 'gramas') {
          totalGrams = ` (${Math.round(qtyNum)}g)`;
        }
      }
      
      formattedName = `${inputs.qty} ${inputs.measure} de ${food.name}${totalGrams}`;
    }

    setMeals(prev => prev.map(m => {
      if (m.id === mealId) {
        return {
          ...m,
          items: m.items.map(i => {
            if (i.id === foodId) {
              const alts = i.alternatives || [];
              return { ...i, alternatives: [...alts, { id: `${food.id}-${Date.now()}`, name: formattedName }] };
            }
            return i;
          })
        };
      }
      return m;
    }));
    setAddingAlternativeTo(null);
    setSearchTerm('');
    setSearchInputs({});
  };

  const removeAlternative = (mealId: string, foodId: string, altId: string) => {
    setMeals(prev => prev.map(m => {
      if (m.id === mealId) {
        return {
          ...m,
          items: m.items.map(i => {
            if (i.id === foodId) {
              return { ...i, alternatives: i.alternatives?.filter(a => a.id !== altId) };
            }
            return i;
          })
        };
      }
      return m;
    }));
  };

  const handleNextMeals = () => {
    if (mealStartIndex + 4 < meals.length) setMealStartIndex(prev => prev + 1);
  };

  const handlePrevMeals = () => {
    if (mealStartIndex > 0) setMealStartIndex(prev => prev - 1);
  };

  const updateSearchInput = (foodId: string, field: 'qty' | 'measure', value: string) => {
    setSearchInputs(prev => ({
      ...prev,
      [foodId]: {
        ...(prev[foodId] || { qty: '', measure: '' }),
        [field]: value
      }
    }));
  };

  return (
    <div className="max-w-[1600px] mx-auto animate-in fade-in duration-500 pb-20 px-1 md:px-4">
      <FoodFormModal 
        isOpen={isFoodModalOpen} 
        onClose={() => { setIsFoodModalOpen(false); }} 
        onSave={(newFood) => {
          setRegisteredFoods([newFood, ...registeredFoods]);
          if (addingAlternativeTo) confirmAddAlternative(newFood);
          setIsFoodModalOpen(false);
        }} 
      />

      <div className="bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-4 md:gap-6 mb-8">
        <div className="flex items-center gap-3 md:gap-4 shrink-0 w-full md:w-auto">
          <button onClick={onBack} className="p-2 md:p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors border border-transparent hover:border-slate-100">
            <ArrowLeft size={22} />
          </button>
          <span className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Nome do modelo</span>
        </div>
        <div className="flex-1 w-full relative">
           <input 
              readOnly 
              value={name} 
              className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-4 pr-12 py-3 text-xs md:text-sm font-bold text-slate-700 outline-none transition-all"
           />
           <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 bg-nutri-blue/10 text-nutri-blue rounded-lg shadow-sm hover:bg-nutri-blue/20 transition-colors">
              <Edit2 size={18} />
           </button>
        </div>
        <div className="w-full md:w-auto shrink-0">
          <button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-nutri-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-nutri-blue/10 hover:bg-nutri-blue-hover transition-all">
            <UserPlus size={16} strokeWidth={2.5} />
            Adicionar ao Paciente
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
        <div className="lg:col-span-8 space-y-6 md:gap-y-10">
          {meals.map((meal) => (
            <div key={meal.id} className="bg-white rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-sm overflow-hidden group mb-6 md:mb-10 animate-in fade-in duration-300">
              <div className="p-5 md:p-8 flex items-center justify-between border-b border-slate-50">
                 <div className="flex items-center gap-5">
                    <span className="text-base md:text-lg font-black text-slate-400">{meal.time}</span>
                    <h2 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">{meal.title}</h2>
                 </div>
                 <div className="flex items-center gap-2 md:gap-4">
                    <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><Download size={20} /></button>
                    <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><MoreVertical size={20} /></button>
                    <button className="p-2 text-slate-300 hover:text-slate-600 transition-colors"><ChevronUp size={24} /></button>
                 </div>
              </div>

              <div className="p-5 md:p-10 space-y-5">
                 {meal.items.map((item) => (
                   <div key={item.id} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="shrink-0 p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-300 cursor-grab active:cursor-grabbing hover:bg-slate-100 transition-colors">
                          <GripVertical size={20} />
                        </div>
                        <div className="flex-1 flex gap-2">
                          <div className="flex-1 p-3 md:p-4 bg-white border border-slate-200 rounded-2xl hover:border-nutri-blue/20 transition-all flex items-center">
                             <span className="text-xs md:text-sm font-bold text-slate-700">{item.name}</span>
                          </div>
                          <div className="shrink-0 flex gap-2">
                             <button 
                               onClick={() => setAddingAlternativeTo(addingAlternativeTo?.foodId === item.id ? null : { mealId: meal.id, foodId: item.id })}
                               className={`p-3 border rounded-2xl transition-all ${addingAlternativeTo?.foodId === item.id ? 'bg-nutri-blue text-white border-nutri-blue' : 'border-slate-200 text-slate-300 hover:text-nutri-blue hover:border-nutri-blue/20'}`}
                               title="Adicionar equivalente"
                             >
                               <ListPlus size={20} />
                             </button>
                             <button 
                               onClick={() => removeFoodFromMeal(meal.id, item.id)}
                               className="p-3 border border-slate-200 text-slate-300 hover:text-rose-500 hover:border-rose-100 rounded-2xl transition-all"
                             >
                               <Trash2 size={20} />
                             </button>
                          </div>
                        </div>
                      </div>

                      {addingAlternativeTo?.foodId === item.id && (
                        <div className="ml-11 p-4 bg-slate-50 border border-slate-100 rounded-2xl animate-in zoom-in-95 duration-200 space-y-4">
                           <div className="relative">
                              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input 
                                autoFocus
                                type="text"
                                placeholder="Buscar alimento para substituir..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-4 focus:ring-nutri-blue/10 outline-none"
                              />
                           </div>
                           
                           <div className="max-h-64 overflow-y-auto space-y-2 no-scrollbar pr-1">
                              {searchTerm.length > 0 && filteredSearch.map(food => (
                                <div 
                                  key={food.id}
                                  className="w-full flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 hover:border-nutri-blue/10 transition-all text-left"
                                >
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-slate-700 truncate">{food.name}</p>
                                    <p className="text-[10px] text-slate-400 uppercase font-black">{food.energy} kcal / 100g</p>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 ml-4 shrink-0">
                                     <input 
                                        type="text"
                                        placeholder="Qtd."
                                        value={searchInputs[food.id]?.qty || ''}
                                        onChange={(e) => updateSearchInput(food.id, 'qty', e.target.value)}
                                        className="w-14 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-nutri-blue/10 focus:border-nutri-blue/40 transition-all"
                                     />
                                     <input 
                                        type="text"
                                        placeholder="Medida"
                                        value={searchInputs[food.id]?.measure || ''}
                                        onChange={(e) => updateSearchInput(food.id, 'measure', e.target.value)}
                                        className="w-24 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-nutri-blue/10 focus:border-nutri-blue/40 transition-all"
                                     />
                                     <button 
                                       onClick={() => confirmAddAlternative(food)}
                                       className="p-2 text-slate-300 hover:text-nutri-blue hover:bg-nutri-blue/5 rounded-lg transition-all"
                                     >
                                       <Plus size={18} strokeWidth={3} />
                                     </button>
                                  </div>
                                </div>
                              ))}
                              {searchTerm.length > 0 && filteredSearch.length === 0 && (
                                <p className="text-center py-4 text-xs font-bold text-slate-400 italic">Nenhum alimento encontrado</p>
                              )}
                           </div>

                           <div className="flex gap-2">
                              <button 
                                onClick={() => setIsFoodModalOpen(true)}
                                className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-nutri-blue text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                              >
                                <Plus size={14} strokeWidth={3} /> Criar novo alimento
                              </button>
                              <button 
                                onClick={() => setAddingAlternativeTo(null)}
                                className="px-6 py-3 bg-slate-200 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-300 transition-all"
                              >
                                Cancelar
                              </button>
                           </div>
                        </div>
                      )}

                      {item.alternatives?.map((alt) => (
                        <div key={alt.id} className="flex items-center gap-3 animate-in slide-in-from-left-2 duration-300">
                          <div className="w-11 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0">ou</div>
                          <div className="flex-1 flex gap-2">
                            <div className="flex-1 p-3 md:p-4 bg-white border border-slate-200 rounded-2xl hover:border-nutri-blue/20 transition-all flex items-center">
                               <span className="text-xs md:text-sm font-bold text-slate-700">{alt.name}</span>
                            </div>
                            <div className="shrink-0 flex gap-2">
                               <button 
                                 className="p-3 border border-slate-200 text-slate-300 hover:text-nutri-blue hover:border-nutri-blue/20 rounded-2xl transition-all"
                                 title="Adicionar equivalente"
                               >
                                 <ListPlus size={20} />
                               </button>
                               <button 
                                 onClick={() => removeAlternative(meal.id, item.id, alt.id)}
                                 className="p-3 border border-slate-200 text-slate-300 hover:text-rose-500 hover:border-rose-100 rounded-2xl transition-all"
                               >
                                 <Trash2 size={20} />
                               </button>
                            </div>
                          </div>
                        </div>
                      ))}
                   </div>
                 ))}

                 <div className="pt-2">
                    <button 
                      onClick={() => addFoodToMeal(meal.id)}
                      className="w-full py-4 bg-blue-50/40 hover:bg-blue-100/40 text-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border border-blue-100/20"
                    >
                      <Plus size={18} strokeWidth={3} />
                      ADICIONAR NOVO ALIMENTO
                    </button>
                 </div>
              </div>

              <div className="px-5 md:px-10 pb-8 space-y-3">
                 <label className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] ml-1">NOTAS</label>
                 <textarea 
                   className="w-full bg-white border border-slate-200 rounded-2xl p-6 min-h-[120px] outline-none focus:ring-4 focus:ring-nutri-blue/5 focus:border-nutri-blue transition-all text-sm font-medium text-slate-600 placeholder:text-slate-300 resize-none"
                   placeholder="Adicione observações para esta refeição..."
                 />
              </div>

              {/* Clinical Macro Badge Summary */}
              <div className="px-5 md:px-10 py-10 bg-slate-50/40 flex flex-wrap gap-x-12 gap-y-8 border-t border-slate-100/60">
                 <div className="flex flex-col items-start gap-2.5 min-w-[120px]">
                    <div className="flex items-center gap-2.5 px-3 py-1.5 bg-purple-100/80 rounded-lg">
                       <Flame size={14} className="text-purple-600" /> 
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">ENERGIA</span>
                    </div>
                    <span className="text-sm md:text-base font-black text-slate-800 ml-1">{meal.macros.energy} <span className="text-[10px] text-slate-400 font-bold uppercase ml-0.5">KCAL</span></span>
                 </div>
                 <div className="flex flex-col items-start gap-2.5 min-w-[120px]">
                    <div className="flex items-center gap-2.5 px-3 py-1.5 bg-amber-100/80 rounded-lg">
                       <Droplets size={14} className="text-amber-600" /> 
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">GORDURA</span>
                    </div>
                    <span className="text-sm md:text-base font-black text-slate-800 ml-1">{meal.macros.fat} <span className="text-[10px] text-slate-400 font-bold uppercase ml-0.5">G</span></span>
                 </div>
                 <div className="flex flex-col items-start gap-2.5 min-w-[120px]">
                    <div className="flex items-center gap-2.5 px-3 py-1.5 bg-orange-100/80 rounded-lg">
                       <Circle size={14} className="text-orange-600" /> 
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">CARBOIDRATOS</span>
                    </div>
                    <span className="text-sm md:text-base font-black text-slate-800 ml-1">{meal.macros.carbs} <span className="text-[10px] text-slate-400 font-bold uppercase ml-0.5">G</span></span>
                 </div>
                 <div className="flex flex-col items-start gap-2.5 min-w-[120px]">
                    <div className="flex items-center gap-2.5 px-3 py-1.5 bg-blue-100/80 rounded-lg">
                       <Diamond size={14} className="text-blue-600" /> 
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">PROTEÍNA</span>
                    </div>
                    <span className="text-sm md:text-base font-black text-slate-800 ml-1">{meal.macros.protein} <span className="text-[10px] text-slate-400 font-bold uppercase ml-0.5">G</span></span>
                 </div>
                 <div className="flex flex-col items-start gap-2.5 min-w-[120px]">
                    <div className="flex items-center gap-2.5 px-3 py-1.5 bg-emerald-100/80 rounded-lg">
                       <Activity size={14} className="text-emerald-600" /> 
                       <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest whitespace-nowrap">FIBRA ALIMENTAR</span>
                    </div>
                    <span className="text-sm md:text-base font-black text-slate-800 ml-1">{meal.macros.fiber} <span className="text-[10px] text-slate-400 font-bold uppercase ml-0.5">G</span></span>
                 </div>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-4 space-y-8">
           <div className="bg-white p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-slate-100 shadow-sm lg:sticky lg:top-24 max-h-[none] lg:max-h-[85vh] overflow-y-auto no-scrollbar">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] mb-8">Análise global</h3>
              
              <div className="space-y-2 mb-10">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                       <Flame size={16} className="text-purple-400" />
                       <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">Valor energético</span>
                    </div>
                    <span className="text-sm font-black text-slate-900">1505 <span className="text-[10px] text-slate-400 uppercase">kcal</span></span>
                 </div>
                 <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-200 rounded-full" style={{ width: '85%' }}></div>
                 </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-8 mb-12">
                 <div className="w-32 h-32 shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                       <PieChart>
                          <Pie 
                            data={globalMacros} 
                            innerRadius={35} 
                            outerRadius={50} 
                            paddingAngle={5} 
                            dataKey="value"
                            stroke="none"
                          >
                             {globalMacros.map((entry, index) => (
                               <Cell key={`cell-${index}`} fill={entry.color} />
                             ))}
                          </Pie>
                       </PieChart>
                    </ResponsiveContainer>
                 </div>
                 <div className="flex-1 space-y-4 w-full">
                    {globalMacros.map((m, idx) => (
                      <div key={idx} className="space-y-1.5">
                         <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-slate-400 flex items-center gap-1.5">
                               <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m.color }}></div>
                               {m.name}
                            </span>
                            <span className="text-slate-800">{m.value}{m.unit}</span>
                         </div>
                         <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                            <div className="h-full rounded-full transition-all duration-1000" style={{ backgroundColor: m.color, width: `${(m.value / 150) * 100}%` }}></div>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="space-y-6 mb-12">
                 <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2 flex items-center justify-between">
                    Refeições
                    <div className="flex gap-2">
                       <button onClick={handlePrevMeals} disabled={mealStartIndex === 0} className={`p-1 rounded-md transition-colors ${mealStartIndex === 0 ? 'text-slate-200' : 'text-slate-500 hover:bg-slate-100'}`}><ChevronLeft size={16} /></button>
                       <button onClick={handleNextMeals} disabled={mealStartIndex + 4 >= meals.length} className={`p-1 rounded-md transition-colors ${mealStartIndex + 4 >= meals.length ? 'text-slate-200' : 'text-slate-500 hover:bg-slate-100'}`}><ChevronRight size={16} /></button>
                    </div>
                 </h4>
                 <div className="grid grid-cols-4 gap-2">
                    {meals.slice(mealStartIndex, mealStartIndex + 4).map((meal, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 text-center animate-in fade-in duration-300">
                         <div className="w-12 h-12 bg-slate-50 rounded-full border border-slate-100 flex items-center justify-center relative">
                            <div className="w-10 h-10 rounded-full border-4 border-slate-100 border-t-amber-400 border-r-blue-400 border-b-emerald-500 transform rotate-45"></div>
                         </div>
                         <span className="text-[8px] font-black text-slate-400 uppercase tracking-tight leading-tight line-clamp-2 min-h-[20px]">{meal.title}</span>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-between gap-4 mt-12 px-2 max-w-5xl mx-auto">
        <button className="flex-1 flex items-center justify-center gap-2 px-8 py-3.5 border-2 border-rose-50 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 hover:border-rose-100 transition-all">
          <Trash2 size={16} />
          Excluir Plano
        </button>
        <button onClick={onBack} className="flex-1 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black transition-all transform active:scale-95">
          Fechar
        </button>
      </div>
    </div>
  );
};

export default MealPlanModelView;
