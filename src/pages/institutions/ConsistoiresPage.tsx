import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import { Church, ChevronRight, Globe, BookOpen } from "lucide-react";
import { slugify } from "@/utils/slugify";

type Tab = "consistoires" | "diaspora" | "champs-evangelisation";

const TABS: { key: Tab; label: string; icon: any; table: string; route: (name: string) => string }[] = [
  { key: "consistoires",         label: "Consistoires",           icon: Church,   table: "consistoires",          route: n => `/institution/consistoires/${slugify(n)}` },
  { key: "diaspora",             label: "Diaspora",               icon: Globe,    table: "diaspora",              route: n => `/institution/diaspora/${slugify(n)}` },
  { key: "champs-evangelisation",label: "Champs d'Évangélisation",icon: BookOpen, table: "champs_evangelisation", route: n => `/institution/champs-evangelisation/${slugify(n)}` },
];

interface Entity { id: string; name: string; ville: string | null; responsable: string | null; description: string | null; }

const EntityGrid = ({ tab, navigate }: { tab: typeof TABS[0]; navigate: ReturnType<typeof useNavigate> }) => {
  const [items, setItems] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    (supabase as any).from(tab.table)
      .select("id, name, ville, responsable, description")
      .order("name")
      .then(({ data }: any) => { setItems(data || []); setLoading(false); });
  }, [tab.key]);

  if (loading) return <p className="text-center text-muted-foreground py-16">Chargement…</p>;

  if (items.length === 0) return (
    <div className="text-center py-16">
      <tab.icon className="h-14 w-14 text-muted-foreground/30 mx-auto mb-3" />
      <p className="text-muted-foreground">Aucun élément pour l'instant.</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(c => (
        <button
          key={c.id}
          onClick={() => navigate(tab.route(c.name))}
          className="bg-card border border-border rounded-xl p-6 hover:shadow-lg hover:border-gold transition-all text-left group"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                <tab.icon className="h-4.5 w-4.5 text-primary" />
              </div>
              <h3 className="font-display text-base font-semibold text-primary group-hover:text-gold transition-colors leading-snug">
                {c.name}
              </h3>
              {c.ville && <p className="text-sm text-muted-foreground mt-1">{c.ville}</p>}
              {c.responsable && <p className="text-xs text-muted-foreground mt-0.5">Resp. : {c.responsable}</p>}
              {!c.ville && !c.responsable && (
                <p className="text-xs text-muted-foreground mt-1">Cliquez pour voir les détails</p>
              )}
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground/40 shrink-0 mt-0.5 group-hover:text-gold transition-colors" />
          </div>
        </button>
      ))}
    </div>
  );
};

const ConsistoiresPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<Tab>("consistoires");
  const tab = TABS.find(t => t.key === activeTab)!;

  return (
    <Layout>
      <div className="bg-primary py-12">
        <div className="container">
          <h1 className="font-display text-3xl md:text-4xl text-primary-foreground">Consistoires & Diaspora</h1>
          <p className="text-primary-foreground/70 mt-2">Structures de l'Église Évangélique du Congo</p>
        </div>
      </div>

      {/* Onglets */}
      <div className="bg-card border-b border-border sticky top-16 z-30">
        <div className="container">
          <div className="flex gap-0 overflow-x-auto">
            {TABS.map(t => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all
                  ${activeTab === t.key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
              >
                <t.icon className="h-4 w-4 shrink-0" />
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="py-10 bg-cream min-h-[50vh]">
        <div className="container">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <tab.icon className="h-4 w-4 text-primary" />
            </div>
            <h2 className="font-display text-xl font-semibold text-foreground">{tab.label}</h2>
          </div>
          <EntityGrid tab={tab} navigate={navigate} />
        </div>
      </section>
    </Layout>
  );
};

export default ConsistoiresPage;
