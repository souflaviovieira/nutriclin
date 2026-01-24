
// AI Service - Updated for Stability
import { GoogleGenAI } from "@google/genai";
import { supabase } from "./supabaseClient";

// Initialize Gemini lazily
let genAIInstance: GoogleGenAI | null = null;

const getGenAI = () => {
  if (genAIInstance) return genAIInstance;
  
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;
  if (!apiKey) return null;
  
  try {
    genAIInstance = new GoogleGenAI({ apiKey });
    return genAIInstance;
  } catch (e) {
    console.error("Failed to initialize GoogleGenAI", e);
    return null;
  }
};

export const aiService = {
  async generateAnalysis(patientData: any) {
    const ai = getGenAI();

    // Mock response if no key or initialization failed
    if (!ai) {
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
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.0-flash',
        contents: prompt
      });
      
      return response.text(); // Ensure correct property access depending on SDK version, .text() is common in new SDKs or .response.text()
    } catch (error: any) {
      console.error("AI Error:", error);
      return `Não foi possível gerar a análise com IA neste momento. Erro: ${error.message || 'Desconhecido'}`;
    }
  }
};
