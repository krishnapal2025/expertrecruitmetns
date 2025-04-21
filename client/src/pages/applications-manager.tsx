import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Building,
  Briefcase,
  Calendar,
  Clock,
  MapPin,
  User,
  FileText,
  Mail,
  Phone,
  ExternalLink,
  Search,
  DownloadCloud,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle
} from "lucide-react";
import { Helmet } from "react-helmet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Application, Job, JobSeeker } from "@shared/schema";

// Extended type for Application with Job and JobSeeker details
interface ApplicationWithDetails extends Application {
  job: Job;
  jobSeeker: JobSeeker;
  appliedDate: Date;
}

export default function ApplicationsManagerPage() {
  const [location, navigate] = useLocation();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  const [applicationToUpdate, setApplicationToUpdate] = useState<{id: number, status: string} | null>(null);
  
  // Redirect if not logged in or not an employer
  useEffect(() => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to manage applications",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    if (currentUser.user.userType !== "employer") {
      toast({
        title: "Access denied",
        description: "This page is only available for employers",
        variant: "destructive",
      });
      navigate("/");
      return;
    }
  }, [currentUser, toast, navigate]);
  
  // Get applications for employer jobs
  const { data: applications, isLoading, error } = useQuery<ApplicationWithDetails[]>({
    queryKey: ["/api/applications"],
    enabled: !!currentUser && currentUser.user.userType === "employer",
  });
  
  // Update application status mutation
  const updateApplicationStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: string }) => {
      const res = await apiRequest("PATCH", `/api/applications/${id}/status`, { status });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Status updated",
        description: "Application status has been successfully updated.",
      });
      // Invalidate applications query to refetch the data
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      setApplicationToUpdate(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating status",
        description: error.message || "Failed to update application status. Please try again.",
        variant: "destructive",
      });
      setApplicationToUpdate(null);
    }
  });
  
  // Helper function to format date
  const formatDate = (dateString: string | Date | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  
  // Generate status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">New</Badge>;
      case "viewed":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">Viewed</Badge>;
      case "shortlisted":
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">Shortlisted</Badge>;
      case "rejected":
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">New</Badge>;
    }
  };
  
  // Handle status update
  const handleStatusUpdate = (applicationId: number, status: string) => {
    setApplicationToUpdate({ id: applicationId, status });
  };
  
  // Filter applications based on active tab
  const getFilteredApplications = () => {
    if (!applications) return [];
    
    switch (activeTab) {
      case "new":
        return applications.filter(app => app.status === "new");
      case "viewed":
        return applications.filter(app => app.status === "viewed");
      case "shortlisted":
        return applications.filter(app => app.status === "shortlisted");
      case "rejected":
        return applications.filter(app => app.status === "rejected");
      case "all":
      default:
        return applications;
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Applications</h2>
          <p className="text-gray-600">{(error as Error)?.message || "An unexpected error occurred"}</p>
        </div>
      </div>
    );
  }
  
  const filteredApplications = getFilteredApplications();
  
  return (
    <>
      <Helmet>
        <title>Manage Applications | Expert Recruitments LLC</title>
        <meta name="description" content="Manage and review job applications from candidates. View resumes, update application statuses, and contact applicants." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Manage Applications</h1>
        <p className="text-gray-600 mb-8">Review and manage applications for your job postings</p>
        
        {applications && applications.length > 0 ? (
          <>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Applications</TabsTrigger>
                <TabsTrigger value="new">New</TabsTrigger>
                <TabsTrigger value="viewed">Viewed</TabsTrigger>
                <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
              
              <TabsContent value={activeTab}>
                <div className="grid grid-cols-1 gap-6">
                  {filteredApplications.length === 0 ? (
                    <div className="text-center py-16">
                      <AlertTriangle className="mx-auto h-12 w-12 text-yellow-500 mb-4" />
                      <h3 className="text-xl font-medium mb-2">No applications found</h3>
                      <p className="text-gray-600">
                        You don't have any applications with this status yet.
                      </p>
                    </div>
                  ) : (
                    filteredApplications.map((application) => (
                      <Card key={application.id} className="overflow-hidden">
                        <div className="border-l-4 border-primary">
                          <CardHeader className="bg-gray-50 pb-4">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                              <div>
                                <CardTitle className="text-xl">{application.job.title}</CardTitle>
                                <div className="flex items-center mt-2 text-gray-600">
                                  <Building className="h-4 w-4 mr-1" />
                                  <span>{application.job.company}</span>
                                </div>
                              </div>
                              <div className="mt-4 md:mt-0">
                                {getStatusBadge(application.status || 'new')}
                                <p className="text-sm text-gray-500 mt-1">
                                  Applied on {formatDate(application.appliedDate)}
                                </p>
                              </div>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                              <div>
                                <h3 className="font-medium mb-3">Job Details</h3>
                                <div className="flex flex-wrap gap-y-2 gap-x-6">
                                  <div className="flex items-center text-gray-600">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    <span>{application.job.location}</span>
                                  </div>
                                  <div className="flex items-center text-gray-600">
                                    <Briefcase className="h-4 w-4 mr-1" />
                                    <span>{application.job.jobType}</span>
                                  </div>
                                  <div className="flex items-center text-gray-600">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    <span>Posted: {application.job.postedDate && formatDate(application.job.postedDate)}</span>
                                  </div>
                                </div>
                              </div>
                              
                              <div>
                                <h3 className="font-medium mb-3">Applicant Details</h3>
                                <div className="space-y-2">
                                  <div className="flex items-center text-gray-600">
                                    <User className="h-4 w-4 mr-2" />
                                    <span>{application.jobSeeker.firstName} {application.jobSeeker.lastName}</span>
                                  </div>
                                  <div className="flex items-center text-gray-600">
                                    <Mail className="h-4 w-4 mr-2" />
                                    <span>Contact email available in messages</span>
                                  </div>
                                  <div className="flex items-center text-gray-600">
                                    <Phone className="h-4 w-4 mr-2" />
                                    <span>{application.jobSeeker.phoneNumber}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {application.coverLetter && (
                              <div className="mb-6">
                                <h3 className="font-medium mb-2">Cover Letter:</h3>
                                <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
                                  <p className="text-gray-700 whitespace-pre-line">
                                    {application.coverLetter}
                                  </p>
                                </div>
                              </div>
                            )}
                            
                            <div className="mb-6">
                              <h3 className="font-medium mb-2">Resume:</h3>
                              <div className="bg-gray-50 p-4 rounded-md border border-gray-200 flex items-center justify-between">
                                <div className="flex items-center">
                                  <FileText className="h-5 w-5 text-primary mr-2" />
                                  <span className="text-gray-700">
                                    {application.jobSeeker.firstName}_{application.jobSeeker.lastName}_Resume.pdf
                                  </span>
                                </div>
                                <Button variant="outline" size="sm">
                                  <DownloadCloud className="h-4 w-4 mr-2" />
                                  Download
                                </Button>
                              </div>
                            </div>
                            
                            <Separator className="my-4" />
                            
                            <div className="flex justify-between items-center">
                              <div className="flex gap-2">
                                <AlertDialog open={applicationToUpdate?.id === application.id && applicationToUpdate?.status === "shortlisted"}>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      className="text-green-600 border-green-200 hover:bg-green-50"
                                      onClick={() => handleStatusUpdate(application.id, "shortlisted")}
                                      disabled={application.status === "shortlisted"}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Shortlist
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Shortlist This Candidate</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to shortlist {application.jobSeeker.firstName} {application.jobSeeker.lastName} for the position of {application.job.title}?
                                        <br /><br />
                                        This will move their application to the shortlisted status.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel onClick={() => setApplicationToUpdate(null)}>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => updateApplicationStatusMutation.mutate({ id: application.id, status: "shortlisted" })}
                                        disabled={updateApplicationStatusMutation.isPending}
                                        className="bg-green-600 hover:bg-green-700"
                                      >
                                        {updateApplicationStatusMutation.isPending ? (
                                          <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Processing...
                                          </>
                                        ) : (
                                          "Confirm Shortlist"
                                        )}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                                
                                <AlertDialog open={applicationToUpdate?.id === application.id && applicationToUpdate?.status === "rejected"}>
                                  <AlertDialogTrigger asChild>
                                    <Button 
                                      variant="outline" 
                                      className="text-red-600 border-red-200 hover:bg-red-50"
                                      onClick={() => handleStatusUpdate(application.id, "rejected")}
                                      disabled={application.status === "rejected"}
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Reject
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Reject This Application</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to reject {application.jobSeeker.firstName} {application.jobSeeker.lastName}'s application for the position of {application.job.title}?
                                        <br /><br />
                                        This will move their application to the rejected status.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel onClick={() => setApplicationToUpdate(null)}>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => updateApplicationStatusMutation.mutate({ id: application.id, status: "rejected" })}
                                        disabled={updateApplicationStatusMutation.isPending}
                                        className="bg-red-600 hover:bg-red-700"
                                      >
                                        {updateApplicationStatusMutation.isPending ? (
                                          <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                            Processing...
                                          </>
                                        ) : (
                                          "Confirm Rejection"
                                        )}
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                                
                                <Button
                                  variant="outline"
                                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                  onClick={() => updateApplicationStatusMutation.mutate({ id: application.id, status: "viewed" })}
                                  disabled={application.status === "viewed" || updateApplicationStatusMutation.isPending}
                                >
                                  {updateApplicationStatusMutation.isPending && applicationToUpdate?.id === application.id ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  ) : (
                                    <>Mark as Viewed</>
                                  )}
                                </Button>
                              </div>
                              
                              <Button
                                variant="outline"
                                className="text-primary border-primary hover:bg-primary/5"
                                onClick={() => navigate(`/job/${application.jobId}`)}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Job Details
                              </Button>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
            <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2">No applications yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't received any applications for your job postings yet.
            </p>
            <Button onClick={() => navigate("/employer/jobs")}>
              View My Jobs
            </Button>
          </div>
        )}
      </div>
    </>
  );
}