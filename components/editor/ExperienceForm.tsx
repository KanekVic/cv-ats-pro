"use client";

import { Experience } from "@/types/cv";
import { Plus, Trash2 } from "lucide-react";

interface ExperienceFormProps {
  data: Experience[];
  onChange: (data: Experience[]) => void;
}

export function ExperienceForm({ data, onChange }: ExperienceFormProps) {
  function addExperience() {
    onChange([
      ...data,
      {
        id: Date.now().toString(),
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
        location: "",
      },
    ]);
  }

  function updateExperience(id: string, field: keyof Experience, value: any) {
    onChange(data.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)));
  }

  function removeExperience(id: string) {
    onChange(data.filter((exp) => exp.id !== id));
  }

  return (
    <div className="form-section">
      <h3>Experiencia Laboral</h3>
      <p className="form-hint">
        Lista tu experiencia laboral más reciente. Usa verbos de acción y cuantifica logros cuando sea posible.
      </p>
      {data.map((exp, index) => (
        <div key={exp.id} className="experience-item">
          <div className="item-header">
            <strong>Experiencia {index + 1}</strong>
            <button
              type="button"
              className="btn-icon"
              onClick={() => removeExperience(exp.id)}
            >
              <Trash2 size={18} />
            </button>
          </div>
          <div className="form-grid">
            <label>
              <span>Empresa</span>
              <input
                type="text"
                value={exp.company}
                onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                placeholder="Google"
                required
              />
            </label>
            <label>
              <span>Puesto</span>
              <input
                type="text"
                value={exp.position}
                onChange={(e) => updateExperience(exp.id, "position", e.target.value)}
                placeholder="Senior Software Engineer"
                required
              />
            </label>
            <label>
              <span>Fecha inicio</span>
              <input
                type="month"
                value={exp.startDate}
                onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                required
              />
            </label>
            <label>
              <span>Fecha fin</span>
              <input
                type="month"
                value={exp.endDate || ""}
                onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                disabled={exp.current}
              />
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={exp.current}
                onChange={(e) => {
                  updateExperience(exp.id, "current", e.target.checked);
                  if (e.target.checked) updateExperience(exp.id, "endDate", "");
                }}
              />
              <span>Trabajo actual</span>
            </label>
            <label>
              <span>Ubicación (opcional)</span>
              <input
                type="text"
                value={exp.location || ""}
                onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                placeholder="Ciudad de México"
              />
            </label>
            <label className="full-width">
              <span>Descripción</span>
              <textarea
                value={exp.description}
                onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                placeholder="• Desarrollé y mantuve sistemas críticos...&#10;• Lideré un equipo de 5 desarrolladores...&#10;• Reduje el tiempo de carga en un 40%..."
                rows={5}
                required
              />
            </label>
          </div>
        </div>
      ))}
      <button type="button" className="btn btn-secondary" onClick={addExperience}>
        <Plus size={18} /> Agregar experiencia
      </button>
    </div>
  );
}
