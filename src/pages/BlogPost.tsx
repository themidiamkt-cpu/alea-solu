import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, ArrowLeft } from "lucide-react";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><p>Carregando...</p></div>;
  }

  if (!post) {
    return <div className="min-h-screen flex items-center justify-center"><p>Post não encontrado</p></div>;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <article className="section-spacing mt-20">
        <div className="container max-w-4xl mx-auto px-4">
          <Link to="/blog" className="inline-flex items-center text-primary mb-6"><ArrowLeft size={20} className="mr-2" />Voltar ao Blog</Link>
          {post.cover_url && (
            <div className="card-premium overflow-hidden aspect-[21/9] mb-8">
              <img src={post.cover_url} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full mb-4">{post.category}</span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4">{post.title}</h1>
            <div className="flex items-center text-muted-foreground">
              <Calendar size={16} className="mr-2" />
              {new Date(post.created_at).toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })}
            </div>
          </div>
          <div className="prose prose-lg max-w-none">
            <div className="text-foreground leading-relaxed whitespace-pre-wrap">{post.content}</div>
          </div>
        </div>
      </article>
      <Footer />
    </div>
  );
};

export default BlogPost;