"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowRight, Check, Briefcase, Building2, FileText, Upload, Sparkles } from "lucide-react";
import { prisma } from "@/lib/db/prisma";
import "./styles.css";

const objectives = [
  { id: "buscar_empleo", label: "Buscar empleo", icon: Briefcase, description: "Estoy buscando mi primer trabajo o una nueva oportunidad" },
  { id: "cambiar_trabajo", label: "Cambiar de trabajo", icon: Sparkles, description: "Quiero avanzar en mi carrera profesional" },
  { id: "mejorar_cv", label: "Mejorar mi CV actual", icon: FileText, description: "Ya tengo CV pero quiero optimizarlo" },
];

const industries = [
  "Tecnología",
  "Salud",
  "Finanzas",
  "Ventas",
  "Marketing",
  "Recursos Humanos",
  "Ingeniería",
  "Educación",
  "Diseño",
  "Administración",
  "Legal",
  "Otra",
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [step, setStep] = useState(1);
  const [objective, setObjective] = useState("");
  const [industry, setIndustry] = useState("");
  const [hasCV, setHasCV] = useState<boolean | null>(null);

  if (status === "loading") {
    return <div className="container" style={{ padding: "100px 0", textAlign: "center" }}>Cargando...</div>;
  }

  if (!session) {
    router.replace("/login");
    return null;
  }

  async function handleComplete() {
    if (!session?.user?.id) return;

    try {
      await prisma.onboarding.upsert({
        where: { userId: session.user.id },
        update: {
          objective,
          industry,
          hasCV: hasCV || false,
          completed: true,
          completedAt: new Date(),
        },
        create: {
          userId: session.user.id,
          objective,
          industry,
          hasCV: hasCV || false,
          completed: true,
          completedAt: new Date(),
        },
      });

      router.push(hasCV ? "/editor/import" : "/editor/new");
    } catch (error) {
      console.error("Error completing onboarding:", error);
    }
  }

  return (
    <main className="onboarding-shell">
      <div className="container onboarding-container">
        <div className="onboarding-progress">
          <div className={`step ${step >= 1 ? "active" : ""}`}>1</div>
          <div className={`line ${step >= 2 ? "active" : ""}`} />
          <div className={`step ${step >= 2 ? "active" : ""}`}>2</div>
          <div className={`line ${step >= 3 ? "active" : ""}`} />
          <div className={`step ${step >= 3 ? "active" : ""}`}>3</div>
        </div>

        {step === 1 && (
          <div className="onboarding-step">
            <h1>¿Cuál es tu objetivo principal?</h1>
            <p>Selecciona la opción que mejor describa tu situación actual</p>
            <div className="options-grid">
              {objectives.map((obj) => {
                const Icon = obj.icon;
                return (
                  <button
                    key={obj.id}
                    className={`option-card ${objective === obj.id ? "selected" : ""}`}
                    onClick={() => setObjective(obj.id)}
                  >
                    <Icon size={32} />
                    <strong>{obj.label}</strong>
                    <span>{obj.description}</span>
                    {objective === obj.id && <Check className="check-icon" size={20} />}
                  </button>
                );
              })}
            </div>
            <button
              className="btn btn-primary"
              disabled={!objective}
              onClick={() => setStep(2)}
            >
              Continuar <ArrowRight size={18} />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="onboarding-step">
            <h1>¿En qué industria trabajas?</h1>
            <p>Esto nos ayudará a personalizar las sugerencias de IA para tu CV</p>
            <div className="options-grid">
              {industries.map((ind) => (
                <button
                  key={ind}
                  className={`option-card ${industry === ind ? "selected" : ""}`}
                  onClick={() => setIndustry(ind)}
                >
                  <Building2 size={32} />
                  <strong>{ind}</strong>
                  {industry === ind && <Check className="check-icon" size={20} />}
                </button>
              ))}
            </div>
            <div className="step-actions">
              <button className="btn btn-secondary" onClick={() => setStep(1)}>
                Atrás
              </button>
              <button
                className="btn btn-primary"
                disabled={!industry}
                onClick={() => setStep(3)}
              >
                Continuar <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="onboarding-step">
            <h1>¿Tienes un CV actual?</h1>
            <p>Puedes importar tu CV existente o crear uno desde cero con ayuda de IA</p>
            <div className="options-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)", maxWidth: "600px" }}>
              <button
                className={`option-card ${hasCV === true ? "selected" : ""}`}
                onClick={() => setHasCV(true)}
              >
                <Upload size={32} />
                <strong>Sí, quiero importar mi CV</strong>
                <span>Sube tu CV en PDF o DOCX</span>
                {hasCV === true && <Check className="check-icon" size={20} />}
              </button>
              <button
                className={`option-card ${hasCV === false ? "selected" : ""}`}
                onClick={() => setHasCV(false)}
              >
                <FileText size={32} />
                <strong>No, crear desde cero</strong>
                <span>Usa nuestra IA para generar tu CV</span>
                {hasCV === false && <Check className="check-icon" size={20} />}
              </button>
            </div>
            <div className="step-actions">
              <button className="btn btn-secondary" onClick={() => setStep(2)}>
                Atrás
              </button>
              <button
                className="btn btn-primary"
                disabled={hasCV === null}
                onClick={handleComplete}
              >
                Comenzar <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
