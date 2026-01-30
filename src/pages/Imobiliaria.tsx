import { useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, Filter, Bed, Bath, Car, Ruler } from "lucide-react";

const Imobiliaria = () => {
  const [filters, setFilters] = useState({
    search: "",
    city: "",
    neighborhood: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    bathrooms: "",
    garage: "",
    minArea: "",
  });

  const { data: imoveis, isLoading } = useQuery({
    queryKey: ["imoveis", filters],
    queryFn: async () => {
      let query = supabase
        .from("opportunities")
        .select("*, opportunity_images(image_url)")
        .eq("type", "IMOVEL")
        .order("created_at", { ascending: false });

      if (filters.search) {
        query = query.ilike("title", `%${filters.search}%`);
      }
      if (filters.city) {
        query = query.eq("city", filters.city);
      }
      if (filters.neighborhood) {
        query = query.ilike("neighborhood", `%${filters.neighborhood}%`);
      }
      if (filters.minPrice) {
        query = query.gte("price", parseFloat(filters.minPrice));
      }
      if (filters.maxPrice) {
        query = query.lte("price", parseFloat(filters.maxPrice));
      }
      if (filters.bedrooms) {
        query = query.gte("bedrooms", parseInt(filters.bedrooms));
      }
      if (filters.bathrooms) {
        query = query.gte("bathrooms", parseInt(filters.bathrooms));
      }
      if (filters.garage) {
        query = query.gte("garage", parseInt(filters.garage));
      }
      if (filters.minArea) {
        query = query.gte("area", parseFloat(filters.minArea));
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
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden mt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80')",
          }}
        >
          <div className="absolute inset-0 hero-overlay"></div>
        </div>
        <div className="relative z-10 text-center text-white animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">Imobiliária</h1>
          <p className="text-xl text-white/90">Encontre o imóvel ideal para você</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
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
                placeholder="Bairro"
                value={filters.neighborhood}
                onChange={(e) => handleFilterChange("neighborhood", e.target.value)}
              />
              <Input
                type="number"
                placeholder="Área mínima (m²)"
                value={filters.minArea}
                onChange={(e) => handleFilterChange("minArea", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <Input
                type="number"
                placeholder="Quartos mín."
                value={filters.bedrooms}
                onChange={(e) => handleFilterChange("bedrooms", e.target.value)}
              />
              <Input
                type="number"
                placeholder="Banheiros mín."
                value={filters.bathrooms}
                onChange={(e) => handleFilterChange("bathrooms", e.target.value)}
              />
              <Input
                type="number"
                placeholder="Vagas mín."
                value={filters.garage}
                onChange={(e) => handleFilterChange("garage", e.target.value)}
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
              <p className="text-muted-foreground">Carregando imóveis...</p>
            </div>
          ) : imoveis && imoveis.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
              {imoveis.map((imovel: any, index: number) => (
                <Link
                  key={imovel.id}
                  to={`/imobiliaria/${imovel.slug}`}
                  className="card-premium overflow-hidden group animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={
                        imovel.opportunity_images?.[0]?.image_url ||
                        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80"
                      }
                      alt={imovel.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    {imovel.highlight && (
                      <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full mb-2">
                        Destaque
                      </span>
                    )}
                    <h3 className="text-xl font-serif font-semibold mb-2 text-primary">
                      {imovel.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {imovel.neighborhood || imovel.city} - {imovel.state}
                    </p>

                    {/* Property Features */}
                    <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
                      {imovel.bedrooms && (
                        <div className="flex items-center gap-1">
                          <Bed size={16} />
                          <span>{imovel.bedrooms}</span>
                        </div>
                      )}
                      {imovel.bathrooms && (
                        <div className="flex items-center gap-1">
                          <Bath size={16} />
                          <span>{imovel.bathrooms}</span>
                        </div>
                      )}
                      {imovel.garage && (
                        <div className="flex items-center gap-1">
                          <Car size={16} />
                          <span>{imovel.garage}</span>
                        </div>
                      )}
                      {imovel.area && (
                        <div className="flex items-center gap-1">
                          <Ruler size={16} />
                          <span>{imovel.area}m²</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-accent">
                        R$ {Number(imovel.price).toLocaleString("pt-BR")}
                      </span>
                      <ArrowRight className="text-primary group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 card-premium">
              <p className="text-muted-foreground">
                Nenhum imóvel encontrado com os filtros selecionados.
              </p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Imobiliaria;