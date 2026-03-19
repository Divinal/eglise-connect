import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, Search } from "lucide-react";
import eecLogo from "@/assets/eec-logo.png";

interface DropdownItem {
  label: string;
  href: string;
}

interface NavItem {
  label: string;
  href: string;
  children?: DropdownItem[];
}

const navItems: NavItem[] = [
  { label: "Accueil", href: "/" },
  {
    label: "Institution",
    href: "/institution",
    children: [
      { label: "Synode", href: "/institution/synode" },
      { label: "Conseil Synodal", href: "/institution/conseil-synodal" },
      { label: "Bureau Synodal", href: "/institution/bureau-synodal" },
      { label: "Consistoires", href: "/institution/consistoires" },
    ],
  },
  {
    label: "Départements",
    href: "/departements",
    children: [
      { label: "DGEP", href: "/departements/dgep" },
      { label: "Santé", href: "/departements/sante" },
      { label: "Jeunesse", href: "/departements/jeunesse" },
      { label: "Musique", href: "/departements/musique" },
      { label: "Évangélisation", href: "/departements/evangelisation" },
      { label: "Femmes et Famille", href: "/departements/femmes-famille" },
      { label: "Éducation-Chrétienne", href: "/departements/education-chretienne" },
      { label: "Aumônerie-Générale", href: "/departements/aumonerie" },
      { label: "Communication", href: "/departements/communication" },
    ],
  },
  {
    label: "Partenaires",
    href: "/partenaires",
    children: [
      { label: "CVAA", href: "/partenaires/cvaa" },
      { label: "Fédération des EPC", href: "/partenaires/federation-epc" },
      { label: "Plateforme des EEAC", href: "/partenaires/plateforme-eeac" },
      { label: "Conseil Œcuménisme ECC", href: "/partenaires/conseil-oecumenisme" },
      { label: "Partenariat Historique", href: "/partenaires/partenariat-historique" },
    ],
  },
  { label: "Contact", href: "/contact" },
  { label: "Blog", href: "/blog" },
];

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = (label: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpenDropdown(label);
  };

  const handleLeave = () => {
    timeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
  };

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  return (
    <nav className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3">
          <img src={eecLogo} alt="EEC" className="h-10 w-10" />
          <span className="font-display text-lg font-bold text-primary">
            Église Évangélique du Congo
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="relative"
              onMouseEnter={() => item.children && handleEnter(item.label)}
              onMouseLeave={handleLeave}
            >
              <Link
                to={item.href}
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors
                  ${item.label === "Accueil" ? "text-gold font-semibold underline underline-offset-4" : "text-foreground hover:text-primary"}`}
              >
                {item.label}
                {item.children && <ChevronDown className="h-3.5 w-3.5" />}
              </Link>

              {item.children && openDropdown === item.label && (
                <div className="nav-dropdown animate-fade-in">
                  {item.children.map((child) => (
                    <Link key={child.href} to={child.href} className="nav-dropdown-item">
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button className="ml-2 p-2 rounded-md border border-border hover:bg-muted transition-colors">
            <Search className="h-4 w-4 text-foreground" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
