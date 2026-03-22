import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Church, Users, MapPin, Phone, Mail, ArrowLeft, Music, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Paroisse {
  id: string;
  name: string;
  ville: string | null;
  departement: string | null;
  quartier: string | null;
  rue: string | null;
  telephone: string | null;
  email: string | null;
  pasteur_responsable: string | null;
  date_creation: string | null;
  description: string | null;
  consistoire_id: string;
}

interface Membre {
  id: string;
  nom: string;
  prenom: string | null;
  fonction: string | null;
}

const MembresList = ({ membres, emptyMsg }: { membres: Membre[]; emptyMsg?: string }) => {
  if (membres.length === 0)
    return <p className="text-muted-foreground text-sm py-6 text-center">{emptyMsg || "Aucun membre enregistré."}</p>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {membres.map(m => (
        <div key={m.id} className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-sm font-semibold text-primary">{m.nom[0]}{m.prenom?.[0] || ""}</span>
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

const ParoisseDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [paroisse, setParoisse] = useState<Paroisse | null>(null);
  const [consistoireName, setConsistoireName] = useState("");
  const [membres, setMembres] = useState<Record<string, Membre[]>>({ bureau: [], conseil: [], organes: [] });
  const [groupes, setGroupes] = useState<any[]>([]);
  const [annexes, setAnnexes] = useState<any[]>([]);
  const [annonces, setAnnonces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchAll = async () => {
      setLoading(true);

      // Infos paroisse
      const { data: par } = await (supabase as any)
        .from("paroisses").select("*").eq("id", id).maybeSingle();
      setParoisse(par);

      // Nom du consistoire
      if (par?.consistoire_id) {
        const { data: con } = await supabase.from("consistoires")
          .select("name").eq("id", par.consistoire_id).maybeSingle();
        setConsistoireName((con as any)?.name || "");
      }

      // Membres par type
      const { data: allMembres } = await (supabase as any)
        .from("membres").select("*")
        .eq("entity_type", "paroisse")
        .eq("entity_id", id);
      const grouped: Record<string, Membre[]> = { bureau: [], conseil: [], organes: [] };
      (allMembres || []).forEach((m: any) => {
        if (m.type === "bureau") grouped.bureau.push(m);
        else if (m.type === "conseil") grouped.conseil.push(m);
        else if (m.type === "organe") grouped.organes.push(m);
      });
      setMembres(grouped);

      // Groupes chantants
      const { data: grp } = await supabase.from("groupes_chantants")
        .select("*").eq("paroisse_id", id).order("name");
      setGroupes(grp || []);

      // Annexes
      const { data: ann } = await supabase.from("annexes")
        .select("*").eq("paroisse_id", id).order("name");
      setAnnexes(ann || []);

      // Annonces
      const { data: annonceData } = await (supabase as any)
        .from("announcements").select("*")
        .eq("entity_type", "paroisse")
        .eq("entity_id", id)
        .order("created_at", { ascending: false });
      setAnnonces(annonceData || []);

      setLoading(false);
    };
    fetchAll();
  }, [id]);

  if (loading) return (
    <Layout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Chargement…</p>
      </div>
    </Layout>
  );

  if (!paroisse) return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Church className="h-16 w-16 text-muted-foreground/30" />
        <p className="text-muted-foreground">Paroisse introuvable.</p>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Retour
        </Button>
      </div>
    </Layout>
  );

  return (
    <Layout>
      {/* Header */}
      <div className="bg-primary py-12">
        <div className="container">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground text-sm mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {consistoireName ? `Consistoire ${consistoireName}` : "Retour"}
          </button>
          <h1 className="font-display text-3xl md:text-4xl text-primary-foreground">
            {paroisse.name}
          </h1>
          {paroisse.description && (
            <p className="text-primary-foreground/70 mt-2 max-w-2xl">{paroisse.description}</p>
          )}

          {/* Infos rapides */}
          <div className="flex flex-wrap gap-4 mt-4">
            {paroisse.ville && (
              <div className="flex items-center gap-1.5 text-primary-foreground/70 text-sm">
                <MapPin className="h-3.5 w-3.5" />
                {[paroisse.quartier, paroisse.ville, paroisse.departement].filter(Boolean).join(", ")}
              </div>
            )}
            {paroisse.telephone && (
              <div className="flex items-center gap-1.5 text-primary-foreground/70 text-sm">
                <Phone className="h-3.5 w-3.5" /> {paroisse.telephone}
              </div>
            )}
            {paroisse.email && (
              <div className="flex items-center gap-1.5 text-primary-foreground/70 text-sm">
                <Mail className="h-3.5 w-3.5" /> {paroisse.email}
              </div>
            )}
            {paroisse.pasteur_responsable && (
              <div className="flex items-center gap-1.5 text-primary-foreground/70 text-sm">
                <Users className="h-3.5 w-3.5" /> Pasteur : {paroisse.pasteur_responsable}
              </div>
            )}
            {paroisse.date_creation && (
              <div className="flex items-center gap-1.5 text-primary-foreground/70 text-sm">
                <Calendar className="h-3.5 w-3.5" />
                Fondée le {new Date(paroisse.date_creation).toLocaleDateString("fr-FR")}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contenu */}
      <section className="py-8 bg-cream">
        <div className="container">
          <Tabs defaultValue="bureau" className="w-full">
            <TabsList className="bg-card border border-border mb-6 flex-wrap h-auto gap-1">
              <TabsTrigger value="bureau">Bureau</TabsTrigger>
              <TabsTrigger value="conseil">Conseil</TabsTrigger>
              <TabsTrigger value="organes">Organes</TabsTrigger>
              {groupes.length > 0 && (
                <TabsTrigger value="groupes">
                  Groupes chantants ({groupes.length})
                </TabsTrigger>
              )}
              {annexes.length > 0 && (
                <TabsTrigger value="annexes">
                  Annexes ({annexes.length})
                </TabsTrigger>
              )}
              <TabsTrigger value="annonces">
                Annonces {annonces.length > 0 && `(${annonces.length})`}
              </TabsTrigger>
            </TabsList>

            {/* Bureau */}
            <TabsContent value="bureau">
              <h2 className="font-semibold text-lg mb-4">Bureau Paroissial</h2>
              <MembresList membres={membres.bureau} />
            </TabsContent>

            {/* Conseil */}
            <TabsContent value="conseil">
              <h2 className="font-semibold text-lg mb-4">Conseil Paroissial</h2>
              <MembresList membres={membres.conseil} />
            </TabsContent>

            {/* Organes */}
            <TabsContent value="organes">
              <h2 className="font-semibold text-lg mb-4">Organes Paroissiaux</h2>
              <MembresList membres={membres.organes} />
            </TabsContent>

            {/* Groupes chantants */}
            {groupes.length > 0 && (
              <TabsContent value="groupes">
                <h2 className="font-semibold text-lg mb-4">Groupes Chantants</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groupes.map(g => (
                    <div key={g.id} className="p-4 bg-card border border-border rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-amber-50 shrink-0">
                          <Music className="h-4 w-4 text-amber-600" />
                        </div>
                        <p className="font-semibold text-sm">{g.name}</p>
                      </div>
                      {g.description && <p className="text-xs text-muted-foreground mb-3">{g.description}</p>}
                      {(g.total_membres || g.hommes_actifs || g.femmes_actives) && (
                        <div className="flex flex-wrap gap-2">
                          {g.total_membres != null && (
                            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                              Total : {g.total_membres}
                            </span>
                          )}
                          {g.hommes_actifs != null && (
                            <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">
                              H actifs : {g.hommes_actifs}
                            </span>
                          )}
                          {g.femmes_actives != null && (
                            <span className="text-xs bg-pink-50 text-pink-700 px-2 py-0.5 rounded-full">
                              F actives : {g.femmes_actives}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}

            {/* Annexes */}
            {annexes.length > 0 && (
              <TabsContent value="annexes">
                <h2 className="font-semibold text-lg mb-4">Annexes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {annexes.map(a => (
                    <div key={a.id} className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg">
                      <div className="p-2 rounded-lg bg-green-50 shrink-0">
                        <Church className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{a.name}</p>
                        {(a.quartier || a.ville) && (
                          <p className="text-xs text-muted-foreground">
                            {[a.quartier, a.ville].filter(Boolean).join(", ")}
                          </p>
                        )}
                        {a.responsable && (
                          <p className="text-xs text-muted-foreground">Resp. : {a.responsable}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}

            {/* Annonces */}
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

export default ParoisseDetailPage;