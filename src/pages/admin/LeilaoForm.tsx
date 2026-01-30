import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Upload, X, Home, DollarSign, Calendar, MapPin, Bed, Bath, Car, Ruler } from "lucide-react";

const LeilaoForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { toast } = useToast();
    const isEditing = !!id;

    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        city: "",
        state: "",
        neighborhood: "",
        price: "",
        market_value: "",
        auction_date: "",
        description: "",
        highlight: false,
        type: "LEILAO",
        bedrooms: "",
        bathrooms: "",
        garage: "",
        area: "",
    });
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        if (isEditing) {
            fetchLeilao();
        }
    }, [id]);

    const fetchLeilao = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("opportunities")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            toast({
                variant: "destructive",
                title: "Erro ao carregar leilão",
                description: error.message,
            });
            navigate("/admin/leiloes");
        } else {
            setFormData({
                title: data.title || "",
                slug: data.slug || "",
                city: data.city || "",
                state: data.state || "",
                neighborhood: data.neighborhood || "",
                price: data.price?.toString() || "",
                market_value: data.market_value?.toString() || "",
                auction_date: data.auction_date ? data.auction_date.split('T')[0] : "",
                description: data.description || "",
                highlight: data.highlight || false,
                type: "LEILAO",
                bedrooms: data.bedrooms?.toString() || "",
                bathrooms: data.bathrooms?.toString() || "",
                garage: data.garage?.toString() || "",
                area: data.area?.toString() || "",
            });

            const { data: imagesData } = await supabase
                .from("opportunity_images")
                .select("image_url")
                .eq("opportunity_id", id);

            if (imagesData) {
                setImages(imagesData.map(img => img.image_url));
            }
        }
        setLoading(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (name === "title" && !isEditing) {
            const slug = value
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/(^-|-$)+/g, "");
            setFormData((prev) => ({ ...prev, slug }));
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const files = Array.from(e.target.files);
        const newImages: string[] = [];

        for (const file of files) {
            const fileExt = file.name.split(".").pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `leiloes/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("opportunities")
                .upload(filePath, file);

            if (uploadError) {
                toast({
                    variant: "destructive",
                    title: "Erro ao fazer upload da imagem",
                    description: uploadError.message,
                });
            } else {
                const { data } = supabase.storage
                    .from("opportunities")
                    .getPublicUrl(filePath);
                newImages.push(data.publicUrl);
            }
        }

        setImages((prev) => [...prev, ...newImages]);
        setUploading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const opportunityData = {
            title: formData.title,
            slug: formData.slug,
            city: formData.city,
            state: formData.state,
            neighborhood: formData.neighborhood,
            price: formData.price ? parseFloat(formData.price) : null,
            market_value: formData.market_value ? parseFloat(formData.market_value) : null,
            auction_date: formData.auction_date ? new Date(formData.auction_date).toISOString() : null,
            description: formData.description,
            highlight: formData.highlight,
            type: "LEILAO",
            bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
            bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
            garage: formData.garage ? parseInt(formData.garage) : null,
            area: formData.area ? parseFloat(formData.area) : null,
        };

        let opportunityId = id;

        if (isEditing) {
            const { error } = await supabase
                .from("opportunities")
                .update(opportunityData)
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
            const { data, error } = await supabase
                .from("opportunities")
                .insert([opportunityData])
                .select()
                .single();

            if (error) {
                toast({
                    variant: "destructive",
                    title: "Erro ao criar",
                    description: error.message,
                });
                setLoading(false);
                return;
            }
            opportunityId = data.id;
        }

        if (images.length > 0 && opportunityId) {
            if (isEditing) {
                await supabase.from("opportunity_images").delete().eq("opportunity_id", opportunityId);
            }

            const imagesToInsert = images.map(url => ({
                opportunity_id: opportunityId,
                image_url: url
            }));

            if (imagesToInsert.length > 0) {
                await supabase.from("opportunity_images").insert(imagesToInsert);
            }
        }

        toast({
            title: isEditing ? "Leilão atualizado" : "Leilão criado",
            description: "As informações foram salvas com sucesso.",
        });

        navigate("/admin/leiloes");
        setLoading(false);
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate("/admin/leiloes")}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-3xl font-bold tracking-tight text-white">
                    {isEditing ? "Editar Leilão" : "Novo Leilão"}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Basic Info */}
                    <Card className="bg-gray-900 border-gray-800">
                        <CardHeader>
                            <CardTitle className="text-gray-200 flex items-center gap-2">
                                <Home className="w-5 h-5 text-accent-gold" />
                                Informações Principais
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-gray-300">Título do Anúncio</Label>
                                <Input
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="bg-gray-800 border-gray-700 text-white"
                                    required
                                    placeholder="Ex: Apto 43,50 m² - Ribeirão Residencial"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="slug" className="text-gray-300">Slug (URL)</Label>
                                <Input
                                    id="slug"
                                    name="slug"
                                    value={formData.slug}
                                    onChange={handleInputChange}
                                    className="bg-gray-800 border-gray-700 text-white"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city" className="text-gray-300 flex items-center gap-1"><MapPin size={14} /> Cidade</Label>
                                    <Input
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        className="bg-gray-800 border-gray-700 text-white"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="state" className="text-gray-300">Estado</Label>
                                    <Input
                                        id="state"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleInputChange}
                                        className="bg-gray-800 border-gray-700 text-white"
                                        required
                                        maxLength={2}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="neighborhood" className="text-gray-300">Bairro / Condomínio</Label>
                                <Input
                                    id="neighborhood"
                                    name="neighborhood"
                                    value={formData.neighborhood}
                                    onChange={handleInputChange}
                                    className="bg-gray-800 border-gray-700 text-white"
                                    placeholder="Ex: Parque da Mata VI"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Financial & Dates */}
                    <Card className="bg-gray-900 border-gray-800">
                        <CardHeader>
                            <CardTitle className="text-gray-200 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-accent-gold" />
                                Valores e Datas
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="market_value" className="text-gray-300">Avaliação de Mercado (R$)</Label>
                                <Input
                                    id="market_value"
                                    name="market_value"
                                    type="number"
                                    value={formData.market_value}
                                    onChange={handleInputChange}
                                    className="bg-gray-800 border-gray-700 text-white"
                                    placeholder="0,00"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-gray-300">Valor Inicial (2ª Praça) (R$)</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="bg-gray-800 border-gray-700 text-white"
                                    placeholder="0,00"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="auction_date" className="text-gray-300 flex items-center gap-1"><Calendar size={14} /> Data do Leilão</Label>
                                <Input
                                    id="auction_date"
                                    name="auction_date"
                                    type="date"
                                    value={formData.auction_date}
                                    onChange={handleInputChange}
                                    className="bg-gray-800 border-gray-700 text-white"
                                    required
                                />
                            </div>
                            <div className="flex items-center space-x-2 pt-4">
                                <Switch
                                    id="highlight"
                                    checked={formData.highlight}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, highlight: checked }))}
                                />
                                <Label htmlFor="highlight" className="text-gray-300">Destacar este leilão na Home</Label>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Property Details */}
                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-gray-200">Características do Imóvel</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="area" className="text-gray-300 flex items-center gap-1"><Ruler size={14} /> Área (m²)</Label>
                                <Input
                                    id="area"
                                    name="area"
                                    type="number"
                                    value={formData.area}
                                    onChange={handleInputChange}
                                    className="bg-gray-800 border-gray-700 text-white"
                                    placeholder="Ex: 43.5"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bedrooms" className="text-gray-300 flex items-center gap-1"><Bed size={14} /> Quartos</Label>
                                <Input
                                    id="bedrooms"
                                    name="bedrooms"
                                    type="number"
                                    value={formData.bedrooms}
                                    onChange={handleInputChange}
                                    className="bg-gray-800 border-gray-700 text-white"
                                    placeholder="Ex: 2"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="bathrooms" className="text-gray-300 flex items-center gap-1"><Bath size={14} /> Banheiros</Label>
                                <Input
                                    id="bathrooms"
                                    name="bathrooms"
                                    type="number"
                                    value={formData.bathrooms}
                                    onChange={handleInputChange}
                                    className="bg-gray-800 border-gray-700 text-white"
                                    placeholder="Ex: 1"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="garage" className="text-gray-300 flex items-center gap-1"><Car size={14} /> Vagas</Label>
                                <Input
                                    id="garage"
                                    name="garage"
                                    type="number"
                                    value={formData.garage}
                                    onChange={handleInputChange}
                                    className="bg-gray-800 border-gray-700 text-white"
                                    placeholder="Ex: 1"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Description and Images */}
                <Card className="bg-gray-900 border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-gray-200">Descrição e Imagens</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-gray-300">Descrição Completa</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="bg-gray-800 border-gray-700 text-white min-h-[150px]"
                                placeholder="Descreva os detalhes do leilão..."
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-gray-300">Galeria de Imagens</Label>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {images.map((url, index) => (
                                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-700 group">
                                        <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setImages(prev => prev.filter((_, i) => i !== index))}
                                            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="h-4 w-4 text-white" />
                                        </button>
                                    </div>
                                ))}
                                <div className="aspect-square rounded-lg border-2 border-dashed border-gray-700 flex items-center justify-center hover:border-accent-gold transition-colors">
                                    <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                                        <Upload className="h-8 w-8 text-gray-400 mb-2" />
                                        <span className="text-sm text-gray-500">Upload</span>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageUpload}
                                            disabled={uploading}
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4 sticky bottom-6 z-10 bg-gray-900/90 p-4 rounded-xl border border-gray-800 backdrop-blur-sm">
                    <Button
                        type="button"
                        variant="outline"
                        className="border-gray-700 text-gray-300 hover:bg-gray-800"
                        onClick={() => navigate("/admin/leiloes")}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="submit"
                        className="bg-accent-gold hover:bg-accent-gold/90 text-gray-900 font-bold"
                        disabled={loading || uploading}
                    >
                        {loading ? "Salvando..." : "Salvar Leilão"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default LeilaoForm;
