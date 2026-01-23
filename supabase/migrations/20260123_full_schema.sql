-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Patients (Ensure basic structure)
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    birth_date DATE,
    gender TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Appointments
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time TIME NOT NULL,
    type TEXT,
    status TEXT DEFAULT 'Pendente', -- 'Pendente', 'Confirmado', 'Realizada', 'Cancelado'
    price DECIMAL(10,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Foods (Base de Alimentos)
CREATE TABLE IF NOT EXISTS foods (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id), -- Nullable para alimentos globais do sistema
    name TEXT NOT NULL,
    portion_amount DECIMAL(10,2) DEFAULT 100,
    portion_unit TEXT DEFAULT 'g',
    calories DECIMAL(10,2),
    protein DECIMAL(10,2),
    carbs DECIMAL(10,2),
    fats DECIMAL(10,2),
    category TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Supplements
CREATE TABLE IF NOT EXISTS supplements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL,
    brand TEXT,
    description TEXT,
    dosage TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Recipes
CREATE TABLE IF NOT EXISTS recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    name TEXT NOT NULL,
    description TEXT,
    instructions TEXT,
    prep_time INTEGER, -- minutes
    servings INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
    food_id UUID REFERENCES foods(id),
    amount DECIMAL(10,2),
    unit TEXT,
    name_override TEXT -- Caso não use link direto com foods
);

-- 6. Meal Plan Templates (Modelos)
CREATE TABLE IF NOT EXISTS meal_plan_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    calories_target INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS meal_plan_template_meals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    template_id UUID REFERENCES meal_plan_templates(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- "Café da manhã", "Almoço"
    time TIME,
    "order" INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS meal_plan_template_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    meal_id UUID REFERENCES meal_plan_template_meals(id) ON DELETE CASCADE,
    food_id UUID REFERENCES foods(id),
    recipe_id UUID REFERENCES recipes(id),
    supplement_id UUID REFERENCES supplements(id),
    amount DECIMAL(10,2),
    unit TEXT,
    notes TEXT
);

-- 7. Patient Meal Plans (Planos Atribuídos)
CREATE TABLE IF NOT EXISTS patient_meal_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    name TEXT NOT NULL,
    status TEXT DEFAULT 'Active', -- 'Active', 'Draft', 'Archived'
    start_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Copia a estrutura dos templates, mas vinculada ao paciente
CREATE TABLE IF NOT EXISTS patient_measures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    weight DECIMAL(5,2),
    height DECIMAL(5,2),
    waist DECIMAL(5,2),
    hip DECIMAL(5,2),
    chest DECIMAL(5,2),
    right_arm DECIMAL(5,2),
    left_arm DECIMAL(5,2),
    right_thigh DECIMAL(5,2),
    left_thigh DECIMAL(5,2),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS patient_bioimpedance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    fat_percentage DECIMAL(5,2),
    muscle_mass DECIMAL(5,2),
    visceral_fat DECIMAL(5,2),
    water_percentage DECIMAL(5,2),
    bone_mass DECIMAL(5,2),
    metabolic_age INTEGER,
    bmr INTEGER, -- Basal Metabolic Rate
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS anamnesis_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) ON DELETE CASCADE,
    date DATE DEFAULT CURRENT_DATE,
    main_complaint TEXT,
    history TEXT,
    medications TEXT,
    allergies TEXT,
    sleep_quality TEXT,
    bowel_function TEXT,
    stress_level INTEGER,
    activity_level TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS POLICIES (Simplificado para permitir o usuário usar seu próprio dados)
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Policy genérica: Usuário vê apenas seus próprios dados (ou dados públicos no caso de foods)
CREATE POLICY "Users can manage their own patients" ON patients FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own appointments" ON appointments FOR ALL USING (auth.uid() = user_id);

-- Foods: Pode ver seus próprios OU públicos
CREATE POLICY "Users can see own or public foods" ON foods FOR SELECT USING (auth.uid() = user_id OR is_public = TRUE);
CREATE POLICY "Users can manage own foods" ON foods FOR ALL USING (auth.uid() = user_id);

-- Grants
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
