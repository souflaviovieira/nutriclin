
import React, { useState } from 'react';
import { X, Apple, Info, Database, Scale, Thermometer, Droplets, Zap, Activity, Globe, Utensils, Ruler, Edit2 } from 'lucide-react';

interface FoodDetailViewProps {
  food: any;
  onBack: () => void;
  onEdit?: (food: any) => void;
}

const FoodDetailView: React.FC<FoodDetailViewProps> = ({ food, onBack, onEdit }) => {
  const [nutritionMode, setNutritionMode] = useState<'100g' | 'medidas'>('100g');

  // Lógica para detectar se é suplemento baseado na marca ou flag
  const isSupplement = food?.isSupplement || 
                     ['ELIXIR', 'DUX NUTRITION', 'VITAFOR', 'MUNDO VERDE SELEÇÃO'].includes(food?.brand);
  
  const title = isSupplement ? "Informações do suplemento" : "Informações do alimento";
  const HeaderIcon = isSupplement ? Activity : Apple;
  const groupValue = isSupplement ? "Suplementos" : "Refeições, Entradas e Acompanhamentos";

  const microNutrients = [
    { label: 'Colesterol', value: '0,0', unit: 'mg' },
    { label: 'Fibra alimentar', value: isSupplement ? '0,0' : '3,4', unit: 'g' },
    { label: 'Sódio', value: isSupplement ? '0,0' : '150,9', unit: 'mg' },
    { label: 'Água', value: '0,0', unit: 'g' },
    { label: 'Vitamina A', value: '0,0', unit: 'ug' },
    { label: 'Vitamina B6', value: '0,0', unit: 'mg' },
    { label: 'Vitamina B12', value: '0,0', unit: 'ug' },
    { label: 'Vitamina C', value: '0,0', unit: 'mg' },
    { label: 'Vitamina D', value: '0,0', unit: 'ug' },
    { label: 'Vitamina E', value: '0,0', unit: 'mg' },
    { label: 'Vitamina K', value: '0,0', unit: 'ug' },
    { label: 'Amido', value: '0,0', unit: 'g' },
    { label: 'Lactose', value: '0,0', unit: 'g' },
    { label: 'Álcool', value: '0,0', unit: 'g' },
    { label: 'Cafeína', value: '0,0', unit: 'mg' },
    { label: 'Açúcares', value: '0,0', unit: 'g' },
    { label: 'Cálcio', value: '0,0', unit: 'mg' },
    { label: 'Ferro', value: '0,0', unit: 'mg' },
    { label: 'Magnésio', value: '0,0', unit: 'mg' },
    { label: 'Fósforo', value: '0,0', unit: 'mg' },
    { label: 'Potássio', value: '0,0', unit: 'mg' },
    { label: 'Zinco', value: '0,0', unit: 'mg' },
    { label: 'Cobre', value: '0,0', unit: 'mg' },
    { label: 'Flúor', value: '0,0', unit: 'ug' },
    { label: 'Manganês', value: '0,0', unit: 'mg' },
    { label: 'Selênio', value: '0,0', unit: 'ug' },
    { label: 'Tiamina', value: '0,0', unit: 'mg' },
    { label: 'Riboflavina', value: '0,0', unit: 'mg' },
    { label: 'Niacina', value: '0,0', unit: 'mg' },
    { label: 'Ácido Pantotênico', value: '0,0', unit: 'mg' },
    { label: 'Folato', value: '0,0', unit: 'ug' },
    { label: 'Ácido fólico', value: '0,0', unit: 'ug' },
    { label: 'Gorduras trans', value: '0,0', unit: 'g' },
    { label: 'Gorduras saturadas', value: isSupplement ? '0,0' : '0,09', unit: 'g' },
    { label: 'Gorduras monoinsaturadas', value: '0,0', unit: 'g' },
    { label: 'Gorduras poliinsaturadas', value: '0,0', unit: 'g' },
    { label: 'Cloreto', value: '0,0', unit: 'mg' },
  ];

  const labelClasses = "text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1.5 block ml-1";
  const inputContainerClasses = "flex items-center gap-3 px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl min-h-[48px]";
  const inputValueClasses = "text-sm font-semibold text-slate-700 leading-none";

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 px-1">
      <div className="bg-white rounded-[28px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        
        {/* Header Clinical Section */}
        <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-50">
          <div className="flex items-center gap-4">
            <div className="p-2.5 bg-nutri-blue/10 text-nutri-blue rounded-xl transition-all">
               <HeaderIcon size={22} />
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-none">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onEdit?.(food)}
              className="p-2 text-slate-300 hover:text-nutri-blue transition-colors"
              title="Editar informações"
            >
              <Edit2 size={20} />
            </button>
            <button onClick={onBack} className="p-2 text-slate-300 hover:text-slate-600 transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8 space-y-8">
          
          {/* Basic Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
               <div>
                 <label className={labelClasses}>Nome</label>
                 <div className={inputContainerClasses}>
                    <Activity size={16} className="text-slate-300" />
                    <span className={inputValueClasses}>{food?.name || 'Mix de legumes no vapor Liv Up'}</span>
                 </div>
               </div>
               <div>
                 <label className={labelClasses}>Grupo</label>
                 <div className={inputContainerClasses}>
                    <Database size={16} className="text-slate-300" />
                    <span className={inputValueClasses}>{groupValue}</span>
                 </div>
               </div>
            </div>
            <div className="space-y-4">
               <div>
                 <label className={labelClasses}>Fonte</label>
                 <div className={inputContainerClasses}>
                    <Info size={16} className="text-slate-300" />
                    <span className={inputValueClasses}>{food?.brand || 'Liv Up'}</span>
                 </div>
               </div>
               <div>
                 <label className={labelClasses}>Quantidade</label>
                 <div className="grid grid-cols-2 gap-2">
                    <div className={inputContainerClasses}>
                       <Scale size={16} className="text-slate-300" />
                       <span className={inputValueClasses}>100</span>
                    </div>
                    <div className={inputContainerClasses + " justify-between"}>
                       <span className={inputValueClasses}>gramas</span>
                       <X size={12} className="text-slate-300" />
                    </div>
                 </div>
               </div>
            </div>
          </div>

          {/* Unit Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-[20px] w-full">
            <button 
              onClick={() => setNutritionMode('100g')}
              className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${nutritionMode === '100g' ? 'bg-white text-nutri-blue shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Globe size={16} /> Valor nutricional por 100 g
            </button>
            <button 
              onClick={() => setNutritionMode('medidas')}
              className={`flex-1 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${nutritionMode === 'medidas' ? 'bg-white text-nutri-blue shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Utensils size={16} /> Medidas caseiras
            </button>
          </div>

          {nutritionMode === '100g' ? (
            <div className="animate-in fade-in duration-300 space-y-8">
              {/* Macronutrients Section */}
              <div className="space-y-6 pt-4">
                <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-widest">Macronutrientes</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { label: 'Energia', val: food?.energy || '38,0', unit: 'kcal', icon: <Thermometer size={14}/> },
                    { label: 'Gordura', val: food?.fat || '0,2', unit: 'g', icon: <Droplets size={14}/> },
                    { label: 'Carboidratos', val: food?.carbs || '6,3', unit: 'g', icon: <Zap size={14}/> },
                    { label: 'Proteína', val: food?.protein || '2,9', unit: 'g', icon: <Activity size={14}/> }
                  ].map((m, i) => (
                    <div key={i}>
                      <label className={labelClasses + " flex items-center gap-1.5"}>{m.icon} {m.label}</label>
                      <div className={inputContainerClasses + " justify-between border-slate-200 bg-white"}>
                        <span className="text-sm font-bold text-slate-800">{m.val === '--' ? '0,0' : m.val}</span>
                        <span className="text-[10px] font-black text-slate-300 uppercase">{m.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Micronutrients Grid Section */}
              <div className="space-y-6 pt-6 border-t border-slate-100">
                <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-widest">Micronutrientes</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-6">
                    {microNutrients.map((n, i) => (
                      <div key={i}>
                        <label className={labelClasses}>{n.label}</label>
                        <div className="flex items-center justify-between px-4 py-2.5 bg-white border border-slate-100 rounded-xl">
                          <span className="text-sm font-semibold text-slate-700">{n.value}</span>
                          <span className="text-[10px] font-black text-slate-300 uppercase">{n.unit}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300 space-y-6">
              <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-widest">Medidas Caseiras Registradas</h3>
              
              {food?.measures && food.measures.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {food.measures.map((m: any, idx: number) => (
                     <div key={idx} className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-4">
                        <div className="flex items-center gap-3 border-b border-slate-200/50 pb-3">
                           <div className="p-2 bg-white rounded-lg text-nutri-blue shadow-sm"><Scale size={18}/></div>
                           <h4 className="text-sm font-black text-slate-700 capitalize">{m.singular}</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Quantidade</p>
                              <p className="text-sm font-bold text-slate-800">{m.quantity}</p>
                           </div>
                           <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Equivalência</p>
                              <p className="text-sm font-bold text-slate-800">{m.totalGrams} g</p>
                           </div>
                           <div className="col-span-2">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Parte Comestível</p>
                              <div className="flex items-center gap-2">
                                 <div className="h-1.5 flex-1 bg-slate-200 rounded-full overflow-hidden">
                                    <div className="h-full bg-nutri-blue" style={{width: `${m.ediblePart}%`}}></div>
                                 </div>
                                 <span className="text-xs font-black text-slate-600">{m.ediblePart}%</span>
                              </div>
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 bg-slate-50 rounded-3xl border border-slate-100 border-dashed opacity-50">
                   <Ruler size={48} className="text-slate-300 mb-4" />
                   <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Nenhuma medida caseira cadastrada</p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Improved Footer with Delete and Close buttons as requested */}
        <div className="p-6 md:p-8 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
           <button className="w-full sm:w-auto px-6 py-3 border-2 border-rose-100 text-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center justify-center gap-2">
             Excluir {isSupplement ? 'suplemento' : 'alimento'}
           </button>
           <button onClick={onBack} className="w-full sm:w-auto px-12 py-3 bg-nutri-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-nutri-blue/20 hover:bg-nutri-blue-hover transition-all">
             Fechar
           </button>
        </div>

      </div>
    </div>
  );
};

export default FoodDetailView;
