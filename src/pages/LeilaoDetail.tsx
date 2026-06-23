import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { RichTextContent } from "@/components/RichTextContent";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MapPin, Calendar, FileText, ArrowLeft, ArrowDown } from "lucide-react";
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
        .eq("type", "LEILAO")
        .order("created_at", { referencedTable: "opportunity_images", ascending: true });

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
              {leilao.clickbait && (
                <span className="inline-block px-4 py-1.5 bg-red-600 text-white text-xs font-black uppercase rounded-lg animate-pulse mb-4 shadow-lg">
                  {leilao.clickbait}
                </span>
              )}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-primary mb-4 leading-tight">
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

              <div className="card-premium p-8 mb-6 bg-gray-50 border-2 border-primary/5">
                <div className="space-y-4">
                  {leilao.valuation_value && (
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span className="text-base font-medium">Avaliação de Mercado</span>
                      <span className="text-xl font-bold line-through opacity-60 italic">
                        R$ {Number(leilao.valuation_value).toLocaleString("pt-BR")}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-2 border-t border-primary/10">
                    <div className="flex flex-col">
                      <p className="text-sm text-accent-gold font-black uppercase tracking-wider mb-1">Valor 2ª Praça (Inicial)</p>
                      <p className="text-5xl font-black text-green-600 tracking-tight">
                        R$ {Number(leilao.price || leilao.second_floor_value).toLocaleString("pt-BR")}
                      </p>
                    </div>
                    {leilao.discount_percentage && (
                      <div className="bg-green-600 text-white px-4 py-2 rounded-2xl flex items-center gap-2 transform rotate-2 shadow-xl">
                        <ArrowDown size={24} strokeWidth={3} />
                        <div className="flex flex-col leading-none">
                          <span className="text-[10px] uppercase font-bold">Economia de</span>
                          <span className="text-2xl font-black">{leilao.discount_percentage}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-serif font-semibold text-primary mb-4">Descrição</h2>
                <RichTextContent content={leilao.description} />
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
