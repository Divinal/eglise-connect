import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import {
  Shield, Users, Church, Building2, BookOpen,
  LogOut, ChevronRight, Lock, Megaphone, Cross
} from "lucide-react";

const DashboardCard = ({ icon: Icon, label, desc, color, onClick }: {
  icon: any; label: string; desc: string; color: string; onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex items-start gap-4 p-5 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all text-left group"
  >
    <div className={`p-2.5 rounded-lg ${color}`}>
      <Icon className="h-5 w-5" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="font-semibold text-foreground text-sm">{label}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
    </div>
    <ChevronRight className="h-4 w-4 text-muted-foreground/40 shrink-0 mt-0.5 group-hover:text-primary transition-colors" />
  </button>
);

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 mt-8 first:mt-0">
    {children}
  </h2>
);

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

  const getRoleLabel = (role: string) => ({
    admin_general: "Administrateur Général",
    admin_departement: "Admin Département",
    coordinateur_consistoire: "Coordinateur de Consistoire",
    secretaire_paroissial: "Secrétaire Paroissial",
    admin_diaspora: "Admin Diaspora",
    admin_champs_mission: "Admin Champs de Mission",
    admin_champs_evangelisation: "Admin Champs d'Évangélisation",
  }[role] || role);

  const getRoleBadgeColor = (role: string) => ({
    admin_general: "bg-red-100 text-red-700 border border-red-200",
    admin_departement: "bg-blue-100 text-blue-700 border border-blue-200",
    coordinateur_consistoire: "bg-green-100 text-green-700 border border-green-200",
    secretaire_paroissial: "bg-amber-100 text-amber-700 border border-amber-200",
    admin_diaspora: "bg-violet-100 text-violet-700 border border-violet-200",
    admin_champs_mission: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    admin_champs_evangelisation: "bg-orange-100 text-orange-700 border border-orange-200",
  }[role] || "bg-gray-100 text-gray-700");

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
                <span key={i} className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${getRoleBadgeColor(r.role)}`}>
                  {getRoleLabel(r.role)}
                </span>
              ))}
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}
            className="gap-2 bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20">
            <LogOut className="h-4 w-4" /> Déconnexion
          </Button>
        </div>
      </div>

      <section className="py-10 bg-muted/30 min-h-[60vh]">
        <div className="container">

          {/* ══════════════════════════════════════
              ADMIN GÉNÉRAL
          ══════════════════════════════════════ */}
          {isAdminGeneral && (
            <>
              <SectionTitle>Administration générale</SectionTitle>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
                <DashboardCard icon={Shield} label="Utilisateurs" desc="Gérer rôles, accès et blocages" color="text-red-600 bg-red-50" onClick={() => navigate("/admin/users")} />
                <DashboardCard icon={Church} label="Consistoires" desc="Créer et gérer les consistoires" color="text-green-600 bg-green-50" onClick={() => navigate("/admin/consistoires")} />
                <DashboardCard icon={Building2} label="Institutions" desc="Gérer les institutions synodales" color="text-purple-600 bg-purple-50" onClick={() => navigate("/admin/institutions")} />
                <DashboardCard icon={BookOpen} label="Départements" desc="Gérer les départements" color="text-blue-600 bg-blue-50" onClick={() => navigate("/admin/departments")} />
              </div>

              <SectionTitle>Synode — Structures nationales</SectionTitle>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <DashboardCard icon={Users} label="Bureau Synodal" desc="Membres du bureau synodal" color="text-indigo-600 bg-indigo-50" onClick={() => navigate("/admin/synode/bureau")} />
                <DashboardCard icon={BookOpen} label="Commissions Synodales" desc="Commissions permanentes du synode" color="text-teal-600 bg-teal-50" onClick={() => navigate("/admin/synode/commissions")} />
                <DashboardCard icon={Building2} label="Organes Synodaux" desc="Organes du synode national" color="text-orange-600 bg-orange-50" onClick={() => navigate("/admin/synode/organes")} />
                <DashboardCard icon={Shield} label="Conseil Synodal" desc="Membres du conseil synodal" color="text-cyan-600 bg-cyan-50" onClick={() => navigate("/admin/synode/conseil")} />
                <DashboardCard icon={Megaphone} label="Annonces Synodales" desc="Annonces et circulaires nationales" color="text-rose-600 bg-rose-50" onClick={() => navigate("/admin/synode/annonces")} />
              </div>
            </>
          )}

          {/* ══════════════════════════════════════
              ADMIN DÉPARTEMENT
          ══════════════════════════════════════ */}
          {roles.filter(r => r.role === "admin_departement").map((r, i) => (
            <div key={i} className="mb-8">
              <SectionTitle>Mon Département</SectionTitle>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <DashboardCard icon={Users} label="Bureau du département" desc="Membres et responsables" color="text-blue-600 bg-blue-50" onClick={() => navigate(`/admin/departement/${r.scope_id}/bureau`)} />
                <DashboardCard icon={Megaphone} label="Annonces" desc="Publier des annonces du département" color="text-amber-600 bg-amber-50" onClick={() => navigate(`/admin/departement/${r.scope_id}/annonces`)} />
                <DashboardCard icon={BookOpen} label="Informations" desc="Modifier les infos du département" color="text-teal-600 bg-teal-50" onClick={() => navigate(`/admin/departement/${r.scope_id}/infos`)} />
              </div>
            </div>
          ))}

          {/* ══════════════════════════════════════
              COORDINATEUR CONSISTOIRE
          ══════════════════════════════════════ */}
          {roles.filter(r => r.role === "coordinateur_consistoire").map((r, i) => (
            <div key={i} className="mb-8">
              <SectionTitle>Mon Consistoire</SectionTitle>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <DashboardCard icon={Church} label="Paroisses" desc="Gérer les paroisses" color="text-green-600 bg-green-50" onClick={() => navigate(`/admin/consistoire/${r.scope_id}/paroisses`)} />
                <DashboardCard icon={Users} label="Bureau consistorial" desc="Membres du bureau" color="text-blue-600 bg-blue-50" onClick={() => navigate(`/admin/consistoire/${r.scope_id}/bureau`)} />
                <DashboardCard icon={BookOpen} label="Commissions" desc="Commissions consistoriales" color="text-amber-600 bg-amber-50" onClick={() => navigate(`/admin/consistoire/${r.scope_id}/commissions`)} />
                <DashboardCard icon={Building2} label="Organes" desc="Organes consistoriaux" color="text-purple-600 bg-purple-50" onClick={() => navigate(`/admin/consistoire/${r.scope_id}/organes`)} />
                <DashboardCard icon={Shield} label="Conseil" desc="Conseil consistorial" color="text-teal-600 bg-teal-50" onClick={() => navigate(`/admin/consistoire/${r.scope_id}/conseil`)} />
                <DashboardCard icon={Shield} label="Secrétaires" desc="Gérer les secrétaires paroissiaux" color="text-red-600 bg-red-50" onClick={() => navigate(`/admin/consistoire/${r.scope_id}/secretaires`)} />
              </div>
            </div>
          ))}

          {/* ══════════════════════════════════════
              ADMIN DIASPORA
          ══════════════════════════════════════ */}
          {roles.filter(r => r.role === "admin_diaspora").map((r, i) => (
            <div key={i} className="mb-8">
              <SectionTitle>Ma Communauté Diaspora</SectionTitle>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <DashboardCard icon={Users} label="Bureau" desc="Membres du bureau" color="text-violet-600 bg-violet-50" onClick={() => navigate(`/admin/diaspora/${r.scope_id}/bureau`)} />
                <DashboardCard icon={Shield} label="Conseil" desc="Conseil de la diaspora" color="text-teal-600 bg-teal-50" onClick={() => navigate(`/admin/diaspora/${r.scope_id}/conseil`)} />
                <DashboardCard icon={BookOpen} label="Commissions" desc="Commissions" color="text-amber-600 bg-amber-50" onClick={() => navigate(`/admin/diaspora/${r.scope_id}/commissions`)} />
                <DashboardCard icon={Building2} label="Organes" desc="Organes" color="text-purple-600 bg-purple-50" onClick={() => navigate(`/admin/diaspora/${r.scope_id}/organes`)} />
                <DashboardCard icon={Megaphone} label="Annonces" desc="Publier des annonces" color="text-rose-600 bg-rose-50" onClick={() => navigate(`/admin/diaspora/${r.scope_id}/annonces`)} />
              </div>
            </div>
          ))}

          {/* ══════════════════════════════════════
              ADMIN CHAMPS DE MISSION
          ══════════════════════════════════════ */}
          {roles.filter(r => r.role === "admin_champs_mission").map((r, i) => (
            <div key={i} className="mb-8">
              <SectionTitle>Mon Champ de Mission</SectionTitle>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <DashboardCard icon={Users} label="Bureau" desc="Membres du bureau" color="text-emerald-600 bg-emerald-50" onClick={() => navigate(`/admin/champs-mission/${r.scope_id}/bureau`)} />
                <DashboardCard icon={Shield} label="Conseil" desc="Conseil du champ" color="text-teal-600 bg-teal-50" onClick={() => navigate(`/admin/champs-mission/${r.scope_id}/conseil`)} />
                <DashboardCard icon={BookOpen} label="Commissions" desc="Commissions" color="text-amber-600 bg-amber-50" onClick={() => navigate(`/admin/champs-mission/${r.scope_id}/commissions`)} />
                <DashboardCard icon={Building2} label="Organes" desc="Organes" color="text-purple-600 bg-purple-50" onClick={() => navigate(`/admin/champs-mission/${r.scope_id}/organes`)} />
                <DashboardCard icon={Megaphone} label="Annonces" desc="Publier des annonces" color="text-rose-600 bg-rose-50" onClick={() => navigate(`/admin/champs-mission/${r.scope_id}/annonces`)} />
              </div>
            </div>
          ))}

          {/* ══════════════════════════════════════
              ADMIN CHAMPS D'ÉVANGÉLISATION
          ══════════════════════════════════════ */}
          {roles.filter(r => r.role === "admin_champs_evangelisation").map((r, i) => (
            <div key={i} className="mb-8">
              <SectionTitle>Mon Champ d'Évangélisation</SectionTitle>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <DashboardCard icon={Users} label="Bureau" desc="Membres du bureau" color="text-orange-600 bg-orange-50" onClick={() => navigate(`/admin/champs-evangelisation/${r.scope_id}/bureau`)} />
                <DashboardCard icon={Shield} label="Conseil" desc="Conseil du champ" color="text-teal-600 bg-teal-50" onClick={() => navigate(`/admin/champs-evangelisation/${r.scope_id}/conseil`)} />
                <DashboardCard icon={BookOpen} label="Commissions" desc="Commissions" color="text-amber-600 bg-amber-50" onClick={() => navigate(`/admin/champs-evangelisation/${r.scope_id}/commissions`)} />
                <DashboardCard icon={Building2} label="Organes" desc="Organes" color="text-purple-600 bg-purple-50" onClick={() => navigate(`/admin/champs-evangelisation/${r.scope_id}/organes`)} />
                <DashboardCard icon={Megaphone} label="Annonces" desc="Publier des annonces" color="text-rose-600 bg-rose-50" onClick={() => navigate(`/admin/champs-evangelisation/${r.scope_id}/annonces`)} />
              </div>
            </div>
          ))}

          {/* ══════════════════════════════════════
              SECRÉTAIRE PAROISSIAL
          ══════════════════════════════════════ */}
          {roles.filter(r => r.role === "secretaire_paroissial").map((r, i) => (
            <div key={i} className="mb-8">
              <SectionTitle>Ma Paroisse</SectionTitle>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <DashboardCard icon={Users} label="Bureau paroissial" desc="Membres du bureau" color="text-blue-600 bg-blue-50" onClick={() => navigate(`/admin/paroisse/${r.scope_id}/bureau`)} />
                <DashboardCard icon={Building2} label="Organes" desc="Organes de la paroisse" color="text-purple-600 bg-purple-50" onClick={() => navigate(`/admin/paroisse/${r.scope_id}/organes`)} />
                <DashboardCard icon={Shield} label="Conseil paroissial" desc="Membres du conseil" color="text-teal-600 bg-teal-50" onClick={() => navigate(`/admin/paroisse/${r.scope_id}/conseil`)} />
                <DashboardCard icon={BookOpen} label="Groupes chantants" desc="Groupes et effectifs" color="text-amber-600 bg-amber-50" onClick={() => navigate(`/admin/paroisse/${r.scope_id}/groupes`)} />
                <DashboardCard icon={Church} label="Annexes" desc="Annexes de la paroisse" color="text-green-600 bg-green-50" onClick={() => navigate(`/admin/paroisse/${r.scope_id}/annexes`)} />
                <DashboardCard icon={Building2} label="Informations" desc="Modifier les infos de la paroisse" color="text-red-600 bg-red-50" onClick={() => navigate(`/admin/paroisse/${r.scope_id}/infos`)} />
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
