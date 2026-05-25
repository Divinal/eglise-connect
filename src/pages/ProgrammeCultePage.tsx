import Layout from "@/components/Layout";
import { Clock, Sun, Sunset, Star, Info } from "lucide-react";

const JOURS_SEMAINE = [
  { jour: "Lundi",    abrv: "Lun", type: "matin" },
  { jour: "Mardi",    abrv: "Mar", type: "matin" },
  { jour: "Mercredi", abrv: "Mer", type: "matin" },
  { jour: "Jeudi",    abrv: "Jeu", type: "matin+vesperal" },
  { jour: "Vendredi", abrv: "Ven", type: "matin" },
  { jour: "Samedi",   abrv: "Sam", type: "matin" },
  { jour: "Dimanche", abrv: "Dim", type: "dominical" },
];

const CULTES_DOMINICAUX = [
  { heure: "6h00",  label: "Culte de l'aurore",   desc: "Premier office du matin, souvent animé par la chorale de réveil." },
  { heure: "9h00",  label: "Culte principal",      desc: "Culte général avec prédication, louange et Sainte-Cène (1er dimanche du mois)." },
  { heure: "10h00", label: "Culte de mi-matinée",  desc: "Selon les paroisses — peut remplacer ou compléter le culte de 9h." },
  { heure: "11h00", label: "Culte de clôture",     desc: "Culte de fin de matinée dans certaines grandes paroisses urbaines." },
];

const ProgrammeCultePage = () => {
  return (
    <Layout>
      {/* ── BANNIÈRE ── */}
      <div className="relative bg-primary text-primary-foreground py-14 md:py-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/banners/synode-banner.jpg')] bg-cover bg-center opacity-10" />
        <div className="relative container">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gold/20 border border-gold/40 mb-4">
            <Clock className="h-7 w-7 text-gold" />
          </div>
          <h1 className="font-display text-3xl md:text-5xl font-bold mb-3">
            Programme du Culte
          </h1>
          <p className="text-primary-foreground/70 text-lg max-w-xl mx-auto">
            Horaires des offices de l'Église Évangélique du Congo
          </p>
        </div>
      </div>

      <div className="bg-cream py-14">
        <div className="container max-w-5xl space-y-12">

          {/* ── GRILLE HEBDOMADAIRE ── */}
          <section>
            <h2 className="font-display text-2xl font-bold text-primary mb-6 flex items-center gap-2">
              <Sun className="h-5 w-5 text-gold" /> Calendrier hebdomadaire
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-3">
              {JOURS_SEMAINE.map((j) => {
                const isDim      = j.type === "dominical";
                const isVesperal = j.type === "matin+vesperal";
                return (
                  <div
                    key={j.jour}
                    className={`rounded-xl border p-4 flex flex-col items-center gap-2 text-center shadow-sm transition-shadow hover:shadow-md
                      ${isDim ? "bg-primary text-primary-foreground border-primary" : "bg-card border-border"}`}
                  >
                    <span className={`text-xs font-bold uppercase tracking-wide ${isDim ? "text-gold" : "text-muted-foreground"}`}>
                      {j.abrv}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isDim ? "bg-gold/20" : "bg-primary/10"}`}>
                      {isDim ? <Star className="h-4 w-4 text-gold" /> : <Sun className="h-4 w-4 text-primary" />}
                    </div>
                    <p className={`text-xs leading-tight ${isDim ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                      {isDim ? "Culte Dominical" : "Culte du matin"}
                    </p>
                    {isVesperal && (
                      <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
                        + Vespéral
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ── CULTES EN SEMAINE ── */}
          <section className="grid md:grid-cols-2 gap-6">

            {/* Culte du matin */}
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
              <div className="bg-primary text-primary-foreground px-5 py-4 flex items-center gap-3">
                <Sun className="h-5 w-5 text-gold shrink-0" />
                <div>
                  <h3 className="font-display font-semibold text-lg">Culte du Matin</h3>
                  <p className="text-primary-foreground/60 text-xs">Lundi — Samedi</p>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Clock className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Chaque matin en semaine</p>
                    <p className="text-xs text-muted-foreground">Du lundi au samedi — heure selon la paroisse</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Chaque matin, les fidèles se rassemblent pour un temps de prière, de lecture de la Parole et
                  de chant avant de commencer leur journée. Ces cultes sont courts, intenses et centrés sur la dévotion personnelle.
                </p>
              </div>
            </div>

            {/* Culte Vespéral */}
            <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
              <div className="bg-amber-700 text-white px-5 py-4 flex items-center gap-3">
                <Sunset className="h-5 w-5 text-amber-200 shrink-0" />
                <div>
                  <h3 className="font-display font-semibold text-lg">Culte Vespéral</h3>
                  <p className="text-white/60 text-xs">Chaque Jeudi soir</p>
                </div>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 border border-amber-100">
                  <Clock className="h-4 w-4 text-amber-700 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Jeudi soir</p>
                    <p className="text-xs text-muted-foreground">Heure selon la paroisse (généralement 17h–18h)</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Le culte vespéral du jeudi est un moment de recueillement en fin de journée. Il comprend la prière
                  communautaire, l'adoration et parfois un message d'édification. Un moment précieux pour terminer la semaine dans la foi.
                </p>
              </div>
            </div>
          </section>

          {/* ── CULTE DOMINICAL ── */}
          <section>
            <h2 className="font-display text-2xl font-bold text-primary mb-2 flex items-center gap-2">
              <Star className="h-5 w-5 text-gold" /> Culte Dominical — Dimanche
            </h2>
            <p className="text-muted-foreground text-sm mb-6">
              Chaque paroisse a ses propres réalités et peut tenir un ou plusieurs offices le dimanche.
            </p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {CULTES_DOMINICAUX.map((c, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <span className="font-display font-bold text-primary text-sm">{c.heure}</span>
                  </div>
                  <h4 className="font-semibold text-foreground text-sm mb-1">{c.label}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>

            {/* Plage horaire principale */}
            <div className="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-5 flex items-start gap-3">
              <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-foreground mb-1">Plage horaire principale : 9h00 – 11h00</p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Le culte dominical principal se tient généralement entre <strong>9h et 11h</strong> dans toutes les paroisses de l'EEC.
                  Certaines grandes paroisses organisent plusieurs offices consécutifs pour accueillir tous les fidèles.
                  Renseignez-vous auprès de votre paroisse locale pour les horaires exacts.
                </p>
              </div>
            </div>
          </section>

          {/* ── NOTE PAROISSES ── */}
          <section className="bg-card border border-border rounded-xl p-6 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-gold/15 flex items-center justify-center shrink-0">
              <Info className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-1">Chaque paroisse a ses réalités</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Les horaires indiqués sont des références générales. Chaque paroisse de l'EEC adapte son programme
                selon ses fidèles, ses pasteurs et son contexte local. Pour connaître les horaires précis
                d'une paroisse, consultez la liste des consistoires ou contactez directement l'église concernée.
              </p>
              <a
                href="/institution/consistoires"
                className="inline-flex items-center gap-1.5 mt-3 text-sm text-primary font-medium hover:underline"
              >
                Trouver une paroisse proche →
              </a>
            </div>
          </section>

        </div>
      </div>
    </Layout>
  );
};

export default ProgrammeCultePage;
