import { Helmet } from "react-helmet";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, Search, Clock, User, TrendingUp, Award, BookOpen, Calendar, Tag } from "lucide-react";
import { useState } from "react";
import { useLocation, Link } from "wouter";
import headhuntersDubaiImage from "../assets/pexels-photo-5685937.webp";
import executiveSearchImage from "../assets/pexels-photo-8730284.webp";
import recruitmentAgenciesImage from "../assets/pexels-photo-4344860.webp";
import bestRecruitmentAgencyImage from "../assets/pexels-photo-3307862.webp";
import partnerHeadhuntersDubaiImage from "../assets/pexels-photo-5668858.webp";
import recruitmentAgenciesForMNCs from "../assets/pexels-photo-7078666.jpeg";
import techGrowthImage from "../assets/articles/tech-growth.jpg";
import remoteWorkImage from "../assets/articles/remote-work.jpg";
import healthcareImage from "../assets/articles/healthcare.jpg";
import sustainabilityImage from "../assets/articles/sustainability.jpg";
import educationImage from "../assets/articles/education.jpg";
import gigEconomyImage from "../assets/articles/gig-economy.jpg";

// Sample blog data
const blogPosts = [
  {
    id: 1,
    title: "Executive Search Firms Find Top Talent",
    excerpt: "Explore how executive search firms help organizations find top leadership talent and what makes them essential partners in the hiring process.",
    category: "Executive Recruitment",
    author: "James Wilson",
    date: "April 27, 2025",
    readTime: "10 min read",
    image: executiveSearchImage
  },
  {
    id: 2,
    title: "Top Headhunters in Dubai",
    excerpt: "How we helped a tech firm hire the perfect C-Suite candidate through our specialized executive search process and industry network.",
    category: "Executive Recruitment",
    author: "Sarah Ahmed",
    date: "April 25, 2025",
    readTime: "7 min read",
    image: headhuntersDubaiImage
  },
  {
    id: 3,
    title: "Recruitment Agencies in the UAE",
    excerpt: "Top Recruitment Agency in UAE: Premier Headhunting Services in Dubai",
    category: "Executive Recruitment",
    author: "David Chen",
    date: "April 27, 2025",
    readTime: "8 min read",
    image: recruitmentAgenciesImage
  },
  {
    id: 4,
    title: "Best Recruitment Agency in Dubai",
    excerpt: "Best Recruitment Agency in Dubai – Find Skilled Talent Today through effective partnership with a top recruitment agency.",
    category: "Executive Recruitment",
    author: "Sarah Khan",
    date: "April 27, 2025",
    readTime: "10 min read",
    image: bestRecruitmentAgencyImage
  },
  {
    id: 5,
    title: "Partner with HeadHunters Dubai",
    excerpt: "Why Partnering with a HeadHunter in Dubai Can Skyrocket Your Talent Acquisition",
    category: "Executive Recruitment",
    author: "David Chen",
    date: "April 27, 2025",
    readTime: "8 min read",
    image: partnerHeadhuntersDubaiImage
  },
  {
    id: 6,
    title: "Recruitment Agencies for MNCs",
    excerpt: "How Recruitment Agencies Simplify Hiring for Multinational Companies",
    category: "Executive Recruitment",
    author: "Michael Roberts",
    date: "April 27, 2025",
    readTime: "9 min read",
    image: recruitmentAgenciesForMNCs
  },
  {
    id: 7,
    title: "Tech Growth Outlook",
    excerpt: "Google, Microsoft, and NVIDIA lead unprecedented demand for AI engineers and data scientists with 35% growth projected for 2025.",
    category: "Technology",
    author: "Dr. Sara Menendez",
    date: "April 20, 2025",
    readTime: "8 min read",
    image: techGrowthImage
  },
  {
    id: 8,
    title: "Remote Work Trends",
    excerpt: "Amazon, GitLab, and Spotify lead the remote work revolution, now offering 76% of positions as permanent remote across departments.",
    category: "Workplace Trends",
    author: "Alex Robertson",
    date: "April 15, 2025",
    readTime: "9 min read",
    image: remoteWorkImage
  },
  {
    id: 9,
    title: "Healthcare Expansion",
    excerpt: "Mayo Clinic, Kaiser Permanente, and Cleveland Clinic projected to add 1.5 million healthcare jobs over the next five years.",
    category: "Healthcare",
    author: "Dr. Priya Sharma",
    date: "April 18, 2025",
    readTime: "10 min read",
    image: healthcareImage
  },
  {
    id: 10,
    title: "Sustainability Roles",
    excerpt: "Tesla, Patagonia & Unilever lead Fortune 500 growth with ESG positions increasing by 45% in the past year.",
    category: "Sustainability",
    author: "Michael Cohen",
    date: "April 17, 2025",
    readTime: "9 min read",
    image: sustainabilityImage
  },
  {
    id: 11,
    title: "Education Evolution",
    excerpt: "Coursera, Udemy & Khan Academy EdTech specialists among fastest-growing education roles as digital learning transforms the sector.",
    category: "Education",
    author: "Dr. Emily Washington",
    date: "April 15, 2025",
    readTime: "8 min read",
    image: educationImage
  },
  {
    id: 12,
    title: "Gig Economy Expansion",
    excerpt: "Upwork, Fiverr & Toptal freelance marketplace expected to represent 50% of workforce by 2027, transforming traditional employment models.",
    category: "Employment Trends",
    author: "Daniel Fernandez",
    date: "April 19, 2025",
    readTime: "9 min read",
    image: gigEconomyImage
  }
];

const categories = [
  "All Categories",
  "Executive Recruitment",
  "Technology",
  "Workplace Trends",
  "Healthcare",
  "Sustainability",
  "Education",
  "Employment Trends",
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
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-gray-800 tracking-tight">
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
                    src={executiveSearchImage}
                    alt="Executive Search Firms article"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:w-1/2 p-6">
                  <CardHeader className="p-0 pb-4">
                    <div className="text-sm font-medium text-primary mb-2">Executive Recruitment</div>
                    <CardTitle className="text-2xl">Executive Search Firms Find Top Talent</CardTitle>
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
