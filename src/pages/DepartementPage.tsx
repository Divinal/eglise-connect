import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { ChevronDown } from "lucide-react";

interface DepartementInfo {
  name: string; fullName: string; mission: string;
  activites: string[]; objectifs: string[]; couleur: string;
}

const departements: Record<string, DepartementInfo> = {
  dgep: {
    name: "DGEP", fullName: "Direction Générale de l'Évangélisation et des Paroisses",
    mission: "La DGEP est la cheville ouvrière de l'EEC. Elle supervise et coordonne l'ensemble des activités évangéliques et paroissiales à travers tout le territoire national, veillant à la cohérence doctrinale et à la vitalité spirituelle de l'Église.",
    activites: ["Supervision des consistoires et paroisses", "Coordination de l'évangélisation nationale", "Formation et supervision des pasteurs", "Suivi des statistiques d'église", "Organisation des campagnes évangéliques"],
    objectifs: ["Renforcer la vie spirituelle des paroisses", "Planter de nouvelles églises dans les zones non atteintes", "Former une nouvelle génération de responsables", "Favoriser le renouveau spirituel"],
    couleur: "border-l-primary",
  },
  sante: {
    name: "Santé", fullName: "Département de la Santé",
    mission: "Le Département de la Santé de l'EEC gère et coordonne les structures sanitaires de l'Église : dispensaires, maternités et centres de santé. Il œuvre pour l'accès aux soins des populations défavorisées en accord avec la vocation sociale de l'Évangile.",
    activites: ["Gestion des dispensaires et centres de santé EEC", "Campagnes de sensibilisation sanitaire", "Soins de santé primaires pour les communautés", "Formation des agents de santé communautaires", "Partenariats avec des ONG médicales"],
    objectifs: ["Assurer l'accès aux soins de qualité pour tous", "Réduire la mortalité infantile et maternelle", "Promouvoir la médecine préventive", "Renforcer les capacités des structures sanitaires"],
    couleur: "border-l-rose-500",
  },
  jeunesse: {
    name: "Jeunesse JEEC", fullName: "Département de la Jeunesse de l'Eglise Evangélique du Congo",
    mission: "Le Département de la Jeunesse de l'EEC mobilise et accompagne les jeunes chrétiens congolais dans leur croissance spirituelle, leur formation citoyenne et leur engagement social.",
    activites: ["Camps et retraites spirituelles pour jeunes", "Formations en leadership chrétien", "Rassemblements nationaux de jeunesse", "Activités sportives et culturelles", "Soutien à l'insertion professionnelle"],
    objectifs: ["Enraciner la foi de la jeune génération", "Former des leaders chrétiens responsables", "Lutter contre le chômage et la délinquance", "Favoriser l'engagement communautaire des jeunes"],
    couleur: "border-l-amber-500",
  },
  musique: {
    name: "Musique", fullName: "Département de la Musique et des Arts Sacrés",
    mission: "Le Département de la Musique promeut l'adoration à travers le chant, la musique instrumentale et les arts sacrés.",
    activites: ["Formation musicale (solfège, instruments)", "Organisation du Festival National de Chant Sacré", "Coordination des chorales de paroisses", "Production d'albums de louange EEC", "Formation de chefs de chœur"],
    objectifs: ["Élever le niveau musical des chorales", "Promouvoir la musique sacrée congolaise", "Former des musiciens d'église qualifiés", "Préserver le patrimoine musical de l'EEC"],
    couleur: "border-l-purple-500",
  },
  evangelisation: {
    name: "Évangélisation", fullName: "Département de l'Évangélisation",
    mission: "Le Département de l'Évangélisation est le fer de lance missionnaire de l'EEC.",
    activites: ["Campagnes d'évangélisation en plein air", "Évangélisation de rue et de quartier", "Formation d'évangélistes laïcs", "Mission dans les zones rurales", "Évangélisation par les médias"],
    objectifs: ["Porter l'Évangile à toute la nation congolaise", "Former et envoyer des évangélistes", "Ouvrir des points de mission dans les zones non atteintes", "Développer des outils d'évangélisation adaptés"],
    couleur: "border-l-green-500",
  },
  "femmes-famille": {
    name: "Femmes et Famille", fullName: "Département Femmes et Famille",
    mission: "Le Département Femmes et Famille accompagne les femmes chrétiennes et les familles de l'EEC.",
    activites: ["Groupes de prière et d'étude biblique féminins", "Formations en économie domestique et AGR", "Accompagnement des femmes en difficultés", "Retraites spirituelles pour femmes", "Sensibilisation contre les violences faites aux femmes"],
    objectifs: ["Renforcer la foi et le leadership des femmes", "Soutenir les familles chrétiennes en difficulté", "Promouvoir l'autonomisation économique des femmes", "Défendre la dignité de la femme selon l'Évangile"],
    couleur: "border-l-pink-500",
  },
  "education-chretienne": {
    name: "Éducation-Chrétienne", fullName: "Département de l'Éducation Chrétienne",
    mission: "Le Département de l'Éducation Chrétienne gère les établissements scolaires de l'EEC et supervise la formation catéchétique.",
    activites: ["Gestion des écoles primaires et secondaires de l'EEC", "Catéchisme pour enfants et adultes", "Formation des enseignants chrétiens", "Publications de matériel pédagogique", "École du dimanche dans les paroisses"],
    objectifs: ["Former des générations enracinées dans la foi", "Assurer une éducation de qualité dans les valeurs chrétiennes", "Renforcer la catéchèse dans toutes les paroisses", "Développer des outils pédagogiques adaptés"],
    couleur: "border-l-blue-500",
  },
  aumonerie: {
    name: "Aumônerie-Générale", fullName: "Département de l'Aumônerie Générale",
    mission: "Le Département de l'Aumônerie Générale assure une présence pastorale dans les milieux spécialisés.",
    activites: ["Aumônerie hospitalière", "Aumônerie carcérale (prisons et maisons d'arrêt)", "Aumônerie militaire et policière", "Accompagnement pastoral des personnes vulnérables", "Formation des aumôniers"],
    objectifs: ["Assurer une présence évangélique dans tous les milieux", "Accompagner les personnes en détresse", "Former des aumôniers qualifiés", "Plaider pour les droits des détenus et malades"],
    couleur: "border-l-teal-500",
  },
  communication: {
    name: "Communication", fullName: "Département de la Communication",
    mission: "Le Département de la Communication gère la communication interne et externe de l'EEC.",
    activites: ["Gestion du site web et des réseaux sociaux", "Production de bulletins et newsletters", "Relations avec les médias", "Couverture des événements ecclésiastiques", "Production audiovisuelle"],
    objectifs: ["Améliorer la communication de l'EEC", "Renforcer la présence numérique", "Assurer une information transparente", "Valoriser les actions de l'Église"],
    couleur: "border-l-orange-500",
  },
};

// Bloc latéral avec "voir plus"
const SideBlock = ({ title, color, items, renderItem, emptyMsg }: {
  title: string; color: string; items: any[];
  renderItem: (item: any, i: number) => React.ReactNode; emptyMsg?: string;
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
            {visible.map((item, i) => <div key={i}>{renderItem(item, i)}</div>)}
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

const DepartementPage = () => {
  const { slug } = useParams();
  const info = departements[slug || ""];
  const [annonces, setAnnonces] = useState<any[]>([]);

  useEffect(() => {
    if (!info) return;
    supabase.from("departments").select("id").eq("slug", slug || "").maybeSingle()
      .then(({ data }) => {
        if (!data?.id) return;
        supabase.from("announcements")
          .select("*")
          .eq("entity_type", "departement")
          .eq("entity_id", data.id)
          .order("created_at", { ascending: false })
          .then(({ data: ann }) => setAnnonces(ann || []));
      });
  }, [slug, info]);

  if (!info) return (
    <Layout>
      <div className="container py-20 text-center">
        <h1 className="font-display text-2xl text-foreground">Département introuvable</h1>
      </div>
    </Layout>
  );

  return (
    <Layout>
      {/* Header */}
      <div className="bg-primary py-12">
        <div className="container">
          <nav className="text-primary-foreground/60 text-sm mb-3">
            <span>Départements</span><span className="mx-2">/</span>
            <span className="text-primary-foreground">{info.name}</span>
          </nav>
          <h1 className="font-display text-3xl md:text-4xl text-primary-foreground">{info.name}</h1>
          <p className="text-primary-foreground/70 mt-1 text-sm italic">{info.fullName}</p>
        </div>
      </div>

      {/* Mission */}
      <section className="py-6 bg-white border-b border-border">
        <div className="container">
          <div className={`border-l-4 ${info.couleur} pl-5 max-w-3xl`}>
            <h2 className="font-display text-lg font-semibold text-primary mb-2">Notre Mission</h2>
            <p className="text-muted-foreground leading-relaxed text-sm">{info.mission}</p>
          </div>
        </div>
      </section>

      {/* Layout 2 colonnes */}
      <section className="py-8 bg-[#f5f5f0]">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* ── COLONNE PRINCIPALE : Annonces ── */}
            <main className="flex-1 min-w-0">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-1 h-6 bg-gold rounded-full inline-block"></span>
                Annonces & Actualités
              </h2>
              {annonces.length === 0 ? (
                <div className="bg-white rounded-xl border border-border p-10 text-center">
                  <p className="text-muted-foreground text-sm">Aucune annonce pour ce département.</p>
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

            {/* ── COLONNE DROITE : Activités + Objectifs ── */}
            <aside className="w-full lg:w-72 shrink-0 space-y-4">

              <SideBlock
                title="Activités principales"
                color="bg-[#1a3a5c]"
                items={info.activites}
                emptyMsg="Aucune activité."
                renderItem={(a, i) => (
                  <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/40 transition-colors">
                    <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-xs text-foreground leading-relaxed">{a}</p>
                  </div>
                )}
              />

              <SideBlock
                title="Objectifs stratégiques"
                color="bg-[#2e7d32]"
                items={info.objectifs}
                emptyMsg="Aucun objectif."
                renderItem={(o) => (
                  <div className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/40 transition-colors">
                    <span className="text-gold font-bold text-sm shrink-0 mt-0.5">→</span>
                    <p className="text-xs text-foreground leading-relaxed">{o}</p>
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

export default DepartementPage;