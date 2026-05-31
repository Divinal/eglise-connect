import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages publiques
import Index from "./pages/Index";
import DepartementPage from "./pages/DepartementPage";
import PartenairesPage from "./pages/PartenairesPage";
import PartenairePage from "./pages/PartenairePage";
import FAQPage from "./pages/FAQPage";
import BureauSynodalPage from "./pages/BureauSynodalPage";
import ContactPage from "./pages/ContactPage";
import BlogPage from "./pages/BlogPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import PolyticPage from './pages/PolyticPage';

// Institutions publiques
import SynodePage from "./pages/institutions/SynodePage";
import ConseilSynodalPage from "./pages/institutions/ConseilSynodalPage";
import ConsistoiresPage from "./pages/institutions/ConsistoiresPage";
import ConsistoireDetailPage from "./pages/institutions/ConsistoireDetailPage";
import ParoisseDetailPage from "./pages/institutions/ParoisseDetailPage";

// Nouvelles pages institutions
import UPBPage from "./pages/institutions/UPBPage";
import IFPNPage from "./pages/institutions/IFPNPage";
import SUECOPage from "./pages/institutions/SUECOPage";
import PastoralePage from "./pages/institutions/PastoralePage";

// Pages Consistoires & Diaspora
import DiasporaPage from "./pages/institutions/DiasporaPage";
import DiasporaDetailPage from "./pages/institutions/DiasporaDetailPage";
import ChampsMissionPage from "./pages/institutions/ChampsMissionPage";
import ChampsMissionDetailPage from "./pages/institutions/ChampsMissionDetailPage";
import ChampsEvangelisationPage from "./pages/institutions/ChampsEvangelisationPage";
import ChampsEvangelisationDetailPage from "./pages/institutions/ChampsEvangelisationDetailPage";

// Pages admin
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminConsistoiresPage from "./pages/AdminConsistoiresPage";
import AdminInstitutionsPage from "./pages/AdminInstitutionsPage";
import AdminDepartmentsPage from "./pages/AdminDepartmentsPage";
import AdminSynodePage from "./pages/AdminSynodePage";
import AdminDepartementPage from "./pages/AdminDepartementPage";

// Nouvelles pages admin Diaspora & Champs
import AdminDiasporaPage from "./pages/AdminDiasporaPage";
import AdminChampsMissionPage from "./pages/AdminChampsMissionPage";
import AdminChampsEvangelisationPage from "./pages/AdminChampsEvangelisationPage";
import DiasporaBureauPage from "./pages/DiasporaBureauPage";
import ChampsMissionBureauPage from "./pages/ChampsMissionBureauPage";
import ChampsEvangelisationBureauPage from "./pages/ChampsEvangelisationBureauPage";

// Pages coordinateur consistoire
import ConsistoireParoissesPage from "./pages/ConsistoireParoissesPage";
import ConsistoireBureauPage from "./pages/ConsistoireBureauPage";
import ConsistoireParoisseInfoPage from "./pages/ConsistoireParoisseInfoPage";

// Page paroisse (secrétaire)
import ParoissePage from "./pages/ParoissePage";

import ProgrammeCultePage from "./pages/ProgrammeCultePage";
import ThemesEdificationPage from "./pages/ThemesEdificationPage";
import TypesGroupePage from "./pages/TypesGroupePage";
import AdminInstitutionPage from "./pages/AdminInstitutionPage";
import AdminContenuPage from "./pages/AdminContenuPage";
import AdminBoutiquePage from "./pages/AdminBoutiquePage";
import FaireUnDonPage from "./pages/FaireUnDonPage";
import BoutiquePage from "./pages/BoutiquePage";
import EgliseDeProximitePage from "./pages/EgliseDeProximitePage";
import MicroDeLaSemainePage from "./pages/MicroDeLaSemainePage";
import AccessGuard from "./components/AccessGuard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AccessGuard>
        <Routes>
          {/* PUBLIQUES */}
          <Route path="/" element={<Index />} />
          <Route path="/departements/:slug" element={<DepartementPage />} />
          <Route path="/partenaires/:slug" element={<PartenairePage />} />
          <Route path="/partenaires" element={<PartenairesPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/politique-confidentialite" element={<PolyticPage />} />
          <Route path="/programme-culte" element={<ProgrammeCultePage />} />
          <Route path="/themes-edification" element={<ThemesEdificationPage />} />
          <Route path="/types-de-groupe" element={<TypesGroupePage />} />
          <Route path="/eglise-de-proximite" element={<EgliseDeProximitePage />} />
          <Route path="/micro-de-la-semaine" element={<MicroDeLaSemainePage />} />
          <Route path="/faire-un-don" element={<FaireUnDonPage />} />
          <Route path="/boutique" element={<BoutiquePage />} />

          {/* INSTITUTIONS PUBLIQUES */}
          <Route path="/institution/synode" element={<SynodePage />} />
          <Route path="/institution/conseil-synodal" element={<ConseilSynodalPage />} />
          <Route path="/institution/bureau-synodal" element={<BureauSynodalPage />} />
          <Route path="/institution/upb" element={<UPBPage />} />
          <Route path="/institution/ifpn" element={<IFPNPage />} />
          <Route path="/institution/sueco" element={<SUECOPage />} />
          <Route path="/institution/pastorale" element={<PastoralePage />} />
          <Route path="/institution/consistoires" element={<ConsistoiresPage />} />
          <Route path="/institution/consistoires/:id" element={<ConsistoireDetailPage />} />
          <Route path="/paroisses/:id" element={<ParoisseDetailPage />} />

          {/* DIASPORA & CHAMPS */}
          <Route path="/institution/diaspora" element={<DiasporaPage />} />
          <Route path="/institution/diaspora/:id" element={<DiasporaDetailPage />} />
          <Route path="/institution/champs-de-mission" element={<ChampsMissionPage />} />
          <Route path="/institution/champs-de-mission/:id" element={<ChampsMissionDetailPage />} />
          <Route path="/institution/champs-evangelisation" element={<ChampsEvangelisationPage />} />
          <Route path="/institution/champs-evangelisation/:id" element={<ChampsEvangelisationDetailPage />} />

          {/* ADMIN GÉNÉRAL */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/consistoires" element={<AdminConsistoiresPage />} />
          <Route path="/admin/institutions" element={<AdminInstitutionsPage />} />
          <Route path="/admin/departments" element={<AdminDepartmentsPage />} />

          {/* ADMIN DIASPORA & CHAMPS */}
          <Route path="/admin/diaspora" element={<AdminDiasporaPage />} />
          <Route path="/admin/diaspora/:id/bureau" element={<DiasporaBureauPage />} />
          <Route path="/admin/diaspora/:id/conseil" element={<DiasporaBureauPage />} />
          <Route path="/admin/diaspora/:id/annonces" element={<DiasporaBureauPage />} />
          <Route path="/admin/champs-mission" element={<AdminChampsMissionPage />} />
          <Route path="/admin/champs-mission/:id/bureau" element={<ChampsMissionBureauPage />} />
          <Route path="/admin/champs-mission/:id/annonces" element={<ChampsMissionBureauPage />} />
          <Route path="/admin/champs-evangelisation" element={<AdminChampsEvangelisationPage />} />
          <Route path="/admin/champs-evangelisation/:id/bureau" element={<ChampsEvangelisationBureauPage />} />
          <Route path="/admin/champs-evangelisation/:id/annonces" element={<ChampsEvangelisationBureauPage />} />

          {/* ADMIN SYNODE */}
          <Route path="/admin/synode/bureau" element={<AdminSynodePage />} />
          <Route path="/admin/synode/commissions" element={<AdminSynodePage />} />
          <Route path="/admin/synode/organes" element={<AdminSynodePage />} />
          <Route path="/admin/synode/conseil" element={<AdminSynodePage />} />
          <Route path="/admin/synode/annonces" element={<AdminSynodePage />} />
          <Route path="/admin/institution/:type" element={<AdminInstitutionPage />} />
          <Route path="/admin/contenu/:type" element={<AdminContenuPage />} />
          <Route path="/admin/boutique" element={<AdminBoutiquePage />} />

          {/* ADMIN DÉPARTEMENT */}
          <Route path="/admin/departement/:id/bureau" element={<AdminDepartementPage />} />
          <Route path="/admin/departement/:id/annonces" element={<AdminDepartementPage />} />
          <Route path="/admin/departement/:id/infos" element={<AdminDepartementPage />} />

          {/* COORDINATEUR CONSISTOIRE */}
          <Route path="/admin/consistoire/:consistoireId/paroisse/:paroisseId" element={<ConsistoireParoisseInfoPage />} />
          <Route path="/admin/consistoire/:id/paroisses" element={<ConsistoireParoissesPage />} />
          <Route path="/admin/consistoire/:id/bureau" element={<ConsistoireBureauPage />} />
          <Route path="/admin/consistoire/:id/commissions" element={<ConsistoireBureauPage />} />
          <Route path="/admin/consistoire/:id/organes" element={<ConsistoireBureauPage />} />
          <Route path="/admin/consistoire/:id/conseil" element={<ConsistoireBureauPage />} />
          <Route path="/admin/consistoire/:id/secretaires" element={<ConsistoireBureauPage />} />

          {/* SECRÉTAIRE PAROISSIAL */}
          <Route path="/admin/paroisse/:id/bureau" element={<ParoissePage />} />
          <Route path="/admin/paroisse/:id/organes" element={<ParoissePage />} />
          <Route path="/admin/paroisse/:id/conseil" element={<ParoissePage />} />
          <Route path="/admin/paroisse/:id/groupes" element={<ParoissePage />} />
          <Route path="/admin/paroisse/:id/annexes" element={<ParoissePage />} />
          <Route path="/admin/paroisse/:id/infos" element={<ParoissePage />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </AccessGuard>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
