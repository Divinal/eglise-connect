import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Shield, Users, Church, Building2, BookOpen,
  LogOut, ChevronRight, Lock
} from "lucide-react";

const AdminDashboard = () => {
  const { user, roles, loading, isAdminGeneral, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Chargement...</p>
        </div>
      </Layout>
    );
  }

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin_general: "Administrateur Général",
      admin_departement: "Admin Département",
      coordinateur_consistoire: "Coordinateur de Consistoire",
      secretaire_paroissial: "Secrétaire Paroissial",
    };
    return labels[role] || role;
  };

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      admin_general: "bg-red-100 text-red-700 border border-red-200",
      admin_departement: "bg-blue-100 text-blue-700 border border-blue-200",
      coordinateur_consistoire: "bg-green-100 text-green-700 border border-green-200",
      secretaire_paroissial: "bg-amber-100 text-amber-700 border border-amber-200",
    };
    return colors[role] || "bg-gray-100 text-gray-700";
  };

  // Sections pour l'admin général
  const adminGeneralSections = [
    {
      icon: Shield,
      label: "Gestion des utilisateurs",
      desc: "Gérer les rôles, accès et blocages",
      href: "/admin/users",
      color: "text-red-600 bg-red-50",
    },
    {
      icon: Church,
      label: "Consistoires",
      desc: "Créer et gérer les consistoires",
      href: "/admin/consistoires",
      color: "text-green-600 bg-green-50",
    },
    {
      icon: Building2,
      label: "Institutions",
      desc: "Gérer les institutions synodales",
      href: "/admin/institutions",
      color: "text-purple-600 bg-purple-50",
    },
    {
      icon: BookOpen,
      label: "Départements",
      desc: "Gérer les départements",
      href: "/admin/departments",
      color: "text-blue-600 bg-blue-50",
    },
  ];

  return (
    <Layout>
      {/* Header */}
      <div className="bg-primary py-8">
        <div className="container flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl md:text-3xl text-primary-foreground">
              Tableau de bord
            </h1>
            <p className="text-primary-foreground/70 mt-1 text-sm">{user?.email}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {roles.map((r, i) => (
                <span key={i} className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${getRoleBadgeColor(r.role)}`}>
                  {getRoleLabel(r.role)}
                </span>
              ))}
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleSignOut}
            className="gap-2 bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </div>

      <section className="py-10 bg-muted/30 min-h-[60vh]">
        <div className="container">

          {/* === ADMIN GÉNÉRAL === */}
          {isAdminGeneral && (
            <div className="mb-10">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Administration générale
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {adminGeneralSections.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => navigate(s.href)}
                    className="flex items-start gap-4 p-5 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all text-left group"
                  >
                    <div className={`p-2.5 rounded-lg ${s.color}`}>
                      <s.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm">{s.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* === COORDINATEUR CONSISTOIRE === */}
          {roles.filter(r => r.role === "coordinateur_consistoire").map((r, i) => (
            <div key={i} className="mb-10">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Mon Consistoire
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { icon: Church, label: "Paroisses", desc: "Gérer les paroisses", href: `/admin/consistoire/${r.scope_id}/paroisses`, color: "text-green-600 bg-green-50" },
                  { icon: Users, label: "Bureaux", desc: "Bureau consistorial", href: `/admin/consistoire/${r.scope_id}/bureau`, color: "text-blue-600 bg-blue-50" },
                  { icon: BookOpen, label: "Commissions", desc: "Commissions consistoriales", href: `/admin/consistoire/${r.scope_id}/commissions`, color: "text-amber-600 bg-amber-50" },
                  { icon: Building2, label: "Organes", desc: "Organes consistoriaux", href: `/admin/consistoire/${r.scope_id}/organes`, color: "text-purple-600 bg-purple-50" },
                  { icon: Shield, label: "Conseil", desc: "Conseil consistorial", href: `/admin/consistoire/${r.scope_id}/conseil`, color: "text-teal-600 bg-teal-50" },
                  { icon: Users, label: "Secrétaires", desc: "Gérer les secrétaires paroissiaux", href: `/admin/consistoire/${r.scope_id}/secretaires`, color: "text-red-600 bg-red-50" },
                ].map((s, j) => (
                  <button
                    key={j}
                    onClick={() => navigate(s.href)}
                    className="flex items-start gap-4 p-5 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all text-left group"
                  >
                    <div className={`p-2.5 rounded-lg ${s.color}`}>
                      <s.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm">{s.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* === SECRÉTAIRE PAROISSIAL === */}
          {roles.filter(r => r.role === "secretaire_paroissial").map((r, i) => (
            <div key={i} className="mb-10">
              <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Ma Paroisse
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { icon: Users, label: "Bureau paroissial", desc: "Membres du bureau", href: `/admin/paroisse/${r.scope_id}/bureau`, color: "text-blue-600 bg-blue-50" },
                  { icon: Building2, label: "Organes", desc: "Organes de la paroisse", href: `/admin/paroisse/${r.scope_id}/organes`, color: "text-purple-600 bg-purple-50" },
                  { icon: Shield, label: "Conseil paroissial", desc: "Membres du conseil", href: `/admin/paroisse/${r.scope_id}/conseil`, color: "text-teal-600 bg-teal-50" },
                  { icon: BookOpen, label: "Groupes chantants", desc: "Groupes et effectifs", href: `/admin/paroisse/${r.scope_id}/groupes`, color: "text-amber-600 bg-amber-50" },
                  { icon: Church, label: "Annexes", desc: "Annexes de la paroisse", href: `/admin/paroisse/${r.scope_id}/annexes`, color: "text-green-600 bg-green-50" },
                  { icon: Building2, label: "Informations", desc: "Modifier les infos de la paroisse", href: `/admin/paroisse/${r.scope_id}/infos`, color: "text-red-600 bg-red-50" },
                ].map((s, j) => (
                  <button
                    key={j}
                    onClick={() => navigate(s.href)}
                    className="flex items-start gap-4 p-5 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all text-left group"
                  >
                    <div className={`p-2.5 rounded-lg ${s.color}`}>
                      <s.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground text-sm">{s.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{s.desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Aucun rôle */}
          {roles.length === 0 && (
            <div className="text-center py-16">
              <Lock className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Aucun accès configuré</h2>
              <p className="text-muted-foreground">
                Contactez l'administrateur général pour obtenir vos droits d'accès.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default AdminDashboard;
