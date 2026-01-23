
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import StatsCard from './components/StatsCard';
import RevenueChart from './components/RevenueChart';
import AppointmentsList from './components/AppointmentsList';
import AlertsPanel from './components/AlertsPanel';
import PatientForm from './components/PatientForm';
import AppointmentForm from './components/AppointmentForm';
import PatientRecord from './components/PatientRecord';
import PatientEvolution from './components/PatientEvolution';
import MealPlanCreator from './components/MealPlanCreator';
import ReportGenerator from './components/ReportGenerator';
import FinanceManager from './components/FinanceManager';
import LoginPage from './components/LoginPage';
import PatientList from './components/PatientList';
import PatientDetail from './components/PatientDetail';
import ScheduleManager from './components/ScheduleManager';
import SettingsPage from './components/SettingsPage';
import AiAssistant from './components/AiAssistant';
import ClinicalConsultation from './components/ClinicalConsultation';
import PlansLibrary from './components/PlansLibrary';
import MealPlanModelView from './components/MealPlanModelView';
import RecommendationModelView from './components/RecommendationModelView';
import FoodDetailView from './components/FoodDetailView';
import RecipeDetailView from './components/RecipeDetailView';
import RecipeForm from './components/RecipeForm';
import SubstitutionDetailView from './components/SubstitutionDetailView';
import FoodFormModal from './components/FoodFormModal';
import NextAppointmentCard from './components/NextAppointmentCard';
import { BottomNavigation, FloatingActionButton } from './components/navigation';
import { MOCK_METRICS, MOCK_PATIENTS } from './constants';
import { Loader2, Plus, Calendar, UserPlus, CalendarPlus, Sparkles } from 'lucide-react';
import { supabase } from './services/supabaseClient';
import Header from './components/layout/Header';
import { Patient, ConsultationRecord } from './types';
import { consultationService } from './services/consultationService';
import { patientService } from './services/patientService';

import { UserProvider, useUser } from './contexts/UserContext';

type View = 'dashboard' | 'patients' | 'patient-detail' | 'new-patient' | 'edit-patient' | 'new-appointment' | 'patient-record' | 'patient-evolution' | 'meal-plan' | 'report' | 'finance' | 'appointments' | 'settings' | 'ai-assistant' | 'ongoing-consultation' | 'plans-library' | 'meal-plan-detail' | 'recommendation-model-view' | 'food-detail' | 'recipe-detail' | 'create-recipe' | 'substitution-detail';

const AppContent: React.FC = () => {
  const { profile } = useUser();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedModelName, setSelectedModelName] = useState<string | null>(null);
  const [selectedRecommendationName, setSelectedRecommendationName] = useState<string | null>(null);
  const [selectedFoodItem, setSelectedFoodItem] = useState<any>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<any>(null);
  const [selectedSubstitution, setSelectedSubstitution] = useState<any>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('sidebarCollapsed') === 'true';
    }
    return false;
  });
  const [localPatients, setLocalPatients] = useState<Patient[]>(MOCK_PATIENTS);

  // States for Global Food Modal
  const [isFoodModalOpen, setIsFoodModalOpen] = useState(false);
  const [foodToEdit, setFoodToEdit] = useState<any>(null);

  // States to persist library navigation
  const [plansActiveTab, setPlansActiveTab] = useState<any>('alimentos');
  const [plansActiveSubTab, setPlansActiveSubTab] = useState<any>('alimentos-base');
  const [settingsActiveSection, setSettingsActiveSection] = useState<any>('profissional');

  // Check if we're on mobile
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session));
    return () => subscription.unsubscribe();
  }, []);

  // Load Real Patients
  useEffect(() => {
    const fetchPatients = async () => {
       try {
         const realPatients = await patientService.listPatients();
         if(realPatients && realPatients.length > 0) {
             // Mapeia os campos do DB para a interface local se necessário
            setLocalPatients(realPatients as any);
         }
       } catch(err) {
         console.error("Failed to load patients", err);
       }
    };
    if(session) fetchPatients();
  }, [session]);

  const getSelectedPatient = () => localPatients.find(p => p.id === selectedPatientId) || localPatients[0];

  const handleFinishConsultation = async (record: ConsultationRecord) => {
    try {
      if (selectedPatientId) {
          await consultationService.saveFullConsultation(selectedPatientId, record);
          
          // Update local state optimistic
          setLocalPatients(prev => prev.map(p => p.id === selectedPatientId ? {
            ...p, 
            lastConsultation: new Date().toLocaleDateString('pt-BR'), 
            history: [...(p.history || []), record]
          } : p));

          alert("Consulta salva com sucesso!");
      }
      setCurrentView('patient-detail');
    } catch (e) {
      console.error(e);
      alert("Erro ao salvar consulta.");
    }
  };

  const handleSavePatient = (data: any, andSchedule?: boolean) => {
    if (andSchedule) {
      setCurrentView('new-appointment');
      setActiveTab('appointments');
    } else {
      setCurrentView('patients');
      setActiveTab('patients');
    }
  };

  // Navigation handler for bottom navigation
  const handleBottomNavChange = (tab: string) => {
    setActiveTab(tab);
    const views: Record<string, View> = {
      dashboard: 'dashboard',
      patients: 'patients',
      alimentos: 'plans-library',
      appointments: 'appointments',
      settings: 'settings',
    };
    setCurrentView(views[tab] || 'dashboard');
  };

  // FAB Actions based on current view
  const getFabActions = () => {
    const baseActions = [
      {
        id: 'new-patient',
        label: 'Novo Cliente',
        icon: <UserPlus size={20} />,
        onClick: () => {
          setCurrentView('new-patient');
          setActiveTab('patients');
        },
      },
      {
        id: 'new-appointment',
        label: 'Agendar Consulta',
        icon: <CalendarPlus size={20} />,
        onClick: () => {
          setCurrentView('new-appointment');
          setActiveTab('appointments');
        },
      },
      {
        id: 'ai-assistant',
        label: 'Nutri AI',
        icon: <Sparkles size={20} />,
        onClick: () => {
          setCurrentView('ai-assistant');
          setActiveTab('ai-assistant');
        },
        color: 'bg-gradient-to-br from-purple-500 to-pink-500 text-white',
      },
    ];

    return baseActions;
  };

  // Determine if we should show FAB
  const shouldShowFab = () => {
    const noFabViews = ['new-patient', 'edit-patient', 'new-appointment', 'ongoing-consultation', 'create-recipe'];
    return !noFabViews.includes(currentView);
  };

  if (loading) return (
    <div className="min-h-screen bg-cream-100 flex items-center justify-center">
      <div className="flex flex-col items-center gap-5">
        {/* Coral animated loader */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-cream-200"></div>
          <div className="absolute inset-0 w-16 h-16 rounded-full border-4 border-coral-400 border-t-transparent animate-spin"></div>
        </div>
        <div className="text-center">
          <p className="text-lg font-display font-bold text-coral-500 tracking-tight">NutriClin</p>
          <p className="text-[10px] font-medium text-slate-warm-400 uppercase tracking-[0.2em] mt-1">Carregando...</p>
        </div>
      </div>
    </div>
  );

  // TODO: TEMPORÁRIO - Login desativado para desenvolvimento
  // if (!session) return <LoginPage onLogin={() => { }} />;

  const getPageInfo = (): { title: string, description?: string } => {
    const firstName = profile?.display_name?.split(' ')[0] || 'Doutor(a)';

    const info: Record<string, { title: string, description?: string }> = {
      dashboard: { title: 'Início', description: `Olá, ${firstName}! Veja o panorama de hoje.` },
      patients: { title: 'Clientes', description: 'Gerencie seus pacientes cadastrados.' },
      'patient-detail': { title: getSelectedPatient()?.name || 'Detalhes', description: 'Prontuário e histórico.' },
      'new-patient': { title: 'Novo Cliente', description: 'Cadastre um novo paciente.' },
      'edit-patient': { title: 'Editar Cliente', description: 'Atualize os dados.' },
      'new-appointment': { title: 'Agendar', description: 'Marque uma nova consulta.' },
      'ongoing-consultation': { title: 'Consulta', description: 'Atendimento em andamento.' },
      'plans-library': { title: 'Recursos', description: 'Biblioteca de materiais.' },
      alimentos: { title: 'Alimentos', description: 'Base nutricional.' },
      'alimentos-suplementos': { title: 'Suplementos', description: 'Gestão de suplementos.' },
      'receitas-comunidade': { title: 'Receitas', description: 'Explore receitas.' },
      'receitas-minhas': { title: 'Minhas Receitas', description: 'Seu acervo pessoal.' },
      substituicoes: { title: 'Substituições', description: 'Equivalências alimentares.' },
      'modelos-planos': { title: 'Templates', description: 'Planos pré-definidos.' },
      'modelos-evitar': { title: 'Restrições', description: 'Listas restritivas.' },
      'modelos-recomendacoes': { title: 'Orientações', description: 'Guias educativos.' },
      'meal-plan-detail': { title: selectedModelName || 'Template', description: 'Detalhes do modelo.' },
      'recommendation-model-view': { title: selectedRecommendationName || 'Orientação', description: 'Detalhes.' },
      'food-detail': { title: selectedFoodItem?.name || 'Alimento', description: 'Info nutricional.' },
      'recipe-detail': { title: selectedRecipe?.title || 'Receita', description: 'Modo de preparo.' },
      'substitution-detail': { title: selectedSubstitution?.name || 'Substituição', description: 'Equivalências.' },
      'create-recipe': { title: 'Nova Receita', description: 'Crie e salve.' },
      finance: { title: 'Relatórios', description: 'Performance e indicadores.' },
      appointments: { title: 'Agenda', description: 'Suas consultas.' },
      'ai-assistant': { title: 'Nutri AI', description: 'Assistente inteligente.' },
      settings: { title: 'Configurações', description: 'Personalize seu sistema.' },
    };

    return info[currentView] || { title: 'NutriClin Pro' };
  };

  const { title, description } = getPageInfo();

  // Simplified tab handler for sidebar
  const handleSidebarTabChange = (tab: string) => {
    setActiveTab(tab);
    const views: Record<string, View> = {
      dashboard: 'dashboard',
      patients: 'patients',
      alimentos: 'plans-library',
      'alimentos-suplementos': 'plans-library',
      'receitas-comunidade': 'plans-library',
      'receitas-minhas': 'plans-library',
      substituicoes: 'plans-library',
      'modelos-planos': 'plans-library',
      'modelos-evitar': 'plans-library',
      'modelos-recomendacoes': 'plans-library',
      billing: 'finance',
      appointments: 'appointments',
      settings: 'settings',
      'settings-profissional': 'settings',
      'settings-atendimento': 'settings',
      'settings-gestao': 'settings',
      'settings-sistema': 'settings',
      'settings-seguranca': 'settings',
      'ai-assistant': 'ai-assistant'
    };
    setCurrentView(views[tab] || 'dashboard');

    // Sync PlansLibrary if one of its sub-items is clicked
    const plansTabMap: Record<string, { tab: string, subTab: string }> = {
      alimentos: { tab: 'alimentos', subTab: 'alimentos-base' },
      'alimentos-suplementos': { tab: 'alimentos', subTab: 'suplementos' },
      'receitas-comunidade': { tab: 'receitas', subTab: 'comunidade' },
      'receitas-minhas': { tab: 'receitas', subTab: 'minhas' },
      substituicoes: { tab: 'substituicoes', subTab: 'listas' },
      'modelos-planos': { tab: 'modelos', subTab: 'meal-plans' },
      'modelos-evitar': { tab: 'modelos', subTab: 'avoid-foods' },
      'modelos-recomendacoes': { tab: 'modelos', subTab: 'recommendations' }
    };

    if (plansTabMap[tab]) {
      setPlansActiveTab(plansTabMap[tab].tab as any);
      setPlansActiveSubTab(plansTabMap[tab].subTab);
    }

    // Sync SettingsPage section if clicked from sidebar
    if (tab.startsWith('settings-')) {
      const section = tab.replace('settings-', '');
      setSettingsActiveSection(section as any);
    } else if (tab === 'settings') {
      setSettingsActiveSection('profissional');
    }
  };

  return (
    <div className="min-h-screen bg-cream-100 selection:bg-coral-100 selection:text-coral-600">
      {/* Desktop Sidebar - Hidden on Mobile */}
      <div className="hidden lg:block">
        <Sidebar
          activeTab={activeTab}
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isCollapsed={isSidebarCollapsed}
          toggleCollapse={() => {
            const newState = !isSidebarCollapsed;
            setIsSidebarCollapsed(newState);
            window.localStorage.setItem('sidebarCollapsed', String(newState));
          }}
          setActiveTab={handleSidebarTabChange}
        />
      </div>

      {/* Mobile Sidebar/Drawer */}
      <div className="lg:hidden">
        <Sidebar
          activeTab={activeTab}
          isOpen={isSidebarOpen}
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isCollapsed={false}
          toggleCollapse={() => {}}
          setActiveTab={(tab) => {
            handleSidebarTabChange(tab);
            setIsSidebarOpen(false);
          }}
        />
      </div>

      <main className={`
        flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out h-screen overflow-hidden
        ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
        pb-20 lg:pb-0
      `}>
        {/* Unified Header */}
        <Header
          session={session}
          title={title}
          description={description}
          onToggleSidebar={() => setIsSidebarOpen(true)}
          onProfileClick={() => {
            setActiveTab('settings');
            setCurrentView('settings');
          }}
        />

        {/* Floating Main Container */}
        <div className="flex-1 px-3 md:px-8 pb-3 md:pb-8 overflow-hidden z-10 relative">
          <div className="w-full h-full bg-white/80 backdrop-blur-md border border-cream-200 rounded-3xl lg:rounded-2xl shadow-soft-lg overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto no-scrollbar relative">
              {/* Decorative grain texture */}
              <div className="absolute inset-0 opacity-40 pointer-events-none grain-texture"></div>
              
              <div className="p-4 md:p-10 max-w-[1600px] mx-auto w-full relative z-10">
                {currentView === 'dashboard' ? (
                  <div className="animate-in fade-in duration-700 space-y-8">
                    {/* 1. HERO: Next Appointment (Focus on Now) */}
                    <section>
                      <NextAppointmentCard 
                        patientName="Ana Sophia Oliveira"
                        time="14:00"
                        type="Retorno (45min)"
                        isOnline={true}
                        onStartConsultation={() => {
                          setSelectedPatientId('1');
                          setCurrentView('ongoing-consultation');
                        }}
                        onViewProfile={() => {
                          setSelectedPatientId('1');
                          setCurrentView('patient-detail');
                        }}
                      />
                    </section>

                    {/* 2. OPERATIONAL KPIs (Focus on Day/Week) - Replaces generic revenue */}
                    <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                      {/* Using existing metrics but should be customized for daily ops later */}
                      {MOCK_METRICS.map((metric, idx) => <StatsCard key={idx} metric={metric} />)}
                    </section>
                    
                    {/* 3. MAIN WORKSPACE (Agenda & Alerts vs Revenue) */}
                    <section className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
                      {/* Left Column: Immediate Action */}
                      <div className="xl:col-span-2 space-y-6">
                        <div className="flex items-center justify-between">
                          <h3 className="font-display font-bold text-xl text-slate-warm-800">Sua Agenda Hoje</h3>
                          <button onClick={() => { setCurrentView('appointments'); setActiveTab('appointments'); }} className="text-sm font-bold text-coral-500 hover:text-coral-600">
                            Ver Agenda Completa
                          </button>
                        </div>
                        <AppointmentsList />
                        
                        {/* Secondary: Financials (Lower priority) */}
                        <div className="pt-4 opacity-80 hover:opacity-100 transition-opacity">
                           <RevenueChart />
                        </div>
                      </div>

                      {/* Right Column: Support */}
                      <div className="space-y-6 flex flex-col">
                        <AlertsPanel />
                        
                        {/* Quick Actions Card */}
                        <div className="card-coral p-6 space-y-4">
                          <h3 className="font-display font-bold text-lg text-slate-warm-800">Ações Rápidas</h3>
                          <button onClick={() => { setCurrentView('new-patient'); setActiveTab('patients'); }} className="w-full flex items-center gap-3 p-3 rounded-xl bg-coral-50 text-coral-600 hover:bg-coral-100 transition-colors font-bold text-sm">
                            <Plus size={18} /> Cadastrar Paciente
                          </button>
                          <button onClick={() => { setCurrentView('new-appointment'); setActiveTab('appointments'); }} className="w-full flex items-center gap-3 p-3 rounded-xl bg-cream-100 text-slate-warm-600 hover:bg-cream-200 transition-colors font-bold text-sm">
                            <Calendar size={18} /> Agendar Consulta
                          </button>
                        </div>
                      </div>
                    </section>
                  </div>
                ) : currentView === 'patients' ? (
                  <PatientList 
                    onAddPatient={() => setCurrentView('new-patient')} 
                    onViewPatient={(id) => { setSelectedPatientId(id); setCurrentView('patient-detail'); }} 
                    onNewAppointment={(id) => { setSelectedPatientId(id); setCurrentView('new-appointment'); setActiveTab('appointments'); }} 
                    onEditPatient={(id) => { setSelectedPatientId(id); setCurrentView('edit-patient'); }} 
                  />
                ) : currentView === 'patient-detail' ? (
                  <PatientDetail 
                    patientId={selectedPatientId || '1'} 
                    onBack={() => { setCurrentView('patients'); setActiveTab('patients'); }} 
                    onEdit={() => setCurrentView('edit-patient')} 
                    onSchedule={(id) => { setSelectedPatientId(id); setCurrentView('new-appointment'); }} 
                    onConsultNow={(id) => { setSelectedPatientId(id); setCurrentView('ongoing-consultation'); }} 
                  />
                ) : currentView === 'new-patient' ? (
                  <PatientForm onCancel={() => setCurrentView('patients')} onSave={handleSavePatient} />
                ) : currentView === 'edit-patient' ? (
                  <PatientForm initialData={getSelectedPatient() as any} onCancel={() => setCurrentView('patients')} onSave={handleSavePatient} />
                ) : currentView === 'new-appointment' ? (
                  <AppointmentForm initialPatientId={selectedPatientId} onCancel={() => setCurrentView('dashboard')} onSave={() => setCurrentView('appointments')} />
                ) : currentView === 'ongoing-consultation' ? (
                  <ClinicalConsultation patientId={selectedPatientId || '1'} patientName={getSelectedPatient()?.name || 'Paciente'} onClose={() => setCurrentView('patient-detail')} onFinish={handleFinishConsultation} />
                ) : currentView === 'plans-library' ? (
                  <PlansLibrary
                    onViewModel={(name) => { setSelectedModelName(name); setCurrentView('meal-plan-detail'); }}
                    onViewRecommendation={(name) => { setSelectedRecommendationName(name); setCurrentView('recommendation-model-view'); }}
                    onViewFood={(food) => { setSelectedFoodItem(food); setCurrentView('food-detail'); }}
                    onViewRecipe={(recipe) => { setSelectedRecipe(recipe); setCurrentView('recipe-detail'); }}
                    onViewSubstitution={(item) => { setSelectedSubstitution(item); setCurrentView('substitution-detail'); }}
                    onCreateRecipe={() => setCurrentView('create-recipe')}
                    activeTab={plansActiveTab}
                    activeSubTab={plansActiveSubTab}
                    setActiveSubTab={setPlansActiveSubTab}
                    isFoodModalOpen={isFoodModalOpen}
                    setIsFoodModalOpen={setIsFoodModalOpen}
                    foodToEdit={foodToEdit}
                    setFoodToEdit={setFoodToEdit}
                  />
                ) : currentView === 'meal-plan-detail' ? (
                  <MealPlanModelView name={selectedModelName || ''} onBack={() => setCurrentView('plans-library')} />
                ) : currentView === 'recommendation-model-view' ? (
                  <RecommendationModelView name={selectedRecommendationName || ''} onBack={() => setCurrentView('plans-library')} />
                ) : currentView === 'food-detail' ? (
                  <FoodDetailView
                    food={selectedFoodItem}
                    onBack={() => setCurrentView('plans-library')}
                    onEdit={(food) => {
                      setFoodToEdit(food);
                      setIsFoodModalOpen(true);
                    }}
                  />
                ) : currentView === 'recipe-detail' ? (
                  <RecipeDetailView recipe={selectedRecipe} onBack={() => setCurrentView('plans-library')} />
                ) : currentView === 'substitution-detail' ? (
                  <SubstitutionDetailView item={selectedSubstitution} onBack={() => setCurrentView('plans-library')} />
                ) : currentView === 'create-recipe' ? (
                  <RecipeForm onCancel={() => setCurrentView('plans-library')} />
                ) : currentView === 'meal-plan' ? (
                  <MealPlanCreator onBack={() => setCurrentView('dashboard')} patientName="Ana Maria Silva" />
                ) : currentView === 'finance' ? (
                  <FinanceManager onBack={() => setCurrentView('dashboard')} />
                ) : currentView === 'appointments' ? (
                  <ScheduleManager />
                ) : currentView === 'ai-assistant' ? (
                  <AiAssistant />
                ) : (
                  <SettingsPage initialSection="profissional" />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Footer */}
        <footer className="hidden lg:flex flex-shrink-0 py-4 px-10 text-center bg-nutri-secondary justify-center">
          <p className="text-[10px] text-nutri-text-dis font-bold uppercase tracking-[0.3em] opacity-60">&copy; 2024 NutriClin Pro Systems</p>
        </footer>
      </main>

      {/* Mobile Bottom Navigation */}
      <BottomNavigation 
        activeTab={activeTab}
        onTabChange={handleBottomNavChange}
      />

      {/* Floating Action Button - Mobile only, hidden on forms */}
      {shouldShowFab() && (
        <FloatingActionButton 
          actions={getFabActions()}
          showSpeedDial={true}
        />
      )}

      {/* Globally Accessible Food Form Modal */}
      <FoodFormModal
        isOpen={isFoodModalOpen}
        onClose={() => { setIsFoodModalOpen(false); setFoodToEdit(null); }}
        isSupplement={foodToEdit?.isSupplement || plansActiveSubTab === 'suplementos'}
        initialFood={foodToEdit}
        onSave={(food) => {
          setIsFoodModalOpen(false);
          setFoodToEdit(null);
          if (currentView === 'food-detail') {
            setSelectedFoodItem(food);
          }
        }}
      />
    </div>
  );
};

const App: React.FC = () => (
  <UserProvider>
    <AppContent />
  </UserProvider>
);

export default App;