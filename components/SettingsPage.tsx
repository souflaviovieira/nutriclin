
import React, { useState } from 'react';
import { User, Building2, Bell, CreditCard, LogOut, ChevronRight } from 'lucide-react';
import ProfileSettings from './settings/ProfileSettings';
import ClinicSettings from './settings/ClinicSettings';
import { useUser } from '../contexts/UserContext';

type SettingsSection = 'profissional' | 'clinica' | 'preferencias' | 'assinatura';

interface SettingsPageProps {
  initialSection?: SettingsSection;
  onLogout: () => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ initialSection = 'profissional', onLogout }) => {
  const [activeSection, setActiveSection] = useState<SettingsSection>(initialSection);

  const menuItems = [
    { id: 'profissional', label: 'Dados Profissionais', icon: User },
    { id: 'clinica', label: 'Dados da Clínica', icon: Building2 },
    { id: 'preferencias', label: 'Preferências do App', icon: Bell },
    { id: 'assinatura', label: 'Plano e Assinatura', icon: CreditCard },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'profissional':
        return <ProfileSettings />;
      case 'clinica':
        return <ClinicSettings />;
      case 'preferencias':
        return (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-cream-200">
            <div className="w-16 h-16 bg-cream-100 rounded-full flex items-center justify-center mb-4 text-slate-warm-400">
              <Bell size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-warm-800 mb-2">Preferências em Desenvolvimento</h3>
            <p className="text-slate-warm-500 max-w-sm">Em breve você poderá configurar notificações, temas (Dark Mode) e integrações com Google Calendar.</p>
          </div>
        );
      case 'assinatura':
        return (
          <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-2xl border border-cream-200">
            <div className="w-16 h-16 bg-coral-50 rounded-full flex items-center justify-center mb-4 text-coral-500">
              <CreditCard size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-warm-800 mb-2">Gerenciar Assinatura</h3>
            <p className="text-slate-warm-500 max-w-sm mb-6">Você está no plano <strong>NutriClin Pro</strong>. Sua próxima renovação será em 25/02/2026.</p>
            <button className="px-6 py-2.5 bg-slate-warm-800 text-white rounded-xl font-bold hover:bg-slate-warm-900 transition-colors">
              Gerenciar Pagamento
            </button>
          </div>
        );
      default:
        return <ProfileSettings />;
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto animate-fade-in pb-20 lg:pb-0">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        {/* Sidebar Navigation */}
        <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">
          <div className="bg-white rounded-2xl border border-cream-200 shadow-soft-sm overflow-hidden">
            <div className="p-4 border-b border-cream-100 bg-cream-50/50">
              <h2 className="text-sm font-bold text-slate-warm-400 uppercase tracking-wider">Ajustes</h2>
            </div>
            <nav className="p-2 space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id as SettingsSection)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all font-medium text-sm ${isActive
                        ? 'bg-coral-50 text-coral-600 font-bold shadow-sm'
                        : 'text-slate-warm-600 hover:bg-cream-50'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={isActive ? 'text-coral-500' : 'text-slate-warm-400'} />
                      {item.label}
                    </div>
                    {isActive && <ChevronRight size={16} className="text-coral-400" />}
                  </button>
                )
              })}
            </nav>
          </div>

          <div className="bg-white rounded-2xl border border-cream-200 shadow-soft-sm p-2">
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors font-bold text-sm"
            >
              <LogOut size={18} />
              Sair da Conta
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
