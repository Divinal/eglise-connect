import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { ExternalLink, Globe, Users, BookOpen, Heart, Clock } from "lucide-react";

const partenaires = [
  {
    slug: "cvaa",
    name: "CVAA",
    fullName: "Communauté d'Églises en Mission",
    description: "CVAA est une organisation protestante internationale créée en 1971, regroupant plus de 35 Églises (réformées et luthériennes) en Afrique, Europe, Amérique latine et Pacifique. Elle promeut le partage, l'entraide et une mission « de partout vers partout », favorisant l'échange de pasteurs et de projets entre Églises membres.",
    icon: Globe,
    color: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600",
    domaines: ["projets de développement", "Formation théologique", "Mission partagée"],
  },
  {
    slug: "federation-epc",
    name: "Fédération des EPC",
    fullName: "Fédération des Églises et Missions Évangéliques du Congo",
    description:"",
    icon: Users,
    color: "bg-green-50 border-green-200",
    iconColor: "text-green-600",
    domaines: ["Coopération interecclésiale", "Témoignage évangélique", "Formation théologique"],
  },
  {
    slug: "plateforme-eeac",
    name: "Plateforme des EEAC",
    fullName: "Plateforme des Églises Évangéliques d'Afrique Centrale",
    description:"La Plateforme a pour vocation la proclamation de l'Évangile, la justice et la transformation sociale. Elle collabore avec des alliances nationales et des églises locales (Cameroun, RCA, Congo, Gabon) pour la formation, la mission et l'entraide communautaire.",
    icon: BookOpen,
    color: "bg-amber-50 border-amber-200",
    iconColor: "text-amber-600",
    domaines: ["Forum régional", "Évangélisation", "Dialogue avec les pouvoirs publics"],
  },
  {
    slug: "conseil-oecumenisme",
    name: "Conseil Œcuménisme ECC",
    fullName: "Conseil œcuménique des Eglises Chrétiennes du Congo",
    description:"Le Conseil Œcuménique des Églises Chrétiennes du Congo (COECC) est une plateforme de collaboration entre différentes dénominations chrétiennes au Congo-Brazzaville, axée sur l'unité, la prière et des actions sociales communes. Il œuvre pour la réconciliation, la justice et la paix, notamment à travers des partenariats pour la traduction biblique et des journées de méditation.",
    icon: Heart,
    color: "bg-rose-50 border-rose-200",
    iconColor: "text-rose-600",
    domaines: ["Organisation de prières conjointes", "cultes œcuméniques", "collaboration dans des projets sociaux"],
  },
  {
    slug: "partenariat-historique",
    name: "Partenariat Historique",
    fullName: "Partenariats Historiques avec les Missions Suédoises",
    description:
      "Depuis sa fondation en 1909 par des missionnaires suédois (Svenska Missionsförbundet), l'EEC entretient des liens fraternels avec ses partenaires historiques en Scandinavie et en Europe. Ces relations nourissent la formation théologique, l'échange de ressources et les projets de développement.",
    icon: Clock,
    color: "bg-purple-50 border-purple-200",
    iconColor: "text-purple-600",
    domaines: ["Missions suédoises", "Formation théologique", "Coopération internationale"],
  },
];

const PartenairesPage = () => {
  return (
    <Layout>
      <div className="bg-primary py-12">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl text-primary-foreground">Partenaires</h1>
          <p className="text-primary-foreground/70 mt-2">
            Les organisations partenaires de l'Église Évangélique du Congo
          </p>
        </div>
      </div>

      {/* Intro */}
      <section className="py-10 bg-cream border-b border-border">
        <div className="container max-w-3xl text-center">
          <p className="text-muted-foreground text-lg leading-relaxed">
            L'Église Évangélique du Congo œuvre en partenariat avec plusieurs organisations nationales,
            régionales et internationales, partageant les mêmes valeurs d'évangile, de solidarité et de
            développement humain intégral.
          </p>
        </div>
      </section>

      {/* Partners List */}
      <section className="py-12 bg-background">
        <div className="container">
          <div className="space-y-8">
            {partenaires.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.slug}
                  id={p.slug}
                  className={`rounded-xl border-2 ${p.color} p-6 md:p-8 transition-shadow hover:shadow-md`}
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className={`flex-shrink-0 flex items-start`}>
                      <div className="p-4 rounded-xl bg-white shadow-sm">
                        <Icon className={`h-8 w-8 ${p.iconColor}`} />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h2 className="font-display text-xl font-bold text-foreground">{p.name}</h2>
                        <span className="text-sm text-muted-foreground font-medium">— {p.fullName}</span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed mb-4">{p.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {p.domaines.map((d) => (
                          <span
                            key={d}
                            className="inline-flex items-center px-3 py-1 rounded-full bg-white border border-border text-xs font-medium text-foreground"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-primary/5 border-t border-border">
        <div className="container text-center">
          <h3 className="font-display text-2xl text-primary mb-3">Vous souhaitez devenir partenaire ?</h3>
          <p className="text-muted-foreground mb-6">
            L'EEC est ouverte à tout partenariat qui contribue à sa mission évangélique et sociale.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
          >
            Nous contacter
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default PartenairesPage;
