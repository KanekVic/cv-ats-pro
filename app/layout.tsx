import type { Metadata, Viewport } from "next";
import { Inter, Roboto, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "@/components/providers";
import { LocalizationProvider } from "@/lib/localization/context";

const inter = Inter({ 
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const roboto = Roboto({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

const playfair = Playfair_Display({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "CV ATS Pro - Optimizador de CVs con IA para América Latina",
  description: "Crea CVs optimizados para ATS con IA. Analiza tu CV contra vacantes, genera contenido con IA y aumenta tus posibilidades de entrevista en México, Colombia, Argentina, Chile y Perú.",
  keywords: "CV, ATS, optimizador, IA, Latinoamérica, México, Colombia, Argentina, Chile, Perú, currículum, empleo",
  authors: [{ name: "CV ATS Pro" }],
  openGraph: {
    title: "CV ATS Pro - Optimizador de CVs con IA",
    description: "Crea CVs optimizados para ATS con IA para América Latina",
    type: "website",
    locale: "es_MX",
    siteName: "CV ATS Pro",
  },
  twitter: {
    card: "summary_large_image",
    title: "CV ATS Pro - Optimizador de CVs con IA",
    description: "Crea CVs optimizados para ATS con IA para América Latina",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${roboto.variable} ${playfair.variable}`}>
      <body className={inter.className}>
        <LocalizationProvider>
          <SessionProvider>{children}</SessionProvider>
        </LocalizationProvider>
      </body>
    </html>
  );
}
