import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Users, BookOpen, Building2, Shield, Megaphone } from "lucide-react";
import { AnnoncesManager } from "./AdminSynodePage";
import { Button } from "@/components/ui/button";
import MembresManager from "./MembresManager";

type Tab = "bureau" | "conseil" | "commissions" | "organes" | "annonces";

const ChampsEvangelisationBureauPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isAdminGeneral, loading } = useAuth();
  const navigate = useNavigate();
  const [nomEntite, setNomEntite] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("bureau");

  useEffect(() => { if (!loading && !isAdminGeneral) navigate("/admin"); }, [loading, isAdminGeneral, navigate]);

  useEffect(() => {
    (supabase as any).from("champs_evangelisation").select("name").eq("id", id!).maybeSingle()
      .then(({ data }: any) => setNomEntite(data?.name || "Champ d'Évangélisation"));
  }, [id]);

  const TABS: { key: Tab; label: string; icon: any }[] = [
    { key: "bureau", label: "Bureau", icon: Users },
    { key: "conseil", label: "Conseil", icon: Shield },
    { key: "commissions", label: "Commissions", icon: BookOpen },
    { key: "organes", label: "Organes", icon: Building2 },
    { key: "annonces", label: "Annonces", icon: Megaphone },
  ];

  return (
    <Layout>
      <div className="bg-primary py-8">
        <div className="container flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/champs-evangelisation")}
            className="text-primary-foreground hover:bg-primary-foreground/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <p className="text-primary-foreground/60 text-xs mb-0.5">{nomEntite}</p>
            <h1 className="font-display text-2xl text-primary-foreground">Administration</h1>
          </div>
        </div>
      </div>

      <section className="py-8 bg-muted/30 min-h-[60vh]">
        <div className="container max-w-4xl">
          <div className="flex flex-wrap gap-2 mb-6">
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border text-foreground hover:bg-muted"
                }`}>
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "bureau" && id && (
            <MembresManager entityType="champs_evangelisation" entityId={id} memberType="bureau" title="Bureau" />
          )}
          {activeTab === "conseil" && id && (
            <MembresManager entityType="champs_evangelisation" entityId={id} memberType="conseil" title="Conseil" />
          )}
          {activeTab === "commissions" && id && (
            <MembresManager entityType="champs_evangelisation" entityId={id} memberType="organe" title="Commissions" />
          )}
          {activeTab === "organes" && id && (
            <MembresManager entityType="champs_evangelisation" entityId={id} memberType="organe" title="Organes" />
          )}
          {activeTab === "annonces" && id && (
            <AnnoncesManager entityType="champs_evangelisation" entityId={id} />
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ChampsEvangelisationBureauPage;
