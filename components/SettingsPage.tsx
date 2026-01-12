
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../services/supabaseClient';
import { storageService } from '../services/storageService';
import { useUser } from '../contexts/UserContext';
import {
  User, Settings, Shield, DollarSign, Upload, Save, Globe, Camera,
  PenTool, Phone, Instagram, Facebook, Youtube, MapPin, Clock, Target,
  Palette, Monitor, Type, AtSign, Loader2, Smartphone
} from 'lucide-react';
import Input from './ui/Input';
import Card from './ui/Card';
import Button from './ui/Button';

type SettingsTab = 'profissional' | 'atendimento' | 'gestao' | 'sistema' | 'seguranca';

interface SettingsPageProps {
  activeSection?: SettingsTab;
  onSectionChange?: (section: SettingsTab) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({
  activeSection: externalActiveSection,
  onSectionChange
}) => {
  const { profile: userProfile, refreshProfile } = useUser();
  const [activeSectionState, setActiveSectionState] = useState<SettingsTab>('profissional');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  // Use external section if provided, otherwise fallback to local state
  const activeSection = externalActiveSection || activeSectionState;
  const setActiveSection = onSectionChange || setActiveSectionState;

  const [profile, setProfile] = useState({
    display_name: '',
    specialty: '',
    crn: '',
    cpf_cnpj: '',
    address: '',
    avatar_url: '',
    logo_url: '',
    signature_url: '',
    contacts: {
      phone: '',
      email: '',
      whatsapp: '',
      instagram: '',
      facebook: '',
      youtube: '',
      tiktok: '',
    }
  });

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const signatureInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (userProfile) {
      setProfile((prev) => ({
        ...prev,
        ...userProfile,
      }));
      setLoading(false);
    } else {
      fetchProfile();
    }
  }, [userProfile]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setProfile({
          ...profile,
          ...data,
          contacts: {
            ...profile.contacts,
            ...(data.contacts || {})
          }
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleContactChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      contacts: {
        ...prev.contacts,
        [field]: value
      }
    }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'logo' | 'signature') => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploading(type);
      const { data: { user } } = await supabase.auth.getUser();
      // Fallback para desenvolvimento quando login está desativado
      const userId = user?.id || 'dev-user';

      const compressedFile = await storageService.compressImage(file);
      const fileExt = 'webp';
      const fileName = `${userId}/${type}_${Date.now()}.${fileExt}`;
      const bucket = 'professional-assets';
      const oldUrl = profile[`${type}_url` as keyof typeof profile] as string;

      const publicUrl = await storageService.uploadFile(compressedFile, {
        bucket,
        path: fileName,
        oldPath: oldUrl
      });

      const updatedProfile = { ...profile, [`${type}_url`]: publicUrl };
      setProfile(updatedProfile);

      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        localStorage.setItem('nutriclin_dev_profile', JSON.stringify(updatedProfile));
      }

      await refreshProfile();
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      alert(`Erro ao enviar ${type}. Tente novamente.`);
    } finally {
      setUploading(null);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();

      // Se não há usuário, simular sucesso (modo desenvolvimento)
      if (!user) {
        console.log('Modo desenvolvimento: salvando localmente apenas');
        localStorage.setItem('nutriclin_dev_profile', JSON.stringify(profile));
        await refreshProfile();
        alert('Configurações salvas com sucesso! (modo dev)');
        return;
      }

      const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        ...profile,
        updated_at: new Date().toISOString()
      });

      if (error) throw error;
      await refreshProfile();
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Erro ao salvar configurações. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  const sections = [
    { id: 'profissional', label: 'Profissional', icon: <User size={18} /> },
    { id: 'atendimento', label: 'Atendimento', icon: <Clock size={18} /> },
    { id: 'gestao', label: 'Gestão', icon: <Target size={18} /> },
    { id: 'sistema', label: 'Sistema', icon: <Settings size={18} /> },
    { id: 'seguranca', label: 'Segurança', icon: <Shield size={18} /> },
  ];

  const sectionTitleClasses = "text-sm font-bold text-nutri-text uppercase tracking-widest flex items-center gap-2 mb-6";

  return (
    <div className="max-w-[1600px] mx-auto animate-in fade-in duration-500 pb-24 px-1 h-full flex flex-col">
      <div className="flex flex-col md:flex-row gap-6 h-full">
        {/* Settings Navigation Sidebar */}
        <div className="w-full md:w-64 shrink-0 space-y-2">
          <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-2">Configurações</h2>
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as SettingsTab)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeSection === section.id
                      ? 'bg-nutri-blue text-white shadow-md shadow-nutri-blue/20'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                >
                  {section.icon}
                  {section.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="md:hidden">
            <p className="text-[10px] text-center text-slate-400 mt-2">Dica: Role para ver mais opções</p>
          </div>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 min-w-0 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-10 overflow-y-auto max-h-[calc(100vh-140px)]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
              <Loader2 size={48} className="text-nutri-blue animate-spin" />
              <p className="text-sm font-bold text-nutri-text-sec uppercase tracking-widest mt-4">Carregando configurações...</p>
            </div>
          ) : (
            <div className="max-w-3xl">
              {activeSection === 'profissional' ? (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                  <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
                  <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo')} />
                  <input type="file" ref={signatureInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'signature')} /> // ... (keeping existing inputs)

                  <div className="space-y-8">
                    <div className="flex items-center gap-4 mb-6 border-b border-slate-50 pb-6">
                      <User size={32} className="text-nutri-blue" />
                      <div>
                        <h3 className="text-xl font-black text-slate-800 tracking-tight">Dados Profissionais</h3>
                        <p className="text-sm font-medium text-slate-400">Gerencie suas informações públicas e de identificação.</p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-8 bg-slate-50/50 p-6 rounded-3xl border border-slate-50">
                      <div className="relative group">
                        <div className="w-32 h-32 rounded-[32px] overflow-hidden ring-4 ring-white shadow-lg flex items-center justify-center bg-slate-200">
                          {profile.avatar_url ? (
                            <img src={profile.avatar_url} className="w-full h-full object-cover" alt="Avatar" />
                          ) : (
                            <User size={48} className="text-slate-400" />
                          )}
                          {uploading === 'avatar' && (
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-[2px]">
                              <Loader2 size={32} className="text-white animate-spin" />
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => avatarInputRef.current?.click()}
                          className="absolute -bottom-2 -right-2 p-2.5 bg-nutri-blue text-white rounded-2xl shadow-xl hover:scale-110 transition-all active:scale-95 border-4 border-white"
                          disabled={!!uploading}
                        >
                          <Camera size={18} />
                        </button>
                      </div>
                      <div className="flex-1 space-y-1 text-center sm:text-left">
                        <h4 className="text-2xl font-bold text-nutri-text tracking-tight">
                          {profile.display_name || 'Seu Nome'}
                        </h4>
                        <p className="text-nutri-text-dis font-bold text-sm uppercase tracking-widest bg-white/50 px-3 py-1 rounded-lg inline-block">
                          {profile.specialty || 'Sua Especialidade'}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Input
                        label="Nome de Exibição"
                        value={profile.display_name}
                        onChange={(e) => handleInputChange('display_name', e.target.value)}
                        placeholder="Ex: Dra. Letícia Rosa"
                      />
                      <Input
                        label="Especialidade"
                        value={profile.specialty}
                        onChange={(e) => handleInputChange('specialty', e.target.value)}
                        placeholder="Ex: Nutrição Clínica"
                      />
                      <Input
                        label="CRN"
                        value={profile.crn}
                        onChange={(e) => handleInputChange('crn', e.target.value)}
                        placeholder="Ex: 12345/P"
                      />
                      <Input
                        label="CPF / CNPJ"
                        value={profile.cpf_cnpj}
                        onChange={(e) => handleInputChange('cpf_cnpj', e.target.value)}
                        placeholder="000.000.000-00"
                      />
                      <div className="md:col-span-2">
                        <Input
                          label="Endereço do Consultório"
                          icon={<MapPin size={16} />}
                          value={profile.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          placeholder="Av. Paulista, 1000 - São Paulo, SP"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-2 mb-4">
                      <PenTool size={20} className="text-nutri-blue" />
                      <h3 className="text-lg font-black text-slate-800">Documentos & Identidade Visual</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Logotipo</label>
                        <div
                          onClick={() => logoInputRef.current?.click()}
                          className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-slate-50 hover:border-nutri-blue/30 transition-all cursor-pointer group bg-slate-50/30 h-40 relative overflow-hidden"
                        >
                          {profile.logo_url ? (
                            <img src={profile.logo_url} className="h-full w-full object-contain p-2" alt="Logo" />
                          ) : (
                            <div className="text-center">
                              <Upload size={24} className="mx-auto text-slate-300 group-hover:text-nutri-blue mb-2 transition-colors" />
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Enviar Logo</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Assinatura</label>
                        <div
                          onClick={() => signatureInputRef.current?.click()}
                          className="border-2 border-dashed border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 hover:bg-slate-50 hover:border-nutri-blue/30 transition-all cursor-pointer group bg-slate-50/30 h-40 relative overflow-hidden"
                        >
                          {profile.signature_url ? (
                            <img src={profile.signature_url} className="h-full w-full object-contain p-2" alt="Assinatura" />
                          ) : (
                            <div className="text-center">
                              <PenTool size={24} className="mx-auto text-slate-300 group-hover:text-nutri-blue mb-2 transition-colors" />
                              <span className="text-[10px] font-bold text-slate-400 uppercase">Enviar Assinatura</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6 pt-6 border-t border-slate-50">
                    <div className="flex items-center gap-2 mb-4">
                      <AtSign size={20} className="text-nutri-blue" />
                      <h3 className="text-lg font-black text-slate-800">Canais de Contato</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { key: 'phone', label: 'Telefone', icon: <Phone size={16} /> },
                        { key: 'email', label: 'E-mail', icon: <AtSign size={16} /> },
                        { key: 'whatsapp', label: 'WhatsApp', icon: <Smartphone size={16} /> },
                        { key: 'instagram', label: 'Instagram', icon: <Instagram size={16} /> },
                      ].map((c) => (
                        <Input
                          key={c.key}
                          label={c.label}
                          icon={c.icon}
                          value={(profile.contacts as any)[c.key] || ''}
                          onChange={(e) => handleContactChange(c.key, e.target.value)}
                        />
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                    {sections.find(s => s.id === activeSection)?.icon}
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2">{sections.find(s => s.id === activeSection)?.label}</h3>
                  <p className="text-slate-400 font-medium max-w-sm mx-auto">Esta seção está sendo reformulada para o novo padrão visual.</p>
                </div>
              )}

              <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between sticky bottom-0 bg-white/90 backdrop-blur-sm p-4 rounded-2xl">
                <div className="hidden sm:block">
                  <p className="text-xs text-slate-400 font-medium">Última atualização: Hoje, 14:30</p>
                </div>
                <Button
                  variant="primary"
                  onClick={handleSave}
                  disabled={saving}
                  icon={saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  className="w-full sm:w-auto"
                >
                  {saving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
