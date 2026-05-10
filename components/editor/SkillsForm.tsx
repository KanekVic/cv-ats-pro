"use client";

import { Skill } from "@/types/cv";
import { Plus, Trash2 } from "lucide-react";

interface SkillsFormProps {
  data: Skill[];
  onChange: (data: Skill[]) => void;
}

export function SkillsForm({ data, onChange }: SkillsFormProps) {
  function addSkill() {
    onChange([...data, { id: Date.now().toString(), name: "", level: "intermediate" }]);
  }

  function updateSkill(id: string, field: keyof Skill, value: any) {
    onChange(data.map((skill) => (skill.id === id ? { ...skill, [field]: value } : skill)));
  }

  function removeSkill(id: string) {
    onChange(data.filter((skill) => skill.id !== id));
  }

  return (
    <div className="form-section">
      <h3>Habilidades</h3>
      <p className="form-hint">
        Incluye tanto habilidades técnicas como blandas relevantes para el puesto.
      </p>
      {data.map((skill, index) => (
        <div key={skill.id} className="skill-item">
          <div className="item-header">
            <strong>Habilidad {index + 1}</strong>
            <button
              type="button"
              className="btn-icon"
              onClick={() => removeSkill(skill.id)}
            >
              <Trash2 size={18} />
            </button>
          </div>
          <div className="form-grid">
            <label className="full-width">
              <span>Nombre de la habilidad</span>
              <input
                type="text"
                value={skill.name}
                onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
                placeholder="JavaScript, Liderazgo, Comunicación, etc."
                required
              />
            </label>
            <label className="full-width">
              <span>Nivel</span>
              <select
                value={skill.level}
                onChange={(e) => updateSkill(skill.id, "level", e.target.value)}
              >
                <option value="beginner">Principiante</option>
                <option value="intermediate">Intermedio</option>
                <option value="advanced">Avanzado</option>
                <option value="expert">Experto</option>
              </select>
            </label>
          </div>
        </div>
      ))}
      <button type="button" className="btn btn-secondary" onClick={addSkill}>
        <Plus size={18} /> Agregar habilidad
      </button>
    </div>
  );
}
