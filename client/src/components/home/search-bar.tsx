import { useState } from "react";
import { 
  Search, 
  MapPin, 
  Briefcase,
  ArrowRight, 
  Filter 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import { motion } from "framer-motion";

// Popular locations for quick selection
const popularLocations = [
  "New York", "San Francisco", "London", "Remote", "Chicago", "Austin"
];

// Popular job categories for quick selection
const popularCategories = [
  "Software Engineer", "Product Manager", "Data Scientist", "Designer", "Marketing"
];

export default function SearchBar() {
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Construct search URL with query params
    const params = new URLSearchParams();
    if (jobTitle) params.append("q", jobTitle);
    if (location) params.append("location", location);
    
    // Navigate to the search results page with the search parameters
    window.location.href = `/job-board?${params.toString()}`;
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-950 z-10 relative border-t border-gray-100 dark:border-gray-800">
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
              
              {/* Advanced filters toggle */}
              <div className="flex items-center justify-between">
                <button 
                  type="button"
                  onClick={() => setShowFilters(!showFilters)} 
                  className="text-sm flex items-center text-gray-500 hover:text-primary"
                >
                  <Filter className="h-4 w-4 mr-1" />
                  {showFilters ? 'Hide filters' : 'More filters'}
                </button>
                
                <Link href="/job-board" className="text-sm flex items-center text-primary hover:underline">
                  Browse all jobs
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
              
              {/* Advanced filters (expandable) */}
              {showFilters && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="pt-4 border-t border-gray-100 dark:border-gray-800"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Popular Locations</h3>
                      <div className="flex flex-wrap gap-2">
                        {popularLocations.map((loc) => (
                          <button
                            key={loc}
                            type="button"
                            onClick={() => setLocation(loc)}
                            className={`text-xs py-1 px-2 rounded-full ${
                              location === loc
                                ? "bg-primary/10 text-primary"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            }`}
                          >
                            {loc}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">Popular Categories</h3>
                      <div className="flex flex-wrap gap-2">
                        {popularCategories.map((category) => (
                          <button
                            key={category}
                            type="button"
                            onClick={() => setJobTitle(category)}
                            className={`text-xs py-1 px-2 rounded-full ${
                              jobTitle === category
                                ? "bg-primary/10 text-primary"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
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