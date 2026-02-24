import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useSiteContent } from "@/hooks/useSiteContent";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { data: contactBtn } = useSiteContent("nav_contact_btn");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
      ? "bg-white/95 backdrop-blur-md border-b border-border shadow-md h-16"
      : "bg-white/80 backdrop-blur-sm border-b border-transparent h-20"
      }`}>
      <div className="container-custom">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? "h-16" : "h-20"
          }`}>
          {/* Logo */}
          <Link to="/" className="group">
            <img
              src="/grupo-alea-logo-horizontal.svg"
              alt="Grupo Alea"
              className={`${scrolled ? "h-10" : "h-12"} w-auto object-contain transition-all duration-300`}
            />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Início
            </Link>
            <Link
              to="/leiloes"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Leilões
            </Link>
            <Link
              to="/imobiliaria"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Imobiliária
            </Link>
            <Link
              to="/servicos"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Serviços
            </Link>
            <Link
              to="/blog"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors"
            >
              Blog
            </Link>
            <Link to="/contato">
              <Button variant="accent" size="default">
                {contactBtn?.text || "Contato"}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-white animate-fade-in">
          <div className="container-custom py-4 flex flex-col space-y-4">
            <Link
              to="/"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Início
            </Link>
            <Link
              to="/leiloes"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Leilões
            </Link>
            <Link
              to="/imobiliaria"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Imobiliária
            </Link>
            <Link
              to="/servicos"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Serviços
            </Link>
            <Link
              to="/blog"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Blog
            </Link>
            <Link to="/contato" onClick={() => setIsOpen(false)}>
              <Button variant="accent" size="default" className="w-full">
                {contactBtn?.text || "Contato"}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
