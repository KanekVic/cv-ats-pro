"use client";

import { useState, useEffect } from "react";
import { CVContent } from "@/types/cv";
import { PersonalInfoForm } from "./PersonalInfoForm";
import { SummaryForm } from "./SummaryForm";
import { ExperienceForm } from "./ExperienceForm";
import { EducationForm } from "./EducationForm";
import { SkillsForm } from "./SkillsForm";
import { LanguagesForm } from "./LanguagesForm";
import { Save, Eye, Download, Loader2, History } from "lucide-react";
import { pdf } from "@react-pdf/renderer";
import { CVPDFDocument } from "@/components/pdf/CVPDFDocument";
import { ATSPDFDocument } from "@/components/pdf/ATSPDFDocument";

interface CVEditorProps {
  initialData?: CVContent;
  cvId?: string;
  onSave: (data: CVContent) => void;
  onSaveVersion?: (cvId: string, data: CVContent) => void;
}

const emptyCV: CVContent = {
  personalInfo: {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    linkedin: "",
    city: "",
    country: "",
  },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  projects: [],
  volunteer: [],
  references: [],
};

export function CVEditor({ initialData, cvId, onSave, onSaveVersion }: CVEditorProps) {
  const [data, setData] = useState<CVContent>(initialData || emptyCV);
  const [activeTab, setActiveTab] = useState("personal");
  const [isExporting, setIsExporting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const tabs = [
    { id: "personal", label: "Información Personal" },
    { id: "summary", label: "Resumen" },
    { id: "experience", label: "Experiencia" },
    { id: "education", label: "Educación" },
    { id: "skills", label: "Habilidades" },
    { id: "languages", label: "Idiomas" },
  ];

  async function handleExport(type: "visual" | "ats") {
    setIsExporting(true);
    try {
      const pdfDoc =
        type === "ats" ? (
          <ATSPDFDocument data={data} />
        ) : (
          <CVPDFDocument data={data} template="modern" color="#2563eb" />
        );

      const pdfBlob = await pdf(pdfDoc).toBlob();
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cv-${type}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Error al exportar el PDF. Intenta nuevamente.");
    } finally {
      setIsExporting(false);
    }
  }

  async function handleSave() {
    setIsSaving(true);
    try {
      onSave(data);

      if (cvId && onSaveVersion) {
        await onSaveVersion(cvId, data);
      }
    } catch (error) {
      console.error("Error saving CV:", error);
      alert("Error al guardar el CV. Intenta nuevamente.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="cv-editor">
      <div className="editor-header">
        <h1>Editor de CV</h1>
        <div className="editor-actions">
          {cvId && (
            <button
              className="btn btn-secondary"
              onClick={() => setShowHistory(!showHistory)}
            >
              <History size={18} /> Historial
            </button>
          )}
          <button className="btn btn-secondary">
            <Eye size={18} /> Vista previa
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleExport("visual")}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 size={18} className="spinner" />
                Exportando...
              </>
            ) : (
              <>
                <Download size={18} /> PDF Visual
              </>
            )}
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => handleExport("ats")}
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <Loader2 size={18} className="spinner" />
                Exportando...
              </>
            ) : (
              <>
                <Download size={18} /> PDF ATS
              </>
            )}
          </button>
          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <Loader2 size={18} className="spinner" />
                Guardando...
              </>
            ) : (
              <>
                <Save size={18} /> Guardar
              </>
            )}
          </button>
        </div>
      </div>

      {showHistory && (
        <div className="version-history">
          <h3>Historial de Versiones</h3>
          <p className="form-hint">
            Las versiones se guardan automáticamente al guardar el CV.
          </p>
          {/* Version history would be loaded here */}
          <div className="version-list">
            <div className="version-item current">
              <strong>Versión actual</strong>
              <span>Hace unos minutos</span>
            </div>
          </div>
        </div>
      )}

      <div className="editor-content">
        <div className="editor-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="editor-form">
          {activeTab === "personal" && (
            <PersonalInfoForm
              data={data.personalInfo}
              onChange={(personalInfo) => setData({ ...data, personalInfo })}
            />
          )}
          {activeTab === "summary" && (
            <SummaryForm
              data={data.summary}
              onChange={(summary) => setData({ ...data, summary })}
            />
          )}
          {activeTab === "experience" && (
            <ExperienceForm
              data={data.experience}
              onChange={(experience) => setData({ ...data, experience })}
            />
          )}
          {activeTab === "education" && (
            <EducationForm
              data={data.education}
              onChange={(education) => setData({ ...data, education })}
            />
          )}
          {activeTab === "skills" && (
            <SkillsForm
              data={data.skills}
              onChange={(skills) => setData({ ...data, skills })}
            />
          )}
          {activeTab === "languages" && (
            <LanguagesForm
              data={data.languages}
              onChange={(languages) => setData({ ...data, languages })}
            />
          )}
        </div>
      </div>
    </div>
  );
}
