
import React from 'react';
import { User, Mail, Phone, Camera } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

const ProfileSettings: React.FC = () => {
  const { profile } = useUser();

  return (
    <div className="max-w-3xl space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-warm-800">Seu Perfil Profissional</h2>
        <p className="text-slate-warm-500">Gerencie suas informações pessoais e de exibição.</p>
      </div>

      {/* Avatar Section */}
      <div className="flex items-center gap-6 p-6 bg-white rounded-2xl border border-cream-200 shadow-soft-sm">
        <div className="relative group cursor-pointer">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-coral-100 to-coral-50 flex items-center justify-center text-4xl font-display font-bold text-coral-500 overflow-hidden border-4 border-white shadow-md">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              profile?.display_name?.charAt(0).toUpperCase() || 'U'
            )}
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="text-white" size={24} />
          </div>
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-warm-800 mb-1">Foto de Perfil</h3>
          <p className="text-sm text-slate-warm-500 mb-3">Recomendado: 400x400px, JPG ou PNG.</p>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-cream-300 rounded-xl text-xs font-bold text-slate-warm-600 hover:border-coral-300 hover:text-coral-500 transition-colors">
              Alterar Foto
            </button>
            <button className="px-4 py-2 bg-transparent text-xs font-bold text-red-400 hover:text-red-500 transition-colors">
              Remover
            </button>
          </div>
        </div>
      </div>

      {/* Form Details */}
      <div className="bg-white rounded-2xl border border-cream-200 shadow-soft-sm overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-warm-400 uppercase tracking-wider">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-warm-400" size={18} />
                <input 
                  type="text" 
                  defaultValue={profile?.display_name || "Dra. Ana Silva"}
                  className="w-full pl-12 pr-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-slate-warm-800 font-medium focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-warm-400 uppercase tracking-wider">CRN / Registro</label>
              <input 
                type="text" 
                defaultValue="CRN-3 12345"
                className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-slate-warm-800 font-medium focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-warm-400 uppercase tracking-wider">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-warm-400" size={18} />
                <input 
                  type="email" 
                  defaultValue={profile?.email || "ana.silva@nutri.com"}
                  className="w-full pl-12 pr-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-slate-warm-800 font-medium focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-warm-400 uppercase tracking-wider">Telefone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-warm-400" size={18} />
                <input 
                  type="tel" 
                  defaultValue="(11) 99999-9999"
                  className="w-full pl-12 pr-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-slate-warm-800 font-medium focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-warm-400 uppercase tracking-wider">Bio / Especialidades</label>
            <textarea 
              rows={4}
              defaultValue="Nutrição Esportiva, Emagrecimento e Performance. Especialista em dieta Low FODMAP."
              className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-slate-warm-800 font-medium focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all resize-none"
            />
          </div>
        </div>

        <div className="px-6 py-4 bg-cream-50 border-t border-cream-200 flex justify-end gap-3">
          <button className="px-6 py-2.5 rounded-xl text-slate-warm-500 font-bold text-sm hover:bg-cream-100 transition-colors">
            Cancelar
          </button>
          <button className="px-6 py-2.5 rounded-xl bg-coral-500 text-white font-bold text-sm hover:bg-coral-600 transition-colors shadow-sm hover:shadow-md">
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
