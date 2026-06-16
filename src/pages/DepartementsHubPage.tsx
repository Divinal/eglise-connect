import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { ChevronRight, BookOpen, Heart, Music2, Users, Radio, Megaphone, Cross, GraduationCap, Briefcase } from "lucide-react";

const DEPARTEMENTS = [
  {
    label: "Enseignement Protestant",
    fullLabel: "Dép. Syn. de l'Enseignement Protestant",
    href: "/departements/dgep",
    icon: GraduationCap,
    color: "bg-blue-100 text-blue-700",
  },
  {
    label: "Santé",
    fullLabel: "Dép. Syn. de la Santé",
    href: "/departements/sante",
    icon: Heart,
    color: "bg-red-100 text-red-700",
  },
  {
    label: "Jeunesse",
    fullLabel: "Dép. Syn. de la Jeunesse",
    href: "/departements/jeunesse",
    icon: Users,
    color: "bg-amber-100 text-amber-700",
  },
  {
    label: "Musique & Arts Sacrés",
    fullLabel: "Dép. Syn. de la Musique",
    href: "/departements/musique",
    icon: Music2,
    color: "bg-purple-100 text-purple-700",
  },
  {
    label: "Évangélisation",
    fullLabel: "Dép. Syn. de l'Évangélisation",
    href: "/departements/evangelisation",
    icon: Megaphone,
    color: "bg-green-100 text-green-700",
  },
  {
    label: "Femme & Famille",
    fullLabel: "Dép. Syn. Femme et Famille",
    href: "/departements/femmes-famille",
    icon: Heart,
    color: "bg-pink-100 text-pink-700",
  },
  {
    label: "Éducation Chrétienne",
    fullLabel: "Dép. Syn. de l'Éducation-Chrétienne",
    href: "/departements/education-chretienne",
    icon: BookOpen,
    color: "bg-teal-100 text-teal-700",
  },
  {
    label: "Aumônerie Générale",
    fullLabel: "Dép. Syn. de l'Aumônerie-Générale",
    href: "/departements/aumonerie",
    icon: Cross,
    color: "bg-indigo-100 text-indigo-700",
  },
  {
    label: "Communication",
    fullLabel: "Dép. Syn. de la Communication",
    href: "/departements/communication",
    icon: Radio,
    color: "bg-orange-100 text-orange-700",
  },
  {
    label: "AEP",
    fullLabel: "Action Évangélique des Paroisses",
    href: "/departements/aep",
    icon: Briefcase,
    color: "bg-slate-100 text-slate-700",
  },
];

const DepartementsHubPage = () => {
  const navigate = useNavigate();
  return (
    <Layout>
      <div className="bg-primary py-12">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl text-primary-foreground">Départements Synodaux</h1>
          <p className="text-primary-foreground/70 mt-2">Les départements thématiques de l'EEC</p>
        </div>
      </div>

      <section className="py-12 bg-cream">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DEPARTEMENTS.map(dep => (
              <button
                key={dep.href}
                onClick={() => navigate(dep.href)}
                className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-gold transition-all text-left group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${dep.color}`}>
                      <dep.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-base font-semibold text-primary group-hover:text-gold transition-colors">
                      {dep.label}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">{dep.fullLabel}</p>
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

export default DepartementsHubPage;
