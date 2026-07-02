import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, Clock, MapPin, Archive, ChevronDown } from "lucide-react";
import { sortByResponsabilite } from "@/lib/sortMembres";

const SYNODE_UUID     = "00000000-0000-0000-0000-000000000001"; // membres + planning
const SYNODE_ANN_ID   = "00000000-0000-0000-0000-000000000020"; // annonces synode
const CONSEIL_ANN_ID  = "00000000-0000-0000-0000-000000000021"; // annonces conseil
const SYNODE_INFO_ID  = "00000000-0000-0000-0000-000000000001"; // présentation

// ─── Bloc latéral générique avec "voir plus" ──────────────────────
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

const SynodePage = () => {
  const [bureau, setBureau] = useState<any[]>([]);
  const [planning, setPlanning] = useState<any[]>([]);
  const [archivesConseil, setArchivesConseil] = useState<any[]>([]);
  const [archivesSynode, setArchivesSynode] = useState<any[]>([]);
  const [annonces, setAnnonces] = useState<any[]>([]);
  const [presentation, setPresentation] = useState<{ role_attributions: string | null; bureau_description: string | null }>({ role_attributions: null, bureau_description: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);

      const { data: bureauData } = await (supabase.from("membres") as any).select("*")
        .eq("entity_type", "synode").eq("entity_id", SYNODE_UUID).eq("type", "bureau").order("nom");
      setBureau(sortByResponsabilite(bureauData || []));

      const { data: planData } = await (supabase as any).from("planning").select("*")
        .eq("entity_type", "synode").eq("entity_id", SYNODE_UUID).order("date_debut", { ascending: true });
      setPlanning(planData || []);

      const { data: archConseil } = await (supabase as any).from("archives").select("*")
        .eq("category", "conseil").order("date_evenement", { ascending: false });
      setArchivesConseil(archConseil || []);

      const { data: archSynode } = await (supabase as any).from("archives").select("*")
        .eq("category", "synode").order("date_evenement", { ascending: false });
      setArchivesSynode(archSynode || []);

      const { data: annSynode } = await (supabase as any).from("announcements").select("*")
        .eq("entity_type", "synode").eq("entity_id", SYNODE_ANN_ID).eq("status", "approved");
      const { data: annConseil } = await (supabase as any).from("announcements").select("*")
        .eq("entity_type", "synode").eq("entity_id", CONSEIL_ANN_ID).eq("status", "approved");
      const merged = [
        ...(annSynode || []).map((a: any) => ({ ...a, _source: "Synode" })),
        ...(annConseil || []).map((a: any) => ({ ...a, _source: "Conseil Synodal" })),
      ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setAnnonces(merged);

      const { data: presData } = await (supabase as any).from("synode_presentation").select("*").eq("id", SYNODE_INFO_ID).maybeSingle();
      setPresentation({ role_attributions: presData?.role_attributions || null, bureau_description: presData?.bureau_description || null });

      setLoading(false);
    };
    fetchAll();
  }, []);

  if (loading) return (
    <Layout><div className="flex items-center justify-center min-h-[60vh]"><p className="text-muted-foreground">Chargement…</p></div></Layout>
  );

  return (
    <Layout>
      {/* Header */}
      <div className="bg-primary py-10">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl text-primary-foreground">Le Synode National</h1>
          <p className="text-primary-foreground/70 mt-2 max-w-2xl text-sm">
            Instance suprême de l'Église Évangélique du Congo, réunissant le Bureau Synodal,
            le Conseil Synodal ainsi que les organes et commissions permanentes.
          </p>
        </div>
      </div>

      {/* Présentation */}
      {(presentation.role_attributions || presentation.bureau_description) && (
        <section className="py-10 bg-white border-b border-border">
          <div className="container max-w-3xl space-y-8">
            {presentation.role_attributions && (
              <div>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4 flex items-center gap-3">
                  <span className="w-1.5 h-7 bg-gold rounded-full inline-block shrink-0" />
                  Rôle et Attributions
                </h2>
                <p className="text-muted-foreground leading-relaxed text-base whitespace-pre-wrap">{presentation.role_attributions}</p>
              </div>
            )}
            {presentation.bureau_description && (
              <div>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-4 flex items-center gap-3">
                  <span className="w-1.5 h-7 bg-gold rounded-full inline-block shrink-0" />
                  Le Bureau Synodal
                </h2>
                <p className="text-muted-foreground leading-relaxed text-base whitespace-pre-wrap">{presentation.bureau_description}</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Layout 2 colonnes */}
      <section className="py-8 bg-[#f5f5f0]">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* ── COLONNE PRINCIPALE : Actualités & Informations ── */}
            <main className="flex-1 min-w-0">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-gold rounded-full inline-block"></span>
                Actualités & Informations
              </h2>
              {annonces.length === 0 ? (
                <div className="bg-white rounded-xl border border-border p-10 text-center">
                  <p className="text-muted-foreground text-sm">Aucune annonce pour le moment.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {annonces.map((a: any) => (
                    <div key={a.id} className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                      {a.image_url && <img src={a.image_url} alt={a.title} className="w-full h-56 object-cover" />}
                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                            a.type === "circulaire" ? "bg-[#2a6496] text-white" :
                            a.type === "convocation" ? "bg-amber-500 text-white" :
                            "bg-[#2e7d32] text-white"
                          }`}>{a.type}</span>
                          <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-muted text-muted-foreground">{a._source}</span>
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

            {/* ── COLONNE DROITE : 4 blocs ── */}
            <aside className="w-full lg:w-72 shrink-0 space-y-4">

              {/* 1. Bureau Synodal */}
              <SideBlock title="Bureau Synodal" color="bg-[#1a3a5c]" items={bureau}
                emptyMsg="Aucun membre du bureau."
                renderItem={(m) => (
                  <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/40 transition-colors">
                    {m.photo_url ? (
                      <img src={m.photo_url} alt={m.nom} className="w-9 h-9 rounded-full object-cover shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-primary">{m.nom[0]}{m.prenom?.[0] || ""}</span>
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{m.prenom} {m.nom}</p>
                      {m.fonction && <p className="text-[10px] text-muted-foreground truncate">{m.fonction}</p>}
                      {m.description && <p className="text-[10px] text-muted-foreground mt-0.5 leading-snug line-clamp-2">{m.description}</p>}
                    </div>
                  </div>
                )}
              />

              {/* 2. Planning & Activités Synodales */}
              <SideBlock title="Planning & Activités" color="bg-[#b45309]" items={planning}
                emptyMsg="Aucune activité planifiée."
                renderItem={(p) => (
                  <div className="p-2 rounded-lg hover:bg-muted/40 transition-colors">
                    <p className="text-xs font-semibold text-foreground leading-snug">{p.titre}</p>
                    <div className="flex flex-wrap gap-x-2 mt-0.5">
                      {p.date_debut && (
                        <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                          <CalendarDays className="h-2.5 w-2.5" />
                          {new Date(p.date_debut).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                        </span>
                      )}
                      {p.heure && (
                        <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                          <Clock className="h-2.5 w-2.5" />{p.heure}
                        </span>
                      )}
                      {p.lieu && (
                        <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground">
                          <MapPin className="h-2.5 w-2.5" />{p.lieu}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              />

              {/* 3. Archives du Conseil Synodal */}
              <SideBlock title="Conseil Synodal — Archives" color="bg-[#2a6496]" items={archivesConseil}
                emptyMsg="Aucune archive enregistrée."
                renderItem={(a) => (
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/40 transition-colors">
                    {a.photo_url ? (
                      <img src={a.photo_url} alt={a.titre} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <Archive className="h-4 w-4 text-blue-600" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{a.titre}</p>
                      {a.date_evenement && (
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(a.date_evenement).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              />

              {/* 4. Archives du Synode */}
              <SideBlock title="Synode — Archives" color="bg-[#5a4a8a]" items={archivesSynode}
                emptyMsg="Aucune archive enregistrée."
                renderItem={(a) => (
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/40 transition-colors">
                    {a.photo_url ? (
                      <img src={a.photo_url} alt={a.titre} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                        <Archive className="h-4 w-4 text-purple-600" />
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="text-xs font-medium truncate">{a.titre}</p>
                      {a.date_evenement && (
                        <p className="text-[10px] text-muted-foreground">
                          {new Date(a.date_evenement).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              />
            </aside>

          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SynodePage;
