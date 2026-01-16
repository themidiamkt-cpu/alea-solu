import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Pencil, Trash, ImageIcon } from "lucide-react";
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

const AdminLeiloes = () => {
    const navigate = useNavigate();
    const [leiloes, setLeiloes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        fetchLeiloes();
    }, []);

    const fetchLeiloes = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("opportunities")
            .select("*")
            .eq("type", "LEILAO")
            .order("created_at", { ascending: false });

        if (error) {
            toast({
                variant: "destructive",
                title: "Erro ao carregar leilões",
                description: error.message,
            });
        } else {
            setLeiloes(data || []);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este leilão?")) return;

        const { error } = await supabase
            .from("opportunities")
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
                title: "Leilão excluído",
                description: "O leilão foi removido com sucesso.",
            });
            fetchLeiloes();
        }
    };

    const filteredLeiloes = leiloes.filter((leilao) =>
        leilao.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-white">Leilões</h2>
                <Button
                    className="bg-accent-gold hover:bg-accent-gold/90 text-gray-900"
                    onClick={() => navigate("/admin/leiloes/novo")}
                >
                    <Plus className="mr-2 h-4 w-4" /> Novo Leilão
                </Button>
            </div>

            <div className="flex items-center space-x-2 bg-gray-900 p-4 rounded-lg border border-gray-800">
                <Search className="h-5 w-5 text-gray-500" />
                <Input
                    placeholder="Buscar leilões..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none text-white placeholder:text-gray-500 focus-visible:ring-0"
                />
            </div>

            <div className="rounded-md border border-gray-800">
                <Table>
                    <TableHeader className="bg-gray-900">
                        <TableRow className="border-gray-800 hover:bg-gray-900">
                            <TableHead className="text-gray-400">Título</TableHead>
                            <TableHead className="text-gray-400">Cidade/UF</TableHead>
                            <TableHead className="text-gray-400">Valor</TableHead>
                            <TableHead className="text-gray-400">Data</TableHead>
                            <TableHead className="text-right text-gray-400">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                    Carregando...
                                </TableCell>
                            </TableRow>
                        ) : filteredLeiloes.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                    Nenhum leilão encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredLeiloes.map((leilao) => (
                                <TableRow key={leilao.id} className="border-gray-800 hover:bg-gray-900/50">
                                    <TableCell className="font-medium text-gray-200">
                                        {leilao.title}
                                    </TableCell>
                                    <TableCell className="text-gray-400">
                                        {leilao.city}/{leilao.state}
                                    </TableCell>
                                    <TableCell className="text-gray-400">
                                        {new Intl.NumberFormat("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        }).format(leilao.price)}
                                    </TableCell>
                                    <TableCell className="text-gray-400">
                                        {leilao.auction_date
                                            ? new Date(leilao.auction_date).toLocaleDateString()
                                            : "-"}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="hover:bg-gray-800 hover:text-white"
                                            >
                                                <ImageIcon className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="hover:bg-gray-800 hover:text-accent-gold"
                                                onClick={() => navigate(`/admin/leiloes/${leilao.id}`)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="hover:bg-gray-800 hover:text-red-400"
                                                onClick={() => handleDelete(leilao.id)}
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

export default AdminLeiloes;
