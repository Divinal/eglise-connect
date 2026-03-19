import { Link } from "react-router-dom";

const CTAButtons = () => {
  return (
    <div className="flex items-center justify-center gap-6 py-10 bg-background">
      <Link
        to="/don"
        className="px-8 py-3 rounded-full border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
      >
        Faire un don
      </Link>
      <Link
        to="/contact"
        className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-navy-dark transition-colors"
      >
        Nous contacter
      </Link>
    </div>
  );
};

export default CTAButtons;
