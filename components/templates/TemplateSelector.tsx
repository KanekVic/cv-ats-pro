"use client";

import { templates, getTemplateById, TemplateConfig } from "@/types/template";

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
}

export function TemplateSelector({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) {
  return (
    <div className="template-selector">
      <h3>Selecciona una Plantilla</h3>
      <p className="form-hint">
        Elige el diseño que mejor represente tu perfil profesional
      </p>

      <div className="templates-grid">
        {templates.map((template) => (
          <button
            key={template.id}
            className={`template-card ${selectedTemplate === template.id ? "selected" : ""}`}
            onClick={() => onTemplateChange(template.id)}
          >
            <div
              className="template-preview"
              style={{
                background: template.colors.primary,
                color: template.colors.text,
              }}
            >
              <div
                className="template-header"
                style={{ background: template.colors.secondary }}
              />
              <div className="template-body">
                <div className="template-line" style={{ background: template.colors.accent }} />
                <div className="template-line short" style={{ background: template.colors.text }} />
                <div className="template-line" style={{ background: template.colors.text }} />
              </div>
            </div>
            <div className="template-info">
              <strong>{template.name}</strong>
              <span>{template.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
