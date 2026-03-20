import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages publiques
import Index from "./pages/Index";
import DepartementPage from "./pages/DepartementPage";
import PartenairesPage from "./pages/PartenairesPage";
import FAQPage from "./pages/FAQPage";
import BureauSynodalPage from "./pages/BureauSynodalPage";
import ContactPage from "./pages/ContactPage";
import BlogPage from "./pages/BlogPage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";

// Institutions publiques
// import SynodePage from "./pages/institutions/SynodePage";
// import ConseilSynodalPage from "./pages/institutions/ConseilSynodalPage";
// import ConsistoiresPublicPage from "./pages/institutions/ConsistoiresPublicPage";
// import ConsistoireDetailPage from "./pages/institutions/ConsistoireDetailPage";

// Admin
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminConsistoiresPage from "./pages/AdminConsistoiresPage";
import AdminInstitutionsPage from "./pages/AdminInstitutionsPage";
import AdminDepartmentsPage from "./pages/AdminDepartmentsPage";

// Admin Synode (structures nationales)
import AdminSynodePage from "./pages/AdminSynodePage";

// Admin Département
import AdminDepartementPage from "./pages/AdminDepartementPage";

// Coordinateur Consistoire
import ConsistoireParoissesPage from "./pages/ConsistoireParoissesPage";
import ConsistoireBureauPage from "./pages/ConsistoireBureauPage";

// Secrétaire Paroissial
import ParoissePage from "./pages/ParoissePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* PUBLIQUES */}
          <Route path="/" element={<Index />} />
          <Route path="/departements/:slug" element={<DepartementPage />} />
          <Route path="/partenaires" element={<PartenairesPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* INSTITUTIONS PUBLIQUES */}
          {/* <Route path="/institution/synode" element={<SynodePage />} />
          <Route path="/institution/conseil-synodal" element={<ConseilSynodalPage />} /> */}
          <Route path="/institution/bureau-synodal" element={<BureauSynodalPage />} />
          {/* <Route path="/institution/consistoires" element={<ConsistoiresPublicPage />} />
          <Route path="/institution/consistoires/:id" element={<ConsistoireDetailPage />} /> */}

          {/* ADMIN GÉNÉRAL */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsersPage />} />
          <Route path="/admin/consistoires" element={<AdminConsistoiresPage />} />
          <Route path="/admin/institutions" element={<AdminInstitutionsPage />} />
          <Route path="/admin/departments" element={<AdminDepartmentsPage />} />

          {/* ADMIN SYNODE (structures nationales) */}
          <Route path="/admin/synode/bureau" element={<AdminSynodePage />} />
          <Route path="/admin/synode/commissions" element={<AdminSynodePage />} />
          <Route path="/admin/synode/organes" element={<AdminSynodePage />} />
          <Route path="/admin/synode/conseil" element={<AdminSynodePage />} />
          <Route path="/admin/synode/annonces" element={<AdminSynodePage />} />

          {/* ADMIN DÉPARTEMENT */}
          <Route path="/admin/departement/:id/bureau" element={<AdminDepartementPage />} />
          <Route path="/admin/departement/:id/annonces" element={<AdminDepartementPage />} />
          <Route path="/admin/departement/:id/infos" element={<AdminDepartementPage />} />

          {/* COORDINATEUR CONSISTOIRE */}
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
