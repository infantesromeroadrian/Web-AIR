import type { Education } from "../lib/types";

export const education: Education[] = [
  {
    institution: "UNED",
    degree: "Bachelor's Degree in Computer Science Engineering",
    degreeEs: "Grado en Ingeniería Informática",
    status: "completed",
  },
  {
    institution: "ETH Zürich–EPFL",
    degree: "MSc in Computer Science — Major in Cyber Security",
    degreeEs: "Máster en Ciencias de la Computación — especialidad en Ciberseguridad",
    status: "completed",
  },
  {
    institution: "MIOTI | Tech & Business School",
    degree: "Master's Degree, Gen AI & Deep Learning",
  },
  {
    institution: "MIOTI | Tech & Business School",
    degree: "Master's Degree, Big Data & Data Science",
  },
  {
    institution: "U-tad",
    degree: "CFGS Administracion de Sistemas Informaticos en Red (ASIR)",
  },
];

export const COAE_CERTIFICATION = "HTB Certified Offensive AI Expert (COAE)";

export const certifications: string[] = [
  COAE_CERTIFICATION,
  "AI-102: Azure AI Solution Design",
  "LangChain for LLM Application Development",
  "Certificate AI Engineer Track",
  "Linear Algebra for ML & Data Science",
  "OSINT Fundamentals",
];
