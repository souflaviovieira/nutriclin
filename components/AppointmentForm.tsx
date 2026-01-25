
import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  UserPlus,
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  CheckCircle2,
  X,
  ChevronRight,
  User,
  CreditCard,
  FileText,
  AlertTriangle,
  Zap,
  TrendingUp
} from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import { Patient, Appointment } from '../types';
import { MOCK_PATIENTS, MOCK_APPOINTMENTS, APPOINTMENT_PRICES } from '../constants';
import LoadingSpinner from './ui/LoadingSpinner';

interface AppointmentFormProps {
  onCancel: () => void;
  onSave: (appointmentData: any) => void;
  initialPatientId?: string | null;
  initialDate?: string;
  initialTime?: string;
}

const AppointmentForm: React.FC<AppointmentFormProps> = ({
  onCancel,
  onSave,
  initialPatientId,
  initialDate,
  initialTime
}) => {
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [existingAppointments, setExistingAppointments] = useState<Appointment[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isNewPatient, setIsNewPatient] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form States
  const [appointmentData, setAppointmentData] = useState({
    date: initialDate || new Date().toISOString().split('T')[0],
    time: initialTime || '09:00',
    type: 'Primeira Consulta',
    price: APPOINTMENT_PRICES['Primeira Consulta'],
    paymentMethod: 'PIX',
    status: 'Confirmado',
    notes: ''
  });

  const [newPatientData, setNewPatientData] = useState({
    name: '',
    phone: '',
    email: ''
  });

  useEffect(() => {
    fetchPatients();
    fetchExistingAppointments();
  }, []);

  useEffect(() => {
    if (initialPatientId && patients.length > 0) {
      const p = patients.find(p => p.id === initialPatientId);
      if (p) setSelectedPatient(p);
    }
  }, [initialPatientId, patients]);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase.from('patients').select('*');
      if (error || !data || data.length === 0) {
        setPatients(MOCK_PATIENTS);
      } else {
        setPatients(data as Patient[]);
      }
    } catch (err) {
      setPatients(MOCK_PATIENTS);
    }
  };

  const fetchExistingAppointments = async () => {
    try {
      const { data, error } = await supabase.from('appointments').select('*');
      if (error || !data || data.length === 0) {
        setExistingAppointments(MOCK_APPOINTMENTS as unknown as Appointment[]);
      } else {
        setExistingAppointments(data as unknown as Appointment[]);
      }
    } catch (err) {
      setExistingAppointments(MOCK_APPOINTMENTS as unknown as Appointment[]);
    }
  };

  // Preenchimento automático do valor conforme tipo
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    setAppointmentData({
      ...appointmentData,
      type: newType,
      price: APPOINTMENT_PRICES[newType] || '200'
    });
  };

  // Sugestão de horários livres
  const freeSlots = useMemo(() => {
    const hours = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00'];
    const taken = existingAppointments
      .filter(app => app.date === appointmentData.date)
      .map(app => app.time);

    return hours.filter(h => !taken.includes(h)).slice(0, 5); // Sugere os primeiros 5 livres
  }, [appointmentData.date, existingAppointments]);

  // Destaque visual para conflitos de horário
  const hasConflict = useMemo(() => {
    return existingAppointments.some(
      app => app.date === appointmentData.date && app.time === appointmentData.time
    );
  }, [appointmentData.date, appointmentData.time, existingAppointments]);

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.phone.includes(searchTerm)
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasConflict) return;
    setLoading(true);

    try {
      let patientId = selectedPatient?.id;

      if (isNewPatient) {
        const { data: pData, error: pError } = await supabase
          .from('patients')
          .insert([{
            name: newPatientData.name,
            phone: newPatientData.phone,
            email: newPatientData.email,
            objective: 'A definir',
            last_consultation: new Date().toLocaleDateString('pt-BR')
          }])
          .select();

        if (!pError && pData) patientId = pData[0].id;
      }

      const { error: aError } = await supabase
        .from('appointments')
        .insert([{
          patient_id: patientId,
          patient_name: isNewPatient ? newPatientData.name : selectedPatient?.name,
          date: appointmentData.date,
          time: appointmentData.time,
          type: appointmentData.type,
          price: parseFloat(appointmentData.price),
          status: appointmentData.status,
          payment_method: appointmentData.paymentMethod,
          notes: appointmentData.notes
        }]);

      setShowSuccess(true);
      setTimeout(() => {
        onSave({ ...appointmentData, patientId });
      }, 2000);

    } catch (err) {
      console.error(err);
      setShowSuccess(true);
      setTimeout(() => onSave(appointmentData), 2000);
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "w-full px-4 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-xl focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 outline-none transition-all placeholder:text-slate-400 font-medium text-sm";
  const labelClasses = "block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1";

  if (showSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-in zoom-in duration-300 text-center">
        <div className="w-20 h-20 bg-coral-100 text-coral-600 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Consulta Agendada!</h2>
        <p className="text-slate-500 mt-2 max-w-sm">A agenda foi atualizada e o valor de <b>R$ {appointmentData.price}</b> já foi provisionado no seu Financeiro.</p>
        <div className="mt-8 flex items-center gap-2 text-emerald-600 bg-coral-50 px-4 py-2 rounded-full text-xs font-bold animate-pulse">
          <TrendingUp size={14} /> Sincronização financeira ativa
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onCancel} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 hover:text-emerald-600 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-800">Novo Agendamento</h1>
            <p className="text-xs text-slate-500">Reservar horário e provisionar faturamento.</p>
          </div>
        </div>
        <button onClick={onCancel} className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Step 1: Patient Selection */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-50 bg-slate-50/30 flex items-center gap-2">
            <User size={18} className="text-coral-500" />
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Passo 1: Identificar Paciente</h2>
          </div>

          <div className="p-6 space-y-4">
            {!selectedPatient && !isNewPatient ? (
              <div className="space-y-4">
                <div className="relative group">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-coral-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="Buscar por nome ou telefone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={inputClasses + " pl-12"}
                  />
                </div>

                <div className="max-h-48 overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-50">
                  {searchTerm.length > 0 && filteredPatients.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedPatient(p)}
                      className="w-full flex items-center justify-between p-3 hover:bg-coral-50 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-600">
                          {p.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-700">{p.name}</p>
                          <p className="text-[10px] text-slate-400">{p.phone}</p>
                        </div>
                      </div>
                      <ChevronRight size={16} className="text-slate-300" />
                    </button>
                  ))}
                  {searchTerm.length > 0 && filteredPatients.length === 0 && (
                    <div className="p-8 text-center">
                      <p className="text-sm text-slate-400 italic">Nenhum paciente encontrado.</p>
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setIsNewPatient(true)}
                    className="w-full py-3 border-2 border-dashed border-slate-100 rounded-xl text-slate-400 hover:text-emerald-600 hover:border-emerald-200 hover:bg-coral-50/50 transition-all text-sm font-bold flex items-center justify-center gap-2"
                  >
                    <UserPlus size={18} /> Cadastrar Novo Paciente
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-coral-50 border border-emerald-100 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-coral-600 text-white flex items-center justify-center font-bold">
                    {(selectedPatient?.name || newPatientData.name || 'P').charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-900">{isNewPatient ? newPatientData.name || 'Novo Paciente' : selectedPatient?.name}</h3>
                    <p className="text-xs text-emerald-600 font-medium">{isNewPatient ? 'Cadastro Rápido' : 'Paciente Existente'}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedPatient(null); setIsNewPatient(false); }}
                  className="text-xs font-bold text-coral-700 hover:underline"
                >
                  Alterar
                </button>
              </div>
            )}

            {isNewPatient && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                <div className="md:col-span-2">
                  <label className={labelClasses}>Nome Completo *</label>
                  <input
                    type="text"
                    required
                    value={newPatientData.name}
                    onChange={(e) => setNewPatientData({ ...newPatientData, name: e.target.value })}
                    className={inputClasses}
                    placeholder="Ex: João da Silva"
                  />
                </div>
                <div>
                  <label className={labelClasses}>Telefone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={newPatientData.phone}
                    onChange={(e) => setNewPatientData({ ...newPatientData, phone: e.target.value })}
                    className={inputClasses}
                    placeholder="(00) 00000-0000"
                  />
                </div>
                <div>
                  <label className={labelClasses}>E-mail (Opcional)</label>
                  <input
                    type="email"
                    value={newPatientData.email}
                    onChange={(e) => setNewPatientData({ ...newPatientData, email: e.target.value })}
                    className={inputClasses}
                    placeholder="email@exemplo.com"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Step 2: Appointment Details */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon size={18} className="text-blue-500" />
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Passo 2: Horário e Valores</h2>
            </div>
            {hasConflict && (
              <div className="flex items-center gap-1 text-rose-600 font-bold text-[10px] animate-pulse bg-rose-50 px-2 py-1 rounded-lg border border-rose-100">
                <AlertTriangle size={12} /> CONFLITO DE HORÁRIO
              </div>
            )}
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Data da Consulta *</label>
                <div className="relative">
                  <CalendarIcon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={appointmentData.date}
                    onChange={(e) => setAppointmentData({ ...appointmentData, date: e.target.value })}
                    className={inputClasses + " pl-11"}
                  />
                </div>
              </div>
              <div>
                <label className={labelClasses}>Horário *</label>
                <div className="relative">
                  <Clock size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 ${hasConflict ? 'text-rose-500' : 'text-slate-400'}`} />
                  <input
                    type="time"
                    required
                    value={appointmentData.time}
                    onChange={(e) => setAppointmentData({ ...appointmentData, time: e.target.value })}
                    className={`${inputClasses} pl-11 ${hasConflict ? 'border-rose-500 bg-rose-50/30' : ''}`}
                  />
                </div>

                {/* Sugestões de horários */}
                <div className="mt-3">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-2">
                    <Zap size={10} className="text-amber-500" /> Sugestões para o dia
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {freeSlots.map(slot => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setAppointmentData({ ...appointmentData, time: slot })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${appointmentData.time === slot
                          ? 'bg-coral-600 text-white border-emerald-600'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-500 hover:text-emerald-600'
                          }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className={labelClasses}>Tipo de Atendimento *</label>
                <select
                  required
                  value={appointmentData.type}
                  onChange={handleTypeChange}
                  className={inputClasses}
                >
                  {Object.keys(APPOINTMENT_PRICES).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClasses}>Valor Provisionado (R$)</label>
                <div className="relative">
                  <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-coral-500" />
                  <input
                    type="number"
                    required
                    value={appointmentData.price}
                    onChange={(e) => setAppointmentData({ ...appointmentData, price: e.target.value })}
                    className={inputClasses + " pl-11 text-right font-bold text-coral-700 bg-coral-50/30 border-emerald-100"}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5 ml-1 italic">* Valor será adicionado às previsões financeiras.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Método de Pagamento</label>
                <div className="relative">
                  <CreditCard size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={appointmentData.paymentMethod}
                    onChange={(e) => setAppointmentData({ ...appointmentData, paymentMethod: e.target.value })}
                    className={inputClasses + " pl-11"}
                  >
                    <option>PIX</option>
                    <option>Cartão de Crédito</option>
                    <option>Cartão de Débito</option>
                    <option>Dinheiro</option>
                    <option>Convênio</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClasses}>Status Inicial</label>
                <select
                  value={appointmentData.status}
                  onChange={(e) => setAppointmentData({ ...appointmentData, status: e.target.value })}
                  className={inputClasses}
                >
                  <option>Agendado</option>
                  <option>Confirmado</option>
                  <option>Realizado</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClasses}>Observações Rápidas</label>
              <div className="relative">
                <FileText size={16} className="absolute left-4 top-3 text-slate-400" />
                <textarea
                  rows={3}
                  value={appointmentData.notes}
                  onChange={(e) => setAppointmentData({ ...appointmentData, notes: e.target.value })}
                  className={inputClasses + " pl-11 pt-3 resize-none"}
                  placeholder="Ex: Paciente com foco em perda de peso, trazer exames..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || (!selectedPatient && !newPatientData.name) || hasConflict}
            className="flex-[2] px-6 py-4 bg-coral-600 text-white font-bold rounded-2xl shadow-xl shadow-emerald-100 hover:bg-coral-700 transition-all flex items-center justify-center gap-3 disabled:bg-slate-300 disabled:shadow-none"
          >
            {loading ? <LoadingSpinner size={20} color="white" /> : <CheckCircle2 size={20} />}
            Confirmar e Provisionar
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppointmentForm;
