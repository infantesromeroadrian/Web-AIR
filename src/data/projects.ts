import type { Project } from "../lib/types";

export interface Sector {
  id: string;
  name: string;
  headline: string;
  description: string;
  icon: string;
  projects: Project[];
}

export const sectors: Sector[] = [
  {
    id: "defense",
    name: "Defense & Intelligence",
    headline: "Protecting critical infrastructure with AI-powered security",
    description:
      "Cybersecurity, OSINT, ISR drone operations, threat intelligence, and attack surface reconnaissance. AI systems that detect, analyze, and respond to security threats at scale.",
    icon: "shield",
    projects: [
      {
        title: "Spectra",
        headline: "Mapping attack surfaces with AI reasoning",
        description:
          "AI-powered attack surface recon tool. Scans subdomains, ports, services, and CVEs. Neo4j graph database with a LangGraph ReAct agent that reasons over the graph to answer security questions.",
        tags: ["LangGraph", "Neo4j", "nmap", "NVD", "FastAPI", "ReAct"],
        githubUrl:
          "https://github.com/infantesromeroadrian/Spectra-LangGraph-AI-Red-Teaming-Orchestration",
        featured: true,
      },
      {
        title: "Drone GeoAnalysis",
        headline: "Turning drone footage into actionable intelligence",
        description:
          "Enterprise ISR platform: drone control, geospatial analysis, real-time video processing, and LLM-powered autonomous missions. 107 tests, 95.3% coverage.",
        tags: ["LLMs", "Computer Vision", "Geospatial", "Drones", "Flask"],
        githubUrl:
          "https://github.com/infantesromeroadrian/Drone-GeoAnalysis-LLMs",
        videoSrc:
          "/videos/Análisis_de_Proyecto_Drone_GeoAnalysis_LLMs.mp4",
        featured: true,
      },
      {
        title: "WatchDogs OSINT",
        headline: "Multi-modal video intelligence with 4 AI agents",
        description:
          "LangGraph parallel agents (Vision, OCR, Detection, Geolocation) analyze video frames using GPT Vision. Circuit breaker, rate limiting, production-grade resilience. Score: 95/100.",
        tags: ["LangGraph", "GPT Vision", "OSINT", "Flask", "Docker"],
        githubUrl:
          "https://github.com/infantesromeroadrian/WatchDogs-Security-City",
        featured: true,
      },
      {
        title: "Threat Intelligence Aggregator",
        headline: "AI-powered threat feed with 35 API endpoints",
        description:
          "Enterprise platform: CVE scraping from NVD, IOC extraction with spaCy NER, BERT severity classification, LDA topic modeling. Hexagonal architecture, 9,600+ lines of code.",
        tags: ["BERT", "spaCy", "NER", "FastAPI", "NVD", "PyTorch"],
        githubUrl:
          "https://github.com/infantesromeroadrian/Threat-Intelligence-ML-Detector",
        featured: true,
      },
      {
        title: "SIEM Anomaly Detector",
        headline: "ML that finds the needle in millions of logs",
        description:
          "Machine learning anomaly detection on SIEM data. Identifies suspicious patterns in security logs at scale.",
        tags: ["ML", "SIEM", "Anomaly Detection", "Python"],
        githubUrl:
          "https://github.com/infantesromeroadrian/SIEM-Anomaly-Detector-ML",
        featured: false,
      },
      {
        title: "Email Threat Intelligence",
        headline: "Dual SPAM + phishing detection with SOC dashboard",
        description:
          "Production-ready email threat detection: dual ML classification (~95% SPAM, ~92% phishing), <10ms inference, threat reports with IOCs. Hexagonal architecture, Docker multi-stage.",
        tags: ["scikit-learn", "FastAPI", "Docker", "NLP", "TF-IDF"],
        githubUrl:
          "https://github.com/infantesromeroadrian/ML-Spam-Phising-Detector",
        featured: false,
      },
      {
        title: "Risk Guardian",
        headline: "AI cybersecurity incident management",
        description:
          "RAG-powered incident analysis with MAGERIT, OCTAVE, ISO 27001, NIST frameworks. GPT-4.1 with streaming, 3 analysis tiers, 35K+ legal documents indexed.",
        tags: ["RAG", "LangChain", "FastAPI", "ISO 27001", "NIST"],
        githubUrl:
          "https://github.com/infantesromeroadrian/Risk-Management-System",
        featured: false,
      },
    ],
  },
  {
    id: "fintech",
    name: "FinTech",
    headline: "Fighting financial crime with AI agents",
    description:
      "Fraud detection, AML compliance, sanctions screening, KYC/KYB automation. Multi-agent systems that investigate transactions, generate compliance reports, and red-team AI models in regulated banking environments.",
    icon: "banknote",
    projects: [
      {
        title: "FraudAI Agent",
        headline: "AI platform that catches bank fraud before it happens",
        description:
          "Level 3 agentic platform with 6 specialized agents (Suits-inspired). Transaction fraud detection, AML/KYC compliance, fraud network graphs, AI red teaming. RAG with 35K+ BOE legal docs, sandboxed Docker execution. 482 tests, 93% coverage.",
        tags: [
          "LangGraph",
          "RAG",
          "Qdrant",
          "FastAPI",
          "Next.js",
          "Docker",
        ],
        githubUrl: "https://github.com/infantesromeroadrian/FraudAI-Agent",
        videoSrc: "/videos/FraudAI_Agent_Video_Generado.mp4",
        featured: true,
      },
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    headline: "AI-assisted medical triage and clinical decision support",
    description:
      "Multi-agent medical specialists, emergency triage prediction, clinical checklists, and explainable AI for healthcare. Systems designed to support medical professionals with transparent, auditable reasoning.",
    icon: "heart-pulse",
    projects: [
      {
        title: "Hospital Center AI",
        headline: "9 AI specialists triaging emergency patients",
        description:
          "LangGraph multi-agent medical system: 8 parallel specialists (Cardiology, Neurology, Oncology...) evaluate cases simultaneously. Consensus routing, PostgreSQL memory, WebSocket streaming, prompt injection defense.",
        tags: ["LangGraph", "PostgreSQL", "WebSocket", "Flask", "D3.js"],
        githubUrl:
          "https://github.com/infantesromeroadrian/LangGraph-Agents-HospitalCenter",
        videoSrc: "/videos/Video_Generado_y_Centro_Médico.mp4",
        featured: true,
      },
      {
        title: "Triagegeist",
        headline: "Predicting emergency triage acuity with 99.98% accuracy",
        description:
          "Kaggle Hackathon (Laitinen-Fredriksson Foundation, $10K prize). ESI triage prediction from 516 features: structured clinical data + NLP embeddings. LightGBM + XGBoost + CatBoost ensemble. Full SHAP explainability and fairness audit.",
        tags: [
          "XGBoost",
          "LightGBM",
          "CatBoost",
          "SHAP",
          "NLP",
          "Kaggle",
        ],
        githubUrl: "https://github.com/infantesromeroadrian/triagegeist",
        featured: true,
      },
    ],
  },
];

// Flat list for backward compatibility
export const projects: Project[] = sectors.flatMap((s) => s.projects);
