import type { Project } from "../lib/types";

export const projects: Project[] = [
  {
    title: "FraudAI Agent",
    headline: "AI platform that catches bank fraud before it happens",
    description:
      "Multi-agent system for banking fraud detection and AI red teaming in FinTech. Autonomous agents analyze transactions, detect anomalies, and test system resilience.",
    tags: ["LangGraph", "Multi-Agent", "FinTech", "Red Teaming", "Python"],
    githubUrl: "https://github.com/infantesromeroadrian/FraudAI-Agent",
    videoSrc: "/Web-AIR/videos/FraudAI_Agent_Video_Generado.mp4",
    featured: true,
  },
  {
    title: "Hospital Center AI",
    headline: "9 AI specialists triaging emergency patients",
    description:
      "Multi-agent AI triage system with LangGraph. 9 medical specialists, emergency routing, clinical checklists, and prompt injection defense.",
    tags: ["LangGraph", "Multi-Agent", "Medical AI", "AI Safety", "Python"],
    githubUrl:
      "https://github.com/infantesromeroadrian/LangGraph-Agents-HospitalCenter",
    videoSrc: "/Web-AIR/videos/Video_Generado_y_Centro_Médico.mp4",
    featured: true,
  },
  {
    title: "Drone GeoAnalysis",
    headline: "Turning drone footage into actionable intelligence",
    description:
      "LLM-powered geospatial analysis system that processes drone imagery and extracts structured intelligence using vision models and natural language.",
    tags: ["LLMs", "Computer Vision", "Geospatial", "Python", "PyTorch"],
    githubUrl:
      "https://github.com/infantesromeroadrian/Drone-GeoAnalysis-LLMs",
    videoSrc:
      "/Web-AIR/videos/Análisis_de_Proyecto_Drone_GeoAnalysis_LLMs.mp4",
    featured: true,
  },
  {
    title: "Spectra",
    headline: "Mapping attack surfaces with AI reasoning",
    description:
      "AI-powered attack surface reconnaissance tool. Scans targets for subdomains, open ports, services, and known vulnerabilities, stores in Neo4j, and provides an AI analyst.",
    tags: ["LangGraph", "Neo4j", "Security", "OSINT", "Python"],
    githubUrl:
      "https://github.com/infantesromeroadrian/Spectra-LangGraph-AI-Red-Teaming-Orchestration",
    featured: true,
  },
  {
    title: "WatchDogs Security City",
    headline: "Smart city threat monitoring system",
    description:
      "Real-time security event processing and monitoring for smart city infrastructure. Threat detection and automated response orchestration.",
    tags: ["Security", "Monitoring", "Real-time", "Python"],
    githubUrl:
      "https://github.com/infantesromeroadrian/WatchDogs-Security-City",
    featured: true,
  },
  {
    title: "SIEM Anomaly Detector",
    headline: "ML that finds the needle in millions of logs",
    description:
      "Machine learning-based anomaly detection system for SIEM data. Identifies suspicious patterns in security logs at scale.",
    tags: ["ML", "Cybersecurity", "SIEM", "Anomaly Detection", "Python"],
    githubUrl:
      "https://github.com/infantesromeroadrian/SIEM-Anomaly-Detector-ML",
    featured: true,
  },
];
