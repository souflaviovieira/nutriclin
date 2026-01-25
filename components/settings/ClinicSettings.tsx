
import React, { useState } from 'react';
import { MapPin, Globe, Loader2 } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { useToast } from '../../contexts/ToastContext';
import { supabase } from '../../services/supabaseClient';
import ImageUpload from '../ui/ImageUpload';

const ClinicSettings: React.FC = () => {
  const { profile, refreshProfile } = useUser();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: profile?.contacts?.clinic_name || 'NutriClin Saúde Integrada',
    zip: profile?.contacts?.address_zip || '',
    street: profile?.contacts?.address_street || '',
    number: profile?.contacts?.address_number || '',
    complement: profile?.contacts?.address_complement || '',
    neighborhood: profile?.contacts?.address_neighborhood || '',
    city: profile?.contacts?.address_city || '',
    state: profile?.contacts?.address_state || 'São Paulo'
  });

  const handleLogoComplete = async (publicUrl: string) => {
    if (!profile) return;
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ logo_url: publicUrl })
        .eq('id', profile.id);

      if (error) throw error;
      await refreshProfile();
      showToast("Logotipo da clínica atualizado!");
    } catch (err: any) {
      console.error(err);
      showToast("Erro ao salvar logotipo: " + err.message, "error");
    }
  };

  const handleSave = async () => {
    if (!profile) return;
    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({
          contacts: {
            ...(profile.contacts || {}),
            clinic_name: formData.name,
            address_zip: formData.zip,
            address_street: formData.street,
            address_number: formData.number,
            address_complement: formData.complement,
            address_neighborhood: formData.neighborhood,
            address_city: formData.city,
            address_state: formData.state
          }
        })
        .eq('id', profile.id);

      if (error) throw error;
      await refreshProfile();
      showToast("Dados da clínica salvos com sucesso!");
    } catch (err: any) {
      console.error(err);
      showToast("Erro ao salvar dados: " + err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-display font-bold text-slate-800">Dados da Clínica</h2>
        <p className="text-slate-500 font-medium">Configure o endereço e a identidade visual do seu consultório.</p>
      </div>

      {/* Logo Identity */}
      <div className="bg-white rounded-2xl border border-cream-200 shadow-soft-sm p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 border-l-4 border-l-coral-500">
        <ImageUpload
          currentImageUrl={profile?.logo_url}
          onUploadComplete={handleLogoComplete}
          type="logo"
          placeholder="clinic"
          size="lg"
          folder="clinics"
        />
        <div className="flex-1 space-y-3 w-full">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Nome da Clínica</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-cream-50/50 border border-cream-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100/50 transition-all"
            />
          </div>
          <p className="text-xs text-slate-400 leading-relaxed italic">Este logotipo aparecerá no cabeçalho dos planos alimentares e relatórios.</p>
        </div>
      </div>

      {/* Address & Contact */}
      <div className="bg-white rounded-2xl border border-cream-200 shadow-soft-sm p-6 md:p-8 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-coral-50 rounded-lg text-coral-600">
            <MapPin size={20} />
          </div>
          <h3 className="font-bold text-lg text-slate-800">Endereço do Consultório</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1 space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">CEP</label>
            <input
              type="text"
              placeholder="00000-000"
              value={formData.zip}
              onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
              className="w-full px-4 py-3 bg-cream-50/50 border border-cream-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100/50 transition-all"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Rua / Av.</label>
            <input
              type="text"
              placeholder="Av. Paulista"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              className="w-full px-4 py-3 bg-cream-50/50 border border-cream-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100/50 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="md:col-span-1 space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Número</label>
            <input
              type="text"
              placeholder="1000"
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              className="w-full px-4 py-3 bg-cream-50/50 border border-cream-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100/50 transition-all"
            />
          </div>
          <div className="md:col-span-1 space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Compl.</label>
            <input
              type="text"
              placeholder="Sala 42"
              value={formData.complement}
              onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
              className="w-full px-4 py-3 bg-cream-50/50 border border-cream-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100/50 transition-all"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Bairro</label>
            <input
              type="text"
              placeholder="Bela Vista"
              value={formData.neighborhood}
              onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
              className="w-full px-4 py-3 bg-cream-50/50 border border-cream-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100/50 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Cidade</label>
            <input
              type="text"
              placeholder="São Paulo"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-4 py-3 bg-cream-50/50 border border-cream-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100/50 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Estado</label>
            <select
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full px-4 py-3 bg-cream-50/50 border border-cream-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100/50 transition-all appearance-none cursor-pointer"
            >
              <option>São Paulo</option>
              <option>Rio de Janeiro</option>
              <option>Minas Gerais</option>
            </select>
          </div>
        </div>

        <div className="border-t border-cream-100 pt-4 mt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cream-50 flex items-center justify-center text-slate-400">
                <Globe size={16} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 leading-tight">Link de Agendamento</p>
                <p className="text-xs text-slate-400 font-medium">nutriclin.com.br/agendar/user</p>
              </div>
            </div>
            <button className="text-xs font-bold text-coral-500 hover:text-coral-600 hover:underline px-3 py-1.5 bg-coral-50 rounded-lg transition-all">
              Copiar Link
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2 pb-8">
        <button
          onClick={handleSave}
          disabled={loading}
          className="px-8 py-3 rounded-xl bg-coral-500 text-white font-bold hover:bg-coral-600 transition-all shadow-lg shadow-coral-100 hover:shadow-xl active:scale-95 disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <Loader2 size={18} className="animate-spin" />}
          Salvar Dados da Clínica
        </button>
      </div>
    </div>
  );
};

export default ClinicSettings;
