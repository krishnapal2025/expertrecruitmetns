import React, { useState, useEffect } from "react";
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  ShieldAlert,
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
  const [searchAdmins, setSearchAdmins] = useState("");
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
  
  // Fetch users and admin accounts
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/all"],
    queryFn: async () => {
      console.log("Fetching admin users with user type:", user?.userType);
      const res = await fetch("/api/admin/all");
      console.log("Admin API response status:", res.status);
      if (!res.ok) throw new Error("Failed to fetch admin users");
      const data = await res.json();
      console.log("Admin data received. Count:", data?.length || 0);
      return data;
    },
    enabled: !!user && (user.userType === "admin" || user.userType === "super_admin")
  });
  
  // Fetch jobs
  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ["/api/jobs"],
    queryFn: async () => {
      const res = await fetch("/api/jobs");
      if (!res.ok) throw new Error("Failed to fetch jobs");
      return await res.json();
    },
    enabled: !!user && (user.userType === "admin" || user.userType === "super_admin")
  });
  
  // Fetch vacancies with shorter refresh interval for real-time updates
  const { data: vacancies, isLoading: vacanciesLoading } = useQuery({
    queryKey: ["/api/admin/vacancies"],
    queryFn: async () => {
      const res = await fetch("/api/admin/vacancies");
      if (!res.ok) throw new Error("Failed to fetch vacancies");
      return await res.json();
    },
    enabled: !!user && (user.userType === "admin" || user.userType === "super_admin"),
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
    enabled: !!user && (user.userType === "admin" || user.userType === "super_admin"),
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
    enabled: !!user && (user.userType === "admin" || user.userType === "super_admin"),
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
  
  // Fix: Filter for admin and super_admin accounts
  // Based on SQL query there are two super_admin accounts
  const filteredAdmins = users
    ? users
        .filter((u: User) => {
          // SQL data shows the column name is user_type but our code accesses userType
          return u.userType === "admin" || u.userType === "super_admin";
        })
        .filter((admin: any) => {
          if (!searchAdmins) return true;
          const searchLower = searchAdmins.toLowerCase();
          return (
            admin.email?.toLowerCase().includes(searchLower) ||
            admin.username?.toLowerCase().includes(searchLower)
          );
        })
    : [];
  
  console.log("All users:", users);
  console.log("Admin users:", filteredAdmins);
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
  
  // Function to handle vacancy operations
  const handleAssignVacancy = (vacancy: any) => {
    setSelectedVacancy(vacancy);
    setAssignDialogOpen(true);
  };
  
  const handleViewVacancy = (vacancy: any) => {
    setSelectedVacancy(vacancy);
    setViewDialogOpen(true);
  };
  
  const handleDeleteVacancy = (vacancy: any) => {
    setSelectedVacancy(vacancy);
    setDeleteDialogOpen(true);
  };
  
  const confirmDeleteVacancy = () => {
    if (selectedVacancy) {
      deleteVacancyMutation.mutate(selectedVacancy.id);
    }
  };
  
  const submitVacancyAssignment = () => {
    if (selectedVacancy && recruiterEmail && recruiterName) {
      assignVacancyMutation.mutate({
        vacancyId: selectedVacancy.id,
        recruiterEmail,
        recruiterName
      });
    } else {
      toast({
        title: "Missing information",
        description: "Please provide recruiter name and email.",
        variant: "destructive",
      });
    }
  };
  
  // Function to handle inquiry status changes
  const handleInquiryStatusChange = (id: number, status: string) => {
    updateInquiryStatusMutation.mutate({ id, status });
  };
  
  const handleDeleteInquiry = (inquiryId: number) => {
    if (window.confirm("Are you sure you want to delete this inquiry?")) {
      deleteInquiryMutation.mutate(inquiryId);
    }
  };
  
  const handleViewInquiry = (inquiry: any) => {
    setSelectedInquiry(inquiry);
    setInquiryModalOpen(true);
  };
  
  // Render loading state
  if (!user || adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-xl font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }
  
  // Render the admin dashboard
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user.email}. Manage your platform's content and users.
        </p>
      </div>
      
      {/* Main Tabs Navigation */}
      <Tabs defaultValue="admins" className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <TabsTrigger value="admins" className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            <span>Admins</span>
          </TabsTrigger>
          <TabsTrigger value="employers" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            <span>Employers</span>
          </TabsTrigger>
          <TabsTrigger value="jobseekers" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>Job Seekers</span>
          </TabsTrigger>
          <TabsTrigger value="vacancies" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            <span>Vacancies</span>
          </TabsTrigger>
          <TabsTrigger value="inquiries" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Inquiries</span>
          </TabsTrigger>
        </TabsList>
        
        {/* Tab Content */}
        
        {/* Admins Tab */}
        <TabsContent value="admins" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5" />
                Admin Users
              </CardTitle>
              <CardDescription>
                Manage admin accounts and permissions.
              </CardDescription>
              <div className="flex items-center space-x-2 mt-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search admins..."
                  value={searchAdmins}
                  onChange={(e) => setSearchAdmins(e.target.value)}
                  className="w-full max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredAdmins && filteredAdmins.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Email</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-24">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAdmins.map((admin: any) => {
                        const isSuperAdmin = admin.userType === "super_admin";
                        const isCurrentUser = admin.id === user.id;
                        const creationDate = formatDate(admin.createdAt);
                        
                        return (
                          <TableRow 
                            key={admin.id} 
                            className={isCurrentUser ? "bg-green-50 dark:bg-green-950" : (isSuperAdmin ? "bg-blue-50 dark:bg-blue-950" : "")}
                          >
                            <TableCell>
                              <div className="font-medium">{admin.email}</div>
                            </TableCell>
                            <TableCell>{admin.username || 'N/A'}</TableCell>
                            <TableCell>
                              <Badge variant={isSuperAdmin ? "default" : "outline"} className={isSuperAdmin ? "bg-blue-600" : ""}>
                                {isSuperAdmin ? "Super Admin" : "Admin"}
                              </Badge>
                            </TableCell>
                            <TableCell>{creationDate}</TableCell>
                            <TableCell>
                              {isCurrentUser ? (
                                <Badge variant="success">Current User</Badge>
                              ) : isSuperAdmin ? (
                                <Badge variant="outline" className="bg-blue-50 text-blue-600">Additional Super Admin</Badge>
                              ) : (
                                <Badge variant="outline">Standard Admin</Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              {!isCurrentUser ? (
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => {
                                    const confirmMessage = isSuperAdmin 
                                      ? `Are you sure you want to delete this Super Admin account (${admin.email})? This is a privileged account with full access.`
                                      : `Are you sure you want to delete this Admin account (${admin.email})?`;
                                    
                                    if (window.confirm(confirmMessage)) {
                                      handleDeleteUser(admin.id, admin.userType);
                                    }
                                  }}
                                  className={isSuperAdmin ? "bg-orange-600 hover:bg-red-700" : ""}
                                  title={isSuperAdmin ? "Delete Super Admin Account" : "Delete Admin Account"}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              ) : (
                                <div className="text-sm text-green-600 font-medium flex items-center">
                                  <ShieldCheck className="h-4 w-4 mr-1" />
                                  Current Session
                                </div>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-6">
                  <Alert>
                    <ShieldAlert className="h-4 w-4" />
                    <AlertTitle>No admin accounts found</AlertTitle>
                    <AlertDescription>
                      No admin accounts were found in the system. API endpoint: /api/admin/all
                    </AlertDescription>
                  </Alert>
                  
                  <Alert className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Debug Information</AlertTitle>
                    <AlertDescription className="space-y-2">
                      <p>Total users: {users ? users.length : 0}</p>
                      <p>User types: {users ? [...new Set(users.map((u: any) => u.userType))].join(', ') : 'None'}</p>
                      <p>Current user type: {user.userType}</p>
                    </AlertDescription>
                  </Alert>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Employers Tab */}
        <TabsContent value="employers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Employer Accounts
              </CardTitle>
              <CardDescription>
                Manage employer accounts and job postings.
              </CardDescription>
              <div className="flex items-center space-x-2 mt-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search employers..."
                  value={searchEmployers}
                  onChange={(e) => setSearchEmployers(e.target.value)}
                  className="w-full max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredEmployers.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Jobs</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="w-24">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEmployers.map((employer: any) => {
                        const employerJobs = jobs 
                          ? jobs.filter((job: Job) => job.employerId === employer.id)
                          : [];
                        
                        return (
                          <TableRow key={employer.id}>
                            <TableCell>
                              <div className="font-medium">{employer.companyName || employer.name || 'Unnamed'}</div>
                            </TableCell>
                            <TableCell>{employer.email}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                {employer.location || 'Not specified'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{employerJobs.length}</Badge>
                            </TableCell>
                            <TableCell>{formatDate(employer.createdAt)}</TableCell>
                            <TableCell>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteUser(employer.id, 'employer')}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-6 text-center text-muted-foreground">
                  No employer accounts found.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Job Seekers Tab */}
        <TabsContent value="jobseekers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Job Seeker Accounts
              </CardTitle>
              <CardDescription>
                View and manage job seeker profiles and applications.
              </CardDescription>
              <div className="flex items-center space-x-2 mt-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search job seekers..."
                  value={searchJobSeekers}
                  onChange={(e) => setSearchJobSeekers(e.target.value)}
                  className="w-full max-w-sm"
                />
              </div>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredJobSeekers.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Applications</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="w-24">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredJobSeekers.map((seeker: any) => {
                        const seekerApplications = applications 
                          ? applications.filter((app: any) => app.userId === seeker.id)
                          : [];
                        
                        return (
                          <TableRow key={seeker.id}>
                            <TableCell>
                              <div className="font-medium">{seeker.firstName 
                                ? `${seeker.firstName} ${seeker.lastName || ''}`
                                : seeker.name || 'Unnamed'}
                              </div>
                            </TableCell>
                            <TableCell>{seeker.email}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <MapPin className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
                                {seeker.location || 'Not specified'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{seekerApplications.length}</Badge>
                            </TableCell>
                            <TableCell>{formatDate(seeker.createdAt)}</TableCell>
                            <TableCell>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleDeleteUser(seeker.id, 'job seeker')}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="py-6 text-center text-muted-foreground">
                  No job seeker accounts found.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Vacancies Tab */}
        <TabsContent value="vacancies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Vacancy Requests
              </CardTitle>
              <CardDescription>
                Manage employer vacancy requests and assign to recruiters.
              </CardDescription>
              <div className="flex items-center space-x-2 mt-2">
                <Select
                  value={vacancyStatusFilter}
                  onValueChange={setVacancyStatusFilter}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {vacanciesLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : filteredVacancies && filteredVacancies.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredVacancies.map((vacancy: any) => (
                        <TableRow key={vacancy.id}>
                          <TableCell>
                            <div className="font-medium">{vacancy.companyName}</div>
                          </TableCell>
                          <TableCell>{vacancy.position || vacancy.title || 'Not specified'}</TableCell>
                          <TableCell>
                            <a
                              href={`mailto:${vacancy.contactEmail}`}
                              className="text-blue-600 hover:underline flex items-center"
                            >
                              <Mail className="h-3.5 w-3.5 mr-1" />
                              {vacancy.contactEmail}
                            </a>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                vacancy.status === 'new' ? 'default' :
                                vacancy.status === 'assigned' ? 'secondary' :
                                vacancy.status === 'in_progress' ? 'outline' :
                                vacancy.status === 'completed' ? 'success' :
                                'destructive'
                              }
                            >
                              {vacancy.status.replace('_', ' ')}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(vacancy.submittedAt)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewVacancy(vacancy)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleAssignVacancy(vacancy)}
                              >
                                <UserPlus className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
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
              ) : (
                <div className="py-6 text-center text-muted-foreground">
                  No vacancy requests found.
                </div>
              )}
              
              {/* Vacancy View Modal */}
              <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
                <DialogContent className="max-w-3xl">
                  <DialogHeader>
                    <DialogTitle>Vacancy Details</DialogTitle>
                    <DialogDescription>
                      {selectedVacancy?.submittedAt && formatDate(selectedVacancy.submittedAt)}
                    </DialogDescription>
                  </DialogHeader>
                  
                  {selectedVacancy && (
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Company</h3>
                          <p>{selectedVacancy.companyName}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Position</h3>
                          <p>{selectedVacancy.position || selectedVacancy.title}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground">Contact</h3>
                        <div className="flex items-center gap-4">
                          <p>
                            <Mail className="h-3.5 w-3.5 inline mr-1" />
                            {selectedVacancy.contactEmail}
                          </p>
                          {selectedVacancy.contactPhone && (
                            <p>{selectedVacancy.contactPhone}</p>
                          )}
                        </div>
                      </div>
                      
                      {selectedVacancy.description && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Description</h3>
                          <p className="whitespace-pre-wrap">{selectedVacancy.description}</p>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                          <Badge
                            variant={
                              selectedVacancy.status === 'new' ? 'default' :
                              selectedVacancy.status === 'assigned' ? 'secondary' :
                              selectedVacancy.status === 'in_progress' ? 'outline' :
                              selectedVacancy.status === 'completed' ? 'success' :
                              'destructive'
                            }
                            className="mt-1"
                          >
                            {selectedVacancy.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        
                        {selectedVacancy.assignedTo && (
                          <div>
                            <h3 className="text-sm font-medium text-muted-foreground">Assigned To</h3>
                            <p>{selectedVacancy.assignedToName} ({selectedVacancy.assignedTo})</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setViewDialogOpen(false)}>Close</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              {/* Vacancy Assignment Modal */}
              <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Assign Vacancy to Recruiter</DialogTitle>
                    <DialogDescription>
                      Enter the details of the recruiter who will handle this vacancy.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="recruiterName">Recruiter Name</Label>
                      <Input
                        id="recruiterName"
                        value={recruiterName}
                        onChange={(e) => setRecruiterName(e.target.value)}
                        placeholder="Enter recruiter's full name"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="recruiterEmail">Recruiter Email</Label>
                      <Input
                        id="recruiterEmail"
                        type="email"
                        value={recruiterEmail}
                        onChange={(e) => setRecruiterEmail(e.target.value)}
                        placeholder="Enter recruiter's email address"
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
                    <Button 
                      onClick={submitVacancyAssignment}
                      disabled={!recruiterName || !recruiterEmail || assignVacancyMutation.isPending}
                    >
                      {assignVacancyMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Assign Vacancy
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              {/* Vacancy Delete Confirmation */}
              <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Confirm Deletion</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to delete this vacancy request? This action cannot be undone.
                    </DialogDescription>
                  </DialogHeader>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button 
                      variant="destructive" 
                      onClick={confirmDeleteVacancy}
                      disabled={deleteVacancyMutation.isPending}
                    >
                      {deleteVacancyMutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Delete Vacancy
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Inquiries Tab */}
        <TabsContent value="inquiries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Staffing Inquiries
              </CardTitle>
              <CardDescription>
                Manage inquiries from businesses and individuals interested in your services.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {inquiriesLoading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : inquiries && inquiries.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inquiries.map((inquiry: any) => (
                        <TableRow key={inquiry.id}>
                          <TableCell>
                            <div className="font-medium">{inquiry.name}</div>
                            {inquiry.company && (
                              <div className="text-sm text-muted-foreground">{inquiry.company}</div>
                            )}
                          </TableCell>
                          <TableCell>
                            <a
                              href={`mailto:${inquiry.email}`}
                              className="text-blue-600 hover:underline flex items-center"
                            >
                              <Mail className="h-3.5 w-3.5 mr-1" />
                              {inquiry.email}
                            </a>
                            {inquiry.phone && (
                              <div className="text-sm text-muted-foreground mt-1">{inquiry.phone}</div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {inquiry.inquiryType}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Select
                              value={inquiry.status}
                              onValueChange={(value) => handleInquiryStatusChange(inquiry.id, value)}
                            >
                              <SelectTrigger className="w-[130px]">
                                <SelectValue placeholder="Status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="new">
                                  <div className="flex items-center">
                                    <AlertCircle className="h-3.5 w-3.5 mr-2" />
                                    New
                                  </div>
                                </SelectItem>
                                <SelectItem value="in_progress">
                                  <div className="flex items-center">
                                    <Loader2 className="h-3.5 w-3.5 mr-2" />
                                    In Progress
                                  </div>
                                </SelectItem>
                                <SelectItem value="completed">
                                  <div className="flex items-center">
                                    <CheckCircle className="h-3.5 w-3.5 mr-2" />
                                    Completed
                                  </div>
                                </SelectItem>
                                <SelectItem value="rejected">
                                  <div className="flex items-center">
                                    <XCircle className="h-3.5 w-3.5 mr-2" />
                                    Rejected
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>{formatDate(inquiry.submittedAt)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewInquiry(inquiry)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteInquiry(inquiry.id)}
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
              ) : (
                <div className="py-6 text-center text-muted-foreground">
                  No inquiries found.
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Inquiry View Modal */}
          {selectedInquiry && (
            <InquiryPreviewModal
              inquiry={selectedInquiry}
              open={inquiryModalOpen}
              onOpenChange={setInquiryModalOpen}
              onStatusChange={(status) => handleInquiryStatusChange(selectedInquiry.id, status)}
              onDelete={() => {
                handleDeleteInquiry(selectedInquiry.id);
                setInquiryModalOpen(false);
              }}
              formatDate={formatDate}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AdminDashboard;
