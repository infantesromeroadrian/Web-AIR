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
  { tag: "AI", name: "Adrian Infantes", title: "Estudiante", min: 0, max: 18, color: "#3b82f6", glow: "rgba(59,130,246,.4)", img: "/roadmap/l4-deeplearning.png", desc: { en: "Learning the fundamentals. Building the foundation.", es: "Aprendiendo los fundamentos. Construyendo la base." } },
  { tag: "AI", name: "Adrian Infantes", title: "Ingeniero", min: 18, max: 38, color: "#06b6d4", glow: "rgba(6,182,212,.4)", img: "/roadmap/l4-teaching.png", desc: { en: "Corporate engineer. Building AI systems by day.", es: "Ingeniero corporativo. Construyendo sistemas AI de dia." } },
  { tag: "L4", name: "L4tentNoise", title: "Shadow Operative", min: 38, max: 60, color: "#a855f7", glow: "rgba(168,85,247,.4)", img: "/roadmap/l4-redteam-analysis.png", desc: { en: "The alter ego emerges. Breaking what others build.", es: "El alter ego emerge. Rompiendo lo que otros construyen." } },
  { tag: "L4", name: "L4tentNoise", title: "The Architect", min: 60, max: 82, color: "#ef4444", glow: "rgba(239,68,68,.5)", img: "/roadmap/l4-aws-redteam.png", desc: { en: "Full spectrum. Builder and breaker. The 1%.", es: "Espectro completo. Constructor y destructor. El 1%." } },
  { tag: "T1", name: "L4tentNoise", title: "Tier 1 Operator", min: 82, max: 101, color: "#fbbf24", glow: "rgba(251,191,36,.55)", img: "/roadmap/l4-aws-redteam.png", desc: { en: "Anthropic / OpenAI / NVIDIA grade. Defining what AI will be.", es: "Nivel Anthropic / OpenAI / NVIDIA. Definiendo lo que sera la IA." } },
];

export const PHASE_WEIGHTS: Record<string, number> = {
  "0": 4,
  "1": 6,
  "2": 7,
  "3A": 3,
  "3B": 4,
  "3C": 5,
  "3D/E": 3,
  "4": 6,
  "4B": 3,
  "5": 12,
  "6": 6,
  "7": 22,
  "8": 11,
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
          { name: "Algebra Lineal", st: "prog", h: 20, detail: "Curso completado. 3B1B 75%. PCA hecho.", res: "Coursera + 3Blue1Brown + MML Book", items: ["Ver 3B1B Essence of Linear Algebra videos 1-8", "Completar Coursera Linear Algebra for ML", "Implementar operaciones matriciales en numpy", "Investigar autovalores: 3B1B video 14 + implementar numpy", "Leer MML Book cap 4 sobre SVD", "Implementar PCA desde cero numpy sobre MNIST", "Derivar normal equation a mano"] },
          { name: "Calculo", st: "prog", h: 20, detail: "Curso 20%. GD y backprop hechos.", res: "Coursera + 3Blue1Brown", items: ["Ver 3B1B Essence of Calculus completo", "Completar Coursera Calculus for ML", "Implementar gradient descent en numpy", "Derivar chain rule de backprop a mano", "Implementar backprop red 2 capas numpy", "Explicar chain rule a ARCA"] },
          { name: "Probabilidad", st: "prog", h: 20, detail: "Bayes + A/B test from scratch.", res: "Coursera + Khan + MML Book", items: ["Completar Coursera Prob & Stats for ML", "Ver Khan Academy distribuciones", "Implementar Naive Bayes from scratch >95%", "Implementar z-test from scratch", "Construir A/B testing simulator", "Explicar Naive Bayes paso a paso a ARCA", "Estudiar MLE y MAP: MML Book cap 8"] },
          { name: "Optimizacion", st: "prog", h: 15, detail: "SGD+Momentum+Adam from scratch.", res: "MML Book Cap 7", items: ["Implementar SGD puro en numpy", "Implementar Momentum (beta=0.9)", "Implementar Adam + graficar loss curves", "Leer MML Book cap 7 convexidad", "Implementar cosine annealing", "Resolver 2 problemas Lagrange a mano"] },
          { name: "Information Theory", st: "pend", h: 15, detail: "Entropy, KL, MI. Base de RLHF y mech interp.", res: "MacKay ITILA + Cover & Thomas", tags: [{ t: "v5", l: "T1" }], items: ["Definir entropy, cross-entropy, KL divergence", "Implementar KL divergence numpy + verificar asimetria", "Mutual information entre 2 variables discretas", "Derivar cross-entropy loss desde MLE", "Leer MacKay caps 1-4 (ITILA)", "Conectar KL con RLHF reward model + DPO loss", "Explicar por que KL es la metrica de Constitutional AI"] },
          { name: "Tiny GPT from scratch", st: "pend", h: 40, detail: "Karpathy nanoGPT + derivar toda la math a mano.", res: "Karpathy makemore + Let's build GPT + nanoGPT", tags: [{ t: "v5", l: "CAP" }], items: ["Reproducir Karpathy makemore (1-7) en notebook propio", "Reproducir Let's build GPT (Karpathy YouTube)", "Derivar attention math en papel: Q,K,V,softmax,scaled dot-product", "Derivar backprop a traves de attention paso a paso", "Implementar nanoGPT desde cero (no copy-paste) en RTX 2000 Ada", "Entrenar sobre tiny shakespeare + lograr loss <2.0", "Generar texto coherente + medir perplexity", "Escribir blog post EN explicando cada operacion matematica", "Defender el proyecto en mock interview EN 30min"], boss: true },
        ],
      },
      {
        id: "1",
        name: "CS y Arquitectura",
        topics: [
          { name: "DSA+LC", st: "pend", h: 100, detail: "120: 80E+30M+10H", tags: [{ t: "v5", l: "120" }], items: ["Completar NeetCode DSA for Beginners", "Resolver 80 Easy LeetCode", "Resolver 30 Medium LeetCode", "Resolver 10 Hard LeetCode", "Resolver Medium en <25 min"] },
          { name: "Arquitectura", st: "pend", h: 20, detail: "SOLID, Hexagonal, ADRs", items: ["Leer Clean Architecture caps 1-22", "SOLID en Python con RealPython", "Refactorizar 1 proyecto ML a estructura hexagonal", "Escribir 3 ADRs (Architecture Decision Records)", "Diagramar C4 (context/container/component) de un sistema ML"] },
          { name: "Tooling", st: "pend", h: 20, detail: "Docker, CI/CD, pytest, lint, security", items: ["Docker Getting Started + multi-stage para Python", "GitHub Actions CI/CD pipeline (lint+test+build)", "pytest >80% coverage + mypy strict", "Pre-commit hooks: ruff + black + mypy + bandit", "Dependabot + secret scanning activos en repo"] },
          { name: "English C1", st: "prog", h: 80, detail: "B2 -> C1 fluido. Tier 1 gate.", res: "Cambridge / Coursera / shadowing", tags: [{ t: "v5", l: "C1" }], items: ["Cambridge Advanced (CAE) practice tests", "Shadowing 30 min/dia con podcasts tecnicos", "Lectura semanal de papers en EN sin traduccion", "1 sesion/semana mock interview tecnica EN", "Pasar examen oficial C1 (CAE / IELTS 7.5+)", "Defender white paper en presentacion EN 30min"] },
          { name: "Proyecto API", st: "pend", h: 30, detail: "FastAPI prod-grade + auth + rate limit + deploy live", items: ["FastAPI sirviendo 1 modelo ML real (sklearn/HF)", "Pydantic strict validation en input + output", "JWT auth + rate limit (Redis sliding window)", "Dockerfile multi-stage + image <300MB", "CI/CD GitHub Actions (lint + test + build + deploy)", "Tests pytest >85% coverage + integration tests", "OpenAPI docs + ejemplos curl en README", "Deploy live en Vercel / Fly.io / Railway con HTTPS", "Load test con k6 o Locust + reportar p50/p95/p99", "Monitoring basico (logs estructurados + healthcheck)"], boss: true },
        ],
      },
      {
        id: "2",
        name: "ML/DL/GenAI+RL",
        topics: [
          { name: "Python", st: "done", h: 10, detail: "IT Specialist cert", tags: [{ t: "cert", l: "cert" }], items: ["Type hints avanzados mypy strict", "Implementar 3 decorators utiles", "Script async con aiohttp", "Paquete Python con uv", "Protocols para interfaces"] },
          { name: "ML Teoria", st: "prog", h: 25, detail: "3 certs. Falta DecTree.", tags: [{ t: "cert", l: "3x" }], items: ["Linear Regression from scratch", "Logistic Regression from scratch", "Decision Tree from scratch", "sklearn Pipeline completo", "Explicar bias-variance a ARCA", "Conectar regularizacion L1/L2 con MAP"] },
          { name: "Deep Learning", st: "prog", h: 35, detail: "Attention 40%. Karpathy 50%. PyTorch internals.", items: ["Leer Attention Is All You Need", "Karpathy Let's build GPT", "Self-attention <30 lineas PyTorch", "CNN from scratch >80% CIFAR-10", "Derivar backprop attention a mano", "Training loop completo (mixed precision + grad accum)", "Explicar residual connections", "PyTorch autograd internals: torch.Function custom", "Forward/backward hooks para inspeccionar gradients", "torch.compile + ver fx graph"] },
          { name: "GenAI", st: "prog", h: 35, detail: "Cert. LoRA real en RTX 2000 Ada.", tags: [{ t: "cert", l: "cert" }], items: ["Implementar BPE simplificado from scratch", "Tokenizer comparison: BPE vs Unigram vs WordPiece", "Fine-tune LoRA real en RTX 2000 Ada (Llama 3.2 1B/3B)", "Medir VRAM: full FT vs LoRA vs QLoRA", "Leer Scaling Laws Kaplan 2020 + Chinchilla", "Estudiar RLHF pipeline end-to-end", "Leer DPO Rafailov 2023", "Implementar prompt caching + KV cache analysis", "Explicar LoRA vs full fine-tuning con metricas"] },
          { name: "RL", st: "pend", h: 40, detail: "PPO+DPO+GRPO. Foco alignment.", tags: [{ t: "v5", l: "v5" }], items: ["HuggingFace Deep RL Course 1-4", "REINFORCE en CartPole", "PPO basico clipped objective", "Estudiar RLHF (InstructGPT paper)", "DPO fine-tuning real sobre 1 modelo HF", "GRPO paper (DeepSeek-R1)", "Explicar PPO vs REINFORCE", "Explicar DPO vs RLHF + ventajas computacionales", "Conectar reward hacking con specification gaming"] },
          { name: "Kaggle", st: "pend", h: 60, detail: "2 competitions, target >=1 medalla bronze.", items: ["Identificar 2 competiciones featured activas", "EDA reproducible (notebook + writeup EN)", "Feature engineering 5+ tecnicas con ablation", "Baseline + 3 modelos diferentes + ensemble", "Submission diaria durante 4+ semanas", "Target: top 25% (bronze) en >=1 competicion", "Publicar notebook + writeup EN al cerrar"] },
          { name: "SOTA Reproduction", st: "pend", h: 60, detail: "Reproducir 1 paper SOTA end-to-end con PyTorch internals.", res: "Papers With Code + arXiv reproducibility", tags: [{ t: "v5", l: "REPRO" }], items: ["Elegir 1 paper reciente (2024-2026) con codigo abierto", "Leer paper + entender cada eq matematica", "Reescribir desde cero (NO copy-paste de repo oficial)", "Match metricas reportadas dentro de 5%", "Profile con torch.profiler + identificar 1+ bottleneck", "Optimizar bottleneck: torch.compile o custom kernel", "Pull request al repo oficial con improvement", "Blog post EN: paper + reimplementation + finding"], boss: true },
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
          { name: "Context Eng", st: "pend", h: 25, detail: "Prompts, outputs, tools, scratchpad", items: ["Benchmark ZS vs FS vs CoT sobre 1 dataset propio", "System prompt vs 5+ ataques (jailbreak/leak/role hijack)", "Prompt chain 3+ pasos con scratchpad explicito", "Temperature alta vs baja: medir varianza de output", "Few-shot retrieval dinamico con embeddings", "Reflection / self-critique pattern (Reflexion paper)", "Constitutional prompting (Anthropic principles)"] },
          { name: "LLM APIs Avanzado", st: "pend", h: 25, detail: "Anthropic-grade: caching, batch, tools, streaming.", res: "docs.anthropic.com + cookbook", tags: [{ t: "v5", l: "API" }], items: ["Structured outputs con Pydantic + retry on schema fail", "Tool calling con schema JSON + parallel tool use", "Streaming SSE end-to-end con backpressure", "Anthropic batch API: 50% cheaper para jobs offline", "Prompt caching: ephemeral cache + medir ahorro tokens", "Computer use API: 1 demo controlada en sandbox", "Citations API: extraccion con fuentes verificables", "Token counting client-side antes de enviar"] },
          { name: "Prompt Library + Evals", st: "pend", h: 35, detail: "Production-grade prompt library con eval harness.", res: "Anthropic Cookbook + langsmith / promptfoo", tags: [{ t: "v5", l: "MAIN" }], items: ["Disenar 10+ prompts canonical para tareas reales", "Versionado prompts (semver + changelog)", "Golden dataset 50+ casos con expected outputs", "Eval harness: regression test sobre cada commit", "A/B testing 2 prompts + significancia estadistica", "Cost dashboard: tokens in/out + latency p50/p95", "Detectar drift cuando cambia version de modelo", "Documentacion EN + 1 blog post explicando approach", "Publicar libreria en GitHub con README + ejemplos"], boss: true },
        ],
      },
      {
        id: "3B",
        name: "RAG",
        topics: [
          { name: "RAG Basics", st: "done", h: 5, detail: "2 certs", tags: [{ t: "cert", l: "2x" }], items: ["PDF + chunking + Chroma pipeline", "DL.AI LangChain Chat with Data", "DataCamp AI Engineer Track"] },
          { name: "RAG Avanzado", st: "pend", h: 30, detail: "Reranking, agentic, eval rigor.", items: ["Hybrid search dense+BM25 con weighting tuneado", "Reranking cross-encoder (bge-reranker-v2-m3)", "Query transform HyDE + multi-query expansion", "Agentic RAG self-corrective (CRAG / Self-RAG)", "RAG Security: injection via docs, prompt smuggling", "Construir golden dataset 50+ Q/A con ground truth", "Metricas IR: recall@k, MRR, nDCG sobre golden set", "RAGAS faithfulness + answer_relevancy >0.8", "Ablation: chunking strategy vs metricas IR"] },
          { name: "VectorDBs", st: "pend", h: 15, detail: "Chroma, FAISS, Qdrant, pgvector.", items: ["Probar Chroma, FAISS, Qdrant, pgvector con mismo dataset", "HNSW, IVF, PQ indexing: medir trade-off speed/recall", "Filtros metadatos + namespaces", "Comparar 3 chunking (token, semantic, recursive) con RAGAS"] },
          { name: "Proyecto RAG", st: "pend", h: 40, detail: "Production-grade RAG con eval harness + observability.", items: ["Pipeline E2E con hybrid search + reranking + cite", "UI Streamlit/Gradio con citations clickables", "Eval harness automatizado en CI sobre golden set", "Dashboard live: RAGAS scores + latencia + costo", "Query analytics: top failures + fail mode taxonomy", "Red team: 10+ prompt injection via docs + mitigacion", "Deploy en Vercel/Fly.io con Upstash Redis cache", "Blog post EN + repo publico con README ejecutable"], boss: true },
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
          { name: "CUDA + Triton", st: "pend", h: 60, detail: "Kernels custom. NVIDIA gate.", res: "NVIDIA Deep Learning Institute + OpenAI Triton tutorials", tags: [{ t: "v5", l: "NVDA" }], items: ["Programming Massively Parallel Processors caps 1-10", "Hello-world CUDA kernel + nvcc compile", "Matmul tiled CUDA vs cuBLAS benchmark", "Triton tutorial 1-5 (vector add, softmax, matmul, fused attention)", "Custom Triton kernel para LayerNorm + benchmark vs PyTorch", "Profile con nsight-compute + occupancy analysis", "Reproducir Flash Attention v2 en Triton", "Escribir blog post EN sobre kernel optimization"], boss: true },
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
          { name: "Contenido", st: "pend", h: 40, detail: "3 blogs, 1 charla", items: ["Reproducir 3 papers GitHub", "3 blog posts EN", "1 charla/presentacion", "RLHF vs DPO vs Constitutional AI"] },
          { name: "ArXiv Submission", st: "pend", h: 80, detail: "1+ paper en arxiv.org/cs.CR o cs.LG", res: "arXiv + OpenReview", tags: [{ t: "v5", l: "1st" }], items: ["Identificar gap de investigacion en AI Red Team", "Diseno experimental + metricas reproducibles", "Implementacion + ablations sobre 3+ modelos", "Draft con LaTeX template NeurIPS / USENIX", "Peer feedback de 3 investigadores via X/email", "Endorsement arXiv + submission cs.CR/cs.LG", "Tweet thread + LinkedIn post EN al publicar", "Apuntar a workshop ICML/NeurIPS AI Safety"], boss: true },
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
          { name: "CVE Disclosure", st: "pend", h: 50, detail: "1+ CVE asignado en modelo comercial", res: "MITRE CVE + HuggingFace Bug Bounty + Anthropic / OpenAI / Google VRP", tags: [{ t: "v5", l: "CVE" }], items: ["Identificar 3+ targets con bug bounty AI program", "Replicar vuln en entorno aislado con PoC", "Coordinated disclosure email + 90-day window", "Reservar CVE ID via MITRE", "Publicar advisory tras patch", "Writeup tecnico EN + tweet thread", "Responder a CVE en LinkedIn como milestone", "Apuntar a >=1 CVE crit/high/year"], boss: true },
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
