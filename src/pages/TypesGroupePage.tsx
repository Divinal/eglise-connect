import Layout from "@/components/Layout";
import { Music, Users, BookOpen, Star, ChevronRight, Info, GraduationCap, Compass } from "lucide-react";

const STRUCTURE_COMMUNE = [
  { titre: "Président(e) / Responsable", desc: "Anime et coordonne la vie du groupe, représente le groupe auprès du bureau de la paroisse." },
  { titre: "Secrétaire",                  desc: "Tient les registres de présence, rédige les comptes rendus et gère la correspondance du groupe." },
  { titre: "Trésorier(ère)",              desc: "Gère les cotisations, les offrandes propres au groupe et rend compte au conseil de la paroisse." },
  { titre: "Conseillers",                 desc: "Appuient le responsable dans les décisions et assurent la discipline et le suivi des membres." },
];

const ACTIVITES_COMMUNES = [
  "Réunion hebdomadaire de prière et de méditation biblique",
  "Participation aux cultes dominicaux et événements de la paroisse",
  "Cotisations et soutien mutuel entre membres",
  "Retraites et conventions annuelles (par consistoire ou au niveau national)",
  "Actions de solidarité et d'entraide dans la communauté",
  "Formation spirituelle encadrée par le pasteur ou l'évangéliste",
];

const GROUPES = [
  {
    icon: <Music className="h-8 w-8" />,
    couleur: "bg-primary",
    nom: "La Chorale",
    role: "Louange musicale et chant sacré",
    description:
      "La Chorale est le groupe musical officiel de la paroisse. Elle anime les cultes dominicaux, les cérémonies et les événements spéciaux par le chant liturgique et l'adoration musicale.",
    specificites: [
      "Répétitions régulières (souvent le samedi ou en semaine)",
      "Répertoire varié : cantiques, gospel, chants en langues locales (lingala, kituba)",
      "Participation aux concours et festivals de chorales de l'EEC",
      "Rôle central dans l'animation du culte et la louange collective",
      "Direction assurée par un chef de chœur formé",
    ],
    verset: "Psaume 150 : 1-6",
  },
  {
    icon: <Star className="h-8 w-8" />,
    couleur: "bg-amber-700",
    nom: "Le Kilombo",
    role: "Groupe de chant — au style de l'EEC",
    description:
      "Le Kilombo est le groupe avec les tradition et style unique à l'EEC. Il vise à former des personnes de foi, responsables et engagés dans la société. C'est un espace de fraternité, de formation et d'action.",
    specificites: [
      "Rassemblement dans les paroisses",
      "Formation à la responsabilité, au leadership et à la foi",
      "Actions communautaires : nettoyage, aide aux personnes âgées, soutien aux veuves",
      "Participation aux conventions nationales des biKilombo",
      "Engagement dans l'évangélisation et témoignage",
    ],
    verset: "1 Timothée 4 : 12",
  },
  {
    icon: <BookOpen className="h-8 w-8" />,
    couleur: "bg-blue-700",
    nom: "Le CBE",
    role: "Corps Biblique d'Évangélisation",
    description:
      "Le CBE est le groupe dédié à l'étude approfondie de la Bible et à l'évangélisation. Ses membres sont formés à la connaissance des Écritures pour mieux témoigner et annoncer l'Évangile.",
    specificites: [
      "Études bibliques systématiques et approfondies",
      "Formation à l'évangélisation et au témoignage personnel",
      "Visites à domicile, dans les hôpitaux et les prisons",
      "Animation de cultes d'évangélisation en dehors de la paroisse",
      "Préparation de futurs évangélistes et enseignants bibliques",
    ],
    verset: "2 Timothée 2 : 15",
  },
  {
    icon: <GraduationCap className="h-8 w-8" />,
    couleur: "bg-green-700",
    nom: "Ecodi",
    role: "École du Dimanche — Formation des enfants dans la foi",
    description:
      "L'Ecodi (École du Dimanche) est le groupe dédié à l'éducation biblique et spirituelle des enfants de la paroisse. Elle se réunit chaque dimanche en parallèle du culte principal pour instruire les enfants dans la foi chrétienne selon leur tranche d'âge.",
    specificites: [
      "Accueil des enfants de 4 à 15 ans selon les tranches d'âge",
      "Enseignement biblique adapté avec histoires, chants et activités",
      "Formation de moniteurs et monitrices dévoués",
      "Célébrations spéciales : Noël, Pâques, fête des enfants",
      "Intégration progressive des enfants dans la vie de l'Église",
    ],
    verset: "Proverbes 22 : 6",
  },
  {
    icon: <Compass className="h-8 w-8" />,
    couleur: "bg-indigo-700",
    nom: "EUC",
    role: "Éclaireurs Unionistes du Congo — Jeunesse et engagement",
    description:
      "L'EUC (Éclaireurs Unionistes du Congo) est le mouvement scout évangélique de l'EEC. Il forme les jeunes au service, à la discipline et à la foi chrétienne à travers des activités de plein air, des camps et des projets communautaires.",
    specificites: [
      "Mouvement de jeunesse chrétienne inspiré du scoutisme",
      "Formation au leadership, à la discipline et au service communautaire",
      "Camps et sorties de plein air pour la cohésion et la formation",
      "Activités manuelles, citoyennes et spirituelles",
      "Participation aux rassemblements nationaux et internationaux de l'EUC",
    ],
    verset: "Matthieu 5 : 16",
  },
  {
    icon: <Users className="h-8 w-8" />,
    couleur: "bg-teal-700",
    nom: "Autres Groupes",
    role: "Femmes, Seniors, Couples, Louange…",
    description:
      "Au-delà des groupes principaux, chaque paroisse peut organiser d'autres groupes selon ses besoins : groupe des femmes (Union des Femmes Évangéliques), groupe de louange, groupe des seniors, groupe des couples, etc.",
    specificites: [
      "Union des Femmes Évangéliques — entraide, prière et formation",
      "Groupe de Louange — adoration contemporaine et animation musicale",
      "Groupe des seniors — accompagnement des personnes âgées",
      "Groupe des couples — séminaires et renforcement du foyer",
      "Chaque groupe est rattaché au conseil de la paroisse",
    ],
    verset: "1 Corinthiens 12 : 12",
  },
];

const TypesGroupePage = () => {
  return (
    <Layout>
      {/* ── BANNIÈRE ── */}
      <div className="relative bg-primary text-primary-foreground py-14 md:py-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/banners/jeunesse-banner.jpg')] bg-cover bg-center opacity-10" />
        <div className="relative container">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/20 border border-gold/40 mb-4">
            <Users className="h-7 w-7 text-gold" />
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold mb-3">
            Types de Groupe
          </h1>
          <p className="text-primary-foreground/70 text-lg max-w-2xl mx-auto">
            Les groupes de l'Église Évangélique du Congo — structure, mission et fonctionnement
          </p>
        </div>
      </div>

      <div className="bg-cream py-14">
        <div className="container max-w-5xl space-y-14">

          {/* ── FONCTIONNEMENT COMMUN ── */}
          <section>
            <div className="flex items-start gap-3 mb-6">
              <Info className="h-5 w-5 text-primary shrink-0 mt-1" />
              <div>
                <h2 className="font-display text-2xl font-bold text-primary">
                  Fonctionnement général des groupes
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Tous les groupes de l'EEC partagent une structure et des activités communes, quel que soit leur type.
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Structure */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="bg-primary text-primary-foreground px-5 py-3">
                  <h3 className="font-semibold">Structure commune (bureau)</h3>
                </div>
                <ul className="divide-y divide-border">
                  {STRUCTURE_COMMUNE.map((s, i) => (
                    <li key={i} className="px-5 py-3">
                      <p className="text-sm font-semibold text-foreground">{s.titre}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Activités communes */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="bg-primary text-primary-foreground px-5 py-3">
                  <h3 className="font-semibold">Activités communes à tous les groupes</h3>
                </div>
                <ul className="divide-y divide-border">
                  {ACTIVITES_COMMUNES.map((a, i) => (
                    <li key={i} className="flex items-start gap-2.5 px-5 py-3">
                      <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">{a}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Note générale */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 text-sm text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Rattachement :</strong> Chaque groupe est placé sous l'autorité
              spirituelle du pasteur ou de l'évangéliste de la paroisse. Son bureau est élu par les membres et
              rend compte au conseil de la paroisse. Tout groupe doit être enregistré auprès du bureau de la paroisse
              et opérer dans le cadre des statuts et règlements de l'EEC.
            </div>
          </section>

          {/* ── LES GROUPES ── */}
          <section className="space-y-8">
            <h2 className="font-display text-2xl font-bold text-primary">Les groupes de l'EEC</h2>

            {GROUPES.map((g, i) => (
              <div
                key={i}
                className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="grid md:grid-cols-[220px_1fr]">
                  {/* Panneau gauche */}
                  <div className={`${g.couleur} text-white p-6 flex flex-col justify-between gap-4`}>
                    <div>
                      <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-4">
                        {g.icon}
                      </div>
                      <h3 className="font-display text-xl font-bold leading-tight">{g.nom}</h3>
                      <p className="text-white/70 text-xs mt-1.5">{g.role}</p>
                    </div>
                    <div className="border-t border-white/20 pt-3">
                      <p className="text-[10px] text-white/50 uppercase tracking-wide mb-0.5">Verset clé</p>
                      <p className="text-sm text-white/90 italic font-medium">{g.verset}</p>
                    </div>
                  </div>

                  {/* Panneau droit */}
                  <div className="p-6">
                    <p className="text-muted-foreground text-sm leading-relaxed mb-5">{g.description}</p>
                    <p className="text-xs font-semibold text-foreground uppercase tracking-wide mb-2">Spécificités</p>
                    <ul className="space-y-1.5">
                      {g.specificites.map((s, j) => (
                        <li key={j} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                          <ChevronRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </section>

        </div>
      </div>
    </Layout>
  );
};

export default TypesGroupePage;
