import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import {
  ArrowLeft, Users, Building2, Shield, Music, Church,
  Info, Plus, Save, Trash2, Megaphone, Phone, User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MembresManager from "./MembresManager";
import { AnnoncesManager } from "./AdminSynodePage";
import { useToast } from "@/hooks/use-toast";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
interface BureauMembre {
  nom: string;
  telephone: string;
}

interface GroupeForm {
  name: string;
  total_membres: string;
  nombre_hommes: string;
  nombre_femmes: string;
  resp1: BureauMembre;
  resp2: BureauMembre;
  secretaire: BureauMembre;
  tresoriere: BureauMembre;
}

const emptyGroupe = (): GroupeForm => ({
  name: "",
  total_membres: "",
  nombre_hommes: "",
  nombre_femmes: "",
  resp1: { nom: "", telephone: "" },
  resp2: { nom: "", telephone: "" },
  secretaire: { nom: "", telephone: "" },
  tresoriere: { nom: "", telephone: "" },
});

// ─────────────────────────────────────────────
// SOUS-COMPOSANT : champ membre du bureau
// ─────────────────────────────────────────────
const MembreField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: BureauMembre;
  onChange: (v: BureauMembre) => void;
}) => (
  <div className="bg-muted/30 rounded-lg p-3 space-y-2">
    <p className="text-xs font-semibold text-primary">{label}</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <div className="space-y-1">
        <Label className="text-xs flex items-center gap-1">
          <User className="h-3 w-3" /> Nom complet
        </Label>
        <Input
          value={value.nom}
          onChange={(e) => onChange({ ...value, nom: e.target.value })}
          placeholder="Nom et prénom"
          className="h-8 text-xs"
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs flex items-center gap-1">
          <Phone className="h-3 w-3" /> Téléphone
        </Label>
        <Input
          value={value.telephone}
          onChange={(e) => onChange({ ...value, telephone: e.target.value })}
          placeholder="+242 06 000 0000"
          className="h-8 text-xs"
        />
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────
// GROUPES CHANTANTS
// ─────────────────────────────────────────────
const GroupesChantants = ({ paroisseId }: { paroisseId: string }) => {
  const { toast } = useToast();
  const [groupes, setGroupes] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<GroupeForm>(emptyGroupe());

  const fetchGroupes = async () => {
    setFetching(true);
    const { data } = await supabase
      .from("groupes_chantants")
      .select("*")
      .eq("paroisse_id", paroisseId)
      .order("name");
    setGroupes(data || []);
    setFetching(false);
  };

  useEffect(() => { fetchGroupes(); }, [paroisseId]);

  const handleSave = async () => {
    if (!form.name.trim()) {
      toast({ title: "Nom requis", variant: "destructive" });
      return;
    }

    const payload = {
      name: form.name,
      paroisse_id: paroisseId,
      total_membres: form.total_membres ? parseInt(form.total_membres) : null,
      nombre_hommes: form.nombre_hommes ? parseInt(form.nombre_hommes) : null,
      nombre_femmes: form.nombre_femmes ? parseInt(form.nombre_femmes) : null,
      resp1_nom: form.resp1.nom || null,
      resp1_fonction: "1er Responsable",
      resp1_telephone: form.resp1.telephone || null,
      resp2_nom: form.resp2.nom || null,
      resp2_fonction: "2e Responsable",
      resp2_telephone: form.resp2.telephone || null,
      secretaire_nom: form.secretaire.nom || null,
      secretaire_telephone: form.secretaire.telephone || null,
      tresoriere_nom: form.tresoriere.nom || null,
      tresoriere_telephone: form.tresoriere.telephone || null,
    };

    const { error } = editingId
      ? await supabase.from("groupes_chantants").update(payload).eq("id", editingId)
      : await supabase.from("groupes_chantants").insert(payload);

    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return;
    }

    toast({ title: editingId ? "Groupe mis à jour" : "Groupe créé !" });
    setForm(emptyGroupe());
    setShowForm(false);
    setEditingId(null);
    fetchGroupes();
  };

  const startEdit = (g: any) => {
    setEditingId(g.id);
    setForm({
      name: g.name || "",
      total_membres: g.total_membres?.toString() || "",
      nombre_hommes: g.nombre_hommes?.toString() || "",
      nombre_femmes: g.nombre_femmes?.toString() || "",
      resp1: { nom: g.resp1_nom || "", telephone: g.resp1_telephone || "" },
      resp2: { nom: g.resp2_nom || "", telephone: g.resp2_telephone || "" },
      secretaire: { nom: g.secretaire_nom || "", telephone: g.secretaire_telephone || "" },
      tresoriere: { nom: g.tresoriere_nom || "", telephone: g.tresoriere_telephone || "" },
    });
    setShowForm(true);
    setTimeout(() => document.getElementById("groupe-form")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const deleteGroupe = async (id: string) => {
    if (!confirm("Supprimer ce groupe ?")) return;
    await supabase.from("groupes_chantants").delete().eq("id", id);
    toast({ title: "Groupe supprimé" });
    fetchGroupes();
  };

  return (
    <div>
      {/* En-tête */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-lg">Groupes chantants</h2>
        <Button
          size="sm"
          onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyGroupe()); }}
          className="gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          {showForm && !editingId ? "Annuler" : "Ajouter"}
        </Button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div id="groupe-form" className="bg-muted/20 border border-border rounded-xl p-5 mb-6 space-y-4">
          <h3 className="font-semibold text-sm text-foreground">
            {editingId ? "Modifier le groupe" : "Nouveau groupe chantant"}
          </h3>

          {/* Nom */}
          <div className="space-y-1.5">
            <Label className="text-xs">Nom du groupe *</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex: Chorale Hosanna"
              className="h-9 text-sm"
            />
          </div>

          {/* Effectifs */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Effectifs
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: "total_membres", label: "Total membres" },
                { key: "nombre_hommes", label: "Hommes" },
                { key: "nombre_femmes", label: "Femmes" },
              ].map((f) => (
                <div key={f.key} className="space-y-1.5">
                  <Label className="text-xs">{f.label}</Label>
                  <Input
                    type="number"
                    min="0"
                    value={(form as any)[f.key]}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                    className="h-9 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Bureau */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
              Bureau du groupe
            </p>
            <div className="space-y-3">
              <MembreField
                label="1er Responsable"
                value={form.resp1}
                onChange={(v) => setForm({ ...form, resp1: v })}
              />
              <MembreField
                label="2e Responsable"
                value={form.resp2}
                onChange={(v) => setForm({ ...form, resp2: v })}
              />
              <MembreField
                label="Secrétaire Général(e)"
                value={form.secretaire}
                onChange={(v) => setForm({ ...form, secretaire: v })}
              />
              <MembreField
                label="Trésorière"
                value={form.tresoriere}
                onChange={(v) => setForm({ ...form, tresoriere: v })}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-1">
            <Button size="sm" onClick={handleSave} className="gap-1.5">
              <Save className="h-3.5 w-3.5" /> Enregistrer
            </Button>
            <Button
              size="sm" variant="outline"
              onClick={() => { setShowForm(false); setEditingId(null); setForm(emptyGroupe()); }}
            >
              Annuler
            </Button>
          </div>
        </div>
      )}

      {/* Liste */}
      {fetching ? (
        <p className="text-sm text-muted-foreground py-8 text-center">Chargement…</p>
      ) : groupes.length === 0 ? (
        <div className="text-center py-10">
          <Music className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Aucun groupe chantant enregistré.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {groupes.map((g) => (
            <div key={g.id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <Music className="h-4 w-4 text-primary shrink-0" />
                  <p className="font-semibold text-base">{g.name}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => startEdit(g)} className="h-8 w-8" title="Modifier">
                    <Save className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteGroupe(g.id)}
                    className="h-8 w-8 text-destructive hover:bg-destructive/10" title="Supprimer">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>

              {/* Effectifs */}
              <div className="flex flex-wrap gap-2 mb-3">
                {g.total_membres != null && (
                  <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium">
                    Total : {g.total_membres}
                  </span>
                )}
                {g.nombre_hommes != null && (
                  <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full font-medium">
                    Hommes : {g.nombre_hommes}
                  </span>
                )}
                {g.nombre_femmes != null && (
                  <span className="text-xs bg-pink-50 text-pink-700 px-2.5 py-1 rounded-full font-medium">
                    Femmes : {g.nombre_femmes}
                  </span>
                )}
              </div>

              {/* Bureau */}
              {(g.resp1_nom || g.resp2_nom || g.secretaire_nom || g.tresoriere_nom) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {[
                    { label: "1er Responsable", nom: g.resp1_nom, tel: g.resp1_telephone },
                    { label: "2e Responsable", nom: g.resp2_nom, tel: g.resp2_telephone },
                    { label: "Secrétaire", nom: g.secretaire_nom, tel: g.secretaire_telephone },
                    { label: "Trésorière", nom: g.tresoriere_nom, tel: g.tresoriere_telephone },
                  ].filter((m) => m.nom).map((m, i) => (
                    <div key={i} className="bg-muted/40 rounded-lg px-3 py-2">
                      <p className="text-[10px] font-semibold text-primary uppercase tracking-wide">{m.label}</p>
                      <p className="text-xs font-medium text-foreground">{m.nom}</p>
                      {m.tel && <p className="text-xs text-muted-foreground">{m.tel}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// ANNEXES
// ─────────────────────────────────────────────
interface AnnexeForm {
  name: string;
  ville: string;
  quartier: string;
  responsable: string;
  total_membres: string;
  nombre_hommes: string;
  nombre_femmes: string;
  resp1: BureauMembre;
  resp2: BureauMembre;
  secretaire: BureauMembre;
  tresoriere: BureauMembre;
}

const emptyAnnexe = (): AnnexeForm => ({
  name: "", ville: "", quartier: "", responsable: "",
  total_membres: "", nombre_hommes: "", nombre_femmes: "",
  resp1: { nom: "", telephone: "" },
  resp2: { nom: "", telephone: "" },
  secretaire: { nom: "", telephone: "" },
  tresoriere: { nom: "", telephone: "" },
});

const AnnexesManager = ({ paroisseId }: { paroisseId: string }) => {
  const { toast } = useToast();
  const [annexes, setAnnexes] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AnnexeForm>(emptyAnnexe());

  const fetchAnnexes = async () => {
    setFetching(true);
    const { data } = await supabase.from("annexes").select("*").eq("paroisse_id", paroisseId).order("name");
    setAnnexes(data || []);
    setFetching(false);
  };
  useEffect(() => { fetchAnnexes(); }, [paroisseId]);

  const handleSave = async () => {
    if (!form.name.trim()) { toast({ title: "Nom requis", variant: "destructive" }); return; }
    const payload = {
      name: form.name,
      paroisse_id: paroisseId,
      ville: form.ville || null,
      quartier: form.quartier || null,
      responsable: form.responsable || null,
      total_membres: form.total_membres ? parseInt(form.total_membres) : null,
      nombre_hommes: form.nombre_hommes ? parseInt(form.nombre_hommes) : null,
      nombre_femmes: form.nombre_femmes ? parseInt(form.nombre_femmes) : null,
      resp1_nom: form.resp1.nom || null,
      resp1_telephone: form.resp1.telephone || null,
      resp2_nom: form.resp2.nom || null,
      resp2_telephone: form.resp2.telephone || null,
      secretaire_nom: form.secretaire.nom || null,
      secretaire_telephone: form.secretaire.telephone || null,
      tresoriere_nom: form.tresoriere.nom || null,
      tresoriere_telephone: form.tresoriere.telephone || null,
    };

    const { error } = editingId
      ? await supabase.from("annexes").update(payload).eq("id", editingId)
      : await supabase.from("annexes").insert(payload);

    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: editingId ? "Annexe mise à jour" : "Annexe créée !" });
    setForm(emptyAnnexe()); setShowForm(false); setEditingId(null); fetchAnnexes();
  };

  const startEdit = (a: any) => {
    setEditingId(a.id);
    setForm({
      name: a.name || "", ville: a.ville || "", quartier: a.quartier || "", responsable: a.responsable || "",
      total_membres: a.total_membres?.toString() || "",
      nombre_hommes: a.nombre_hommes?.toString() || "",
      nombre_femmes: a.nombre_femmes?.toString() || "",
      resp1: { nom: a.resp1_nom || "", telephone: a.resp1_telephone || "" },
      resp2: { nom: a.resp2_nom || "", telephone: a.resp2_telephone || "" },
      secretaire: { nom: a.secretaire_nom || "", telephone: a.secretaire_telephone || "" },
      tresoriere: { nom: a.tresoriere_nom || "", telephone: a.tresoriere_telephone || "" },
    });
    setShowForm(true);
  };

  const deleteAnnexe = async (id: string) => {
    if (!confirm("Supprimer cette annexe ?")) return;
    await supabase.from("annexes").delete().eq("id", id);
    toast({ title: "Annexe supprimée" }); fetchAnnexes();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-lg">Annexes</h2>
        <Button size="sm" onClick={() => { setShowForm(!showForm); setEditingId(null); setForm(emptyAnnexe()); }} className="gap-1.5">
          <Plus className="h-3.5 w-3.5" />{showForm && !editingId ? "Annuler" : "Ajouter"}
        </Button>
      </div>

      {showForm && (
        <div className="bg-muted/20 border border-border rounded-xl p-5 mb-6 space-y-4">
          <h3 className="font-semibold text-sm">{editingId ? "Modifier l'annexe" : "Nouvelle annexe"}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5 md:col-span-2">
              <Label className="text-xs">Nom de l'annexe *</Label>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="h-9 text-sm" />
            </div>
            {[
              { key: "ville", label: "Ville" },
              { key: "quartier", label: "Quartier" },
              { key: "responsable", label: "Pasteur / Responsable" },
            ].map(f => (
              <div key={f.key} className="space-y-1.5">
                <Label className="text-xs">{f.label}</Label>
                <Input value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} className="h-9 text-sm" />
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Effectifs</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: "total_membres", label: "Total" },
                { key: "nombre_hommes", label: "Hommes" },
                { key: "nombre_femmes", label: "Femmes" },
              ].map(f => (
                <div key={f.key} className="space-y-1.5">
                  <Label className="text-xs">{f.label}</Label>
                  <Input type="number" min="0" value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} className="h-9 text-sm" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Bureau</p>
            <div className="space-y-3">
              <MembreField label="1er Responsable" value={form.resp1} onChange={v => setForm({ ...form, resp1: v })} />
              <MembreField label="2e Responsable" value={form.resp2} onChange={v => setForm({ ...form, resp2: v })} />
              <MembreField label="Secrétaire Général(e)" value={form.secretaire} onChange={v => setForm({ ...form, secretaire: v })} />
              <MembreField label="Trésorière" value={form.tresoriere} onChange={v => setForm({ ...form, tresoriere: v })} />
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} className="gap-1.5"><Save className="h-3.5 w-3.5" />Enregistrer</Button>
            <Button size="sm" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>Annuler</Button>
          </div>
        </div>
      )}

      {fetching ? <p className="text-sm text-muted-foreground py-8 text-center">Chargement…</p>
        : annexes.length === 0 ? (
          <div className="text-center py-10"><Church className="h-10 w-10 text-muted-foreground/30 mx-auto mb-2" /><p className="text-sm text-muted-foreground">Aucune annexe.</p></div>
        ) : (
          <div className="space-y-4">
            {annexes.map(a => (
              <div key={a.id} className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <Church className="h-4 w-4 text-primary shrink-0" />
                    <div>
                      <p className="font-semibold text-base">{a.name}</p>
                      {(a.ville || a.quartier) && <p className="text-xs text-muted-foreground">{[a.quartier, a.ville].filter(Boolean).join(", ")}</p>}
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => startEdit(a)} className="h-8 w-8"><Save className="h-3.5 w-3.5" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteAnnexe(a.id)} className="h-8 w-8 text-destructive hover:bg-destructive/10"><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {a.total_membres != null && <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">Total : {a.total_membres}</span>}
                  {a.nombre_hommes != null && <span className="text-xs bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-full">Hommes : {a.nombre_hommes}</span>}
                  {a.nombre_femmes != null && <span className="text-xs bg-pink-50 text-pink-700 px-2.5 py-1 rounded-full">Femmes : {a.nombre_femmes}</span>}
                </div>
                {(a.resp1_nom || a.resp2_nom || a.secretaire_nom || a.tresoriere_nom) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {[
                      { label: "1er Responsable", nom: a.resp1_nom, tel: a.resp1_telephone },
                      { label: "2e Responsable", nom: a.resp2_nom, tel: a.resp2_telephone },
                      { label: "Secrétaire", nom: a.secretaire_nom, tel: a.secretaire_telephone },
                      { label: "Trésorière", nom: a.tresoriere_nom, tel: a.tresoriere_telephone },
                    ].filter(m => m.nom).map((m, i) => (
                      <div key={i} className="bg-muted/40 rounded-lg px-3 py-2">
                        <p className="text-[10px] font-semibold text-primary uppercase">{m.label}</p>
                        <p className="text-xs font-medium">{m.nom}</p>
                        {m.tel && <p className="text-xs text-muted-foreground">{m.tel}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
    </div>
  );
};

// ─────────────────────────────────────────────
// INFOS PAROISSE
// ─────────────────────────────────────────────
const InfosParoisse = ({ paroisseId }: { paroisseId: string }) => {
  const { toast } = useToast();
  const [form, setForm] = useState<any>({});
  const [loaded, setLoaded] = useState(false);
  const [edited, setEdited] = useState(false);

  useEffect(() => {
    supabase.from("paroisses").select("*").eq("id", paroisseId).maybeSingle()
      .then(({ data }) => { setForm(data || {}); setLoaded(true); });
  }, [paroisseId]);

  const handleSave = async () => {
    const { error } = await (supabase.from("paroisses") as any).update({
      telephone: form.telephone || null,
      email: form.email || null,
      rue: form.rue || null,
      quartier: form.quartier || null,
      ville: form.ville || null,
      pasteur_responsable: form.pasteur_responsable || null,
    }).eq("id", paroisseId);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Informations mises à jour" }); setEdited(false);
  };

  if (!loaded) return <p className="text-sm text-muted-foreground py-8 text-center">Chargement…</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-lg">Informations de la paroisse</h2>
        {edited && <Button size="sm" onClick={handleSave} className="gap-1.5"><Save className="h-3.5 w-3.5" />Enregistrer</Button>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: "pasteur_responsable", label: "Pasteur responsable" },
          { key: "telephone", label: "Téléphone" },
          { key: "email", label: "Email" },
          { key: "ville", label: "Ville" },
          { key: "quartier", label: "Quartier" },
          { key: "rue", label: "Rue / Adresse" },
        ].map(field => (
          <div key={field.key} className="space-y-1.5">
            <Label className="text-xs">{field.label}</Label>
            <Input
              value={form[field.key] || ""}
              onChange={e => { setForm({ ...form, [field.key]: e.target.value }); setEdited(true); }}
              className="h-9 text-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────
// PAGE PRINCIPALE
// ─────────────────────────────────────────────
type Tab = "bureau" | "organes" | "conseil" | "groupes" | "annexes" | "annonces" | "infos";

const ParoissePage = () => {
  const { id: paroisseId } = useParams<{ id: string }>();
  const { roles, isAdminGeneral, loading } = useAuth();
  const navigate = useNavigate();
  const [paroisseName, setParoisseName] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("bureau");

  const hasAccess =
    isAdminGeneral ||
    roles.some(r => r.role === "secretaire_paroissial" && r.scope_id === paroisseId) ||
    roles.some(r => r.role === "coordinateur_consistoire");

  useEffect(() => { if (!loading && !hasAccess) navigate("/admin"); }, [loading, hasAccess]);

  useEffect(() => {
    supabase.from("paroisses").select("name").eq("id", paroisseId!).maybeSingle()
      .then(({ data }) => setParoisseName(data?.name || "Paroisse"));
  }, [paroisseId]);

  const TABS: { key: Tab; label: string; icon: any }[] = [
    { key: "bureau", label: "Bureau", icon: Users },
    { key: "organes", label: "Organes", icon: Building2 },
    { key: "conseil", label: "Conseil", icon: Shield },
    { key: "groupes", label: "Groupes chantants", icon: Music },
    { key: "annexes", label: "Annexes", icon: Church },
    { key: "annonces", label: "Annonces", icon: Megaphone },
    { key: "infos", label: "Informations", icon: Info },
  ];

  return (
    <Layout>
      <div className="bg-primary py-8">
        <div className="container flex items-center gap-4">
          <Button
            variant="ghost" size="icon"
            onClick={() => navigate("/admin")}
            className="text-primary-foreground hover:bg-primary-foreground/10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <p className="text-primary-foreground/60 text-xs mb-0.5">Paroisse</p>
            <h1 className="font-display text-2xl text-primary-foreground">{paroisseName}</h1>
          </div>
        </div>
      </div>

      <section className="py-8 bg-muted/30 min-h-[60vh]">
        <div className="container max-w-4xl">
          {/* Onglets */}
          <div className="flex gap-1 bg-card border border-border rounded-xl p-1 mb-6 overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
                  ${activeTab === tab.key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Contenu */}
          <div className="bg-card border border-border rounded-xl p-6">
            {activeTab === "bureau" && paroisseId && (
              <MembresManager entityType="paroisse" entityId={paroisseId} memberType="bureau" title="Bureau paroissial" />
            )}
            {activeTab === "organes" && paroisseId && (
              <MembresManager entityType="paroisse" entityId={paroisseId} memberType="organe" title="Organes paroissiaux" />
            )}
            {activeTab === "conseil" && paroisseId && (
              <MembresManager entityType="paroisse" entityId={paroisseId} memberType="conseil" title="Conseil paroissial" />
            )}
            {activeTab === "groupes" && paroisseId && (
              <GroupesChantants paroisseId={paroisseId} />
            )}
            {activeTab === "annexes" && paroisseId && (
              <AnnexesManager paroisseId={paroisseId} />
            )}
            {activeTab === "annonces" && paroisseId && (
              <AnnoncesManager entityType="paroisse" entityId={paroisseId} />
            )}
            {activeTab === "infos" && paroisseId && (
              <InfosParoisse paroisseId={paroisseId} />
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ParoissePage;