import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Church, Users, MapPin, Phone, Mail, ArrowLeft, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Consistoire {
  id: string; name: string; ville: string | null; responsable: string | null;
  telephone: string | null; email: string | null; description: string | null;
}
interface Membre { id: string; nom: string; prenom: string | null; fonction: string | null; }
interface Paroisse { id: string; name: string; ville: string | null; pasteur_responsable: string | null; }

// Bloc latéral générique avec "voir plus"
const SideBlock = ({
  title, color, items, renderItem, emptyMsg, onMore
}: {
  title: string;
  color: string;
  items: any[];
  renderItem: (item: any) => React.ReactNode;
  emptyMsg?: string;
  onMore?: () => void;
}) => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? items : items.slice(0, 3);

  return (
    <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden mb-4">
      {/* En-tête coloré */}
      <div className={`${color} px-4 py-3`}>
        <h3 className="font-semibold text-white text-sm tracking-wide">{title}</h3>
      </div>
      <div className="p-3 space-y-2">
        {items.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-3">{emptyMsg || "Aucun élément."}</p>
        ) : (
          <>
            {visible.map((item, i) => (
              <div key={item.id || i}>{renderItem(item)}</div>
            ))}
            {items.length > 3 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full flex items-center justify-center gap-1 text-xs text-primary hover:text-primary/80 pt-1 font-medium transition-colors"
              >
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showAll ? "rotate-180" : ""}`} />
                {showAll ? "Voir moins" : `Voir plus (${items.length - 3})`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const ConsistoireDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [consistoire, setConsistoire] = useState<Consistoire | null>(null);
  const [membres, setMembres] = useState<Record<string, Membre[]>>({ bureau: [], conseil: [], organes: [] });
  const [paroisses, setParoisses] = useState<Paroisse[]>([]);
  const [annonces, setAnnonces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchAll = async () => {
      setLoading(true);
      const { data: con } = await (supabase as any).from("consistoires").select("*").eq("id", id).maybeSingle();
      setConsistoire(con);

      const { data: allMembres } = await (supabase as any).from("membres").select("*")
        .eq("entity_type", "consistoire").eq("entity_id", id);
      const grouped: Record<string, Membre[]> = { bureau: [], conseil: [], organes: [] };
      (allMembres || []).forEach((m: any) => {
        if (m.type === "bureau") grouped.bureau.push(m);
        else if (m.type === "conseil") grouped.conseil.push(m);
        else if (m.type === "organe") grouped.organes.push(m);
      });
      setMembres(grouped);

      const { data: pars } = await supabase.from("paroisses")
        .select("id, name, ville, pasteur_responsable").eq("consistoire_id", id).order("name");
      setParoisses((pars || []) as any);

      const { data: ann } = await (supabase as any).from("announcements").select("*")
        .eq("entity_type", "consistoire").eq("entity_id", id)
        .order("created_at", { ascending: false });
      setAnnonces(ann || []);
      setLoading(false);
    };
    fetchAll();
  }, [id]);

  if (loading) return (
    <Layout><div className="flex items-center justify-center min-h-[60vh]"><p className="text-muted-foreground">Chargement…</p></div></Layout>
  );

  if (!consistoire) return (
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

  return (
    <Layout>
      {/* Header */}
      <div className="bg-primary py-10">
        <div className="container">
          <button onClick={() => navigate("/institution/consistoires")}
            className="flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground text-sm mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4" /> Tous les consistoires
          </button>
          <h1 className="font-display text-3xl md:text-4xl text-primary-foreground">{consistoire.name}</h1>
          {consistoire.description && (
            <p className="text-primary-foreground/70 mt-2 max-w-2xl text-sm">{consistoire.description}</p>
          )}
          <div className="flex flex-wrap gap-4 mt-4">
            {consistoire.ville && <div className="flex items-center gap-1.5 text-primary-foreground/70 text-sm"><MapPin className="h-3.5 w-3.5" />{consistoire.ville}</div>}
            {consistoire.telephone && <div className="flex items-center gap-1.5 text-primary-foreground/70 text-sm"><Phone className="h-3.5 w-3.5" />{consistoire.telephone}</div>}
            {consistoire.email && <div className="flex items-center gap-1.5 text-primary-foreground/70 text-sm"><Mail className="h-3.5 w-3.5" />{consistoire.email}</div>}
            {consistoire.responsable && <div className="flex items-center gap-1.5 text-primary-foreground/70 text-sm"><Users className="h-3.5 w-3.5" />Coordinateur : {consistoire.responsable}</div>}
          </div>
        </div>
      </div>

      {/* Layout 2 colonnes */}
      <section className="py-8 bg-[#f5f5f0]">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-6">

                        {/* ── COLONNE PRINCIPALE : Annonces ── */}
            <main className="flex-1 min-w-0">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-gold rounded-full inline-block"></span>
                Annonces & Circulaires
              </h2>

              {annonces.length === 0 ? (
                <div className="bg-white rounded-xl border border-border p-10 text-center">
                  <p className="text-muted-foreground text-sm">Aucune annonce pour ce consistoire.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {annonces.map((a: any) => (
                    <div key={a.id} className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                      {a.image_url && (
                        <img src={a.image_url} alt={a.title} className="w-full h-56 object-cover" />
                      )}
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                            a.type === "circulaire" ? "bg-[#2a6496] text-white" :
                            a.type === "convocation" ? "bg-amber-500 text-white" :
                            "bg-[#2e7d32] text-white"
                          }`}>{a.type}</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(a.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                          </span>
                        </div>
                        <h3 className="font-semibold text-base text-foreground">{a.title}</h3>
                        {a.content && (
                          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{a.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </main>

            {/* ── COLONNE GAUCHE : blocs info ── */}
            <aside className="w-full lg:w-72 shrink-0 space-y-0">

              {/* Bureau */}
              <SideBlock
                title="Bureau Consistorial"
                color="bg-[#1a3a5c]"
                items={membres.bureau}
                renderItem={(m) => (
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/40 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-primary">{m.nom[0]}{m.prenom?.[0] || ""}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{m.prenom} {m.nom}</p>
                      {m.fonction && <p className="text-[10px] text-muted-foreground truncate">{m.fonction}</p>}
                    </div>
                  </div>
                )}
                emptyMsg="Aucun membre du bureau."
              />

              {/* Conseil */}
              <SideBlock
                title="Conseil Consistorial"
                color="bg-[#2a6496]"
                items={membres.conseil}
                renderItem={(m) => (
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/40 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-blue-700">{m.nom[0]}{m.prenom?.[0] || ""}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{m.prenom} {m.nom}</p>
                      {m.fonction && <p className="text-[10px] text-muted-foreground truncate">{m.fonction}</p>}
                    </div>
                  </div>
                )}
                emptyMsg="Aucun membre du conseil."
              />

              {/* Organes */}
              <SideBlock
                title="Organes & Commissions"
                color="bg-[#5a4a8a]"
                items={membres.organes}
                renderItem={(m) => (
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/40 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-purple-700">{m.nom[0]}{m.prenom?.[0] || ""}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{m.prenom} {m.nom}</p>
                      {m.fonction && <p className="text-[10px] text-muted-foreground truncate">{m.fonction}</p>}
                    </div>
                  </div>
                )}
                emptyMsg="Aucun organe enregistré."
              />

              {/* Paroisses */}
              <SideBlock
                title={`Paroisses (${paroisses.length})`}
                color="bg-[#2e7d32]"
                items={paroisses}
                renderItem={(p) => (
                  <button
                    onClick={() => navigate(`/paroisses/${p.id}`)}
                    className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-muted/40 transition-colors text-left group"
                  >
                    <div className="p-1.5 rounded-md bg-green-50 shrink-0">
                      <Church className="h-3 w-3 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground truncate">{p.name}</p>
                      {p.ville && <p className="text-[10px] text-muted-foreground">{p.ville}</p>}
                    </div>
                    <ChevronRight className="h-3 w-3 text-muted-foreground/40 shrink-0 group-hover:text-primary transition-colors" />
                  </button>
                )}
                emptyMsg="Aucune paroisse enregistrée."
              />
            </aside>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ConsistoireDetailPage;