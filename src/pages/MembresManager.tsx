// Composant générique réutilisable pour gérer une liste de membres
// Utilise entity_id + entity_type (schéma réel de la table membres)

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Plus, Pencil, Save, X, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Membre {
  id: string;
  nom: string;
  prenom: string | null;
  fonction: string | null;
  telephone: string | null;
  adresse: string | null;
  date_naissance: string | null;
  paroisse_bapteme: string | null;
  date_bapteme: string | null;
  genre: string | null;
  statut: string | null;
  entity_id: string;
  entity_type: string;
}

interface Props {
  entityType: "consistoire" | "paroisse";
  entityId: string;
  memberType: "bureau" | "conseil" | "organe";
  title?: string;
}

const emptyForm = {
  nom: "", prenom: "", fonction: "", telephone: "", adresse: "",
  date_naissance: "", paroisse_bapteme: "", date_bapteme: "",
  genre: "M", statut: "actif",
};

const MembresManager = ({ entityType, entityId, memberType, title }: Props) => {
  const { toast } = useToast();
  const [membres, setMembres] = useState<Membre[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchMembres = async () => {
    setFetching(true);
    // On utilise any pour contourner le type strict Supabase sur les colonnes dynamiques
    const { data, error } = await (supabase.from("membres") as any)
      .select("*")
      .eq("entity_id", entityId)
      .eq("entity_type", entityType)
      .eq("type", memberType)
      .order("nom");
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else setMembres((data || []) as Membre[]);
    setFetching(false);
  };

  useEffect(() => { if (entityId) fetchMembres(); }, [entityId, memberType]);

  const handleSave = async () => {
    if (!form.nom.trim()) { toast({ title: "Nom requis", variant: "destructive" }); return; }
    const payload = {
      nom: form.nom,
      prenom: form.prenom || null,
      fonction: form.fonction || null,
      telephone: form.telephone || null,
      adresse: form.adresse || null,
      date_naissance: form.date_naissance || null,
      paroisse_bapteme: form.paroisse_bapteme || null,
      date_bapteme: form.date_bapteme || null,
      genre: form.genre || null,
      statut: form.statut || "actif",
      type: memberType,
      entity_id: entityId,
      entity_type: entityType,
    };
    if (editingId) {
      const { error } = await supabase.from("membres").update(payload as any).eq("id", editingId);
      if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Membre mis à jour" });
    } else {
      const { error } = await supabase.from("membres").insert(payload as any);
      if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Membre ajouté !" });
    }
    setForm(emptyForm); setShowForm(false); setEditingId(null); fetchMembres();
  };

  const startEdit = (m: Membre) => {
    setEditingId(m.id);
    setForm({
      nom: m.nom, prenom: m.prenom || "", fonction: m.fonction || "",
      telephone: m.telephone || "", adresse: m.adresse || "",
      date_naissance: m.date_naissance || "", paroisse_bapteme: m.paroisse_bapteme || "",
      date_bapteme: m.date_bapteme || "", genre: m.genre || "M", statut: m.statut || "actif",
    });
    setShowForm(true); window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteMembre = async (id: string) => {
    await supabase.from("membres").delete().eq("id", id);
    toast({ title: "Membre supprimé" }); fetchMembres();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg text-foreground">{title || "Membres"}</h2>
        <Button size="sm" onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Ajouter
        </Button>
      </div>

      {showForm && (
        <div className="bg-muted/40 border border-border rounded-xl p-5 mb-5">
          <h3 className="font-medium text-foreground mb-3 text-sm">
            {editingId ? "Modifier le membre" : "Nouveau membre"}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Nom *</Label>
              <Input value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} placeholder="NOM" className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Prénom</Label>
              <Input value={form.prenom} onChange={e => setForm({ ...form, prenom: e.target.value })} placeholder="Prénom" className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Fonction</Label>
              <Input value={form.fonction} onChange={e => setForm({ ...form, fonction: e.target.value })} placeholder="Ex: Président, Trésorier…" className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Téléphone</Label>
              <Input value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} placeholder="+242 …" className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Date de naissance</Label>
              <Input type="date" value={form.date_naissance} onChange={e => setForm({ ...form, date_naissance: e.target.value })} className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Paroisse de baptême</Label>
              <Input value={form.paroisse_bapteme} onChange={e => setForm({ ...form, paroisse_bapteme: e.target.value })} placeholder="Paroisse de …" className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Date de baptême</Label>
              <Input type="date" value={form.date_bapteme} onChange={e => setForm({ ...form, date_bapteme: e.target.value })} className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Adresse</Label>
              <Input value={form.adresse} onChange={e => setForm({ ...form, adresse: e.target.value })} placeholder="Adresse…" className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Genre</Label>
              <select value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm">
                <option value="M">Masculin</option>
                <option value="F">Féminin</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Statut</Label>
              <select value={form.statut} onChange={e => setForm({ ...form, statut: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm">
                <option value="actif">Actif</option>
                <option value="refroidi">Refroidi</option>
              </select>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button size="sm" onClick={handleSave} className="gap-1.5"><Save className="h-3.5 w-3.5" />Enregistrer</Button>
            <Button size="sm" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }} className="gap-1.5"><X className="h-3.5 w-3.5" />Annuler</Button>
          </div>
        </div>
      )}

      {fetching ? (
        <p className="text-sm text-muted-foreground py-8 text-center">Chargement…</p>
      ) : membres.length === 0 ? (
        <div className="text-center py-10">
          <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Aucun membre. Ajoutez-en un.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {membres.map(m => (
            <div key={m.id} className={`flex items-center gap-3 p-4 bg-card border border-border rounded-lg ${m.statut === "refroidi" ? "opacity-60" : ""}`}>
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-semibold text-primary">{m.nom[0]}{m.prenom?.[0] || ""}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-foreground">{m.prenom} {m.nom}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                  {m.fonction && <p className="text-xs text-muted-foreground">{m.fonction}</p>}
                  {m.telephone && <p className="text-xs text-muted-foreground">{m.telephone}</p>}
                  {m.statut === "refroidi" && <span className="text-xs text-amber-600">Refroidi</span>}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => startEdit(m)} className="h-8 w-8">
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => deleteMembre(m.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MembresManager;
