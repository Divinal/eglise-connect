import { MapPin, Phone } from "lucide-react";

const SocialIcons = {
  facebook: <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
  twitter:  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>,
  instagram:<svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-none stroke-current stroke-2"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>,
  youtube:  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.95A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z"/></svg>,
};

const TopBar = () => {
  return (
    <div className="bg-primary text-primary-foreground py-1.5 text-sm">
      <div className="container flex items-center justify-between gap-4">

        {/* Réseaux sociaux */}
        <div className="flex gap-2 shrink-0">
          {[
            { icon: SocialIcons.facebook, href: "https://web.facebook.com/eeccongo" },
            { icon: SocialIcons.twitter,  href: "#" },
            { icon: SocialIcons.instagram, href: "#" },
            { icon: SocialIcons.youtube,  href: "https://www.youtube.com/@salasambilaTv/videos" },
          ].map((s, i) => (
            <a key={i} href={s.href} target="_blank" rel="noreferrer"
              className="w-7 h-7 rounded-full border border-white/40 flex items-center justify-center text-white hover:text-white/60 hover:border-white/30 transition-colors">
              {s.icon}
            </a>
          ))}
        </div>

        {/* Adresse + téléphone (caché sur mobile) */}
        <div className="hidden md:flex items-center gap-4 text-xs text-primary-foreground/80 truncate">
          <span className="flex items-center gap-1.5 shrink-0">
            <MapPin className="h-3.5 w-3.5 text-gold shrink-0" />
            <span className="hidden lg:inline">Rue Alfred Fourneau, Centre Ville — </span>
            Brazzaville, Congo
          </span>
          <span className="flex items-center gap-1.5 shrink-0">
            <Phone className="h-3.5 w-3.5 text-gold shrink-0" />
            +242 12 345 6789
          </span>
        </div>

      </div>
    </div>
  );
};

export default TopBar;
