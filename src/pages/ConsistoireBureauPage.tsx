import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Users, BookOpen, Building2, Shield, UserCheck, Megaphone } from "lucide-react";
import { AnnoncesManager } from "./AdminSynodePage";
import { Button } from "@/components/ui/button";
import MembresManager from "./MembresManager";
import { useToast } from "@/hooks/use-toast";

// Composant Secrétaires paroissiaux
const SecretairesManager = ({ consistoireId }: { consistoireId: string }) => {
  const { toast } = useToast();
  const [secretaires, setSecretaires] = useState<any[]>([]);
  const [paroisses, setParoisses] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [email, setEmail] = useState("");
  const [scopeId, setScopeId] = useState("");
  const [showForm, setShowForm] = useState(false);

  const fetchData = async () => {
    setFetching(true);
    const { data: pars } = await supabase.from("paroisses").select("id,name").eq("consistoire_id", consistoireId).order("name");
    setParoisses(pars || []);
    const parIds = (pars || []).map((p: any) => p.id);
    if (parIds.length === 0) { setFetching(false); return; }
    const { data: roles } = await supabase.from("user_roles").select("id,user_id,scope_id").eq("role", "secretaire_paroissial").in("scope_id", parIds);
    const userIds = (roles || []).map((r: any) => r.user_id);
    const { data: profiles } = userIds.length > 0
      ? await supabase.from("profiles").select("user_id,email,full_name").in("user_id", userIds)
      : { data: [] };
    const pm: Record<string, any> = {};
    (profiles || []).forEach((p: any) => { pm[p.user_id] = p; });
    setSecretaires((roles || []).map((r: any) => ({
      ...r,
      email: pm[r.user_id]?.email,
      full_name: pm[r.user_id]?.full_name,
      paroisse_name: pars?.find((p: any) => p.id === r.scope_id)?.name,
    })));
    setFetching(false);
  };

  useEffect(() => { fetchData(); }, [consistoireId]);

  const assignSecretaire = async () => {
    if (!email || !scopeId) { toast({ title: "Email et paroisse requis", variant: "destructive" }); return; }
    const { data: profile } = await supabase.from("profiles").select("user_id").eq("email", email).maybeSingle();
    if (!profile) { toast({ title: "Utilisateur introuvable", description: "L'utilisateur doit créer son compte d'abord.", variant: "destructive" }); return; }
    const { error } = await supabase.from("user_roles").insert({ user_id: profile.user_id, role: "secretaire_paroissial", scope_type: "paroisse", scope_id: scopeId });
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Secrétaire assigné !" });
    setEmail(""); setScopeId(""); setShowForm(false); fetchData();
  };

  const removeSecretaire = async (id: string) => {
    await supabase.from("user_roles").delete().eq("id", id);
    toast({ title: "Secrétaire retiré" }); fetchData();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Secrétaires paroissiaux</h2>
        <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1.5">
          <UserCheck className="h-3.5 w-3.5" /> Assigner
        </Button>
      </div>
      {showForm && (
        <div className="bg-muted/40 border border-border rounded-xl p-5 mb-5 space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium">Email *</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@exemple.com"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium">Paroisse *</label>
            <select value={scopeId} onChange={e => setScopeId(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm">
              <option value="">Choisir…</option>
              {paroisses.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={assignSecretaire} className="h-8 px-3 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5" /> Assigner
            </button>
            <button onClick={() => setShowForm(false)} className="h-8 px-3 text-sm border border-border rounded-md hover:bg-muted">Annuler</button>
          </div>
        </div>
      )}
      {fetching ? <p className="text-sm text-muted-foreground py-8 text-center">Chargement…</p>
        : secretaires.length === 0 ? <p className="text-sm text-muted-foreground py-8 text-center">Aucun secrétaire paroissial.</p>
        : (
          <div className="space-y-2">
            {secretaires.map((s: any) => (
              <div key={s.id} className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <UserCheck className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{s.full_name || "—"}</p>
                  <p className="text-xs text-muted-foreground">{s.email} · {s.paroisse_name}</p>
                </div>
                <button onClick={() => removeSecretaire(s.id)} className="text-xs text-destructive hover:underline">Retirer</button>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

type Tab = "bureau" | "conseil" | "commissions" | "organes" | "secretaires" | "annonces";

const ConsistoireBureauPage = () => {
  const { id: consistoireId } = useParams<{ id: string }>();
  const { roles, isAdminGeneral, loading } = useAuth();
  const navigate = useNavigate();
  const [consistoireName, setConsistoireName] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("bureau");

  const hasAccess = isAdminGeneral || roles.some(
    r => r.role === "coordinateur_consistoire" && r.scope_id === consistoireId
  );

  useEffect(() => { if (!loading && !hasAccess) navigate("/admin"); }, [loading, hasAccess]);

  useEffect(() => {
    supabase.from("consistoires").select("name").eq("id", consistoireId!).maybeSingle()
      .then(({ data }) => setConsistoireName(data?.name || "Consistoire"));
  }, [consistoireId]);

  const TABS: { key: Tab; label: string; icon: any }[] = [
    { key: "bureau", label: "Bureau", icon: Users },
    { key: "conseil", label: "Conseil", icon: Shield },
    { key: "commissions", label: "Commissions", icon: BookOpen },
    { key: "organes", label: "Organes", icon: Building2 },
    { key: "annonces", label: "Annonces", icon: Megaphone },
    { key: "secretaires", label: "Secrétaires", icon: UserCheck },
  ];

  return (
    <Layout>
      <div className="bg-primary py-8">
        <div className="container flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}
            className="text-primary-foreground hover:bg-primary-foreground/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <p className="text-primary-foreground/60 text-xs mb-0.5">{consistoireName}</p>
            <h1 className="font-display text-2xl text-primary-foreground">Administration</h1>
          </div>
        </div>
      </div>

      <section className="py-8 bg-muted/30 min-h-[60vh]">
        <div className="container max-w-4xl">
          {/* Onglets */}
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
            {activeTab === "bureau" && consistoireId && (
              <MembresManager entityType="consistoire" entityId={consistoireId} memberType="bureau" title="Bureau consistorial" />
            )}
            {activeTab === "conseil" && consistoireId && (
              <MembresManager entityType="consistoire" entityId={consistoireId} memberType="conseil" title="Conseil consistorial" />
            )}
            {activeTab === "commissions" && consistoireId && (
              <MembresManager entityType="consistoire" entityId={consistoireId} memberType="organe" title="Commissions" />
            )}
            {activeTab === "organes" && consistoireId && (
              <MembresManager entityType="consistoire" entityId={consistoireId} memberType="organe" title="Organes consistoriaux" />
            )}
            {activeTab === "annonces" && consistoireId && (
              <AnnoncesManager entityType="consistoire" entityId={consistoireId} />
            )}
            {activeTab === "secretaires" && consistoireId && (
              <SecretairesManager consistoireId={consistoireId} />
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ConsistoireBureauPage;