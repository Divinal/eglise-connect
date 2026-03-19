import heroImage from "@/assets/hero-church.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
      <img
        src={heroImage}
        alt="Église Évangélique du Congo"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-foreground/40" />
      
      <div className="relative z-10 text-center max-w-3xl mx-auto px-4">
        <div className="bg-foreground/30 backdrop-blur-sm rounded-lg p-8 md:p-12">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-primary-foreground mb-4 leading-tight">
            l'Église Évangélique du Congo
          </h1>
          <p className="text-primary-foreground/90 text-lg md:text-xl italic leading-relaxed">
            Est un institution spirituelle et sociale clé en République du Congo. Forte
            de son héritage missionnaire, elle contribue dans la vie religieuse et
            socioculturelle à travers la prédication de l'Évangile.
          </p>
        </div>
      </div>

      {/* Navigation arrows hint */}
      <button className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-foreground/70 hover:text-primary-foreground text-4xl z-10">
        ‹
      </button>
      <button className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-foreground/70 hover:text-primary-foreground text-4xl z-10">
        ›
      </button>
    </section>
  );
};

export default HeroSection;
