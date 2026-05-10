"use client";

import { Education } from "@/types/cv";
import { Plus, Trash2 } from "lucide-react";

interface EducationFormProps {
  data: Education[];
  onChange: (data: Education[]) => void;
}

export function EducationForm({ data, onChange }: EducationFormProps) {
  function addEducation() {
    onChange([
      ...data,
      {
        id: Date.now().toString(),
        institution: "",
        degree: "",
        field: "",
        startDate: "",
        endDate: "",
        current: false,
        gpa: "",
      },
    ]);
  }

  function updateEducation(id: string, field: keyof Education, value: any) {
    onChange(data.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)));
  }

  function removeEducation(id: string) {
    onChange(data.filter((edu) => edu.id !== id));
  }

  return (
    <div className="form-section">
      <h3>Educación</h3>
      <p className="form-hint">
        Incluye tu educación formal, títulos y certificaciones académicas.
      </p>
      {data.map((edu, index) => (
        <div key={edu.id} className="education-item">
          <div className="item-header">
            <strong>Educación {index + 1}</strong>
            <button
              type="button"
              className="btn-icon"
              onClick={() => removeEducation(edu.id)}
            >
              <Trash2 size={18} />
            </button>
          </div>
          <div className="form-grid">
            <label>
              <span>Institución</span>
              <input
                type="text"
                value={edu.institution}
                onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                placeholder="Universidad Nacional Autónoma de México"
                required
              />
            </label>
            <label>
              <span>Título</span>
              <input
                type="text"
                value={edu.degree}
                onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                placeholder="Licenciatura en Ingeniería de Software"
                required
              />
            </label>
            <label>
              <span>Campo de estudio</span>
              <input
                type="text"
                value={edu.field}
                onChange={(e) => updateEducation(edu.id, "field", e.target.value)}
                placeholder="Ciencias de la Computación"
                required
              />
            </label>
            <label>
              <span>Fecha inicio</span>
              <input
                type="month"
                value={edu.startDate}
                onChange={(e) => updateEducation(edu.id, "startDate", e.target.value)}
                required
              />
            </label>
            <label>
              <span>Fecha fin</span>
              <input
                type="month"
                value={edu.endDate || ""}
                onChange={(e) => updateEducation(edu.id, "endDate", e.target.value)}
                disabled={edu.current}
              />
            </label>
            <label className="checkbox">
              <input
                type="checkbox"
                checked={edu.current}
                onChange={(e) => {
                  updateEducation(edu.id, "current", e.target.checked);
                  if (e.target.checked) updateEducation(edu.id, "endDate", "");
                }}
              />
              <span>Estudios actuales</span>
            </label>
            <label>
              <span>Promedio (opcional)</span>
              <input
                type="text"
                value={edu.gpa || ""}
                onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)}
                placeholder="9.5 / 10"
              />
            </label>
          </div>
        </div>
      ))}
      <button type="button" className="btn btn-secondary" onClick={addEducation}>
        <Plus size={18} /> Agregar educación
      </button>
    </div>
  );
}
