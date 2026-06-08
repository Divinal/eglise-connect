import { useState } from "react";

const API_URL = "http://127.0.0.1:8000/chat";

type Message = { role: "user" | "ai"; text: string };

export default function EECChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", text: "Bonjour ! Je suis EEC AI. Posez-moi une question sur l'Église." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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
        { role: "ai", text: "Erreur : le serveur EEC AI ne répond pas. Vérifiez qu'il est démarré." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif", padding: 16 }}>
      <h2 style={{ textAlign: "center", color: "#1a4d2e" }}>EEC AI 🙏</h2>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 12,
          padding: 16,
          height: 400,
          overflowY: "auto",
          background: "#f9f9f9",
        }}
      >
        {messages.map((m, i) => (
          <div key={i} style={{ textAlign: m.role === "user" ? "right" : "left", margin: "8px 0" }}>
            <span
              style={{
                display: "inline-block",
                padding: "10px 14px",
                borderRadius: 16,
                background: m.role === "user" ? "#1a4d2e" : "#e0e0e0",
                color: m.role === "user" ? "white" : "black",
                maxWidth: "80%",
                whiteSpace: "pre-wrap",
              }}
            >
              {m.text}
            </span>
          </div>
        ))}
        {loading && <p style={{ color: "#888" }}>EEC AI réfléchit…</p>}
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && envoyer()}
          placeholder="Posez votre question…"
          style={{ flex: 1, padding: 12, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <button
          onClick={envoyer}
          disabled={loading}
          style={{
            padding: "12px 20px",
            borderRadius: 8,
            border: "none",
            background: "#1a4d2e",
            color: "white",
            cursor: "pointer",
          }}
        >
          Envoyer
        </button>
      </div>
    </div>
  );
}