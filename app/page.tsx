import Link from "next/link";
import { ArrowRight, CheckCircle2, FileSearch, ShieldCheck, Sparkles, Target, Star, Zap, Globe, Award } from "lucide-react";

const features = [
  {
    icon: FileSearch,
    title: "Análisis ATS inmediato",
    text: "Detecta palabras clave faltantes, formato riesgoso y secciones incompletas antes de postular.",
  },
  {
    icon: Target,
    title: "CV alineado a la vacante",
    text: "Compara tu currículum con la descripción del puesto y prioriza mejoras de alto impacto.",
  },
  {
    icon: ShieldCheck,
    title: "Perfil privado y seguro",
    text: "Mantén tus documentos y avances organizados en una cuenta personal desde el primer día.",
  },
];

const steps = ["Sube tu CV", "Pega la vacante", "Recibe mejoras accionables"];

const platforms = [
  "LinkedIn Easy Apply",
  "Indeed",
  "OCC Mundial",
  "Computrabajo",
  "Bumeran",
  "Konzerta",
];

const testimonials = [
  {
    name: "María González",
    role: "Ingeniera de Software",
    location: "Ciudad de México",
    text: "En 2 semanas optimicé mi CV y recibí 5 entrevistas. El análisis ATS fue clave para entender qué faltaba.",
    rating: 5,
  },
  {
    name: "Carlos Rodríguez",
    role: "Gerente de Ventas",
    location: "Bogotá, Colombia",
    text: "La función de pegar la vacante y ver el match exacto me ayudó a adaptar mi CV a cada oferta. Increíble.",
    rating: 5,
  },
  {
    name: "Ana Martínez",
    role: "Diseñadora UX",
    location: "Buenos Aires, Argentina",
    text: "Pasé de 0 a 3 entrevistas en una semana usando las sugerencias de IA. 100% recomendado.",
    rating: 5,
  },
];

const faqs = [
  {
    question: "¿Qué es un filtro ATS?",
    answer: "ATS significa Applicant Tracking System. Es un software que las empresas usan para filtrar CVs automáticamente. Nuestra herramienta optimiza tu CV para pasar estos filtros.",
  },
  {
    question: "¿Es gratis empezar?",
    answer: "Sí, puedes crear una cuenta gratuita y comenzar a optimizar tu CV. El plan gratuito incluye 1 CV básico y análisis ATS básico.",
  },
  {
    question: "¿En qué países funciona?",
    answer: "CV ATS Pro está diseñado específicamente para Latinoamérica: México, Colombia, Argentina, Chile, Perú y más. Analizamos filtros ATS de plataformas como OCC, Computrabajo, Bumeran, etc.",
  },
  {
    question: "¿Cómo funciona el análisis ATS?",
    answer: "Pegas la descripción de la vacante y nuestro sistema analiza tu CV contra esa oferta. Te damos un score del 0 al 100 y sugerencias específicas para mejorar.",
  },
];

const competitors = [
  { name: "Zety", price: "$23.70/mes", ourPrice: "$5.99/mes", highlight: false },
  { name: "Resume.io", price: "$19.95/mes", ourPrice: "$5.99/mes", highlight: false },
  { name: "Kickresume", price: "$19/mes", ourPrice: "$5.99/mes", highlight: false },
  { name: "CV ATS Pro", price: "$5.99/mes", ourPrice: "Nuestro precio", highlight: true },
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: "CV ATS Pro",
            applicationCategory: "BusinessApplication",
            operatingSystem: "Web",
            offers: {
              "@type": "Offer",
              price: "5.99",
              priceCurrency: "USD",
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.8",
              ratingCount: "150",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: faq.answer,
              },
            })),
          }),
        }}
      />

      <main>
        <header className="site-header">
          <nav className="container nav">
            <Link href="/" className="brand">
              <span className="brand-mark">CV</span>
              <span>CV ATS Pro</span>
            </Link>
            <div className="nav-actions">
              <Link href="/login" className="login-link">Iniciar sesión</Link>
              <Link href="/register" className="btn btn-primary">Crear cuenta</Link>
            </div>
          </nav>
        </header>

        <section className="hero container">
          <div className="hero-copy">
            <div className="eyebrow">
              <Sparkles size={16} /> Optimización de CV para sistemas ATS
            </div>
            <h1>Convierte tu CV en una herramienta diseñada para conseguir entrevistas.</h1>
            <p>
              Analiza tu currículum, compáralo contra ofertas reales y recibe recomendaciones claras para superar filtros ATS de LinkedIn, Indeed, OCC, Computrabajo y más.
            </p>
            <div className="hero-actions">
              <Link href="/register" className="btn btn-primary">
                Empezar gratis <ArrowRight size={18} />
              </Link>
              <Link href="#como-funciona" className="btn btn-secondary">Ver cómo funciona</Link>
            </div>
            <div className="trust-row">
              <CheckCircle2 size={18} /> Sin tarjeta requerida
              <CheckCircle2 size={18} /> Primer análisis guiado
              <CheckCircle2 size={18} /> Optimizado para LatAm
            </div>
          </div>

          <div className="hero-card" aria-label="Vista previa de análisis ATS">
            <div className="score-ring">
              <span>86</span>
              <small>Score ATS</small>
            </div>
            <div className="audit-list">
              <div><strong>+18%</strong><span>Match con vacante</span></div>
              <div><strong>12</strong><span>Keywords detectadas</span></div>
              <div><strong>4</strong><span>Mejoras prioritarias</span></div>
            </div>
          </div>
        </section>

        <section className="container section-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <feature.icon size={28} />
              <h2>{feature.title}</h2>
              <p>{feature.text}</p>
            </article>
          ))}
        </section>

        <section id="como-funciona" className="container how-it-works">
          <div>
            <span className="section-label">Cómo funciona</span>
            <h2>Un flujo simple para mejorar cada postulación.</h2>
          </div>
          <div className="steps">
            {steps.map((step, index) => (
              <div className="step" key={step}>
                <span>{index + 1}</span>
                <strong>{step}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="container platforms-section">
          <span className="section-label">Plataformas compatibles</span>
          <h2>Tu CV optimizado para todos los principales portales de empleo en Latinoamérica.</h2>
          <div className="platforms-grid">
            {platforms.map((platform) => (
              <div className="platform-item" key={platform}>
                <Globe size={20} />
                <span>{platform}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="container testimonials-section">
          <span className="section-label">Casos de éxito</span>
          <h2>Más de 150 profesionales han conseguido entrevistas usando CV ATS Pro.</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <article className="testimonial-card" key={testimonial.name}>
                <div className="rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#f59e0b" />
                  ))}
                </div>
                <p>"{testimonial.text}"</p>
                <div className="author">
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.role}</span>
                  <span>{testimonial.location}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="container comparison-section">
          <span className="section-label">Comparativa de precios</span>
          <h2>Más accesible que la competencia, optimizado para Latinoamérica.</h2>
          <div className="comparison-table">
            {competitors.map((competitor) => (
              <div className={`comparison-row ${competitor.highlight ? "highlight" : ""}`} key={competitor.name}>
                <strong>{competitor.name}</strong>
                <span>{competitor.price}</span>
                {competitor.highlight && <Award className="badge" size={20} />}
              </div>
            ))}
          </div>
          <div className="comparison-note">
            <Zap size={16} />
            <p>Aceptamos pagos en OXXO, SPEI, Mercado Pago y tarjetas. Precios en MXN disponibles.</p>
          </div>
        </section>

        <section className="container faq-section">
          <span className="section-label">Preguntas frecuentes</span>
          <h2>Todo lo que necesitas saber sobre CV ATS Pro.</h2>
          <div className="faq-grid">
            {faqs.map((faq, index) => (
              <details className="faq-item" key={index}>
                <summary>
                  <strong>{faq.question}</strong>
                </summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="container cta-section">
          <div className="cta-card">
            <h2>¿Listo para conseguir más entrevistas?</h2>
            <p>Optimiza tu CV hoy y comienza a recibir llamadas de reclutadores.</p>
            <Link href="/register" className="btn btn-primary">
              Empezar gratis <ArrowRight size={18} />
            </Link>
          </div>
        </section>

        <footer className="site-footer">
          <div className="container footer-content">
            <div className="footer-brand">
              <Link href="/" className="brand">
                <span className="brand-mark">CV</span>
                <span>CV ATS Pro</span>
              </Link>
              <p>Optimiza tu CV para pasar filtros ATS en Latinoamérica.</p>
            </div>
            <div className="footer-links">
              <div>
                <strong>Producto</strong>
                <Link href="/pricing">Precios</Link>
                <Link href="/features">Funcionalidades</Link>
                <Link href="/templates">Plantillas</Link>
              </div>
              <div>
                <strong>Recursos</strong>
                <Link href="/blog">Blog</Link>
                <Link href="/guides">Guías de CV</Link>
                <Link href="/faq">FAQ</Link>
              </div>
              <div>
                <strong>Legal</strong>
                <Link href="/privacy">Privacidad</Link>
                <Link href="/terms">Términos</Link>
              </div>
            </div>
          </div>
          <div className="container footer-bottom">
            <p>© 2024 CV ATS Pro. Todos los derechos reservados.</p>
            <div className="social-links">
              <Link href="#">LinkedIn</Link>
              <Link href="#">Twitter</Link>
              <Link href="#">Instagram</Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
