import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useLocation, useParams } from "wouter";
import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";
import { Job, Employer } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Clock, Briefcase, Calendar, CheckCircle, Loader2, Upload, User, ChevronLeft, Info, DollarSign } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type JobDetailsResponse = {
  job: Job;
  employer: Employer;
};

// Form validation schema with additional fields
const ApplicationFormSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  coverLetter: z.string().min(50, "Cover letter must be at least 50 characters"),
  currentPosition: z.string().min(2, "Current position must be at least 2 characters"),
  yearsOfExperience: z.string().min(1, "Please select years of experience"),
  availableStartDate: z.string().min(1, "Start date is required"),
  salaryExpectation: z.string().optional(),
  heardAbout: z.string().optional(),
  cvFile: z.any().optional(),
  additionalDocuments: z.any().optional(),
  linkedinProfile: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  portfolioUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  relocation: z.enum(["yes", "no", "flexible"]),
  referenceContacts: z.string().optional(),
});

type ApplicationFormValues = z.infer<typeof ApplicationFormSchema>;

// Helper function to provide description for different currencies
const getCurrencyDescription = (currency: string): string => {
  switch (currency) {
    case "AED":
      return "United Arab Emirates Dirham - Primary currency in the UAE";
    case "USD":
      return "United States Dollar - Global reserve currency";
    case "EUR":
      return "Euro - Official currency of most European Union countries";
    case "GBP":
      return "British Pound Sterling - Official currency of the United Kingdom";
    case "SAR":
      return "Saudi Riyal - Official currency of Saudi Arabia";
    case "QAR":
      return "Qatari Riyal - Official currency of Qatar";
    case "BHD":
      return "Bahraini Dinar - Official currency of Bahrain";
    case "KWD":
      return "Kuwaiti Dinar - Official currency of Kuwait";
    case "OMR":
      return "Omani Rial - Official currency of Oman";
    case "INR":
      return "Indian Rupee - Official currency of India";
    default:
      return "Please specify your preferred salary currency";
  }
};

export default function JobApplicationPage() {
  const params = useParams<{ id: string }>();
  const jobId = parseInt(params.id);
  const [location, navigate] = useLocation();
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  const [cvFileName, setCvFileName] = useState("");
  const [additionalFileName, setAdditionalFileName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applicationComplete, setApplicationComplete] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("AED");
  
  // Fetch job details
  const { data, isLoading, error } = useQuery<JobDetailsResponse>({
    queryKey: [`/api/jobs/${jobId}`],
    enabled: !isNaN(jobId),
  });
  
  // Initialize form
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(ApplicationFormSchema),
    defaultValues: {
      fullName: currentUser && currentUser.user.userType === "jobseeker" ? 
        `${(currentUser.profile as any).firstName} ${(currentUser.profile as any).lastName}` : "",
      email: currentUser ? currentUser.user.email : "",
      phone: currentUser ? currentUser.profile.phoneNumber || "" : "",
      coverLetter: "",
      currentPosition: "",
      yearsOfExperience: "",
      availableStartDate: "",
      salaryExpectation: "",
      heardAbout: "",
      linkedinProfile: "",
      portfolioUrl: "",
      relocation: "flexible",
      referenceContacts: "",
    }
  });
  
  // Check if user is logged in and is a job seeker
  useEffect(() => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in as a job seeker to apply for this position",
        variant: "destructive",
      });
      navigate(`/auth?redirect=${encodeURIComponent(location)}`);
      return;
    }
    
    if (currentUser.user.userType !== "jobseeker") {
      toast({
        title: "Unauthorized",
        description: "Only job seekers can apply for jobs",
        variant: "destructive",
      });
      navigate("/job-board");
      return;
    }
  }, [currentUser, location, navigate, toast]);
  
  // Handle CV file upload
  const handleCvFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      setCvFileName(file.name);
    }
  };
  
  // Handle additional documents upload
  const handleAdditionalFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB",
          variant: "destructive",
        });
        return;
      }
      setAdditionalFileName(file.name);
    }
  };
  
  // Job application mutation
  const applicationMutation = useMutation({
    mutationFn: async (data: ApplicationFormValues) => {
      // In a real implementation, file uploads would be handled here
      const res = await apiRequest("POST", `/api/jobs/${jobId}/apply`, {
        coverLetter: data.coverLetter,
        additionalData: {
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          currentPosition: data.currentPosition,
          yearsOfExperience: data.yearsOfExperience,
          availableStartDate: data.availableStartDate,
          salaryExpectation: `${data.salaryExpectation} ${selectedCurrency}`,
          heardAbout: data.heardAbout,
          linkedinProfile: data.linkedinProfile,
          portfolioUrl: data.portfolioUrl,
          relocation: data.relocation,
          referenceContacts: data.referenceContacts,
          hasCvFile: !!cvFileName,
          hasAdditionalDocuments: !!additionalFileName,
        }
      });
      return res.json();
    },
    onSuccess: () => {
      setApplicationComplete(true);
      setActiveTab("confirmation");
      
      // Invalidate queries to refresh job applications data
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Application failed",
        description: error.message || "An error occurred while submitting your application.",
        variant: "destructive",
      });
    },
  });
  
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
  
  // Handle form submission
  const onSubmit = (formData: ApplicationFormValues) => {
    // Simulate file upload if files were selected
    if (cvFileName || additionalFileName) {
      setIsSubmitting(true);
      // Simulate upload delay
      setTimeout(() => {
        setIsSubmitting(false);
        applicationMutation.mutate(formData);
      }, 1500);
    } else {
      applicationMutation.mutate(formData);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Job Details</h2>
          <p className="text-gray-600">{(error as Error)?.message || "Job not found"}</p>
          <Button className="mt-4" onClick={() => navigate("/job-board")}>
            Back to Job Board
          </Button>
        </div>
      </div>
    );
  }
  
  const { job, employer } = data;
  
  return (
    <>
      <Helmet>
        <title>Apply for {job.title} | Expert Recruitments LLC</title>
        <meta name="description" content={`Apply for ${job.title} at ${employer.companyName}. Fill out our application form to be considered for this position.`} />
      </Helmet>
      
      <div className="bg-primary/10 py-8">
        <div className="container mx-auto px-4">
          <Button variant="ghost" className="mb-4 text-primary" onClick={() => navigate(`/job/${jobId}`)}>
            <ChevronLeft className="h-4 w-4 mr-1" /> Back to Job Details
          </Button>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Job details summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader className="bg-primary text-white rounded-t-lg">
                  <CardTitle className="text-xl">Position Summary</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold mb-2">{job.title}</h3>
                  <div className="flex items-center mb-3">
                    <Building className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-gray-700">{employer.companyName}</span>
                  </div>
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-gray-700">{job.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-gray-700">{job.jobType}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-gray-700">{job.experience}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-gray-700">Posted: {formatDate(job.postedDate)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-gray-700">Deadline: {formatDate(job.applicationDeadline)}</span>
                    </div>
                  </div>
                  
                  <Separator className="my-4" />
                  
                  <div className="flex items-start">
                    <Info className="h-4 w-4 text-primary mr-2 mt-1" />
                    <p className="text-sm text-gray-600">
                      Your application will be sent directly to the hiring manager at {employer.companyName}.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Application form */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle>Application for {job.title}</CardTitle>
                  <CardDescription>
                    Please complete all required fields to submit your application
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pt-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-3 mb-6">
                      <TabsTrigger value="details">Personal Details</TabsTrigger>
                      <TabsTrigger value="experience">Experience & Skills</TabsTrigger>
                      <TabsTrigger value="confirmation" disabled={!applicationComplete}>Confirmation</TabsTrigger>
                    </TabsList>
                    
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)}>
                        <TabsContent value="details" className="mt-0">
                          <div className="space-y-6">
                            <FormField
                              control={form.control}
                              name="fullName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Full Name *</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Enter your full name" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email Address *</FormLabel>
                                    <FormControl>
                                      <Input type="email" placeholder="your.email@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Phone Number *</FormLabel>
                                    <FormControl>
                                      <Input placeholder="+971 XX XXX XXXX" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <FormLabel htmlFor="cv">Resume/CV *</FormLabel>
                              <div className="flex items-center justify-center w-full">
                                <label
                                  htmlFor="cv"
                                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                >
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                    <p className="mb-2 text-sm text-gray-500">
                                      <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">PDF, DOCX (MAX. 5MB)</p>
                                    {cvFileName && (
                                      <p className="mt-2 text-sm text-primary font-medium">{cvFileName}</p>
                                    )}
                                  </div>
                                  <Input
                                    id="cv"
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleCvFileChange}
                                  />
                                </label>
                              </div>
                            </div>
                            
                            <FormField
                              control={form.control}
                              name="heardAbout"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>How did you hear about this position?</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select an option" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="website">Company Website</SelectItem>
                                      <SelectItem value="job-board">Job Board</SelectItem>
                                      <SelectItem value="linkedin">LinkedIn</SelectItem>
                                      <SelectItem value="referral">Employee Referral</SelectItem>
                                      <SelectItem value="recruitment-agency">Recruitment Agency</SelectItem>
                                      <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="flex justify-end">
                              <Button 
                                type="button" 
                                onClick={() => setActiveTab("experience")}
                                className="bg-primary hover:bg-primary/90"
                              >
                                Next: Experience & Skills
                              </Button>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="experience" className="mt-0">
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField
                                control={form.control}
                                name="currentPosition"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Current Position *</FormLabel>
                                    <FormControl>
                                      <Input placeholder="e.g. Senior Developer" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="yearsOfExperience"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Years of Experience *</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select experience" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="0-1">Less than 1 year</SelectItem>
                                        <SelectItem value="1-3">1-3 years</SelectItem>
                                        <SelectItem value="3-5">3-5 years</SelectItem>
                                        <SelectItem value="5-10">5-10 years</SelectItem>
                                        <SelectItem value="10+">10+ years</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField
                                control={form.control}
                                name="availableStartDate"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Available Start Date *</FormLabel>
                                    <FormControl>
                                      <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="salaryExpectation"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Salary Expectation</FormLabel>
                                    <div className="grid grid-cols-4 gap-2">
                                      <div className="col-span-1">
                                        <Select 
                                          value={selectedCurrency} 
                                          onValueChange={setSelectedCurrency}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Currency" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="AED">AED</SelectItem>
                                            <SelectItem value="USD">USD</SelectItem>
                                            <SelectItem value="EUR">EUR</SelectItem>
                                            <SelectItem value="GBP">GBP</SelectItem>
                                            <SelectItem value="SAR">SAR</SelectItem>
                                            <SelectItem value="QAR">QAR</SelectItem>
                                            <SelectItem value="BHD">BHD</SelectItem>
                                            <SelectItem value="KWD">KWD</SelectItem>
                                            <SelectItem value="OMR">OMR</SelectItem>
                                            <SelectItem value="INR">INR</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="col-span-3">
                                        <FormControl>
                                          <Input 
                                            placeholder={`e.g. 15,000 - 20,000 ${selectedCurrency}/month`} 
                                            {...field} 
                                            onChange={(e) => {
                                              // Remove any existing currency codes
                                              const value = e.target.value.replace(/AED|USD|EUR|GBP|SAR|QAR|BHD|KWD|OMR|INR/g, '').trim();
                                              field.onChange(value);
                                            }}
                                          />
                                        </FormControl>
                                      </div>
                                    </div>
                                    <FormDescription className="text-xs text-gray-500 mt-1">
                                      {getCurrencyDescription(selectedCurrency)}
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <FormField
                                control={form.control}
                                name="linkedinProfile"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>LinkedIn Profile URL</FormLabel>
                                    <FormControl>
                                      <Input placeholder="https://linkedin.com/in/yourprofile" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name="portfolioUrl"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Portfolio/Website URL</FormLabel>
                                    <FormControl>
                                      <Input placeholder="https://yourportfolio.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={form.control}
                              name="relocation"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Willing to relocate? *</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select an option" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectItem value="yes">Yes, I can relocate</SelectItem>
                                      <SelectItem value="no">No, I cannot relocate</SelectItem>
                                      <SelectItem value="flexible">Flexible, depending on the offer</SelectItem>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="space-y-2">
                              <FormLabel htmlFor="additionalDocuments">Additional Documents</FormLabel>
                              <div className="flex items-center justify-center w-full">
                                <label
                                  htmlFor="additionalDocuments"
                                  className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                                >
                                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-6 h-6 mb-2 text-gray-400" />
                                    <p className="text-sm text-gray-500">Upload additional documents (optional)</p>
                                    {additionalFileName && (
                                      <p className="mt-1 text-sm text-primary font-medium">{additionalFileName}</p>
                                    )}
                                  </div>
                                  <Input
                                    id="additionalDocuments"
                                    type="file"
                                    className="hidden"
                                    accept=".pdf,.doc,.docx,.jpg,.png"
                                    onChange={handleAdditionalFileChange}
                                  />
                                </label>
                              </div>
                            </div>
                            
                            <FormField
                              control={form.control}
                              name="referenceContacts"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>References (optional)</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Please provide contact details for professional references"
                                      className="min-h-[80px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Include name, company, position, and contact information
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name="coverLetter"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Cover Letter *</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Tell the employer why you're a good fit for this position..."
                                      className="min-h-[200px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Minimum 50 characters. Explain why you're interested in this position and how your skills match the requirements.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="flex justify-between">
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setActiveTab("details")}
                              >
                                Back
                              </Button>
                              <Button 
                                type="submit"
                                className="bg-primary hover:bg-primary/90"
                                disabled={isSubmitting || applicationMutation.isPending}
                              >
                                {(isSubmitting || applicationMutation.isPending) && (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {isSubmitting ? "Uploading Files..." : applicationMutation.isPending ? "Submitting..." : "Submit Application"}
                              </Button>
                            </div>
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="confirmation" className="mt-0">
                          <div className="text-center py-12">
                            <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-green-100 flex items-center justify-center">
                              <CheckCircle className="h-8 w-8 text-green-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h3>
                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                              Your application for <span className="font-semibold">{job.title}</span> at <span className="font-semibold">{employer.companyName}</span> has been successfully submitted.
                            </p>
                            
                            <Card className="max-w-md mx-auto bg-gray-50 border mb-6">
                              <CardContent className="pt-6">
                                <h4 className="font-semibold text-gray-700 mb-2">What happens next?</h4>
                                <ol className="text-left space-y-2 text-sm text-gray-600">
                                  <li className="flex items-start">
                                    <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">1</span>
                                    <span>Your application will be reviewed by the hiring team</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">2</span>
                                    <span>If your profile matches their requirements, you'll be contacted for an interview</span>
                                  </li>
                                  <li className="flex items-start">
                                    <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">3</span>
                                    <span>You can track the status of your application in your profile</span>
                                  </li>
                                </ol>
                              </CardContent>
                            </Card>
                            
                            <div className="flex justify-center space-x-4">
                              <Button variant="outline" onClick={() => navigate("/profile-page")}>
                                View My Applications
                              </Button>
                              <Button onClick={() => navigate("/job-board")}>
                                Browse More Jobs
                              </Button>
                            </div>
                          </div>
                        </TabsContent>
                      </form>
                    </Form>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}