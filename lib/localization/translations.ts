export const translations = {
  es: {
    common: {
      save: "Guardar",
      cancel: "Cancelar",
      delete: "Eliminar",
      edit: "Editar",
      view: "Ver",
      download: "Descargar",
      share: "Compartir",
      search: "Buscar",
      filter: "Filtrar",
      sort: "Ordenar",
      loading: "Cargando...",
      error: "Error",
      success: "Éxito",
    },
    nav: {
      home: "Inicio",
      dashboard: "Panel",
      editor: "Editor",
      ats: "Analizador ATS",
      pricing: "Precios",
      blog: "Blog",
      login: "Iniciar sesión",
      register: "Registrarse",
      logout: "Cerrar sesión",
    },
    cv: {
      personalInfo: "Información Personal",
      summary: "Resumen Profesional",
      experience: "Experiencia Laboral",
      education: "Educación",
      skills: "Habilidades",
      languages: "Idiomas",
      certifications: "Certificaciones",
      projects: "Proyectos",
      volunteer: "Voluntariado",
      references: "Referencias",
    },
    ats: {
      score: "Puntuación ATS",
      keywords: "Palabras Clave",
      found: "Encontradas",
      missing: "Faltantes",
      suggestions: "Sugerencias",
      compatibility: "Compatibilidad",
    },
    pricing: {
      free: "Gratuito",
      basic: "Básico",
      pro: "Pro",
      perMonth: "/mes",
      features: "Características",
      subscribe: "Suscribirse",
    },
  },
};

export function getTranslation(key: string, locale: string = "es") {
  const keys = key.split(".");
  let value: any = translations[locale as keyof typeof translations];

  for (const k of keys) {
    value = value?.[k];
  }

  return value || key;
}
