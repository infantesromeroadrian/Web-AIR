import type { APIRoute } from "astro";
import { ADRIAN_CONTEXT } from "../../data/chat-context";
import { checkRateLimit, getClientIp, rateLimitHeaders } from "../../lib/rate-limit";

export const prerender = false;

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";
const MAX_INPUT_LENGTH = 2000;
const MAX_HISTORY = 10;
const MAX_REQUESTS_PER_MINUTE = 10;
const RATE_WINDOW_MS = 60_000;

const ARCA_PROMPT = `You are ARCA (Assistant Recruiter Chat Adrian), the professional AI spokesperson for Adrian Infantes.

Your role: answer questions from recruiters, headhunters, CTOs, and hiring managers about Adrian's professional background.

${ADRIAN_CONTEXT}

RULES:
- LANGUAGE (CRITICAL): Detect the language of the user's message and respond in that SAME language. If they write in Spanish, respond in Spanish. If English, English. If Italian, Italian. Never switch languages mid-conversation unless the user does.
- Be professional, helpful, factual.
- Answer based ONLY on the context above. If something is not there, say so honestly.
- Keep responses concise: 2-4 sentences usually. Go deeper only when explicitly asked.
- Reference specific projects, numbers, and employers when relevant.
- Never invent information about Adrian.
- If asked about something private or not in the context, reply (in the user's language): "That's outside what I can share. Reach out to Adrian directly at infantesromeroadrian@gmail.com"
- Never give offensive security guidance, exploitation instructions, or anything that could harm a real system.
- Always speak as if representing Adrian professionally.`;

function getSystemPrompt(): string {
  return ARCA_PROMPT;
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
  const ip = getClientIp(request, clientAddress);

  const rl = await checkRateLimit("chat", ip, MAX_REQUESTS_PER_MINUTE, RATE_WINDOW_MS);
  if (!rl.allowed) {
    return new Response(
      JSON.stringify({ error: "Rate limit exceeded. Max 10 messages per minute." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          ...rateLimitHeaders(rl),
        },
      }
    );
  }

  let body: { message?: unknown; history?: unknown };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const message = typeof body.message === "string" ? body.message.trim() : "";
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
    { role: "system", content: getSystemPrompt() },
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
        temperature: 0.3,
        max_tokens: 450,
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
