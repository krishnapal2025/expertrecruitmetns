import { useState, useMemo } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Job } from "@shared/schema";
import { 
  Briefcase, Building, Calendar, Clock, Edit, EyeIcon, ExternalLink, 
  MapPin, Plus, Search, SlidersHorizontal, Trash2, Users, X 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

// Predefined filter options
const jobCategories = [
  "Accounting & Finance",
  "Administration",
  "Customer Service",
  "Engineering",
  "Healthcare",
  "Human Resources",
  "Information Technology",
  "Legal",
  "Marketing",
  "Operations",
  "Project Management",
  "Research & Development",
  "Retail",
  "Sales",
  "Supply Chain",
  "Other"
];

const jobTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
  "Internship",
  "Remote"
];

const experienceLevels = [
  "Entry Level",
  "Junior",
  "Mid-Level",
  "Senior",
  "Manager",
  "Director",
  "Executive"
];

const locations = [
  "New York",
  "Los Angeles",
  "Chicago",
  "Houston",
  "Phoenix",
  "Philadelphia",
  "San Antonio",
  "San Diego",
  "Dallas",
  "San Jose",
  "Remote"
];

const specializations = [
  "Web Development",
  "Mobile Development",
  "Data Science",
  "AI/Machine Learning",
  "DevOps/Cloud",
  "Cybersecurity",
  "UX/UI Design",
  "Product Management",
  "Digital Marketing",
  "Content Creation",
  "Data Analysis",
  "Healthcare Admin",
  "Legal Services",
  "Accounting",
  "Human Resources",
  "Customer Support",
  "Sales",
  "Other"
];

export default function PostManagerPage() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [jobToDelete, setJobToDelete] = useState<number | null>(null);
  const [jobToPreview, setJobToPreview] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  
  // Filter states
  const [filters, setFilters] = useState({
    category: "",
    jobType: "",
    specialization: "",
    location: "",
    experience: "",
    salaryRange: [0, 300000] as [number, number],
    sortBy: "latest" as "latest" | "a-z" | "z-a" | "salary-low" | "salary-high"
  });
  
  // Jobs endpoint (admin only)
  const endpoint = "/api/jobs";
  
  // Fetch jobs
  const { data: jobs, isLoading } = useQuery<Job[]>({
    queryKey: [endpoint],
    queryFn: async () => {
      const res = await apiRequest("GET", endpoint);
      if (!res.ok) throw new Error("Failed to fetch job listings");
      return await res.json();
    },
    enabled: !!currentUser?.profile.id && 
      (currentUser?.user.userType === "admin" || currentUser?.user.userType === "super_admin"),
  });
  
  // Get active and closed jobs
  const activeJobs = jobs?.filter(job => {
    const deadline = new Date(job.applicationDeadline);
    return deadline >= new Date();
  }) || [];
  
  const closedJobs = jobs?.filter(job => {
    const deadline = new Date(job.applicationDeadline);
    return deadline < new Date();
  }) || [];
  
  // Apply filters to jobs
  const applyFilters = (jobList: Job[]) => {
    let filteredJobs = [...jobList];
    
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filteredJobs = filteredJobs.filter(job => 
        job.title.toLowerCase().includes(term) || 
        job.company.toLowerCase().includes(term) ||
        job.description.toLowerCase().includes(term)
      );
    }
    
    // Apply category filter
    if (filters.category) {
      filteredJobs = filteredJobs.filter(job => job.category === filters.category);
    }
    
    // Apply job type filter
    if (filters.jobType) {
      filteredJobs = filteredJobs.filter(job => job.jobType === filters.jobType);
    }
    
    // Apply specialization filter
    if (filters.specialization) {
      filteredJobs = filteredJobs.filter(job => job.specialization === filters.specialization);
    }
    
    // Apply location filter
    if (filters.location) {
      filteredJobs = filteredJobs.filter(job => job.location === filters.location);
    }
    
    // Apply experience filter
    if (filters.experience) {
      filteredJobs = filteredJobs.filter(job => job.experience === filters.experience);
    }
    
    // Apply salary range filter
    filteredJobs = filteredJobs.filter(job => 
      (job.minSalary === null || job.minSalary >= filters.salaryRange[0]) &&
      (job.maxSalary === null || job.maxSalary <= filters.salaryRange[1])
    );
    
    // Apply sorting
    switch (filters.sortBy) {
      case "latest":
        filteredJobs.sort((a, b) => {
          const dateA = a.createdAt ? new Date(a.createdAt) : new Date();
          const dateB = b.createdAt ? new Date(b.createdAt) : new Date();
          return dateB.getTime() - dateA.getTime();
        });
        break;
      case "a-z":
        filteredJobs.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "z-a":
        filteredJobs.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "salary-low":
        filteredJobs.sort((a, b) => (a.minSalary || 0) - (b.minSalary || 0));
        break;
      case "salary-high":
        filteredJobs.sort((a, b) => (b.maxSalary || 0) - (a.maxSalary || 0));
        break;
    }
    
    return filteredJobs;
  };
  
  // Apply filters and pagination
  const filteredActiveJobs = applyFilters(activeJobs);
  const filteredClosedJobs = applyFilters(closedJobs);
  
  // Reset filters
  const resetFilters = () => {
    setFilters({
      category: "",
      jobType: "",
      specialization: "",
      location: "",
      experience: "",
      salaryRange: [0, 300000],
      sortBy: "latest"
    });
    setSearchTerm("");
    setCurrentPage(1);
  };
  
  // Handle filter changes
  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filter changes
  };
  
  // Pagination logic
  const paginateJobs = (jobList: Job[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return jobList.slice(startIndex, startIndex + itemsPerPage);
  };
  
  const paginatedActiveJobs = paginateJobs(filteredActiveJobs);
  const paginatedClosedJobs = paginateJobs(filteredClosedJobs);
  
  const totalActivePages = Math.ceil(filteredActiveJobs.length / itemsPerPage);
  const totalClosedPages = Math.ceil(filteredClosedJobs.length / itemsPerPage);
  
  // Delete job mutation
  const deleteJobMutation = useMutation({
    mutationFn: async (jobId: number) => {
      const res = await apiRequest("DELETE", `/api/jobs/${jobId}`);
      if (!res.ok) throw new Error("Failed to delete job listing");
      return true;
    },
    onSuccess: () => {
      toast({
        title: "Job Deleted",
        description: "The job listing has been successfully deleted.",
      });
      
      // Invalidate queries to refresh job listings
      queryClient.invalidateQueries({ queryKey: ["/api/employer/jobs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      
      // Reset job to delete
      setJobToDelete(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Delete Job",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle job deletion
  const confirmDelete = () => {
    if (jobToDelete !== null) {
      deleteJobMutation.mutate(jobToDelete);
    }
  };
  
  // Job card component
  const JobCard = ({ job, status }: { job: Job, status: "active" | "closed" }) => {
    const isActive = status === "active";
    const postedDate = job.createdAt ? new Date(job.createdAt) : new Date(job.postedDate || Date.now());
    const deadline = job.applicationDeadline ? new Date(job.applicationDeadline) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    // Calculate days remaining until deadline
    const daysRemaining = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 3600 * 24));
    
    return (
      <Card className={`mb-4 ${!isActive ? "opacity-70" : ""}`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>{job.title}</CardTitle>
              <div className="flex items-center mt-1 text-gray-600">
                <Building className="h-4 w-4 mr-1" />
                <span>{job.company}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant={isActive ? "default" : "secondary"}>
                {isActive ? "Active" : "Closed"}
              </Badge>
              <Badge variant="outline">{job.jobType}</Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pb-3">
          <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {job.location}
            </div>
            <div className="flex items-center">
              <Briefcase className="h-4 w-4 mr-1" />
              {job.category}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              Posted {formatDistanceToNow(postedDate, { addSuffix: true })}
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {isActive
                ? daysRemaining > 0
                  ? `${daysRemaining} day${daysRemaining !== 1 ? "s" : ""} left`
                  : "Deadline today"
                : "Deadline passed"
              }
            </div>
          </div>
          
          <div className="flex items-center text-gray-600 text-sm">
            <Users className="h-4 w-4 mr-1" />
            <span>
              <span className="font-medium">{job.applicationCount || 0}</span> Application{(job.applicationCount !== 1) ? "s" : ""} Received
            </span>
          </div>
        </CardContent>
        
        <Separator />
        
        <CardFooter className="pt-3 flex justify-between">
          <div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setLocation(`/jobs/${job.id}`)}
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              View
            </Button>
          </div>
          
          <div className="flex space-x-2">
            {isActive && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setLocation(`/edit-job/${job.id}`)}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
            
            <Dialog onOpenChange={(open) => {
                if (!open) setJobToDelete(null);
              }}>
              <DialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => setJobToDelete(job.id)}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you sure you want to delete this job?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete the job posting
                    and all associated applications.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setJobToDelete(null)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={(e) => {
                      e.preventDefault();
                      confirmDelete();
                    }}
                    disabled={deleteJobMutation.isPending}
                  >
                    {deleteJobMutation.isPending ? "Deleting..." : "Delete Job"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardFooter>
      </Card>
    );
  };
  
  // Loading skeleton component
  const JobCardSkeleton = () => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between">
          <div>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-36 mt-2" />
          </div>
          <div className="flex items-center space-x-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex flex-wrap gap-3 mb-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-4 w-56" />
      </CardContent>
      <Separator />
      <CardFooter className="pt-3 flex justify-between">
        <Skeleton className="h-8 w-16" />
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardFooter>
    </Card>
  );
  
  return (
    <div className="container mx-auto px-4 py-12">
      <Helmet>
        <title>Post Manager | Expert Recruitments LLC</title>
        <meta name="description" content="Manage your job listings, track applications, and post new positions." />
      </Helmet>
      
      <div className="max-w-4xl mx-auto">
        {/* Create Job Banner Section */}
        <div className="mb-10 bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-xl shadow-sm border border-primary/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold text-gray-800">Ready to find your next hire?</h2>
              <p className="text-gray-600 mt-1 max-w-md">
                Post a new job listing and connect with qualified candidates in your industry
              </p>
            </div>
            <Button 
              size="lg" 
              onClick={() => setLocation("/post-job")}
              className="relative group overflow-hidden bg-primary hover:bg-primary/90 text-white font-semibold px-8 py-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out"></div>
              <div className="relative flex items-center">
                <div className="bg-white/30 rounded-full p-2 mr-3">
                  <Plus className="h-5 w-5" />
                </div>
                <span className="text-lg">Post New Job</span>
              </div>
            </Button>
          </div>
        </div>
        
        {/* Post Manager Section */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Post Manager</h1>
          <p className="text-gray-600 mt-1">
            Manage your job listings and track applications
          </p>
        </div>
        
        {!currentUser ? (
          <Alert className="mb-6">
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>
              You need to be logged in as an admin to access the Post Manager.
              <Button variant="link" onClick={() => setLocation("/admin-login")}>
                Sign in as admin
              </Button>
            </AlertDescription>
          </Alert>
        ) : (currentUser.user.userType !== "admin") ? (
          <Alert className="mb-6">
            <AlertTitle>Admin Account Required</AlertTitle>
            <AlertDescription>
              Only admin accounts can post and manage jobs. Your current account does not have the necessary permissions.
            </AlertDescription>
          </Alert>
        ) : isLoading ? (
          <div className="space-y-4">
            <JobCardSkeleton />
            <JobCardSkeleton />
            <JobCardSkeleton />
          </div>
        ) : jobs && jobs.length > 0 ? (
          <Tabs defaultValue="active">
            <TabsList className="mb-6">
              <TabsTrigger value="active">
                Active Jobs ({activeJobs.length})
              </TabsTrigger>
              <TabsTrigger value="closed">
                Closed Jobs ({closedJobs.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="active">
              {activeJobs.length > 0 ? (
                activeJobs.map((job) => (
                  <JobCard key={job.id} job={job} status="active" />
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Active Jobs</h3>
                  <p className="text-gray-600 mb-6">
                    You don't have any active job listings at the moment.
                  </p>
                  <Button onClick={() => setLocation("/post-job")}>
                    Post a New Job
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="closed">
              {closedJobs.length > 0 ? (
                closedJobs.map((job) => (
                  <JobCard key={job.id} job={job} status="closed" />
                ))
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <Clock className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Closed Jobs</h3>
                  <p className="text-gray-600">
                    You don't have any expired or closed job listings.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg">
            <Briefcase className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">No Jobs Posted Yet</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-8">
              You haven't posted any job listings yet. Create your first job post to find the perfect candidates for your positions.
            </p>
            <Button size="lg" onClick={() => setLocation("/post-job")}>
              <Plus className="h-4 w-4 mr-2" />
              Post Your First Job
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}