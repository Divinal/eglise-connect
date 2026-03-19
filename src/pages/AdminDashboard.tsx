import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Shield, Users, Church, Building2, BookOpen, LogOut } from "lucide-react";

const AdminDashboard = () => {
  const { user, roles, loading, isAdminGeneral, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
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

  const adminSections = [
    ...(isAdminGeneral
      ? [
          { icon: Shield, label: "Gestion des utilisateurs", desc: "Gérer les rôles et accès", href: "/admin/users" },
          { icon: Building2, label: "Institutions", desc: "Gérer les institutions synodales", href: "/admin/institutions" },
          { icon: BookOpen, label: "Départements", desc: "Gérer les départements", href: "/admin/departments" },
        ]
      : []),
    ...roles
      .filter((r) => r.role === "admin_departement")
      .map((r) => ({
        icon: BookOpen,
        label: "Mon Département",
        desc: "Gérer les annonces du département",
        href: `/admin/departement/${r.scope_id}`,
      })),
    ...roles
      .filter((r) => r.role === "coordinateur_consistoire")
      .map((r) => ({
        icon: Church,
        label: "Mon Consistoire",
        desc: "Gérer les paroisses et structures",
        href: `/admin/consistoire/${r.scope_id}`,
      })),
    ...roles
      .filter((r) => r.role === "secretaire_paroissial")
      .map((r) => ({
        icon: Users,
        label: "Ma Paroisse",
        desc: "Gérer les informations de la paroisse",
        href: `/admin/paroisse/${r.scope_id}`,
      })),
  ];

  return (
    <Layout>
      <div className="bg-primary py-8">
        <div className="container flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl md:text-3xl text-primary-foreground">
              Tableau de bord
            </h1>
            <p className="text-primary-foreground/70 mt-1">{user?.email}</p>
          </div>
          <Button variant="outline" onClick={handleSignOut} className="gap-2 bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20">
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </div>

      <section className="py-10 bg-muted/30">
        <div className="container">
          {adminSections.length === 0 ? (
            <div className="text-center py-16">
              <Shield className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">Aucun accès configuré</h2>
              <p className="text-muted-foreground">
                Contactez l'administrateur général pour obtenir vos droits d'accès.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {adminSections.map((section, i) => (
                <button
                  key={i}
                  onClick={() => navigate(section.href)}
                  className="flex items-start gap-4 p-6 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all text-left"
                >
                  <div className="p-3 rounded-lg bg-primary/10">
                    <section.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{section.label}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{section.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default AdminDashboard;
