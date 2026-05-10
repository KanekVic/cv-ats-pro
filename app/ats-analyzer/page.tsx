import { ATSAnalyzer } from "@/components/ats/ATSAnalyzer";
import "./ats.css";

export default function ATSAnalyzerPage() {
  const cvContent = "Ejemplo de contenido del CV..."; // TODO: Get from user's CV

  return (
    <main className="container">
      <div className="page-header">
        <h1>Analizador ATS</h1>
        <p>Analiza tu CV contra cualquier vacante para mejorar tus posibilidades de entrevista.</p>
      </div>
      <ATSAnalyzer cvContent={cvContent} />
    </main>
  );
}
