import { Helmet } from "react-helmet";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, ArrowRight, Tag, BookOpen, TrendingUp, Briefcase, Award, Search, Filter } from "lucide-react";

// Sample career advice articles
const careerArticles = [
  {
    id: "1",
    title: "How to Make a Career Change at Any Age",
    category: "Career Transition",
    excerpt: "Considering a career change can be daunting, especially as you advance in your career. This guide provides practical steps to successfully transition to a new industry or role.",
    content: [
      "Transitioning to a new career path can seem overwhelming, but with proper planning and execution, it's achievable at any stage in your professional life. Here's a strategic approach to making a successful career change.",
      "Start by conducting a thorough self-assessment of your transferable skills, values, and interests. Identify which of your existing skills can translate to your target industry and what new skills you'll need to develop.",
      "Research emerging industries and roles that align with your interests and strengths. Conduct informational interviews with professionals in your target field to gain insider perspectives and build your network.",
      "Create a strategic education plan to fill knowledge gaps, whether through formal education, certifications, online courses, or self-directed learning. Focus on acquiring both technical and soft skills relevant to your new field.",
      "Update your resume and online profiles to emphasize transferable skills and relevant experiences. Frame your previous experience in terms that highlight its relevance to your new career direction.",
      "Consider a transitional approach, such as a lateral move within your current company, part-time work, freelancing, or volunteer opportunities in your target field to build experience and demonstrate commitment.",
      "Develop a compelling career change narrative that explains your motivation, connects your past experience to your new direction, and conveys your enthusiasm for the new challenge.",
      "Be prepared for potential financial adjustments during your transition. Create a financial plan that accounts for possible reduced income during the transition period and any costs associated with additional training.",
      "With thorough preparation, strategic networking, and a commitment to continuous learning, you can successfully navigate a career change at any stage of your professional journey."
    ],
    date: "April 25, 2025",
    readTime: "9 min read",
    tags: ["Career Change", "Professional Development"],
    author: {
      name: "Dr. Sarah Johnson",
      title: "Career Development Specialist",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    }
  },
  {
    id: "2",
    title: "10 Key Skills Employers Will Look for in 2026",
    category: "Skills Development",
    excerpt: "As industries continue to evolve with technological advancements, employers are prioritizing specific skills that drive innovation and adaptability.",
    content: [
      "The professional landscape continues to transform rapidly, with employers increasingly seeking candidates who demonstrate both technical proficiency and advanced soft skills. Here are the ten most sought-after skills for the coming year.",
      "Artificial Intelligence Literacy: While not everyone needs to be an AI engineer, understanding how to effectively work alongside AI tools and interpret their outputs is becoming essential across industries.",
      "Data Analysis and Interpretation: The ability to analyze data, extract meaningful insights, and use them to drive strategic decisions will be valuable in virtually every sector.",
      "Digital Collaboration: As remote and hybrid work models persist, proficiency with digital collaboration tools and virtual team management is increasingly important.",
      "Emotional Intelligence: The ability to understand and manage emotions—both your own and others'—facilitates effective leadership, teamwork, and client relationships.",
      "Adaptability and Resilience: In a rapidly changing business environment, employers seek professionals who can pivot quickly, embrace change, and maintain productivity during uncertainty.",
      "Critical Thinking and Complex Problem Solving: The ability to analyze situations, evaluate options, and develop innovative solutions remains among the most valuable skills across industries.",
      "Cybersecurity Awareness: As digital threats evolve, basic understanding of cybersecurity principles is becoming essential for professionals at all levels.",
      "Sustainable Thinking: With growing emphasis on environmental and social responsibility, the ability to incorporate sustainability considerations into business decisions is increasingly valued.",
      "Cross-Cultural Communication: In our globalized economy, effective communication across different cultures and contexts is crucial for building relationships and navigating international markets.",
      "Continuous Learning Mindset: Perhaps most importantly, employers seek candidates who demonstrate a commitment to ongoing skill development and adaptability to emerging trends.",
      "By prioritizing the development of these skills, professionals can position themselves for success in an evolving job market, regardless of their specific industry or role."
    ],
    date: "April 18, 2025",
    readTime: "7 min read",
    tags: ["Future Skills", "Professional Development"],
    author: {
      name: "Michael Chen",
      title: "Workforce Trends Analyst",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    }
  },
  {
    id: "3",
    title: "Building a Personal Brand That Gets You Noticed",
    category: "Personal Branding",
    excerpt: "In today's competitive job market, a strong personal brand can be the difference between getting overlooked and getting opportunities.",
    content: [
      "Your personal brand is how you present yourself professionally to the world. It encompasses your values, expertise, and unique perspective. A well-crafted personal brand helps you stand out in your industry and attracts career opportunities aligned with your goals.",
      "Start by defining your unique value proposition—what specific skills, experiences, and perspectives do you bring that others don't? Consider conducting a personal SWOT analysis to identify your strengths, weaknesses, opportunities, and threats.",
      "Consistency is key to effective personal branding. Ensure your professional presence is cohesive across all platforms, from your resume and LinkedIn profile to your personal website and social media accounts used for professional purposes.",
      "Develop thought leadership by sharing valuable insights related to your industry. This might include writing articles, creating videos, speaking at events, or engaging thoughtfully in industry discussions on social media platforms.",
      "Strategic networking plays a crucial role in building your personal brand. Identify key professional communities, both online and offline, where you can meaningfully contribute and connect with others in your field.",
      "Seek opportunities to demonstrate your expertise, whether through volunteering for high-visibility projects at work, contributing to industry publications, or speaking at conferences and webinars.",
      "Request and showcase recommendations and testimonials from colleagues, clients, and supervisors that highlight your key strengths and the results you've achieved.",
      "Regularly audit and refine your personal brand as your career evolves. Ensure that your personal brand accurately reflects your current professional focus and aspirations.",
      "Remember that authenticity is essential—your personal brand should be an honest reflection of who you are professionally, not a fabricated persona. By thoughtfully developing and consistently expressing your personal brand, you'll increase your visibility and open doors to new opportunities."
    ],
    date: "April 12, 2025",
    readTime: "8 min read",
    tags: ["Personal Branding", "Career Growth"],
    author: {
      name: "Jessica Martinez",
      title: "Personal Brand Strategist",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg"
    }
  },
  {
    id: "4",
    title: "Navigating Workplace Politics Successfully",
    category: "Workplace Success",
    excerpt: "Office politics are inevitable in any organization. Learn how to navigate them effectively while maintaining your integrity and advancing your career.",
    content: [
      "Workplace politics—the informal networks of relationships and power dynamics within organizations—exist in every workplace. While some professionals try to avoid office politics altogether, strategic engagement can actually enhance your effectiveness and career progression when approached ethically.",
      "Begin by observing the informal power structures in your organization. Notice who influences decisions, how information flows, and which alliances exist. This awareness will help you navigate the environment more effectively.",
      "Build authentic relationships across all levels of the organization. Make connections based on genuine interest and mutual respect rather than purely strategic considerations.",
      "Focus on developing your emotional intelligence, particularly your ability to read social cues, understand others' motivations, and manage your own emotional responses to challenging situations.",
      "Practice strategic communication by considering the what, when, how, and to whom of your messages. Be transparent about your intentions while being mindful of how your communication may be perceived.",
      "When conflicts arise, address them directly but diplomatically. Focus on understanding different perspectives and finding solutions that acknowledge everyone's concerns and interests.",
      "Maintain your integrity at all times. Never engage in behaviors that compromise your values, such as spreading gossip, taking credit for others' work, or forming alliances based on excluding others.",
      "Learn to effectively manage up by understanding your supervisor's priorities, communication preferences, and challenges. Make their success part of your mission while maintaining good relationships with peers.",
      "Remember that political savvy is about building influence through trust and respect, not manipulation. By navigating workplace politics with integrity and emotional intelligence, you can advance your career while contributing positively to your organization's culture."
    ],
    date: "April 5, 2025",
    readTime: "10 min read",
    tags: ["Workplace Dynamics", "Professional Communication"],
    author: {
      name: "Dr. Robert Williams",
      title: "Organizational Psychologist",
      avatar: "https://randomuser.me/api/portraits/men/76.jpg"
    }
  },
  {
    id: "5",
    title: "Effective Salary Negotiation Strategies",
    category: "Career Development",
    excerpt: "Negotiating your salary can significantly impact your lifetime earnings. Learn proven tactics to confidently advocate for your worth.",
    content: [
      "Salary negotiation is a critical professional skill that can significantly impact your financial trajectory. Many professionals leave money on the table by failing to negotiate effectively or skipping negotiation altogether. Here's how to approach this important conversation strategically.",
      "Before entering any negotiation, research thoroughly to establish your market value. Use resources like industry salary reports, professional associations, and networking to determine the typical compensation range for your role, industry, and location.",
      "Prepare to articulate your value proposition—what specific skills, experiences, and accomplishments make you valuable to the organization? Document quantifiable achievements that demonstrate your impact.",
      "Consider the full compensation package, not just the base salary. Benefits, bonuses, equity, flexible work arrangements, professional development opportunities, and other perks can significantly enhance your overall compensation.",
      "Practice your negotiation conversation in advance, anticipating potential objections and preparing thoughtful responses. Consider role-playing with a trusted friend or mentor to build confidence.",
      "When receiving an offer, express appreciation and enthusiasm before transitioning to negotiation. Ask for time to consider the offer, even if you're prepared to negotiate immediately, as this demonstrates thoughtful consideration.",
      "During negotiation, start higher than your target figure to leave room for compromise. Frame your counteroffer in terms of the value you bring rather than personal needs or industry standards alone.",
      "Listen actively during the negotiation process, paying attention to what the employer values most. This insight can help you identify alternative areas for negotiation if there's limited flexibility on base salary.",
      "Get the final agreement in writing, including all components of the compensation package and any special arrangements discussed during negotiation.",
      "Remember that successful negotiation creates a win-win scenario where you feel fairly compensated and the employer gains a committed, valued employee. With preparation and practice, you can approach salary negotiations with confidence and professionalism."
    ],
    date: "March 30, 2025",
    readTime: "8 min read",
    tags: ["Salary Negotiation", "Career Advice"],
    author: {
      name: "Alexandra Thompson",
      title: "Compensation Specialist",
      avatar: "https://randomuser.me/api/portraits/women/33.jpg"
    }
  },
  {
    id: "6",
    title: "Mastering the Remote Work Environment",
    category: "Remote Work",
    excerpt: "Remote work offers flexibility but comes with unique challenges. Discover strategies to stay productive, visible, and balanced while working from anywhere.",
    content: [
      "Remote work has evolved from a trend to a permanent feature of the professional landscape. While it offers significant benefits like flexibility and eliminated commutes, it also presents distinct challenges. Mastering these challenges is essential for long-term remote work success.",
      "Create a dedicated workspace that supports productivity and helps maintain work-life boundaries. Ideally, this should be a separate room or area used exclusively for work, with ergonomic furniture and good lighting.",
      "Establish clear routines and boundaries to structure your day and prevent work from bleeding into personal time. This includes consistent working hours, morning rituals that replace commute time, and defined end-of-day practices.",
      "Invest in the right technology and tools, including reliable internet, appropriate hardware, collaboration software, and cybersecurity measures. Being tech-savvy is increasingly important for remote workers.",
      "Develop strong virtual communication skills, being explicit about expectations, deadlines, and feedback since non-verbal cues are limited in digital interactions. Consider communication preferences and time zones when working with distributed teams.",
      "Combat isolation by proactively building connections with colleagues through virtual coffee breaks, collaborative projects, and regular check-ins. Also, consider local coworking spaces or community groups to provide in-person social interaction.",
      "Maintain visibility with your organization by documenting accomplishments, sharing progress updates, and actively participating in virtual meetings. Ensure your contributions are recognized despite physical distance.",
      "Prioritize your physical and mental wellbeing by incorporating movement throughout your day, stepping outside regularly, and practicing mindfulness to manage potential stress or loneliness.",
      "Seek opportunities for professional development and advancement, which may require more intentionality in a remote environment. Advocate for training, networking, and growth opportunities.",
      "With thoughtful strategies and continuous adaptation, remote work can offer not just flexibility but also increased productivity, better work-life integration, and career advancement on your terms."
    ],
    date: "March 22, 2025",
    readTime: "9 min read",
    tags: ["Remote Work", "Productivity"],
    author: {
      name: "David Okafor",
      title: "Remote Work Strategist",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg"
    }
  }
];

// Career resource recommendations
const careerResources = [
  {
    title: "Resume Builder",
    description: "Create a professional resume with our easy-to-use templates",
    link: "/resources/create-resume",
    icon: <FileText className="h-6 w-6 text-[#5372f1]" />
  },
  {
    title: "Interview Preparation",
    description: "Practice with common interview questions and expert tips",
    link: "/resources/interview-prep",
    icon: <MessageSquare className="h-6 w-6 text-[#5372f1]" />
  },
  {
    title: "Salary Guides",
    description: "Research competitive compensation for your role and location",
    link: "/resources/salary-guides",
    icon: <DollarSign className="h-6 w-6 text-[#5372f1]" />
  },
  {
    title: "Job Board",
    description: "Browse the latest openings matched to your skills and experience",
    link: "/job-board",
    icon: <Briefcase className="h-6 w-6 text-[#5372f1]" />
  }
];

// Define popular search topics for the filter
const popularTopics = [
  "Career Change",
  "Remote Work",
  "Leadership",
  "Work-Life Balance",
  "Job Search",
  "Networking",
  "Personal Branding",
  "Salary Negotiation",
  "Interview Tips",
  "Resume Writing"
];

// Import missing Lucide icons
import { FileText, MessageSquare, DollarSign } from "lucide-react";

export default function CareerAdvicePage() {
  const [selectedArticle, setSelectedArticle] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  // Handle article selection
  const handleArticleSelect = (article: any) => {
    setSelectedArticle(article);
    window.scrollTo(0, 0);
  };
  
  // Filter articles based on search and category
  const getFilteredArticles = () => {
    return careerArticles.filter(article => {
      // Filter by search query
      const matchesSearch = searchQuery === "" || 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Filter by category
      const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  };
  
  // Get unique categories for filter
  const categories = ["all", ...new Set(careerArticles.map(article => article.category))];
  
  return (
    <>
      <Helmet>
        <title>Career Advice | Expert Recruitments LLC</title>
        <meta name="description" content="Expert career advice, industry insights, and professional development resources to help you advance in your career journey." />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-[#5372f1]">Career Advice & Insights</h1>
          <p className="text-lg text-gray-600 mb-8">Expert guidance to help you navigate your career journey and achieve your professional goals.</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            <div className="lg:col-span-2">
              {/* Article Content or Articles List */}
              {selectedArticle ? (
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                  <Button 
                    variant="outline" 
                    className="mb-6" 
                    onClick={() => setSelectedArticle(null)}
                  >
                    ← Back to Articles
                  </Button>
                  
                  <h2 className="text-3xl font-bold mb-3 text-[#5372f1]">{selectedArticle.title}</h2>
                  
                  <div className="flex items-center mb-6">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={selectedArticle.author.avatar} alt={selectedArticle.author.name} />
                      <AvatarFallback>{selectedArticle.author.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{selectedArticle.author.name}</p>
                      <p className="text-sm text-gray-500">{selectedArticle.author.title}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 mb-6">
                    <div className="flex items-center mr-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      {selectedArticle.date}
                    </div>
                    <div className="flex items-center mr-4">
                      <Clock className="h-4 w-4 mr-1" />
                      {selectedArticle.readTime}
                    </div>
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-1" />
                      {selectedArticle.category}
                    </div>
                  </div>
                  
                  <div className="prose prose-blue max-w-none mb-6">
                    {selectedArticle.content.map((paragraph: string, index: number) => (
                      <p key={index} className="mb-4 text-gray-700">{paragraph}</p>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedArticle.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="font-semibold text-lg mb-3">Related Articles</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {careerArticles
                        .filter((article) => article.id !== selectedArticle.id)
                        .slice(0, 2)
                        .map((article) => (
                          <Card key={article.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleArticleSelect(article)}>
                            <CardHeader className="p-4 pb-2">
                              <CardTitle className="text-base font-medium line-clamp-2">{article.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-0">
                              <p className="text-sm text-gray-500 line-clamp-2">{article.excerpt}</p>
                            </CardContent>
                          </Card>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="relative flex-grow">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input 
                        className="pl-10" 
                        placeholder="Search for career advice..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-gray-500" />
                      <select 
                        className="border rounded-md p-2 text-sm bg-white"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                      >
                        {categories.map((category) => (
                          <option key={category} value={category}>
                            {category === "all" ? "All Categories" : category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {getFilteredArticles().length > 0 ? (
                    getFilteredArticles().map((article) => (
                      <Card key={article.id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleArticleSelect(article)}>
                        <CardHeader className="p-5 pb-3">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-xl font-bold text-[#5372f1]">{article.title}</CardTitle>
                            <Badge variant="outline" className="ml-2">{article.category}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="p-5 pt-0">
                          <p className="text-gray-600 mb-4">{article.excerpt}</p>
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <div className="flex items-center mr-4">
                              <Calendar className="h-4 w-4 mr-1" />
                              {article.date}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {article.readTime}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {article.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className="p-5 pt-0 flex justify-between items-center">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={article.author.avatar} alt={article.author.name} />
                              <AvatarFallback>{article.author.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">{article.author.name}</span>
                          </div>
                          <Button variant="ghost" size="sm" className="text-[#5372f1] hover:text-[#4060e0]">
                            Read More <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border">
                      <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No Articles Found</h3>
                      <p className="text-gray-500 mb-4">Try adjusting your search criteria or browse a different category.</p>
                      <Button onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}>
                        Reset Filters
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="space-y-6">
              {/* Sidebar with resources and popular topics */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Career Resources</CardTitle>
                  <CardDescription>Tools to help you advance your career</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <ul className="space-y-3">
                    {careerResources.map((resource, index) => (
                      <li key={index}>
                        <a 
                          href={resource.link} 
                          className="flex items-start p-3 rounded-md hover:bg-gray-50 transition-colors"
                        >
                          <span className="mt-0.5 mr-3">{resource.icon}</span>
                          <div>
                            <h4 className="font-medium">{resource.title}</h4>
                            <p className="text-sm text-gray-500">{resource.description}</p>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Popular Topics</CardTitle>
                  <CardDescription>Trending professional development areas</CardDescription>
                </CardHeader>
                <CardContent className="pt-2">
                  <div className="flex flex-wrap gap-2">
                    {popularTopics.map((topic, index) => (
                      <Badge 
                        key={index} 
                        variant="outline"
                        className="cursor-pointer hover:bg-[#5372f1]/5"
                        onClick={() => setSearchQuery(topic)}
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#5372f1]/5 border-[#5372f1]/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg text-[#5372f1]">Career Growth Assessment</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-gray-700 mb-4">Take our 5-minute assessment to identify your strengths and growth opportunities.</p>
                  <Button className="w-full bg-[#5372f1] hover:bg-[#4060e0]">Start Assessment</Button>
                </CardContent>
              </Card>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-[#5372f1]" />
                  Trending in Careers
                </h3>
                <ul className="space-y-3">
                  <li className="border-b pb-2">
                    <a href="#" className="text-gray-700 hover:text-[#5372f1]">The Rise of AI in Recruitment Processes</a>
                  </li>
                  <li className="border-b pb-2">
                    <a href="#" className="text-gray-700 hover:text-[#5372f1]">How to Showcase Soft Skills in Your Resume</a>
                  </li>
                  <li className="border-b pb-2">
                    <a href="#" className="text-gray-700 hover:text-[#5372f1]">Navigating the Four-Day Work Week Trend</a>
                  </li>
                  <li className="border-b pb-2">
                    <a href="#" className="text-gray-700 hover:text-[#5372f1]">Freelancing vs. Full-Time: Pros and Cons</a>
                  </li>
                  <li>
                    <a href="#" className="text-gray-700 hover:text-[#5372f1]">Upskilling Strategies for Mid-Career Professionals</a>
                  </li>
                </ul>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Need Personalized Advice?</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                  <p className="text-gray-700 mb-4">Our career consultants can provide tailored guidance for your specific situation.</p>
                  <Button variant="outline" className="w-full">Schedule Consultation</Button>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Separator className="my-12" />
          
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center">Career Development Pathways</h2>
            <Tabs defaultValue="beginner" className="w-full">
              <div className="flex justify-center mb-6">
                <TabsList>
                  <TabsTrigger value="beginner">Early Career</TabsTrigger>
                  <TabsTrigger value="mid-career">Mid-Career</TabsTrigger>
                  <TabsTrigger value="senior">Senior Level</TabsTrigger>
                  <TabsTrigger value="executive">Executive</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="beginner" className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-semibold mb-3 text-[#5372f1]">Early Career Development (0-3 Years)</h3>
                <p className="text-gray-700 mb-4">Focus on building foundational skills and understanding your industry landscape.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start">
                    <Badge className="mt-1 mr-3 bg-[#5372f1]">1</Badge>
                    <div>
                      <h4 className="font-medium">Build Technical Proficiency</h4>
                      <p className="text-sm text-gray-600">Master the core skills required for your role and stay updated on industry tools.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Badge className="mt-1 mr-3 bg-[#5372f1]">2</Badge>
                    <div>
                      <h4 className="font-medium">Develop Professional Network</h4>
                      <p className="text-sm text-gray-600">Connect with colleagues, join industry groups, and find potential mentors.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Badge className="mt-1 mr-3 bg-[#5372f1]">3</Badge>
                    <div>
                      <h4 className="font-medium">Seek Regular Feedback</h4>
                      <p className="text-sm text-gray-600">Actively request and implement feedback to accelerate your professional growth.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Badge className="mt-1 mr-3 bg-[#5372f1]">4</Badge>
                    <div>
                      <h4 className="font-medium">Explore Different Areas</h4>
                      <p className="text-sm text-gray-600">Volunteer for varied projects to discover your strengths and interests.</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-2">View Early Career Resources</Button>
              </TabsContent>
              
              <TabsContent value="mid-career" className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-semibold mb-3 text-[#5372f1]">Mid-Career Growth (4-10 Years)</h3>
                <p className="text-gray-700 mb-4">Deepen your expertise and begin developing leadership capabilities.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start">
                    <Badge className="mt-1 mr-3 bg-[#5372f1]">1</Badge>
                    <div>
                      <h4 className="font-medium">Develop Specialized Expertise</h4>
                      <p className="text-sm text-gray-600">Focus on becoming recognized for specific areas of knowledge or skill.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Badge className="mt-1 mr-3 bg-[#5372f1]">2</Badge>
                    <div>
                      <h4 className="font-medium">Build Leadership Skills</h4>
                      <p className="text-sm text-gray-600">Take on projects that require team coordination and stakeholder management.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Badge className="mt-1 mr-3 bg-[#5372f1]">3</Badge>
                    <div>
                      <h4 className="font-medium">Mentor Junior Colleagues</h4>
                      <p className="text-sm text-gray-600">Share your knowledge while developing your coaching abilities.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Badge className="mt-1 mr-3 bg-[#5372f1]">4</Badge>
                    <div>
                      <h4 className="font-medium">Expand Professional Network</h4>
                      <p className="text-sm text-gray-600">Develop relationships beyond your immediate team and company.</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-2">View Mid-Career Resources</Button>
              </TabsContent>
              
              <TabsContent value="senior" className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-semibold mb-3 text-[#5372f1]">Senior Level Development (10-15 Years)</h3>
                <p className="text-gray-700 mb-4">Focus on strategic thinking and developing others while managing broader responsibilities.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start">
                    <Badge className="mt-1 mr-3 bg-[#5372f1]">1</Badge>
                    <div>
                      <h4 className="font-medium">Develop Strategic Perspective</h4>
                      <p className="text-sm text-gray-600">Understand how your function contributes to broader organizational goals.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Badge className="mt-1 mr-3 bg-[#5372f1]">2</Badge>
                    <div>
                      <h4 className="font-medium">Lead Cross-Functional Initiatives</h4>
                      <p className="text-sm text-gray-600">Drive projects that require collaboration across different teams or departments.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Badge className="mt-1 mr-3 bg-[#5372f1]">3</Badge>
                    <div>
                      <h4 className="font-medium">Cultivate Team Development</h4>
                      <p className="text-sm text-gray-600">Focus on building strong teams and developing future leaders.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Badge className="mt-1 mr-3 bg-[#5372f1]">4</Badge>
                    <div>
                      <h4 className="font-medium">External Representation</h4>
                      <p className="text-sm text-gray-600">Represent your organization at industry events or in professional communities.</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-2">View Senior Level Resources</Button>
              </TabsContent>
              
              <TabsContent value="executive" className="bg-white p-6 rounded-lg shadow-sm border">
                <h3 className="text-xl font-semibold mb-3 text-[#5372f1]">Executive Development (15+ Years)</h3>
                <p className="text-gray-700 mb-4">Focus on organizational leadership, vision-setting, and industry influence.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start">
                    <Badge className="mt-1 mr-3 bg-[#5372f1]">1</Badge>
                    <div>
                      <h4 className="font-medium">Organizational Leadership</h4>
                      <p className="text-sm text-gray-600">Shape company culture, vision, and long-term strategic direction.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Badge className="mt-1 mr-3 bg-[#5372f1]">2</Badge>
                    <div>
                      <h4 className="font-medium">External Partnerships</h4>
                      <p className="text-sm text-gray-600">Develop strategic relationships with partners, customers, and industry leaders.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Badge className="mt-1 mr-3 bg-[#5372f1]">3</Badge>
                    <div>
                      <h4 className="font-medium">Leadership Cohesion</h4>
                      <p className="text-sm text-gray-600">Build and maintain an effective executive team with complementary strengths.</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Badge className="mt-1 mr-3 bg-[#5372f1]">4</Badge>
                    <div>
                      <h4 className="font-medium">Change Management</h4>
                      <p className="text-sm text-gray-600">Lead organizational transformations and navigate complex change.</p>
                    </div>
                  </div>
                </div>
                <Button variant="outline" className="w-full mt-2">View Executive Resources</Button>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="bg-[#5372f1] text-white p-8 rounded-lg">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-6">
                <h2 className="text-2xl font-bold mb-3">Need Professional Career Guidance?</h2>
                <p className="text-white/80 mb-4">Our career advisors provide personalized coaching to help you achieve your professional goals.</p>
                <Button variant="outline" className="bg-white text-[#5372f1] hover:bg-gray-100">Schedule a Consultation</Button>
              </div>
              <div className="flex-shrink-0">
                <Briefcase className="h-24 w-24 text-white/20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}