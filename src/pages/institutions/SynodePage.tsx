import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import AnnoncesSection from "@/components/AnnoncesSection";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SynodePage = () => {
  const [annonces, setAnnonces] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("announcements")
      .select("*")
      .eq("entity_type", "synode")
      .order("created_at", { ascending: false })
      .then(({ data }) => setAnnonces(data || []));
  }, []);

  return (
    <Layout>
      <div className="bg-primary py-12">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl text-primary-foreground">Le Synode</h1>
          <p className="text-primary-foreground/70 mt-2">Institution suprême de l'Église Évangélique du Congo</p>
        </div>
      </div>

      {/* Annonces affichées directement */}
      <section className="py-8 bg-cream/50 border-b border-border">
        <div className="container max-w-3xl">
          <h2 className="font-display text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            📢 Annonces & Actualités
          </h2>
          <AnnoncesSection annonces={annonces} />
        </div>
      </section>

      <section className="py-8 bg-cream">
        <div className="container">
          <Tabs defaultValue="bureau" className="w-full">
            <TabsList className="bg-card border border-border mb-6">
              <TabsTrigger value="bureau">Bureau Synodal</TabsTrigger>
            </TabsList>
            <TabsContent value="bureau">
              <p className="text-muted-foreground">Membres du bureau synodal.</p>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default SynodePage;
