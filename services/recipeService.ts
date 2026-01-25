
import { supabase } from './supabaseClient';

export interface Recipe {
    id?: string;
    user_id?: string;
    title: string;
    description?: string;
    prep_time_minutes?: number;
    cook_time_minutes?: number;
    servings?: number;
    ingredients: any;
    instructions: string;
    total_calories?: number;
    total_protein?: number;
    total_fat?: number;
    total_carbs?: number;
    image_url?: string;
    category?: string;
    is_public?: boolean;
}

export const recipeService = {
    async listRecipes() {
        const { data, error } = await supabase
            .from('recipes')
            .select('*')
            .order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    async saveRecipe(recipe: Recipe) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('User not authenticated');

        const payload = {
            ...recipe,
            user_id: user.id,
            updated_at: new Date().toISOString()
        };

        if (recipe.id) {
            const { data, error } = await supabase
                .from('recipes')
                .update(payload)
                .eq('id', recipe.id)
                .select()
                .single();
            if (error) throw error;
            return data;
        } else {
            const { data, error } = await supabase
                .from('recipes')
                .insert([payload])
                .select()
                .single();
            if (error) throw error;
            return data;
        }
    },

    async deleteRecipe(id: string) {
        const { error } = await supabase
            .from('recipes')
            .delete()
            .eq('id', id);
        if (error) throw error;
    }
};
