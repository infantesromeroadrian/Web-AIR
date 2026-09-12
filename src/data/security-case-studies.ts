import type { Lang } from "../i18n/translations";

export interface SecurityCaseStudy {
  id: string;
  title: Record<Lang, string>;
  contribution: Record<Lang, string>;
  controls: Record<Lang, string[]>;
  milestoneDate: string;
  milestoneLabel: Record<Lang, string>;
  outcomes: Record<Lang, string[]>;
  boundary: Record<Lang, string>;
  tags: string[];
}

export const SECURITY_WORK_ORGANIZATION = "ERNI / Verisure";

export const securityCaseStudies: SecurityCaseStudy[] = [
  {
    id: "session-isolated-copilot-memory",
    title: {
      en: "Session-isolated memory for an AI copilot",
      es: "Memoria aislada por sesión para un copiloto de IA",
    },
    contribution: {
      en: "Engineering contribution to validating memory boundaries by call and installation, with fail-closed behavior on mismatches.",
      es: "Contribución de ingeniería a la validación de memoria por llamada e instalación, con cierre seguro (fail-closed) ante discrepancias.",
    },
    controls: {
      en: ["Synthetic test data", "Bounded retries", "Cleanup that preserves other sessions"],
      es: ["Datos de prueba sintéticos", "Reintentos acotados", "Limpieza que preserva otras sesiones"],
    },
    milestoneDate: "2026-07-15",
    milestoneLabel: { en: "15 Jul 2026", es: "15 jul 2026" },
    outcomes: {
      en: ["122 package tests passed", "93.6% package coverage", "7/7 CI checks passed"],
      es: ["122 tests del paquete superados", "93,6 % de cobertura del paquete", "7/7 comprobaciones de CI superadas"],
    },
    boundary: {
      en: "Experimental DEV validation; production E2E is outside this milestone.",
      es: "Validación experimental en DEV; el E2E de producción queda fuera de este hito.",
    },
    tags: ["AI Security Architecture", "Session Isolation", "Fail-closed", "Validation"],
  },
  {
    id: "versioned-agent-guardrails",
    title: {
      en: "Versioned AI guardrails architecture for agents",
      es: "Arquitectura de guardrails versionados para agentes",
    },
    contribution: {
      en: "Engineering contribution to separating policies, producer infrastructure and consuming applications, with version and configuration contracts.",
      es: "Contribución de ingeniería a la separación de políticas, infraestructura productora y aplicación consumidora, con contratos de versión y configuración.",
    },
    controls: {
      en: ["Identity, logging and runtime acceptance defined as explicit requirements"],
      es: ["Identidad, logging y aceptación en runtime definidos como requisitos explícitos"],
    },
    milestoneDate: "2026-08-14",
    milestoneLabel: { en: "14 Aug 2026", es: "14 ago 2026" },
    outcomes: {
      en: ["Versioned policy configuration ready", "Direct pilot smoke passed"],
      es: ["Configuración de políticas versionadas preparada", "Prueba de humo directa del piloto superada"],
    },
    boundary: {
      en: "Configuration and pilot milestone; consumer E2E integration was still pending at this milestone.",
      es: "Hito de configuración y piloto; la integración E2E del consumidor seguía pendiente en ese hito.",
    },
    tags: ["AI Security Architecture", "AI Guardrails", "Versioning", "Configuration Contracts"],
  },
];

export function securityCaseStudyText(study: SecurityCaseStudy, lang: Lang): string {
  return [
    `${study.title[lang]} — ${SECURITY_WORK_ORGANIZATION}`,
    study.contribution[lang],
    ...study.controls[lang],
    `${study.milestoneLabel[lang]}: ${study.outcomes[lang].join("; ")}.`,
    study.boundary[lang],
  ].join("\n");
}
