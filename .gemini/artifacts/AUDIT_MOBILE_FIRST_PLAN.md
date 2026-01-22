# 📱 NutriClin Pro - Deep Audit & Mobile-First Refactoring Plan

## 🎯 Sumário Executivo

Este documento apresenta a auditoria completa e o plano de refatoração Mobile-First para o NutriClin Pro.
O objetivo é transformar o app em uma experiência encantadora e funcional, mantendo a essência do projeto.

---

## 📊 ETAPA 1: AUDITORIA E UX RE-ENGINEERING

### 1.1 Estrutura Atual Analisada

| Componente | Arquivos | Status |
|------------|----------|--------|
| **App Principal** | App.tsx (348 linhas) | ✅ Bem estruturado |
| **Navegação** | Sidebar.tsx (217 linhas) | ⚠️ Desktop-first |
| **Dashboard** | Renderizado em App.tsx | ✅ Funcional |
| **Pacientes** | PatientList, PatientDetail, PatientForm | ✅ Funcional |
| **Agenda** | ScheduleManager (474 linhas) | ⚠️ Complexo |
| **Biblioteca** | PlansLibrary (527 linhas) | ⚠️ Muitas responsabilidades |
| **Configurações** | SettingsPage (413 linhas) | ✅ Funcional |
| **Consulta Clínica** | ClinicalConsultation (839 linhas) | ⚠️ Muito extenso |  
| **Componentes UI** | Button, Card, Input, LoadingSpinner | ✅ Padronizados |

### 1.2 Mapeamento de Fluxos de Navegação

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUXO ATUAL (Desktop-First)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐                                                    │
│  │ Sidebar  │ ─────► [Minha Clínica]                            │
│  │ (fixa    │ ─────► [Agenda]                                   │
│  │  left)   │ ─────► [Clientes] ──► [Detalhe] ──► [Consulta]   │
│  │          │ ─────► [Biblioteca] ──► [Alimentos/Receitas/etc]  │
│  │          │ ─────► [Relatórios]                               │
│  │          │ ─────► [Nutri AI]                                 │
│  └──────────┘ ─────► [Configurações]                            │
│                                                                  │
│  PROBLEMAS IDENTIFICADOS:                                        │
│  ❌ Sem navegação contextual (botão voltar)                      │
│  ❌ Sidebar ocupa espaço precioso em mobile                      │
│  ❌ Sem Bottom Tabs para acesso rápido                           │
│  ❌ Fluxos profundos sem breadcrumb                              │
└─────────────────────────────────────────────────────────────────┘
```

### 1.3 Problemas de UX Identificados

#### 🔴 Fricções Críticas

| # | Problema | Localização | Impacto |
|---|----------|-------------|---------|
| 1 | **Sem navegação "voltar"** | PatientDetail, FoodDetail, etc. | Usuário se perde em fluxos profundos |
| 2 | **Sidebar fixa em mobile** | Sidebar.tsx | Ocupa espaço, UX ruim para toque |
| 3 | **Botões de ação no topo** | Todas as telas | Difícil alcançar com polegar |
| 4 | **Cards densos demais** | PatientList, PlansLibrary | Muita informação em tela pequena |
| 5 | **Formulários longos** | SettingsPage, PatientForm | Scroll infinito em mobile |

#### 🟡 Melhorias Recomendadas

| # | Melhoria | Localização | Benefício |
|---|----------|-------------|-----------|
| 1 | Bottom Tab Navigation | Novo componente | Navegação nativa mobile |
| 2 | Floating Action Button (FAB) | Dashboard, Lists | Ação primária ao alcance do polegar |
| 3 | Pull-to-refresh | Listas | Padrão nativo mobile |
| 4 | Swipe actions | Cards de pacientes | Ações rápidas sem menus |
| 5 | Skeleton loading | Todas as telas | Percepção de velocidade |

### 1.4 Refatoração de UX Writing

| Texto Atual | Texto Proposto | Motivo |
|-------------|----------------|--------|
| "Novo Paciente" | "Cadastrar Cliente" | Mais amigável |
| "Ver Prontuário" | "Ver Perfil Completo" | Menos técnico |
| "Configurações" | "Meu Consultório" | Mais humano |
| "Minha Clínica" | "Início" | Padrão mobile |
| "Biblioteca" | "Recursos" | Mais intuitivo |
| "Alimentos a Evitar" | "Restrições" | Mais claro |
| "Modelos de Planos" | "Templates" | Universal |

---

## 🎨 ETAPA 2: INTERFACE E DESIGN RESPONSIVO

### 2.1 Sistema de Design Mobile-First

#### Nova Paleta de Cores (Manter identidade)

```css
:root {
  /* Cores Primárias - Mantidas */
  --nutri-blue: #84d1c1;
  --nutri-blue-hover: #6bc2b1;
  --nutri-blue-light: rgba(132, 209, 193, 0.1);
  
  /* Backgrounds - Ajustes Mobile */
  --nutri-main: #FFFFFF;
  --nutri-secondary: #F5F9FC;
  --nutri-surface: #FAFCFD;
  
  /* Texto */
  --nutri-text: #2F3A45;
  --nutri-text-sec: #6B7280;
  --nutri-text-dis: #9CA3AF;
  
  /* Feedback */
  --nutri-success: #10B981;
  --nutri-warning: #F59E0B;
  --nutri-error: #EF4444;
  
  /* Sombras Mobile (mais suaves) */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.06);
  --shadow-lg: 0 12px 32px rgba(0,0,0,0.08);
}
```

#### Espaçamentos (Touch-friendly)

```css
/* Padrão de Espaçamento */
--space-xs: 4px;
--space-sm: 8px;
--space-md: 16px;
--space-lg: 24px;
--space-xl: 32px;
--space-2xl: 48px;

/* Touch Targets (min 44x44px) */
--touch-min: 44px;
--touch-comfortable: 48px;
--touch-large: 56px;
```

### 2.2 Componentes a Criar/Refatorar

#### Novos Componentes

| Componente | Função | Prioridade |
|------------|--------|------------|
| **BottomNavigation.tsx** | Barra de navegação inferior | 🔴 Alta |
| **FloatingActionButton.tsx** | Botão de ação flutuante | 🔴 Alta |
| **BackHeader.tsx** | Header com botão voltar | 🔴 Alta |
| **SwipeableCard.tsx** | Card com ações por swipe | 🟡 Média |
| **SkeletonLoader.tsx** | Placeholder de loading | 🟡 Média |
| **EmptyState.tsx** | Estado vazio padronizado | 🟢 Baixa |
| **BottomSheet.tsx** | Modal de fundo | 🟡 Média |

#### Componentes a Refatorar

| Componente | Mudanças | 
|------------|----------|
| **Sidebar.tsx** | Transformar em Drawer (mobile) |
| **Header.tsx** | Simplificar para mobile |
| **PatientList.tsx** | Cards mais compactos + swipe |
| **PlansLibrary.tsx** | Tabs nativas + scroll horizontal |
| **ScheduleManager.tsx** | Vista mobile otimizada |

### 2.3 Layout Responsivo - Breakpoints

```css
/* Mobile First Approach */
/* Base: 0px - Mobile */
/* sm: 640px - Mobile Landscape */
/* md: 768px - Tablet */
/* lg: 1024px - Desktop */
/* xl: 1280px - Large Desktop */
/* 2xl: 1536px - Extra Large */
```

### 2.4 Estrutura de Navegação Proposta

```
┌─────────────────────────────────────────────────────────────────┐
│               NOVA ESTRUTURA MOBILE-FIRST                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  MOBILE (< 1024px):                                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ [BackHeader] - contextual com título da tela            │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │                                                          │    │
│  │              CONTEÚDO PRINCIPAL                          │    │
│  │              (scroll vertical)                           │    │
│  │                                                          │    │
│  │                        [FAB]                             │    │
│  ├─────────────────────────────────────────────────────────┤    │
│  │ 🏠 Início │ 📅 Agenda │ 👥 Clientes │ 📚 Recursos │ ⚙️  │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  DESKTOP (≥ 1024px):                                            │
│  ┌──────────┬───────────────────────────────────────────────┐   │
│  │ Sidebar  │ Header Global                                 │   │
│  │ (colap-  ├───────────────────────────────────────────────┤   │
│  │  sável)  │                                               │   │
│  │          │           CONTEÚDO PRINCIPAL                  │   │
│  │          │                                               │   │
│  └──────────┴───────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 💾 ETAPA 3: BACKEND E PERSISTÊNCIA (SUPABASE)

### 3.1 Esquema de Banco de Dados

```sql
-- ============================================
-- NUTRICLIN PRO - DATABASE SCHEMA
-- ============================================

-- EXTENSÕES NECESSÁRIAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABELA: profiles (Nutricionistas/Usuários)
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  professional_name TEXT,
  crn TEXT, -- Registro profissional
  specialty TEXT,
  
  -- Contato
  phone TEXT,
  whatsapp TEXT,
  instagram TEXT,
  
  -- Endereço do Consultório
  address_street TEXT,
  address_number TEXT,
  address_complement TEXT,
  address_neighborhood TEXT,
  address_city TEXT,
  address_state TEXT,
  address_zip TEXT,
  
  -- Arquivos
  avatar_url TEXT,
  logo_url TEXT,
  signature_url TEXT,

  -- Configurações
  working_hours JSONB DEFAULT '{"start": "08:00", "end": "18:00"}'::jsonb,
  appointment_duration INTEGER DEFAULT 60, -- minutos
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- TABELA: patients (Pacientes/Clientes)
-- ============================================
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Dados Pessoais
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  whatsapp TEXT,
  cpf TEXT,
  birth_date DATE,
  gender TEXT CHECK (gender IN ('masculino', 'feminino', 'outro')),
  profession TEXT,
  
  -- Endereço
  address_street TEXT,
  address_number TEXT,
  address_complement TEXT,
  address_neighborhood TEXT,
  address_city TEXT,
  address_state TEXT,
  address_zip TEXT,
  
  -- Dados Clínicos
  objective TEXT,
  notes TEXT,
  avatar_url TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- TABELA: appointments (Agendamentos)
-- ============================================
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  
  -- Dados do Agendamento
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  type TEXT NOT NULL CHECK (type IN ('primeira_consulta', 'retorno', 'avaliacao', 'acompanhamento', 'outro')),
  
  -- Status e Financeiro
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'confirmado', 'realizada', 'cancelado', 'remarcado')),
  price DECIMAL(10,2),
  paid BOOLEAN DEFAULT false,
  
  -- Observações
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- TABELA: consultations (Consultas Realizadas)
-- ============================================
CREATE TABLE public.consultations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Data da Consulta
  consultation_date TIMESTAMPTZ DEFAULT now(),
  
  -- Anamnese
  anamnesis JSONB,
  
  -- Medidas Antropométricas
  measurements JSONB,
  
  -- Bioimpedância
  bioimpedance JSONB,
  
  -- Exames
  exams JSONB,
  
  -- Observações Gerais
  observations TEXT,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- TABELA: meal_plans (Planos Alimentares)
-- ============================================
CREATE TABLE public.meal_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  consultation_id UUID REFERENCES public.consultations(id) ON DELETE SET NULL,
  
  -- Dados do Plano
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE,
  end_date DATE,
  
  -- Conteúdo do Plano
  meals JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Totais Calculados
  total_calories DECIMAL(10,2),
  total_protein DECIMAL(10,2),
  total_carbs DECIMAL(10,2),
  total_fat DECIMAL(10,2),
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_template BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- TABELA: foods (Banco de Alimentos)
-- ============================================
CREATE TABLE public.foods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE, -- NULL = alimento público
  
  -- Dados do Alimento
  name TEXT NOT NULL,
  category TEXT,
  portion_size DECIMAL(10,2),
  portion_unit TEXT DEFAULT 'g',
  
  -- Macronutrientes (por porção)
  calories DECIMAL(10,2),
  protein DECIMAL(10,2),
  carbs DECIMAL(10,2),
  fat DECIMAL(10,2),
  fiber DECIMAL(10,2),
  sodium DECIMAL(10,2),
  
  -- Informações adicionais
  is_supplement BOOLEAN DEFAULT false,
  brand TEXT,
  barcode TEXT,
  image_url TEXT,
  
  -- Flags
  is_public BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- TABELA: recipes (Receitas)
-- ============================================
CREATE TABLE public.recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Dados da Receita
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  prep_time_minutes INTEGER,
  cook_time_minutes INTEGER,
  servings INTEGER DEFAULT 1,
  
  -- Conteúdo
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  instructions TEXT,
  
  -- Nutrição Total
  total_calories DECIMAL(10,2),
  total_protein DECIMAL(10,2),
  total_carbs DECIMAL(10,2),
  total_fat DECIMAL(10,2),
  
  -- Mídia
  image_url TEXT,
  
  -- Flags
  is_public BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- TABELA: substitution_lists (Listas de Substituição)
-- ============================================
CREATE TABLE public.substitution_lists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  
  -- Lista de equivalências
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  is_public BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- TABELA: recommendations (Orientações/Recomendações)
-- ============================================
CREATE TABLE public.recommendations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  title TEXT NOT NULL,
  category TEXT,
  content TEXT NOT NULL,
  
  is_public BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- TABELA: financial_records (Registros Financeiros)
-- ============================================
CREATE TABLE public.financial_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id) ON DELETE SET NULL,
  patient_id UUID REFERENCES public.patients(id) ON DELETE SET NULL,
  
  -- Dados da Transação
  type TEXT NOT NULL CHECK (type IN ('receita', 'despesa')),
  category TEXT,
  description TEXT,
  amount DECIMAL(10,2) NOT NULL,
  transaction_date DATE NOT NULL,
  
  -- Status
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'cancelado')),
  
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================
CREATE INDEX idx_patients_profile ON public.patients(profile_id);
CREATE INDEX idx_patients_name ON public.patients(name);
CREATE INDEX idx_appointments_profile ON public.appointments(profile_id);
CREATE INDEX idx_appointments_patient ON public.appointments(patient_id);
CREATE INDEX idx_appointments_date ON public.appointments(scheduled_at);
CREATE INDEX idx_consultations_patient ON public.consultations(patient_id);
CREATE INDEX idx_meal_plans_patient ON public.meal_plans(patient_id);
CREATE INDEX idx_foods_public ON public.foods(is_public) WHERE is_public = true;
CREATE INDEX idx_recipes_public ON public.recipes(is_public) WHERE is_public = true;

-- ============================================
-- TRIGGERS PARA UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON public.appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON public.consultations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_plans_updated_at BEFORE UPDATE ON public.meal_plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_foods_updated_at BEFORE UPDATE ON public.foods
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON public.recipes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 3.2 Dados de Exemplo (Seed Data)

```sql
-- ============================================
-- SEED DATA - DADOS DE EXEMPLO
-- ============================================

-- Inserir Alimentos Base (públicos)
INSERT INTO public.foods (name, category, portion_size, portion_unit, calories, protein, carbs, fat, fiber, is_public) VALUES
('Arroz Branco Cozido', 'Cereais e Derivados', 100, 'g', 128, 2.5, 28.1, 0.2, 1.6, true),
('Feijão Preto Cozido', 'Leguminosas', 100, 'g', 77, 4.5, 14.0, 0.5, 8.4, true),
('Frango Grelhado (Peito)', 'Carnes', 100, 'g', 159, 32.0, 0, 3.2, 0, true),
('Ovo Cozido', 'Ovos', 50, 'g', 78, 6.3, 0.6, 5.3, 0, true),
('Banana Prata', 'Frutas', 100, 'g', 98, 1.3, 26.0, 0.1, 2.0, true),
('Maçã com Casca', 'Frutas', 150, 'g', 78, 0.3, 20.7, 0.2, 2.4, true),
('Batata Doce Cozida', 'Tubérculos', 100, 'g', 77, 0.6, 18.4, 0.1, 2.2, true),
('Alface Americana', 'Verduras', 50, 'g', 7, 0.6, 1.1, 0.1, 0.4, true),
('Tomate', 'Legumes', 100, 'g', 15, 1.1, 3.1, 0.2, 1.2, true),
('Azeite de Oliva', 'Óleos', 10, 'ml', 88, 0, 0, 10, 0, true),
('Leite Desnatado', 'Laticínios', 200, 'ml', 68, 6.6, 10.0, 0.2, 0, true),
('Iogurte Natural', 'Laticínios', 170, 'g', 100, 5.0, 8.0, 5.0, 0, true),
('Pão Francês', 'Cereais e Derivados', 50, 'g', 150, 4.0, 29.0, 1.5, 1.3, true),
('Aveia em Flocos', 'Cereais e Derivados', 30, 'g', 117, 4.2, 20.1, 2.4, 2.7, true),
('Salmão Grelhado', 'Pescados', 100, 'g', 208, 20.4, 0, 13.4, 0, true),
('Brócolis Cozido', 'Verduras', 100, 'g', 35, 3.7, 7.2, 0.4, 3.3, true),
('Amendoim Torrado', 'Oleaginosas', 30, 'g', 171, 7.7, 5.4, 14.1, 2.6, true),
('Quinoa Cozida', 'Cereais e Derivados', 100, 'g', 120, 4.4, 21.3, 1.9, 2.8, true),
('Abacate', 'Frutas', 100, 'g', 160, 2.0, 8.5, 14.7, 6.7, true),
('Carne Bovina (Patinho)', 'Carnes', 100, 'g', 133, 26.7, 0, 2.8, 0, true);

-- Inserir Suplementos (públicos)
INSERT INTO public.foods (name, category, portion_size, portion_unit, calories, protein, carbs, fat, is_supplement, is_public) VALUES
('Whey Protein Isolado', 'Proteínas', 30, 'g', 115, 27, 1, 0.5, true, true),
('Creatina Monohidratada', 'Performance', 5, 'g', 0, 0, 0, 0, true, true),
('BCAA 2:1:1', 'Aminoácidos', 10, 'g', 40, 10, 0, 0, true, true),
('Omega 3 (EPA/DHA)', 'Ácidos Graxos', 2, 'cápsulas', 18, 0, 0, 2, true, true),
('Vitamina D3 2000UI', 'Vitaminas', 1, 'cápsula', 0, 0, 0, 0, true, true),
('Colágeno Hidrolisado', 'Proteínas', 10, 'g', 35, 9, 0, 0, true, true),
('Multivitamínico Completo', 'Vitaminas', 1, 'cápsula', 0, 0, 0, 0, true, true),
('Glutamina', 'Aminoácidos', 5, 'g', 20, 5, 0, 0, true, true);

-- Inserir Listas de Substituição
INSERT INTO public.substitution_lists (name, description, category, items, is_public) VALUES
('Proteínas Magras', 'Opções de proteínas com baixo teor de gordura', 'Proteínas',
 '[
   {"name": "Frango grelhado (100g)", "calories": 159, "protein": 32},
   {"name": "Peixe branco (100g)", "calories": 105, "protein": 23},
   {"name": "Atum em água (100g)", "calories": 116, "protein": 26},
   {"name": "Ovo cozido (2 unid)", "calories": 156, "protein": 12.6},
   {"name": "Tofu firme (100g)", "calories": 76, "protein": 8}
 ]'::jsonb, true),
('Carboidratos Complexos', 'Fontes de carboidratos de baixo índice glicêmico', 'Carboidratos',
 '[
   {"name": "Arroz integral (100g)", "calories": 111, "carbs": 23},
   {"name": "Batata doce (100g)", "calories": 77, "carbs": 18.4},
   {"name": "Quinoa (100g)", "calories": 120, "carbs": 21.3},
   {"name": "Aveia (30g)", "calories": 117, "carbs": 20.1},
   {"name": "Pão integral (2 fatias)", "calories": 138, "carbs": 24}
 ]'::jsonb, true),
('Gorduras Boas', 'Fontes de gorduras insaturadas', 'Lipídios',
 '[
   {"name": "Abacate (50g)", "calories": 80, "fat": 7.4},
   {"name": "Azeite (1 colher)", "calories": 88, "fat": 10},
   {"name": "Castanhas (30g)", "calories": 185, "fat": 18.5},
   {"name": "Amendoim (30g)", "calories": 171, "fat": 14.1},
   {"name": "Semente de chia (15g)", "calories": 73, "fat": 4.6}
 ]'::jsonb, true);

-- Inserir Orientações Modelo
INSERT INTO public.recommendations (title, category, content, is_public) VALUES
('Hidratação Adequada', 'Orientações Gerais', 
 'Mantenha uma ingestão de água de aproximadamente 35ml por kg de peso corporal. Distribua ao longo do dia, evitando grandes volumes durante as refeições. Prefira água filtrada e evite bebidas açucaradas.', true),
('Café da Manhã Saudável', 'Orientações Gerais',
 'O café da manhã é uma refeição importante para iniciar o dia com energia. Inclua uma fonte de proteína (ovos, iogurte), carboidratos complexos (pão integral, aveia) e frutas. Evite pular esta refeição.', true),
('Pré-Treino', 'Nutrição Esportiva',
 'Consuma carboidratos de fácil digestão 30-60 minutos antes do treino. Opções: banana, pão branco com mel, ou maltodextrina. Evite gorduras e fibras em excesso neste momento.', true),
('Pós-Treino', 'Nutrição Esportiva',
 'Após o treino, priorize a ingestão de proteínas (20-40g) e carboidratos para recuperação muscular. A janela anabólica se estende por até 2 horas após o exercício.', true),
('Alimentos a Evitar - Intolerância à Lactose', 'Restrições Alimentares',
 'Evitar: leite de vaca, queijos frescos, sorvetes, creme de leite. Permitido: leite sem lactose, queijos maturados, iogurte grego (menor lactose). Considere suplementação de cálcio.', true);
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Fase 1: Infraestrutura (Prioridade Alta)
- [ ] Aplicar migrations no Supabase
- [ ] Inserir seed data
- [ ] Criar componente BottomNavigation
- [ ] Criar componente FloatingActionButton
- [ ] Criar componente BackHeader
- [ ] Ajustar index.css para mobile-first

### Fase 2: Refatoração de Navegação
- [ ] Modificar App.tsx para layout mobile-first
- [ ] Adaptar Sidebar para Drawer (mobile)
- [ ] Implementar navegação por gestos (se aplicável)
- [ ] Adicionar transições suaves entre telas

### Fase 3: Componentes e Telas
- [ ] Refatorar PatientList (cards compactos)
- [ ] Refatorar ScheduleManager (vista mobile)
- [ ] Refatorar PlansLibrary (tabs nativas)
- [ ] Refatorar SettingsPage (formulário em seções)
- [ ] Refatorar todos os formulários (inputs maiores)

### Fase 4: Polish e Testes
- [ ] Implementar skeleton loaders
- [ ] Testar em diferentes tamanhos de tela
- [ ] Validar touch targets (min 44px)
- [ ] Testar performance
- [ ] Ajustes finais de UX Writing

---

## 🚀 PRÓXIMOS PASSOS

1. **Revisar este plano** e confirmar alinhamento
2. **Implementar Fase 1** - Banco de dados e componentes base
3. **Implementar Fase 2** - Navegação mobile-first
4. **Implementar Fases 3-4** - Telas e polish

**Deseja que eu comece a implementação?** 
Confirme e eu iniciarei pela criação do schema no Supabase e os novos componentes de navegação.
