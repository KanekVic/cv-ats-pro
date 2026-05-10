"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth";
import { useSession } from "next-auth/react";

export function DashboardShell() {
  const router = useRouter();
  const { data: session, status } = useSession();

  async function handleLogout() {
    await signOut({ redirect: false });
    router.replace("/");
  }

  if (status === "loading") {
    return <div className="dashboard-shell">Cargando...</div>;
  }

  if (!session) {
    router.replace("/login");
    return null;
  }

  return (
    <main className="dashboard-shell">
      <nav className="dashboard-nav">
        <Link href="/" className="brand">
          <span className="brand-mark">CV</span>
          <span>CV ATS Pro</span>
        </Link>
        <button className="btn btn-secondary" type="button" onClick={handleLogout}>Cerrar sesión</button>
      </nav>
      <section className="dashboard-hero">
        <span>Bienvenido, {session.user.name}</span>
        <h1>Tu panel ATS está listo para el siguiente módulo.</h1>
        <p>Desde aquí podremos añadir carga de CV, análisis contra vacantes, historial de reportes y recomendaciones con IA.</p>
      </section>
      <section className="dashboard-grid">
        <article>
          <strong>CVs analizados</strong>
          <span>0</span>
        </article>
        <article>
          <strong>Score promedio</strong>
          <span>--</span>
        </article>
        <article>
          <strong>Plan actual</strong>
          <span>{session.user.plan}</span>
        </article>
      </section>
    </main>
  );
}
