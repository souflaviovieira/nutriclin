
import React, { useState } from 'react';
import { MapPin, Globe, Upload, Loader2 } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { storageService } from '../../services/storageService';
import { supabase } from '../../services/supabaseClient';

const ClinicSettings: React.FC = () => {
  const { profile, refreshProfile } = useUser();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
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

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;

    try {
      setUploading(true);
      const compressed = await storageService.compressImage(file);
      const fileName = `clinic-logo-${profile.id}-${Date.now()}.webp`;
      const publicUrl = await storageService.uploadFile(compressed, {
        bucket: 'nutriclin-media',
        path: `clinics/${fileName}`,
        oldPath: profile.logo_url || undefined
      });

      const { error } = await supabase
        .from('profiles')
        .update({ logo_url: publicUrl })
        .eq('id', profile.id);

      if (error) throw error;
      await refreshProfile();
      alert("Logotipo atualizado!");
    } catch (err: any) {
      console.error(err);
      alert("Erro ao subir logotipo: " + err.message);
    } finally {
      setUploading(false);
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
      alert("Dados da clínica salvos!");
    } catch (err: any) {
      console.error(err);
      alert("Erro ao salvar: " + err.message);
    } finally {
      setLoading(false);
    }
  };

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
          <input
            type="file"
            id="logo-upload"
            className="hidden"
            accept="image/*"
            onChange={handleLogoUpload}
            disabled={uploading}
          />
          <label
            htmlFor="logo-upload"
            className="w-full md:w-auto flex flex-col items-center p-6 border-2 border-dashed border-cream-300 rounded-2xl bg-cream-50 hover:bg-cream-100 hover:border-coral-300 transition-all cursor-pointer group"
          >
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              {uploading ? <Loader2 size={20} className="animate-spin text-coral-500" /> : <Upload className="text-coral-500" size={20} />}
            </div>
            <p className="text-sm font-bold text-slate-warm-600">Upload Logotipo</p>
            <p className="text-xs text-slate-warm-400 mt-1">PNG transparente (max 2MB)</p>
          </label>
          <div className="flex-1 space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-warm-400 uppercase tracking-wider">Nome da Clínica</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-slate-warm-800 font-medium focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all"
              />
            </div>
            {profile?.logo_url && (
              <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-cream-100 w-fit">
                <img src={profile.logo_url} alt="Clinic Logo" className="h-8 object-contain" />
                <span className="text-[10px] text-slate-warm-400 font-bold uppercase tracking-wider">Logo Atual</span>
              </div>
            )}
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
              value={formData.zip}
              onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
              className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-slate-warm-800 font-medium focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-warm-400 uppercase tracking-wider">Rua / Av.</label>
            <input
              type="text"
              placeholder="Av. Paulista"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
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
              value={formData.number}
              onChange={(e) => setFormData({ ...formData, number: e.target.value })}
              className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-slate-warm-800 font-medium focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all"
            />
          </div>
          <div className="md:col-span-1 space-y-2">
            <label className="text-xs font-bold text-slate-warm-400 uppercase tracking-wider">Compl.</label>
            <input
              type="text"
              placeholder="Sala 42"
              value={formData.complement}
              onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
              className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-slate-warm-800 font-medium focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all"
            />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs font-bold text-slate-warm-400 uppercase tracking-wider">Bairro</label>
            <input
              type="text"
              placeholder="Bela Vista"
              value={formData.neighborhood}
              onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
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
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-slate-warm-800 font-medium focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-warm-400 uppercase tracking-wider">Estado</label>
            <select
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="w-full px-4 py-3 bg-cream-50 border border-cream-200 rounded-xl text-slate-warm-800 font-medium focus:outline-none focus:border-coral-400 focus:ring-2 focus:ring-coral-100 transition-all appearance-none cursor-pointer"
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
        <button
          onClick={handleSave}
          disabled={loading || uploading}
          className="px-6 py-2.5 rounded-xl bg-coral-500 text-white font-bold text-sm hover:bg-coral-600 transition-colors shadow-sm hover:shadow-md disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          Salvar Dados da Clínica
        </button>
      </div>
    </div>
  );
};

export default ClinicSettings;
