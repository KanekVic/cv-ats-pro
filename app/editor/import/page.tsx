"use client";

import { useState } from "react";
import { DocumentImporter } from "@/components/import/DocumentImporter";
import { CVEditor } from "@/components/editor/CVEditor";
import { CVContent } from "@/types/cv";
import "./document-importer.css";

export default function ImportCVPage() {
  const [cvData, setCvData] = useState<Partial<CVContent>>({});

  function handleDataExtracted(data: Partial<CVContent>) {
    setCvData(data);
  }

  function handleSave(data: CVContent) {
    console.log("Saving imported CV:", data);
    // TODO: Save to database
  }

  return (
    <main className="container">
      <div className="import-page">
        <div className="import-section">
          <DocumentImporter onDataExtracted={handleDataExtracted} />
        </div>

        {Object.keys(cvData).length > 0 && (
          <div className="editor-section">
            <CVEditor
              initialData={cvData as CVContent}
              onSave={handleSave}
            />
          </div>
        )}
      </div>
    </main>
  );
}
