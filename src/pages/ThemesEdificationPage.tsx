import Layout from "@/components/Layout";
import { BookOpen, Shield, Activity, TrendingUp, Heart, Globe, Users, Leaf, ChevronRight } from "lucide-react";

const THEMES = [
  {
    numero: "01",
    icon: <Shield className="h-7 w-7" />,
    couleur: "bg-red-700",
    titre: "L'Homosexualité",
    sous_titre: "Position biblique et pastorale de l'EEC",
    verset: "Romains 1 : 26-27",
    resume:
      "L'Église Évangélique du Congo réaffirme la vision biblique du mariage entre un homme et une femme. Face aux pressions culturelles modernes, l'EEC appelle ses fidèles à demeurer ancrés dans la Parole de Dieu tout en manifestant amour et compassion envers toute personne.",
    points: [
      "La Bible comme seule autorité sur la sexualité humaine",
      "Maintien de la sainteté dans le mariage biblique",
      "Accompagnement pastoral avec amour et vérité",
      "Refus de la condamnation, appel à la repentance et la grâce",
    ],
  },
  {
    numero: "02",
    icon: <Activity className="h-7 w-7" />,
    couleur: "bg-orange-600",
    titre: "Le Marathon de Prière",
    sous_titre: "Grand rassemblement intercesseur de l'EEC",
    verset: "1 Thessaloniciens 5 : 17",
    resume:
      "Le Marathon de Prière est l'un des grands moments de l'année évangélique. Pendant 24h à 72h, les fidèles de toute l'EEC se relaient en prière continue pour la nation congolaise, l'Église et le monde. Un temps fort de foi collective.",
    points: [
      "Intercession continue pour la République du Congo",
      "Veillées de prière dans toutes les paroisses",
      "Thèmes nationaux, familiaux et ecclésiaux couverts",
      "Moment d'unité et de renouveau spirituel",
    ],
  },
  {
    numero: "03",
    icon: <TrendingUp className="h-7 w-7" />,
    couleur: "bg-emerald-700",
    titre: "L'Économie Chrétienne",
    sous_titre: "Intendance, dîme et développement",
    verset: "Malachie 3 : 10 — Proverbes 3 : 9",
    resume:
      "L'EEC enseigne une vision biblique de l'économie : la fidélité dans la dîme et les offrandes, la gestion sage des ressources, et le développement communautaire comme expression de la foi en actes. Le chrétien est intendant, pas propriétaire.",
    points: [
      "La dîme : acte de foi et de confiance en Dieu",
      "Offrandes volontaires et projets communautaires",
      "Formation à la gestion financière des familles chrétiennes",
      "Le développement social comme mission de l'Église",
    ],
  },
  {
    numero: "04",
    icon: <Heart className="h-7 w-7" />,
    couleur: "bg-pink-700",
    titre: "La Famille Chrétienne",
    sous_titre: "Mariage, foyer et éducation des enfants",
    verset: "Josué 24 : 15",
    resume:
      "La famille est le fondement de l'Église et de la société. L'EEC promeut le mariage chrétien, l'éducation biblique des enfants et la construction de foyers solides fondés sur Christ. Des séminaires et retraites sont organisés annuellement pour les couples et les parents.",
    points: [
      "Séminaires de préparation au mariage chrétien",
      "Retraites de couples pour le renforcement du foyer",
      "Éducation des enfants dans la foi évangélique",
      "Accompagnement des familles en difficulté",
    ],
  },
  {
    numero: "05",
    icon: <Globe className="h-7 w-7" />,
    couleur: "bg-blue-700",
    titre: "L'Évangélisation",
    sous_titre: "Mission, témoignage et implantation d'Églises",
    verset: "Matthieu 28 : 19-20",
    resume:
      "La grande mission de l'EEC est d'annoncer l'Évangile à toutes les nations. Chaque année, des campagnes d'évangélisation sont organisées dans les villes et villages du Congo, appuyées par les champs d'évangélisation et les équipes missionnaires.",
    points: [
      "Campagnes d'évangélisation en plein air",
      "Implantation de nouvelles paroisses dans les zones non atteintes",
      "Formation d'évangélistes laïcs dans les consistoires",
      "Mission urbaine et rurale à travers tout le Congo",
    ],
  },
  {
    numero: "06",
    icon: <Users className="h-7 w-7" />,
    couleur: "bg-violet-700",
    titre: "La Réconciliation",
    sous_titre: "Paix, unité nationale et justice sociale",
    verset: "2 Corinthiens 5 : 18",
    resume:
      "L'EEC joue un rôle actif dans la promotion de la paix et de la réconciliation en République du Congo. L'Église est appelée à être un agent de réconciliation entre communautés, familles et nations, portant le message de paix de Christ.",
    points: [
      "Médiation dans les conflits communautaires",
      "Journées de réconciliation et pardon dans les paroisses",
      "Dialogue œcuménique avec les autres confessions chrétiennes",
      "Promotion de la justice sociale et des droits humains",
    ],
  },
  {
    numero: "07",
    icon: <Leaf className="h-7 w-7" />,
    couleur: "bg-teal-700",
    titre: "La Jeunesse dans la Foi",
    sous_titre: "Les jeunes face aux défis du monde moderne",
    verset: "1 Timothée 4 : 12",
    resume:
      "La jeunesse est l'avenir de l'Église. L'EEC investit dans la formation spirituelle, intellectuelle et citoyenne des jeunes à travers le CBE, les Kilombo et les groupes de jeunes. Un thème annuel guide la mobilisation de toute la jeunesse évangélique.",
    points: [
      "Conventions nationales de la jeunesse évangélique",
      "Formation biblique et théologique des jeunes leaders",
      "Engagement civique et social des jeunes chrétiens",
      "Lutte contre les addictions et les influences négatives",
    ],
  },
  {
    numero: "08",
    icon: <BookOpen className="h-7 w-7" />,
    couleur: "bg-amber-700",
    titre: "La Santé et la Vie",
    sous_titre: "Foi, santé communautaire et guérison divine",
    verset: "3 Jean 1 : 2",
    resume:
      "L'EEC gère des centres de santé et promeut une vision holistique de la santé : corps, âme et esprit. La guérison divine est affirmée, tout comme la responsabilité de prendre soin de son corps comme temple du Saint-Esprit. Des actions de santé publique sont menées régulièrement.",
    points: [
      "Gestion d'hôpitaux et centres de santé EEC",
      "Campagnes de santé communautaire gratuites",
      "Ministère de prière pour les malades dans les paroisses",
      "Éducation à la santé et à l'hygiène en milieu évangélique",
    ],
  },
];

const ThemesEdificationPage = () => {
  return (
    <Layout>
      {/* ── BANNIÈRE ── */}
      <div className="relative bg-primary text-primary-foreground py-14 md:py-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/banners/synode-banner.jpg')] bg-cover bg-center opacity-10" />
        <div className="relative container">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/20 border border-gold/40 mb-4">
            <BookOpen className="h-7 w-7 text-gold" />
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold mb-3">
            Grands Thèmes d'Édification
          </h1>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            Les 8 grands thèmes qui guident la vie spirituelle et sociale de l'Église Évangélique du Congo
          </p>
        </div>
      </div>

      <div className="bg-cream py-14">
        <div className="container max-w-5xl">

          {/* Intro */}
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12 text-base leading-relaxed">
            Chaque année, l'EEC structure sa vie communautaire autour de grands thèmes bibliques et sociaux.
            Ces thèmes guident la prédication, les formations et les actions de l'Église à travers tout le Congo.
          </p>

          {/* Grille des thèmes */}
          <div className="space-y-8">
            {THEMES.map((t) => (
              <div
                key={t.numero}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="grid md:grid-cols-[260px_1fr]">
                  {/* Panneau gauche coloré */}
                  <div className={`${t.couleur} text-white p-6 flex flex-col justify-between gap-4`}>
                    <div>
                      <span className="text-5xl font-display font-black opacity-30">{t.numero}</span>
                      <div className="mt-3 w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                        {t.icon}
                      </div>
                      <h3 className="font-display text-xl font-bold mt-3 leading-tight">{t.titre}</h3>
                      <p className="text-white/70 text-sm mt-1">{t.sous_titre}</p>
                    </div>
                    <div className="border-t border-white/20 pt-3">
                      <p className="text-xs text-white/60 uppercase tracking-wide mb-0.5">Verset clé</p>
                      <p className="text-sm font-semibold text-white/90 italic">{t.verset}</p>
                    </div>
                  </div>

                  {/* Panneau droit — contenu */}
                  <div className="p-6">
                    <p className="text-muted-foreground text-sm leading-relaxed mb-5">{t.resume}</p>
                    <ul className="space-y-2">
                      {t.points.map((p, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm text-foreground">
                          <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ThemesEdificationPage;
