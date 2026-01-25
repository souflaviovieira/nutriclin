
import React, { useState } from 'react';
import { Apple, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, ShieldCheck, Sparkles } from 'lucide-react';
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
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;

        // Criação automática do perfil após o cadastro
        if (data?.user) {
          await supabase.from('profiles').insert([
            {
              id: data.user.id,
              display_name: email.split('@')[0],
              specialty: 'Nutricionista'
            }
          ]);
        }

        setError("Cadastro realizado! Verifique seu e-mail para confirmar.");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        if (data?.user) {
          console.log("Login realizado com sucesso:", data.user);
          onLogin();
        }
      }
    } catch (err: any) {
      console.error("Erro detalhado:", err);
      setError(err.message || "Erro na autenticação.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col lg:flex-row overflow-hidden font-display selection:bg-coral-100 selection:text-coral-600">
      {/* Visual Side (Desktop) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-coral-500 to-coral-700 p-16 flex-col justify-between relative overflow-hidden group">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white/5 rounded-full -mr-32 -mt-32 blur-[120px] animate-float"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-coral-400/20 rounded-full -ml-20 -mb-20 blur-[100px] animate-pulse-glow"></div>
        <div className="absolute inset-0 opacity-10 pointer-events-none grain-texture"></div>

        <div className="relative z-10 animate-fade-in">
          <div className="flex items-center gap-3 mb-16">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl text-white border border-white/20 shadow-soft">
              <Apple size={32} className="text-white" />
            </div>
            <span className="text-3xl font-bold text-white tracking-tighter">NutriClin</span>
          </div>

          <div className="max-w-md stagger-1 animate-slide-up">
            <h1 className="text-[64px] font-bold text-white leading-[1] mb-8 tracking-tighter text-balance">
              Inteligência que <span className="opacity-60 italic font-medium">nutre</span> sua clínica.
            </h1>
            <p className="text-coral-50/80 text-lg leading-relaxed font-medium max-w-sm">
              Simplifique sua rotina, analise dados clínicos e acompanhe evoluções com apoio de IA editorial.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-8 text-coral-100/40 text-[10px] font-bold uppercase tracking-[0.2em] stagger-3 animate-fade-in">
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-coral-300/40" />
            <span>Privacidade LGPD</span>
          </div>
          <div className="w-1 h-1 bg-coral-400/30 rounded-full"></div>
          <div className="flex items-center gap-2">
            <Lock size={14} className="text-coral-300/40" />
            <span>Dados Criptografados</span>
          </div>
        </div>
      </div>

      {/* Form Side */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 lg:p-24 relative">
        <div className="absolute inset-0 opacity-30 pointer-events-none grain-texture"></div>

        <div className="w-full max-w-[400px] relative z-20">
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center gap-3 mb-12 justify-center animate-fade-in">
            <div className="bg-coral-500 p-2.5 rounded-2xl text-white shadow-xl shadow-coral-600/20">
              <Apple size={28} />
            </div>
            <span className="text-3xl font-bold text-slate-warm-800 tracking-tighter">NutriClin</span>
          </div>

          <div className="text-center lg:text-left mb-10 animate-slide-up">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral-50 text-coral-600 text-[10px] font-bold uppercase tracking-widest mb-4">
              <Sparkles size={12} />
              <span>Plataforma Profissional</span>
            </div>
            <h2 className="text-[38px] font-bold text-slate-warm-900 mb-3 tracking-tight leading-tight">
              {isSignUp ? 'Criar sua conta' : 'Acesse o painel'}
            </h2>
            <p className="text-slate-warm-500 font-medium leading-relaxed">
              {isSignUp ? 'Junte-se a nutricionistas que buscam excelência clínica.' : 'Entre com suas credenciais para gerenciar seus atendimentos.'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5 animate-scale-in stagger-2">
            {error && (
              <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl text-sm font-semibold animate-bounce-in">
                <AlertCircle size={18} className="shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-warm-400 uppercase tracking-[0.15em] ml-1">E-mail Profissional</label>
              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-warm-300 group-focus-within/input:text-coral-500 transition-colors duration-300">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  className="input-coral pl-12 focus:ring-4 focus:ring-coral-500/5"
                />
              </div>
            </div>

            <div className="space-y-1.5 text-balance">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-bold text-slate-warm-400 uppercase tracking-[0.15em]">Senha Segura</label>
                {!isSignUp && <button type="button" className="text-[10px] font-bold text-coral-500 uppercase tracking-widest hover:text-coral-600 hover:underline transition-all">Esqueci a senha</button>}
              </div>
              <div className="relative group/input">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-warm-300 group-focus-within/input:text-coral-500 transition-colors duration-300">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="input-coral pl-12 pr-12 focus:ring-4 focus:ring-coral-500/5"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-warm-300 hover:text-coral-500 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary h-14 flex items-center justify-center gap-3 group mt-4 transform active:scale-95 disabled:grayscale disabled:opacity-50"
            >
              {isLoading ? (
                <LoadingSpinner size={20} color="white" />
              ) : (
                <>
                  <span className="uppercase tracking-widest text-xs font-bold">{isSignUp ? 'Criar Conta' : 'Acessar Plataforma'}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="mt-12 text-center text-slate-warm-400 text-xs font-bold animate-fade-in stagger-4">
            {isSignUp ? 'Já possui acesso?' : 'Ainda não é cadastrado?'}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-coral-500 font-bold uppercase tracking-widest hover:text-coral-600 hover:underline ml-2 transition-all p-2"
            >
              {isSignUp ? 'Fazer login' : 'Solicitar conta'}
            </button>
          </p>
        </div>

        {/* Support footer */}
        <div className="absolute bottom-6 text-[9px] text-slate-warm-300 font-bold uppercase tracking-widest animate-fade-in stagger-5">
          © 2026 NutriClin Pro • Systems Intelligence
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
