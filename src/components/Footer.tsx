import { MapPin, Phone, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const SocialIcons = {
  facebook: <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
  twitter:  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>,
  instagram:<svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-current stroke-2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>,
  youtube:  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>,
};

const Footer = () => {
  return (
    <footer className="bg-navy-dark text-primary-foreground">
      <div className="container py-10 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">

          {/* Colonne 1 — À propos */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="font-display text-lg md:text-xl italic text-gold-light mb-3 md:mb-4">
              Église Évangélique du Congo
            </h3>
            <p className="text-sm leading-relaxed text-primary-foreground/80 mb-4">
              Fondée en <strong>1909</strong> par <em>les missionnaires suédois</em>, l'Église
              Évangélique du Congo (EEC) est l'une des principales dénominations protestantes du pays.
              Elle fonctionne selon un système <strong>presbytérien réformé</strong> et est active dans{" "}
              <strong>l'éducation, la santé et le développement social.</strong>
            </p>
            <div className="flex gap-2.5">
              {[
                { icon: SocialIcons.facebook, href: "https://web.facebook.com/eeccongo" },
                { icon: SocialIcons.twitter,  href: "#" },
                { icon: SocialIcons.instagram, href: "#" },
                { icon: SocialIcons.youtube,  href: "https://www.youtube.com/@salasambilaTv/videos" },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noreferrer"
                  className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center text-white hover:text-white/50 hover:border-white/20 transition-colors">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Colonne 2 — Liens rapides */}
          <div>
            <h3 className="font-display text-lg md:text-xl text-gold-light mb-3 md:mb-4">
              Liens Rapides
            </h3>
            <div className="grid grid-cols-2 gap-x-4">
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-primary-foreground/50 uppercase tracking-wide mb-2">Institution</p>
                <Link to="/institution/synode" className="block text-sm text-primary-foreground/70 hover:text-gold pl-2 py-0.5 transition-colors">Synode</Link>
                <Link to="/institution/conseil-synodal" className="block text-sm text-primary-foreground/70 hover:text-gold pl-2 py-0.5 transition-colors">Conseil Synodal</Link>
                <Link to="/institution/consistoires" className="block text-sm text-primary-foreground/70 hover:text-gold pl-2 py-0.5 transition-colors">Consistoires</Link>
                <Link to="/institution/diaspora" className="block text-sm text-primary-foreground/70 hover:text-gold pl-2 py-0.5 transition-colors">Diaspora</Link>
                <p className="text-xs font-semibold text-primary-foreground/50 uppercase tracking-wide mt-3 mb-2">Départements</p>
                <Link to="/departements/jeunesse" className="block text-sm text-primary-foreground/70 hover:text-gold pl-2 py-0.5 transition-colors">Jeunesse</Link>
                <Link to="/departements/evangelisation" className="block text-sm text-primary-foreground/70 hover:text-gold pl-2 py-0.5 transition-colors">Évangélisation</Link>
                <Link to="/departements/sante" className="block text-sm text-primary-foreground/70 hover:text-gold pl-2 py-0.5 transition-colors">Santé</Link>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-primary-foreground/50 uppercase tracking-wide mb-2">Navigation</p>
                <Link to="/partenaires" className="block text-sm text-primary-foreground/70 hover:text-gold py-0.5 transition-colors">Partenaires</Link>
                <Link to="/blog" className="block text-sm text-primary-foreground/70 hover:text-gold py-0.5 transition-colors">Blog</Link>
                <Link to="/contact" className="block text-sm text-primary-foreground/70 hover:text-gold py-0.5 transition-colors">Contact</Link>
                <Link to="/faq" className="block text-sm text-primary-foreground/70 hover:text-gold py-0.5 transition-colors">FAQ</Link>
                <Link to="/politique-confidentialite" className="block text-sm text-primary-foreground/70 hover:text-gold py-0.5 transition-colors">
                  Politique de conf.
                </Link>
              </div>
            </div>
          </div>

          {/* Colonne 3 — Contact */}
          <div>
            <h3 className="font-display text-lg md:text-xl text-gold-light mb-3 md:mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <span className="text-sm text-primary-foreground/80">
                  Rue Alfred Fourneau, Centre Ville<br />Brazzaville, Congo
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-gold shrink-0" />
                <a href="tel:+2421234567890" className="text-sm text-primary-foreground/80 hover:text-gold transition-colors">
                  +242 12 345 6789
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-gold shrink-0 mt-0.5" />
                <a href="mailto:contact@egliseevangeliquecongo.org"
                  className="text-sm text-primary-foreground/80 hover:text-gold transition-colors break-all">
                  contact@egliseevangeliquecongo.org
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bas du footer */}
      <div className="border-t border-white/10">
        <div className="container py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-primary-foreground/50">
          <span className="text-center sm:text-left">© 2025 Église Évangélique du Congo. Tous droits réservés.</span>
          <Link to="/politique-confidentialite" className="hover:text-primary-foreground/80 transition-colors shrink-0">
            Politique de confidentialité
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
