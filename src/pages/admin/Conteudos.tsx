import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Pencil, Trash } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

const AdminConteudos = () => {
    const navigate = useNavigate();
    const [conteudos, setConteudos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        fetchConteudos();
    }, []);

    const fetchConteudos = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("site_content")
            .select("*")
            .order("key", { ascending: true });

        if (error) {
            // If table doesn't exist, it might error.
            toast({
                variant: "destructive",
                title: "Erro ao carregar conteúdos",
                description: error.message,
            });
        } else {
            setConteudos(data || []);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este conteúdo? Isso pode quebrar partes do site que dependem dessa chave.")) return;

        const { error } = await supabase
            .from("site_content")
            .delete()
            .eq("id", id);

        if (error) {
            toast({
                variant: "destructive",
                title: "Erro ao excluir",
                description: error.message,
            });
        } else {
            toast({
                title: "Conteúdo excluído",
                description: "O item foi removido com sucesso.",
            });
            fetchConteudos();
        }
    };

    const filteredConteudos = conteudos.filter((item) =>
        item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.title && item.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-white">Conteúdos do Site</h2>
                <Button
                    className="bg-accent-gold hover:bg-accent-gold/90 text-gray-900"
                    onClick={() => navigate("/admin/conteudos/novo")}
                >
                    <Plus className="mr-2 h-4 w-4" /> Novo Bloco
                </Button>
            </div>

            <div className="flex items-center space-x-2 bg-gray-900 p-4 rounded-lg border border-gray-800">
                <Search className="h-5 w-5 text-gray-500" />
                <Input
                    placeholder="Buscar por chave ou título..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none text-white placeholder:text-gray-500 focus-visible:ring-0"
                />
            </div>

            <div className="rounded-md border border-gray-800">
                <Table>
                    <TableHeader className="bg-gray-900">
                        <TableRow className="border-gray-800 hover:bg-gray-900">
                            <TableHead className="text-gray-400">Chave (ID)</TableHead>
                            <TableHead className="text-gray-400">Título</TableHead>
                            <TableHead className="text-gray-400">Texto (Resumo)</TableHead>
                            <TableHead className="text-right text-gray-400">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                    Carregando...
                                </TableCell>
                            </TableRow>
                        ) : filteredConteudos.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                    Nenhum conteúdo encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredConteudos.map((item) => (
                                <TableRow key={item.id} className="border-gray-800 hover:bg-gray-900/50">
                                    <TableCell className="font-mono text-xs text-accent-gold">
                                        {item.key}
                                    </TableCell>
                                    <TableCell className="font-medium text-gray-200">
                                        {item.title || "-"}
                                    </TableCell>
                                    <TableCell className="text-gray-400 max-w-md truncate">
                                        {item.text || "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="hover:bg-gray-800 hover:text-accent-gold"
                                                onClick={() => navigate(`/admin/conteudos/${item.id}`)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="hover:bg-gray-800 hover:text-red-400"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default AdminConteudos;
