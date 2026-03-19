import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Calendar, FileText } from "lucide-react";

const bureauMembers = [
  { nom: "Président National", prenom: "", fonction: "Président", genre: "h" },
  { nom: "Vice-Président", prenom: "", fonction: "Vice-Président", genre: "h" },
  { nom: "Secrétaire Général", prenom: "", fonction: "Secrétaire Général", genre: "h" },
  { nom: "Secrétaire Général Adjoint", prenom: "", fonction: "Secrétaire Général Adjoint", genre: "f" },
  { nom: "Trésorier Général", prenom: "", fonction: "Trésorier Général", genre: "h" },
  { nom: "Trésorier Général Adjoint", prenom: "", fonction: "Trésorier Général Adjoint", genre: "f" },
];

const annonces = [
  {
    titre: "Réunion du Bureau Synodal — Mars 2025",
    date: "15 mars 2025",
    contenu:
      "Le Bureau Synodal se réunira en session ordinaire pour examiner le rapport d'activités du premier trimestre et préparer les prochaines assemblées.",
  },
  {
    titre: "Circulaire Pastorale N°01/2025",
    date: "1er janvier 2025",
    contenu:
      "Le Bureau Synodal adresse ses vœux fraternels à toutes les paroisses et communautés de l'EEC à l'occasion de la nouvelle année et formule les orientations pastorales pour l'année en cours.",
  },
];

const BureauSynodalPage = () => {
  return (
    <Layout>
      <div className="bg-primary py-12">
        <div className="container">
          <nav className="text-primary-foreground/60 text-sm mb-3">
            <span>Institution</span>
            <span className="mx-2">/</span>
            <span className="text-primary-foreground">Bureau Synodal</span>
          </nav>
          <h1 className="font-display text-3xl md:text-4xl text-primary-foreground">Bureau Synodal</h1>
          <p className="text-primary-foreground/70 mt-2">
            Organe exécutif permanent de l'Église Évangélique du Congo
          </p>
        </div>
      </div>

      {/* Présentation */}
      <section className="py-10 bg-cream border-b border-border">
        <div className="container max-w-3xl">
          <h2 className="font-display text-2xl font-semibold text-primary mb-4">
            Rôle et Attributions
          </h2>
          <div className="prose prose-sm text-muted-foreground space-y-3">
            <p>
              Le <strong className="text-foreground">Bureau Synodal</strong> est l'organe exécutif
              permanent de l'EEC, chargé d'assurer la gestion courante de l'Église entre les sessions
              du Conseil Synodal. Il est composé du Président National, du Vice-Président, du Secrétaire
              Général et de ses adjoints, ainsi que du Trésorier Général.
            </p>
            <p>
              Il supervise l'exécution des décisions du Synode et du Conseil Synodal, représente
              officiellement l'EEC auprès des autorités civiles, religieuses et des partenaires,
              et coordonne les activités des différents départements.
            </p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-8 bg-background">
        <div className="container">
          <Tabs defaultValue="membres" className="w-full">
            <TabsList className="bg-card border border-border mb-6">
              <TabsTrigger value="membres" className="gap-2">
                <User className="h-4 w-4" />
                Membres
              </TabsTrigger>
              <TabsTrigger value="annonces" className="gap-2">
                <Calendar className="h-4 w-4" />
                Annonces & Dates
              </TabsTrigger>
              <TabsTrigger value="circulaires" className="gap-2">
                <FileText className="h-4 w-4" />
                Circulaires
              </TabsTrigger>
            </TabsList>

            {/* Membres */}
            <TabsContent value="membres">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {bureauMembers.map((m, i) => (
                  <div
                    key={i}
                    className="bg-card border border-border rounded-xl p-5 flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{m.fonction}</p>
                      <p className="text-xs text-muted-foreground mt-1 italic">
                        (Poste à pourvoir / données à renseigner)
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-6 italic text-center">
                * Les noms des membres seront renseignés par l'administrateur autorisé.
              </p>
            </TabsContent>

            {/* Annonces */}
            <TabsContent value="annonces">
              <div className="space-y-4 max-w-2xl">
                {annonces.map((a, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <Calendar className="h-3.5 w-3.5" />
                      {a.date}
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{a.titre}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{a.contenu}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Circulaires */}
            <TabsContent value="circulaires">
              <div className="bg-muted/30 rounded-xl p-8 text-center max-w-md mx-auto">
                <FileText className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
                <p className="text-muted-foreground text-sm">
                  Les circulaires pastorales et administratives seront publiées ici par le Bureau Synodal.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default BureauSynodalPage;
