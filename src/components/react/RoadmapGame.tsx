import { useState, useEffect, useCallback, type FC } from "react";
import React from "react";

// ═══════ TYPES ═══════
interface Tag { t: string; l: string }
interface Topic { name: string; st: string; h: number; detail: string; res?: string; tags?: Tag[]; items: string[]; boss?: boolean }
interface Phase { id: string; name: string; month?: string; topics: Topic[]; special?: { name: string; detail: string } }
interface Tier { tier: number; name: string; sub: string; phases: Phase[] }
interface AppState { items: Record<string, number>; cycle: Record<string, number[]>; activity: string[] }
type Lang = "en" | "es";

// ═══════ L4TENTNOISE EVOLUTION ═══════
const EVOLUTIONS = [
  { tag: "AI", name: "Adrian Infantes", title: "Estudiante", min: 0, max: 20, color: "#3b82f6", glow: "rgba(59,130,246,.4)", img: "/roadmap/l4-deeplearning.png", desc: { en: "Learning the fundamentals. Building the foundation.", es: "Aprendiendo los fundamentos. Construyendo la base." } },
  { tag: "AI", name: "Adrian Infantes", title: "Ingeniero", min: 20, max: 45, color: "#06b6d4", glow: "rgba(6,182,212,.4)", img: "/roadmap/l4-teaching.png", desc: { en: "Corporate engineer. Building AI systems by day.", es: "Ingeniero corporativo. Construyendo sistemas AI de dia." } },
  { tag: "L4", name: "L4tentNoise", title: "Shadow Operative", min: 45, max: 75, color: "#a855f7", glow: "rgba(168,85,247,.4)", img: "/roadmap/l4-redteam-analysis.png", desc: { en: "The alter ego emerges. Breaking what others build.", es: "El alter ego emerge. Rompiendo lo que otros construyen." } },
  { tag: "L4", name: "L4tentNoise", title: "The Architect", min: 75, max: 101, color: "#ef4444", glow: "rgba(239,68,68,.5)", img: "/roadmap/l4-aws-redteam.png", desc: { en: "Full spectrum. Builder and breaker. The 1%.", es: "Espectro completo. Constructor y destructor. El 1%." } },
];
const getEvo = (p: number) => { for (let i = EVOLUTIONS.length - 1; i >= 0; i--) if (p >= EVOLUTIONS[i].min) return { ...EVOLUTIONS[i], idx: i }; return { ...EVOLUTIONS[0], idx: 0 }; };

// ═══════ DATA ═══════
const R: Tier[] = [
{tier:1,name:"Fundamentos",sub:"SECTOR ALPHA",phases:[
{id:"0",name:"Matematicas",topics:[
{name:"Algebra Lineal",st:"prog",h:20,detail:"Curso completado. 3B1B 75%. PCA hecho.",res:"Coursera + 3Blue1Brown",tags:[{t:"cert",l:"cert"}],items:["Ver 3B1B Essence of Linear Algebra videos 1-8","Completar Coursera Linear Algebra for ML","Implementar operaciones matriciales en numpy","Investigar autovalores: 3B1B video 14 + implementar numpy","Leer MML Book cap 4 sobre SVD","Implementar PCA desde cero numpy sobre MNIST","Derivar normal equation a mano"]},
{name:"Calculo",st:"prog",h:20,detail:"Curso 20%. GD y backprop hechos.",res:"Coursera + 3Blue1Brown",items:["Ver 3B1B Essence of Calculus completo","Completar Coursera Calculus for ML","Implementar gradient descent en numpy","Derivar chain rule de backprop a mano","Implementar backprop red 2 capas numpy","Explicar chain rule a ARCA"]},
{name:"Probabilidad",st:"prog",h:20,detail:"Bayes + A/B test from scratch.",res:"Coursera + Khan",items:["Completar Coursera Prob & Stats for ML","Ver Khan Academy distribuciones","Implementar Naive Bayes from scratch >95%","Implementar z-test from scratch","Construir A/B testing simulator","Explicar Naive Bayes paso a paso a ARCA","Estudiar MLE y MAP: MML Book cap 8"]},
{name:"Optimizacion",st:"prog",h:15,detail:"SGD+Momentum+Adam from scratch.",res:"MML Book Cap 7",items:["Implementar SGD puro en numpy","Implementar Momentum (beta=0.9)","Implementar Adam + graficar loss curves","Leer MML Book cap 7 convexidad","Implementar cosine annealing","Resolver 2 problemas Lagrange a mano"]}
]},
{id:"1",name:"CS y Arquitectura",topics:[
{name:"DSA+LC",st:"pend",h:100,detail:"120: 80E+30M+10H",tags:[{t:"v5",l:"120"}],items:["Completar NeetCode DSA for Beginners","Resolver 80 Easy LeetCode","Resolver 30 Medium LeetCode","Resolver 10 Hard LeetCode","Resolver Medium en <25 min"]},
{name:"Arquitectura",st:"pend",h:20,detail:"SOLID, Hexagonal",items:["Leer Clean Architecture caps 1-22","SOLID en Python con RealPython","Refactorizar proyecto ML hexagonal","Disenar API REST para servicio ML"]},
{name:"Tooling",st:"pend",h:15,detail:"Docker, CI/CD, pytest",items:["Docker Getting Started tutorial","Dockerfile multi-stage para Python","GitHub Actions CI/CD pipeline","pytest >80% coverage + mypy strict"]},
{name:"Proyecto API",st:"pend",h:20,detail:"FastAPI+Docker+CI/CD",items:["FastAPI tutorial + API para modelo ML","Containerizar Docker multi-stage","CI/CD GitHub Actions","80% coverage + OpenAPI docs"],boss:true}
]},
{id:"2",name:"ML/DL/GenAI+RL",topics:[
{name:"Python",st:"done",h:10,detail:"IT Specialist cert",tags:[{t:"cert",l:"cert"}],items:["Type hints avanzados mypy strict","Implementar 3 decorators utiles","Script async con aiohttp","Paquete Python con uv","Protocols para interfaces"]},
{name:"ML Teoria",st:"prog",h:25,detail:"3 certs. Falta DecTree.",tags:[{t:"cert",l:"3x"}],items:["Linear Regression from scratch","Logistic Regression from scratch","Decision Tree from scratch","sklearn Pipeline completo","2 Kaggle competitions","Explicar bias-variance a ARCA"]},
{name:"Deep Learning",st:"prog",h:30,detail:"Attention 40%. Karpathy 50%.",items:["Leer Attention Is All You Need","Karpathy Let's build GPT","Self-attention <30 lineas PyTorch","CNN from scratch >80% CIFAR-10","Derivar backprop attention a mano","Training loop completo","Explicar residual connections"]},
{name:"GenAI",st:"prog",h:30,detail:"Cert. LoRA pendiente.",tags:[{t:"cert",l:"cert"}],items:["Implementar BPE simplificado","Fine-tune LoRA en RTX 2000 Ada","Leer Scaling Laws Kaplan 2020","Estudiar RLHF pipeline","Leer DPO Rafailov 2023","Explicar LoRA vs full fine-tuning"]},
{name:"RL",st:"pend",h:40,detail:"PPO+DPO obligatorio.",tags:[{t:"v5",l:"v5"}],items:["HuggingFace Deep RL Course 1-4","REINFORCE en CartPole","PPO basico clipped objective","Estudiar RLHF","DPO fine-tuning","GRPO paper","Explicar PPO vs REINFORCE","Explicar DPO vs RLHF"]},
{name:"Kaggle",st:"pend",h:20,detail:"2 competiciones",items:["2 competiciones activas","EDA completo","Feature engineering 5+","Modelo + submission","Publicar notebooks"],boss:true}
]}
]},
{tier:2,name:"Builder",sub:"SECTOR BRAVO",phases:[
{id:"3A",name:"LLMs",topics:[
{name:"Certs Claude",st:"done",h:5,detail:"Fluency+101",tags:[{t:"cert",l:"2x"}],items:["Claude AI Fluency Framework","Claude 101","Anthropic Prompt Eng docs"]},
{name:"Context Eng",st:"pend",h:20,detail:"Prompts, outputs, tools",items:["Benchmark ZS vs FS vs CoT","System prompt vs 5+ ataques","Structured outputs Pydantic+retry","Tool calling schema JSON","Prompt chain 3+ pasos","Temperature alta vs baja","KV cache internals"]}
]},
{id:"3B",name:"RAG",topics:[
{name:"RAG Basics",st:"done",h:5,detail:"2 certs",tags:[{t:"cert",l:"2x"}],items:["PDF + chunking + Chroma pipeline","DL.AI LangChain Chat with Data","DataCamp AI Engineer Track"]},
{name:"RAG Avanzado",st:"pend",h:25,detail:"Reranking, agentic",items:["Hybrid search dense+BM25","Reranking cross-encoder","Query transform HyDE","Agentic RAG self-corrective","RAG Security injection via docs","RAGAS eval >0.7"]},
{name:"VectorDBs",st:"pend",h:15,detail:"Chroma, FAISS, Qdrant",items:["Probar Chroma, FAISS, Qdrant","HNSW, IVF, PQ indexing","Comparar 3 chunking con RAGAS"]},
{name:"Proyecto RAG",st:"pend",h:30,detail:"UI+eval dashboard",items:["Pipeline E2E completo","UI Streamlit/Gradio","RAGAS dashboard","Publicar GitHub"],boss:true}
]},
{id:"3C",name:"Agents",topics:[
{name:"Patterns",st:"prog",h:25,detail:"ReAct 30%",items:["Leer paper ReAct","ReAct from scratch 3+ tools","create_react_agent() LangChain","Leer paper Reflexion","Plan-and-Execute agent"]},
{name:"LangGraph",st:"pend",h:30,detail:"Stack principal",items:["LangGraph tutorials completos","StateGraph 5+ nodos","Checkpointing persistencia","HITL interrupt+Command","Subgraphs modulares","Streaming tokens"]},
{name:"Multi-Agent",st:"pend",h:30,detail:"Supervisor, MCP",items:["Supervisor 1 router + 3 specialists","MCP server Python FastMCP","MCP server TypeScript","Conectar MCP a Claude Code","Agent memory short+long"]},
{name:"Agent Security",st:"pend",h:25,detail:"Guardrails, audit",items:["LangSmith tracing+evaluator","Guardrails I/O filtering","Sandboxing aislado","PROYECTO multi-agent+audit"],boss:true}
]},
{id:"3D/E",name:"Multi+MLOps",topics:[
{name:"Multimodal",st:"pend",h:15,detail:"Vision, audio",items:["Claude/GPT-4V image understanding","Whisper STT integration","Multimodal RAG"]},
{name:"MLOps",st:"prog",h:25,detail:"1 cert. vLLM pend.",tags:[{t:"cert",l:"cert"}],items:["MLflow 3 experimentos","Model registry + DVC","vLLM en RTX 2000 Ada","ONNX export + benchmark","Monitoring drift+alertas"]}
]},
{id:"4",name:"Sistemas",topics:[
{name:"GPU Conceptual",st:"pend",h:10,detail:"Understand only",tags:[{t:"v5",l:"v5"}],items:["Paper FlashAttention + diagrama","DDP vs FSDP vs DeepSpeed tabla","Quantizar GPTQ + benchmark","Mixed precision torch.autocast"]},
{name:"System Design",st:"pend",h:25,detail:"3 designs",items:["Rec system 100M users 45min","Fraud detection pipeline 45min","LLM serving + rate limiting 45min","PyTorch profiler bottlenecks"],boss:true}
]},
{id:"4B",name:"AWS",topics:[
{name:"Certs Cloud",st:"done",h:0,detail:"3 certs existentes",tags:[{t:"cert",l:"3x"}],items:["AWS AI Practitioner Mar 2026","MS AI-900 Oct 2023","MS AI-102 Mar 2024"]},
{name:"AWS CCP",st:"pend",h:25,detail:"Unica obligatoria",tags:[{t:"v5",l:"CCP"}],items:["Curso Stephane Maarek","4+ practice exams Tutorials Dojo","Aprobar CLF-C02 $100","Shared responsibility"]},
{name:"AWS Hands-on",st:"pend",h:30,detail:"Deploy, Bedrock",items:["EC2 GPU g5 spot","Lambda+SageMaker pipeline","ECR+ECS container","IAM+KMS encryption","Bedrock Claude/Llama"]}
]},
{id:"5",name:"Research",topics:[
{name:"Papers",st:"prog",h:50,detail:"1/semana, 50+",tags:[{t:"v5",l:"wk1"}],items:["Attention Is All You Need","Scaling Laws Kaplan 2020","Constitutional AI Bai 2022","DPO Rafailov 2023","Adversarial Attacks Zou 2023","Indirect Injection Greshake 2023","Sleeper Agents Hubinger 2024","FlashAttention Dao 2022","LoRA Hu 2021"]},
{name:"Contenido",st:"pend",h:40,detail:"3 blogs, 1 charla",items:["Reproducir 3 papers GitHub","3 blog posts EN","1 charla/presentacion","RLHF vs DPO vs Constitutional AI"],boss:true}
]}
]},
{tier:3,name:"Breaker",sub:"SECTOR CHARLIE",phases:[
{id:"6",name:"Security",topics:[
{name:"Certs Sec",st:"done",h:0,detail:"Linux+Cyber+OSINT",tags:[{t:"cert",l:"3x"}],items:["Linux 100 TCM cert","Intro Cybersecurity Cisco cert","OSINT TCM cert"]},
{name:"Net+HTB",st:"prog",h:50,detail:"HTB en curso",items:["HTB Academy networking modules","15+ maquinas HTB+writeups","Writeup completo cada maquina"]},
{name:"Web OWASP",st:"pend",h:40,detail:"30+ labs",items:["5+ labs SQLi PortSwigger","5+ labs XSS PortSwigger","5+ labs CSRF/SSRF","5+ labs Auth/IDOR","Dominar Burp Suite","30+ labs total"]},
{name:"Hardening",st:"pend",h:15,detail:"SSH, iptables",items:["SSH hardening keys+fail2ban","iptables/nftables firewall","Wireshark 10 capturas","PKI JWT OAuth en Python"],boss:true}
]},
{id:"7",name:"AI Red Team",topics:[
{name:"Certs AI",st:"done",h:0,detail:"SANS x2 + EU AI Act",tags:[{t:"cert",l:"3x"}],items:["SANS Prompt Hacking cert","SANS Advanced cert","EU AI Act cert"]},
{name:"HTB ART",st:"prog",h:60,detail:"Path en curso",items:["100% HTB AI Red Teamer Path","Certificacion examen practico","Labs hands-on cada modulo","Writeups con metodologia"]},
{name:"LLM Sec",st:"pend",h:30,detail:"Injection, jailbreak",items:["5+ direct injection en Ollama","Indirect injection via docs RAG","Jailbreaking DAN crescendo many-shot","System prompt extraction 3+ chatbots","OWASP Top 10 LLMs v2 completo","MITRE ATLAS framework","Documentar cada tecnica"]},
{name:"Adversarial",st:"pend",h:30,detail:"FGSM, training",items:["FGSM desde cero PyTorch","PGD comparar con FGSM","Adversarial training defensa","Model stealing queries","Data poisoning simulacion","Robustness before/after"]},
{name:"Tools RT",st:"pend",h:25,detail:"Garak, PyRIT",items:["Garak 3+ modelos","PyRIT automatizado","Red team report profesional","Mini-scanner vulns propio"]},
{name:"Auto RT",st:"pend",h:40,detail:"Pipelines, AI vs AI",tags:[{t:"v5",l:"+4sem"}],items:["Automated jailbreak pipeline","Eval framework before/after","AI vs AI attacker/defender","CI integration automatica","Documentar repo publico"],boss:true}
]}
]},
{tier:4,name:"Unicorn",sub:"SECTOR DELTA",phases:[
{id:"8",name:"Portfolio",topics:[
{name:"OSS",st:"pend",h:40,detail:"PRs AI security",tags:[{t:"v5",l:"AI sec"}],items:["3+ PRs docs/typos/tests","2+ PRs bug fixes AI security","1+ PR feature tier-1","GitHub activity consistente"]},
{name:"P1: RT Tool",st:"pend",h:80,detail:"Scanner+pipeline",tags:[{t:"v5",l:"MAIN"}],items:["CLI + plugins modulares","Scanner injection 5+ tecnicas","Jailbreak discovery pipeline","80% coverage pytest","GitHub + README","Foco agentic/MCP attacks"]},
{name:"P2: Agent",st:"pend",h:60,detail:"Multi-agent seguro",items:["LangGraph+MCP+Docker","RAG seguro anti-injection","Audit trail completo","Red team tested con P1"]},
{name:"P3: E2E",st:"pend",h:80,detail:"Produccion+blog",items:["App produccion AWS","Security cada capa","Blog post arquitectura","Red team report","Integra P1 y P2"],boss:true}
]},
{id:"9",name:"Visibilidad",topics:[
{name:"Presencia",st:"pend",h:30,detail:"Blog, charlas",items:["6 blog posts EN","2 charlas meetup/conf","Twitter/X 1 post/sem","LinkedIn optimizado"]},
{name:"Network",st:"pend",h:25,detail:"Communities",tags:[{t:"v5",l:"new"}],items:["AI Village DEF CON","MLSecOps Community","OWASP LLM Top 10","Cold emails 1/sem","2+ conferencias"]},
{name:"Entrevistas",st:"pend",h:60,detail:"LC+design+mocks",items:["120 LeetCode 80E+30M+10H","10 ML system designs","5+ mock interviews","Transformer pizarra 45min","FGSM pizarra 30min","STAR format proyectos","AI Sec deep dive"]},
{name:"Original",st:"pend",h:40,detail:"1 hallazgo nuevo",tags:[{t:"v5",l:"crit"}],items:["Jailbreak nuevo documentado","O defensa con metricas","O analisis unico","Publicar blog/writeup","Compartir en comunidades"],boss:true}
]}
]}
];

// ═══════ STATE ═══════
const KEY = "rmv5";
const isClient = typeof window !== "undefined";
const emptyState = (): AppState => ({ items: {}, cycle: {}, activity: [] });
const loadState = (): AppState => { if (!isClient) return emptyState(); try { return JSON.parse(localStorage.getItem(KEY) || "{}") as AppState; } catch { return emptyState(); } };
const saveState = (s: AppState) => { if (isClient) localStorage.setItem(KEY, JSON.stringify(s)); };
const getState = (): AppState => { const s = loadState(); if (!s.items) s.items = {}; if (!s.cycle) s.cycle = {}; if (!s.activity) s.activity = []; return s; };
const iSt = (s: AppState, p: number, t: number, i: number) => s.items[`${p}-${t}-${i}`] || 0;
const cSt = (s: AppState, p: number, t: number) => s.cycle[`${p}-${t}`] || [0, 0, 0, 0];
function tSt(s: AppState, p: number, t: number, tp: Topic): string {
  const it = tp.items || []; if (!it.length) return tp.st;
  let d = 0, pr = 0; it.forEach((_, i) => { const v = iSt(s, p, t, i); if (v === 2) d++; else if (v === 1) pr++; });
  if (d === it.length) return "done"; if (d > 0 || pr > 0) return "prog"; return tp.st;
}
const PW: Record<string, number> = {"0":5,"1":5,"2":8,"3A":4,"3B":5,"3C":6,"3D/E":3,"4":3,"4B":4,"5":10,"6":7,"7":20,"8":12,"9":8};
function comp1(s: AppState): number {
  let sc = 0, pi = 0;
  R.forEach(t => t.phases.forEach(ph => {
    const w = PW[ph.id] || 0; let ti = 0, pts = 0;
    ph.topics.forEach((t2, i) => { const it = t2.items || [];
      if (it.length) it.forEach((_, j) => { ti++; const v = iSt(s, pi, i, j); if (v === 2) pts += 1; else if (v === 1) pts += 0.5; });
      else { ti++; const st = tSt(s, pi, i, t2); if (st === "done") pts += 1; else if (st === "prog") pts += 0.5; }
    }); if (ti) sc += (pts / ti) * w; pi++;
  })); return Math.round(sc);
}
function flattenNodes() {
  const nodes: (Topic & { pi: number; ti: number; phId: string; phName: string; tier: number; tierName: string })[] = [];
  let pi = 0; R.forEach(tier => { tier.phases.forEach(ph => { ph.topics.forEach((tp, ti) => {
    nodes.push({ ...tp, pi, ti, phId: ph.id, phName: ph.name, tier: tier.tier, tierName: tier.name });
  }); pi++; }); }); return nodes;
}

// ═══════ SEED ═══════
function seedIfEmpty() {
  if (!isClient) return; if (localStorage.getItem(KEY)) return;
  const s: AppState = { items: {}, cycle: {}, activity: [] };
  const D = 2, P = 1;
  s.items["0-0-0"]=D;s.items["0-0-1"]=D;s.items["0-0-2"]=D;s.items["0-0-3"]=D;s.items["0-0-4"]=D;s.items["0-0-5"]=D;s.cycle["0-0"]=[1,1,1,0];
  s.items["0-1-1"]=D;s.items["0-1-0"]=P;s.items["0-1-2"]=P;s.items["0-1-3"]=P;s.items["0-1-4"]=D;s.items["0-1-5"]=D;s.cycle["0-1"]=[1,1,0,0];
  s.items["0-2-0"]=P;s.items["0-2-1"]=D;s.items["0-2-2"]=P;s.items["0-2-4"]=D;s.items["0-2-5"]=D;s.items["0-2-6"]=D;s.cycle["0-2"]=[1,1,1,0];
  s.items["0-3-0"]=D;s.items["0-3-1"]=D;s.items["0-3-5"]=D;s.cycle["0-3"]=[1,1,0,0];
  s.items["2-0-0"]=D;s.items["2-0-1"]=D;s.items["2-0-2"]=P;s.items["2-0-3"]=P;s.items["2-0-4"]=P;s.cycle["2-0"]=[1,1,1,0];
  s.items["2-1-0"]=D;s.items["2-1-1"]=D;s.items["2-1-3"]=P;s.items["2-1-5"]=P;s.cycle["2-1"]=[1,1,0,0];
  s.items["2-2-0"]=P;s.items["2-2-1"]=P;s.items["2-2-4"]=P;s.items["2-2-5"]=P;s.cycle["2-2"]=[1,0,0,0];
  s.items["2-3-0"]=P;s.items["2-3-3"]=P;s.cycle["2-3"]=[1,0,0,0];
  s.items["3-0-0"]=D;s.items["3-0-1"]=D;s.items["3-0-2"]=D;s.cycle["3-0"]=[1,1,1,1];
  s.items["3-1-0"]=P;s.items["3-1-1"]=P;s.items["3-1-2"]=P;s.items["3-1-3"]=P;s.items["3-1-4"]=P;s.cycle["3-1"]=[1,1,0,0];
  s.items["4-0-0"]=D;s.items["4-0-1"]=D;s.items["4-0-2"]=D;s.cycle["4-0"]=[1,1,1,1];
  s.items["5-0-0"]=P;s.items["5-0-1"]=P;s.cycle["5-0"]=[1,1,0,0];
  s.items["6-1-0"]=P;s.items["6-1-1"]=P;s.items["6-1-4"]=P;s.cycle["6-1"]=[1,0,0,0];
  s.items["8-0-0"]=D;s.items["8-0-1"]=D;s.items["8-0-2"]=D;s.cycle["8-0"]=[1,1,1,1];
  s.items["8-1-0"]=P;s.items["8-1-1"]=P;
  s.items["9-0-0"]=P;s.cycle["9-0"]=[1,0,0,0];
  s.items["10-0-0"]=D;s.items["10-0-1"]=D;s.items["10-0-2"]=D;s.cycle["10-0"]=[1,1,1,1];
  s.items["10-1-0"]=P;s.items["10-1-1"]=P;s.items["10-1-2"]=P;s.cycle["10-1"]=[1,1,0,0];
  s.items["11-0-0"]=D;s.items["11-0-1"]=D;s.items["11-0-2"]=D;s.cycle["11-0"]=[1,1,1,1];
  s.items["11-1-0"]=P;s.items["11-1-2"]=P;s.items["11-1-3"]=P;s.cycle["11-1"]=[1,1,0,0];
  s.items["11-2-0"]=P;s.items["11-2-1"]=P;s.items["11-2-2"]=P;s.items["11-2-5"]=P;s.items["11-2-6"]=P;
  saveState(s);
}

// ═══════ PIN GATE ═══════
const PIN = "L4tentNoise";
const PIN_KEY = "rmv5_auth";
function PinGate({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const [authed, setAuthed] = useState(() => isClient && sessionStorage.getItem(PIN_KEY) === "1");
  const [input, setInput] = useState(""); const [error, setError] = useState(false);
  if (authed) return <>{children}</>;
  const check = () => { if (input === PIN) { sessionStorage.setItem(PIN_KEY, "1"); setAuthed(true); } else { setError(true); setTimeout(() => setError(false), 1500); } };
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <div className="text-center max-w-xs">
        <div className="relative w-32 h-32 mx-auto mb-4 rounded-xl overflow-hidden border border-border opacity-80">
          <img src="/roadmap/l4-real.png" alt="" className="w-full h-full object-cover object-top" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
          <div className="absolute bottom-2 left-0 right-0 text-center font-mono text-accent text-xs tracking-[4px]">[&gt;_]</div>
        </div>
        <h2 className="text-lg font-mono font-bold text-text-primary mb-1 tracking-wider">CLASSIFIED ACCESS</h2>
        <p className="text-xs text-text-muted mb-4 font-mono">Enter clearance code</p>
        <input type="password" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && check()} placeholder="..." autoFocus
          className={`w-full px-4 py-2 rounded bg-bg-tertiary border ${error ? "border-accent-red" : "border-border"} text-text-primary text-center font-mono text-lg tracking-[.3em] focus:outline-none focus:border-accent transition-colors`} />
        <button onClick={check} className="mt-3 px-6 py-2 rounded bg-accent/10 border border-accent/30 text-accent text-xs font-mono font-bold hover:bg-accent/20 transition-colors tracking-wider">ACCESS</button>
        {error && <p className="text-accent-red text-xs mt-2 font-mono">ACCESS DENIED</p>}
      </div>
    </div>
  );
}

// ═══════ COMPONENT ═══════
const RoadmapGame: FC<{ lang: Lang }> = ({ lang }) => {
  const [state, setState] = useState<AppState>(() => { if (!isClient) return emptyState(); seedIfEmpty(); return getState(); });
  const [modalIdx, setModalIdx] = useState<number | null>(null);
  const nodes = flattenNodes();
  useEffect(() => { if (isClient) { seedIfEmpty(); setState(getState()); } }, []);
  const refresh = useCallback(() => setState(getState()), []);
  const recAct = (s: AppState) => { const t = new Date().toISOString().slice(0, 10); if (!s.activity.includes(t)) s.activity.push(t); };
  const toggleItem = (pi: number, ti: number, ii: number) => { const s = getState(); s.items[`${pi}-${ti}-${ii}`] = ((s.items[`${pi}-${ti}-${ii}`] || 0) + 1) % 3; recAct(s); saveState(s); refresh(); };
  const toggleCycle = (pi: number, ti: number, ci: number) => { const s = getState(); const k = `${pi}-${ti}`; const c = s.cycle[k] || [0,0,0,0]; c[ci] = c[ci] ? 0 : 1; s.cycle[k] = c; recAct(s); saveState(s); refresh(); };

  const pct1 = comp1(state); const evo = getEvo(pct1);
  let doneC = 0, progC = 0, pendC = 0, certC = 0, pi2 = 0;
  R.forEach(t => t.phases.forEach(ph => { ph.topics.forEach((t2, i) => { const st = tSt(state, pi2, i, t2); if (st === "done") doneC++; else if (st === "prog") progC++; else pendC++; (t2.tags || []).forEach(tg => { if (tg.t === "cert") certC++; }); }); pi2++; }));
  const days = [...state.activity].sort().reverse(); let streak = 0;
  if (days.length) { const d = new Date(); for (let i = 0; i < 365; i++) { const ds = d.toISOString().slice(0, 10); if (days.includes(ds)) { streak++; d.setDate(d.getDate() - 1); } else if (i === 0) { d.setDate(d.getDate() - 1); } else break; } }
  let currentIdx = nodes.findIndex(n => tSt(state, n.pi, n.ti, n) !== "done"); if (currentIdx === -1) currentIdx = nodes.length - 1;

  const perRow = 7; const rows: typeof nodes[] = [];
  for (let i = 0; i < nodes.length; i += perRow) rows.push(nodes.slice(i, i + perRow));

  const icons = ["\u2022", "\u25C8", "\u2713"]; // bullet, diamond, check
  const iconCls = ["text-text-muted", "text-accent", "text-accent-green"];
  const cycleLbl = ["R", "E", "V", "D"]; // Recon Execute Verify Debrief
  const cycleTip = ["Recon", "Execute", "Verify", "Debrief"];
  const cycleCls = ["bg-blue-500", "bg-purple-500", "bg-accent", "bg-accent-green"];

  const sectorColors: Record<number, string> = { 1: "from-accent-green/[.03] to-blue-500/[.03]", 2: "from-blue-500/[.03] to-accent/[.03]", 3: "from-accent-red/[.05] to-accent-amber/[.03]", 4: "from-purple-500/[.04] to-pink-500/[.03]" };
  const sectorText: Record<number, string> = { 1: "text-accent-green/30", 2: "text-accent/30", 3: "text-accent-red/30", 4: "text-purple-400/30" };

  const modalNode = modalIdx !== null ? nodes[modalIdx] : null;
  const exportP = () => { const b = new Blob([JSON.stringify(getState(), null, 2)], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `l4tentnoise-${new Date().toISOString().slice(0, 10)}.json`; a.click(); };
  const importP = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (!f) return; const r = new FileReader(); r.onload = () => { try { saveState(JSON.parse(r.result as string)); location.reload(); } catch {} }; r.readAsText(f); };

  return (
    <PinGate lang={lang}>
    <div className="relative font-mono" style={{ fontSize: "103%" }}>

      {/* ═══ HERO ═══ */}
      <div className="relative h-48 overflow-hidden">
        <img src="/roadmap/l4-real.png" alt="" className="absolute inset-0 w-full h-full object-cover object-center opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-primary/60 to-bg-primary" />
        <div className="relative z-10 flex flex-col items-center justify-end h-full pb-4">
          <div className="text-[10px] tracking-[6px] text-accent/60 font-mono uppercase">Operational Dashboard</div>
          <h1 className="text-2xl font-mono font-black tracking-tight text-text-primary mt-1">L4tentNoise</h1>
          <p className="text-[10px] text-text-muted font-mono tracking-wider mt-0.5">AI Security Engineer Roadmap // {lang === "es" ? "Clasificado" : "Classified"}</p>
        </div>
      </div>

      {/* ═══ HUD ═══ */}
      <div className="sticky top-16 z-40 flex items-center justify-between px-4 py-2.5 bg-bg-primary/90 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3">
          <img src={evo.img} alt={evo.name} className="w-11 h-11 rounded-lg object-cover border-2" style={{ borderColor: evo.color, boxShadow: `0 0 12px ${evo.glow}` }} />
          <div>
            <div className="text-[10px] tracking-[3px] uppercase" style={{ color: evo.color }}>{evo.title}</div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-black" style={{ color: evo.color }}>{pct1}%</span>
              <span className="text-[9px] text-text-muted tracking-wider">{lang === "es" ? "HACIA EL 1%" : "TO THE 1%"}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-5 text-[10px] tracking-wider">
          <div className="text-center"><div className="font-black text-accent-green text-base">{doneC}</div><div className="text-text-muted">{lang === "es" ? "COMPLETADAS" : "COMPLETE"}</div></div>
          <div className="text-center"><div className="font-black text-accent text-base">{progC}</div><div className="text-text-muted">IN PROGRESS</div></div>
          <div className="text-center"><div className="font-black text-text-secondary text-base">{pendC}</div><div className="text-text-muted">{lang === "es" ? "PENDIENTE" : "PENDING"}</div></div>
          <div className="text-center"><div className="font-black text-text-primary text-base">{certC}</div><div className="text-text-muted">CREDENTIALS</div></div>
          <div className="text-center"><div className="font-black text-accent-red text-base">{streak}d</div><div className="text-text-muted">OP DAYS</div></div>
        </div>

        <div className="flex gap-1">
          <button onClick={exportP} className="px-2 py-1 rounded text-[9px] bg-bg-secondary border border-border text-text-muted hover:text-accent transition-colors tracking-wider">EXPORT</button>
          <label className="px-2 py-1 rounded text-[9px] bg-bg-secondary border border-border text-text-muted hover:text-accent transition-colors cursor-pointer tracking-wider">
            IMPORT<input type="file" accept=".json" className="hidden" onChange={importP} />
          </label>
          <button onClick={() => { if (confirm("PURGE ALL DATA?")) { localStorage.removeItem(KEY); location.reload(); } }} className="px-2 py-1 rounded text-[9px] bg-bg-secondary border border-border text-accent-red hover:text-red-300 transition-colors tracking-wider">PURGE</button>
        </div>
      </div>

      {/* ═══ EVOLUTION CARD ═══ */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="border border-border rounded-lg p-4 bg-bg-secondary/50 flex items-center gap-5">
          <img src={evo.img} alt={evo.name} className="w-20 h-20 rounded-lg object-cover border-2 shrink-0" style={{ borderColor: evo.color, boxShadow: `0 0 20px ${evo.glow}` }} />
          <div className="flex-1 min-w-0">
            <div className="text-xs tracking-[4px] uppercase" style={{ color: evo.color }}>{evo.name} // {evo.title}</div>
            <div className="text-text-muted text-[10px] mt-0.5 italic">{evo.desc[lang]}</div>
            <div className="flex gap-1.5 mt-2">
              {EVOLUTIONS.map((e, i) => (
                <div key={i} className={`text-[8px] px-2 py-0.5 rounded border tracking-wider font-bold ${i < evo.idx ? "border-accent-green/30 text-accent-green bg-accent-green/10" : i === evo.idx ? "bg-opacity-20 text-white" : "border-border text-text-muted"}`}
                  style={i === evo.idx ? { borderColor: e.color, color: e.color, background: `${e.color}20` } : undefined}>
                  {e.min}% {e.tag}:{e.title.split(" ")[0]}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ MAP ═══ */}
      <div className="max-w-[1000px] mx-auto px-4 pb-8">
        {rows.map((row, ri) => {
          const rtl = ri % 2 === 1;
          const displayRow = rtl ? [...row].reverse() : row;
          const firstTier = row[0].tier;
          const prevTier = ri > 0 ? rows[ri - 1][0].tier : 0;
          const showSector = firstTier !== prevTier;

          // Compute tier completion %
          const tierPct = (() => {
            let total = 0, pts = 0;
            let pi3 = 0;
            R.forEach(t => t.phases.forEach(ph => {
              ph.topics.forEach((tp2, i2) => {
                const items2 = tp2.items || [];
                if (items2.length) {
                  items2.forEach((_, j2) => {
                    if (t.tier === firstTier) { total++; const v = iSt(state, pi3, i2, j2); if (v === 2) pts += 1; else if (v === 1) pts += 0.5; }
                  });
                } else if (t.tier === firstTier) {
                  total++; const stx = tSt(state, pi3, i2, tp2);
                  if (stx === "done") pts += 1; else if (stx === "prog") pts += 0.5;
                }
              });
              pi3++;
            }));
            return total ? Math.round((pts / total) * 100) : 0;
          })();
          const tierPhases = R.find(t => t.tier === firstTier)?.phases.length || 0;

          return (
            <div key={ri}>
              {showSector && (
                <div className={`relative py-3 bg-gradient-to-b ${sectorColors[firstTier]}`}>
                  <div className={`flex items-center justify-between px-4 gap-3`}>
                    <div className={`text-[10px] font-black tracking-[5px] uppercase ${sectorText[firstTier]}`}>
                      {R.find(t => t.tier === firstTier)?.sub} // {R.find(t => t.tier === firstTier)?.name}
                    </div>
                    <div className="flex items-center gap-2 text-[9px] font-mono">
                      <span className={sectorText[firstTier].replace("/30","/60")}>
                        {tierPhases} fases
                      </span>
                      <div className="w-16 h-1 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full transition-all"
                             style={{ width: `${tierPct}%`,
                                      background: firstTier === 1 ? "#10b981" : firstTier === 2 ? "#06b6d4" : firstTier === 3 ? "#ef4444" : "#a855f7" }} />
                      </div>
                      <span className={`font-black ${sectorText[firstTier].replace("/30","")}`} style={{ minWidth: "2.5em", textAlign: "right" }}>
                        {tierPct}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {ri > 0 && (
                <div className={`flex ${rtl ? "justify-start" : "justify-end"} px-8 h-5`}>
                  <div className={`w-5 h-5 border border-dashed border-border/20 ${rtl ? "rounded-bl-lg border-t-0 border-r-0" : "rounded-br-lg border-t-0 border-l-0"}`} />
                </div>
              )}
              <div className={`flex items-center justify-center gap-0 py-2 px-4 ${rtl ? "flex-row-reverse" : ""}`}>
                {displayRow.map((n, ni) => {
                  const globalIdx = ri * perRow + (rtl ? row.length - 1 - ni : ni);
                  const st = tSt(state, n.pi, n.ti, n);
                  const isCurrent = globalIdx === currentIdx;

                  // Node styling based on status
                  const nodeIcon = st === "done" ? "\u2713" : st === "prog" ? "\u25C8" : n.boss ? "\u26A1" : "\u2022";
                  const borderStyle = st === "done" ? "border-accent-green bg-accent-green/10 shadow-[0_0_10px_rgba(16,185,129,.25)]"
                    : st === "prog" ? "border-accent bg-accent/10 shadow-[0_0_10px_rgba(6,182,212,.2)]"
                    : n.st === "opt" ? "border-purple-500/50 border-dashed bg-purple-500/5"
                    : "border-border bg-bg-tertiary/50";

                  return (
                    <React.Fragment key={globalIdx}>
                      <div className="relative w-14 h-14 shrink-0 cursor-pointer transition-transform hover:scale-110 group" onClick={() => setModalIdx(globalIdx)}>
                        {n.h > 0 && <div className="absolute -top-1 -left-1 text-[7px] bg-black/70 text-text-muted px-1 rounded font-mono pointer-events-none z-10">~{n.h}h</div>}
                        <div className={`w-11 h-11 rounded-lg border-[2px] flex items-center justify-center text-[8px] font-bold text-center leading-tight m-1.5 transition-all ${borderStyle}`}>
                          <span className="text-[10px]">{nodeIcon}</span>
                        </div>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[6px] text-text-muted whitespace-nowrap max-w-[65px] truncate pointer-events-none text-center tracking-wider uppercase">{n.name}</div>
                        {/* Agent marker */}
                        {isCurrent && (
                          <div className="absolute -top-7 left-1/2 -translate-x-1/2 pointer-events-none animate-bounce">
                            <img src="/roadmap/l4-base.png" alt="L4tentNoise" className="w-8 h-8 rounded-md object-cover border border-accent" style={{ boxShadow: `0 0 10px ${evo.glow}`, filter: "drop-shadow(0 3px 6px rgba(0,0,0,.6))" }} />
                          </div>
                        )}
                      </div>
                      {ni < displayRow.length - 1 && (
                        <div className="flex-1 h-px min-w-2 max-w-14 border-t border-dashed border-border/20" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Goal */}
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-lg border-2 border-accent-red inline-flex items-center justify-center text-xs font-black tracking-tighter text-accent-red bg-accent-red/10 shadow-[0_0_25px_rgba(239,68,68,.3)]">
            1%
          </div>
          <div className="text-[10px] font-mono font-bold text-accent-red mt-2 tracking-[3px]">TARGET ACQUIRED</div>
          <div className="text-[9px] text-text-muted mt-0.5">Anthropic // OpenAI // Microsoft // Google</div>
        </div>
      </div>

      {/* ═══ MODAL ═══ */}
      {modalNode && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setModalIdx(null)}>
          <div className="bg-bg-primary border border-border rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto relative" onClick={e => e.stopPropagation()} style={{ animation: "slideUp .25s ease" }}>
            {/* Briefing header */}
            <div className="border-b border-border px-5 py-3 flex items-center justify-between">
              <div className="text-[10px] tracking-[4px] text-accent font-bold">CLASSIFIED // MISSION BRIEFING</div>
              <button className="text-text-muted hover:text-text-primary text-lg leading-none" onClick={() => setModalIdx(null)}>&times;</button>
            </div>

            <div className="p-5">
              {/* Mission name */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-sm ${tSt(state, modalNode.pi, modalNode.ti, modalNode) === "done" ? "bg-accent-green" : tSt(state, modalNode.pi, modalNode.ti, modalNode) === "prog" ? "bg-accent" : "bg-text-muted"}`} />
                <span className="text-lg font-bold tracking-tight">{modalNode.phId} // {modalNode.name}</span>
              </div>

              <div className="mt-2 text-[10px] tracking-[2px] text-text-muted uppercase">OBJECTIVE</div>
              <p className="text-sm text-text-secondary">{modalNode.detail}</p>
              {modalNode.res && <><div className="mt-2 text-[10px] tracking-[2px] text-text-muted uppercase">RESOURCES</div><p className="text-xs text-text-muted italic">{modalNode.res}</p></>}

              {/* Tags */}
              <div className="flex gap-1 mt-2">{(modalNode.tags || []).map((tg, i) => (
                <span key={i} className={`text-[8px] px-1.5 py-0.5 rounded font-bold tracking-wider uppercase ${tg.t === "cert" ? "bg-accent-green/15 text-accent-green border border-accent-green/20" : tg.t === "v5" ? "bg-purple-500/15 text-purple-300 border border-purple-500/20" : "bg-accent/15 text-accent border border-accent/20"}`}>{tg.l}</span>
              ))}</div>

              {/* Operational Protocol (REVD cycle) */}
              <div className="mt-4 text-[10px] tracking-[2px] text-text-muted uppercase">OPERATIONAL PROTOCOL</div>
              <div className="flex gap-1 mt-1">
                {cycleLbl.map((l, i) => {
                  const c = cSt(state, modalNode.pi, modalNode.ti);
                  return <button key={i} onClick={() => toggleCycle(modalNode.pi, modalNode.ti, i)} title={cycleTip[i]}
                    className={`w-8 h-6 rounded text-[9px] font-bold flex items-center justify-center transition-all hover:scale-110 border ${c[i] ? `${cycleCls[i]} text-white border-transparent` : "bg-bg-tertiary text-text-muted border-border"}`}>{l}</button>;
                })}
              </div>

              {/* Subtasks */}
              <div className="mt-4 text-[10px] tracking-[2px] text-text-muted uppercase">SUBTASKS</div>
              <div className="mt-1 border-t border-border/50 pt-2 space-y-0.5">
                {modalNode.items.map((item, i) => {
                  const v = iSt(state, modalNode.pi, modalNode.ti, i);
                  return (
                    <div key={i} onClick={() => toggleItem(modalNode.pi, modalNode.ti, i)}
                      className="flex items-start gap-2 px-1.5 py-1 rounded cursor-pointer hover:bg-white/[.03] transition-colors select-none group">
                      <span className={`w-4 text-center text-sm shrink-0 ${iconCls[v]} group-hover:opacity-70`}>{icons[v]}</span>
                      <span className={`text-sm leading-snug ${v === 2 ? "text-text-muted line-through" : "text-text-secondary"}`}>{item}</span>
                    </div>
                  );
                })}
              </div>

              {/* Handler note (Feynman) */}
              {modalNode.items.some(i => /ejercicio|proyecto|explicar/i.test(i)) && (
                <div className="mt-4 p-3 bg-accent/5 border border-accent/20 rounded text-[10px] text-accent tracking-wider uppercase text-center">
                  HANDLER NOTE: Debrief with ARCA before proceeding
                </div>
              )}

              {modalNode.h > 0 && <div className="text-right text-[9px] text-text-muted mt-3 tracking-wider">EST. {modalNode.h}h</div>}
            </div>
          </div>
        </div>
      )}

    </div>
    </PinGate>
  );
};

export default RoadmapGame;
