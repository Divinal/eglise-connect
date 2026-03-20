import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Search, X, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import eecLogo from "@/assets/eec-logo.png";

interface DropdownItem { label: string; href: string; }
interface NavItem { label: string; href: string; children?: DropdownItem[]; }

const navItems: NavItem[] = [
  { label: "Accueil", href: "/" },
  {
    label: "Institution", href: "/institution",
    children: [
      { label: "Synode", href: "/institution/synode" },
      { label: "Conseil Synodal", href: "/institution/conseil-synodal" },
      { label: "Bureau Synodal", href: "/institution/bureau-synodal" },
      { label: "Consistoires", href: "/institution/consistoires" },
    ],
  },
  {
    label: "Départements", href: "/departements",
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
    label: "Partenaires", href: "/partenaires",
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

// Données statiques des départements pour la recherche locale
const DEPARTEMENTS_STATIQUES = [
  { name: "DGEP", fullName: "Direction Générale de l'Évangélisation et des Paroisses", slug: "dgep" },
  { name: "Santé", fullName: "Département de la Santé", slug: "sante" },
  { name: "Jeunesse", fullName: "Département de la Jeunesse", slug: "jeunesse" },
  { name: "Musique", fullName: "Département de la Musique et des Arts Sacrés", slug: "musique" },
  { name: "Évangélisation", fullName: "Département de l'Évangélisation", slug: "evangelisation" },
  { name: "Femmes et Famille", fullName: "Département Femmes et Famille", slug: "femmes-famille" },
  { name: "Éducation Chrétienne", fullName: "Département de l'Éducation Chrétienne", slug: "education-chretienne" },
  { name: "Aumônerie Générale", fullName: "Département de l'Aumônerie Générale", slug: "aumonerie" },
  { name: "Communication", fullName: "Département de la Communication", slug: "communication" },
];

const INSTITUTIONS_STATIQUES = [
  { name: "Synode", desc: "Institution suprême de l'EEC", href: "/institution/synode" },
  { name: "Conseil Synodal", desc: "Organe exécutif du Synode", href: "/institution/conseil-synodal" },
  { name: "Bureau Synodal", desc: "Direction permanente", href: "/institution/bureau-synodal" },
  { name: "Consistoires", desc: "Structures régionales de l'EEC", href: "/institution/consistoires" },
];

interface SearchResult {
  id: string;
  type: "departement" | "institution" | "annonce" | "paroisse" | "consistoire";
  title: string;
  subtitle?: string;
  href: string;
}

const TYPE_LABELS: Record<string, string> = {
  departement: "Département",
  institution: "Institution",
  annonce: "Annonce",
  paroisse: "Paroisse",
  consistoire: "Consistoire",
};

const TYPE_COLORS: Record<string, string> = {
  departement: "bg-blue-100 text-blue-700",
  institution: "bg-purple-100 text-purple-700",
  annonce: "bg-green-100 text-green-700",
  paroisse: "bg-amber-100 text-amber-700",
  consistoire: "bg-teal-100 text-teal-700",
};

const SearchModal = ({ onClose }: { onClose: () => void }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const q = query.toLowerCase();
      const found: SearchResult[] = [];

      // 1. Recherche locale départements
      DEPARTEMENTS_STATIQUES.filter(d =>
        d.name.toLowerCase().includes(q) || d.fullName.toLowerCase().includes(q)
      ).forEach(d => found.push({
        id: d.slug, type: "departement",
        title: d.name, subtitle: d.fullName,
        href: `/departements/${d.slug}`,
      }));

      // 2. Recherche locale institutions
      INSTITUTIONS_STATIQUES.filter(i =>
        i.name.toLowerCase().includes(q) || i.desc.toLowerCase().includes(q)
      ).forEach(i => found.push({
        id: i.href, type: "institution",
        title: i.name, subtitle: i.desc,
        href: i.href,
      }));

      // 3. Annonces en base
      const { data: annonces } = await supabase
        .from("announcements")
        .select("id, title, content, entity_type, entity_id")
        .ilike("title", `%${query}%`)
        .limit(5);

      // Récupérer les noms des départements pour les annonces
      const deptIds = (annonces || []).filter(a => a.entity_type === "departement").map(a => a.entity_id).filter(Boolean);
      let deptMap: Record<string, string> = {};
      if (deptIds.length > 0) {
        const { data: depts } = await supabase.from("departments").select("id, slug, name").in("id", deptIds);
        (depts || []).forEach((d: any) => { deptMap[d.id] = d.slug; });
      }

      (annonces || []).forEach((a: any) => {
        let href = "/";
        if (a.entity_type === "departement" && deptMap[a.entity_id]) {
          href = `/departements/${deptMap[a.entity_id]}`;
        }
        found.push({
          id: a.id, type: "annonce",
          title: a.title, subtitle: a.content?.slice(0, 60) || "",
          href,
        });
      });

      // 4. Consistoires en base
      const { data: consistoires } = await supabase
        .from("consistoires")
        .select("id, name, ville")
        .ilike("name", `%${query}%`)
        .limit(5);
      (consistoires || []).forEach((c: any) => found.push({
        id: c.id, type: "consistoire",
        title: c.name, subtitle: c.ville || "",
        href: `/institution/consistoires/${c.id}`,
      }));

      // 5. Paroisses en base
      const { data: paroisses } = await supabase
        .from("paroisses")
        .select("id, name, ville")
        .ilike("name", `%${query}%`)
        .limit(5);
      (paroisses || []).forEach((p: any) => found.push({
        id: p.id, type: "paroisse",
        title: p.name, subtitle: p.ville || "",
        href: `/institution/consistoires`,
      }));

      setResults(found);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (href: string) => {
    navigate(href);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
      onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative w-full max-w-2xl bg-card rounded-2xl shadow-2xl border border-border overflow-hidden"
        onClick={e => e.stopPropagation()}>

        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-border">
          <Search className="h-5 w-5 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher un département, annonce, paroisse…"
            className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-sm"
          />
          {loading && <Loader2 className="h-4 w-4 text-muted-foreground animate-spin shrink-0" />}
          <button onClick={onClose} className="p-1 rounded-md hover:bg-muted transition-colors">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {/* Résultats */}
        <div className="max-h-96 overflow-y-auto">
          {query.length < 2 ? (
            <div className="px-4 py-8 text-center">
              <Search className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Tapez au moins 2 caractères pour rechercher</p>
            </div>
          ) : results.length === 0 && !loading ? (
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-muted-foreground">Aucun résultat pour "<strong>{query}</strong>"</p>
            </div>
          ) : (
            <div className="py-2">
              {results.map(r => (
                <button key={r.id + r.type} onClick={() => handleSelect(r.href)}
                  className="w-full flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 mt-0.5 ${TYPE_COLORS[r.type]}`}>
                    {TYPE_LABELS[r.type]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{r.title}</p>
                    {r.subtitle && <p className="text-xs text-muted-foreground truncate">{r.subtitle}</p>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-border bg-muted/30">
          <p className="text-xs text-muted-foreground">Appuyez sur <kbd className="px-1 py-0.5 bg-card border border-border rounded text-xs">Échap</kbd> pour fermer</p>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
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

  // Raccourci clavier Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
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
              <div key={item.label} className="relative"
                onMouseEnter={() => item.children && handleEnter(item.label)}
                onMouseLeave={handleLeave}>
                <Link to={item.href}
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors
                    ${item.label === "Accueil" ? "text-gold font-semibold underline underline-offset-4" : "text-foreground hover:text-primary"}`}>
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

            <button
              onClick={() => setSearchOpen(true)}
              className="ml-2 flex items-center gap-2 px-3 py-1.5 rounded-md border border-border hover:bg-muted transition-colors text-sm text-muted-foreground"
              title="Rechercher (Ctrl+K)"
            >
              <Search className="h-4 w-4" />
              <span className="hidden xl:inline text-xs">Ctrl K</span>
            </button>
          </div>
        </div>
      </nav>

      {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
    </>
  );
};

export default Navbar;