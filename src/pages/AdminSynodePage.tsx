import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Users, BookOpen, Building2, Shield, Megaphone, Plus, Save, Trash2, ImagePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import MembresManager from "./MembresManager";
import { useToast } from "@/hooks/use-toast";

// Composant Annonces avec upload image
const AnnoncesManager = ({ entityType, entityId }: { entityType: string; entityId: string }) => {
  const { toast } = useToast();
  const [annonces, setAnnonces] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", content: "", type: "annonce" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAnnonces = async () => {
    setFetching(true);
    const { data } = await supabase.from("announcements")
      .select("*")
      .eq("entity_type", entityType)
      .eq("entity_id", entityId)
      .order("created_at", { ascending: false });
    setAnnonces(data || []);
    setFetching(false);
  };
  useEffect(() => { fetchAnnonces(); }, [entityId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "Image trop grande", description: "Maximum 5 MB", variant: "destructive" });
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast({ title: "Titre requis", variant: "destructive" }); return; }
    setUploading(true);

    let image_url: string | null = null;

    // Upload image si présente
    if (imageFile) {
      const ext = imageFile.name.split(".").pop();
      const fileName = `announcements/${entityType}-${entityId}-${Date.now()}.${ext}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("media")
        .upload(fileName, imageFile, { upsert: true });
      if (uploadError) {
        toast({ title: "Erreur upload image", description: uploadError.message, variant: "destructive" });
        setUploading(false); return;
      }
      const { data: urlData } = supabase.storage.from("media").getPublicUrl(fileName);
      image_url = urlData.publicUrl;
    }

    const { error } = await supabase.from("announcements").insert({
      title: form.title,
      content: form.content || null,
      type: form.type,
      entity_type: entityType,
      entity_id: entityId,
      image_url,
    } as any);

    setUploading(false);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Annonce publiée !" });
    setForm({ title: "", content: "", type: "annonce" });
    setImageFile(null); setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setShowForm(false); fetchAnnonces();
  };

  const deleteAnnonce = async (id: string, image_url?: string) => {
    // Supprimer l'image du storage si elle existe
    if (image_url) {
      const path = image_url.split("/media/")[1];
      if (path) await supabase.storage.from("media").remove([path]);
    }
    await supabase.from("announcements").delete().eq("id", id);
    toast({ title: "Annonce supprimée" }); fetchAnnonces();
  };

  const resetForm = () => {
    setShowForm(false);
    setForm({ title: "", content: "", type: "annonce" });
    setImageFile(null); setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Annonces & Circulaires</h2>
        <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" /> Publier
        </Button>
      </div>
      {showForm && (
        <div className="bg-muted/40 border border-border rounded-xl p-5 mb-5 space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Type</Label>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1.5 text-sm">
              <option value="annonce">Annonce</option>
              <option value="circulaire">Circulaire</option>
              <option value="convocation">Convocation</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Titre *</Label>
            <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="h-9 text-sm" placeholder="Titre de l'annonce" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Contenu</Label>
            <Textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={3} className="text-sm" placeholder="Contenu…" />
          </div>

          {/* Upload image */}
          <div className="space-y-1.5">
            <Label className="text-xs">Image (optionnel — max 5 MB)</Label>
            {imagePreview ? (
              <div className="relative w-full">
                <img src={imagePreview} alt="Aperçu" className="w-full max-h-48 object-cover rounded-lg border border-border" />
                <button onClick={removeImage}
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
                <p className="text-xs text-muted-foreground">Cliquez pour ajouter une image</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <Button size="sm" onClick={handleSave} disabled={uploading} className="gap-1.5">
              <Save className="h-3.5 w-3.5" />
              {uploading ? "Publication…" : "Publier"}
            </Button>
            <Button size="sm" variant="outline" onClick={resetForm}>Annuler</Button>
          </div>
        </div>
      )}

      {fetching ? <p className="text-sm text-muted-foreground py-8 text-center">Chargement…</p>
        : annonces.length === 0 ? <p className="text-sm text-muted-foreground py-8 text-center">Aucune annonce.</p>
        : (
          <div className="space-y-3">
            {annonces.map(a => (
              <div key={a.id} className="bg-card border border-border rounded-lg overflow-hidden">
                {/* Image */}
                {a.image_url && (
                  <img src={a.image_url} alt={a.title} className="w-full h-40 object-cover" />
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          a.type === "circulaire" ? "bg-blue-100 text-blue-700" :
                          a.type === "convocation" ? "bg-amber-100 text-amber-700" :
                          "bg-green-100 text-green-700"
                        }`}>{a.type}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(a.created_at).toLocaleDateString("fr-FR")}
                        </span>
                      </div>
                      <p className="font-medium text-sm">{a.title}</p>
                      {a.content && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{a.content}</p>}
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => deleteAnnonce(a.id, a.image_url)}
                      className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0">
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

type Tab = "bureau" | "commissions" | "organes" | "conseil" | "annonces";

const TABS: { key: Tab; label: string; icon: any }[] = [
  { key: "bureau", label: "Bureau", icon: Users },
  { key: "commissions", label: "Commissions", icon: BookOpen },
  { key: "organes", label: "Organes", icon: Building2 },
  { key: "conseil", label: "Conseil", icon: Shield },
  { key: "annonces", label: "Annonces", icon: Megaphone },
];

// UUID fixe pour le Synode dans la table membres (entity_id est UUID)
const SYNODE_UUID = "00000000-0000-0000-0000-000000000001";
// Identifiant texte pour les annonces (entity_id est text dans announcements)
const SYNODE_ID = "synode";

const SynodePage = ({ defaultTab }: { defaultTab?: Tab }) => {
  const { isAdminGeneral, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab || "bureau");
  useEffect(() => { if (!loading && !isAdminGeneral) navigate("/admin"); }, [loading, isAdminGeneral]);
  return (
    <Layout>
      <div className="bg-primary py-8">
        <div className="container flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin")}
            className="text-primary-foreground hover:bg-primary-foreground/10">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <p className="text-primary-foreground/60 text-xs mb-0.5">Synode National</p>
            <h1 className="font-display text-2xl text-primary-foreground">Structures Synodales</h1>
          </div>
        </div>
      </div>
      <section className="py-8 bg-muted/30 min-h-[60vh]">
        <div className="container max-w-4xl">
          <div className="flex gap-1 bg-card border border-border rounded-xl p-1 mb-6 overflow-x-auto">
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.key ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}>
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </div>
          <div className="bg-card border border-border rounded-xl p-6">
            {activeTab === "bureau" && (<MembresManager entityType="synode" entityId={SYNODE_UUID} memberType="bureau" title="Bureau Synodal" />)}
            {activeTab === "commissions" && (<MembresManager entityType="synode" entityId={SYNODE_UUID} memberType="organe" title="Commissions Synodales" />)}
            {activeTab === "organes" && (<MembresManager entityType="synode" entityId={SYNODE_UUID} memberType="organe" title="Organes Synodaux" />)}
            {activeTab === "conseil" && (<MembresManager entityType="synode" entityId={SYNODE_UUID} memberType="conseil" title="Conseil Synodal" />)}
            {activeTab === "annonces" && (<AnnoncesManager entityType="synode" entityId={SYNODE_ID} />)}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SynodePage;
export { AnnoncesManager };