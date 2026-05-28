import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import CTAButtons from "@/components/CTAButtons";
import InfoCard from "@/components/InfoCard";
import { Link } from "react-router-dom";
import { FileText, Book, BookOpen, Calendar, Users, ChevronRight, Radio, Clock, MapPin, Music } from "lucide-react";
import heroImage from "@/assets/hero-church.jpg";
import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 157,  suffix: "+", label: "Serviteurs de Dieu" },
  { value: 1,    suffix: "M+", label: "Fidèles" },
  { value: 250,  suffix: "+", label: "Groupes chantants" },
  { value: 400,  suffix: "+", label: "Paroisses" },
];

function useCountUp(target: number, started: boolean, duration = 1800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [started, target, duration]);
  return count;
}

function StatCard({ value, suffix, label, started }: { value: number; suffix: string; label: string; started: boolean }) {
  const count = useCountUp(value, started);
  return (
    <div className="flex flex-col items-center text-center gap-1">
      <span className="font-display text-4xl md:text-5xl font-bold text-primary-foreground">
        {count}{suffix}
      </span>
      <span className="text-sm text-primary-foreground/70 uppercase tracking-wide">{label}</span>
    </div>
  );
}

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


const documents = [
  { icon: <FileText className="h-4 w-4 text-red-500" />, label: "Guide Biblique", href: "#" },
  { icon: <FileText className="h-4 w-4 text-red-500" />, label: "Versets Bibliques", href: "#" },
  { icon: <FileText className="h-4 w-4 text-red-500" />, label: "Bible Électronique", href: "doc/Labible.pdf", target: "_blank" },
  { icon: <Book className="h-4 w-4 text-primary" />, label: "Lire la Bible en ligne", href: "https://info-bible.org/lsg/INDEX.html", target: "_blank" },
];

const STATIONS_MISS = [
  { image: "/images/images/ngouedi.jpg",    lieu: "Ngouedi",       desc: "Consistoire du Pool — l'une des premières stations fondées par les missionnaires de la SMEP." },
  { image: "/images/stations/kolo.jpg",     lieu: "Kolo",          desc: "Consistoire des Plateaux — station historique au cœur du pays." },
  { image: "/images/stations/loutete.jpg",  lieu: "Loutété",       desc: "Consistoire du Niari — rayonnement évangélique dans le Sud." },
  { image: "/images/stations/station4.jpg", lieu: "Autre Station", desc: "" },
];

const EVENEMENTS_EEC = [
  { image: "/images/evenements/centenaire-eec.jpg",  titre: "Le Centenaire de l'EEC",                     annee: "1909 – 2009", desc: "Célébration du centenaire de la présence évangélique au Congo." },
  { image: "/images/evenements/centenaire-kolo.jpg", titre: "Centenaire de KOLO & Cinquantenaire du CBE", annee: "",            desc: "Double anniversaire marquant l'histoire des missions et du CBE." },
  { image: "/images/evenements/autres.jpg",          titre: "Autres Grands Événements",                   annee: "",            desc: "Conventions, jubilés et rassemblements nationaux de l'EEC." },
];

const Index = () => {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsStarted, setStatsStarted] = useState(false);
  const [showMoreStations, setShowMoreStations] = useState(false);
  const [showMoreEvenements, setShowMoreEvenements] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStatsStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Layout>
      {/* ── HERO ── */}
      <HeroSection />
      <CTAButtons />

      {/* ── MOT DU PRÉSIDENT ── */}
      <section className="py-16 bg-cream">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

            {/* Colonne principale (gauche) */}
            <div className="lg:col-span-2 space-y-10">

              {/* Mot du Président */}
              <div className="bg-card rounded-xl border border-border p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  <img
                    src="/images/images/presidentEglise.jpg"
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

              {/* Dernières Actualités */}
              <div>
                <h2 className="font-display text-2xl font-bold text-primary mb-6">Dernières Actualités</h2>
                <div className="space-y-4">
                  {sampleNews.map((news, i) => (
                    <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                      <InfoCard {...news} />
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Link
                    to="/blog"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Voir toutes les actualités
                  </Link>
                </div>
              </div>

              {/* A la découverte de l'EEC */}
              <div className="text-center">
                <h2 className="font-display text-3xl font-bold text-primary mb-4">
                  A la découverte de l'EEC
                </h2>
                <p className="text-muted-foreground leading-relaxed">
                  L'Église Évangélique du Congo est une institution spirituelle et sociale clé en
                  République du Congo. Forte de son héritage missionnaire, elle continue d'influencer
                  la vie religieuse et socioculturelle du pays à travers la prédication de l'Évangile
                  et ses actions en faveur de la communauté.
                </p>
              </div>

              {/* Image Bureau synodal */}
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

            </div>

            {/* Colonne latérale (droite) */}
            <div className="space-y-5">

               {/* Thème et verset de l'année */}
              <div className="rounded-xl border border-border overflow-hidden shadow-sm">
                <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-2">
                  <Book className="h-4 w-4 text-gold" />
                  <h4 className="font-display font-semibold"> Thème et Verset de l'Année</h4>
                </div>
                <div className="bg-card divide-y divide-border">
                  {[
                    { name: "Contenue du thème de l'année | Contenue du thème de l'année | Contenue du thème de l'année", freq: "Thème de l'année 2026" },
                    { name: "Contenue du verset de l'année | Contenue du verset de l'année", freq: "Verset de l'année 2026 - 2 Tim 2 : 22" },
                  ].map((radio, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3">
                      <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Book className="h-3.5 w-3.5 text-primary" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{radio.name}</p>
                        <p className="text-xs text-muted-foreground">{radio.freq}</p>
                      </div>
                    </div>
                  ))}
                </div> 
              </div>

              {/* Notre Radio */}
              <div className="rounded-xl border border-border overflow-hidden shadow-sm">
                <div className="bg-primary text-primary-foreground px-4 py-3 flex items-center gap-2">
                  <Radio className="h-4 w-4 text-gold" />
                  <h4 className="font-display font-semibold">Nos Radio</h4>
                </div>
                <div className="bg-card divide-y divide-border">
                  {[
                    { name: "Voix Evangélique", freq: "— FM à venir" },
                    { name: "Radio du Centenaire", freq: "— FM à venir" },
                  ].map((radio, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3">
                      <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Radio className="h-3.5 w-3.5 text-primary" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{radio.name}</p>
                        <p className="text-xs text-muted-foreground">{radio.freq}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prochain Synode */}
              {/* <div className="rounded-xl border border-border overflow-hidden shadow-sm">
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
              </div> */}

              {/* Documents importants */}
              <div className="rounded-xl border border-border overflow-hidden shadow-sm">
                <div className="bg-primary text-primary-foreground px-4 py-3">
                  <h4 className="font-display font-semibold">Documents à Consulter</h4>
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
                  <h4 className="font-display font-semibold">Les activités flash</h4>
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

      {/* ── COMPTEUR STATISTIQUES ── */}
      <section className="py-14 bg-primary" ref={statsRef}>
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {STATS.map((s, i) => (
              <StatCard key={i} value={s.value} suffix={s.suffix} label={s.label} started={statsStarted} />
            ))}
          </div>
        </div>
      </section>

      {/* ── VIE DE L'ÉGLISE ── */}
      <section className="py-16 bg-background">
        <div className="container">
          <h2 className="font-display text-3xl font-bold text-primary text-center mb-10">
            Vie de l'Église
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Programme du Culte */}
            <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow">
              <Clock className="h-10 w-10 text-primary" />
              <h3 className="font-display font-semibold text-foreground text-lg">Programme du Culte</h3>
              <ul className="text-sm text-muted-foreground space-y-1.5 flex-1 text-left w-full">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />Culte du matin — Lun. au Sam.</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />Culte dominical — Dim. 9h–11h</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />Culte vespéral — Jeu. soir</li>
              </ul>
              <Link to="/programme-culte" className="text-sm border border-primary text-primary rounded-full px-4 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors mt-auto">
                En savoir plus
              </Link>
            </div>

            {/* Trouver une Paroisse */}
            <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow">
              <MapPin className="h-10 w-10 text-primary" />
              <h3 className="font-display font-semibold text-foreground text-lg">Trouver une Paroisse</h3>
              <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                Localisez la paroisse la plus proche de chez vous à Brazzaville, Pointe-Noire ou dans toute la République du Congo.
              </p>
              <Link to="/institution/consistoires" className="text-sm border border-primary text-primary rounded-full px-4 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors mt-auto">
                Voir les paroisses
              </Link>
            </div>

            {/* Grand Thème d'Édification */}
            <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow">
              <BookOpen className="h-10 w-10 text-primary" />
              <h3 className="font-display font-semibold text-foreground text-lg">Thème d'Édification</h3>
              <ul className="text-sm text-muted-foreground space-y-1.5 flex-1 text-left w-full">
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />Croire, Espérer, Aimer</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />L'Évangile : Lumière des Nations</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />Sanctification et Témoignage</li>
                <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-gold shrink-0" />Bâtir l'Église de Christ</li>
              </ul>
              <Link to="/themes-edification" className="text-sm border border-primary text-primary rounded-full px-4 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors mt-auto">
                En savoir plus
              </Link>
            </div>

            {/* Types de Groupe */}
            <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center text-center gap-4 hover:shadow-md transition-shadow">
              <Music className="h-10 w-10 text-primary" />
              <h3 className="font-display font-semibold text-foreground text-lg">Types de Groupe</h3>
              <ul className="text-sm text-muted-foreground space-y-1.5 flex-1 text-left w-full">
                <li className="flex items-center gap-2"><Users className="h-3.5 w-3.5 text-primary shrink-0" />Chorale</li>
                <li className="flex items-center gap-2"><Users className="h-3.5 w-3.5 text-primary shrink-0" />Kilombo</li>
                <li className="flex items-center gap-2"><Users className="h-3.5 w-3.5 text-primary shrink-0" />CBE</li>
                <li className="flex items-center gap-2"><Users className="h-3.5 w-3.5 text-primary shrink-0" />Ecodi</li>
                <li className="flex items-center gap-2"><Users className="h-3.5 w-3.5 text-primary shrink-0" />EUC</li>
                <li className="flex items-center gap-2"><Users className="h-3.5 w-3.5 text-primary shrink-0" />Autres Groupes</li>
              </ul>
              <Link to="/types-de-groupe" className="text-sm border border-primary text-primary rounded-full px-4 py-1.5 hover:bg-primary hover:text-primary-foreground transition-colors mt-auto">
                En savoir plus
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* ── STATIONS & ÉVÉNEMENTS ── */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

            {/* ── STATIONS MISSIONNAIRES ── */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-display text-xl font-bold text-primary mb-1">
                Station Missionnaire et Archive de l'EEC
              </h2>
              <p className="text-xs text-muted-foreground mb-5">
                Lieux historiques où les missionnaires ont évangélisé et fondé l'EEC depuis 1909
              </p>

              <div className="space-y-4">
                {STATIONS_MISS.slice(0, showMoreStations ? STATIONS_MISS.length : 3).map((s, i) => (
                  <div key={i} className="rounded-lg overflow-hidden border border-border">
                    <div className="relative">
                      <img
                        src={s.image}
                        alt={s.lieu}
                        className="w-full aspect-video object-cover"
                        onError={(e) => { (e.target as HTMLImageElement).src = heroImage; }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
                        <p className="text-white font-semibold text-sm">{s.lieu}</p>
                      </div>
                    </div>
                    {s.desc && (
                      <p className="text-xs text-muted-foreground px-3 py-2">{s.desc}</p>
                    )}
                  </div>
                ))}
              </div>

              {STATIONS_MISS.length > 3 && (
                <button
                  onClick={() => setShowMoreStations(!showMoreStations)}
                  className="mt-4 text-sm text-primary font-semibold hover:underline flex items-center gap-1"
                >
                  <ChevronRight className={`h-4 w-4 transition-transform ${showMoreStations ? "rotate-90" : ""}`} />
                  {showMoreStations ? "Voir moins" : "Voir plus"}
                </button>
              )}
            </div>

            {/* ── GRANDS ÉVÉNEMENTS ── */}
            <div className="bg-card border border-border rounded-xl p-6">
              <h2 className="font-display text-xl font-bold text-primary mb-1">
                Grands Événements de l'EEC
              </h2>
              <p className="text-xs text-muted-foreground mb-5">
                Les moments marquants qui ont façonné l'histoire de l'Église Évangélique du Congo
              </p>

              <div className="space-y-3">
                {EVENEMENTS_EEC.slice(0, showMoreEvenements ? EVENEMENTS_EEC.length : 3).map((ev, i) => (
                  <div key={i} className="flex gap-3 border border-border rounded-lg overflow-hidden">
                    <img
                      src={ev.image}
                      alt={ev.titre}
                      className="w-24 h-20 object-cover shrink-0"
                      onError={(e) => { (e.target as HTMLImageElement).src = heroImage; }}
                    />
                    <div className="py-2 pr-3 flex flex-col justify-center">
                      {ev.annee && (
                        <p className="text-[10px] text-primary font-semibold uppercase tracking-wide mb-0.5">{ev.annee}</p>
                      )}
                      <p className="text-sm font-semibold text-foreground leading-snug">{ev.titre}</p>
                      {ev.desc && (
                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{ev.desc}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {EVENEMENTS_EEC.length > 3 && (
                <button
                  onClick={() => setShowMoreEvenements(!showMoreEvenements)}
                  className="mt-4 text-sm text-primary font-semibold hover:underline flex items-center gap-1"
                >
                  <ChevronRight className={`h-4 w-4 transition-transform ${showMoreEvenements ? "rotate-90" : ""}`} />
                  {showMoreEvenements ? "Voir moins" : "Voir plus"}
                </button>
              )}
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