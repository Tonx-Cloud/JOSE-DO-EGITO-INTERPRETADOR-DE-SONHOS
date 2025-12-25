
import { GoogleGenAI } from "@google/genai";

/**
 * Transcreve o áudio enviado pelo usuário em texto utilizando Gemini 3 Flash.
 */
export const transcribeAudio = async (base64Audio: string, mimeType: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { data: base64Audio, mimeType } },
          { text: "Transcreva exatamente o que é dito neste áudio sobre um relato de sonho. Retorne apenas o texto da transcrição, sem nenhum comentário adicional." }
        ]
      }
    });
    return response.text;
  } catch (error) {
    console.error("Erro na transcrição:", error);
    throw error;
  }
};

/**
 * Interpreta o sonho de forma direta e sem jargões acadêmicos.
 */
export const interpretDream = async (name: string, gender: string, dreamText: string) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  const systemInstruction = `Você é um Intérprete de Sonhos prático e direto.
Sua missão é explicar o significado do sonho do usuário de forma clara e objetiva, sem citar teorias, nomes de psicólogos (como Freud ou Jung) ou termos técnicos complexos.

REGRAS DE RESPOSTA:
1. Comece saudando o usuário pelo nome: "${name}".
2. Use "Prezado" para masculino e "Prezada" para feminino baseado no gênero: "${gender}".
3. Vá direto ao ponto. Diga: "Sua interpretação é a seguinte:" e explique o que os elementos do sonho significam na vida real.
4. Explique a causa e o efeito: "Isso acontece porque...", "Isso representa...".
5. Seja assertivo, empático e evite enrolação.
6. Não use Markdown complexo, apenas negrito para destacar pontos cruciais.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Interprete este sonho de forma direta: "${dreamText}"`,
      config: { 
        systemInstruction,
        temperature: 0.8
      }
    });

    return response.text;
  } catch (error) {
    console.error("Erro na interpretação:", error);
    throw error;
  }
};
