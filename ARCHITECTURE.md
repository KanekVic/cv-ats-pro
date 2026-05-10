# Arquitectura Técnica - CV ATS Pro

## Nombre de la Plataforma
**CV ATS Pro** - Optimiza tu CV para pasar filtros ATS en Latinoamérica

## Stack Tecnológico Definitivo

### Frontend
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Estilos**: TailwindCSS + CSS Modules
- **UI Components**: shadcn/ui (Radix UI + Tailwind)
- **Iconos**: Lucide React
- **Estado**: React Context + Zustand (para estado global complejo)
- **Forms**: React Hook Form + Zod validation
- **PDF Generation**: react-pdf / jsPDF
- **Document Parsing**: pdf-parse + mammoth (para DOCX)

### Backend
- **API**: Next.js API Routes (Edge Runtime donde sea posible)
- **Base de datos**: PostgreSQL (Neon o Supabase)
- **ORM**: Prisma
- **Cache**: Redis (Upstash)
- **Autenticación**: NextAuth v5 (Auth.js)
- **File Storage**: AWS S3 o Cloudflare R2
- **Email**: Resend

### IA
- **Primary**: OpenAI API (GPT-4o)
- **Fallback**: Anthropic Claude 3.5 Sonnet
- **Prompt Engineering**: System prompts específicos por país/industria

### Pagos
- **Primary**: MercadoPago (LatAm focus)
- **Secondary**: Stripe (internacional)
- **Metodos**: Tarjeta, OXXO, SPEI, Mercado Pago, PayPal

### Hosting & Deploy
- **Frontend**: Vercel
- **Database**: Neon (PostgreSQL serverless)
- **Cache**: Upstash (Redis serverless)
- **Storage**: Cloudflare R2 (S3-compatible)
- **Email**: Resend

### SEO
- **Framework**: Next.js SSR/SSG
- **Schema**: structured-data JSON-LD
- **Sitemap**: next-sitemap
- **Analytics**: Vercel Analytics + Google Analytics 4

## Estructura de Carpetas

```
windsurf-project/
├── app/                          # Next.js App Router
│   ├── (marketing)/             # Landing, blog, pricing
│   │   ├── page.tsx
│   │   ├── pricing/
│   │   ├── blog/
│   │   └── faq/
│   ├── (auth)/                  # Login, register, onboarding
│   │   ├── login/
│   │   ├── register/
│   │   └── onboarding/
│   ├── (app)/                   # App principal protegida
│   │   ├── dashboard/
│   │   ├── editor/
│   │   ├── ats-analyzer/
│   │   └── settings/
│   ├── api/                     # API Routes
│   │   ├── auth/
│   │   ├── cv/
│   │   ├── ai/
│   │   ├── payments/
│   │   └── upload/
│   ├── layout.tsx
│   ├── globals.css
│   └── sitemap.ts
├── components/
│   ├── ui/                      # shadcn/ui components
│   ├── auth/                    # Auth components
│   ├── editor/                  # CV editor components
│   ├── ats/                     # ATS analyzer components
│   ├── pricing/                 # Pricing components
│   └── layout/                  # Layout components
├── lib/
│   ├── db/                      # Prisma client
│   ├── auth.ts                  # NextAuth config
│   ├── ai/                      # OpenAI/Anthropic clients
│   ├── payments/                # MercadoPago/Stripe
│   ├── pdf/                     # PDF generation
│   └── utils.ts                 # Helper functions
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── public/
│   ├── images/
│   └── templates/               # CV templates
└── types/
    └── index.ts                 # TypeScript types
```

## Schema de Base de Datos (Prisma)

```prisma
model User {
  id            String   @id @default(cuid())
  email         String   @unique
  name          String?
  image         String?
  plan          Plan     @default(FREE)
  country       String?  // MX, CO, AR, CL, PE
  onboarding    Onboarding?
  cvs           CV[]
  subscriptions Subscription[]
  payments      Payment[]
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Onboarding {
  id          String   @id @default(cuid())
  userId      String   @unique
  user        User     @relation(fields: [userId], references: [id])
  objective   String?  // buscar_empleo, cambiar_trabajo, mejorar_cv
  industry    String?  // tecnologia, salud, finanzas, etc
  hasCV       Boolean  @default(false)
  completed   Boolean  @default(false)
  completedAt DateTime?
}

model CV {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  name        String   // "CV para Google", "CV para Amazon", etc
  template    Template @default(MODERN)
  color       String   @default("#2563eb")
  content     Json     // Estructura completa del CV
  versions    CVVersion[]
  analyses    ATSAnalysis[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model CVVersion {
  id        String   @id @default(cuid())
  cvId      String
  cv        CV       @relation(fields: [cvId], references: [id])
  version   Int
  content   Json
  createdAt DateTime @default(now())
}

model ATSAnalysis {
  id           String   @id @default(cuid())
  cvId         String
  cv           CV       @relation(fields: [cvId], references: [id])
  jobTitle     String?
  jobDescription String @db.Text
  score        Int      // 0-100
  keywords     Json     // { found: [], missing: [] }
  suggestions  Json     // Array de sugerencias
  compatibility Json    // { linkedin: true, indeed: true, occ: true, etc }
  createdAt    DateTime @default(now())
}

model Subscription {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  plan        Plan
  status      SubscriptionStatus
  currentPeriodStart DateTime
  currentPeriodEnd   DateTime
  cancelAt    DateTime?
  createdAt   DateTime @default(now())
}

model Payment {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  amount      Decimal  @db.Decimal(10, 2)
  currency    String   @default("MXN")
  method      PaymentMethod
  status      PaymentStatus
  metadata    Json?
  createdAt   DateTime @default(now())
}

model BlogPost {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  content     String   @db.Text
  excerpt     String?
  metaDescription String?
  keywords    String[] // Array de keywords para SEO
  published   Boolean  @default(false)
  publishedAt DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

enum Plan {
  FREE
  BASIC
  PRO
}

enum Template {
  MODERN
  CLASSIC
  EXECUTIVE
  CREATIVE
  TECHNICAL
  BILINGUAL
}

enum SubscriptionStatus {
  ACTIVE
  CANCELLED
  EXPIRED
  PENDING
}

enum PaymentMethod {
  STRIPE_CARD
  STRIPE_OXXO
  MERCADOPAGO_CARD
  MERCADOPAGO_OXXO
  MERCADOPAGO_SPEI
  MERCADOPAGO_QR
  PAYPAL
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
  REFUNDED
}
```

## API Endpoints Principales

### Auth
- `POST /api/auth/signin` - Email/password
- `POST /api/auth/signup` - Registro
- `GET /api/auth/session` - Obtener sesión
- `POST /api/auth/signout` - Logout
- `GET /api/auth/providers` - OAuth providers (Google, LinkedIn)

### CV
- `GET /api/cv` - Listar CVs del usuario
- `POST /api/cv` - Crear nuevo CV
- `GET /api/cv/[id]` - Obtener CV específico
- `PUT /api/cv/[id]` - Actualizar CV
- `DELETE /api/cv/[id]` - Eliminar CV
- `POST /api/cv/[id]/duplicate` - Duplicar CV
- `GET /api/cv/[id]/versions` - Listar versiones
- `POST /api/cv/[id]/export` - Exportar PDF/DOCX

### AI
- `POST /api/ai/generate-summary` - Generar resumen profesional
- `POST /api/ai/generate-bullets` - Generar bullets de experiencia
- `POST /api/ai/improve-text` - Mejorar texto específico
- `POST /api/ai/suggest-skills` - Sugerir habilidades por industria
- `POST /api/ai/cover-letter` - Generar carta de presentación
- `POST /api/ai/linkedin-optimize` - Optimizar perfil LinkedIn

### ATS
- `POST /api/ats/analyze` - Analizar CV contra vacante
- `GET /api/ats/analysis/[id]` - Obtener análisis específico

### Upload
- `POST /api/upload/cv` - Subir PDF/DOCX
- `POST /api/upload/avatar` - Subir avatar

### Payments
- `POST /api/payments/create-checkout` - Crear checkout session
- `POST /api/payments/webhook` - Webhook de MercadoPago/Stripe
- `GET /api/payments/history` - Historial de pagos
- `POST /api/payments/cancel-subscription` - Cancelar suscripción

## Variables de Entorno

```env
# Database
DATABASE_URL=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=

# AI
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# Payments
MERCADOPAGO_ACCESS_TOKEN=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Storage
CLOUDFLARE_R2_ACCOUNT_ID=
CLOUDFLARE_R2_ACCESS_KEY_ID=
CLOUDFLARE_R2_SECRET_ACCESS_KEY=
CLOUDFLARE_R2_BUCKET=

# Email
RESEND_API_KEY=

# App
NEXT_PUBLIC_APP_URL=
```

## Estrategia de SEO

### Meta Tags por Página
- Landing: "Crear CV gratis | Optimiza tu CV para filtros ATS en Latinoamérica"
- Editor: "Editor de CV con IA | CV ATS Pro"
- Pricing: "Precios | CV ATS Pro - Planes accesibles en MXN"
- Blog: Artículos optimizados para keywords long-tail

### Schema Markup
- SoftwareApplication para la herramienta
- FAQPage para FAQs
- HowTo para guías
- Review para testimonios
- Article para blog posts

### Sitemap
- Generación automática con next-sitemap
- Incluir todas las páginas estáticas + blog posts
- Prioridad: Landing (1.0), Features (0.9), Blog (0.7)

### Performance
- LCP < 2.5s
- CLS < 0.1
- FID < 100ms
- Lazy loading de imágenes
- Code splitting por ruta
- Edge functions donde sea posible

## Estrategia de Localización

Soporte inicial para:
- México (MXN, español MX)
- Colombia (COP, español CO)
- Argentina (ARS, español AR)
- Chile (CLP, español CL)
- Perú (PEN, español PE)

Implementación:
- i18n con next-intl
- Detección automática por IP/header
- Selector manual de país
- Precios en moneda local
- Contenido adaptado (ej: "curriculum" vs "currículum")

## Roadmap de Implementación

### Fase 1 - Foundation (Sprint 1-2)
- ✅ Landing page básica
- ✅ Auth simple con localStorage
- ⏳ Configurar PostgreSQL + Prisma
- ⏳ Implementar NextAuth completo
- ⏳ Onboarding de 3 pasos
- ⏳ Mejorar landing con SEO completo

### Fase 2 - Core MVP (Sprint 3-5)
- Editor de CV base con todas las secciones
- Integración OpenAI para generación de contenido
- Importador de PDF/DOCX
- Optimizador ATS básico
- 3 plantillas visuales iniciales
- Exportación PDF básica

### Fase 3 - Monetización (Sprint 6-7)
- Integración MercadoPago
- Sistema de planes y suscripciones
- Dashboard de usuario completo
- Historial de versiones

### Fase 4 - Scale (Sprint 8+)
- 3 plantillas adicionales
- Carta de presentación
- LinkedIn optimizer
- Blog con CMS
- Localización completa
- Optimización performance
