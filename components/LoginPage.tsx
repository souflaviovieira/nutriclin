
import React, { useState } from 'react';
import { Apple, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import LoadingSpinner from './ui/LoadingSpinner';

interface LoginPageProps {
  onLogin: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        setError("Verifique seu e-mail para confirmar o cadastro!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        onLogin();
      }
    } catch (err: any) {
      setError(err.message || "Erro na autenticação.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row overflow-hidden">
      {/* Visual Side (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0D8E74] to-[#156152] p-16 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl text-white border border-white/20">
              <Apple size={36} />
            </div>
            <span className="text-3xl font-black text-white tracking-tighter">NutriClin</span>
          </div>

          <div className="max-w-md">
            <h1 className="text-[54px] font-black text-white leading-[1.1] mb-8 tracking-tight">
              Gestão clínica inteligente
            </h1>
            <p className="text-emerald-50/80 text-lg leading-relaxed font-medium">
              Simplifique sua rotina, analise dados clínicos e acompanhe evoluções com apoio da Inteligência Artificial.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-6 text-emerald-100/40 text-[11px] font-black uppercase tracking-widest">
          <span>Privacidade Protegida</span>
          <div className="w-1.5 h-1.5 bg-emerald-400/30 rounded-full"></div>
          <span>Criptografia de Dados</span>
          <div className="w-1.5 h-1.5 bg-emerald-400/30 rounded-full"></div>
          <span>Conformidade com a LGPD</span>
        </div>

        {/* Dynamic Abstract Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full -mr-32 -mt-32 blur-[100px]"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-400/10 rounded-full -ml-20 -mb-20 blur-[100px]"></div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-24 bg-white">
        <div className="w-full max-w-[420px]">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-3 mb-12 justify-center">
            <div className="bg-[#0D8E74] p-2.5 rounded-2xl text-white shadow-xl shadow-emerald-600/20">
              <Apple size={28} />
            </div>
            <span className="text-3xl font-black text-slate-800 tracking-tighter">NutriClin</span>
          </div>

          <div className="text-center lg:text-left mb-12">
            <h2 className="text-[34px] font-black text-slate-800 mb-2 tracking-tight">
              {isSignUp ? 'Criar Conta Profissional' : 'Bem-vindo(a) ao NutriClin'}
            </h2>
            <p className="text-slate-500 font-medium">
              {isSignUp ? 'Cadastre-se para começar a utilizar a Inteligência Artificial na sua clínica.' : 'Acesse sua conta e utilize a Inteligência Artificial para apoiar suas decisões clínicas.'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-sm font-semibold animate-in fade-in zoom-in duration-300">
                <AlertCircle size={18} className="shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">E-mail Profissional</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0D8E74] transition-colors">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@nutriclin.com"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 focus:border-[#0D8E74] focus:bg-white rounded-2xl outline-none transition-all text-slate-700 text-sm font-bold shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Senha</label>
                {!isSignUp && <button type="button" className="text-[10px] font-black text-[#0D8E74] uppercase tracking-widest hover:underline">Esqueci minha senha</button>}
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#0D8E74] transition-colors">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-4 bg-slate-50 border border-slate-100 focus:border-[#0D8E74] focus:bg-white rounded-2xl outline-none transition-all text-slate-700 text-sm font-bold shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-16 bg-[#0D8E74] hover:bg-[#0A745E] disabled:bg-slate-300 text-white font-black rounded-2xl shadow-[0_15px_40px_-10px_rgba(13,142,116,0.5)] transition-all flex items-center justify-center gap-3 group mt-4 transform active:scale-95"
            >
              {isLoading ? (
                <LoadingSpinner size={22} color="white" />
              ) : (
                <>
                  <span className="text-sm uppercase tracking-widest">{isSignUp ? 'Criar Conta' : 'Acessar o painel clínico'}</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-16 text-center text-slate-400 text-xs font-bold">
            {isSignUp ? 'Já tem uma conta?' : 'Ainda não tem uma conta?'}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-[#0D8E74] font-black uppercase tracking-widest hover:underline ml-2"
            >
              {isSignUp ? 'Faça login' : 'Solicite acesso profissional'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
