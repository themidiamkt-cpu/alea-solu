import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Gavel, Building2, ClipboardCheck, Scale, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useSiteContent } from "@/hooks/useSiteContent";

const Servicos = () => {
  const { data: hero } = useSiteContent("services_hero");
  const { data: cta } = useSiteContent("services_cta");
  const { data: s1 } = useSiteContent("service_1");
  const { data: s2 } = useSiteContent("service_2");
  const { data: s3 } = useSiteContent("service_3");
  const { data: s4 } = useSiteContent("service_4");

  const defaultServices = [
    {
      icon: Gavel,
      title: "Leilões Judiciais",
      description: "Leilões determinados por decisões judiciais em processos de execução. Atuamos com total segurança jurídica e transparência.",
      features: ["Acompanhamento processual completo", "Análise jurídica detalhada", "Documentação regular", "Garantia de idoneidade"],
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80",
    },
    {
      icon: Building2,
      title: "Leilões Extrajudiciais",
      description: "Processos de alienação fiduciária com total respaldo legal. Especialistas em execuções extrajudiciais de bens imóveis.",
      features: ["Processo ágil e transparente", "Cumprimento da legislação vigente", "Suporte técnico especializado", "Documentação completa"],
      image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80",
    },
    {
      icon: ClipboardCheck,
      title: "Avaliação de Imóveis",
      description: "Laudos técnicos profissionais realizados por engenheiros e arquitetos credenciados. Avaliações precisas e fundamentadas.",
      features: ["Profissionais certificados", "Laudos técnicos detalhados", "Vistoria presencial", "Relatório fotográfico completo"],
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80",
    },
    {
      icon: Scale,
      title: "Consultoria Jurídica",
      description: "Orientação legal especializada em direito imobiliário e processos de leilão. Equipe jurídica experiente ao seu dispor.",
      features: ["Análise jurídica completa", "Consultoria personalizada", "Suporte em todas as etapas", "Segurança nas transações"],
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80",
    }
  ];

  const getServiceData = (data: any, defaultIndex: number) => {
    const def = defaultServices[defaultIndex];
    if (!data) return def;
    return {
      icon: def.icon,
      title: data.title || def.title,
      description: data.text || def.description,
      image: data.image_url || def.image,
      features: Array.isArray(data.features)
        ? data.features
        : (typeof data.features === 'string' ? data.features.split('\n') : def.features)
    };
  };

  const services = [
    getServiceData(s1, 0),
    getServiceData(s2, 1),
    getServiceData(s3, 2),
    getServiceData(s4, 3),
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden mt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${hero?.image_url || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80"}')`,
          }}
        >
          <div className="absolute inset-0 hero-overlay"></div>
        </div>
        <div className="relative z-10 text-center text-white animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">{hero?.title || "Nossos Serviços"}</h1>
          <p className="text-xl text-white/90">{hero?.subtitle || "Soluções completas para suas necessidades"}</p>
        </div>
      </section>

      {/* Services Section */}
      <section className="section-spacing bg-background">
        <div className="container-custom">
          <div className="space-y-16">
            {services.map((service, index) => (
              <div
                key={index}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-fade-in-up ${index % 2 === 1 ? "lg:grid-flow-dense" : ""
                  }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={index % 2 === 1 ? "lg:col-start-2" : ""}>
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-6 shadow-elegant">
                    <service.icon size={32} className="text-white" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">
                    {service.title}
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6">{service.description}</p>

                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <CheckCircle2 className="text-accent flex-shrink-0 mt-1" size={20} />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/contato">
                    <Button variant="accent" size="lg">
                      Solicitar Orçamento
                    </Button>
                  </Link>
                </div>

                <div className={index % 2 === 1 ? "lg:col-start-1 lg:row-start-1" : ""}>
                  <div className="card-premium overflow-hidden aspect-[4/3]">
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing bg-gradient-primary text-white">
        <div className="container-custom text-center animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            {cta?.title || "Precisa de Mais Informações?"}
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            {cta?.text || "Nossa equipe está pronta para esclarecer todas as suas dúvidas e oferecer a melhor solução para suas necessidades."}
          </p>
          <Link to={cta?.content?.button_url || "/contato"}>
            <Button variant="hero" size="xl">
              {cta?.content?.button_text || "Entre em Contato"}
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Servicos;