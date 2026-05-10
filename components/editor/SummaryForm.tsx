"use client";

import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";

interface SummaryFormProps {
  data: string;
  onChange: (data: string) => void;
  experience?: string;
  industry?: string;
}

export function SummaryForm({ data, onChange, experience, industry }: SummaryFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  async function generateWithAI() {
    if (!experience || !industry) {
      alert("Por favor completa tu experiencia e industria primero para usar la IA.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/ai/generate-summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experience, industry, language: "es" }),
      });

      const result = await response.json();
      if (result.summary) {
        onChange(result.summary);
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      alert("Error al generar el resumen con IA. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="form-section">
      <div className="section-header">
        <h3>Resumen Profesional</h3>
        <button
          type="button"
          className="btn-ai"
          onClick={generateWithAI}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 size={16} className="spinner" />
          ) : (
            <Sparkles size={16} />
          )}
          Generar con IA
        </button>
      </div>
      <p className="form-hint">
        Escribe un breve resumen de tu perfil profesional (2-3 líneas) o usa IA para generarlo.
      </p>
      <label className="full-width">
        <textarea
          value={data}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Profesional de tecnología con 5 años de experiencia en desarrollo de software..."
          rows={4}
          maxLength={500}
        />
        <span className="char-count">{data.length}/500</span>
      </label>
    </div>
  );
}
