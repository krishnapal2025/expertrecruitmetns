import React, { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Job } from "@shared/schema";
import JobCard from "@/components/job/job-card";
import JobFilter from "@/components/job/job-filter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, Briefcase, ChevronDown, Loader2, Maximize2, Minimize2, Building2, MapPin, UserPlus, ArrowRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import OptimizedHeroBackground from "@/components/hero/optimized-hero-background";
import jobBoardHeroImage from "../assets/job-board-hero.jpg";

const JOBS_PER_PAGE = 4;

export default function JobBoardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const jobExplorerRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    jobType: "",
    specialization: "",
    experience: "",
    minSalary: undefined as number | undefined,
    maxSalary: undefined as number | undefined,
    keyword: undefined as string | undefined
  });

  // Fetch all jobs - with frequent refetching to ensure newly posted jobs appear immediately
  const { data: jobs, isLoading, error } = useQuery<Job[]>({
    queryKey: ["/api/jobs", filters],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      if (filters.category) queryParams.append("category", filters.category);
      if (filters.location) queryParams.append("location", filters.location);
      if (filters.jobType) queryParams.append("jobType", filters.jobType);
      if (filters.specialization) queryParams.append("specialization", filters.specialization);
      if (filters.experience) queryParams.append("experience", filters.experience);
      if (filters.minSalary) queryParams.append("minSalary", filters.minSalary.toString());
      if (filters.maxSalary) queryParams.append("maxSalary", filters.maxSalary.toString());
      if (filters.keyword) queryParams.append("keyword", filters.keyword);
      
      const response = await fetch('/api/jobs?' + queryParams.toString());
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }
      return response.json();
    },
    refetchInterval: 2000,
    refetchOnMount: true, 
    refetchOnWindowFocus: true
  });

  // Update filtered jobs when search term or filters change
  useEffect(() => {
    if (!jobs) return;

    let result = [...jobs];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(job => 
        job.title.toLowerCase().includes(term) || 
        job.description.toLowerCase().includes(term) ||
        job.location.toLowerCase().includes(term)
      );
    }
    
    setFilteredJobs(result);
    setCurrentPage(1);
  }, [
    jobs, 
    searchTerm, 
    filters.category, 
    filters.location, 
    filters.jobType, 
    filters.specialization, 
    filters.experience,
    filters.minSalary,
    filters.maxSalary,
    filters.keyword
  ]);

  // Calculate pagination
  const totalPages = Math.ceil((filteredJobs?.length || 0) / JOBS_PER_PAGE);
  const paginatedJobs = filteredJobs?.slice(
    (currentPage - 1) * JOBS_PER_PAGE,
    currentPage * JOBS_PER_PAGE
  );

  // Apply filters
  const applyFilters = (newFilters: {
    category: string;
    location: string;
    jobType: string;
    specialization: string;
    experience: string;
    minSalary?: number;
    maxSalary?: number;
    keyword?: string;
  }) => {
    setFilters({
      ...filters,
      ...newFilters
    });
  };
  
  // Handle browser fullscreen API
  const toggleFullScreen = () => {
    if (!isFullScreen) {
      if (jobExplorerRef.current?.requestFullscreen) {
        jobExplorerRef.current.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => {
          console.error(`Error attempting to exit fullscreen: ${err.message}`);
        });
      }
    }
    setIsFullScreen(!isFullScreen);
  }
  
  // Handle fullscreen change events
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Jobs</h2>
          <p className="text-gray-600">{(error as Error).message}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Find Jobs | Expert Recruitments</title>
        <meta name="description" content="Browse through our extensive collection of job listings across various sectors and locations. Find your perfect career opportunity today." />
        <meta name="keywords" content="Executive search UAE, Recruitment agency Dubai, Headhunters Dubai, Job opportunities UAE, Career Dubai, Employment agencies UAE, Executive jobs Dubai, Top recruitment firms, Dubai job market, UAE employment, Senior management positions, C-level jobs UAE, UAE hiring services, Dubai employment portal, Recruitment companies UAE" />
      </Helmet>
      
      {/* Hidden SEO keywords that are not visible to users but help with search engines */}
      <div className="sr-only" aria-hidden="true">
        <h2>Find Jobs in Dubai and UAE with Expert Recruitments</h2>
        <p>Looking for executive positions in Dubai? Expert Recruitments is a leading headhunting firm in the UAE offering premium job opportunities across finance, technology, healthcare, construction, oil & gas, and hospitality sectors.</p>
        <p>Browse our job board for senior management roles, director positions, C-suite opportunities, and specialized professional careers throughout the UAE and Middle East.</p>
        <ul>
          <li>CEO Jobs Dubai</li>
          <li>CFO Positions UAE</li>
          <li>IT Director Jobs Dubai</li>
          <li>Finance Manager UAE</li>
          <li>Operations Director Middle East</li>
          <li>Sales Executive Dubai</li>
          <li>Marketing Director UAE</li>
          <li>Human Resources Manager Dubai</li>
          <li>Engineering Director UAE</li>
          <li>Healthcare Administrator Dubai</li>
          <li>Construction Project Manager UAE</li>
          <li>Banking Executive Dubai</li>
          <li>Legal Counsel UAE</li>
          <li>Supply Chain Director Middle East</li>
        </ul>
      </div>

      {/* Hero Section with Professional Background Image */}
      <div className="relative min-h-[90vh] overflow-hidden" id="job-board-hero-section">
        {/* Optimized Background Image */}
        <OptimizedHeroBackground 
          imageSrc={jobBoardHeroImage}
          alt="Office setting with job board"
          brightness={0.85}
          overlayOpacity={0.65}
        />
        
        {/* Accent lines */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20 z-10"></div>
        
        <div className="w-full max-w-[1440px] mx-auto px-4 relative py-32 md:py-40">
          {/* Main content */}
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto mb-8 relative z-20">
            <motion.div 
              className="inline-block mb-6 px-5 py-2 bg-white/90 border-b-2 border-primary shadow-sm rounded-md backdrop-blur-sm"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="font-medium text-primary tracking-wider uppercase text-sm">Find Your Next Opportunity</span>
            </motion.div>
            
            <motion.h1 
              className="text-2xl sm:text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight drop-shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.7 }}
            >
              Discover Your Dream Career
            </motion.h1>
            
            <motion.p 
              className="text-xl text-white/90 leading-relaxed mb-8 max-w-3xl drop-shadow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Browse through our curated selection of premium job opportunities from leading employers across Dubai and the UAE
            </motion.p>
            
            {/* Search Box */}
            <motion.div 
              className="relative w-full max-w-2xl mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <Input
                type="text"
                placeholder="Search for jobs, keywords, or companies..."
                className="pl-10 py-6 text-gray-900 border border-gray-200 rounded-lg shadow-lg bg-white/95 backdrop-blur-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setFilters({
                      ...filters,
                      keyword: searchTerm.trim() || undefined
                    });
                  }
                }}
              />
              <Search 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer" 
                onClick={() => {
                  setFilters({
                    ...filters,
                    keyword: searchTerm.trim() || undefined
                  });
                }}
              />
              <Button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 gap-1"
                onClick={() => {
                  setFilters({
                    ...filters,
                    keyword: searchTerm.trim() || undefined
                  });
                }}
              >
                Search <ArrowRight size={16} />
              </Button>
            </motion.div>
            
            {/* Job Stats */}
            <motion.div 
              className="flex flex-wrap justify-center gap-8 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <div className="flex items-center gap-2 text-white">
                <Building2 className="h-5 w-5 text-white/80" />
                <span>Premium Employers</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Briefcase className="h-5 w-5 text-white/80" />
                <span>Executive Positions</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <MapPin className="h-5 w-5 text-white/80" />
                <span>UAE & Global Opportunities</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <UserPlus className="h-5 w-5 text-white/80" />
                <span>Exclusive Listings</span>
              </div>
            </motion.div>
            
            {/* Scroll Down Button */}
            <a 
              href="#job-explorer" 
              className="flex flex-col items-center mt-12 text-white/80 hover:text-white transition-colors duration-300"
            >
              <span className="text-sm font-medium mb-2">Explore More</span>
              <div className="w-10 h-10 rounded-full border-2 border-white/30 flex items-center justify-center">
                <ChevronDown className="h-6 w-6" />
              </div>
            </a>
          </div>
        </div>
      </div>

      <div id="job-explorer" className="container mx-auto px-4 py-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">Job Explorer</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleFullScreen}
            className="flex items-center gap-2 text-primary hover:bg-primary/10"
          >
            {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            <span>{isFullScreen ? "Exit Fullscreen" : "Fullscreen View"}</span>
          </Button>
        </div>
        <div 
          ref={jobExplorerRef}
          className={`relative rounded-xl shadow-md border border-gray-100 bg-white h-[calc(100vh-220px)] overflow-hidden ${isFullScreen ? 'fixed inset-0 z-50 m-0 rounded-none job-explorer-fullscreen' : ''}`}
        >
          {isFullScreen && (
            <div className="absolute top-4 right-4 z-10">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullScreen}
                className="flex items-center gap-2 text-primary hover:bg-primary/10"
                title="Exit Fullscreen"
              >
                <Minimize2 className="h-4 w-4" />
                <span>Exit Fullscreen</span>
              </Button>
            </div>
          )}
          
          <div className={`sticky top-0 z-10 bg-white px-4 md:px-6 py-4 border-b border-gray-200 ${isFullScreen ? 'job-explorer-header' : ''}`}>
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-2">
              <h2 className="text-lg md:text-xl font-semibold flex items-center">
                <Briefcase className="mr-2 h-5 w-5" />
                <span>{filteredJobs?.length || 0} Jobs Found</span>
              </h2>
              <div className="text-xs md:text-sm text-gray-600">
                {filteredJobs?.length > 0 ? (
                  <>Showing {Math.min((currentPage - 1) * JOBS_PER_PAGE + 1, filteredJobs.length)} to {Math.min(currentPage * JOBS_PER_PAGE, filteredJobs.length)} of {filteredJobs.length}</>
                ) : isLoading ? (
                  <>Loading jobs...</>
                ) : (
                  <>No jobs found</>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row h-[calc(100%-4rem)] overflow-hidden">
            <div className="w-full md:w-1/3 lg:w-1/4 h-auto md:h-full border-b md:border-b-0 md:border-r border-gray-100 overflow-hidden">
              <ScrollArea className="h-full max-h-[400px] md:max-h-full pb-16 md:pb-6 scrollbar-hide p-4">
                <JobFilter onFilterChange={applyFilters} />
              </ScrollArea>
            </div>
            
            <div className="w-full md:w-2/3 lg:w-3/4 h-full overflow-hidden">
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              ) : filteredJobs.length > 0 ? (
                <div className="flex flex-col h-full overflow-hidden relative px-6">
                  <ScrollArea className="h-full pb-6 overflow-hidden scrollbar-hide">
                    <div className="space-y-6 mt-6 pr-4">
                      {paginatedJobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                      ))}
                    </div>
                    
                    {totalPages > 1 && (
                      <Pagination className="my-8 sticky bottom-0 bg-white pt-4 pb-2">
                        <PaginationContent className="flex flex-wrap justify-center">
                          <PaginationItem>
                            <Button 
                              variant="outline"
                              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                              disabled={currentPage === 1}
                              className="h-8 w-8 p-0 flex items-center justify-center"
                            >
                              &lt;
                            </Button>
                          </PaginationItem>
                          
                          {/* Desktop pagination showing all pages */}
                          <div className="hidden md:flex">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                              <PaginationItem key={pageNum}>
                                <Button
                                  variant={pageNum === currentPage ? "default" : "outline"}
                                  className="h-8 w-8"
                                  onClick={() => setCurrentPage(pageNum)}
                                >
                                  {pageNum}
                                </Button>
                              </PaginationItem>
                            ))}
                          </div>
                          
                          {/* Mobile pagination showing current page and total */}
                          <div className="flex md:hidden items-center">
                            <PaginationItem>
                              <div className="px-3 py-1">
                                {currentPage} / {totalPages}
                              </div>
                            </PaginationItem>
                          </div>
                          
                          <PaginationItem>
                            <Button 
                              variant="outline"
                              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                              disabled={currentPage === totalPages}
                              className="h-8 w-8 p-0 flex items-center justify-center"
                            >
                              &gt;
                            </Button>
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    )}
                  </ScrollArea>
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-lg">
                  <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                  <p className="text-gray-600 mb-6">
                    We couldn't find any jobs matching your search criteria.
                  </p>
                  <Button onClick={() => {
                    setSearchTerm("");
                    setFilters({ 
                      category: "", 
                      location: "", 
                      jobType: "", 
                      specialization: "",
                      experience: "",
                      minSalary: undefined,
                      maxSalary: undefined,
                      keyword: undefined
                    });
                  }}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
