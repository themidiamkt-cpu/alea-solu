import { Link } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

export const Footer = ({ previewContent }: { previewContent?: any }) => {
  // Dynamic content hooks
  const { data: footerAbout } = useSiteContent("footer_about");
  const { data: footerContact } = useSiteContent("footer_contact");
  const { data: footerSocial } = useSiteContent("footer_social");
  const { data: footerCopyright } = useSiteContent("footer_copyright");

  // Merge preview content if available
  const about = previewContent?.footer_about || footerAbout;
  const contact = previewContent?.footer_contact || footerContact;
  const social = previewContent?.footer_social || footerSocial;
  const copyright = previewContent?.footer_copyright || footerCopyright;
  const normalizeGroupName = (value: string, fallback: string) => {
    const trimmed = value.trim();
    if (!trimmed) return fallback;
    if (/^\s*grupo\b/i.test(trimmed)) return trimmed;
    if (/alea/i.test(trimmed)) return `Grupo ${trimmed}`;
    return trimmed;
  };
  const aboutTitleValue = (about?.title || "");
  const displayAboutTitle = normalizeGroupName(aboutTitleValue, "Grupo Alea Leilões");
  const normalizeEmail = (value: string, fallback: string) => {
    const trimmed = value.trim();
    if (!trimmed) return fallback;
    if (/alealeiloes/i.test(trimmed)) return "contato@grupoalea.com.br";
    return trimmed;
  };
  const contactEmailValue = (contact?.subtitle || "");
  const displayContactEmail = normalizeEmail(contactEmailValue, "contato@grupoalea.com.br");

  return (
    <footer className="bg-primary text-white">
      <div className="container-custom py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <img src="/logo/logo-quadrado-grupo.png" alt="Grupo Alea" className="w-14 h-14 object-contain rounded-md" />
              <div>
                <span className="text-lg font-serif font-semibold leading-tight">
                  {displayAboutTitle}
                </span>
              </div>
            </div>
            <p className="text-sm text-white/80 leading-relaxed">
              {about?.text || "Leilões judiciais e extrajudiciais com segurança jurídica e transparência. Consultoria especializada em avaliação de imóveis."}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif font-semibold text-lg mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-white/80 hover:text-accent transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link to="/leiloes" className="text-sm text-white/80 hover:text-accent transition-colors">
                  Leilões
                </Link>
              </li>
              <li>
                <Link to="/imobiliaria" className="text-sm text-white/80 hover:text-accent transition-colors">
                  Imobiliária
                </Link>
              </li>
              <li>
                <Link to="/servicos" className="text-sm text-white/80 hover:text-accent transition-colors">
                  Serviços
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-white/80 hover:text-accent transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-serif font-semibold text-lg mb-4">Serviços</h3>
            <ul className="space-y-2">
              <li className="text-sm text-white/80">Leilões Judiciais</li>
              <li className="text-sm text-white/80">Leilões Extrajudiciais</li>
              <li className="text-sm text-white/80">Avaliação de Imóveis</li>
              <li className="text-sm text-white/80">Consultoria Jurídica</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-serif font-semibold text-lg mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Phone size={16} className="mt-1 flex-shrink-0" />
                <span className="text-sm text-white/80">{contact?.text || "(11) 98765-4321"}</span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={16} className="mt-1 flex-shrink-0" />
                <span className="text-sm text-white/80">{displayContactEmail}</span>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span className="text-sm text-white/80">
                  {contact?.title || "São Paulo - SP"}
                </span>
              </li>
            </ul>
            <div className="flex items-center space-x-4 mt-4">
              <a href={social?.text || "#"} className="text-white/80 hover:text-accent transition-colors" target="_blank" rel="noopener noreferrer">
                <Facebook size={20} />
              </a>
              <a href={social?.subtitle || "#"} className="text-white/80 hover:text-accent transition-colors" target="_blank" rel="noopener noreferrer">
                <Instagram size={20} />
              </a>
              <a href={social?.title || "#"} className="text-white/80 hover:text-accent transition-colors" target="_blank" rel="noopener noreferrer">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-sm text-white/60">
            {copyright?.text || `© ${new Date().getFullYear()} Grupo Alea. Todos os direitos reservados.`}
          </p>
        </div>
      </div>
    </footer>
  );
};
