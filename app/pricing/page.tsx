import Link from "next/link";
import { Check, Zap, Crown, ArrowRight } from "lucide-react";
import "./pricing.css";

const plans = [
  {
    name: "Gratuito",
    price: "$0",
    period: "para siempre",
    description: "Perfecto para empezar y probar la plataforma",
    features: [
      "1 CV básico",
      "Análisis ATS básico",
      "Exportación PDF ATS-friendly",
      "Sin IA para generación de contenido",
      "Sin análisis avanzado de vacantes",
    ],
    cta: "Empezar gratis",
    ctaLink: "/register",
    popular: false,
  },
  {
    name: "Básico",
    price: "$119 MXN",
    period: "/mes",
    description: "Para quienes buscan activamente empleo",
    features: [
      "3 CVs ilimitados",
      "Análisis ATS completo",
      "IA para generación de contenido",
      "Exportación PDF visual y ATS",
      "Análisis de vacantes ilimitado",
      "Historial de versiones",
    ],
    cta: "Suscribirse",
    ctaLink: "/api/payments/mercadopago/preference",
    popular: true,
  },
  {
    name: "Pro",
    price: "$299 MXN",
    period: "/mes",
    description: "Para profesionales que maximizan oportunidades",
    features: [
      "CVs ilimitados",
      "Todo lo del plan Básico",
      "Optimizador de LinkedIn",
      "Generador de carta de presentación",
      "Prioridad en soporte",
      "Plantillas premium exclusivas",
      "Análisis comparativo con competencia",
    ],
    cta: "Suscribirse",
    ctaLink: "/api/payments/mercadopago/preference",
    popular: false,
  },
];

const paymentMethods = [
  { name: "Tarjeta de crédito/débito", icon: "💳" },
  { name: "OXXO", icon: "🏪" },
  { name: "SPEI", icon: "🏦" },
  { name: "Mercado Pago", icon: "💰" },
];

export default function PricingPage() {
  return (
    <main className="pricing-page">
      <div className="container">
        <div className="pricing-header">
          <h1>Planes y Precios</h1>
          <p>
            Elige el plan que mejor se adapte a tus necesidades. Todos incluyen
            acceso completo a las funcionalidades principales.
          </p>
        </div>

        <div className="payment-methods">
          <strong>Métodos de pago aceptados:</strong>
          <div className="methods-grid">
            {paymentMethods.map((method) => (
              <span key={method.name}>
                {method.icon} {method.name}
              </span>
            ))}
          </div>
        </div>

        <div className="plans-grid">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`plan-card ${plan.popular ? "popular" : ""}`}
            >
              {plan.popular && <div className="popular-badge">Más popular</div>}
              <div className="plan-header">
                <div className="plan-icon">
                  {plan.name === "Pro" ? (
                    <Crown size={32} />
                  ) : plan.name === "Básico" ? (
                    <Zap size={32} />
                  ) : (
                    <Check size={32} />
                  )}
                </div>
                <h2>{plan.name}</h2>
                <p className="plan-description">{plan.description}</p>
              </div>
              <div className="plan-price">
                <span className="price">{plan.price}</span>
                <span className="period">{plan.period}</span>
              </div>
              <ul className="plan-features">
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <Check size={16} />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href={plan.ctaLink} className="btn btn-primary">
                {plan.cta}
                <ArrowRight size={18} />
              </Link>
            </div>
          ))}
        </div>

        <div className="faq-section">
          <h2>Preguntas frecuentes</h2>
          <div className="faq-grid">
            <details className="faq-item">
              <summary>
                <strong>¿Puedo cambiar de plan?</strong>
              </summary>
              <p>
                Sí, puedes cambiar de plan en cualquier momento desde tu panel de
                usuario. Los cambios se aplican inmediatamente.
              </p>
            </details>
            <details className="faq-item">
              <summary>
                <strong>¿Hay garantía de devolución?</strong>
              </summary>
              <p>
                Ofrecemos una garantía de 7 días. Si no estás satisfecho con el
                servicio, te devolvemos tu dinero sin preguntas.
              </p>
            </details>
            <details className="faq-item">
              <summary>
                <strong>¿Qué pasa si cancelo mi suscripción?</strong>
              </summary>
              <p>
                Si cancelas, mantendrás acceso a todas las funciones hasta el
                final de tu periodo de facturación actual.
              </p>
            </details>
            <details className="faq-item">
              <summary>
                <strong>¿Los precios incluyen impuestos?</strong>
              </summary>
              <p>
                Los precios mostrados son en MXN e incluyen IVA. No hay cargos
                ocultos adicionales.
              </p>
            </details>
          </div>
        </div>
      </div>
    </main>
  );
}
