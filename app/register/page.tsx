import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import "../auth.css";

export default function RegisterPage() {
  return (
    <main className="auth-shell">
      <aside className="auth-panel">
        <Link href="/" className="brand">
          <span className="brand-mark">CV</span>
          <span>CV + ATS</span>
        </Link>
        <div>
          <h1>Empieza con una cuenta gratuita.</h1>
          <p>Guarda tus análisis, adapta tu CV a cada vacante y construye un historial de mejoras.</p>
        </div>
      </aside>
      <section className="auth-content">
        <div className="auth-card">
          <h2>Crear cuenta</h2>
          <p>Configura tu acceso inicial para desbloquear el panel de análisis.</p>
          <AuthForm mode="register" />
          <div className="auth-switch">
            ¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
