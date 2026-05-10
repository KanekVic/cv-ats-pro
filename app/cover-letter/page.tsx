import { CoverLetterGenerator } from "@/components/cover-letter/CoverLetterGenerator";
import "./cover-letter.css";

export default function CoverLetterPage() {
  const cvData = {
    fullName: "Juan Pérez",
    email: "juan.perez@email.com",
    phone: "+52 55 1234 5678",
    experience: "5 años de experiencia en desarrollo de software...",
    skills: ["JavaScript", "TypeScript", "React", "Node.js"],
  };

  return (
    <main className="container">
      <div className="page-header">
        <h1>Generador de Carta de Presentación</h1>
        <p>Crea una carta personalizada para cada postulación con IA.</p>
      </div>
      <CoverLetterGenerator cvData={cvData} />
    </main>
  );
}
