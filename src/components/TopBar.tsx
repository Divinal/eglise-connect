import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone } from "lucide-react";

const TopBar = () => {
  return (
    <div className="bg-primary text-primary-foreground py-1.5 text-sm">
      <div className="container flex items-center justify-between">
        <div className="flex gap-3">
                  {[
                    { icon: <Facebook className="h-4 w-4" />, href: "https://web.facebook.com/eeccongo" },
                    { icon: <Twitter className="h-4 w-4" />, href: "#" },
                    { icon: <Instagram className="h-4 w-4" />, href: "#" },
                    { icon: <Youtube className="h-4 w-4" />, href: "https://www.youtube.com/@salasambilaTv/videos" },
                  ].map((s, i) => (
                    <a
                      key={i}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="w-10 h-10 rounded-full border border-white flex items-center justify-center text-white hover:text-white/50 hover:border-white/50 transition-colors"
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-gold" /> 
            Rue Alfred Fourneau, Centre Ville Brazzaville, Congo
          </span>
          <span className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 text-gold" />
            +242 12 345 6789
          </span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
