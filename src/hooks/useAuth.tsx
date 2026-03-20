import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface UserRole {
  role: string;
  scope_type: string | null;
  scope_id: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  roles: UserRole[];
  loading: boolean;
  isAdminGeneral: boolean;
  hasRole: (role: string, scopeId?: string) => boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  roles: [],
  loading: true,
  isAdminGeneral: false,
  hasRole: () => false,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = async (userId: string) => {
    console.log("🔍 fetchRoles appelé pour userId:", userId);
    const { data, error } = await supabase
      .from("user_roles")
      .select("role, scope_type, scope_id")
      .eq("user_id", userId);
    console.log("📦 Résultat user_roles:", { data, error });
    setRoles((data as UserRole[]) || []);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("🔐 Session initiale:", session?.user?.email);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchRoles(session.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        console.log("🔄 Auth state change:", _event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          setTimeout(() => fetchRoles(session.user.id), 0);
        } else {
          setRoles([]);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const isAdminGeneral = roles.some((r) => r.role === "admin_general");
  console.log("🎭 roles:", roles, "isAdminGeneral:", isAdminGeneral);

  const hasRole = (role: string, scopeId?: string) => {
    if (isAdminGeneral) return true;
    return roles.some(
      (r) => r.role === role && (!scopeId || r.scope_id === scopeId)
    );
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setRoles([]);
  };

  return (
    <AuthContext.Provider value={{ user, session, roles, loading, isAdminGeneral, hasRole, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);