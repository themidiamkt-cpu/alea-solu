import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Filter } from "lucide-react";

const Leiloes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    city: searchParams.get("city") || "",
    state: searchParams.get("state") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
  });

  const { data: leiloes, isLoading } = useQuery({
    queryKey: ["leiloes", filters],
    queryFn: async () => {
      let query = supabase
        .from("opportunities")
        .select("*, opportunity_images(image_url)")
        .eq("type", "LEILAO")
        .order("created_at", { ascending: false });

      if (filters.search) {
        query = query.ilike("title", `%${filters.search}%`);
      }
      if (filters.city) {
        query = query.eq("city", filters.city);
      }
      if (filters.state) {
        query = query.eq("state", filters.state);
      }
      if (filters.minPrice) {
        query = query.gte("price", parseFloat(filters.minPrice));
      }
      if (filters.maxPrice) {
        query = query.lte("price", parseFloat(filters.maxPrice));
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[56vh] md:h-[64vh] flex items-center justify-center overflow-hidden mt-20">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&q=80"
            alt="Cidade"
            className="w-full h-full object-cover grayscale brightness-125 contrast-90"
          />
          <div className="absolute inset-0 bg-white/55" />
        </div>

        <div className="relative z-10 w-[min(92vw,950px)] px-4 animate-fade-in">
          <h1 className="sr-only">Leilões</h1>
          <div className="relative bg-[#2f6f85] rounded-[24px] md:rounded-[30px] shadow-2xl overflow-hidden min-h-[160px] md:min-h-[220px] flex items-center justify-center">
            <img
              src="/logo.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover opacity-30"
            />
            <div className="relative px-6 md:px-10 py-8 md:py-10 flex items-end justify-center gap-3 md:gap-5 text-white">
              <span className="text-[44px] md:text-[110px] leading-none font-light tracking-[0.08em]">
                ALEA
              </span>
              <span className="text-[30px] md:text-[64px] leading-none font-light tracking-[0.2em]">
                Leilões
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="section-spacing bg-background">
        <div className="container-custom">
          <div className="card-premium p-6 mb-8 animate-fade-in">
            <div className="flex items-center gap-2 mb-4">
              <Filter size={20} className="text-primary" />
              <h2 className="text-xl font-serif font-semibold text-primary">Filtros</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Input
                placeholder="Buscar por título..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
              <Input
                placeholder="Cidade"
                value={filters.city}
                onChange={(e) => handleFilterChange("city", e.target.value)}
              />
              <Input
                placeholder="Estado"
                value={filters.state}
                onChange={(e) => handleFilterChange("state", e.target.value)}
              />
              <Input
                type="number"
                placeholder="Preço mínimo"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              />
              <Input
                type="number"
                placeholder="Preço máximo"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              />
            </div>
          </div>

          {/* Results */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Carregando leilões...</p>
            </div>
          ) : leiloes && leiloes.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {leiloes.map((leilao: any, index: number) => (
                <Link
                  key={leilao.id}
                  to={`/leiloes/${leilao.slug}`}
                  className="card-premium overflow-hidden group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={
                        leilao.opportunity_images?.[0]?.image_url ||
                        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80"
                      }
                      alt={leilao.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    {leilao.highlight && (
                      <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full mb-2">
                        Destaque
                      </span>
                    )}
                    <h3 className="text-xl font-serif font-semibold mb-2 text-primary">
                      {leilao.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {leilao.city} - {leilao.state}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs text-muted-foreground block">Valor inicial</span>
                        <span className="text-2xl font-bold text-accent">
                          R$ {Number(leilao.price).toLocaleString("pt-BR")}
                        </span>
                      </div>
                      <ArrowRight className="text-primary group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 card-premium">
              <p className="text-muted-foreground">
                Nenhum leilão encontrado com os filtros selecionados.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Leiloes;
