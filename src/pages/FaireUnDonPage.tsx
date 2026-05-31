import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Heart, Smartphone, Package, ChevronRight, CheckCircle, User, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES_DON = [
  "Offrande du culte",
  "Dîme",
  "Don pour projets de construction",
  "Don pour les serviteurs de Dieu",
  "Soutien aux pauvres et orphelins",
  "Contribution aux conventions",
  "Fonds mission et évangélisation",
  "Centenaire / Jubilé",
  "Fonds d'urgence",
  "Autre",
];

const DESTINATAIRES = [
  { value: "eglise",         label: "L'Église Évangélique du Congo (EEC)" },
  { value: "presidence",     label: "Bureau Synodal / Présidence Nationale" },
  { value: "consistoire",    label: "Consistoire" },
  { value: "paroisse",       label: "Paroisse" },
  { value: "serviteur",      label: "Serviteur de Dieu (Pasteur / Évangéliste)" },
  { value: "departement",    label: "Département Synodal" },
  { value: "diaspora",       label: "Communauté Diaspora" },
  { value: "autre",          label: "Autre destination" },
];

const MTN_CODE = "093511";

const FaireUnDonPage = () => {
  const { toast } = useToast();
  const [type, setType] = useState<"espece" | "nature" | null>(null);
  const [paroisses, setParoisses] = useState<any[]>([]);
  const [diasporaList, setDiasporaList] = useState<any[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    categorie: "",
    montant: "",
    nature_description: "",
    destinataire: "",
    destinataire_detail: "",
    lieu_depot_type: "",
    lieu_depot_id: "",
    lieu_depot_nom: "",
    donateur_nom: "",
    is_anonymous: false,
    message: "",
  });

  useEffect(() => {
    supabase.from("paroisses").select("id,name,ville").order("name")
      .then(({ data }) => setParoisses(data || []));
    (supabase as any).from("diaspora").select("id,name,ville").order("name")
      .then(({ data }: any) => setDiasporaList(data || []));
  }, []);

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }));

  const lieuOptions = form.lieu_depot_type === "paroisse" ? paroisses
    : form.lieu_depot_type === "diaspora" ? diasporaList : [];

  const handleSubmit = async () => {
    if (!form.categorie || !form.destinataire) {
      toast({ title: "Champs requis", description: "Catégorie et destinataire sont obligatoires.", variant: "destructive" });
      return;
    }
    if (type === "espece" && !form.montant) {
      toast({ title: "Montant requis", variant: "destructive" }); return;
    }
    if (type === "nature" && !form.nature_description) {
      toast({ title: "Description du don requise", variant: "destructive" }); return;
    }
    setSaving(true);
    const { error } = await (supabase as any).from("dons").insert({
      type_don: type,
      categorie: form.categorie,
      montant: type === "espece" ? parseFloat(form.montant) || null : null,
      nature_description: form.nature_description || null,
      destinataire: form.destinataire,
      destinataire_detail: form.destinataire_detail || null,
      lieu_depot_type: form.lieu_depot_type || null,
      lieu_depot_id: form.lieu_depot_id || null,
      lieu_depot_nom: form.lieu_depot_nom || null,
      donateur_nom: form.is_anonymous ? null : (form.donateur_nom || null),
      is_anonymous: form.is_anonymous,
      message: form.message || null,
    });
    setSaving(false);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    setSubmitted(true);
  };

  if (submitted) return (
    <Layout>
      <div className="min-h-[70vh] flex items-center justify-center bg-cream">
        <div className="text-center max-w-md px-6">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h1 className="font-display text-3xl font-bold text-foreground mb-3">Merci pour votre générosité !</h1>
          <p className="text-muted-foreground mb-2">
            {type === "espece"
              ? "Votre déclaration de don a été enregistrée. Envoyez le montant au code MTN MoMo : "
              : "Votre don en nature a bien été enregistré. L'équipe de l'EEC vous contactera pour la réception."}
          </p>
          {type === "espece" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mt-3 mb-4">
              <p className="font-bold text-2xl text-yellow-700">{MTN_CODE}</p>
              <p className="text-xs text-yellow-600">Code marchand MTN Mobile Money EEC</p>
            </div>
          )}
          <p className="text-xs text-muted-foreground italic">
            « Que chacun donne comme il l'a résolu en son cœur » — 2 Cor 9:7
          </p>
          <Button className="mt-6" onClick={() => { setSubmitted(false); setType(null); setForm({ categorie:"",montant:"",nature_description:"",destinataire:"",destinataire_detail:"",lieu_depot_type:"",lieu_depot_id:"",lieu_depot_nom:"",donateur_nom:"",is_anonymous:false,message:"" }); }}>
            Faire un autre don
          </Button>
        </div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      {/* ── BANNIÈRE ── */}
      <div className="relative bg-primary text-primary-foreground py-14 md:py-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/banners/EEC5.jpg')] bg-cover bg-center opacity-10" />
        <div className="relative container max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 text-gold text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <Heart className="h-3.5 w-3.5" /> Générosité & Soutien
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Faire un Don</h1>
          <p className="text-primary-foreground/75 text-lg">
            Soutenez l'œuvre de l'Église Évangélique du Congo selon votre cœur et vos possibilités.
          </p>
        </div>
      </div>

      <div className="bg-cream py-14">
        <div className="container max-w-3xl">

          {/* ── VERSET ── */}
          <p className="text-center text-muted-foreground text-sm italic mb-10">
            « Dieu aime celui qui donne avec joie. » — 2 Corinthiens 9:7
          </p>

          {/* ── CHOIX DU TYPE ── */}
          {!type ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button onClick={() => setType("espece")}
                className="group bg-card border-2 border-border hover:border-primary rounded-2xl p-8 text-left transition-all hover:shadow-lg">
                <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center mb-4 group-hover:bg-amber-200 transition-colors">
                  <Smartphone className="h-7 w-7 text-amber-600" />
                </div>
                <h2 className="font-display text-xl font-bold text-foreground mb-2">En Espèce</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Don monétaire via MTN Mobile Money. Utilisez le code marchand de l'EEC pour effectuer votre versement.
                </p>
                <div className="flex items-center gap-1 mt-4 text-primary text-sm font-semibold">
                  Choisir <ChevronRight className="h-4 w-4" />
                </div>
              </button>

              <button onClick={() => setType("nature")}
                className="group bg-card border-2 border-border hover:border-primary rounded-2xl p-8 text-left transition-all hover:shadow-lg">
                <div className="w-14 h-14 rounded-2xl bg-green-100 flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
                  <Package className="h-7 w-7 text-green-600" />
                </div>
                <h2 className="font-display text-xl font-bold text-foreground mb-2">En Nature</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Don de biens, matériaux, vivres ou équipements. Choisissez un lieu de dépôt proche de vous.
                </p>
                <div className="flex items-center gap-1 mt-4 text-primary text-sm font-semibold">
                  Choisir <ChevronRight className="h-4 w-4" />
                </div>
              </button>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
              {/* En-tête du formulaire */}
              <div className={`px-6 py-4 flex items-center gap-3 ${type === "espece" ? "bg-amber-50 border-b border-amber-100" : "bg-green-50 border-b border-green-100"}`}>
                {type === "espece"
                  ? <Smartphone className="h-5 w-5 text-amber-600" />
                  : <Package className="h-5 w-5 text-green-600" />}
                <div>
                  <p className="font-semibold text-foreground">Don {type === "espece" ? "en Espèce" : "en Nature"}</p>
                  <button onClick={() => setType(null)} className="text-xs text-muted-foreground hover:underline">
                    ← Changer de type
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-5">

                {/* MTN MoMo pour Espèce */}
                {type === "espece" && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5">
                    <p className="text-sm font-semibold text-yellow-800 mb-1 flex items-center gap-2">
                      <Smartphone className="h-4 w-4" /> Paiement MTN Mobile Money
                    </p>
                    <p className="text-xs text-yellow-700 mb-3">Envoyez votre don au code marchand ci-dessous :</p>
                    <div className="text-center">
                      <p className="font-display text-4xl font-black text-yellow-700 tracking-widest">{MTN_CODE}</p>
                      <p className="text-xs text-yellow-600 mt-1">Code marchand EEC — MTN MoMo Congo</p>
                    </div>
                    <p className="text-xs text-yellow-700 mt-3 text-center italic">
                      Remplissez le formulaire ci-dessous pour enregistrer votre don dans nos archives.
                    </p>
                  </div>
                )}

                {/* Montant (Espèce) */}
                {type === "espece" && (
                  <div className="space-y-1.5">
                    <Label>Montant du don (FCFA) *</Label>
                    <Input type="number" value={form.montant} onChange={e => set("montant", e.target.value)}
                      placeholder="Ex: 5000" className="text-sm" />
                  </div>
                )}

                {/* Description (Nature) */}
                {type === "nature" && (
                  <div className="space-y-1.5">
                    <Label>Description du don *</Label>
                    <Textarea value={form.nature_description} onChange={e => set("nature_description", e.target.value)}
                      placeholder="Ex: 2 sacs de ciment, 10 litres d'huile, vêtements enfants…"
                      rows={3} className="text-sm" />
                  </div>
                )}

                {/* Lieu de dépôt (Nature) */}
                {type === "nature" && (
                  <div className="space-y-3">
                    <Label>Lieu de dépôt</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["paroisse", "diaspora"].map(t => (
                        <button key={t} onClick={() => { set("lieu_depot_type", t); set("lieu_depot_id", ""); set("lieu_depot_nom", ""); }}
                          className={`p-3 rounded-xl border text-sm font-medium transition-all ${form.lieu_depot_type === t ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground hover:border-primary/40"}`}>
                          {t === "paroisse" ? "🏛 Paroisse" : "🌍 Diaspora"}
                        </button>
                      ))}
                    </div>
                    {form.lieu_depot_type && lieuOptions.length > 0 && (
                      <Select value={form.lieu_depot_id} onValueChange={v => {
                        const found = lieuOptions.find((o: any) => o.id === v);
                        set("lieu_depot_id", v);
                        set("lieu_depot_nom", found?.name || "");
                      }}>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder={`Choisir ${form.lieu_depot_type === "paroisse" ? "une paroisse" : "une communauté"}…`} />
                        </SelectTrigger>
                        <SelectContent>
                          {lieuOptions.map((o: any) => (
                            <SelectItem key={o.id} value={o.id}>{o.name}{o.ville ? ` — ${o.ville}` : ""}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                )}

                {/* Catégorie */}
                <div className="space-y-1.5">
                  <Label>Catégorie du don *</Label>
                  <Select value={form.categorie} onValueChange={v => set("categorie", v)}>
                    <SelectTrigger className="text-sm"><SelectValue placeholder="Choisir une catégorie…" /></SelectTrigger>
                    <SelectContent>
                      {CATEGORIES_DON.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* Destinataire */}
                <div className="space-y-1.5">
                  <Label>À qui est destiné ce don ? *</Label>
                  <Select value={form.destinataire} onValueChange={v => set("destinataire", v)}>
                    <SelectTrigger className="text-sm"><SelectValue placeholder="Choisir le destinataire…" /></SelectTrigger>
                    <SelectContent>
                      {DESTINATAIRES.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {form.destinataire && !["eglise","presidence"].includes(form.destinataire) && (
                    <Input value={form.destinataire_detail} onChange={e => set("destinataire_detail", e.target.value)}
                      placeholder="Préciser le nom (optionnel)" className="text-sm mt-2" />
                  )}
                </div>

                {/* Anonymat */}
                <div className="space-y-3">
                  <Label>Votre identité</Label>
                  <div className="flex gap-3">
                    <button onClick={() => set("is_anonymous", false)}
                      className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${!form.is_anonymous ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground"}`}>
                      <User className="h-4 w-4" /> Me nommer
                    </button>
                    <button onClick={() => set("is_anonymous", true)}
                      className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${form.is_anonymous ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground"}`}>
                      <EyeOff className="h-4 w-4" /> Rester anonyme
                    </button>
                  </div>
                  {!form.is_anonymous && (
                    <Input value={form.donateur_nom} onChange={e => set("donateur_nom", e.target.value)}
                      placeholder="Votre nom et prénom" className="text-sm" />
                  )}
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <Label>Message (optionnel)</Label>
                  <Textarea value={form.message} onChange={e => set("message", e.target.value)}
                    placeholder="Un message à transmettre avec votre don…" rows={2} className="text-sm" />
                </div>

                <Button onClick={handleSubmit} disabled={saving} className="w-full gap-2 py-3 text-base">
                  <Heart className="h-4 w-4" />
                  {saving ? "Enregistrement…" : "Confirmer mon don"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default FaireUnDonPage;
