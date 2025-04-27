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
    title: "Discover the Secrets of Successful Executive Search Firms",
    content: `
      <h2>Discover the Secrets of Successful Executive Search Firms</h2>
      
      <p>In today's competitive business landscape, organizations often seek out specialized assistance to fill key leadership positions. Executive search firms have emerged as vital partners in this process, bringing unique expertise and resources. Understanding how these firms operate can be incredibly advantageous for businesses looking to enhance their hiring strategies.</p>
      
      <h3>Understanding the Role of Executive Search Firms</h3>
      
      <p>Executive search firms serve a crucial function by connecting businesses with top-tier candidates for high-level positions. Their role extends beyond mere recruitment; they act as strategic advisors, ensuring that companies make informed decisions while hiring executives.</p>
      
      <h3>The Importance of Executive Search Firms in Business</h3>
      
      <p>Finding the right leaders is critical for organizational success. Executive search firms not only save time and resources but also help avoid the pitfalls of a misguided hiring process. They bring an outside perspective, often enabling companies to uncover candidates who may not be actively seeking new roles. This proactive approach is particularly valuable in competitive industries where the best talent is often already employed and may not be visible through traditional job postings.</p>
      
      <p>Moreover, executive search firms often have extensive networks and relationships within specific industries, allowing them to tap into a pool of candidates that might otherwise remain hidden. Their expertise in understanding the nuances of various sectors means they can identify leaders who not only possess the required skills but also fit the cultural and strategic vision of the organization.</p>
      
      <h3>Key Functions of Executive Search Firms</h3>
      
      <p>Executive search firms offer a range of services designed to streamline the hiring process:</p>
      
      <ul>
        <li><strong>Market Research:</strong> They conduct thorough research to understand industry trends and identify potential candidates.</li>
        <li><strong>Candidate Assessment:</strong> They evaluate candidates based on criteria that align with the organization's values and goals.</li>
        <li><strong>Confidentiality:</strong> They maintain discretion throughout the search process, protecting both the client's and candidates' interests.</li>
      </ul>
      
      <p>These functions create a strategic bridge between organizations and top talent, ensuring both parties find a perfect match. Additionally, executive search firms often provide valuable insights into compensation trends and market positioning, which can be crucial for companies looking to attract and retain high-caliber executives. By benchmarking against industry standards, they help organizations craft competitive offers that reflect the true value of the roles they are filling.</p>
      
      <p>Furthermore, the relationship between a company and an executive search firm can evolve into a long-term partnership. As businesses grow and change, these firms can assist in succession planning and leadership development, ensuring that organizations are always prepared for future challenges. This ongoing collaboration not only enhances the hiring process but also contributes to the overall strategic planning and growth of the company.</p>
      
      <h3>The Art of Identifying Potential Candidates</h3>
      
      <p>Identifying the right candidates is both an art and a science. Executive search firms employ various techniques to uncover the hidden talent that meets their client's specifications.</p>
      
      <h4>Techniques for Sourcing Top Talent</h4>
      
      <p>To source potential candidates, executive search firms use a variety of innovative methods, including:</p>
      
      <ul>
        <li><strong>Passive Candidate Engagement:</strong> They actively reach out to individuals who may not be actively looking for a job but could be interested.</li>
        <li><strong>Headhunting:</strong> They use specific criteria to identify and approach candidates from competitors.</li>
        <li><strong>Referral Networks:</strong> Leveraging existing connections to gain introductions to high-quality individuals.</li>
      </ul>
      
      <p>These strategies ensure that firms can present their clients with an exclusive shortlist of candidates who are not only qualified but also align with the company culture. Moreover, the use of advanced data analytics can play a crucial role in refining the search process. By analyzing industry trends, candidate backgrounds, and company needs, search firms can make informed decisions that lead to successful placements.</p>
      
      <h4>The Role of Networking in Executive Search</h4>
      
      <p>Networking is pivotal in the executive search process. It expands the reach of search firms, allowing them to tap into a broader pool of candidates. This often includes attending industry conferences, workshops, and utilizing social platforms like LinkedIn.</p>
      
      <p>Through these interactions, search firms can develop relationships with potential candidates in advance, significantly enhancing their ability to fill roles effectively. Additionally, networking helps firms stay updated on industry shifts and emerging talent, enabling them to proactively identify candidates who may soon become available. This proactive approach not only shortens the hiring timeline but also ensures that clients have access to the most relevant and skilled professionals.</p>
      
      <h3>The Selection Process in Executive Search Firms</h3>
      
      <p>Once potential candidates are identified, the selection process begins. This phase is crucial to ensuring candidate suitability for the client's organizational needs.</p>
      
      <h4>The Screening and Interview Process</h4>
      
      <p>The screening process involves meticulous vetting of candidates' backgrounds, qualifications, and experiences. This can include:</p>
      
      <ul>
        <li><strong>Initial Interviews:</strong> Conducting interviews to gauge candidates' skills and cultural fit.</li>
        <li><strong>Reference Checks:</strong> Verifying previous employment and performance through references.</li>
        <li><strong>Assessment Tests:</strong> Utilizing various assessment tools to evaluate leadership potential and problem-solving skills.</li>
      </ul>
      
      <p>After screening, finalists are presented to the clients, giving them a well-prepared pool of candidates to consider for interviews. This presentation often includes detailed reports on each candidate's strengths and weaknesses, along with insights gathered during the screening process. Such thorough documentation not only aids clients in making informed decisions but also highlights the search firm's commitment to transparency and diligence.</p>
      
      <h4>Evaluating Candidate Fit and Potential</h4>
      
      <p>In executive search, cultural fit is just as important as skill set. Search firms work closely with their clients to determine the specific attributes and experiences that will resonate within the organization. This involves:</p>
      
      <ul>
        <li><strong>Behavioral Interviews:</strong> Focusing on past behaviors and decision-making processes.</li>
        <li><strong>Situational Judgement Tests:</strong> Evaluating how candidates might handle real-world scenarios relevant to the position.</li>
      </ul>
      
      <p>This comprehensive evaluation ensures that the chosen candidate will not only fulfill job responsibilities but also thrive in their new environment. Additionally, search firms often incorporate feedback mechanisms that allow for ongoing dialogue between the client and the candidates throughout the selection process. This engagement helps to further assess alignment with the company's values and mission, creating a more holistic view of each candidate's potential impact on the organization.</p>
      
      <p>Moreover, many firms leverage technology and data analytics to enhance their evaluation processes. By analyzing trends and patterns from previous successful placements, they can refine their criteria for candidate selection. This data-driven approach not only increases the likelihood of a successful hire but also provides clients with valuable insights into the evolving landscape of leadership roles within their industry.</p>
      
      <h3>Building Long-Term Relationships with Clients</h3>
      
      <p>The relationship between executive search firms and their clients often extends beyond a single hiring event. Building lasting partnerships is crucial for sustained success.</p>
      
      <h4>The Importance of Client Retention in Executive Search</h4>
      
      <p>Client retention is fundamental for executive search firms. Satisfied clients are likely to return for future hiring needs and provide valuable referrals. By consistently delivering high-quality candidates, firms can solidify their reputation in the industry. Moreover, a strong client base allows firms to gain insights into market trends and shifts, enabling them to adapt their strategies and offerings accordingly.</p>
      
      <h4>Strategies for Maintaining Client Relationships</h4>
      
      <p>Successful search firms employ several strategies to maintain strong client relationships, including:</p>
      
      <ul>
        <li><strong>Regular Communication:</strong> Keeping clients informed at every stage of the search process.</li>
        <li><strong>Feedback Loops:</strong> Gathering feedback after placements to improve services continuously.</li>
        <li><strong>Tailored Services:</strong> Customizing the search process according to the unique needs of each client.</li>
      </ul>
      
      <p>These practices not only foster trust but also create ongoing collaborations that benefit both parties. Additionally, firms often host networking events or workshops that allow clients to connect with industry experts and other business leaders. This not only adds value to the client relationship but also positions the firm as a valuable resource in the broader business community.</p>
      
      <h3>The Future of Executive Search Firms</h3>
      
      <p>The landscape of executive search is evolving quickly, influenced by technological advancements and shifting workforce dynamics. Understanding upcoming trends is essential for firms aiming to stay relevant.</p>
      
      <h4>Emerging Trends in Executive Search</h4>
      
      <p>Several trends are currently shaping the future of executive search, including:</p>
      
      <ul>
        <li><strong>Increased Use of AI:</strong> Leveraging artificial intelligence for data analysis and candidate sourcing.</li>
        <li><strong>Diversity and Inclusion:</strong> Prioritizing diverse candidate slates to cater to the changing expectations of modern organizations.</li>
      </ul>
      
      <p>These trends indicate a shift toward more data-driven and socially conscious hiring practices that many firms are adopting. Moreover, the integration of AI not only streamlines the recruitment process but also enhances the quality of candidate matches by analyzing vast datasets to identify the best-fit individuals for specific roles.</p>
      
      <h4>Adapting to Changes in the Business Landscape</h4>
      
      <p>The business environment is consistently changing; therefore, executive search firms must remain agile. This involves:</p>
      
      <ul>
        <li><strong>Staying Updated on Industry Dynamics:</strong> Constantly researching market changes and emerging skills that organizations require.</li>
        <li><strong>Flexible Methodologies:</strong> Adapting search strategies to accommodate evolving client needs and candidate expectations.</li>
      </ul>
      
      <p>By embracing change, executive search firms can ensure they continue to provide exceptional service and support to their clients as they navigate their hiring challenges.</p>
      
      <h3>Conclusion</h3>
      
      <p>Executive search firms play a vital role in today's competitive talent landscape. By understanding their functions, processes, and the value they bring, organizations can make more informed decisions when seeking assistance with high-level hiring needs.</p>
      
      <p>Partner with Expert Recruitments for your executive search needs.</p>
    `,
    category: "Executive Recruitment",
    author: "James Wilson",
    authorTitle: "Senior Recruitment Specialist",
    authorImage: "https://randomuser.me/api/portraits/men/42.jpg",
    date: "April 27, 2025",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
    tags: ["Executive Search", "Recruitment", "Leadership", "Talent Acquisition", "HR Strategy", "Career Development", "Business Growth"]
  },
  {
    id: 2,
    title: "Top Headhunters in Dubai",
    content: `
      <h2>Top Headhunters in Dubai</h2>
      
      <h3>How We Helped a Tech Firm Hire the Perfect C-Suite Candidate</h3>
      
      <p>Finding the right leadership is crucial for any company's success, but for a rapidly growing tech firm in Dubai, securing a top-tier C-suite executive was proving to be a significant challenge. The company required a visionary leader with deep industry expertise, a proven track record of scaling businesses, and the ability to drive innovation in a competitive market.</p>
      
      <p>Expert Recruitments, one of the leading executive search firms in Dubai, stepped in to streamline the recruitment process and ensure a perfect match. This case study highlights how our strategic approach, industry insights, and extensive network helped this tech firm secure an outstanding leader.</p>
      
      <h3>The Challenge: Hiring the Right C-Suite Executive</h3>
      
      <p>The firm faced several hurdles in its search for the right executive:</p>
      
      <ul>
        <li><strong>Limited Talent Pool:</strong> The demand for high-caliber executives in the tech industry exceeded supply, making it difficult to find candidates with the right mix of experience and vision.</li>
        <li><strong>Market Competition:</strong> Other major players in Dubai and the UAE were also vying for top talent, increasing hiring complexity.</li>
        <li><strong>Cultural Fit:</strong> Beyond skills and experience, the company needed an executive who could seamlessly align with its mission, values, and corporate culture.</li>
      </ul>
      
      <p>Despite internal recruitment efforts, the firm struggled to identify candidates who met all their requirements. That's when they turned to Expert Recruitments, a premier recruitment agency in Dubai specializing in executive searches.</p>
      
      <h3>The Solution: A Targeted Executive Search Approach</h3>
      
      <h4>Step 1: Understanding Client Needs</h4>
      
      <p>Our first step was an in-depth consultation with the firm's leadership team to understand their specific needs, business objectives, and expectations for the role. We developed a comprehensive candidate profile based on the following key criteria:</p>
      
      <ul>
        <li>Proven leadership experience in the tech industry</li>
        <li>Expertise in digital transformation and innovation</li>
        <li>Strong strategic and financial acumen</li>
        <li>Ability to lead cross-functional teams in a dynamic environment</li>
        <li>Cultural alignment with the company's vision</li>
      </ul>
      
      <h4>Step 2: Market Research & Talent Mapping</h4>
      
      <p>Using our proprietary database and industry connections, we conducted a talent mapping exercise to identify potential candidates in Dubai and beyond. As one of the top headhunters in Dubai, we leveraged:</p>
      
      <ul>
        <li>A network of senior executives and passive candidates not actively looking for jobs</li>
        <li>Insights into competitors' leadership structures</li>
        <li>Data-driven assessment tools to shortlist the best prospects</li>
      </ul>
      
      <h4>Step 3: Executive Outreach & Screening</h4>
      
      <p>We engaged in confidential discussions with potential candidates, assessing their experience, leadership style, and long-term career aspirations. Our rigorous screening process included:</p>
      
      <ul>
        <li><strong>Behavioral Interviews:</strong> Evaluating leadership capabilities, problem-solving skills, and strategic mindset.</li>
        <li><strong>Technical Assessments:</strong> Ensuring the candidate's expertise aligned with the firm's technological advancements.</li>
        <li><strong>Cultural Fit Analysis:</strong> Using psychometric assessments and structured interviews to gauge compatibility with the company's culture.</li>
      </ul>
      
      <h4>Step 4: Presenting Shortlisted Candidates</h4>
      
      <p>After a detailed evaluation, we presented a shortlist of three highly qualified candidates, each with unique strengths that met the firm's criteria. We facilitated interviews, provided insights into compensation trends, and assisted in contract negotiations to ensure a smooth hiring process.</p>
      
      <h3>The Outcome: Transformational Leadership and Business Growth</h3>
      
      <p>The selected candidate, a seasoned tech executive with over 15 years of industry experience, seamlessly integrated into the organization and made an immediate impact. Within six months of onboarding:</p>
      
      <ul>
        <li>The company saw a 15% increase in operational efficiency through strategic process optimizations.</li>
        <li>New revenue streams were introduced, boosting profitability by 20%.</li>
        <li>Employee engagement and retention improved due to enhanced leadership and vision alignment.</li>
      </ul>
      
      <p>The success of this placement reinforced Expert Recruitments' reputation as a trusted headhunter in Dubai, specializing in executive search and UAE recruitment.</p>
      
      <h3>Let's Find Your Next Executive Leader</h3>
      
      <p>Hiring the right executive is a game-changer for any business. If your company is struggling to secure top-tier leadership, Expert Recruitments can help. With a proven track record in executive search, we connect you with the best talent to drive your business forward.</p>
      
      <p>Contact us today to find out how we can help you secure the leadership your company deserves.</p>
    `,
    category: "UAE Recruitment",
    author: "Sarah Ahmed",
    authorTitle: "Executive Search Consultant",
    authorImage: "https://randomuser.me/api/portraits/women/36.jpg",
    date: "April 25, 2025",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1582647509771-5aa9755b620d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    tags: ["Executive Search", "Dubai", "UAE", "C-Suite", "Tech Industry", "Case Study", "Leadership"]
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params?.id]);
  
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