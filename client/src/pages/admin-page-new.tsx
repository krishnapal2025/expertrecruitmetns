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
  Pencil,
} from "lucide-react";

interface SuspendedUser {
  id: number;
  userId: number;
  reason: string;
  since: Date;
}

export default function AdminPageNew() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [isInquiryPreviewOpen, setIsInquiryPreviewOpen] = useState(false);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyToId, setReplyToId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyEmail, setReplyEmail] = useState("");
  
  // Fetching all data
  const {
    data: users,
    isLoading: isLoadingUsers,
  } = useQuery({
    queryKey: ["/api/users"],
    queryFn: async () => {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      return res.json();
    },
  });
  
  // Mutations for actions
  const deleteUserMutation = useMutation({
    mutationFn: async (params: { id: number; userType: string }) => {
      console.log("Deleting user:", params);
      const res = await apiRequest("DELETE", `/api/users/${params.id}?type=${encodeURIComponent(params.userType)}`);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete user");
      }
      return await res.json();
    },
    onSuccess: (_, variables) => {
      toast({
        title: "User deleted",
        description: `The ${variables.userType} has been deleted successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      // Also invalidate specific user type collections
      if (variables.userType === 'employer') {
        queryClient.invalidateQueries({ queryKey: ["/api/employers"] });
      } else if (variables.userType === 'jobseeker') {
        queryClient.invalidateQueries({ queryKey: ["/api/jobseekers"] });
      } else if (variables.userType === 'admin') {
        queryClient.invalidateQueries({ queryKey: ["/api/admins"] });
      }
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
  
  // Reply mutation
  const replyMutation = useMutation({
    mutationFn: async (data: { inquiryId: number; reply: string }) => {
      const res = await apiRequest("POST", `/api/inquiries/${data.inquiryId}/reply`, { reply: data.reply });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to send reply");
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Reply sent",
        description: "Your reply has been sent successfully.",
      });
      setReplyDialogOpen(false);
      setReplyText("");
      queryClient.invalidateQueries({ queryKey: ["/api/inquiries"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to send reply",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleDeleteUser = (userId: number, userType: string) => {
    if (window.confirm(`Are you sure you want to delete this ${userType}?`)) {
      deleteUserMutation.mutate({ id: userId, userType });
    }
  };
  
  const handleReply = (inquiryId: number, email: string) => {
    setReplyToId(inquiryId);
    setReplyEmail(email);
    setReplyDialogOpen(true);
  };
  
  const submitReply = () => {
    if (replyToId && replyText) {
      replyMutation.mutate({
        inquiryId: replyToId,
        reply: replyText,
      });
    }
  };
  
  const openInquiryPreview = (inquiry: any) => {
    setSelectedInquiry(inquiry);
    setIsInquiryPreviewOpen(true);
  };
  
  const closeInquiryPreview = () => {
    setIsInquiryPreviewOpen(false);
    setSelectedInquiry(null);
  };
  
  // Filtering users by type
  const employers = users?.filter((u: User) => u.userType === "employer") || [];
  const jobSeekers = users?.filter((u: User) => u.userType === "jobseeker") || [];
  const admins = users?.filter((u: User) => u.userType === "admin" || u.userType === "super_admin") || [];
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      
      {!user ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="admins" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Admins</span>
            </TabsTrigger>
            <TabsTrigger value="employers" className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span>Employers</span>
            </TabsTrigger>
            <TabsTrigger value="jobseekers" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              <span>Job Seekers</span>
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Jobs</span>
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>Inquiries</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard" className="space-y-4 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Employers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{employers.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Job Seekers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{jobSeekers.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingUsers ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "-"
                    )}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoadingUsers ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "-"
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Recent Employers</CardTitle>
                  <CardDescription>Latest employer registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingUsers ? (
                    <div className="flex items-center justify-center h-[200px]">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Company</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {employers.slice(0, 5).map((employer) => (
                          <TableRow key={employer.id}>
                            <TableCell className="font-medium">{employer.username}</TableCell>
                            <TableCell>{employer.email}</TableCell>
                            <TableCell>{employer.company || "-"}</TableCell>
                          </TableRow>
                        ))}
                        {employers.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center">No employers found</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" onClick={() => document.querySelector('button[value="employers"]')?.click()}>
                    View All
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Recent Job Seekers</CardTitle>
                  <CardDescription>Latest job seeker registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingUsers ? (
                    <div className="flex items-center justify-center h-[200px]">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Skills</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {jobSeekers.slice(0, 5).map((seeker) => (
                          <TableRow key={seeker.id}>
                            <TableCell className="font-medium">{seeker.username}</TableCell>
                            <TableCell>{seeker.email}</TableCell>
                            <TableCell>{seeker.skills?.join(", ") || "-"}</TableCell>
                          </TableRow>
                        ))}
                        {jobSeekers.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center">No job seekers found</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" onClick={() => document.querySelector('button[value="jobseekers"]')?.click()}>
                    View All
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="admins" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Admin Accounts</CardTitle>
                <CardDescription>Manage admin access to the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminsList user={user} onDelete={handleDeleteUser} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="employers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Employers</CardTitle>
                <CardDescription>Manage employer accounts</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingUsers ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <ScrollArea className="h-[600px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Username</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Job Posts</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {employers.map((employer) => (
                          <TableRow key={employer.id}>
                            <TableCell>{employer.id}</TableCell>
                            <TableCell className="font-medium">{employer.username}</TableCell>
                            <TableCell>{employer.email}</TableCell>
                            <TableCell>{employer.company || "-"}</TableCell>
                            <TableCell>{employer.jobCount || 0}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleDeleteUser(employer.id, 'employer')}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {employers.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center">No employers found</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="jobseekers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Job Seekers</CardTitle>
                <CardDescription>Manage job seeker accounts</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingUsers ? (
                  <div className="flex items-center justify-center h-[300px]">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <ScrollArea className="h-[600px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Username</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Applications</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {jobSeekers.map((seeker) => (
                          <TableRow key={seeker.id}>
                            <TableCell>{seeker.id}</TableCell>
                            <TableCell className="font-medium">{seeker.username}</TableCell>
                            <TableCell>{seeker.email}</TableCell>
                            <TableCell>{seeker.phone || "-"}</TableCell>
                            <TableCell>{seeker.applicationCount || 0}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                  onClick={() => handleDeleteUser(seeker.id, 'jobseeker')}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Delete</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {jobSeekers.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center">No job seekers found</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="jobs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Jobs</CardTitle>
                <CardDescription>Manage job listings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[300px]">
                  <p>Jobs management coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inquiries" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Inquiries</CardTitle>
                <CardDescription>Manage contact form inquiries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[300px]">
                  <p>Inquiries management coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
      
      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Reply to Inquiry</DialogTitle>
            <DialogDescription>
              Sending a reply to: {replyEmail}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reply">Your reply</Label>
              <textarea
                id="reply"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Type your reply here..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReplyDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={submitReply} 
              disabled={!replyText || replyMutation.isPending}
            >
              {replyMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Reply
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Inquiry Preview Modal */}
      {isInquiryPreviewOpen && selectedInquiry && (
        <InquiryPreviewModal
          inquiry={selectedInquiry}
          onClose={closeInquiryPreview}
          onReply={() => {
            closeInquiryPreview();
            setTimeout(() => {
              handleReply(selectedInquiry.id, selectedInquiry.email);
            }, 300);
          }}
        />
      )}
    </div>
  );
}
