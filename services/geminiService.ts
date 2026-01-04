
import { GoogleGenAI } from "@google/genai";

export class GeminiService {
  /* No longer instantiating in constructor to follow guidelines for dynamic API key usage */

  async getDashboardInsights(metrics: any) {
    try {
      // Create a new GoogleGenAI instance right before the call
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Como um assistente clínico de nutrição, analise estes dados de dashboard de um nutricionista e forneça 3 insights curtos e acionáveis em português:
      - Pacientes Ativos: ${metrics.activePatients}
      - Faturamento: ${metrics.revenue}
      - Próximas Consultas: ${metrics.nextAppointments}
      Foque em retenção de pacientes, otimização de agenda e saúde financeira.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: "Você é um consultor especializado em gestão de clínicas de nutrição.",
          temperature: 0.7,
        }
      });

      // Use the .text property directly
      return response.text;
    } catch (error) {
      console.error("Error fetching Gemini insights:", error);
      return "Não foi possível carregar os insights inteligentes no momento.";
    }
  }
}

export const geminiService = new GeminiService();
