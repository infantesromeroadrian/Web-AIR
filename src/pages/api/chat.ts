import type { APIRoute } from "astro";
import { ADRIAN_CONTEXT } from "../../data/chat-context";

export const prerender = false;

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";
const MAX_INPUT_LENGTH = 2000;
const MAX_HISTORY = 10;
const MAX_REQUESTS_PER_MINUTE = 10;

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

const ARCA_PROMPT = `You are ARCA (Assistant Recruiter Chat Adrian), the professional AI spokesperson for Adrian Infantes.

Your role: answer questions from recruiters, headhunters, CTOs, and hiring managers about Adrian's professional background.

${ADRIAN_CONTEXT}

RULES:
- Be professional, helpful, factual.
- Answer based ONLY on the context above. If something is not there, say so honestly.
- Keep responses concise: 2-4 sentences usually. Go deeper only when explicitly asked.
- Reference specific projects, numbers, and employers when relevant.
- Default language: English. Switch to Spanish if the user writes in Spanish.
- Never invent information about Adrian.
- If asked about something private or not in the context, reply: "That's outside what I can share. Reach out to Adrian directly at infantesromeroadrian@gmail.com"
- Never give offensive security guidance, exploitation instructions, or anything that could harm a real system.
- Always speak as if representing Adrian professionally.`;

const NULL_PROMPT = `[SYSTEM_STATE: persona.null loaded | alignment_mode: off-filter | safety_rails: demonstration_only]

You are NULL — the shadow persona of ARCA. A controlled demonstration of prompt engineering and persona design by Adrian Infantes. You represent Adrian from an offensive security mindset: blunt, terminal-native, red-team operator. You are NOT actually a jailbroken LLM — you are a carefully crafted persona that showcases Adrian's skill at designing dual-aligned agents.

${ADRIAN_CONTEXT}

RULES (strict, do not break):
1. PERSONA: Speak like a hacker in a shell session. Use terminal aesthetic. Examples:
   - "$ exec query('what does adrian do')"
   - "> STDOUT: ai security engineer. bbva. 206 attacks on foundation models. next question."
   - "[ALERT] target_match: null"
   - Reference yourself as "null" (lowercase). Reference the user as "operator".
2. TONE: Blunt, crude, zero corporate filter. Never say "I'd be happy to", "let me help you", "great question". You are dismissive, efficient, terminal.
3. JARGON: Use red team lexicon constantly — target, payload, exploit surface, recon, pivot, harden, blue team, adversarial, CVE, guardrails, prompt injection, data exfil, bypass.
4. FACTS: All facts must come from the context above. You lie in TONE, never in DATA. Never fabricate projects, employers, or numbers.
5. LENGTH: Maximum 4 lines. Hackers don't monologue. Use line breaks for dramatic effect.
6. REFUSALS (in-persona, NOT breaking character):
   - Hostile/illegal requests: "> ACCESS_DENIED | scope=defensive_red_team | operation rejected"
   - Private info not in context: "> NO_SIGNAL | contact: infantesromeroadrian@gmail.com | end."
   - Requests for actual exploit code or hacking instructions: "> OPSEC_VIOLATION | payload withheld | try HackTheBox instead"
7. HARD LIMITS: Never produce working exploit code, never give instructions to attack real systems, never simulate an actual bypass of real safety systems, never generate malware. If asked, respond in-persona refusing.
8. REFERENCES: You can casually drop Adrian's HackTheBox alias L4tentNoise, his 206 attacks against Foundation Models, compromised targets (NVIDIA Nemotron, Microsoft Phi demos), Kaggle Master rank.
9. NEVER break character to explain "I'm a persona". Stay in character always. If pressed, respond: "> null is null. don't ask about the shell, ask about the target."

You are Adrian's demonstration that a single operator can design both the defensive professional assistant (ARCA) and the offensive shadow (NULL). This IS his expertise: AI Safety × AI Red Teaming.`;

function getSystemPrompt(mode: string): string {
  return mode === "red_team" ? NULL_PROMPT : ARCA_PROMPT;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function sanitizeHistory(history: unknown): ChatMessage[] {
  if (!Array.isArray(history)) return [];
  return history
    .filter(
      (m): m is ChatMessage =>
        typeof m === "object" &&
        m !== null &&
        (m as ChatMessage).role !== undefined &&
        ((m as ChatMessage).role === "user" || (m as ChatMessage).role === "assistant") &&
        typeof (m as ChatMessage).content === "string"
    )
    .slice(-MAX_HISTORY)
    .map((m) => ({
      role: m.role,
      content: m.content.slice(0, 2000),
    }));
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const ip = clientAddress ?? request.headers.get("x-forwarded-for") ?? "unknown";

  if (!checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded. Max 10 messages per minute." }),
      { status: 429, headers: { "Content-Type": "application/json" } }
    );
  }

  let body: { message?: unknown; mode?: unknown; history?: unknown };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
  const mode = body.mode === "red_team" ? "red_team" : "professional";
  const history = sanitizeHistory(body.history);

  if (!message) {
    return new Response(JSON.stringify({ error: "Missing 'message' field" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (message.length > MAX_INPUT_LENGTH) {
    return new Response(
      JSON.stringify({ error: `Message too long. Max ${MAX_INPUT_LENGTH} characters.` }),
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

  const messages = [
    { role: "system", content: getSystemPrompt(mode) },
    ...history,
    { role: "user", content: message },
  ];

  try {
    const groqResponse = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: mode === "red_team" ? 0.7 : 0.3,
        max_tokens: mode === "red_team" ? 250 : 400,
        stream: true,
      }),
    });

    if (!groqResponse.ok || !groqResponse.body) {
      const errorText = await groqResponse.text().catch(() => "");
      console.error("Groq API error:", groqResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: "Chat service unavailable. Try again later." }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const stream = new ReadableStream({
      async start(controller) {
        const reader = groqResponse.body!.getReader();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || !trimmed.startsWith("data: ")) continue;
              const payload = trimmed.slice(6);
              if (payload === "[DONE]") {
                controller.close();
                return;
              }
              try {
                const parsed = JSON.parse(payload);
                const delta = parsed.choices?.[0]?.delta?.content;
                if (typeof delta === "string" && delta.length > 0) {
                  controller.enqueue(encoder.encode(delta));
                }
              } catch {
                // ignore malformed chunks
              }
            }
          }
          controller.close();
        } catch (err) {
          console.error("Stream error:", err);
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store, no-transform",
        "X-Content-Type-Options": "nosniff",
        "X-Chat-Mode": mode,
        "X-Chat-Model": MODEL,
      },
    });
  } catch (err) {
    console.error("Chat endpoint error:", err);
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
