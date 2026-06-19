import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Save, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const SYNODE_INFO_ID = "00000000-0000-0000-0000-000000000001";

const SynodePresentationManager = () => {
  const { toast } = useToast();
  const [roleAttributions, setRoleAttributions] = useState("");
  const [bureauDescription, setBureauDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (supabase as any).from("synode_presentation").select("*").eq("id", SYNODE_INFO_ID).maybeSingle()
      .then(({ data }: any) => {
        setRoleAttributions(data?.role_attributions || "");
        setBureauDescription(data?.bureau_description || "");
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await (supabase as any).from("synode_presentation")
      .upsert({ id: SYNODE_INFO_ID, role_attributions: roleAttributions || null, bureau_description: bureauDescription || null });
    setSaving(false);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Présentation mise à jour" });
  };

  if (loading) return <p className="text-sm text-muted-foreground py-8 text-center">Chargement…</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg text-foreground flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" /> Présentation du Synode
        </h2>
        <Button size="sm" onClick={handleSave} disabled={saving} className="gap-1.5">
          <Save className="h-3.5 w-3.5" /> {saving ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </div>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs">Rôle et attributions</Label>
          <Textarea value={roleAttributions} onChange={e => setRoleAttributions(e.target.value)} rows={6} className="text-sm"
            placeholder="Décrivez le rôle du Synode, du Conseil Synodal et du Bureau Synodal…" />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Présentation du Bureau Synodal</Label>
          <Textarea value={bureauDescription} onChange={e => setBureauDescription(e.target.value)} rows={6} className="text-sm"
            placeholder="Décrivez la composition et les missions du Bureau Synodal…" />
        </div>
      </div>
    </div>
  );
};

export default SynodePresentationManager;
