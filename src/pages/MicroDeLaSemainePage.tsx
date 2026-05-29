import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Mic, Calendar, Quote } from "lucide-react";
import heroImage from "@/assets/hero-church.jpg";

const MicroDeLaSemainePage = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("announcements")
      .select("*")
      .eq("entity_type", "micro_semaine")
      .order("created_at", { ascending: false })
      .then(({ data }) => { setMessages(data || []); setLoading(false); });
  }, []);

  const featured = messages[0];
  const archives = messages.slice(1);

  return (
    <Layout>
      {/* ── BANNIÈRE ── */}
      <div className="relative bg-primary text-primary-foreground py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/banners/synode-banner.jpg')] bg-cover bg-center opacity-10" />
        <div className="relative container text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-gold/20 border border-gold/40 text-gold text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <Mic className="h-3.5 w-3.5" /> Message & Interview
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Micro de la Semaine
          </h1>
          <p className="text-primary-foreground/75 text-lg leading-relaxed">
            La parole des responsables, les messages spirituels et les interviews
            sur les grands sujets de l'Église et de la société.
          </p>
        </div>
      </div>

      {/* ── CONTENU ── */}
      <div className="bg-cream py-14">
        <div className="container max-w-5xl">
          {loading ? (
            <div className="text-center py-20 text-muted-foreground">Chargement…</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-20">
              <Mic className="h-16 w-16 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg font-medium">Aucun message pour le moment.</p>
              <p className="text-muted-foreground/60 text-sm mt-1">
                Les messages et interviews de la semaine seront publiés ici.
              </p>
            </div>
          ) : (
            <>
              {/* ── MESSAGE VEDETTE (le plus récent) ── */}
              {featured && (
                <div className="mb-12">
                  <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-6 h-px bg-primary inline-block" />
                    Message de la semaine
                  </p>
                  <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-md group">
                    <div className="grid md:grid-cols-2">
                      {/* Image */}
                      <div className="relative h-64 md:h-auto overflow-hidden">
                        <img
                          src={featured.image_url || heroImage}
                          alt={featured.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => { (e.target as HTMLImageElement).src = heroImage; }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent md:bg-gradient-to-r" />
                      </div>
                      {/* Texte */}
                      <div className="p-8 flex flex-col justify-center">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                          <span className={`px-2.5 py-0.5 rounded-full font-medium ${
                            featured.type === "circulaire" ? "bg-blue-100 text-blue-700" :
                            featured.type === "convocation" ? "bg-amber-100 text-amber-700" :
                            "bg-green-100 text-green-700"
                          }`}>
                            {featured.type === "circulaire" ? "Interview" :
                             featured.type === "convocation" ? "Conférence" : "Message"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(featured.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                          </span>
                        </div>
                        <div className="mb-3 text-primary/30">
                          <Quote className="h-8 w-8" />
                        </div>
                        <h2 className="font-display text-2xl font-bold text-foreground mb-4 leading-tight">
                          {featured.title}
                        </h2>
                        {featured.content && (
                          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-5">
                            {featured.content}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ── ARCHIVES ── */}
              {archives.length > 0 && (
                <>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-5 flex items-center gap-2">
                    <span className="w-6 h-px bg-border inline-block" />
                    Messages précédents
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {archives.map((m) => (
                      <div key={m.id} className="bg-card border border-border rounded-xl overflow-hidden group hover:shadow-md transition-shadow">
                        <div className="relative h-44 overflow-hidden">
                          <img
                            src={m.image_url || heroImage}
                            alt={m.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => { (e.target as HTMLImageElement).src = heroImage; }}
                          />
                          <div className="absolute top-3 left-3">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                              m.type === "circulaire" ? "bg-blue-600 text-white" :
                              m.type === "convocation" ? "bg-amber-600 text-white" :
                              "bg-primary text-primary-foreground"
                            }`}>
                              {m.type === "circulaire" ? "Interview" :
                               m.type === "convocation" ? "Conférence" : "Message"}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                            <Calendar className="h-3 w-3" />
                            {new Date(m.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                          <h3 className="font-semibold text-foreground text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">
                            {m.title}
                          </h3>
                          {m.content && (
                            <p className="text-xs text-muted-foreground mt-1.5 line-clamp-2">{m.content}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default MicroDeLaSemainePage;
