
import React, { useState, useEffect } from 'react';
import { Search, Plus, MoreVertical, FileText, Calendar, Edit2, Phone, Mail, User, ChevronRight } from 'lucide-react';
import { MOCK_PATIENTS } from '../constants';
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
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    if (activeMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [activeMenu]);

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
        // Map DB fields to component interface
        const mappedData = data.map((p: any) => ({
          id: p.id,
          name: p.name,
          email: p.email || '',
          phone: p.phone || '',
          age: p.birth_date ? calculateAge(p.birth_date) : 0,
          objective: p.objective || 'Saúde Geral',
          lastConsultation: p.last_consultation || 'Nunca',
          avatar: p.avatar,
          cpf: p.cpf,
          birth_date: p.birth_date,
          gender: p.gender,
          profession: p.profession,
        }));
        setPatients(mappedData);
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

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone?.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <LoadingSpinner size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6 animate-in fade-in duration-500">
      {/* Search Bar - Mobile Optimized */}
      <div className="sticky top-0 z-20 -mx-4 px-4 lg:mx-0 lg:px-0 py-2 lg:py-0 bg-white lg:bg-transparent">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 lg:gap-4 bg-white lg:bg-white p-3 lg:p-6 rounded-xl lg:rounded-2xl border border-slate-100 lg:shadow-sm">
          <div className="relative flex-1 group">
            <Search size={18} className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-nutri-blue transition-colors" />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 lg:pl-12 pr-4 py-3 lg:py-2.5 bg-slate-50 border-2 border-transparent focus:border-nutri-blue focus:bg-white rounded-xl outline-none transition-all text-sm text-slate-700"
            />
          </div>
          {/* Desktop only add button */}
          <button
            onClick={onAddPatient}
            className="hidden lg:flex items-center justify-center gap-2 px-6 py-2.5 bg-nutri-blue text-white rounded-xl font-bold shadow-lg shadow-nutri-blue/20 hover:bg-nutri-blue-hover transition-all"
          >
            <Plus size={18} /> Novo Cliente
          </button>
        </div>
      </div>

      {/* Patient Count */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          {filteredPatients.length} {filteredPatients.length === 1 ? 'cliente' : 'clientes'}
        </span>
      </div>

      {/* Patient List - Mobile Cards */}
      <div className="space-y-3 lg:grid lg:grid-cols-2 xl:grid-cols-3 lg:gap-6 lg:space-y-0">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className="bg-white rounded-xl lg:rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group overflow-hidden"
          >
            {/* Main Content - Clickable */}
            <div 
              className="p-4 lg:p-6 cursor-pointer active:bg-slate-50 transition-colors"
              onClick={() => onViewPatient(patient.id)}
            >
              <div className="flex items-center gap-3 lg:gap-4">
                {/* Avatar */}
                <img
                  src={patient.avatar || `https://i.pravatar.cc/150?u=${patient.id}`}
                  alt={patient.name}
                  className="w-12 h-12 lg:w-14 lg:h-14 rounded-full lg:rounded-xl object-cover ring-2 ring-nutri-blue/10 flex-shrink-0"
                />
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 group-hover:text-nutri-blue transition-colors truncate">
                    {patient.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {patient.age > 0 && `${patient.age} anos • `}{patient.objective}
                  </p>
                  
                  {/* Mobile: Show phone inline */}
                  <p className="text-xs text-slate-400 mt-1 lg:hidden flex items-center gap-1.5">
                    <Phone size={12} />
                    {patient.phone || 'Sem telefone'}
                  </p>
                </div>

                {/* Desktop Menu Button */}
                <div className="hidden lg:block relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenu(activeMenu === patient.id ? null : patient.id);
                    }}
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <MoreVertical size={18} />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {activeMenu === patient.id && (
                    <div 
                      className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-20 p-2 animate-in fade-in slide-in-from-top-2 duration-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => { onViewPatient(patient.id); setActiveMenu(null); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <FileText size={16} /> Ver Perfil
                      </button>
                      <button
                        onClick={() => { onNewAppointment(patient.id); setActiveMenu(null); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <Calendar size={16} /> Agendar
                      </button>
                      <button
                        onClick={() => { onEditPatient(patient.id); setActiveMenu(null); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={16} /> Editar
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile Arrow */}
                <ChevronRight size={20} className="lg:hidden text-slate-300 flex-shrink-0" />
              </div>

              {/* Desktop Additional Info */}
              <div className="hidden lg:block space-y-2 pt-4 mt-4 border-t border-slate-50">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <Mail size={14} className="text-slate-300" />
                  <span className="truncate">{patient.email || 'Sem e-mail'}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <Phone size={14} className="text-slate-300" />
                  {patient.phone || 'Sem telefone'}
                </div>
              </div>
            </div>

            {/* Mobile Quick Actions */}
            <div className="lg:hidden flex border-t border-slate-100">
              <button
                onClick={(e) => { e.stopPropagation(); onNewAppointment(patient.id); }}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold text-nutri-blue hover:bg-nutri-blue/5 active:bg-nutri-blue/10 transition-colors"
              >
                <Calendar size={14} /> Agendar
              </button>
              <div className="w-px bg-slate-100" />
              <button
                onClick={(e) => { e.stopPropagation(); onEditPatient(patient.id); }}
                className="flex-1 flex items-center justify-center gap-2 py-3 text-xs font-bold text-slate-500 hover:bg-slate-50 active:bg-slate-100 transition-colors"
              >
                <Edit2 size={14} /> Editar
              </button>
            </div>

            {/* Last Consultation - Desktop Only */}
            <div className="hidden lg:flex bg-slate-50 px-6 py-3 items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Última Consulta</span>
              <span className="text-xs font-bold text-slate-600">{patient.lastConsultation || 'Nunca'}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredPatients.length === 0 && (
        <div className="bg-white p-8 lg:p-12 rounded-2xl border border-slate-100 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
            <User size={32} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800">Nenhum cliente encontrado</h3>
            <p className="text-slate-500 text-sm mt-1">
              {searchTerm 
                ? 'Tente ajustar os termos da busca.' 
                : 'Cadastre seu primeiro cliente para começar.'}
            </p>
          </div>
          <button
            onClick={onAddPatient}
            className="inline-flex items-center gap-2 px-6 py-3 bg-nutri-blue text-white rounded-xl font-bold text-sm hover:bg-nutri-blue-hover transition-all"
          >
            <Plus size={18} /> Cadastrar Cliente
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientList;
