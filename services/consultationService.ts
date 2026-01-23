
import { supabase } from './supabaseClient';

export const consultationService = {
  async saveFullConsultation(patientId: string, payload: any) {
      const date = new Date().toISOString(); 
      // Ensure we treat the date correctly. Currently just saving 'now'.

      // 1. Anamnese
      if (payload.anamnese) {
          const { error } = await supabase.from('anamnesis_records').insert({
              patient_id: patientId, 
              date: payload.anamnese.date || date, 
              data: payload.anamnese 
          });
          if (error) console.error("Error saving anamnese:", error);
      }

      // 2. Medições
      if (payload.medicoes) {
          const { error } = await supabase.from('patient_measures').insert({
              patient_id: patientId, 
              date: date, 
              data: payload.medicoes
          });
          if (error) console.error("Error saving measures:", error);
      }
      
      // 3. Bioimpedância
      if (payload.bioimpedancia) {
           const { error } = await supabase.from('patient_bioimpedance').insert({
              patient_id: patientId, 
              date: date, 
              data: payload.bioimpedancia
          });
          if (error) console.error("Error saving bioimpedance:", error);
      }

       // 4. Exames
      if (payload.exames) {
           const { error } = await supabase.from('exam_records').insert({
              patient_id: patientId, 
              date: payload.exames.dataColeta || date, 
              data: payload.exames
          });
          if (error) console.error("Error saving exams:", error);
      }
      
      // Update patient last consultation
      await supabase.from('patients').update({ last_consultation: date }).eq('id', patientId);
      
      return true;
  }
}
