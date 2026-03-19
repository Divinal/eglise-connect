import { Facebook, Twitter, Instagram, Youtube, MapPin, Phone } from "lucide-react";

const TopBar = () => {
  return (
    <div className="bg-primary text-primary-foreground py-1.5 text-sm">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-gold transition-colors"><Facebook className="h-4 w-4" /></a>
          <a href="#" className="hover:text-gold transition-colors"><Twitter className="h-4 w-4" /></a>
          <a href="#" className="hover:text-gold transition-colors"><Instagram className="h-4 w-4" /></a>
          <a href="#" className="hover:text-gold transition-colors"><Youtube className="h-4 w-4" /></a>
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
