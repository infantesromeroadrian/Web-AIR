# Portfolio Web-AIR -- Architecture Document

**Author:** ARCA (AI Research & Code Architect)
**Date:** 2026-04-10
**Status:** APPROVED -- 2026-04-10
**Version:** 1.0

---

## 1. Vision

> Un reclutador entiende quien es Adrian Infantes en 10 segundos,
> quiere saber mas en 30 segundos, y recuerda la web al dia siguiente.

### 1.1 Target Audience (Dual)

| Audiencia | Que necesita entender | Como lo conseguimos |
|-----------|----------------------|---------------------|
| **Headhunter generalista** | "Que hace este tio y por que es valioso" -- en lenguaje de negocio | Subtitulo human-readable bajo el titulo tecnico. Metricas de impacto en euros/porcentajes, no en tecnicismos. Logos de empresas reconocibles (BBVA, Capgemini). Progresion clara Junior->Architect |
| **Reclutador tecnico** | "Que sabe hacer exactamente y a que nivel" -- stack, depth, pruebas | Skills grid detallado, repos con codigo real, videos de demo, badges verificables (Kaggle, HTB), tags de tecnologias en cada proyecto |

**Regla de comunicacion dual:** Cada seccion tiene dos capas de lectura:
1. **Capa superficial** (escaneo de 5s): titulos claros, metricas grandes, logos, progresion visual. Un headhunter que no sabe que es LangGraph entiende "+22% deteccion de fraude en BBVA".
2. **Capa profunda** (exploracion de 30s+): tags tecnicos, links a repos, videos de demo, detalles expandibles. El CTO que revisa el perfil puede verificar profundidad real.

**Principios:**
- **Show, don't tell** -- demos integrados, no bullet points
- **El portfolio ES el proyecto** -- la propia web demuestra capacidad tecnica
- **Claridad > creatividad** -- jerarquia visual clara, zero friction
- **Mobile-first** -- muchos reclutadores revisan desde el movil
- **Performance** -- <1s FCP, Lighthouse 95+
- **Dual readability** -- cada seccion legible tanto para negocio como para tech

---

## 2. Technology Stack

| Layer | Tech | Version | Justificacion |
|-------|------|---------|---------------|
| **Framework** | Astro | 5.x | Zero JS by default, islands architecture, SSG, SEO nativo. Un portfolio es contenido estatico con toques interactivos -- Astro nacio para esto |
| **UI Islands** | React | 19.x | Solo para componentes interactivos (hero animation, project carousel, skill visualization). El 80% de la pagina es Astro puro (0 JS) |
| **Styling** | Tailwind CSS | 4.x | Utility-first, dark mode nativo, responsive sin media queries manuales, purge agresivo |
| **Animations** | Framer Motion | 12.x | Scroll-triggered animations, mount/unmount transitions, gesture support. Solo en React islands |
| **3D/Visual** | Three.js + R3F | latest | SOLO para hero background (network/particle visualization). Lazy-loaded, con fallback estatico en mobile |
| **Icons** | Lucide React | latest | Iconos SVG tree-shakeable, consistentes, ligeros |
| **Language** | TypeScript | 5.x | Type safety en componentes, content collections tipadas |
| **Deploy** | Vercel | -- | Edge network global, preview deploys, analytics integrado, dominio custom |
| **Video** | HTML5 native | -- | Videos MP4 servidos desde CDN/Vercel, no YouTube embeds (evitar trackers, controlar UX) |

### Descartado y por que

| Tech | Razon de descarte |
|------|-------------------|
| Next.js | Overengineered para un site estatico. Mas JS del necesario |
| Three.js full scene | Demasiado pesado. Solo un canvas en el hero, lazy-loaded |
| YouTube embeds | Trackers, perdida de control de UX, CLS por iframes |
| CMS (Sanity/Strapi) | Innecesario. Content hardcoded en TypeScript -- Adrian actualiza via PR |
| i18n runtime | Overengineered. Si se necesita bilingue, build-time con rutas /en/ y /es/ |

---

## 3. Architecture

### 3.1 Islands Architecture (Astro)

```
Page (Astro - 0 JS)
|-- Header (Astro - static)
|-- HeroSection (React Island - client:visible)
|   |-- ParticleNetwork (Three.js - lazy loaded)
|   |-- TypewriterText (Framer Motion)
|-- AboutSection (Astro - static)
|-- ExperienceTimeline (React Island - client:visible)
|   |-- TimelineNode (Framer Motion - scroll animated)
|-- ProjectsShowcase (React Island - client:visible)
|   |-- ProjectCard (video + hover interactions)
|-- SkillsVisualization (React Island - client:visible)
|   |-- SkillCategory (animated counters)
|-- AchievementsBar (Astro - static with CSS animations)
|-- ContactSection (Astro - static links)
|-- Footer (Astro - static)
```

**Regla:** Si un componente no necesita JavaScript interactivo, es Astro puro. React solo donde hay state, gestures, o animaciones complejas.

### 3.2 Hydration Strategy

| Componente | Directiva | Razon |
|------------|-----------|-------|
| HeroSection | `client:load` | Above the fold, visible inmediatamente |
| ExperienceTimeline | `client:visible` | Hydrata solo cuando el usuario hace scroll hasta alli |
| ProjectsShowcase | `client:visible` | Videos no se cargan hasta que son visibles |
| SkillsVisualization | `client:visible` | Animaciones de contadores al entrar en viewport |

### 3.3 Single Page Layout

Una sola pagina con smooth scroll entre secciones. No multi-page. Razones:
- Reclutadores no navegan -- hacen scroll
- Reduce complejidad de routing
- Mejor performance percibida
- Anclas para deep-linking (#projects, #experience, etc.)

---

## 4. Sections & Components

### 4.1 Hero Section

**Objetivo:** En 5 segundos, CUALQUIER reclutador sabe: nombre, que hace, y por que importa.

```
+--------------------------------------------------+
|  [Particle Network Background - subtle, dark]    |
|                                                   |
|  Adrian Infantes                                  |
|  AI Security Engineer                             |
|                                                   |
|  I protect AI systems from the attacks            |
|  that haven't been invented yet._                 |
|                                                   |
|  [CTA: View Work]  [CTA: Contact]                |
|                                                   |
|  [BBVA logo] [Kaggle] [HackTheBox]               |
+--------------------------------------------------+
```

- **Background:** Canvas con particulas conectadas formando una red neuronal. Colores: cyan/emerald sobre negro. Mobile: imagen estatica fallback (ahorro de bateria y rendimiento)
- **Titulo tecnico + subtitulo humano:** "AI Security Engineer" es el titulo. Debajo, una frase que cualquier persona entiende: "I protect AI systems from the attacks that haven't been invented yet." -- sin jerga, con impacto
- **Typewriter effect** (debajo del subtitulo, capa secundaria para tecnicos):
  - "206+ attacks against Foundation Models"
  - "Red Teaming LLMs in production banking"
  - "From Transformer math to attack surface"
- **Badges con logos:** BBVA (reconocible por headhunters), Kaggle Master, HackTheBox -- prueba social inmediata. Logos, no solo texto -- un headhunter reconoce el logo de BBVA sin saber que es Kaggle

### 4.2 About Section

**Objetivo:** 15 segundos. Que hace, para quien, con que resultados.

```
+--------------------------------------------------+
|  About                                            |
|                                                   |
|  [Foto profesional]  "I build and break AI        |
|                       systems for one of Europe's  |
|                       largest banks. +6 years at   |
|                       the intersection of AI       |
|                       Engineering and Offensive    |
|                       Security."                   |
|                                                   |
|  +----------+  +----------+  +----------+         |
|  | +6 years |  | -20%     |  | -35%     |         |
|  | AI/ML    |  | latency  |  | costs    |         |
|  | systems  |  | in prod  |  | infra    |         |
|  +----------+  +----------+  +----------+         |
|                                                   |
|  +----------+  +----------+  +----------+         |
|  | 206+     |  | Top 800  |  | 45K      |         |
|  | attacks  |  | HTB      |  | imgs/h   |         |
|  | on LLMs  |  | global   |  | <100ms   |         |
|  +----------+  +----------+  +----------+         |
+--------------------------------------------------+
```

**Dual readability en metricas:**
- Cada metrica tiene un **numero grande** (escaneo rapido) y un **contexto de negocio** debajo
- "+6 years" → "building AI systems" (no "en ML/DL")
- "-20% latency" → "in production banking" (impacto real, no tecnicismo)
- "-35% costs" → "infrastructure optimization" (headhunter entiende "ahorro")
- "206+ attacks" → "on Foundation Models" (tecnico entiende la profundidad)
- "45K imgs/h" → "real-time classification" (CV impresionante para ambos)

- **Metricas animadas:** Contadores que se incrementan al entrar en viewport
- **Foto:** Humaniza el perfil. Critico para headhunters -- asocian cara a nombre

### 4.3 Experience Timeline

**Objetivo:** Progresion profesional clara. De Junior a Architect. Un headhunter ve crecimiento; un tecnico ve profundidad.

```
+--------------------------------------------------+
|  Experience                                       |
|                                                   |
|  2026 ---- AI Security Architect @ BBVA           |
|       |    "Protecting AI systems in European      |
|       |     banking from adversarial attacks"      |
|       |    [-20% latency] [-35% costs]             |
|       |    [expand: tech details + tags]           |
|       |                                           |
|  2024 ---- AI/ML Engineer @ BBVA                  |
|       |    "Building secure RAG and fraud          |
|       |     detection for financial crime"         |
|       |    [+15% precision] [+22% AUC-ROC]         |
|       |    [expand: tech details + tags]           |
|       |                                           |
|  2020 ---- ML Engineer @ Ecoembes                 |
|       |    "Automating waste classification with   |
|       |     computer vision and edge AI"           |
|       |    [85% accuracy] [45K imgs/h]             |
|       |    [expand: tech details + tags]           |
|       |                                           |
|  2019 ---- Data Scientist @ Capgemini             |
|            "Modernizing analytics with cloud       |
|             data pipelines on AWS"                 |
|            [-30% analysis time]                    |
|            [expand: tech details + tags]           |
+--------------------------------------------------+
```

**Dual readability:**
- **Capa 1 (siempre visible):** Empresa (con logo), rol, frase de negocio que cualquiera entiende, badges de impacto numerico
- **Capa 2 (expandible):** Tags de tecnologias, bullet points tecnicos, detalles de arquitectura
- **Timeline vertical** con nodos animados al hacer scroll
- Cada nodo se expande al click mostrando la capa tecnica
- Logos de empresas junto al nombre (BBVA y Capgemini son reconocibles para headhunters)
- Mobile: timeline simplificada, cards apiladas

### 4.4 Projects Showcase

**Objetivo:** Prueba tangible. Videos y codigo real.

```
+--------------------------------------------------+
|  Featured Projects                                |
|                                                   |
|  +------------------+  +------------------+       |
|  | [Video Preview]  |  | [Video Preview]  |       |
|  | FraudAI Agent    |  | Hospital Center  |       |
|  | Multi-agent      |  | LangGraph triage |       |
|  | fraud detection  |  | 9 AI specialists |       |
|  | [GitHub] [Demo]  |  | [GitHub] [Demo]  |       |
|  +------------------+  +------------------+       |
|                                                   |
|  +------------------+  +------------------+       |
|  | [Video Preview]  |  | Spectra          |       |
|  | Drone GeoAnalysis|  | AI Red Teaming   |       |
|  | LLM + geo data   |  | Attack surface   |       |
|  | analysis         |  | recon + Neo4j    |       |
|  | [GitHub] [Demo]  |  | [GitHub]         |       |
|  +------------------+  +------------------+       |
+--------------------------------------------------+
```

**Proyectos seleccionados (6 destacados):**

| Proyecto | Headline negocio | Headline tecnico | Video | Tags |
|----------|-----------------|-------------------|-------|------|
| **FraudAI Agent** | "AI platform that catches bank fraud before it happens" | Multi-agent fraud detection + red teaming | Si | LangGraph, FinTech, Red Teaming |
| **Hospital Center** | "9 AI specialists triaging emergency patients" | LangGraph multi-agent with prompt injection defense | Si | LangGraph, Multi-agent, Medical AI |
| **Drone GeoAnalysis** | "Turning drone footage into actionable intelligence" | LLM-powered geospatial analysis | Si | LLMs, Computer Vision, Drones |
| **Spectra** | "Mapping attack surfaces with AI reasoning" | AI recon + Neo4j graph + LangGraph orchestration | No | LangGraph, Neo4j, Security |
| **WatchDogs Security** | "Smart city threat monitoring system" | Real-time security event processing | No | Security, Monitoring |
| **SIEM Anomaly Detector** | "ML that finds the needle in millions of logs" | Anomaly detection on SIEM data | No | ML, Cybersecurity, SIEM |

**Dual readability en cards:**
- **Headline visible:** Frase de negocio que cualquier persona entiende (que problema resuelve)
- **Subtitulo tecnico:** Debajo, mas pequeno, para el CTO que quiere verificar depth
- **Video:** Prueba visual instantanea -- vale mas que 1000 bullet points

- **Video autoplay on hover** (muted), click para expandir
- Cards con hover effect sutil (glow border)
- Link directo a GitHub repo
- Tags de tecnologias

### 4.5 Skills Visualization

**Objetivo:** Vista rapida del stack tecnico, categorizado.

```
+--------------------------------------------------+
|  Tech Stack                                       |
|                                                   |
|  [AI Security]     [AI/ML]        [Infrastructure]|
|  MITRE ATLAS       PyTorch        Kubernetes      |
|  OWASP LLMs        Transformers   Docker          |
|  Adversarial ML    Deep Learning  AWS/Azure/GCP   |
|  PyRIT/Garak       scikit-learn   MLflow          |
|  Threat Modeling    ONNX          CI/CD           |
|                                                   |
|  [LLM/Agents]      [NVIDIA]       [Languages]    |
|  LangGraph          DGX           Python          |
|  LangChain          TensorRT-LLM  C++             |
|  RAG/GraphRAG       Triton        CUDA            |
|  ReAct              NIM           TypeScript      |
|  AutoGen            Quantization  SQL             |
+--------------------------------------------------+
```

- **Grid de categorias** con iconos
- Hover en cada skill muestra nivel/contexto
- Sin barras de progreso (patron anticuado y subjetivo)
- Categorias alineadas con los pilares del CV

### 4.6 Achievements Bar

**Objetivo:** Prueba social compacta.

```
+--------------------------------------------------+
|  Kaggle    | HackTheBox  | 2o Puesto    | Speaker|
|  Master    | Top 800     | Hack a Boss  | OMEN   |
|            | L4tentNoise | Hackathon    | League |
+--------------------------------------------------+
```

- Barra horizontal con badges/logos
- Links a perfiles verificables
- CSS puro, sin JS

### 4.7 Education & Certifications

```
+--------------------------------------------------+
|  Education                                        |
|  BS Comp Math & CS (AI) -- UCJC                   |
|  MSc Gen AI & Deep Learning -- MIOTI              |
|  MSc Big Data & Data Science -- MIOTI             |
|                                                   |
|  Certifications                                   |
|  Azure AI-102 | LangChain Dev | OSINT | ...      |
+--------------------------------------------------+
```

- Seccion compacta, no protagonista
- Cards minimas con institucion y titulo

### 4.8 Easter Egg: Mini Terminal

**Acceso:** Keystroke `Ctrl+K` o icono de terminal sutil en el footer.

```
+--------------------------------------------------+
|  > help                                           |
|                                                   |
|  Available commands:                              |
|    about     - Who is Adrian Infantes             |
|    skills    - Technical skills                   |
|    exp       - Work experience                    |
|    projects  - Featured projects                  |
|    contact   - Get in touch                       |
|    kaggle    - Kaggle profile                     |
|    htb       - HackTheBox stats                   |
|    clear     - Clear terminal                     |
|    exit      - Close terminal                     |
|                                                   |
|  > _                                              |
+--------------------------------------------------+
```

- **React island** con `client:idle` (se carga despues del contenido principal)
- Modal overlay con estetica de terminal (fondo negro, texto verde/cyan, font mono)
- Comandos predefinidos que devuelven info del portfolio en formato terminal
- `exit` cierra el modal
- Es un guino tecnico -- demuestra que Adrian puede construir interfaces interactivas
- No es critico para la experiencia principal, solo un bonus para los curiosos

### 4.9 Contact Section

```
+--------------------------------------------------+
|  Let's talk                                       |
|                                                   |
|  [Email]  [LinkedIn]  [GitHub]  [Kaggle]          |
|                                                   |
|  Madrid, Spain                                    |
+--------------------------------------------------+
```

- Links directos, no formulario (friction innecesario)
- Iconos con hover animations
- CTA claro: email como primario

### 4.9 Navigation Header

```
+--------------------------------------------------+
| AIR  [About] [Experience] [Projects] [Skills] [Contact] |
+--------------------------------------------------+
```

- Sticky header, blur backdrop
- Smooth scroll a secciones
- Mobile: hamburger menu con slide-in
- Indicador de seccion activa (scroll spy)

---

## 5. Design System

### 5.1 Color Palette

```
--bg-primary:     #0a0a0f    (casi negro, tinte azul)
--bg-secondary:   #12121a    (cards, sections alternas)
--bg-tertiary:    #1a1a2e    (hover states)

--text-primary:   #e4e4e7    (texto principal - zinc-200)
--text-secondary: #a1a1aa    (texto secundario - zinc-400)
--text-muted:     #71717a    (texto terciario - zinc-500)

--accent-primary: #06b6d4    (cyan-500 - CTA, links, highlights)
--accent-glow:    #22d3ee    (cyan-400 - hover glow)
--accent-green:   #10b981    (emerald-500 - success, badges)
--accent-red:     #ef4444    (red-500 - security/alert accents)
--accent-amber:   #f59e0b    (amber-500 - warnings, highlights)

--border:         #27272a    (zinc-800 - borders sutiles)
--border-hover:   #3f3f46    (zinc-700 - hover borders)
```

**Estetica:** Dark mode obligatorio. Cybersecurity meets clean tech. No neon exagerado -- profesional con personalidad. El cyan como color de acento principal evoca terminales, seguridad, tecnologia.

### 5.2 Typography

```
--font-heading:   "Inter", system-ui, sans-serif    (clean, professional)
--font-body:      "Inter", system-ui, sans-serif    (consistencia)
--font-mono:      "JetBrains Mono", monospace       (code snippets, terminal effects)

--text-5xl:  3rem      (Hero name)
--text-3xl:  1.875rem  (Section titles)
--text-xl:   1.25rem   (Card titles)
--text-base: 1rem      (Body)
--text-sm:   0.875rem  (Tags, metadata)
```

### 5.3 Spacing & Layout

```
--max-width:      1280px    (content max width)
--section-padding: 6rem 0   (vertical section spacing)
--card-padding:    1.5rem   (internal card padding)
--gap-grid:        1.5rem   (grid gap)
--border-radius:   0.75rem  (cards, buttons)
```

### 5.4 Responsive Breakpoints

```
sm:  640px   (mobile landscape)
md:  768px   (tablet)
lg:  1024px  (desktop)
xl:  1280px  (wide desktop)
```

- Mobile-first: base styles son mobile
- Grid: 1 col (mobile) -> 2 col (tablet) -> 3 col (desktop)
- Hero: full viewport height en todos los breakpoints
- Timeline: vertical siempre, cards se comprimen en mobile

### 5.5 Animations

| Elemento | Animacion | Trigger |
|----------|-----------|---------|
| Hero text | Typewriter + fade in | Page load |
| Particle network | Continuous subtle motion | Page load (desktop only) |
| Section titles | Slide up + fade in | Scroll into view |
| Timeline nodes | Scale in + fade | Scroll into view (staggered) |
| Project cards | Slide up + fade | Scroll into view (staggered) |
| Metric counters | Count up from 0 | Scroll into view |
| Skill tags | Fade in (staggered) | Scroll into view |
| Video previews | Scale on hover | Mouse hover |
| Nav links | Underline slide | Mouse hover |

**Regla:** `prefers-reduced-motion: reduce` desactiva todas las animaciones excepto fade. Accesibilidad no es opcional.

---

## 6. Performance Strategy

### 6.1 Targets

| Metrica | Target |
|---------|--------|
| FCP (First Contentful Paint) | <1.0s |
| LCP (Largest Contentful Paint) | <2.0s |
| CLS (Cumulative Layout Shift) | <0.05 |
| TBT (Total Blocking Time) | <150ms |
| Lighthouse Performance | 95+ |
| Lighthouse Accessibility | 100 |
| Lighthouse SEO | 100 |
| Bundle size (total JS) | <150KB gzipped |

### 6.2 Tactics

1. **Astro SSG** -- HTML pre-renderizado, zero JS por defecto
2. **Islands hydration** -- Solo 4 React islands, hidratados bajo demanda (`client:visible`)
3. **Three.js lazy** -- Hero canvas cargado con dynamic import, fallback gradient en mobile
4. **Video lazy loading** -- `loading="lazy"`, poster images, autoplay solo en hover
5. **Font optimization** -- Inter via `@fontsource` (self-hosted, subset latin), display: swap
6. **Image optimization** -- Astro `<Image>` con formatos WebP/AVIF automaticos
7. **CSS purge** -- Tailwind elimina CSS no usado en build
8. **Prefetch** -- Astro prefetch en links visibles

### 6.3 Mobile-specific

- Three.js hero desactivado en pantallas <768px (reemplazado por gradient + CSS particles)
- Videos no autoplay en mobile (ahorro de datos)
- Touch targets minimo 44x44px
- Font sizes incrementados en mobile para legibilidad

---

## 7. SEO & Meta

```html
<title>Adrian Infantes | AI Security Engineer</title>
<meta name="description" content="AI Security Engineer specializing in
  AI Safety, Red Teaming, and Adversarial ML. Building secure AI systems
  for financial crime at BBVA. Kaggle Master, HTB Top 800.">

<!-- Open Graph -->
<meta property="og:title" content="Adrian Infantes | AI Security Engineer">
<meta property="og:description" content="...">
<meta property="og:image" content="/og-image.png">
<meta property="og:type" content="website">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">

<!-- Schema.org JSON-LD -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Adrian Infantes",
  "jobTitle": "AI Security Engineer",
  "worksFor": { "@type": "Organization", "name": "BBVA Technology" },
  "url": "https://adrianinfantes.dev",
  "sameAs": [
    "https://linkedin.com/in/adrianinfantes",
    "https://github.com/infantesromeroadrian"
  ]
}
</script>
```

---

## 8. Deployment

| Aspecto | Decision |
|---------|----------|
| **Hosting** | GitHub Pages (free, integrado con repo) |
| **Build** | `astro build` -> static output (`outDir: ./docs` o GitHub Actions) |
| **Domain** | `infantesromeroadrian.github.io/Web-AIR/` (v1). Custom domain futuro |
| **CI/CD** | GitHub Actions: on push to main -> astro build -> deploy to gh-pages |
| **Analytics** | No en v1. Anadir analytics privacy-friendly en v2 si necesario |
| **CDN** | GitHub Pages CDN (global, suficiente para portfolio) |
| **Video hosting** | MP4 en el propio build. Si superan 100MB total, mover a GitHub Releases o CDN externo |

---

## 9. File Structure

```
Web-AIR/
|-- astro.config.mjs
|-- package.json
|-- tsconfig.json
|-- tailwind.config.ts          (si Tailwind 4 aun necesita config)
|
|-- public/
|   |-- favicon.svg
|   |-- og-image.png
|   |-- robots.txt
|   |-- fonts/                  (si self-hosted)
|
|-- src/
|   |-- layouts/
|   |   |-- BaseLayout.astro    (HTML shell, meta, fonts, global styles)
|   |
|   |-- pages/
|   |   |-- index.astro         (single page, composes all sections)
|   |
|   |-- sections/               (Astro components -- page sections)
|   |   |-- Hero.astro
|   |   |-- About.astro
|   |   |-- Experience.astro
|   |   |-- Projects.astro
|   |   |-- Skills.astro
|   |   |-- Achievements.astro
|   |   |-- Education.astro
|   |   |-- Contact.astro
|   |
|   |-- components/
|   |   |-- astro/              (static components)
|   |   |   |-- Header.astro
|   |   |   |-- Footer.astro
|   |   |   |-- SectionTitle.astro
|   |   |   |-- Badge.astro
|   |   |   |-- Tag.astro
|   |   |
|   |   |-- react/              (interactive islands)
|   |   |   |-- ParticleNetwork.tsx
|   |   |   |-- TypewriterText.tsx
|   |   |   |-- ExperienceTimeline.tsx
|   |   |   |-- ProjectCard.tsx
|   |   |   |-- ProjectGrid.tsx
|   |   |   |-- SkillGrid.tsx
|   |   |   |-- AnimatedCounter.tsx
|   |   |   |-- ScrollReveal.tsx     (wrapper generico)
|   |   |   |-- VideoPreview.tsx
|   |   |   |-- MiniTerminal.tsx     (Easter egg - Ctrl+K)
|   |
|   |-- data/                   (content as TypeScript)
|   |   |-- experience.ts
|   |   |-- projects.ts
|   |   |-- skills.ts
|   |   |-- achievements.ts
|   |   |-- education.ts
|   |   |-- meta.ts             (SEO, social)
|   |
|   |-- styles/
|   |   |-- global.css          (Tailwind imports + custom properties)
|   |
|   |-- lib/                    (utilities)
|       |-- constants.ts
|       |-- types.ts
|
|-- assets/                     (media)
|   |-- Gemini_Generated_Image_ne74yhne74yhne74.png   (foto profesional)
|   |-- Analisis_de_Proyecto_Drone_GeoAnalysis_LLMs.mp4
|   |-- FraudAI_Agent_Video_Generado.mp4
|   |-- Video_Generado_y_Centro_Medico.mp4
|
|-- docs/
|   |-- Profile-2.pdf
|
|-- ARCHITECTURE.md             (este documento)
```

---

## 10. Content Data Model

```typescript
// src/lib/types.ts

interface Experience {
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  highlights: string[];       // bullet points con impacto
  tags: string[];
}

interface Project {
  title: string;
  description: string;
  longDescription?: string;
  tags: string[];
  githubUrl: string;
  demoUrl?: string;
  videoSrc?: string;          // path al MP4
  videoPoser?: string;        // thumbnail
  featured: boolean;
}

interface SkillCategory {
  name: string;
  icon: string;               // Lucide icon name
  skills: string[];
}

interface Achievement {
  title: string;
  subtitle: string;
  url?: string;
  icon: string;
}

interface Education {
  institution: string;
  degree: string;
  specialization?: string;
}
```

---

## 11. Accesibilidad

- Semantic HTML: `<header>`, `<main>`, `<section>`, `<nav>`, `<footer>`
- ARIA labels en elementos interactivos
- Skip-to-content link
- Focus visible styles (no outline: none)
- Color contrast ratio >= 4.5:1 (WCAG AA)
- `prefers-reduced-motion` respetado
- Alt text en todas las imagenes
- Keyboard navigation completa
- Video con controles accesibles

---

## 12. Decisiones (CONFIRMADAS por Adrian -- 2026-04-10)

| # | Decision | Resolucion |
|---|----------|------------|
| 1 | **Hosting** | GitHub Pages (v1). Migrar a custom domain mas adelante si necesario |
| 2 | **Idioma** | English only |
| 3 | **Foto profesional** | Si -- `assets/Gemini_Generated_Image_ne74yhne74yhne74.png` (data center shot) |
| 4 | **Easter egg terminal** | Si -- mini-terminal accesible via keystroke o icon oculto |
| 5 | **Blog section** | No en v1 |
| 6 | **Videos** | Integrados en Projects y como evidencia de dominio sectorial. Servidos desde build (GitHub Pages) |

---

## 13. Fases de Implementacion

| Fase | Scope | Entregable |
|------|-------|------------|
| **v0.1** | Scaffold Astro + estructura + design system | Proyecto corriendo con layout vacio |
| **v0.2** | Hero + About + Contact (static) | Pagina con primera impresion funcional |
| **v0.3** | Experience Timeline + Education | Seccion profesional completa |
| **v0.4** | Projects Showcase + videos | Demos integrados |
| **v0.5** | Skills + Achievements | Stack tecnico visible |
| **v0.6** | Animations + polish | Framer Motion, scroll reveals, hover effects |
| **v0.7** | Performance + SEO + a11y audit | Lighthouse 95+, meta tags, schema.org |
| **v1.0** | Deploy + dominio + QA | Live en produccion |

---

*Documento generado por ARCA. Pendiente de aprobacion por Adrian Infantes.*
