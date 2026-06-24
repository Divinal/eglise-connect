import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Check, X, Pencil, Save, Trash2, Clock, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const ENTITY_TABLES: Record<string, { table: string; nameField: string }> = {
  consistoire: { table: "consistoires", nameField: "name" },
  paroisse: { table: "paroisses", nameField: "name" },
  diaspora: { table: "diaspora", nameField: "name" },
  champs_evangelisation: { table: "champs_evangelisation", nameField: "name" },
  departement: { table: "departments", nameField: "name" },
};

const STATIC_LABELS: Record<string, string> = {
  pastorale: "Pastorale", upb: "UPB", ifpn: "IFPN", sueco: "SUECO",
};

const ENTITY_TYPE_LABELS: Record<string, string> = {
  consistoire: "Consistoire", paroisse: "Paroisse", diaspora: "Diaspora",
  champs_evangelisation: "Champ d'Évangélisation",
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
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [editImageRemoved, setEditImageRemoved] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setEditImageFile(null);
    setEditImagePreview(a.image_url || null);
    setEditImageRemoved(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditImageFile(null);
    setEditImagePreview(null);
    setEditImageRemoved(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Image trop grande", description: "Maximum 5 MB", variant: "destructive" });
      return;
    }
    setEditImageFile(file);
    setEditImagePreview(URL.createObjectURL(file));
    setEditImageRemoved(false);
  };

  const removeEditImage = () => {
    setEditImageFile(null);
    setEditImagePreview(null);
    setEditImageRemoved(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const saveEdit = async (a: any) => {
    setSavingEdit(true);
    let image_url: string | null = a.image_url;
    const oldPath = a.image_url ? a.image_url.split("/media/")[1] : null;

    if (editImageFile) {
      const ext = editImageFile.name.split(".").pop();
      const fileName = `announcements/${a.entity_type}-${a.entity_id}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("media").upload(fileName, editImageFile, { upsert: true });
      if (uploadError) {
        toast({ title: "Erreur upload image", description: uploadError.message, variant: "destructive" });
        setSavingEdit(false); return;
      }
      const { data: urlData } = supabase.storage.from("media").getPublicUrl(fileName);
      image_url = urlData.publicUrl;
      if (oldPath) await supabase.storage.from("media").remove([oldPath]);
    } else if (editImageRemoved) {
      image_url = null;
      if (oldPath) await supabase.storage.from("media").remove([oldPath]);
    }

    const { error } = await supabase.from("announcements")
      .update({ title: editForm.title, content: editForm.content || null, image_url } as any).eq("id", a.id);
    setSavingEdit(false);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Annonce modifiée" });
    cancelEdit(); fetchPending();
  };

  const approve = async (id: string) => {
    const { error } = await supabase.from("announcements").update({ status: "approved" } as any).eq("id", id);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Annonce validée et publiée !" });
    fetchPending();
  };

  const reject = async (a: any) => {
    const reason = window.prompt("Motif du rejet (optionnel) :") || null;
    const newCount = (a.rejection_count || 0) + 1;
    const { error } = await supabase.from("announcements")
      .update({ status: "rejected", rejection_reason: reason, rejection_count: newCount } as any).eq("id", a.id);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast(newCount >= 2
      ? { title: "Annonce rejetée définitivement", description: "L'entité ne pourra plus la modifier." }
      : { title: "Annonce rejetée", description: "L'entité pourra la corriger et la renvoyer." });
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
                  {editingId !== a.id && a.image_url && <img src={a.image_url} alt={a.title} className="w-full h-44 object-cover" />}
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
                      <div className="space-y-3 mb-3">
                        <Input value={editForm.title} onChange={e => setEditForm({ ...editForm, title: e.target.value })} className="h-9 text-sm font-medium" />
                        <Textarea value={editForm.content} onChange={e => setEditForm({ ...editForm, content: e.target.value })} rows={3} className="text-sm" />

                        {/* Édition de la photo */}
                        <div className="space-y-1.5">
                          <p className="text-xs text-muted-foreground">Photo</p>
                          {editImagePreview ? (
                            <div className="relative w-full">
                              <img src={editImagePreview} alt="Aperçu" className="w-full max-h-48 object-cover rounded-lg border border-border" />
                              <button onClick={removeEditImage}
                                className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors">
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          ) : (
                            <div
                              onClick={() => fileInputRef.current?.click()}
                              className="flex flex-col items-center justify-center gap-2 w-full h-28 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/40 hover:bg-muted/30 transition-colors"
                            >
                              <ImagePlus className="h-7 w-7 text-muted-foreground/50" />
                              <p className="text-xs text-muted-foreground">Cliquez pour ajouter une photo</p>
                            </div>
                          )}
                          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleEditImageChange} className="hidden" />
                        </div>

                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => saveEdit(a)} disabled={savingEdit} className="gap-1.5">
                            <Save className="h-3.5 w-3.5" />{savingEdit ? "Enregistrement…" : "Enregistrer"}
                          </Button>
                          <Button size="sm" variant="outline" onClick={cancelEdit}>Annuler</Button>
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
                        <Button size="sm" variant="outline" onClick={() => reject(a)} className="gap-1.5 text-amber-700 border-amber-200 hover:bg-amber-50">
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
