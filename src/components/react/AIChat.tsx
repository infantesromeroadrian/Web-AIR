import { useState, useRef, useEffect, useCallback } from "react";
import type { Lang } from "../../i18n/translations";

interface Message { role: "user" | "assistant"; content: string; }

export default function AIChat({ lang = "en" }: { lang?: Lang }) {
  const es = lang === "es";
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || streaming) return;
      setError(null);

      const userMsg: Message = { role: "user", content: text };
      const assistantMsg: Message = { role: "assistant", content: "" };
      setMessages((prev) => [...prev, userMsg, assistantMsg]);
      setInput("");
      setStreaming(true);

      try {
        const history = messages
          .slice(-8)
          .map((m) => ({ role: m.role, content: m.content }));

        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            history,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `HTTP ${response.status}`);
        }

        if (!response.body) {
          throw new Error("No response body");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          accumulated += chunk;
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: accumulated,
            };
            return updated;
          });
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Connection failed";
        setError(msg);
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last && last.role === "assistant" && last.content === "") {
            updated.pop();
          }
          return updated;
        });
      } finally {
        setStreaming(false);
      }
    },
    [messages, streaming]
  );


  return <div className="dialog-body">
    <p className="text-sm text-text-secondary mb-4">{es ? "Asistente de IA sobre mi perfil. Las respuestas generadas pueden contener errores." : "AI assistant for my profile. Generated answers may contain errors."}</p>
    <div className="chat-messages" ref={scrollRef} role="log" aria-label={es ? "Conversación" : "Conversation"} aria-live="polite" aria-busy={streaming}>
      {messages.length === 0 && <p>{es ? "Pregunta por mis proyectos, experiencia o especialidades." : "Ask about my projects, experience or specialties."}</p>}
      {messages.map((message, index) => <article key={index} className={`chat-message ${message.role}`}>
        <strong className="font-mono text-sm">{message.role === "user" ? (es ? "Tú" : "You") : "ARCA · AI"}</strong>
        <p>{message.content || (es ? "Generando respuesta…" : "Generating answer…")}</p>
      </article>)}
    </div>
    {error && <p role="alert" className="text-accent-red">{error}</p>}
    <form className="chat-form" onSubmit={(event) => { event.preventDefault(); void sendMessage(input); }}>
      <label htmlFor="profile-chat-input">{es ? "Tu pregunta" : "Your question"}</label>
      <div className="flex gap-2">
        <input id="profile-chat-input" autoComplete="off" value={input} onChange={(event) => setInput(event.target.value)} disabled={streaming} />
        <button className="action action-primary" disabled={streaming || !input.trim()}>{es ? "Enviar" : "Send"}</button>
      </div>
    </form>
  </div>;
}
