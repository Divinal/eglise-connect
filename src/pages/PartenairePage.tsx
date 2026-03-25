import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Globe, Users, BookOpen, Heart, Clock } from "lucide-react";

const partenaires: Record<string, {
  name: string; fullName: string; description: string;
  icon: any; color: string; iconColor: string; headerColor: string;
  domaines: string[]; details?: string[];
}> = {
  cvaa: {
    name: "CVAA",
    fullName: "Communauté d'Églises en Mission",
    description: "CVAA est une organisation protestante internationale créée en 1971, regroupant plus de 35 Églises (réformées et luthériennes) en Afrique, Europe, Amérique latine et Pacifique. Elle promeut le partage, l'entraide et une mission « de partout vers partout », favorisant l'échange de pasteurs et de projets entre Églises membres.",
    icon: Globe,
    color: "border-l-blue-500",
    iconColor: "text-blue-600",
    headerColor: "bg-blue-600",
    domaines: ["Projets de développement", "Formation théologique", "Mission partagée"],
    details: [
      "Fondée en 1971, la CVAA regroupe plus de 35 Églises membres à travers le monde.",
      "Elle favorise l'échange de pasteurs, de ressources et de projets entre Églises membres.",
      "Son approche missionnaire est « de partout vers partout », sans distinction Nord-Sud.",
      "L'EEC est membre actif et bénéficie de formations et de partenariats avec des Églises sœurs.",
    ],
  },
  "federation-epc": {
    name: "Fédération des EPC",
    fullName: "Fédération des Églises et Missions Évangéliques du Congo",
    description: "La Fédération des Églises et Missions Évangéliques du Congo regroupe les principales dénominations protestantes et évangéliques de la République du Congo. Elle favorise la coopération interecclésiale et le témoignage commun de l'Évangile.",
    icon: Users,
    color: "border-l-green-500",
    iconColor: "text-green-600",
    headerColor: "bg-green-600",
    domaines: ["Coopération interecclésiale", "Témoignage évangélique", "Formation théologique"],
    details: [
      "La Fédération regroupe les principales dénominations protestantes du Congo.",
      "Elle coordonne les actions communes de témoignage et de service dans la nation.",
      "L'EEC est l'un des membres fondateurs de cette fédération.",
      "Des formations communes sont organisées pour les pasteurs et responsables d'Église.",
    ],
  },
  "plateforme-eeac": {
    name: "Plateforme des EEAC",
    fullName: "Plateforme des Églises Évangéliques d'Afrique Centrale",
    description: "La Plateforme a pour vocation la proclamation de l'Évangile, la justice et la transformation sociale. Elle collabore avec des alliances nationales et des Églises locales (Cameroun, RCA, Congo, Gabon) pour la formation, la mission et l'entraide communautaire.",
    icon: BookOpen,
    color: "border-l-amber-500",
    iconColor: "text-amber-600",
    headerColor: "bg-amber-600",
    domaines: ["Forum régional", "Évangélisation", "Dialogue avec les pouvoirs publics"],
    details: [
      "La Plateforme couvre plusieurs pays d'Afrique Centrale : Cameroun, RCA, Congo, Gabon.",
      "Elle organise des forums régionaux pour les Églises membres.",
      "Son action est axée sur l'évangélisation et la transformation sociale.",
      "Elle représente les Églises évangéliques auprès des institutions régionales.",
    ],
  },
  "conseil-oecumenisme": {
    name: "Conseil Œcuménisme ECC",
    fullName: "Conseil Œcuménique des Églises Chrétiennes du Congo",
    description: "Le Conseil Œcuménique des Églises Chrétiennes du Congo (COECC) est une plateforme de collaboration entre différentes dénominations chrétiennes au Congo-Brazzaville, axée sur l'unité, la prière et des actions sociales communes. Il œuvre pour la réconciliation, la justice et la paix.",
    icon: Heart,
    color: "border-l-rose-500",
    iconColor: "text-rose-600",
    headerColor: "bg-rose-600",
    domaines: ["Organisation de prières conjointes", "Cultes œcuméniques", "Collaboration dans des projets sociaux"],
    details: [
      "Le COECC rassemble les principales dénominations chrétiennes du Congo.",
      "Il organise des journées de prière et de méditation communes.",
      "Son action œcuménique favorise la réconciliation et la paix sociale.",
      "L'EEC participe activement aux instances de ce conseil.",
    ],
  },
  "partenariat-historique": {
    name: "Partenariat Historique",
    fullName: "Partenariats Historiques avec les Missions Suédoises",
    description: "Depuis sa fondation en 1909 par des missionnaires suédois (Svenska Missionsförbundet), l'EEC entretient des liens fraternels avec ses partenaires historiques en Scandinavie et en Europe. Ces relations nourrissent la formation théologique, l'échange de ressources et les projets de développement.",
    icon: Clock,
    color: "border-l-purple-500",
    iconColor: "text-purple-600",
    headerColor: "bg-purple-600",
    domaines: ["Missions suédoises", "Formation théologique", "Coopération internationale"],
    details: [
      "L'EEC a été fondée en 1909 par des missionnaires de la Svenska Missionsförbundet.",
      "Les liens avec les Églises suédoises et norvégiennes sont maintenus jusqu'à aujourd'hui.",
      "Ces partenariats soutiennent la formation des pasteurs et des théologiens congolais.",
      "Des échanges de ressources et des projets de développement sont régulièrement menés.",
    ],
  },
};

const PartenairePage = () => {
  const { slug } = useParams();
  const info = partenaires[slug || ""];

  if (!info) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <h1 className="font-display text-2xl text-foreground mb-4">Partenaire introuvable</h1>
          <p className="text-muted-foreground mb-6">Ce partenaire n'existe pas ou a été déplacé.</p>
          <Link
            to="/partenaires"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Voir tous les partenaires
          </Link>
        </div>
      </Layout>
    );
  }

  const Icon = info.icon;

  return (
    <Layout>
      {/* ── HEADER ── */}
      <div className="bg-primary py-12">
        <div className="container">
          <nav className="text-primary-foreground/60 text-sm mb-3">
            <Link to="/partenaires" className="hover:text-primary-foreground transition-colors">
              Partenaires
            </Link>
            <span className="mx-2">/</span>
            <span className="text-primary-foreground">{info.name}</span>
          </nav>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-xl">
              <Icon className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl text-primary-foreground">
                {info.name}
              </h1>
              <p className="text-primary-foreground/70 mt-1 text-sm italic">{info.fullName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── MISSION / DESCRIPTION ── */}
      <section className="py-6 bg-white border-b border-border">
        <div className="container">
          <div className={`border-l-4 ${info.color} pl-5 max-w-3xl`}>
            <h2 className="font-display text-lg font-semibold text-primary mb-2">
              À propos
            </h2>
            <p className="text-muted-foreground leading-relaxed text-sm">{info.description}</p>
          </div>
        </div>
      </section>

      {/* ── LAYOUT 2 COLONNES ── */}
      <section className="py-8 bg-[#f5f5f0]">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* ── COLONNE PRINCIPALE ── */}
            <main className="flex-1 min-w-0 space-y-5">
              <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                <span className="w-1 h-6 bg-gold rounded-full inline-block" />
                Informations détaillées
              </h2>

              <div className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-4">
                {(info.details || []).map((detail, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-foreground leading-relaxed">{detail}</p>
                  </div>
                ))}
              </div>

              {/* CTA contact */}
              <div className="bg-white rounded-xl border border-border shadow-sm p-6 text-center">
                <p className="text-muted-foreground text-sm mb-4">
                  Pour en savoir plus sur ce partenariat ou pour initier une collaboration, contactez-nous.
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Nous contacter
                </Link>
              </div>
            </main>

            {/* ── COLONNE DROITE ── */}
            <aside className="w-full lg:w-72 shrink-0 space-y-4">

              {/* Domaines */}
              <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                <div className={`${info.headerColor} px-4 py-3`}>
                  <h3 className="font-semibold text-white text-sm tracking-wide">
                    Domaines de partenariat
                  </h3>
                </div>
                <div className="p-3 space-y-1">
                  {info.domaines.map((d, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/40 transition-colors">
                      <span className="text-gold font-bold text-sm shrink-0 mt-0.5">→</span>
                      <p className="text-xs text-foreground leading-relaxed">{d}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Retour à la liste */}
              <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="bg-[#1a3a5c] px-4 py-3">
                  <h3 className="font-semibold text-white text-sm tracking-wide">
                    Autres partenaires
                  </h3>
                </div>
                <div className="p-3 space-y-1">
                  {Object.entries(partenaires)
                    .filter(([key]) => key !== slug)
                    .map(([key, p]) => (
                      <Link
                        key={key}
                        to={`/partenaires/${key}`}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-muted/40 transition-colors text-xs text-foreground"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                        {p.name}
                      </Link>
                    ))}
                </div>
              </div>

            </aside>
          </div>
        </div>
      </section>

    </Layout>
  );
};

export default PartenairePage;
