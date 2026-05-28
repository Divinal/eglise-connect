import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-church.jpg";

const CULTE_YOUTUBE_URL = "https://www.youtube.com/@EgliseEvangeliqueduCongo";


const slides = [
  {
    image: "../images/banners/EEC5.jpg",
    fallback: heroImage,
    title: "l'Église Évangélique du Congo",
    description:"Est un institution spirituelle et sociale clé en République du Congo. Forte de son héritage missionnaire, elle contribue dans la vie religieuse et socioculturelle à travers la prédication de l’Évangile.",
  },
  {
    image: "../images/images/esgae.jpg",
    fallback: heroImage,
    title: "Conseil Synodal",
    description:
      "C'est l'organe décisionnel suprême de l'Église. Il définit les orientations générales et prend les grandes décisions pour l'Église.",
  },
   {
    image: "../images/images/bureauSyn.jpg",
    fallback: heroImage,
    title: "Bureau Synodal",
    description:
      "Le Bureau Synodal est l'organe exécutif permanent de l'EEC, chargé d'assurer la gestion courante de l'Église entre les sessions du Conseil Synodal. Il est composé du Président National, du Vice-Président, du Secrétaire Général et de ses adjoints, ainsi que du Trésorier Général.",
  },
  {
    image: "../images/images/news-2.jpg",
    fallback: heroImage,
    title: "Votre Contribution est une Bénédiction",
    description:
      "« Que chacun donne comme il l'a résolu en son cœur, sans tristesse ni contrainte ; car Dieu aime celui qui donne avec joie » (2 Corinthiens 9:7).",
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  // Auto-play toutes les 5 secondes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 3 + slides.length) % slides.length);
  const next = () => setCurrent((c) => (c + 3) % slides.length);

  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">

      {/* ── IMAGES ── */}
      {slides.map((slide, i) => (
        <img
          key={i}
          src={slide.image}
          alt={slide.title}
          onError={(e) => {
            if (slide.fallback) (e.target as HTMLImageElement).src = slide.fallback;
          }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700
            ${i === current ? "opacity-100" : "opacity-0"}`}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-foreground/40" />

      {/* ── TEXTE ── */}
      <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
        {slides.map((slide, i) => (
          <div
            key={i}
            className={`transition-all duration-500 ${i === current ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 absolute inset-0"}`}
          >
            {i === current && (
              <div className="bg-foreground/30 backdrop-blur-sm rounded-lg p-8 md:p-12">
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-primary-foreground mb-4 leading-tight">
                  {slide.title}
                </h1>
                <p className="text-primary-foreground/90 text-lg md:text-xl italic leading-relaxed">
                  {slide.description}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── FLÈCHES ── */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-foreground/70 hover:text-primary-foreground text-4xl z-10 transition-colors"
        aria-label="Précédent"
      >
        ‹
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-foreground/70 hover:text-primary-foreground text-4xl z-10 transition-colors"
        aria-label="Suivant"
      >
        ›
      </button>

      {/* ── INDICATEURS ── */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300
              ${i === current ? "bg-white scale-125" : "bg-white/50 hover:bg-white/75"}`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* ── BOUTONS CTA ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-wrap justify-center gap-3 z-10">
        {/* <Link
          to="/contact"
          className="px-5 py-2 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-lg"
        >
          Faire un don
        </Link> */}

        {/* ── CULTE EN DIRECT YouTube ── */}
        {/* <a
          href={CULTE_YOUTUBE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#FF0000] text-white text-sm font-semibold hover:bg-[#cc0000] transition-colors shadow-lg"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white shrink-0" aria-hidden="true">
            <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/>
          </svg>
          Culte en direct
        </a> */}

        {/* <Link
          to="/contact"
          className="px-5 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white border border-white/40 text-sm font-semibold hover:bg-white/30 transition-colors shadow-lg"
        >
          Nous contacter
        </Link> */}
      </div>

    </section>
  );
};

export default HeroSection;