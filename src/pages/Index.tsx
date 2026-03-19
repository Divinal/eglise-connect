import Layout from "@/components/Layout";
import HeroSection from "@/components/HeroSection";
import CTAButtons from "@/components/CTAButtons";
import InfoCard from "@/components/InfoCard";
import heroImage from "@/assets/hero-church.jpg";

const sampleNews = [
  {
    title: "Assemblée Générale du Synode 2025",
    date: "15 Mars 2025",
    image: heroImage,
    excerpt: "L'Assemblée Générale du Synode National se tiendra à Brazzaville pour discuter des orientations stratégiques de l'EEC pour les années à venir.",
  },
  {
    title: "Campagne d'Évangélisation Nationale",
    date: "10 Mars 2025",
    image: heroImage,
    excerpt: "Le département d'Évangélisation lance une grande campagne nationale pour toucher les communautés rurales du Congo.",
  },
  {
    title: "Formation des Leaders de Jeunesse",
    date: "5 Mars 2025",
    image: heroImage,
    excerpt: "Le département Jeunesse organise une session de formation intensive pour les responsables de jeunesse de tous les consistoires.",
  },
];

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <CTAButtons />

      {/* Recent News */}
      <section className="py-16 bg-cream">
        <div className="container">
          <h2 className="font-display text-3xl font-bold text-primary text-center mb-10">
            Actualités Récentes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleNews.map((news, i) => (
              <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <InfoCard {...news} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-background">
        <div className="container max-w-4xl text-center">
          <h2 className="font-display text-3xl font-bold text-primary mb-6">Notre Mission</h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            L'Église Évangélique du Congo, fondée en 1909 par les missionnaires suédois,
            est une institution spirituelle et sociale clé en République du Congo.
            À travers ses départements, ses consistoires et ses paroisses, elle œuvre
            pour la prédication de l'Évangile, l'éducation, la santé et le développement social.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
