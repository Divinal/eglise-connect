import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Plus, Save, X, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface Pasteur {
  id: string;
  nom: string;
  prenom: string | null;
  fonction: string | null;
  telephone: string | null;
  date_ordination: string | null;
  paroisse_bapteme: string | null;
}

const TITRES = [
  "Pasteur Principal",
  "Pasteur Adjoint",
  "Pasteur Associé",
  "Pasteur Honoraire",
  "Pasteur Retraité",
  "Évangéliste",
  "Diacre",
];

const emptyForm = { nom: "", prenom: "", fonction: "Pasteur Principal", telephone: "", date_ordination: "", paroisse_bapteme: "" };

const PasteursManager = ({ paroisseId }: { paroisseId: string }) => {
  const { toast } = useToast();
  const [pasteurs, setPasteurs] = useState<Pasteur[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchPasteurs = async () => {
    setFetching(true);
    const { data } = await (supabase.from("membres") as any)
      .select("*")
      .eq("entity_type", "paroisse")
      .eq("entity_id", paroisseId)
      .eq("type", "pasteur")
      .order("nom");
    setPasteurs(data || []);
    setFetching(false);
  };

  useEffect(() => { fetchPasteurs(); }, [paroisseId]);

  const handleSave = async () => {
    if (!form.nom.trim()) { toast({ title: "Nom requis", variant: "destructive" }); return; }
    const payload = {
      nom: form.nom,
      prenom: form.prenom || null,
      fonction: form.fonction || "Pasteur Principal",
      telephone: form.telephone || null,
      date_ordination: form.date_ordination || null,
      paroisse_bapteme: form.paroisse_bapteme || null,
      type: "pasteur",
      entity_type: "paroisse",
      entity_id: paroisseId,
    };
    if (editingId) {
      const { error } = await (supabase.from("membres") as any).update(payload).eq("id", editingId);
      if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Pasteur mis à jour" });
    } else {
      const { error } = await (supabase.from("membres") as any).insert(payload);
      if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Pasteur ajouté !" });
    }
    setForm(emptyForm); setShowForm(false); setEditingId(null); fetchPasteurs();
  };

  const startEdit = (p: Pasteur) => {
    setEditingId(p.id);
    setForm({
      nom: p.nom, prenom: p.prenom || "", fonction: p.fonction || "Pasteur Principal",
      telephone: p.telephone || "", date_ordination: p.date_ordination || "",
      paroisse_bapteme: p.paroisse_bapteme || "",
    });
    setShowForm(true);
  };

  const deletePasteur = async (id: string) => {
    await (supabase.from("membres") as any).delete().eq("id", id);
    toast({ title: "Pasteur retiré" }); fetchPasteurs();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Pasteurs de la paroisse</h2>
        <Button size="sm" onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Ajouter
        </Button>
      </div>

      {showForm && (
        <div className="bg-muted/40 border border-border rounded-xl p-5 mb-5">
          <h3 className="font-medium text-sm mb-3">{editingId ? "Modifier" : "Nouveau pasteur"}</h3>
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
              <Label className="text-xs">Titre / Rôle</Label>
              <select value={form.fonction} onChange={e => setForm({ ...form, fonction: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm">
                {TITRES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Téléphone</Label>
              <Input value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} placeholder="+242 …" className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Date d'ordination</Label>
              <Input type="date" value={form.date_ordination} onChange={e => setForm({ ...form, date_ordination: e.target.value })} className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Paroisse de baptême</Label>
              <Input value={form.paroisse_bapteme} onChange={e => setForm({ ...form, paroisse_bapteme: e.target.value })} placeholder="Paroisse de …" className="h-9 text-sm" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button size="sm" onClick={handleSave} className="gap-1.5"><Save className="h-3.5 w-3.5" />Enregistrer</Button>
            <Button size="sm" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyForm); }}><X className="h-3.5 w-3.5" />Annuler</Button>
          </div>
        </div>
      )}

      {fetching ? (
        <p className="text-sm text-muted-foreground py-8 text-center">Chargement…</p>
      ) : pasteurs.length === 0 ? (
        <div className="text-center py-10">
          <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Aucun pasteur enregistré.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {pasteurs.map(p => (
            <div key={p.id} className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg">
              <div className="w-10 h-10 rounded-full bg-[#1a4d2e]/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-[#1a4d2e]">{p.nom[0]}{p.prenom?.[0] || ""}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{p.prenom} {p.nom}</p>
                <div className="flex flex-wrap gap-2 mt-0.5">
                  {p.fonction && <span className="text-xs text-primary font-medium">{p.fonction}</span>}
                  {p.telephone && <span className="text-xs text-muted-foreground">{p.telephone}</span>}
                  {p.date_ordination && <span className="text-xs text-muted-foreground">Ordonné le {new Date(p.date_ordination).toLocaleDateString("fr-FR")}</span>}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => startEdit(p)} className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" onClick={() => deletePasteur(p.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PasteursManager;
