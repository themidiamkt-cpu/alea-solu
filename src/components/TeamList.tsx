import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Linkedin, Instagram } from "lucide-react";

export const TeamList = () => {
    const { data: teamMembers, isLoading } = useQuery({
        queryKey: ["team_members_public"],
        queryFn: async () => {
            const { data, error } = await supabase
                .from("team_members")
                .select("*")
                .order("created_at", { ascending: true });

            if (error) {
                console.error("Error fetching team:", error);
                return [];
            }
            return data || [];
        },
    });

    if (isLoading) {
        return <div className="text-center py-10 text-muted-foreground">Carregando especialistas...</div>;
    }

    if (!teamMembers || teamMembers.length === 0) {
        // Fallback/Empty state or just hide
        return null;
    }

    return (
        <div className="flex flex-col gap-16">
            {teamMembers.map((member: any) => (
                <div key={member.id} className="group grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-12 items-center">
                    <div className="order-1 md:col-span-2 relative px-6 md:px-0">
                        <div className="relative overflow-hidden rounded-lg border border-border/40 shadow-sm">
                            <div className="aspect-[4/5] bg-gray-100 dark:bg-gray-800">
                                <img
                                    src={member.image_url || "https://placehold.co/400x500"}
                                    alt={member.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                <div className="flex gap-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                    {member.linkedin_url && (
                                        <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-white hover:text-accent-gold transition-colors">
                                            <Linkedin className="w-6 h-6" />
                                        </a>
                                    )}
                                    {member.instagram_url && (
                                        <a href={member.instagram_url} target="_blank" rel="noopener noreferrer" className="text-white hover:text-accent-gold transition-colors">
                                            <Instagram className="w-6 h-6" />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Decorative element from old profile section */}
                        <div className="absolute -inset-4 bg-accent/20 rounded-lg transform -rotate-2 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    </div>

                    <div className="order-2 md:col-span-3 text-center md:text-left px-4 md:px-0">
                        <h3 className="text-2xl md:text-4xl font-serif font-bold text-primary mb-2 gold-accent-line mx-auto md:mx-0 w-fit">
                            {member.name}
                        </h3>
                        <p className="text-xl font-semibold text-accent mb-6 uppercase tracking-wider">
                            {member.role}
                        </p>
                        <p className="text-muted-foreground leading-relaxed text-lg whitespace-pre-wrap">
                            {member.bio}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
};
