import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import ERLogo from "@assets/ER.png";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-6">
              <img src={ERLogo} alt="EXPERT Recruitments LLC" className="h-10 w-auto mr-3" />
              <span className="text-2xl font-bold">EXPERT Recruitments LLC</span>
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
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-6">
            <div>
              <h3 className="text-lg font-bold mb-3">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about-us" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/job-board" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                    Find Jobs
                  </Link>
                </li>
                <li>
                  <Link href="/sectors" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                    Sectors
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-3">For Employers</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/job-seeker-register" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                    Register as Job Seeker
                  </Link>
                </li>
                <li>
                  <Link href="/post-job" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                    Post a Job
                  </Link>
                </li>
                <li>
                  <Link href="/hire-talent" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                    Hire Talent
                  </Link>
                </li>
                <li>
                  <Link href="/seo-insights" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                    SEO Insights
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-3">For Job Seekers</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/job-seeker-register" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="/job-board" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                    Find Jobs
                  </Link>
                </li>
                <li>
                  <Link href="/sectors" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                    Career Sectors
                  </Link>
                </li>
                <li>
                  <Link href="/blogs" className="text-sm text-gray-400 hover:text-white transition-colors flex items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
                    Career Advice
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-3">Newsletter</h3>
              <p className="text-sm text-gray-400 mb-4">
                Subscribe for job updates.
              </p>
              <div className="flex items-center">
                <Input 
                  type="email" 
                  placeholder="Your email"
                  className="bg-gray-700 border-gray-600 text-white rounded-r-none w-36"
                />
                <Button className="bg-primary hover:bg-primary/90 text-white rounded-l-none">
                  Go
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-3">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-600 transition-colors">
                  <Facebook className="h-5 w-5 text-white" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-sky-500 transition-colors">
                  <Twitter className="h-5 w-5 text-white" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-blue-700 transition-colors">
                  <Linkedin className="h-5 w-5 text-white" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center hover:bg-pink-600 transition-colors">
                  <Instagram className="h-5 w-5 text-white" />
                </a>
              </div>
            </div>
          </div>
        </div>
        
        <div className="h-px w-full bg-gray-800 my-8"></div>
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            © {currentYear} EXPERT Recruitments LLC. All rights reserved.
          </div>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy-policy" className="text-gray-500 hover:text-white transition-colors text-xs">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-white transition-colors text-xs">
              Terms of Service
            </Link>
            <Link href="/accessibility" className="text-gray-500 hover:text-white transition-colors text-xs">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
