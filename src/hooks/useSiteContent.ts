import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useSiteContent = (key: string) => {
    return useQuery({
        queryKey: ["site_content", key],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("site_content")
                .select("*")
                .eq("key", key)
                .maybeSingle();

            if (error) {
                console.error(`Error fetching content for key ${key}:`, error);
                return null;
            }
            if (data) {
                // Merge data with content JSONB if it exists, prioritizing JSONB fields but keeping row IDs etc
                return { ...data, ...data.content };
            }
            return data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};
