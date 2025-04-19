import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Briefcase, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <Briefcase className="h-6 w-6 mr-2" />
              <span className="text-xl font-bold">RH Job Portal</span>
            </div>
            <p className="text-gray-400 mb-4">
              Connecting talent with opportunity. Find your perfect job or the ideal candidate with our professional recruitment services.
            </p>
            <div className="space-y-3">
              <div className="flex items-start">
                <Phone className="h-5 w-5 mr-3 mt-0.5 text-gray-400" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start">
                <Mail className="h-5 w-5 mr-3 mt-0.5 text-gray-400" />
                <span>info@rhjobportal.com</span>
              </div>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 mt-0.5 text-gray-400" />
                <span>123 Business Avenue, New York, NY 10001</span>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about-us" className="text-gray-400 hover:text-white transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-gray-400 hover:text-white transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/job-board" className="text-gray-400 hover:text-white transition-colors">
                    Find Jobs
                  </Link>
                </li>
                <li>
                  <Link href="/sectors" className="text-gray-400 hover:text-white transition-colors">
                    Sectors
                  </Link>
                </li>
                <li>
                  <Link href="/blogs" className="text-gray-400 hover:text-white transition-colors">
                    Blogs
                  </Link>
                </li>
                <li>
                  <Link href="/contact-us" className="text-gray-400 hover:text-white transition-colors">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">For Employers</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/auth?type=employer" className="text-gray-400 hover:text-white transition-colors">
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="/post-job" className="text-gray-400 hover:text-white transition-colors">
                    Post a Job
                  </Link>
                </li>
                <li>
                  <Link href="/hire-talent" className="text-gray-400 hover:text-white transition-colors">
                    Hire Talent
                  </Link>
                </li>
                <li>
                  <Link href="/services" className="text-gray-400 hover:text-white transition-colors">
                    Recruitment Services
                  </Link>
                </li>
                <li>
                  <Link href="/blogs" className="text-gray-400 hover:text-white transition-colors">
                    Hiring Resources
                  </Link>
                </li>
                <li>
                  <Link href="/seo-insights" className="text-gray-400 hover:text-white transition-colors">
                    Market Insights
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">For Job Seekers</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/auth?type=jobseeker" className="text-gray-400 hover:text-white transition-colors">
                    Register
                  </Link>
                </li>
                <li>
                  <Link href="/job-board" className="text-gray-400 hover:text-white transition-colors">
                    Find Jobs
                  </Link>
                </li>
                <li>
                  <Link href="/sectors" className="text-gray-400 hover:text-white transition-colors">
                    Career Sectors
                  </Link>
                </li>
                <li>
                  <Link href="/blogs" className="text-gray-400 hover:text-white transition-colors">
                    Career Advice
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-gray-400 hover:text-white transition-colors">
                    Join Our Team
                  </Link>
                </li>
                <li>
                  <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest job opportunities and career insights.
            </p>
            <div className="flex space-x-2">
              <Input 
                type="email" 
                placeholder="Your email"
                className="bg-gray-800 border-gray-700 text-white"
              />
              <Button>Subscribe</Button>
            </div>
            
            <h3 className="text-lg font-bold mt-6 mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        
        <Separator className="mb-8 bg-gray-800" />
        
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div className="text-gray-400 mb-4 md:mb-0">
            © {currentYear} RH Job Portal. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link href="/privacy-policy" className="text-gray-400 hover:text-white transition-colors text-sm">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
              Terms of Service
            </Link>
            <Link href="/accessibility" className="text-gray-400 hover:text-white transition-colors text-sm">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
