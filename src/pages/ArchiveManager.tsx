import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Archive, Plus, Save, X, Trash2, Pencil, ImagePlus, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ArchiveEntry {
  id: string;
  category: string;
  titre: string;
  date_evenement: string | null;
  photo_url: string | null;
  description: string | null;
}

interface Props {
  category: "conseil" | "synode";
  title?: string;
}

const emptyForm = { titre: "", date_evenement: "", description: "" };

const ArchiveManager = ({ category, title = "Archives" }: Props) => {
  const { toast } = useToast();
  const [items, setItems] = useState<ArchiveEntry[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchItems = async () => {
    setFetching(true);
    const { data } = await (supabase as any).from("archives")
      .select("*").eq("category", category)
      .order("date_evenement", { ascending: false });
    setItems(data || []);
    setFetching(false);
  };

  useEffect(() => { fetchItems(); }, [category]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Photo trop grande", description: "Maximum 5 MB", variant: "destructive" });
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const resetForm = () => {
    setShowForm(false); setEditingId(null); setForm(emptyForm);
    setPhotoFile(null); setPhotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    if (!form.titre.trim()) { toast({ title: "Titre requis", variant: "destructive" }); return; }
    setSaving(true);

    let photo_url: string | null = editingId ? (items.find(i => i.id === editingId)?.photo_url || null) : null;
    if (photoFile) {
      const ext = photoFile.name.split(".").pop();
      const fileName = `archives/${category}-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("media").upload(fileName, photoFile, { upsert: true });
      if (uploadError) {
        toast({ title: "Erreur upload photo", description: uploadError.message, variant: "destructive" });
        setSaving(false); return;
      }
      const { data: urlData } = supabase.storage.from("media").getPublicUrl(fileName);
      photo_url = urlData.publicUrl;
    } else if (photoPreview === null) {
      photo_url = null;
    }

    const payload = {
      titre: form.titre,
      date_evenement: form.date_evenement || null,
      description: form.description || null,
      photo_url,
      category,
    };

    if (editingId) {
      const { error } = await (supabase as any).from("archives").update(payload).eq("id", editingId);
      setSaving(false);
      if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Archive mise à jour" });
    } else {
      const { error } = await (supabase as any).from("archives").insert(payload);
      setSaving(false);
      if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
      toast({ title: "Archive ajoutée !" });
    }
    resetForm(); fetchItems();
  };

  const startEdit = (a: ArchiveEntry) => {
    setEditingId(a.id);
    setForm({ titre: a.titre, date_evenement: a.date_evenement || "", description: a.description || "" });
    setPhotoFile(null);
    setPhotoPreview(a.photo_url || null);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteItem = async (id: string, photo_url?: string | null) => {
    if (!confirm("Supprimer cette archive ?")) return;
    if (photo_url) {
      const path = photo_url.split("/media/")[1];
      if (path) await supabase.storage.from("media").remove([path]);
    }
    await (supabase as any).from("archives").delete().eq("id", id);
    toast({ title: "Archive supprimée" }); fetchItems();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg text-foreground">{title}</h2>
        <Button size="sm" onClick={() => { setShowForm(true); setEditingId(null); setForm(emptyForm); setPhotoFile(null); setPhotoPreview(null); }} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Ajouter
        </Button>
      </div>

      {showForm && (
        <div className="bg-muted/40 border border-border rounded-xl p-5 mb-5">
          <h3 className="font-medium text-foreground mb-3 text-sm">{editingId ? "Modifier l'archive" : "Nouvelle archive"}</h3>

          <div className="space-y-1.5 mb-3">
            <Label className="text-xs">Visuel</Label>
            {photoPreview ? (
              <div className="relative w-full">
                <img src={photoPreview} alt="Aperçu" className="w-full max-h-48 object-cover rounded-lg border border-border" />
                <button onClick={removePhoto}
                  className="absolute top-2 right-2 bg-black/60 hover:bg-black/80 text-white rounded-full p-1 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 w-full h-28 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/40 hover:bg-muted/30 transition-colors"
              >
                <ImagePlus className="h-7 w-7 text-muted-foreground/50" />
                <p className="text-xs text-muted-foreground">Cliquez pour ajouter une photo</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs">Titre / Objet *</Label>
              <Input value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })}
                placeholder={category === "conseil" ? "Ex: 12e Session du Conseil Synodal" : "Ex: 45e Synode National"}
                className="h-9 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Date</Label>
              <Input type="date" value={form.date_evenement} onChange={e => setForm({ ...form, date_evenement: e.target.value })} className="h-9 text-sm" />
            </div>
          </div>
          <div className="space-y-1.5 mt-3">
            <Label className="text-xs">Description</Label>
            <Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
              placeholder="Résumé, décisions prises, contexte…" className="text-sm" />
          </div>

          <div className="flex gap-2 mt-4">
            <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5"><Save className="h-3.5 w-3.5" />{saving ? "Enregistrement…" : "Enregistrer"}</Button>
            <Button size="sm" variant="outline" onClick={resetForm} className="gap-1.5"><X className="h-3.5 w-3.5" />Annuler</Button>
          </div>
        </div>
      )}

      {fetching ? (
        <p className="text-sm text-muted-foreground py-8 text-center">Chargement…</p>
      ) : items.length === 0 ? (
        <div className="text-center py-10">
          <Archive className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Aucune archive enregistrée.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(a => (
            <div key={a.id} className="flex gap-4 p-4 bg-card border border-border rounded-xl">
              {a.photo_url ? (
                <img src={a.photo_url} alt={a.titre} className="w-20 h-20 object-cover rounded-lg shrink-0" />
              ) : (
                <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <Archive className="h-7 w-7 text-muted-foreground/40" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm text-foreground">{a.titre}</p>
                {a.date_evenement && (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <CalendarDays className="h-3 w-3" />
                    {new Date(a.date_evenement).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                )}
                {a.description && <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">{a.description}</p>}
              </div>
              <div className="flex gap-1 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => startEdit(a)} className="h-8 w-8"><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" onClick={() => deleteItem(a.id, a.photo_url)} className="h-8 w-8 text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArchiveManager;
