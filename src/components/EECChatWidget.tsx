import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Loader2 } from "lucide-react";

const API_URL = "http://127.0.0.1:8000/chat";

type Message = { role: "user" | "ai"; text: string };

const EECChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Bonjour ! Je suis EEC IA. Posez-moi une question sur l'Église Évangélique du Congo." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const envoyer = async () => {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setMessages((m) => [...m, { role: "user", text: question }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: question }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "ai", text: data.reponse }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "ai", text: "Le serveur EEC IA ne répond pas pour le moment. Veuillez réessayer plus tard." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Panneau de chat */}
      {open && (
        <div className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden"
          style={{ height: 480 }}>
          {/* Header */}
          <div className="bg-[#1a4d2e] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-white" />
              <div>
                <p className="text-white font-semibold text-sm leading-none">EEC IA</p>
                <p className="text-white/60 text-[10px] mt-0.5">Assistant de l'Église</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)}
              className="text-white/70 hover:text-white transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-[#f5f5f0]">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "ai" && (
                  <div className="w-6 h-6 rounded-full bg-[#1a4d2e] flex items-center justify-center shrink-0 mt-0.5 mr-2">
                    <Bot className="h-3.5 w-3.5 text-white" />
                  </div>
                )}
                <span className={`inline-block px-3 py-2 rounded-2xl text-sm max-w-[75%] leading-relaxed ${
                  m.role === "user"
                    ? "bg-[#1a4d2e] text-white rounded-br-sm"
                    : "bg-white text-foreground rounded-bl-sm shadow-sm"
                }`}>
                  {m.text}
                </span>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-[#1a4d2e] flex items-center justify-center shrink-0 mr-2">
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
                <span className="inline-flex items-center gap-1.5 bg-white px-3 py-2 rounded-2xl rounded-bl-sm shadow-sm text-sm text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" /> Réflexion…
                </span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border bg-white flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && envoyer()}
              placeholder="Votre question…"
              className="flex-1 text-sm px-3 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-[#1a4d2e]/30 bg-background"
            />
            <button
              onClick={envoyer}
              disabled={loading || !input.trim()}
              className="p-2 rounded-lg bg-[#1a4d2e] text-white hover:bg-[#1a4d2e]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Bouton flottant */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 bg-[#1a4d2e] hover:bg-[#1a4d2e]/90 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all active:scale-95"
      >
        {open ? <X className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        <span className="text-sm font-semibold">EEC IA</span>
      </button>
    </div>
  );
};

export default EECChatWidget;
