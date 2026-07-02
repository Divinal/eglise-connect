import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Mail, MailOpen, Trash2, Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactMessage {
  id: string;
  nom: string;
  prenom: string | null;
  paroisse: string | null;
  email: string;
  sujet: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

const AdminMessagesPage = () => {
  const { isAdminGeneral, loading } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => { if (!loading && !isAdminGeneral) navigate("/admin"); }, [loading, isAdminGeneral]);

  const fetchMessages = async () => {
    setFetching(true);
    const { data } = await (supabase as any).from("contact_messages")
      .select("*").order("created_at", { ascending: false });
    setMessages(data || []);
    setFetching(false);
  };

  useEffect(() => { fetchMessages(); }, []);

  const markAsRead = async (m: ContactMessage) => {
    if (m.is_read) return;
    setMessages(prev => prev.map(x => x.id === m.id ? { ...x, is_read: true } : x));
    await (supabase as any).from("contact_messages").update({ is_read: true }).eq("id", m.id);
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer définitivement ce message ?")) return;
    await (supabase as any).from("contact_messages").delete().eq("id", id);
    setMessages(prev => prev.filter(m => m.id !== id));
  };

  const unreadCount = messages.filter(m => !m.is_read).length;

  return (
    <Layout>
      <div className="bg-primary py-8">
        <div className="container flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}
            className="text-primary-foreground hover:bg-primary-foreground/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <p className="text-primary-foreground/60 text-xs mb-0.5">Administration générale</p>
            <h1 className="font-display text-2xl text-primary-foreground">
              Messages de contact {unreadCount > 0 && <span className="text-base font-normal text-primary-foreground/70">({unreadCount} non lu{unreadCount > 1 ? "s" : ""})</span>}
            </h1>
          </div>
        </div>
      </div>

      <section className="py-8 bg-muted/30 min-h-[60vh]">
        <div className="container max-w-3xl">
          {fetching ? (
            <p className="text-sm text-muted-foreground py-12 text-center">Chargement…</p>
          ) : messages.length === 0 ? (
            <div className="text-center py-16">
              <Inbox className="h-14 w-14 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">Aucun message reçu pour le moment à partir des Contacts.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map(m => (
                <div key={m.id}
                  onClick={() => markAsRead(m)}
                  className={`bg-card border rounded-xl p-5 cursor-pointer transition-colors ${m.is_read ? "border-border" : "border-primary/40 bg-primary/[0.03]"}`}>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    {m.is_read ? (
                      <MailOpen className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-primary text-primary-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" /> Nouveau
                      </span>
                    )}
                    <span className="font-semibold text-sm text-foreground">{m.prenom} {m.nom}</span>
                    {m.paroisse && <span className="text-xs text-muted-foreground">— {m.paroisse}</span>}
                    <span className="text-xs text-muted-foreground ml-auto">
                      {new Date(m.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  {m.sujet && <p className="text-sm font-medium text-foreground mb-1">{m.sujet}</p>}
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{m.message}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <a href={`mailto:${m.email}`} onClick={e => e.stopPropagation()}
                      className="text-xs text-primary hover:underline">{m.email}</a>
                    <Button size="sm" variant="ghost" onClick={e => { e.stopPropagation(); remove(m.id); }}
                      className="gap-1.5 text-destructive hover:bg-destructive/10 ml-auto h-7 px-2">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default AdminMessagesPage;
