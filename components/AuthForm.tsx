"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth";

type AuthFormProps = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const isRegister = mode === "register";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      if (isRegister) {
        // For registration, we'll create the user in the database
        // For now, redirect to login after "registration"
        // In production, you'd call an API to create the user
        router.push("/login");
      } else {
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          setError("Credenciales inválidas");
        } else {
          router.push("/dashboard");
          router.refresh();
        }
      }
    } catch (err) {
      setError("Ocurrió un error. Intenta nuevamente.");
    }
  }

  async function handleGoogleSignIn() {
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {isRegister ? (
        <label>
          Nombre completo
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Tu nombre"
            required
          />
        </label>
      ) : null}

      <label>
        Email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="tu@email.com"
          required
        />
      </label>

      <label>
        Contraseña
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Mínimo 8 caracteres"
          minLength={8}
          required
        />
      </label>

      {error && <div className="error-message">{error}</div>}

      <button className="btn btn-primary" type="submit">
        {isRegister ? "Crear cuenta" : "Entrar al panel"}
      </button>

      <button
        type="button"
        className="btn btn-secondary"
        onClick={handleGoogleSignIn}
      >
        Continuar con Google
      </button>
    </form>
  );
}
