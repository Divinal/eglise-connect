import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Shield, Users, Church, Building2, BookOpen,
  LogOut, ChevronRight, Lock, Megaphone,
  GraduationCap, Globe, Heart, Compass, ShoppingBag, ClipboardCheck, HeartHandshake
} from "lucide-react";

const DashboardCard = ({ icon: Icon, label, desc, color, onClick, badge }: {
  icon: any; label: string; desc: string; color: string; onClick: () => void; badge?: number;
}) => (
  <button
    onClick={onClick}
    className="flex items-start gap-4 p-5 bg-card rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all text-left group"
  >
    <div className={`p-2.5 rounded-lg ${color}`}>
      <Icon className="h-5 w-5" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <p className="font-semibold text-foreground text-sm">{label}</p>
        {!!badge && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white">{badge}</span>
        )}
      </div>
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
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!loading && !user) navigate("/login");
  }, [loading, user, navigate]);

  useEffect(() => {
    if (!isAdminGeneral) return;
    supabase.from("announcements").select("id", { count: "exact", head: true }).eq("status", "pending")
      .then(({ count }) => setPendingCount(count || 0));
  }, [isAdminGeneral]);

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
    admin_consistoire: "Admin Consistoire",
    admin_paroisse: "Admin Paroisse",
    admin_diaspora:              "Admin Diaspora",
    admin_champs_mission:        "Admin Champs de Mission",
    admin_champs_evangelisation: "Admin Champs d'Évangélisation",
    admin_pastorale:             "Admin Pastorale",
    admin_upb:                   "Admin UPB",
    admin_ifpn:                  "Admin IFPN",
    admin_sueco:                 "Admin SUECO",
    admin_ctpad:                 "Admin CTPAD",
    admin_boutique:              "Admin Boutique",
  }[role] || role);

  const getRoleBadgeColor = (role: string) => ({
    admin_general:               "bg-red-100 text-red-700 border border-red-200",
    admin_departement:           "bg-blue-100 text-blue-700 border border-blue-200",
    admin_consistoire:    "bg-green-100 text-green-700 border border-green-200",
    admin_paroisse:       "bg-amber-100 text-amber-700 border border-amber-200",
    admin_diaspora:              "bg-violet-100 text-violet-700 border border-violet-200",
    admin_champs_mission:        "bg-emerald-100 text-emerald-700 border border-emerald-200",
    admin_champs_evangelisation: "bg-orange-100 text-orange-700 border border-orange-200",
    admin_pastorale:             "bg-pink-100 text-pink-700 border border-pink-200",
    admin_upb:                   "bg-cyan-100 text-cyan-700 border border-cyan-200",
    admin_ifpn:                  "bg-indigo-100 text-indigo-700 border border-indigo-200",
    admin_sueco:                 "bg-lime-100 text-lime-700 border border-lime-200",
    admin_ctpad:                 "bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200",
    admin_boutique:              "bg-sky-100 text-sky-700 border border-sky-200",
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
              <div className="grid md:grid-cols-2 gap-4 mb-2">
                <DashboardCard icon={Shield} label="Utilisateurs" desc="Gérer rôles, accès et blocages" color="text-red-600 bg-red-50" onClick={() => navigate("/admin/users")} />
                <DashboardCard icon={Church} label="Consistoires" desc="Créer et gérer les consistoires" color="text-green-600 bg-green-50" onClick={() => navigate("/admin/consistoires")} />
                <DashboardCard icon={ClipboardCheck} label="Validation des publications" desc="Vérifier et valider les annonces des départements, champs, paroisses et consistoires" color="text-amber-600 bg-amber-50" onClick={() => navigate("/admin/validation-annonces")} badge={pendingCount} />
              </div>

              <SectionTitle>Synode — Structures nationales</SectionTitle>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
                <DashboardCard icon={Users} label="Bureau Synodal" desc="Membres du bureau synodal" color="text-indigo-600 bg-indigo-50" onClick={() => navigate("/admin/synode/bureau")} />
                <DashboardCard icon={BookOpen} label="Commissions Synodales" desc="Commissions permanentes du synode" color="text-teal-600 bg-teal-50" onClick={() => navigate("/admin/synode/commissions")} />
                <DashboardCard icon={Building2} label="Organes Synodaux" desc="Organes du synode national" color="text-orange-600 bg-orange-50" onClick={() => navigate("/admin/synode/organes")} />
                <DashboardCard icon={Shield} label="Conseil Synodal" desc="Membres du conseil synodal" color="text-cyan-600 bg-cyan-50" onClick={() => navigate("/admin/synode/conseil")} />
                <DashboardCard icon={Megaphone} label="Annonces Synodales" desc="Annonces et circulaires nationales" color="text-rose-600 bg-rose-50" onClick={() => navigate("/admin/synode/annonces")} />
              </div>

              <SectionTitle>Diaspora, Champs de Mission & Évangélisation</SectionTitle>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
                <DashboardCard icon={Globe} label="Diaspora" desc="Gérer les communautés diaspora" color="text-violet-600 bg-violet-50" onClick={() => navigate("/admin/diaspora")} />
                <DashboardCard icon={Compass} label="Champs de Mission" desc="Gérer les champs de mission" color="text-emerald-600 bg-emerald-50" onClick={() => navigate("/admin/champs-mission")} />
                <DashboardCard icon={Heart} label="Champs d'Évangélisation" desc="Gérer les champs d'évangélisation" color="text-orange-600 bg-orange-50" onClick={() => navigate("/admin/champs-evangelisation")} />
              </div>

              <SectionTitle>Boutique & Dons</SectionTitle>
              <div className="grid md:grid-cols-1 gap-4 mb-2">
                <DashboardCard icon={ShoppingBag} label="Boutique & Dons" desc="Gérer articles, commandes et dons reçus" color="text-sky-600 bg-sky-50" onClick={() => navigate("/admin/boutique")} />
              </div>

              <SectionTitle>Contenus & Publications</SectionTitle>
              <div className="grid md:grid-cols-2 gap-4 mb-2">
                <DashboardCard icon={Megaphone} label="Église de Proximité" desc="Reportages actions sociales" color="text-rose-600 bg-rose-50" onClick={() => navigate("/admin/contenu/eglise-proximite")} />
                <DashboardCard icon={Megaphone} label="Micro de la Semaine" desc="Messages et interviews" color="text-amber-600 bg-amber-50" onClick={() => navigate("/admin/contenu/micro-semaine")} />
              </div>

              <SectionTitle>Institutions connexes</SectionTitle>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <DashboardCard icon={Users} label="Pastorale" desc="Administration de la Pastorale" color="text-pink-600 bg-pink-50" onClick={() => navigate("/admin/institution/pastorale")} />
                <DashboardCard icon={GraduationCap} label="UPB" desc="Université Protestante de Brazza" color="text-cyan-600 bg-cyan-50" onClick={() => navigate("/admin/institution/upb")} />
                <DashboardCard icon={BookOpen} label="IFPN" desc="Institut de Formation Pastorale" color="text-indigo-600 bg-indigo-50" onClick={() => navigate("/admin/institution/ifpn")} />
                <DashboardCard icon={Building2} label="SUECO" desc="Administration du SUECO" color="text-lime-600 bg-lime-50" onClick={() => navigate("/admin/institution/sueco")} />
                <DashboardCard icon={HeartHandshake} label="CTPAD" desc="Coordination Technique de Projet et d'Appuis au Développement" color="text-fuchsia-600 bg-fuchsia-50" onClick={() => navigate("/admin/institution/ctpad")} />
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
          {roles.filter(r => r.role === "admin_consistoire").map((r, i) => (
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
              ADMIN PASTORALE
          ══════════════════════════════════════ */}
          {roles.some(r => r.role === "admin_pastorale") && (
            <div className="mb-8">
              <SectionTitle>La Pastorale</SectionTitle>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <DashboardCard icon={Users} label="Bureau" desc="Membres du bureau" color="text-pink-600 bg-pink-50" onClick={() => navigate("/admin/institution/pastorale")} />
                <DashboardCard icon={Megaphone} label="Annonces" desc="Publier des annonces" color="text-rose-600 bg-rose-50" onClick={() => navigate("/admin/institution/pastorale")} />
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              ADMIN UPB
          ══════════════════════════════════════ */}
          {roles.some(r => r.role === "admin_upb") && (
            <div className="mb-8">
              <SectionTitle>UPB — Université Protestante de Brazzaville</SectionTitle>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <DashboardCard icon={GraduationCap} label="Bureau" desc="Membres du bureau" color="text-cyan-600 bg-cyan-50" onClick={() => navigate("/admin/institution/upb")} />
                <DashboardCard icon={Megaphone} label="Annonces" desc="Publier des annonces" color="text-rose-600 bg-rose-50" onClick={() => navigate("/admin/institution/upb")} />
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              ADMIN IFPN
          ══════════════════════════════════════ */}
          {roles.some(r => r.role === "admin_ifpn") && (
            <div className="mb-8">
              <SectionTitle>IFPN — Institut de Formation Pastorale de Ngouedi</SectionTitle>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <DashboardCard icon={BookOpen} label="Bureau" desc="Membres du bureau" color="text-indigo-600 bg-indigo-50" onClick={() => navigate("/admin/institution/ifpn")} />
                <DashboardCard icon={Megaphone} label="Annonces" desc="Publier des annonces" color="text-rose-600 bg-rose-50" onClick={() => navigate("/admin/institution/ifpn")} />
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              ADMIN SUECO
          ══════════════════════════════════════ */}
          {roles.some(r => r.role === "admin_sueco") && (
            <div className="mb-8">
              <SectionTitle>SUECO</SectionTitle>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <DashboardCard icon={Building2} label="Bureau" desc="Membres du bureau" color="text-lime-600 bg-lime-50" onClick={() => navigate("/admin/institution/sueco")} />
                <DashboardCard icon={Megaphone} label="Annonces" desc="Publier des annonces" color="text-rose-600 bg-rose-50" onClick={() => navigate("/admin/institution/sueco")} />
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              ADMIN CTPAD
          ══════════════════════════════════════ */}
          {roles.some(r => r.role === "admin_ctpad") && (
            <div className="mb-8">
              <SectionTitle>CTPAD — Coordination Technique de Projet et d'Appuis au Développement</SectionTitle>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                <DashboardCard icon={HeartHandshake} label="Bureau" desc="Membres du bureau" color="text-fuchsia-600 bg-fuchsia-50" onClick={() => navigate("/admin/institution/ctpad")} />
                <DashboardCard icon={Megaphone} label="Annonces" desc="Publier des annonces" color="text-rose-600 bg-rose-50" onClick={() => navigate("/admin/institution/ctpad")} />
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              SECRÉTAIRE PAROISSIAL
          ══════════════════════════════════════ */}
          {roles.filter(r => r.role === "admin_paroisse").map((r, i) => (
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

          {/* ══════════════════════════════════════
              ADMIN BOUTIQUE
          ══════════════════════════════════════ */}
          {roles.some(r => r.role === "admin_boutique") && !isAdminGeneral && (
            <div className="mb-8">
              <SectionTitle>Boutique & Dons</SectionTitle>
              <div className="grid md:grid-cols-1 gap-4">
                <DashboardCard icon={ShoppingBag} label="Boutique & Dons" desc="Gérer articles, commandes et dons reçus" color="text-sky-600 bg-sky-50" onClick={() => navigate("/admin/boutique")} />
              </div>
            </div>
          )}

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
