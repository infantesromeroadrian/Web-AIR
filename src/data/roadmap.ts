export interface Tag {
  t: string;
  l: string;
}

export interface Topic {
  name: string;
  st: string;
  h: number;
  detail: string;
  res?: string;
  tags?: Tag[];
  items: string[];
  boss?: boolean;
}

export interface Phase {
  id: string;
  name: string;
  month?: string;
  topics: Topic[];
  special?: { name: string; detail: string };
}

export interface Tier {
  tier: number;
  name: string;
  sub: string;
  phases: Phase[];
}

export interface EvolutionStage {
  tag: string;
  name: string;
  title: string;
  min: number;
  max: number;
  color: string;
  glow: string;
  img: string;
  desc: { en: string; es: string };
}

export const EVOLUTIONS: EvolutionStage[] = [
  { tag: "AI", name: "Adrian Infantes", title: "Estudiante", min: 0, max: 20, color: "#3b82f6", glow: "rgba(59,130,246,.4)", img: "/roadmap/l4-deeplearning.png", desc: { en: "Learning the fundamentals. Building the foundation.", es: "Aprendiendo los fundamentos. Construyendo la base." } },
  { tag: "AI", name: "Adrian Infantes", title: "Ingeniero", min: 20, max: 45, color: "#06b6d4", glow: "rgba(6,182,212,.4)", img: "/roadmap/l4-teaching.png", desc: { en: "Corporate engineer. Building AI systems by day.", es: "Ingeniero corporativo. Construyendo sistemas AI de dia." } },
  { tag: "L4", name: "L4tentNoise", title: "Shadow Operative", min: 45, max: 75, color: "#a855f7", glow: "rgba(168,85,247,.4)", img: "/roadmap/l4-redteam-analysis.png", desc: { en: "The alter ego emerges. Breaking what others build.", es: "El alter ego emerge. Rompiendo lo que otros construyen." } },
  { tag: "L4", name: "L4tentNoise", title: "The Architect", min: 75, max: 101, color: "#ef4444", glow: "rgba(239,68,68,.5)", img: "/roadmap/l4-aws-redteam.png", desc: { en: "Full spectrum. Builder and breaker. The 1%.", es: "Espectro completo. Constructor y destructor. El 1%." } },
];

export const PHASE_WEIGHTS: Record<string, number> = {
  "0": 5,
  "1": 5,
  "2": 8,
  "3A": 4,
  "3B": 5,
  "3C": 6,
  "3D/E": 3,
  "4": 3,
  "4B": 4,
  "5": 10,
  "6": 7,
  "7": 20,
  "8": 12,
  "9": 8,
};

export const ROADMAP: Tier[] = [
  {
    tier: 1,
    name: "Fundamentos",
    sub: "SECTOR ALPHA",
    phases: [
      {
        id: "0",
        name: "Matematicas",
        topics: [
          { name: "Algebra Lineal", st: "prog", h: 20, detail: "Curso completado. 3B1B 75%. PCA hecho.", res: "Coursera + 3Blue1Brown", tags: [{ t: "cert", l: "cert" }], items: ["Ver 3B1B Essence of Linear Algebra videos 1-8", "Completar Coursera Linear Algebra for ML", "Implementar operaciones matriciales en numpy", "Investigar autovalores: 3B1B video 14 + implementar numpy", "Leer MML Book cap 4 sobre SVD", "Implementar PCA desde cero numpy sobre MNIST", "Derivar normal equation a mano"] },
          { name: "Calculo", st: "prog", h: 20, detail: "Curso 20%. GD y backprop hechos.", res: "Coursera + 3Blue1Brown", items: ["Ver 3B1B Essence of Calculus completo", "Completar Coursera Calculus for ML", "Implementar gradient descent en numpy", "Derivar chain rule de backprop a mano", "Implementar backprop red 2 capas numpy", "Explicar chain rule a ARCA"] },
          { name: "Probabilidad", st: "prog", h: 20, detail: "Bayes + A/B test from scratch.", res: "Coursera + Khan", items: ["Completar Coursera Prob & Stats for ML", "Ver Khan Academy distribuciones", "Implementar Naive Bayes from scratch >95%", "Implementar z-test from scratch", "Construir A/B testing simulator", "Explicar Naive Bayes paso a paso a ARCA", "Estudiar MLE y MAP: MML Book cap 8"] },
          { name: "Optimizacion", st: "prog", h: 15, detail: "SGD+Momentum+Adam from scratch.", res: "MML Book Cap 7", items: ["Implementar SGD puro en numpy", "Implementar Momentum (beta=0.9)", "Implementar Adam + graficar loss curves", "Leer MML Book cap 7 convexidad", "Implementar cosine annealing", "Resolver 2 problemas Lagrange a mano"] },
        ],
      },
      {
        id: "1",
        name: "CS y Arquitectura",
        topics: [
          { name: "DSA+LC", st: "pend", h: 100, detail: "120: 80E+30M+10H", tags: [{ t: "v5", l: "120" }], items: ["Completar NeetCode DSA for Beginners", "Resolver 80 Easy LeetCode", "Resolver 30 Medium LeetCode", "Resolver 10 Hard LeetCode", "Resolver Medium en <25 min"] },
          { name: "Arquitectura", st: "pend", h: 20, detail: "SOLID, Hexagonal", items: ["Leer Clean Architecture caps 1-22", "SOLID en Python con RealPython", "Refactorizar proyecto ML hexagonal", "Disenar API REST para servicio ML"] },
          { name: "Tooling", st: "pend", h: 15, detail: "Docker, CI/CD, pytest", items: ["Docker Getting Started tutorial", "Dockerfile multi-stage para Python", "GitHub Actions CI/CD pipeline", "pytest >80% coverage + mypy strict"] },
          { name: "Proyecto API", st: "pend", h: 20, detail: "FastAPI+Docker+CI/CD", items: ["FastAPI tutorial + API para modelo ML", "Containerizar Docker multi-stage", "CI/CD GitHub Actions", "80% coverage + OpenAPI docs"], boss: true },
        ],
      },
      {
        id: "2",
        name: "ML/DL/GenAI+RL",
        topics: [
          { name: "Python", st: "done", h: 10, detail: "IT Specialist cert", tags: [{ t: "cert", l: "cert" }], items: ["Type hints avanzados mypy strict", "Implementar 3 decorators utiles", "Script async con aiohttp", "Paquete Python con uv", "Protocols para interfaces"] },
          { name: "ML Teoria", st: "prog", h: 25, detail: "3 certs. Falta DecTree.", tags: [{ t: "cert", l: "3x" }], items: ["Linear Regression from scratch", "Logistic Regression from scratch", "Decision Tree from scratch", "sklearn Pipeline completo", "2 Kaggle competitions", "Explicar bias-variance a ARCA"] },
          { name: "Deep Learning", st: "prog", h: 30, detail: "Attention 40%. Karpathy 50%.", items: ["Leer Attention Is All You Need", "Karpathy Let's build GPT", "Self-attention <30 lineas PyTorch", "CNN from scratch >80% CIFAR-10", "Derivar backprop attention a mano", "Training loop completo", "Explicar residual connections"] },
          { name: "GenAI", st: "prog", h: 30, detail: "Cert. LoRA pendiente.", tags: [{ t: "cert", l: "cert" }], items: ["Implementar BPE simplificado", "Fine-tune LoRA en RTX 2000 Ada", "Leer Scaling Laws Kaplan 2020", "Estudiar RLHF pipeline", "Leer DPO Rafailov 2023", "Explicar LoRA vs full fine-tuning"] },
          { name: "RL", st: "pend", h: 40, detail: "PPO+DPO obligatorio.", tags: [{ t: "v5", l: "v5" }], items: ["HuggingFace Deep RL Course 1-4", "REINFORCE en CartPole", "PPO basico clipped objective", "Estudiar RLHF", "DPO fine-tuning", "GRPO paper", "Explicar PPO vs REINFORCE", "Explicar DPO vs RLHF"] },
          { name: "Kaggle", st: "pend", h: 20, detail: "2 competiciones", items: ["2 competiciones activas", "EDA completo", "Feature engineering 5+", "Modelo + submission", "Publicar notebooks"], boss: true },
        ],
      },
    ],
  },
  {
    tier: 2,
    name: "Builder",
    sub: "SECTOR BRAVO",
    phases: [
      {
        id: "3A",
        name: "LLMs",
        topics: [
          { name: "Certs Claude", st: "done", h: 5, detail: "Fluency+101", tags: [{ t: "cert", l: "2x" }], items: ["Claude AI Fluency Framework", "Claude 101", "Anthropic Prompt Eng docs"] },
          { name: "Context Eng", st: "pend", h: 20, detail: "Prompts, outputs, tools", items: ["Benchmark ZS vs FS vs CoT", "System prompt vs 5+ ataques", "Structured outputs Pydantic+retry", "Tool calling schema JSON", "Prompt chain 3+ pasos", "Temperature alta vs baja", "KV cache internals"] },
        ],
      },
      {
        id: "3B",
        name: "RAG",
        topics: [
          { name: "RAG Basics", st: "done", h: 5, detail: "2 certs", tags: [{ t: "cert", l: "2x" }], items: ["PDF + chunking + Chroma pipeline", "DL.AI LangChain Chat with Data", "DataCamp AI Engineer Track"] },
          { name: "RAG Avanzado", st: "pend", h: 25, detail: "Reranking, agentic", items: ["Hybrid search dense+BM25", "Reranking cross-encoder", "Query transform HyDE", "Agentic RAG self-corrective", "RAG Security injection via docs", "RAGAS eval >0.7"] },
          { name: "VectorDBs", st: "pend", h: 15, detail: "Chroma, FAISS, Qdrant", items: ["Probar Chroma, FAISS, Qdrant", "HNSW, IVF, PQ indexing", "Comparar 3 chunking con RAGAS"] },
          { name: "Proyecto RAG", st: "pend", h: 30, detail: "UI+eval dashboard", items: ["Pipeline E2E completo", "UI Streamlit/Gradio", "RAGAS dashboard", "Publicar GitHub"], boss: true },
        ],
      },
      {
        id: "3C",
        name: "Agents",
        topics: [
          { name: "Patterns", st: "prog", h: 25, detail: "ReAct 30%", items: ["Leer paper ReAct", "ReAct from scratch 3+ tools", "create_react_agent() LangChain", "Leer paper Reflexion", "Plan-and-Execute agent"] },
          { name: "LangGraph", st: "pend", h: 30, detail: "Stack principal", items: ["LangGraph tutorials completos", "StateGraph 5+ nodos", "Checkpointing persistencia", "HITL interrupt+Command", "Subgraphs modulares", "Streaming tokens"] },
          { name: "Multi-Agent", st: "pend", h: 30, detail: "Supervisor, MCP", items: ["Supervisor 1 router + 3 specialists", "MCP server Python FastMCP", "MCP server TypeScript", "Conectar MCP a Claude Code", "Agent memory short+long"] },
          { name: "Agent Security", st: "pend", h: 25, detail: "Guardrails, audit", items: ["LangSmith tracing+evaluator", "Guardrails I/O filtering", "Sandboxing aislado", "PROYECTO multi-agent+audit"], boss: true },
        ],
      },
      {
        id: "3D/E",
        name: "Multi+MLOps",
        topics: [
          { name: "Multimodal", st: "pend", h: 15, detail: "Vision, audio", items: ["Claude/GPT-4V image understanding", "Whisper STT integration", "Multimodal RAG"] },
          { name: "MLOps", st: "prog", h: 25, detail: "1 cert. vLLM pend.", tags: [{ t: "cert", l: "cert" }], items: ["MLflow 3 experimentos", "Model registry + DVC", "vLLM en RTX 2000 Ada", "ONNX export + benchmark", "Monitoring drift+alertas"] },
        ],
      },
      {
        id: "4",
        name: "Sistemas",
        topics: [
          { name: "GPU Conceptual", st: "pend", h: 10, detail: "Understand only", tags: [{ t: "v5", l: "v5" }], items: ["Paper FlashAttention + diagrama", "DDP vs FSDP vs DeepSpeed tabla", "Quantizar GPTQ + benchmark", "Mixed precision torch.autocast"] },
          { name: "System Design", st: "pend", h: 25, detail: "3 designs", items: ["Rec system 100M users 45min", "Fraud detection pipeline 45min", "LLM serving + rate limiting 45min", "PyTorch profiler bottlenecks"], boss: true },
        ],
      },
      {
        id: "4B",
        name: "AWS",
        topics: [
          { name: "Certs Cloud", st: "done", h: 0, detail: "3 certs existentes", tags: [{ t: "cert", l: "3x" }], items: ["AWS AI Practitioner Mar 2026", "MS AI-900 Oct 2023", "MS AI-102 Mar 2024"] },
          { name: "AWS CCP", st: "pend", h: 25, detail: "Unica obligatoria", tags: [{ t: "v5", l: "CCP" }], items: ["Curso Stephane Maarek", "4+ practice exams Tutorials Dojo", "Aprobar CLF-C02 $100", "Shared responsibility"] },
          { name: "AWS Hands-on", st: "pend", h: 30, detail: "Deploy, Bedrock", items: ["EC2 GPU g5 spot", "Lambda+SageMaker pipeline", "ECR+ECS container", "IAM+KMS encryption", "Bedrock Claude/Llama"] },
        ],
      },
      {
        id: "5",
        name: "Research",
        topics: [
          { name: "Papers", st: "prog", h: 50, detail: "1/semana, 50+", tags: [{ t: "v5", l: "wk1" }], items: ["Attention Is All You Need", "Scaling Laws Kaplan 2020", "Constitutional AI Bai 2022", "DPO Rafailov 2023", "Adversarial Attacks Zou 2023", "Indirect Injection Greshake 2023", "Sleeper Agents Hubinger 2024", "FlashAttention Dao 2022", "LoRA Hu 2021"] },
          { name: "Contenido", st: "pend", h: 40, detail: "3 blogs, 1 charla", items: ["Reproducir 3 papers GitHub", "3 blog posts EN", "1 charla/presentacion", "RLHF vs DPO vs Constitutional AI"], boss: true },
        ],
      },
    ],
  },
  {
    tier: 3,
    name: "Breaker",
    sub: "SECTOR CHARLIE",
    phases: [
      {
        id: "6",
        name: "Security",
        topics: [
          { name: "Certs Sec", st: "done", h: 0, detail: "Linux+Cyber+OSINT", tags: [{ t: "cert", l: "3x" }], items: ["Linux 100 TCM cert", "Intro Cybersecurity Cisco cert", "OSINT TCM cert"] },
          { name: "Net+HTB", st: "prog", h: 50, detail: "HTB en curso", items: ["HTB Academy networking modules", "15+ maquinas HTB+writeups", "Writeup completo cada maquina"] },
          { name: "Web OWASP", st: "pend", h: 40, detail: "30+ labs", items: ["5+ labs SQLi PortSwigger", "5+ labs XSS PortSwigger", "5+ labs CSRF/SSRF", "5+ labs Auth/IDOR", "Dominar Burp Suite", "30+ labs total"] },
          { name: "Hardening", st: "pend", h: 15, detail: "SSH, iptables", items: ["SSH hardening keys+fail2ban", "iptables/nftables firewall", "Wireshark 10 capturas", "PKI JWT OAuth en Python"], boss: true },
        ],
      },
      {
        id: "7",
        name: "AI Red Team",
        topics: [
          { name: "Certs AI", st: "done", h: 0, detail: "SANS x2 + EU AI Act", tags: [{ t: "cert", l: "3x" }], items: ["SANS Prompt Hacking cert", "SANS Advanced cert", "EU AI Act cert"] },
          { name: "HTB ART", st: "prog", h: 60, detail: "Path en curso", items: ["100% HTB AI Red Teamer Path", "Certificacion examen practico", "Labs hands-on cada modulo", "Writeups con metodologia"] },
          { name: "LLM Sec", st: "pend", h: 30, detail: "Injection, jailbreak", items: ["5+ direct injection en Ollama", "Indirect injection via docs RAG", "Jailbreaking DAN crescendo many-shot", "System prompt extraction 3+ chatbots", "OWASP Top 10 LLMs v2 completo", "MITRE ATLAS framework", "Documentar cada tecnica"] },
          { name: "Adversarial", st: "pend", h: 30, detail: "FGSM, training", items: ["FGSM desde cero PyTorch", "PGD comparar con FGSM", "Adversarial training defensa", "Model stealing queries", "Data poisoning simulacion", "Robustness before/after"] },
          { name: "Tools RT", st: "pend", h: 25, detail: "Garak, PyRIT", items: ["Garak 3+ modelos", "PyRIT automatizado", "Red team report profesional", "Mini-scanner vulns propio"] },
          { name: "Auto RT", st: "pend", h: 40, detail: "Pipelines, AI vs AI", tags: [{ t: "v5", l: "+4sem" }], items: ["Automated jailbreak pipeline", "Eval framework before/after", "AI vs AI attacker/defender", "CI integration automatica", "Documentar repo publico"], boss: true },
        ],
      },
    ],
  },
  {
    tier: 4,
    name: "Unicorn",
    sub: "SECTOR DELTA",
    phases: [
      {
        id: "8",
        name: "Portfolio",
        topics: [
          { name: "OSS", st: "pend", h: 40, detail: "PRs AI security", tags: [{ t: "v5", l: "AI sec" }], items: ["3+ PRs docs/typos/tests", "2+ PRs bug fixes AI security", "1+ PR feature tier-1", "GitHub activity consistente"] },
          { name: "P1: RT Tool", st: "pend", h: 80, detail: "Scanner+pipeline", tags: [{ t: "v5", l: "MAIN" }], items: ["CLI + plugins modulares", "Scanner injection 5+ tecnicas", "Jailbreak discovery pipeline", "80% coverage pytest", "GitHub + README", "Foco agentic/MCP attacks"] },
          { name: "P2: Agent", st: "pend", h: 60, detail: "Multi-agent seguro", items: ["LangGraph+MCP+Docker", "RAG seguro anti-injection", "Audit trail completo", "Red team tested con P1"] },
          { name: "P3: E2E", st: "pend", h: 80, detail: "Produccion+blog", items: ["App produccion AWS", "Security cada capa", "Blog post arquitectura", "Red team report", "Integra P1 y P2"], boss: true },
        ],
      },
      {
        id: "9",
        name: "Visibilidad",
        topics: [
          { name: "Presencia", st: "pend", h: 30, detail: "Blog, charlas", items: ["6 blog posts EN", "2 charlas meetup/conf", "Twitter/X 1 post/sem", "LinkedIn optimizado"] },
          { name: "Network", st: "pend", h: 25, detail: "Communities", tags: [{ t: "v5", l: "new" }], items: ["AI Village DEF CON", "MLSecOps Community", "OWASP LLM Top 10", "Cold emails 1/sem", "2+ conferencias"] },
          { name: "Entrevistas", st: "pend", h: 60, detail: "LC+design+mocks", items: ["120 LeetCode 80E+30M+10H", "10 ML system designs", "5+ mock interviews", "Transformer pizarra 45min", "FGSM pizarra 30min", "STAR format proyectos", "AI Sec deep dive"] },
          { name: "Original", st: "pend", h: 40, detail: "1 hallazgo nuevo", tags: [{ t: "v5", l: "crit" }], items: ["Jailbreak nuevo documentado", "O defensa con metricas", "O analisis unico", "Publicar blog/writeup", "Compartir en comunidades"], boss: true },
        ],
      },
    ],
  },
];
