import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { ArrowLeft, Users, BookOpen, Building2, Shield, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import MembresManager from "./MembresManager";
import { AnnoncesManager } from "./AdminSynodePage";

// Configuration de chaque institution : uuid fixe pour membres, id texte pour annonces
const INSTITUTION_CONFIG: Record<string, { label: string; uuid: string; annId: string; role: string }> = {
  pastorale: { label: "Pastorale",                              uuid: "00000000-0000-0000-0000-000000000002", annId: "pastorale", role: "admin_pastorale" },
  upb:       { label: "UPB — Université Protestante de Brazza", uuid: "00000000-0000-0000-0000-000000000003", annId: "upb",       role: "admin_upb" },
  ifpn:      { label: "IFPN — Institut de Formation Pastorale", uuid: "00000000-0000-0000-0000-000000000004", annId: "ifpn",      role: "admin_ifpn" },
  sueco:     { label: "SUECO",                                  uuid: "00000000-0000-0000-0000-000000000005", annId: "sueco",     role: "admin_sueco" },
};

type Tab = "bureau" | "conseil" | "commissions" | "organes" | "annonces";

const TABS: { key: Tab; label: string; icon: any }[] = [
  { key: "bureau",      label: "Bureau",      icon: Users },
  { key: "conseil",     label: "Conseil",     icon: Shield },
  { key: "commissions", label: "Commissions", icon: BookOpen },
  { key: "organes",     label: "Organes",     icon: Building2 },
  { key: "annonces",    label: "Annonces",    icon: Megaphone },
];

const AdminInstitutionPage = () => {
  const { type } = useParams<{ type: string }>();
  const { isAdminGeneral, hasRole, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("bureau");

  const config = type ? INSTITUTION_CONFIG[type] : null;

  useEffect(() => {
    if (!loading && config && !isAdminGeneral && !hasRole(config.role)) {
      navigate("/admin");
    }
    if (!loading && !config) navigate("/admin");
  }, [loading, isAdminGeneral, type]);

  if (!config) return null;

  return (
    <Layout>
      <div className="bg-primary py-8">
        <div className="container flex items-center gap-4">
          <Button variant="ghost" size="icon"
            onClick={() => navigate(isAdminGeneral ? "/admin" : "/admin")}
            className="text-primary-foreground hover:bg-primary-foreground/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <p className="text-primary-foreground/60 text-xs mb-0.5">Administration</p>
            <h1 className="font-display text-2xl text-primary-foreground">{config.label}</h1>
          </div>
        </div>
      </div>

      <section className="py-8 bg-muted/30 min-h-[60vh]">
        <div className="container max-w-4xl">
          {/* Onglets */}
          <div className="flex gap-1 bg-card border border-border rounded-xl p-1 mb-6 overflow-x-auto">
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}>
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            {activeTab === "bureau" && (
              <MembresManager entityType={type!} entityId={config.uuid} memberType="bureau" title="Bureau" />
            )}
            {activeTab === "conseil" && (
              <MembresManager entityType={type!} entityId={config.uuid} memberType="conseil" title="Conseil" />
            )}
            {activeTab === "commissions" && (
              <MembresManager entityType={type!} entityId={config.uuid} memberType="organe" title="Commissions" />
            )}
            {activeTab === "organes" && (
              <MembresManager entityType={type!} entityId={config.uuid} memberType="organe" title="Organes" />
            )}
            {activeTab === "annonces" && (
              <AnnoncesManager entityType={type!} entityId={config.annId} />
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AdminInstitutionPage;
