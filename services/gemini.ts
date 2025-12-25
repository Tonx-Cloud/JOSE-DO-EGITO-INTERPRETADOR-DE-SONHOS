// gemini.ts - Versão Otimizada para Groq + Vite/Vercel

/**
 * Transcreve o áudio utilizando o modelo Whisper via Groq.
 * Padrão Vite: utiliza import.meta.env para acessar chaves.
 */
export const transcribeAudio = async (base64Audio: string, mimeType: string) => {
  // Captura a chave configurada na Vercel (deve começar com VITE_)
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("API Key da Groq não encontrada. Verifique as Environment Variables.");
  }

  // Lógica de conversão: Base64 -> Blob (necessário para o formulário de envio)
  const byteCharacters = atob(base64Audio);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const audioBlob = new Blob([byteArray], { type: mimeType });

  const formData = new FormData();
  formData.append("file", audioBlob, "audio.webm");
  formData.append("model", "whisper-large-v3");
  formData.append("language", "pt");

  try {
    const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`
      },
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Erro na transcrição");
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Erro técnico na transcrição Groq:", error);
    throw error;
  }
};

/**
 * Interpreta o sonho utilizando a persona de José do Egito via Llama 3 (Groq).
 */
export const interpretDream = async (name: string, gender: string, dreamText: string) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key da Groq não encontrada.");
  }

  const systemInstruction = `Você é José do Egito, mestre dos sonhos. 
Saude o usuário pelo nome: "${name}". 
Use "Prezado" para masculino e "Prezada" para feminino baseado no gênero: "${gender}". 
Sua linguagem é sábia e profunda. Dê uma interpretação profética e direta. 
Não cite nomes de psicólogos ou termos técnicos acadêmicos. 
Destaque em negrito apenas as revelações cruciais.`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemInstruction },
          { role: "user", content: `Interprete este sonho: "${dreamText}"` }
        ],
        model: "llama3-70b-8192", // Modelo de alta performance
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Erro na interpretação");
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Erro técnico na interpretação Groq:", error);
    throw error;
  }
};
