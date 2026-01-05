
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../services/supabaseClient';
import { storageService } from '../services/storageService';
import {
  User,
  Settings,
  Shield,
  DollarSign,
  Upload,
  Save,
  Globe,
  Camera,
  PenTool,
  Phone,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  MapPin,
  Clock,
  Target,
  Palette,
  Monitor,
  Type,
  CheckCircle2,
  Briefcase,
  Smartphone,
  AtSign,
  Loader2
} from 'lucide-react';

type SettingsTab = 'profissional' | 'atendimento' | 'gestao' | 'sistema' | 'seguranca';

const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SettingsTab>('profissional');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  // Profile State
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
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"

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
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
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
      if (!user) throw new Error('User not authenticated');

      // 1. Compress the image
      const compressedFile = await storageService.compressImage(file);

      // 2. Prepare upload options
      const fileExt = 'webp'; // storageService returns webp
      const fileName = `${user.id}/${type}_${Date.now()}.${fileExt}`;
      const bucket = 'professional-assets';

      const oldUrl = profile[`${type}_url` as keyof typeof profile] as string;

      // 3. Upload using storageService
      const publicUrl = await storageService.uploadFile(compressedFile, {
        bucket,
        path: fileName,
        oldPath: oldUrl
      });

      setProfile(prev => ({
        ...prev,
        [`${type}_url`]: publicUrl
      }));
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
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
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

  const labelClasses = "text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1";
  const inputClasses = "w-full px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-nutri-blue/5 focus:border-nutri-blue focus:bg-white transition-all text-sm font-semibold text-slate-700 placeholder:text-slate-300";
  const sectionTitleClasses = "text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2 mb-6";

  return (
    <div className="max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-8 animate-in fade-in duration-500 pb-24 px-1">
      {/* Sidebar Navigation - Fixed structure */}
      <aside className="w-full lg:w-72 shrink-0">
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden sticky top-24">
          <div className="p-6 border-b border-slate-50 bg-slate-50/30">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Configurações</h2>
          </div>
          <nav className="p-3 space-y-1.5">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as SettingsTab)}
                className={`w-full flex items-center gap-3.5 px-5 py-4 rounded-[20px] text-sm font-bold transition-all group ${activeSection === section.id
                  ? 'bg-nutri-blue text-white shadow-lg shadow-nutri-blue/20 scale-[1.02]'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-nutri-blue'
                  }`}
              >
                <div className={`${activeSection === section.id ? 'text-white' : 'text-slate-300 group-hover:text-nutri-blue'}`}>
                  {section.icon}
                </div>
                {section.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 space-y-8 min-w-0">
        {loading ? (
          <div className="flex items-center justify-center p-24 bg-white rounded-[32px] border border-slate-100 min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 size={48} className="text-nutri-blue animate-spin" />
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Carregando configurações...</p>
            </div>
          </div>
        ) : (
          <>
            {/* --- PROFISSIONAL --- */}
            {activeSection === 'profissional' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                {/* Hidden File Inputs */}
                <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'avatar')} />
                <input type="file" ref={logoInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'logo')} />
                <input type="file" ref={signatureInputRef} className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, 'signature')} />

                {/* Dados Section */}
                <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
                  <h3 className={sectionTitleClasses}><User size={18} className="text-nutri-blue" /> Dados Profissionais</h3>
                  <div className="space-y-8">
                    <div className="flex flex-col sm:flex-row items-center gap-8">
                      <div className="relative group">
                        <div className="w-32 h-32 rounded-[32px] overflow-hidden ring-8 ring-slate-50 border border-slate-100 shadow-sm bg-slate-100 flex items-center justify-center">
                          {profile.avatar_url ? (
                            <img src={profile.avatar_url} className="w-full h-full object-cover" alt="Avatar" />
                          ) : (
                            <User size={48} className="text-slate-300" />
                          )}
                          {uploading === 'avatar' && (
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center backdrop-blur-[2px]">
                              <Loader2 size={32} className="text-white animate-spin" />
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => avatarInputRef.current?.click()}
                          className="absolute -bottom-2 -right-2 p-3 bg-nutri-blue text-white rounded-2xl shadow-xl hover:scale-110 transition-all active:scale-95 border-4 border-white"
                          disabled={!!uploading}
                        >
                          <Camera size={20} />
                        </button>
                      </div>
                      <div className="flex-1 space-y-1 text-center sm:text-left">
                        <h4 className="text-2xl font-black text-slate-800 tracking-tight">
                          {profile.display_name || 'Seu Nome'}
                        </h4>
                        <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
                          {profile.specialty || 'Sua Especialidade'} {profile.crn ? `• ${profile.crn}` : ''}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium mt-1">
                          Foto de Perfil: Dê preferência a fotos quadradas e bem iluminadas. O sistema atualizará o tamanho automaticamente.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className={labelClasses}>Nome de Exibição</label>
                        <input
                          type="text"
                          value={profile.display_name}
                          onChange={(e) => handleInputChange('display_name', e.target.value)}
                          placeholder="Ex: Dra. Letícia Rosa"
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>Especialidade</label>
                        <input
                          type="text"
                          value={profile.specialty}
                          onChange={(e) => handleInputChange('specialty', e.target.value)}
                          placeholder="Ex: Nutrição Clínica"
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>CRN</label>
                        <input
                          type="text"
                          value={profile.crn}
                          onChange={(e) => handleInputChange('crn', e.target.value)}
                          placeholder="Ex: 12345/P"
                          className={inputClasses}
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>CPF / CNPJ</label>
                        <input
                          type="text"
                          value={profile.cpf_cnpj}
                          onChange={(e) => handleInputChange('cpf_cnpj', e.target.value)}
                          placeholder="000.000.000-00"
                          className={inputClasses}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className={labelClasses}>Endereço do Consultório</label>
                        <div className="relative">
                          <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                          <input
                            type="text"
                            value={profile.address}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            placeholder="Av. Paulista, 1000 - São Paulo, SP"
                            className={inputClasses + " pl-11"}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Documentos Section */}
                <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                  <h3 className={sectionTitleClasses}><PenTool size={18} className="text-nutri-blue" /> Documentos & Identidade</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className={labelClasses}>Logotipo da Clínica</label>
                      <div
                        onClick={() => logoInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-100 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 hover:bg-slate-50 transition-colors cursor-pointer group bg-slate-50/30 min-h-[160px] relative overflow-hidden"
                      >
                        {profile.logo_url ? (
                          <img src={profile.logo_url} className="max-h-32 object-contain" alt="Logo" />
                        ) : (
                          <>
                            <Upload size={32} className="text-slate-300 group-hover:text-nutri-blue transition-colors" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Clique para enviar logo <br /> (PNG/JPG)</span>
                          </>
                        )}
                        {uploading === 'logo' && (
                          <div className="absolute inset-0 bg-white/60 flex flex-col items-center justify-center backdrop-blur-[1px] gap-2">
                            <Loader2 size={24} className="text-nutri-blue animate-spin" />
                            <span className="text-[10px] font-black text-nutri-blue uppercase tracking-widest">Processando...</span>
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium mt-1 px-1">
                        Logomarca: Use preferencialmente fundo transparente (PNG ou WebP). Tamanho ideal sugerido: 800x400px.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <label className={labelClasses}>Assinatura Digital</label>
                      <div
                        onClick={() => signatureInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-100 rounded-3xl p-8 flex flex-col items-center justify-center gap-3 hover:bg-slate-50 transition-colors cursor-pointer group bg-slate-50/30 min-h-[160px] relative overflow-hidden"
                      >
                        {profile.signature_url ? (
                          <img src={profile.signature_url} className="max-h-32 object-contain" alt="Assinatura" />
                        ) : (
                          <>
                            <PenTool size={32} className="text-slate-300 group-hover:text-nutri-blue transition-colors" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Clique para enviar <br /> assinatura digital</span>
                          </>
                        )}
                        {uploading === 'signature' && (
                          <div className="absolute inset-0 bg-white/60 flex flex-col items-center justify-center backdrop-blur-[1px] gap-2">
                            <Loader2 size={24} className="text-nutri-blue animate-spin" />
                            <span className="text-[10px] font-black text-nutri-blue uppercase tracking-widest">Processando...</span>
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium mt-1 px-1">
                        Assinatura Digital: Assine em um papel branco liso com caneta escura para garantir a legibilidade nos PDFs gerados.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Contatos Section */}
                <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                  <h3 className={sectionTitleClasses}><AtSign size={18} className="text-nutri-blue" /> Canais de Contato</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { key: 'phone', label: 'Telefone', icon: <Phone size={16} />, placeholder: '(11) 98888-7777' },
                      { key: 'email', label: 'E-mail', icon: <AtSign size={16} />, placeholder: 'seu@email.com' },
                      { key: 'whatsapp', label: 'WhatsApp', icon: <Smartphone size={16} />, placeholder: '+55 11 98888-7777' },
                      { key: 'instagram', label: 'Instagram', icon: <Instagram size={16} />, placeholder: '@seu.perfil' },
                      { key: 'facebook', label: 'Facebook', icon: <Facebook size={16} />, placeholder: '/seu.perfil' },
                      { key: 'youtube', label: 'YouTube', icon: <Youtube size={16} />, placeholder: '@seu.canal' },
                      { key: 'tiktok', label: 'TikTok', icon: <div className="text-[10px] font-bold">TT</div>, placeholder: '@seu.tiktok' },
                    ].map((c) => (
                      <div key={c.key}>
                        <label className={labelClasses}>{c.label}</label>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-nutri-blue transition-colors">{c.icon}</div>
                          <input
                            type="text"
                            value={(profile.contacts as any)[c.key] || ''}
                            onChange={(e) => handleContactChange(c.key, e.target.value)}
                            placeholder={c.placeholder}
                            className={inputClasses + " pl-11"}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* --- ATENDIMENTO --- */}
            {activeSection === 'atendimento' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                {/* Locais Section */}
                <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                  <h3 className={sectionTitleClasses}><MapPin size={18} className="text-nutri-blue" /> Locais de Atendimento</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {['Online', 'Domiciliar', 'Consultório'].map(l => (
                      <label key={l} className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-white hover:border-nutri-blue/30 transition-all group">
                        <div className="w-5 h-5 rounded-md border-2 border-slate-200 flex items-center justify-center group-hover:border-nutri-blue transition-colors">
                          <input type="checkbox" className="hidden" defaultChecked />
                          <div className="w-2.5 h-2.5 bg-nutri-blue rounded-sm"></div>
                        </div>
                        <span className="text-sm font-bold text-slate-600">{l}</span>
                      </label>
                    ))}
                  </div>
                </section>

                {/* Tipos e Valores Section */}
                <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                  <h3 className={sectionTitleClasses}><DollarSign size={18} className="text-nutri-blue" /> Tipos e Valores de Consultas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { label: 'Primeira Consulta', val: '250,00' },
                      { label: 'Retorno', val: '180,00' },
                      { label: 'Acompanhamento Mensal', val: '220,00' },
                      { label: 'Avaliação Corporal', val: '150,00' },
                      { label: 'Laudo / Receitas', val: '80,00' },
                      { label: 'Outros', val: '100,00' },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <span className="text-sm font-bold text-slate-700">{s.label}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-slate-400">R$</span>
                          <input type="text" defaultValue={s.val} className="w-24 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-black text-right outline-none focus:ring-2 focus:ring-nutri-blue/20" />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Horários Section */}
                <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                  <h3 className={sectionTitleClasses}><Clock size={18} className="text-nutri-blue" /> Horários de Atendimento</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-5 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-800">Disponibilidade Total</h4>
                        <p className="text-xs text-slate-500">Atender em todos os dias da semana</p>
                      </div>
                      <button className="w-12 h-6 bg-slate-200 rounded-full relative transition-all"><div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div></button>
                    </div>
                    <div className="p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Definir dias e horários</p>
                      <div className="space-y-4">
                        {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'].map(dia => (
                          <div key={dia} className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-600 w-24">{dia}</span>
                            <div className="flex items-center gap-3">
                              <input type="time" defaultValue="09:00" className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold" />
                              <span className="text-slate-300">até</span>
                              <input type="time" defaultValue="18:00" className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-bold" />
                            </div>
                            <button className="w-10 h-5 bg-nutri-blue rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* --- GESTÃO --- */}
            {activeSection === 'gestao' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                  <h3 className={sectionTitleClasses}><Target size={18} className="text-nutri-blue" /> Definição de Metas Financeiras</h3>
                  <p className="text-sm text-slate-500 mb-8 max-w-lg">Estabeleça objetivos de faturamento para acompanhar o desempenho real vs planejado nos seus gráficos de gestão.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { label: 'Meta Semanal', val: '4.000' },
                      { label: 'Meta Mensal', val: '18.000' },
                      { label: 'Meta Trimestral', val: '50.000' },
                      { label: 'Meta Semestral', val: '100.000' },
                      { label: 'Meta Anual', val: '220.000' },
                    ].map((m, i) => (
                      <div key={i}>
                        <label className={labelClasses}>{m.label}</label>
                        <div className="relative group">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-xs">R$</div>
                          <input type="text" defaultValue={m.val} className={inputClasses + " pl-10 text-right font-black text-slate-800"} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* --- SISTEMA --- */}
            {activeSection === 'sistema' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                {/* Idioma Section */}
                <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                  <h3 className={sectionTitleClasses}><Globe size={18} className="text-nutri-blue" /> Localização e Idioma</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {['Português', 'Inglês', 'Espanhol'].map(lang => (
                      <button key={lang} className={`p-5 rounded-[24px] border transition-all text-center group ${lang === 'Português' ? 'bg-nutri-blue/5 border-nutri-blue shadow-sm' : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-slate-200'}`}>
                        <span className={`text-xs font-black uppercase tracking-widest ${lang === 'Português' ? 'text-nutri-blue' : 'text-slate-400 group-hover:text-slate-600'}`}>{lang}</span>
                      </button>
                    ))}
                  </div>
                </section>

                {/* Aparência Section */}
                <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm space-y-10">
                  <h3 className={sectionTitleClasses}><Palette size={18} className="text-nutri-blue" /> Aparência e Personalização</h3>

                  <div>
                    <label className={labelClasses + " flex items-center gap-2 mb-4"}><Palette size={14} /> Cores do Tema</label>
                    <div className="flex flex-wrap gap-3">
                      {['Verde', 'Azul', 'Vermelha', 'Rosa', 'Roxo', 'Preta', 'Cinza'].map(color => (
                        <button key={color} className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border transition-all ${color === 'Verde' ? 'border-nutri-blue bg-nutri-blue/5' : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200'}`}>
                          <div className={`w-3 h-3 rounded-full ${color === 'Verde' ? 'bg-[#84d1c1]' : color === 'Azul' ? 'bg-blue-500' : color === 'Vermelha' ? 'bg-red-500' : color === 'Rosa' ? 'bg-pink-500' : color === 'Roxo' ? 'bg-purple-500' : color === 'Preta' ? 'bg-slate-900' : 'bg-slate-400'}`}></div>
                          <span className={`text-[10px] font-black uppercase tracking-wider ${color === 'Verde' ? 'text-nutri-blue' : 'text-slate-500'}`}>{color}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4">
                    <div>
                      <label className={labelClasses + " flex items-center gap-2 mb-4"}><Monitor size={14} /> Modos de Exibição</label>
                      <div className="grid grid-cols-3 gap-3">
                        {['Diurno', 'Noturno', 'Sistema'].map(mode => (
                          <button key={mode} className={`px-4 py-3 rounded-2xl border text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'Diurno' ? 'bg-nutri-blue/5 border-nutri-blue text-nutri-blue shadow-sm' : 'bg-slate-50 border-slate-100 text-slate-400 hover:bg-white'}`}>
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className={labelClasses + " flex items-center gap-2 mb-4"}><Type size={14} /> Fontes da Interface</label>
                      <div className="grid grid-cols-2 gap-3">
                        <button className="px-4 py-3 bg-nutri-blue/5 border border-nutri-blue text-nutri-blue rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm">Tipo 1 (Inter)</button>
                        <button className="px-4 py-3 bg-slate-50 border border-slate-100 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white">Tipo 2 (Modern)</button>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {/* --- SEGURANÇA --- */}
            {activeSection === 'seguranca' && (
              <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
                <section className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
                  <h3 className={sectionTitleClasses}><Shield size={18} className="text-nutri-blue" /> Acesso e Segurança</h3>
                  <div className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label className={labelClasses}>Usuário / E-mail de Acesso</label><input type="email" defaultValue="leticia.rosa@nutridash.com" className={inputClasses} /></div>
                      <div className="flex items-end"><button className="text-[10px] font-black text-nutri-blue uppercase tracking-widest hover:underline px-2 mb-3">Alterar Usuário</button></div>
                    </div>
                    <div className="h-px bg-slate-50 w-full"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label className={labelClasses}>Senha Atual</label><input type="password" placeholder="••••••••" className={inputClasses} /></div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:col-span-2">
                        <div><label className={labelClasses}>Nova Senha</label><input type="password" placeholder="••••••••" className={inputClasses} /></div>
                        <div><label className={labelClasses}>Confirmar Nova Senha</label><input type="password" placeholder="••••••••" className={inputClasses} /></div>
                      </div>
                    </div>
                    <button className="px-8 py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-slate-200 hover:bg-black transition-all transform active:scale-95">Atualizar Senha</button>
                  </div>
                </section>
              </div>
            )}

            {/* Global Save Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-slate-900 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
              <div className="relative z-10">
                <h3 className="text-xl font-black tracking-tight mb-1">Deseja salvar todas as alterações?</h3>
                <p className="text-xs text-slate-400 font-medium">Suas preferências serão aplicadas instantaneamente em toda a plataforma.</p>
              </div>
              <button
                onClick={handleSave}
                disabled={saving}
                className="relative z-10 flex items-center gap-3 px-12 py-4 bg-nutri-blue text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-2xl shadow-nutri-blue/30 hover:bg-nutri-blue-hover hover:scale-105 transition-all active:scale-95 group-hover:animate-pulse disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                {saving ? 'Salvando...' : 'Salvar Tudo'}
              </button>
              <div className="absolute top-0 right-0 w-64 h-64 bg-nutri-blue/10 rounded-full -mr-32 -mt-32 blur-[80px]"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full -ml-16 -mb-16 blur-[60px]"></div>
            </div>

          </>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
