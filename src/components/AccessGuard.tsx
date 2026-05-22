import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import MaintenancePage from "./MaintenancePage";

const SECRET_TOKEN = "eec-preview-2026";
const STORAGE_KEY  = "eec_access_granted";
const BYPASS_PATHS = ["/login", "/admin"];

function hasAccess(): boolean {
  try { return localStorage.getItem(STORAGE_KEY) === "true"; } catch { return false; }
}

function grantAccess() {
  try { localStorage.setItem(STORAGE_KEY, "true"); } catch { /* ignore */ }
}

const AccessGuard = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [allowed, setAllowed] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Vérifie le token secret dans l'URL (?preview=...)
    const params = new URLSearchParams(window.location.search);
    if (params.get("preview") === SECRET_TOKEN) {
      grantAccess();
      // Retire le paramètre de l'URL sans recharger
      const clean = window.location.pathname;
      window.history.replaceState(null, "", clean);
    }

    // Chemins admin/login toujours accessibles
    const isAdminPath = BYPASS_PATHS.some(p => location.pathname.startsWith(p));
    setAllowed(isAdminPath || hasAccess());
    setChecked(true);
  }, [location.pathname]);

  if (!checked) return null;
  if (!allowed) return <MaintenancePage />;
  return <>{children}</>;
};

export default AccessGuard;
