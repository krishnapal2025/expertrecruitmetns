import { useState, useEffect } from "react";
import { useLocation, useRoute, Link } from "wouter";
import { Helmet } from "react-helmet";
import { ChevronLeft, Clock, User, Share2, BookmarkPlus, Calendar, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

type Article = {
  id: number;
  title: string;
  content: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  image: string;
  excerpt?: string;
  authorImage?: string;
  authorTitle?: string;
  tags?: string[];
};

// Sample article content - in a real application, this would come from an API
const articlesData: Article[] = [
  {
    id: 1,
    title: "Executive Search Firms: Find Top Talent",
    content: `
      <h2>Executive Search Firms: The Key to Finding Top Talent</h2>
      
      <p>In today's competitive business landscape, finding the right executive leadership can make or break a company's success. Executive search firms play a crucial role in this process, offering specialized expertise in identifying, assessing, and recruiting top-tier talent for leadership positions.</p>
      
      <h3>What Are Executive Search Firms?</h3>
      
      <p>Executive search firms, also known as headhunters or recruiters, are professional services firms that specialize in recruiting executives and other senior personnel for their client companies. Unlike traditional recruitment agencies, executive search firms typically work on a retained basis, meaning they are paid a fee regardless of whether a placement is made.</p>
      
      <p>These firms operate at the highest levels of recruitment, focusing on C-suite positions, board members, and other senior leadership roles that command substantial compensation packages and have significant impact on organizational strategy and performance.</p>
      
      <h3>The Executive Search Process</h3>
      
      <p>The executive search process is thorough and methodical, designed to identify the best possible candidates for leadership roles. Here's how it typically works:</p>
      
      <ol>
        <li><strong>Client Consultation:</strong> The search firm meets with the client to understand the company's culture, strategic goals, and the specific requirements for the position.</li>
        <li><strong>Position Specification:</strong> A detailed job description is developed, outlining responsibilities, qualifications, and performance expectations.</li>
        <li><strong>Market Research:</strong> The search firm conducts extensive research to identify target companies and potential candidates.</li>
        <li><strong>Candidate Identification:</strong> Through their networks, databases, and research, search consultants identify a pool of qualified candidates.</li>
        <li><strong>Candidate Assessment:</strong> Potential candidates are thoroughly vetted through interviews, reference checks, and sometimes psychometric testing.</li>
        <li><strong>Client Presentations:</strong> The most qualified candidates are presented to the client with detailed profiles and assessments.</li>
        <li><strong>Interview Process:</strong> The client interviews selected candidates, with the search firm facilitating the process.</li>
        <li><strong>Negotiation and Placement:</strong> Once a final candidate is selected, the search firm helps negotiate terms and ensures a smooth transition.</li>
      </ol>
      
      <h3>Why Use an Executive Search Firm?</h3>
      
      <p>Organizations engage executive search firms for several compelling reasons:</p>
      
      <ul>
        <li><strong>Access to Hidden Talent:</strong> Many top executives aren't actively job seeking and won't respond to job postings. Search firms have the networks and relationships to reach these passive candidates.</li>
        <li><strong>Expertise and Objectivity:</strong> Search consultants bring specialized knowledge of specific industries and functions, as well as an objective perspective on candidate evaluation.</li>
        <li><strong>Confidentiality:</strong> For sensitive searches (such as replacing a current executive), search firms can maintain discretion and confidentiality.</li>
        <li><strong>Time Efficiency:</strong> Executive searches are time-intensive. Search firms handle the process, allowing client executives to focus on their core responsibilities.</li>
        <li><strong>Reduced Risk:</strong> A bad executive hire can be extremely costly. Search firms help mitigate this risk through thorough vetting and assessment.</li>
      </ul>
      
      <h3>Choosing the Right Executive Search Firm</h3>
      
      <p>When selecting an executive search firm, consider these factors:</p>
      
      <ul>
        <li><strong>Industry Expertise:</strong> Choose a firm with experience and networks in your specific industry.</li>
        <li><strong>Geographic Reach:</strong> Ensure the firm can access talent in relevant markets, whether local, national, or global.</li>
        <li><strong>Track Record:</strong> Ask for case studies and references from similar searches.</li>
        <li><strong>Process and Methodology:</strong> Understand how the firm conducts searches and evaluates candidates.</li>
        <li><strong>Chemistry and Communication:</strong> The relationship with your search consultant is important; ensure there's good chemistry and clear communication.</li>
      </ul>
      
      <h3>The Future of Executive Search</h3>
      
      <p>The executive search industry continues to evolve with technological advancements and changing workplace dynamics. AI and data analytics are increasingly used to identify potential candidates and predict success factors. Remote work has expanded the potential talent pool across geographical boundaries. Despite these changes, the core value of executive search firms remains their human expertise—their ability to understand organizational culture, leadership needs, and the nuanced qualities that make a successful executive.</p>
      
      <h3>Conclusion</h3>
      
      <p>Executive search firms play a vital role in helping organizations find the leadership talent they need to succeed. By leveraging their expertise, networks, and methodical processes, these firms help companies make crucial hiring decisions with confidence. In an increasingly competitive talent landscape, partnering with the right executive search firm can be a strategic advantage in building a strong leadership team.</p>
    `,
    category: "Executive Recruitment",
    author: "James Wilson",
    authorTitle: "Senior Recruitment Specialist",
    authorImage: "https://randomuser.me/api/portraits/men/42.jpg",
    date: "April 24, 2025",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
    tags: ["Executive Search", "Recruitment", "Leadership", "Talent Acquisition", "HR Strategy"]
  }
];

export default function ArticlePage() {
  const [, params] = useRoute<{ id: string }>("/article/:id");
  const [, setLocation] = useLocation();
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  
  useEffect(() => {
    // In a real app, fetch the article from an API using the ID
    if (params?.id) {
      const articleId = parseInt(params.id);
      const foundArticle = articlesData.find(a => a.id === articleId);
      
      if (foundArticle) {
        setArticle(foundArticle);
        
        // Find related articles by category (in a real app, this would be handled by the API)
        const related = articlesData.filter(a => 
          a.id !== articleId && a.category === foundArticle.category
        ).slice(0, 3);
        
        setRelatedArticles(related);
      } else {
        // If article not found, redirect to blog listing
        setLocation("/blogs");
      }
    }
  }, [params, setLocation]);
  
  if (!article) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading article...</h1>
          <Button onClick={() => setLocation("/blogs")}>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>{article.title} | Expert Recruitments LLC</title>
        <meta name="description" content={article.excerpt || article.content.substring(0, 160)} />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        {/* Back button and breadcrumbs */}
        <div className="mb-8">
          <Button variant="ghost" onClick={() => setLocation("/blogs")} className="pl-0 text-gray-600 hover:text-primary">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Button>
        </div>
        
        {/* Article header */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="text-sm font-medium text-primary mb-2">{article.category}</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-6">{article.title}</h1>
          
          <div className="flex items-center mb-8">
            <Avatar className="h-10 w-10 mr-4">
              {article.authorImage ? (
                <img src={article.authorImage} alt={article.author} />
              ) : (
                <AvatarFallback>{article.author.charAt(0)}</AvatarFallback>
              )}
            </Avatar>
            <div>
              <div className="font-medium">{article.author}</div>
              {article.authorTitle && (
                <div className="text-sm text-gray-500">{article.authorTitle}</div>
              )}
            </div>
            <div className="ml-auto flex items-center text-sm text-gray-500">
              <Calendar className="mr-1 h-4 w-4" />
              <span className="mr-4">{article.date}</span>
              <Clock className="mr-1 h-4 w-4" />
              <span>{article.readTime}</span>
            </div>
          </div>
          
          {/* Featured image */}
          <div className="rounded-lg overflow-hidden h-64 md:h-96 mb-8">
            <img 
              src={article.image} 
              alt={article.title} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Article content */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{ __html: article.content }}></div>
          
          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t">
              <div className="flex items-center flex-wrap gap-2">
                <Tag className="h-4 w-4 text-gray-500 mr-2" />
                {article.tags.map((tag, index) => (
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
                  {article.authorImage ? (
                    <img src={article.authorImage} alt={article.author} />
                  ) : (
                    <AvatarFallback className="text-3xl">{article.author.charAt(0)}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold mb-2">About {article.author}</h3>
                  <p className="text-gray-700 mb-4">
                    {article.authorTitle || "Recruitment Specialist"} at Expert Recruitments LLC with expertise in talent acquisition and executive search. Passionate about connecting organizations with exceptional leadership talent.
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
                      src={relatedArticle.image}
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
                      <span className="mr-4">{relatedArticle.author}</span>
                      <Clock className="mr-1 h-4 w-4" />
                      <span>{relatedArticle.readTime}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setLocation(`/article/${relatedArticle.id}`)}
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
}