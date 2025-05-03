import { Helmet } from "react-helmet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Users, Briefcase, Search, Award, 
  TrendingUp, BookOpen, Clock, Globe,
  ChevronDown
} from "lucide-react";
import MinimalistTestimonialSlider from "@/components/services/minimalist-testimonial-slider";
import servicesBgImage from "@/assets/modern-equipped-computer-lab.jpg";

export default function ServicesPage() {
  return (
    <>
      <Helmet>
        <title>Our Services | Expert Recruitments</title>
        <meta name="description" content="Explore our comprehensive range of services for both job seekers and employers. From recruitment solutions to career coaching." />
      </Helmet>

      <div className="relative min-h-[90vh] overflow-hidden">
        {/* Background Image with Black Tint */}
        <div className="absolute inset-0 bg-black/65 z-10"></div>
        <div 
          className="absolute inset-0 bg-center bg-cover" 
          style={{ 
            backgroundImage: `url(${servicesBgImage})`,
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
        
        <div className="w-full max-w-[1440px] mx-auto px-4 relative py-32 md:py-40">
          {/* Main content */}
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto mb-8 relative z-20">
            <div className="inline-block mb-6 px-5 py-2 bg-white/90 border-b-2 border-primary shadow-sm rounded-md backdrop-blur-sm">
              <span className="font-medium text-primary tracking-wider uppercase text-sm">Professional Solutions</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-white tracking-tight drop-shadow-md">
              Our Services
            </h1>
            
            <p className="text-xl md:text-2xl text-white leading-relaxed mb-4 max-w-3xl drop-shadow-md">
              Comprehensive solutions to connect talent with opportunity
            </p>
            
            <p className="text-lg text-white/90 leading-relaxed mb-8 max-w-3xl drop-shadow">
              Helping businesses grow with the right people through specialized recruitment services
            </p>
            
            {/* Scroll Down Button */}
            <a 
              href="#services-content" 
              className="flex flex-col items-center mt-4 text-white/80 hover:text-white transition-colors duration-300"
            >
              <span className="text-sm font-medium mb-2">Explore Our Services</span>
              <div className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center">
                <ChevronDown className="h-6 w-6" />
              </div>
            </a>
          </div>
        </div>
      </div>

      <div id="services-content" className="w-full max-w-[1440px] mx-auto px-4 py-12">
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
            {/* Card 1 */}
            <Card className="transition-all hover:shadow-xl border-none shadow-lg bg-gradient-to-b from-white to-gray-50 overflow-hidden flex flex-col">
              <div className="h-2 bg-primary"></div>
              <CardContent className="p-8 flex flex-col flex-grow">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Talent Acquisition</h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Access a diverse pool of qualified candidates through our extensive network and advanced matching technology.
                </p>
                <div className="mt-auto pt-4">
                  <Link href="/vacancy-form">
                    <Button variant="outline" size="lg" className="w-full h-[60px] bg-white text-primary hover:bg-primary/5 border-primary border font-medium text-base rounded-full shadow-md transition-all duration-300">Submit Vacancy</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            {/* Card 2 */}
            <Card className="transition-all hover:shadow-xl border-none shadow-lg bg-gradient-to-b from-white to-gray-50 overflow-hidden flex flex-col">
              <div className="h-2 bg-primary"></div>
              <CardContent className="p-8 flex flex-col flex-grow">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Award className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Executive Search</h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Specialized recruitment services for senior-level and executive positions tailored to your requirements.
                </p>
                <div className="mt-auto pt-4">
                  <Link href="/vacancy-form">
                    <Button variant="outline" size="lg" className="w-full h-[60px] bg-white text-primary hover:bg-primary/5 border-primary border font-medium text-base rounded-full shadow-md transition-all duration-300">Submit Vacancy</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            {/* Card 3 */}
            <Card className="transition-all hover:shadow-xl border-none shadow-lg bg-gradient-to-b from-white to-gray-50 overflow-hidden flex flex-col">
              <div className="h-2 bg-primary"></div>
              <CardContent className="p-8 flex flex-col flex-grow">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Temporary Staffing</h3>
                <p className="text-gray-600 mb-6 text-lg">
                  This service is currently available only in India and the USA. Employers interested in our Temporary Staffing services can register their interest by filling out the inquiry form below.
                </p>
                <div className="mt-auto pt-4">
                  <Link href="/contact-us">
                    <Button variant="outline" size="lg" className="w-full h-[60px] bg-white text-primary hover:bg-primary/5 border-primary border font-medium text-base rounded-full shadow-md transition-all duration-300">Inquiry Form</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/employer-register">
              <Button size="lg" className="px-10 py-7 text-lg bg-primary hover:bg-primary/90 shadow-lg rounded-full transition-all duration-300">Register as Employer</Button>
            </Link>
          </div>
        </div>
        
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
            {/* Card 1 */}
            <Card className="transition-all hover:shadow-xl border-none shadow-lg bg-gradient-to-b from-white to-gray-50 overflow-hidden flex flex-col">
              <div className="h-2 bg-primary"></div>
              <CardContent className="p-8 flex flex-col flex-grow">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Job Matching</h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Our intelligent matching system connects you with positions that align with your skills, experience, and career goals.
                </p>
                <div className="mt-auto pt-4">
                  <Link href="/job-board">
                    <Button variant="outline" size="lg" className="w-full h-[60px] bg-white text-primary hover:bg-primary/5 border-primary border font-medium text-base rounded-full shadow-md transition-all duration-300">Browse Jobs</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            {/* Card 2 */}
            <Card className="transition-all hover:shadow-xl border-none shadow-lg bg-gradient-to-b from-white to-gray-50 overflow-hidden flex flex-col">
              <div className="h-2 bg-primary"></div>
              <CardContent className="p-8 flex flex-col flex-grow">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Career Development</h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Access resources and guidance to help you enhance your skills and advance your career path.
                </p>
                <div className="mt-auto pt-4">
                  <Link href="/job-seeker-register">
                    <Button variant="outline" size="lg" className="w-full h-[60px] bg-white text-primary hover:bg-primary/5 border-primary border font-medium text-base rounded-full shadow-md transition-all duration-300">View Resources</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
            
            {/* Card 3 */}
            <Card className="transition-all hover:shadow-xl border-none shadow-lg bg-gradient-to-b from-white to-gray-50 overflow-hidden flex flex-col">
              <div className="h-2 bg-primary"></div>
              <CardContent className="p-8 flex flex-col flex-grow">
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Resume Building</h3>
                <p className="text-gray-600 mb-6 text-lg">
                  Get expert advice on crafting a compelling resume that showcases your strengths and experience.
                </p>
                <div className="mt-auto pt-4">
                  <Link href="/job-seeker-register">
                    <Button variant="outline" size="lg" className="w-full h-[60px] bg-white text-primary hover:bg-primary/5 border-primary border font-medium text-base rounded-full shadow-md transition-all duration-300">Learn More</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/job-seeker-register">
              <Button size="lg" className="px-10 py-7 text-lg bg-primary hover:bg-primary/90 shadow-lg rounded-full transition-all duration-300">Register as Job Seeker</Button>
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
          
          <div className="flex justify-center items-center gap-6 flex-wrap">
            {["UAE", "INDIA", "AMERICA"].map((region) => (
              <div key={region} className="bg-gray-100 px-8 py-5 rounded-lg min-w-[160px] text-center shadow-md">
                <h3 className="font-semibold text-lg">{region}</h3>
              </div>
            ))}
          </div>
        </div>
        
        {/* Client Reviews Slider */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <div className="inline-block p-3 bg-primary/10 rounded-full text-primary mb-4">
              <Users size={28} />
            </div>
            <h2 className="text-3xl font-bold mb-4">Client Reviews</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              What our clients and partners say about working with Expert Recruitments
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <MinimalistTestimonialSlider />
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-3xl mx-auto">
            Whether you're looking for your next career opportunity or searching for top talent, we're here to help you succeed.
          </p>
          <div className="flex justify-center gap-6 flex-wrap">
            <Link href="/employer-register">
              <Button size="lg" className="px-10 py-7 text-lg bg-primary hover:bg-primary/90 shadow-lg rounded-full transition-all duration-300">For Employers</Button>
            </Link>
            <Link href="/job-seeker-register">
              <Button size="lg" className="px-10 py-7 text-lg bg-primary hover:bg-primary/90 shadow-lg rounded-full transition-all duration-300">For Job Seekers</Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}