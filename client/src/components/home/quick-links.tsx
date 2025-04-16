import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ArrowRight, Briefcase, Building, User, Users, ChevronRight } from "lucide-react";

export default function QuickLinks() {
  // Popular job categories
  const jobCategories = [
    "Technology",
    "Finance",
    "Healthcare",
    "Education",
    "Marketing",
    "Engineering",
    "Sales",
    "Customer Service"
  ];

  // Popular locations
  const popularLocations = [
    "New York",
    "San Francisco",
    "Chicago",
    "London",
    "Toronto",
    "Sydney",
    "Singapore",
    "Berlin"
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Quick Links</h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Job Categories */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <Briefcase className="h-6 w-6 text-primary mr-2" />
                <h3 className="text-xl font-bold">Job Categories</h3>
              </div>
              
              <ul className="space-y-2">
                {jobCategories.map((category, index) => (
                  <li key={index}>
                    <Link href={`/job-board?category=${category.toLowerCase()}`}>
                      <div className="flex items-center justify-between py-2 text-gray-700 hover:text-primary transition-colors group cursor-pointer">
                        <span>{category}</span>
                        <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              
              <Link href="/sectors">
                <Button variant="link" className="mt-4 px-0 flex items-center">
                  View All Categories
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Locations */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <Building className="h-6 w-6 text-primary mr-2" />
                <h3 className="text-xl font-bold">Popular Locations</h3>
              </div>
              
              <ul className="space-y-2">
                {popularLocations.map((location, index) => (
                  <li key={index}>
                    <Link href={`/job-board?location=${location.toLowerCase()}`}>
                      <div className="flex items-center justify-between py-2 text-gray-700 hover:text-primary transition-colors group cursor-pointer">
                        <span>{location}</span>
                        <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              
              <Link href="/job-board">
                <Button variant="link" className="mt-4 px-0 flex items-center">
                  Explore All Locations
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* For Employers & Job Seekers */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-primary mr-2" />
                <h3 className="text-xl font-bold">Quick Access</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-lg mb-2 flex items-center">
                    <User className="h-5 w-5 mr-2 text-gray-500" />
                    For Job Seekers
                  </h4>
                  <ul className="space-y-2 pl-7">
                    <li>
                      <Link href="/auth?type=jobseeker">
                        <div className="text-gray-700 hover:text-primary transition-colors cursor-pointer">
                          Register an Account
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/job-board">
                        <div className="text-gray-700 hover:text-primary transition-colors cursor-pointer">
                          Find Jobs
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/blogs">
                        <div className="text-gray-700 hover:text-primary transition-colors cursor-pointer">
                          Career Resources
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-lg mb-2 flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-gray-500" />
                    For Employers
                  </h4>
                  <ul className="space-y-2 pl-7">
                    <li>
                      <Link href="/auth?type=employer">
                        <div className="text-gray-700 hover:text-primary transition-colors cursor-pointer">
                          Post a Job
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/services">
                        <div className="text-gray-700 hover:text-primary transition-colors cursor-pointer">
                          Our Services
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact-us">
                        <div className="text-gray-700 hover:text-primary transition-colors cursor-pointer">
                          Contact Us
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Social Media Integration */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold mb-4 text-center">Connect With Us</h3>
          
          <div className="flex justify-center space-x-6">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors"
              aria-label="Facebook"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
              </svg>
            </a>
            
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-400 text-white p-3 rounded-full hover:bg-blue-500 transition-colors"
              aria-label="Twitter"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
              </svg>
            </a>
            
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-blue-700 text-white p-3 rounded-full hover:bg-blue-800 transition-colors"
              aria-label="LinkedIn"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
            
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white p-3 rounded-full hover:from-purple-600 hover:via-pink-600 hover:to-orange-600 transition-colors"
              aria-label="Instagram"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
