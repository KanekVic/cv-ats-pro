"use client";

import { useState } from "react";
import { ATSAnalysisResult } from "@/lib/ai/ats-analyzer";
import { FileSearch, Target, AlertTriangle, CheckCircle2, XCircle, Loader2, Sparkles } from "lucide-react";

interface ATSAnalyzerProps {
  cvContent: string;
  onAnalyze?: (analysis: ATSAnalysisResult) => void;
}

export function ATSAnalyzer({ cvContent, onAnalyze }: ATSAnalyzerProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [analysis, setAnalysis] = useState<ATSAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleAnalyze() {
    if (!jobDescription.trim()) {
      alert("Por favor pega la descripción de la vacante.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/ats/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cvContent,
          jobDescription,
          jobTitle,
          language: "es",
        }),
      });

      const result = await response.json();
      if (result.analysis) {
        setAnalysis(result.analysis);
        onAnalyze?.(result.analysis);
      }
    } catch (error) {
      console.error("Error analyzing ATS:", error);
      alert("Error al analizar el CV. Intenta nuevamente.");
    } finally {
      setIsLoading(false);
    }
  }

  function getScoreColor(score: number): string {
    if (score >= 80) return "#16a34a";
    if (score >= 60) return "#eab308";
    return "#dc2626";
  }

  function getScoreLabel(score: number): string {
    if (score >= 80) return "Excelente";
    if (score >= 60) return "Bueno";
    if (score >= 40) return "Regular";
    return "Necesita mejorar";
  }

  return (
    <div className="ats-analyzer">
      <div className="ats-input">
        <h3>Análisis ATS</h3>
        <p className="form-hint">
          Pega la descripción de la vacante para analizar qué tan bien tu CV coincide con los requisitos.
        </p>
        <label className="full-width">
          <span>Título del puesto (opcional)</span>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            placeholder="Senior Software Engineer"
          />
        </label>
        <label className="full-width">
          <span>Descripción de la vacante</span>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Pega aquí la descripción completa de la vacante..."
            rows={8}
          />
        </label>
        <button
          className="btn btn-primary"
          onClick={handleAnalyze}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="spinner" />
              Analizando...
            </>
          ) : (
            <>
              <FileSearch size={18} />
              Analizar CV
            </>
          )}
        </button>
      </div>

      {analysis && (
        <div className="ats-results">
          <div className="score-section">
            <div
              className="score-circle"
              style={{ borderColor: getScoreColor(analysis.score) }}
            >
              <span style={{ color: getScoreColor(analysis.score) }}>
                {analysis.score}
              </span>
              <small>Score ATS</small>
            </div>
            <div className="score-details">
              <strong>{getScoreLabel(analysis.score)}</strong>
              <p>Tu CV tiene un {analysis.score}% de coincidencia con esta vacante.</p>
            </div>
          </div>

          <div className="keywords-section">
            <h4>Palabras clave</h4>
            <div className="keywords-grid">
              <div>
                <span className="label success">
                  <CheckCircle2 size={14} /> Encontradas ({analysis.keywords.found.length})
                </span>
                <div className="keywords-list">
                  {analysis.keywords.found.map((keyword) => (
                    <span key={keyword} className="keyword found">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="label warning">
                  <XCircle size={14} /> Faltantes ({analysis.keywords.missing.length})
                </span>
                <div className="keywords-list">
                  {analysis.keywords.missing.map((keyword) => (
                    <span key={keyword} className="keyword missing">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="suggestions-section">
            <h4>Sugerencias de mejora</h4>
            <div className="suggestions-list">
              {analysis.suggestions.map((suggestion, index) => (
                <div
                  key={index}
                  className={`suggestion-item priority-${suggestion.priority}`}
                >
                  <AlertTriangle size={18} />
                  <div>
                    <strong>{suggestion.category}</strong>
                    <p>{suggestion.issue}</p>
                    <p className="recommendation">{suggestion.recommendation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="compatibility-section">
            <h4>Compatibilidad con plataformas</h4>
            <div className="compatibility-grid">
              {Object.entries(analysis.compatibility).map(([platform, compatible]) => (
                <div
                  key={platform}
                  className={`compatibility-item ${compatible ? "compatible" : "incompatible"}`}
                >
                  {compatible ? (
                    <CheckCircle2 size={20} />
                  ) : (
                    <XCircle size={20} />
                  )}
                  <span>{platform}</span>
                </div>
              ))}
            </div>
          </div>

          {analysis.formatIssues.length > 0 && (
            <div className="format-section">
              <h4>Problemas de formato</h4>
              <ul>
                {analysis.formatIssues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="length-section">
            <h4>Longitud del CV</h4>
            <div className={`length-status ${analysis.length.optimal ? "optimal" : "warning"}`}>
              {analysis.length.optimal ? (
                <CheckCircle2 size={20} />
              ) : (
                <AlertTriangle size={20} />
              )}
              <div>
                <strong>{analysis.length.pages} página(s)</strong>
                <p>{analysis.length.recommendation}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
