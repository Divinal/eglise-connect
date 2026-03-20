import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Users, BookOpen, Building2, Shield, Megaphone, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import MembresManager from "./MembresManager";
import { useToast } from "@/hooks/use-toast";

// Composant Annonces
const AnnoncesManager = ({ entityType, entityId }: { entityType: string; entityId: string }) => {
  const { toast } = useToast();
  const [annonces, setAnnonces] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", type: "annonce", image_url: "" });  

  const fetchAnnonces = async () => {
    setFetching(true);
    const { data } = await supabase.from("announcements")
      .select("*")
      .eq("entity_type", entityType)
      .eq("entity_id", entityId)
      .order("created_at", { ascending: false });
    setAnnonces(data || []);
    setFetching(false);
  };
  useEffect(() => { fetchAnnonces(); }, [entityId]);

  const handleSave = async () => {
    if (!form.title.trim()) { toast({ title: "Titre requis", variant: "destructive" }); return; }
    const { error } = await supabase.from("announcements").insert({
      title: form.title,
      content: form.content || null,
      type: form.type,
      entity_type: entityType,
      entity_id: entityId,
    } as any);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Annonce publiée !" });
    setForm({ title: "", content: "", type: "annonce", image_url: "" });
    setShowForm(false); fetchAnnonces();
  };

  const deleteAnnonce = async (id: string) => {
    await supabase.from("announcements").delete().eq("id", id);
    toast({ title: "Annonce supprimée" }); fetchAnnonces();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Annonces & Circulaires</h2>
        <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Publier
        </Button>
      </div>
      {showForm && (
        <div className="bg-muted/40 border border-border rounded-xl p-5 mb-5 space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Type</Label>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm">
              <option value="annonce">Annonce</option>
              <option value="circulaire">Circulaire</option>
              <option value="convocation">Convocation</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Titre *</Label>
            <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="h-9 text-sm" placeholder="Titre de l'annonce" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Contenu</Label>
            <Textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={3} className="text-sm" placeholder="Contenu…" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">URL de l'image (optionnel)</Label>
            <Input 
              value={form.image_url} 
              onChange={e => setForm({ ...form, image_url: e.target.value })} 
              className="h-9 text-sm" 
              placeholder="https://…" 
            />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} className="gap-1.5"><Save className="h-3.5 w-3.5" />Publier</Button>
            <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>Annuler</Button>
          </div>
        </div>
      )}
      {fetching ? <p className="text-sm text-muted-foreground py-8 text-center">Chargement…</p>
        : annonces.length === 0 ? <p className="text-sm text-muted-foreground py-8 text-center">Aucune annonce.</p>
        : (<div className="space-y-3">
            {annonces.map(a => (
              <div key={a.id} className="p-4 bg-card border border-border rounded-lg">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        a.type === "circulaire" ? "bg-blue-100 text-blue-700" :
                        a.type === "convocation" ? "bg-amber-100 text-amber-700" :
                        "bg-green-100 text-green-700"
                      }`}>{a.type}</span>
                      <span className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString("fr-FR")}</span>
                    </div>
                    <p className="font-medium text-sm">{a.title}</p>
                    {a.content && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.content}</p>}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => deleteAnnonce(a.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

type Tab = "bureau" | "commissions" | "organes" | "conseil" | "annonces";

const TABS: { key: Tab; label: string; icon: any }[] = [
  { key: "bureau", label: "Bureau", icon: Users },
  { key: "commissions", label: "Commissions", icon: BookOpen },
  { key: "organes", label: "Organes", icon: Building2 },
  { key: "conseil", label: "Conseil", icon: Shield },
  { key: "annonces", label: "Annonces", icon: Megaphone },
];

// entity_id fixe pour tout ce qui est synodal
const SYNODE_ID = "synode";

const SynodePage = ({ defaultTab }: { defaultTab?: Tab }) => {
  const { isAdminGeneral, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab || "bureau");

  useEffect(() => { if (!loading && !isAdminGeneral) navigate("/admin"); }, [loading, isAdminGeneral]);

  return (
    <Layout>
      <div className="bg-primary py-8">
        <div className="container flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}
            className="text-primary-foreground hover:bg-primary-foreground/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <p className="text-primary-foreground/60 text-xs mb-0.5">Synode National</p>
            <h1 className="font-display text-2xl text-primary-foreground">Structures Synodales</h1>
          </div>
        </div>
      </div>
      <section className="py-8 bg-muted/30 min-h-[60vh]">
        <div className="container max-w-4xl">
          <div className="flex gap-1 bg-card border border-border rounded-xl p-1 mb-6 overflow-x-auto">
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.key ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            {activeTab === "bureau" && (<MembresManager entityType="consistoire" entityId={SYNODE_ID} memberType="bureau" title="Bureau Synodal" />)}
            {activeTab === "commissions" && (<MembresManager entityType="consistoire" entityId={SYNODE_ID} memberType="organe" title="Commissions Synodales" /> )}
            {activeTab === "organes" && (<MembresManager entityType="consistoire" entityId={SYNODE_ID} memberType="organe" title="Organes Synodaux" /> )}
            {activeTab === "conseil" && (<MembresManager entityType="consistoire" entityId={SYNODE_ID} memberType="conseil" title="Conseil Synodal" />)}
            {activeTab === "annonces" && (<AnnoncesManager entityType="synode" entityId={SYNODE_ID} />)}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SynodePage;
export { AnnoncesManager };
