import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gavel, Home, FileText, Activity } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const DashboardCard = ({ title, value, icon: Icon, description }: { title: string, value: string | number, icon: any, description: string }) => (
    <Card className="bg-gray-900 border-gray-800">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">
                {title}
            </CardTitle>
            <Icon className="h-4 w-4 text-accent-gold" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-white">{value}</div>
            <p className="text-xs text-gray-500 mt-1">
                {description}
            </p>
        </CardContent>
    </Card>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        leiloes: 0,
        imoveis: 0,
        posts: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            const { count: leiloesCount } = await supabase
                .from('opportunities')
                .select('*', { count: 'exact', head: true })
                .eq('type', 'LEILAO');

            const { count: imoveisCount } = await supabase
                .from('opportunities')
                .select('*', { count: 'exact', head: true })
                .eq('type', 'IMOVEL');

            const { count: postsCount } = await supabase
                .from('blog_posts')
                .select('*', { count: 'exact', head: true });

            setStats({
                leiloes: leiloesCount || 0,
                imoveis: imoveisCount || 0,
                posts: postsCount || 0
            });
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tight text-white">Dashboard</h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard
                    title="Leilões Ativos"
                    value={stats.leiloes}
                    icon={Gavel}
                    description="Total de leilões cadastrados"
                />
                <DashboardCard
                    title="Imóveis"
                    value={stats.imoveis}
                    icon={Home}
                    description="Imóveis em carteira"
                />
                <DashboardCard
                    title="Blog Posts"
                    value={stats.posts}
                    icon={FileText}
                    description="Artigos publicados"
                />
                <DashboardCard
                    title="Status do Sistema"
                    value="Online"
                    icon={Activity}
                    description="Todos os serviços operando"
                />
            </div>
        </div>
    );
};

export default AdminDashboard;
