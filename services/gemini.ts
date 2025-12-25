/**
 * Transcreve o áudio utilizando o modelo Whisper via Groq (Gratuito e Rápido)
 */
export const transcribeAudio = async (base64Audio: string, mimeType: string) => {
  const apiKey = process.env.GROQ_API_KEY;

  // Convertendo Base64 para Blob para enviar via FormData
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

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Erro na transcrição Groq:", error);
    throw error;
  }
};

/**
 * Interpreta o sonho utilizando Llama 3 via Groq
 */
export const interpretDream = async (name: string, gender: string, dreamText: string) => {
  const apiKey = process.env.GROQ_API_KEY;
  
  const systemInstruction = `Você é José do Egito, mestre dos sonhos.
Saude o usuário pelo nome: "${name}".
Use "Prezado" para masculino e "Prezada" para feminino baseado no gênero: "${gender}".
Dê uma interpretação profética, direta e profunda. Não cite psicólogos ou termos técnicos.
Use negrito apenas para pontos cruciais.`;

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
        model: "llama3-70b-8192", // Modelo mais potente da Groq
        temperature: 0.7
      })
    });

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Erro na interpretação Groq:", error);
    throw error;
  }
};
