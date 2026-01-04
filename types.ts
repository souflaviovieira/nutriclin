
export interface Appointment {
  id: string;
  patientName: string;
  patientId?: string;
  date: string; 
  time: string;
  type: 'Primeira Consulta' | 'Retorno' | 'Check-in' | 'Avaliação' | string;
  status: 'Confirmado' | 'Pendente' | 'Cancelado' | 'Realizada';
  price: number;
}

export interface Metric {
  label: string;
  value: string;
  trend: number;
  icon: string;
  color: string;
}

export interface Alert {
  id: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  date: string;
}

export interface ConsultationRecord {
  id: string;
  date: string;
  anamnese?: any;
  medicoes?: any;
  bioimpedancia?: any;
  exames?: any;
  observacoes?: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  objective: string;
  lastConsultation: string;
  email: string;
  phone: string;
  avatar?: string;
  cpf?: string;
  birth_date?: string;
  gender?: string;
  profession?: string;
  address?: {
    cep: string;
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  history?: ConsultationRecord[];
}
