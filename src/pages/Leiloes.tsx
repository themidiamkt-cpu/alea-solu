import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Filter, MapPin, ArrowDown, Calendar } from "lucide-react";

const Leiloes = () => {
  const [searchParams] = useSearchParams();
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
        .order("created_at", { ascending: false })
        .order("created_at", { referencedTable: "opportunity_images", ascending: true });

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
      <section className="mt-20 bg-[#f6f6f7] py-6 md:py-8">
        <div className="container mx-auto px-4">
          <h1 className="sr-only">Leilões</h1>
          <div className="w-full max-w-6xl mx-auto h-[170px] sm:h-[210px] md:h-[250px] lg:h-[280px] overflow-hidden rounded-2xl shadow-xl">
            <img
              src="/logo/banner-leiloes.png"
              alt="Banner Leilões"
              className="w-full h-full object-cover object-center"
            />
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
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-col gap-1">
                        {leilao.highlight && (
                          <span className="inline-block px-3 py-1 bg-accent-gold/10 text-accent-gold text-[10px] font-bold uppercase rounded-full">
                            Destaque
                          </span>
                        )}
                        {leilao.clickbait && (
                          <span className="inline-block px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase rounded-full animate-pulse">
                            {leilao.clickbait}
                          </span>
                        )}
                      </div>
                    </div>
                    <h3 className="text-2xl font-black mb-2 text-primary leading-tight group-hover:text-accent-gold transition-colors">
                      {leilao.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 flex items-center gap-1">
                      <MapPin size={14} className="text-accent-gold" />
                      {leilao.city} - {leilao.state}
                    </p>

                    <div className="space-y-2 bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4">
                      {leilao.valuation_value && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-500">Avaliação:</span>
                          <span className="text-gray-700 line-through">R$ {Number(leilao.valuation_value).toLocaleString("pt-BR")}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-end">
                        <div className="flex flex-col">
                          <span className="text-xs text-accent-gold font-bold uppercase">2ª Praça</span>
                          <span className="text-3xl font-black text-green-600 leading-none">
                            R$ {Number(leilao.price || leilao.second_floor_value).toLocaleString("pt-BR")}
                          </span>
                        </div>
                        {leilao.discount_percentage && (
                          <div className="bg-green-100 text-green-700 text-sm font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
                            <ArrowDown size={14} />
                            {leilao.discount_percentage}%
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Calendar size={14} />
                        {leilao.auction_date ? new Date(leilao.auction_date).toLocaleDateString("pt-BR") : "Data a definir"}
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
