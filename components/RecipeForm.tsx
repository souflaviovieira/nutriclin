
import React, { useState, useMemo, useRef } from 'react';
import {
  X,
  Trash2,
  Clock,
  Utensils,
  Scale,
  Plus,
  Image as ImageIcon,
  Flame,
  Diamond,
  Circle,
  Droplets,
  ChevronDown,
  Users,
  Heart,
  Search,
  Camera,
  Database,
  Info,
  Globe,
  Zap,
  Activity,
  ChevronRight,
  Edit2,
  Loader2
} from 'lucide-react';
import { storageService } from '../services/storageService';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import FoodFormModal, { Food } from './FoodFormModal';

const INITIAL_REGISTERED_FOODS: Food[] = [
  { id: '1', name: 'Arroz Integral Cozido', energy: 124, fat: 1, carbs: 26, protein: 3, fiber: 2, sodium: 1 },
  { id: '2', name: 'Feijão Carioca Cozido', energy: 76, fat: 0.5, carbs: 14, protein: 5, fiber: 8, sodium: 2 },
  { id: '3', name: 'Frango Grelhado (Peito)', energy: 159, fat: 2.5, carbs: 0, protein: 32, fiber: 0, sodium: 45 },
  { id: '4', name: 'Ovo de Galinha Cozido', energy: 155, fat: 11, carbs: 1.1, protein: 13, fiber: 0, sodium: 124, measures: [{ id: 'm1', singular: 'unidade', plural: 'unidades', quantity: '1', totalGrams: '50', ediblePart: '100' }] },
  { id: '5', name: 'Banana Nanica', energy: 92, fat: 0.3, carbs: 24, protein: 1.4, fiber: 2, sodium: 0, measures: [{ id: 'm2', singular: 'unidade média', plural: 'unidades médias', quantity: '1', totalGrams: '80', ediblePart: '100' }] },
  { id: '6', name: 'Tapioca (Goma)', energy: 240, fat: 0, carbs: 60, protein: 0, fiber: 0, sodium: 5, measures: [{ id: 'm3', singular: 'colher de sopa', plural: 'colheres de sopa', quantity: '1', totalGrams: '15', ediblePart: '100' }] },
  { id: '7', name: 'Azeite de Oliva Extra Virgem', energy: 884, fat: 100, carbs: 0, protein: 0, fiber: 0, sodium: 2 }
];

interface IngredientLine extends Food {
  lineId: string;
  foodId: string;
  quantity: number;
  unit: string;
}

interface RecipeFormProps {
  onCancel: () => void;
  onSave?: (data: any) => void;
}

const RecipeForm: React.FC<RecipeFormProps> = ({ onCancel, onSave }) => {
  const [recipeData, setRecipeData] = useState({
    name: 'Nova Receita',
    totalTime: '00:10',
    prepTime: '00:05',
    weight: '60',
    portions: '1',
    description: '',
  });

  const [ingredients, setIngredients] = useState<IngredientLine[]>([]);
  const [method, setMethod] = useState<string[]>(['']);
  const [showFoodSearch, setShowFoodSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [registeredFoods, setRegisteredFoods] = useState<Food[]>(INITIAL_REGISTERED_FOODS);
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [foodToEdit, setFoodToEdit] = useState<Food | null>(null);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getIngredientWeightInGrams = (ing: IngredientLine) => {
    if (ing.unit === 'g') return ing.quantity;
    if (ing.unit === 'Kg') return ing.quantity * 1000;
    if (ing.unit === 'mg') return ing.quantity / 1000;
    if (ing.unit === 'ml') return ing.quantity;
    if (ing.unit === 'L') return ing.quantity * 1000;

    const measure = ing.measures?.find(m => m.singular === ing.unit || m.plural === ing.unit);
    if (measure) {
      const perUnitGrams = (Number(measure.totalGrams) || 0) / (Number(measure.quantity) || 1);
      return ing.quantity * perUnitGrams;
    }
    return ing.quantity;
  };

  const totals = useMemo(() => {
    return ingredients.reduce((acc, curr) => {
      const weightInGrams = getIngredientWeightInGrams(curr);
      const factor = weightInGrams / 100;
      return {
        energy: acc.energy + (curr.energy * factor),
        fat: acc.fat + (curr.fat * factor),
        carbs: acc.carbs + (curr.carbs * factor),
        protein: acc.protein + (curr.protein * factor),
        fiber: acc.fiber + (curr.fiber * factor),
        sodium: acc.sodium + (curr.sodium * factor),
      };
    }, { energy: 0, fat: 0, carbs: 0, protein: 0, fiber: 0, sodium: 0 });
  }, [ingredients]);

  const macroData = [
    { name: 'Gordura', value: Math.round(totals.fat), color: '#f59e0b' },
    { name: 'Carboidratos', value: Math.round(totals.carbs), color: '#3b82f6' },
    { name: 'Proteína', value: Math.round(totals.protein), color: '#10b981' },
    { name: 'Fibra', value: Math.round(totals.fiber), color: '#94a3b8' }
  ];

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      // 1. Compress
      const compressedFile = await storageService.compressImage(file);

      // 2. Upload
      const fileName = `recipes/${Date.now()}_${Math.random().toString(36).substring(7)}.webp`;
      const publicUrl = await storageService.uploadFile(compressedFile, {
        bucket: 'recipe-assets',
        path: fileName,
        oldPath: featuredImage || undefined // Try to delete old if exists
      });

      setFeaturedImage(publicUrl);
    } catch (err) {
      console.error('Error uploading recipe image:', err);
      alert('Erro ao carregar imagem. Tente novamente.');
    } finally {
      setUploading(false);
    }
  };

  const addFoodToIngredients = (food: Food) => {
    const newEntry: IngredientLine = {
      ...food,
      lineId: Date.now().toString(),
      foodId: food.id,
      quantity: 100,
      unit: 'g'
    };
    setIngredients([...ingredients, newEntry]);
    setShowFoodSearch(false);
    setSearchTerm('');
  };

  const handleEditFood = (food: Food) => {
    setFoodToEdit(food);
    setIsFoodModalOpen(true);
  };

  const updateIngredientQuantity = (id: string, qty: string) => {
    const num = parseFloat(qty.replace(',', '.')) || 0;
    setIngredients(ingredients.map(ing => ing.lineId === id ? { ...ing, quantity: num } : ing));
  };

  const updateIngredientUnit = (id: string, unit: string) => {
    setIngredients(ingredients.map(ing => ing.lineId === id ? { ...ing, unit } : ing));
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(ing => ing.lineId !== id));
  };

  const labelClasses = "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1";
  const inputClasses = "w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-nutri-blue/10 focus:border-nutri-blue outline-none text-sm font-semibold text-slate-800 transition-all placeholder:text-slate-300";

  const filteredSearch = registeredFoods.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="max-w-[1600px] mx-auto animate-in fade-in duration-500 pb-20 px-1">
      <FoodFormModal
        isOpen={isFoodModalOpen}
        onClose={() => { setIsFoodModalOpen(false); setFoodToEdit(null); }}
        initialFood={foodToEdit}
        onSave={(newFood) => {
          if (foodToEdit) {
            setRegisteredFoods(registeredFoods.map(f => f.id === foodToEdit.id ? newFood : f));
            setIngredients(ingredients.map(ing => ing.foodId === foodToEdit.id ? { ...newFood, lineId: ing.lineId, foodId: newFood.id, quantity: ing.quantity, unit: ing.unit } : ing));
          } else {
            setRegisteredFoods([newFood, ...registeredFoods]);
            addFoodToIngredients(newFood);
          }
          setIsFoodModalOpen(false);
          setFoodToEdit(null);
        }}
      />

      <header className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-100 sticky top-0 z-50 mb-6 shadow-sm">
        <button
          onClick={() => onSave?.(recipeData)}
          className="px-6 sm:px-10 py-3 bg-nutri-blue text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-nutri-blue/20 hover:bg-nutri-blue-hover transition-all transform active:scale-95"
        >
          Publicar
        </button>
        <button
          onClick={onCancel}
          className="px-6 sm:px-10 py-3 bg-white border border-slate-200 text-slate-400 hover:text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
        >
          Cancelar
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <label className={labelClasses}>Nome</label>
            <input
              type="text"
              value={recipeData.name}
              onChange={(e) => setRecipeData({ ...recipeData, name: e.target.value })}
              className={inputClasses}
            />
          </div>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative rounded-[32px] overflow-hidden bg-slate-50 border-2 border-dashed border-slate-200 aspect-[21/9] sm:aspect-[21/7] flex flex-col items-center justify-center group cursor-pointer hover:bg-slate-100 hover:border-nutri-blue/40 transition-all p-4"
          >
            {featuredImage ? (
              <img src={featuredImage} className="w-full h-full object-cover" alt="Destaque" />
            ) : (
              <>
                <div className="p-3 sm:p-4 bg-white rounded-2xl shadow-sm text-slate-300 group-hover:text-nutri-blue transition-colors mb-3">
                  <ImageIcon size={32} className="sm:w-10 sm:h-10" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center group-hover:text-nutri-blue transition-colors">Carregar imagem de destaque</span>
                  <span className="text-[8px] text-slate-400 font-medium max-w-[250px] text-center px-4">
                    Foto da Receita: Garanta que o texto esteja legível e enquadrado. Formatos aceitos: JPG, PNG e WebP (máx. 10MB).
                  </span>
                </div>
              </>
            )}
            {uploading && (
              <div className="absolute inset-0 bg-white/60 flex flex-col items-center justify-center backdrop-blur-[2px] gap-2">
                <Loader2 size={32} className="text-nutri-blue animate-spin" />
                <span className="text-[10px] font-black text-nutri-blue uppercase tracking-widest">Processando...</span>
              </div>
            )}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
          </div>

          <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className={labelClasses}>Tempo total</label>
                <div className="relative">
                  <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input type="time" value={recipeData.totalTime} onChange={(e) => setRecipeData({ ...recipeData, totalTime: e.target.value })} className={inputClasses + " pl-11"} />
                </div>
              </div>
              <div>
                <label className={labelClasses}>Tempo de preparo</label>
                <div className="relative">
                  <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input type="time" value={recipeData.prepTime} onChange={(e) => setRecipeData({ ...recipeData, prepTime: e.target.value })} className={inputClasses + " pl-11"} />
                </div>
              </div>
              <div>
                <label className={labelClasses}>Peso final</label>
                <div className="relative">
                  <Scale size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input type="text" value={recipeData.weight} onChange={(e) => setRecipeData({ ...recipeData, weight: e.target.value })} className={inputClasses + " pl-11 pr-20"} />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-300 uppercase">gramas</span>
                </div>
              </div>
              <div>
                <label className={labelClasses}>Porções</label>
                <div className="relative">
                  <Utensils size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-300" />
                  <input type="number" value={recipeData.portions} onChange={(e) => setRecipeData({ ...recipeData, portions: e.target.value })} className={inputClasses + " pl-11"} />
                </div>
              </div>
            </div>
            <div>
              <label className={labelClasses}>Descrição</label>
              <textarea rows={3} value={recipeData.description} onChange={(e) => setRecipeData({ ...recipeData, description: e.target.value })} className={inputClasses + " resize-none py-4"} placeholder="Breve descrição da receita..." />
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-50">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Ingredientes</h3>
            </div>
            <div className="p-4 sm:p-8 space-y-4">
              {ingredients.map((ing) => (
                <div key={ing.lineId} className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center p-4 bg-slate-50 rounded-2xl sm:bg-transparent sm:p-0 animate-in slide-in-from-left-2 duration-300">
                  <div className="w-full sm:flex-[3]">
                    <input value={ing.name} readOnly className={inputClasses + " bg-slate-50 cursor-default"} />
                  </div>
                  <div className="w-full sm:flex-[2] flex gap-2">
                    <input type="text" value={ing.quantity} onChange={(e) => updateIngredientQuantity(ing.lineId, e.target.value)} className={inputClasses + " text-center"} />
                    <select
                      value={ing.unit}
                      onChange={(e) => updateIngredientUnit(ing.lineId, e.target.value)}
                      className="bg-white border border-slate-200 rounded-xl px-2 py-2 text-xs font-bold text-slate-600 focus:ring-4 focus:ring-nutri-blue/10 outline-none w-28 shrink-0"
                    >
                      {['mg', 'g', 'Kg', 'ml', 'L', 'unid', 'porç'].map(u => <option key={u} value={u}>{u}</option>)}
                      {ing.measures?.map(m => (
                        <React.Fragment key={m.id}>
                          <option value={m.singular}>{m.singular}</option>
                          {m.plural !== m.singular && <option value={m.plural}>{m.plural}</option>}
                        </React.Fragment>
                      ))}
                    </select>
                    <button onClick={() => removeIngredient(ing.lineId)} className="p-2.5 text-slate-300 hover:text-rose-500 transition-colors sm:hidden"><Trash2 size={18} /></button>
                  </div>
                  <button onClick={() => removeIngredient(ing.lineId)} className="hidden sm:block p-3 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
                </div>
              ))}

              {showFoodSearch ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 animate-in zoom-in-95 duration-200">
                  <div className="relative mb-4">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input autoFocus placeholder="Buscar alimento cadastrado..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={inputClasses + " pl-10 bg-white"} />
                  </div>
                  <div className="max-h-48 overflow-y-auto space-y-1 no-scrollbar mb-4 pr-1">
                    {filteredSearch.map(food => (
                      <div key={food.id} className="w-full flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 hover:border-nutri-blue hover:bg-nutri-blue/5 transition-all text-left group">
                        <div onClick={() => addFoodToIngredients(food)} className="flex-1 cursor-pointer">
                          <p className="text-sm font-bold text-slate-700">{food.name}</p>
                          <p className="text-[10px] text-slate-400 uppercase font-black">{food.energy} kcal / 100g</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => handleEditFood(food)} className="p-2 text-slate-300 hover:text-nutri-blue hover:bg-nutri-blue/10 rounded-lg transition-all" title="Editar alimento">
                            <Edit2 size={14} />
                          </button>
                          <button onClick={() => addFoodToIngredients(food)} className="p-2 text-nutri-blue hover:bg-nutri-blue/10 rounded-lg transition-all">
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => { setFoodToEdit(null); setIsFoodModalOpen(true); }}
                      className="w-full py-3 bg-white border border-slate-200 rounded-xl text-nutri-blue text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus size={14} strokeWidth={3} /> Adicionar novo alimento
                    </button>
                    <button onClick={() => setShowFoodSearch(false)} className="w-full py-2 text-[10px] font-black uppercase text-slate-400 hover:text-slate-600">Cancelar</button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowFoodSearch(true)} className="w-full py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-nutri-blue text-xs font-black uppercase tracking-widest hover:bg-white transition-all flex items-center justify-center gap-2">
                  <Plus size={16} /> Adicionar novo ingrediente
                </button>
              )}
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 border-b border-slate-50">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Método de preparo</h3>
            </div>
            <div className="p-4 sm:p-8 space-y-4">
              {method.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3 sm:gap-4 p-4 bg-slate-50 rounded-2xl group border border-transparent hover:border-slate-100 transition-all">
                  <span className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xs font-black text-slate-400 shrink-0 shadow-sm">{idx + 1}</span>
                  <textarea
                    value={step}
                    onChange={(e) => {
                      const nm = [...method];
                      nm[idx] = e.target.value;
                      setMethod(nm);
                    }}
                    placeholder="Descreva o passo de preparo..."
                    className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-slate-600 pt-1.5 resize-none min-h-[40px]"
                    rows={1}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = target.scrollHeight + 'px';
                    }}
                  />
                  <button onClick={() => { if (method.length > 1) setMethod(method.filter((_, i) => i !== idx)) }} className="p-2 text-slate-200 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
                </div>
              ))}
              <button onClick={() => setMethod([...method, ''])} className="flex items-start gap-4 p-4 w-full group text-left transition-all">
                <span className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xs font-black text-slate-300 shrink-0 group-hover:bg-nutri-blue/10 group-hover:text-nutri-blue transition-all">{method.length + 1}</span>
                <div className="pt-1.5 border-b border-dashed border-slate-200 flex-1 group-hover:border-nutri-blue transition-colors">
                  <span className="text-sm font-bold text-slate-300 group-hover:text-nutri-blue">Clique para adicionar novo passo de preparo</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 md:p-8 lg:sticky lg:top-24">
            <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-8">Análise global</h3>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-xl"><Flame size={20} /></div>
                <span className="text-[10px] font-bold text-slate-600 uppercase">Valor energético</span>
              </div>
              <div className="text-right">
                <span className="text-xl font-black text-slate-800 tracking-tight">{Math.round(totals.energy)}</span>
                <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">kcal</span>
              </div>
            </div>

            <div className="space-y-8 overflow-hidden">
              <div className="flex flex-col items-center gap-6">
                <div className="w-32 h-32 shrink-0 mx-auto">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                      <Pie
                        data={macroData}
                        innerRadius={30}
                        outerRadius={42}
                        paddingAngle={4}
                        dataKey="value"
                        cx="50%"
                        cy="50%"
                        stroke="none"
                      >
                        {macroData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2 w-full">
                  {macroData.map((m: any, i: number) => {
                    const totalMacros = macroData.reduce((s, curr) => s + curr.value, 0);
                    const perc = totalMacros > 0 ? (m.value / totalMacros) * 100 : 0;
                    return (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                          <span className="text-slate-400 flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: m.color }}></div>
                            {m.name}
                          </span>
                          <span className="text-slate-700">{m.value}g</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                          <div className="h-full rounded-full transition-all duration-700" style={{ backgroundColor: m.color, width: `${Math.min(perc, 100)}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-50">
                <div className="max-h-[300px] overflow-y-auto no-scrollbar pr-2 -mr-2 space-y-3">
                  {[
                    { label: 'Sódio', value: totals.sodium.toFixed(1), unit: 'mg', color: 'text-amber-500' },
                    { label: 'Fibra Alimentar', value: totals.fiber.toFixed(1), unit: 'g', color: 'text-emerald-500' },
                  ].map((n: any, i: number) => (
                    <div key={i} className="group">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-bold text-slate-500">{n.label}</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[11px] font-black ${n.color}`}>{n.value}</span>
                          <span className="text-[9px] font-bold text-slate-300 uppercase">{n.unit}</span>
                        </div>
                      </div>
                      <div className="h-0.5 w-full bg-slate-50 rounded-full overflow-hidden">
                        <div className="h-full bg-slate-200 transition-all group-hover:bg-nutri-blue" style={{ width: `${Math.min(parseFloat(n.value) * 2, 100)}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center pt-4 opacity-30">
                  <ChevronDown size={18} className="text-slate-300 animate-bounce" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeForm;
