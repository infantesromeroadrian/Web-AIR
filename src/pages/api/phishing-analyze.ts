import type { APIRoute } from "astro";

export const prerender = false;

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";
const MAX_INPUT_LENGTH = 4000;
const MAX_REQUESTS_PER_MINUTE = 5;

// Simple in-memory rate limiter (resets on cold start, acceptable for demo)
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

const SYSTEM_PROMPT = `You are a security analyst specialized in detecting phishing, social engineering, and fraudulent communications.

Your task: analyze the provided email/message text and return a structured JSON verdict.

You MUST respond with ONLY valid JSON matching this exact schema (no markdown, no code fences, no explanation outside JSON):

{
  "score": <integer 0-100, where 0=clearly legitimate, 100=definitely phishing>,
  "verdict": "CLEAN" | "SUSPICIOUS" | "PHISHING" | "CRITICAL",
  "confidence": <float 0.0-1.0>,
  "findings": [
    {
      "type": "critical" | "warning" | "info",
      "label": "<short label, max 40 chars>",
      "detail": "<specific evidence from the text, max 200 chars>"
    }
  ],
  "reasoning": "<concise explanation of your verdict, max 300 chars>"
}

Verdict thresholds:
- score 0-14: CLEAN
- score 15-39: SUSPICIOUS
- score 40-69: PHISHING
- score 70-100: CRITICAL

Look for: urgency manipulation, financial bait, credential harvesting, domain spoofing, social engineering, impersonation, grammatical red flags, suspicious URLs, authority claims, emotional triggers.

If the input is clearly benign or empty, return CLEAN with low score.
Always provide at least one finding, even for CLEAN verdicts (explain why it's clean).
Respond with JSON only.`;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = clientAddress ?? request.headers.get("x-forwarded-for") ?? "unknown";

  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded. Max 5 requests per minute." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: { text?: unknown };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const text = typeof body.text === "string" ? body.text.trim() : "";
  if (!text) {
    return new Response(JSON.stringify({ error: "Missing 'text' field" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (text.length > MAX_INPUT_LENGTH) {
    return new Response(
      JSON.stringify({ error: `Input too long. Max ${MAX_INPUT_LENGTH} characters.` }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const apiKey = import.meta.env.GROQ_API_KEY ?? process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "Server misconfigured: GROQ_API_KEY not set" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    const groqResponse = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Analyze this message:\n\n${text}` },
        ],
        temperature: 0.1,
        max_tokens: 800,
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
      return new Response(JSON.stringify({ error: "Empty response from model" }), {
        status: 502,
        headers: { "Content-Type": "application/json" },
      });
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
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (err) {
    console.error("Phishing analyze error:", err);
    return new Response(
      JSON.stringify({ error: "Internal error during analysis" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
