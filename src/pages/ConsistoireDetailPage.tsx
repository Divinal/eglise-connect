import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ConsistoireDetailPage = () => {
  const { id } = useParams();

  return (
    <Layout>
      <div className="bg-primary py-12">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl text-primary-foreground">
            Consistoire #{id}
          </h1>
        </div>
      </div>
      <section className="py-8 bg-cream">
        <div className="container">
          <Tabs defaultValue="annonces" className="w-full">
            <TabsList className="bg-card border border-border mb-6">
              <TabsTrigger value="annonces">Annonces</TabsTrigger>
              <TabsTrigger value="bureau">Bureau Consistorial</TabsTrigger>
              <TabsTrigger value="conseil">Conseil Consistorial</TabsTrigger>
              <TabsTrigger value="organes">Organes</TabsTrigger>
              <TabsTrigger value="commissions">Commissions</TabsTrigger>
              <TabsTrigger value="paroisses">Paroisses</TabsTrigger>
            </TabsList>

            <TabsContent value="annonces">
              <p className="text-muted-foreground">Les annonces du consistoire apparaîtront ici.</p>
            </TabsContent>
            <TabsContent value="bureau">
              <p className="text-muted-foreground">Membres du bureau consistorial.</p>
            </TabsContent>
            <TabsContent value="conseil">
              <p className="text-muted-foreground">Membres du conseil consistorial.</p>
            </TabsContent>
            <TabsContent value="organes">
              <p className="text-muted-foreground">Organes du consistoire.</p>
            </TabsContent>
            <TabsContent value="commissions">
              <p className="text-muted-foreground">Commissions du consistoire.</p>
            </TabsContent>
            <TabsContent value="paroisses">
              <p className="text-muted-foreground">Liste des paroisses de ce consistoire.</p>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default ConsistoireDetailPage;
