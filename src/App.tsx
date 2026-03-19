import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DepartementPage from "./pages/DepartementPage";
import ConsistoiresPage from "./pages/ConsistoiresPage";
import ConsistoireDetailPage from "./pages/ConsistoireDetailPage";
import SynodePage from "./pages/SynodePage";
import ConseilSynodalPage from "./pages/ConseilSynodalPage";
import BureauSynodalPage from "./pages/BureauSynodalPage";
import ContactPage from "./pages/ContactPage";
import BlogPage from "./pages/BlogPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsersPage from "./pages/AdminUsersPage";
import AdminInstitutionsPage from "./pages/AdminInstitutionsPage";
import AdminDepartmentsPage from "./pages/AdminDepartmentsPage";
import PartenairesPage from "./pages/PartenairesPage";
import FAQPage from "./pages/FAQPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/departements/:slug" element={<DepartementPage />} />
            <Route path="/institution/synode" element={<SynodePage />} />
            <Route path="/institution/conseil-synodal" element={<ConseilSynodalPage />} />
            <Route path="/institution/bureau-synodal" element={<BureauSynodalPage />} />
            <Route path="/institution/consistoires" element={<ConsistoiresPage />} />
            <Route path="/institution/consistoires/:id" element={<ConsistoireDetailPage />} />
            <Route path="/partenaires" element={<PartenairesPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/institutions" element={<AdminInstitutionsPage />} />
            <Route path="/admin/departments" element={<AdminDepartmentsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
