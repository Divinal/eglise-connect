import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import AnnoncesSection from "@/components/AnnoncesSection";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Shield, Building2, Megaphone, FileText } from "lucide-react";

const SYNODE_UUID    = "00000000-0000-0000-0000-000000000001"; // membres
const SYNODE_ANN_ID  = "00000000-0000-0000-0000-000000000020"; // annonces synode
const CONSEIL_ANN_ID = "00000000-0000-0000-0000-000000000021"; // annonces conseil

const MembreCard = ({ m }: { m: any }) => (
  <div className="bg-card border border-border rounded-xl p-5 flex items-start gap-4">
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
);

const MembresGrid = ({ membres, emptyMsg }: { membres: any[]; emptyMsg: string }) => (
  membres.length === 0 ? (
    <div className="text-center py-12 text-muted-foreground text-sm">{emptyMsg}</div>
  ) : (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {membres.map((m: any) => <MembreCard key={m.id} m={m} />)}
    </div>
  )
);

const SynodePage = () => {
  const [bureau, setBureau] = useState<any[]>([]);
  const [conseil, setConseil] = useState<any[]>([]);
  const [organes, setOrganes] = useState<any[]>([]);
  const [annoncesSynode, setAnnoncesSynode] = useState<any[]>([]);
  const [annoncesConseil, setAnnoncesConseil] = useState<any[]>([]);

  useEffect(() => {
    (supabase.from("membres") as any).select("*")
      .eq("entity_type", "synode").eq("entity_id", SYNODE_UUID).eq("type", "bureau").order("nom")
      .then(({ data }: any) => setBureau(data || []));

    (supabase.from("membres") as any).select("*")
      .eq("entity_type", "synode").eq("entity_id", SYNODE_UUID).eq("type", "conseil").order("nom")
      .then(({ data }: any) => setConseil(data || []));

    (supabase.from("membres") as any).select("*")
      .eq("entity_type", "synode").eq("entity_id", SYNODE_UUID).eq("type", "organe").order("nom")
      .then(({ data }: any) => setOrganes(data || []));

    (supabase.from("announcements") as any).select("*")
      .eq("entity_type", "synode").eq("entity_id", SYNODE_ANN_ID).eq("status", "approved")
      .order("created_at", { ascending: false })
      .then(({ data }: any) => setAnnoncesSynode(data || []));

    (supabase.from("announcements") as any).select("*")
      .eq("entity_type", "synode").eq("entity_id", CONSEIL_ANN_ID).eq("status", "approved")
      .order("created_at", { ascending: false })
      .then(({ data }: any) => setAnnoncesConseil(data || []));
  }, []);

  return (
    <Layout>
      <div className="bg-primary py-12">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl text-primary-foreground">Le Synode National</h1>
          <p className="text-primary-foreground/70 mt-2 max-w-2xl">
            Instance suprême de l'Église Évangélique du Congo, réunissant le Bureau Synodal,
            le Conseil Synodal ainsi que les organes et commissions permanentes.
          </p>
        </div>
      </div>

      {/* Présentation */}
      <section className="py-10 bg-cream border-b border-border">
        <div className="container max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-primary mb-4">Rôle et Attributions</h2>
          <div className="prose prose-sm text-muted-foreground space-y-3">
            <p>
              Le <strong className="text-foreground">Synode</strong> est l'instance suprême délibérante de
              l'EEC. Entre ses sessions, le <strong className="text-foreground">Conseil Synodal</strong> assure
              la continuité de ses orientations, tandis que le <strong className="text-foreground">Bureau
              Synodal</strong> — composé du Président National, du Vice-Président, du Secrétaire Général et
              de ses adjoints, ainsi que du Trésorier Général — en est l'organe exécutif permanent.
            </p>
            <p>
              Le Bureau supervise l'exécution des décisions du Synode et du Conseil Synodal, représente
              officiellement l'EEC auprès des autorités civiles, religieuses et des partenaires, et coordonne
              les activités des différents départements, consistoires et institutions.
            </p>
          </div>
        </div>
      </section>

      {/* Onglets */}
      <section className="py-8 bg-background">
        <div className="container">
          <Tabs defaultValue="bureau" className="w-full">
            <TabsList className="bg-card border border-border mb-6 flex-wrap h-auto">
              <TabsTrigger value="bureau" className="gap-2">
                <User className="h-4 w-4" /> Bureau Synodal
              </TabsTrigger>
              <TabsTrigger value="conseil" className="gap-2">
                <Shield className="h-4 w-4" /> Conseil Synodal
              </TabsTrigger>
              <TabsTrigger value="organes" className="gap-2">
                <Building2 className="h-4 w-4" /> Organes & Commissions
              </TabsTrigger>
              <TabsTrigger value="annonces" className="gap-2">
                <Megaphone className="h-4 w-4" /> Annonces Synodales
              </TabsTrigger>
              <TabsTrigger value="annonces-conseil" className="gap-2">
                <FileText className="h-4 w-4" /> Annonces du Conseil
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bureau">
              <MembresGrid membres={bureau} emptyMsg="Aucun membre du bureau enregistré pour le moment." />
            </TabsContent>

            <TabsContent value="conseil">
              <MembresGrid membres={conseil} emptyMsg="Aucun membre du conseil enregistré pour le moment." />
            </TabsContent>

            <TabsContent value="organes">
              <MembresGrid membres={organes} emptyMsg="Aucun organe ou commission enregistré pour le moment." />
            </TabsContent>

            <TabsContent value="annonces">
              <div className="max-w-2xl">
                <AnnoncesSection annonces={annoncesSynode} />
              </div>
            </TabsContent>

            <TabsContent value="annonces-conseil">
              <div className="max-w-2xl">
                <AnnoncesSection annonces={annoncesConseil} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default SynodePage;
