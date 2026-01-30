import React, { useState } from 'react';
import { Upload, Loader2, Camera } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface EditableImageProps {
    src: string;
    onUpload: (url: string) => void;
    className?: string;
    containerClassName?: string;
    alt?: string;
    bucket?: string;
}

export const EditableImage: React.FC<EditableImageProps> = ({
    src,
    onUpload,
    className,
    containerClassName,
    alt = "Image",
    bucket = "site" // Default to 'site' or 'blog' depending on setup, using 'site' for generic
}) => {
    const { toast } = useToast();
    const [uploading, setUploading] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`; // bucket/filename

        try {
            // 1. Upload
            const { error: uploadError } = await supabase.storage
                .from(bucket)
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // 2. Get URL
            const { data } = supabase.storage
                .from(bucket)
                .getPublicUrl(filePath);

            onUpload(data.publicUrl);

            toast({
                title: "Imagem atualizada",
                description: "Nova imagem carregada com sucesso.",
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

    return (
        <div
            className={`relative group cursor-pointer ${containerClassName}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img src={src} alt={alt} className={className} />

            {/* Overlay */}
            <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-200 ${isHovered || uploading ? 'opacity-100' : 'opacity-0'}`}>
                <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full text-white">
                    {uploading ? (
                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                    ) : (
                        <>
                            <Camera className="w-8 h-8 mb-2" />
                            <span className="text-sm font-medium">Trocar Imagem</span>
                        </>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={uploading}
                    />
                </label>
            </div>
            {/* Hint Badge (Always visible if empty or generic placeholder?) Maybe not needed if hover is clear */}
        </div>
    );
};
