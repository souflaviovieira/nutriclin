
import { GoogleGenAI } from "@google/genai";
import { supabase } from "./supabaseClient";

// Initialize Gemini (assuming API KEY is available via ENV or setting)
// Note: In a real app, calls should go through a backend proxy to hide the key.
// Usando a classe correta do novo SDK
const genAI = new GoogleGenAI({ apiKey: process.env.REACT_APP_GEMINI_API_KEY || 'fake-key' });

export const aiService = {
  async generateAnalysis(patientData: any) {
    // Mock response if no key
    if (!process.env.REACT_APP_GEMINI_API_KEY) {
       console.log("Mocking AI Analysis for:", patientData);
       return `## Análise Nutricional Sugerida

**Diagnóstico Inicial:**
Paciente apresenta IMC de ${patientData.medicoes?.basicas?.imc || 'N/A'}, indicando ${patientData.medicoes?.basicas?.imcStatus || 'análise pendente'}.

**Pontos de Atenção:**
1. Hidratação atual (${patientData.anamnese?.recordatorioBasico?.hidratacao || 0}L) pode precisar de ajuste.
2. Nível de estresse relatado: ${patientData.anamnese?.habitosVida?.estresse || 'Não informado'}.

**Sugestão de Conduta:**
- Aumentar aporte proteico.
- Introduzir fibras gradualmente.
- Monitorar perfil lipídico.

*Esta é uma análise gerada por IA baseada nos dados coletados. Valide clinicamente.*`;
    }

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const prompt = `
        Atue como um nutricionista sênior especialista em clínica. Analise os seguintes dados do paciente e forneça um resumo clínico, diagnóstico nutricional provável e sugestões de conduta.
        
        Dados: ${JSON.stringify(patientData)}
        
        Formato de saída: Markdown. Seja direto e técnico.
      `;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("AI Error:", error);
      throw new Error("Falha ao gerar análise.");
    }
  }
};
