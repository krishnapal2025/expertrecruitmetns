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
    <section className="pt-28 pb-16 z-10 relative border-t border-gray-100 dark:border-gray-800">
      {/* Background image with overlay */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white/95 to-white/90 dark:from-gray-950/95 dark:to-gray-950/90 backdrop-blur-sm"></div>
        <img 
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2000&auto=format&fit=crop"
          alt="" 
          className="w-full h-full object-cover opacity-10"
        />
      </div>
      
      {/* Pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5 -z-10"></div>
      
      <div className="container mx-auto px-4">
        {/* Main search form */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-4xl mx-auto"
        >
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-6 border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-center">Find Your Dream Job</h2>
            
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
        
        {/* Stats counter */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-10 flex justify-center gap-10 text-center"
        >
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">35,000+</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Active Jobs</div>
          </div>
          <div className="h-12 w-px bg-gray-200 dark:bg-gray-800"></div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">7,500+</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Companies</div>
          </div>
          <div className="h-12 w-px bg-gray-200 dark:bg-gray-800"></div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">12M+</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">Job Seekers</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}