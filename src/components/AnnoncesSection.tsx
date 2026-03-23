import { Megaphone } from "lucide-react";

interface Annonce {
  id: string;
  title: string;
  content?: string | null;
  image_url?: string | null;
  type?: string | null;
  created_at: string;
}

const AnnoncesSection = ({ annonces }: { annonces: Annonce[] }) => {
  if (annonces.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <Megaphone className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
        <p className="text-muted-foreground text-sm">Aucune annonce pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {annonces.map((a) => (
        <div key={a.id} className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow">
          {a.image_url && (
            <img src={a.image_url} alt={a.title} className="w-full h-52 object-cover" />
          )}
          <div className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                a.type === "circulaire" ? "bg-blue-100 text-blue-700" :
                a.type === "convocation" ? "bg-amber-100 text-amber-700" :
                "bg-green-100 text-green-700"
              }`}>{a.type || "annonce"}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(a.created_at).toLocaleDateString("fr-FR")}
              </span>
            </div>
            <p className="font-semibold text-sm text-foreground">{a.title}</p>
            {a.content && <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{a.content}</p>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnnoncesSection;
