import { Link } from "react-router-dom";

const CULTE_YOUTUBE_URL = "https://www.youtube.com/@EgliseEvangeliqueduCongo";

const CTAButtons = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 py-10 bg-background">
      <Link
        to="/don"
        className="px-6 py-2.5 rounded-full border-2 border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
      >
        Faire un don
      </Link>

      <a
        href={CULTE_YOUTUBE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#FF0000] text-white text-sm font-semibold hover:bg-[#cc0000] transition-colors shadow-sm"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-white shrink-0" aria-hidden="true">
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1C24 15.9 24 12 24 12s0-3.9-.5-5.8zM9.7 15.5V8.5l6.3 3.5-6.3 3.5z"/>
        </svg>
        Culte en ligne
      </a>

      <Link
        to="/contact"
        className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-navy-dark transition-colors"
      >
        Nous contacter
      </Link>
      
        <Link
        to="/"
        className="px-6 py-2.5 rounded-full border-2 border-primary text-primary text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
      >
        Eglise de proximité
      </Link>

       <Link
        to="/contact"
        className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:bg-navy-dark transition-colors"
      >
        Le Micro de la semaine
      </Link>
      
    </div>
  );
};

export default CTAButtons;
