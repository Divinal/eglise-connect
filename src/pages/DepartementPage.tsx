import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import InfoCard from "@/components/InfoCard";
import heroImage from "@/assets/hero-church.jpg";

const departementNames: Record<string, string> = {
  dgep: "DGEP",
  sante: "Santé",
  jeunesse: "Jeunesse",
  musique: "Musique",
  evangelisation: "Évangélisation",
  "femmes-famille": "Femmes et Famille",
  "education-chretienne": "Éducation-Chrétienne",
  aumonerie: "Aumônerie-Générale",
  communication: "Communication",
};

const DepartementPage = () => {
  const { slug } = useParams();
  const name = departementNames[slug || ""] || "Département";

  return (
    <Layout>
      <div className="bg-primary py-12">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl text-primary-foreground">{name}</h1>
          <p className="text-primary-foreground/70 mt-2">Département de l'Église Évangélique du Congo</p>
        </div>
      </div>
      <section className="py-12 bg-cream">
        <div className="container">
          <p className="text-muted-foreground text-center text-lg">
            Les informations de ce département seront publiées par son responsable.
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default DepartementPage;
