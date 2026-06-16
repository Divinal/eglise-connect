import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { ChevronRight, BookOpen, Users, Building2, GraduationCap, Heart, Music2, Cross } from "lucide-react";

const INSTITUTIONS = [
  {
    label: "Synode",
    desc: "Instance suprême délibérante de l'EEC",
    href: "/institution/synode",
    icon: BookOpen,
    color: "bg-[#1a4d2e]/10 text-[#1a4d2e]",
  },
  {
    label: "Conseil Synodal",
    desc: "Organe exécutif élu par le Synode",
    href: "/institution/conseil-synodal",
    icon: Users,
    color: "bg-blue-100 text-blue-700",
  },
  {
    label: "Bureau Synodal",
    desc: "Direction permanente de l'EEC",
    href: "/institution/bureau-synodal",
    icon: Building2,
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    label: "Pastorale",
    desc: "Encadrement pastoral et spirituel",
    href: "/institution/pastorale",
    icon: Cross,
    color: "bg-amber-100 text-amber-700",
  },
  {
    label: "UPB",
    desc: "Union des Pasteurs de Brazzaville",
    href: "/institution/upb",
    icon: Users,
    color: "bg-purple-100 text-purple-700",
  },
  {
    label: "IFPN",
    desc: "Institut de Formation des Pasteurs du Nord",
    href: "/institution/ifpn",
    icon: GraduationCap,
    color: "bg-teal-100 text-teal-700",
  },
  {
    label: "SUECO",
    desc: "Œuvre d'enseignement et formation chrétienne",
    href: "/institution/sueco",
    icon: GraduationCap,
    color: "bg-green-100 text-green-700",
  },
];

const InstitutionHubPage = () => {
  const navigate = useNavigate();
  return (
    <Layout>
      <div className="bg-primary py-12">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl text-primary-foreground">Institutions</h1>
          <p className="text-primary-foreground/70 mt-2">Les organes et institutions de l'EEC</p>
        </div>
      </div>

      <section className="py-12 bg-cream">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {INSTITUTIONS.map(inst => (
              <button
                key={inst.href}
                onClick={() => navigate(inst.href)}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-gold transition-all text-left group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${inst.color}`}>
                      <inst.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-primary group-hover:text-gold transition-colors">
                      {inst.label}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-snug">{inst.desc}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground/40 shrink-0 mt-1 group-hover:text-gold transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default InstitutionHubPage;
