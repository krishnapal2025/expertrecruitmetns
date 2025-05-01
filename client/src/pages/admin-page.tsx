import { useState, useEffect, useRef } from "react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Admin, User, Job, JobSeeker, Employer, Vacancy, StaffingInquiry } from "@shared/schema";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Loader2,
  UserPlus,
  Users,
  Briefcase,
  Building,
  Settings,
  FileText,
  Calendar,
  Mail,
  Copy,
  Check,
  RefreshCw,
  UserCog,
  Download,
  Search,
  Filter,
  MoreHorizontal,
  Trash2,
  FileSearch,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  ChevronDown,
  Eye,
  Filter as FilterIcon,
  BarChart2,
  FileText as FileTextIcon,
  MessageSquare,
  PlusCircle,
  FileUp,
  ExternalLink,
  UserX
} from "lucide-react";
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, subDays } from "date-fns";

// Admin Dashboard Page
function AdminPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  
  // State management for panels and filters
  const [reportTimeframe, setReportTimeframe] = useState("weekly");
  const [searchTermEmployers, setSearchTermEmployers] = useState("");
  const [searchTermJobSeekers, setSearchTermJobSeekers] = useState("");
  const [selectedVacancyStatus, setSelectedVacancyStatus] = useState("all");
  const [showVacancyModal, setShowVacancyModal] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState<any>(null);
  const [recruiterEmail, setRecruiterEmail] = useState("");
  const [assigningRecruiter, setAssigningRecruiter] = useState(false);
  
  // Reference for downloading reports
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  // Check if user is admin
  const { data: adminData, isLoading: adminLoading } = useQuery({
    queryKey: ["/api/admin/user"],
    queryFn: async () => {
      if (!user || user.userType !== "admin") return null;
      try {
        const res = await fetch("/api/admin/user");
        if (!res.ok) return null;
        return await res.json();
      } catch (error) {
        return null;
      }
    },
    enabled: !!user
  });
  
  // Fetch admin data
  const { data: admins, isLoading: adminsLoading } = useQuery({
    queryKey: ["/api/admin/all"],
    queryFn: async () => {
      const res = await fetch("/api/admin/all");
      if (!res.ok) throw new Error("Failed to fetch admin data");
      return await res.json();
    },
    enabled: !!user && user.userType === "admin"
  });
  
  // Fetch users
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users data");
      return await res.json();
    },
    enabled: !!user && user.userType === "admin"
  });
  
  // Fetch jobs
  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ["/api/jobs"],
    queryFn: async () => {
      const res = await fetch("/api/jobs");
      if (!res.ok) throw new Error("Failed to fetch jobs data");
      return await res.json();
    },
    enabled: !!user && user.userType === "admin"
  });
  
  // Fetch vacancies
  const { data: vacancies, isLoading: vacanciesLoading } = useQuery({
    queryKey: ["/api/admin/vacancies"],
    queryFn: async () => {
      const res = await fetch("/api/admin/vacancies");
      if (!res.ok) throw new Error("Failed to fetch vacancies data");
      return await res.json();
    },
    enabled: !!user && user.userType === "admin"
  });
  
  // Fetch staffing inquiries
  const { data: staffingInquiries, isLoading: staffingInquiriesLoading } = useQuery({
    queryKey: ["/api/staffing-inquiries"],
    queryFn: async () => {
      try {
        console.log("Fetching staffing inquiries...");
        const res = await fetch("/api/staffing-inquiries");
        console.log("Response status:", res.status);
        
        if (!res.ok) {
          console.error("Failed response:", res.status, res.statusText);
          throw new Error("Failed to fetch staffing inquiries data");
        }
        
        const data = await res.json();
        console.log("Received staffing inquiries:", data);
        return data || [];
      } catch (error) {
        console.error("Error fetching staffing inquiries:", error);
        return []; // Return empty array as fallback
      }
    },
    enabled: !!user && user.userType === "admin"
  });
  
  // Update vacancy status mutation
  const updateVacancyStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/vacancies/${id}/status`, { status });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update vacancy status");
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Vacancy status updated",
        description: "The vacancy status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/vacancies"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update vacancy status",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update staffing inquiry status mutation
  const updateInquiryStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      const res = await apiRequest("PATCH", `/api/staffing-inquiries/${id}/status`, { status });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update inquiry status");
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Inquiry status updated",
        description: "The inquiry status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/staffing-inquiries"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update inquiry status",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await apiRequest("DELETE", `/api/users/${userId}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete user");
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "User deleted",
        description: "The user has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete user",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete vacancy mutation
  const deleteVacancyMutation = useMutation({
    mutationFn: async (vacancyId: number) => {
      const res = await apiRequest("DELETE", `/api/admin/vacancies/${vacancyId}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete vacancy");
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Vacancy deleted",
        description: "The vacancy has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/vacancies"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete vacancy",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Assign recruiter mutation
  const assignRecruiterMutation = useMutation({
    mutationFn: async ({ vacancyId, email }: { vacancyId: number, email: string }) => {
      const res = await apiRequest("POST", `/api/admin/vacancies/${vacancyId}/assign`, { 
        recruiterEmail: email 
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to assign recruiter");
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Recruiter assigned",
        description: "The vacancy has been assigned to the recruiter.",
      });
      setRecruiterEmail("");
      setAssigningRecruiter(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/vacancies"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to assign recruiter",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete inquiry mutation
  const deleteInquiryMutation = useMutation({
    mutationFn: async (inquiryId: number) => {
      const res = await apiRequest("DELETE", `/api/staffing-inquiries/${inquiryId}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete inquiry");
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Inquiry deleted",
        description: "The inquiry has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/staffing-inquiries"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete inquiry",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Helper functions for filters and reports
  
  // Filter employers based on search term
  const filteredEmployers = users
    ? users
        .filter((u: User) => u.userType === "employer")
        .filter((employer: any) => {
          if (!searchTermEmployers) return true;
          const searchLower = searchTermEmployers.toLowerCase();
          return (
            (employer.name && employer.name.toLowerCase().includes(searchLower)) ||
            (employer.email && employer.email.toLowerCase().includes(searchLower)) ||
            (employer.location && employer.location.toLowerCase().includes(searchLower))
          );
        })
    : [];
  
  // Filter job seekers based on search term
  const filteredJobSeekers = users
    ? users
        .filter((u: User) => u.userType === "jobseeker")
        .filter((seeker: any) => {
          if (!searchTermJobSeekers) return true;
          const searchLower = searchTermJobSeekers.toLowerCase();
          return (
            (seeker.name && seeker.name.toLowerCase().includes(searchLower)) ||
            (seeker.email && seeker.email.toLowerCase().includes(searchLower)) ||
            (seeker.location && seeker.location.toLowerCase().includes(searchLower))
          );
        })
    : [];
  
  // Filter vacancies based on status
  const filteredVacancies = vacancies
    ? vacancies.filter((vacancy: any) => {
        if (selectedVacancyStatus === "all") return true;
        return vacancy.status === selectedVacancyStatus;
      })
    : [];
  
  // Handle vacancy status change
  const handleVacancyStatusChange = (vacancy: any, status: string) => {
    updateVacancyStatusMutation.mutate({ id: vacancy.id, status });
  };
  
  // Handle recruiter assignment
  const handleAssignRecruiter = (vacancy: any) => {
    setSelectedVacancy(vacancy);
    setAssigningRecruiter(true);
  };
  
  // Submit recruiter assignment
  const submitRecruiterAssignment = () => {
    if (!recruiterEmail || !selectedVacancy) return;
    
    assignRecruiterMutation.mutate({
      vacancyId: selectedVacancy.id,
      email: recruiterEmail
    });
  };
  
  // Handle vacancy deletion
  const handleDeleteVacancy = (vacancyId: number) => {
    if (window.confirm("Are you sure you want to delete this vacancy?")) {
      deleteVacancyMutation.mutate(vacancyId);
    }
  };
  
  // Handle user deletion
  const handleDeleteUser = (userId: number, userType: string) => {
    if (window.confirm(`Are you sure you want to delete this ${userType}?`)) {
      deleteUserMutation.mutate(userId);
    }
  };
  
  // Handle inquiry deletion
  const handleDeleteInquiry = (inquiryId: number) => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      deleteInquiryMutation.mutate(inquiryId);
    }
  };
  
  // Function to generate timeframe dates
  const getTimeframeDates = () => {
    const now = new Date();
    
    switch (reportTimeframe) {
      case "weekly":
        return {
          start: startOfWeek(now),
          end: endOfWeek(now)
        };
      case "monthly":
        return {
          start: startOfMonth(now),
          end: endOfMonth(now)
        };
      case "yearly":
        return {
          start: startOfYear(now),
          end: endOfYear(now)
        };
      default:
        return {
          start: startOfWeek(now),
          end: endOfWeek(now)
        };
    }
  };
  
  // Mock function to download employer report
  const downloadEmployerReport = () => {
    const timeframe = getTimeframeDates();
    toast({
      title: "Report Generated",
      description: `Employer report for ${reportTimeframe} timeframe has been generated.`,
    });
    
    // In a real implementation, this would make a request to generate the report
    // For demo purposes, we're just showing a success message
  };
  
  // Mock function to download job seeker report
  const downloadJobSeekerReport = () => {
    const timeframe = getTimeframeDates();
    toast({
      title: "Report Generated",
      description: `Job seeker report for ${reportTimeframe} timeframe has been generated.`,
    });
  };
  
  // Mock function to download combined report
  const downloadCombinedReport = () => {
    const timeframe = getTimeframeDates();
    toast({
      title: "Report Generated",
      description: `Combined dashboard report for ${reportTimeframe} timeframe has been generated.`,
    });
  };
  
  // Redirect if not admin
  useEffect(() => {
    if (user && user.userType !== "admin") {
      toast({
        title: "Access denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive",
      });
      navigate("/");
    } else if (!user && !adminLoading) {
      navigate("/auth");
    }
  }, [user, adminLoading, navigate, toast]);
  
  // Loading state
  if (!user || adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex items-center gap-3">
          <Button onClick={() => navigate("/post-job")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Post Job Notification
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid grid-cols-6 mb-8">
          <TabsTrigger value="dashboard">
            <BarChart2 className="mr-2 h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="employers">
            <Building className="mr-2 h-4 w-4" />
            Employers
          </TabsTrigger>
          <TabsTrigger value="jobseekers">
            <Users className="mr-2 h-4 w-4" />
            Job Seekers
          </TabsTrigger>
          <TabsTrigger value="messages">
            <MessageSquare className="mr-2 h-4 w-4" />
            Messages
          </TabsTrigger>
          <TabsTrigger value="content">
            <FileText className="mr-2 h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="reports">
            <FileTextIcon className="mr-2 h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>
        
        {/* Main Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Total Users</CardTitle>
                <CardDescription>User accounts overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{users?.length || 0}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {usersLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Job Seekers: {users?.filter((u: User) => u.userType === "jobseeker").length || 0} | 
                      Employers: {users?.filter((u: User) => u.userType === "employer").length || 0} |
                      Admins: {users?.filter((u: User) => u.userType === "admin").length || 0}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Active Jobs</CardTitle>
                <CardDescription>Job listings overview</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{jobs?.length || 0}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {jobsLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Last 7 days: {jobs?.filter((j: Job) => {
                        const date = new Date(j.createdAt);
                        const now = new Date();
                        const diff = now.getTime() - date.getTime();
                        return diff <= 7 * 24 * 60 * 60 * 1000;
                      }).length || 0}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Vacancies</CardTitle>
                <CardDescription>Submitted vacancy requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {vacanciesLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    vacancies?.length || 0
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {!vacanciesLoading && vacancies?.length > 0 && (
                    <>
                      Pending: {vacancies?.filter((v: any) => v.status === "pending").length || 0} | 
                      Approved: {vacancies?.filter((v: any) => v.status === "approved").length || 0} | 
                      Rejected: {vacancies?.filter((v: any) => v.status === "rejected").length || 0}
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("content")}>
                  Manage Vacancies
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Staffing Inquiries</CardTitle>
                <CardDescription>Temporary staffing requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {staffingInquiriesLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    staffingInquiries?.length || 0
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {!staffingInquiriesLoading && staffingInquiries?.length > 0 && (
                    <>
                      New: {staffingInquiries?.filter((i: any) => i.status === "new").length || 0} | 
                      In Progress: {staffingInquiries?.filter((i: any) => i.status === "in-progress").length || 0} | 
                      Completed: {staffingInquiries?.filter((i: any) => i.status === "completed").length || 0}
                    </>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full" 
                  onClick={() => {
                    setActiveTab("content");
                    setTimeout(() => {
                      document.querySelector('button[value="staffing-inquiries"]')?.click();
                    }, 100);
                  }}
                >
                  View Inquiries
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          {/* Recent activity section */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest platform activities</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Coming soon: Activity log showing recent user registrations, job postings, and admin actions
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Users Tab */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>All registered users on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableCaption>List of all registered users</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>User Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Registered</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users?.map((user: User) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.id}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              user.userType === "admin" 
                                ? "bg-purple-100 text-purple-800" 
                                : user.userType === "employer"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}>
                              {user.userType}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                          </TableCell>
                          <TableCell>
                            {user.createdAt ? format(new Date(user.createdAt), "MMM d, yyyy") : "N/A"}
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Jobs Tab */}
        <TabsContent value="jobs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Job Listings</CardTitle>
              <CardDescription>All job postings on the platform</CardDescription>
            </CardHeader>
            <CardContent>
              {jobsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableCaption>List of all job listings</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Posted</TableHead>
                        <TableHead>Applications</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {jobs?.map((job: Job) => (
                        <TableRow key={job.id}>
                          <TableCell>{job.id}</TableCell>
                          <TableCell>{job.title}</TableCell>
                          <TableCell>{job.company}</TableCell>
                          <TableCell>{job.location}</TableCell>
                          <TableCell>
                            {job.createdAt ? format(new Date(job.createdAt), "MMM d, yyyy") : "N/A"}
                          </TableCell>
                          <TableCell>{job.applicationCount || 0}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Companies Tab removed */}
        
        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>Manage website content and submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="vacancies" className="w-full">
                <TabsList className="grid grid-cols-4 mb-6">
                  <TabsTrigger value="vacancies">
                    <FileText className="mr-2 h-4 w-4" />
                    Vacancy Submissions
                  </TabsTrigger>
                  <TabsTrigger value="staffing-inquiries">
                    <Mail className="mr-2 h-4 w-4" />
                    Staffing Inquiries
                  </TabsTrigger>
                  <TabsTrigger value="testimonials">
                    <Users className="mr-2 h-4 w-4" />
                    Testimonials
                  </TabsTrigger>
                  <TabsTrigger value="other">
                    <Settings className="mr-2 h-4 w-4" />
                    Other Content
                  </TabsTrigger>
                </TabsList>
                
                {/* Vacancies Tab */}
                <TabsContent value="vacancies" className="space-y-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Posted Vacancies</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Review and manage vacancy submissions from the contact form
                    </p>
                    
                    {vacanciesLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <ScrollArea className="h-[400px]">
                        <Table>
                          <TableCaption>List of vacancy submissions</TableCaption>
                          <TableHeader>
                            <TableRow>
                              <TableHead>ID</TableHead>
                              <TableHead>Company</TableHead>
                              <TableHead>Position</TableHead>
                              <TableHead>Contact</TableHead>
                              <TableHead>Submitted</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {vacancies?.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={7} className="text-center py-6">
                                  No vacancy submissions found
                                </TableCell>
                              </TableRow>
                            ) : (
                              vacancies?.map((vacancy: Vacancy) => (
                                <TableRow key={vacancy.id}>
                                  <TableCell>{vacancy.id}</TableCell>
                                  <TableCell>{vacancy.companyName}</TableCell>
                                  <TableCell>{vacancy.jobTitle}</TableCell>
                                  <TableCell>
                                    <div className="flex flex-col">
                                      <span className="text-xs">{vacancy.contactName}</span>
                                      <span className="text-xs text-muted-foreground">{vacancy.contactEmail}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell>
                                    {vacancy.submittedAt ? format(new Date(vacancy.submittedAt), "MMM d, yyyy") : "N/A"}
                                  </TableCell>
                                  <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      vacancy.status === "approved" 
                                        ? "bg-green-100 text-green-800" 
                                        : vacancy.status === "rejected"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}>
                                      {vacancy.status === "pending" ? "Pending" : 
                                       vacancy.status === "approved" ? "Approved" : 
                                       vacancy.status === "rejected" ? "Rejected" : 
                                       vacancy.status}
                                    </span>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex space-x-2">
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => {
                                          const detailString = `
Company: ${vacancy.companyName}
Industry: ${vacancy.industry}
Location: ${vacancy.location}
Position: ${vacancy.jobTitle}
Description: ${vacancy.jobDescription}
Requirements: ${vacancy.requirements || "Not specified"}
Skills: ${vacancy.skillsRequired || "Not specified"}
Experience: ${vacancy.experienceRequired || "Not specified"}
Contact: ${vacancy.contactName} (${vacancy.contactEmail})
Phone: ${vacancy.contactPhone}
Additional Info: ${vacancy.additionalInformation || "None provided"}
                                          `;
                                          
                                          toast({
                                            title: "Vacancy Details",
                                            description: (
                                              <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-x-auto">
                                                <code className="text-white whitespace-pre-wrap">{detailString}</code>
                                              </pre>
                                            ),
                                          });
                                        }}
                                      >
                                        Details
                                      </Button>
                                      {vacancy.status === "pending" && (
                                        <>
                                          <Button 
                                            variant="default" 
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700"
                                            onClick={() => updateVacancyStatusMutation.mutate({ 
                                              id: vacancy.id, 
                                              status: "approved" 
                                            })}
                                            disabled={updateVacancyStatusMutation.isPending}
                                          >
                                            Approve
                                          </Button>
                                          <Button 
                                            variant="destructive" 
                                            size="sm"
                                            onClick={() => updateVacancyStatusMutation.mutate({ 
                                              id: vacancy.id, 
                                              status: "rejected" 
                                            })}
                                            disabled={updateVacancyStatusMutation.isPending}
                                          >
                                            Reject
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    )}
                  </div>
                </TabsContent>
                
                {/* Staffing Inquiries Tab */}
                <TabsContent value="staffing-inquiries" className="space-y-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Staffing Inquiries</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Manage inquiries submitted through the staffing inquiry form
                    </p>
                    
                    {staffingInquiriesLoading ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                      </div>
                    ) : (
                      <ScrollArea className="h-[400px]">
                        <Table>
                          <TableCaption>List of staffing inquiries</TableCaption>
                          <TableHeader>
                            <TableRow>
                              <TableHead>ID</TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>Email</TableHead>
                              <TableHead>Inquiry Type</TableHead>
                              <TableHead>Submitted</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {staffingInquiries?.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={7} className="text-center py-6">
                                  No staffing inquiries found
                                </TableCell>
                              </TableRow>
                            ) : (
                              staffingInquiries?.map((inquiry: StaffingInquiry) => (
                                <TableRow key={inquiry.id}>
                                  <TableCell>{inquiry.id}</TableCell>
                                  <TableCell>{inquiry.name}</TableCell>
                                  <TableCell>{inquiry.email}</TableCell>
                                  <TableCell>{inquiry.inquiryType}</TableCell>
                                  <TableCell>
                                    {inquiry.submittedAt ? format(new Date(inquiry.submittedAt), "MMM d, yyyy") : "N/A"}
                                  </TableCell>
                                  <TableCell>
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                      inquiry.status === "completed" 
                                        ? "bg-green-100 text-green-800" 
                                        : inquiry.status === "rejected"
                                        ? "bg-red-100 text-red-800"
                                        : inquiry.status === "in-progress"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}>
                                      {inquiry.status === "new" ? "New" : 
                                       inquiry.status === "in-progress" ? "In Progress" : 
                                       inquiry.status === "completed" ? "Completed" : 
                                       inquiry.status === "rejected" ? "Rejected" : 
                                       inquiry.status}
                                    </span>
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex space-x-2">
                                      <Button 
                                        variant="outline" 
                                        size="sm"
                                        onClick={() => {
                                          const detailString = `
Name: ${inquiry.name}
Email: ${inquiry.email}
Phone: ${inquiry.phone || "Not provided"}
Company: ${inquiry.company || "Not provided"}
Inquiry Type: ${inquiry.inquiryType}
Message: ${inquiry.message}
Marketing: ${inquiry.marketing ? "Yes" : "No"}
                                          `;
                                          
                                          toast({
                                            title: "Inquiry Details",
                                            description: (
                                              <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4 overflow-x-auto">
                                                <code className="text-white whitespace-pre-wrap">{detailString}</code>
                                              </pre>
                                            ),
                                          });
                                        }}
                                      >
                                        Details
                                      </Button>
                                      {(inquiry.status === "new" || inquiry.status === "in-progress") && (
                                        <>
                                          {inquiry.status === "new" && (
                                            <Button 
                                              variant="default" 
                                              size="sm"
                                              className="bg-blue-600 hover:bg-blue-700"
                                              onClick={() => updateInquiryStatusMutation.mutate({ 
                                                id: inquiry.id, 
                                                status: "in-progress" 
                                              })}
                                              disabled={updateInquiryStatusMutation.isPending}
                                            >
                                              Start
                                            </Button>
                                          )}
                                          <Button 
                                            variant="default" 
                                            size="sm"
                                            className="bg-green-600 hover:bg-green-700"
                                            onClick={() => updateInquiryStatusMutation.mutate({ 
                                              id: inquiry.id, 
                                              status: "completed" 
                                            })}
                                            disabled={updateInquiryStatusMutation.isPending}
                                          >
                                            Complete
                                          </Button>
                                          <Button 
                                            variant="destructive" 
                                            size="sm"
                                            onClick={() => updateInquiryStatusMutation.mutate({ 
                                              id: inquiry.id, 
                                              status: "rejected" 
                                            })}
                                            disabled={updateInquiryStatusMutation.isPending}
                                          >
                                            Reject
                                          </Button>
                                        </>
                                      )}
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    )}
                  </div>
                </TabsContent>
                
                {/* Testimonials Tab */}
                <TabsContent value="testimonials" className="space-y-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Testimonials Management</h3>
                    <p className="text-sm text-muted-foreground">
                      Coming soon: Create, edit, and manage testimonials shown on the website
                    </p>
                  </div>
                </TabsContent>
                
                {/* Other Content Tab */}
                <TabsContent value="other" className="space-y-4">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Other Content Management</h3>
                    <p className="text-sm text-muted-foreground">
                      Coming soon: Manage other site content including success stories and static pages
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Settings</CardTitle>
              <CardDescription>Manage admin users</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <Table>
                  <TableCaption>List of admin users</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Last Login</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adminsLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : admins?.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center">
                          No admin users found
                        </TableCell>
                      </TableRow>
                    ) : (
                      admins?.map((admin: Admin & { user: User }) => (
                        <TableRow key={admin.id}>
                          <TableCell>{admin.id}</TableCell>
                          <TableCell>{admin.firstName} {admin.lastName}</TableCell>
                          <TableCell>{admin.user?.email || "N/A"}</TableCell>
                          <TableCell>{admin.role}</TableCell>
                          <TableCell>
                            {admin.lastLogin ? format(new Date(admin.lastLogin), "MMM d, yyyy H:mm") : "Never"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AdminPage;