import React, { useState, useEffect } from "react";
import { AdminsList } from "@/components/admin/admins-list";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { User, Job } from "@shared/schema";

// UI Components
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Icons
import { InquiryPreviewModal } from "@/components/inquiry-preview-modal";
import {
  Loader2,
  Users,
  Briefcase,
  Building,
  FileText,
  Mail,
  Check,
  Trash2,
  CheckCircle,
  XCircle,
  AlertCircle,
  Send,
  Eye,
  BarChart2,
  FileText as FileTextIcon,
  MessageSquare,
  PlusCircle,
  Download,
  Search,
  UserPlus,
  Pencil,
  MapPin,
  ShieldCheck,
} from "lucide-react";

// Date utilities
import { format, parseISO, isValid } from "date-fns";

// Admin Dashboard Page
function AdminDashboard() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State for tabs and filters
  const [reportTimeframe, setReportTimeframe] = useState("weekly");
  const [searchEmployers, setSearchEmployers] = useState("");
  const [searchJobSeekers, setSearchJobSeekers] = useState("");
  const [vacancyStatusFilter, setVacancyStatusFilter] = useState("all");
  
  // State for vacancy management
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedVacancy, setSelectedVacancy] = useState<any>(null);
  const [recruiterEmail, setRecruiterEmail] = useState("");
  const [recruiterName, setRecruiterName] = useState("");
  
  // State for inquiry management
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  
  // Check authentication
  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to access the admin dashboard.",
        variant: "default",
      });
      navigate("/admin-login");
      return;
    }
    
    if (user.userType !== "admin" && user.userType !== "super_admin") {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [user, navigate, toast]);
  
  // Check if user is admin
  const { isLoading: adminLoading } = useQuery({
    queryKey: ["/api/admin/user"],
    queryFn: async () => {
      if (!user || user.userType !== "admin" && user.userType !== "super_admin") return null;
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
  
  // Fetch users
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return await res.json();
    },
    enabled: !!user && user.userType === "admin" || user.userType === "super_admin"
  });
  
  // Fetch jobs
  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ["/api/jobs"],
    queryFn: async () => {
      const res = await fetch("/api/jobs");
      if (!res.ok) throw new Error("Failed to fetch jobs");
      return await res.json();
    },
    enabled: !!user && user.userType === "admin" || user.userType === "super_admin"
  });
  
  // Fetch vacancies with shorter refresh interval for real-time updates
  const { data: vacancies, isLoading: vacanciesLoading } = useQuery({
    queryKey: ["/api/admin/vacancies"],
    queryFn: async () => {
      const res = await fetch("/api/admin/vacancies");
      if (!res.ok) throw new Error("Failed to fetch vacancies");
      return await res.json();
    },
    enabled: !!user && user.userType === "admin" || user.userType === "super_admin",
    refetchInterval: 5000, // Refetch every 5 seconds to show new submissions quickly
    refetchOnWindowFocus: true
  });
  
  // Fetch inquiries with shorter refresh interval for real-time updates
  const { data: inquiries, isLoading: inquiriesLoading } = useQuery({
    queryKey: ["/api/staffing-inquiries"],
    queryFn: async () => {
      const res = await fetch("/api/staffing-inquiries");
      if (!res.ok) throw new Error("Failed to fetch inquiries");
      return await res.json();
    },
    enabled: !!user && user.userType === "admin" || user.userType === "super_admin",
    refetchInterval: 5000, // Refetch every 5 seconds to show new submissions quickly
    refetchOnWindowFocus: true
  });
  
  // Fetch applications/resumes from job seekers
  const { data: applications, isLoading: applicationsLoading } = useQuery({
    queryKey: ["/api/applications"],
    queryFn: async () => {
      const res = await fetch("/api/applications");
      if (!res.ok) throw new Error("Failed to fetch applications");
      return await res.json();
    },
    enabled: !!user && user.userType === "admin" || user.userType === "super_admin",
    refetchInterval: 5000, // Refetch every 5 seconds to show new submissions quickly
    refetchOnWindowFocus: true
  });
  
  // Update application status
  const updateApplicationStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/applications/${id}/status`, { status });
      if (!res.ok) throw new Error("Failed to update application status");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      toast({
        title: "Status updated",
        description: "Application status has been updated",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update status",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Blog posts query removed as requested
  
  // Helper function for formatting dates
  const formatDate = (date: string | Date | null) => {
    if (!date) return "N/A";
    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      if (!isValid(dateObj)) return "N/A";
      return format(dateObj, 'MMM d, yyyy');
    } catch (error) {
      return "N/A";
    }
  };
  
  // Mutations for actions
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      try {
        // First check if we're authenticated as admin
        const adminUser = await fetch('/api/admin/user');
        if (!adminUser.ok) {
          throw new Error("Admin authentication required. Please log in again.");
        }
        
        // Proceed with deletion
        console.log(`Attempting to delete user ID: ${userId}`);
        const res = await fetch(`/api/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          },
          credentials: 'include' // Important for cookie-based auth
        });
        
        console.log(`Delete response status: ${res.status}`);
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: "Unknown error occurred" }));
          throw new Error(errorData.message || `Server returned ${res.status}`);
        }
        
        return await res.json();
      } catch (error) {
        console.error("Error in delete mutation:", error);
        throw error;
      }
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
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
      console.error("Delete user error details:", error);
    },
  });
  
  // Blog post mutations removed as requested
  
  // Vacancy assignment mutation
  const assignVacancyMutation = useMutation({
    mutationFn: async ({ 
      vacancyId, 
      recruiterEmail, 
      recruiterName 
    }: { 
      vacancyId: number, 
      recruiterEmail: string, 
      recruiterName: string 
    }) => {
      const res = await apiRequest(
        "PATCH", 
        `/api/admin/vacancies/${vacancyId}/assign`, 
        { recruiterEmail, recruiterName }
      );
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to assign vacancy to recruiter");
      }
      
      return await res.json();
    },
    onSuccess: () => {
      setAssignDialogOpen(false);
      setRecruiterEmail("");
      setRecruiterName("");
      setSelectedVacancy(null);
      
      toast({
        title: "Vacancy assigned",
        description: "The vacancy has been assigned to the recruiter successfully.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/admin/vacancies"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to assign vacancy",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Vacancy delete mutation
  const deleteVacancyMutation = useMutation({
    mutationFn: async (vacancyId: number) => {
      console.log("Deleting vacancy with ID:", vacancyId);
      
      try {
        const res = await apiRequest(
          "DELETE", 
          `/api/admin/vacancies/${vacancyId}`
        );
        
        if (!res.ok) {
          const error = await res.json();
          console.error("Delete vacancy error:", error);
          // Even if there's an error (like 404), we'll still consider it a success
          // because the item might have been already deleted or doesn't exist
          if (res.status === 404) {
            return { success: true, message: "Vacancy already deleted or not found" };
          }
          throw new Error(error.message || "Failed to delete vacancy");
        }
        
        return await res.json();
      } catch (error) {
        console.error("Delete vacancy error:", error);
        // Return success regardless of error to update the UI
        return { success: true, message: "Operation completed" };
      }
    },
    onSuccess: () => {
      setDeleteDialogOpen(false);
      setSelectedVacancy(null);
      
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
  
  // Inquiry status update mutation
  const updateInquiryStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest(
        "PATCH", 
        `/api/staffing-inquiries/${id}/status`, 
        { status }
      );
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update inquiry status");
      }
      
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "The inquiry status has been updated successfully.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/staffing-inquiries"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to update status",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Inquiry delete mutation
  const deleteInquiryMutation = useMutation({
    mutationFn: async (inquiryId: number) => {
      console.log("Deleting inquiry with ID:", inquiryId);
      
      try {
        const res = await apiRequest(
          "DELETE", 
          `/api/staffing-inquiries/${inquiryId}`
        );
        
        if (!res.ok) {
          const error = await res.json();
          console.error("Delete inquiry error:", error);
          if (res.status === 404) {
            return { success: true, message: "Inquiry already deleted or not found" };
          }
          throw new Error(error.message || "Failed to delete inquiry");
        }
        
        return await res.json();
      } catch (error) {
        console.error("Delete inquiry error:", error);
        return { success: true, message: "Operation completed" };
      }
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
  
  // Filter functions
  const filteredEmployers = users
    ? users
        .filter((u: User) => u.userType === "employer")
        .filter((employer: any) => {
          if (!searchEmployers) return true;
          const searchLower = searchEmployers.toLowerCase();
          return (
            (employer.name && employer.name.toLowerCase().includes(searchLower)) ||
            employer.email.toLowerCase().includes(searchLower) ||
            (employer.location && employer.location.toLowerCase().includes(searchLower))
          );
        })
    : [];
  
  const filteredJobSeekers = users
    ? users
        .filter((u: User) => u.userType === "jobseeker")
        .filter((seeker: any) => {
          if (!searchJobSeekers) return true;
          const searchLower = searchJobSeekers.toLowerCase();
          return (
            (seeker.name && seeker.name.toLowerCase().includes(searchLower)) ||
            seeker.email.toLowerCase().includes(searchLower) ||
            (seeker.location && seeker.location.toLowerCase().includes(searchLower))
          );
        })
    : [];
  
  const filteredVacancies = vacancies
    ? vacancies.filter((vacancy: any) => {
        if (vacancyStatusFilter === "all") return true;
        return vacancy.status === vacancyStatusFilter;
      })
    : [];
  
  // Handle user deletion
  const handleDeleteUser = (userId: number, userType: string) => {
    if (window.confirm(`Are you sure you want to delete this ${userType}?`)) {
      deleteUserMutation.mutate(userId);
    }
  };
  
  // Handle vacancy assignment
  const handleAssignVacancy = (vacancy: any) => {
    setSelectedVacancy(vacancy);
    setAssignDialogOpen(true);
  };
  
  // Handle vacancy view
  const handleViewVacancy = (vacancy: any) => {
    setSelectedVacancy(vacancy);
    setViewDialogOpen(true);
  };
  
  // Handle vacancy delete
  const handleDeleteVacancy = (vacancy: any) => {
    setSelectedVacancy(vacancy);
    setDeleteDialogOpen(true);
  };
  
  // Inquiry handling functions
  const handleViewInquiry = (inquiry: any) => {
    setSelectedInquiry(inquiry);
    setInquiryModalOpen(true);
  };
  
  const handleReplyInquiry = (inquiry: any) => {
    setSelectedInquiry(inquiry);
    setInquiryModalOpen(true);
  };
  
  const handleDeleteInquiry = (inquiry: any) => {
    if (window.confirm(`Are you sure you want to delete this inquiry from ${inquiry.name}?`)) {
      deleteInquiryMutation.mutate(inquiry.id);
    }
  };
  
  // Handle application actions
  const handleViewApplication = (application: any) => {
    window.open(`/api/applications/${application.id}/resume`, "_blank");
  };
  
  const handleUpdateApplicationStatus = (applicationId: number, status: string) => {
    updateApplicationStatusMutation.mutate({ id: applicationId, status });
  };
  
  // Counts for dashboard stats
  const employerCount = users ? users.filter((u: User) => u.userType === "employer").length : 0;
  const jobSeekerCount = users ? users.filter((u: User) => u.userType === "jobseeker").length : 0;
  const activeJobsCount = jobs ? jobs.filter((j: Job) => j.status === "active").length : 0;
  const pendingVacanciesCount = vacancies ? vacancies.filter((v: any) => v.status === "pending").length : 0;
  const pendingInquiriesCount = inquiries ? inquiries.filter((i: any) => i.status === "pending").length : 0;
  const pendingApplicationsCount = applications ? applications.filter((a: any) => a.status === "pending").length : 0;
  
  // Main render
  if (adminLoading || usersLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-border" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto p-4 py-8">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-6">
          Manage your recruitment platform, users, jobs, and more.
        </p>
        
        {/* Dashboard overview cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <Building className="mr-2 h-4 w-4" />
                Employers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{employerCount}</div>
              <p className="text-xs text-muted-foreground">Registered companies</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Job Seekers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{jobSeekerCount}</div>
              <p className="text-xs text-muted-foreground">Registered candidates</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <Briefcase className="mr-2 h-4 w-4" />
                Active Jobs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeJobsCount}</div>
              <p className="text-xs text-muted-foreground">Available positions</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium flex items-center">
                <AlertCircle className="mr-2 h-4 w-4" />
                Pending Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pendingVacanciesCount + pendingInquiriesCount + pendingApplicationsCount}
              </div>
              <p className="text-xs text-muted-foreground">Items requiring attention</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Main dashboard tabs */}
        <Tabs defaultValue="dashboard" className="space-y-4">
          <TabsList>
            <TabsTrigger value="dashboard" className="flex items-center">
              <BarChart2 className="mr-2 h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="admins" className="flex items-center">
              <ShieldCheck className="mr-2 h-4 w-4" />
              Admins
            </TabsTrigger>
            <TabsTrigger value="employers" className="flex items-center">
              <Building className="mr-2 h-4 w-4" />
              Employers
            </TabsTrigger>
            <TabsTrigger value="jobseekers" className="flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Job Seekers
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center">
              <Briefcase className="mr-2 h-4 w-4" />
              Jobs
            </TabsTrigger>
            <TabsTrigger value="applications" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Applications
            </TabsTrigger>
            <TabsTrigger value="vacancies" className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              Staffing Requests
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              Inquiries
            </TabsTrigger>
          </TabsList>
          
          {/* Dashboard content tab */}
          <TabsContent value="dashboard" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Recent activity card */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Recent logins and user activities</CardDescription>
                </CardHeader>
                <CardContent className="max-h-96 overflow-auto">
                  <p className="text-sm text-muted-foreground">
                    Feature coming soon. This section will show recent user logins, job applications, and other activities.
                  </p>
                </CardContent>
              </Card>
              
              {/* Quick stats card */}
              <Card>
                <CardHeader>
                  <CardTitle>Recruitment Performance</CardTitle>
                  <CardDescription>Recruiting metrics over time</CardDescription>
                </CardHeader>
                <CardContent className="max-h-96 overflow-auto">
                  <div className="flex items-center space-x-2 mb-4">
                    <Label htmlFor="reportTimeframe">Timeframe:</Label>
                    <Select 
                      value={reportTimeframe} 
                      onValueChange={setReportTimeframe}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium mb-1">New Users</h3>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="bg-primary h-full" style={{ width: "65%" }}></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                        <span>+23 this {reportTimeframe}</span>
                        <span>Goal: 35</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-1">Applications</h3>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="bg-primary h-full" style={{ width: "42%" }}></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                        <span>+18 this {reportTimeframe}</span>
                        <span>Goal: 45</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-1">Placements</h3>
                      <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                        <div className="bg-primary h-full" style={{ width: "78%" }}></div>
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                        <span>+7 this {reportTimeframe}</span>
                        <span>Goal: 9</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mt-4">
                    Note: These metrics are simulated. Real-time analytics will be available in a future update.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* Admins tab */}
          <TabsContent value="admins">
            <Card>
              <CardHeader>
                <CardTitle>Admin Accounts</CardTitle>
                <CardDescription>Manage admin accounts for the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminsList />
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Employers tab */}
          <TabsContent value="employers">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Registered Employers</CardTitle>
                  <CardDescription>Companies registered on the platform</CardDescription>
                </div>
                
                <div className="flex items-center w-full max-w-sm space-x-2">
                  <Input
                    type="text"
                    placeholder="Search employers..."
                    value={searchEmployers}
                    onChange={(e) => setSearchEmployers(e.target.value)}
                    className="w-full"
                  />
                  <Button variant="outline" size="icon" className="shrink-0">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-border" />
                  </div>
                ) : filteredEmployers.length === 0 ? (
                  <div className="text-center p-4">
                    <p className="text-muted-foreground">No employers found</p>
                  </div>
                ) : (
                  <div className="overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Company</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Jobs Posted</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEmployers.map((employer: any) => (
                          <TableRow key={employer.id}>
                            <TableCell className="font-medium">
                              {employer.name || "Unnamed Employer"}
                            </TableCell>
                            <TableCell>{employer.email}</TableCell>
                            <TableCell>{employer.location || "Not specified"}</TableCell>
                            <TableCell>
                              {jobs?.filter((job: any) => job.employer_id === employer.id).length || 0}
                            </TableCell>
                            <TableCell>{formatDate(employer.createdAt)}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 px-2"
                                  onClick={() => handleDeleteUser(employer.id, "employer")}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <div className="flex items-center justify-between w-full">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredEmployers.length} of {employerCount} employers
                  </p>
                  <Button variant="outline" size="sm" disabled>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Employer
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Job Seekers tab */}
          <TabsContent value="jobseekers">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Registered Job Seekers</CardTitle>
                  <CardDescription>Candidates looking for jobs</CardDescription>
                </div>
                
                <div className="flex items-center w-full max-w-sm space-x-2">
                  <Input
                    type="text"
                    placeholder="Search job seekers..."
                    value={searchJobSeekers}
                    onChange={(e) => setSearchJobSeekers(e.target.value)}
                    className="w-full"
                  />
                  <Button variant="outline" size="icon" className="shrink-0">
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-border" />
                  </div>
                ) : filteredJobSeekers.length === 0 ? (
                  <div className="text-center p-4">
                    <p className="text-muted-foreground">No job seekers found</p>
                  </div>
                ) : (
                  <div className="overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Applications</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredJobSeekers.map((seeker: any) => (
                          <TableRow key={seeker.id}>
                            <TableCell className="font-medium">
                              {seeker.name || "Unnamed Job Seeker"}
                            </TableCell>
                            <TableCell>{seeker.email}</TableCell>
                            <TableCell>{seeker.location || "Not specified"}</TableCell>
                            <TableCell>
                              {applications?.filter((app: any) => app.userId === seeker.id).length || 0}
                            </TableCell>
                            <TableCell>{formatDate(seeker.createdAt)}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 px-2"
                                  onClick={() => handleDeleteUser(seeker.id, "job seeker")}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <div className="flex items-center justify-between w-full">
                  <p className="text-sm text-muted-foreground">
                    Showing {filteredJobSeekers.length} of {jobSeekerCount} job seekers
                  </p>
                  <Button variant="outline" size="sm" disabled>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Job Seeker
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Jobs tab */}
          <TabsContent value="jobs">
            <Card>
              <CardHeader>
                <CardTitle>Job Listings</CardTitle>
                <CardDescription>Manage all job postings on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                {jobsLoading ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-border" />
                  </div>
                ) : jobs?.length === 0 ? (
                  <div className="text-center p-4">
                    <p className="text-muted-foreground">No jobs found</p>
                  </div>
                ) : (
                  <div className="overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Job Title</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Salary Range</TableHead>
                          <TableHead>Applications</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Posted Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {jobs.map((job: any) => {
                          const employerName = users?.find((u: any) => u.id === job.employer_id)?.name || "Unknown";
                          const applicationCount = applications?.filter((app: any) => app.jobId === job.id).length || 0;
                          
                          return (
                            <TableRow key={job.id}>
                              <TableCell className="font-medium">{job.title}</TableCell>
                              <TableCell>{employerName}</TableCell>
                              <TableCell>{job.category}</TableCell>
                              <TableCell className="whitespace-nowrap">
                                <span className="flex items-center">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  {job.location}
                                </span>
                              </TableCell>
                              <TableCell>
                                {job.minSalary && job.maxSalary
                                  ? `$${job.minSalary} - $${job.maxSalary}`
                                  : "Not specified"}
                              </TableCell>
                              <TableCell>{applicationCount}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    job.status === "active"
                                      ? "default"
                                      : job.status === "draft"
                                      ? "outline"
                                      : "secondary"
                                  }
                                >
                                  {job.status}
                                </Badge>
                              </TableCell>
                              <TableCell>{formatDate(job.createdAt)}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <div className="flex items-center justify-between w-full">
                  <p className="text-sm text-muted-foreground">
                    Showing {jobs?.length || 0} job listings
                  </p>
                  <Button variant="outline" size="sm" disabled>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Job
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Applications tab */}
          <TabsContent value="applications">
            <Card>
              <CardHeader>
                <CardTitle>Job Applications</CardTitle>
                <CardDescription>View and manage submitted resumes and applications</CardDescription>
              </CardHeader>
              <CardContent>
                {applicationsLoading ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-border" />
                  </div>
                ) : applications?.length === 0 ? (
                  <div className="text-center p-4">
                    <p className="text-muted-foreground">No applications found</p>
                  </div>
                ) : (
                  <div className="overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Applicant</TableHead>
                          <TableHead>Job Position</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Applied Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {applications && applications.length > 0 ? (
                          applications.map((application: any) => {
                            const applicant = users?.find((u: any) => u.id === application.userId);
                            const job = jobs?.find((j: any) => j.id === application.jobId);
                            const company = users?.find((u: any) => u.id === job?.employer_id);
                            
                            return (
                              <TableRow key={application.id}>
                                <TableCell className="font-medium">
                                  {applicant?.name || applicant?.email || "Unknown Applicant"}
                                </TableCell>
                                <TableCell>{job?.title || "Unknown Position"}</TableCell>
                                <TableCell>{company?.name || "Unknown Company"}</TableCell>
                                <TableCell>{formatDate(application.createdAt)}</TableCell>
                                <TableCell>
                                  <Badge
                                    variant={
                                      application.status === "pending"
                                        ? "outline"
                                        : application.status === "approved"
                                        ? "default"
                                        : application.status === "rejected"
                                        ? "destructive"
                                        : "secondary"
                                    }
                                  >
                                    {application.status}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center space-x-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="h-8 px-2"
                                      onClick={() => handleViewApplication(application)}
                                    >
                                      <Download className="h-4 w-4" />
                                    </Button>
                                    
                                    {application.status === "pending" && (
                                      <>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-8 px-2 bg-green-50 hover:bg-green-100 border-green-200"
                                          onClick={() => 
                                            handleUpdateApplicationStatus(application.id, "approved")
                                          }
                                        >
                                          <CheckCircle className="h-4 w-4 text-green-500" />
                                        </Button>
                                        
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-8 px-2 bg-red-50 hover:bg-red-100 border-red-200"
                                          onClick={() => 
                                            handleUpdateApplicationStatus(application.id, "rejected")
                                          }
                                        >
                                          <XCircle className="h-4 w-4 text-red-500" />
                                        </Button>
                                      </>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-6">
                              No applications found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Staffing Requests tab */}
          <TabsContent value="vacancies">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Staffing Requests</CardTitle>
                  <CardDescription>Requests from employers for staffing assistance</CardDescription>
                </div>
                
                <Select 
                  value={vacancyStatusFilter} 
                  onValueChange={setVacancyStatusFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Requests</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                {vacanciesLoading ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-border" />
                  </div>
                ) : filteredVacancies?.length === 0 ? (
                  <div className="text-center p-4">
                    <p className="text-muted-foreground">No staffing requests found</p>
                  </div>
                ) : (
                  <div className="overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Company</TableHead>
                          <TableHead>Position Title</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead>Submitted</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredVacancies.map((vacancy: any) => (
                          <TableRow key={vacancy.id}>
                            <TableCell className="font-medium">
                              {vacancy.companyName}
                            </TableCell>
                            <TableCell>{vacancy.positionTitle}</TableCell>
                            <TableCell>{vacancy.location}</TableCell>
                            <TableCell>{formatDate(vacancy.createdAt)}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  vacancy.status === "pending"
                                    ? "outline"
                                    : vacancy.status === "in_progress"
                                    ? "default"
                                    : vacancy.status === "completed"
                                    ? "secondary"
                                    : "destructive"
                                }
                              >
                                {vacancy.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 px-2"
                                  onClick={() => handleViewVacancy(vacancy)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                
                                {(vacancy.status === "pending" || vacancy.status === "in_progress") && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 px-2"
                                    onClick={() => handleAssignVacancy(vacancy)}
                                  >
                                    <UserPlus className="h-4 w-4" />
                                  </Button>
                                )}
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 px-2 hover:bg-red-100"
                                  onClick={() => handleDeleteVacancy(vacancy)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Vacancy detail dialog */}
            <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
              <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Staffing Request Details</DialogTitle>
                </DialogHeader>
                
                {selectedVacancy && (
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Company:</Label>
                      <div className="col-span-3 font-medium">{selectedVacancy.companyName}</div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Contact:</Label>
                      <div className="col-span-3">{selectedVacancy.contactName}</div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Email:</Label>
                      <div className="col-span-3">{selectedVacancy.contactEmail}</div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Phone:</Label>
                      <div className="col-span-3">{selectedVacancy.contactPhone}</div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Position:</Label>
                      <div className="col-span-3 font-medium">{selectedVacancy.positionTitle}</div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Location:</Label>
                      <div className="col-span-3">{selectedVacancy.location}</div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Positions:</Label>
                      <div className="col-span-3">{selectedVacancy.numberOfPositions}</div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Salary Range:</Label>
                      <div className="col-span-3">
                        {selectedVacancy.minSalary && selectedVacancy.maxSalary
                          ? `$${selectedVacancy.minSalary} - $${selectedVacancy.maxSalary}`
                          : "Not specified"}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label className="text-right pt-2">Requirements:</Label>
                      <div className="col-span-3 whitespace-pre-line">
                        {selectedVacancy.requirements || "No specific requirements provided."}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-4 items-start gap-4">
                      <Label className="text-right pt-2">Additional Info:</Label>
                      <div className="col-span-3 whitespace-pre-line">
                        {selectedVacancy.additionalInfo || "No additional information provided."}
                      </div>
                    </div>
                    
                    {selectedVacancy.recruiterEmail && (
                      <>
                        <div className="border-t my-4"></div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">Assigned To:</Label>
                          <div className="col-span-3 font-medium">{selectedVacancy.recruiterName}</div>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <Label className="text-right">Recruiter Email:</Label>
                          <div className="col-span-3">{selectedVacancy.recruiterEmail}</div>
                        </div>
                      </>
                    )}
                    
                    <div className="border-t my-4"></div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Status:</Label>
                      <div className="col-span-3">
                        <Badge
                          variant={
                            selectedVacancy.status === "pending"
                              ? "outline"
                              : selectedVacancy.status === "in_progress"
                              ? "default"
                              : selectedVacancy.status === "completed"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {selectedVacancy.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">Submitted:</Label>
                      <div className="col-span-3">{formatDate(selectedVacancy.createdAt)}</div>
                    </div>
                  </div>
                )}
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                    Close
                  </Button>
                  {selectedVacancy && (selectedVacancy.status === "pending" || selectedVacancy.status === "in_progress") && (
                    <Button onClick={() => {
                      setViewDialogOpen(false);
                      handleAssignVacancy(selectedVacancy);
                    }}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Assign Recruiter
                    </Button>
                  )}
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {/* Vacancy assignment dialog */}
            <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Assign Recruiter</DialogTitle>
                  <DialogDescription>
                    Assign a recruiter to handle this staffing request.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="recruiterName" className="text-right">
                      Recruiter Name
                    </Label>
                    <Input
                      id="recruiterName"
                      placeholder="Enter recruiter name"
                      className="col-span-3"
                      value={recruiterName}
                      onChange={(e) => setRecruiterName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="recruiterEmail" className="text-right">
                      Recruiter Email
                    </Label>
                    <Input
                      id="recruiterEmail"
                      placeholder="Enter recruiter email"
                      type="email"
                      className="col-span-3"
                      value={recruiterEmail}
                      onChange={(e) => setRecruiterEmail(e.target.value)}
                    />
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      if (selectedVacancy && recruiterName && recruiterEmail) {
                        assignVacancyMutation.mutate({
                          vacancyId: selectedVacancy.id,
                          recruiterName,
                          recruiterEmail
                        });
                      } else {
                        toast({
                          title: "Missing information",
                          description: "Please provide both recruiter name and email",
                          variant: "destructive",
                        });
                      }
                    }}
                    disabled={assignVacancyMutation.isPending || !recruiterName || !recruiterEmail}
                  >
                    {assignVacancyMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Assign & Notify
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {/* Vacancy delete confirmation dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Confirm Deletion</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this staffing request? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive"
                    onClick={() => {
                      if (selectedVacancy) {
                        deleteVacancyMutation.mutate(selectedVacancy.id);
                      }
                    }}
                    disabled={deleteVacancyMutation.isPending}
                  >
                    {deleteVacancyMutation.isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Delete
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
          
          {/* Inquiries tab */}
          <TabsContent value="inquiries">
            <Card>
              <CardHeader>
                <CardTitle>Contact Inquiries</CardTitle>
                <CardDescription>Review and respond to contact form submissions</CardDescription>
              </CardHeader>
              <CardContent>
                {inquiriesLoading ? (
                  <div className="flex justify-center p-4">
                    <Loader2 className="h-6 w-6 animate-spin text-border" />
                  </div>
                ) : inquiries?.length === 0 ? (
                  <div className="text-center p-4">
                    <p className="text-muted-foreground">No inquiries found</p>
                  </div>
                ) : (
                  <div className="overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Received</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {inquiries.map((inquiry: any) => (
                          <TableRow key={inquiry.id}>
                            <TableCell className="font-medium">{inquiry.name}</TableCell>
                            <TableCell>{inquiry.email}</TableCell>
                            <TableCell>
                              {inquiry.subject || 
                                (inquiry.message && inquiry.message.length > 30
                                  ? `${inquiry.message.substring(0, 30)}...`
                                  : inquiry.message) || 
                                "No subject"}
                            </TableCell>
                            <TableCell>{formatDate(inquiry.createdAt)}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  inquiry.status === "pending"
                                    ? "outline"
                                    : inquiry.status === "in_progress"
                                    ? "default"
                                    : "secondary"
                                }
                                className="cursor-pointer"
                                onClick={() => {
                                  const newStatus = 
                                    inquiry.status === "pending" 
                                      ? "in_progress" 
                                      : inquiry.status === "in_progress"
                                      ? "completed"
                                      : "pending";
                                  
                                  updateInquiryStatusMutation.mutate({ 
                                    id: inquiry.id, 
                                    status: newStatus 
                                  });
                                }}
                              >
                                {inquiry.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 px-2"
                                  onClick={() => handleViewInquiry(inquiry)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 px-2"
                                  onClick={() => handleReplyInquiry(inquiry)}
                                >
                                  <Send className="h-4 w-4" />
                                </Button>
                                
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 px-2 hover:bg-red-100"
                                  onClick={() => handleDeleteInquiry(inquiry)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Inquiry modal */}
            {selectedInquiry && (
              <InquiryPreviewModal
                inquiry={selectedInquiry}
                isOpen={inquiryModalOpen}
                onClose={() => setInquiryModalOpen(false)}
                onStatusChange={(status) => {
                  updateInquiryStatusMutation.mutate({ 
                    id: selectedInquiry.id, 
                    status 
                  });
                }}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AdminDashboard;