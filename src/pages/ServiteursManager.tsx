import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Users, Plus, Save, X, Trash2, Pencil, Hash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// ─── MODE PAROISSE : liste nominative ─────────────────────────────
interface ServiteurParoisse {
  id: string;
  nom: string;
  prenom: string | null;
  fonction: string | null;
  telephone: string | null;
  paroisse_bapteme: string | null;
  date_bapteme: string | null;
}

const emptyServForm = { nom: "", prenom: "", fonction: "", telephone: "", paroisse_bapteme: "", date_bapteme: "" };

export const ServiteursParoisseManager = ({ paroisseId }: { paroisseId: string }) => {
  const { toast } = useToast();
  const [serviteurs, setServiteurs] = useState<ServiteurParoisse[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyServForm);

  const fetchServiteurs = async () => {
    setFetching(true);
    const { data } = await (supabase.from("membres") as any)
      .select("*")
      .eq("entity_type", "paroisse")
      .eq("entity_id", paroisseId)
      .eq("type", "serviteur")
      .order("nom");
    setServiteurs(data || []);
    setFetching(false);
  };

  useEffect(() => { fetchServiteurs(); }, [paroisseId]);

  const handleSave = async () => {
    if (!form.nom.trim()) { toast({ title: "Nom requis", variant: "destructive" }); return; }
    const payload = {
      nom: form.nom, prenom: form.prenom || null, fonction: form.fonction || null,
      telephone: form.telephone || null, paroisse_bapteme: form.paroisse_bapteme || null,
      date_bapteme: form.date_bapteme || null,
      type: "serviteur", entity_type: "paroisse", entity_id: paroisseId,
    };
    if (editingId) {
      const { error } = await (supabase.from("membres") as any).update(payload).eq("id", editingId);
      if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Serviteur mis à jour" });
    } else {
      const { error } = await (supabase.from("membres") as any).insert(payload);
      if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Serviteur ajouté !" });
    }
    setForm(emptyServForm); setShowForm(false); setEditingId(null); fetchServiteurs();
  };

  const startEdit = (s: ServiteurParoisse) => {
    setEditingId(s.id);
    setForm({ nom: s.nom, prenom: s.prenom || "", fonction: s.fonction || "",
      telephone: s.telephone || "", paroisse_bapteme: s.paroisse_bapteme || "", date_bapteme: s.date_bapteme || "" });
    setShowForm(true);
  };

  const deleteServiteur = async (id: string) => {
    await (supabase.from("membres") as any).delete().eq("id", id);
    toast({ title: "Serviteur retiré" }); fetchServiteurs();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h2 className="font-semibold text-lg">Serviteurs de la paroisse</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Total enregistré : <strong>{serviteurs.length}</strong></p>
        </div>
        <Button size="sm" onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyServForm); }} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Ajouter
        </Button>
      </div>

      {showForm && (
        <div className="bg-muted/40 border border-border rounded-xl p-5 my-4">
          <h3 className="font-medium text-sm mb-3">{editingId ? "Modifier" : "Nouveau serviteur"}</h3>
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
              <Label className="text-xs">Rôle / Ministère</Label>
              <Input value={form.fonction} onChange={e => setForm({ ...form, fonction: e.target.value })} placeholder="Ex: Diacre, Ancien, Moniteur…" className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Téléphone</Label>
              <Input value={form.telephone} onChange={e => setForm({ ...form, telephone: e.target.value })} placeholder="+242 …" className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Paroisse de baptême</Label>
              <Input value={form.paroisse_bapteme} onChange={e => setForm({ ...form, paroisse_bapteme: e.target.value })} placeholder="Paroisse de …" className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Date de baptême</Label>
              <Input type="date" value={form.date_bapteme} onChange={e => setForm({ ...form, date_bapteme: e.target.value })} className="h-9 text-sm" />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <Button size="sm" onClick={handleSave} className="gap-1.5"><Save className="h-3.5 w-3.5" />Enregistrer</Button>
            <Button size="sm" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyServForm); }}><X className="h-3.5 w-3.5" />Annuler</Button>
          </div>
        </div>
      )}

      {fetching ? (
        <p className="text-sm text-muted-foreground py-8 text-center">Chargement…</p>
      ) : serviteurs.length === 0 ? (
        <div className="text-center py-10">
          <Users className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Aucun serviteur enregistré. Ajoutez-en un.</p>
        </div>
      ) : (
        <div className="space-y-2 mt-4">
          {serviteurs.map(s => (
            <div key={s.id} className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-primary">{s.nom[0]}{s.prenom?.[0] || ""}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{s.prenom} {s.nom}</p>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5">
                  {s.fonction && <span className="text-xs text-muted-foreground">{s.fonction}</span>}
                  {s.telephone && <span className="text-xs text-muted-foreground">{s.telephone}</span>}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => startEdit(s)} className="h-7 w-7"><Pencil className="h-3 w-3" /></Button>
                <Button variant="ghost" size="icon" onClick={() => deleteServiteur(s.id)} className="h-7 w-7 text-destructive hover:bg-destructive/10"><Trash2 className="h-3 w-3" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── MODE CONSISTOIRE : nombre seulement ──────────────────────────
export const ServiteursConsistoireManager = ({ consistoireId }: { consistoireId: string }) => {
  const { toast } = useToast();
  const [nb, setNb] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (supabase as any).from("consistoires").select("nb_serviteurs").eq("id", consistoireId).maybeSingle()
      .then(({ data }: any) => { setNb(data?.nb_serviteurs?.toString() || "0"); setLoading(false); });
  }, [consistoireId]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await (supabase as any).from("consistoires")
      .update({ nb_serviteurs: parseInt(nb) || 0 }).eq("id", consistoireId);
    if (error) toast({ title: "Erreur", description: error.message, variant: "destructive" });
    else toast({ title: "Nombre de serviteurs enregistré !" });
    setSaving(false);
  };

  if (loading) return <p className="text-sm text-muted-foreground py-8 text-center">Chargement…</p>;

  return (
    <div>
      <h2 className="font-semibold text-lg mb-1">Serviteurs du consistoire</h2>
      <p className="text-sm text-muted-foreground mb-6">Indiquez le nombre total de serviteurs actifs dans ce consistoire.</p>
      <div className="max-w-xs">
        <div className="flex items-center gap-3 p-5 bg-card border border-border rounded-xl">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Hash className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <Label className="text-xs text-muted-foreground block mb-1.5">Nombre de serviteurs</Label>
            <Input
              type="number" min="0" value={nb}
              onChange={e => setNb(e.target.value)}
              className="h-10 text-xl font-bold text-center"
            />
          </div>
        </div>
        <Button onClick={handleSave} disabled={saving} className="mt-4 gap-1.5 w-full">
          <Save className="h-4 w-4" /> {saving ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </div>
    </div>
  );
};
