"use client";

import { Language } from "@/types/cv";
import { Plus, Trash2 } from "lucide-react";

interface LanguagesFormProps {
  data: Language[];
  onChange: (data: Language[]) => void;
}

export function LanguagesForm({ data, onChange }: LanguagesFormProps) {
  function addLanguage() {
    onChange([...data, { id: Date.now().toString(), name: "", level: "conversational" }]);
  }

  function updateLanguage(id: string, field: keyof Language, value: any) {
    onChange(data.map((lang) => (lang.id === id ? { ...lang, [field]: value } : lang)));
  }

  function removeLanguage(id: string) {
    onChange(data.filter((lang) => lang.id !== id));
  }

  return (
    <div className="form-section">
      <h3>Idiomas</h3>
      <p className="form-hint">
        Lista los idiomas que hablas y tu nivel de dominio.
      </p>
      {data.map((lang, index) => (
        <div key={lang.id} className="language-item">
          <div className="item-header">
            <strong>Idioma {index + 1}</strong>
            <button
              type="button"
              className="btn-icon"
              onClick={() => removeLanguage(lang.id)}
            >
              <Trash2 size={18} />
            </button>
          </div>
          <div className="form-grid">
            <label>
              <span>Idioma</span>
              <input
                type="text"
                value={lang.name}
                onChange={(e) => updateLanguage(lang.id, "name", e.target.value)}
                placeholder="Español, Inglés, Francés, etc."
                required
              />
            </label>
            <label>
              <span>Nivel</span>
              <select
                value={lang.level}
                onChange={(e) => updateLanguage(lang.id, "level", e.target.value)}
              >
                <option value="basic">Básico</option>
                <option value="conversational">Conversacional</option>
                <option value="fluent">Fluido</option>
                <option value="native">Nativo</option>
              </select>
            </label>
          </div>
        </div>
      ))}
      <button type="button" className="btn btn-secondary" onClick={addLanguage}>
        <Plus size={18} /> Agregar idioma
      </button>
    </div>
  );
}
