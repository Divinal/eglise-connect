import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Shield, ArrowLeft, User, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface UserRole {
  id: string;
  user_id: string;
  role: string;
  scope_type: string | null;
  scope_id: string | null;
  created_at: string;
  profiles: { email: string | null; full_name: string | null } | null;
}

const ROLES = [
  { value: "admin_general", label: "Admin Général" },
  { value: "admin_departement", label: "Admin Département" },
  { value: "coordinateur_consistoire", label: "Coordinateur Consistoire" },
  { value: "secretaire_paroissial", label: "Secrétaire Paroissial" },
];

const AdminUsersPage = () => {
  const { isAdminGeneral, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !isAdminGeneral) navigate("/admin");
  }, [loading, isAdminGeneral, navigate]);

  const fetchUserRoles = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from("user_roles")
      .select("id, user_id, role, scope_type, scope_id, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      // Fetch profiles separately
      const userIds = [...new Set((data || []).map((r: any) => r.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, email, full_name")
        .in("user_id", userIds);

      const profileMap: Record<string, any> = {};
      (profiles || []).forEach((p: any) => { profileMap[p.user_id] = p; });

      setUserRoles(
        (data || []).map((r: any) => ({
          ...r,
          profiles: profileMap[r.user_id] || null,
        }))
      );
    }
    setFetching(false);
  };

  useEffect(() => { fetchUserRoles(); }, []);

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("user_roles").delete().eq("id", id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Rôle supprimé" });
      fetchUserRoles();
    }
  };

  const getRoleLabel = (role: string) =>
    ROLES.find((r) => r.value === role)?.label || role;

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      admin_general: "bg-red-100 text-red-700 border-red-200",
      admin_departement: "bg-blue-100 text-blue-700 border-blue-200",
      coordinateur_consistoire: "bg-green-100 text-green-700 border-green-200",
      secretaire_paroissial: "bg-amber-100 text-amber-700 border-amber-200",
    };
    return colors[role] || "bg-gray-100 text-gray-700";
  };

  return (
    <Layout>
      <div className="bg-primary py-8">
        <div className="container flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin")}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-display text-2xl text-primary-foreground">
              Gestion des utilisateurs
            </h1>
            <p className="text-primary-foreground/70 text-sm mt-0.5">
              Rôles et accès attribués
            </p>
          </div>
        </div>
      </div>

      <section className="py-8 bg-muted/30 min-h-[60vh]">
        <div className="container">
          {fetching ? (
            <p className="text-muted-foreground text-center py-16">Chargement...</p>
          ) : userRoles.length === 0 ? (
            <div className="text-center py-16">
              <Shield className="h-14 w-14 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Aucun rôle attribué pour le moment.</p>
              <p className="text-sm text-muted-foreground mt-1">
                Utilisez le SQL Editor Supabase pour attribuer des rôles.
              </p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Utilisateur</th>
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Rôle</th>
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Portée</th>
                    <th className="text-left px-5 py-3 font-medium text-muted-foreground">Date</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {userRoles.map((ur) => (
                    <tr key={ur.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {ur.profiles?.full_name || "—"}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {ur.profiles?.email || ur.user_id.slice(0, 8) + "..."}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor(ur.role)}`}>
                          {getRoleLabel(ur.role)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground text-xs">
                        {ur.scope_type ? (
                          <span>{ur.scope_type} — {ur.scope_id?.slice(0, 8)}...</span>
                        ) : (
                          <span className="italic">Global</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground text-xs">
                        {new Date(ur.created_at).toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(ur.id)}
                          className="h-8 w-8 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default AdminUsersPage;
