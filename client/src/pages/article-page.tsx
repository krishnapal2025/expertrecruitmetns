import { useState, useEffect } from "react";
import { useLocation, useRoute, Link } from "wouter";
import { Helmet } from "react-helmet";
import { ChevronLeft, Clock, User, Share2, BookmarkPlus, Calendar, Tag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { formatDate } from "../lib/utils";

// Interface for blog posts from the API
interface BlogPost {
  id: number;
  title: string;
  subtitle?: string;
  content: string;
  bannerImage: string;
  authorId: number;
  publishDate: string;
  published: boolean;
  category: string;
  tags: string[];
  slug: string;
  excerpt?: string;
  readTime?: string;
}

// BlogPost component to render the article once data is loaded
const BlogPostContent = ({ 
  blogPost, 
  adminUser, 
  relatedArticles, 
  onBackClick,
  onRelatedArticleClick
}: { 
  blogPost: BlogPost; 
  adminUser: any; 
  relatedArticles: BlogPost[];
  onBackClick: () => void;
  onRelatedArticleClick: (slug: string) => void;
}) => {
  return (
    <>
      <Helmet>
        <title>{blogPost.title} | Expert Recruitments LLC</title>
        <meta name="description" content={blogPost.excerpt || blogPost.subtitle || blogPost.content.substring(0, 160)} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        {/* Back button */}
        <div className="mb-8">
          <Button variant="ghost" onClick={onBackClick} className="pl-0 text-gray-600 hover:text-primary">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Button>
        </div>
        
        {/* Article header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="text-sm font-medium text-primary mb-2">{blogPost.category}</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-6">{blogPost.title}</h1>
          {blogPost.subtitle && (
            <p className="text-xl text-gray-600 mb-6">{blogPost.subtitle}</p>
          )}
          
          <div className="flex items-center mb-8">
            <Avatar className="h-10 w-10 mr-4">
              <AvatarFallback>
                {adminUser ? adminUser.firstName.charAt(0) : "A"}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">
                {adminUser ? `${adminUser.firstName} ${adminUser.lastName}` : "Admin"}
              </div>
              <div className="text-sm text-gray-500">
                Recruitment Specialist
              </div>
            </div>
            <div className="ml-auto flex items-center text-sm text-gray-500">
              <Calendar className="mr-1 h-4 w-4" />
              <span className="mr-4">{blogPost.publishDate ? formatDate(blogPost.publishDate) : "Recently Published"}</span>
              <Clock className="mr-1 h-4 w-4" />
              <span>{blogPost.readTime || "5 min read"}</span>
            </div>
          </div>
          
          {/* Featured image */}
          <div className="rounded-lg overflow-hidden h-64 md:h-96 mb-8">
            <img 
              src={blogPost.bannerImage} 
              alt={blogPost.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Article content */}
        <div className="max-w-4xl mx-auto mb-12">
          <div 
            className="prose prose-lg max-w-none" 
            style={{ whiteSpace: 'pre-wrap' }}
            dangerouslySetInnerHTML={{ 
              __html: blogPost.content
                .split('\n')
                .map(line => line.trim() ? line : '<br>')
                .join('')
            }}
          ></div>
          
          {/* Tags */}
          {blogPost.tags && blogPost.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center flex-wrap gap-2">
                <Tag className="h-4 w-4 text-gray-500 mr-2" />
                {blogPost.tags.map((tag, index) => (
                  <Link key={index} href={`/blogs?tag=${encodeURIComponent(tag)}`}>
                    <div className="inline-block bg-gray-100 hover:bg-primary/10 hover:text-primary text-gray-800 rounded-full px-3 py-1 text-sm cursor-pointer transition-colors">
                      {tag}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          
          {/* Share and bookmark */}
          <div className="flex justify-end gap-2 mt-8">
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <BookmarkPlus className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>
        
        {/* Author box */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarFallback className="text-3xl">
                    {adminUser ? adminUser.firstName.charAt(0) : "A"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    About {adminUser ? `${adminUser.firstName} ${adminUser.lastName}` : "Our Expert"}
                  </h3>
                  <p className="text-gray-700 mb-4">
                    Recruitment Specialist at Expert Recruitments LLC with expertise in talent acquisition and executive search. Passionate about connecting organizations with exceptional leadership talent.
                  </p>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <Card key={relatedArticle.id} className="overflow-hidden h-full flex flex-col">
                  <div className="h-40 overflow-hidden">
                    <img
                      src={relatedArticle.bannerImage}
                      alt={relatedArticle.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  </div>
                  <CardHeader>
                    <div className="text-sm font-medium text-primary mb-1">{relatedArticle.category}</div>
                    <CardTitle className="text-lg">{relatedArticle.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="mr-1 h-4 w-4" />
                      <span className="mr-4">
                        {adminUser ? `${adminUser.firstName} ${adminUser.lastName}` : "Admin"}
                      </span>
                      <Clock className="mr-1 h-4 w-4" />
                      <span>{relatedArticle.readTime || "5 min read"}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => onRelatedArticleClick(relatedArticle.slug)}
                    >
                      Read Article
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

// Loading component
const LoadingState = ({ onBackClick }: { onBackClick: () => void }) => (
  <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-screen">
    <div className="text-center">
      <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
      <h1 className="text-2xl font-bold mb-4">Loading article...</h1>
      <Button onClick={onBackClick}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Blogs
      </Button>
    </div>
  </div>
);

// Error component
const ErrorState = ({ error, onBackClick }: { error: Error | null, onBackClick: () => void }) => (
  <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-screen">
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-4">
        {error ? "Error loading article" : "Article not found"}
      </h1>
      <p className="text-gray-500 mb-6">
        {error ? "There was a problem loading this article. Please try again later." : "The article you're looking for doesn't exist."}
      </p>
      <Button onClick={onBackClick}>
        <ChevronLeft className="mr-2 h-4 w-4" />
        Back to Blogs
      </Button>
    </div>
  </div>
);

// Main component that orchestrates everything
export default function ArticlePage() {
  // Route hooks for both ID and slug patterns
  const [isIdRoute, idParams] = useRoute<{ id: string }>("/article/:id");
  const [isSlugRoute, slugParams] = useRoute<{ slug: string }>("/article/:slug");
  const [, setLocation] = useLocation();
  const [relatedArticles, setRelatedArticles] = useState<BlogPost[]>([]);

  // All hook calls here - before any conditional rendering
  const handleBackClick = () => setLocation("/blogs");
  const handleRelatedArticleClick = (slug: string) => setLocation(`/article/${slug}`);
  
  // Determine which parameter to use (prefer slug if both are present)
  const params = isSlugRoute ? { slug: slugParams?.slug } : { id: idParams?.id };
  const isSlug = isSlugRoute && !!slugParams?.slug;
  
  // Fetch the blog post by ID or slug
  const { data: blogPost, isLoading, error } = useQuery<BlogPost>({
    queryKey: isSlug ? ["/api/blog-posts/slug", params.slug] : ["/api/blog-posts", params.id],
    queryFn: async () => {
      if (isSlug) {
        const res = await fetch(`/api/blog-posts/slug/${params.slug}`);
        if (!res.ok) throw new Error("Failed to fetch blog post");
        return res.json();
      } else {
        if (!params.id) return null as unknown as BlogPost;
        const res = await fetch(`/api/blog-posts/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch blog post");
        return res.json();
      }
    },
    enabled: !!(isSlug ? params.slug : params.id),
  });
  
  // Always fetch admin user, even if blogPost is not loaded yet
  const { data: adminUser } = useQuery({
    queryKey: ["/api/admin/user"],
    queryFn: async () => {
      const res = await fetch("/api/admin/user");
      if (!res.ok) return null;
      return res.json();
    },
  });
  
  // Fetch all blog posts
  const { data: allBlogPosts } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog-posts"],
    queryFn: async () => {
      const res = await fetch("/api/blog-posts");
      if (!res.ok) throw new Error("Failed to fetch blog posts");
      return res.json();
    },
  });
  
  // Set related articles when blog post and all posts are loaded
  useEffect(() => {
    if (blogPost && allBlogPosts) {
      const related = allBlogPosts
        .filter(post => 
          post.id !== blogPost.id && 
          post.category === blogPost.category &&
          post.published
        )
        .slice(0, 3);
      
      setRelatedArticles(related);
    }
  }, [blogPost, allBlogPosts]);

  // Render based on loading state - but all hooks are called before any rendering
  if (isLoading) {
    return <LoadingState onBackClick={handleBackClick} />;
  }

  if (error || !blogPost) {
    return <ErrorState error={error as Error} onBackClick={handleBackClick} />;
  }

  // Main render when everything is loaded
  return (
    <BlogPostContent 
      blogPost={blogPost} 
      adminUser={adminUser} 
      relatedArticles={relatedArticles} 
      onBackClick={handleBackClick}
      onRelatedArticleClick={handleRelatedArticleClick}
    />
  );
}