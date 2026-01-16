import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Search,
  Home as HomeIcon,
  MapPin,
  DollarSign,
  FileSearch,
  Eye,
  Gavel,
  FileCheck,
  Key,
  Building2,
  ArrowRight,
  Mail,
  Phone,
  CheckCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useCounterAnimation } from "@/hooks/useCounterAnimation";
import { useSiteContent } from "@/hooks/useSiteContent";
import { useState, useEffect } from "react";
import { TeamList } from "@/components/TeamList";

const Home = () => {
  const navigate = useNavigate();

  const handleNavigation = (url: string) => {
    if (!url) return;
    if (url.startsWith('http') || url.startsWith('tel:') || url.startsWith('mailto:') || url.startsWith('wa.me')) {
      const finalUrl = url.startsWith('wa.me') ? `https://${url}` : url;
      window.open(finalUrl, '_blank');
    } else {
      navigate(url);
    }
  };
  const heroReveal = useScrollReveal();
  const processReveal = useScrollReveal();
  const aboutReveal = useScrollReveal();
  const propertiesReveal = useScrollReveal();
  const blogReveal = useScrollReveal();
  const newsletterReveal = useScrollReveal();

  // Fetch dynamic content
  const { data: cities } = useQuery({
    queryKey: ['unique-cities'],
    queryFn: async () => {
      const { data } = await supabase
        .from('opportunities')
        .select('city')
        .not('city', 'is', null)
        .order('city');

      if (!data) return [];
      // Filter unique cities
      return [...new Set(data.map(item => item.city))];
    }
  });

  const [selectedCity, setSelectedCity] = useState("Todas as cidades");
  const [selectedType, setSelectedType] = useState("Todos os tipos");
  const [selectedPrice, setSelectedPrice] = useState("Qualquer valor"); // Placeholder for now
  const [selectedCategory, setSelectedCategory] = useState("Leilão");


  const { data: heroContent } = useSiteContent("home_hero");
  const { data: aboutContent } = useSiteContent("home_about");
  const { data: stats1 } = useSiteContent("home_stats_1");
  const { data: stats2 } = useSiteContent("home_stats_2");
  const { data: stats3 } = useSiteContent("home_stats_3");
  const { data: ctaContent } = useSiteContent("home_cta");

  // Counter animations
  const stats1Value = (stats1 as any)?.number ? parseInt((stats1 as any).number) : 12;
  const stats2Value = (stats2 as any)?.number ? parseInt((stats2 as any).number) : 500;
  const stats3Value = (stats3 as any)?.number ? parseInt((stats3 as any).number) : 98;

  const yearsCount = useCounterAnimation(stats1Value, 2000, aboutReveal.isVisible);
  const propertiesCount = useCounterAnimation(stats2Value, 2500, aboutReveal.isVisible);
  const successCount = useCounterAnimation(stats3Value, 2000, aboutReveal.isVisible);

  // Fetch Leilões (auctions)
  const { data: leiloes } = useQuery({
    queryKey: ["leiloes-home"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*, opportunity_images(image_url)")
        .eq("type", "LEILAO")
        .order("created_at", { ascending: false })
        .limit(4);

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch Imóveis (real estate)
  const { data: imoveis } = useQuery({
    queryKey: ["imoveis-home"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("opportunities")
        .select("*, opportunity_images(image_url)")
        .eq("type", "IMOVEL")
        .order("created_at", { ascending: false })
        .limit(4);

      if (error) throw error;
      return data || [];
    },
  });

  // Fetch blog posts
  const { data: blogPosts } = useQuery({
    queryKey: ["blog-posts-home"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(4);

      if (error) throw error;
      return data || [];
    },
  });

  // Process steps data
  const processSteps = [
    {
      icon: <FileSearch className="w-8 h-8" />,
      title: "Identificação de Imóvel",
      description: "Encontramos os melhores imóveis em leilão com potencial de valorização e adequados ao seu perfil de investimento.",
    },
    {
      icon: <FileCheck className="w-8 h-8" />,
      title: "Análise do Edital",
      description: "Avaliação completa da documentação, condições do leilão e possíveis riscos para garantir uma arrematação segura.",
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Visita Técnica",
      description: "Inspeção presencial do imóvel para avaliar condições físicas e verificar ocupação antes da arrematação.",
    },
    {
      icon: <Gavel className="w-8 h-8" />,
      title: "Participação no Leilão",
      description: "Representamos você durante todo o processo de leilão, com estratégias para maximizar suas chances.",
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Assessoria Pós-Arrematação",
      description: "Acompanhamento jurídico completo após a arrematação, incluindo registro e resolução de pendências.",
    },
    {
      icon: <Key className="w-8 h-8" />,
      title: "Entrega das Chaves",
      description: "Garantimos a imissão na posse do imóvel, cuidando de toda a parte legal para você receber as chaves.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={(heroContent as any)?.image_url || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80"}
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary-navy/95 via-primary-navy/70 to-transparent" />
        </div>

        {/* Content */}
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {(heroContent as any)?.title || "Encontre um imóvel de leilão para você investir!"}
            </h1>
            <p className="text-xl text-gray-200 mb-10">
              {(heroContent as any)?.subtitle || "Consultoria especializada em leilões judiciais e extrajudiciais"}
            </p>

            {/* Hero Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <Button
                onClick={() => handleNavigation((heroContent as any)?.button1_url || "https://wa.me/")}
                className="bg-gradient-to-r from-accent-gold to-yellow-500 hover:from-yellow-400 hover:to-accent-gold text-primary-navy font-bold px-8 py-3 rounded-xl min-w-[150px] shadow-lg shadow-accent-gold/20 hover:shadow-accent-gold/40 transition-all transform hover:-translate-y-1"
              >
                {(heroContent as any)?.button1_text || "Falar com Especialista"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => handleNavigation((heroContent as any)?.button2_url || "/leiloes")}
                className="bg-white/10 backdrop-blur-md border border-white/30 text-white hover:bg-white hover:text-primary-navy font-semibold px-8 py-3 rounded-xl min-w-[150px] transition-all"
              >
                {(heroContent as any)?.button2_text || "Ver Oportunidades"}
              </Button>
            </div>

            {/* Search Form */}
            <div className="bg-white rounded-xl p-6 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">

                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <FileSearch className="w-4 h-4 text-accent-gold" />
                    Categoria
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent bg-gray-50"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="Leilão">Leilão</option>
                    <option value="Venda Direta">Venda Direta</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <HomeIcon className="w-4 h-4 text-accent-gold" />
                    Tipo
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent bg-gray-50"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option>Todos os tipos</option>
                    <option>Casa</option>
                    <option>Apartamento</option>
                    <option>Comercial</option>
                    <option>Terreno</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-accent-gold" />
                    Localização
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent bg-gray-50"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                  >
                    <option>Todas as cidades</option>
                    {cities?.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-600 flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-accent-gold" />
                    Valor
                  </label>
                  <select
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-accent-gold focus:border-transparent bg-gray-50"
                    value={selectedPrice}
                    onChange={(e) => setSelectedPrice(e.target.value)}
                  >
                    <option>Qualquer valor</option>
                    <option>Até R$ 200.000</option>
                    <option>R$ 200.000 - R$ 500.000</option>
                    <option>R$ 500.000 - R$ 1.000.000</option>
                    <option>Acima de R$ 1.000.000</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <Button
                    onClick={() => {
                      const params = new URLSearchParams();
                      if (selectedCity && selectedCity !== "Todas as cidades") params.append("city", selectedCity);
                      if (selectedType && selectedType !== "Todos os tipos") params.append("type", selectedType);
                      // Handle price range if needed, or pass raw string for page to parse

                      const targetRoute = selectedCategory === "Venda Direta" ? "/imobiliaria" : "/leiloes";
                      navigate(`${targetRoute}?${params.toString()}`);
                    }}
                    className="w-full bg-accent-gold hover:bg-accent-gold/90 text-primary-navy font-bold py-6 rounded-lg flex items-center justify-center gap-2"
                  >
                    <Search className="w-5 h-5" />
                    Buscar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div >
      </section >

      {/* COMO FUNCIONA SECTION */}
      < section className="py-20 bg-white" ref={processReveal.ref} >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-accent-gold font-semibold uppercase tracking-wider text-sm">Processo</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-navy mt-2">
              Saiba como funciona nossa Consultoria Jurídica em Leilão
            </h2>
          </div>

          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-700 ${processReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {processSteps.map((step, index) => (
              <div
                key={index}
                className="group bg-white border-2 border-gray-100 rounded-2xl p-8 hover:border-accent-gold hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-accent-gold/10 rounded-xl flex items-center justify-center text-accent-gold mb-6 group-hover:bg-accent-gold group-hover:text-white transition-colors">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-primary-navy mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section >

      {/* SOBRE NÓS / EXPERIÊNCIA SECTION */}
      < section className="py-20 bg-gray-50" ref={aboutReveal.ref} >
        <div className="container mx-auto px-6">
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transition-all duration-700 ${aboutReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Image Side */}
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent-gold/20 rounded-xl z-0" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-primary-navy/10 rounded-xl z-0" />
              <img
                src={(aboutContent as any)?.image_url || "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80"}
                alt="Especialista"
                className="relative z-10 rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>

            {/* Text Side */}
            <div>
              <span className="text-accent-gold font-semibold uppercase tracking-wider text-sm">Sobre Nós</span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-navy mt-2 mb-6">
                São mais de <span className="text-accent-gold">{yearsCount} anos</span> de experiência no mercado de leilões judiciais
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {(aboutContent as any)?.text || "O Grupo Alea Leilões conta com uma equipe multidisciplinar, formada por advogados especializados, corretores credenciados e analistas de mercado. Nossa missão é proporcionar segurança jurídica e as melhores oportunidades de investimento para nossos clientes."}
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Com uma abordagem transparente e ética, já ajudamos centenas de investidores a encontrar imóveis com até 50% de desconto em relação ao valor de mercado, transformando leilões em oportunidades únicas de patrimônio.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent-gold">{yearsCount}+</div>
                  <div className="text-sm text-gray-500">{(stats1 as any)?.label || "Anos de Experiência"}</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent-gold">{propertiesCount}+</div>
                  <div className="text-sm text-gray-500">{(stats2 as any)?.label || "Imóveis Arrematados"}</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-accent-gold">{successCount}%</div>
                  <div className="text-sm text-gray-500">{(stats3 as any)?.label || "Taxa de Sucesso"}</div>
                </div>
              </div>

              <Button
                onClick={() => handleNavigation((aboutContent as any)?.button_url || "/contato")}
                className="bg-accent-gold hover:bg-accent-gold/90 text-primary-navy font-bold px-8 py-6"
              >
                {(aboutContent as any)?.button_text || "Entre em Contato"}
              </Button>
            </div>
          </div>
        </div>
      </section >

      {/* LEILÕES SECTION */}
      < section className="py-20 bg-white" ref={propertiesReveal.ref} >
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-accent-gold font-semibold uppercase tracking-wider text-sm">Leilões</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-navy mt-2">
              Leilões de Imóveis Judiciais
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Oportunidades exclusivas em leilões judiciais e extrajudiciais com até 50% de desconto
            </p>
          </div>

          {/* Leilões Grid */}
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-700 ${propertiesReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {leiloes?.map((property: any) => (
              <Link
                key={property.id}
                to={`/leiloes/${property.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={property.opportunity_images?.[0]?.image_url || property.cover_url || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80"}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-accent-gold text-primary-navy text-xs font-bold px-3 py-1 rounded-full">
                      Leilão
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-primary-navy mb-2 line-clamp-1 group-hover:text-accent-gold transition-colors">
                    {property.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {property.city || "São Paulo"}, {property.state || "SP"}
                  </p>
                  {property.price && (
                    <div className="text-green-600 font-bold text-xl">
                      R$ {property.price.toLocaleString("pt-BR")}
                    </div>
                  )}
                  {property.auction_date && (
                    <div className="text-xs text-gray-400 mt-2">
                      Leilão: {new Date(property.auction_date).toLocaleDateString("pt-BR")}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* View All Leilões Button */}
          <div className="text-center mt-12">
            <Button
              onClick={() => navigate("/leiloes")}
              variant="outline"
              className="border-2 border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-primary-navy px-8 py-6 font-bold"
            >
              Ver Todos os Leilões <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section >

      {/* IMOBILIÁRIA SECTION */}
      < section className="py-20 bg-gray-50" >
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-accent-gold font-semibold uppercase tracking-wider text-sm">Imobiliária</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-navy mt-2">
              Imóveis à Venda
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Seleção de imóveis exclusivos para venda direta com a melhor condição do mercado
            </p>
          </div>

          {/* Imóveis Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {imoveis?.map((property: any) => (
              <Link
                key={property.id}
                to={`/imobiliaria/${property.id}`}
                className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={property.opportunity_images?.[0]?.image_url || property.cover_url || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80"}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      Imóvel
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-bold text-primary-navy mb-2 line-clamp-1 group-hover:text-accent-gold transition-colors">
                    {property.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-3 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {property.city || "São Paulo"}, {property.state || "SP"}
                  </p>
                  {property.price && (
                    <div className="text-green-600 font-bold text-xl">
                      R$ {property.price.toLocaleString("pt-BR")}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* View All Imóveis Button */}
          <div className="text-center mt-12">
            <Button
              onClick={() => navigate("/imobiliaria")}
              variant="outline"
              className="border-2 border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-primary-navy px-8 py-6 font-bold"
            >
              Ver Todos os Imóveis <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section >

      {/* ESPECIALISTAS / EQUIPE SECTION */}
      < section className="py-20 bg-white" >
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-accent-gold font-semibold uppercase tracking-wider text-sm">Nossa Equipe</span>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-navy mt-2">
              Conheça Nossos Especialistas
            </h2>
            <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
              Profissionais experientes prontos para ajudá-lo em todas as etapas
            </p>
          </div>
          <TeamList />
        </div>
      </section >

      {/* BLOG / SAIBA MAIS SECTION */}
      < section className="py-20 bg-gray-50" ref={blogReveal.ref} >
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <span className="text-accent-gold font-semibold uppercase tracking-wider text-sm">Blog</span>
              <h2 className="text-3xl md:text-4xl font-bold text-primary-navy mt-2">
                Saiba mais sobre Leilões Imobiliários
              </h2>
            </div>
            <Button
              onClick={() => navigate("/blog")}
              variant="outline"
              className="mt-4 md:mt-0 border-accent-gold text-accent-gold hover:bg-accent-gold hover:text-primary-navy"
            >
              Ver Todos
            </Button>
          </div>

          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 transition-all duration-700 ${blogReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {/* Featured Post - Left Side */}
            {blogPosts?.[0] && (
              <Link
                to={`/blog/${blogPosts[0].slug}`}
                className="group"
              >
                <div className="rounded-2xl overflow-hidden mb-4">
                  <img
                    src={blogPosts[0].cover_url || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80"}
                    alt={blogPosts[0].title}
                    className="w-full h-[280px] object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-2xl font-bold text-primary-navy mb-3 group-hover:text-accent-gold transition-colors">
                  {blogPosts[0].title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                  <span className="text-accent-gold font-semibold">Grupo Alea Leilões</span>
                </div>
                <p className="text-gray-600 line-clamp-2">
                  {blogPosts[0].content?.substring(0, 150)}...
                </p>
              </Link>
            )}

            {/* Other Posts - Right Side */}
            <div className="space-y-6">
              {blogPosts?.slice(1, 4).map((post: any) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.slug}`}
                  className="flex gap-5 group"
                >
                  <img
                    src={post.cover_url || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80"}
                    alt={post.title}
                    className="w-32 h-28 rounded-xl object-cover flex-shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 py-1">
                    <h4 className="font-bold text-primary-navy group-hover:text-accent-gold transition-colors line-clamp-1 mb-2">
                      {post.title}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(post.created_at).toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-2">
                      {post.content?.substring(0, 80)}...
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section >

      {/* CTA / CONTACT SECTION */}
      < section className="relative py-24" ref={newsletterReveal.ref} >
        {/* Background */}
        < div className="absolute inset-0 z-0" >
          <img
            src={(ctaContent as any)?.image_url || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80"}
            alt="Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary-navy/90" />
        </div >

        <div className={`container mx-auto px-6 relative z-10 transition-all duration-700 ${newsletterReveal.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
                {(ctaContent as any)?.title || "Pronto para investir?"}
              </h2>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                {(ctaContent as any)?.text || "Entre em contato com nossa equipe para encontrar as melhores oportunidades de leilão."}
              </p>

              <div className="flex items-center gap-4 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-accent-gold/20 flex items-center justify-center text-accent-gold">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-semibold">contato@alealeiloes.com.br</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Form */}
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <form className="space-y-4" onSubmit={async (e) => {
                e.preventDefault();

                // Get form data
                const formData = new FormData(e.currentTarget);
                const data = {
                  name: formData.get('name'),
                  email: formData.get('email'),
                  phone: formData.get('phone'),
                  source: 'Home Page CTA',
                  timestamp: new Date().toISOString()
                };

                const webhookUrl = (ctaContent as any)?.webhook_url;

                if (webhookUrl) {
                  try {
                    await fetch(webhookUrl, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(data)
                    });
                    alert('Dados enviados com sucesso!');
                  } catch (error) {
                    console.error('Webhook error:', error);
                  }
                }
                navigate('/contato');
              }}>
                <div>
                  <Label className="text-gray-700">Nome Completo</Label>
                  <Input name="name" placeholder="Seu nome" className="bg-gray-50 border-gray-200" required />
                </div>
                <div>
                  <Label className="text-gray-700">Seu melhor E-mail</Label>
                  <Input name="email" type="email" placeholder="seu@email.com" className="bg-gray-50 border-gray-200" required />
                </div>
                <div>
                  <Label className="text-gray-700">WhatsApp</Label>
                  <Input name="phone" placeholder="(11) 99999-9999" className="bg-gray-50 border-gray-200" required />
                </div>
                <Button type="submit" className="w-full bg-accent-gold hover:bg-accent-gold/90 text-primary-navy font-bold py-6 rounded-lg text-lg shadow-lg">
                  {(ctaContent as any)?.button_text || "Falar com Consultor"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section >

      <Footer />
    </div >
  );
};

export default Home;
