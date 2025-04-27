import { Helmet } from "react-helmet";
import { useParams, Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, User, Share2, Bookmark, ThumbsUp, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

// Article data will be moved to a shared location later
import { articleData } from "@/data/articles";

export default function ArticlePage() {
  const params = useParams<{ slug: string }>();
  const [, setLocation] = useLocation();
  
  // Find the article by slug
  const article = articleData.find(article => article.slug === params.slug);
  
  if (!article) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
        <p className="text-gray-600 mb-8">The article you're looking for doesn't exist or has been moved.</p>
        <Button onClick={() => setLocation("/blogs")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Return to All Articles
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{article.title} | Expert Recruitments</title>
        <meta name="description" content={article.excerpt} />
      </Helmet>

      <div className="relative py-12 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gray-50"></div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto mb-8">
            <Link href="/blogs">
              <Button variant="ghost" className="mb-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to All Articles
              </Button>
            </Link>
            
            <div className="mb-8">
              <div className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-4">
                {article.category}
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-gray-800 leading-tight">
                {article.title}
              </h1>
              
              <div className="flex items-center mb-8">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={article.authorImage} alt={article.author} />
                  <AvatarFallback>{article.author.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{article.author}</div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <span>{article.date}</span>
                    <span className="mx-2">•</span>
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{article.readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-0 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Featured image */}
          <div className="mb-10 rounded-xl overflow-hidden">
            <img 
              src={article.image} 
              alt={article.title} 
              className="w-full h-auto aspect-[16/9] object-cover"
            />
          </div>
          
          {/* Article content */}
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar - social sharing + sticky */}
            <div className="md:w-16">
              <div className="md:sticky md:top-24 flex md:flex-col items-center gap-4 mb-6">
                <Button variant="outline" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
                  <ThumbsUp className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
                  <Share2 className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
                  <Bookmark className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary">
                  <MessageSquare className="h-5 w-5" />
                </Button>
              </div>
            </div>
            
            {/* Main content column */}
            <div className="flex-1">
              <div className="prose prose-lg max-w-none">
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
              </div>
              
              <Separator className="my-10" />
              
              {/* Tags section */}
              <div className="mb-10">
                <h3 className="text-lg font-bold mb-4">Related Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <Link key={index} href={`/blogs?tag=${tag}`}>
                      <Button variant="outline" size="sm" className="hover:bg-primary/10 hover:text-primary">
                        {tag}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* Author bio */}
              <Card className="mb-10">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={article.authorImage} alt={article.author} />
                      <AvatarFallback>{article.author.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-bold mb-2">About {article.author}</h3>
                      <p className="text-gray-600 mb-4">{article.authorBio}</p>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Related articles */}
              {article.relatedArticles && article.relatedArticles.length > 0 && (
                <div className="mb-10">
                  <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    {article.relatedArticles.map((related, index) => (
                      <Card key={index} className="overflow-hidden">
                        <Link href={`/article/${related.slug}`}>
                          <div className="h-40 overflow-hidden">
                            <img
                              src={related.image}
                              alt={related.title}
                              className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                            />
                          </div>
                          <CardContent className="p-4">
                            <div className="text-sm font-medium text-primary mb-2">{related.category}</div>
                            <h3 className="font-bold mb-2 hover:text-primary transition-colors">{related.title}</h3>
                            <div className="flex items-center text-sm text-gray-500">
                              <User className="mr-1 h-4 w-4" />
                              <span className="mr-4">{related.author}</span>
                              <Clock className="mr-1 h-4 w-4" />
                              <span>{related.readTime}</span>
                            </div>
                          </CardContent>
                        </Link>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Comment section can be added here */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}