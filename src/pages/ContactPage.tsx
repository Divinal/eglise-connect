import Layout from "@/components/Layout";
import { MapPin, Phone, Mail } from "lucide-react";

const ContactPage = () => {
  return (
    <Layout>
      <div className="bg-primary py-12">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl text-primary-foreground">Contact</h1>
        </div>
      </div>
      <section className="py-12 bg-cream">
        <div className="container max-w-2xl">
          <div className="bg-card rounded-lg p-8 shadow-md border border-border space-y-6">
            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-gold shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground">Adresse</h3>
                <p className="text-muted-foreground">Rue Alfred Fourneau, Centre Ville, Brazzaville, Congo</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Phone className="h-6 w-6 text-gold shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground">Téléphone</h3>
                <p className="text-muted-foreground">+242 12 345 6789</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Mail className="h-6 w-6 text-gold shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground">Email</h3>
                <p className="text-muted-foreground">contact@egliseevangeliquecongo.org</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;
