import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSiteContent } from "@/hooks/useSiteContent";

const Contato = () => {
  const { toast } = useToast();
  const { data: hero } = useSiteContent("contact_hero");
  const { data: info } = useSiteContent("contact_info");
  const { data: formContent } = useSiteContent("contact_form");
  const { data: homeCta } = useSiteContent("home_cta"); // For Webhook URL
  const normalizeEmail = (value: string, fallback: string) => {
    const trimmed = value.trim();
    if (!trimmed) return fallback;
    if (/alealeiloes/i.test(trimmed)) return "contato@grupoalea.com.br";
    return trimmed;
  };
  const displayContactEmail = normalizeEmail((info as any)?.email || "", "contato@grupoalea.com.br");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const webhookUrl = (homeCta as any)?.webhook_url;

    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            source: 'contact_page',
            timestamp: new Date().toISOString()
          })
        });
        toast({
          title: "Mensagem enviada!",
          description: "Recebemos seu contato com sucesso.",
        });
      } catch (error) {
        console.error("Webhook error:", error);
        toast({
          title: "Erro ao enviar",
          description: "Tente novamente mais tarde.",
          variant: "destructive"
        });
      }
    } else {
      // Fallback simulation
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Mensagem enviada!",
        description: "Entraremos em contato em breve.",
      });
    }

    setFormData({ name: "", email: "", phone: "", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden mt-20">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${(hero as any)?.image_url || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80"}')`,
          }}
        >
          <div className="absolute inset-0 hero-overlay"></div>
        </div>
        <div className="relative z-10 text-center text-white animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4">{(hero as any)?.title || "Contato"}</h1>
          <p className="text-xl text-white/90">{(hero as any)?.subtitle || "Estamos prontos para atendê-lo"}</p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="section-spacing bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-6">
                {(info as any)?.title || "Fale Conosco"}
              </h2>
              <p className="text-lg text-muted-foreground mb-8 whitespace-pre-line">
                {(info as any)?.text || "Entre em contato conosco através dos nossos canais de atendimento.\nEstamos sempre prontos para ajudá-lo a encontrar as melhores oportunidades."}
              </p>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-elegant">
                    <Phone className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Telefone</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{(info as any)?.phone || "(11) 98765-4321"}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-elegant">
                    <Mail className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">E-mail</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{displayContactEmail}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-elegant">
                    <MapPin className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary mb-1">Endereço</h3>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {(info as any)?.address || "Av. Paulista, 1000 - Bela Vista\nSão Paulo - SP, 01310-100"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Business Hours */}
              <div className="mt-8 card-premium p-6">
                <h3 className="font-serif font-semibold text-lg text-primary mb-4">
                  Horário de Atendimento
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground whitespace-pre-line">
                  {(info as any)?.hours || "Segunda a Sexta: 9h às 18h\nSábado: 9h às 13h\nDomingo: Fechado"}
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="card-premium p-8 animate-fade-in-up">
              <h3 className="text-2xl font-serif font-semibold text-primary mb-6">
                {(formContent as any)?.title || "Envie sua Mensagem"}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">
                    Nome *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    E-mail *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Telefone *
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder="(11) 98765-4321"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Mensagem *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    placeholder="Como podemos ajudá-lo?"
                  />
                </div>

                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contato;
