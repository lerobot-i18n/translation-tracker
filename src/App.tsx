import "@/i18n";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import FileDetail from "./pages/FileDetail";
import Contributors from "./pages/Contributors";
import Glossary from "./pages/Glossary";
import Guide from "./pages/Guide";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/file/:filename" element={<FileDetail />} />
            <Route path="/contributors" element={<Contributors />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/guide" element={<Guide />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
      <Analytics />
      <SpeedInsights />
    </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
