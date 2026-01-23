
import React from 'react';
import { MapPin, Globe, Upload } from 'lucide-react';

const ClinicSettings: React.FC = () => {
  return (
    <div className="max-w-3xl space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-warm-800">Dados da Clínica</h2>
        <p className="text-slate-warm-500">Configure o endereço e a identidade visual do seu consultório.</p>
      </div>

      {/* Logo Identity */}
      <div className="bg-white rounded-2xl border border-cream-200 shadow-soft-sm p-6 md:p-8">
        <h3 className="font-bold text-lg text-slate-warm-800 mb-4">Identidade Visual</h3>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-full md:w-auto flex flex-col items-center p-6 border-2 border-dashed border-cream-300 rounded-2xl bg-cream-50 hover:bg-cream-100 hover:border-coral-300 transition-all cursor-pointer group">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Upload className="text-coral-500" size={20} />
            </div>
            <p className="text-sm font-bold text-slate-warm-600">Upload Logotipo</p>
            <p className="text-xs text-slate-warm-400 mt-1">PNG transparente (max 2MB)</p>
          </div>
          <div className="flex-1 space-y-3">
             <div className="space-y-1">
                <label className="text-xs font-bold text-slate-warm-400 uppercase tracking-wider">Nome da Clínica</label>
                <input 
                  type="text" 
                  defaultValue="NutriClin Saúde Integrada"
                  className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-slate-warm-800 font-medium focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all"
                />
             </div>
             <p className="text-xs text-slate-warm-400 leading-relaxed">Este logotipo aparecerá no cabeçalho dos planos alimentares, receitas e relatórios gerados em PDF para seus pacientes.</p>
          </div>
        </div>
      </div>

      {/* Address & Contact */}
      <div className="bg-white rounded-2xl border border-cream-200 shadow-soft-sm p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                <MapPin size={20} />
            </div>
            <h3 className="font-bold text-lg text-slate-warm-800">Endereço do Consultório</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <div className="md:col-span-1 space-y-2">
                <label className="text-xs font-bold text-slate-warm-400 uppercase tracking-wider">CEP</label>
                <input 
                  type="text" 
                  placeholder="00000-000"
                  className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-slate-warm-800 font-medium focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all"
                />
             </div>
             <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-slate-warm-400 uppercase tracking-wider">Rua / Av.</label>
                <input 
                  type="text" 
                  placeholder="Av. Paulista"
                  className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-slate-warm-800 font-medium focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all"
                />
             </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="md:col-span-1 space-y-2">
                <label className="text-xs font-bold text-slate-warm-400 uppercase tracking-wider">Número</label>
                <input 
                  type="text" 
                  placeholder="1000"
                  className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-slate-warm-800 font-medium focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all"
                />
             </div>
             <div className="md:col-span-1 space-y-2">
                <label className="text-xs font-bold text-slate-warm-400 uppercase tracking-wider">Compl.</label>
                <input 
                  type="text" 
                  placeholder="Sala 42"
                  className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-slate-warm-800 font-medium focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all"
                />
             </div>
             <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-slate-warm-400 uppercase tracking-wider">Bairro</label>
                <input 
                  type="text" 
                  placeholder="Bela Vista"
                  className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-slate-warm-800 font-medium focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all"
                />
             </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-warm-400 uppercase tracking-wider">Cidade</label>
                <input 
                  type="text" 
                  placeholder="São Paulo"
                  className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-slate-warm-800 font-medium focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all"
                />
            </div>
             <div className="space-y-2">
                <label className="text-xs font-bold text-slate-warm-400 uppercase tracking-wider">Estado</label>
                <select className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-slate-warm-800 font-medium focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all appearance-none cursor-pointer">
                    <option>São Paulo</option>
                    <option>Rio de Janeiro</option>
                    <option>Minas Gerais</option>
                    {/* ... */}
                </select>
            </div>
        </div>

        <div className="border-t border-cream-100 pt-4 mt-4">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Globe className="text-slate-warm-400" size={18} />
                    <div>
                        <p className="text-sm font-bold text-slate-warm-800">Link de Agendamento</p>
                        <p className="text-xs text-slate-warm-400">nutriclin.com.br/agendar/dra-ana</p>
                    </div>
                </div>
                <button className="text-xs font-bold text-coral-500 hover:text-coral-600 hover:underline">
                    Copiar Link
                </button>
             </div>
        </div>
      </div>
       <div className="flex justify-end gap-3">
          <button className="px-6 py-2.5 rounded-xl bg-coral-500 text-white font-bold text-sm hover:bg-coral-600 transition-colors shadow-sm hover:shadow-md">
            Salvar Dados da Clínica
          </button>
        </div>
    </div>
  );
};

export default ClinicSettings;
