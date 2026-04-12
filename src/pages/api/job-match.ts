import type { APIRoute } from "astro";
import { searchProfile, getChunksByTags } from "../../lib/profile-search";
import { tokenize } from "../../lib/tfidf";
import type { JobMatchResponse, ProfileChunk } from "../../lib/job-match-types";

export const prerender = false;

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";
const MAX_INPUT_LENGTH = 6000;
const MAX_REQUESTS_PER_MINUTE = 3;

const rateLimitStore = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowStart = now - 60_000;
  const timestamps = (rateLimitStore.get(ip) ?? []).filter((t) => t > windowStart);
  if (timestamps.length >= MAX_REQUESTS_PER_MINUTE) return false;
  timestamps.push(now);
  rateLimitStore.set(ip, timestamps);
  return true;
}

function buildSystemPrompt(chunks: ProfileChunk[], lang: string): string {
  const evidence = chunks
    .map((c) => `[${c.title}]\n${c.text}`)
    .join("\n\n---\n\n");

  return `You are a recruiter-facing job match analyzer for Adrian Infantes, an AI Security Engineer.

TASK: Given a job description, extract its requirements and match each one against Adrian's profile evidence below. Return ONLY valid JSON.

ADRIAN'S PROFILE EVIDENCE (retrieved from real portfolio data):
${evidence}

RESPONSE SCHEMA (respond with ONLY this JSON, no markdown, no code fences):
{
  "overall_match": <integer 0-100>,
  "match_tier": "strong" | "good" | "partial" | "low",
  "summary": "<2-3 sentence executive summary of the fit>",
  "requirements": [
    {
      "requirement": "<extracted from the JD>",
      "status": "met" | "partial" | "gap",
      "evidence": "<specific evidence from Adrian's profile>",
      "source": "<cite the source in brackets, e.g. [BBVA Technology -- AI Security Architect]>"
    }
  ],
  "unique_edge": "<what makes Adrian uniquely valuable for THIS specific role>",
  "suggested_questions": ["<3 questions a recruiter should ask Adrian in an interview>"],
  "citations": [
    { "id": "<chunk id>", "title": "<source title>", "relevance": <0.0-1.0> }
  ]
}

RULES:
- Extract 5-12 requirements from the JD (skills, experience years, certifications, domain knowledge)
- Match tier: strong (75-100), good (50-74), partial (25-49), low (0-24)
- ONLY use evidence from the profile above. If something isn't in the evidence, mark it as "gap"
- Do NOT invent or hallucinate experience. If unsure, say "partial" with honest evidence
- Cite specific projects, companies, or achievements by name in [brackets]
- ${lang === "es" ? "Respond in Spanish" : "Respond in English"}
- Respond with JSON only`;
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = clientAddress ?? request.headers.get("x-forwarded-for") ?? "unknown";

  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded. Max 3 requests per minute." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: { jobDescription?: unknown; lang?: unknown };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const jd = typeof body.jobDescription === "string" ? body.jobDescription.trim() : "";
  if (!jd) {
    return new Response(
      JSON.stringify({ error: "Missing 'jobDescription' field" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  if (jd.length > MAX_INPUT_LENGTH) {
    return new Response(
      JSON.stringify({ error: `Input too long. Max ${MAX_INPUT_LENGTH} characters.` }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const lang = body.lang === "es" ? "es" : "en";

  const apiKey = import.meta.env.GROQ_API_KEY ?? process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Server misconfigured: GROQ_API_KEY not set" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Hybrid retrieval: TF-IDF similarity + keyword tag matching
    const tfidfResults = searchProfile(jd, 10);
    const keywords = tokenize(jd).slice(0, 20);
    const tagResults = getChunksByTags(keywords);

    // Merge and deduplicate, prefer TF-IDF order
    const seen = new Set<string>();
    const chunks: ProfileChunk[] = [];
    for (const c of [...tfidfResults, ...tagResults]) {
      if (!seen.has(c.id) && chunks.length < 12) {
        seen.add(c.id);
        chunks.push(c);
      }
    }

    const systemPrompt = buildSystemPrompt(chunks, lang);

    const groqResponse = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Analyze this job description:\n\n${jd}` },
        ],
        temperature: 0.2,
        max_tokens: 1500,
        response_format: { type: "json_object" },
      }),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      console.error("Groq API error:", groqResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: "Analysis service unavailable. Try again later." }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    const groqData = await groqResponse.json();
    const content = groqData.choices?.[0]?.message?.content;
    if (!content) {
      return new Response(
        JSON.stringify({ error: "Empty response from model" }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(content);
    } catch {
      return new Response(
        JSON.stringify({ error: "Model returned invalid JSON" }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        ...parsed,
        model: MODEL,
        provider: "groq",
      } satisfies JobMatchResponse & Record<string, unknown>),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (err) {
    console.error("Job match error:", err);
    return new Response(
      JSON.stringify({ error: "Internal error during analysis" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
