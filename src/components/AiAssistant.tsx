import { useEffect, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Bot, Send, X, Sparkles, Loader2 } from "lucide-react";

const SUGGESTIONS = [
  "What services do you offer?",
  "How can I hire Meerab?",
  "Show me the portfolio",
  "Pricing for a website?",
];

const WELCOME: UIMessage = {
  id: "welcome",
  role: "assistant",
  parts: [{ type: "text", text: "Hi! I'm Meera AI ✨ — ask me anything about Meerab's services, projects, or how to get started." }],
};

export function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    messages: [WELCOME],
  });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const submit = async (text?: string) => {
    const v = (text ?? input).trim();
    if (!v || busy) return;
    setInput("");
    await sendMessage({ text: v });
  };

  return (
    <>
      {/* Floating launcher */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="Open AI assistant"
        className="btn-3d fixed bottom-6 left-6 z-40 flex h-14 w-14 items-center justify-center rounded-full gradient-primary text-primary-foreground shadow-lg glow"
      >
        {open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
        {!open && (
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
          </span>
        )}
      </button>

      {open && (
        <div className="fixed bottom-24 left-6 z-40 w-[min(92vw,380px)] glass-card rounded-2xl overflow-hidden animate-fade-up flex flex-col" style={{ maxHeight: "70vh" }}>
          <div className="flex items-center gap-3 p-4 border-b border-border/50">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-display font-semibold text-sm">Meera AI</div>
              <div className="text-xs text-muted-foreground">Online • Powered by AI</div>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map(m => {
              const text = m.parts.map(p => (p.type === "text" ? p.text : "")).join("");
              const mine = m.role === "user";
              return (
                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap ${mine ? "gradient-primary text-primary-foreground" : "bg-muted/50 border border-border/50 text-foreground"}`}>
                    {text || (busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null)}
                  </div>
                </div>
              );
            })}
            {busy && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="bg-muted/50 border border-border/50 rounded-2xl px-3.5 py-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => submit(s)} className="text-xs px-2.5 py-1 rounded-full border border-border/60 hover:border-primary/50 hover:bg-primary/10 transition-colors text-muted-foreground hover:text-foreground">
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={e => { e.preventDefault(); submit(); }}
            className="p-3 border-t border-border/50 flex items-center gap-2"
          >
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-background/60 border border-border/60 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/60"
              disabled={busy}
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              className="btn-3d flex h-9 w-9 items-center justify-center rounded-lg gradient-primary text-primary-foreground disabled:opacity-50"
              aria-label="Send"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
