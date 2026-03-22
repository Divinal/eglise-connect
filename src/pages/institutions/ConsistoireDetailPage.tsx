import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Church, Users, MapPin, Phone, Mail, ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Consistoire {
  id: string;
  name: string;
  ville: string | null;
  responsable: string | null;
  telephone: string | null;
  email: string | null;
  description: string | null;
}

interface Membre {
  id: string;
  nom: string;
  prenom: string | null;
  fonction: string | null;
  genre: string | null;
}

interface Paroisse {
  id: string;
  name: string;
  ville: string | null;
  pasteur_responsable: string | null;
}

const MembresList = ({ membres }: { membres: Membre[] }) => {
  if (membres.length === 0)
    return <p className="text-muted-foreground text-sm py-6 text-center">Aucun membre enregistré.</p>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {membres.map(m => (
        <div key={m.id} className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-primary">
              {m.nom[0]}{m.prenom?.[0] || ""}
            </span>
          </div>
          <div>
            <p className="font-medium text-sm text-foreground">{m.prenom} {m.nom}</p>
            {m.fonction && <p className="text-xs text-muted-foreground">{m.fonction}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

const ConsistoireDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [consistoire, setConsistoire] = useState<Consistoire | null>(null);
  const [membres, setMembres] = useState<Record<string, Membre[]>>({
    bureau: [], conseil: [], organes: [], commissions: []
  });
  const [paroisses, setParoisses] = useState<Paroisse[]>([]);
  const [annonces, setAnnonces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchAll = async () => {
      setLoading(true);

      const { data: con } = await (supabase as any)
        .from("consistoires").select("*").eq("id", id).maybeSingle();
      setConsistoire(con);

      const { data: allMembres } = await (supabase as any)
        .from("membres").select("*")
        .eq("entity_type", "consistoire")
        .eq("entity_id", id);
      const grouped: Record<string, Membre[]> = { bureau: [], conseil: [], organes: [], commissions: [] };
      (allMembres || []).forEach((m: any) => {
        if (m.type === "bureau") grouped.bureau.push(m);
        else if (m.type === "conseil") grouped.conseil.push(m);
        else if (m.type === "organe") grouped.organes.push(m);
      });
      setMembres(grouped);

      const { data: pars } = await supabase
        .from("paroisses").select("id, name, ville, pasteur_responsable")
        .eq("consistoire_id", id).order("name");
      setParoisses((pars || []) as any);

      const { data: ann } = await (supabase as any)
        .from("announcements").select("*")
        .eq("entity_type", "consistoire")
        .eq("entity_id", id)
        .order("created_at", { ascending: false });
      setAnnonces(ann || []);

      setLoading(false);
    };
    fetchAll();
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Chargement…</p>
        </div>
      </Layout>
    );
  }

  if (!consistoire) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <Church className="h-16 w-16 text-muted-foreground/30" />
          <p className="text-muted-foreground">Consistoire introuvable.</p>
          <Button variant="outline" onClick={() => navigate("/institution/consistoires")}>
            <ArrowLeft className="h-4 w-4 mr-2" /> Retour aux consistoires
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-primary py-12">
        <div className="container">
          <button
            onClick={() => navigate("/institution/consistoires")}
            className="flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Tous les consistoires
          </button>
          <h1 className="font-display text-3xl md:text-4xl text-primary-foreground">
            {consistoire.name}
          </h1>
          {consistoire.description && (
            <p className="text-primary-foreground/70 mt-2 max-w-2xl">{consistoire.description}</p>
          )}
          <div className="flex flex-wrap gap-4 mt-4">
            {consistoire.ville && (
              <div className="flex items-center gap-1.5 text-primary-foreground/70 text-sm">
                <MapPin className="h-3.5 w-3.5" /> {consistoire.ville}
              </div>
            )}
            {consistoire.telephone && (
              <div className="flex items-center gap-1.5 text-primary-foreground/70 text-sm">
                <Phone className="h-3.5 w-3.5" /> {consistoire.telephone}
              </div>
            )}
            {consistoire.email && (
              <div className="flex items-center gap-1.5 text-primary-foreground/70 text-sm">
                <Mail className="h-3.5 w-3.5" /> {consistoire.email}
              </div>
            )}
            {consistoire.responsable && (
              <div className="flex items-center gap-1.5 text-primary-foreground/70 text-sm">
                <Users className="h-3.5 w-3.5" /> Coordinateur : {consistoire.responsable}
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="py-8 bg-cream">
        <div className="container">
          <Tabs defaultValue="bureau" className="w-full">
            <TabsList className="bg-card border border-border mb-6 flex-wrap h-auto gap-1">
              <TabsTrigger value="bureau">Bureau</TabsTrigger>
              <TabsTrigger value="conseil">Conseil</TabsTrigger>
              <TabsTrigger value="organes">Organes</TabsTrigger>
              <TabsTrigger value="paroisses">
                Paroisses {paroisses.length > 0 && `(${paroisses.length})`}
              </TabsTrigger>
              <TabsTrigger value="annonces">
                Annonces {annonces.length > 0 && `(${annonces.length})`}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="bureau">
              <h2 className="font-semibold text-lg mb-4">Bureau Consistorial</h2>
              <MembresList membres={membres.bureau} />
            </TabsContent>

            <TabsContent value="conseil">
              <h2 className="font-semibold text-lg mb-4">Conseil Consistorial</h2>
              <MembresList membres={membres.conseil} />
            </TabsContent>

            <TabsContent value="organes">
              <h2 className="font-semibold text-lg mb-4">Organes & Commissions</h2>
              <MembresList membres={membres.organes} />
            </TabsContent>

            <TabsContent value="paroisses">
              <h2 className="font-semibold text-lg mb-4">Paroisses du consistoire</h2>
              {paroisses.length === 0 ? (
                <p className="text-muted-foreground text-sm py-6 text-center">Aucune paroisse enregistrée.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {paroisses.map(p => (
                    <button
                      key={p.id}
                      onClick={() => navigate(`/paroisses/${p.id}`)}
                      className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg hover:border-primary/40 hover:shadow-sm transition-all text-left group"
                    >
                      <div className="p-2 rounded-lg bg-green-50 shrink-0">
                        <Church className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground">{p.name}</p>
                        <div className="flex gap-3">
                          {p.ville && <p className="text-xs text-muted-foreground">{p.ville}</p>}
                          {p.pasteur_responsable && <p className="text-xs text-muted-foreground">Pasteur : {p.pasteur_responsable}</p>}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0 group-hover:text-primary transition-colors" />
                    </button>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="annonces">
              <h2 className="font-semibold text-lg mb-4">Annonces & Circulaires</h2>
              {annonces.length === 0 ? (
                <p className="text-muted-foreground text-sm py-6 text-center">Aucune annonce.</p>
              ) : (
                <div className="space-y-4">
                  {annonces.map((a: any) => (
                    <div key={a.id} className="bg-card border border-border rounded-lg overflow-hidden">
                      {a.image_url && (
                        <img src={a.image_url} alt={a.title} className="w-full h-52 object-cover" />
                      )}
                      <div className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            a.type === "circulaire" ? "bg-blue-100 text-blue-700" :
                            a.type === "convocation" ? "bg-amber-100 text-amber-700" :
                            "bg-green-100 text-green-700"
                          }`}>{a.type}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(a.created_at).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                        <p className="font-semibold text-sm">{a.title}</p>
                        {a.content && <p className="text-sm text-muted-foreground mt-1">{a.content}</p>}
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

export default ConsistoireDetailPage;