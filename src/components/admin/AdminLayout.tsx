import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
    LayoutDashboard,
    Gavel,
    Home,
    FileText,
    LayoutTemplate,
    LogOut,
    Menu,
    X,
    Users,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const SidebarItem = ({
    icon: Icon,
    label,
    to,
    active,
    onClick,
}: {
    icon: any;
    label: string;
    to: string;
    active: boolean;
    onClick?: () => void;
}) => (
    <Link
        to={to}
        onClick={onClick}
        className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium",
            active
                ? "bg-accent-gold/10 text-accent-gold border border-accent-gold/20"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
        )}
    >
        <Icon className="h-5 w-5" />
        {label}
    </Link>
);

const AdminLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/admin/login");
    };

    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", to: "/admin/dashboard" },
        { icon: Gavel, label: "Leilões", to: "/admin/leiloes" },
        { icon: Home, label: "Imóveis", to: "/admin/imoveis" },
        { icon: FileText, label: "Blog", to: "/admin/blog" },
        { icon: Users, label: "Equipe", to: "/admin/equipe" },
        { icon: LayoutTemplate, label: "Conteúdos / Builder", to: "/admin/page-builder" },
    ];

    return (
        <div className="min-h-screen bg-gray-950 text-white flex">
            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 transition-transform duration-300 lg:translate-x-0 lg:static",
                    mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="h-full flex flex-col">
                    <div className="p-6 border-b border-gray-800">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            Alea
                        </h1>
                        <p className="text-xs text-gray-500 mt-1">Painel Administrativo</p>
                    </div>

                    <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                        {navItems.map((item) => (
                            <SidebarItem
                                key={item.to}
                                {...item}
                                active={location.pathname === item.to}
                                onClick={() => setMobileMenuOpen(false)}
                            />
                        ))}
                    </nav>

                    <div className="p-4 border-t border-gray-800">
                        <Button
                            variant="ghost"
                            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-400/10"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-5 w-5 mr-3" />
                            Sair
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900">
                    <h1 className="font-bold">Admin</h1>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <Menu className="h-6 w-6" />
                        )}
                    </Button>
                </div>

                <div className="flex-1 overflow-auto p-4 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
