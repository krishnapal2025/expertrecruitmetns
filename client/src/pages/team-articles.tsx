import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, Search, Clock, User, BookOpen, Calendar, Filter, Loader2 } from "lucide-react";
import blogsBgImage from "../assets/close-up-person-working-home-night_23-2149090964.avif";
import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function TeamArticlesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [, setLocation] = useLocation();

  // Fetch blog posts from the API
  const { data: apiBlogs, isLoading: isLoadingBlogs } = useQuery({
    queryKey: ["/api/blog-posts"],
    queryFn: async () => {
      const response = await fetch("/api/blog-posts");
      if (!response.ok) {
        throw new Error("Failed to fetch blog posts");
      }
      return response.json();
    }
  });

  // Extract unique categories from blog posts
  const categories = apiBlogs 
    ? ["All Categories", ...new Set(apiBlogs.filter((post: any) => post.category).map((post: any) => post.category))]
    : ["All Categories"];

  // Filter blogs based on search term and category
  const filteredBlogs = apiBlogs 
    ? apiBlogs.filter((post: any) => {
        const matchesSearch = 
          post.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
          post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.subtitle?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = selectedCategory === "All Categories" || post.category === selectedCategory;
        
        return matchesSearch && matchesCategory && post.published;
      })
    : [];

  return (
    <>
      <Helmet>
        <title>Articles from Our Team | Expert Recruitments</title>
        <meta name="description" content="Browse our full collection of articles created by the Expert Recruitments team, featuring career advice, recruitment tips, and industry insights." />
      </Helmet>

      <div className="relative min-h-[60vh] overflow-hidden">
        {/* Background Image with Black Tint */}
        <div className="absolute inset-0 bg-black/65 z-10"></div>
        <div 
          className="absolute inset-0 bg-center bg-cover" 
          style={{ 
            backgroundImage: `url(${blogsBgImage})`,
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            height: '100%',
            width: '100%',
            filter: 'brightness(0.85)'
          }}
        ></div>
        
        {/* Accent lines */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20 z-10"></div>
        
        <div className="w-full max-w-[1440px] mx-auto px-4 relative py-24 md:py-32">
          {/* Main content */}
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto mb-8 relative z-20">
            <div className="inline-block mb-6 px-5 py-2 bg-white/90 border-b-2 border-primary shadow-sm rounded-md backdrop-blur-sm">
              <span className="font-medium text-primary tracking-wider uppercase text-sm">Our Publications</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-white tracking-tight drop-shadow-md">
              Articles from Our Team
            </h1>
            
            <p className="text-lg text-white/90 leading-relaxed mb-8 max-w-3xl drop-shadow">
              Insights, analysis, and career advice from Expert Recruitment's specialists
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search and Filter */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search articles..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {categories.length > 1 && (
              <div className="relative min-w-[180px]">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  className="pl-10 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>

        {/* All blog posts */}
        {isLoadingBlogs ? (
          <div className="text-center py-20">
            <Loader2 className="h-12 w-12 mx-auto text-primary animate-spin mb-4" />
            <h3 className="text-xl font-semibold mb-2">Loading Articles</h3>
            <p className="text-gray-600">Please wait while we fetch our articles</p>
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs
              .sort((a: any, b: any) => new Date(b.publishDate || b.createdAt).getTime() - new Date(a.publishDate || a.createdAt).getTime())
              .map((post: any) => (
                <Card key={`blog-${post.id}`} className="overflow-hidden flex flex-col h-full border-t-4 border-t-primary shadow-md">
                  <div className="h-48 overflow-hidden">
                    {post.bannerImage ? (
                      <img
                        src={post.bannerImage}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted flex items-center justify-center">
                        <BookOpen className="h-12 w-12 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <div className="text-sm font-medium text-primary mb-2">
                      {post.category || "Career Insights"}
                    </div>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription className="text-base mt-2">
                      {post.excerpt || post.subtitle || (post.content && post.content.length > 120 ? post.content.substring(0, 120) + "..." : post.content)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="mr-1 h-4 w-4" />
                      <span className="mr-4">Expert Recruitments</span>
                      <Clock className="mr-1 h-4 w-4" />
                      <span>{post.readTime || "5 min read"}</span>
                    </div>
                    {post.publishDate && (
                      <div className="flex items-center text-sm text-gray-500 mt-2">
                        <Calendar className="mr-1 h-4 w-4" />
                        <span>{new Date(post.publishDate).toLocaleDateString("en-US", { 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setLocation(`/article/${post.slug || post.id}`)}
                    >
                      Read Article <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No articles found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || selectedCategory !== "All Categories" 
                ? "We couldn't find any articles matching your search criteria."
                : "Our team hasn't published any articles yet. Please check back soon!"}
            </p>
            {(searchTerm || selectedCategory !== "All Categories") && (
              <Button onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All Categories");
              }}>
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
}