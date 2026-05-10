export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  layout: "modern" | "classic" | "executive" | "creative" | "minimal" | "professional";
}

export const templates: TemplateConfig[] = [
  {
    id: "modern",
    name: "Moderno",
    description: "Diseño limpio y contemporáneo con énfasis en la legibilidad",
    preview: "/templates/modern-preview.png",
    colors: {
      primary: "#2563eb",
      secondary: "#1e40af",
      accent: "#3b82f6",
      background: "#ffffff",
      text: "#1e293b",
    },
    fonts: {
      heading: "Inter",
      body: "Inter",
    },
    layout: "modern",
  },
  {
    id: "classic",
    name: "Clásico",
    description: "Estilo tradicional y profesional, ideal para sectores conservadores",
    preview: "/templates/classic-preview.png",
    colors: {
      primary: "#1e3a8a",
      secondary: "#1e40af",
      accent: "#3b82f6",
      background: "#ffffff",
      text: "#0f172a",
    },
    fonts: {
      heading: "Georgia",
      body: "Arial",
    },
    layout: "classic",
  },
  {
    id: "executive",
    name: "Ejecutivo",
    description: "Diseño elegante para profesionales de alto nivel",
    preview: "/templates/executive-preview.png",
    colors: {
      primary: "#0f172a",
      secondary: "#334155",
      accent: "#64748b",
      background: "#f8fafc",
      text: "#0f172a",
    },
    fonts: {
      heading: "Playfair Display",
      body: "Lato",
    },
    layout: "executive",
  },
  {
    id: "creative",
    name: "Creativo",
    description: "Diseño dinámico para profesionales creativos",
    preview: "/templates/creative-preview.png",
    colors: {
      primary: "#8b5cf6",
      secondary: "#7c3aed",
      accent: "#a78bfa",
      background: "#ffffff",
      text: "#1e293b",
    },
    fonts: {
      heading: "Poppins",
      body: "Open Sans",
    },
    layout: "creative",
  },
  {
    id: "minimal",
    name: "Minimalista",
    description: "Diseño simple y directo, máximo contenido mínimo ruido",
    preview: "/templates/minimal-preview.png",
    colors: {
      primary: "#000000",
      secondary: "#333333",
      accent: "#666666",
      background: "#ffffff",
      text: "#000000",
    },
    fonts: {
      heading: "Helvetica",
      body: "Helvetica",
    },
    layout: "minimal",
  },
  {
    id: "professional",
    name: "Profesional",
    description: "Equilibrio perfecto entre estilo y funcionalidad",
    preview: "/templates/professional-preview.png",
    colors: {
      primary: "#059669",
      secondary: "#047857",
      accent: "#10b981",
      background: "#ffffff",
      text: "#1e293b",
    },
    fonts: {
      heading: "Roboto",
      body: "Roboto",
    },
    layout: "professional",
  },
];

export function getTemplateById(id: string): TemplateConfig | undefined {
  return templates.find((t) => t.id === id);
}
