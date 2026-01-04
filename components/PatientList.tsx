
import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, FileText, Calendar, Edit2, Phone, Mail, User } from 'lucide-react';
import { MOCK_PATIENTS } from '../constants'; // Keeping as fallback
import { Patient } from '../types';
import { supabase } from '../services/supabaseClient';
import LoadingSpinner from './ui/LoadingSpinner';

interface PatientListProps {
  onAddPatient: () => void;
  onViewPatient: (patientId: string) => void;
  onNewAppointment: (patientId: string) => void;
  onEditPatient: (patientId: string) => void;
}

const PatientList: React.FC<PatientListProps> = ({
  onAddPatient,
  onViewPatient,
  onNewAppointment,
  onEditPatient
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('name');

      if (error) {
        console.warn("Supabase table 'patients' might not exist. Using mock data.", error);
        setPatients(MOCK_PATIENTS);
      } else if (data && data.length > 0) {
        // Map DB fields to component interface if needed
        setPatients(data as Patient[]);
      } else {
        setPatients(MOCK_PATIENTS);
      }
    } catch (err) {
      console.error(err);
      setPatients(MOCK_PATIENTS);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96 group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-nutri-blue transition-colors" />
          <input
            type="text"
            placeholder="Buscar por nome, e-mail ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-2 border-transparent focus:border-nutri-blue focus:bg-white rounded-xl outline-none transition-all text-sm text-slate-700"
          />
        </div>
        <button
          onClick={onAddPatient}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-nutri-blue text-white rounded-xl font-bold shadow-lg shadow-nutri-blue/20 hover:bg-nutri-blue-hover transition-all"
        >
          <Plus size={18} /> Novo Paciente
        </button>
      </div>

      {/* Grid of Patients */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => onViewPatient(patient.id)}
                >
                  <img
                    src={patient.avatar || `https://i.pravatar.cc/150?u=${patient.id}`}
                    alt={patient.name}
                    className="w-12 h-12 rounded-xl object-cover ring-2 ring-emerald-50 group-hover:ring-emerald-200 transition-all"
                  />
                  <div>
                    <h3 className="font-bold text-slate-800 group-hover:text-nutri-blue transition-colors">{patient.name}</h3>
                    <p className="text-xs text-slate-500">{patient.age} anos • {patient.objective}</p>
                  </div>
                </div>
                <div className="relative group/menu">
                  <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                    <MoreVertical size={18} />
                  </button>
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-10 p-2">
                    <button
                      onClick={() => onViewPatient(patient.id)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <FileText size={16} /> Ver Prontuário
                    </button>
                    <button
                      onClick={() => onNewAppointment(patient.id)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <Calendar size={16} /> Nova Consulta
                    </button>
                    <button
                      onClick={() => onEditPatient(patient.id)}
                      className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={16} /> Editar Dados
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <Mail size={14} className="text-slate-300" />
                  {patient.email}
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <Phone size={14} className="text-slate-300" />
                  {patient.phone}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 px-6 py-3 flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Última Consulta</span>
              <span className="text-xs font-bold text-slate-600">{patient.lastConsultation}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="bg-white p-12 rounded-2xl border border-slate-100 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
            <User size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Nenhum paciente encontrado</h3>
            <p className="text-slate-500">Tente ajustar os termos da busca ou cadastre um novo paciente.</p>
          </div>
          <button
            onClick={onAddPatient}
            className="text-nutri-blue font-bold hover:underline"
          >
            Cadastrar primeiro paciente
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientList;
