import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Upload, X } from "lucide-react";

const ConteudoForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const isEditing = !!id;

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        key: "",
        title: "",
        subtitle: "",
        text: "",
        image_url: "",
    });

    useEffect(() => {
        if (isEditing) {
            fetchConteudo();
        }
    }, [id]);

    const fetchConteudo = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("site_content")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            toast({
                variant: "destructive",
                title: "Erro ao carregar conteúdo",
                description: error.message,
            });
            navigate("/admin/conteudos");
        } else {
            setFormData({
                key: data.key,
                title: data.title || "",
                subtitle: data.subtitle || "",
                text: data.text || "",
                image_url: data.image_url || "",
            });
        }
        setLoading(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `site/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from("blog") // Reusing bucket
            .upload(filePath, file);

        if (uploadError) {
            toast({
                variant: "destructive",
                title: "Erro ao fazer upload da imagem",
                description: uploadError.message,
            });
        } else {
            const { data } = supabase.storage
                .from("blog")
                .getPublicUrl(filePath);
            setFormData(prev => ({ ...prev, image_url: data.publicUrl }));
        }

        setUploading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const contentData = {
            key: formData.key,
            title: formData.title,
            subtitle: formData.subtitle,
            text: formData.text,
            image_url: formData.image_url,
        };

        if (isEditing) {
            const { error } = await supabase
                .from("site_content")
                .update(contentData)
                .eq("id", id);

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Erro ao atualizar",
                    description: error.message,
                });
                setLoading(false);
                return;
            }
        } else {
            const { error } = await supabase
                .from("site_content")
                .insert([contentData]);

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Erro ao criar",
                    description: error.message,
                });
                setLoading(false);
                return;
            }
        }

        toast({
            title: isEditing ? "Conteúdo atualizado" : "Conteúdo criado",
            description: "As alterações foram salvas com sucesso.",
        });

        navigate("/admin/conteudos");
        setLoading(false);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/admin/conteudos")}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-3xl font-bold tracking-tight text-white">
                    {isEditing ? "Editar Bloco" : "Novo Bloco de Conteúdo"}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-gray-200">Informações</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="key" className="text-gray-300">Chave Única (ID)</Label>
                            <Input
                                id="key"
                                name="key"
                                value={formData.key}
                                onChange={handleInputChange}
                                className="bg-gray-800 border-gray-700 text-white font-mono"
                                placeholder="ex: home_hero_title"
                                required
                                disabled={isEditing} // Prevent changing key deeply to avoid conflicts, or allow it? Better disable.
                            />
                            <p className="text-xs text-gray-500">Identificador usado no código para buscar este conteúdo.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-gray-300">Título</Label>
                            <Input
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="bg-gray-800 border-gray-700 text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="subtitle" className="text-gray-300">Subtítulo</Label>
                            <Input
                                id="subtitle"
                                name="subtitle"
                                value={formData.subtitle}
                                onChange={handleInputChange}
                                className="bg-gray-800 border-gray-700 text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-300">Imagem</Label>
                            <div className="flex items-start gap-4">
                                {formData.image_url && (
                                    <div className="relative w-40 aspect-video rounded-lg overflow-hidden border border-gray-700">
                                        <img src={formData.image_url} alt="Capa" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, image_url: "" }))}
                                            className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-red-500 rounded-full text-white transition-colors"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                )}
                                <div className="flex-1">
                                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md hover:bg-gray-700 transition-colors">
                                        <Upload className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm text-gray-300">Upload Imagem</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="text" className="text-gray-300">Texto / Conteúdo</Label>
                            <Textarea
                                id="text"
                                name="text"
                                value={formData.text}
                                onChange={handleInputChange}
                                className="bg-gray-800 border-gray-700 text-white min-h-[200px]"
                            />
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                        onClick={() => navigate("/admin/conteudos")}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        className="bg-accent-gold hover:bg-accent-gold/90 text-gray-900"
                        disabled={loading || uploading}
                    >
                        {loading ? "Salvando..." : "Salvar Conteúdo"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default ConteudoForm;
