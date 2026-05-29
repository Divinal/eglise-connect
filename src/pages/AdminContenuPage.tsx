import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnnoncesManager } from "./AdminSynodePage";

const CONTENU_CONFIG: Record<string, { label: string; desc: string; entityType: string; entityId: string }> = {
  "eglise-proximite": {
    label: "Église de Proximité",
    desc: "Reportages des actions sociales menées par l'EEC à travers le pays",
    entityType: "eglise_proximite",
    entityId: "eglise_proximite",
  },
  "micro-semaine": {
    label: "Micro de la Semaine",
    desc: "Messages spirituels et interviews des responsables de l'EEC",
    entityType: "micro_semaine",
    entityId: "micro_semaine",
  },
};

const AdminContenuPage = () => {
  const { type } = useParams<{ type: string }>();
  const { isAdminGeneral, loading } = useAuth();
  const navigate = useNavigate();

  const config = type ? CONTENU_CONFIG[type] : null;

  useEffect(() => {
    if (!loading && !isAdminGeneral) navigate("/admin");
    if (!loading && !config) navigate("/admin");
  }, [loading, isAdminGeneral, type]);

  if (!config) return null;

  return (
    <Layout>
      <div className="bg-primary py-8">
        <div className="container flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}
            className="text-primary-foreground hover:bg-primary-foreground/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <p className="text-primary-foreground/60 text-xs mb-0.5">Contenus & Publications</p>
            <h1 className="font-display text-2xl text-primary-foreground">{config.label}</h1>
            <p className="text-primary-foreground/60 text-xs mt-0.5">{config.desc}</p>
          </div>
        </div>
      </div>

      <section className="py-8 bg-muted/30 min-h-[60vh]">
        <div className="container max-w-3xl">
          <div className="bg-card border border-border rounded-xl p-6">
            <AnnoncesManager entityType={config.entityType} entityId={config.entityId} />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AdminContenuPage;
