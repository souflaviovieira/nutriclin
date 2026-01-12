
import React, { useState } from 'react';
import { 
  Apple, 
  Search, 
  Plus, 
  ChevronRight, 
  Flame, 
  Droplets, 
  Circle, 
  Diamond,
  BookOpen,
  Scale,
  Layout,
  Zap,
  Clock,
  Heart,
  FileText,
  User,
  Users,
  ArrowRight,
  Filter,
  X,
  UserCircle
} from 'lucide-react';

interface PlansLibraryProps {
  onViewModel?: (name: string) => void;
  onViewRecommendation?: (name: string) => void;
  onViewFood?: (food: any) => void;
  onViewRecipe?: (recipe: any) => void;
  onViewSubstitution?: (item: any) => void;
  onCreateRecipe?: () => void;
  activeTab: MainTab;
  activeSubTab: string;
  setActiveSubTab: (subTab: string) => void;
  isFoodModalOpen: boolean;
  setIsFoodModalOpen: (open: boolean) => void;
  foodToEdit: any;
  setFoodToEdit: (food: any) => void;
}

// Defining MainTab type to fix missing type errors
type MainTab = 'alimentos' | 'receitas' | 'substituicoes' | 'modelos';

const PlansLibrary: React.FC<PlansLibraryProps> = ({ 
  onViewModel, onViewRecommendation, onViewFood, onViewRecipe, onViewSubstitution, onCreateRecipe,
  activeTab, activeSubTab, setActiveSubTab,
  isFoodModalOpen, setIsFoodModalOpen, foodToEdit, setFoodToEdit
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState({
    energy: 'todos',
    protein: 'todos',
    carbs: 'todos',
    fat: 'todos'
  });

  const MacroIcon = ({ type }: { type: 'energia' | 'gordura' | 'carbo' | 'proteina' }) => {
    switch (type) {
      case 'energia': return <Flame size={14} className="text-orange-500" />;
      case 'gordura': return <Droplets size={14} className="text-amber-500" />;
      case 'carbo': return <Circle size={14} className="text-blue-500" />;
      case 'proteina': return <Diamond size={14} className="text-emerald-500" />;
    }
  };

  const MacroItem = ({ label, value, unit, type }: any) => (
    <div className="flex flex-col items-center justify-center p-2 sm:p-3 sm:border-r border-slate-100 last:border-0 w-full h-full">
      <span className="text-[11px] sm:text-sm font-black text-slate-800 leading-tight mb-1">{value} <span className="text-[9px] font-bold text-slate-400">{value !== '--' ? unit : ''}</span></span>
      <div className="flex items-center gap-1.5">
        <MacroIcon type={type} />
        <span className="text-[7px] sm:text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      </div>
    </div>
  );

  const FilterSelect = ({ label, value, options, onChange }: any) => (
    <div className="space-y-2 flex-1 min-w-[120px]">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{label}</label>
      <select 
        value={value} 
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-bold text-slate-600 focus:ring-4 focus:ring-nutri-blue/5 outline-none transition-all"
      >
        {options.map((opt: any) => <option key={opt.val} value={opt.val}>{opt.label}</option>)}
      </select>
    </div>
  );

  const recipeList = [
    { 
      id: 'r1',
      title: 'Crepioca', 
      author: 'Rosimeire de Macedo Reis', 
      type: 'Café da manhã e lanches', 
      energy: '231', fat: '6', carbs: '36', protein: '8', 
      likes: '749',
      img: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?q=80&w=400&h=300&fit=crop'
    },
    { 
      id: 'r2',
      title: 'Lasanha de abobrinha', 
      author: 'Géssica Araújo', 
      type: 'Pratos de carne', 
      energy: '134', fat: '8', carbs: '3', protein: '13', 
      likes: '509',
      img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=400&h=300&fit=crop'
    },
    { 
      id: 'r3',
      title: 'Overnight Oats', 
      author: 'Mara Regina Santos Da Silva', 
      type: 'Pratos vegetarianos, Café da manhã e lanches', 
      energy: '179', fat: '8', carbs: '26', protein: '6', 
      likes: '384',
      img: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?q=80&w=400&h=300&fit=crop'
    },
    { 
      id: 'r4',
      title: 'Salada Niçoise Francesa', 
      author: 'Kamyla Pereira', 
      type: 'Saladas', 
      energy: '52', fat: '3', carbs: '4', protein: '3', 
      likes: '269',
      img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&h=300&fit=crop'
    },
    { 
      id: 'r5',
      title: 'Picolé de abacaxi', 
      author: 'Bruna Nazar Melo Jardini', 
      type: 'Sobremesas', 
      energy: '27', fat: '-', carbs: '7', protein: '-', 
      likes: '260',
      img: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?q=80&w=400&h=300&fit=crop'
    },
    { 
      id: 'r6',
      title: 'Pão Protéico', 
      author: 'Mara Regina Santos Da Silva', 
      type: 'Café da manhã e lanches, Pão', 
      energy: '159', fat: '7', carbs: '1', protein: '22', 
      likes: '253',
      img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&h=300&fit=crop'
    },
    { 
      id: 'r7',
      title: 'Arroz de couve flor', 
      author: 'Mara Regina Santos Da Silva', 
      type: 'Entradas e acompanhamentos', 
      energy: '46', fat: '3', carbs: '5', protein: '2', 
      likes: '246',
      img: 'https://images.unsplash.com/photo-1512058560566-d8b4e24e2d9a?q=80&w=400&h=300&fit=crop'
    },
    { 
      id: 'r8',
      title: 'Patê de Frango com Ricota', 
      author: 'Harvillyn Jhessy P Rolim Wagner', 
      type: 'Café da manhã e lanches, Pratos de carne', 
      energy: '136', fat: '4', carbs: '2', protein: '22', 
      likes: '212',
      img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=400&h=300&fit=crop'
    }
  ];

  const mealPlans = [
    { name: 'Plano alimentar cetogênico 1200 kcal', energy: '1197', fat: '57', carbs: '11', protein: '32' },
    { name: 'Plano alimentar cetogênico 1500 kcal', energy: '1494', fat: '57', carbs: '9', protein: '34' },
    { name: 'Plano alimentar cetogênico 1800 kcal', energy: '1804', fat: '60', carbs: '11', protein: '29' },
    { name: 'Plano alimentar cetogênico 2000 kcal', energy: '1990', fat: '57', carbs: '15', protein: '28' },
    { name: 'Plano alimentar cetogênico normoproteico 1200 kcal', energy: '1211', fat: '66', carbs: '10', protein: '24' },
    { name: 'Plano alimentar cetogênico normoproteico 1500 kcal', energy: '1505', fat: '69', carbs: '9', protein: '22' },
    { name: 'Plano alimentar cetogênico normoproteico 1800 kcal', energy: '1811', fat: '69', carbs: '9', protein: '22' },
    { name: 'Plano alimentar cetogênico normoproteico 2000 kcal', energy: '1994', fat: '64', carbs: '10', protein: '26' },
    { name: 'Plano alimentar com baixo teor de carboidratos', energy: '1488', fat: '46', carbs: '20', protein: '34' },
    { name: 'Plano alimentar com baixo teor de fibras', energy: '1797', fat: '30', carbs: '46', protein: '24' },
    { name: 'Plano alimentar com baixo teor de FODMAPs 1200 kcal', energy: '1189', fat: '30', carbs: '43', protein: '27' },
    { name: 'Plano alimentar com baixo teor de FODMAPs 1400 kcal', energy: '1396', fat: '34', carbs: '42', protein: '24' },
    { name: 'Plano alimentar com baixo teor de FODMAPs 1700 kcal', energy: '1705', fat: '30', carbs: '42', protein: '28' },
    { name: 'Plano alimentar com baixo teor de FODMAPs 2000 kcal', energy: '1989', fat: '30', carbs: '46', protein: '24' },
    { name: 'Plano alimentar com baixo teor de FODMAPs 2200 kcal', energy: '2182', fat: '29', carbs: '44', protein: '27' },
    { name: 'Plano alimentar com baixo teor de gordura 1400 kcal', energy: '1408', fat: '19', carbs: '50', protein: '31' },
    { name: 'Plano alimentar com baixo teor de gordura 1600 kcal', energy: '1622', fat: '18', carbs: '50', protein: '32' },
    { name: 'Plano alimentar com baixo teor de gordura 1800 kcal', energy: '1795', fat: '19', carbs: '50', protein: '31' },
    { name: 'Plano alimentar com baixo teor de sódio', energy: '1617', fat: '24', carbs: '53', protein: '23' },
    { name: 'Plano alimentar com baixo teor de sódio e potássio', energy: '1300', fat: '36', carbs: '45', protein: '19' },
    { name: 'Plano alimentar com refeição pré e pós-treino 1500 kcal', energy: '1454', fat: '31', carbs: '38', protein: '31' },
    { name: 'Plano alimentar com refeição pré e pós-treino 1700 kcal', energy: '1699', fat: '24', carbs: '44', protein: '32' },
    { name: 'Plano alimentar com restrição de histamina', energy: '1499', fat: '20', carbs: '54', protein: '26' },
    { name: 'Plano alimentar de 1200 kcal (sem restrições)', energy: '1223', fat: '24', carbs: '55', protein: '21' },
    { name: 'Plano alimentar de 1500 kcal (sem restrições)', energy: '1499', fat: '24', carbs: '48', protein: '28' },
    { name: 'Plano alimentar de 1800 kcal (sem restrições)', energy: '1797', fat: '25', carbs: '49', protein: '26' },
    { name: 'Plano alimentar de 2000 kcal (sem restrições)', energy: '2024', fat: '24', carbs: '50', protein: '26' },
    { name: 'Plano alimentar de 2200 kcal (sem restrições)', energy: '2203', fat: '24', carbs: '52', protein: '24' },
    { name: 'Plano alimentar de 2500 kcal (sem restrições)', energy: '2499', fat: '24', carbs: '50', protein: '26' },
    { name: 'Plano alimentar hipoglicêmico', energy: '1586', fat: '36', carbs: '29', protein: '35' },
    { name: 'Plano alimentar hipoproteico 1500 kcal', energy: '1512', fat: '27', carbs: '64', protein: '9' },
    { name: 'Plano alimentar hipoproteico 1800 kcal', energy: '1805', fat: '27', carbs: '63', protein: '10' },
    { name: 'Plano alimentar hipoproteico 2000 kcal', energy: '1999', fat: '29', carbs: '61', protein: '10' },
    { name: 'Plano alimentar líquido 1000 kcal', energy: '1019', fat: '16', carbs: '56', protein: '28' },
    { name: 'Plano alimentar líquido 1200 kcal', energy: '1214', fat: '23', carbs: '52', protein: '25' },
    { name: 'Plano alimentar líquido 1500 kcal', energy: '1497', fat: '24', carbs: '53', protein: '23' },
    { name: 'Plano alimentar ovolactovegetariano 1200 kcal', energy: '1198', fat: '27', carbs: '49', protein: '24' },
    { name: 'Plano alimentar ovolactovegetariano 1500 kcal', energy: '1516', fat: '28', carbs: '51', protein: '21' },
    { name: 'Plano alimentar ovolactovegetariano 1800 kcal', energy: '1804', fat: '29', carbs: '50', protein: '21' },
    { name: 'Plano alimentar ovolactovegetariano 1900 kcal', energy: '1880', fat: '28', carbs: '52', protein: '20' },
    { name: 'Plano alimentar ovolactovegetariano 2000 kcal', energy: '1998', fat: '27', carbs: '50', protein: '23' },
    { name: 'Plano alimentar pediátrico', energy: '1333', fat: '30', carbs: '53', protein: '17' },
    { name: 'Plano alimentar pediátrico (+12 meses)', energy: '887', fat: '33', carbs: '51', protein: '16' },
    { name: 'Plano alimentar pediátrico (7-8 meses)', energy: '772', fat: '42', carbs: '43', protein: '15' },
    { name: 'Plano alimentar pediátrico (9-11 meses)', energy: '794', fat: '39', carbs: '46', protein: '15' },
    { name: 'Plano alimentar sem glúten e lactose 1100 kcal', energy: '1089', fat: '27', carbs: '46', protein: '27' },
    { name: 'Plano alimentar sem glúten e lactose 1300 kcal', energy: '1294', fat: '28', carbs: '46', protein: '26' },
    { name: 'Plano alimentar sem glúten e lactose 1700 kcal', energy: '1704', fat: '29', carbs: '46', protein: '25' },
    { name: 'Plano alimentar sem glúten e lactose 2000 kcal', energy: '1995', fat: '26', carbs: '52', protein: '22' },
    { name: 'Plano alimentar sem lactose 1100 kcal', energy: '1101', fat: '25', carbs: '53', protein: '22' },
    { name: 'Plano alimentar sem lactose 1300 kcal', energy: '1310', fat: '26', carbs: '51', protein: '23' },
    { name: 'Plano alimentar sem lactose 1600 kcal', energy: '1583', fat: '28', carbs: '49', protein: '23' },
    { name: 'Plano alimentar sem lactose 1900 kcal', energy: '1904', fat: '27', carbs: '49', protein: '24' },
    { name: 'Plano alimentar sem produtos lácteos 1200 kcal', energy: '1196', fat: '23', carbs: '49', protein: '28' },
    { name: 'Plano alimentar sem produtos lácteos 1500 kcal', energy: '1516', fat: '24', carbs: '48', protein: '28' },
    { name: 'Plano alimentar sem produtos lácteos 1800 kcal', energy: '1845', fat: '27', carbs: '51', protein: '22' },
    { name: 'Plano alimentar sem produtos lácteos 2000 kcal', energy: '2001', fat: '27', carbs: '49', protein: '24' },
    { name: 'Plano alimentar vegano 1300 kcal', energy: '1309', fat: '24', carbs: '56', protein: '20' },
    { name: 'Plano alimentar vegano 1500 kcal', energy: '1499', fat: '29', carbs: '52', protein: '19' },
    { name: 'Plano alimentar vegano 1700 kcal', energy: '1697', fat: '30', carbs: '51', protein: '19' },
    { name: 'Plano alimentar vegano 2000 kcal', energy: '2011', fat: '25', carbs: '51', protein: '24' },
    { name: 'Plano alimentar vegano 2200 kcal', energy: '2206', fat: '29', carbs: '50', protein: '21' },
  ];

  return (
    <div className="w-full max-w-[1600px] mx-auto space-y-4 md:space-y-6 animate-in fade-in duration-500 pb-10 px-1">
      {/* Main Module Content Container */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm p-4 md:p-8 space-y-6 md:space-y-8 relative">
        
        {/* Module Controls Area */}
        <div className="space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex gap-3">
                <div className="relative group flex-1">
                  <Search size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-nutri-blue transition-colors" />
                  <input 
                    type="text" 
                    placeholder={`Pesquisar em ${activeTab === 'alimentos' ? (activeSubTab === 'alimentos-base' ? 'alimentos' : 'suplementos') : activeTab === 'receitas' ? 'receitas' : activeTab === 'substituicoes' ? 'substituições' : 'modelos'}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-6 py-3.5 bg-slate-50 border border-slate-100 rounded-[20px] focus:ring-4 focus:ring-nutri-blue/5 focus:border-nutri-blue focus:bg-white outline-none text-[13px] font-semibold text-slate-700 transition-all shadow-inner placeholder:text-slate-300"
                  />
                </div>
                <button 
                  onClick={() => setShowFilterPanel(!showFilterPanel)}
                  className={`px-5 py-3.5 border rounded-[20px] transition-all shadow-sm flex items-center justify-center ${showFilterPanel ? 'bg-nutri-blue text-white border-nutri-blue' : 'bg-slate-50 text-slate-400 border-slate-100 hover:text-nutri-blue hover:border-nutri-blue/30 hover:bg-white'}`}
                >
                  <Filter size={18} />
                </button>
              </div>
            </div>
            
            <button 
              onClick={() => {
                if (activeTab === 'receitas') onCreateRecipe?.();
                if (activeTab === 'alimentos') setIsFoodModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-nutri-blue text-white rounded-2xl text-[10px] sm:text-[11px] font-black uppercase tracking-[0.15em] shadow-xl shadow-nutri-blue/20 hover:bg-nutri-blue-hover transition-all w-full lg:w-auto transform hover:scale-[1.02] active:scale-95 z-20"
            >
              <Plus size={18} strokeWidth={3} />
              {activeTab === 'alimentos' && (activeSubTab === 'alimentos-base' ? "Adicionar Alimento" : "Adicionar Suplemento")}
              {activeTab === 'receitas' && "Criar Receita"}
              {activeTab === 'substituicoes' && "Criar Lista"}
              {activeTab === 'modelos' && "Criar Modelo"}
            </button>
          </div>

          {/* Painel de Filtros Avançados */}
          {showFilterPanel && (
            <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 flex flex-wrap gap-6 animate-in slide-in-from-top-2 duration-300">
               <FilterSelect 
                  label="Energia" 
                  value={filters.energy} 
                  onChange={(val: any) => setFilters({...filters, energy: val})}
                  options={[{val: 'todos', label: 'Todos'}, {val: 'baixo', label: 'Baixa Caloria'}, {val: 'medio', label: 'Média'}, {val: 'alto', label: 'Alta'}]} 
               />
               <FilterSelect 
                  label="Proteína" 
                  value={filters.protein} 
                  onChange={(val: any) => setFilters({...filters, protein: val})}
                  options={[{val: 'todos', label: 'Todos'}, {val: 'baixo', label: 'Baixo Teor'}, {val: 'medio', label: 'Médio'}, {val: 'alto', label: 'Proteico'}]} 
               />
               <FilterSelect 
                  label="Carboidratos" 
                  value={filters.carbs} 
                  onChange={(val: any) => setFilters({...filters, carbs: val})}
                  options={[{val: 'todos', label: 'Todos'}, {val: 'baixo', label: 'Low Carb'}, {val: 'medio', label: 'Médio'}, {val: 'alto', label: 'Alto Teor'}]} 
               />
               <FilterSelect 
                  label="Gorduras" 
                  value={filters.fat} 
                  onChange={(val: any) => setFilters({...filters, fat: val})}
                  options={[{val: 'todos', label: 'Todos'}, {val: 'baixo', label: 'Baixa Gordura'}, {val: 'medio', label: 'Médio'}, {val: 'alto', label: 'Alta Gordura'}]} 
               />
               <div className="flex items-end pb-1">
                  <button 
                    onClick={() => setFilters({energy: 'todos', protein: 'todos', carbs: 'todos', fat: 'todos'})}
                    className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                    title="Limpar filtros"
                  >
                    <X size={18}/>
                  </button>
               </div>
            </div>
          )}
        </div>

        {/* --- DYNAMIC CONTENT LISTS --- */}
        
        {/* CARD LIST: ALIMENTOS / SUBSTITUIÇÕES / PLANOS */}
        {(activeTab === 'alimentos' || activeTab === 'substituicoes' || (activeTab === 'modelos' && activeSubTab === 'meal-plans')) && (
          <div className="grid grid-cols-1 gap-4">
            {(activeTab === 'alimentos' 
              ? (activeSubTab === 'alimentos-base' 
                ? [
                  { name: 'Mix de legumes no vapor Liv Up', brand: 'LIV UP', energy: '38', fat: '0', carbs: '6', protein: '3' },
                  { name: 'Purê de mandioquinha Liv Up', brand: 'LIV UP', energy: '96', fat: '3', carbs: '18', protein: '1' },
                  { name: 'Queijo minas frescal light sem lactose Atilatte', brand: 'ATILATTE', energy: '169', fat: '10', carbs: '--', protein: '17' },
                  { name: 'Pasta de amendoim integral Eat Clean', brand: 'EAT CLEAN', energy: '627', fat: '50', carbs: '21', protein: '23' },
                ]
                : [
                  { name: 'Suplemento Cabelos e Unhas em cápsulas Elixir', brand: 'ELIXIR', energy: '--', fat: '--', carbs: '--', protein: '--' },
                  { name: 'Hair Gro Dux Nutrition', brand: 'DUX NUTRITION', energy: '600', fat: '65', carbs: '--', protein: '--' },
                  { name: 'Frutooligossacarídeos (FOS) e probióticos em cápsulas Simcaps® Vitafor', brand: 'VITAFOR', energy: '--', fat: '--', carbs: '--', protein: '--' },
                  { name: 'Vitamina C em cristais sabor neutro Dux Nutrition', brand: 'DUX NUTRITION', energy: '--', fat: '--', carbs: '--', protein: '--' },
                  { name: 'Energy Kick™ sabor maçã verde Dux Nutrition', brand: 'DUX NUTRITION', energy: '383', fat: '4', carbs: '86', protein: '--' },
                  { name: 'BCAA concentrado em tabletes Mundo Verde Seleção', brand: 'MUNDO VERDE SELEÇÃO', energy: '286', fat: '--', carbs: '--', protein: '71' },
                  { name: 'BCAA ultra concentrado em tabletes Mundo Verde Seleção', brand: 'MUNDO VERDE SELEÇÃO', energy: '300', fat: '--', carbs: '--', protein: '75' },
                  { name: 'Vegan Ômega 3 em cápsulas Elixir', brand: 'ELIXIR', energy: '1000', fat: '100', carbs: '--', protein: '--' },
                  { name: 'AttenuAtive em spray Elixir', brand: 'ELIXIR', energy: '118', fat: '--', carbs: '35', protein: '--' },
                ]
              )
              : activeTab === 'substituicoes'
                ? [
                    { name: 'Cereal e Tubérculos', brand: 'LISTAS DO SISTEMA', energy: '96', fat: '1', carbs: '21', protein: '2', isSubstitution: true },
                    { name: 'Pão', brand: 'LISTAS DO SISTEMA', energy: '132', fat: '3', carbs: '24', protein: '4', isSubstitution: true },
                    { name: 'Leguminosas', brand: 'LISTAS DO SISTEMA', energy: '75', fat: '0', carbs: '13', protein: '5', isSubstitution: true },
                    { name: 'Fruta', brand: 'LISTAS DO SISTEMA', energy: '37', fat: '0', carbs: '10', protein: '1', isSubstitution: true },
                    { name: 'Gordura', brand: 'LISTAS DO SISTEMA', energy: '69', fat: '8', carbs: '0', protein: '--', isSubstitution: true },
                    { name: 'Carne, Peixe e Ovos', brand: 'LISTAS DO SISTEMA', energy: '239', fat: '9', carbs: '1', protein: '37', isSubstitution: true },
                    { name: 'Leite', brand: 'LISTAS DO SISTEMA', energy: '59', fat: '4', carbs: '2', protein: '4', isSubstitution: true },
                  ]
                : mealPlans.map(plan => ({ ...plan, brand: 'MODELOS DO SISTEMA', isModel: true }))
            ).map((item: any, idx) => (
              <div 
                key={idx} 
                onClick={() => {
                  if (item.isModel) onViewModel?.(item.name);
                  else if (item.isSubstitution) onViewSubstitution?.(item);
                  else if (activeTab === 'alimentos') onViewFood?.(item);
                }}
                className={`bg-white p-5 sm:p-6 rounded-[28px] border border-slate-100 shadow-sm hover:border-nutri-blue/20 hover:shadow-md transition-all flex flex-col md:flex-row items-center gap-6 group cursor-pointer`}
              >
                <div className="flex-1 min-w-0 w-full text-center md:text-left space-y-1">
                  <h4 className="text-[15px] sm:text-[17px] font-black text-slate-800 tracking-tight leading-tight group-hover:text-nutri-blue transition-colors">{item.name}</h4>
                  <p className="text-[9px] sm:text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">{item.brand}</p>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 bg-slate-50/50 p-1.5 rounded-2xl border border-slate-50 w-full md:w-[480px] shrink-0 divide-x sm:divide-x divide-slate-100">
                  <MacroItem label="Energia" value={item.energy} unit="kcal" type="energia" />
                  <MacroItem label="Gordura" value={item.fat} unit={item.isModel ? '%' : 'g'} type="gordura" />
                  <MacroItem label="Carboidratos" value={item.carbs} unit={item.isModel ? '%' : 'g'} type="carbo" />
                  <MacroItem label="Proteína" value={item.protein} unit={item.isModel ? '%' : 'g'} type="proteina" />
                </div>

                <div className="hidden md:flex shrink-0 pr-2">
                  <button className="p-3 text-slate-200 group-hover:text-nutri-blue group-hover:bg-nutri-blue/5 rounded-xl transition-all">
                    <ChevronRight size={22} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* GRID LIST: RECEITAS */}
        {activeTab === 'receitas' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-bottom-4 duration-500">
            {recipeList.map((recipe) => (
              <div 
                key={recipe.id} 
                onClick={() => onViewRecipe?.(recipe)}
                className="bg-white rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col md:flex-row overflow-hidden"
              >
                {/* Image Section */}
                <div className="relative w-full md:w-48 h-48 md:h-auto shrink-0">
                  <img src={recipe.img} alt={recipe.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-[8px] font-black text-nutri-blue uppercase tracking-widest shadow-sm border border-white/50 flex items-center gap-1.5">
                    <Users size={10} /> COMUNIDADE
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex-1 p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="text-lg font-black text-slate-800 tracking-tight leading-tight group-hover:text-nutri-blue transition-colors">{recipe.title}</h4>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                         <UserCircle size={14} className="text-slate-300" />
                         <span className="truncate max-w-[120px]">{recipe.author}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg border border-slate-100">
                       <Heart size={12} className="text-rose-500 fill-rose-500" />
                       <span className="text-[10px] font-black text-slate-600">{recipe.likes}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 bg-slate-50/80 px-3 py-1.5 rounded-lg w-fit">
                    <Zap size={12} className="text-amber-500" />
                    <span className="uppercase tracking-widest line-clamp-1">{recipe.type}</span>
                  </div>

                  {/* Tiny Macros Row */}
                  <div className="grid grid-cols-4 gap-2 pt-4 border-t border-slate-50">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1">
                        <Flame size={10} className="text-orange-500" />
                        <span className="text-[11px] font-black text-slate-700">{recipe.energy}</span>
                      </div>
                      <span className="text-[7px] font-black text-slate-300 uppercase tracking-tighter">Kcal</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1">
                        <Droplets size={10} className="text-amber-500" />
                        <span className="text-[11px] font-black text-slate-700">{recipe.fat}g</span>
                      </div>
                      <span className="text-[7px] font-black text-slate-300 uppercase tracking-tighter">Gord.</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1">
                        <Circle size={10} className="text-blue-500" />
                        <span className="text-[11px] font-black text-slate-700">{recipe.carbs}g</span>
                      </div>
                      <span className="text-[7px] font-black text-slate-300 uppercase tracking-tighter">Carb.</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-1">
                        <Diamond size={10} className="text-emerald-500" />
                        <span className="text-[11px] font-black text-slate-700">{recipe.protein}g</span>
                      </div>
                      <span className="text-[7px] font-black text-slate-300 uppercase tracking-tighter">Prot.</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LAYOUT: AVOID FOODS */}
        {activeTab === 'modelos' && activeSubTab === 'avoid-foods' && (
          <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-bottom-4">
            {['Alimentação saudável', 'Diabetes', 'Hipercolesterolemia', 'Hipertensão', 'Obesidade', 'Pós-Cirúrgico', 'Esportiva'].map(item => (
              <div 
                key={item} 
                onClick={() => onViewRecommendation?.(item)}
                className="p-6 md:p-8 bg-white rounded-[32px] border border-slate-100 shadow-sm hover:border-nutri-blue/30 hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
              >
                <div className="space-y-1">
                  <h4 className="text-base sm:text-lg font-black text-slate-800 group-hover:text-nutri-blue transition-colors">{item}</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Modelos do sistema</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-nutri-blue/5 group-hover:text-nutri-blue group-hover:border-nutri-blue/20 transition-all shrink-0">
                  <ChevronRight size={20} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LAYOUT: RECOMMENDATIONS */}
        {activeTab === 'modelos' && activeSubTab === 'recommendations' && (
          <div className="grid grid-cols-1 gap-4 animate-in slide-in-from-bottom-4">
            {['Alimentação saudável'].map(item => (
              <div 
                key={item} 
                onClick={() => onViewRecommendation?.(item)}
                className="p-6 md:p-8 bg-white rounded-[32px] border border-slate-100 shadow-sm hover:border-nutri-blue/30 hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
              >
                <div className="space-y-1">
                  <h4 className="text-base sm:text-lg font-black text-slate-800 group-hover:text-nutri-blue transition-colors">{item}</h4>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.2em]">Modelos do sistema</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300 group-hover:bg-nutri-blue/5 group-hover:text-nutri-blue group-hover:border-nutri-blue/20 transition-all shrink-0">
                  <ChevronRight size={20} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Library Branding Footer */}
      <footer className="flex flex-col items-center justify-center pt-10 space-y-4 opacity-40">
        <div className="flex items-center gap-3">
          <div className="w-1 h-1 rounded-full bg-slate-300"></div>
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
          <div className="w-1 h-1 rounded-full bg-slate-300"></div>
        </div>
        <p className="text-[8px] font-black uppercase tracking-[0.5em] text-slate-400">NutriDash Professional Repository</p>
      </footer>
    </div>
  );
};

export default PlansLibrary;
