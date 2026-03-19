import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, ArrowLeft, Pencil, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface Department {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  updated_at: string;
}

const AdminDepartmentsPage = () => {
  const { isAdminGeneral, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [fetching, setFetching] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", description: "" });

  useEffect(() => {
    if (!loading && !isAdminGeneral) navigate("/admin");
  }, [loading, isAdminGeneral, navigate]);

  const fetchDepartments = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from("departments")
      .select("*")
      .order("name");
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setDepartments(data || []);
    }
    setFetching(false);
  };

  useEffect(() => { fetchDepartments(); }, []);

  const startEdit = (dept: Department) => {
    setEditingId(dept.id);
    setEditForm({ name: dept.name, description: dept.description || "" });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", description: "" });
  };

  const saveEdit = async (id: string) => {
    const { error } = await supabase
      .from("departments")
      .update({ name: editForm.name, description: editForm.description || null })
      .eq("id", id);

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Département mis à jour" });
      cancelEdit();
      fetchDepartments();
    }
  };

  const slugColors: Record<string, string> = {
    dgep: "bg-indigo-100 text-indigo-700",
    sante: "bg-rose-100 text-rose-700",
    jeunesse: "bg-amber-100 text-amber-700",
    musique: "bg-purple-100 text-purple-700",
    evangelisation: "bg-green-100 text-green-700",
    "femmes-famille": "bg-pink-100 text-pink-700",
    "education-chretienne": "bg-blue-100 text-blue-700",
    aumonerie: "bg-teal-100 text-teal-700",
    communication: "bg-orange-100 text-orange-700",
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
            <h1 className="font-display text-2xl text-primary-foreground">Départements</h1>
            <p className="text-primary-foreground/70 text-sm mt-0.5">
              Gérer les départements de l'EEC
            </p>
          </div>
        </div>
      </div>

      <section className="py-8 bg-muted/30 min-h-[60vh]">
        <div className="container max-w-3xl">
          {fetching ? (
            <p className="text-muted-foreground text-center py-16">Chargement...</p>
          ) : (
            <div className="space-y-3">
              {departments.map((dept) => (
                <div key={dept.id} className="bg-card border border-border rounded-xl p-5">
                  {editingId === dept.id ? (
                    <div className="space-y-3">
                      <Input
                        value={editForm.name}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        placeholder="Nom du département"
                      />
                      <Textarea
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        placeholder="Description (optionnel)"
                        rows={2}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => saveEdit(dept.id)} className="gap-1.5">
                          <Save className="h-3.5 w-3.5" /> Enregistrer
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit} className="gap-1.5">
                          <X className="h-3.5 w-3.5" /> Annuler
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className={`p-2.5 rounded-lg ${slugColors[dept.slug] || "bg-primary/10 text-primary"}`}>
                          <BookOpen className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{dept.name}</h3>
                          <p className="text-xs text-muted-foreground mt-0.5">/{dept.slug}</p>
                          {dept.description && (
                            <p className="text-sm text-muted-foreground mt-1">{dept.description}</p>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => startEdit(dept)}
                        className="h-8 w-8 shrink-0"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default AdminDepartmentsPage;
