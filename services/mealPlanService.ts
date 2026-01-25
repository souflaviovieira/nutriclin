
import { supabase } from './supabaseClient';

export interface MealPlan {
    id?: string;
    user_id?: string;
    patient_id?: string;
    name: string;
    description?: string;
    meals: any;
    is_model?: boolean;
}

export const mealPlanService = {
    async listPatientMealPlans(patientId: string) {
        const { data, error } = await supabase
            .from('meal_plans')
            .select('*')
            .eq('patient_id', patientId)
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    async listMealPlanModels() {
        const { data, error } = await supabase
            .from('meal_plans')
            .select('*')
            .eq('is_model', true)
            .order('name');
        if (error) throw error;
        return data;
    },

    async saveMealPlan(mealPlan: MealPlan) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const payload = {
            ...mealPlan,
            user_id: user.id,
            updated_at: new Date().toISOString()
        };

        // If it's a new plan or an imported model, we might want to ensure a clean insert
        if (mealPlan.id && !mealPlan.id.startsWith('imp-')) {
            const { data, error } = await supabase
                .from('meal_plans')
                .update(payload)
                .eq('id', mealPlan.id)
                .select()
                .single();
            if (error) throw error;
            return data;
        } else {
            // Remove temp IDs if any
            const { id, ...newPayload } = payload as any;
            const { data, error } = await supabase
                .from('meal_plans')
                .insert([newPayload])
                .select()
                .single();
            if (error) throw error;
            return data;
        }
    }
};
