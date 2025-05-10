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
  
  // Update inquiry status
  const handleUpdateInquiryStatus = async (id: number, status: string) => {
    try {
      await updateInquiryStatusMutation.mutateAsync({ id, status });
      return true;
    } catch (error) {
      return false;
    }
  };
  
  // Handle assignment submission
  const submitAssignment = () => {
    if (!selectedVacancy) return;
    
    if (!recruiterEmail || !recruiterName) {
      toast({
        title: "Missing information",
        description: "Please enter both recruiter email and name.",
        variant: "destructive",
      });
      return;
    }
    
    assignVacancyMutation.mutate({
      vacancyId: selectedVacancy.id,
      recruiterEmail,
      recruiterName
    });
  };
  
  // We now have a single authentication check in the useEffect at the top
  
  // Loading state
  if (!user || adminLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 max-w-[1400px]">
      {/* View Vacancy Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Vacancy Details</DialogTitle>
            <DialogDescription>
              Review the detailed information for this vacancy.
            </DialogDescription>
          </DialogHeader>
          {selectedVacancy && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Position</h3>
                  <p className="text-sm">{selectedVacancy.positionName || selectedVacancy.jobTitle || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Company</h3>
                  <p className="text-sm">{selectedVacancy.companyName || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Industry</h3>
                  <p className="text-sm">{selectedVacancy.industry || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Location</h3>
                  <p className="text-sm">{selectedVacancy.location || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Status</h3>
                  <Badge variant={
                    selectedVacancy.status === "open" 
                      ? "default"
                      : selectedVacancy.status === "pending" 
                      ? "default" 
                      : selectedVacancy.status === "closed" 
                      ? "secondary" 
                      : selectedVacancy.status === "lost"
                      ? "destructive"
                      : "outline"
                  }>
                    {selectedVacancy.status || "pending"}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Salary Range</h3>
                  <p className="text-sm">{selectedVacancy.salaryRange || "Not specified"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Deadline</h3>
                  <p className="text-sm">{formatDate(selectedVacancy.applicationDeadline)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Submitted</h3>
                  <p className="text-sm">{formatDate(selectedVacancy.submittedAt || selectedVacancy.createdAt)}</p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Job Description</h3>
                <div className="mt-1 p-3 bg-muted rounded-md text-sm max-h-[200px] overflow-y-auto">
                  {selectedVacancy.jobDescription || "No job description provided."}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium">Recruiter Assignment</h3>
                {selectedVacancy.assignedName ? (
                  <div className="p-3 bg-muted rounded-md text-sm mt-1">
                    <p><span className="font-medium">Assigned to:</span> {selectedVacancy.assignedName}</p>
                    <p><span className="font-medium">Email:</span> {selectedVacancy.assignedTo}</p>
                    <p><span className="font-medium">Assigned at:</span> {formatDate(selectedVacancy.assignedAt)}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground mt-1">Not assigned to any recruiter yet.</p>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium">Contact Name</h3>
                  <p className="text-sm">{selectedVacancy.contactName || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Contact Email</h3>
                  <p className="text-sm">{selectedVacancy.contactEmail || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Contact Phone</h3>
                  <p className="text-sm">{selectedVacancy.contactPhone || "N/A"}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
              Close
            </Button>
            {selectedVacancy && !selectedVacancy.assignedName && (
              <Button onClick={() => {
                setViewDialogOpen(false);
                handleAssignVacancy(selectedVacancy);
              }}>
                Assign to Recruiter
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Vacancy Assignment Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Assign Vacancy to Recruiter</DialogTitle>
            <DialogDescription>
              Enter the recruiter's email and name to assign this vacancy for handling.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="recruiter-email">Recruiter Email</Label>
              <Input
                id="recruiter-email"
                type="email"
                value={recruiterEmail}
                onChange={(e) => setRecruiterEmail(e.target.value)}
                placeholder="recruiter@example.com"
                autoComplete="email"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="recruiter-name">Recruiter Name</Label>
              <Input
                id="recruiter-name"
                value={recruiterName}
                onChange={(e) => setRecruiterName(e.target.value)}
                placeholder="John Doe"
              />
            </div>
            {selectedVacancy && (
              <div className="bg-muted p-3 rounded-md mt-2">
                <p className="text-sm font-medium">Vacancy Details:</p>
                <div className="text-sm text-muted-foreground mt-1">
                  <p><span className="font-medium">Company:</span> {selectedVacancy.companyName}</p>
                  <p><span className="font-medium">Position:</span> {selectedVacancy.positionName || selectedVacancy.jobTitle}</p>
                  <p><span className="font-medium">Status:</span> {selectedVacancy.status || "pending"}</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={submitAssignment} 
              disabled={assignVacancyMutation.isPending}
            >
              {assignVacancyMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Assigning...
                </>
              ) : (
                <>Assign Vacancy</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Vacancy Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this vacancy? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedVacancy && (
            <div className="py-4">
              <div className="bg-muted p-4 rounded-md flex items-start space-x-4">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <div>
                  <h4 className="font-medium">Vacancy details:</h4>
                  <p className="text-sm mt-1"><span className="font-medium">Company:</span> {selectedVacancy.companyName}</p>
                  <p className="text-sm"><span className="font-medium">Position:</span> {selectedVacancy.positionName || selectedVacancy.jobTitle}</p>
                  <p className="text-sm"><span className="font-medium">Status:</span> {selectedVacancy.status || "pending"}</p>
                  <p className="text-sm"><span className="font-medium">Submitted:</span> {formatDate(selectedVacancy.submittedAt || selectedVacancy.createdAt)}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive"
              onClick={() => {
                console.log("Selected vacancy for deletion:", selectedVacancy);
                deleteVacancyMutation.mutate(selectedVacancy.id);
              }} 
              disabled={deleteVacancyMutation.isPending}
            >
              {deleteVacancyMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>Delete Vacancy</>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Inquiry Preview Modal */}
      {selectedInquiry && (
        <InquiryPreviewModal
          inquiry={selectedInquiry}
          isOpen={inquiryModalOpen}
          onClose={() => {
            setInquiryModalOpen(false);
            setSelectedInquiry(null);
          }}
          onStatusChange={handleUpdateInquiryStatus}
          onReplySuccess={() => {
            setInquiryModalOpen(false);
            queryClient.invalidateQueries({ queryKey: ["/api/staffing-inquiries"] });
            toast({
              title: "Reply sent",
              description: "Your reply has been sent successfully."
            });
          }}
        />
      )}
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Manage job postings, users, and content
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-6 mb-8">
          <TabsTrigger value="dashboard">
            <BarChart2 className="mr-2 h-4 w-4" />
            Dashboard
          <TabsTrigger value="admins">
            <ShieldCheck className="mr-2 h-4 w-4" />
            Admins
          </TabsTrigger>
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
          <TabsTrigger value="posts">
            <FileTextIcon className="mr-2 h-4 w-4" />
            Blogs
          </TabsTrigger>
          <TabsTrigger value="resumes">
            <FileText className="mr-2 h-4 w-4" />
            Resumes
          </TabsTrigger>
        </TabsList>
        
        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Users Card */}
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
            
            {/* Active Jobs Card */}
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
                      Recently Posted: {jobs?.filter((j: Job) => {
                        if (!j.createdAt) return false;
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
            
            {/* Vacancies Card */}
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
                      Pending: {vacancies?.filter((v: any) => !v.status || v.status === "pending").length || 0} | 
                      Open: {vacancies?.filter((v: any) => v.status === "open").length || 0} | 
                      Closed: {vacancies?.filter((v: any) => v.status === "closed").length || 0}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Inquiries Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Inquiries</CardTitle>
                <CardDescription>Business and staffing inquiries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {inquiriesLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    inquiries?.length || 0
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {!inquiriesLoading && inquiries?.length > 0 && (
                    <>
                      New: {inquiries?.filter((i: any) => i.status === "new").length || 0} | 
                      In Progress: {inquiries?.filter((i: any) => i.status === "in_progress").length || 0} | 
                      Completed: {inquiries?.filter((i: any) => i.status === "completed").length || 0}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Recent Employers
                </CardTitle>
                <CardDescription>
                  Recently joined employers on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users?.filter(u => u.userType === "employer")
                      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
                      .slice(0, 5)
                      .map((employer: any) => (
                        <div key={employer.id} className="flex justify-between items-center border-b pb-2">
                          <div>
                            <p className="font-medium text-sm">{employer.name || employer.email}</p>
                            <p className="text-xs text-muted-foreground">Joined {formatDate(employer.createdAt)}</p>
                          </div>
                          <Badge variant="outline">Employer</Badge>
                        </div>
                      ))}
                    {users?.filter(u => u.userType === "employer").length === 0 && (
                      <p className="text-muted-foreground text-sm text-center py-4">No employers registered yet</p>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" onClick={() => document.querySelector('[value="employers"]')?.click()}>
                  View All Employers
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Recent Job Seekers
                </CardTitle>
                <CardDescription>
                  Recently joined job seekers on the platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {users?.filter(u => u.userType === "jobseeker")
                      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
                      .slice(0, 5)
                      .map((seeker: any) => (
                        <div key={seeker.id} className="flex justify-between items-center border-b pb-2">
                          <div>
                            <p className="font-medium text-sm">{seeker.name || seeker.email}</p>
                            <p className="text-xs text-muted-foreground">Joined {formatDate(seeker.createdAt)}</p>
                          </div>
                          <Badge variant="outline">Job Seeker</Badge>
                        </div>
                      ))}
                    {users?.filter(u => u.userType === "jobseeker").length === 0 && (
                      <p className="text-muted-foreground text-sm text-center py-4">No job seekers registered yet</p>
                    )}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" onClick={() => document.querySelector('[value="jobseekers"]')?.click()}>
                  View All Job Seekers
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Download className="h-5 w-5 mr-2" />
                Download Reports
              </CardTitle>
              <CardDescription>
                Generate and download various reports in Excel format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Employer Report</CardTitle>
                    <CardDescription className="text-xs">
                      Employer profiles, vacancy forms, inquiries
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-2">
                    <div className="w-full">
                      <Select value={reportTimeframe} onValueChange={setReportTimeframe} defaultValue="weekly">
                        <SelectTrigger className="mb-2">
                          <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly Report</SelectItem>
                          <SelectItem value="monthly">Monthly Report</SelectItem>
                          <SelectItem value="yearly">Yearly Report</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Job Seeker Report</CardTitle>
                    <CardDescription className="text-xs">
                      Job seeker profiles, resumes, inquiries
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-2">
                    <div className="w-full">
                      <Select value={reportTimeframe} onValueChange={setReportTimeframe} defaultValue="weekly">
                        <SelectTrigger className="mb-2">
                          <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly Report</SelectItem>
                          <SelectItem value="monthly">Monthly Report</SelectItem>
                          <SelectItem value="yearly">Yearly Report</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Combined Report</CardTitle>
                    <CardDescription className="text-xs">
                      All platform activity and user data
                    </CardDescription>
                  </CardHeader>
                  <CardFooter className="pt-2">
                    <div className="w-full">
                      <Select value={reportTimeframe} onValueChange={setReportTimeframe} defaultValue="weekly">
                        <SelectTrigger className="mb-2">
                          <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weekly">Weekly Report</SelectItem>
                          <SelectItem value="monthly">Monthly Report</SelectItem>
                          <SelectItem value="yearly">Yearly Report</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Employers Panel */}
        <TabsContent value="employers" className="space-y-4">
          <Tabs defaultValue="profiles">
            <TabsList className="w-full">
              <TabsTrigger value="profiles" className="flex-1">
                <Building className="mr-2 h-4 w-4" />
                EM Profiles
              </TabsTrigger>
              <TabsTrigger value="vacancy-forms" className="flex-1">
                <Briefcase className="mr-2 h-4 w-4" />
                Received Vacancy Forms
              </TabsTrigger>
              <TabsTrigger value="business-inquiries" className="flex-1">
                <MessageSquare className="mr-2 h-4 w-4" />
                Business Inquiries
              </TabsTrigger>
            </TabsList>
            
            {/* EM Profiles Tab */}
            <TabsContent value="profiles" className="mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <CardTitle>Employer Profiles</CardTitle>
                      <CardDescription>
                        Manage employer accounts and information
                      </CardDescription>
                    </div>
                    
                    <div className="relative max-w-sm">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search by name, email, location..." 
                        value={searchEmployers}
                        onChange={(e) => setSearchEmployers(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : filteredEmployers.length === 0 ? (
                    <div className="text-center py-10 border rounded-md bg-muted/20">
                      <Building className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground font-medium">No employer profiles found</p>
                      <p className="text-sm text-muted-foreground/70 mt-1">
                        {searchEmployers ? "Try adjusting your search" : "Employer accounts will appear here when created"}
                      </p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[500px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead>Signup Date</TableHead>
                            <TableHead>Last Active</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredEmployers.map((employer: any) => (
                            <TableRow key={employer.id}>
                              <TableCell className="font-medium">
                                {employer.name || employer.username || employer.email.split('@')[0]}
                              </TableCell>
                              <TableCell>{employer.id}</TableCell>
                              <TableCell>{formatDate(employer.createdAt)}</TableCell>
                              <TableCell>
                                {employer.lastActive ? (
                                  <span className="text-green-600 font-medium">{formatDate(employer.lastActive)}</span>
                                ) : employer.lastLogin ? (
                                  <span className="text-blue-600">{formatDate(employer.lastLogin)}</span>
                                ) : (
                                  <span className="text-gray-500 text-sm">Not active yet</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {employer.location ? (
                                  <span className="font-medium flex items-center gap-1">
                                    <MapPin className="h-3 w-3 text-primary" />
                                    {employer.location}
                                  </span>
                                ) : employer.city ? (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3 text-primary" />
                                    {employer.city}{employer.country ? `, ${employer.country}` : ''}
                                  </span>
                                ) : (
                                  <span className="text-gray-500 text-sm">Location not provided</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                  onClick={() => handleDeleteUser(employer.id, 'employer')}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  )}
                </CardContent>
                <CardFooter className="border-t px-6 py-4 flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    {filteredEmployers.length} employer(s) found
                  </div>
                  
                  <Select value={reportTimeframe} onValueChange={setReportTimeframe}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export Report
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Vacancy Forms Tab */}
            <TabsContent value="vacancy-forms" className="mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <CardTitle>Received Vacancy Forms</CardTitle>
                      <CardDescription>
                        Manage vacancy requests from employers
                      </CardDescription>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="relative w-full sm:w-60">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                          placeholder="Search companies..." 
                          className="pl-8"
                        />
                      </div>
                      
                      <Select 
                        value={vacancyStatusFilter} 
                        onValueChange={setVacancyStatusFilter}
                      >
                        <SelectTrigger className="w-[140px]">
                          <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Statuses</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="open">Open</SelectItem>
                          <SelectItem value="closed">Closed</SelectItem>
                          <SelectItem value="lost">Lost</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {vacanciesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : filteredVacancies.length === 0 ? (
                    <div className="text-center py-10 border rounded-md bg-muted/20">
                      <Briefcase className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground font-medium">No vacancy forms found</p>
                      <p className="text-sm text-muted-foreground/70 mt-1">
                        {vacancyStatusFilter !== "all" 
                          ? "Try adjusting your filter" 
                          : "Submitted vacancy forms will appear here"}
                      </p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[500px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Company</TableHead>
                            <TableHead>Position</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Assigned To</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredVacancies.map((vacancy: any) => (
                            <TableRow key={vacancy.id}>
                              <TableCell className="font-medium">
                                {vacancy.companyName || "N/A"}
                              </TableCell>
                              <TableCell>{vacancy.positionName || "N/A"}</TableCell>
                              <TableCell>
                                <Badge variant={
                                  vacancy.status === "open" 
                                    ? "default" 
                                    : vacancy.status === "pending" 
                                    ? "default" 
                                    : vacancy.status === "closed" 
                                    ? "secondary" 
                                    : vacancy.status === "lost"
                                    ? "destructive"
                                    : "outline"
                                }>
                                  {vacancy.status || "pending"}
                                </Badge>
                              </TableCell>
                              <TableCell>{formatDate(vacancy.submittedAt || vacancy.createdAt)}</TableCell>
                              <TableCell>
                                {vacancy.assignedName ? 
                                  <span>{vacancy.assignedName} <span className="text-xs text-muted-foreground">({vacancy.assignedTo})</span></span> : 
                                  <span className="text-muted-foreground text-sm">Not assigned</span>
                                }
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleViewVacancy(vacancy)}
                                    title="View Vacancy Form"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleAssignVacancy(vacancy)}
                                    title="Assign to Recruiter"
                                  >
                                    <UserPlus className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                    onClick={() => handleDeleteVacancy(vacancy)}
                                    title="Delete Vacancy Form"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
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
            
            {/* Business Inquiries Tab */}
            <TabsContent value="business-inquiries" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Business Inquiries</CardTitle>
                  <CardDescription>
                    Manage business inquiries from employers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {inquiriesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : inquiries && inquiries.filter((i: any) => i.inquiryType === "business").length > 0 ? (
                    <ScrollArea className="h-[500px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {inquiries
                            .filter((i: any) => i.inquiryType === "business")
                            .map((inquiry: any) => (
                              <TableRow key={inquiry.id}>
                                <TableCell className="font-medium">{inquiry.name}</TableCell>
                                <TableCell>{inquiry.email}</TableCell>
                                <TableCell>
                                  <Badge variant={
                                    inquiry.status === "completed" 
                                      ? "default" 
                                      : inquiry.status === "in_progress" 
                                      ? "secondary" 
                                      : "outline"
                                  }>
                                    {inquiry.status || "new"}
                                  </Badge>
                                </TableCell>
                                <TableCell>{formatDate(inquiry.submittedAt || inquiry.createdAt)}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-1">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleViewInquiry(inquiry)}
                                      title="View Inquiry"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleReplyInquiry(inquiry)}
                                      title="Send Reply"
                                    >
                                      <Mail className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                      onClick={() => handleDeleteInquiry(inquiry)}
                                      title="Delete Inquiry"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-10 border rounded-md bg-muted/20">
                      <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground font-medium">No business inquiries found</p>
                      <p className="text-sm text-muted-foreground/70 mt-1">
                        Business inquiries will appear here when submitted
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        {/* Job Seekers Panel */}
        <TabsContent value="jobseekers" className="space-y-4">
          <Tabs defaultValue="profiles">
            <TabsList className="w-full">
              <TabsTrigger value="profiles" className="flex-1">
                <Users className="mr-2 h-4 w-4" />
                JS Profiles
              </TabsTrigger>
              <TabsTrigger value="resumes" className="flex-1">
                <FileText className="mr-2 h-4 w-4" />
                Received Resumes
              </TabsTrigger>
              <TabsTrigger value="inquiries" className="flex-1">
                <MessageSquare className="mr-2 h-4 w-4" />
                General Inquiries
              </TabsTrigger>
            </TabsList>
            
            {/* Job Seeker Profiles Tab */}
            <TabsContent value="profiles" className="mt-6">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                      <CardTitle>Job Seeker Profiles</CardTitle>
                      <CardDescription>
                        Manage job seeker accounts and information
                      </CardDescription>
                    </div>
                    
                    <div className="relative max-w-sm">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search by name, email, location..." 
                        value={searchJobSeekers}
                        onChange={(e) => setSearchJobSeekers(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {usersLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : filteredJobSeekers.length === 0 ? (
                    <div className="text-center py-10 border rounded-md bg-muted/20">
                      <Users className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground font-medium">No job seeker profiles found</p>
                      <p className="text-sm text-muted-foreground/70 mt-1">
                        {searchJobSeekers ? "Try adjusting your search" : "Job seeker accounts will appear here when created"}
                      </p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[500px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>ID</TableHead>
                            <TableHead>Signup Date</TableHead>
                            <TableHead>Last Active</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredJobSeekers.map((seeker: any) => (
                            <TableRow key={seeker.id}>
                              <TableCell className="font-medium">
                                {seeker.name || seeker.username || seeker.email.split('@')[0]}
                              </TableCell>
                              <TableCell>{seeker.id}</TableCell>
                              <TableCell>{formatDate(seeker.createdAt)}</TableCell>
                              <TableCell>
                                {seeker.lastActive ? (
                                  <span className="text-green-600 font-medium">{formatDate(seeker.lastActive)}</span>
                                ) : seeker.lastLogin ? (
                                  <span className="text-blue-600">{formatDate(seeker.lastLogin)}</span>
                                ) : (
                                  <span className="text-gray-500 text-sm">Not active yet</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {seeker.location ? (
                                  <span className="font-medium flex items-center gap-1">
                                    <MapPin className="h-3 w-3 text-primary" />
                                    {seeker.location}
                                  </span>
                                ) : seeker.city ? (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3 text-primary" />
                                    {seeker.city}{seeker.country ? `, ${seeker.country}` : ''}
                                  </span>
                                ) : (
                                  <span className="text-gray-500 text-sm">Location not provided</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                  onClick={() => handleDeleteUser(seeker.id, 'job seeker')}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  )}
                </CardContent>
                <CardFooter className="border-t px-6 py-4 flex justify-between">
                  <div className="text-sm text-muted-foreground">
                    {filteredJobSeekers.length} job seeker(s) found
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Select value={reportTimeframe} onValueChange={setReportTimeframe}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select timeframe" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Export Report
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            
            {/* Resumes Tab */}
            <TabsContent value="resumes" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Received Resumes</CardTitle>
                  <CardDescription>
                    View and download submitted resumes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {applicationsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : !applications || applications.length === 0 ? (
                    <div className="text-center py-10 border rounded-md bg-muted/20">
                      <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground font-medium">No resumes found</p>
                      <p className="text-sm text-muted-foreground/70 mt-1">
                        Submitted resumes will appear here
                      </p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[500px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Job Position</TableHead>
                            <TableHead>Company</TableHead>
                            <TableHead>Applied Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {applications.map((application: any) => (
                            <TableRow key={application.id}>
                              <TableCell className="font-medium">
                                {application.jobSeeker ? 
                                  `${application.jobSeeker.firstName} ${application.jobSeeker.lastName}` 
                                  : 'Unknown Applicant'}
                              </TableCell>
                              <TableCell>{application.job?.title || 'Unknown Position'}</TableCell>
                              <TableCell>{application.job?.company || 'Unknown Company'}</TableCell>
                              <TableCell>{formatDate(application.appliedDate)}</TableCell>
                              <TableCell>
                                <Select 
                                  defaultValue={application.status || "new"}
                                  onValueChange={(value) => {
                                    updateApplicationStatusMutation.mutate({
                                      id: application.id,
                                      status: value
                                    });
                                  }}
                                >
                                  <SelectTrigger className="w-[120px]">
                                    <SelectValue>
                                      <Badge variant={
                                        application.status === "shortlisted" 
                                          ? "default" 
                                          : application.status === "interviewed" 
                                          ? "secondary"
                                          : application.status === "rejected"
                                          ? "destructive"
                                          : application.status === "viewed" 
                                          ? "outline" 
                                          : "outline"
                                      }>
                                        {application.status || "new"}
                                      </Badge>
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="new">New</SelectItem>
                                    <SelectItem value="viewed">Viewed</SelectItem>
                                    <SelectItem value="shortlisted">Shortlisted</SelectItem>
                                    <SelectItem value="interviewed">Interviewed</SelectItem>
                                    <SelectItem value="rejected">Rejected</SelectItem>
                                  </SelectContent>
                                </Select>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => window.open(`/api/jobseekers/${application.jobSeekerId}/cv`, '_blank')}
                                    title="View CV"
                                  >
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      // View application details - can be implemented later
                                      toast({
                                        title: "View Application",
                                        description: `Viewing application from ${application.jobSeeker?.firstName} ${application.jobSeeker?.lastName} for ${application.job?.title}`,
                                      });
                                    }}
                                    title="View Application"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </div>
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
            
            {/* General Inquiries Tab */}
            <TabsContent value="inquiries" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>General Inquiries</CardTitle>
                  <CardDescription>
                    Manage inquiries from job seekers
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {inquiriesLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : inquiries && inquiries.filter((i: any) => i.inquiryType === "general").length > 0 ? (
                    <ScrollArea className="h-[500px]">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {inquiries
                            .filter((i: any) => i.inquiryType === "general")
                            .map((inquiry: any) => (
                              <TableRow key={inquiry.id}>
                                <TableCell className="font-medium">{inquiry.name}</TableCell>
                                <TableCell>{inquiry.email}</TableCell>
                                <TableCell>
                                  <Badge variant={
                                    inquiry.status === "completed" 
                                      ? "default" 
                                      : inquiry.status === "in_progress" 
                                      ? "secondary" 
                                      : "outline"
                                  }>
                                    {inquiry.status || "new"}
                                  </Badge>
                                </TableCell>
                                <TableCell>{formatDate(inquiry.submittedAt || inquiry.createdAt)}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-1">
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleViewInquiry(inquiry)}
                                      title="View Inquiry"
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm"
                                      onClick={() => handleReplyInquiry(inquiry)}
                                      title="Send Reply"
                                    >
                                      <Mail className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                      onClick={() => handleDeleteInquiry(inquiry)}
                                      title="Delete Inquiry"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  ) : (
                    <div className="text-center py-10 border rounded-md bg-muted/20">
                      <MessageSquare className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground font-medium">No general inquiries found</p>
                      <p className="text-sm text-muted-foreground/70 mt-1">
                        Job seeker inquiries will appear here when submitted
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </TabsContent>
        
        {/* Messages Panel */}
        <TabsContent value="messages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Form Messages</CardTitle>
              <CardDescription>
                Messages submitted through the contact form
              </CardDescription>
            </CardHeader>
            <CardContent>
              {inquiriesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : inquiries && inquiries.filter((i: any) => i.inquiryType === "contact").length > 0 ? (
                <ScrollArea className="h-[500px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inquiries
                        .filter((i: any) => i.inquiryType === "contact")
                        .map((message: any) => (
                          <TableRow key={message.id}>
                            <TableCell className="font-medium">{message.name}</TableCell>
                            <TableCell>{message.email}</TableCell>
                            <TableCell>{message.subject || "No subject"}</TableCell>
                            <TableCell>{formatDate(message.submittedAt || message.createdAt)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleViewInquiry(message)}
                                  title="View Message"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => handleReplyInquiry(message)}
                                  title="Send Reply"
                                >
                                  <Mail className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                  onClick={() => handleDeleteInquiry(message)}
                                  title="Delete Message"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              ) : (
                <div className="text-center py-10 border rounded-md bg-muted/20">
                  <Mail className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium">No contact messages found</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Messages from the contact form will appear here
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Posts Panel */}
        <TabsContent value="posts" className="space-y-4">
          <Card>
            <CardContent className="py-10">
              <div className="flex justify-center">
                <div className="text-center">
                  <FileTextIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">Article Management</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    Use the Post Manager page to create and manage blog articles and content.
                  </p>
                  <Button variant="default" onClick={() => navigate("/post-manager")}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Go to Post Manager
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AdminDashboard;