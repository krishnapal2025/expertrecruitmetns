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
          <div className="flex flex-col h-full">
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col h-full">
              <div className="flex items-center mb-5">
                <Briefcase className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-xl font-bold">Job Categories</h3>
              </div>
              
              <ul className="space-y-3 flex-grow">
                {jobCategories.map((category, index) => (
                  <li key={index}>
                    <Link href={`/job-board?category=${category.toLowerCase()}`}>
                      <div className="flex items-center justify-between py-2 px-1 text-gray-700 hover:text-primary transition-colors group cursor-pointer">
                        <span>{category}</span>
                        <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              
              <Link href="/sectors">
                <Button variant="link" className="mt-6 px-0 flex items-center">
                  Find Jobs By Category
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Locations */}
          <div className="flex flex-col h-full">
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col h-full">
              <div className="flex items-center mb-5">
                <Building className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-xl font-bold">Popular Locations</h3>
              </div>
              
              <ul className="space-y-3 flex-grow">
                {popularLocations.map((location, index) => (
                  <li key={index}>
                    <Link href={`/job-board?location=${location.toLowerCase()}`}>
                      <div className="flex items-center justify-between py-2 px-1 text-gray-700 hover:text-primary transition-colors group cursor-pointer">
                        <span>{location}</span>
                        <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              
              <Link href="/job-board">
                <Button variant="link" className="mt-6 px-0 flex items-center">
                  Find Jobs By Location
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          
          {/* For Employers & Job Seekers */}
          <div className="flex flex-col h-full">
            <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col h-full">
              <div className="flex items-center mb-5">
                <Users className="h-6 w-6 text-primary mr-3" />
                <h3 className="text-xl font-bold">Quick Access</h3>
              </div>
              
              <div className="space-y-5 flex-grow">
                <div>
                  <h4 className="font-medium text-lg mb-3 flex items-center">
                    <User className="h-5 w-5 mr-2 text-gray-500" />
                    For Job Seekers
                  </h4>
                  <ul className="space-y-3 pl-7">
                    <li>
                      <Link href="/auth?type=jobseeker">
                        <div className="text-gray-700 hover:text-primary transition-colors cursor-pointer py-1">
                          Register as Job Seeker
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/job-board">
                        <div className="text-gray-700 hover:text-primary transition-colors cursor-pointer py-1">
                          Find Jobs
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/blogs">
                        <div className="text-gray-700 hover:text-primary transition-colors cursor-pointer py-1">
                          Career Resources
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-lg mb-3 flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-gray-500" />
                    For Employers
                  </h4>
                  <ul className="space-y-3 pl-7">
                    <li>
                      <Link href="/auth?type=employer">
                        <div className="text-gray-700 hover:text-primary transition-colors cursor-pointer py-1">
                          Register as Employer
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/auth?type=employer">
                        <div className="text-gray-700 hover:text-primary transition-colors cursor-pointer py-1">
                          Post a Job
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/hire-talent">
                        <div className="text-gray-700 hover:text-primary transition-colors cursor-pointer py-1">
                          Hire Talent
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/services">
                        <div className="text-gray-700 hover:text-primary transition-colors cursor-pointer py-1">
                          Our Services
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link href="/contact-us">
                        <div className="text-gray-700 hover:text-primary transition-colors cursor-pointer py-1">
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
      </div>
    </section>
  );
}
