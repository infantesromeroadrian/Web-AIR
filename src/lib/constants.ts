export const SITE = {
  title: "Adrian Infantes | AI Security Architecture & Red Teaming",
  description:
    "Secure design and adversarial evaluation of LLMs, RAG pipelines, and AI agents.",
  url: "https://adrian-infantes.vercel.app",
  author: "Adrian Infantes",
  email: "infantesromeroadrian@gmail.com",
  location: "Madrid, Spain",
} as const;

export const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
] as const;

export const SOCIAL_LINKS = [
  {
    name: "GitHub",
    url: "https://github.com/infantesromeroadrian",
    icon: "github",
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/adrianinfantes",
    icon: "linkedin",
  },
  {
    name: "Kaggle",
    url: "https://www.kaggle.com/adrininfantesromero",
    icon: "bar-chart-2",
  },
  {
    name: "Email",
    url: "mailto:infantesromeroadrian@gmail.com",
    icon: "mail",
  },
] as const;
