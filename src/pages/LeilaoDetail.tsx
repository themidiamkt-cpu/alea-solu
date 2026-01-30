import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Calendar, FileText, ArrowLeft } from "lucide-react";
import { useState } from "react";

const LeilaoDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: leilao, isLoading } = useQuery({
    queryKey: ["leilao", slug],
    queryFn: async () => {
      const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug || "");

      let query = supabase
        .from("opportunities")
        .select("*, opportunity_images(image_url)")
        .eq("type", "LEILAO");

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
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Carregando...</p>
      </div>
    );
  }

  if (!leilao) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif font-bold mb-4">Leilão não encontrado</h2>
          <Link to="/leiloes">
            <Button>Voltar para Leilões</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = leilao.opportunity_images || [];
  const hasImages = images.length > 0;

  return (
    <div className="min-h-screen">
      <Navbar />

      <section className="section-spacing mt-20 bg-background">
        <div className="container-custom">
          <Link
            to="/leiloes"
            className="inline-flex items-center text-primary hover:text-secondary mb-6 transition-colors"
          >
            <ArrowLeft size={20} className="mr-2" />
            Voltar para Leilões
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Gallery */}
            <div className="animate-fade-in">
              {hasImages ? (
                <>
                  <div className="card-premium overflow-hidden aspect-[4/3] mb-4">
                    <img
                      src={images[currentImageIndex]?.image_url}
                      alt={leilao.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {images.map((img: any, index: number) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`card-premium overflow-hidden aspect-square ${currentImageIndex === index ? "ring-2 ring-accent" : ""
                            }`}
                        >
                          <img
                            src={img.image_url}
                            alt={`${leilao.title} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="card-premium overflow-hidden aspect-[4/3] flex items-center justify-center bg-muted">
                  <p className="text-muted-foreground">Sem imagens disponíveis</p>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="animate-fade-in-up">
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">
                {leilao.title}
              </h1>

              <div className="flex items-center text-muted-foreground mb-6 space-x-4">
                <div className="flex items-center">
                  <MapPin size={18} className="mr-2" />
                  {leilao.city} - {leilao.state}
                </div>
                {leilao.auction_date && (
                  <div className="flex items-center">
                    <Calendar size={18} className="mr-2" />
                    {new Date(leilao.auction_date).toLocaleDateString("pt-BR")}
                  </div>
                )}
              </div>

              <div className="card-premium p-6 mb-6">
                <p className="text-sm text-muted-foreground mb-2">Valor Inicial</p>
                <p className="text-4xl font-bold text-accent">
                  R$ {Number(leilao.price).toLocaleString("pt-BR")}
                </p>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-serif font-semibold text-primary mb-4">Descrição</h2>
                <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                  {leilao.description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={`https://wa.me/5519992153727?text=${encodeURIComponent(`Olá, gostaria de saber mais sobre o leilão: ${leilao.title}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full"
                >
                  <Button variant="default" size="lg" className="w-full">
                    Fale com um Especialista
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LeilaoDetail;