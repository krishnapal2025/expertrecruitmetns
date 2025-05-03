import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram, Star } from "lucide-react";
import expertLogo from "../../assets/er-logo-icon.png";
import qrCodeImage from "../../assets/qr-code.jpeg";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { toast } = useToast();
  
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-full bg-white p-2 border-2 border-[#5372f1] shadow-md mr-3">
                <img 
                  src={expertLogo} 
                  alt="Expert Recruitments LLC" 
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-xl md:text-2xl uppercase" style={{ letterSpacing: '0.15em', width: '91%', display: 'inline-block' }}>Expert</span>
                <span className="text-white text-xs md:text-sm -mt-1">Recruitments LLC</span>
              </div>
            </div>
            <p className="text-gray-400 mb-8 max-w-3xl">
              Connecting talent with opportunity. Find your perfect job or the ideal candidate with our professional recruitment services.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-4 rounded-lg h-full">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-lg font-bold">Dubai</h3>
              </div>
              <div className="space-y-3 pl-10">
                <div className="flex items-start">
                  <Phone className="h-4 w-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                  <span className="text-sm">+9714 331 5588</span>
                </div>
                <div className="flex items-start">
                  <Mail className="h-4 w-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                  <a href="mailto:talent@expertrecruitments.com" className="text-sm text-gray-400 hover:text-white transition-colors">
                    talent@expertrecruitments.com
                  </a>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Office No. 306, Al Shali Building, Dubai, United Arab Emirates</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg h-full">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-lg font-bold">India</h3>
              </div>
              <div className="space-y-3 pl-10">
                <div className="flex items-start">
                  <Phone className="h-4 w-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                  <span className="text-sm">+91 84509 79450</span>
                </div>
                <div className="flex items-start">
                  <Mail className="h-4 w-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                  <a href="mailto:info@expertrecruitments.com" className="text-sm text-gray-400 hover:text-white transition-colors">
                    info@expertrecruitments.com
                  </a>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-400">Navi Mumbai: 302, Foundation Tower, CBD Belapur, Maharashtra</p>
                  <p className="text-xs text-gray-400">Lucknow: 05, Kisan Bazar, Bibhuti Nagar, Lucknow, Uttar Pradesh</p>
                  <p className="text-xs text-gray-400">Hyderabad: Level 1, Phase 2, N-Heights, Plot No 38, Siddiq Nagar, HITEC City, Hyderabad, Telangana</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-800 p-4 rounded-lg h-full">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center mr-2">
                  <MapPin className="h-4 w-4 text-primary" />
                </div>
                <h3 className="text-lg font-bold">USA</h3>
              </div>
              <div className="space-y-3 pl-10">
                <div className="flex items-start">
                  <Mail className="h-4 w-4 mr-2 mt-0.5 text-gray-400 flex-shrink-0" />
                  <a href="mailto:nj@expertrecruitments.com" className="text-sm text-gray-400 hover:text-white transition-colors">
                    nj@expertrecruitments.com
                  </a>
                </div>
                <div>
                  <p className="text-xs text-gray-400">6 Moyse Place, Suite 302, Edison, New Jersey 08820</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-7 gap-6 mt-6">
            <div className="flex flex-col h-full">
              <h3 className="text-lg font-bold mb-3">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                    Home
                  </a>
                </li>
                <li>
                  <a href="/about-us" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/services" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                    Services
                  </a>
                </li>
                <li>
                  <a href="/sectors" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                    Sectors
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col h-full">
              <h3 className="text-lg font-bold mb-3">For Employers</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/employer-register" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                    Register as Employer
                  </a>
                </li>
                <li>
                  <a href="/hire-talent" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                    Hire Talent
                  </a>
                </li>
                <li>
                  <a href="/vacancy-form" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                    Vacancy Form
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col h-full">
              <h3 className="text-lg font-bold mb-3">For Job Seekers</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/job-seeker-register" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                    Register as Job Seeker
                  </a>
                </li>
                <li>
                  <a href="/job-board" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                    Find Jobs
                  </a>
                </li>
                <li>
                  <a href="/resources/create-resume" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                    Create Resume
                  </a>
                </li>
                <li>
                  <a href="/resources/interview-prep" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                    Interview Prep
                  </a>
                </li>
                <li>
                  <a href="/resources/career-advice" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                    Career Advice
                  </a>
                </li>
                <li>
                  <a href="/resources/salary-negotiation" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                    Salary Negotiation
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col h-full">
              <h3 className="text-lg font-bold mb-3">Information</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/contact-us" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/admin-login" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                    Admin
                  </a>
                </li>
                <li>
                  <a href="/site-map" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                    Site Map
                  </a>
                </li>
                <li>
                  <a href="/privacy-policy" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms-conditions" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                    Terms & Conditions
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col h-full pr-8">
              <h3 className="text-lg font-bold mb-3">Newsletter</h3>
              <p className="text-sm text-gray-400 mb-2">
                Get expert job insights and opportunity alerts.
              </p>
              <form 
                className="flex flex-col gap-2" 
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target as HTMLFormElement;
                  const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  
                  if (email && emailRegex.test(email)) {
                    // Here you would normally send the email to your newsletter service
                    toast({
                      title: "Subscription successful!",
                      description: "Thank you for subscribing to our newsletter."
                    });
                    form.reset();
                  } else {
                    toast({
                      title: "Invalid email",
                      description: "Please enter a valid email address.",
                      variant: "destructive"
                    });
                  }
                }}
              >
                <div className="flex flex-row gap-2">
                  <Input 
                    name="email"
                    type="email" 
                    placeholder="Enter your email"
                    required
                    className="bg-gray-700 border-gray-600 text-white rounded-r-none w-full placeholder:text-gray-500 placeholder:text-sm focus:ring-1 focus:ring-primary focus:border-primary focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none"
                  />
                  <Button 
                    type="submit" 
                    className="bg-primary hover:bg-primary/90 text-white font-medium rounded-l-none whitespace-nowrap transition-all duration-300"
                  >
                    Subscribe
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  We respect your privacy. Unsubscribe anytime.
                </p>
              </form>
            </div>
            
            <div className="flex flex-col h-full justify-start pl-8">
              <h3 className="text-lg font-bold mb-3">Follow Us</h3>
              <div className="flex flex-col space-y-4">
                <div className="flex space-x-4">
                  <a href="https://www.facebook.com/expertrecruitmentsdubai" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-600 transition-colors">
                    <Facebook className="h-5 w-5 text-white" />
                  </a>
                  <a href="https://www.linkedin.com/company/expertrecruitmentsllc/?viewAsMember=true" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <Linkedin className="h-5 w-5 text-white" />
                  </a>
                </div>
                
              </div>
            </div>
            
            <div className="flex flex-col h-full md:col-span-1 md:order-7">
              <h3 className="text-lg font-bold mb-3 whitespace-nowrap">Share your voice</h3>
              <p className="text-sm text-gray-400 mb-4">
                Help us improve our services.
              </p>
              <a 
                href="https://g.page/r/CfeX4Gp1NP7PEAE/review" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded transition-colors mb-4"
              >
                <Star className="h-5 w-5 mr-2 text-yellow-400" />
                Leave a Review
              </a>
              
              <div className="mt-2">
                <img 
                  src={qrCodeImage} 
                  alt="Scan QR Code" 
                  className="w-24 h-24 mx-auto bg-white p-1 rounded"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="h-px w-full bg-gray-800 my-8"></div>
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            © {currentYear} <span className="uppercase" style={{ letterSpacing: '0.15em' }}>Expert</span> Recruitments LLC. All rights reserved.
          </div>
          <div className="flex flex-wrap gap-4">
            <a href="/privacy-policy" className="text-gray-500 hover:text-white transition-colors text-xs">
              Privacy Policy
            </a>
            <a href="/terms-conditions" className="text-gray-500 hover:text-white transition-colors text-xs">
              Terms & Conditions
            </a>
            <a href="/accessibility" className="text-gray-500 hover:text-white transition-colors text-xs">
              Accessibility
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}