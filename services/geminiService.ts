
import { GoogleGenAI, Type } from "@google/genai";
import { InventoryItem, Transaction } from "../types";

export const getGeminiAdvice = async (stock: InventoryItem[], transactions: Transaction[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const stockSummary = stock.map(s => `${s.name}: ${s.quantity}${s.unit} em estoque (Mínimo: ${s.minQuantity})`).join(', ');
  
  const prompt = `
    Como especialista em marketing para sorveterias, sua missão é criar 3 OFERTAS ESTRATÉGICAS para girar o estoque atual.
    
    Analise o estoque: ${stockSummary}
    
    Identifique itens com alta quantidade ou que pareçam parados.
    Crie ofertas como: Combos "Leve 2 Pague 1", Happy Hour de Sabores específicos, Desconto Progressivo ou Brindes para itens em excesso.
    
    Retorne o JSON com o campo "insights" contendo objetos com:
    - title: Um nome chamativo para a oferta (ex: "Festival de Morango", "Combo Verão Raiz").
    - description: Explicação detalhada da mecânica da oferta.
    - impact: O benefício esperado (ex: "Redução de 30% no estoque excedente de baunilha").
    
    Seja criativo e focado em vendas rápidas.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  impact: { type: Type.STRING }
                },
                required: ["title", "description", "impact"]
              }
            }
          },
          required: ["insights"]
        }
      }
    });

    return JSON.parse(response.text || '{"insights": []}');
  } catch (error) {
    console.error("Gemini API Error:", error);
    return { insights: [] };
  }
};
