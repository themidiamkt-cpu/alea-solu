import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Search } from "lucide-react";
import { useState } from "react";

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: blogPosts, isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  // Get unique categories with counts
  const categories = blogPosts?.reduce((acc: any, post: any) => {
    const cat = post.category || "Sem categoria";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {}) || {};

  // Get popular posts (just take first 3 for now)
  const popularPosts = blogPosts?.slice(0, 3) || [];

  // Filter posts by search term
  const filteredPosts = blogPosts?.filter((post: any) =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-6 py-12 mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main Content - Posts */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Carregando posts...</p>
              </div>
            ) : filteredPosts && filteredPosts.length > 0 ? (
              <div className="space-y-10">
                {filteredPosts.map((post: any) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="block group"
                  >
                    {/* Post Card */}
                    <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                      {/* Image */}
                      {post.cover_url && (
                        <div className="aspect-[16/9] overflow-hidden">
                          <img
                            src={post.cover_url}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}

                      {/* Content */}
                      <div className="p-8">
                        <h2 className="text-2xl font-bold text-primary-navy mb-4 group-hover:text-accent-gold transition-colors">
                          {post.title}
                        </h2>

                        <div className="flex items-center gap-3 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1 text-accent-gold font-semibold">
                            <span className="w-5 h-5 rounded-full bg-accent-gold/20 flex items-center justify-center text-xs">A</span>
                            Alea
                          </div>
                        </div>

                        <p className="text-gray-600 line-clamp-3">
                          {post.content.substring(0, 200)}...
                        </p>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl">
                <p className="text-gray-500">Nenhum post encontrado.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-8">

              {/* Search Box */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Busca..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-accent-gold focus:border-transparent"
                  />
                  <button className="px-4 py-3 bg-teal-600 text-white rounded-r-lg hover:bg-teal-700 transition-colors">
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Categories */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-primary-navy mb-4">Categorias</h3>
                <ul className="space-y-3">
                  {Object.entries(categories).map(([category, count]) => (
                    <li key={category} className="flex items-center justify-between">
                      <span className="text-gray-600 hover:text-accent-gold cursor-pointer transition-colors">
                        {category === "Sem categoria" ? (
                          <span className="flex items-center gap-2">
                            <span className="text-accent-gold">•</span>
                            {category}
                          </span>
                        ) : (
                          category
                        )}
                      </span>
                      <span className="w-7 h-7 bg-teal-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {count as number}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Popular Posts */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-primary-navy mb-4">Popular Posts</h3>
                <div className="space-y-4">
                  {popularPosts.map((post: any) => (
                    <Link
                      key={post.id}
                      to={`/blog/${post.slug}`}
                      className="flex gap-4 group"
                    >
                      <img
                        src={post.cover_url || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80"}
                        alt={post.title}
                        className="w-20 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-primary-navy text-sm group-hover:text-accent-gold transition-colors line-clamp-2">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                          <Calendar className="w-3 h-3 text-accent-gold" />
                          {new Date(post.created_at).toLocaleDateString("pt-BR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                          })}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Blog;