import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Church, ArrowLeft, Plus, Pencil, Save, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Paroisse {
  id: string;
  name: string;
  slug: string;
  pasteur_responsable: string | null;
  ville: string | null;
  departement: string | null;
  quartier: string | null;
  rue: string | null;
  telephone: string | null;
  email: string | null;
  date_creation: string | null;
  is_active: boolean;
}

const emptyForm = {
  name: "", slug: "", pasteur_responsable: "", ville: "",
  departement: "", quartier: "", rue: "", telephone: "", email: "", date_creation: "",
};

const toSlug = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const DEPARTEMENTS_CONGO = [
  "Brazzaville","Pointe-Noire","Bouenza","Cuvette","Cuvette-Ouest",
  "Kouilou","Lékoumou","Likouala","Niari","Plateaux","Pool","Sangha",
];

const ConsistoireParoissesPage = () => {
  const { id: consistoireId } = useParams<{ id: string }>();
  const { roles, isAdminGeneral, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [consistoireName, setConsistoireName] = useState("");
  const [paroisses, setParoisses] = useState<Paroisse[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  // Vérifier accès
  const hasAccess = isAdminGeneral || roles.some(
    r => r.role === "coordinateur_consistoire" && r.scope_id === consistoireId
  );

  useEffect(() => {
    if (!loading && !hasAccess) navigate("/admin");
  }, [loading, hasAccess]);

  const fetchData = async () => {
    setFetching(true);
    const { data: con } = await supabase.from("consistoires").select("name").eq("id", consistoireId!).maybeSingle();
    setConsistoireName(con?.name || "Consistoire");
    const { data, error } = await supabase.from("paroisses")
      .select("*").eq("consistoire_id", consistoireId!).order("name");
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else setParoisses((data || []) as any as Paroisse[]);
    setFetching(false);
  };

  useEffect(() => { if (consistoireId) fetchData(); }, [consistoireId]);

  const handleSave = async () => {
    if (!form.name.trim()) { toast({ title: "Nom requis", variant: "destructive" }); return; }
    const slug = form.slug || toSlug(form.name);
    const payload = {
      name: form.name, slug,
      consistoire_id: consistoireId,
      pasteur_responsable: form.pasteur_responsable || null,
      ville: form.ville || null,
      departement: form.departement || null,
      quartier: form.quartier || null,
      rue: form.rue || null,
      telephone: form.telephone || null,
      email: form.email || null,
      date_creation: form.date_creation || null,
    };
    if (editingId) {
      const { error } = await supabase.from("paroisses").update(payload).eq("id", editingId);
      if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Paroisse mise à jour" });
    } else {
      const { error } = await supabase.from("paroisses").insert(payload);
      if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Paroisse créée !" });
    }
    setForm(emptyForm); setShowForm(false); setEditingId(null); fetchData();
  };

  const startEdit = (p: Paroisse) => {
    setEditingId(p.id);
    setForm({
      name: p.name, slug: p.slug,
      pasteur_responsable: p.pasteur_responsable || "",
      ville: p.ville || "", departement: p.departement || "",
      quartier: p.quartier || "", rue: p.rue || "",
      telephone: p.telephone || "", email: p.email || "",
      date_creation: p.date_creation || "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const toggleActive = async (p: Paroisse) => {
    await (supabase.from("paroisses") as any).update({ is_active: !p.is_active }).eq("id", p.id);
    fetchData();
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
            <p className="text-primary-foreground/60 text-xs mb-0.5">{consistoireName}</p>
            <h1 className="font-display text-2xl text-primary-foreground">Paroisses</h1>
          </div>
          <Button onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }}
            className="gap-2 bg-gold text-navy-dark hover:bg-gold-dark">
            <Plus className="h-4 w-4" /> Nouvelle paroisse
          </Button>
        </div>
      </div>

      <section className="py-8 bg-muted/30 min-h-[60vh]">
        <div className="container max-w-4xl">

          {showForm && (
            <div className="bg-card border border-border rounded-xl p-6 mb-6 shadow-sm">
              <h2 className="font-semibold text-foreground mb-4">
                {editingId ? "Modifier la paroisse" : "Nouvelle paroisse"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Nom *</Label>
                  <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value, slug: toSlug(e.target.value) })} placeholder="Paroisse de …" />
                </div>
                <div className="space-y-1.5">
                  <Label>Slug</Label>
                  <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="auto-généré" />
                </div>
                <div className="space-y-1.5">
                  <Label>Pasteur responsable</Label>
                  <Input value={form.pasteur_responsable} onChange={e => setForm({ ...form, pasteur_responsable: e.target.value })} placeholder="Rév. Prénom NOM" />
                </div>
                <div className="space-y-1.5">
                  <Label>Date de création</Label>
                  <Input type="date" value={form.date_creation} onChange={e => setForm({ ...form, date_creation: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Département (province)</Label>
                  <select
                    value={form.departement}
                    onChange={e => setForm({ ...form, departement: e.target.value })}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">Choisir…</option>
                    {DEPARTEMENTS_CONGO.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label>Ville</Label>
                  <Input value={form.ville} onChange={e => setForm({ ...form, ville: e.target.value })} placeholder="Brazzaville" />
                </div>
                <div className="space-y-1.5">
                  <Label>Quartier</Label>
                  <Input value={form.quartier} onChange={e => setForm({ ...form, quartier: e.target.value })} placeholder="Ex: Bacongo" />
                </div>
                <div className="space-y-1.5">
                  <Label>Rue / Adresse</Label>
                  <Input value={form.rue} onChange={e => setForm({ ...form, rue: e.target.value })} placeholder="Av. de l'Indépendance" />
                </div>
                <div className="space-y-1.5">
                  <Label>Téléphone</Label>
                  <Input value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} placeholder="+242 …" />
                </div>
                <div className="space-y-1.5">
                  <Label>Email</Label>
                  <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="paroisse@eec.cg" />
                </div>
              </div>
              <div className="flex gap-2 mt-5">
                <Button onClick={handleSave} className="gap-1.5"><Save className="h-3.5 w-3.5" />Enregistrer</Button>
                <Button variant="outline" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }} className="gap-1.5"><X className="h-3.5 w-3.5" />Annuler</Button>
              </div>
            </div>
          )}

          {fetching ? (
            <p className="text-center text-muted-foreground py-16">Chargement…</p>
          ) : paroisses.length === 0 ? (
            <div className="text-center py-16">
              <Church className="h-14 w-14 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">Aucune paroisse. Créez-en une.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {paroisses.map(p => (
                <div key={p.id} className={`bg-card border rounded-xl p-5 flex items-center gap-4 ${p.is_active ? "border-border" : "border-border/50 opacity-60"}`}>
                  <div className="p-2.5 rounded-lg bg-green-50">
                    <Church className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{p.name}</h3>
                      {!p.is_active && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Inactive</span>}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-0.5">
                      {p.pasteur_responsable && <p className="text-xs text-muted-foreground">Pasteur : {p.pasteur_responsable}</p>}
                      {p.ville && <p className="text-xs text-muted-foreground">Ville : {p.ville}</p>}
                      {p.quartier && <p className="text-xs text-muted-foreground">Quartier : {p.quartier}</p>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => toggleActive(p)} className="text-xs">
                      {p.is_active ? "Désactiver" : "Activer"}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => startEdit(p)} className="h-8 w-8">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/paroisse/${p.id}/bureau`)} className="h-8 w-8">
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

export default ConsistoireParoissesPage;
