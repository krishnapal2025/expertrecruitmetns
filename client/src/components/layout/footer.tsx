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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
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
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-gray-400 hover:text-white transition-colors">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/about-us">
                  <a className="text-gray-400 hover:text-white transition-colors">About Us</a>
                </Link>
              </li>
              <li>
                <Link href="/services">
                  <a className="text-gray-400 hover:text-white transition-colors">Services</a>
                </Link>
              </li>
              <li>
                <Link href="/job-board">
                  <a className="text-gray-400 hover:text-white transition-colors">Job Board</a>
                </Link>
              </li>
              <li>
                <Link href="/sectors">
                  <a className="text-gray-400 hover:text-white transition-colors">Sectors</a>
                </Link>
              </li>
              <li>
                <Link href="/blogs">
                  <a className="text-gray-400 hover:text-white transition-colors">Blogs</a>
                </Link>
              </li>
              <li>
                <Link href="/contact-us">
                  <a className="text-gray-400 hover:text-white transition-colors">Contact Us</a>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">For Job Seekers</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/auth?type=jobseeker">
                  <a className="text-gray-400 hover:text-white transition-colors">Register</a>
                </Link>
              </li>
              <li>
                <Link href="/job-board">
                  <a className="text-gray-400 hover:text-white transition-colors">Browse Jobs</a>
                </Link>
              </li>
              <li>
                <Link href="/sectors">
                  <a className="text-gray-400 hover:text-white transition-colors">Career Sectors</a>
                </Link>
              </li>
              <li>
                <Link href="/blogs">
                  <a className="text-gray-400 hover:text-white transition-colors">Career Advice</a>
                </Link>
              </li>
              <li>
                <Link href="/careers">
                  <a className="text-gray-400 hover:text-white transition-colors">Join Our Team</a>
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy">
                  <a className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
                </Link>
              </li>
            </ul>
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
            <Link href="/privacy-policy">
              <a className="text-gray-400 hover:text-white transition-colors text-sm">
                Privacy Policy
              </a>
            </Link>
            <Link href="/terms">
              <a className="text-gray-400 hover:text-white transition-colors text-sm">
                Terms of Service
              </a>
            </Link>
            <Link href="/accessibility">
              <a className="text-gray-400 hover:text-white transition-colors text-sm">
                Accessibility
              </a>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
