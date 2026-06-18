import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import AnnoncesSection from "@/components/AnnoncesSection";

const PastoralePage = () => {
  const [annonces, setAnnonces] = useState<any[]>([]);
  const [membres, setMembres] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("announcements").select("*").eq("entity_type", "pastorale").eq("status", "approved")
      .order("created_at", { ascending: false }).then(({ data }) => setAnnonces(data || []));
    (supabase.from("membres") as any).select("*").eq("entity_type", "pastorale").order("nom")
      .then(({ data }: any) => setMembres(data || []));
  }, []);

  return (
    <Layout>
      <div className="bg-primary py-12">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl text-primary-foreground">Pastorale</h1>
          <p className="text-primary-foreground/70 mt-2">
            Corps pastoral de l'Église Évangélique du Congo
          </p>
        </div>
      </div>

      <section className="py-8 bg-cream">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-6">
            <main className="flex-1 min-w-0">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-gold rounded-full inline-block" />
                Annonces & Actualités
              </h2>
              <AnnoncesSection annonces={annonces} />
            </main>

            {membres.length > 0 && (
              <aside className="w-full lg:w-72 shrink-0">
                <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                  <div className="bg-[#2e7d32] px-4 py-3">
                    <h3 className="font-semibold text-white text-sm">Corps Pastoral</h3>
                  </div>
                  <div className="p-3 space-y-2">
                    {membres.map((m: any) => (
                      <div key={m.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/40">
                        <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-green-700">
                            {m.nom?.[0]}{m.prenom?.[0] || ""}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">{m.prenom} {m.nom}</p>
                          {m.fonction && <p className="text-[10px] text-muted-foreground truncate">{m.fonction}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PastoralePage;
