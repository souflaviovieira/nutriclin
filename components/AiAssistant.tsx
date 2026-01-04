
import React, { useState } from 'react';
import { Sparkles, Send, Zap, LayoutDashboard, TrendingUp, Users, MessageSquare } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import LoadingSpinner from './ui/LoadingSpinner';

const AiAssistant: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateInsights = async (customPrompt?: string) => {
    setIsLoading(true);
    setResponse(null);

    try {
      const metrics = {
        activePatients: 124,
        revenue: 'R$ 15.420',
        nextAppointments: 4
      };

      let text;
      if (customPrompt) {
        // Implementar no geminiService se necessário, ou usar o padrão por enquanto
        text = await geminiService.getDashboardInsights(metrics);
      } else {
        text = await geminiService.getDashboardInsights(metrics);
      }

      setResponse(text || "Não foi possível gerar uma resposta.");
    } catch (error) {
      setResponse("Erro ao conectar com o Nutri AI.");
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { label: 'Analisar Clínica', icon: <LayoutDashboard size={16} />, prompt: 'Analise os dados gerais da minha clínica e sugira melhorias.' },
    { label: 'Retenção de Pacientes', icon: <Users size={16} />, prompt: 'Como posso melhorar a taxa de retorno dos meus pacientes?' },
    { label: 'Sugestões de Atendimento', icon: <MessageSquare size={16} />, prompt: 'Dê dicas de como tornar o primeiro atendimento mais marcante.' },
    { label: 'Otimização Financeira', icon: <TrendingUp size={16} />, prompt: 'Como posso aumentar meu ticket médio sem perder pacientes?' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-50">
          <Sparkles size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Nutri AI Assistant</h1>
          <p className="text-slate-500 max-w-lg mx-auto mt-2">
            Sua assistente inteligente para gestão clínica. Analise dados, tire dúvidas e receba sugestões estratégicas.
          </p>
        </div>
      </div>

      {/* Main Interaction Area */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Chat/Response Display */}
        <div className="flex-1 p-8 overflow-y-auto bg-slate-50/30">
          {!response && !isLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
              <div className="space-y-2">
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Escolha uma ação rápida</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto">
                  {quickActions.map((action, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setPrompt(action.prompt);
                        handleGenerateInsights(action.prompt);
                      }}
                      className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-2xl text-left hover:border-emerald-500 hover:bg-emerald-50 transition-all group"
                    >
                      <div className="p-2 bg-slate-50 text-slate-400 group-hover:bg-emerald-100 group-hover:text-emerald-600 rounded-xl transition-colors">
                        {action.icon}
                      </div>
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-emerald-700">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* User Prompt (if we wanted to show it) */}
              {prompt && (
                <div className="flex justify-end">
                  <div className="bg-slate-800 text-white px-6 py-3 rounded-2xl rounded-tr-none max-w-[80%] text-sm font-medium shadow-md">
                    {prompt}
                  </div>
                </div>
              )}

              {/* AI Response */}
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 p-8 rounded-2xl rounded-tl-none max-w-[90%] shadow-sm relative group">
                  <div className="absolute -left-10 top-0 w-8 h-8 bg-emerald-500 text-white rounded-lg flex items-center justify-center">
                    <Zap size={16} />
                  </div>

                  {isLoading ? (
                    <div className="flex items-center gap-4 text-emerald-600 font-bold text-sm">
                      <LoadingSpinner size={20} />
                      Processando inteligência...
                    </div>
                  ) : (
                    <div className="prose prose-slate prose-sm max-w-none">
                      <p className="text-slate-700 leading-relaxed whitespace-pre-line text-base">
                        {response}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {!isLoading && response && (
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => handleGenerateInsights()}
                    className="flex items-center gap-2 text-xs font-bold text-emerald-600 px-4 py-2 bg-emerald-50 rounded-full hover:bg-emerald-100 transition-colors"
                  >
                    Regerar Análise
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-6 bg-white border-t border-slate-100">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (prompt.trim()) handleGenerateInsights(prompt);
            }}
            className="flex items-center gap-3 bg-slate-50 border border-slate-200 p-2 rounded-2xl focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-500 transition-all"
          >
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Pergunte qualquer coisa sobre sua clínica..."
              className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-sm text-slate-700 placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="p-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all disabled:bg-slate-300 disabled:cursor-not-allowed shadow-lg shadow-emerald-100"
            >
              {isLoading ? <LoadingSpinner size={18} color="white" /> : <Send size={18} />}
            </button>
          </form>
        </div>
      </div>

      {/* Benefits Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { title: 'Privacidade Total', desc: 'Seus dados clínicos são analisados anonimamente.' },
          { title: 'Baseado em Evidências', desc: 'Respostas alinhadas com boas práticas de gestão.' },
          { title: 'Sempre Disponível', desc: 'Insights estratégicos 24/7 para sua carreira.' },
        ].map((benefit, i) => (
          <div key={i} className="text-center p-4">
            <h4 className="font-bold text-slate-800 text-sm mb-1">{benefit.title}</h4>
            <p className="text-xs text-slate-400 leading-relaxed">{benefit.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiAssistant;
