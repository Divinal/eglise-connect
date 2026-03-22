import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, Mail, User } from "lucide-react";

const LoginPage = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast({ title: "Erreur de connexion", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Connexion réussie", description: "Bienvenue !" });
      navigate("/admin");
    }
    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast({ title: "Mot de passe trop court", description: "Minimum 6 caractères.", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) {
      toast({ title: "Erreur d'inscription", description: error.message, variant: "destructive" });
    } else {
      toast({
        title: "Compte créé !",
        description: "Votre compte a été créé. Contactez l'administrateur pour obtenir vos droits d'accès.",
      });
      setMode("login");
      setPassword("");
    }
    setLoading(false);
  };

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center bg-muted/30 py-12">
        <div className="w-full max-w-md mx-auto p-8 bg-card rounded-xl shadow-lg border border-border">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Lock className="h-8 w-8 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">
              Espace Administrateur
            </h1>
            <p className="text-muted-foreground mt-1 text-sm">
              Gérez votre espace EEC
            </p>
          </div>

          {/* Onglets */}
          <div className="flex bg-muted rounded-lg p-1 mb-6">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                mode === "login"
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Se connecter
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
                mode === "signup"
                  ? "bg-card shadow-sm text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Créer un compte
            </button>
          </div>

          {/* Formulaire Connexion */}
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Adresse email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="votre@email.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    className="pl-10" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="password" type="password" placeholder="••••••••"
                    value={password} onChange={e => setPassword(e.target.value)}
                    className="pl-10" required />
                </div>
              </div>
              <Button type="submit" className="w-full mt-2" disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          )}

          {/* Formulaire Inscription */}
          {mode === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="fullname">Nom complet</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="fullname" type="text" placeholder="Prénom NOM"
                    value={fullName} onChange={e => setFullName(e.target.value)}
                    className="pl-10" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email-signup">Adresse email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="email-signup" type="email" placeholder="votre@email.com"
                    value={email} onChange={e => setEmail(e.target.value)}
                    className="pl-10" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password-signup">Mot de passe</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="password-signup" type="password" placeholder="Minimum 6 caractères"
                    value={password} onChange={e => setPassword(e.target.value)}
                    className="pl-10" required />
                </div>
              </div>
              <Button type="submit" className="w-full mt-2" disabled={loading}>
                {loading ? "Création..." : "Créer mon compte"}
              </Button>
              <p className="text-xs text-muted-foreground text-center pt-1">
                Après inscription, contactez l'administrateur général pour obtenir vos droits d'accès.
              </p>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;