import Layout from "@/components/Layout";
import { Link } from "react-router-dom";

const consistoires = [
  "Consistoire de Brazzaville-Centre",
  "Consistoire de Bacongo",
  "Consistoire de Poto-Poto",
  "Consistoire de Makélékélé",
  "Consistoire de Talangaï",
  "Consistoire de Ouenzé",
  "Consistoire de Pointe-Noire",
  "Consistoire de Dolisie",
  "Consistoire de Nkayi",
  "Consistoire de Madingou",
];

const ConsistoiresPage = () => {
  return (
    <Layout>
      <div className="bg-primary py-12">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl text-primary-foreground">Consistoires</h1>
          <p className="text-primary-foreground/70 mt-2">Liste des consistoires de l'EEC</p>
        </div>
      </div>
      <section className="py-12 bg-cream">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {consistoires.map((name, i) => (
              <Link
                key={i}
                to={`/institution/consistoires/${i + 1}`}
                className="bg-card border border-border rounded-lg p-6 hover:shadow-lg hover:border-gold transition-all"
              >
                <h3 className="font-display text-lg font-semibold text-primary">{name}</h3>
                <p className="text-sm text-muted-foreground mt-1">Cliquez pour voir les détails</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ConsistoiresPage;
