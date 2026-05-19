import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Calendar, Tag } from "lucide-react";

interface Article {
  id: number;
  titre: string;
  categorie: string;
  date: string;
  extrait: string;
  image: string;
  auteur: string;
}

const articles: Article[] = [
  {
    id: 1,
    titre: "60e anniversaire du CBE",
    categorie: "Vie Synodale",
    date: "12 mai 2026",
    auteur: "Rédaction EEC",
    extrait:
      "Les délégués de toutes les régions se sont réunis pour le 22ème Synode de l'Église Évangélique du Congo. Trois jours d'échanges, de prière et de délibérations ont abouti à des résolutions historiques pour l'avenir de notre communauté.",
    image: "/blog/synode.jpg",
  },
  {
    id: 2,
    titre: "La Jeunesse de l'EEC : Gardiens de la Foi pour Demain",
    categorie: "Jeunesse",
    date: "28 avril 2026",
    auteur: "Département de la Jeunesse",
    extrait:
      "Le grand rassemblement de la jeunesse EEC a réuni plus de 2 000 jeunes venus des quatre coins du pays. Ateliers bibliques, concerts de louange et engagement missionnaire ont marqué cet événement qui restera gravé dans les mémoires.",
    image: "/blog/jeunesse.jpg",
  },
  {
    id: 3,
    titre: "Champs de Mission : L'EEC à l'œuvre dans les zones reculées",
    categorie: "Mission",
    date: "15 avril 2026",
    auteur: "Département de l'Évangélisation",
    extrait:
      "Nos équipes missionnaires ont atteint plusieurs villages isolés du Congo profond. Plantations d'Églises, soins médicaux et alphabétisation : découvrez le témoignage poignant de ces serviteurs engagés sur le terrain.",
    image: "/blog/mission.jpg",
  },
  {
    id: 4,
    titre: "Formation Pastorale à l'IFPN : Former les Serviteurs de Demain",
    categorie: "Formation",
    date: "5 avril 2026",
    auteur: "IFPN",
    extrait:
      "La nouvelle promotion de l'Institut de Formation Pastorale et de Nouvelles a officiellement commencé ses cours. 45 étudiants venus de 12 consistoires se forment pour servir l'Église avec excellence et intégrité.",
    image: "/blog/ifpn.jpg",
  },
  {
    id: 5,
    titre: "Diaspora EEC Europe : L'Église sans Frontières",
    categorie: "Diaspora",
    date: "20 mars 2026",
    auteur: "Bureau Synodal",
    extrait:
      "Les communautés EEC de la diaspora en Europe se sont retrouvées à Paris pour leur première convention continentale. Un moment fort d'unité, de partage et de renouvellement de l'engagement envers l'Église mère au Congo.",
    image: "/blog/diaspora.jpg",
  },
  {
    id: 6,
    titre: "Le Département de la Santé : Soigner Corps et Âme",
    categorie: "Santé",
    date: "8 mars 2026",
    auteur: "Département de la Santé",
    extrait:
      "Les hôpitaux et centres de santé de l'EEC ont soigné plus de 150 000 patients en 2025. Retour sur une année de dévouement et d'excellence médicale au service des plus vulnérables, dans l'esprit du Christ guérisseur.",
    image: "/blog/sante.jpg",
  },
];

const CATEGORIE_COULEURS: Record<string, string> = {
  "Vie Synodale": "bg-purple-100 text-purple-700",
  Jeunesse: "bg-yellow-100 text-yellow-700",
  Mission: "bg-green-100 text-green-700",
  Formation: "bg-blue-100 text-blue-700",
  Diaspora: "bg-teal-100 text-teal-700",
  Santé: "bg-red-100 text-red-700",
};

const BlogPage = () => {
  return (
    <Layout>
      {/* En-tête */}
      <div className="bg-primary py-12">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl text-primary-foreground">
            Blog EEC
          </h1>
          <p className="mt-2 text-primary-foreground/80 text-base">
            Actualités, témoignages et vie de l'Église Évangélique du Congo
          </p>
        </div>
      </div>

      {/* Grille d'articles */}
      <section className="py-12 bg-cream">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden flex flex-col hover:shadow-md transition-shadow"
              >
                {/* Image */}
                <div className="relative h-52 bg-muted overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.titre}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                  {/* Placeholder affiché si l'image n'est pas encore ajoutée */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted/80 text-muted-foreground text-sm gap-1">
                    <span className="text-3xl">🖼️</span>
                    <span>Photo à ajouter</span>
                    <span className="text-xs opacity-60">{article.image}</span>
                  </div>
                </div>

                {/* Contenu */}
                <div className="flex flex-col flex-1 p-5">
                  {/* Catégorie & date */}
                  <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <span
                      className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        CATEGORIE_COULEURS[article.categorie] ??
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <Tag className="h-3 w-3" />
                      {article.categorie}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {article.date}
                    </span>
                  </div>

                  {/* Titre */}
                  <h2 className="font-display text-base font-bold text-foreground mb-2 leading-snug">
                    {article.titre}
                  </h2>

                  {/* Extrait */}
                  <p className="text-sm text-muted-foreground flex-1 leading-relaxed mb-4">
                    {article.extrait}
                  </p>

                  {/* Auteur & lien */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-xs text-muted-foreground">
                      Par <span className="font-medium">{article.auteur}</span>
                    </span>
                    <Link
                      to={`/blog/${article.id}`}
                      className="text-xs font-semibold text-primary hover:underline"
                    >
                      Lire la suite →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BlogPage;
