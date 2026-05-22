const TICKER_ANNONCES = [
  "📢 Bienvenue sur le portail officiel de l'Église Évangélique du Congo",
  "✝️ 60e Anniversaire du CBE — Célébration le 15 juin 2026 à Brazzaville",
  "📖 22ème Synode de l'EEC — Résolutions disponibles en ligne",
  "🙏 Culte dominical chaque dimanche à 9h00 dans votre paroisse",
  "🌍 Diaspora EEC Europe — Première convention continentale à Paris",
  "🎓 IFPN — Inscriptions ouvertes pour la nouvelle promotion pastorale",
];

const tickerText = TICKER_ANNONCES.join("     ·     ");

const AnnouncementTicker = () => (
  <div className="bg-black/80 overflow-hidden">
    <style>{`
      @keyframes eec-ticker {
        0%   { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .eec-ticker-inner {
        display: inline-flex;
        white-space: nowrap;
        animation: eec-ticker 45s linear infinite;
      }
    `}</style>
    <div className="flex items-center h-8">
      <div className="shrink-0 bg-gold text-[11px] font-bold px-3 h-full flex items-center text-navy-dark tracking-wide border-r border-white/20">
        ANNONCES
      </div>
      <div className="overflow-hidden flex-1">
        <div className="eec-ticker-inner">
          <span className="text-white/90 text-xs px-10">{tickerText}</span>
          <span className="text-white/90 text-xs px-10">{tickerText}</span>
        </div>
      </div>
    </div>
  </div>
);

export default AnnouncementTicker;
