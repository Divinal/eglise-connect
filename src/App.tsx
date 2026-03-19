import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import DepartementPage from "./pages/DepartementPage";
import ConsistoiresPage from "./pages/ConsistoiresPage";
import ConsistoireDetailPage from "./pages/ConsistoireDetailPage";
import SynodePage from "./pages/SynodePage";
import ConseilSynodalPage from "./pages/ConseilSynodalPage";
import ContactPage from "./pages/ContactPage";
import BlogPage from "./pages/BlogPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/departements/:slug" element={<DepartementPage />} />
          <Route path="/institution/synode" element={<SynodePage />} />
          <Route path="/institution/conseil-synodal" element={<ConseilSynodalPage />} />
          <Route path="/institution/bureau-synodal" element={<SynodePage />} />
          <Route path="/institution/consistoires" element={<ConsistoiresPage />} />
          <Route path="/institution/consistoires/:id" element={<ConsistoireDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
