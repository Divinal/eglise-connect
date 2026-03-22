import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, MapPin, Phone, Mail, Users, Music, Church, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Membre { id: string; nom: string; prenom: string | null; fonction: string | null; }

const MembresList = ({ membres }: { membres: Membre[] }) => {
  if (membres.length === 0)
    return <p className="text-sm text-muted-foreground py-6 text-center">Aucun membre enregistré.</p>;
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {membres.map(m => (
        <div key={m.id} className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-xs font-semibold text-primary">{m.nom[0]}{m.prenom?.[0] || ""}</span>
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

const ConsistoireParoisseInfoPage = () => {
  const { consistoireId, paroisseId } = useParams<{ consistoireId: string; paroisseId: string }>();
  const { roles, isAdminGeneral, loading } = useAuth();
  const navigate = useNavigate();
  const [paroisse, setParoisse] = useState<any>(null);
  const [membres, setMembres] = useState<Record<string, Membre[]>>({ bureau: [], conseil: [], organes: [] });
  const [groupes, setGroupes] = useState<any[]>([]);
  const [annexes, setAnnexes] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  const hasAccess = isAdminGeneral || roles.some(
    r => r.role === "coordinateur_consistoire" && r.scope_id === consistoireId
  );

  useEffect(() => {
    if (!loading && !hasAccess) navigate("/admin");
  }, [loading, hasAccess]);

  useEffect(() => {
    if (!paroisseId) return;
    const fetchAll = async () => {
      setFetching(true);

      const { data: par } = await (supabase as any)
        .from("paroisses").select("*").eq("id", paroisseId).maybeSingle();
      setParoisse(par);

      const { data: allMembres } = await (supabase as any)
        .from("membres").select("*")
        .eq("entity_type", "paroisse")
        .eq("entity_id", paroisseId);
      const grouped: Record<string, Membre[]> = { bureau: [], conseil: [], organes: [] };
      (allMembres || []).forEach((m: any) => {
        if (m.type === "bureau") grouped.bureau.push(m);
        else if (m.type === "conseil") grouped.conseil.push(m);
        else if (m.type === "organe") grouped.organes.push(m);
      });
      setMembres(grouped);

      const { data: grp } = await supabase.from("groupes_chantants")
        .select("*").eq("paroisse_id", paroisseId).order("name");
      setGroupes(grp || []);

      const { data: ann } = await supabase.from("annexes")
        .select("*").eq("paroisse_id", paroisseId).order("name");
      setAnnexes(ann || []);

      setFetching(false);
    };
    fetchAll();
  }, [paroisseId]);

  if (fetching) return (
    <Layout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Chargement…</p>
      </div>
    </Layout>
  );

  return (
    <Layout>
      {/* Header */}
      <div className="bg-primary py-8">
        <div className="container flex items-center gap-4">
          <Button variant="ghost" size="icon"
            onClick={() => navigate(`/admin/consistoire/${consistoireId}/paroisses`)}
            className="text-primary-foreground hover:bg-primary-foreground/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <p className="text-primary-foreground/60 text-xs mb-0.5">Paroisse</p>
            <h1 className="font-display text-2xl text-primary-foreground">{paroisse?.name}</h1>
          </div>
          {/* Badge lecture seule */}
          <span className="text-xs bg-primary-foreground/10 text-primary-foreground/70 px-3 py-1 rounded-full border border-primary-foreground/20">
            Lecture seule
          </span>
        </div>
      </div>

      <section className="py-8 bg-muted/30 min-h-[60vh]">
        <div className="container max-w-4xl">

          {/* Fiche infos */}
          {paroisse && (
            <div className="bg-card border border-border rounded-xl p-5 mb-6">
              <h2 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-3">
                Informations générales
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {paroisse.pasteur_responsable && (
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">Pasteur :</span>
                    <span className="font-medium">{paroisse.pasteur_responsable}</span>
                  </div>
                )}
                {paroisse.ville && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">Ville :</span>
                    <span className="font-medium">
                      {[paroisse.quartier, paroisse.ville, paroisse.departement].filter(Boolean).join(", ")}
                    </span>
                  </div>
                )}
                {paroisse.telephone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">Téléphone :</span>
                    <span className="font-medium">{paroisse.telephone}</span>
                  </div>
                )}
                {paroisse.email && (
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">Email :</span>
                    <span className="font-medium">{paroisse.email}</span>
                  </div>
                )}
                {paroisse.date_creation && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">Fondée le :</span>
                    <span className="font-medium">
                      {new Date(paroisse.date_creation).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Onglets membres */}
          <Tabs defaultValue="bureau" className="w-full">
            <TabsList className="bg-card border border-border mb-6 flex-wrap h-auto gap-1">
              <TabsTrigger value="bureau">Bureau</TabsTrigger>
              <TabsTrigger value="conseil">Conseil</TabsTrigger>
              <TabsTrigger value="organes">Organes</TabsTrigger>
              {groupes.length > 0 && (
                <TabsTrigger value="groupes">Groupes ({groupes.length})</TabsTrigger>
              )}
              {annexes.length > 0 && (
                <TabsTrigger value="annexes">Annexes ({annexes.length})</TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="bureau">
              <h3 className="font-semibold mb-3">Bureau Paroissial</h3>
              <MembresList membres={membres.bureau} />
            </TabsContent>

            <TabsContent value="conseil">
              <h3 className="font-semibold mb-3">Conseil Paroissial</h3>
              <MembresList membres={membres.conseil} />
            </TabsContent>

            <TabsContent value="organes">
              <h3 className="font-semibold mb-3">Organes Paroissiaux</h3>
              <MembresList membres={membres.organes} />
            </TabsContent>

            {groupes.length > 0 && (
              <TabsContent value="groupes">
                <h3 className="font-semibold mb-3">Groupes Chantants</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {groupes.map(g => (
                    <div key={g.id} className="p-4 bg-card border border-border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Music className="h-4 w-4 text-amber-600" />
                        <p className="font-medium text-sm">{g.name}</p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {g.total_membres != null && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">Total : {g.total_membres}</span>}
                        {g.hommes_actifs != null && <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full">H actifs : {g.hommes_actifs}</span>}
                        {g.femmes_actives != null && <span className="text-xs bg-pink-50 text-pink-700 px-2 py-0.5 rounded-full">F actives : {g.femmes_actives}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}

            {annexes.length > 0 && (
              <TabsContent value="annexes">
                <h3 className="font-semibold mb-3">Annexes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {annexes.map(a => (
                    <div key={a.id} className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg">
                      <Church className="h-4 w-4 text-green-600 shrink-0" />
                      <div>
                        <p className="font-medium text-sm">{a.name}</p>
                        {(a.quartier || a.ville) && (
                          <p className="text-xs text-muted-foreground">{[a.quartier, a.ville].filter(Boolean).join(", ")}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default ConsistoireParoisseInfoPage;
