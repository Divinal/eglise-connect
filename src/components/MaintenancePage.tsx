import { useEffect, useState } from "react";
import logo from "@/assets/eec-logo.png";

const LAUNCH_DATE = new Date("2026-06-21T00:00:00");

function getTimeLeft() {
  const diff = LAUNCH_DATE.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const MaintenancePage = () => {
  const [time, setTime] = useState(getTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0d1f3c] flex flex-col items-center justify-center px-4 text-white">

      {/* Logo */}
      <img
        src={logo}
        alt="Église Évangélique du Congo"
        className="w-28 h-28 object-contain mb-6 drop-shadow-lg"
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />

      {/* Titre */}
      <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#c9a84c] text-center mb-2">
        Église Évangélique du Congo
      </h1>
      <p className="text-white/60 text-sm uppercase tracking-widest mb-10">
        Site en cours de création
      </p>

      {/* Countdown */}
      <div className="flex gap-4 md:gap-8 mb-10">
        {[
          { value: time.days,    label: "Jours" },
          { value: time.hours,   label: "Heures" },
          { value: time.minutes, label: "Minutes" },
          { value: time.seconds, label: "Secondes" },
        ].map(({ value, label }) => (
          <div key={label} className="flex flex-col items-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center">
              <span className="text-2xl md:text-3xl font-bold text-[#c9a84c] tabular-nums">
                {String(value).padStart(2, "0")}
              </span>
            </div>
            <span className="text-xs text-white/50 mt-1.5 uppercase tracking-wide">{label}</span>
          </div>
        ))}
      </div>

      {/* Message */}
      <div className="max-w-md text-center space-y-2">
        <p className="text-white/80 text-base leading-relaxed">
          Nous préparons quelque chose d'exceptionnel pour notre communauté.
          Notre nouveau portail sera bientôt disponible.
        </p>
        <p className="text-white/50 text-sm mt-4">
          Pour toute question :{" "}
          <a href="mailto:contact@egliseevangeliquecongo.org" className="text-[#c9a84c] hover:underline">
            contact@egliseevangeliquecongo.org
          </a>
        </p>
      </div>

      {/* Ligne de séparation décorative */}
      <div className="mt-12 flex items-center gap-3 text-white/20">
        <div className="h-px w-16 bg-white/20" />
        <span className="text-xs uppercase tracking-widest">EEC — Depuis 1909</span>
        <div className="h-px w-16 bg-white/20" />
      </div>
    </div>
  );
};

export default MaintenancePage;
