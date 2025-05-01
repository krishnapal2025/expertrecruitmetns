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
    
    if (user.userType !== "admin") {
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
  
  // Fetch users
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["/api/users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return await res.json();
    },
    enabled: !!user && user.userType === "admin"
  });
  
  // Fetch jobs
  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ["/api/jobs"],
    queryFn: async () => {
      const res = await fetch("/api/jobs");
      if (!res.ok) throw new Error("Failed to fetch jobs");
      return await res.json();
    },
    enabled: !!user && user.userType === "admin"
  });
  
  // Fetch vacancies
  const { data: vacancies, isLoading: vacanciesLoading } = useQuery({
    queryKey: ["/api/admin/vacancies"],
    queryFn: async () => {
      const res = await fetch("/api/admin/vacancies");
      if (!res.ok) throw new Error("Failed to fetch vacancies");
      return await res.json();
    },
    enabled: !!user && user.userType === "admin"
  });
  
  // Fetch inquiries
  const { data: inquiries, isLoading: inquiriesLoading } = useQuery({
    queryKey: ["/api/staffing-inquiries"],
    queryFn: async () => {
      const res = await fetch("/api/staffing-inquiries");
      if (!res.ok) throw new Error("Failed to fetch inquiries");
      return await res.json();
    },
    enabled: !!user && user.userType === "admin"
  });
  
  // Fetch blog posts
  const { data: blogPosts, isLoading: blogPostsLoading } = useQuery({
    queryKey: ["/api/blog-posts"],
    queryFn: async () => {
      const res = await fetch("/api/blog-posts");
      if (!res.ok) throw new Error("Failed to fetch blog posts");
      return await res.json();
    },
    enabled: !!user && user.userType === "admin"
  });
  
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
  
  // Blog post mutations
  const deleteBlogPostMutation = useMutation({
    mutationFn: async (postId: number) => {
      const res = await apiRequest("DELETE", `/api/blog-posts/${postId}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete blog post");
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Blog post deleted",
        description: "The blog post has been deleted successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete blog post",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const toggleBlogPostPublishMutation = useMutation({
    mutationFn: async ({ postId, published }: { postId: number, published: boolean }) => {
      const res = await apiRequest("PATCH", `/api/blog-posts/${postId}`, { published });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || `Failed to ${published ? 'publish' : 'unpublish'} blog post`);
      }
      return await res.json();
    },
    onSuccess: (data, variables) => {
      const { published } = variables;
      toast({
        title: published ? "Blog post published" : "Blog post unpublished",
        description: `The blog post has been ${published ? 'published' : 'unpublished'} successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Action failed",
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Manage job postings, users, and content
          </p>
        </div>
        
        <Button onClick={() => navigate("/post-job")} size="lg" className="shrink-0">
          <PlusCircle className="mr-2 h-5 w-5" />
          Post Job Notification
        </Button>
      </div>
      
      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
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
                      Pending: {vacancies?.filter((v: any) => v.status === "pending").length || 0} | 
                      Approved: {vacancies?.filter((v: any) => v.status === "approved").length || 0} | 
                      Rejected: {vacancies?.filter((v: any) => v.status === "rejected").length || 0}
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
                              <TableCell>{employer.lastActive ? formatDate(employer.lastActive) : "N/A"}</TableCell>
                              <TableCell>{employer.location || "N/A"}</TableCell>
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
                                {vacancy.assignedRecruiter || 
                                  <span className="text-muted-foreground text-sm">Not assigned</span>
                                }
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                  >
                                    <Send className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-red-500 hover:text-red-700 hover:bg-red-100"
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
                                    <Button variant="ghost" size="sm">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
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
                            <TableHead>Resumes</TableHead>
                            <TableHead>Inquiries</TableHead>
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
                              <TableCell>{seeker.resumeCount || 0}</TableCell>
                              <TableCell>{seeker.inquiryCount || 0}</TableCell>
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
                  <div className="text-center py-10 border rounded-md bg-muted/20">
                    <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">No resumes found</p>
                    <p className="text-sm text-muted-foreground/70 mt-1">
                      Submitted resumes will appear here
                    </p>
                  </div>
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
                                    <Button variant="ghost" size="sm">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
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
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Mail className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-500 hover:text-red-700 hover:bg-red-100"
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
        
        {/* Content Panel */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle>Blog Management</CardTitle>
                  <CardDescription>
                    Create and manage blog posts
                  </CardDescription>
                </div>
                
                <Button onClick={() => navigate("/create-blog")} className="shrink-0">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create New Blog Post
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {blogPostsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : !blogPosts || blogPosts.length === 0 ? (
                <div className="flex justify-center py-10 border rounded-md bg-muted/20">
                  <div className="text-center">
                    <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground font-medium">No blog posts yet</p>
                    <p className="text-sm text-muted-foreground/70 mb-6 max-w-md">
                      Add engaging content to your website with blog posts about recruitment, career advice, and industry trends
                    </p>
                    <Button onClick={() => navigate("/create-blog")} className="w-full md:w-auto">
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Create Your First Blog Post
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="overflow-hidden">
                  <ScrollArea className="h-[600px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {blogPosts
                          .sort((a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
                          .map((post: any) => (
                            <TableRow key={post.id}>
                              <TableCell className="font-medium">
                                {post.title || "Untitled"}
                                {post.subtitle && (
                                  <p className="text-xs text-muted-foreground truncate max-w-[250px]">
                                    {post.subtitle}
                                  </p>
                                )}
                              </TableCell>
                              <TableCell>
                                {post.published ? (
                                  <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
                                    Published
                                  </Badge>
                                ) : (
                                  <Badge variant="secondary" className="bg-amber-100 text-amber-800 hover:bg-amber-200">
                                    Draft
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>{post.category || "Uncategorized"}</TableCell>
                              <TableCell>{formatDate(post.createdAt)}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => navigate(`/article/${post.id}`)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    onClick={() => navigate(`/edit-blog/${post.id}`)}
                                  >
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => {
                                      toggleBlogPostPublishMutation.mutate({
                                        postId: post.id,
                                        published: !post.published
                                      });
                                    }}
                                  >
                                    {post.published ? (
                                      <XCircle className="h-4 w-4 text-amber-600" />
                                    ) : (
                                      <CheckCircle className="h-4 w-4 text-green-600" />
                                    )}
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                    onClick={() => {
                                      if (window.confirm("Are you sure you want to delete this blog post? This action cannot be undone.")) {
                                        deleteBlogPostMutation.mutate(post.id);
                                      }
                                    }}
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
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AdminDashboard;