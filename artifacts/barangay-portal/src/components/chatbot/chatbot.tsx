import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const BASE = import.meta.env.BASE_URL.replace(/\/$/, "");
const API = `${BASE}/api`;

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hi! I'm your Barangay Assistant. Ask me anything about document requirements, processes, registration, blotter filing, or any barangay services. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function ensureConversation(): Promise<number> {
    if (conversationId) return conversationId;
    const res = await fetch(`${API}/openai/conversations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Barangay Assistant Chat" }),
    });
    const data = await res.json();
    setConversationId(data.id);
    return data.id;
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    const assistantId = (Date.now() + 1).toString();
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

    try {
      const convId = await ensureConversation();

      const response = await fetch(`${API}/openai/conversations/${convId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const json = JSON.parse(line.slice(6));
              if (json.content) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: m.content + json.content } : m
                  )
                );
              }
            } catch {}
          }
        }
      }
    } catch (error) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "Sorry, I couldn't connect to the server. Please try again." }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content:
          "Hi! I'm your Barangay Assistant. Ask me anything about document requirements, processes, registration, blotter filing, or any barangay services. How can I help you today?",
      },
    ]);
    setConversationId(null);
  }

  return (
    <>
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300",
          "bg-green-700 hover:bg-green-800 text-white",
          open && "rotate-90"
        )}
        aria-label="Toggle assistant"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      <div
        className={cn(
          "fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-24px)] rounded-2xl shadow-2xl flex flex-col bg-white border border-border overflow-hidden transition-all duration-300 origin-bottom-right",
          open ? "scale-100 opacity-100 pointer-events-auto" : "scale-90 opacity-0 pointer-events-none"
        )}
        style={{ height: "480px" }}
      >
        <div className="flex items-center gap-3 px-4 py-3 bg-green-700 text-white shrink-0">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm">Barangay Assistant</p>
            <p className="text-xs text-green-100">Ask me about processes & requirements</p>
          </div>
          <button
            onClick={clearChat}
            className="p-1.5 rounded-lg hover:bg-white/10 transition text-green-100 hover:text-white"
            title="Clear chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-2 items-start",
                msg.role === "user" && "flex-row-reverse"
              )}
            >
              <div
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                  msg.role === "assistant" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                )}
              >
                {msg.role === "assistant" ? (
                  <Bot className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed",
                  msg.role === "assistant"
                    ? "bg-gray-100 text-gray-800 rounded-tl-sm"
                    : "bg-green-700 text-white rounded-tr-sm"
                )}
              >
                {msg.content || (
                  <span className="flex items-center gap-1 text-gray-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Thinking...
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border px-3 py-2 shrink-0 bg-gray-50">
          <div className="flex gap-2 items-center">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
              placeholder="Ask about requirements, process..."
              className="flex-1 text-sm h-9 bg-white"
              disabled={loading}
            />
            <Button
              size="icon"
              className="h-9 w-9 bg-green-700 hover:bg-green-800 shrink-0"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-1">
            AI-powered • May make mistakes • Official info from barangay hall
          </p>
        </div>
      </div>
    </>
  );
}
