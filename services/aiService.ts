
// AI Service - Updated for Stability
import { GoogleGenAI } from "@google/genai";
import { supabase } from "./supabaseClient";

// Initialize Gemini
// Note: In a real app, calls should go through a backend proxy to hide the key.
const apiKey = process.env.REACT_APP_GEMINI_API_KEY || 'fake-key';
const genAI = new GoogleGenAI({ apiKey });

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
      const prompt = `
        Atue como um nutricionista sênior especialista em clínica. Analise os seguintes dados do paciente e forneça um resumo clínico, diagnóstico nutricional provável e sugestões de conduta.
        
        Dados: ${JSON.stringify(patientData)}
        
        Formato de saída: Markdown. Seja direto e técnico.
      `;
      
      const response = await genAI.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt
      });
      
      return response.text;
    } catch (error) {
      console.error("AI Error:", error);
      // Fallback para mock em caso de erro de API (para não travar o fluxo)
      return "Não foi possível gerar a análise com IA neste momento. Verifique sua conexão ou a chave de API.";
    }
  }
};
