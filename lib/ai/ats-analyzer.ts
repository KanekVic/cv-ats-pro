import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ATSAnalysisResult {
  score: number;
  keywords: {
    found: string[];
    missing: string[];
  };
  suggestions: {
    category: string;
    priority: "high" | "medium" | "low";
    issue: string;
    recommendation: string;
  }[];
  compatibility: {
    linkedin: boolean;
    indeed: boolean;
    occ: boolean;
    computrabajo: boolean;
    bumeran: boolean;
    konzerta: boolean;
  };
  formatIssues: string[];
  length: {
    optimal: boolean;
    pages: number;
    recommendation: string;
  };
}

export async function analyzeATS(
  cvContent: string,
  jobDescription: string,
  jobTitle?: string,
  language: string = "es"
): Promise<ATSAnalysisResult> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Eres un experto en sistemas ATS (Applicant Tracking System) y optimización de CVs para el mercado latinoamericano. Analiza el CV contra la descripción del trabajo y proporciona un análisis detallado en formato JSON.

Tu análisis debe incluir:
1. Score ATS (0-100) basado en qué tan bien el CV coincide con la vacante
2. Keywords encontradas y faltantes del CV vs vacante
3. Sugerencias específicas con prioridad (high/medium/low)
4. Compatibilidad con plataformas latinas (LinkedIn, Indeed, OCC, Computrabajo, Bumeran, Konzerta)
5. Problemas de formato que puedan causar rechazo por ATS
6. Análisis de longitud (páginas, si es óptimo)

Responde ÚNICAMENTE con un JSON válido, sin texto adicional. Usa ${language} para el contenido.`,
      },
      {
        role: "user",
        content: `Título del puesto: ${jobTitle || "No especificado"}

Descripción de la vacante:
${jobDescription}

Contenido del CV:
${cvContent}

Analiza este CV contra esta vacante y proporciona el análisis en formato JSON.`,
      },
    ],
    temperature: 0.3,
    max_tokens: 2000,
    response_format: { type: "json_object" },
  });

  const content = response.choices[0].message.content || "{}";
  const analysis = JSON.parse(content);

  return {
    score: analysis.score || 0,
    keywords: analysis.keywords || { found: [], missing: [] },
    suggestions: analysis.suggestions || [],
    compatibility: analysis.compatibility || {
      linkedin: true,
      indeed: true,
      occ: true,
      computrabajo: true,
      bumeran: true,
      konzerta: true,
    },
    formatIssues: analysis.formatIssues || [],
    length: analysis.length || { optimal: true, pages: 1, recommendation: "" },
  };
}

export async function generateImprovementPlan(
  cvContent: string,
  jobDescription: string,
  analysis: ATSAnalysisResult,
  language: string = "es"
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `Eres un experto en optimización de CVs. Basado en el análisis ATS proporcionado, genera un plan de mejoras específico y accionable en ${language}.

El plan debe:
- Estar organizado por prioridad (alta, media, baja)
- Ser específico y accionable
- Incluir ejemplos de cómo aplicar cada mejora
- Estar optimizado para pasar filtros ATS

Usa formato markdown con encabezados y listas.`,
      },
      {
        role: "user",
        content: `Análisis ATS actual:
${JSON.stringify(analysis, null, 2)}

CV actual:
${cvContent}

Descripción de la vacante:
${jobDescription}

Genera un plan de mejoras detallado.`,
      },
    ],
    temperature: 0.7,
    max_tokens: 1500,
  });

  return response.choices[0].message.content || "";
}
