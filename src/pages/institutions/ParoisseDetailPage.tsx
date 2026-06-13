import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Church, Users, MapPin, Phone, Mail, ArrowLeft, Music, Calendar, ChevronRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { slugify } from "@/utils/slugify";

interface Paroisse {
  id: string; name: string; ville: string | null; departement: string | null;
  quartier: string | null; rue: string | null; telephone: string | null;
  email: string | null; pasteur_responsable: string | null;
  date_creation: string | null; description: string | null; consistoire_id: string;
}
interface Membre { id: string; nom: string; prenom: string | null; fonction: string | null; }

const SideBlock = ({ title, color, items, renderItem, emptyMsg }: {
  title: string; color: string; items: any[];
  renderItem: (item: any) => React.ReactNode; emptyMsg?: string;
}) => {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? items : items.slice(0, 3);
  return (
    <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
      <div className={`${color} px-4 py-3`}>
        <h3 className="font-semibold text-white text-sm tracking-wide">{title}</h3>
      </div>
      <div className="p-3 space-y-1">
        {items.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-3">{emptyMsg || "Aucun élément."}</p>
        ) : (
          <>
            {visible.map((item, i) => <div key={item.id || i}>{renderItem(item)}</div>)}
            {items.length > 3 && (
              <button onClick={() => setShowAll(!showAll)}
                className="w-full flex items-center justify-center gap-1 text-xs text-primary hover:text-primary/80 pt-2 font-medium transition-colors">
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

const ParoisseDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [paroisse, setParoisse] = useState<Paroisse | null>(null);
  const [consistoireName, setConsistoireName] = useState("");
  const [membres, setMembres] = useState<Record<string, Membre[]>>({ bureau: [], conseil: [], organes: [] });
  const [groupes, setGroupes] = useState<any[]>([]);
  const [annexes, setAnnexes] = useState<any[]>([]);
  const [annonces, setAnnonces] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    const fetchAll = async () => {
      setLoading(true);
      const { data: allPars } = await (supabase as any).from("paroisses").select("*");
      const par = (allPars || []).find((p: any) => slugify(p.name) === slug) || null;
      setParoisse(par);
      const uuid = par?.id;
      if (!uuid) { setLoading(false); return; }

      if (par?.consistoire_id) {
        const { data: con } = await supabase.from("consistoires").select("name").eq("id", par.consistoire_id).maybeSingle();
        setConsistoireName((con as any)?.name || "");
      }
      const { data: allMembres } = await (supabase as any).from("membres").select("*")
        .eq("entity_type", "paroisse").eq("entity_id", uuid);
      const grouped: Record<string, Membre[]> = { bureau: [], conseil: [], organes: [] };
      (allMembres || []).forEach((m: any) => {
        if (m.type === "bureau") grouped.bureau.push(m);
        else if (m.type === "conseil") grouped.conseil.push(m);
        else if (m.type === "organe") grouped.organes.push(m);
      });
      setMembres(grouped);
      const { data: grp } = await supabase.from("groupes_chantants").select("*").eq("paroisse_id", uuid).order("name");
      setGroupes(grp || []);
      const { data: ann } = await supabase.from("annexes").select("*").eq("paroisse_id", uuid).order("name");
      setAnnexes(ann || []);
      const { data: annonceData } = await (supabase as any).from("announcements").select("*")
        .eq("entity_type", "paroisse").eq("entity_id", uuid).order("created_at", { ascending: false });
      setAnnonces(annonceData || []);
      setLoading(false);
    };
    fetchAll();
  }, [slug]);

  if (loading) return (
    <Layout><div className="flex items-center justify-center min-h-[60vh]"><p className="text-muted-foreground">Chargement…</p></div></Layout>
  );

  if (!paroisse) return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Church className="h-16 w-16 text-muted-foreground/30" />
        <p className="text-muted-foreground">Paroisse introuvable.</p>
        <Button variant="outline" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4 mr-2" />Retour</Button>
      </div>
    </Layout>
  );

  return (
    <Layout>
      {/* Header */}
      <div className="bg-primary py-10">
        <div className="container">
          <button onClick={() => navigate(`/institution/consistoires/${slugify(consistoireName)}`)}
            className="flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground text-sm mb-4 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            {consistoireName ? `Consistoire ${consistoireName}` : "Retour"}
          </button>
          <h1 className="font-display text-3xl md:text-4xl text-primary-foreground">{paroisse.name}</h1>
          {paroisse.description && <p className="text-primary-foreground/70 mt-2 max-w-2xl text-sm">{paroisse.description}</p>}
          <div className="flex flex-wrap gap-4 mt-4">
            {paroisse.ville && (
              <div className="flex items-center gap-1.5 text-primary-foreground/70 text-sm">
                <MapPin className="h-3.5 w-3.5" />
                {[paroisse.quartier, paroisse.ville, paroisse.departement].filter(Boolean).join(", ")}
              </div>
            )}
            {paroisse.telephone && <div className="flex items-center gap-1.5 text-primary-foreground/70 text-sm"><Phone className="h-3.5 w-3.5" />{paroisse.telephone}</div>}
            {paroisse.email && <div className="flex items-center gap-1.5 text-primary-foreground/70 text-sm"><Mail className="h-3.5 w-3.5" />{paroisse.email}</div>}
            {paroisse.pasteur_responsable && <div className="flex items-center gap-1.5 text-primary-foreground/70 text-sm"><Users className="h-3.5 w-3.5" />Pasteur : {paroisse.pasteur_responsable}</div>}
            {paroisse.date_creation && (
              <div className="flex items-center gap-1.5 text-primary-foreground/70 text-sm">
                <Calendar className="h-3.5 w-3.5" />
                Fondée le {new Date(paroisse.date_creation).toLocaleDateString("fr-FR")}
              </div>
            )}
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
                  <p className="text-muted-foreground text-sm">Aucune annonce pour cette paroisse.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {annonces.map((a: any) => (
                    <div key={a.id} className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                      {a.image_url && <img src={a.image_url} alt={a.title} className="w-full h-56 object-cover" />}
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
                        {a.content && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{a.content}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </main>

            {/* ── COLONNE DROITE : blocs info ── */}
            <aside className="w-full lg:w-72 shrink-0 space-y-4">

              <SideBlock title="Bureau Paroissial" color="bg-[#1a3a5c]" items={membres.bureau}
                emptyMsg="Aucun membre du bureau."
                renderItem={(m) => (
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/40 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-primary">{m.nom[0]}{m.prenom?.[0] || ""}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{m.prenom} {m.nom}</p>
                      {m.fonction && <p className="text-[10px] text-muted-foreground truncate">{m.fonction}</p>}
                    </div>
                  </div>
                )}
              />

              <SideBlock title="Conseil Paroissial" color="bg-[#2a6496]" items={membres.conseil}
                emptyMsg="Aucun membre du conseil."
                renderItem={(m) => (
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/40 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-blue-700">{m.nom[0]}{m.prenom?.[0] || ""}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{m.prenom} {m.nom}</p>
                      {m.fonction && <p className="text-[10px] text-muted-foreground truncate">{m.fonction}</p>}
                    </div>
                  </div>
                )}
              />

              <SideBlock title="Organes Paroissiaux" color="bg-[#5a4a8a]" items={membres.organes}
                emptyMsg="Aucun organe enregistré."
                renderItem={(m) => (
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/40 transition-colors">
                    <div className="w-7 h-7 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-purple-700">{m.nom[0]}{m.prenom?.[0] || ""}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{m.prenom} {m.nom}</p>
                      {m.fonction && <p className="text-[10px] text-muted-foreground truncate">{m.fonction}</p>}
                    </div>
                  </div>
                )}
              />

              {groupes.length > 0 && (
                <SideBlock title={`Groupes Chantants (${groupes.length})`} color="bg-[#b45309]" items={groupes}
                  renderItem={(g) => (
                    <div className="p-2 rounded-lg hover:bg-muted/40 transition-colors">
                      <div className="flex items-center gap-2">
                        <Music className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        <p className="text-xs font-medium truncate">{g.name}</p>
                      </div>
                      {g.total_membres != null && (
                        <p className="text-[10px] text-muted-foreground ml-5">Total : {g.total_membres}</p>
                      )}
                    </div>
                  )}
                />
              )}

              {annexes.length > 0 && (
                <SideBlock title={`Annexes (${annexes.length})`} color="bg-[#2e7d32]" items={annexes}
                  renderItem={(a) => (
                    <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/40 transition-colors">
                      <Church className="h-3.5 w-3.5 text-green-600 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium truncate">{a.name}</p>
                        {(a.quartier || a.ville) && (
                          <p className="text-[10px] text-muted-foreground truncate">{[a.quartier, a.ville].filter(Boolean).join(", ")}</p>
                        )}
                      </div>
                    </div>
                  )}
                />
              )}
            </aside>

          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ParoisseDetailPage;