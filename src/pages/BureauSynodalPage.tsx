import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AnnoncesSection from "@/components/AnnoncesSection";
import { User, Calendar, FileText } from "lucide-react";

const SYNODE_UUID    = "00000000-0000-0000-0000-000000000001";
const SYNODE_ANN_ID = "00000000-0000-0000-0000-000000000020";

const BureauSynodalPage = () => {
  const [membres, setMembres] = useState<any[]>([]);
  const [annonces, setAnnonces] = useState<any[]>([]);
  const [circulaires, setCirculaires] = useState<any[]>([]);

  useEffect(() => {
    // Membres du bureau synodal
    (supabase.from("membres") as any)
      .select("*")
      .eq("entity_type", "synode")
      .eq("entity_id", SYNODE_UUID)
      .eq("type", "bureau")
      .order("nom")
      .then(({ data }: any) => setMembres(data || []));

    // Annonces (hors circulaires)
    (supabase.from("announcements") as any)
      .select("*")
      .eq("entity_type", "synode")
      .eq("entity_id", SYNODE_ANN_ID)
      .neq("type", "circulaire")
      .order("created_at", { ascending: false })
      .then(({ data }: any) => setAnnonces(data || []));

    // Circulaires uniquement
    (supabase.from("announcements") as any)
      .select("*")
      .eq("entity_type", "synode")
      .eq("entity_id", SYNODE_ANN_ID)
      .eq("type", "circulaire")
      .order("created_at", { ascending: false })
      .then(({ data }: any) => setCirculaires(data || []));
  }, []);

  return (
    <Layout>
      <div className="bg-primary py-12">
        <div className="container">
          <nav className="text-primary-foreground/60 text-sm mb-3">
            <span>Institution</span>
            <span className="mx-2">/</span>
            <span className="text-primary-foreground">Bureau Synodal</span>
          </nav>
          <h1 className="font-display text-3xl md:text-4xl text-primary-foreground">Bureau Synodal</h1>
          <p className="text-primary-foreground/70 mt-2">
            Organe exécutif permanent de l'Église Évangélique du Congo
          </p>
        </div>
      </div>

      {/* Présentation */}
      <section className="py-10 bg-cream border-b border-border">
        <div className="container max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-primary mb-4">Rôle et Attributions</h2>
          <div className="prose prose-sm text-muted-foreground space-y-3">
            <p>
              Le <strong className="text-foreground">Bureau Synodal</strong> est l'organe exécutif
              permanent de l'EEC, chargé d'assurer la gestion courante de l'Église entre les sessions
              du Conseil Synodal. Il est composé du Président National, du Vice-Président, du Secrétaire
              Général et de ses adjoints, ainsi que du Trésorier Général.
            </p>
            <p>
              Il supervise l'exécution des décisions du Synode et du Conseil Synodal, représente
              officiellement l'EEC auprès des autorités civiles, religieuses et des partenaires,
              et coordonne les activités des différents départements.
            </p>
          </div>
        </div>
      </section>

      {/* Onglets */}
      <section className="py-8 bg-background">
        <div className="container">
          <Tabs defaultValue="membres" className="w-full">
            <TabsList className="bg-card border border-border mb-6">
              <TabsTrigger value="membres" className="gap-2">
                <User className="h-4 w-4" /> Membres
              </TabsTrigger>
              <TabsTrigger value="annonces" className="gap-2">
                <Calendar className="h-4 w-4" /> Annonces & Dates
              </TabsTrigger>
              <TabsTrigger value="circulaires" className="gap-2">
                <FileText className="h-4 w-4" /> Circulaires
              </TabsTrigger>
            </TabsList>

            {/* Membres */}
            <TabsContent value="membres">
              {membres.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">
                  Aucun membre enregistré pour le moment.
                </div>
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

            {/* Annonces */}
            <TabsContent value="annonces">
              <div className="max-w-2xl">
                <AnnoncesSection annonces={annonces} />
              </div>
            </TabsContent>

            {/* Circulaires */}
            <TabsContent value="circulaires">
              <div className="max-w-2xl">
                <AnnoncesSection annonces={circulaires} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default BureauSynodalPage;
