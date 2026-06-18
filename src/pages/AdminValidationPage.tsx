import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Check, X, Pencil, Save, Trash2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const ENTITY_TABLES: Record<string, { table: string; nameField: string }> = {
  consistoire: { table: "consistoires", nameField: "name" },
  paroisse: { table: "paroisses", nameField: "name" },
  diaspora: { table: "diaspora", nameField: "name" },
  champs_mission: { table: "champs_mission", nameField: "name" },
  champs_evangelisation: { table: "champs_evangelisation", nameField: "name" },
  departement: { table: "departments", nameField: "name" },
};

const STATIC_LABELS: Record<string, string> = {
  pastorale: "Pastorale", upb: "UPB", ifpn: "IFPN", sueco: "SUECO",
};

const ENTITY_TYPE_LABELS: Record<string, string> = {
  consistoire: "Consistoire", paroisse: "Paroisse", diaspora: "Diaspora",
  champs_mission: "Champ de Mission", champs_evangelisation: "Champ d'Évangélisation",
  departement: "Département", pastorale: "Pastorale", upb: "UPB", ifpn: "IFPN", sueco: "SUECO",
};

const AdminValidationPage = () => {
  const { isAdminGeneral, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [annonces, setAnnonces] = useState<any[]>([]);
  const [entityNames, setEntityNames] = useState<Record<string, string>>({});
  const [fetching, setFetching] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: "", content: "" });

  useEffect(() => { if (!loading && !isAdminGeneral) navigate("/admin"); }, [loading, isAdminGeneral]);

  const fetchPending = async () => {
    setFetching(true);
    const { data } = await supabase.from("announcements")
      .select("*").eq("status", "pending")
      .order("created_at", { ascending: false });
    setAnnonces(data || []);

    const byType: Record<string, Set<string>> = {};
    (data || []).forEach((a: any) => {
      if (!ENTITY_TABLES[a.entity_type]) return;
      byType[a.entity_type] = byType[a.entity_type] || new Set();
      byType[a.entity_type].add(a.entity_id);
    });
    const names: Record<string, string> = {};
    for (const [type, ids] of Object.entries(byType)) {
      const { table, nameField } = ENTITY_TABLES[type];
      const { data: rows } = await (supabase as any).from(table).select(`id, ${nameField}`).in("id", Array.from(ids));
      (rows || []).forEach((r: any) => { names[`${type}:${r.id}`] = r[nameField]; });
    }
    setEntityNames(names);
    setFetching(false);
  };

  useEffect(() => { fetchPending(); }, []);

  const getEntityLabel = (a: any) => {
    if (STATIC_LABELS[a.entity_type]) return STATIC_LABELS[a.entity_type];
    return entityNames[`${a.entity_type}:${a.entity_id}`] || "—";
  };

  const startEdit = (a: any) => {
    setEditingId(a.id);
    setEditForm({ title: a.title, content: a.content || "" });
  };

  const saveEdit = async (id: string) => {
    const { error } = await supabase.from("announcements")
      .update({ title: editForm.title, content: editForm.content || null } as any).eq("id", id);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Annonce modifiée" });
    setEditingId(null); fetchPending();
  };

  const approve = async (id: string) => {
    const { error } = await supabase.from("announcements").update({ status: "approved" } as any).eq("id", id);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Annonce validée et publiée !" });
    fetchPending();
  };

  const reject = async (id: string) => {
    const reason = window.prompt("Motif du rejet (optionnel) :") || null;
    const { error } = await supabase.from("announcements")
      .update({ status: "rejected", rejection_reason: reason } as any).eq("id", id);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Annonce rejetée" });
    fetchPending();
  };

  const remove = async (id: string, image_url?: string) => {
    if (!confirm("Supprimer définitivement cette annonce ?")) return;
    if (image_url) {
      const path = image_url.split("/media/")[1];
      if (path) await supabase.storage.from("media").remove([path]);
    }
    await supabase.from("announcements").delete().eq("id", id);
    toast({ title: "Annonce supprimée" });
    fetchPending();
  };

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
            <h1 className="font-display text-2xl text-primary-foreground">Validation des publications</h1>
          </div>
        </div>
      </div>

      <section className="py-8 bg-muted/30 min-h-[60vh]">
        <div className="container max-w-3xl">
          {fetching ? (
            <p className="text-sm text-muted-foreground py-12 text-center">Chargement…</p>
          ) : annonces.length === 0 ? (
            <div className="text-center py-16">
              <Check className="h-14 w-14 text-emerald-300 mx-auto mb-3" />
              <p className="text-muted-foreground">Aucune publication en attente de validation.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {annonces.map(a => (
                <div key={a.id} className="bg-card border border-border rounded-xl overflow-hidden">
                  {a.image_url && <img src={a.image_url} alt={a.title} className="w-full h-44 object-cover" />}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-amber-100 text-amber-700 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> En attente
                      </span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-muted text-muted-foreground">
                        {ENTITY_TYPE_LABELS[a.entity_type] || a.entity_type}
                      </span>
                      <span className="text-xs font-medium text-foreground">{getEntityLabel(a)}</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        {new Date(a.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                    </div>

                    {editingId === a.id ? (
                      <div className="space-y-2 mb-3">
                        <Input value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} className="h-9 text-sm font-medium" />
                        <Textarea value={editForm.content} onChange={e => setEditForm({ ...editForm, content: e.target.value })} rows={3} className="text-sm" />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => saveEdit(a.id)} className="gap-1.5"><Save className="h-3.5 w-3.5" />Enregistrer</Button>
                          <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Annuler</Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="font-semibold text-base text-foreground">{a.title}</p>
                        {a.content && <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{a.content}</p>}
                      </>
                    )}

                    {editingId !== a.id && (
                      <div className="flex gap-2 mt-4 flex-wrap">
                        <Button size="sm" onClick={() => approve(a.id)} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700">
                          <Check className="h-3.5 w-3.5" /> Valider & publier
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => startEdit(a)} className="gap-1.5">
                          <Pencil className="h-3.5 w-3.5" /> Modifier
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => reject(a.id)} className="gap-1.5 text-amber-700 border-amber-200 hover:bg-amber-50">
                          <X className="h-3.5 w-3.5" /> Rejeter
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => remove(a.id, a.image_url)} className="gap-1.5 text-destructive hover:bg-destructive/10 ml-auto">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
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

export default AdminValidationPage;
