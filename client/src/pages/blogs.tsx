import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, Search, Clock, User, TrendingUp, Award, BookOpen } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

// Sample blog data
const blogPosts = [
  {
    id: 1,
    title: "Discover the Secrets of Successful Executive Search Firms",
    excerpt: "Explore how executive search firms help organizations find top leadership talent and what makes them essential partners in the hiring process.",
    category: "Executive Recruitment",
    author: "James Wilson",
    date: "April 27, 2025",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf"
  },
  {
    id: 2,
    title: "How to Ace Your Job Interview: Expert Strategies",
    excerpt: "Prepare for your next job interview with these proven strategies that will help you make a great impression.",
    category: "Interview Tips",
    author: "Michael Anderson",
    date: "April 28, 2023",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf"
  },
  {
    id: 3,
    title: "The Future of Work: Remote and Hybrid Models",
    excerpt: "Explore how remote and hybrid work models are shaping the future of employment and what it means for job seekers.",
    category: "Industry Trends",
    author: "David Chen",
    date: "June 3, 2023",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1487017159836-4e23ece2e4cf"
  },
  {
    id: 4,
    title: "Navigating Career Changes: A Step-by-Step Guide",
    excerpt: "Considering a career change? This comprehensive guide will help you transition smoothly to a new professional path.",
    category: "Career Development",
    author: "Emma Rodriguez",
    date: "May 22, 2023",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1556761175-4b46a572b786"
  },
  {
    id: 5,
    title: "Mastering the Art of Salary Negotiation",
    excerpt: "Learn effective techniques for negotiating your salary and securing the compensation package you deserve.",
    category: "Career Advice",
    author: "James Wilson",
    date: "June 10, 2023",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1573496130407-57329f01f769"
  },
  {
    id: 6,
    title: "Building a Professional Network That Works for You",
    excerpt: "Discover strategies for creating and nurturing professional relationships that can advance your career.",
    category: "Networking",
    author: "Lisa Thompson",
    date: "April 15, 2023",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf"
  }
];

const categories = [
  "All Categories",
  "Executive Recruitment",
  "Career Advice",
  "Interview Tips",
  "Industry Trends",
  "Career Development",
  "Networking",
  "Workplace Culture",
  "Job Search Strategies"
];

export default function BlogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [, setLocation] = useLocation();

  // Filter blogs based on search term and category
  const filteredBlogs = blogPosts.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "All Categories" || blog.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Helmet>
        <title>Blog | Career Resources & Advice | Expert Recruitments</title>
        <meta name="description" content="Browse our collection of career advice, industry insights, and job search tips to help you advance your professional journey." />
      </Helmet>

      <div className="relative py-20 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 bg-gray-50"></div>
        
        {/* Accent lines */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full overflow-hidden">
          <div className="absolute -right-20 top-1/4 w-80 h-80 bg-primary/5 rounded-full"></div>
          <div className="absolute -right-10 bottom-1/4 w-40 h-40 bg-primary/5 rounded-full"></div>
        </div>
        
        <div className="absolute left-0 bottom-0 w-1/4 h-80 overflow-hidden">
          <div className="absolute -left-20 bottom-0 w-64 h-64 bg-gray-100 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          {/* Main content */}
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto mb-16">
            <div className="inline-block mb-6 px-5 py-2 bg-white border-b-2 border-primary shadow-sm rounded-md">
              <span className="font-medium text-primary tracking-wider uppercase text-sm">Knowledge Center</span>
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-gray-800 tracking-tight">
              Career Resources & Insights
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 leading-relaxed mb-4 max-w-3xl">
              Expert advice, tips, and insights for your career journey
            </p>
            
            <p className="text-lg text-gray-600 leading-relaxed mb-6 max-w-3xl">
              Stay informed with the latest trends and strategies in professional development
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
            <select
              className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
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
        </div>

        {/* Featured Articles */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <TrendingUp className="mr-2 h-6 w-6 text-primary" />
            Featured Articles
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="md:col-span-2 overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 h-60 md:h-auto">
                  <img
                    src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf"
                    alt="Executive Search Firms article"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-6">
                  <CardHeader className="p-0 pb-4">
                    <div className="text-sm font-medium text-primary mb-2">Executive Recruitment</div>
                    <CardTitle className="text-2xl">Discover the Secrets of Successful Executive Search Firms</CardTitle>
                    <CardDescription className="text-base mt-2">
                      Explore how executive search firms help organizations find top leadership talent and what makes them essential partners in the hiring process.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0 py-4">
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <User className="mr-1 h-4 w-4" />
                      <span className="mr-4">James Wilson</span>
                      <Clock className="mr-1 h-4 w-4" />
                      <span>April 27, 2025</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-0">
                    <Button className="mt-2" onClick={() => setLocation("/article/1")}>
                      Read Article
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Recent Articles */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <BookOpen className="mr-2 h-6 w-6 text-primary" />
            Recent Articles
          </h2>
          
          {filteredBlogs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((post) => (
                <Card key={post.id} className="overflow-hidden flex flex-col h-full">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
                    />
                  </div>
                  <CardHeader>
                    <div className="text-sm font-medium text-primary mb-2">{post.category}</div>
                    <CardTitle>{post.title}</CardTitle>
                    <CardDescription className="text-base mt-2">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="mr-1 h-4 w-4" />
                      <span className="mr-4">{post.author}</span>
                      <Clock className="mr-1 h-4 w-4" />
                      <span>{post.readTime}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setLocation(`/article/${post.id}`)}
                    >
                      Read Article
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
                We couldn't find any articles matching your search criteria.
              </p>
              <Button onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All Categories");
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Categories */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <Award className="mr-2 h-6 w-6 text-primary" />
            Popular Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.slice(1).map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="justify-start"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="bg-primary/5 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Subscribe to Our Newsletter</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Stay updated with the latest career advice, industry insights, and job opportunities delivered directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Your email address"
              className="flex-grow"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </div>
    </>
  );
}
