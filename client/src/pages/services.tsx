import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Users, Briefcase, Search, Award, 
  TrendingUp, BookOpen, Clock, Globe 
} from "lucide-react";

export default function ServicesPage() {
  return (
    <>
      <Helmet>
        <title>Our Services | Expert Recruitments</title>
        <meta name="description" content="Explore our comprehensive range of services for both job seekers and employers. From recruitment solutions to career coaching." />
      </Helmet>

      {/* Hero Section - Minimal */}
      <div className="bg-white pt-20 pb-10">
        <div className="w-full max-w-[1440px] mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="inline-block mb-3 px-4 py-1 bg-primary/10 rounded-full">
              <span className="font-medium text-primary text-sm">Our Services</span>
            </div>
            
            <h1 className="text-3xl font-bold mb-3 text-gray-800">
              Professional Recruitment Solutions
            </h1>
            
            <p className="text-gray-600 max-w-2xl mx-auto">
              Connecting exceptional talent with leading organizations in the UAE and beyond
            </p>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1440px] mx-auto px-4 py-6">
        {/* For Employers Section - Minimal */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">For Employers</h2>
            <div className="w-16 h-1 bg-primary mx-auto mb-3"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Streamlined recruitment solutions to find the perfect talent for your organization
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border border-gray-100 shadow-sm hover:shadow transition-all">
              <CardContent className="p-6">
                <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center mb-4">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Talent Acquisition</h3>
                <p className="text-gray-600 mb-4">
                  Access qualified candidates through our extensive network and matching technology.
                </p>
                <Link href="/employer-register">
                  <Button variant="default" className="w-full">Post a Job</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-100 shadow-sm hover:shadow transition-all">
              <CardContent className="p-6">
                <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center mb-4">
                  <Award className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Executive Search</h3>
                <p className="text-gray-600 mb-4">
                  Specialized recruitment for senior-level and executive positions.
                </p>
                <Link href="/contact-us">
                  <Button variant="default" className="w-full">Contact Us</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-100 shadow-sm hover:shadow transition-all">
              <CardContent className="p-6">
                <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center mb-4">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Temporary Staffing</h3>
                <p className="text-gray-600 mb-4">
                  Flexible staffing solutions for short-term needs and special projects.
                </p>
                <Link href="/contact-us">
                  <Button variant="default" className="w-full">Learn More</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6 text-center">
            <Link href="/employer-register">
              <Button className="bg-primary hover:bg-primary/90 rounded-full px-8 py-2">
                <span className="mr-2">Register as Employer</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Button>
            </Link>
          </div>
        </div>
        
        {/* For Job Seekers Section - Minimal */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">For Job Seekers</h2>
            <div className="w-16 h-1 bg-primary mx-auto mb-3"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Services to help you find your ideal role and advance your career
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border border-gray-100 shadow-sm hover:shadow transition-all">
              <CardContent className="p-6">
                <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center mb-4">
                  <Search className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Job Matching</h3>
                <p className="text-gray-600 mb-4">
                  Connect with positions that align with your skills, experience, and career goals.
                </p>
                <Link href="/job-board">
                  <Button variant="default" className="w-full">Browse Jobs</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-100 shadow-sm hover:shadow transition-all">
              <CardContent className="p-6">
                <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center mb-4">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Career Development</h3>
                <p className="text-gray-600 mb-4">
                  Access resources and guidance to enhance your skills and advance your career.
                </p>
                <Link href="/blogs">
                  <Button variant="default" className="w-full">View Resources</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="border border-gray-100 shadow-sm hover:shadow transition-all">
              <CardContent className="p-6">
                <div className="w-10 h-10 bg-primary/10 rounded-md flex items-center justify-center mb-4">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Resume Building</h3>
                <p className="text-gray-600 mb-4">
                  Get expert advice on crafting a compelling resume that showcases your strengths.
                </p>
                <Link href="/contact-us">
                  <Button variant="default" className="w-full">Learn More</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-6 text-center">
            <Link href="/job-seeker-register">
              <Button className="bg-primary hover:bg-primary/90 rounded-full px-8 py-2">
                <span className="mr-2">Register as Job Seeker</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Button>
            </Link>
          </div>
        </div>
        
        {/* How It Works Section - Minimal */}
        <div className="mb-12 bg-gray-50 p-6 rounded">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">How It Works</h2>
            <div className="w-16 h-1 bg-primary mx-auto mb-3"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our streamlined process makes it easy to get started
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative text-center">
              <div className="w-10 h-10 bg-primary text-white rounded-full mx-auto mb-2 flex items-center justify-center font-semibold">
                1
              </div>
              <h3 className="font-semibold mb-1">Register</h3>
              <p className="text-gray-600 text-sm">
                Create your account
              </p>
              <div className="hidden md:block absolute top-5 left-full w-1/2 border-t border-dashed border-gray-300"></div>
            </div>
            
            <div className="relative text-center">
              <div className="w-10 h-10 bg-primary text-white rounded-full mx-auto mb-2 flex items-center justify-center font-semibold">
                2
              </div>
              <h3 className="font-semibold mb-1">Complete Profile</h3>
              <p className="text-gray-600 text-sm">
                Add your details
              </p>
              <div className="hidden md:block absolute top-5 left-full w-1/2 border-t border-dashed border-gray-300"></div>
            </div>
            
            <div className="relative text-center">
              <div className="w-10 h-10 bg-primary text-white rounded-full mx-auto mb-2 flex items-center justify-center font-semibold">
                3
              </div>
              <h3 className="font-semibold mb-1">Connect</h3>
              <p className="text-gray-600 text-sm">
                Browse opportunities
              </p>
              <div className="hidden md:block absolute top-5 left-full w-1/2 border-t border-dashed border-gray-300"></div>
            </div>
            
            <div className="text-center">
              <div className="w-10 h-10 bg-primary text-white rounded-full mx-auto mb-2 flex items-center justify-center font-semibold">
                4
              </div>
              <h3 className="font-semibold mb-1">Succeed</h3>
              <p className="text-gray-600 text-sm">
                Find your match
              </p>
            </div>
          </div>
        </div>
        
        {/* Global Reach Section - Minimal */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">Global Reach</h2>
            <div className="w-16 h-1 bg-primary mx-auto mb-3"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Combining international reach with deep local market knowledge
            </p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-3 text-center">
            {["North America", "Europe", "Asia Pacific", "Middle East", "Latin America"].map((region) => (
              <div key={region} className="bg-gray-50 border border-gray-100 p-3 rounded">
                <h3 className="font-medium text-sm">{region}</h3>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA Section - Minimal */}
        <div className="text-center bg-gray-50 p-6 rounded">
          <h2 className="text-2xl font-bold mb-3">Ready to Get Started?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Whether you're looking for your next career opportunity or searching for top talent, we're here to help.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/job-seeker-register">
              <Button className="bg-primary hover:bg-primary/90 rounded-full px-6 py-2">
                <span>For Job Seekers</span>
              </Button>
            </Link>
            <Link href="/employer-register">
              <Button variant="outline" className="border border-primary text-primary hover:bg-primary/5 rounded-full px-6 py-2">
                <span>For Employers</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}