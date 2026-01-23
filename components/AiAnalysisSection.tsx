
import React, { useState } from 'react';
import { Sparkles, Brain, ArrowRight, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import { aiService } from '../services/aiService';
import LoadingSpinner from './ui/LoadingSpinner';

interface AiAnalysisProps {
  formData: any;
  onApplyAnalysis: (analysisText: string) => void;
}

const AiAnalysisSection: React.FC<AiAnalysisProps> = ({ formData, onApplyAnalysis }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      // Remove campos vazios para economizar tokens
      const result = await aiService.generateAnalysis(formData);
      setAnalysis(result);
    } catch (error) {
      alert("Erro ao gerar análise. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-3xl border border-indigo-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            
            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white rounded-xl shadow-sm text-purple-600">
                        <Sparkles size={20} />
                    </div>
                    <h3 className="text-lg font-display font-bold text-slate-warm-800">NutriClin Cognitive AI</h3>
                </div>
                
                <p className="text-sm text-slate-warm-600 mb-6 max-w-2xl leading-relaxed">
                    Nossa IA analisa todos os dados coletados (anamnese, medições, bioimpedância e exames) para sugerir um pré-diagnóstico nutricional, pontos de atenção e estratégia dietética personalizada.
                </p>

                {!analysis ? (
                    <button 
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="px-6 py-3 bg-slate-warm-800 text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-warm-900 transition-all shadow-lg shadow-slate-warm-800/20 disabled:opacity-70 disabled:cursor-not-allowed group"
                    >
                        {isLoading ? <LoadingSpinner size={16} color="white" /> : <Brain size={18} />}
                        {isLoading ? 'Analisando 142 pontos de dados...' : 'Gerar Análise Completa'}
                        {!isLoading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                ) : (
                    <div className="animate-slide-up space-y-4">
                        <div className="bg-white/80 backdrop-blur rounded-2xl p-6 border border-white/50 shadow-sm">
                            <h4 className="flex items-center gap-2 font-bold text-slate-warm-800 mb-4 border-b border-slate-100 pb-3">
                                <FileText size={16} className="text-nutri-blue" />
                                Resultado da Análise
                            </h4>
                            <div className="prose prose-sm prose-slate max-w-none text-slate-warm-600 leading-relaxed font-medium">
                                <pre className="whitespace-pre-wrap font-sans">{analysis}</pre>
                            </div>
                        </div>
                        
                        <div className="flex gap-3 justify-end">
                             <button 
                                onClick={() => setAnalysis(null)}
                                className="px-4 py-2 text-slate-warm-500 font-bold text-xs hover:bg-slate-100 rounded-lg transition-colors"
                             >
                                Descartar
                             </button>
                             <button 
                                onClick={() => onApplyAnalysis(analysis)}
                                className="px-6 py-3 bg-nutri-blue text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-nutri-blue-hover transition-all shadow-md"
                             >
                                <CheckCircle2 size={18} />
                                Aplicar às Observações
                             </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default AiAnalysisSection;
