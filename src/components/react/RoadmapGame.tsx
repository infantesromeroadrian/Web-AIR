import { useState, useEffect, useCallback, type FC } from "react";

// ═══════ TYPES ═══════
interface Tag { t: string; l: string }
interface Topic { name: string; st: string; h: number; detail: string; res?: string; tags?: Tag[]; items: string[]; boss?: boolean }
interface Phase { id: string; name: string; month?: string; topics: Topic[]; special?: { name: string; detail: string } }
interface Tier { tier: number; name: string; sub: string; phases: Phase[] }
interface AppState { items: Record<string, number>; cycle: Record<string, number[]>; activity: string[] }

type Lang = "en" | "es";

// ═══════ DATA ═══════
const R: Tier[] = [
{tier:1,name:"Fundamentos",sub:"World 1",phases:[
{id:"0",name:"Matematicas",topics:[
{name:"Algebra Lineal",st:"prog",h:20,detail:"Curso completado. 3B1B 75%. PCA hecho.",res:"Coursera + 3Blue1Brown",tags:[{t:"cert",l:"cert"}],items:["Ver 3B1B Essence of Linear Algebra videos 1-8 y tomar notas","Completar Coursera Linear Algebra for ML (cert ya obtenido)","Implementar operaciones matriciales en numpy (mult, inv, det)","Investigar autovalores/autovectores: ver 3B1B video 14 + implementar en numpy","Leer MML Book cap 4 sobre SVD y explicar a Claude para que sirve en ML","Implementar PCA desde cero con numpy sobre MNIST (visualizar 2 componentes)","Derivar normal equation a mano en papel y fotografiar"]},
{name:"Calculo",st:"prog",h:20,detail:"Curso 20%. GD y backprop hechos.",res:"Coursera + 3Blue1Brown",items:["Ver 3B1B Essence of Calculus completo (12 videos) y anotar","Completar Coursera Calculus for ML (obtener certificado)","Implementar gradient descent para regresion lineal en numpy","Derivar la chain rule de backprop a mano para red de 2 capas","Implementar backprop completo para red de 2 capas en numpy (>90% make_moons)","Explicar a Claude: por que la chain rule es esencial para redes neuronales"]},
{name:"Probabilidad",st:"prog",h:20,detail:"Bayes + A/B test from scratch.",res:"Coursera + Khan",items:["Completar Coursera Prob & Stats for ML (obtener certificado)","Ver Khan Academy modulos de distribuciones (Normal, Bernoulli, Poisson)","Implementar Naive Bayes from scratch sobre SMS Spam dataset (>95% acc)","Implementar z-test para proporciones from scratch (sin scipy)","Construir A/B testing simulator: generar datos + calcular p-values","Explicar a Claude paso a paso como Naive Bayes decide si un email es spam","Estudiar MLE y MAP: leer MML Book cap 8 y resolver 3 ejercicios a mano"]},
{name:"Optimizacion",st:"prog",h:15,detail:"SGD+Momentum+Adam from scratch.",res:"MML Book Cap 7",items:["Implementar SGD puro en numpy y entrenar logistic regression","Implementar SGD con Momentum (beta=0.9) y comparar convergencia","Implementar Adam optimizer from scratch y graficar loss curves de los 3","Leer MML Book cap 7 sobre convexidad y anotar conceptos clave","Investigar learning rate scheduling: implementar cosine annealing","Estudiar Lagrange Multipliers: resolver 2 problemas a mano"]}
]},
{id:"1",name:"CS y Arquitectura",topics:[
{name:"DSA+LC",st:"pend",h:100,detail:"120: 80E+30M+10H",tags:[{t:"v5",l:"120"}],items:["Completar NeetCode DSA for Beginners (curso gratis completo)","Resolver 80 Easy en LeetCode","Resolver 30 Medium en LeetCode","Resolver 10 Hard en LeetCode","Practicar: resolver 1 Medium en <25 min"]},
{name:"Arquitectura",st:"pend",h:20,detail:"SOLID, Hexagonal",items:["Leer Clean Architecture caps 1-22 y anotar los 5 principios SOLID","Leer articulo RealPython sobre SOLID en Python","Refactorizar proyecto ML con hexagonal architecture","Disenar API REST para servicio ML"]},
{name:"Tooling",st:"pend",h:15,detail:"Docker, CI/CD, pytest",items:["Completar Docker Getting Started tutorial","Escribir Dockerfile multi-stage para app Python","Configurar GitHub Actions CI/CD","Escribir tests con pytest >80% coverage","Configurar mypy --strict + ruff"]},
{name:"Proyecto API",st:"pend",h:20,detail:"FastAPI+Docker+CI/CD",items:["Completar FastAPI tutorial oficial + API para modelo ML","Containerizar con Docker multi-stage","CI/CD con GitHub Actions","80% test coverage","Docs OpenAPI generadas"],boss:true}
]},
{id:"2",name:"ML/DL/GenAI+RL",topics:[
{name:"Python",st:"done",h:10,detail:"IT Specialist cert",tags:[{t:"cert",l:"cert"}],items:["Practicar type hints avanzados con mypy strict","Implementar 3 decorators utiles","Escribir script async con aiohttp","Crear paquete Python con uv + pyproject.toml","Usar Protocols para interfaces"]},
{name:"ML Teoria",st:"prog",h:25,detail:"3 certs. Falta DecTree.",tags:[{t:"cert",l:"3x"}],items:["Implementar Linear Regression from scratch numpy","Implementar Logistic Regression from scratch numpy","Implementar Decision Tree from scratch","Construir sklearn Pipeline completo","Competir en 2 Kaggle competitions","Explicar bias-variance tradeoff a Claude"]},
{name:"Deep Learning",st:"prog",h:30,detail:"Attention 40%. Karpathy 50%.",items:["Leer y anotar paper Attention Is All You Need","Ver Karpathy Let's build GPT e implementar mini-GPT","Implementar self-attention en <30 lineas PyTorch","Implementar CNN from scratch >80% CIFAR-10","Derivar backprop para capa de attention a mano","Implementar training loop completo","Explicar residual connections a Claude"]},
{name:"GenAI",st:"prog",h:30,detail:"Cert. LoRA pendiente.",tags:[{t:"cert",l:"cert"}],items:["Estudiar tokenizacion: implementar BPE simplificado","Fine-tune con LoRA usando Unsloth en RTX 2000 Ada","Leer paper Scaling Laws (Kaplan 2020)","Estudiar RLHF pipeline","Leer paper DPO (Rafailov 2023)","Explicar LoRA vs full fine-tuning a Claude"]},
{name:"RL",st:"pend",h:40,detail:"PPO+DPO obligatorio.",tags:[{t:"v5",l:"v5"}],items:["Completar HuggingFace Deep RL Course units 1-4","Implementar REINFORCE en CartPole","Implementar PPO basico","Estudiar RLHF","Implementar DPO fine-tuning","Leer paper GRPO","Explicar PPO vs REINFORCE a Claude","Explicar DPO vs RLHF a Claude"]},
{name:"Kaggle",st:"pend",h:20,detail:"2 competiciones",items:["Elegir 2 competiciones activas","EDA completo con visualizaciones","Feature engineering 5+ features","Modelo + submission","Publicar notebooks"],boss:true}
]}
]},
{tier:2,name:"Builder",sub:"World 2",phases:[
{id:"3A",name:"LLMs",topics:[
{name:"Certs Claude",st:"done",h:5,detail:"Fluency+101",tags:[{t:"cert",l:"2x"}],items:["Completar Claude AI Fluency Framework","Completar Claude 101","Leer Anthropic Prompt Engineering docs"]},
{name:"Context Eng",st:"pend",h:20,detail:"Prompts, outputs, tools",items:["Benchmark Zero-Shot vs Few-Shot vs CoT","System prompt robusto vs 5+ ataques injection","Structured outputs Pydantic + retry","Tool calling con schema JSON","Prompt chain 3+ pasos","Explicar Temperature alta vs baja a Claude","Estudiar KV cache internals"]}
]},
{id:"3B",name:"RAG",topics:[
{name:"RAG Basics",st:"done",h:5,detail:"2 certs",tags:[{t:"cert",l:"2x"}],items:["Pipeline basico: PDF + chunking + Chroma","Completar DL.AI LangChain Chat with Data","Completar DataCamp AI Engineer Track"]},
{name:"RAG Avanzado",st:"pend",h:25,detail:"Reranking, agentic",items:["Hybrid search: dense + BM25","Reranking cross-encoder","Query transform: HyDE","Agentic RAG self-corrective","RAG Security: injection via docs","RAGAS eval >0.7"]},
{name:"VectorDBs",st:"pend",h:15,detail:"Chroma, FAISS, Qdrant",items:["Probar Chroma, FAISS, Qdrant","Indexing: HNSW, IVF, PQ","Comparar 3 chunking strategies con RAGAS"]},
{name:"Proyecto RAG",st:"pend",h:30,detail:"UI+eval dashboard",items:["Pipeline E2E completo","UI Streamlit/Gradio","RAGAS dashboard","Publicar en GitHub"],boss:true}
]},
{id:"3C",name:"Agents",topics:[
{name:"Patterns",st:"prog",h:25,detail:"ReAct 30%",items:["Leer paper ReAct y anotar","Implementar ReAct from scratch 3+ tools","Reimplementar con LangChain create_react_agent()","Leer paper Reflexion","Implementar Plan-and-Execute"]},
{name:"LangGraph",st:"pend",h:30,detail:"Stack principal",items:["Leer LangGraph tutorials completos","StateGraph 5+ nodos + conditional edges","Checkpointing: guardar, pausar, resumir","HITL: interrupt() + Command(resume)","Subgraphs modulares","Streaming tokens"]},
{name:"Multi-Agent",st:"pend",h:30,detail:"Supervisor, MCP",items:["Supervisor: 1 router + 3 specialists","MCP server Python FastMCP 3+ tools","MCP server TypeScript","Conectar MCP a Claude Code","Agent memory short + long term"]},
{name:"Agent Security",st:"pend",h:25,detail:"Guardrails, audit",items:["LangSmith tracing + evaluator","Guardrails I/O filtering","Sandboxing aislado","PROYECTO: Multi-agent + audit trail"],boss:true}
]},
{id:"3D/E",name:"Multi+MLOps",topics:[
{name:"Multimodal",st:"pend",h:15,detail:"Vision, audio",items:["Claude/GPT-4V image understanding","Whisper STT integration","Multimodal RAG"]},
{name:"MLOps",st:"prog",h:25,detail:"1 cert. vLLM pend.",tags:[{t:"cert",l:"cert"}],items:["MLflow: 3 experimentos","Model registry + DVC","vLLM en RTX 2000 Ada","ONNX export + benchmark","Monitoring drift + alertas"]}
]},
{id:"4",name:"Sistemas",topics:[
{name:"GPU Conceptual",st:"pend",h:10,detail:"Understand only",tags:[{t:"v5",l:"v5"}],items:["Leer paper FlashAttention + diagrama","DDP vs FSDP vs DeepSpeed tabla comparativa","Quantizar GPTQ + benchmark","Mixed precision torch.autocast"]},
{name:"System Design",st:"pend",h:25,detail:"3 designs",items:["Disenar rec system 100M users (45min)","Disenar fraud detection pipeline (45min)","Disenar LLM serving + rate limiting (45min)","PyTorch profiler bottlenecks"],boss:true}
]},
{id:"4B",name:"AWS",topics:[
{name:"Certs Cloud",st:"done",h:0,detail:"3 certs existentes",tags:[{t:"cert",l:"3x"}],items:["AWS AI Practitioner (Mar 2026)","MS AI-900 (Oct 2023)","MS AI-102 (Mar 2024)"]},
{name:"AWS CCP",st:"pend",h:25,detail:"Unica obligatoria",tags:[{t:"v5",l:"CCP"}],items:["Curso Stephane Maarek","4+ practice exams Tutorials Dojo","Aprobar CLF-C02 ($100)","Shared responsibility + Well-Architected"]},
{name:"AWS Hands-on",st:"pend",h:30,detail:"Deploy, Bedrock",items:["EC2 GPU deploy g5 spot","Lambda + SageMaker pipeline","ECR + ECS container","IAM + KMS encryption","Bedrock inference Claude/Llama"]}
]},
{id:"5",name:"Research",topics:[
{name:"Papers",st:"prog",h:50,detail:"1/semana, 50+",tags:[{t:"v5",l:"wk1"}],items:["Attention Is All You Need (Vaswani 2017)","Scaling Laws (Kaplan 2020)","Constitutional AI (Bai 2022)","DPO (Rafailov 2023)","Adversarial Attacks (Zou 2023)","Indirect Injection (Greshake 2023)","Sleeper Agents (Hubinger 2024)","FlashAttention (Dao 2022)","LoRA (Hu 2021)"]},
{name:"Contenido",st:"pend",h:40,detail:"3 blogs, 1 charla",items:["Reproducir 3 papers en GitHub","3 blog posts tecnicos EN","1 charla/presentacion","Alignment: RLHF vs DPO vs Constitutional AI"],boss:true}
]}
]},
{tier:3,name:"Breaker",sub:"World 3",phases:[
{id:"6",name:"Security",topics:[
{name:"Certs Sec",st:"done",h:0,detail:"Linux+Cyber+OSINT",tags:[{t:"cert",l:"3x"}],items:["Linux 100 TCM (cert)","Intro Cybersecurity Cisco (cert)","OSINT TCM (cert)"]},
{name:"Net+HTB",st:"prog",h:50,detail:"HTB en curso",items:["HTB Academy networking modules","15+ maquinas HTB + writeups","Writeup completo cada maquina"]},
{name:"Web OWASP",st:"pend",h:40,detail:"30+ labs",items:["5+ labs SQLi PortSwigger","5+ labs XSS PortSwigger","5+ labs CSRF/SSRF PortSwigger","5+ labs Auth/IDOR PortSwigger","Dominar Burp Suite","30+ labs total con writeups"]},
{name:"Hardening",st:"pend",h:15,detail:"SSH, iptables",items:["SSH hardening keys+config+fail2ban","iptables/nftables firewall","Wireshark 10 capturas analizadas","PKI, JWT, OAuth en Python"],boss:true}
]},
{id:"7",name:"AI Red Team",topics:[
{name:"Certs AI",st:"done",h:0,detail:"SANS x2 + EU AI Act",tags:[{t:"cert",l:"3x"}],items:["SANS Prompt Hacking (cert)","SANS Advanced Prompt Hacking (cert)","EU AI Act Fundamentals (cert)"]},
{name:"HTB ART",st:"prog",h:60,detail:"Path en curso",items:["100% HTB AI Red Teamer Path","Certificacion examen practico","Labs hands-on cada modulo","Writeups con metodologia"]},
{name:"LLM Sec",st:"pend",h:30,detail:"Injection, jailbreak",items:["5+ direct prompt injection en Ollama","Indirect injection via docs en RAG","Jailbreaking: DAN, crescendo, many-shot","System prompt extraction 3+ chatbots","OWASP Top 10 LLMs v2 completo","MITRE ATLAS framework completo","Documentar cada tecnica"]},
{name:"Adversarial",st:"pend",h:30,detail:"FGSM, training",items:["FGSM desde cero PyTorch","PGD attack comparar con FGSM","Adversarial training como defensa","Model stealing via queries","Data poisoning simulacion","Medir robustness before/after"]},
{name:"Tools RT",st:"pend",h:25,detail:"Garak, PyRIT",items:["Garak en 3+ modelos locales","PyRIT automatizado","Red team report profesional","Mini-scanner vulns LLM propio"]},
{name:"Auto RT",st:"pend",h:40,detail:"Pipelines, AI vs AI",tags:[{t:"v5",l:"+4sem"}],items:["Automated jailbreak discovery pipeline","Eval framework before/after","AI vs AI: attacker vs defender","CI integration automatica","Documentar en repo publico"],boss:true}
]}
]},
{tier:4,name:"Unicorn",sub:"World 4",phases:[
{id:"8",name:"Portfolio",topics:[
{name:"OSS",st:"pend",h:40,detail:"PRs AI security",tags:[{t:"v5",l:"AI sec"}],items:["3+ PRs docs/typos/tests","2+ PRs bug fixes AI security","1+ PR feature tier-1","GitHub activity consistente"]},
{name:"P1: RT Tool",st:"pend",h:80,detail:"Scanner+pipeline",tags:[{t:"v5",l:"MAIN"}],items:["Arquitectura CLI + plugins modulares","Scanner prompt injection 5+ tecnicas","Automated jailbreak pipeline","80% coverage pytest","Publicar GitHub + README","Foco: agentic/MCP attacks"]},
{name:"P2: Agent",st:"pend",h:60,detail:"Multi-agent seguro",items:["LangGraph + MCP + Docker","RAG seguro anti-injection","Audit trail completo","Red team tested con P1"]},
{name:"P3: E2E",st:"pend",h:80,detail:"Produccion+blog",items:["App produccion AWS","Security cada capa","Blog post arquitectura","Red team report completo","Integra P1 y P2"],boss:true}
]},
{id:"9",name:"Visibilidad",topics:[
{name:"Presencia",st:"pend",h:30,detail:"Blog, charlas",items:["6 blog posts EN AI Security","2 charlas meetup/conf","Twitter/X 1 post tecnico/sem","LinkedIn optimizado"]},
{name:"Network",st:"pend",h:25,detail:"Communities",tags:[{t:"v5",l:"new"}],items:["AI Village DEF CON","MLSecOps Community","OWASP LLM Top 10 group","Cold emails 1/sem researchers","2+ conferencias"]},
{name:"Entrevistas",st:"pend",h:60,detail:"LC+design+mocks",items:["120 LeetCode (80E+30M+10H)","10 ML system designs","5+ mock interviews","Transformer pizarra 45min","FGSM pizarra 30min","STAR format cada proyecto","AI Sec deep dive questions"]},
{name:"Original",st:"pend",h:40,detail:"1 hallazgo nuevo",tags:[{t:"v5",l:"crit"}],items:["Jailbreak nuevo documentado","O defensa mejorada con metricas","O analisis comparativo unico","Publicar blog/writeup EN","Compartir en comunidades"],boss:true}
]}
]}
];

// ═══════ POKEMON ═══════
const AN = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated";
const SHW = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown";
const EVO = [
  { name: "Squirtle", min: 0, max: 20, sprite: `${AN}/7.gif` },
  { name: "Wartortle", min: 20, max: 45, sprite: `${AN}/8.gif` },
  { name: "Blastoise", min: 45, max: 75, sprite: `${AN}/9.gif` },
  { name: "Mega Blastoise", min: 75, max: 101, sprite: `${SHW}/10036.gif` },
];
const PW: Record<string, number> = {"0":5,"1":5,"2":8,"3A":4,"3B":5,"3C":6,"3D/E":3,"4":3,"4B":4,"5":10,"6":7,"7":20,"8":12,"9":8};

// ═══════ STATE ═══════
const KEY = "rmv5";
const emptyState = (): AppState => ({ items: {}, cycle: {}, activity: [] });
const loadState = (): AppState => { if (typeof window === "undefined") return emptyState(); try { return JSON.parse(localStorage.getItem(KEY) || "{}") as AppState; } catch { return emptyState(); } };
const saveState = (s: AppState) => { if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(s)); };
const getState = (): AppState => { const s = loadState(); if (!s.items) s.items = {}; if (!s.cycle) s.cycle = {}; if (!s.activity) s.activity = []; return s; };

const iSt = (s: AppState, p: number, t: number, i: number) => s.items[`${p}-${t}-${i}`] || 0;
const cSt = (s: AppState, p: number, t: number) => s.cycle[`${p}-${t}`] || [0, 0, 0, 0];

function tSt(s: AppState, p: number, t: number, tp: Topic): string {
  const it = tp.items || [];
  if (!it.length) return tp.st;
  let d = 0, pr = 0;
  it.forEach((_, i) => { const v = iSt(s, p, t, i); if (v === 2) d++; else if (v === 1) pr++; });
  if (d === it.length) return "done";
  if (d > 0 || pr > 0) return "prog";
  return tp.st;
}

function comp1(s: AppState): number {
  let sc = 0, pi = 0;
  R.forEach(t => t.phases.forEach(ph => {
    const w = PW[ph.id] || 0; let ti = 0, pts = 0;
    ph.topics.forEach((t2, i) => {
      const it = t2.items || [];
      if (it.length) it.forEach((_, j) => { ti++; const v = iSt(s, pi, i, j); if (v === 2) pts += 1; else if (v === 1) pts += 0.5; });
      else { ti++; const st = tSt(s, pi, i, t2); if (st === "done") pts += 1; else if (st === "prog") pts += 0.5; }
    }); if (ti) sc += (pts / ti) * w; pi++;
  })); return Math.round(sc);
}

function getEvo(p: number) { for (let i = EVO.length - 1; i >= 0; i--) if (p >= EVO[i].min) return EVO[i]; return EVO[0]; }

function flattenNodes() {
  const nodes: (Topic & { pi: number; ti: number; phId: string; phName: string; tier: number; tierName: string })[] = [];
  let pi = 0;
  R.forEach(tier => { tier.phases.forEach(ph => { ph.topics.forEach((tp, ti) => {
    nodes.push({ ...tp, pi, ti, phId: ph.id, phName: ph.name, tier: tier.tier, tierName: tier.name });
  }); pi++; }); });
  return nodes;
}

// ═══════ SEED ═══════
function seedIfEmpty() {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(KEY)) return;
  const s: AppState = { items: {}, cycle: {}, activity: [] };
  const D = 2, P = 1;
  // F0 Algebra: 6/7 done
  s.items["0-0-0"]=D;s.items["0-0-1"]=D;s.items["0-0-2"]=D;s.items["0-0-3"]=D;s.items["0-0-4"]=D;s.items["0-0-5"]=D;
  s.cycle["0-0"]=[1,1,1,0];
  // F0 Calculo
  s.items["0-1-1"]=D;s.items["0-1-0"]=P;s.items["0-1-2"]=P;s.items["0-1-3"]=P;s.items["0-1-4"]=D;s.items["0-1-5"]=D;
  s.cycle["0-1"]=[1,1,0,0];
  // F0 Probabilidad
  s.items["0-2-0"]=P;s.items["0-2-1"]=D;s.items["0-2-2"]=P;s.items["0-2-4"]=D;s.items["0-2-5"]=D;s.items["0-2-6"]=D;
  s.cycle["0-2"]=[1,1,1,0];
  // F0 Optimizacion
  s.items["0-3-0"]=D;s.items["0-3-1"]=D;s.items["0-3-5"]=D;
  s.cycle["0-3"]=[1,1,0,0];
  // F2 Python
  s.items["2-0-0"]=D;s.items["2-0-1"]=D;s.items["2-0-2"]=P;s.items["2-0-3"]=P;s.items["2-0-4"]=P;
  s.cycle["2-0"]=[1,1,1,0];
  // F2 ML Teoria
  s.items["2-1-0"]=D;s.items["2-1-1"]=D;s.items["2-1-3"]=P;s.items["2-1-5"]=P;
  s.cycle["2-1"]=[1,1,0,0];
  // F2 DL
  s.items["2-2-0"]=P;s.items["2-2-1"]=P;s.items["2-2-4"]=P;s.items["2-2-5"]=P;
  s.cycle["2-2"]=[1,0,0,0];
  // F2 GenAI
  s.items["2-3-0"]=P;s.items["2-3-3"]=P;
  s.cycle["2-3"]=[1,0,0,0];
  // F3A Certs
  s.items["3-0-0"]=D;s.items["3-0-1"]=D;s.items["3-0-2"]=D;
  s.cycle["3-0"]=[1,1,1,1];
  // F3A Context Eng
  s.items["3-1-0"]=P;s.items["3-1-1"]=P;s.items["3-1-2"]=P;s.items["3-1-3"]=P;s.items["3-1-4"]=P;
  s.cycle["3-1"]=[1,1,0,0];
  // F3B RAG Basics
  s.items["4-0-0"]=D;s.items["4-0-1"]=D;s.items["4-0-2"]=D;
  s.cycle["4-0"]=[1,1,1,1];
  // F3C Patterns
  s.items["5-0-0"]=P;s.items["5-0-1"]=P;
  s.cycle["5-0"]=[1,1,0,0];
  // F3D/E MLOps
  s.items["6-1-0"]=P;s.items["6-1-1"]=P;s.items["6-1-4"]=P;
  s.cycle["6-1"]=[1,0,0,0];
  // F4B Certs
  s.items["8-0-0"]=D;s.items["8-0-1"]=D;s.items["8-0-2"]=D;
  s.cycle["8-0"]=[1,1,1,1];
  s.items["8-1-0"]=P;s.items["8-1-1"]=P;
  // F5 Papers
  s.items["9-0-0"]=P;
  s.cycle["9-0"]=[1,0,0,0];
  // F6 Certs
  s.items["10-0-0"]=D;s.items["10-0-1"]=D;s.items["10-0-2"]=D;
  s.cycle["10-0"]=[1,1,1,1];
  s.items["10-1-0"]=P;s.items["10-1-1"]=P;s.items["10-1-2"]=P;
  s.cycle["10-1"]=[1,1,0,0];
  // F7 Certs AI
  s.items["11-0-0"]=D;s.items["11-0-1"]=D;s.items["11-0-2"]=D;
  s.cycle["11-0"]=[1,1,1,1];
  s.items["11-1-0"]=P;s.items["11-1-2"]=P;s.items["11-1-3"]=P;
  s.cycle["11-1"]=[1,1,0,0];
  s.items["11-2-0"]=P;s.items["11-2-1"]=P;s.items["11-2-2"]=P;s.items["11-2-5"]=P;s.items["11-2-6"]=P;
  saveState(s);
}

// ═══════ COMPONENT ═══════
const isClient = typeof window !== "undefined";
const PIN = "41R2026";
const PIN_KEY = "rmv5_auth";

function PinGate({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const [authed, setAuthed] = useState(() => isClient && sessionStorage.getItem(PIN_KEY) === "1");
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  if (authed) return <>{children}</>;

  const check = () => {
    if (input === PIN) {
      sessionStorage.setItem(PIN_KEY, "1");
      setAuthed(true);
    } else {
      setError(true);
      setTimeout(() => setError(false), 1500);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-xs">
        <div className="text-4xl mb-4">&#128274;</div>
        <h2 className="text-lg font-bold text-text-primary mb-1">{lang === "es" ? "Zona privada" : "Private area"}</h2>
        <p className="text-sm text-text-muted mb-4">{lang === "es" ? "Introduce el PIN para acceder" : "Enter PIN to access"}</p>
        <input
          type="password"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && check()}
          placeholder="PIN"
          autoFocus
          className={`w-full px-4 py-2 rounded-lg bg-bg-tertiary border ${error ? "border-accent-red shake" : "border-border"} text-text-primary text-center font-mono text-lg tracking-widest focus:outline-none focus:border-accent transition-colors`}
        />
        <button onClick={check} className="mt-3 px-6 py-2 rounded-lg bg-accent/20 border border-accent/30 text-accent text-sm font-semibold hover:bg-accent/30 transition-colors">
          {lang === "es" ? "Acceder" : "Enter"}
        </button>
        {error && <p className="text-accent-red text-xs mt-2">{lang === "es" ? "PIN incorrecto" : "Wrong PIN"}</p>}
      </div>
    </div>
  );
}

const RoadmapGame: FC<{ lang: Lang }> = ({ lang }) => {
  const [state, setState] = useState<AppState>(() => {
    if (!isClient) return { items: {}, cycle: {}, activity: [] };
    seedIfEmpty(); return getState();
  });
  const [modalIdx, setModalIdx] = useState<number | null>(null);
  const nodes = flattenNodes();

  useEffect(() => { if (isClient) { seedIfEmpty(); setState(getState()); } }, []);

  const refresh = useCallback(() => { setState(getState()); }, []);

  const toggleItem = (pi: number, ti: number, ii: number) => {
    const s = getState();
    const k = `${pi}-${ti}-${ii}`;
    s.items[k] = ((s.items[k] || 0) + 1) % 3;
    const today = new Date().toISOString().slice(0, 10);
    if (!s.activity.includes(today)) s.activity.push(today);
    saveState(s); refresh();
  };

  const toggleCycle = (pi: number, ti: number, ci: number) => {
    const s = getState();
    const k = `${pi}-${ti}`;
    const c = s.cycle[k] || [0, 0, 0, 0];
    c[ci] = c[ci] ? 0 : 1;
    s.cycle[k] = c;
    const today = new Date().toISOString().slice(0, 10);
    if (!s.activity.includes(today)) s.activity.push(today);
    saveState(s); refresh();
  };

  const pct1 = comp1(state);
  const evo = getEvo(pct1);
  let doneCount = 0, progCount = 0, pendCount = 0, certCount = 0;
  let pi2 = 0;
  R.forEach(t => t.phases.forEach(ph => { ph.topics.forEach((t2, i) => {
    const st = tSt(state, pi2, i, t2);
    if (st === "done") doneCount++; else if (st === "prog") progCount++; else pendCount++;
    (t2.tags || []).forEach(tg => { if (tg.t === "cert") certCount++; });
  }); pi2++; }));

  // Streak
  const days = [...state.activity].sort().reverse();
  let streak = 0;
  if (days.length) {
    const d = new Date();
    for (let i = 0; i < 365; i++) {
      const ds = d.toISOString().slice(0, 10);
      if (days.includes(ds)) { streak++; d.setDate(d.getDate() - 1); }
      else if (i === 0) { d.setDate(d.getDate() - 1); }
      else break;
    }
  }

  // Current node (first non-done)
  let currentIdx = nodes.findIndex(n => { const st = tSt(state, n.pi, n.ti, n); return st !== "done"; });
  if (currentIdx === -1) currentIdx = nodes.length - 1;

  // Arrange nodes in rows
  const perRow = 7;
  const rows: typeof nodes[] = [];
  for (let i = 0; i < nodes.length; i += perRow) rows.push(nodes.slice(i, i + perRow));

  const icons = ["\u203A", "\u25D0", "\u2713"];
  const iconCls = ["text-text-muted", "text-accent-amber", "text-accent-green"];
  const cycleLbl = ["S", "I", "V", "F"];
  const cycleCls = ["bg-blue-500", "bg-purple-500", "bg-accent-amber", "bg-accent-green"];
  const tierZones = ["", "from-accent-green/5 to-blue-500/5", "from-blue-500/5 to-accent-green/5", "from-accent-red/5 to-accent-amber/5", "from-purple-500/5 to-pink-500/5"];
  const tierLabelColors = ["", "text-accent-green", "text-blue-500", "text-accent-red", "text-purple-500"];

  const modalNode = modalIdx !== null ? nodes[modalIdx] : null;

  const exportProgress = () => {
    const blob = new Blob([JSON.stringify(getState(), null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `roadmap-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  const importProgress = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => { try { saveState(JSON.parse(r.result as string)); location.reload(); } catch {} };
    r.readAsText(f);
  };

  return (
    <PinGate lang={lang}>
    <div className="relative">
      {/* ═══ HUD ═══ */}
      <div className="sticky top-16 z-40 flex items-center justify-between px-4 py-2 bg-bg-primary/90 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3">
          <img src={evo.sprite} alt={evo.name} className="w-10 h-10" style={{ imageRendering: "pixelated" }} />
          <div>
            <div className="text-purple-400 font-bold text-xs">{evo.name}</div>
            <div><span className="text-accent-green font-extrabold text-lg">{pct1}%</span> <span className="text-text-muted text-xs">{lang === "es" ? "hacia el 1%" : "towards the 1%"}</span></div>
          </div>
        </div>
        <div className="flex gap-4 text-xs">
          <div className="text-center"><div className="font-bold text-accent-green text-base">{doneCount}</div><div className="text-text-muted">{lang === "es" ? "Hecho" : "Done"}</div></div>
          <div className="text-center"><div className="font-bold text-accent-amber text-base">{progCount}</div><div className="text-text-muted">Prog</div></div>
          <div className="text-center"><div className="font-bold text-text-secondary text-base">{pendCount}</div><div className="text-text-muted">Pend</div></div>
          <div className="text-center"><div className="font-bold text-text-primary text-base">{certCount}</div><div className="text-text-muted">Certs</div></div>
          <div className="text-center"><div className="font-bold text-pink-400 text-base">{streak}d</div><div className="text-text-muted">{lang === "es" ? "Racha" : "Streak"}</div></div>
        </div>
        <div className="flex gap-1">
          <button onClick={exportProgress} className="px-2 py-1 rounded text-[10px] bg-bg-secondary border border-border text-text-muted hover:text-text-primary transition-colors">{lang === "es" ? "Exportar" : "Export"}</button>
          <label className="px-2 py-1 rounded text-[10px] bg-bg-secondary border border-border text-text-muted hover:text-text-primary transition-colors cursor-pointer">
            {lang === "es" ? "Importar" : "Import"}<input type="file" accept=".json" className="hidden" onChange={importProgress} />
          </label>
          <button onClick={() => { if (confirm(lang === "es" ? "Reiniciar progreso?" : "Reset progress?")) { localStorage.removeItem(KEY); location.reload(); } }} className="px-2 py-1 rounded text-[10px] bg-bg-secondary border border-border text-accent-red hover:text-red-300 transition-colors">Reset</button>
        </div>
      </div>

      {/* ═══ MAP ═══ */}
      <div className="max-w-[1000px] mx-auto px-4 py-6">
        {rows.map((row, ri) => {
          const rtl = ri % 2 === 1;
          const displayRow = rtl ? [...row].reverse() : row;
          const firstTier = row[0].tier;
          const prevTier = ri > 0 ? rows[ri - 1][0].tier : 0;
          const showTierHeader = firstTier !== prevTier;

          return (
            <div key={ri}>
              {showTierHeader && (
                <div className={`relative py-4 bg-gradient-to-b ${tierZones[firstTier]}`}>
                  <div className={`text-xs font-bold tracking-[3px] uppercase opacity-40 px-4 ${tierLabelColors[firstTier]}`}>
                    World {firstTier}: {R.find(t => t.tier === firstTier)?.name}
                  </div>
                </div>
              )}
              {ri > 0 && (
                <div className={`flex ${rtl ? "justify-start" : "justify-end"} px-8 h-6`}>
                  <div className={`w-6 h-6 border-2 border-dashed border-border/30 ${rtl ? "rounded-bl-xl border-t-0 border-r-0" : "rounded-br-xl border-t-0 border-l-0"}`} />
                </div>
              )}
              <div className={`flex items-center justify-center gap-0 py-3 px-6 ${rtl ? "flex-row-reverse" : ""}`}>
                {displayRow.map((n, ni) => {
                  const globalIdx = ri * perRow + (rtl ? row.length - 1 - ni : ni);
                  const st = tSt(state, n.pi, n.ti, n);
                  const isCurrentNode = globalIdx === currentIdx;
                  const stCls = st === "done" ? "bg-emerald-900/60 border-accent-green shadow-[0_0_12px_rgba(34,197,94,.3)]"
                    : st === "prog" ? "bg-amber-900/40 border-accent-amber shadow-[0_0_12px_rgba(245,158,11,.3)] animate-pulse"
                    : n.st === "opt" ? "bg-indigo-900/30 border-indigo-500 border-dashed" : "bg-bg-tertiary border-border";

                  return (
                    <React.Fragment key={globalIdx}>
                      <div className="relative w-14 h-14 shrink-0 cursor-pointer transition-transform hover:scale-110" onClick={() => setModalIdx(globalIdx)}>
                        {st === "done" && <div className="absolute -top-1 -right-0.5 text-xs pointer-events-none">&#9733;</div>}
                        {n.h > 0 && <div className="absolute -top-0.5 -left-0.5 text-[8px] bg-black/60 text-text-muted px-0.5 rounded pointer-events-none">~{n.h}h</div>}
                        <div className={`w-11 h-11 rounded-full border-[3px] flex items-center justify-center text-[8px] font-bold text-center leading-tight m-1.5 transition-all ${stCls}`}>
                          {n.phId}<br />{n.name.substring(0, 8)}
                        </div>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[7px] text-text-muted whitespace-nowrap max-w-[70px] truncate pointer-events-none text-center">{n.name}</div>
                        {isCurrentNode && (
                          <img src={evo.sprite} alt={evo.name} className="absolute -top-7 left-1/2 -translate-x-1/2 w-10 h-10 animate-bounce pointer-events-none" style={{ imageRendering: "pixelated", filter: "drop-shadow(0 4px 8px rgba(0,0,0,.5))" }} />
                        )}
                      </div>
                      {ni < displayRow.length - 1 && (
                        <div className="flex-1 h-0.5 min-w-3 max-w-16 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,.06)_0,rgba(255,255,255,.06)_5px,transparent_5px,transparent_10px)]" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Goal */}
        <div className="text-center py-6">
          <div className="w-16 h-16 rounded-full border-[3px] border-purple-500 bg-purple-500/10 inline-flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(168,85,247,.3)] animate-pulse">&#127919;</div>
          <div className="text-xs font-bold text-purple-400 mt-1">{lang === "es" ? "TOP 1% — Aplica a Anthropic, OpenAI, Google" : "TOP 1% — Apply to Anthropic, OpenAI, Google"}</div>
        </div>
      </div>

      {/* ═══ MODAL ═══ */}
      {modalNode && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setModalIdx(null)}>
          <div className="bg-bg-secondary border border-border rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-5 relative animate-[slideUp_0.3s_ease]" onClick={e => e.stopPropagation()}>
            <button className="absolute top-3 right-3 text-text-muted hover:text-text-primary text-xl" onClick={() => setModalIdx(null)}>&times;</button>

            <div className="flex items-center gap-2 text-lg font-bold">
              <div className={`w-2.5 h-2.5 rounded-full ${tSt(state, modalNode.pi, modalNode.ti, modalNode) === "done" ? "bg-accent-green" : tSt(state, modalNode.pi, modalNode.ti, modalNode) === "prog" ? "bg-accent-amber" : "bg-text-muted"}`} />
              {modalNode.phId} &mdash; {modalNode.name}
            </div>
            <p className="text-sm text-text-secondary mt-1">{modalNode.detail}</p>
            {modalNode.res && <p className="text-xs text-text-muted italic">{modalNode.res}</p>}
            <div className="flex gap-1 mt-2">{(modalNode.tags || []).map((tg, i) => (
              <span key={i} className={`text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase ${tg.t === "cert" ? "bg-accent-green/15 text-accent-green" : tg.t === "v5" ? "bg-purple-500/20 text-purple-300" : "bg-indigo-500/20 text-indigo-300"}`}>{tg.l}</span>
            ))}</div>

            <div className="text-[10px] text-text-muted mt-3">{lang === "es" ? "Ciclo de estudio:" : "Study cycle:"}</div>
            <div className="flex gap-1 mt-1">
              {cycleLbl.map((l, i) => {
                const c = cSt(state, modalNode.pi, modalNode.ti);
                return <button key={i} onClick={() => toggleCycle(modalNode.pi, modalNode.ti, i)} className={`w-7 h-5 rounded text-[9px] font-bold flex items-center justify-center transition-all hover:scale-110 ${c[i] ? `${cycleCls[i]} text-white` : "bg-bg-tertiary text-text-muted"}`}>{l}</button>;
              })}
            </div>

            <div className="mt-3 border-t border-border pt-3 space-y-0.5">
              {modalNode.items.map((item, i) => {
                const v = iSt(state, modalNode.pi, modalNode.ti, i);
                return (
                  <div key={i} onClick={() => toggleItem(modalNode.pi, modalNode.ti, i)} className="flex items-start gap-2 px-1 py-1 rounded cursor-pointer hover:bg-white/[.03] transition-colors select-none">
                    <span className={`w-4 text-center text-sm shrink-0 ${iconCls[v]}`}>{icons[v]}</span>
                    <span className="text-sm text-text-secondary leading-snug">{item}</span>
                  </div>
                );
              })}
            </div>

            {modalNode.items.some(i => /ejercicio|proyecto/i.test(i)) && (
              <div className="mt-3 p-2 bg-accent-green/10 border border-accent-green/20 rounded-lg text-xs text-accent-green text-center">
                {lang === "es" ? `Feynman: Explica ${modalNode.name} a Claude antes de continuar` : `Feynman: Explain ${modalNode.name} to Claude before continuing`}
              </div>
            )}

            {modalNode.h > 0 && <div className="text-right text-[10px] text-text-muted mt-2">~{modalNode.h}h {lang === "es" ? "estimadas" : "estimated"}</div>}
          </div>
        </div>
      )}
    </div>
    </PinGate>
  );
};

// Need React import for JSX fragments
import React from "react";

export default RoadmapGame;
