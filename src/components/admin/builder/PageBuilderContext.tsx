import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface ContentState {
    [key: string]: any; // e.g. { home_hero: { title: "...", ... }, home_about: { ... } }
}

interface PageBuilderContextType {
    contents: ContentState;
    loading: boolean;
    updateContent: (key: string, field: string, value: any) => void;
    saveAll: () => Promise<void>;
    hasUnsavedChanges: boolean;
}

const PageBuilderContext = createContext<PageBuilderContextType | undefined>(undefined);

export const PageBuilderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [contents, setContents] = useState<ContentState>({});
    const [originalContents, setOriginalContents] = useState<ContentState>({});
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const queryClient = useQueryClient();

    useEffect(() => {
        fetchContents();
    }, []);

    const fetchContents = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from("site_content")
            .select("*");

        if (error) {
            toast({ variant: "destructive", title: "Erro ao carregar", description: error.message });
        } else {
            const mapped: ContentState = {};
            data?.forEach(item => {
                // Merge item with its JSONB content for editing, allowing dynamic fields
                mapped[item.key] = { ...item, ...(item as any).content };
            });
            setContents(mapped);
            setOriginalContents(JSON.parse(JSON.stringify(mapped))); // Deep copy
        }
        setLoading(false);
    };

    const updateContent = (key: string, field: string, value: any) => {
        setContents(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                [field]: value
            }
        }));
    };

    const saveAll = async () => {
        let hasError = false;
        let errorMessages: string[] = [];
        let savedCount = 0;

        // Find modified items (including new items that don't exist in originalContents)
        for (const contentKey in contents) {
            const item = contents[contentKey];
            const original = originalContents[contentKey];

            // Check if item is new OR has been modified
            const isNew = !original;
            const isModified = original && JSON.stringify(item) !== JSON.stringify(original);

            if (isNew || isModified) {
                // Prepare update payload - ensure key is set properly
                const payload = {
                    key: item.key || contentKey, // Use contentKey as fallback if item.key is undefined
                    title: item.title || null,
                    subtitle: item.subtitle || null,
                    text: item.text || null,
                    image_url: item.image_url || null,
                    // Additional fields that might be present
                    number: item.number || null,
                    label: item.label || null,
                    author: item.author || null,
                    role: item.role || null,
                    updated_at: new Date().toISOString(),
                    content: item // Save the entire item as JSONB to capture extra fields like buttons, webhooks etc
                };

                console.log("Saving content for key:", contentKey, "isNew:", isNew, payload);

                // Use upsert - if key exists, update; if not, insert
                // @ts-ignore - site_content table exists but types not generated
                const { error } = await supabase
                    .from("site_content")
                    .upsert(payload, { onConflict: 'key' });

                if (error) {
                    console.error("Error updating " + contentKey, error);
                    errorMessages.push(`${contentKey}: ${error.message}`);
                    hasError = true;
                } else {
                    savedCount++;
                }
            }
        }

        if (hasError) {
            toast({
                variant: "destructive",
                title: "Erro ao salvar",
                description: `Alguns itens não puderam ser salvos. ${errorMessages.join(', ')}`
            });
        } else if (savedCount > 0) {
            toast({ title: "Sucesso", description: `${savedCount} item(s) salvos com sucesso.` });
            setOriginalContents(JSON.parse(JSON.stringify(contents)));
            queryClient.invalidateQueries({ queryKey: ["site_content"] });
        } else {
            toast({ title: "Nada a salvar", description: "Nenhuma alteração detectada." });
        }
    };


    const hasUnsavedChanges = JSON.stringify(contents) !== JSON.stringify(originalContents);

    return (
        <PageBuilderContext.Provider value={{ contents, loading, updateContent, saveAll, hasUnsavedChanges }}>
            {children}
        </PageBuilderContext.Provider>
    );
};

export const usePageBuilder = () => {
    const context = useContext(PageBuilderContext);
    if (!context) {
        throw new Error("usePageBuilder must be used within a PageBuilderProvider");
    }
    return context;
};
