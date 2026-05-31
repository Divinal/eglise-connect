import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { ShoppingBag, BookOpen, Shirt, Award, CreditCard, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-church.jpg";

const CATEGORIES = [
  { key: "tout",      label: "Tout",       icon: ShoppingBag },
  { key: "livre",     label: "Livres",     icon: BookOpen },
  { key: "pagne",     label: "Pagnes",     icon: Shirt },
  { key: "medaille",  label: "Médailles",  icon: Award },
  { key: "carte",     label: "Cartes",     icon: CreditCard },
];

const BoutiquePage = () => {
  const { toast } = useToast();
  const [produits, setProduits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categorie, setCategorie] = useState("tout");
  const [produitCommande, setProduitCommande] = useState<any | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ acheteur_nom: "", acheteur_contact: "", acheteur_localite: "", quantite: "1", message: "" });

  useEffect(() => {
    (supabase as any).from("produits").select("*").eq("disponible", true).order("categorie").order("nom")
      .then(({ data }: any) => { setProduits(data || []); setLoading(false); });
  }, []);

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const filtered = categorie === "tout" ? produits : produits.filter(p => p.categorie === categorie);

  const groupedBySubCat = filtered.reduce((acc: any, p: any) => {
    const key = p.sous_categorie || p.categorie;
    if (!acc[key]) acc[key] = [];
    acc[key].push(p);
    return acc;
  }, {});

  const handleCommander = async () => {
    if (!form.acheteur_contact) {
      toast({ title: "Contact requis", description: "Indiquez un numéro ou email pour vous contacter.", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await (supabase as any).from("commandes").insert({
      produit_id: produitCommande.id,
      produit_nom: produitCommande.nom,
      categorie: produitCommande.categorie,
      quantite: parseInt(form.quantite) || 1,
      acheteur_nom: form.acheteur_nom || null,
      acheteur_contact: form.acheteur_contact,
      acheteur_localite: form.acheteur_localite || null,
      message: form.message || null,
    });
    setSaving(false);
    if (error) { toast({ title: "Erreur", description: error.message, variant: "destructive" }); return; }
    setSubmitted(true);
  };

  return (
    <Layout>
      {/* Bannière */}
      <div className="relative bg-primary text-primary-foreground py-14 md:py-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/banners/EEC5.jpg')] bg-cover bg-center opacity-10" />
        <div className="relative container max-w-2xl">
          <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 text-gold text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <ShoppingBag className="h-3.5 w-3.5" /> Articles officiels EEC
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-3">Boutique de l'Église</h1>
          <p className="text-primary-foreground/75 text-lg">
            Livres, Bibles, Pagnes liturgiques, Médailles et Cartes officielles de l'Église Évangélique du Congo.
          </p>
        </div>
      </div>

      <div className="bg-cream py-14">
        <div className="container max-w-6xl">

          {/* Filtres catégories */}
          <div className="flex flex-wrap gap-2 mb-10 justify-center">
            {CATEGORIES.map(c => (
              <button key={c.key} onClick={() => setCategorie(c.key)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all border ${
                  categorie === c.key
                    ? "bg-primary text-primary-foreground border-primary shadow"
                    : "bg-card text-foreground border-border hover:border-primary/40"
                }`}>
                <c.icon className="h-4 w-4" />
                {c.label}
              </button>
            ))}
          </div>

          {/* Produits */}
          {loading ? (
            <p className="text-center text-muted-foreground py-20">Chargement…</p>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg font-medium">Aucun article disponible pour le moment.</p>
              <p className="text-muted-foreground/60 text-sm mt-1">Les articles seront ajoutés prochainement par l'administrateur.</p>
            </div>
          ) : (
            <div className="space-y-10">
              {Object.entries(groupedBySubCat).map(([subCat, items]: any) => (
                <div key={subCat}>
                  <h2 className="font-display text-xl font-bold text-primary mb-5 flex items-center gap-2">
                    <span className="w-8 h-px bg-primary inline-block" />
                    {subCat}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {items.map((p: any) => (
                      <div key={p.id} className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                        <div className="h-44 bg-muted/30 flex items-center justify-center overflow-hidden">
                          {p.image_url
                            ? <img src={p.image_url} alt={p.nom} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={(e) => { (e.target as HTMLImageElement).src = heroImage; }} />
                            : <ShoppingBag className="h-16 w-16 text-muted-foreground/20" />}
                        </div>
                        <div className="p-4">
                          <p className="font-semibold text-foreground text-sm leading-snug">{p.nom}</p>
                          {p.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{p.description}</p>}
                          <div className="flex items-center justify-between mt-3">
                            <p className="font-bold text-primary text-base">
                              {p.prix > 0 ? `${p.prix.toLocaleString()} FCFA` : "Prix sur demande"}
                            </p>
                            <Button size="sm" onClick={() => { setProduitCommande(p); setSubmitted(false); setForm({ acheteur_nom:"", acheteur_contact:"", acheteur_localite:"", quantite:"1", message:"" }); }}>
                              Commander
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de commande */}
      {produitCommande && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-2xl shadow-2xl border border-border w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Commander : {produitCommande.nom}</h2>
              <button onClick={() => setProduitCommande(null)} className="p-1 rounded-md hover:bg-muted">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            {submitted ? (
              <div className="p-8 text-center">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <p className="font-semibold text-foreground mb-2">Commande enregistrée !</p>
                <p className="text-sm text-muted-foreground">L'équipe de l'EEC vous contactera pour confirmer et organiser la livraison ou le retrait.</p>
                <Button className="mt-5" onClick={() => setProduitCommande(null)}>Fermer</Button>
              </div>
            ) : (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Quantité</Label>
                    <Input type="number" min="1" value={form.quantite} onChange={e => set("quantite", e.target.value)} className="h-9 text-sm" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Votre nom</Label>
                    <Input value={form.acheteur_nom} onChange={e => set("acheteur_nom", e.target.value)} className="h-9 text-sm" placeholder="Optionnel" />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Contact (téléphone ou email) *</Label>
                  <Input value={form.acheteur_contact} onChange={e => set("acheteur_contact", e.target.value)} className="h-9 text-sm" placeholder="06 xxx xxx / email@..." />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Ville / Localité</Label>
                  <Input value={form.acheteur_localite} onChange={e => set("acheteur_localite", e.target.value)} className="h-9 text-sm" placeholder="Ex: Brazzaville, Pointe-Noire…" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Message (optionnel)</Label>
                  <Textarea value={form.message} onChange={e => set("message", e.target.value)} rows={2} className="text-sm" placeholder="Précisions sur votre commande…" />
                </div>
                <div className="flex gap-2 pt-1">
                  <Button onClick={handleCommander} disabled={saving} className="flex-1 gap-1.5">
                    <ShoppingBag className="h-4 w-4" />
                    {saving ? "Envoi…" : "Confirmer la commande"}
                  </Button>
                  <Button variant="outline" onClick={() => setProduitCommande(null)}>Annuler</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  );
};

export default BoutiquePage;
