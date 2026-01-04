
import React, { useState } from 'react';
import { X, Edit2, Check } from 'lucide-react';

interface RecommendationModelViewProps {
  name: string;
  onBack: () => void;
}

const RecommendationModelView: React.FC<RecommendationModelViewProps> = ({ name, onBack }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [modelName, setModelName] = useState(name);
  
  // Updated content to match the request: "fast food " prefix added
  const [content, setContent] = useState(`fast food produtos açucarados: biscoitos recheados ou amanteigados; wafers; bolos; bombons; mel; melado; rapadura; gelatinas com açúcar; goiabada; doce ou creme de leite; chocolates; tortas; sorvetes`);

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 px-1">
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        {/* Header matching the requested title change */}
        <div className="p-6 md:p-8 flex items-center justify-between border-b border-slate-50">
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Editar modelo de recomendações</h1>
          <button onClick={onBack} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Form fields based on the UI feedback */}
        <div className="p-6 md:p-8 space-y-10">
          {/* Model Name Input Area - Adjusted height and styling */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">NOME DO MODELO</label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                {isEditing ? (
                  <input 
                    type="text"
                    value={modelName}
                    onChange={(e) => setModelName(e.target.value)}
                    className="w-full px-5 py-3 bg-white border-2 border-nutri-blue/30 rounded-xl text-slate-700 font-bold focus:border-nutri-blue outline-none transition-all shadow-sm"
                    placeholder="Digite o nome do modelo..."
                  />
                ) : (
                  <div className="w-full px-5 py-3 bg-slate-50/50 border border-slate-100 rounded-xl transition-all min-h-[48px] flex items-center">
                    <span className="text-slate-400 font-bold text-sm uppercase">{modelName}</span>
                  </div>
                )}
              </div>
              <button 
                onClick={toggleEdit}
                className={`p-3 rounded-xl transition-all ${isEditing ? 'bg-nutri-blue text-white shadow-lg shadow-nutri-blue/20' : 'bg-nutri-blue/5 text-nutri-blue hover:bg-nutri-blue/10 border border-nutri-blue/10'}`}
                title={isEditing ? "Salvar alterações" : "Habilitar edição"}
              >
                {isEditing ? <Check size={20} strokeWidth={3} /> : <Edit2 size={20} strokeWidth={2.5} />}
              </button>
            </div>
          </div>

          {/* Foods to Avoid Content Area - Enabled/Disabled based on isEditing */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">ALIMENTOS A EVITAR</label>
            <div className="relative">
              <textarea 
                readOnly={!isEditing}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={10}
                className={`w-full px-6 py-8 border rounded-[32px] font-bold focus:outline-none resize-none leading-relaxed text-sm md:text-base min-h-[300px] transition-all ${
                  isEditing 
                    ? 'bg-white border-nutri-blue/30 focus:border-nutri-blue shadow-inner text-slate-700' 
                    : 'bg-white border-slate-100 text-slate-400'
                }`}
                placeholder="Liste aqui os alimentos a serem evitados..."
              />
              {/* Resize Handle / Detail Icon */}
              {!isEditing && (
                <div className="absolute bottom-6 right-6 text-slate-200 pointer-events-none">
                  <svg width="16" height="16" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M10 10L1 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M10 6L6 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer Info for Clinical context with requested text */}
      <div className="mt-8 flex flex-col items-center gap-4">
        {isEditing && (
          <button 
            onClick={toggleEdit}
            className="px-12 py-4 bg-nutri-blue text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-nutri-blue/20 hover:bg-nutri-blue-hover transition-all transform active:scale-95"
          >
            Salvar Alterações
          </button>
        )}
        <button onClick={onBack} className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] hover:text-nutri-blue transition-colors opacity-60">
          FECHAR VISUALIZAÇÃO CLÍNICA
        </button>
      </div>
    </div>
  );
};

export default RecommendationModelView;
