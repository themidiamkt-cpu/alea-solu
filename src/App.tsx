import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Leiloes from "./pages/Leiloes";
import LeilaoDetail from "./pages/LeilaoDetail";
import Imobiliaria from "./pages/Imobiliaria";
import ImovelDetail from "./pages/ImovelDetail";
import Servicos from "./pages/Servicos";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contato from "./pages/Contato";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/Login";
import { AdminAuthGuard } from "./components/admin/AdminAuthGuard";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminLeiloes from "./pages/admin/Leiloes";
import LeilaoForm from "./pages/admin/LeilaoForm";
import AdminImoveis from "./pages/admin/Imoveis";
import ImovelForm from "./pages/admin/ImovelForm";
import AdminBlog from "./pages/admin/Blog";
import BlogForm from "./pages/admin/BlogForm";
import AdminConteudos from "./pages/admin/Conteudos";
import ConteudoForm from "./pages/admin/ConteudoForm";
import PageBuilder from "./pages/admin/PageBuilder";
import AdminTeam from "./pages/admin/AdminTeam";
import TeamForm from "./pages/admin/TeamForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/leiloes" element={<Leiloes />} />
          <Route path="/leiloes/:slug" element={<LeilaoDetail />} />
          <Route path="/imobiliaria" element={<Imobiliaria />} />
          <Route path="/imobiliaria/:slug" element={<ImovelDetail />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contato" element={<Contato />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminAuthGuard />}>
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="leiloes" element={<AdminLeiloes />} />
              <Route path="leiloes/novo" element={<LeilaoForm />} />
              <Route path="leiloes/:id" element={<LeilaoForm />} />
              <Route path="imoveis" element={<AdminImoveis />} />
              <Route path="imoveis/novo" element={<ImovelForm />} />
              <Route path="imoveis/:id" element={<ImovelForm />} />
              <Route path="blog" element={<AdminBlog />} />
              <Route path="blog/novo" element={<BlogForm />} />
              <Route path="blog/:id" element={<BlogForm />} />
              <Route path="conteudos" element={<AdminConteudos />} />
              <Route path="conteudos/novo" element={<ConteudoForm />} />
              <Route path="conteudos/:id" element={<ConteudoForm />} />
              <Route path="page-builder" element={<PageBuilder />} />
              <Route path="equipe" element={<AdminTeam />} />
              <Route path="equipe/novo" element={<TeamForm />} />
              <Route path="equipe/:id" element={<TeamForm />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
