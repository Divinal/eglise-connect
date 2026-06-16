import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, Plus, Save, X, Trash2, Pencil, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface PlanEntry {
  id: string;
  titre: string;
  date_debut: string | null;
  date_fin: string | null;
  heure: string | null;
  lieu: string | null;
  description: string | null;
}

interface Props {
  entityType: string;
  entityId: string;
  title?: string;
}

const emptyForm = { titre: "", date_debut: "", date_fin: "", heure: "", lieu: "", description: "" };

const PlanningManager = ({ entityType, entityId, title = "Planning" }: Props) => {
  const { toast } = useToast();
  const [items, setItems] = useState<PlanEntry[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchItems = async () => {
    setFetching(true);
    const { data } = await (supabase as any).from("planning")
      .select("*")
      .eq("entity_type", entityType)
      .eq("entity_id", entityId)
      .order("date_debut", { ascending: true });
    setItems(data || []);
    setFetching(false);
  };

  useEffect(() => { if (entityId) fetchItems(); }, [entityId]);

  const handleSave = async () => {
    if (!form.titre.trim()) { toast({ title: "Titre requis", variant: "destructive" }); return; }
    const payload = {
      titre: form.titre,
      date_debut: form.date_debut || null,
      date_fin: form.date_fin || null,
      heure: form.heure || null,
      lieu: form.lieu || null,
      description: form.description || null,
      entity_type: entityType,
      entity_id: entityId,
    };
    if (editingId) {
      const { error } = await (supabase as any).from("planning").update(payload).eq("id", editingId);
      if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Planification mise à jour" });
    } else {
      const { error } = await (supabase as any).from("planning").insert(payload);
      if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Activité ajoutée au planning !" });
    }
    setForm(emptyForm); setShowForm(false); setEditingId(null); fetchItems();
  };

  const startEdit = (p: PlanEntry) => {
    setEditingId(p.id);
    setForm({
      titre: p.titre, date_debut: p.date_debut || "", date_fin: p.date_fin || "",
      heure: p.heure || "", lieu: p.lieu || "", description: p.description || "",
    });
    setShowForm(true);
  };

  const deleteItem = async (id: string) => {
    if (!confirm("Supprimer cette activité ?")) return;
    await (supabase as any).from("planning").delete().eq("id", id);
    toast({ title: "Activité supprimée" }); fetchItems();
  };

  const fmtDate = (d: string | null) => d ? new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }) : "";

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg text-foreground">{title}</h2>
        <Button size="sm" onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); }} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Ajouter
        </Button>
      </div>

      {showForm && (
        <div className="bg-muted/40 border border-border rounded-xl p-5 mb-5">
          <h3 className="font-medium mb-3 text-sm">{editingId ? "Modifier l'activité" : "Nouvelle activité"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs">Titre / Objet *</Label>
              <Input value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })} placeholder="Ex: Session synodale, Retraite spirituelle…" className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Date de début</Label>
              <Input type="date" value={form.date_debut} onChange={e => setForm({ ...form, date_debut: e.target.value })} className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Date de fin</Label>
              <Input type="date" value={form.date_fin} onChange={e => setForm({ ...form, date_fin: e.target.value })} className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Heure</Label>
              <Input type="time" value={form.heure} onChange={e => setForm({ ...form, heure: e.target.value })} className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Lieu</Label>
              <Input value={form.lieu} onChange={e => setForm({ ...form, lieu: e.target.value })} placeholder="Ex: Salle du consistoire…" className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs">Description / Notes</Label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                placeholder="Ordre du jour, informations supplémentaires…"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" />
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
      ) : items.length === 0 ? (
        <div className="text-center py-10">
          <CalendarDays className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Aucune activité planifiée.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(p => (
            <div key={p.id} className="flex gap-4 p-4 bg-card border border-border rounded-xl hover:shadow-sm transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <CalendarDays className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground">{p.titre}</p>
                <div className="flex flex-wrap gap-3 mt-1">
                  {p.date_debut && (
                    <span className="text-xs text-muted-foreground">
                      {fmtDate(p.date_debut)}{p.date_fin && p.date_fin !== p.date_debut ? ` → ${fmtDate(p.date_fin)}` : ""}
                    </span>
                  )}
                  {p.heure && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />{p.heure}
                    </span>
                  )}
                  {p.lieu && (
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />{p.lieu}
                    </span>
                  )}
                </div>
                {p.description && <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{p.description}</p>}
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => startEdit(p)} className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" onClick={() => deleteItem(p.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlanningManager;
