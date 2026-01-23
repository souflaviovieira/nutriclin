
import { supabase } from './supabaseClient';

export interface Food {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  portion_amount: number;
  portion_unit: string;
  category?: string;
}

export const foodService = {
  // Search foods (Global + Private)
  async searchFoods(query: string) {
    if (!query || query.length < 2) return [];

    const { data, error } = await supabase
      .from('foods')
      .select('*')
      .or(`is_public.eq.true,user_id.eq.${(await supabase.auth.getUser()).data.user?.id}`)
      .ilike('name', `%${query}%`)
      .limit(20);

    if (error) {
      console.error('Error searching foods:', error);
      return [];
    }

    return data as Food[];
  },

  async createFood(food: Omit<Food, 'id'>) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('foods')
      .insert([{ ...food, user_id: userData.user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
