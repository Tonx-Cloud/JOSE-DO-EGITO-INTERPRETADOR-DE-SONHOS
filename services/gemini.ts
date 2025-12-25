// gemini.ts - Versão corrigida para evitar tela branca no Vite
export const transcribeAudio = async (base64Audio: string, mimeType: string) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY; // Uso do import.meta.env exigido pelo Vite

  if (!apiKey) throw new Error("API Key não configurada.");

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

  const response = await fetch("https://api.groq.com/openai/v1/audio/transcriptions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}` },
    body: formData
  });

  const data = await response.json();
  return data.text;
};

export const interpretDream = async (name: string, gender: string, dreamText: string) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  
  const systemInstruction = `Você é José do Egito. Saude ${name} como ${gender === 'masculino' ? 'Prezado' : 'Prezada'}. Dê uma interpretação profética e direta.`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: `Interprete: ${dreamText}` }
      ],
      model: "llama3-70b-8192",
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
};
