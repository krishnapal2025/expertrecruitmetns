import { useState } from "react";
import { 
  Search, 
  MapPin, 
  Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

export default function SearchBar() {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Construct search URL with query params
    const params = new URLSearchParams();
    if (jobTitle) params.append("q", jobTitle);
    if (location) params.append("location", location);
    
    // Navigate to the search results page with the search parameters
    window.location.href = `/job-board?${params.toString()}`; // Points to Find Jobs page
  };

  return (
    <section className="pt-28 pb-16 z-10 relative">
      {/* Pure white background */}
      <div className="absolute inset-0 -z-10 overflow-hidden bg-white dark:bg-gray-950">
        {/* Decorative floating elements */}
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-50 dark:bg-blue-900/20 rounded-full opacity-50 -mr-40 -mb-20 blur-3xl"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-50 dark:bg-indigo-900/20 rounded-full opacity-50 -ml-20 -mt-20 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4">
        {/* Main search form with enhanced styling */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-4xl mx-auto"
        >
          {/* Decorative shapes */}
          <div className="absolute -top-12 right-10 w-24 h-24 border-4 border-primary/10 rounded-full z-0"></div>
          <div className="absolute -bottom-12 left-10 w-16 h-16 border-4 border-indigo-500/10 rounded-full z-0"></div>
          
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8 border border-gray-100 dark:border-gray-800 relative overflow-hidden z-10">
            {/* Top accent bar with enhanced gradient */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-primary/70 via-indigo-500/80 to-purple-500/70"></div>
            
            <h2 className="text-3xl font-bold mb-8 text-center relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">Find Your Dream Job</span>
            </h2>
            
            <form onSubmit={handleSearch} className="space-y-5">
              <div className="grid md:grid-cols-5 gap-4">
                {/* Job title input */}
                <div className="relative col-span-2">
                  <div className="absolute left-3 top-3.5 text-gray-400">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <Input
                    type="text"
                    placeholder="Job title or keyword"
                    className="pl-10 h-12 w-full"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                  />
                </div>
                
                {/* Location input */}
                <div className="relative col-span-2">
                  <div className="absolute left-3 top-3.5 text-gray-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <Input
                    type="text"
                    placeholder="City, state, or remote"
                    className="pl-10 h-12 w-full"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                
                {/* Search button */}
                <div>
                  <Button 
                    type="submit"
                    className="w-full h-12 bg-primary" 
                    size="lg"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    <span>Search</span>
                  </Button>
                </div>
              </div>

            </form>
          </div>
        </motion.div>
        
        {/* Enhanced Stats counter */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-16 max-w-3xl mx-auto"
        >
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-800">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-center">
              {/* Active Jobs */}
              <div className="relative group">
                <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <Briefcase className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">35,000+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Active Jobs</div>
              </div>
              
              {/* Companies */}
              <div className="relative group">
                <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-indigo-600"
                  >
                    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
                    <line x1="9" y1="22" x2="9" y2="22"></line>
                    <line x1="15" y1="22" x2="15" y2="22"></line>
                    <line x1="12" y1="6" x2="12" y2="6"></line>
                    <line x1="12" y1="11" x2="12" y2="11"></line>
                    <line x1="12" y1="16" x2="12" y2="16"></line>
                  </svg>
                </div>
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">7,500+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Companies</div>
              </div>
              
              {/* Job Seekers */}
              <div className="relative group">
                <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-purple-600"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-600">12M+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">Job Seekers</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}