import OpenAI from "openai";
import { CVContent } from "@/types/cv";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function extractCVFromText(text: string, language: string = "es"): Promise<Partial<CVContent>> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Eres un experto en extracción de información de CVs. Extrae la información del CV proporcionado y organízala en un JSON válido.

El JSON debe tener esta estructura:
{
  "personalInfo": {
    "firstName": "Nombre",
    "lastName": "Apellido",
    "email": "email@example.com",
    "phone": "+52 55 1234 5678",
    "linkedin": "https://linkedin.com/in/...",
    "city": "Ciudad",
    "country": "País"
  },
  "summary": "Resumen profesional",
  "experience": [
    {
      "company": "Empresa",
      "position": "Puesto",
      "startDate": "2020-01",
      "endDate": "2022-12",
      "current": false,
      "description": "Descripción de responsabilidades y logros",
      "location": "Ciudad, País"
    }
  ],
  "education": [
    {
      "institution": "Institución",
      "degree": "Título",
      "field": "Campo de estudio",
      "startDate": "2015-01",
      "endDate": "2019-12",
      "current": false,
      "gpa": "9.5/10"
    }
  ],
  "skills": ["Habilidad1", "Habilidad2"],
  "languages": [
    {
      "name": "Español",
      "level": "Nativo"
    }
  ],
  "certifications": [
    {
      "name": "Certificación",
      "issuer": "Emisor",
      "date": "2020-01",
      "credentialUrl": "https://..."
    }
  ]
}

Instrucciones:
- Extrae toda la información posible del texto
- Si un campo no está presente, usa string vacío o array vacío
- Las fechas deben estar en formato YYYY-MM
- current debe ser true si la experiencia/educación está en curso
- Responde ÚNICAMENTE con el JSON, sin texto adicional
- El idioma del contenido debe ser ${language}`,
      },
      {
        role: "user",
        content: text,
      },
    ],
    temperature: 0.3,
    max_tokens: 3000,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message.content || "{}";
  const extractedData = JSON.parse(content);

  return extractedData as Partial<CVContent>;
}
