
import React, { useState } from 'react';
import { 
  X, 
  ArrowLeft, 
  Printer, 
  Share2, 
  Heart, 
  Clock, 
  Users, 
  UserCircle, 
  Activity, 
  Utensils, 
  Target,
  Flame,
  Droplets,
  Circle,
  Diamond,
  Info,
  ChevronDown,
  Scale,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
  Apple
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface RecipeDetailViewProps {
  recipe: any;
  onBack: () => void;
}

const RecipeDetailView: React.FC<RecipeDetailViewProps> = ({ recipe, onBack }) => {
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  // Use defaults if data is missing for high-fidelity demonstration
  const recipeData = {
    ...recipe,
    portions: recipe.portions || "1",
    totalTime: recipe.totalTime || "00:10",
    prepTime: recipe.prepTime || "00:05",
    finalWeight: recipe.finalWeight || "60.0 gramas",
    description: recipe.description || "Ingredientes: Tapioca, ovo, sal, ervas finas. Combinação perfeita de carboidrato e proteína. Excelente alimento para os lanches e café da manhã.",
    ingredients: recipe.ingredients || [
      "1 unidade de ovo de galinha (45 g)",
      "36 gramas de tapioca de goma",
      "1/2 colher de chá, folhas de condimento, orégano, moído (1 g)",
      "1 pitada de sal, cozinha (0 g)"
    ],
    method: recipe.method || [
      "Bata o ovo, acrescente a tapioca e os temperos, misture tudo até obter uma mistura homogênea, unte uma frigideira com azeite de oliva ou óleo de coco. Despeje a massa e deixe assar em fogo brando. Sirva pura ou com recheio.",
      "Bata todos os ingredientes e leve para assar em frigideira untada com azeite de oliva extra virgem, manteiga ou óleo de coco.",
      "Fica a dica: a tapioca é um excelente carboidrato, porém falta fibra, então seria importante acrescentar alguma fonte de fibra na mesma refeição. Podemos também acrescentar a essa receita um pouquinho de semente de chia, pouca interferência no sabor, e rica em nutrientes, como ômega 3 e fibras."
    ],
    microNutrients: [
      { label: 'Sódio', value: '173', unit: 'mg', percent: 8 },
      { label: 'Vitamina A', value: '58', unit: 'ug', percent: 7 },
      { label: 'Vitamina B6', value: '0', unit: 'mg', percent: 0 },
      { label: 'Vitamina B12', value: '0', unit: 'ug', percent: 0 },
      { label: 'Vitamina C', value: '0', unit: 'mg', percent: 0 },
      { label: 'Vitamina D', value: '0', unit: 'ug', percent: 0 },
      { label: 'Vitamina E', value: '0', unit: 'mg', percent: 0 },
      { label: 'Vitamina K', value: '3', unit: 'ug', percent: 3 },
      { label: 'Açúcares', value: '0', unit: 'g', percent: 0 },
      { label: 'Cálcio', value: '25', unit: 'mg', percent: 2 },
      { label: 'Ferro', value: '1', unit: 'mg', percent: 7 },
      { label: 'Magnésio', value: '5', unit: 'mg', percent: 1 },
      { label: 'Fósforo', value: '59', unit: 'mg', percent: 8 },
      { label: 'Potássio', value: '48', unit: 'mg', percent: 1 },
      { label: 'Zinco', value: '0', unit: 'mg', percent: 0 },
      { label: 'Cobre', value: '0', unit: 'mg', percent: 0 },
      { label: 'Flúor', value: '0', unit: 'ug', percent: 0 },
      { label: 'Manganês', value: '0', unit: 'mg', percent: 0 },
      { label: 'Selênio', value: '10', unit: 'ug', percent: 14 },
      { label: 'Folato', value: '16', unit: 'ug', percent: 4 }
    ],
    macros: [
      { name: 'Gordura', value: 4, color: '#f59e0b' },
      { name: 'Carboidratos', value: 21, color: '#3b82f6' },
      { name: 'Proteína', value: 5, color: '#10b981' },
      { name: 'Fibra', value: 0, color: '#94a3b8' }
    ],
    energyPerPortion: '139'
  };

  const labelClasses = "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1";
  const fieldBoxClasses = "px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold text-slate-700 min-h-[46px] flex items-center";

  // PDF Preview Component optimized for mobile fitting
  const PdfPreview = () => (
    <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-start justify-center overflow-y-auto p-4 sm:p-6 no-scrollbar selection:bg-nutri-blue/30 animate-in fade-in duration-300">
      <div className="bg-white w-full sm:w-[210mm] min-h-[297mm] shadow-2xl rounded-sm p-6 sm:p-[15mm] md:p-[20mm] relative mb-20 animate-in zoom-in-95 duration-500 overflow-x-hidden">
        
        {/* PDF Controls */}
        <div className="absolute right-4 top-4 flex flex-row sm:flex-col gap-3 print:hidden z-20">
          <button 
            onClick={() => window.print()}
            className="p-3 bg-nutri-blue text-white hover:bg-nutri-blue-hover rounded-full shadow-lg shadow-nutri-blue/20 transition-all active:scale-95"
            title="Imprimir"
          >
            <Printer size={20} />
          </button>
          <button 
            onClick={() => setShowPdfPreview(false)}
            className="p-3 bg-white text-slate-400 hover:text-slate-800 rounded-full shadow-lg transition-all active:scale-95"
            title="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* --- PDF CONTENT --- */}
        <header className="flex flex-col sm:flex-row justify-between items-start border-b border-slate-100 pb-8 mb-8 gap-6">
          <div className="flex items-center gap-3">
             <div className="bg-nutri-blue p-2 rounded-xl text-white">
                <Apple size={24} fill="white" />
             </div>
             <div className="flex flex-col">
                <span className="text-xl sm:text-2xl font-black text-nutri-blue tracking-tighter uppercase italic leading-none">NutriDash</span>
                <span className="text-[8px] font-black text-slate-300 tracking-[0.3em] uppercase mt-1">Clinical Systems</span>
             </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-left sm:text-right w-full sm:w-auto">
             <div className="flex items-center sm:justify-end gap-2 text-[10px] font-bold text-slate-700">
                <span>Dra. Letícia Rosa</span>
                <UserCircle size={12} className="text-nutri-blue" />
             </div>
             <div className="flex items-center sm:justify-end gap-2 text-[10px] font-bold text-slate-700">
                <span>(11) 98888-7777</span>
                <Phone size={12} className="text-nutri-blue" />
             </div>
             <div className="flex items-center sm:justify-end gap-2 text-[10px] font-bold text-slate-700">
                <span>leticia.rosa@nutridash.com</span>
                <Mail size={12} className="text-nutri-blue" />
             </div>
             <div className="flex items-center sm:justify-end gap-2 text-[10px] font-bold text-slate-700">
                <span>Consultório Online</span>
                <MapPin size={12} className="text-nutri-blue" />
             </div>
          </div>
        </header>

        <section className="flex flex-col sm:flex-row gap-6 mb-10">
          <div className="w-full sm:w-32 h-48 sm:h-32 rounded-2xl overflow-hidden shadow-sm border border-slate-100 shrink-0">
            <img src={recipeData.img} alt={recipeData.title} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 uppercase tracking-tight leading-none">{recipeData.title}</h1>
            <p className="text-[10px] font-bold text-slate-400">por {recipeData.author}</p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-lg">
              {recipeData.description}
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h3 className="text-sm sm:text-base font-black text-nutri-blue uppercase tracking-widest mb-4 border-b border-slate-50 pb-2">Ingredientes</h3>
          <ul className="space-y-2">
            {recipeData.ingredients.map((ing: string, i: number) => (
              <li key={i} className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-700">
                <div className="w-1 h-1 rounded-full bg-nutri-blue"></div>
                {ing}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-10">
          <h3 className="text-sm sm:text-base font-black text-nutri-blue uppercase tracking-widest mb-4 border-b border-slate-50 pb-2">Método de preparo</h3>
          <div className="space-y-4">
            {recipeData.method.map((step: string, i: number) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-xs sm:text-sm font-black text-nutri-blue shrink-0 pt-0.5">{i+1}º</span>
                <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-20 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center sm:items-end opacity-50 gap-6 text-center sm:text-left">
           <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed max-w-[250px]">
              Documento gerado via NutriDash Pro Systems. <br/> 
              As informações contidas neste relatório são de responsabilidade do profissional.
           </p>
           <div className="flex items-center gap-2 text-nutri-blue font-black text-[8px] uppercase tracking-[0.2em]">
              <CheckCircle2 size={12} /> Prontuário Autenticado
           </div>
        </footer>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 px-1">
      {/* Conditionally show PDF Overlay */}
      {showPdfPreview && <PdfPreview />}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 md:p-6 rounded-2xl border border-slate-100 shadow-sm mb-6">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button onClick={onBack} className="p-2.5 hover:bg-slate-50 rounded-xl text-slate-400 transition-colors border border-transparent hover:border-slate-100"><ArrowLeft size={20} /></button>
          <div className="min-w-0">
             <label className="text-[10px] font-black text-nutri-blue uppercase tracking-[0.2em]">Informações da receita</label>
             <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-tight truncate">{recipeData.title}</h1>
          </div>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={() => setShowPdfPreview(true)}
            className="flex-1 md:flex-none p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-slate-600 transition-colors border border-slate-100 flex items-center justify-center"
            title="Imprimir"
          >
            <Printer size={18} />
          </button>
          <button 
            className="flex-1 md:flex-none p-3 bg-slate-50 text-slate-400 rounded-xl hover:text-slate-600 transition-colors border border-slate-100 flex items-center justify-center"
            title="Compartilhar"
          >
            <Share2 size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Content Area (Left 70%) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Hero Image Section */}
          <div className="relative rounded-[32px] overflow-hidden bg-slate-100 shadow-sm border border-slate-100 aspect-video md:aspect-[21/9]">
            <img src={recipeData.img} alt={recipeData.title} className="w-full h-full object-cover" />
            <div className="absolute top-6 left-6 bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl text-[9px] font-black text-nutri-blue uppercase tracking-widest shadow-sm border border-white/50 flex items-center gap-2">
              <Users size={12} /> Receitas Comunidade
            </div>
            <div className="absolute top-6 right-6 flex items-center gap-2">
               <div className="bg-white/95 backdrop-blur-md px-4 py-2 rounded-2xl text-rose-500 shadow-sm border border-white/50 flex items-center gap-2">
                  <Heart size={14} className="fill-rose-500" />
                  <span className="text-xs font-black">{recipeData.likes}</span>
               </div>
            </div>
          </div>

          {/* Quick Info & Description */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 md:p-8 space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="md:col-span-1">
                   <label className={labelClasses}>Autor</label>
                   <div className="flex items-center gap-3 py-1">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden border-2 border-white shadow-sm shrink-0">
                         <UserCircle size={40} strokeWidth={1} />
                      </div>
                      <span className="text-xs font-bold text-slate-700 leading-tight">{recipeData.author}</span>
                   </div>
                </div>
                <div>
                   <label className={labelClasses}>Tempo total</label>
                   <div className={fieldBoxClasses}><Clock size={16} className="text-slate-300 mr-2" /> {recipeData.totalTime}</div>
                </div>
                <div>
                   <label className={labelClasses}>Peso final</label>
                   <div className={fieldBoxClasses}><Scale size={16} className="text-slate-300 mr-2" /> {recipeData.finalWeight}</div>
                </div>
                <div>
                   <label className={labelClasses}>Porções</label>
                   <div className={fieldBoxClasses}><Utensils size={16} className="text-slate-300 mr-2" /> {recipeData.portions}</div>
                </div>
             </div>

             <div>
                <label className={labelClasses}>Descrição</label>
                <div className="p-5 bg-slate-50/50 border border-slate-100 rounded-2xl text-sm text-slate-600 leading-relaxed font-medium italic">
                   "{recipeData.description}"
                </div>
             </div>
          </div>

          {/* Ingredients Section */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
             <div className="p-6 md:p-8 border-b border-slate-50 flex items-center gap-3">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Utensils size={18} /></div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Ingredientes</h3>
             </div>
             <div className="p-6 md:p-8 grid grid-cols-1 gap-3">
                {recipeData.ingredients.map((ing: string, i: number) => (
                  <div key={i} className="flex items-center gap-4 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl group hover:border-nutri-blue/20 transition-all">
                     <div className="w-6 h-6 rounded-full bg-white border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:text-nutri-blue transition-colors">{i+1}</div>
                     <span className="text-sm font-semibold text-slate-700">{ing}</span>
                  </div>
                ))}
             </div>
          </div>

          {/* Method Preparation Section */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
             <div className="p-6 md:p-8 border-b border-slate-50 flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Activity size={18} /></div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Método de preparo</h3>
             </div>
             <div className="p-6 md:p-8 space-y-4">
                {recipeData.method.map((step: string, i: number) => (
                  <div key={i} className="flex items-start gap-4 p-5 bg-slate-50/50 border border-slate-100 rounded-2xl">
                     <div className="w-7 h-7 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-xs font-black text-slate-400 shrink-0 shadow-sm">{i+1}</div>
                     <p className="text-sm font-medium text-slate-600 leading-relaxed pt-0.5">{step}</p>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Nutritional Sidebar Area (Right 30%) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-6 md:p-8 sticky top-24">
             <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center justify-between">
                <span>Análise global por porção</span>
                <Info size={14} className="text-slate-300" />
             </h3>

             {/* Energy Hero */}
             <div className="flex items-center justify-between p-5 bg-slate-50 rounded-3xl border border-slate-100 mb-8">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-orange-100 text-orange-600 rounded-xl"><Flame size={20} /></div>
                   <span className="text-xs font-bold text-slate-600 uppercase">Valor energético</span>
                </div>
                <div className="text-right">
                   <span className="text-2xl font-black text-slate-800 tracking-tight">{recipeData.energyPerPortion}</span>
                   <span className="text-[10px] font-bold text-slate-400 uppercase ml-1">kcal</span>
                </div>
             </div>

             {/* Macro Chart & List - Optimized for mobile and visibility */}
             <div className="space-y-8 overflow-hidden">
                <div className="flex flex-col items-center gap-6">
                   <div className="w-32 h-32 shrink-0">
                      <ResponsiveContainer width="100%" height="100%">
                         <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                            <Pie 
                               data={recipeData.macros} 
                               innerRadius={30} 
                               outerRadius={42} 
                               paddingAngle={4} 
                               dataKey="value"
                               cx="50%"
                               cy="50%"
                               stroke="none"
                            >
                               {recipeData.macros.map((entry: any, index: number) => (
                                 <Cell key={`cell-${index}`} fill={entry.color} />
                               ))}
                            </Pie>
                         </PieChart>
                      </ResponsiveContainer>
                   </div>
                   <div className="flex-1 space-y-2 w-full">
                      {recipeData.macros.map((m: any, i: number) => (
                        <div key={i} className="space-y-1">
                           <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                              <span className="text-slate-400 flex items-center gap-1.5">
                                 <div className="w-1.5 h-1.5 rounded-full" style={{backgroundColor: m.color}}></div>
                                 {m.name}
                              </span>
                              <span className="text-slate-700">{m.value}g</span>
                           </div>
                           <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                              <div className="h-full rounded-full transition-all" style={{backgroundColor: m.color, width: `${(m.value / 30) * 100}%`}}></div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Micronutrients Micro-Bars */}
                <div className="space-y-4 pt-6 border-t border-slate-50">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Micronutrientes detalhados</h4>
                   <div className="max-h-[300px] sm:max-h-[500px] overflow-y-auto no-scrollbar pr-2 -mr-2 space-y-4">
                      {recipeData.microNutrients.map((n: any, i: number) => (
                        <div key={i} className="group">
                           <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-bold text-slate-500 group-hover:text-slate-800 transition-colors">{n.label}</span>
                              <div className="flex items-center gap-1.5">
                                 <span className="text-[11px] font-black text-slate-700">{n.value}</span>
                                 <span className="text-[9px] font-bold text-slate-300 uppercase">{n.unit}</span>
                              </div>
                           </div>
                           <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                              <div className="h-full bg-slate-200 group-hover:bg-nutri-blue transition-all" style={{width: `${Math.min(n.percent * 2, 100)}%`}}></div>
                           </div>
                        </div>
                      ))}
                   </div>
                   <div className="flex justify-center pt-4 opacity-40">
                      <ChevronDown size={20} className="text-slate-300 animate-bounce" />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
      
      {/* Refined Footer Bar with requested buttons */}
      <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm">
         <button className="w-full sm:w-auto px-8 py-3.5 border-2 border-rose-100 text-rose-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all flex items-center justify-center gap-2">
           Excluir receita
         </button>
         <button 
           onClick={onBack}
           className="w-full sm:w-auto px-12 py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl shadow-slate-200 hover:scale-105 active:scale-95 transition-all"
         >
           Fechar
         </button>
      </div>
    </div>
  );
};

export default RecipeDetailView;
