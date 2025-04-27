import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Admin, InvitationCode, User, Job, JobSeeker, Employer, Vacancy } from "@shared/schema";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  UserCog
} from "lucide-react";
import { format } from "date-fns";

// Admin Dashboard Page
function AdminPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("dashboard");
  
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
  
  // Removed invitation codes fetching
  
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
  
  // Removed invitation code mutation
  
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
  
  // Removed invitation code helper functions
  
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
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-6 mb-8">
          <TabsTrigger value="dashboard">
            <RefreshCw className="mr-2 h-4 w-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="mr-2 h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="jobs">
            <Briefcase className="mr-2 h-4 w-4" />
            Jobs
          </TabsTrigger>
          <TabsTrigger value="companies">
            <Building className="mr-2 h-4 w-4" />
            Companies
          </TabsTrigger>
          <TabsTrigger value="content">
            <FileText className="mr-2 h-4 w-4" />
            Content
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </TabsTrigger>
        </TabsList>
        
        {/* Dashboard Tab */}
        <TabsContent value="dashboard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
        
        {/* Companies Tab */}
        <TabsContent value="companies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Company Management</CardTitle>
              <CardDescription>All registered employers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Coming soon: Company management interface showing all registered employers and their details
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Content Tab */}
        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
              <CardDescription>Manage website content and submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="vacancies" className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="vacancies">
                    <FileText className="mr-2 h-4 w-4" />
                    Vacancy Submissions
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