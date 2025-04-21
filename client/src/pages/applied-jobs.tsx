import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { Application, Job } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Briefcase,
  Building,
  Calendar,
  Clock,
  ExternalLink,
  Loader2,
  MapPin,
  Search,
  AlertTriangle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Extended type for Application with Job details
interface ApplicationWithJobDetails extends Application {
  job: Job;
  appliedDate: Date; // Using appliedDate from schema instead of createdAt
  status: string;
  notes?: string;
}

export default function AppliedJobsPage() {
  const [location, navigate] = useLocation();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  
  // Redirect if not logged in or not a job seeker
  useEffect(() => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to view your applied jobs",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    
    if (currentUser.user.userType !== "jobseeker") {
      toast({
        title: "Access denied",
        description: "This page is only available for job seekers",
        variant: "destructive",
      });
      navigate("/");
      return;
    }
  }, [currentUser, location, navigate, toast]);
  
  // Get job seeker applications
  const { data: applications, isLoading, error } = useQuery<ApplicationWithJobDetails[]>({
    queryKey: ["/api/applications/my-applications"],
    enabled: !!currentUser && currentUser.user.userType === "jobseeker",
  });
  
  // Helper function to format date
  const formatDate = (dateString: Date | null) => {
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
        <title>My Applied Jobs | Expert Recruitments LLC</title>
        <meta name="description" content="Track and manage all your job applications in one place. View application status and updates for jobs you've applied to through Expert Recruitments LLC." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">My Applied Jobs</h1>
        <p className="text-gray-600 mb-8">Track and manage all your job applications</p>
        
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
                                {getStatusBadge(application.status)}
                                <p className="text-sm text-gray-500 mt-1">
                                  Applied on {formatDate(application.appliedDate)}
                                </p>
                              </div>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="pt-6">
                            <div className="flex flex-wrap gap-y-2 gap-x-6 mb-4">
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
                              <div className="flex items-center text-gray-600">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>Deadline: {application.job.applicationDeadline && formatDate(application.job.applicationDeadline)}</span>
                              </div>
                            </div>
                            
                            <div className="mb-6">
                              <h3 className="font-medium mb-2">Application Notes:</h3>
                              <p className="text-gray-700">
                                {application.notes || "No additional notes for this application."}
                              </p>
                            </div>
                            
                            <Separator className="my-4" />
                            
                            <div className="flex justify-between items-center">
                              <Button
                                variant="outline"
                                className="text-primary border-primary hover:bg-primary/5"
                                onClick={() => navigate(`/job/${application.jobId}`)}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Job Details
                              </Button>
                              <div className="text-sm text-gray-500">
                                Reference ID: APP-{application.id}
                              </div>
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
            <h3 className="text-xl font-medium mb-2">No job applications yet</h3>
            <p className="text-gray-600 mb-6">
              You haven't applied to any jobs yet. Start exploring job opportunities today!
            </p>
            <Button onClick={() => navigate("/job-board")}>
              Browse Jobs
            </Button>
          </div>
        )}
      </div>
    </>
  );
}