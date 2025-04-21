import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Briefcase,
  Calendar,
  User,
  Clock,
  ChevronDown,
  MapPin,
  Search,
  CheckSquare,
  XSquare,
  Eye,
  Download,
  ExternalLink,
} from "lucide-react";
import { Application } from "@shared/schema";

// Type for application with job details
type ApplicationWithJob = Application & {
  job: {
    id: number;
    title: string;
    company: string;
    location: string;
    jobType: string;
    postedDate: string;
    applicationDeadline: string;
  };
  appliedDate: string;
  notes?: string;
};

export default function ApplicationsManager() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [location, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("all");
  const [showAlertDialog, setShowAlertDialog] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationWithJob | null>(null);
  const [actionType, setActionType] = useState<"shortlist" | "reject">("shortlist");
  
  // Extract job ID from query parameter if present
  const jobIdParam = new URLSearchParams(location.split('?')[1]).get('job');
  const specificJobId = jobIdParam ? parseInt(jobIdParam) : null;

  // Fetch applications
  const { data: applications, isLoading, isError, error } = useQuery<ApplicationWithJob[]>({
    queryKey: ["/api/applications"],
    queryFn: getQueryFn({ on401: "throw" }),
    refetchInterval: 30000, // Refresh every 30 seconds
  });
  
  // Log error if present
  useEffect(() => {
    if (isError) {
      console.error("Error fetching applications:", error);
    }
  }, [isError, error]);

  // Update application status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PUT", `/api/applications/${id}/status`, { status });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      
      const actionMessage = actionType === "shortlist" 
        ? "Candidate has been shortlisted!"
        : "Candidate has been rejected.";
      
      toast({
        title: "Status Updated",
        description: actionMessage,
        variant: actionType === "shortlist" ? "default" : "destructive",
      });
      
      setShowAlertDialog(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update status: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  // Handle view application
  const handleViewApplication = (application: ApplicationWithJob) => {
    // If status is "new", mark as viewed
    if (application.status === "new") {
      updateStatusMutation.mutate({
        id: application.id,
        status: "viewed"
      });
    }
    
    // Navigate to application details
    // For now, we're just opening a dialog or expanding the card
    // In the future, this could navigate to a dedicated page
  };

  // Handle shortlist action
  const handleShortlist = (application: ApplicationWithJob) => {
    setSelectedApplication(application);
    setActionType("shortlist");
    setShowAlertDialog(true);
  };

  // Handle reject action
  const handleReject = (application: ApplicationWithJob) => {
    setSelectedApplication(application);
    setActionType("reject");
    setShowAlertDialog(true);
  };

  // Confirm action
  const confirmAction = () => {
    if (!selectedApplication) return;
    
    updateStatusMutation.mutate({
      id: selectedApplication.id,
      status: actionType === "shortlist" ? "shortlisted" : "rejected"
    });
  };

  // Filter applications based on active tab and specific job if provided
  const filteredApplications = applications?.filter((app) => {
    // First filter by job ID if specified
    if (specificJobId !== null && app.jobId !== specificJobId) {
      return false;
    }
    
    // Then filter by status tab
    if (activeTab === "all") return true;
    return app.status === activeTab;
  });

  // Format date for display
  const formatDate = (dateString: string | Date | null | undefined) => {
    if (!dateString) return "Not specified";
    try {
      const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-500">New</Badge>;
      case "viewed":
        return <Badge className="bg-purple-500">Viewed</Badge>;
      case "shortlisted":
        return <Badge className="bg-green-500">Shortlisted</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  // Redirect if not logged in or not an employer
  useEffect(() => {
    if (currentUser && currentUser.user.userType !== "employer") {
      navigate("/");
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null; // Will redirect due to ProtectedRoute
  }
  
  // Get job title if a specific job is being viewed
  const specificJob = specificJobId !== null && applications?.length 
    ? applications.find(app => app.jobId === specificJobId)?.job
    : null;
    
  // Count applications by status
  // If a specific job is selected, filter application counts by that job
  const filteredForCounts = specificJobId !== null && applications
    ? applications.filter(app => app.jobId === specificJobId)
    : applications;
    
  const newCount = filteredForCounts?.filter(app => app.status === "new").length || 0;
  const viewedCount = filteredForCounts?.filter(app => app.status === "viewed").length || 0;
  const shortlistedCount = filteredForCounts?.filter(app => app.status === "shortlisted").length || 0;
  const rejectedCount = filteredForCounts?.filter(app => app.status === "rejected").length || 0;

  return (
    <>
      <div className="container max-w-6xl py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Manage Applications</h1>
            <p className="text-gray-600">
              Review, shortlist and respond to candidate applications for your job listings.
            </p>
            {/* Debug info */}
            <div className="text-xs text-gray-500 mt-1">
              User Type: {currentUser?.user.userType} | 
              Debug: {isError ? 'API Error' : applications ? `${applications.length} applications loaded` : 'No applications data'}
            </div>
          </div>
          
          {/* Back button for job-specific view */}
          {specificJobId && (
            <Button 
              variant="ghost" 
              className="mt-4 md:mt-0" 
              onClick={() => navigate("/applications-manager")}
            >
              View All Applications
            </Button>
          )}
        </div>
        
        {/* Job title header when viewing applications for a specific job */}
        {specificJob && (
          <div className="bg-gray-50 p-4 rounded-lg border mb-6">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Applications for: {specificJob.title}</h2>
            </div>
            <p className="text-gray-600 mt-1 ml-7">
              {specificJob.company} • {specificJob.location}
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : applications?.length ? (
          <>
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="all">
                  All ({filteredApplications?.length || 0})
                </TabsTrigger>
                <TabsTrigger value="new">
                  New ({newCount})
                </TabsTrigger>
                <TabsTrigger value="viewed">
                  Viewed ({viewedCount})
                </TabsTrigger>
                <TabsTrigger value="shortlisted">
                  Shortlisted ({shortlistedCount})
                </TabsTrigger>
                <TabsTrigger value="rejected">
                  Rejected ({rejectedCount})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab} className="mt-0">
                <div className="grid grid-cols-1 gap-6">
                  {filteredApplications?.map((application) => (
                    <Card key={application.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/4 bg-gray-50 p-6 border-b md:border-b-0 md:border-r border-gray-200">
                          <div className="flex items-center mb-4">
                            <User className="h-10 w-10 text-primary bg-primary/10 p-2 rounded-full mr-3" />
                            <div>
                              <h3 className="font-semibold">Candidate {application.jobSeekerId}</h3>
                              <p className="text-sm text-gray-600">Applied {formatDate(application.appliedDate)}</p>
                            </div>
                          </div>
                          <div className="mb-4">
                            {getStatusBadge(application.status)}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mb-2 flex items-center justify-center"
                            onClick={() => handleViewApplication(application)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          <div className="flex gap-2 mt-3">
                            {(application.status === "new" || application.status === "viewed") && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                                  onClick={() => handleShortlist(application)}
                                >
                                  <CheckSquare className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                                  onClick={() => handleReject(application)}
                                >
                                  <XSquare className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            {application.status === "shortlisted" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 border-red-200"
                                onClick={() => handleReject(application)}
                              >
                                <XSquare className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                            )}
                            {application.status === "rejected" && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 bg-green-50 hover:bg-green-100 text-green-700 border-green-200"
                                onClick={() => handleShortlist(application)}
                              >
                                <CheckSquare className="h-4 w-4 mr-2" />
                                Shortlist
                              </Button>
                            )}
                          </div>
                        </div>
                        <CardContent className="md:w-3/4 p-6">
                          <div className="mb-4">
                            <h2 className="text-xl font-semibold mb-1">
                              {application.job.title}
                            </h2>
                            <p className="text-gray-600 mb-3">
                              {application.job.company}
                            </p>
                            <div className="flex flex-wrap gap-4 mb-4">
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
                                <span>Posted: {formatDate(application.job.postedDate)}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>Deadline: {formatDate(application.job.applicationDeadline)}</span>
                              </div>
                            </div>
                            
                            <div className="mb-6">
                              <h3 className="font-medium mb-2">Cover Letter:</h3>
                              <p className="text-gray-700 border p-3 bg-gray-50 rounded-md">
                                {application.coverLetter || "No cover letter provided."}
                              </p>
                            </div>
                            
                            <Separator className="my-4" />
                            
                            <div className="flex justify-between items-center">
                              <Button
                                variant="outline"
                                className="text-primary border-primary hover:bg-primary/5"
                                onClick={() => navigate(`/jobs/${application.jobId}`)}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Job Details
                              </Button>
                              <div className="text-sm text-gray-500">
                                Application ID: APP-{application.id}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-200">
            <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-xl font-medium mb-2">
              {specificJob 
                ? `No applications for ${specificJob.title}` 
                : "No applications yet"
              }
            </h3>
            <p className="text-gray-600 mb-6">
              {specificJob
                ? `You don't have any applications for this job listing yet.`
                : `You don't have any applications for your job listings yet.`
              }
            </p>
            {specificJob ? (
              <div className="space-x-4">
                <Button 
                  variant="outline" 
                  onClick={() => navigate(`/jobs/${specificJobId}`)}
                >
                  View Job Details
                </Button>
                <Button onClick={() => navigate("/applications-manager")}>
                  View All Applications
                </Button>
              </div>
            ) : (
              <Button onClick={() => navigate("/post-job")}>
                Post a New Job
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showAlertDialog} onOpenChange={setShowAlertDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "shortlist" ? "Shortlist This Candidate?" : "Reject This Candidate?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionType === "shortlist" 
                ? "The candidate will be notified that they have been shortlisted for this position."
                : "The candidate will be notified that they were not selected for this position."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAction}
              className={actionType === "shortlist" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
            >
              {actionType === "shortlist" ? "Shortlist" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}