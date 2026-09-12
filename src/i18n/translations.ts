export type Lang = "en" | "es";

export const LANGS: Lang[] = ["en", "es"];
export const DEFAULT_LANG: Lang = "en";

type Entry = Record<Lang, string>;

export const TRANSLATIONS: Record<string, Entry> = {
  // ==================== NAV ====================
  "nav.about": { en: "About", es: "Sobre mi" },
  "nav.experience": { en: "Experience", es: "Experiencia" },
  "nav.projects": { en: "Projects", es: "Proyectos" },
  "nav.demo": { en: "Demo", es: "Demo" },
  "nav.skills": { en: "Skills", es: "Skills" },
  "nav.contact": { en: "Contact", es: "Contacto" },
  "nav.roadmap": { en: "Roadmap", es: "Roadmap" },

  // ==================== ROADMAP ====================
  "roadmap.meta.title": { en: "AI Security Roadmap | Adrian Infantes", es: "Roadmap AI Security | Adrian Infantes" },
  "roadmap.meta.description": { en: "Interactive game-style roadmap tracking my journey to the top 1% of AI Security Engineers.", es: "Roadmap interactivo tipo juego rastreando mi camino al top 1% de AI Security Engineers." },
  "roadmap.hud.towards": { en: "towards the 1%", es: "hacia el 1%" },
  "roadmap.hud.done": { en: "Done", es: "Hecho" },
  "roadmap.hud.prog": { en: "Prog", es: "Prog" },
  "roadmap.hud.pend": { en: "Pend", es: "Pend" },
  "roadmap.hud.certs": { en: "Certs", es: "Certs" },
  "roadmap.hud.streak": { en: "Streak", es: "Racha" },
  "roadmap.modal.cycle": { en: "Study cycle:", es: "Ciclo de estudio:" },
  "roadmap.modal.hours": { en: "estimated", es: "estimadas" },
  "roadmap.modal.feynman": { en: "Feynman: Explain to Claude before continuing", es: "Feynman: Explica a Claude antes de continuar" },
  "roadmap.goal": { en: "TOP 1% — Apply to Anthropic, OpenAI, Google", es: "TOP 1% — Aplica a Anthropic, OpenAI, Google" },
  "roadmap.export": { en: "Export", es: "Exportar" },
  "roadmap.import": { en: "Import", es: "Importar" },
  "roadmap.reset": { en: "Reset", es: "Reiniciar" },
  "roadmap.reset.confirm": { en: "Reset all progress?", es: "Reiniciar todo el progreso?" },

  // ==================== HERO ====================
  "hero.pretitle": {
    en: "AI Security \u00b7 AI Safety \u00b7 Red Teaming",
    es: "Seguridad IA \u00b7 AI Safety \u00b7 Red Teaming",
  },
  "hero.role": {
    en: "AI Security Architecture · AI Red Teaming",
    es: "Arquitectura de seguridad de IA · AI Red Teaming",
  },
  "hero.tagline": {
    en: "Secure design and adversarial evaluation of LLMs, RAG pipelines, and AI agents.",
    es: "Diseño seguro y evaluación adversarial de LLMs, sistemas RAG y agentes de IA.",
  },
  "hero.cta.work": { en: "View Work", es: "Ver Proyectos" },
  "hero.cta.contact": { en: "Contact", es: "Contacto" },
  "hero.scroll": { en: "scroll", es: "scroll" },
  "hero.badge.bbva": { en: "BBVA Technology", es: "BBVA Technology" },
  "hero.badge.redteaming.scope": { en: "LLM · RAG · Agents", es: "LLM · RAG · Agentes" },
  "hero.badge.kaggle": { en: "Kaggle Master", es: "Kaggle Master" },
  "hero.badge.htb": { en: "HackTheBox Top 800", es: "HackTheBox Top 800" },
  "hero.card.rarity": { en: "Rare Card", es: "Carta Rara" },

  // ==================== ABOUT ====================
  "about.title": { en: "About", es: "Sobre mi" },
  "about.p1.prefix": {
    en: "I build and break AI systems for one of Europe's largest banks. ",
    es: "Construyo y rompo sistemas de IA para uno de los mayores bancos de Europa. ",
  },
  "about.p1.strong": {
    en: "+6 years at the intersection of AI Engineering and Offensive Security",
    es: "+6 anos en la interseccion entre AI Engineering y Seguridad Ofensiva",
  },
  "about.p1.suffix": {
    en: ", specialized in Financial Crime environments: AML, Sanctions Screening, KYC/KYB, and Transaction Monitoring. I evaluate, attack, and fortify Foundation Models, RAG pipelines, and Agentic Systems in regulated banking production.",
    es: ", especializado en entornos de Financial Crime: AML, Sanctions Screening, KYC/KYB y Transaction Monitoring. Evaluo, ataco y fortifico Foundation Models, pipelines RAG y Agentic Systems en produccion bancaria regulada.",
  },
  "about.p2": {
    en: "From the math behind the Transformer to the attack surface of the autonomous agent -- first-principles thinking applied to making AI systems secure by design.",
    es: "Desde la matematica detras del Transformer hasta la superficie de ataque del agente autonomo -- pensamiento de primeros principios aplicado a hacer sistemas de IA seguros por diseno.",
  },
  "about.metric.years": {
    en: "Years building AI systems",
    es: "Anos construyendo sistemas de IA",
  },
  "about.metric.htb": {
    en: "HackTheBox global rank",
    es: "Rank global HackTheBox",
  },
  "about.metric.throughput": {
    en: "Images/hour real-time CV",
    es: "Imagenes/hora CV tiempo real",
  },

  // ==================== ACHIEVEMENTS ====================
  "ach.kaggle.title": { en: "Kaggle Master", es: "Kaggle Master" },
  "ach.kaggle.sub": {
    en: "Top-tier competitive ML",
    es: "ML competitivo de elite",
  },
  "ach.htb.title": { en: "HackTheBox Top 800", es: "HackTheBox Top 800" },
  "ach.htb.sub": {
    en: "Global cybersecurity ranking",
    es: "Ranking global de ciberseguridad",
  },
  "ach.hackaboss.title": {
    en: "2nd Place Hack a Boss",
    es: "2o Puesto Hack a Boss",
  },
  "ach.hackaboss.sub": { en: "Python Hackathon", es: "Hackathon Python" },
  "ach.omen.title": {
    en: "Speaker OMEN League",
    es: "Speaker OMEN League",
  },
  "ach.omen.sub": { en: "Featured speaker", es: "Ponente destacado" },
  "ach.talent.title": { en: "Talent4Cyber", es: "Talent4Cyber" },
  "ach.talent.sub": {
    en: "CiberEspacio contributor",
    es: "Colaborador CiberEspacio",
  },

  // ==================== SECTION TITLES & SUBTITLES ====================
  "experience.title": { en: "Experience", es: "Experiencia" },
  "experience.subtitle": {
    en: "From data pipelines to AI security architecture",
    es: "De pipelines de datos a arquitectura de seguridad IA",
  },
  "experience.tech": { en: "Technical details", es: "Detalles tecnicos" },

  "projects.title": { en: "Featured Projects", es: "Proyectos Destacados" },
  "projects.subtitle": {
    en: "10+ projects across 3 industry sectors",
    es: "10+ proyectos en 3 sectores industriales",
  },

  "demo.title": { en: "Live Demo", es: "Demo en Vivo" },
  "demo.subtitle": {
    en: "Try it yourself -- AI-powered email threat analysis running in your browser",
    es: "Pruebalo tu mismo -- analisis de amenazas en emails con IA corriendo en tu navegador",
  },

  "skills.title": { en: "Tech Stack", es: "Stack Tecnico" },
  "skills.subtitle": {
    en: "Tools I use to build and secure AI systems",
    es: "Herramientas que uso para construir y asegurar sistemas de IA",
  },

  "topology.title": { en: "Knowledge Graph", es: "Grafo de Conocimiento" },
  "topology.subtitle": {
    en: "How my skills, sectors, and projects connect in 3D space",
    es: "Como se conectan mis skills, sectores y proyectos en el espacio 3D",
  },

  "attacks.title": { en: "Breaking the Model", es: "Rompiendo el Modelo" },
  "attacks.subtitle": {
    en: "Two angles on adversarial attacks against Foundation Models",
    es: "Dos angulos de los ataques adversariales contra Foundation Models",
  },

  "education.title": { en: "Education", es: "Educacion" },
  "education.certs": { en: "Certifications", es: "Certificaciones" },

  "github.title": { en: "GitHub Activity", es: "Actividad GitHub" },
  "github.subtitle": {
    en: "Open source contributions and personal projects",
    es: "Contribuciones open source y proyectos personales",
  },
  "github.stat.repos": { en: "Public repos", es: "Repos publicos" },
  "github.stat.stars": { en: "Stars", es: "Stars" },
  "github.stat.languages": { en: "Languages", es: "Lenguajes" },
  "github.stat.since": { en: "Coding since", es: "Programando desde" },
  "github.languages": { en: "Languages", es: "Lenguajes" },
  "github.viewAll": {
    en: "View all repositories \u2192",
    es: "Ver todos los repos \u2192",
  },

  // ==================== CONTACT ====================
  "contact.title": { en: "Let's Talk", es: "Hablemos" },
  "contact.subtitle": {
    en: "Looking for an AI Security Engineer who builds and breaks AI systems? Drop a message.",
    es: "Buscas un Ingeniero de Seguridad IA que construye y rompe sistemas de IA? Dejame un mensaje.",
  },
  "contact.or": { en: "or find me at", es: "o encuentrame en" },
  "contact.form.name": { en: "Name *", es: "Nombre *" },
  "contact.form.name.placeholder": { en: "Jane Doe", es: "Juan Perez" },
  "contact.form.email": { en: "Email *", es: "Email *" },
  "contact.form.email.placeholder": {
    en: "jane@company.com",
    es: "juan@empresa.com",
  },
  "contact.form.company": { en: "Company", es: "Empresa" },
  "contact.form.company.optional": { en: "(optional)", es: "(opcional)" },
  "contact.form.company.placeholder": { en: "Acme Corp", es: "Empresa SL" },
  "contact.form.message": { en: "Message *", es: "Mensaje *" },
  "contact.form.message.placeholder": {
    en: "Looking for an AI Security Engineer to...",
    es: "Busco un Ingeniero de Seguridad IA para...",
  },
  "contact.form.send": { en: "Send Message", es: "Enviar mensaje" },
  "contact.form.sending": { en: "Sending...", es: "Enviando..." },
  "contact.form.success": { en: "Message received", es: "Mensaje recibido" },
  "contact.form.success.detail": {
    en: "I'll get back to you at the email you provided. Usually within 24-48 hours.",
    es: "Te respondere al email que has proporcionado. Normalmente en 24-48 horas.",
  },
  "contact.form.again": { en: "< send another", es: "< enviar otro" },
  "contact.form.privacy": {
    en: "Your message is sent via Formsubmit. No tracking, no spam.",
    es: "Tu mensaje se envia via Formsubmit. Sin tracking, sin spam.",
  },
  "contact.form.error.name": { en: "Name is required", es: "El nombre es obligatorio" },
  "contact.form.error.email": {
    en: "Valid email is required",
    es: "El email debe ser valido",
  },
  "contact.form.error.message": {
    en: "Message must be at least 10 characters",
    es: "El mensaje debe tener al menos 10 caracteres",
  },

  // ==================== JOB MATCH ====================
  "jobmatch.title": {
    en: "Does Adrian Fit Your Role?",
    es: "Adrian encaja en tu puesto?",
  },
  "jobmatch.subtitle": {
    en: "Paste a job description and our AI analyzes the match against Adrian's real profile -- projects, experience, skills, and certifications.",
    es: "Pega una descripcion del puesto y nuestra IA analiza el encaje contra el perfil real de Adrian -- proyectos, experiencia, skills y certificaciones.",
  },

  // ==================== ARES (formerly A.R.C.A.) ====================
  "arca.pretitle": {
    en: "The system behind every commit",
    es: "El sistema detras de cada commit",
  },
  "arca.title": {
    en: "Powered by A.R.C.A",
    es: "Operado por A.R.C.A",
  },
  "arca.tagline": {
    en: "I do not just talk about agentic adversarial AI -- I run on one.",
    es: "No solo hablo de IA agentica adversarial -- opero con una.",
  },
  "arca.intro": {
    en: "A.R.C.A is the personal agentic orchestration layer I built on top of Claude Code. 49 specialized agents (Opus + Sonnet), a 14-cycle ML pipeline across 47 phases, 45 enforcement hooks wired across 11 lifecycle events, 58 slash commands and 20 MCP servers — pure configuration, no runtime. Every line of code on this site, every red-team exercise, every project below passed through its gates before reaching main.",
    es: "A.R.C.A es la capa de orquestacion agentica personal que construi sobre Claude Code. 49 agentes especializados (Opus + Sonnet), un pipeline ML de 14 ciclos y 47 fases, 45 hooks de enforcement cabeados en 11 eventos del ciclo de vida, 58 slash commands y 20 servidores MCP -- pura configuracion, sin runtime. Cada linea de codigo de este sitio, cada ejercicio de red team y cada proyecto de abajo paso por sus gates antes de llegar a main.",
  },
  "arca.metric.agents": { en: "specialized agents", es: "agentes especializados" },
  "arca.metric.skills": { en: "skills catalog", es: "catalogo de skills" },
  "arca.metric.adrs": { en: "architecture decisions", es: "decisiones de arquitectura" },
  "arca.metric.cycles": { en: "ML pipeline cycles", es: "ciclos del pipeline ML" },
  "arca.pillar1.title": { en: "Documented decisions", es: "Decisiones documentadas" },
  "arca.pillar1.body": {
    en: "Every architectural choice ships with a Nygard ADR. 47 numbered records, 36 active across architecture, security, governance and the meta-system itself. Each one lists context, alternatives weighed and consequences.",
    es: "Cada decision arquitectonica viaja con un ADR Nygard. 47 registros numerados, 36 activos cubriendo arquitectura, seguridad, gobernanza y el propio meta-sistema. Cada uno expone contexto, alternativas evaluadas y consecuencias.",
  },
  "arca.pillar2.title": { en: "Adversarial gate chain", es: "Cadena de gates adversarial" },
  "arca.pillar2.body": {
    en: "math-critic -> debt-detector -> code-critic -> chief-architect. Producing agents (ml/dl/ai-engineer) cannot reach code-critic without math-critic signing off first. 45 bash hook entries wired across PreToolUse / PostToolUse enforce the chain — bypass leaves an audit trail.",
    es: "math-critic -> debt-detector -> code-critic -> chief-architect. Los agentes productores (ml/dl/ai-engineer) no llegan a code-critic sin que math-critic firme antes. 45 entradas de hook bash cabeadas en PreToolUse / PostToolUse refuerzan la cadena -- saltarsela deja rastro auditable.",
  },
  "arca.pillar3.title": { en: "Pipeline discipline", es: "Disciplina de pipeline" },
  "arca.pillar3.body": {
    en: "14 ML cycles, 47 phases, one blocking gate at every exit — from C1 Discovery to C14 Sunset. No cycle closes without its mandatory artifact (Excalidraw diagram in C1/C4/C6/C10/C12, ADR in C4, model sign-off in C8, rollback plan in C10).",
    es: "14 ciclos ML, 47 fases, un gate bloqueante en cada salida -- de C1 Discovery a C14 Sunset. Ningun ciclo cierra sin su artefacto obligatorio (diagrama Excalidraw en C1/C4/C6/C10/C12, ADR en C4, firma del modelo en C8, plan de rollback en C10).",
  },
  "arca.cta.live": { en: "View live system", es: "Ver el sistema" },
  "arca.cta.source": { en: "Source on GitHub", es: "Codigo en GitHub" },

  // ==================== FOOTER ====================
  "footer.built": { en: "Built with Astro.", es: "Hecho con Astro." },
  "footer.rights": {
    en: "All rights reserved.",
    es: "Todos los derechos reservados.",
  },
  "footer.terminal": { en: "Open terminal", es: "Abrir terminal" },

  // ==================== LANG TOGGLE ====================
  "lang.switchTo": { en: "Switch to Spanish", es: "Cambiar a Ingles" },
};

export function t(key: string, lang: Lang): string {
  const entry = TRANSLATIONS[key];
  if (!entry) {
    if (import.meta.env.DEV) {
      console.warn(`[i18n] Missing translation key: ${key}`);
    }
    return key;
  }
  return entry[lang] || entry[DEFAULT_LANG] || key;
}
