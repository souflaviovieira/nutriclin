
import { supabase } from './supabaseClient';

export interface Patient {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    birth_date?: string;
    gender?: string;
}

export const patientService = {
    async listPatients() {
        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .order('name');
        
        if (error) throw error;
        return data as Patient[];
    },

    async getPatient(id: string) {
        const { data, error } = await supabase
            .from('patients')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data as Patient;
    },

    async createPatient(patient: Omit<Patient, 'id'>) {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) throw new Error('User not logged in');

        const { data, error } = await supabase
            .from('patients')
            .insert([{ ...patient, user_id: userData.user.id }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    async updatePatient(id: string, updates: Partial<Patient>) {
        const { data, error } = await supabase
            .from('patients')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};

export const measuresService = {
    async saveMeasures(patientId: string, measures: any) {
         const { error } = await supabase
            .from('patient_measures')
            .insert([{ ...measures, patient_id: patientId }]);
         if (error) throw error;
    },

    async getLatestMeasures(patientId: string) {
        const { data, error } = await supabase
            .from('patient_measures')
            .select('*')
            .eq('patient_id', patientId)
            .order('date', { ascending: false })
            .limit(1)
            .single();
        
        // Return null if not found instead of throwing
        if (error && error.code !== 'PGRST116') throw error;
        return data;
    }
};
