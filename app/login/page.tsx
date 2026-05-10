import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import "../auth.css";

export default function LoginPage() {
  return (
    <main className="auth-shell">
      <aside className="auth-panel">
        <Link href="/" className="brand">
          <span className="brand-mark">CV</span>
          <span>CV + ATS</span>
        </Link>
        <div>
          <h1>Vuelve a tu panel de optimización.</h1>
          <p>Continúa mejorando tu CV, revisa análisis anteriores y prepara tu siguiente postulación.</p>
        </div>
      </aside>
      <section className="auth-content">
        <div className="auth-card">
          <h2>Iniciar sesión</h2>
          <p>Accede con tu email para entrar al panel del prototipo.</p>
          <AuthForm mode="login" />
          <div className="auth-switch">
            ¿No tienes cuenta? <Link href="/register">Crea una gratis</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
