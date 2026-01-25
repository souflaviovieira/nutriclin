
import React, { useState } from 'react';
import { X, Camera, Save, User, Smartphone, Mail, MapPin, Calendar, CheckCircle2, Loader2 } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { storageService } from '../services/storageService';
import { Patient } from '../types';
import LoadingSpinner from './ui/LoadingSpinner';
import Input from './ui/Input';
import Card from './ui/Card';
import Button from './ui/Button';

interface PatientFormProps {
  onCancel: () => void;
  onSave: (data: any, andSchedule?: boolean) => void;
  initialData?: Patient | null;
}

const PatientForm: React.FC<PatientFormProps> = ({ onCancel, onSave, initialData }) => {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [patientData, setPatientData] = useState({
    name: initialData?.name || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    birthDate: initialData?.birth_date || '',
    gender: initialData?.gender || '',
    profession: initialData?.profession || '',
    cpf: initialData?.cpf || '',
    objective: initialData?.objective || '',
    avatar: initialData?.avatar || '',
    address: {
      zip: (initialData?.address_json as any)?.zip || '',
      street: (initialData?.address_json as any)?.street || '',
      number: (initialData?.address_json as any)?.number || '',
      complement: (initialData?.address_json as any)?.complement || '',
      neighborhood: (initialData?.address_json as any)?.neighborhood || '',
      city: (initialData?.address_json as any)?.city || '',
      state: (initialData?.address_json as any)?.state || ''
    }
  });

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);
      const compressed = await storageService.compressImage(file);
      const fileName = `patient-${Date.now()}.webp`;
      const publicUrl = await storageService.uploadFile(compressed, {
        bucket: 'nutriclin-media',
        path: `patients/${fileName}`,
        oldPath: patientData.avatar || undefined
      });

      setPatientData({ ...patientData, avatar: publicUrl });
    } catch (err: any) {
      console.error(err);
      alert("Erro ao subir foto: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e?: React.FormEvent, andSchedule = false) => {
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const payload = {
        user_id: user.id,
        name: patientData.name,
        email: patientData.email,
        phone: patientData.phone,
        birth_date: patientData.birthDate || null,
        gender: patientData.gender,
        profession: patientData.profession,
        cpf: patientData.cpf,
        objective: patientData.objective,
        avatar: patientData.avatar,
        address_json: patientData.address,
        updated_at: new Date().toISOString()
      };

      let error;
      let resultData;

      if (initialData?.id) {
        const { error: err, data } = await supabase
          .from('patients')
          .update(payload)
          .eq('id', initialData.id)
          .select()
          .single();
        error = err;
        resultData = data;
      } else {
        const { error: err, data } = await supabase
          .from('patients')
          .insert([{ ...payload, last_consultation: null }])
          .select()
          .single();
        error = err;
        resultData = data;
      }

      if (error) throw error;

      setShowSuccess(true);
      setTimeout(() => onSave(resultData, andSchedule), 1500);
    } catch (err: any) {
      console.error("Erro ao salvar paciente:", err);
      alert(`Erro ao salvar: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name in patientData.address) {
      setPatientData(prev => ({
        ...prev,
        address: { ...prev.address, [name]: value }
      }));
    } else {
      setPatientData(prev => ({ ...prev, [name]: value }));
    }
  };

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in duration-300">
        <div className="w-20 h-20 bg-coral-100 text-coral-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Dados Salvos!</h2>
        <p className="text-slate-500 mt-2">As informações do paciente foram atualizadas com sucesso.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      <Card noPadding className="p-0 overflow-hidden">
        <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <button onClick={onCancel} className="flex items-center gap-2 text-slate-500 hover:text-coral-500 transition-colors text-xs font-bold uppercase tracking-widest mb-2">
              <X size={16} /> Voltar
            </button>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{initialData ? 'Editar Paciente' : 'Novo Cadastro'}</h1>
            <p className="text-slate-500 text-sm mt-1">Insira as informações básicas e de contato.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={onCancel}>Cancelar</Button>
            <Button
              variant="primary"
              onClick={() => handleSave()}
              disabled={loading}
              icon={!loading && <Save size={18} />}
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Salvar'}
            </Button>
          </div>
        </div>
      </Card>

      <form onSubmit={(e) => handleSave(e)} className="space-y-6">
        <Card noPadding className="overflow-hidden">
          <div className="p-6 border-b border-cream-100 flex items-center gap-3 bg-cream-50/30">
            <User size={20} className="text-coral-500" />
            <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wider">Identificação e Perfil</h2>
          </div>
          <div className="p-6 space-y-8">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                <input
                  type="file"
                  id="patient-photo"
                  className="hidden"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  disabled={loading}
                />
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-3xl bg-cream-100 border-4 border-white shadow-soft-lg overflow-hidden flex items-center justify-center relative">
                  {patientData.avatar ? (
                    <img src={patientData.avatar} alt="Patient" className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} className="text-cream-400" />
                  )}
                  {loading && (
                    <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
                      <Loader2 size={24} className="animate-spin text-coral-500" />
                    </div>
                  )}
                </div>
                <label htmlFor="patient-photo" className="absolute -right-2 -bottom-2 w-10 h-10 bg-coral-500 text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-coral-600 transition-all cursor-pointer hover:scale-110 active:scale-95">
                  <Camera size={20} />
                </label>
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h4 className="font-bold text-slate-800">Foto do Paciente</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Upload de imagem para acompanhamento de evolução.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="md:col-span-2 lg:col-span-2">
                <Input label="Nome Completo *" name="name" value={patientData.name} onChange={handleChange} required />
              </div>
              <div>
                <Input label="CPF *" name="cpf" value={patientData.cpf} onChange={handleChange} required />
              </div>
              <div>
                <Input label="Data de Nascimento *" name="birthDate" value={patientData.birthDate} onChange={handleChange} type="date" required />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Gênero</label>
                <div className="relative">
                  <select name="gender" value={patientData.gender} onChange={handleChange} className="w-full bg-cream-50 border border-cream-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-slate-800 outline-none focus:ring-4 focus:ring-coral-100 focus:border-coral-400 transition-all appearance-none">
                    <option value="">Selecione...</option>
                    <option value="feminino">Feminino</option>
                    <option value="masculino">Masculino</option>
                    <option value="outro">Outro</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">▼</div>
                </div>
              </div>
              <div>
                <Input label="Objetivo Principal" name="objective" value={patientData.objective} onChange={handleChange} />
              </div>
            </div>
          </div>
        </Card>

        <Card noPadding className="overflow-hidden">
          <div className="p-6 border-b border-cream-100 flex items-center gap-3 bg-cream-50/30">
            <Mail size={20} className="text-blue-500" />
            <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wider">Contato</h2>
          </div>
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="E-mail *" name="email" value={patientData.email} onChange={handleChange} type="email" required />
            <Input label="Celular / WhatsApp *" name="phone" value={patientData.phone} onChange={handleChange} type="tel" required />
          </div>
        </Card>

        <Card noPadding className="overflow-hidden">
          <div className="p-6 border-b border-cream-100 flex items-center gap-3 bg-cream-50/30">
            <MapPin size={20} className="text-amber-500" />
            <h2 className="text-lg font-bold text-slate-800 uppercase tracking-wider">Endereço</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Input label="CEP" name="zip" value={patientData.address.zip} onChange={handleChange} />
              <div className="sm:col-span-2">
                <Input label="Rua" name="street" value={patientData.address.street} onChange={handleChange} />
              </div>
              <Input label="Número" name="number" value={patientData.address.number} onChange={handleChange} />
              <Input label="Cidade" name="city" value={patientData.address.city} onChange={handleChange} />
              <Input label="Estado" name="state" value={patientData.address.state} onChange={handleChange} />
            </div>
          </div>
        </Card>

        <div className="flex justify-end pt-4 pb-8">
          <Button
            variant="primary"
            onClick={() => handleSave(undefined, true)}
            disabled={loading}
            size="lg"
            icon={!loading && <Calendar size={20} />}
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : 'Salvar e Agendar'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;
