"use client";

import { PersonalInfo } from "@/types/cv";

interface PersonalInfoFormProps {
  data: PersonalInfo;
  onChange: (data: PersonalInfo) => void;
}

export function PersonalInfoForm({ data, onChange }: PersonalInfoFormProps) {
  function handleChange(field: keyof PersonalInfo, value: string) {
    onChange({ ...data, [field]: value });
  }

  return (
    <div className="form-section">
      <h3>Información Personal</h3>
      <div className="form-grid">
        <label>
          <span>Nombre</span>
          <input
            type="text"
            value={data.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
            placeholder="Juan"
            required
          />
        </label>
        <label>
          <span>Apellido</span>
          <input
            type="text"
            value={data.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
            placeholder="Pérez"
            required
          />
        </label>
        <label>
          <span>Email</span>
          <input
            type="email"
            value={data.email}
            onChange={(e) => handleChange("email", e.target.value)}
            placeholder="juan.perez@email.com"
            required
          />
        </label>
        <label>
          <span>Teléfono</span>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            placeholder="+52 55 1234 5678"
            required
          />
        </label>
        <label>
          <span>LinkedIn (opcional)</span>
          <input
            type="url"
            value={data.linkedin || ""}
            onChange={(e) => handleChange("linkedin", e.target.value)}
            placeholder="https://linkedin.com/in/juanperez"
          />
        </label>
        <label>
          <span>Ciudad</span>
          <input
            type="text"
            value={data.city}
            onChange={(e) => handleChange("city", e.target.value)}
            placeholder="Ciudad de México"
            required
          />
        </label>
        <label className="full-width">
          <span>País</span>
          <input
            type="text"
            value={data.country}
            onChange={(e) => handleChange("country", e.target.value)}
            placeholder="México"
            required
          />
        </label>
      </div>
    </div>
  );
}
