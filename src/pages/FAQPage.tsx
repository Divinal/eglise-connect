import Layout from "@/components/Layout";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";

const faqs = [
  {
    categorie: "À propos de l'EEC",
    questions: [
      {
        q: "Qu'est-ce que l'Église Évangélique du Congo (EEC) ?",
        r: "L'Église Évangélique du Congo (EEC) est l'une des principales dénominations protestantes de la République du Congo. Fondée en 1909 par des missionnaires suédois de la Svenska Missionsförbundet, elle fonctionne selon un système presbytérien réformé dirigé par un Synode National et un Président National.",
      },
      {
        q: "Quand et par qui l'EEC a-t-elle été fondée ?",
        r: "L'EEC a été fondée en 1909 par des missionnaires de la Mission Suédoise (Svenska Missionsförbundet). Ces pionniers ont établi les premières communautés évangéliques sur le sol congolais, notamment à Brazzaville et dans les régions environnantes.",
      },
      {
        q: "Quels sont les principes fondamentaux de l'EEC ?",
        r: "L'EEC repose sur les principes fondamentaux du protestantisme : la suprématie de la Bible comme parole de Dieu, le salut par la foi en Jésus-Christ seul, l'importance de la prédication et la responsabilité de chaque croyant dans sa relation avec Dieu.",
      },
      {
        q: "Quelle est la structure de gouvernance de l'EEC ?",
        r: "L'EEC est gouvernée par un Synode National (organe suprême qui se réunit périodiquement), un Conseil Synodal (organe exécutif permanent), et un Bureau Synodal. Au niveau local, elle est organisée en Consistoires qui regroupent des Paroisses, lesquelles peuvent avoir des Annexes.",
      },
    ],
  },
  {
    categorie: "Organisation et Structure",
    questions: [
      {
        q: "Combien de consistoires l'EEC compte-t-elle ?",
        r: "L'EEC est organisée en plusieurs consistoires répartis sur l'ensemble du territoire congolais, principalement à Brazzaville, Pointe-Noire, Dolisie, Nkayi, Madingou et dans d'autres centres urbains et ruraux.",
      },
      {
        q: "Quels sont les départements de l'EEC ?",
        r: "L'EEC comprend neuf départements : DGEP (Direction Générale de l'Évangélisation et des Paroisses), Santé, Jeunesse, Musique, Évangélisation, Femmes et Famille, Éducation-Chrétienne, Aumônerie-Générale, et Communication.",
      },
      {
        q: "Comment fonctionne une paroisse au sein de l'EEC ?",
        r: "Chaque paroisse est dirigée par un pasteur et un conseil paroissial. Elle dispose d'un bureau paroissial, de commissions et d'organes spécialisés (groupes de jeunes, groupes féminins, chorales, etc.). Les paroisses dépendent du consistoire de leur zone géographique.",
      },
    ],
  },
  {
    categorie: "Vie Spirituelle et Activités",
    questions: [
      {
        q: "Quelles activités sociales l'EEC mène-t-elle ?",
        r: "En plus de sa mission spirituelle, l'EEC est très active dans les domaines de l'éducation (écoles, centres de formation), la santé (dispensaires, hôpitaux), et le développement social des communautés. Elle gère plusieurs établissements scolaires et sanitaires à travers le pays.",
      },
      {
        q: "Comment devenir membre de l'EEC ?",
        r: "Pour devenir membre de l'EEC, il convient de se rapprocher de la paroisse la plus proche de son domicile. Le processus inclut généralement une formation catéchétique, le baptême (pour ceux qui ne l'ont pas reçu) ou la présentation de son attestation de baptême, et l'adhésion formelle à la communauté.",
      },
      {
        q: "L'EEC a-t-elle des partenaires internationaux ?",
        r: "Oui, l'EEC entretient des relations fraternelles avec plusieurs organisations : la CVAA, la Fédération des Églises Protestantes du Congo, la Plateforme des Églises Évangéliques d'Afrique Centrale, le Conseil Œcuménique des Églises Chrétiennes du Congo, et ses partenaires historiques en Scandinavie.",
      },
    ],
  },
  {
    categorie: "Contact et Informations Pratiques",
    questions: [
      {
        q: "Comment contacter l'EEC ?",
        r: "Vous pouvez contacter le siège de l'EEC par téléphone au +242 12 345 6789, par email à contact@egliseevangeliquecongo.org, ou en vous rendant directement au siège situé Rue Alfred Fourneau, Centre Ville, Brazzaville.",
      },
      {
        q: "Comment faire un don à l'EEC ?",
        r: "Pour soutenir l'œuvre de l'EEC, vous pouvez vous rapprocher de la caisse de votre paroisse locale ou contacter le bureau financier du siège national. Des informations sur les modalités de don sont disponibles en contactant directement l'administration.",
      },
      {
        q: "Où trouver la paroisse EEC la plus proche ?",
        r: "La liste des consistoires et paroisses est disponible sur notre site sous la rubrique 'Institution > Consistoires'. Vous pouvez également nous contacter directement pour vous orienter vers la communauté la plus proche de chez vous.",
      },
    ],
  },
];

const FAQItem = ({ q, r }: { q: string; r: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between gap-4 p-5 text-left bg-card hover:bg-muted/40 transition-colors"
        onClick={() => setOpen(!open)}
      >
        <span className="font-medium text-foreground">{q}</span>
        {open ? (
          <ChevronUp className="h-5 w-5 text-primary shrink-0" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 text-muted-foreground leading-relaxed text-sm border-t border-border bg-muted/10">
          {r}
        </div>
      )}
    </div>
  );
};

const FAQPage = () => {
  return (
    <Layout>
      <div className="bg-primary py-12">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl text-primary-foreground">
            Questions Fréquentes
          </h1>
          <p className="text-primary-foreground/70 mt-2">
            Tout ce que vous souhaitez savoir sur l'EEC
          </p>
        </div>
      </div>

      <section className="py-12 bg-cream">
        <div className="container max-w-3xl">
          <div className="space-y-10">
            {faqs.map((section) => (
              <div key={section.categorie}>
                <h2 className="font-display text-xl font-semibold text-primary mb-4 pb-2 border-b border-border">
                  {section.categorie}
                </h2>
                <div className="space-y-3">
                  {section.questions.map((item) => (
                    <FAQItem key={item.q} q={item.q} r={item.r} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-12 p-6 bg-card rounded-xl border border-border text-center">
            <h3 className="font-display text-lg font-semibold text-foreground mb-2">
              Vous n'avez pas trouvé votre réponse ?
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              Notre équipe est disponible pour répondre à toutes vos questions.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FAQPage;
