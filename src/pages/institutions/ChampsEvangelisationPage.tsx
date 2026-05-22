import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Heart, ChevronRight } from "lucide-react";

interface ChampEvang {
  id: string; name: string; ville: string | null;
  responsable: string | null; description: string | null;
}

const ChampsEvangelisationPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<ChampEvang[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (supabase as any).from("champs_evangelisation")
      .select("id, name, ville, responsable, description")
      .order("name")
      .then(({ data }: any) => { setItems(data || []); setLoading(false); });
  }, []);

  return (
    <Layout>
      <div className="bg-primary py-12">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl text-primary-foreground">
            Champs d'Évangélisation
          </h1>
          <p className="text-primary-foreground/70 mt-2">
            Zones d'évangélisation actives de l'Église Évangélique du Congo
          </p>
        </div>
      </div>

      <section className="py-12 bg-cream">
        <div className="container">
          {loading ? (
            <p className="text-center text-muted-foreground py-16">Chargement…</p>
          ) : items.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="h-14 w-14 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-muted-foreground">Aucun champ d'évangélisation pour l'instant.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map(c => (
                <button
                  key={c.id}
                  onClick={() => navigate(`/institution/champs-evangelisation/${c.id}`)}
                  className="bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:border-gold transition-all text-left group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-lg font-semibold text-primary group-hover:text-gold transition-colors">
                        {c.name}
                      </h3>
                      {c.ville && <p className="text-sm text-muted-foreground mt-1">{c.ville}</p>}
                      {c.responsable && <p className="text-xs text-muted-foreground mt-0.5">Resp. : {c.responsable}</p>}
                      {!c.ville && !c.responsable && (
                        <p className="text-sm text-muted-foreground mt-1">Cliquez pour voir les détails</p>
                      )}
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground/40 shrink-0 mt-0.5 group-hover:text-gold transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default ChampsEvangelisationPage;
