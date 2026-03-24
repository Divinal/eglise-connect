import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import CTAButtons from "@/components/CTAButtons";
import InfoCard from "@/components/InfoCard";
import { Link } from "react-router-dom";
import { FileText, Book, BookOpen, Calendar, Church, Users, ChevronRight } from "lucide-react";
import heroImage from "@/assets/hero-church.jpg";

const sampleNews = [
  {
    title: "Conférence annuelle des jeunes",
    date: "15 Juin 2023",
    image: heroImage,
    excerpt: "Notre conférence annuelle des jeunes a été un grand succès avec plus de 300 participants...",
  },
  {
    title: "Programme d'aide communautaire",
    date: "3 Mai 2023",
    image: heroImage,
    excerpt: "Notre programme d'aide a pu fournir de la nourriture et des fournitures à plus de 150 familles...",
  },
  {
    title: "Réunion du Synode",
    date: "22 Avril 2023",
    image: heroImage,
    excerpt: "Le synode s'est réuni pour discuter des orientations futures et des projets de développement...",
  },
];

const services = [
  {
    icon: <Church className="h-10 w-10 text-primary" />,
    title: "Cultes et Prières",
    desc: "Rejoignez-nous pour nos services de culte hebdomadaires et nos groupes de prière.",
  },
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    title: "Communauté",
    desc: "Nous croyons en la force de la communauté et offrons divers groupes de soutien et activités.",
  },
  {
    icon: <BookOpen className="h-10 w-10 text-primary" />,
    title: "Études Bibliques",
    desc: "Approfondir votre connaissance des Écritures à travers nos programmes d'études bibliques.",
  },
];

const documents = [
  { icon: <FileText className="h-4 w-4 text-red-500" />, label: "Guide Biblique", href: "#" },
  { icon: <FileText className="h-4 w-4 text-red-500" />, label: "Versets Bibliques", href: "#" },
  { icon: <FileText className="h-4 w-4 text-red-500" />, label: "Bible Électronique", href: "doc/Labible.pdf", target: "_blank" },
  { icon: <Book className="h-4 w-4 text-primary" />, label: "Lire la Bible en ligne", href: "https://info-bible.org/lsg/INDEX.html", target: "_blank" },
];

const Index = () => {
  return (
    <Layout>
      {/* ── HERO ── */}
      <HeroSection />
      <CTAButtons />

      {/* ── DÉCOUVERTE EEC ── */}
      <section className="py-16 bg-cream">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* Colonne principale (gauche) */}
            <div className="lg:col-span-2 space-y-10">

              {/* Intro texte */}
              <div className="text-center">
                <h2 className="font-display text-3xl font-bold text-primary mb-4">
                  Allons à la découverte de l'EEC
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  L'Église Évangélique du Congo est une institution spirituelle et sociale clé en
                  République du Congo. Forte de son héritage missionnaire, elle continue d'influencer
                  la vie religieuse et socioculturelle du pays à travers la prédication de l'Évangile
                  et ses actions en faveur de la communauté.
                </p>
              </div>

              {/* Carousel images (statique) */}
              <div className="rounded-xl overflow-hidden bg-muted aspect-video relative">
                <img
                  src="/images/images/bureauSyn.jpg"
                  alt="Le Bureau synodal"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = heroImage; }}
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white px-5 py-3">
                  <p className="font-semibold text-sm">Le Bureau synodal</p>
                  <p className="text-xs text-white/80">Les membres du nouveau bureau synodal élu lors du dernier congrès Synodal pour un mandat de 5 ans.</p>
                </div>
              </div>

              {/* Mot du Président */}
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <img
                    src="/images/images/president.jpg"
                    alt="Le Président"
                    className="rounded-lg shadow w-full object-cover aspect-square"
                    onError={(e) => { (e.target as HTMLImageElement).src = heroImage; }}
                  />
                  <div>
                    <h2 className="font-display text-xl font-bold text-primary mb-3">
                      Mot de bienvenue par le Président
                    </h2>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                      Bien-aimés frères et sœurs en Christ, c'est avec une joie profonde et un cœur
                      rempli de gratitude que je vous accueille en ce lieu saint, la maison de notre
                      Seigneur. Au nom de l'église évangélique du Congo, je vous dis : <em>Mbote na bino nyonso!</em>
                    </p>
                    <h4 className="font-semibold text-foreground text-sm mb-1">Encouragement et inspiration</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      Dans notre Congo bien-aimé, nous sommes appelés à être des lumières dans un monde
                      en quête d'espoir. Que notre foi soit un phare qui guide nos pas, que notre amour
                      soit un témoignage vivant de la présence de Christ en nous.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne latérale (droite) */}
            <div className="space-y-5">

              {/* Prochain Synode */}
              <div className="rounded-xl border border-border overflow-hidden shadow-sm">
                <div className="bg-primary text-primary-foreground px-4 py-3">
                  <h4 className="font-display font-semibold">Prochain Synode</h4>
                </div>
                <div className="bg-card p-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    La prochaine session ordinaire du Synode aura lieu du 15 au 20 août 2023 à Brazzaville.
                  </p>
                  <a href="#" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
                    En savoir plus <ChevronRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {/* Documents importants */}
              <div className="rounded-xl border border-border overflow-hidden shadow-sm">
                <div className="bg-primary text-primary-foreground px-4 py-3">
                  <h4 className="font-display font-semibold">Documents Importants</h4>
                </div>
                <ul className="divide-y divide-border bg-card">
                  {documents.map((doc, i) => (
                    <li key={i}>
                      <a
                        href={doc.href}
                        target={(doc as any).target || "_self"}
                        rel="noreferrer"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted/40 transition-colors"
                      >
                        {doc.icon}
                        {doc.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Activités phares */}
              <div className="rounded-xl border border-border overflow-hidden shadow-sm">
                <div className="bg-primary text-primary-foreground px-4 py-3">
                  <h4 className="font-display font-semibold">Les activités phares</h4>
                </div>
                <div className="bg-card p-4">
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                    <Calendar className="h-3.5 w-3.5" /> 15 Juin 2023
                  </p>
                  <h5 className="font-semibold text-foreground text-sm mb-2">Activités Mensuelles</h5>
                  <p className="text-sm text-muted-foreground mb-3">
                    Il sera organisé la séance de prière synodale dans l'enceinte de la paroisse évangélique de Makélékélé.
                  </p>
                  <a href="#" className="text-sm text-primary font-medium flex items-center gap-1 hover:underline">
                    En savoir plus <ChevronRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {/* Faire un don */}
              <div className="rounded-xl border border-border overflow-hidden shadow-sm">
                <div className="bg-primary text-primary-foreground px-4 py-3">
                  <h4 className="font-display font-semibold">Faire un don</h4>
                </div>
                <div className="bg-card p-4">
                  <h5 className="font-semibold text-foreground text-sm mb-2">Aidez à l'évolution</h5>
                  <p className="text-sm text-muted-foreground mb-3">
                    Ensemble, construisons l'œuvre de Dieu. Votre contribution, si modeste soit-elle,
                    est une pierre précieuse dans cet édifice spirituel.
                  </p>
                  <a href="#" className="text-sm border border-primary text-primary rounded-full px-4 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors inline-block">
                    Nature de don
                  </a>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── DOCTRINE ET PRATIQUES ── */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="font-display text-3xl font-bold text-primary text-center mb-3">
            Doctrine et pratiques
          </h2>
          <p className="text-center text-muted-foreground mb-4">
            L'Église Évangélique du Congo repose sur les principes fondamentaux du protestantisme :
          </p>
          <ol className="max-w-xl mx-auto text-sm text-muted-foreground space-y-1 list-decimal list-inside mb-10">
            <li>La suprématie des Écritures (la Bible comme seule autorité de foi et de pratique)</li>
            <li>Le salut par la foi en Jésus-Christ</li>
            <li>La pratique des sacrements du baptême et de la Sainte-Cène</li>
            <li>L'importance de la prédication et de la formation théologique</li>
          </ol>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div key={i} className="bg-card border border-border rounded-xl p-6 flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow">
                {s.icon}
                <h3 className="font-display font-semibold text-foreground text-lg">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed flex-1">{s.desc}</p>
                <a href="#" className="text-sm border border-primary text-primary rounded-full px-4 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors mt-auto">
                  En savoir plus
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ACTUALITÉS ── */}
      <section className="py-16 bg-cream">
        <div className="container">
          <h2 className="font-display text-3xl font-bold text-primary text-center mb-10">
            Dernières Actualités
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleNews.map((news, i) => (
              <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <InfoCard {...news} />
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Voir toutes les actualités
            </Link>
          </div>
        </div>
      </section>

      {/* ── À PROPOS ── */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="bg-card border border-border rounded-xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <img
                src="/images/images/ngouedi.jpg"
                alt="À propos de l'EEC"
                className="rounded-lg shadow w-full object-cover aspect-video"
                onError={(e) => { (e.target as HTMLImageElement).src = heroImage; }}
              />
              <div>
                <h2 className="font-display text-2xl font-bold text-primary mb-4">
                  L'Église Évangélique du Congo (EEC)
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  L'EEC est l'une des plus anciennes et des plus influentes dénominations protestantes
                  en République du Congo. Fondée en 1909 par la Société des Missions Évangéliques de
                  Paris (SMEP), elle s'est progressivement développée sur tout le territoire congolais.
                </p>
                <h4 className="font-semibold text-foreground mb-2">Histoire et implantation</h4>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  Elle s'est implantée principalement dans les régions du Pool, des Plateaux, de la
                  Cuvette, et du Niari. Aujourd'hui, elle est présente à Brazzaville, Pointe-Noire,
                  Dolisie, et Owando, et compte de nombreux fidèles.
                </p>
                <h4 className="font-semibold text-foreground mb-2">Organisation et structure</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  L'EEC est une église réformée presbytérienne dirigée par un Président National,
                  assisté d'un bureau exécutif et des responsables régionaux, avec un Synode National
                  comme organe de décision suprême.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION ── */}
      <section className="py-16 bg-primary text-primary-foreground text-center">
        <div className="container max-w-2xl">
          <h2 className="font-display text-3xl font-bold mb-4">Rejoignez notre communauté</h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            Venez participer à nos services dominicaux et découvrir notre église
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-white text-primary font-semibold text-sm hover:bg-white/90 transition-colors"
          >
            Contactez-nous
          </Link>
        </div>
      </section>

    </Layout>
  );
};

export default Index;