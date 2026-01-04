
import React from 'react';
import { ArrowLeft, Printer, X, Flame, Droplets, Circle, Diamond, Scale, Info } from 'lucide-react';

interface SubstitutionDetailViewProps {
  item: any;
  onBack: () => void;
}

const SubstitutionDetailView: React.FC<SubstitutionDetailViewProps> = ({ item, onBack }) => {
  const getSubstitutionList = (name: string) => {
    if (name === 'Cereal e Tubérculos') {
      return {
        base: '1 escumadeira média cheia de arroz cozido (85 g)',
        alternatives: [
          '2 fatias médias de batata doce cozida (140 g)',
          '2.5 colheres de servir de batata inglesa sautê (130 g)',
          '4 colheres de sopa cheias de cará cozido (120 g)',
          '1 colher de arroz cheia, picada de mandioca cozida (60 g)',
          '4 colheres de sopa cheias de milho verde enlatado, drenado (96 g)',
          '1 colher de sopa rasa, picada de farofa de mandioca temperada (15 g)',
          '2 colheres de sopa de nhoque de batata cozido (50 g)',
          '3 unidades pequenas de batata baroa cozida (135 g)',
          '3 unidades pequenas de batata inglesa cozida (210 g)'
        ],
        micros: [
          { label: 'Sódio', val: '39', unit: 'mg' },
          { label: 'Vitamina A', val: '2', unit: 'ug' },
          { label: 'Vitamina B6', val: '0', unit: 'mg' },
          { label: 'Vitamina C', val: '7', unit: 'mg' },
          { label: 'Cálcio', val: '9', unit: 'mg' },
          { label: 'Ferro', val: '0', unit: 'mg' },
          { label: 'Magnésio', val: '12', unit: 'mg' },
          { label: 'Fósforo', val: '32', unit: 'mg' },
          { label: 'Potássio', val: '175', unit: 'mg' },
          { label: 'Zinco', val: '0', unit: 'mg' },
          { label: 'Cobre', val: '0', unit: 'mg' },
          { label: 'Manganês', val: '0', unit: 'mg' },
          { label: 'Tiamina', val: '0', unit: 'mg' },
          { label: 'Riboflavina', val: '0', unit: 'mg' },
          { label: 'Niacina', val: '1', unit: 'mg' },
        ]
      };
    }
    if (name === 'Pão') {
      return {
        base: '1 unidade de pão francês, de trigo (50 g)',
        alternatives: [
          '2 fatias de pão de forma de trigo integral (50 g)',
          '2 colheres de sopa cheias de aveia em flocos crua (30 g)',
          '5 unidades de biscoito salgado cream cracker (31 g)',
          '6 unidades de biscoito doce de maisena (30 g)'
        ],
        micros: [
          { label: 'Sódio', val: '190', unit: 'mg' },
          { label: 'Vitamina B6', val: '0', unit: 'mg' },
          { label: 'Vitamina C', val: '0', unit: 'mg' },
          { label: 'Cálcio', val: '22', unit: 'mg' },
          { label: 'Ferro', val: '1', unit: 'mg' },
          { label: 'Magnésio', val: '20', unit: 'mg' },
          { label: 'Fósforo', val: '57', unit: 'mg' },
          { label: 'Potássio', val: '70', unit: 'mg' },
          { label: 'Zinco', val: '1', unit: 'mg' },
          { label: 'Cobre', val: '0', unit: 'mg' },
          { label: 'Manganês', val: '0', unit: 'mg' },
          { label: 'Tiamina', val: '0', unit: 'mg' },
          { label: 'Riboflavina', val: '0', unit: 'mg' },
          { label: 'Niacina', val: '1', unit: 'mg' },
        ]
      };
    }
    if (name === 'Leguminosas') {
      return {
        base: '2 conchas pequenas de feijão preto cozido (100 g)',
        alternatives: [
          '5 colheres de sopa de lentilha cozida (90 g)',
          '5 colheres de sopa de ervilha enlatada, drenada (105 g)',
          '4 colheres de sopa de feijão fradinho cozido (80 g)'
        ],
        micros: [
          { label: 'Sódio', val: '99', unit: 'mg' },
          { label: 'Vitamina A', val: '1', unit: 'ug' },
          { label: 'Vitamina B6', val: '0', unit: 'mg' },
          { label: 'Cálcio', val: '20', unit: 'mg' },
          { label: 'Ferro', val: '1', unit: 'mg' },
          { label: 'Magnésio', val: '29', unit: 'mg' },
          { label: 'Fósforo', val: '83', unit: 'mg' },
          { label: 'Potássio', val: '203', unit: 'mg' },
          { label: 'Zinco', val: '1', unit: 'mg' },
          { label: 'Cobre', val: '0', unit: 'mg' },
          { label: 'Manganês', val: '0', unit: 'mg' },
          { label: 'Tiamina', val: '0', unit: 'mg' },
          { label: 'Riboflavina', val: '0', unit: 'mg' }
        ]
      };
    }
    if (name === 'Fruta') {
      return {
        base: '2 fatias pequenas de abacaxi cru (100 g)',
        alternatives: [
          '1/2 unidade de banana prata crua (33 g)',
          '1/2 unidade de caqui chocolate cru (55 g)',
          '1 unidade de carambola crua (75 g)',
          '1 unidade grande de figo cru (70 g)',
          '1 unidade pequena de laranja (90 g)',
          '1/2 unidade média de maçã (65 g)',
          '1/2 fatia de mamão Formosa cru (85 g)',
          '1/2 fatia de mamão Papaia cru (85 g)',
          '1 fatia grande de melão cru (115 g)',
          '1 fatia pequena de melancia cru (100 g)',
          '1/2 unidade pequena de manga (60 g)',
          '12 unidades médias de morango cru (144 g)',
          '6 unidades grande de uvas (72 g)',
          '2 unidades médias de ameixa crua (84 g)'
        ],
        micros: [
          { label: 'Sódio', val: '2', unit: 'mg' },
          { label: 'Vitamina A', val: '18', unit: 'ug' },
          { label: 'Vitamina B6', val: '0', unit: 'mg' },
          { label: 'Vitamina C', val: '28', unit: 'mg' },
          { label: 'Cálcio', val: '12', unit: 'mg' },
          { label: 'Ferro', val: '0', unit: 'mg' },
          { label: 'Magnésio', val: '9', unit: 'mg' },
          { label: 'Fósforo', val: '12', unit: 'mg' },
          { label: 'Potássio', val: '133', unit: 'mg' },
          { label: 'Zinco', val: '0', unit: 'mg' },
          { label: 'Cobre', val: '0', unit: 'mg' },
          { label: 'Manganês', val: '0', unit: 'mg' },
          { label: 'Tiamina', val: '0', unit: 'mg' },
          { label: 'Riboflavina', val: '0', unit: 'mg' },
          { label: 'Niacina', val: '0', unit: 'mg' }
        ]
      };
    }
    if (name === 'Gordura') {
      return {
        base: '1/2 colher de sopa de margarina (10 g)',
        alternatives: [
          '1 colher de sopa de óleo (8 g)',
          '1 colher de sopa de azeite de dendê (8 g)',
          '1 colher de sopa de azeite de oliva extra virgem (8 g)'
        ],
        micros: [
          { label: 'Sódio', val: '10', unit: 'mg' },
          { label: 'Cálcio', val: '0', unit: 'mg' },
          { label: 'Ferro', val: '0', unit: 'mg' },
          { label: 'Magnésio', val: '0', unit: 'mg' },
          { label: 'Fósforo', val: '0', unit: 'mg' },
          { label: 'Potássio', val: '0', unit: 'mg' }
        ]
      };
    }
    if (name === 'Carne, Peixe e Ovos') {
      return {
        base: '1 unidade de posta de cação cozida (200 g)',
        alternatives: [
          '1.5 filés de corvina grande assada (180 g)',
          '1.5 filés de filé de merluza assado (180 g)',
          '1 unidade grande de filé de pescada molho escabeche (155 g)',
          '1 unidade de pintado assado (120 g)',
          '1.5 unidades de pintado grelhado (180 g)',
          '1 posta de salmão fresco, sem pele, grelhado (100 g)',
          '4 unidades grandes de sardinha assada (160 g)',
          '1 filé de coxão mole de bovino, sem gordura, cozido (120 g)',
          '1 unidade de filé mingnon bovino, sem gordura, grelhado (120 g)',
          '1 filé de lagarto bovino cozido (120 g)',
          '1.5 filés de maminha bovina grelhada (150 g)',
          '4 pedaços de músculo bovino, sem gordura, cozido (120 g)',
          '1 fatia de picanha bovina, sem gordura, grelhada (100 g)',
          '3 unidades médias de coxa de frango, sem pele, cozida (120 g)',
          '1 peito pequeno de frango, sem pele, assado (140 g)',
          '1 unidade pequena de peito de frango, sem pele, grelhado (140 g)',
          '2 unidades médias de hambúrguer de bovino grelhado (112 g)',
          '2 unidades de costela de porco assada (50 g)',
          '2 unidades de ovo de galinha cozido (156 g)'
        ],
        micros: [
          { label: 'Sódio', val: '161', unit: 'mg' },
          { label: 'Vitamina A', val: '2', unit: 'ug' },
          { label: 'Vitamina B6', val: '0', unit: 'mg' },
          { label: 'Vitamina C', val: '1', unit: 'mg' },
          { label: 'Cálcio', val: '71', unit: 'mg' },
          { label: 'Ferro', val: '2', unit: 'mg' },
          { label: 'Magnésio', val: '32', unit: 'mg' },
          { label: 'Fósforo', val: '338', unit: 'mg' },
          { label: 'Potássio', val: '453', unit: 'mg' },
          { label: 'Zinco', val: '3', unit: 'mg' },
          { label: 'Cobre', val: '0', unit: 'mg' },
          { label: 'Manganês', val: '0', unit: 'mg' },
          { label: 'Tiamina', val: '0', unit: 'mg' },
          { label: 'Riboflavina', val: '0', unit: 'mg' },
          { label: 'Niacina', val: '8', unit: 'mg' }
        ]
      };
    }
    if (name === 'Leite') {
      return {
        base: '1 unidade pequena de iogurte natural (140 g)',
        alternatives: [
          '1 fatia média, tipo Danúbio de queijo minas, frescal (30 g)',
          '1 fatia pequena, tipo Danúbio de queijo minas, meia cura (20 g)',
          '2 colheres de sopa rasas de leite de vaca, desnatado, em pó (16 g)',
          '1 fatia pequena de queijo prato (15 g)',
          '2 colheres de sopa rasas de queijo requeijão cremoso (30 g)',
          '1 fatia de queijo ricota (50 g)',
          '1 copo duplo de leite de vaca, desnatado, UHT (200 g)'
        ],
        micros: [
          { label: 'Sódio', val: '94', unit: 'mg' },
          { label: 'Vitamina C', val: '0', unit: 'mg' },
          { label: 'Cálcio', val: '168', unit: 'mg' },
          { label: 'Ferro', val: '0', unit: 'mg' },
          { label: 'Magnésio', val: '9', unit: 'mg' },
          { label: 'Fósforo', val: '126', unit: 'mg' },
          { label: 'Potássio', val: '97', unit: 'mg' },
          { label: 'Zinco', val: '0', unit: 'mg' },
          { label: 'Cobre', val: '0', unit: 'mg' },
          { label: 'Manganês', val: '0', unit: 'mg' },
          { label: 'Tiamina', val: '0', unit: 'mg' },
          { label: 'Riboflavina', val: '0', unit: 'mg' },
          { label: 'Niacina', val: '0', unit: 'mg' }
        ]
      };
    }
    return null;
  };

  const data = getSubstitutionList(item.name);
  const macroItems = [
    { label: 'Energia', val: item.energy, unit: 'kcal', color: 'bg-purple-300' },
    { label: 'Gordura', val: item.fat === '--' ? '0' : item.fat, unit: 'g', color: 'bg-amber-400' },
    { label: 'Carboidratos', val: item.carbs, unit: 'g', color: 'bg-orange-300' },
    { label: 'Proteína', val: item.protein, unit: 'g', color: 'bg-blue-400' },
  ];

  return (
    <div className="max-w-[1600px] mx-auto animate-in fade-in duration-500 pb-20 px-1">
      <div className="bg-white p-6 md:p-10 rounded-[32px] border border-slate-100 shadow-sm space-y-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-slate-50 pb-8">
           <div className="flex flex-col sm:flex-row sm:items-center gap-6 flex-1 w-full">
              <div className="flex items-center gap-4 w-full">
                <button onClick={onBack} className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 border border-slate-100 transition-all shrink-0">
                  <ArrowLeft size={22} />
                </button>
                <div className="flex-1">
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Nome</span>
                   <div className="px-5 py-3 bg-white border border-slate-200 rounded-xl text-base md:text-lg font-bold text-slate-700 shadow-sm flex items-center min-h-[50px]">
                      {item.name}
                   </div>
                </div>
              </div>
           </div>
           <div className="flex gap-3 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none p-4 bg-white border border-slate-200 text-slate-400 rounded-2xl hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center">
                <Printer size={20} />
              </button>
              <button onClick={onBack} className="flex-1 sm:flex-none p-4 bg-nutri-blue text-white rounded-2xl shadow-xl shadow-nutri-blue/20 hover:bg-nutri-blue-hover transition-all flex items-center justify-center">
                <X size={20} />
              </button>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8 space-y-6">
             <div className="flex items-center gap-3 mb-2 px-2">
                <div className="p-2 bg-slate-100 text-slate-600 rounded-xl"><Scale size={18}/></div>
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-[0.2em]">Lista de substituição</h3>
             </div>
             
             <div className="space-y-3">
                <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-nutri-blue/20 transition-all group">
                   <p className="text-base font-bold text-slate-700 leading-relaxed">{data?.base || 'Nenhum dado base encontrado'}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                   {data?.alternatives?.map((alt: string, idx: number) => (
                     <div key={idx} className="flex items-center gap-4 animate-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                        <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest shrink-0 border border-slate-100">ou</div>
                        <div className="flex-1 p-4 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 shadow-sm hover:border-nutri-blue/20 transition-all min-h-[56px] flex items-center">
                           {alt}
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
             <div className="bg-white p-6 md:p-8 rounded-[32px] border border-slate-100 shadow-sm sticky top-24 space-y-10">
                <div>
                   <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-8 flex items-center justify-between">
                      <span>Análise de nutrientes por porção</span>
                      <Info size={14} className="text-slate-300" />
                   </h3>

                   <div className="space-y-8">
                      {macroItems.map((m, i) => (
                        <div key={i} className="space-y-2">
                           <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                 <div className="text-slate-700">
                                    {i === 0 ? <Flame size={16} /> : i === 1 ? <Droplets size={16}/> : i === 2 ? <Circle size={16}/> : <Diamond size={16}/>}
                                 </div>
                                 <span className="text-[11px] font-black text-slate-800 uppercase tracking-widest">{m.label}</span>
                              </div>
                              <div className="flex items-baseline gap-1">
                                 <span className="text-sm font-black text-slate-800">{m.val}</span>
                                 <span className="text-[10px] font-bold text-slate-400">{m.unit}</span>
                              </div>
                           </div>
                           <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full ${m.color} rounded-full transition-all duration-1000`} style={{ width: '60%' }}></div>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="space-y-1.5 pt-6 border-t border-slate-50">
                   {data?.micros?.map((mic: any, idx: number) => (
                     <div key={idx} className={`flex items-center justify-between p-2 rounded-lg transition-colors ${idx % 2 === 0 ? 'bg-slate-50/50' : 'bg-transparent'}`}>
                        <span className="text-[11px] font-bold text-slate-500">{mic.label}</span>
                        <div className="flex items-baseline gap-1">
                           <span className="text-[11px] font-black text-slate-700">{mic.val}</span>
                           <span className="text-[9px] font-bold text-slate-300 uppercase">{mic.unit}</span>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>

        <div className="flex justify-center opacity-40 hover:opacity-100 transition-opacity">
           <button onClick={onBack} className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-nutri-blue transition-colors">Voltar para a Biblioteca</button>
        </div>
      </div>
    </div>
  );
};

export default SubstitutionDetailView;
