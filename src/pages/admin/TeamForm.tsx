import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Save, Upload, Loader2 } from "lucide-react";

const TeamForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        role: "",
        bio: "",
        image_url: "",
        linkedin_url: "",
        instagram_url: "",
    });

    // Fetch data if in edit mode
    useQuery({
        queryKey: ["team_member", id],
        queryFn: async () => {
            if (!id) return null;
            const { data, error } = await supabase
                .from("team_members")
                .select("*")
                .eq("id", id)
                .single();

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Erro ao carregar dados",
                    description: error.message,
                });
                return null;
            }

            if (data) {
                setFormData({
                    name: data.name || "",
                    role: data.role || "",
                    bio: data.bio || "",
                    image_url: data.image_url || "",
                    linkedin_url: data.linkedin_url || "",
                    instagram_url: data.instagram_url || "",
                });
            }
            return data;
        },
        enabled: !!id,
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!e.target.files || e.target.files.length === 0) {
                throw new Error("Selecione uma imagem para fazer upload.");
            }

            const file = e.target.files[0];
            const fileExt = file.name.split(".").pop();
            const filePath = `${Math.random()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from("site") // Using 'site' bucket for general site content images
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage.from("site").getPublicUrl(filePath);

            setFormData((prev) => ({ ...prev, image_url: data.publicUrl }));
            toast({
                title: "Upload concluído",
                description: "Imagem carregada com sucesso.",
            });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro no upload",
                description: error.message,
            });
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (id) {
                const { error } = await supabase
                    .from("team_members")
                    .update(formData)
                    .eq("id", id);

                if (error) throw error;
                toast({
                    title: "Sucesso",
                    description: "Membro atualizado com sucesso.",
                });
            } else {
                const { error } = await supabase.from("team_members").insert([formData]);

                if (error) throw error;
                toast({
                    title: "Sucesso",
                    description: "Novo membro adicionado com sucesso.",
                });
            }
            navigate("/admin/equipe");
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Erro ao salvar",
                description: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <Button
                    variant="ghost"
                    className="text-gray-400 hover:text-white"
                    onClick={() => navigate("/admin/equipe")}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
                </Button>
                <h2 className="text-2xl font-bold text-white">
                    {id ? "Editar Especialista" : "Novo Especialista"}
                </h2>
            </div>

            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium text-gray-300">
                                Nome *
                            </label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                required
                                className="bg-gray-800 border-gray-700 text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="role" className="text-sm font-medium text-gray-300">
                                Cargo / Especialidade *
                            </label>
                            <Input
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                required
                                placeholder="Ex: CEO, Advogado Especialista..."
                                className="bg-gray-800 border-gray-700 text-white"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="bio" className="text-sm font-medium text-gray-300">
                            Biografia *
                        </label>
                        <Textarea
                            id="bio"
                            name="bio"
                            value={formData.bio}
                            onChange={handleInputChange}
                            required
                            rows={4}
                            className="bg-gray-800 border-gray-700 text-white"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">
                            Foto de Perfil
                        </label>
                        <div className="flex items-center gap-4">
                            {formData.image_url && (
                                <img
                                    src={formData.image_url}
                                    alt="Preview"
                                    className="w-20 h-20 rounded-full object-cover border border-gray-700"
                                />
                            )}
                            <div className="flex-1">
                                <Input
                                    id="image_url"
                                    name="image_url"
                                    value={formData.image_url}
                                    onChange={handleInputChange}
                                    placeholder="URL da imagem (ou faça upload)"
                                    className="bg-gray-800 border-gray-700 text-white mb-2"
                                />
                                <div className="relative">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="image-upload"
                                        disabled={uploading}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700"
                                        onClick={() => document.getElementById("image-upload")?.click()}
                                        disabled={uploading}
                                    >
                                        {uploading ? (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        ) : (
                                            <Upload className="mr-2 h-4 w-4" />
                                        )}
                                        {uploading ? "Enviando..." : "Fazer Upload de Imagem"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label htmlFor="linkedin_url" className="text-sm font-medium text-gray-300">
                                LinkedIn (Opcional)
                            </label>
                            <Input
                                id="linkedin_url"
                                name="linkedin_url"
                                value={formData.linkedin_url}
                                onChange={handleInputChange}
                                placeholder="https://linkedin.com/in/..."
                                className="bg-gray-800 border-gray-700 text-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="instagram_url" className="text-sm font-medium text-gray-300">
                                Instagram (Opcional)
                            </label>
                            <Input
                                id="instagram_url"
                                name="instagram_url"
                                value={formData.instagram_url}
                                onChange={handleInputChange}
                                placeholder="https://instagram.com/..."
                                className="bg-gray-800 border-gray-700 text-white"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            type="submit"
                            className="bg-accent-gold hover:bg-accent-gold/90 text-gray-900 font-semibold"
                            disabled={loading}
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="mr-2 h-4 w-4" />
                            )}
                            {id ? "Salvar Alterações" : "Criar Especialista"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TeamForm;
