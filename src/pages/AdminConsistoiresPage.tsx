import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Church, ArrowLeft, Plus, Pencil, Save, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Consistoire {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  ville: string | null;
  responsable: string | null;
  telephone: string | null;
  email: string | null;
  is_active: boolean;
}

const emptyForm = {
  name: "", slug: "", description: "", ville: "",
  responsable: "", telephone: "", email: "",
};

const toSlug = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const AdminConsistoiresPage = () => {
  const { isAdminGeneral, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [consistoires, setConsistoires] = useState<Consistoire[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!loading && !isAdminGeneral) navigate("/admin");
  }, [loading, isAdminGeneral, navigate]);

  const fetchConsistoires = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from("consistoires").select("*").order("name");
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else setConsistoires((data || []) as any as Consistoire[]);
    setFetching(false);
  };

  useEffect(() => { fetchConsistoires(); }, []);

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({ title: "Nom requis", variant: "destructive" }); return;
    }
    const slug = form.slug || toSlug(form.name);
    const payload = { ...form, slug, description: form.description || null, ville: form.ville || null, responsable: form.responsable || null, telephone: form.telephone || null, email: form.email || null };

    if (editingId) {
      const { error } = await supabase.from("consistoires").update(payload).eq("id", editingId);
      if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Consistoire mis à jour" });
    } else {
      const { error } = await supabase.from("consistoires").insert(payload);
      if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Consistoire créé !" });
    }
    setForm(emptyForm); setShowForm(false); setEditingId(null);
    fetchConsistoires();
  };

  const startEdit = (c: Consistoire) => {
    setEditingId(c.id);
    setForm({ name: c.name, slug: c.slug, description: c.description || "", ville: c.ville || "", responsable: c.responsable || "", telephone: c.telephone || "", email: c.email || "" });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleActive = async (c: Consistoire) => {
    await (supabase.from("consistoires") as any).update({ is_active: !c.is_active }).eq("id", c.id);
    fetchConsistoires();
  };

  return (
    <Layout>
      <div className="bg-primary py-8">
        <div className="container flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}
            className="text-primary-foreground hover:bg-primary-foreground/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-display text-2xl text-primary-foreground">Consistoires</h1>
            <p className="text-primary-foreground/70 text-sm mt-0.5">Gérer les consistoires de l'EEC</p>
          </div>
          <Button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
            className="gap-2 bg-gold text-navy-dark hover:bg-gold-dark">
            <Plus className="h-4 w-4" /> Nouveau consistoire
          </Button>
        </div>
      </div>

      <section className="py-8 bg-muted/30 min-h-[60vh]">
        <div className="container max-w-4xl">

          {/* Formulaire */}
          {showForm && (
            <div className="bg-card border border-border rounded-xl p-6 mb-6 shadow-sm">
              <h2 className="font-semibold text-foreground mb-4">
                {editingId ? "Modifier le consistoire" : "Nouveau consistoire"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Nom *</Label>
                  <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: toSlug(e.target.value) })} placeholder="Ex: Consistoire de Brazzaville" />
                </div>
                <div className="space-y-1.5">
                  <Label>Slug (auto-généré)</Label>
                  <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="consistoire-brazzaville" />
                </div>
                <div className="space-y-1.5">
                  <Label>Responsable</Label>
                  <Input value={form.responsable} onChange={e => setForm({ ...form, responsable: e.target.value })} placeholder="Nom du coordinateur" />
                </div>
                <div className="space-y-1.5">
                  <Label>Ville</Label>
                  <Input value={form.ville} onChange={e => setForm({ ...form, ville: e.target.value })} placeholder="Brazzaville" />
                </div>
                <div className="space-y-1.5">
                  <Label>Téléphone</Label>
                  <Input value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} placeholder="+242 …" />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="consistoire@eec.cg" />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label>Description</Label>
                  <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Description optionnelle…" />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleSave} className="gap-1.5"><Save className="h-3.5 w-3.5" /> Enregistrer</Button>
                <Button variant="outline" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }} className="gap-1.5"><X className="h-3.5 w-3.5" /> Annuler</Button>
              </div>
            </div>
          )}

          {/* Liste */}
          {fetching ? (
            <p className="text-center text-muted-foreground py-16">Chargement…</p>
          ) : consistoires.length === 0 ? (
            <div className="text-center py-16">
              <Church className="h-14 w-14 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">Aucun consistoire. Créez-en un.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {consistoires.map(c => (
                <div key={c.id} className={`bg-card border rounded-xl p-5 flex items-center gap-4 ${c.is_active ? "border-border" : "border-border/50 opacity-60"}`}>
                  <div className="p-2.5 rounded-lg bg-green-50">
                    <Church className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{c.name}</h3>
                      {!c.is_active && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Inactif</span>}
                    </div>
                    {c.responsable && <p className="text-xs text-muted-foreground mt-0.5">Responsable : {c.responsable}</p>}
                    {c.ville && <p className="text-xs text-muted-foreground">Ville : {c.ville}</p>}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => toggleActive(c)} className="text-xs">
                      {c.is_active ? "Désactiver" : "Activer"}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => startEdit(c)} className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/consistoires/${c.id}/paroisses`)} className="h-8 w-8">
                      <ChevronRight className="h-4 w-4" />
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

export default AdminConsistoiresPage;
