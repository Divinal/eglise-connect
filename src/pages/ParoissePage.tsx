import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Users, Building2, Shield, Music, Church, Info, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import MembresManager from "./MembresManager";
import { useToast } from "@/hooks/use-toast";

// Composant Groupes chantants
const GroupesChantants = ({ paroisseId }: { paroisseId: string }) => {
  const { toast } = useToast();
  const [groupes, setGroupes] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "", description: "",
    total_membres: "", hommes_actifs: "", femmes_actives: "",
    hommes_refroidis: "", femmes_refroidies: "",
  });

  const fetchGroupes = async () => {
    setFetching(true);
    const { data } = await supabase.from("groupes_chantants").select("*").eq("paroisse_id", paroisseId).order("name");
    setGroupes(data || []);
    setFetching(false);
  };
  useEffect(() => { fetchGroupes(); }, [paroisseId]);

  const handleSave = async () => {
    if (!form.name.trim()) { toast({ title: "Nom requis", variant: "destructive" }); return; }
    const payload = {
      name: form.name,
      description: form.description || null,
      paroisse_id: paroisseId,
      total_membres: form.total_membres ? parseInt(form.total_membres) : null,
      hommes_actifs: form.hommes_actifs ? parseInt(form.hommes_actifs) : null,
      femmes_actives: form.femmes_actives ? parseInt(form.femmes_actives) : null,
      hommes_refroidis: form.hommes_refroidis ? parseInt(form.hommes_refroidis) : null,
      femmes_refroidies: form.femmes_refroidies ? parseInt(form.femmes_refroidies) : null,
    };
    if (editingId) {
      const { error } = await supabase.from("groupes_chantants").update(payload).eq("id", editingId);
      if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Groupe mis à jour" });
    } else {
      const { error } = await supabase.from("groupes_chantants").insert(payload);
      if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Groupe créé !" });
    }
    setForm({ name: "", description: "", total_membres: "", hommes_actifs: "", femmes_actives: "", hommes_refroidis: "", femmes_refroidies: "" });
    setShowForm(false); setEditingId(null); fetchGroupes();
  };

  const deleteGroupe = async (id: string) => {
    await supabase.from("groupes_chantants").delete().eq("id", id);
    toast({ title: "Groupe supprimé" }); fetchGroupes();
  };

  const startEdit = (g: any) => {
    setEditingId(g.id);
    setForm({ name: g.name, description: g.description || "", total_membres: g.total_membres?.toString() || "", hommes_actifs: g.hommes_actifs?.toString() || "", femmes_actives: g.femmes_actives?.toString() || "", hommes_refroidis: g.hommes_refroidis?.toString() || "", femmes_refroidies: g.femmes_refroidies?.toString() || "" });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Groupes chantants</h2>
        <Button size="sm" onClick={() => { setShowForm(!showForm); setEditingId(null); }} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Ajouter
        </Button>
      </div>
      {showForm && (
        <div className="bg-muted/40 border border-border rounded-xl p-5 mb-5">
          <h3 className="font-medium text-sm mb-3">{editingId ? "Modifier" : "Nouveau groupe"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs">Nom du groupe *</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Ex: Chorale Hosanna" className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs">Description</Label>
              <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Total membres</Label>
              <Input type="number" value={form.total_membres} onChange={e => setForm({ ...form, total_membres: e.target.value })} className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Hommes actifs</Label>
              <Input type="number" value={form.hommes_actifs} onChange={e => setForm({ ...form, hommes_actifs: e.target.value })} className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Femmes actives</Label>
              <Input type="number" value={form.femmes_actives} onChange={e => setForm({ ...form, femmes_actives: e.target.value })} className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Hommes refroidis</Label>
              <Input type="number" value={form.hommes_refroidis} onChange={e => setForm({ ...form, hommes_refroidis: e.target.value })} className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Femmes refroidies</Label>
              <Input type="number" value={form.femmes_refroidies} onChange={e => setForm({ ...form, femmes_refroidies: e.target.value })} className="h-9 text-sm" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button size="sm" onClick={handleSave} className="gap-1.5"><Save className="h-3.5 w-3.5" />Enregistrer</Button>
            <Button size="sm" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>Annuler</Button>
          </div>
        </div>
      )}
      {fetching ? <p className="text-sm text-muted-foreground py-8 text-center">Chargement…</p>
        : groupes.length === 0 ? (
          <div className="text-center py-10"><Music className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" /><p className="text-sm text-muted-foreground">Aucun groupe chantant.</p></div>
        ) : (
          <div className="space-y-3">
            {groupes.map(g => (
              <div key={g.id} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{g.name}</p>
                    {g.description && <p className="text-xs text-muted-foreground mt-0.5">{g.description}</p>}
                    {(g.total_membres || g.hommes_actifs || g.femmes_actives) && (
                      <div className="flex flex-wrap gap-3 mt-2">
                        {g.total_membres != null && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Total : {g.total_membres}</span>}
                        {g.hommes_actifs != null && <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">H actifs : {g.hommes_actifs}</span>}
                        {g.femmes_actives != null && <span className="text-xs bg-pink-50 text-pink-700 px-2 py-0.5 rounded-full">F actives : {g.femmes_actives}</span>}
                        {g.hommes_refroidis != null && <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">H refroidis : {g.hommes_refroidis}</span>}
                        {g.femmes_refroidies != null && <span className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full">F refroidies : {g.femmes_refroidies}</span>}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => startEdit(g)} className="h-8 w-8"><Save className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteGroupe(g.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

// Composant Annexes
const AnnexesManager = ({ paroisseId }: { paroisseId: string }) => {
  const { toast } = useToast();
  const [annexes, setAnnexes] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", ville: "", quartier: "", responsable: "" });

  const fetchAnnexes = async () => {
    setFetching(true);
    const { data } = await supabase.from("annexes").select("*").eq("paroisse_id", paroisseId).order("name");
    setAnnexes(data || []);
    setFetching(false);
  };
  useEffect(() => { fetchAnnexes(); }, [paroisseId]);

  const handleSave = async () => {
    if (!form.name.trim()) { toast({ title: "Nom requis", variant: "destructive" }); return; }
    const { error } = await supabase.from("annexes").insert({ ...form, paroisse_id: paroisseId, name: form.name, ville: form.ville || null, quartier: form.quartier || null, responsable: form.responsable || null });
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Annexe créée !" });
    setForm({ name: "", ville: "", quartier: "", responsable: "" });
    setShowForm(false); fetchAnnexes();
  };

  const deleteAnnexe = async (id: string) => {
    await supabase.from("annexes").delete().eq("id", id);
    toast({ title: "Annexe supprimée" }); fetchAnnexes();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Annexes</h2>
        <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1.5"><Plus className="h-3.5 w-3.5" />Ajouter</Button>
      </div>
      {showForm && (
        <div className="bg-muted/40 border border-border rounded-xl p-5 mb-5 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-xs">Nom *</Label>
            <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="h-9 text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Ville</Label>
            <Input value={form.ville} onChange={e => setForm({ ...form, ville: e.target.value })} className="h-9 text-sm" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Quartier</Label>
            <Input value={form.quartier} onChange={e => setForm({ ...form, quartier: e.target.value })} className="h-9 text-sm" />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label className="text-xs">Responsable</Label>
            <Input value={form.responsable} onChange={e => setForm({ ...form, responsable: e.target.value })} className="h-9 text-sm" />
          </div>
          <div className="flex gap-2 md:col-span-2">
            <Button size="sm" onClick={handleSave} className="gap-1.5"><Save className="h-3.5 w-3.5" />Enregistrer</Button>
            <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
          </div>
        </div>
      )}
      {fetching ? <p className="text-sm text-muted-foreground py-8 text-center">Chargement…</p>
        : annexes.length === 0 ? <div className="text-center py-10"><Church className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" /><p className="text-sm text-muted-foreground">Aucune annexe.</p></div>
        : (
          <div className="space-y-2">
            {annexes.map(a => (
              <div key={a.id} className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg">
                <Church className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1"><p className="font-medium text-sm">{a.name}</p>{(a.ville || a.quartier) && <p className="text-xs text-muted-foreground">{[a.quartier, a.ville].filter(Boolean).join(", ")}</p>}</div>
                <Button variant="ghost" size="icon" onClick={() => deleteAnnexe(a.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

// Composant Infos paroisse
const InfosParoisse = ({ paroisseId }: { paroisseId: string }) => {
  const { toast } = useToast();
  const [paroisse, setParoisse] = useState<any>(null);
  const [form, setForm] = useState<any>({});
  const [edited, setEdited] = useState(false);

  useEffect(() => {
    supabase.from("paroisses").select("*").eq("id", paroisseId).maybeSingle()
      .then(({ data }) => { setParoisse(data); setForm(data || {}); });
  }, [paroisseId]);

  const handleSave = async () => {
    const { error } = await (supabase.from("paroisses") as any).update({
      telephone: form.telephone || null,
      email: form.email || null,
      rue: form.rue || null,
      quartier: form.quartier || null,
      ville: form.ville || null,
      pasteur_responsable: form.pasteur_responsable || null,
    }).eq("id", paroisseId);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Informations mises à jour" }); setEdited(false);
  };

  if (!paroisse) return <p className="text-sm text-muted-foreground py-8 text-center">Chargement…</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Informations de la paroisse</h2>
        {edited && <Button size="sm" onClick={handleSave} className="gap-1.5"><Save className="h-3.5 w-3.5" />Enregistrer</Button>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: "pasteur_responsable", label: "Pasteur responsable" },
          { key: "telephone", label: "Téléphone" },
          { key: "email", label: "Email" },
          { key: "ville", label: "Ville" },
          { key: "quartier", label: "Quartier" },
          { key: "rue", label: "Rue / Adresse" },
        ].map(field => (
          <div key={field.key} className="space-y-1.5">
            <Label className="text-xs">{field.label}</Label>
            <Input value={form[field.key] || ""} onChange={e => { setForm({ ...form, [field.key]: e.target.value }); setEdited(true); }} className="h-9 text-sm" />
          </div>
        ))}
      </div>
    </div>
  );
};

type Tab = "bureau" | "organes" | "conseil" | "groupes" | "annexes" | "infos";

const ParoissePage = () => {
  const { id: paroisseId } = useParams<{ id: string }>();
  const { roles, isAdminGeneral, loading } = useAuth();
  const navigate = useNavigate();
  const [paroisseName, setParoisseName] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("bureau");

  const hasAccess = isAdminGeneral || roles.some(
    r => r.role === "secretaire_paroissial" && r.scope_id === paroisseId
  ) || roles.some(r => r.role === "coordinateur_consistoire");

  useEffect(() => { if (!loading && !hasAccess) navigate("/admin"); }, [loading, hasAccess]);

  useEffect(() => {
    supabase.from("paroisses").select("name").eq("id", paroisseId!).maybeSingle()
      .then(({ data }) => setParoisseName(data?.name || "Paroisse"));
  }, [paroisseId]);

  const TABS: { key: Tab; label: string; icon: any }[] = [
    { key: "bureau", label: "Bureau", icon: Users },
    { key: "organes", label: "Organes", icon: Building2 },
    { key: "conseil", label: "Conseil", icon: Shield },
    { key: "groupes", label: "Groupes chantants", icon: Music },
    { key: "annexes", label: "Annexes", icon: Church },
    { key: "infos", label: "Informations", icon: Info },
  ];

  return (
    <Layout>
      <div className="bg-primary py-8">
        <div className="container flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin")} className="text-primary-foreground hover:bg-primary-foreground/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <p className="text-primary-foreground/60 text-xs mb-0.5">Paroisse</p>
            <h1 className="font-display text-2xl text-primary-foreground">{paroisseName}</h1>
          </div>
        </div>
      </div>

      <section className="py-8 bg-muted/30 min-h-[60vh]">
        <div className="container max-w-4xl">
          <div className="flex gap-1 bg-card border border-border rounded-xl p-1 mb-6 overflow-x-auto">
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.key ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            {activeTab === "bureau" && paroisseId && <MembresManager entityType="paroisse" entityId={paroisseId} memberType="bureau" title="Bureau paroissial" />}
            {activeTab === "organes" && paroisseId && <MembresManager entityType="paroisse" entityId={paroisseId} memberType="organe" title="Organes paroissiaux" />}
            {activeTab === "conseil" && paroisseId && <MembresManager entityType="paroisse" entityId={paroisseId} memberType="conseil" title="Conseil paroissial" />}
            {activeTab === "groupes" && paroisseId && <GroupesChantants paroisseId={paroisseId} />}
            {activeTab === "annexes" && paroisseId && <AnnexesManager paroisseId={paroisseId} />}
            {activeTab === "infos" && paroisseId && <InfosParoisse paroisseId={paroisseId} />}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ParoissePage;
