import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ConseilSynodalPage = () => {
  return (
    <Layout>
      <div className="bg-primary py-12">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl text-primary-foreground">Conseil Synodal</h1>
        </div>
      </div>
      <section className="py-8 bg-cream">
        <div className="container">
          <Tabs defaultValue="membres" className="w-full">
            <TabsList className="bg-card border border-border mb-6">
              <TabsTrigger value="membres">Membres</TabsTrigger>
              <TabsTrigger value="annonces">Annonces & Dates</TabsTrigger>
            </TabsList>
            <TabsContent value="membres">
              <p className="text-muted-foreground">Membres du conseil synodal.</p>
            </TabsContent>
            <TabsContent value="annonces">
              <p className="text-muted-foreground">Annonces et dates des conseils.</p>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default ConseilSynodalPage;
