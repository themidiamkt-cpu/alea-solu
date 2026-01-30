import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Bed, Bath, Car, Ruler, ArrowLeft } from "lucide-react";
import { useState } from "react";

const ImovelDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: imovel, isLoading } = useQuery({
    queryKey: ["imovel", slug],
    queryFn: async () => {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug || "");

      let query = supabase
        .from("opportunities")
        .select("*, opportunity_images(image_url)")
        .eq("type", "IMOVEL");

      if (isUuid) {
        query = query.eq("id", slug);
      } else {
        query = query.eq("slug", slug);
      }

      const { data, error } = await query.single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Carregando...</p></div>;
  }

  if (!imovel) {
    return <div className="min-h-screen flex items-center justify-center"><p>Imóvel não encontrado</p></div>;
  }

  const images = imovel.opportunity_images || [];

  return (
    <div className="min-h-screen">
      <Navbar />
      <section className="section-spacing mt-20">
        <div className="container-custom">
          <Link to="/imobiliaria" className="inline-flex items-center text-primary mb-6">
            <ArrowLeft size={20} className="mr-2" />Voltar
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              {images.length > 0 && (
                <>
                  <div className="card-premium overflow-hidden aspect-[4/3] mb-4">
                    <img src={images[currentImageIndex]?.image_url} alt={imovel.title} className="w-full h-full object-cover" />
                  </div>
                  {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {images.map((img: any, idx: number) => (
                        <button key={idx} onClick={() => setCurrentImageIndex(idx)} className={`card-premium overflow-hidden aspect-square ${currentImageIndex === idx ? "ring-2 ring-accent" : ""}`}>
                          <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
            <div>
              <h1 className="text-4xl font-serif font-bold text-primary mb-4">{imovel.title}</h1>
              <div className="flex items-center text-muted-foreground mb-6">
                <MapPin size={18} className="mr-2" />
                {imovel.neighborhood || imovel.city} - {imovel.state}
              </div>
              <div className="card-premium p-6 mb-6">
                <p className="text-4xl font-bold text-accent">R$ {Number(imovel.price).toLocaleString("pt-BR")}</p>
              </div>
              <div className="grid grid-cols-4 gap-4 mb-6">
                {imovel.bedrooms && (
                  <div className="card-premium p-4 text-center">
                    <Bed className="mx-auto mb-2 text-primary" />
                    <p className="font-semibold">{imovel.bedrooms}</p>
                    <p className="text-xs text-muted-foreground">Quartos</p>
                  </div>
                )}
                {imovel.bathrooms && (
                  <div className="card-premium p-4 text-center">
                    <Bath className="mx-auto mb-2 text-primary" />
                    <p className="font-semibold">{imovel.bathrooms}</p>
                    <p className="text-xs text-muted-foreground">Banheiros</p>
                  </div>
                )}
                {imovel.garage && (
                  <div className="card-premium p-4 text-center">
                    <Car className="mx-auto mb-2 text-primary" />
                    <p className="font-semibold">{imovel.garage}</p>
                    <p className="text-xs text-muted-foreground">Vagas</p>
                  </div>
                )}
                {imovel.area && (
                  <div className="card-premium p-4 text-center">
                    <Ruler className="mx-auto mb-2 text-primary" />
                    <p className="font-semibold">{imovel.area}m²</p>
                    <p className="text-xs text-muted-foreground">Área</p>
                  </div>
                )}
              </div>
              <div className="mb-6">
                <h2 className="text-2xl font-serif font-semibold mb-4">Descrição</h2>
                <p className="text-foreground leading-relaxed">{imovel.description}</p>
              </div>
              <a
                href={`https://wa.me/5519992153727?text=${encodeURIComponent(`Olá, gostaria de saber mais sobre o imóvel: ${imovel.title}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full block"
              >
                <Button variant="accent" size="lg" className="w-full">Agendar Visita</Button>
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ImovelDetail;