import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Pencil, Trash, FileText } from "lucide-react";
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

const AdminBlog = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const { toast } = useToast();

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("blog_posts")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) {
            toast({
                variant: "destructive",
                title: "Erro ao carregar posts",
                description: error.message,
            });
        } else {
            setPosts(data || []);
        }
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Tem certeza que deseja excluir este post?")) return;

        const { error } = await supabase
            .from("blog_posts")
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
                title: "Post excluído",
                description: "O artigo foi removido com sucesso.",
            });
            fetchPosts();
        }
    };

    const filteredPosts = posts.filter((post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight text-white">Blog</h2>
                <Button
                    className="bg-accent-gold hover:bg-accent-gold/90 text-gray-900"
                    onClick={() => navigate("/admin/blog/novo")}
                >
                    <Plus className="mr-2 h-4 w-4" /> Novo Post
                </Button>
            </div>

            <div className="flex items-center space-x-2 bg-gray-900 p-4 rounded-lg border border-gray-800">
                <Search className="h-5 w-5 text-gray-500" />
                <Input
                    placeholder="Buscar posts..."
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
                            <TableHead className="text-gray-400">Categoria</TableHead>
                            <TableHead className="text-gray-400">Data de Criação</TableHead>
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
                        ) : filteredPosts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                    Nenhum post encontrado.
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPosts.map((post) => (
                                <TableRow key={post.id} className="border-gray-800 hover:bg-gray-900/50">
                                    <TableCell className="font-medium text-gray-200">
                                        <div className="flex items-center gap-3">
                                            {post.cover_url && (
                                                <img
                                                    src={post.cover_url}
                                                    alt={post.title}
                                                    className="h-10 w-10 rounded object-cover"
                                                />
                                            )}
                                            {post.title}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-gray-400">
                                        <span className="inline-flex items-center rounded-full border border-gray-700 px-2.5 py-0.5 text-xs font-semibold text-gray-300">
                                            {post.category}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-gray-400">
                                        {new Date(post.created_at).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="hover:bg-gray-800 hover:text-accent-gold"
                                                onClick={() => navigate(`/admin/blog/${post.id}`)}
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="hover:bg-gray-800 hover:text-red-400"
                                                onClick={() => handleDelete(post.id)}
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

export default AdminBlog;
