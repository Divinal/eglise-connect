import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SynodePage = () => {
  return (
    <Layout>
      <div className="bg-primary py-12">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl text-primary-foreground">Le Synode</h1>
          <p className="text-primary-foreground/70 mt-2">Institution suprême de l'Église Évangélique du Congo</p>
        </div>
      </div>
      <section className="py-8 bg-cream">
        <div className="container">
          <Tabs defaultValue="annonces" className="w-full">
            <TabsList className="bg-card border border-border mb-6">
              <TabsTrigger value="annonces">Annonces</TabsTrigger>
              <TabsTrigger value="bureau">Bureau Synodal</TabsTrigger>
            </TabsList>
            <TabsContent value="annonces">
              <p className="text-muted-foreground">Les annonces et activités synodales apparaîtront ici.</p>
            </TabsContent>
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
