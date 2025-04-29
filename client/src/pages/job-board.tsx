import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Job } from "@shared/schema";
import JobCard from "@/components/job/job-card";
import JobFilter from "@/components/job/job-filter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, Briefcase, Loader2 } from "lucide-react";

const JOBS_PER_PAGE = 10;

export default function JobBoardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
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
      
      const response = await fetch(`/api/jobs?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch jobs");
      }
      return response.json();
    },
    // Refetch job data frequently to show new jobs immediately
    refetchInterval: 2000, // Refetch every 2 seconds
    refetchOnMount: true, 
    refetchOnWindowFocus: true
  });

  // Update filtered jobs when search term or filters change
  useEffect(() => {
    if (!jobs) return;

    let result = [...jobs];
    
    // Apply search term filter (only for client-side filtering)
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(job => 
        job.title.toLowerCase().includes(term) || 
        job.description.toLowerCase().includes(term) ||
        job.location.toLowerCase().includes(term)
      );
    }
    
    setFilteredJobs(result);
    setCurrentPage(1); // Reset to first page when filters change
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
      </Helmet>

      <div className="relative py-12 bg-gray-50 overflow-hidden">
        {/* Accent lines */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gray-200"></div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-1/3 h-full overflow-hidden">
          <div className="absolute -right-20 top-1/4 w-80 h-80 bg-primary/5 rounded-full"></div>
          <div className="absolute -right-10 bottom-1/4 w-40 h-40 bg-primary/5 rounded-full"></div>
        </div>
        
        <div className="absolute left-0 bottom-0 w-1/4 h-80 overflow-hidden">
          <div className="absolute -left-20 bottom-0 w-64 h-64 bg-gray-100 rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          {/* Main content */}
          <div className="flex flex-col items-center text-center max-w-5xl mx-auto mb-8">
            <div className="inline-block mb-4 px-5 py-2 bg-white border-b-2 border-primary shadow-sm rounded-md">
              <span className="font-medium text-primary tracking-wider uppercase text-sm">Find Your Career</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-gray-800 tracking-tight">
              Find Your Perfect Job
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed mb-6 max-w-3xl">
              Browse through thousands of opportunities from top employers worldwide
            </p>
            
            <div className="relative w-full max-w-2xl mb-2">
              <Input
                type="text"
                placeholder="Search for jobs, keywords, or companies..."
                className="pl-10 py-6 text-gray-900 border border-gray-200 rounded-lg shadow-sm"
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
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters sidebar */}
          <div className="w-full md:w-1/4">
            <JobFilter onFilterChange={applyFilters} />
          </div>
          
          {/* Job listings */}
          <div className="w-full md:w-3/4">
            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : filteredJobs.length > 0 ? (
              <>
                <div className="mb-6 flex justify-between items-center">
                  <h2 className="text-xl font-semibold flex items-center">
                    <Briefcase className="mr-2" />
                    <span>{filteredJobs.length} Jobs Found</span>
                  </h2>
                  <div className="text-sm text-gray-600">
                    Showing {Math.min((currentPage - 1) * JOBS_PER_PAGE + 1, filteredJobs.length)} to {Math.min(currentPage * JOBS_PER_PAGE, filteredJobs.length)} of {filteredJobs.length}
                  </div>
                </div>
                
                <div className="space-y-6">
                  {paginatedJobs.map((job) => (
                    <JobCard key={job.id} job={job} />
                  ))}
                </div>
                
                {totalPages > 1 && (
                  <Pagination className="mt-8">
                    <PaginationContent>
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
                      
                      {/* Page numbers */}
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
              </>
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
    </>
  );
}
