"use client";

import { useState } from "react";
import { Sparkles, Loader2, Download, Copy } from "lucide-react";

interface CoverLetterGeneratorProps {
  cvData?: {
    fullName: string;
    email: string;
    phone: string;
    experience: string;
    skills: string[];
  };
}

export function CoverLetterGenerator({ cvData }: CoverLetterGeneratorProps) {
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState<"professional" | "enthusiastic" | "confident">("professional");
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleGenerate() {
    if (!company || !position || !jobDescription) {
      alert("Por favor completa la empresa, puesto y descripción de la vacante.");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: cvData?.fullName || "",
          email: cvData?.email || "",
          phone: cvData?.phone || "",
          company,
          position,
          jobDescription,
          experience: cvData?.experience || "",
          skills: cvData?.skills || [],
          tone,
          language: "es",
        }),
      });

      const result = await response.json();
      if (result.coverLetter) {
        setGeneratedLetter(result.coverLetter);
      }
    } catch (error) {
      console.error("Error generating cover letter:", error);
      alert("Error al generar la carta de presentación. Intenta nuevamente.");
    } finally {
      setIsGenerating(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(generatedLetter);
    alert("Carta copiada al portapapeles");
  }

  function handleDownload() {
    const blob = new Blob([generatedLetter], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "carta-presentacion.txt";
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  return (
    <div className="cover-letter-generator">
      <div className="generator-input">
        <h3>Generador de Carta de Presentación</h3>
        <p className="form-hint">
          Completa los detalles de la vacante y generaremos una carta personalizada para ti.
        </p>

        <label>
          <span>Empresa</span>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Google"
            required
          />
        </label>

        <label>
          <span>Puesto</span>
          <input
            type="text"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            placeholder="Senior Software Engineer"
            required
          />
        </label>

        <label className="full-width">
          <span>Descripción de la vacante</span>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Pega aquí la descripción completa de la vacante..."
            rows={6}
            required
          />
        </label>

        <label>
          <span>Tono</span>
          <select value={tone} onChange={(e) => setTone(e.target.value as any)}>
            <option value="professional">Profesional</option>
            <option value="enthusiastic">Entusiasta</option>
            <option value="confident">Confidente</option>
          </select>
        </label>

        <button
          className="btn btn-primary"
          onClick={handleGenerate}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 size={18} className="spinner" />
              Generando...
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Generar carta
            </>
          )}
        </button>
      </div>

      {generatedLetter && (
        <div className="generated-letter">
          <div className="letter-header">
            <h4>Carta Generada</h4>
            <div className="letter-actions">
              <button className="btn-icon" onClick={handleCopy} title="Copiar">
                <Copy size={18} />
              </button>
              <button className="btn-icon" onClick={handleDownload} title="Descargar">
                <Download size={18} />
              </button>
            </div>
          </div>
          <div className="letter-content">{generatedLetter}</div>
        </div>
      )}
    </div>
  );
}
