import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ShoppingBag, Heart, Plus, Trash2, Pencil, Save, X, ImagePlus, CheckCircle2, Clock, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type Tab = "produits" | "commandes" | "dons";

const STATUT_DON = ["en_attente", "reçu", "traité"];
const STATUT_CMD = ["en_attente", "confirmé", "livré"];

const BADGE = (s: string) => {
  const map: Record<string, string> = {
    en_attente: "bg-amber-100 text-amber-700",
    reçu: "bg-blue-100 text-blue-700",
    traité: "bg-green-100 text-green-700",
    confirmé: "bg-blue-100 text-blue-700",
    livré: "bg-green-100 text-green-700",
  };
  return map[s] || "bg-gray-100 text-gray-700";
};

const AdminBoutiquePage = () => {
  const { isAdminGeneral, hasRole, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState<Tab>("produits");

  // Produits
  const [produits, setProduits] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [prodForm, setProdForm] = useState({ nom: "", categorie: "", sous_categorie: "", description: "", prix: "", image_url: "", disponible: true });
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Commandes & Dons
  const [commandes, setCommandes] = useState<any[]>([]);
  const [dons, setDons] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !isAdminGeneral && !hasRole("admin_boutique")) navigate("/admin");
  }, [loading, isAdminGeneral]);

  const fetchProduits = async () => {
    const { data } = await (supabase as any).from("produits").select("*").order("categorie").order("nom");
    setProduits(data || []);
  };
  const fetchCommandes = async () => {
    const { data } = await (supabase as any).from("commandes").select("*").order("created_at", { ascending: false });
    setCommandes(data || []);
  };
  const fetchDons = async () => {
    const { data } = await (supabase as any).from("dons").select("*").order("created_at", { ascending: false });
    setDons(data || []);
  };

  useEffect(() => { fetchProduits(); fetchCommandes(); fetchDons(); }, []);

  const setProd = (k: string, v: any) => setProdForm(f => ({ ...f, [k]: v }));

  const resetForm = () => { setShowForm(false); setEditId(null); setProdForm({ nom:"", categorie:"", sous_categorie:"", description:"", prix:"", image_url:"", disponible:true }); };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast({ title: "Image trop grande", description: "Max 5 MB", variant: "destructive" }); return; }
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `produits/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("media").upload(path, file, { upsert: true });
    if (error) { toast({ title: "Erreur upload", description: error.message, variant: "destructive" }); setUploading(false); return; }
    const { data: urlData } = supabase.storage.from("media").getPublicUrl(path);
    setProd("image_url", urlData.publicUrl);
    setUploading(false);
  };

  const saveProduit = async () => {
    if (!prodForm.nom || !prodForm.categorie) { toast({ title: "Nom et catégorie requis", variant: "destructive" }); return; }
    const payload = { nom: prodForm.nom, categorie: prodForm.categorie, sous_categorie: prodForm.sous_categorie || null, description: prodForm.description || null, prix: parseFloat(prodForm.prix) || 0, image_url: prodForm.image_url || null, disponible: prodForm.disponible };
    if (editId) {
      const { error } = await (supabase as any).from("produits").update(payload).eq("id", editId);
      if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Produit mis à jour" });
    } else {
      const { error } = await (supabase as any).from("produits").insert(payload);
      if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Produit ajouté !" });
    }
    resetForm(); fetchProduits();
  };

  const deleteProduit = async (id: string) => {
    await (supabase as any).from("produits").delete().eq("id", id);
    toast({ title: "Produit supprimé" }); fetchProduits();
  };

  const startEdit = (p: any) => {
    setEditId(p.id);
    setProdForm({ nom: p.nom, categorie: p.categorie, sous_categorie: p.sous_categorie || "", description: p.description || "", prix: p.prix?.toString() || "", image_url: p.image_url || "", disponible: p.disponible });
    setShowForm(true);
  };

  const updateStatutCmd = async (id: string, statut: string) => {
    await (supabase as any).from("commandes").update({ statut }).eq("id", id);
    fetchCommandes();
  };
  const updateStatutDon = async (id: string, statut: string) => {
    await (supabase as any).from("dons").update({ statut }).eq("id", id);
    fetchDons();
  };
  const deleteCmd = async (id: string) => { await (supabase as any).from("commandes").delete().eq("id", id); fetchCommandes(); };
  const deleteDon = async (id: string) => { await (supabase as any).from("dons").delete().eq("id", id); fetchDons(); };

  const enAttenteDons = dons.filter(d => d.statut === "en_attente").length;
  const enAttenteCmd = commandes.filter(c => c.statut === "en_attente").length;

  return (
    <Layout>
      <div className="bg-primary py-8">
        <div className="container flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin")} className="text-primary-foreground hover:bg-primary-foreground/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <p className="text-primary-foreground/60 text-xs mb-0.5">Administration</p>
            <h1 className="font-display text-2xl text-primary-foreground">Boutique & Dons</h1>
          </div>
          {enAttenteCmd + enAttenteDons > 0 && (
            <div className="bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              {enAttenteCmd + enAttenteDons} en attente
            </div>
          )}
        </div>
      </div>

      <section className="py-8 bg-muted/30 min-h-[60vh]">
        <div className="container max-w-5xl">
          {/* Onglets */}
          <div className="flex gap-1 bg-card border border-border rounded-xl p-1 mb-6 overflow-x-auto">
            {[
              { key: "produits",  label: "Produits",   icon: ShoppingBag, badge: 0 },
              { key: "commandes", label: "Commandes",  icon: Package,     badge: enAttenteCmd },
              { key: "dons",      label: "Dons reçus", icon: Heart,       badge: enAttenteDons },
            ].map(t => (
              <button key={t.key} onClick={() => setTab(t.key as Tab)}
                className={`relative flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${tab === t.key ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
                <t.icon className="h-4 w-4" />
                {t.label}
                {t.badge > 0 && <span className="ml-1 bg-amber-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{t.badge}</span>}
              </button>
            ))}
          </div>

          {/* ── PRODUITS ── */}
          {tab === "produits" && (
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold">Catalogue des articles</h2>
                <Button size="sm" onClick={() => { resetForm(); setShowForm(!showForm); }} className="gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> Ajouter un article
                </Button>
              </div>

              {showForm && (
                <div className="bg-muted/30 border border-border rounded-xl p-5 mb-5">
                  <h3 className="font-medium text-sm mb-4">{editId ? "Modifier l'article" : "Nouvel article"}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Nom *</Label>
                      <Input value={prodForm.nom} onChange={e => setProd("nom", e.target.value)} className="h-9 text-sm" placeholder="Ex: Bible en Lingala" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Catégorie *</Label>
                      <Select value={prodForm.categorie} onValueChange={v => setProd("categorie", v)}>
                        <SelectTrigger className="h-9 text-sm"><SelectValue placeholder="Choisir…" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="livre">Livre</SelectItem>
                          <SelectItem value="pagne">Pagne</SelectItem>
                          <SelectItem value="medaille">Médaille</SelectItem>
                          <SelectItem value="carte">Carte</SelectItem>
                          <SelectItem value="autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Sous-catégorie</Label>
                      <Input value={prodForm.sous_categorie} onChange={e => setProd("sous_categorie", e.target.value)} className="h-9 text-sm" placeholder="Ex: Bible, KOLO, Diacre…" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Prix (FCFA)</Label>
                      <Input type="number" value={prodForm.prix} onChange={e => setProd("prix", e.target.value)} className="h-9 text-sm" placeholder="0 = Prix sur demande" />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label className="text-xs">Description</Label>
                      <Textarea value={prodForm.description} onChange={e => setProd("description", e.target.value)} rows={2} className="text-sm" />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                      <Label className="text-xs">Image (optionnel)</Label>
                      <div className="flex items-center gap-3">
                        {prodForm.image_url
                          ? <div className="relative"><img src={prodForm.image_url} className="h-16 w-16 rounded-lg object-cover border" alt="" /><button onClick={() => setProd("image_url", "")} className="absolute -top-1.5 -right-1.5 bg-destructive text-white rounded-full p-0.5"><X className="h-3 w-3" /></button></div>
                          : <button onClick={() => fileRef.current?.click()} className="h-16 w-16 rounded-lg border-2 border-dashed flex items-center justify-center hover:bg-muted/50 transition-colors">
                              {uploading ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-primary border-t-transparent" /> : <ImagePlus className="h-6 w-6 text-muted-foreground/50" />}
                            </button>}
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        <Input value={prodForm.image_url} onChange={e => setProd("image_url", e.target.value)} className="h-9 text-sm flex-1" placeholder="Ou collez une URL d'image" />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="dispo" checked={prodForm.disponible} onChange={e => setProd("disponible", e.target.checked)} className="rounded" />
                      <Label htmlFor="dispo" className="text-xs">Article disponible</Label>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" onClick={saveProduit} className="gap-1.5"><Save className="h-3.5 w-3.5" />{editId ? "Mettre à jour" : "Ajouter"}</Button>
                    <Button size="sm" variant="outline" onClick={resetForm}>Annuler</Button>
                  </div>
                </div>
              )}

              {produits.length === 0 ? (
                <p className="text-center text-muted-foreground py-10 text-sm">Aucun article dans le catalogue. Ajoutez votre premier article.</p>
              ) : (
                <div className="divide-y divide-border">
                  {produits.map(p => (
                    <div key={p.id} className="flex items-center gap-4 py-3">
                      <div className="w-12 h-12 rounded-lg bg-muted/30 flex items-center justify-center shrink-0 overflow-hidden">
                        {p.image_url ? <img src={p.image_url} className="w-full h-full object-cover" alt="" /> : <ShoppingBag className="h-5 w-5 text-muted-foreground/40" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">{p.nom}</p>
                        <p className="text-xs text-muted-foreground">{p.categorie}{p.sous_categorie ? ` · ${p.sous_categorie}` : ""} · {p.prix > 0 ? `${p.prix.toLocaleString()} FCFA` : "Prix sur demande"}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${p.disponible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {p.disponible ? "Disponible" : "Indisponible"}
                      </span>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => startEdit(p)} className="h-8 w-8"><Pencil className="h-3.5 w-3.5 text-primary" /></Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteProduit(p.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── COMMANDES ── */}
          {tab === "commandes" && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold mb-5">Commandes reçues ({commandes.length})</h2>
              {commandes.length === 0 ? (
                <p className="text-center text-muted-foreground py-10 text-sm">Aucune commande pour le moment.</p>
              ) : (
                <div className="space-y-4">
                  {commandes.map(c => (
                    <div key={c.id} className="border border-border rounded-xl p-4">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <p className="font-semibold text-sm">{c.produit_nom} <span className="text-muted-foreground font-normal">× {c.quantite}</span></p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {c.acheteur_nom || "Anonyme"} · {c.acheteur_contact || "—"} · {c.acheteur_localite || "—"}
                          </p>
                          {c.message && <p className="text-xs text-muted-foreground italic mt-1">"{c.message}"</p>}
                          <p className="text-xs text-muted-foreground mt-1">{new Date(c.created_at).toLocaleDateString("fr-FR", { day:"numeric",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit" })}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${BADGE(c.statut)}`}>{c.statut}</span>
                          <Select value={c.statut} onValueChange={v => updateStatutCmd(c.id, v)}>
                            <SelectTrigger className="h-8 text-xs w-32"><SelectValue /></SelectTrigger>
                            <SelectContent>{STATUT_CMD.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                          </Select>
                          <Button variant="ghost" size="icon" onClick={() => deleteCmd(c.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── DONS ── */}
          {tab === "dons" && (
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-semibold mb-5">Dons enregistrés ({dons.length})</h2>
              {dons.length === 0 ? (
                <p className="text-center text-muted-foreground py-10 text-sm">Aucun don enregistré pour le moment.</p>
              ) : (
                <div className="space-y-4">
                  {dons.map(d => (
                    <div key={d.id} className="border border-border rounded-xl p-4">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${d.type_don === "espece" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                              {d.type_don === "espece" ? "💵 Espèce" : "📦 Nature"}
                            </span>
                            <span className="text-xs text-muted-foreground">{d.categorie}</span>
                          </div>
                          {d.montant && <p className="font-bold text-primary">{d.montant.toLocaleString()} FCFA</p>}
                          {d.nature_description && <p className="text-sm text-foreground">{d.nature_description}</p>}
                          <p className="text-xs text-muted-foreground mt-1">
                            Dest. : {d.destinataire}{d.destinataire_detail ? ` (${d.destinataire_detail})` : ""}
                          </p>
                          {d.lieu_depot_nom && <p className="text-xs text-muted-foreground">Lieu : {d.lieu_depot_nom}</p>}
                          <p className="text-xs text-muted-foreground mt-0.5">
                            De : {d.is_anonymous ? "Anonyme" : (d.donateur_nom || "Non précisé")} · {new Date(d.created_at).toLocaleDateString("fr-FR")}
                          </p>
                          {d.message && <p className="text-xs text-muted-foreground italic mt-1">"{d.message}"</p>}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${BADGE(d.statut)}`}>{d.statut}</span>
                          <Select value={d.statut} onValueChange={v => updateStatutDon(d.id, v)}>
                            <SelectTrigger className="h-8 text-xs w-32"><SelectValue /></SelectTrigger>
                            <SelectContent>{STATUT_DON.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                          </Select>
                          <Button variant="ghost" size="icon" onClick={() => deleteDon(d.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default AdminBoutiquePage;
