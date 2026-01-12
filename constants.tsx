
import React from 'react';
import {
  Users,
  Calendar,
  Briefcase,
  DollarSign,
  Bell,
  TrendingUp,
  Clipboard,
  Settings,
  LayoutDashboard,
  LogOut,
  Sparkles,
  Home,
  UserCircle,
  BarChart3,
  Apple,
  CookingPot,
  Scale,
  ClipboardPlus,
  Zap,
  X,
  FileText
} from 'lucide-react';
import { Appointment, Metric, Alert, Patient } from './types';

export const NAV_ITEMS = [
  { 
    items: [
      { id: 'dashboard', label: 'Minha Clínica', icon: <Home size={20} /> }
    ]
  },
  {
    title: 'GESTÃO',
    items: [
      { id: 'appointments', label: 'Agenda', icon: <Calendar size={20} /> },
      { id: 'patients', label: 'Clientes', icon: <UserCircle size={20} /> },
      { id: 'billing', label: 'Relatórios', icon: <BarChart3 size={20} /> },
    ]
  },
  {
    title: 'PLANO ALIMENTAR',
    items: [
      { id: 'alimentos', label: 'Alimentos', icon: <Apple size={20} /> },
      { id: 'alimentos-suplementos', label: 'Suplementos', icon: <Zap size={20} /> },
      { id: 'receitas-comunidade', label: 'Receitas (Comunidade)', icon: <Users size={20} /> },
      { id: 'receitas-minhas', label: 'Minhas Receitas', icon: <UserCircle size={20} /> },
      { id: 'substituicoes', label: 'Substituições', icon: <Scale size={20} /> },
      { id: 'modelos-planos', label: 'Modelos de Planos', icon: <ClipboardPlus size={20} /> },
      { id: 'modelos-evitar', label: 'Alimentos a Evitar', icon: <X size={20} /> },
      { id: 'modelos-recomendacoes', label: 'Recomendações', icon: <FileText size={20} /> },
    ]
  },
  {
    title: 'CONFIGURAÇÕES',
    items: [
      { id: 'settings-profissional', label: 'Profissional', icon: <UserCircle size={20} /> },
      { id: 'settings-atendimento', label: 'Atendimento', icon: <Clock size={20} /> },
      { id: 'settings-gestao', label: 'Gestão', icon: <Target size={20} /> },
      { id: 'settings-sistema', label: 'Sistema', icon: <Settings size={20} /> },
      { id: 'settings-seguranca', label: 'Segurança', icon: <Shield size={20} /> },
    ]
  },
  {
    items: [
       { id: 'ai-assistant', label: 'Nutri AI', icon: <Sparkles size={20} /> }
    ]
  }
];

export const APPOINTMENT_PRICES: Record<string, string> = {
  'Primeira Consulta': '250',
  'Retorno': '180',
  'Acompanhamento Mensal': '220',
  'Avaliação Corporal': '150',
  'Outro': '100'
};

export const MOCK_METRICS: Metric[] = [
  { label: 'Pacientes Ativos', value: '124', trend: 12, icon: 'Users', color: 'bg-nutri-blue/10 text-nutri-blue border-nutri-blue/10' },
  { label: 'Faturamento Mensal', value: 'R$ 15.420', trend: 8.5, icon: 'DollarSign', color: 'bg-nutri-blue/10 text-nutri-blue border-nutri-blue/10' },
  { label: 'Consultas este Mês', value: '42', trend: -2.1, icon: 'Calendar', color: 'bg-nutri-blue/10 text-nutri-blue border-nutri-blue/10' },
  { label: 'Taxa de Fidelização', value: '88%', trend: 5, icon: 'TrendingUp', color: 'bg-nutri-blue/10 text-nutri-blue border-nutri-blue/10' },
];

export const MOCK_APPOINTMENTS: Appointment[] = [
  { id: '1', patientName: 'Ana Maria Silva', date: '2024-03-20', time: '09:00', type: 'Primeira Consulta', status: 'Confirmado', price: 250 },
  { id: '2', patientName: 'Ricardo Santos', date: '2024-03-20', time: '10:30', type: 'Retorno', status: 'Confirmado', price: 180 },
  { id: '3', patientName: 'Beatriz Oliveira', date: '2024-03-20', time: '14:00', type: 'Check-in', status: 'Pendente', price: 100 },
  { id: '4', patientName: 'Marcos Pereira', date: '2024-03-20', time: '16:00', type: 'Retorno', status: 'Confirmado', price: 180 },
  { id: '5', patientName: 'Juliana Costa', date: '2024-03-21', time: '08:30', type: 'Primeira Consulta', status: 'Confirmado', price: 250 },
  { id: '6', patientName: 'Lucas Lima', date: '2024-03-21', time: '11:00', type: 'Avaliação', status: 'Confirmado', price: 300 },
];

export const MOCK_ALERTS: Alert[] = [
  { id: '1', message: 'Plano alimentar de João expira em 2 dias', severity: 'high', date: 'Hoje' },
  { id: '2', message: '3 novos pacientes aguardando confirmação', severity: 'medium', date: 'Há 2h' },
  { id: '3', message: 'Feedback mensal disponível: Beatriz Oliveira', severity: 'low', date: 'Ontem' },
];

export const REVENUE_DATA_SETS: Record<string, any[]> = {
  '7d': [
    { name: 'Seg', value: 800 },
    { name: 'Ter', value: 1200 },
    { name: 'Qua', value: 900 },
    { name: 'Qui', value: 1500 },
    { name: 'Sex', value: 1100 },
    { name: 'Sáb', value: 400 },
    { name: 'Dom', value: 200 },
  ],
  '30d': [
    { name: 'Sem 1', value: 3200 },
    { name: 'Sem 2', value: 3800 },
    { name: 'Sem 3', value: 3500 },
    { name: 'Sem 4', value: 4920 },
  ],
  '3m': [
    { name: 'Jan', value: 12000 },
    { name: 'Fev', value: 13500 },
    { name: 'Mar', value: 15420 },
  ],
  '6m': [
    { name: 'Jan', value: 12000 },
    { name: 'Fev', value: 13500 },
    { name: 'Mar', value: 15420 },
    { name: 'Abr', value: 14800 },
    { name: 'Mai', value: 16200 },
    { name: 'Jun', value: 18500 },
  ],
  '1y': [
    { name: 'Jul/23', value: 10500 },
    { name: 'Ago/23', value: 11200 },
    { name: 'Set/23', value: 10800 },
    { name: 'Out/23', value: 12500 },
    { name: 'Nov/23', value: 13800 },
    { name: 'Dez/23', value: 15000 },
    { name: 'Jan/24', value: 12000 },
    { name: 'Fev/24', value: 13500 },
    { name: 'Mar/24', value: 15420 },
    { name: 'Abr/24', value: 14800 },
    { name: 'Mai/24', value: 16200 },
    { name: 'Jun/24', value: 18500 },
  ]
};

export const MOCK_PATIENTS: Patient[] = [
  {
    id: '1',
    name: 'Ana Maria Silva',
    age: 28,
    objective: 'Hipertrofia',
    lastConsultation: '12/03/2024',
    email: 'ana.silva@email.com',
    phone: '(11) 98888-7777',
    avatar: 'https://i.pravatar.cc/150?u=1',
    history: [
      {
        id: 'rec1',
        date: '2024-02-15',
        bioimpedancia: { peso: 71.8, imc: 26.3, percentualGordura: 26.8, gorduraVisceral: 5, idadeMetabolica: 30, tmb: 1440 },
        medicoes: { altura: 165, perimetria: { cintura: 76, quadril: 104, toracica: 94, bracoDireito: 28, bracoEsquerdo: 28, coxaDireita: 59, coxaEsquerda: 59, panturrilhaDireita: 37, panturrilhaEsquerda: 37 } }
      },
      {
        id: 'rec2',
        date: '2024-03-12',
        bioimpedancia: { peso: 68.0, imc: 24.9, percentualGordura: 24.5, gorduraVisceral: 4, idadeMetabolica: 26, tmb: 1450 },
        medicoes: { altura: 165, perimetria: { cintura: 74, quadril: 102, toracica: 92, bracoDireito: 30, bracoEsquerdo: 29.5, coxaDireita: 58, coxaEsquerda: 57.5, panturrilhaDireita: 36, panturrilhaEsquerda: 36 } }
      }
    ]
  },
  { id: '2', name: 'Ricardo Santos', age: 35, objective: 'Emagrecimento', lastConsultation: '10/03/2024', email: 'ricardo.s@email.com', phone: '(11) 97777-6666', avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Beatriz Oliveira', age: 24, objective: 'Performance', lastConsultation: '05/03/2024', email: 'beatriz.o@email.com', phone: '(11) 96666-5555', avatar: 'https://i.pravatar.cc/150?u=3' },
  { id: '4', name: 'Marcos Pereira', age: 42, objective: 'Saúde Geral', lastConsultation: '28/02/2024', email: 'marcos.p@email.com', phone: '(11) 95555-4444', avatar: 'https://i.pravatar.cc/150?u=4' },
  { id: '5', name: 'Juliana Costa', age: 31, objective: 'Hipertrofia', lastConsultation: '20/02/2024', email: 'juli.costa@email.com', phone: '(11) 94444-3333', avatar: 'https://i.pravatar.cc/150?u=5' },
];
