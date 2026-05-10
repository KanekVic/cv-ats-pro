"use client";

import { useState, useRef } from "react";
import { Upload, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { CVContent } from "@/types/cv";

interface DocumentImporterProps {
  onDataExtracted: (data: Partial<CVContent>) => void;
}

export function DocumentImporter({ onDataExtracted }: DocumentImporterProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadedFile(file);
    await processFile(file);
  }

  function handleDragOver(event: React.DragEvent) {
    event.preventDefault();
  }

  function handleDrop(event: React.DragEvent) {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setUploadedFile(file);
      processFile(file);
    }
  }

  async function processFile(file: File) {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("language", "es");

      const response = await fetch("/api/import/parse", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.cvData) {
        setIsExtracting(true);
        onDataExtracted(result.cvData);
      }
    } catch (error) {
      console.error("Error processing file:", error);
      alert("Error al procesar el archivo. Intenta nuevamente.");
    } finally {
      setIsUploading(false);
      setIsExtracting(false);
    }
  }

  return (
    <div className="document-importer">
      <h3>Importar CV Existente</h3>
      <p className="form-hint">
        Sube tu CV actual en PDF o DOCX y nuestra IA extraerá automáticamente la información.
      </p>

      <div
        className={`upload-zone ${isUploading ? "uploading" : ""}`}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx"
          onChange={handleFileSelect}
          style={{ display: "none" }}
        />
        
        {isUploading ? (
          <div className="uploading-state">
            <Loader2 size={48} className="spinner" />
            <p>Procesando documento...</p>
          </div>
        ) : isExtracting ? (
          <div className="uploading-state">
            <Loader2 size={48} className="spinner" />
            <p>Extrayendo información con IA...</p>
          </div>
        ) : uploadedFile ? (
          <div className="uploaded-state">
            <CheckCircle2 size={48} />
            <p>{uploadedFile.name}</p>
            <span className="file-size">{(uploadedFile.size / 1024).toFixed(2)} KB</span>
          </div>
        ) : (
          <div className="upload-prompt">
            <Upload size={48} />
            <p>Arrastra tu CV aquí o haz clic para seleccionar</p>
            <span className="file-types">PDF o DOCX</span>
          </div>
        )}
      </div>

      {uploadedFile && !isUploading && !isExtracting && (
        <button
          className="btn btn-secondary"
          onClick={() => fileInputRef.current?.click()}
        >
          <FileText size={18} /> Cargar otro archivo
        </button>
      )}
    </div>
  );
}
