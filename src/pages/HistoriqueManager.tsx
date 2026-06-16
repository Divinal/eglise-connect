import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Save, Loader2, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  table: string;
  entityId: string;
  entityLabel?: string;
}

const HistoriqueManager = ({ table, entityId, entityLabel = "cette structure" }: Props) => {
  const { toast } = useToast();
  const [historique, setHistorique] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (supabase as any).from(table).select("historique").eq("id", entityId).maybeSingle()
      .then(({ data }: any) => {
        setHistorique(data?.historique || "");
        setLoading(false);
      });
  }, [table, entityId]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await (supabase as any).from(table).update({ historique }).eq("id", entityId);
    if (error) {
      toast({ title: "Erreur lors de l'enregistrement", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Présentation enregistrée !", description: "Le texte est maintenant visible sur la page publique." });
    }
    setSaving(false);
  };

  if (loading) return <p className="text-sm text-muted-foreground py-8 text-center">Chargement…</p>;

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Présentation
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Ce texte sera affiché en bas de la page publique de {entityLabel}.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="shrink-0 flex items-center gap-1.5 h-9 px-4 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-60 transition-colors"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? "Enregistrement…" : "Enregistrer"}
        </button>
      </div>

      <textarea
        value={historique}
        onChange={(e) => setHistorique(e.target.value)}
        rows={18}
        placeholder="Rédigez ici l'historique, la présentation ou la description de votre structure&#10;&#10;Exemple :&#10;Fondée en …, notre paroisse / consistoire / communauté …&#10;&#10;• Notre mission…&#10;• Notre vision…"
        className="w-full rounded-xl border border-border p-4 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-primary/30 resize-y min-h-[320px] font-normal"
      />

      <div className="flex items-center justify-between mt-2">
        <p className="text-xs text-muted-foreground">{historique.length} caractère{historique.length !== 1 ? "s" : ""}</p>
        {historique.length === 0 && (
          <p className="text-xs text-amber-600">Aucun texte — la section ne sera pas visible sur la page publique.</p>
        )}
      </div>
    </div>
  );
};

export default HistoriqueManager;
