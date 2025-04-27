import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Admin, InvitationCode, User, Job, JobSeeker, Employer } from "@shared/schema";

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
  const [currentAdminTab, setCurrentAdminTab] = useState("admins");
  const [createInvitationOpen, setCreateInvitationOpen] = useState(false);
  const [newInvitation, setNewInvitation] = useState({
    email: "",
    code: generateRandomCode(),
    expiresAt: getDefaultExpiryDate()
  });
  
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
  
  // Fetch invitation codes
  const { data: invitationCodes, isLoading: invitationsLoading } = useQuery({
    queryKey: ["/api/admin/invitation-codes"],
    queryFn: async () => {
      const res = await fetch("/api/admin/invitation-codes");
      if (!res.ok) throw new Error("Failed to fetch invitation codes");
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
      console.log("Admin fetching jobs...");
      const res = await fetch("/api/jobs");
      if (!res.ok) throw new Error("Failed to fetch jobs data");
      const jobsData = await res.json();
      console.log("Admin received jobs:", jobsData);
      return jobsData;
    },
    enabled: !!user && user.userType === "admin"
  });
  
  // Create invitation code mutation
  const createInvitationMutation = useMutation({
    mutationFn: async (data: { email: string, code: string, expiresAt: string }) => {
      const res = await apiRequest("POST", "/api/admin/invitation-codes", data);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create invitation code");
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Invitation code created",
        description: "The invitation code has been created successfully.",
      });
      setCreateInvitationOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/invitation-codes"] });
      // Reset form
      setNewInvitation({
        email: "",
        code: generateRandomCode(),
        expiresAt: getDefaultExpiryDate()
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create invitation code",
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
  
  // Generate random code
  function generateRandomCode() {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  }
  
  // Get default expiry date (7 days from now)
  function getDefaultExpiryDate() {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    return date.toISOString().split("T")[0];
  }
  
  // Handle copy code to clipboard
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast({
      title: "Copied to clipboard",
      description: `Invitation code ${code} copied to clipboard`,
    });
  };
  
  // Create invitation code
  const handleCreateInvitation = () => {
    if (!newInvitation.email) {
      toast({
        title: "Email required",
        description: "Please enter an email address for the invitation.",
        variant: "destructive",
      });
      return;
    }
    
    createInvitationMutation.mutate({
      email: newInvitation.email,
      code: newInvitation.code,
      expiresAt: new Date(newInvitation.expiresAt).toISOString()
    });
  };
  
  // Generate new code
  const handleRegenerateCode = () => {
    setNewInvitation({
      ...newInvitation,
      code: generateRandomCode()
    });
  };
  
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
                <CardTitle>Pending Invitations</CardTitle>
                <CardDescription>Admin invitation codes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {invitationsLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin" />
                  ) : (
                    invitationCodes?.filter((code: InvitationCode) => 
                      !code.isUsed && new Date(code.expiresAt) > new Date()
                    ).length || 0
                  )}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Expired: {invitationCodes?.filter((code: InvitationCode) => 
                    !code.isUsed && new Date(code.expiresAt) <= new Date()
                  ).length || 0} | 
                  Used: {invitationCodes?.filter((code: InvitationCode) => code.isUsed).length || 0}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full" onClick={() => setActiveTab("settings")}>
                  Manage Invitations
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
              <CardDescription>Manage testimonials and site content</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Coming soon: Content management interface for testimonials, success stories, and other site content
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Settings</CardTitle>
              <CardDescription>Manage admin users and invitations</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={currentAdminTab} onValueChange={setCurrentAdminTab} className="w-full">
                <TabsList className="grid grid-cols-2 mb-6">
                  <TabsTrigger value="admins">
                    <UserCog className="mr-2 h-4 w-4" />
                    Admin Users
                  </TabsTrigger>
                  <TabsTrigger value="invitations">
                    <Mail className="mr-2 h-4 w-4" />
                    Invitation Codes
                  </TabsTrigger>
                </TabsList>
                
                {/* Admin Users Tab */}
                <TabsContent value="admins" className="space-y-4">
                  <ScrollArea className="h-[300px]">
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
                </TabsContent>
                
                {/* Invitation Codes Tab */}
                <TabsContent value="invitations" className="space-y-4">
                  <div className="flex justify-end mb-4">
                    <Dialog open={createInvitationOpen} onOpenChange={setCreateInvitationOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Create Invitation
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Create Invitation Code</DialogTitle>
                          <DialogDescription>
                            Generate a new invitation code for admin registration
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              placeholder="admin@example.com"
                              value={newInvitation.email}
                              onChange={(e) => setNewInvitation({...newInvitation, email: e.target.value})}
                            />
                            <p className="text-sm text-muted-foreground">
                              The email address of the person you want to invite
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="code">Invitation Code</Label>
                            <div className="flex space-x-2">
                              <Input
                                id="code"
                                value={newInvitation.code}
                                onChange={(e) => setNewInvitation({...newInvitation, code: e.target.value})}
                                className="flex-1"
                              />
                              <Button variant="outline" onClick={handleRegenerateCode} type="button">
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="expiresAt">Expires At</Label>
                            <Input
                              id="expiresAt"
                              type="date"
                              value={newInvitation.expiresAt}
                              onChange={(e) => setNewInvitation({...newInvitation, expiresAt: e.target.value})}
                            />
                            <p className="text-sm text-muted-foreground">
                              The invitation code will expire after this date
                            </p>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setCreateInvitationOpen(false)}>
                            Cancel
                          </Button>
                          <Button onClick={handleCreateInvitation} disabled={createInvitationMutation.isPending}>
                            {createInvitationMutation.isPending ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Mail className="mr-2 h-4 w-4" />
                            )}
                            Create Invitation
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                  
                  <ScrollArea className="h-[300px]">
                    <Table>
                      <TableCaption>List of invitation codes</TableCaption>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Code</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Expires</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {invitationsLoading ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center">
                              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                            </TableCell>
                          </TableRow>
                        ) : invitationCodes?.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center">
                              No invitation codes found
                            </TableCell>
                          </TableRow>
                        ) : (
                          invitationCodes?.map((code: InvitationCode) => (
                            <TableRow key={code.id}>
                              <TableCell>
                                <div className="font-mono text-sm">{code.code}</div>
                              </TableCell>
                              <TableCell>{code.email}</TableCell>
                              <TableCell>
                                {code.isUsed ? (
                                  <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-800">
                                    Used
                                  </span>
                                ) : new Date(code.expiresAt) <= new Date() ? (
                                  <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">
                                    Expired
                                  </span>
                                ) : (
                                  <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                    Active
                                  </span>
                                )}
                              </TableCell>
                              <TableCell>
                                {code.createdAt ? format(new Date(code.createdAt), "MMM d, yyyy") : "N/A"}
                              </TableCell>
                              <TableCell>
                                {format(new Date(code.expiresAt), "MMM d, yyyy")}
                              </TableCell>
                              <TableCell>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  disabled={code.isUsed}
                                  onClick={() => handleCopyCode(code.code)}
                                >
                                  {code.isUsed ? (
                                    <Check className="h-4 w-4" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default AdminPage;