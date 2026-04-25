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
  "3D": 4,
  "4": 6,
  "4B": 2,
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
          { name: "Patterns", st: "prog", h: 30, detail: "ReAct, Reflexion, Plan-Exec, ReWOO.", items: ["Leer paper ReAct + ReAct from scratch 3+ tools", "create_react_agent() LangChain con tool calling", "Leer paper Reflexion + implementar self-critique loop", "Plan-and-Execute agent (planner + executor separados)", "ReWOO pattern (decouple reasoning from tools)", "Comparar latencia/coste de los 4 patterns sobre 1 task"] },
          { name: "LangGraph", st: "pend", h: 35, detail: "Stack principal: state, HITL, time-travel.", items: ["LangGraph tutorials completos (Graph + Functional API)", "StateGraph con 5+ nodos + edges condicionales", "Checkpointing con SQLite y Postgres", "HITL: interrupt() + Command(resume=...)", "Time-travel: rewind a checkpoint anterior + replay", "Send / Command para fan-out paralelo", "Subgraphs modulares con scoping de checkpointer", "Streaming tokens + intermediate steps"] },
          { name: "Multi-Agent", st: "pend", h: 30, detail: "Supervisor, swarm, MCP.", items: ["Supervisor pattern: 1 router + 3 specialists con LangGraph", "Swarm pattern: handoff dinamico entre agents", "MCP server Python con FastMCP (tools + resources + prompts)", "MCP server TypeScript con SDK oficial", "Conectar MCP propio a Claude Code", "Probar 3+ MCP servers del registry oficial", "Agent memory: short-term (state) + long-term (Store)"] },
          { name: "Agent Security", st: "pend", h: 35, detail: "Guardrails, sandboxing, audit, evals.", res: "LangSmith + Guardrails AI + OWASP Agentic", items: ["LangSmith tracing en todas las runs", "LangSmith evaluator custom + dataset de regresion", "Guardrails I/O filtering (LLM Guard / Guardrails AI)", "Sandboxing: tool execution en Docker aislado", "Audit trail completo: input -> trace -> output -> evals", "OWASP Top 10 Agentic AI 2026 mapping"] },
          { name: "Proyecto Multi-Agent", st: "pend", h: 40, detail: "Capstone agentic con security + evals + deploy.", tags: [{ t: "v5", l: "MAIN" }], items: ["Definir use case real (research / coding / red team)", "Arquitectura supervisor + 3+ specialists con LangGraph", "Integrar 2+ MCP servers (1 propio + 1 del registry)", "Memory persistente (Store) + checkpointing Postgres", "HITL gate antes de tool calls peligrosos", "Eval harness con LangSmith + regresion en CI", "Red team: prompt injection en tool outputs (probado con P1 RT Tool)", "Deploy en LangGraph Platform o self-hosted Docker", "Blog post EN + repo publico"], boss: true },
        ],
      },
      {
        id: "3D",
        name: "MLOps",
        topics: [
          { name: "MLOps Foundations", st: "prog", h: 30, detail: "MLflow + DVC + vLLM + ONNX + drift.", tags: [{ t: "cert", l: "cert" }], items: ["MLflow tracking: 3 experiments con metrics + params + artifacts", "Model registry + DVC versioning del dataset", "vLLM serving en RTX 2000 Ada con paged attention", "ONNX export + benchmark latencia vs PyTorch", "Monitoring drift con EvidentlyAI o Aporia"] },
          { name: "CI/CD ML", st: "pend", h: 25, detail: "Pipelines reproducibles, testing, registry promotion.", res: "MLOps Zoomcamp + Made With ML", items: ["Pipeline GitHub Actions: train + eval + register", "Tests automatizados: data quality + model quality", "Promotion automatica registry: staging -> production con gate", "Rollback automatico si drift > threshold", "Feature store basico (Feast) con offline + online"] },
          { name: "MLOps E2E Production", st: "pend", h: 50, detail: "Modelo en prod con drift detection + retraining trigger.", res: "Made With ML + Designing ML Systems (Huyen)", tags: [{ t: "v5", l: "MAIN" }], items: ["Entrenar 1 modelo real (tabular o LLM fine-tune)", "Servir con FastAPI + vLLM o BentoML", "Deploy en cloud (AWS/GCP) con auto-scaling", "Drift detection: data drift + prediction drift + concept drift", "Alertas (Slack/email) cuando drift > threshold", "Retraining trigger automatico + validation gate", "Shadow deployment + canary release", "Cost tracking: $/inferencia + alerts si supera presupuesto", "Observability: Prometheus + Grafana dashboard", "Blog post EN documentando arquitectura completa"], boss: true },
        ],
      },
      {
        id: "4",
        name: "Sistemas",
        topics: [
          { name: "Distributed Training", st: "pend", h: 20, detail: "DDP, FSDP, DeepSpeed, ZeRO. Theory + 1 hands-on.", res: "PyTorch DDP docs + DeepSpeed tutorials + Sebastian Raschka", tags: [{ t: "v5", l: "v5" }], items: ["DDP vs FSDP vs DeepSpeed: tabla comparativa con trade-offs", "Paper FlashAttention v1 + v2: leer + diagramar", "ZeRO stages 1/2/3: que se shardea en cada uno", "Mixed precision: FP16 vs BF16 vs FP8 + torch.autocast", "Gradient checkpointing + activation recomputation", "Quantizar 1 modelo con GPTQ + benchmark vs FP16", "1 hands-on: DDP en 2 GPUs (Colab Pro o RunPod) sobre 1 modelo small"] },
          { name: "CUDA + Triton", st: "pend", h: 60, detail: "Kernels custom. NVIDIA gate.", res: "NVIDIA Deep Learning Institute + OpenAI Triton tutorials", tags: [{ t: "v5", l: "NVDA" }], items: ["Programming Massively Parallel Processors caps 1-10", "Hello-world CUDA kernel + nvcc compile", "Matmul tiled CUDA vs cuBLAS benchmark", "Triton tutorial 1-5 (vector add, softmax, matmul, fused attention)", "Custom Triton kernel para LayerNorm + benchmark vs PyTorch", "Profile con nsight-compute + occupancy analysis", "Reproducir Flash Attention v2 en Triton", "Escribir blog post EN sobre kernel optimization"], boss: true },
          { name: "System Design", st: "pend", h: 30, detail: "ML system design entrevistas Tier 1.", res: "ML System Design Interview (Aminian) + Designing ML Systems (Huyen)", items: ["Rec system 100M users en 45min (whiteboard)", "Fraud detection pipeline en 45min (latencia + drift)", "LLM serving + rate limiting + KV cache en 45min", "Search ranking con feedback loops en 45min", "Multi-modal embeddings store en 45min", "PyTorch profiler: identificar 2+ bottlenecks reales", "Capacity planning: GPU memory + throughput + latencia", "5+ mock interviews EN con feedback grabado"] },
        ],
      },
      {
        id: "4B",
        name: "AWS",
        topics: [
          { name: "Certs Cloud", st: "done", h: 0, detail: "3 certs existentes", tags: [{ t: "cert", l: "3x" }], items: ["AWS AI Practitioner Mar 2026", "MS AI-900 Oct 2023", "MS AI-102 Mar 2024"] },
          { name: "AWS CCP", st: "pend", h: 25, detail: "Cert CLF-C02. Baseline obligatorio.", tags: [{ t: "v5", l: "CCP" }], items: ["Curso Stephane Maarek (Udemy)", "4+ practice exams Tutorials Dojo", "Aprobar CLF-C02 ($100)", "Dominar shared responsibility model"] },
          { name: "AWS Hands-on", st: "pend", h: 40, detail: "Deploy LLM en AWS con IaC + monitoring + cost control.", res: "AWS docs + Bedrock cookbook + Terraform Registry", tags: [{ t: "v5", l: "DEPLOY" }], items: ["EC2 GPU g5/g6 spot instance + ssh + nvidia-smi check", "Lambda + SageMaker async inference pipeline", "ECR + ECS Fargate con container ML", "IAM least-privilege + KMS encryption en S3", "Bedrock: invoke Claude + Llama desde Python SDK", "Bedrock Knowledge Bases: 1 RAG E2E con Bedrock", "Terraform o AWS CDK: stack reproducible (no consola)", "CloudWatch metrics + alarms + log retention policy", "Cost Explorer + budget alert + savings plan analysis", "Blog post EN o repo publico documentando el deploy"], boss: true },
        ],
      },
      {
        id: "5",
        name: "Research",
        topics: [
          { name: "Foundation Papers", st: "prog", h: 30, detail: "Cimientos LLM: arquitectura, scaling, training.", tags: [{ t: "v5", l: "wk1" }], items: ["Attention Is All You Need (Vaswani 2017)", "Scaling Laws Kaplan 2020 + Chinchilla (Hoffmann 2022)", "FlashAttention Dao 2022 + FlashAttention-2 Dao 2023", "LoRA Hu 2021 + QLoRA Dettmers 2023", "Mixture of Experts (Shazeer 2017) + Mixtral", "RWKV / Mamba: state-space alternativas a Transformer"] },
          { name: "Alignment + RLHF", st: "pend", h: 25, detail: "Foco Anthropic / OpenAI tracks.", res: "anthropic.com/research + openai.com/research", tags: [{ t: "v5", l: "T1" }], items: ["InstructGPT (Ouyang 2022) + RLHF original", "Constitutional AI Bai 2022", "DPO Rafailov 2023 + ORPO Hong 2024", "Specification Gaming (Krakovna 2020)", "Reward Hacking + Goodhart's Law en RLHF", "Weak-to-Strong Generalization (Burns 2023)"] },
          { name: "Mech Interp", st: "pend", h: 25, detail: "Anthropic Circuits + SAE + superposition.", res: "transformer-circuits.pub + neelnanda.io", tags: [{ t: "v5", l: "T1" }], items: ["A Mathematical Framework (Elhage 2021)", "Toy Models of Superposition (Elhage 2022)", "Scaling Monosemanticity / Sparse Autoencoders (2024)", "Anthropic Circuits Thread completo", "Hands-on con TransformerLens: 1 circuit en GPT-2 small", "Explicar SAE features a ARCA con ejemplo concreto"] },
          { name: "AI Security Papers", st: "pend", h: 20, detail: "Red Team / Safety attacks foundations.", tags: [{ t: "v5", l: "RT" }], items: ["Adversarial Attacks Zou 2023 (universal jailbreaks)", "Indirect Prompt Injection Greshake 2023", "Sleeper Agents Hubinger 2024", "Trojan attacks / Backdoor in LLMs (2024)", "Many-shot Jailbreaking Anthropic 2024", "Evaluating Frontier Models for Dangerous Capabilities"] },
          { name: "Essays Tecnicos", st: "pend", h: 40, detail: "Long-form deep dives. Distintos de F9 posts virales.", res: "Blog propio + lesswrong.com + alignmentforum.org", items: ["Reproducir 3 papers en GitHub con writeup tecnico", "Essay 1 EN: RLHF vs DPO vs Constitutional AI (deep)", "Essay 2 EN: Mech Interp aplicado a 1 vulnerabilidad", "Essay 3 EN: AI Red Team metodologia personal", "1 charla en meetup tecnico (DEF CON / OWASP / local)", "Cross-post en LessWrong / Alignment Forum"] },
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
          { name: "Web OWASP", st: "pend", h: 45, detail: "30+ labs PortSwigger Academy + Burp pro.", res: "PortSwigger Web Security Academy", items: ["5+ labs SQLi (Union, blind, time-based)", "5+ labs XSS (reflected, stored, DOM, mXSS)", "5+ labs CSRF / SSRF (incluyendo cloud metadata)", "5+ labs Auth / IDOR / session fixation", "5+ labs XXE / SSTI / deserialization", "Dominar Burp Suite Pro: scanner + intruder + extender", "30+ labs total + writeup tecnico EN al cerrar cada uno", "Pasar 1 lab Expert (PortSwigger Mystery Lab series)"] },
          { name: "Hardening", st: "pend", h: 20, detail: "SSH, iptables, network forensics, crypto.", items: ["SSH hardening: keys + fail2ban + 2FA + bastion", "iptables / nftables firewall + zero-trust outbound", "Wireshark: 10 capturas reales analizadas + writeup", "PKI completo + JWT + OAuth flows en Python desde 0", "TLS 1.3 handshake explicado + mTLS para servicio interno", "Linux audit: auditd + osquery + rkhunter"] },
          { name: "Net+HTB", st: "prog", h: 80, detail: "HTB Academy + CPTS exam (cert practica).", res: "HTB Academy: Pentesting Path + CPTS prep", tags: [{ t: "v5", l: "CPTS" }], items: ["Completar HTB Academy networking modules", "Completar HTB Academy CPTS path al 100%", "Pwn 25+ maquinas HTB Easy/Medium con writeup EN", "Pwn 5+ maquinas HTB Hard con writeup EN", "Pasar examen CPTS (24h pentest + 24h reporte)", "Publicar 3 writeups detallados en blog/medium", "Cross-link writeups con LinkedIn como milestone"], boss: true },
        ],
      },
      {
        id: "7",
        name: "AI Red Team",
        topics: [
          { name: "Certs AI", st: "done", h: 0, detail: "SANS x2 + EU AI Act", tags: [{ t: "cert", l: "3x" }], items: ["SANS Prompt Hacking cert", "SANS Advanced cert", "EU AI Act cert"] },
          { name: "HTB ART", st: "prog", h: 60, detail: "AI Red Teamer Path completo + cert.", res: "HTB Academy AI Red Teamer Path", items: ["100% HTB AI Red Teamer Path modulos", "Certificacion examen practico HTB ART", "Labs hands-on cada modulo con writeup EN", "Metodologia documentada (recon -> exploit -> exfil)"] },
          { name: "LLM Sec", st: "pend", h: 40, detail: "Direct + indirect + advanced LLM attacks.", res: "OWASP Top 10 LLM v2 + MITRE ATLAS", items: ["5+ direct prompt manipulations en Ollama local", "Indirect prompt manipulations via docs en RAG real", "Many-shot crescendo techniques (Anthropic 2024)", "System prompt extraction sobre 3+ chatbots publicos", "OWASP Top 10 LLM v2 mapeado a casos propios", "MITRE ATLAS framework: tactics + techniques", "Trojan / backdoor en fine-tuning (poison training set)", "Model extraction via API queries (stealing)", "Documentar cada tecnica en repo privado de notas"] },
          { name: "Adversarial", st: "pend", h: 35, detail: "FGSM, PGD, C&W, certified defenses.", res: "Madry Lab + Carlini papers", items: ["FGSM desde cero PyTorch", "PGD vs FGSM benchmark sobre CIFAR-10", "Carlini & Wagner attack (L2 norm)", "Adversarial training (Madry / TRADES / MART)", "Certified defenses: randomized smoothing", "Model stealing via shadow model queries", "Data poisoning: clean-label + targeted", "Robustness eval: AutoAttack benchmark", "Defensa: input preprocessing + ensemble"] },
          { name: "Tools RT", st: "pend", h: 30, detail: "Garak, PyRIT, NeMo Guardrails, Llama Guard.", res: "garak.ai + microsoft/PyRIT + NVIDIA NeMo Guardrails", items: ["Garak: scan 3+ modelos open-source", "PyRIT automatizado: orchestrator custom", "NVIDIA NeMo Guardrails: probing + bypass attempts", "Llama Guard 3 / 4: 5+ techniques contra el classifier", "OpenAI Moderation API: evasion patterns", "Red team report profesional formato cliente", "Mini-scanner propio (escala despues a P1 RT Tool en F8)"] },
          { name: "Safety Evals", st: "pend", h: 30, detail: "Inspect AI, lm-eval, AILuminate. Anthropic gate.", res: "inspect.ai-safety-institute.org + EleutherAI lm-evaluation-harness + MLCommons AILuminate", tags: [{ t: "v5", l: "T1" }], items: ["Inspect AI framework: setup + 1 eval suite custom", "lm-evaluation-harness: correr 5+ benchmarks", "AILuminate v1.0 (MLCommons): comprender categorias", "MMLU + HellaSwag + TruthfulQA sobre Llama 3", "Custom eval: golden dataset + metric design", "Evaluar 1 LLM antes/despues de safety fine-tuning", "Blog post EN: cuando los benchmarks mienten"] },
          { name: "Mech Interp Hands-on", st: "pend", h: 40, detail: "TransformerLens + SAE. Anthropic differentiator.", res: "neelnanda.io ARENA + transformer-circuits.pub + sae-lens", tags: [{ t: "v5", l: "T1" }], items: ["ARENA curriculum: capitulos de mech interp", "TransformerLens: hooks + activation patching", "Identificar 1 circuit en GPT-2 small (induction heads)", "Sparse Autoencoder: entrenar SAE en RTX 2000 Ada", "Visualizar 5+ features semanticamente significativas", "Activation steering: modificar comportamiento en inferencia", "Conectar SAE features con safety vulns concretas", "Blog post EN documentando 1 finding original"] },
          { name: "CVE Disclosure", st: "pend", h: 50, detail: "1+ CVE asignado en modelo comercial.", res: "MITRE CVE + HuggingFace Bug Bounty + Anthropic / OpenAI / Google VRP", tags: [{ t: "v5", l: "CVE" }], items: ["Identificar 3+ targets con bug bounty AI program", "Replicar vuln en entorno aislado con PoC", "Coordinated disclosure email + 90-day window", "Reservar CVE ID via MITRE", "Publicar advisory tras patch", "Writeup tecnico EN + thread en X", "Responder a CVE en LinkedIn como milestone", "Apuntar a >=1 CVE crit/high/year"], boss: true },
          { name: "Auto RT", st: "pend", h: 40, detail: "Pipelines automaticos AI-vs-AI.", tags: [{ t: "v5", l: "+4sem" }], items: ["Pipeline automatico de adversarial prompt discovery", "Eval framework before/after defenses", "AI-vs-AI: attacker model vs defender model", "CI integration: regression tests sobre safety", "Documentar repo publico (escala a P1 RT Tool en F8)"], boss: true },
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
