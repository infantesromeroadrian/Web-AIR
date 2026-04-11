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

  // ==================== HERO ====================
  "hero.pretitle": {
    en: "AI Security \u00b7 AI Safety \u00b7 Red Teaming",
    es: "Seguridad IA \u00b7 AI Safety \u00b7 Red Teaming",
  },
  "hero.role": {
    en: "AI Security Engineer",
    es: "Ingeniero de Seguridad IA",
  },
  "hero.tagline": {
    en: "I protect AI systems from the attacks that haven't been invented yet.",
    es: "Protejo sistemas de IA de los ataques que aun no se han inventado.",
  },
  "hero.cta.work": { en: "View Work", es: "Ver Proyectos" },
  "hero.cta.contact": { en: "Contact", es: "Contacto" },
  "hero.scroll": { en: "scroll", es: "scroll" },
  "hero.badge.bbva": { en: "BBVA Technology", es: "BBVA Technology" },
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
  "about.metric.attacks": {
    en: "Attacks on Foundation Models",
    es: "Ataques a Foundation Models",
  },
  "about.metric.htb": {
    en: "HackTheBox global rank",
    es: "Rank global HackTheBox",
  },
  "about.metric.latency": {
    en: "Latency in prod banking",
    es: "Latencia en banca prod",
  },
  "about.metric.costs": { en: "Infrastructure costs", es: "Costes de infra" },
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
    en: "Global ranking (L4tentNoise)",
    es: "Ranking global (L4tentNoise)",
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
