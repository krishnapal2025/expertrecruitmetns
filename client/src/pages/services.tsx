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
        <title>Our Services | RH Job Portal</title>
        <meta name="description" content="Explore our comprehensive range of services for both job seekers and employers. From recruitment solutions to career coaching." />
      </Helmet>

      <div className="bg-primary text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Our Services</h1>
          <p className="text-xl max-w-2xl">
            Comprehensive solutions to connect talent with opportunity and help businesses grow with the right people.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* For Job Seekers Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-primary/10 rounded-full text-primary mb-4">
              <Users size={28} />
            </div>
            <h2 className="text-3xl font-bold mb-4">For Job Seekers</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We offer a range of services to help you find your ideal role and advance your career
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="transition-all hover:shadow-md">
              <CardContent className="p-6">
                <Search className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Job Matching</h3>
                <p className="text-gray-600 mb-4">
                  Our intelligent matching system connects you with positions that align with your skills, experience, and career goals.
                </p>
                <Link href="/job-board">
                  <Button variant="outline" className="w-full">Browse Jobs</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="transition-all hover:shadow-md">
              <CardContent className="p-6">
                <TrendingUp className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Career Development</h3>
                <p className="text-gray-600 mb-4">
                  Access resources and guidance to help you enhance your skills and advance your career path.
                </p>
                <Link href="/blogs">
                  <Button variant="outline" className="w-full">View Resources</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="transition-all hover:shadow-md">
              <CardContent className="p-6">
                <BookOpen className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Resume Building</h3>
                <p className="text-gray-600 mb-4">
                  Get expert advice on crafting a compelling resume that showcases your strengths and experience.
                </p>
                <Link href="/contact-us">
                  <Button variant="outline" className="w-full">Learn More</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/auth?type=jobseeker">
              <Button size="lg">Register as Job Seeker</Button>
            </Link>
          </div>
        </div>
        
        {/* For Employers Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-primary/10 rounded-full text-primary mb-4">
              <Briefcase size={28} />
            </div>
            <h2 className="text-3xl font-bold mb-4">For Employers</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We provide comprehensive recruitment solutions to help you find the perfect talent for your organization
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="transition-all hover:shadow-md">
              <CardContent className="p-6">
                <Search className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Talent Acquisition</h3>
                <p className="text-gray-600 mb-4">
                  Access a diverse pool of qualified candidates through our extensive network and advanced matching technology.
                </p>
                <Link href="/auth?type=employer">
                  <Button variant="outline" className="w-full">Post a Job</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="transition-all hover:shadow-md">
              <CardContent className="p-6">
                <Award className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Executive Search</h3>
                <p className="text-gray-600 mb-4">
                  Specialized recruitment services for senior-level and executive positions tailored to your requirements.
                </p>
                <Link href="/contact-us">
                  <Button variant="outline" className="w-full">Contact Us</Button>
                </Link>
              </CardContent>
            </Card>
            
            <Card className="transition-all hover:shadow-md">
              <CardContent className="p-6">
                <Clock className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-xl font-bold mb-2">Temporary Staffing</h3>
                <p className="text-gray-600 mb-4">
                  Flexible staffing solutions to address short-term needs, special projects, or seasonal demands.
                </p>
                <Link href="/contact-us">
                  <Button variant="outline" className="w-full">Learn More</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-8 text-center">
            <Link href="/auth?type=employer">
              <Button size="lg">Register as Employer</Button>
            </Link>
          </div>
        </div>
        
        {/* How It Works Section */}
        <div className="bg-gray-50 rounded-lg p-8 mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our streamlined process makes it easy for both job seekers and employers to get started
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            <div className="relative text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-xl">
                1
              </div>
              <h3 className="font-bold mb-2">Register</h3>
              <p className="text-gray-600 text-sm">
                Create your account as a job seeker or employer
              </p>
              <div className="hidden md:block absolute top-6 left-full w-1/2 border-t-2 border-dashed border-gray-300"></div>
            </div>
            
            <div className="relative text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-xl">
                2
              </div>
              <h3 className="font-bold mb-2">Complete Profile</h3>
              <p className="text-gray-600 text-sm">
                Add your details and preferences
              </p>
              <div className="hidden md:block absolute top-6 left-full w-1/2 border-t-2 border-dashed border-gray-300"></div>
            </div>
            
            <div className="relative text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-xl">
                3
              </div>
              <h3 className="font-bold mb-2">Connect</h3>
              <p className="text-gray-600 text-sm">
                Browse jobs or candidates based on your needs
              </p>
              <div className="hidden md:block absolute top-6 left-full w-1/2 border-t-2 border-dashed border-gray-300"></div>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-primary text-white rounded-full mx-auto mb-4 flex items-center justify-center font-bold text-xl">
                4
              </div>
              <h3 className="font-bold mb-2">Succeed</h3>
              <p className="text-gray-600 text-sm">
                Find your ideal job or perfect candidate
              </p>
            </div>
          </div>
        </div>
        
        {/* Global Reach Section */}
        <div className="text-center mb-16">
          <div className="inline-block p-3 bg-primary/10 rounded-full text-primary mb-4">
            <Globe size={28} />
          </div>
          <h2 className="text-3xl font-bold mb-4">Global Reach, Local Expertise</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            With a presence in major cities around the world, we combine international reach with deep local market knowledge.
          </p>
          
          <div className="grid md:grid-cols-5 gap-4 text-center">
            {["North America", "Europe", "Asia Pacific", "Middle East", "Latin America"].map((region) => (
              <div key={region} className="bg-gray-100 p-4 rounded-lg">
                <h3 className="font-medium">{region}</h3>
              </div>
            ))}
          </div>
        </div>
        
        {/* Testimonial */}
        <div className="bg-primary/5 p-8 rounded-lg mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <svg className="w-12 h-12 text-primary/40 mx-auto mb-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"></path>
            </svg>
            <blockquote className="text-xl italic text-gray-700 mb-6">
              "Working with the RH Job Portal team transformed our recruitment process. Their understanding of our industry and culture helped us find exceptional talent that has driven our business forward."
            </blockquote>
            <div className="flex items-center justify-center">
              <img 
                src="https://images.unsplash.com/photo-1507679799987-c73779587ccf" 
                alt="Company CEO" 
                className="w-12 h-12 rounded-full object-cover mr-4" 
              />
              <div className="text-left">
                <div className="font-bold">Michael Anderson</div>
                <div className="text-sm text-gray-600">CEO, Tech Innovations Inc.</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
            Whether you're looking for your next career opportunity or searching for top talent, we're here to help you succeed.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/auth?type=jobseeker">
              <Button size="lg">For Job Seekers</Button>
            </Link>
            <Link href="/auth?type=employer">
              <Button size="lg" variant="outline">For Employers</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
