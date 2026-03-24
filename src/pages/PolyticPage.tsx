import Layout from "@/components/Layout";
import { useState, useEffect } from "react";

const sections = [
  { id: "info-collecte", label: "1. Informations collectées" },
  { id: "confidentialite", label: "2. Paramètres de confidentialité" },
  { id: "utilisation-infos", label: "3. Utilisation des informations" },
  { id: "partage-infos", label: "4. Partage de vos informations" },
  { id: "securite", label: "5. Sécuriser vos informations" },
  { id: "cookies", label: "6. Cookies et technologies de suivi" },
  { id: "commentaire-medias", label: "7. Commentaires Médias" },
  { id: "droit-donne", label: "8. Vos droits sur vos données" },
  { id: "contact", label: "9. Contact" },
];

const SectionHeader = ({ num, title }: { num: number; title: string }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="w-9 h-9 shrink-0 bg-yellow-600 text-white rounded-full flex items-center justify-center font-serif font-bold text-base">
      {num}
    </div>
    <h2 className="font-serif text-2xl font-bold text-stone-800">{title}</h2>
  </div>
);

const BulletItem = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-3 text-sm text-stone-600 leading-relaxed">
    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-yellow-600 mt-2" />
    <span>{children}</span>
  </li>
);

export default function PolyticPage() {
  const [activeSection, setActiveSection] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      const offsets = sections.map(({ id }) => {
        const el = document.getElementById(id);
        return { id, top: el ? el.getBoundingClientRect().top : Infinity };
      });
      const active = offsets.filter((s) => s.top <= 120).at(-1);
      if (active) setActiveSection(active.id);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <Layout>

      {/* ── BANNER ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1A1611] via-[#2C2416] to-[#3D2E0E] text-white py-20 px-6 text-center">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(184,150,46,0.3) 40px, rgba(184,150,46,0.3) 41px)",
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <span className="inline-block text-[0.7rem] tracking-[0.2em] uppercase text-yellow-400 border border-yellow-600 px-3 py-1 rounded-sm mb-5">
            Documents Officiels
          </span>
          <h1 className="font-serif text-4xl md:text-5xl font-bold leading-tight mb-4">
            Politique de Confidentialité
          </h1>
          <p className="text-white/70 font-light leading-relaxed max-w-xl mx-auto">
            Découvrez comment vos informations sont collectées, utilisées,
            partagées et protégées sur notre site.
          </p>
          <div className="w-12 h-0.5 bg-yellow-600 mx-auto mt-5" />
        </div>
      </div>

      {/* ── INTRO BAND ── */}
      <div className="bg-yellow-50 border-t-4 border-yellow-600 border-b border-yellow-200 py-7 px-6">
        <div className="max-w-3xl mx-auto flex gap-4 items-start">
          <div className="shrink-0 w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center text-white text-base mt-0.5">
            🔒
          </div>
          <div>
            <p className="text-[0.72rem] tracking-widest uppercase text-stone-500 mb-1">
              Dernière mise à jour : [Date]
            </p>
            <p className="text-sm leading-relaxed text-stone-700">
              L'Église Évangélique du Congo accorde une grande importance à la
              confidentialité et à la sécurité des informations personnelles de
              ses fidèles, visiteurs et membres. Cette politique explique comment
              nous collectons, utilisons et protégeons vos données lorsque vous
              utilisez notre site{" "}
              <a href="#" className="text-yellow-700 font-medium hover:underline">
                www.egliseevangeliquecongo.org
              </a>.
            </p>
          </div>
        </div>
      </div>

      {/* ── CONTENT LAYOUT ── */}
      <div className="max-w-5xl mx-auto px-6 py-14 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 items-start">

        {/* ── ARTICLE ── */}
        <article>

          {/* 1 — Collecte */}
          <section id="info-collecte" className="pb-12 mb-12 border-b border-stone-200">
            <SectionHeader num={1} title="Collecte des informations personnelles" />
            <p className="text-sm leading-relaxed text-stone-600 mb-4">
              Nous pouvons collecter les informations suivantes lorsque vous utilisez notre site :
            </p>
            <ul className="space-y-3">
              <BulletItem><strong className="text-stone-800">Informations personnelles :</strong> Nom, prénom, adresse email, numéro de téléphone (lorsque vous remplissez un formulaire de contact, d'inscription ou de demande d'accompagnement spirituel).</BulletItem>
              <BulletItem><strong className="text-stone-800">Données de navigation :</strong> Adresse IP, type de navigateur, pages visitées, durée des visites (via des cookies et outils d'analyse).</BulletItem>
              <BulletItem><strong className="text-stone-800">Informations de dons :</strong> Si vous effectuez un don en ligne, certaines informations bancaires peuvent être collectées via des plateformes sécurisées.</BulletItem>
            </ul>
          </section>

          {/* 2 — Confidentialité */}
          <section id="confidentialite" className="pb-12 mb-12 border-b border-stone-200">
            <SectionHeader num={2} title="Paramètres de confidentialité" />
            <p className="text-sm leading-relaxed text-stone-600">
              Cette section décrit les paramètres clés qui, au sein de nos services, vous permettent
              de gérer la confidentialité de vos informations. En outre, le Check-up Confidentialité
              vous permet d'examiner et d'ajuster d'importants paramètres de confidentialité. En plus
              de ces outils, nos produits contiennent des paramètres de confidentialité spécifiques.
            </p>
          </section>

          {/* 3 — Utilisation */}
          <section id="utilisation-infos" className="pb-12 mb-12 border-b border-stone-200">
            <SectionHeader num={3} title="Utilisation des informations" />
            <p className="text-sm leading-relaxed text-stone-600 mb-4">
              Vos données personnelles sont utilisées pour :
            </p>
            <ul className="space-y-3">
              {[
                "Répondre à vos demandes (contact, inscription, information).",
                "Gérer votre participation aux événements et services de l'Église.",
                "Vous envoyer des communications (actualités, prières, annonces importantes, etc.).",
                "Améliorer l'expérience utilisateur sur notre site.",
                "Garantir la sécurité et le bon fonctionnement du site.",
              ].map((item, i) => (
                <BulletItem key={i}>{item}</BulletItem>
              ))}
            </ul>
          </section>

          {/* 4 — Partage */}
          <section id="partage-infos" className="pb-12 mb-12 border-b border-stone-200">
            <SectionHeader num={4} title="Partage de vos informations" />
            <div className="bg-yellow-50 border-l-4 border-yellow-600 px-5 py-4 rounded-r-lg text-sm leading-relaxed text-stone-700">
              L'Église Évangélique du Congo{" "}
              <em className="font-semibold text-stone-800 not-italic">
                ne vend ni ne loue vos informations personnelles.
              </em>{" "}
              Cependant, nous pouvons être amenés à partager certaines données avec des prestataires
              de services (par exemple, les plateformes de paiement pour les dons), uniquement dans
              le cadre de leur mission.
            </div>
          </section>

          {/* 5 — Sécurité */}
          <section id="securite" className="pb-12 mb-12 border-b border-stone-200">
            <SectionHeader num={5} title="Sécuriser vos informations" />
            <p className="text-sm leading-relaxed text-stone-600">
              Nous mettons en place des mesures de sécurité strictes pour protéger vos données contre
              l'accès non autorisé, la modification ou la suppression. L'accès aux informations
              personnelles est limité aux personnes habilitées au sein de l'Église.
            </p>
          </section>

          {/* 6 — Cookies */}
          <section id="cookies" className="pb-12 mb-12 border-b border-stone-200">
            <SectionHeader num={6} title="Cookies et technologies de suivi" />
            <p className="text-sm leading-relaxed text-stone-600">
              Notre site utilise des cookies pour améliorer votre navigation et analyser le trafic.
              Vous pouvez configurer votre navigateur pour bloquer ces cookies, bien que cela puisse
              affecter certaines fonctionnalités du site.
            </p>
          </section>

          {/* 7 — Commentaires */}
          <section id="commentaire-medias" className="pb-12 mb-12 border-b border-stone-200">
            <SectionHeader num={7} title="Commentaires Médias" />
            <p className="text-sm leading-relaxed text-stone-600">
              Lorsque vous laissez des commentaires sur notre site, les données saisies (nom,
              adresse e-mail, site web) ainsi que votre adresse IP sont collectées. Ces informations
              nous aident à lutter contre le spam et à améliorer l'interaction au sein de notre
              communauté. Les commentaires sont visibles pour les autres utilisateurs, et nous nous
              réservons le droit de supprimer tout contenu inapproprié.
            </p>
          </section>

          {/* 8 — Droits */}
          <section id="droit-donne" className="pb-12 mb-12 border-b border-stone-200">
            <SectionHeader num={8} title="Vos droits sur vos données" />
            <p className="text-sm leading-relaxed text-stone-600 mb-4">
              Conformément aux réglementations en vigueur, vous avez le droit de :
            </p>
            <ul className="space-y-3 mb-4">
              {[
                "Accéder à vos informations personnelles.",
                "Corriger vos données si elles sont inexactes.",
                "Demander la suppression de vos informations si elles ne sont plus nécessaires.",
                "Vous opposer à certaines utilisations de vos données.",
              ].map((item, i) => (
                <BulletItem key={i}>{item}</BulletItem>
              ))}
            </ul>
            <p className="text-sm leading-relaxed text-stone-600">
              Pour exercer vos droits, contactez-nous à{" "}
              <a href="mailto:contact@egliseevangeliquecongo.org" className="text-yellow-700 font-medium hover:underline">
                contact@egliseevangeliquecongo.org
              </a>.
            </p>
          </section>

          {/* 9 — Contact */}
          <section id="contact" className="pb-4">
            <SectionHeader num={9} title="Contact" />
            <p className="text-sm leading-relaxed text-stone-600">
              Pour toute question relative à notre politique de confidentialité, vous pouvez nous
              écrire à{" "}
              <a href="mailto:contact@egliseevangeliquecongo.org" className="text-yellow-700 font-medium hover:underline">
                contact@egliseevangeliquecongo.org
              </a>.
            </p>
          </section>

        </article>

        {/* ── SIDEBAR ── */}
        <aside className="sticky top-20 hidden lg:block">
          <div className="rounded-lg overflow-hidden border border-stone-200 shadow-sm">
            <div className="bg-[#1A1611] text-white px-5 py-4 flex items-center gap-2 font-serif font-bold text-base tracking-wide">
              <span className="w-2 h-2 rounded-full bg-yellow-500 shrink-0" />
              Politique de Confidentialité
            </div>
            <nav className="py-2">
              {sections.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={`w-full text-left px-5 py-2.5 text-[0.82rem] leading-snug border-l-[3px] transition-all duration-200
                    ${activeSection === id
                      ? "bg-yellow-50 text-yellow-700 font-medium border-yellow-500"
                      : "border-transparent text-stone-500 hover:bg-stone-50 hover:text-stone-700 hover:border-yellow-400"
                    }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </aside>
      </div>
    </Layout>
  );
}