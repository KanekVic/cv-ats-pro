import OpenAI from "openai";

let openai: OpenAI | null = null;

function getOpenAI() {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openai;
}

export async function generateSummary(
  experience: string,
  industry: string,
  language: string = "es"
): Promise<string> {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Eres un experto en redacción de CVs profesionales. Genera un resumen profesional conciso (2-3 líneas, máximo 150 palabras) en ${language} basado en la experiencia del usuario. El resumen debe destacar habilidades clave, logros y objetivos profesionales. Adáptalo a la industria de ${industry}.`,
      },
      {
        role: "user",
        content: experience,
      },
    ],
    temperature: 0.7,
    max_tokens: 200,
  });

  return response.choices[0].message.content || "";
}

export async function generateBullets(
  position: string,
  company: string,
  industry: string,
  existingBullets: string[] = [],
  language: string = "es"
): Promise<string[]> {
  const existingText = existingBullets.length > 0 
    ? `Aquí están los bullets actuales (mejóralos o genera nuevos si es necesario):\n${existingBullets.join("\n")}`
    : "Genera bullets nuevos desde cero.";

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Eres un experto en redacción de CVs. Genera 3-5 bullets de logros profesionales para un puesto de ${position} en ${company} en la industria de ${industry}. 

Requisitos:
- Cada bullet debe comenzar con un verbo de acción fuerte
- Incluir métricas cuantificables cuando sea posible (%, números, resultados)
- Ser específico y conciso
- Estar en ${language}
- Formato: un bullet por línea

${existingText}`,
      },
      {
        role: "user",
        content: "Genera los bullets de logros para esta experiencia.",
      },
    ],
    temperature: 0.7,
    max_tokens: 400,
  });

  const content = response.choices[0].message.content || "";
  return content.split("\n").filter((line) => line.trim().length > 0);
}

export async function suggestSkills(
  industry: string,
  position: string,
  experience: string,
  language: string = "es"
): Promise<string[]> {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Eres un experto en RRHH y tecnología. Sugiere 8-12 habilidades relevantes (tanto técnicas como blandas) para un ${position} en la industria de ${industry}. Basa las sugerencias en la experiencia proporcionada.

Requisitos:
- Incluir habilidades técnicas específicas de la industria
- Incluir habilidades blandas relevantes
- Estar en ${language}
- Una habilidad por línea
- Sin numeración, solo el nombre de la habilidad`,
      },
      {
        role: "user",
        content: experience,
      },
    ],
    temperature: 0.7,
    max_tokens: 300,
  });

  const content = response.choices[0].message.content || "";
  return content.split("\n").filter((line) => line.trim().length > 0);
}

export async function improveText(
  text: string,
  context: string,
  language: string = "es"
): Promise<string> {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Eres un experto en redacción profesional. Mejora el texto proporcionado para que sea más profesional, impactante y efectivo para un CV.

Contexto: ${context}

Requisitos:
- Mantener el significado original
- Usar lenguaje más profesional
- Ser más conciso y directo
- Estar en ${language}
- No inventar información nueva`,
      },
      {
        role: "user",
        content: text,
      },
    ],
    temperature: 0.5,
    max_tokens: 300,
  });

  return response.choices[0].message.content || text;
}
