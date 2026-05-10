import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface CoverLetterData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  jobDescription: string;
  experience: string;
  skills: string[];
  tone: "professional" | "enthusiastic" | "confident";
  language: string;
}

export async function generateCoverLetter(data: CoverLetterData): Promise<string> {
  const toneInstructions = {
    professional: "mantén un tono formal y profesional",
    enthusiastic: "muestra entusiasmo y energía",
    confident: "demuestra confianza en tus habilidades",
  };

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Eres un experto en redacción de cartas de presentación. Genera una carta de presentación profesional y persuasiva en ${data.language}.

Requisitos:
- Longitud: 300-400 palabras
- Estructura: saludo, párrafo de introducción, cuerpo (2-3 párrafos), conclusión, despedida
- Personalizar para la empresa y puesto específicos
- Destacar habilidades y experiencia relevantes
- Incluir un llamado a la acción
- ${toneInstructions[data.tone]}

Responde ÚNICAMENTE con el texto de la carta, sin encabezados adicionales.`,
      },
      {
        role: "user",
        content: `
Nombre: ${data.fullName}
Email: ${data.email}
Teléfono: ${data.phone}

Empresa: ${data.company}
Puesto: ${data.position}

Descripción de la vacante:
${data.jobDescription}

Experiencia relevante:
${data.experience}

Habilidades clave:
${data.skills.join(", ")}

Genera una carta de presentación personalizada para esta posición.`,
      },
    ],
    temperature: 0.8,
    max_tokens: 1000,
  });

  return response.choices[0].message.content || "";
}
