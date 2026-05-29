import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Calendar, Camera } from "lucide-react";
import heroImage from "@/assets/hero-church.jpg";

const EgliseDeProximitePage = () => {
  const [reportages, setReportages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("announcements")
      .select("*")
      .eq("entity_type", "eglise_proximite")
      .order("created_at", { ascending: false })
      .then(({ data }) => { setReportages(data || []); setLoading(false); });
  }, []);

  return (
    <Layout>
      {/* ── BANNIÈRE ── */}
      <div className="relative bg-primary text-primary-foreground py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/banners/EEC5.jpg')] bg-cover bg-center opacity-15" />
        <div className="relative container text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 text-gold text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <Camera className="h-3.5 w-3.5" /> Reportages & Témoignages
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Église de Proximité
          </h1>
          <p className="text-primary-foreground/75 text-lg leading-relaxed">
            Les actions sociales, les missions de terrain et les témoignages de l'Église
            Évangélique du Congo à travers tout le pays.
          </p>
        </div>
      </div>

      {/* ── CONTENU ── */}
      <div className="bg-cream py-14">
        <div className="container max-w-6xl">
          {loading ? (
            <div className="text-center py-20 text-muted-foreground">Chargement…</div>
          ) : reportages.length === 0 ? (
            <div className="text-center py-20">
              <Camera className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg font-medium">Aucun reportage pour le moment.</p>
              <p className="text-muted-foreground/60 text-sm mt-1">
                Les reportages des actions sociales de l'EEC seront publiés ici.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reportages.map((r, i) => (
                <article key={r.id}
                  className={`bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group ${i === 0 ? "md:col-span-2 lg:col-span-2" : ""}`}
                >
                  {/* Image */}
                  <div className={`relative overflow-hidden ${i === 0 ? "h-64 md:h-80" : "h-48"}`}>
                    <img
                      src={r.image_url || heroImage}
                      alt={r.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => { (e.target as HTMLImageElement).src = heroImage; }}
                    />
                    {/* Badge type */}
                    <div className="absolute top-3 left-3">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        r.type === "circulaire" ? "bg-blue-600 text-white" :
                        r.type === "convocation" ? "bg-amber-600 text-white" :
                        "bg-primary text-primary-foreground"
                      }`}>
                        {r.type === "circulaire" ? "Mission" :
                         r.type === "convocation" ? "Événement" : "Reportage"}
                      </span>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(r.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                    </div>
                    <h2 className={`font-display font-bold text-foreground group-hover:text-primary transition-colors ${i === 0 ? "text-xl md:text-2xl" : "text-lg"} mb-2 leading-snug`}>
                      {r.title}
                    </h2>
                    {r.content && (
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {r.content}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default EgliseDeProximitePage;
