import type { Experience } from "../lib/types";

export const experience: Experience[] = [
  {
    company: "BBVA Technology",
    role: "AI Security Architect",
    period: "Jan 2026 -- Present",
    location: "Madrid, Spain",
    headline:
      "Protecting AI systems in European banking from adversarial attacks",
    description:
      "Designed the AI Safety architecture (HLD/LLD) for sensitive data processing in Financial Crime environments -- AML, KYC/KYB, and Transaction Monitoring pipelines -- combining NVIDIA infrastructure (DGX + Triton) with Azure Confidential Computing.",
    highlights: [
      "Led AI Red Teaming: 206+ attack vectors evaluated, 7 critical findings remediated pre-deploy",
      "MLSecOps end-to-end: security gates in CI/CD, Zero Trust, Defense-in-Depth architecture",
      "Hybrid on-premise + cloud architecture with GDPR and banking regulation compliance",
    ],
    impact: [
      { label: "Latency", value: "-20%" },
      { label: "Costs", value: "-35%" },
      { label: "Attacks tested", value: "206+" },
    ],
    tags: [
      "AI Safety",
      "Red Teaming",
      "MITRE ATLAS",
      "OWASP LLMs",
      "PyRIT",
      "Garak",
      "NVIDIA DGX",
      "Triton",
      "Azure TEEs",
      "MLSecOps",
      "Zero Trust",
      "Kubernetes",
    ],
  },
  {
    company: "BBVA Technology",
    role: "AI/ML Engineer",
    period: "Jan 2024 -- Jan 2026",
    location: "Madrid, Spain",
    headline:
      "Building secure RAG and fraud detection for financial crime prevention",
    description:
      "Design, development and deployment of AI systems with integrated AI Safety for regulated financial sector environments, combining on-premise GPU clusters and AWS (SageMaker, Bedrock).",
    highlights: [
      "Secure RAG with guardrails (GraphRAG, Self-RAG) on sensitive documentation using FAISS + Elasticsearch",
      "NLP pipelines processing +10M interactions/year -- ASR, diarization, sentiment analysis",
      "Fraud detection ensemble models (XGBoost + Transformers) on 50K documents/day",
    ],
    impact: [
      { label: "Retrieval precision", value: "+15%" },
      { label: "Fraud detection", value: "+22% AUC" },
      { label: "Time-to-market", value: "-40%" },
    ],
    tags: [
      "LLMs",
      "RAG",
      "GraphRAG",
      "LangChain",
      "PyTorch",
      "NLP",
      "Transformers",
      "XGBoost",
      "MLflow",
      "AWS SageMaker",
      "Bedrock",
      "Docker",
      "EKS",
    ],
  },
  {
    company: "Ecoembes",
    role: "Machine Learning Engineer",
    period: "Feb 2020 -- Jan 2024",
    location: "Madrid, Spain",
    headline:
      "Automating waste classification with computer vision and edge AI",
    description:
      "Technological modernization of waste sorting plants using hybrid cloud + Edge AI architectures, automating classification, logistics optimization and operational analytics.",
    highlights: [
      "Real-time CV classification system: 12 waste types, 85% accuracy, 45K images/hour, <100ms latency",
      "Logistics optimization: heuristic route algorithms migrated to cloud, -25% km traveled",
      "NLP assistant: migrated legacy to BERT multilingual, +40% precision in citizen queries",
    ],
    impact: [
      { label: "Throughput", value: "45K img/h" },
      { label: "Latency", value: "<100ms" },
      { label: "CO2 footprint", value: "-18%" },
    ],
    tags: [
      "Computer Vision",
      "PyTorch",
      "ONNX",
      "Edge AI",
      "SageMaker",
      "BERT",
      "NLP",
      "IoT",
      "Docker",
      "MLOps",
      "CI/CD",
    ],
  },
  {
    company: "Capgemini",
    role: "Data Scientist",
    period: "Jan 2019 -- Feb 2020",
    location: "Madrid, Spain",
    headline: "Modernizing analytics with cloud data pipelines on AWS",
    description:
      "Contributed to the design and modernization of analytical solutions on AWS, working on data pipelines, predictive modeling, BI and automation.",
    highlights: [
      "Data Lake & ETL: consolidated 10+ data sources into S3 with Python and Boto3",
      "Predictive modeling with scikit-learn for product adoption forecasting",
      "Serverless automation with AWS Lambda, saving 10 hours/week per analyst",
    ],
    impact: [
      { label: "Analysis cycle", value: "-30%" },
      { label: "Query time", value: "-35%" },
      { label: "Forecast accuracy", value: "+20%" },
    ],
    tags: [
      "Python",
      "AWS S3",
      "Lambda",
      "RDS",
      "scikit-learn",
      "Tableau",
      "QuickSight",
      "ETL",
      "PostgreSQL",
    ],
  },
];
