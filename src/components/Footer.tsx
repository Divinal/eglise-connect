import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-navy-dark text-primary-foreground">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Column 1 - About */}
          <div>
            <h3 className="font-display text-xl italic text-gold-light mb-4">
              Église Évangélique du Congo
            </h3>
            <p className="text-sm leading-relaxed text-primary-foreground/80">
              Fondée en <strong>1909</strong> par <em>les missionnaires
              Suédois, l'Église Évangélique du Congo (EEC)</em>{" "}
              est l'une des principales dénominations protestantes du pays. Elle
              fonctionne selon un système <strong>presbytérien réformé</strong>,
              dirigé par un <strong>Synode National</strong> et un{" "}
              <strong>Président National</strong>. L'EEC repose sur les principes
              fondamentaux du protestantisme :{" "}
              <strong>suprématie de la Bible, salut par la foi en Jésus-Christ,
              et importance de la prédication.</strong>{" "}
              En plus de sa mission spirituelle, elle est active dans{" "}
              <strong>l'éducation, la santé et le développement social.</strong>{" "}
              Elle collabore avec plusieurs organisations chrétiennes internationales
              et continue d'avoir un impact significatif au Congo.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-primary-foreground/60 hover:text-gold transition-colors"><Facebook className="h-4 w-4" /></a>
              <a href="#" className="text-primary-foreground/60 hover:text-gold transition-colors"><Twitter className="h-4 w-4" /></a>
              <a href="#" className="text-primary-foreground/60 hover:text-gold transition-colors"><Instagram className="h-4 w-4" /></a>
              <a href="#" className="text-primary-foreground/60 hover:text-gold transition-colors"><Youtube className="h-4 w-4" /></a>
            </div>
          </div>

          {/* Column 2 - Links */}
          <div>
            <h3 className="font-display text-xl text-gold-light mb-4">
              Repertoire et Liens Rapides
            </h3>
            <div className="grid grid-cols-2 gap-x-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-primary-foreground/90">Institution</p>
                <Link to="/institution/synode" className="block text-sm text-primary-foreground/60 hover:text-gold pl-3 transition-colors">Synode</Link>
                <Link to="/institution/conseil-synodal" className="block text-sm text-primary-foreground/60 hover:text-gold pl-3 transition-colors">Conseil Synodal</Link>

                <p className="text-sm font-semibold text-primary-foreground/90 mt-3">Départements</p>
                <Link to="/departements/jeunesse" className="block text-sm text-primary-foreground/60 hover:text-gold pl-3 transition-colors">Jeunesse</Link>
                <Link to="/departements/evangelisation" className="block text-sm text-primary-foreground/60 hover:text-gold pl-3 transition-colors">Évangélisation</Link>

                <p className="text-sm font-semibold text-primary-foreground/90 mt-3">Relations</p>
                <Link to="/partenaires" className="block text-sm text-primary-foreground/60 hover:text-gold pl-3 transition-colors">Œcuménisme</Link>
                <Link to="/partenaires" className="block text-sm text-primary-foreground/60 hover:text-gold pl-3 transition-colors">Partenariats</Link>
              </div>
              <div className="space-y-1">
                <Link to="/faq" className="block text-sm text-primary-foreground/60 hover:text-gold transition-colors">FAQ</Link>
                <Link to="/blog" className="block text-sm text-primary-foreground/60 hover:text-gold transition-colors">Blog</Link>
                <Link to="/contact" className="block text-sm text-primary-foreground/60 hover:text-gold transition-colors">Contact</Link>
                <Link to="/politique-confidentialite" className="block text-sm text-primary-foreground/60 hover:text-gold mt-2 transition-colors">
                  Politique de Confidentialité
                </Link>
              </div>
            </div>
          </div>

          {/* Column 3 - Contact */}
          <div>
            <h3 className="font-display text-xl text-gold-light mb-4">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <span className="text-sm text-primary-foreground/80">
                  Rue Alfred Fourneau, Centre Ville<br />Brazzaville, Congo
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gold shrink-0" />
                <a href="tel:+2421234567890" className="text-sm text-primary-foreground/80 hover:text-gold transition-colors">
                  +242 12 345 6789
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gold shrink-0" />
                <a href="mailto:contact@egliseevangeliquecongo.org" className="text-sm text-primary-foreground/80 hover:text-gold transition-colors">
                  contact@egliseevangeliquecongo.org
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-navy-light">
        <div className="container py-4 text-center text-xs text-primary-foreground/50">
          © 2025 Église Évangélique du Congo. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
