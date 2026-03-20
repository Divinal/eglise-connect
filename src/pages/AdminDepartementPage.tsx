import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Users, Megaphone, Info, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import MembresManager from "./MembresManager";
import { AnnoncesManager } from "./AdminSynodePage";
import { useToast } from "@/hooks/use-toast";

const InfosDepartement = ({ deptId }: { deptId: string }) => {
  const { toast } = useToast();
  const [form, setForm] = useState<any>({});
  const [loaded, setLoaded] = useState(false);
  const [edited, setEdited] = useState(false);

  useEffect(() => {
    supabase.from("departments").select("*").eq("id", deptId).maybeSingle()
      .then(({ data }) => { setForm(data || {}); setLoaded(true); });
  }, [deptId]);

  const handleSave = async () => {
    const { error } = await supabase.from("departments").update({
      description: form.description || null,
      mission: form.mission || null,
    } as any).eq("id", deptId);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Informations mises à jour" }); setEdited(false);
  };

  if (!loaded) return <p className="text-sm text-muted-foreground py-8 text-center">Chargement…</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Informations du département</h2>
        {edited && <Button size="sm" onClick={handleSave} className="gap-1.5"><Save className="h-3.5 w-3.5" />Enregistrer</Button>}
      </div>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs">Nom</Label>
          <Input value={form.name || ""} disabled className="h-9 text-sm bg-muted/30" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Description</Label>
          <Textarea value={form.description || ""} onChange={e => { setForm({ ...form, description: e.target.value }); setEdited(true); }} rows={3} className="text-sm" placeholder="Description du département…" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Mission</Label>
          <Textarea value={form.mission || ""} onChange={e => { setForm({ ...form, mission: e.target.value }); setEdited(true); }} rows={3} className="text-sm" placeholder="Mission et objectifs…" />
        </div>
      </div>
    </div>
  );
};

type Tab = "bureau" | "annonces" | "infos";
const TABS: { key: Tab; label: string; icon: any }[] = [
  { key: "bureau", label: "Bureau", icon: Users },
  { key: "annonces", label: "Annonces", icon: Megaphone },
  { key: "infos", label: "Informations", icon: Info },
];

const AdminDepartementPage = () => {
  const { id: deptId } = useParams<{ id: string }>();
  const { roles, isAdminGeneral, loading } = useAuth();
  const navigate = useNavigate();
  const [deptName, setDeptName] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("bureau");

  const hasAccess = isAdminGeneral || roles.some(r => r.role === "admin_departement" && r.scope_id === deptId);

  useEffect(() => { if (!loading && !hasAccess) navigate("/admin"); }, [loading, hasAccess]);

  useEffect(() => {
    if (deptId) {
      supabase.from("departments").select("name").eq("id", deptId).maybeSingle()
        .then(({ data }) => setDeptName(data?.name || "Département"));
    }
  }, [deptId]);

  return (
    <Layout>
      <div className="bg-primary py-8">
        <div className="container flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin")} className="text-primary-foreground hover:bg-primary-foreground/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <p className="text-primary-foreground/60 text-xs mb-0.5">Département</p>
            <h1 className="font-display text-2xl text-primary-foreground">{deptName}</h1>
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
            {activeTab === "bureau" && deptId && (
              <MembresManager entityType="paroisse" entityId={deptId} memberType="bureau" title="Bureau du département" />
            )}
            {activeTab === "annonces" && deptId && (
              <AnnoncesManager entityType="departement" entityId={deptId} />
            )}
            {activeTab === "infos" && deptId && (
              <InfosDepartement deptId={deptId} />
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AdminDepartementPage;
