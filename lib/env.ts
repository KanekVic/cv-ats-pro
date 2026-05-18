// Environment variable validation for Vercel deployment
const requiredEnvVars = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
] as const;

const optionalEnvVars = [
  "OPENAI_API_KEY",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "MERCADOPAGO_ACCESS_TOKEN",
  "NEXT_PUBLIC_APP_URL",
] as const;

export function validateEnv() {
  const missing: string[] = [];

  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(", ")}`);
    if (process.env.NODE_ENV === "production") {
      throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
    }
  }
}

export function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.warn(`Environment variable ${name} is not set`);
    return "";
  }
  return value;
}
