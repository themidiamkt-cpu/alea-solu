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

const AdminTeam = () => {
    const navigate = useNavigate();
    const [members, setMembers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("team_members")
            .select("*")
            .order("created_at", { ascending: true });

        if (error) {
            toast({
                variant: "destructive",
                title: "Erro ao carregar equipe",
                description: error.message,
            });
        } else {
            setMembers(data || []);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja processar a exclusão deste especialista?")) return;

        const { error } = await supabase
            .from("team_members")
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
                title: "Especialista excluído",
                description: "O membro da equipe foi removido com sucesso.",
            });
            fetchMembers();
        }
    };

    const filteredMembers = members.filter((member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-white">Gestão da Equipe</h2>
                <Button
                    className="bg-accent-gold hover:bg-accent-gold/90 text-gray-900"
                    onClick={() => navigate("/admin/equipe/novo")}
                >
                    <Plus className="mr-2 h-4 w-4" /> Novo Especialista
                </Button>
            </div>

            <div className="flex items-center space-x-2 bg-gray-900 p-4 rounded-lg border border-gray-800">
                <Search className="h-5 w-5 text-gray-500" />
                <Input
                    placeholder="Buscar por nome ou cargo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="bg-transparent border-none text-white placeholder:text-gray-500 focus-visible:ring-0"
                />
            </div>

            <div className="rounded-md border border-gray-800">
                <Table>
                    <TableHeader className="bg-gray-900">
                        <TableRow className="border-gray-800 hover:bg-gray-900">
                            <TableHead className="text-gray-400">Avatar</TableHead>
                            <TableHead className="text-gray-400">Nome</TableHead>
                            <TableHead className="text-gray-400">Cargo</TableHead>
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
                        ) : filteredMembers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                    Nenhum membro encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredMembers.map((member) => (
                                <TableRow key={member.id} className="border-gray-800 hover:bg-gray-900/50">
                                    <TableCell>
                                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800">
                                            {member.image_url ? (
                                                <img src={member.image_url} alt={member.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">N/A</div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium text-gray-200">
                                        {member.name}
                                    </TableCell>
                                    <TableCell className="text-gray-400">
                                        {member.role}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="hover:bg-gray-800 hover:text-accent-gold"
                                                onClick={() => navigate(`/admin/equipe/${member.id}`)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="hover:bg-gray-800 hover:text-red-400"
                                                onClick={() => handleDelete(member.id)}
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

export default AdminTeam;
