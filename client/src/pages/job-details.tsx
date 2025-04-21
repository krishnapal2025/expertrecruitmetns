import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";
import { Link, useLocation } from "wouter";
import { navigateAndScrollTop } from "@/lib/navigation";
import { Job, Employer, Application } from "@shared/schema";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Briefcase, MapPin, Calendar, Building, Clock, User, Share2, BookmarkPlus, Loader2, CheckCircle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type JobDetailsResponse = {
  job: Job;
  employer: Employer;
};

export default function JobDetailsPage({ id }: { id: string }) {
  const [location, navigate] = useLocation();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  // Check if coming from applications-manager by examining the referrer
  const isFromApplicationsManager = document.referrer.includes("applications-manager") || 
                                    sessionStorage.getItem("fromApplicationsManager") === "true";
                                    
  // Store the fact that we're coming from applications-manager in sessionStorage
  if (document.referrer.includes("applications-manager")) {
    sessionStorage.setItem("fromApplicationsManager", "true");
  }
  
  // Clear fromApplicationsManager from sessionStorage when this component unmounts
  useEffect(() => {
    return () => {
      sessionStorage.removeItem("fromApplicationsManager");
    };
  }, []);
  
  // Get job details
  const { data, isLoading, error } = useQuery<JobDetailsResponse>({
    queryKey: [`/api/jobs/${id}`],
    enabled: !!id,
  });
  
  // Check if user has already applied for this job
  const { data: applications, isLoading: isLoadingApplications } = useQuery<Application[]>({
    queryKey: ["/api/applications/my-applications"],
    enabled: !!currentUser && currentUser.user.userType === "jobseeker",
  });
  
  // Determine if the user has already applied for this job
  const hasApplied = applications?.some(app => app.jobId === parseInt(id)) || false;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Job Details</h2>
          <p className="text-gray-600">{(error as Error)?.message || "Job not found"}</p>
          <Button className="mt-4" onClick={() => navigateAndScrollTop(navigate, "/job-board")}>
            Back to Job Board
          </Button>
        </div>
      </div>
    );
  }

  const { job, employer } = data;
  
  const handleApplyClick = () => {
    if (!currentUser) {
      // Save current URL for redirect after login
      navigateAndScrollTop(navigate, `/auth?type=jobseeker&redirect=${encodeURIComponent(`/apply/${id}`)}`);
      return;
    }
    
    if (currentUser.user.userType !== "jobseeker") {
      toast({
        title: "Unauthorized",
        description: "Only job seekers can apply for jobs. Please log in with a job seeker account.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if the user has already applied for this job
    if (hasApplied) {
      toast({
        title: "Already Applied",
        description: "You have already applied for this job. You can check your application status in 'Applied Jobs'.",
        variant: "default",
      });
      return;
    }
    
    // Navigate to the dedicated application page
    navigateAndScrollTop(navigate, `/apply/${id}`);
  };

  // Format date for display
  const formatDate = (dateString: Date | null) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <>
      <Helmet>
        <title>{`${job.title} | RH Job Portal`}</title>
        <meta name="description" content={`Apply for ${job.title} at ${employer.companyName}. ${job.description.substring(0, 150)}...`} />
      </Helmet>

      <div className="bg-primary text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
              <div className="flex flex-wrap gap-4 text-white/90">
                <div className="flex items-center">
                  <Building className="h-4 w-4 mr-1" />
                  <span>{employer.companyName}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>Posted: {formatDate(job.postedDate)}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
              {isFromApplicationsManager ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-white/20"
                  onClick={() => {
                    // Clear the fromApplicationsManager flag and go back
                    sessionStorage.removeItem("fromApplicationsManager");
                    window.history.back();
                    // Scroll to top when returning
                    window.scrollTo(0, 0);
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Applications
                </Button>
              ) : (
                <>
                  {hasApplied ? (
                    <Button variant="outline" size="sm" className="bg-green-800/20" disabled>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Applied
                    </Button>
                  ) : (
                    <Button variant="secondary" size="sm" onClick={handleApplyClick}>
                      Apply Now
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="bg-white/10">
                    <BookmarkPlus className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button variant="outline" size="sm" className="bg-white/10">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary font-normal">
                    {job.category}
                  </Badge>
                  <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary font-normal">
                    {job.jobType}
                  </Badge>
                  {job.salary && (
                    <Badge variant="outline" className="border-primary/20 bg-primary/5 text-primary font-normal">
                      {job.salary}
                    </Badge>
                  )}
                </div>
                
                <div className="prose max-w-none">
                  <p className="whitespace-pre-line">{job.description}</p>
                  
                  {/* Additional job details sections for a comprehensive view */}
                  <h3>Responsibilities</h3>
                  <ul>
                    <li>Develop and implement recruitment strategies to attract top talent</li>
                    <li>Manage the full recruitment cycle from job posting to onboarding</li>
                    <li>Build relationships with candidates and assess their suitability for positions</li>
                    <li>Collaborate with hiring managers to understand their needs and provide guidance</li>
                    <li>Stay updated on industry trends and best practices in recruitment</li>
                  </ul>
                  
                  <h3>Requirements</h3>
                  <ul>
                    <li>Bachelor's degree or equivalent experience in a related field</li>
                    <li>Proven experience in recruitment or HR</li>
                    <li>Excellent communication and interpersonal skills</li>
                    <li>Strong organizational and time management abilities</li>
                    <li>Proficiency with ATS systems and recruitment tools</li>
                  </ul>
                  
                  <h3>Benefits</h3>
                  <ul>
                    <li>Competitive salary and performance bonuses</li>
                    <li>Comprehensive health, dental, and vision insurance</li>
                    <li>Professional development opportunities</li>
                    <li>Flexible work arrangements</li>
                    <li>Collaborative and supportive team environment</li>
                  </ul>
                </div>
              </CardContent>
              {!isFromApplicationsManager && (
                <CardFooter className="flex justify-center border-t pt-6">
                  {hasApplied ? (
                    <Button disabled variant="outline" size="lg" className="bg-green-50">
                      <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                      Already Applied
                    </Button>
                  ) : (
                    <Button size="lg" onClick={handleApplyClick}>
                      Apply for this Position
                    </Button>
                  )}
                </CardFooter>
              )}
            </Card>
            
            {/* Similar Jobs - only show when not from applications manager */}
            {!isFromApplicationsManager && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Similar Jobs</h2>
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <Link href={`/job/${job.id + i}`}>
                          <div className="block cursor-pointer">
                            <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors">
                              {job.title} - {i === 1 ? 'Senior' : i === 2 ? 'Junior' : 'Associate'} Level
                            </h3>
                            <div className="flex flex-wrap gap-4 text-gray-600 mb-2">
                              <div className="flex items-center">
                                <Building className="h-4 w-4 mr-1" />
                                <span>{employer.companyName}</span>
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{job.location}</span>
                              </div>
                              <div className="flex items-center">
                                <Briefcase className="h-4 w-4 mr-1" />
                                <span>{job.jobType}</span>
                              </div>
                            </div>
                            <p className="text-gray-700 line-clamp-2">{job.description.substring(0, 120)}...</p>
                          </div>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="md:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Job Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <Briefcase className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                  <div>
                    <div className="font-medium">Job Type</div>
                    <div className="text-gray-600">{job.jobType}</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                  <div>
                    <div className="font-medium">Location</div>
                    <div className="text-gray-600">{job.location}</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                  <div>
                    <div className="font-medium">Posted Date</div>
                    <div className="text-gray-600">{formatDate(job.postedDate)}</div>
                  </div>
                </div>
                {job.salary && (
                  <div className="flex items-start">
                    <svg className="h-5 w-5 text-gray-400 mr-3 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <div className="font-medium">Salary</div>
                      <div className="text-gray-600">{job.salary}</div>
                    </div>
                  </div>
                )}
                <div className="flex items-start">
                  <User className="h-5 w-5 text-gray-400 mr-3 mt-1" />
                  <div>
                    <div className="font-medium">Category</div>
                    <div className="text-gray-600">{job.category}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>About the Company</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                    <Building className="h-6 w-6 text-gray-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{employer.companyName}</h3>
                    <p className="text-gray-600 text-sm">{employer.industry}</p>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-3">
                  <div className="flex items-start">
                    <div className="font-medium w-24">Industry:</div>
                    <div className="text-gray-600">{employer.industry}</div>
                  </div>
                  <div className="flex items-start">
                    <div className="font-medium w-24">Type:</div>
                    <div className="text-gray-600">{employer.companyType}</div>
                  </div>
                  <div className="flex items-start">
                    <div className="font-medium w-24">Website:</div>
                    <a href={employer.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      {employer.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                  <div className="flex items-start">
                    <div className="font-medium w-24">Location:</div>
                    <div className="text-gray-600">{employer.country}</div>
                  </div>
                </div>
                
                {!isFromApplicationsManager && (
                  <Button variant="outline" className="w-full mt-6">
                    View Company Profile
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
