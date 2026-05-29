import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import AnnoncesSection from "@/components/AnnoncesSection";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Megaphone } from "lucide-react";

const SYNODE_UUID = "00000000-0000-0000-0000-000000000001";

const ConseilSynodalPage = () => {
  const [annonces, setAnnonces] = useState<any[]>([]);
  const [membres, setMembres] = useState<any[]>([]);

  useEffect(() => {
    // Annonces propres au Conseil Synodal
    supabase.from("announcements")
      .select("*")
      .eq("entity_type", "synode")
      .eq("entity_id", "conseil_synodal")
      .order("created_at", { ascending: false })
      .then(({ data }) => setAnnonces(data || []));

    // Membres du conseil synodal
    (supabase.from("membres") as any)
      .select("*")
      .eq("entity_type", "synode")
      .eq("entity_id", SYNODE_UUID)
      .eq("type", "conseil")
      .order("nom")
      .then(({ data }: any) => setMembres(data || []));
  }, []);

  return (
    <Layout>
      <div className="bg-primary py-12">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl text-primary-foreground">Conseil Synodal</h1>
          <p className="text-primary-foreground/70 mt-2">
            Organe délibérant de l'Église Évangélique du Congo entre les sessions du Synode
          </p>
        </div>
      </div>

      {/* Annonces du Conseil */}
      <section className="py-8 bg-cream/50 border-b border-border">
        <div className="container max-w-3xl">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" />
            Annonces & Dates
          </h2>
          <AnnoncesSection annonces={annonces} />
        </div>
      </section>

      {/* Onglets */}
      <section className="py-8 bg-cream">
        <div className="container">
          <Tabs defaultValue="membres" className="w-full">
            <TabsList className="bg-card border border-border mb-6">
              <TabsTrigger value="membres" className="gap-2">
                <User className="h-4 w-4" /> Membres
              </TabsTrigger>
            </TabsList>

            <TabsContent value="membres">
              {membres.length === 0 ? (
                <p className="text-muted-foreground text-sm">Aucun membre enregistré pour le moment.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {membres.map((m: any) => (
                    <div key={m.id} className="bg-card border border-border rounded-xl p-5 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-sm font-bold text-primary">
                          {(m.prenom?.[0] || "")}{m.nom?.[0] || ""}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{m.prenom} {m.nom}</p>
                        {m.fonction && <p className="text-xs text-primary mt-0.5">{m.fonction}</p>}
                        {m.telephone && <p className="text-xs text-muted-foreground mt-1">{m.telephone}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default ConseilSynodalPage;
