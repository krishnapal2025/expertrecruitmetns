import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Briefcase, Building, Globe, Phone, MapPin, AtSign, User as UserIcon, Check, Eye, Calendar, CheckSquare, XSquare, Download, ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { getQueryFn, apiRequest, queryClient } from "@/lib/queryClient";
import { Application } from "@shared/schema";

// Countries and industries arrays are reused from auth-page
const countries = [
  "United States", "United Kingdom", "Canada", "Australia", 
  "Germany", "France", "Japan", "China", "India", "Brazil"
];

const industries = [
  "Technology", "Healthcare", "Finance", "Education",
  "Manufacturing", "Retail", "Construction", "Transportation",
  "Hospitality", "Media", "Professional Services"
];

// Skills list for selection
const skillsList = [
  // Technical/Programming
  "JavaScript", "TypeScript", "Python", "Java", "C#", "C++", "Ruby", "PHP", "Go", "Swift",
  "React", "Angular", "Vue.js", "Node.js", "Express.js", "Django", "Flask", "Spring Boot",
  "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Jenkins", "Git", "GitHub",
  "SQL", "MongoDB", "PostgreSQL", "MySQL", "Redis", "Elasticsearch",
  "HTML", "CSS", "SASS", "LESS", "Tailwind CSS", "Bootstrap", "Material UI",
  "REST API", "GraphQL", "WebSockets", "OAuth", "JWT",
  "Machine Learning", "AI", "Data Science", "Big Data", "Apache Spark", "TensorFlow", "PyTorch",
  
  // Business/Professional
  "Project Management", "Agile", "Scrum", "Kanban", "Lean", "Six Sigma",
  "Leadership", "Team Management", "Strategic Planning", "Business Analysis",
  "Marketing", "SEO", "SEM", "Social Media Marketing", "Content Marketing", "Email Marketing",
  "Sales", "CRM", "Customer Service", "Account Management", "Negotiation",
  "Financial Analysis", "Budgeting", "Forecasting", "Risk Management", "Investment Analysis",
  "Human Resources", "Talent Acquisition", "Performance Management", "Employee Relations",
  "Legal", "Contract Management", "Compliance", "Corporate Law", "Intellectual Property",
  
  // Creative
  "Graphic Design", "UI/UX Design", "Figma", "Adobe Photoshop", "Adobe Illustrator",
  "Video Editing", "Motion Graphics", "3D Modeling", "Animation", "Photography",
  "Content Writing", "Copywriting", "Technical Writing", "Editing", "Proofreading",
  
  // Languages
  "English", "Spanish", "French", "German", "Chinese", "Japanese", "Arabic", "Russian", "Portuguese"
];

// Job seeker profile form schema
const jobSeekerProfileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phoneNumber: z.string().optional(),
  country: z.string().min(1, "Please select a country"),
  headline: z.string().optional(),
  bio: z.string().optional(),
  skills: z.string().optional(),
  experience: z.string().optional(),
  education: z.string().optional(),
});

// Employer profile form schema
const employerProfileSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  industry: z.string().min(1, "Please select an industry"),
  companyType: z.string().optional(),
  phoneNumber: z.string().optional(),
  country: z.string().min(1, "Please select a country"),
  website: z.string().optional(),
  description: z.string().optional(),
  employeeCount: z.string().optional(),
  foundedYear: z.string().optional(),
});

type JobSeekerProfileFormValues = z.infer<typeof jobSeekerProfileSchema>;
type EmployerProfileFormValues = z.infer<typeof employerProfileSchema>;

// Type for application with job details for display
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
  jobSeeker: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  appliedDate: string;
};

// Helper function to render status badge with appropriate color
function getStatusBadge(status: string | null | undefined) {
  if (!status) return <Badge>New</Badge>;
  
  switch (status.toLowerCase()) {
    case 'new':
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">New</Badge>;
    case 'viewed':
      return <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50">Viewed</Badge>;
    case 'shortlisted':
      return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Shortlisted</Badge>;
    case 'rejected':
      return <Badge variant="outline" className="bg-red-50 text-red-700 hover:bg-red-50">Rejected</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
}

// Component to display applications list for employer
function ApplicationsList() {
  const { currentUser } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("all");
  
  // Fetch applications for the employer
  const { data: applications, isLoading } = useQuery<ApplicationWithJob[]>({
    queryKey: ["/api/applications/employer"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!currentUser && currentUser.user.userType === "employer"
  });
  
  // Handle status update
  const updateApplicationStatus = async (applicationId: number, status: string) => {
    try {
      await apiRequest("PATCH", `/api/applications/${applicationId}`, { status });
      
      toast({
        title: "Status updated",
        description: `Application marked as ${status.toLowerCase()}`,
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/applications/employer"] });
    } catch (error) {
      toast({
        title: "Error updating status",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };
  
  // Filter applications based on selected tab
  const filteredApplications = applications?.filter(app => {
    if (activeTab === "all") return true;
    
    // Handle null status
    if (!app.status) {
      return activeTab === "new";
    }
    
    return app.status.toLowerCase() === activeTab.toLowerCase();
  });
  
  // Count applications by status
  const counts = {
    all: applications?.length || 0,
    new: applications?.filter(app => !app.status || app.status.toLowerCase() === "new").length || 0,
    viewed: applications?.filter(app => app.status?.toLowerCase() === "viewed").length || 0,
    shortlisted: applications?.filter(app => app.status?.toLowerCase() === "shortlisted").length || 0,
    rejected: applications?.filter(app => app.status?.toLowerCase() === "rejected").length || 0,
  };
  
  if (!currentUser || currentUser.user.userType !== "employer") {
    return null;
  }
  
  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Job Applications</CardTitle>
        <CardDescription>
          Review and manage applications to your job listings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">
              All ({counts.all})
            </TabsTrigger>
            <TabsTrigger value="new">
              New ({counts.new})
            </TabsTrigger>
            <TabsTrigger value="viewed">
              Viewed ({counts.viewed})
            </TabsTrigger>
            <TabsTrigger value="shortlisted">
              Shortlisted ({counts.shortlisted})
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected ({counts.rejected})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-6">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredApplications && filteredApplications.length > 0 ? (
              <div className="space-y-4">
                {filteredApplications.map((application) => (
                  <div key={application.id} className="rounded-lg border p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{application.job.title}</h3>
                        <div className="flex items-center text-muted-foreground text-sm mt-1">
                          <Calendar className="h-4 w-4 mr-1" />
                          Applied {new Date(application.appliedDate).toLocaleDateString()}
                        </div>
                      </div>
                      {getStatusBadge(application.status)}
                    </div>
                    
                    <div className="bg-muted/50 rounded-md p-4 mb-4">
                      <div className="flex items-center mb-2">
                        <UserIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="font-medium">
                          {application.jobSeeker.firstName} {application.jobSeeker.lastName}
                        </span>
                      </div>
                      {application.coverLetter && (
                        <p className="text-sm text-muted-foreground line-clamp-3 mt-2">
                          {application.coverLetter}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {(!application.status || application.status.toLowerCase() === "new") && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex items-center"
                          onClick={() => updateApplicationStatus(application.id, "viewed")}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Mark as Viewed
                        </Button>
                      )}
                      
                      {application.status?.toLowerCase() !== "shortlisted" && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex items-center text-green-600 hover:text-green-700"
                          onClick={() => updateApplicationStatus(application.id, "shortlisted")}
                        >
                          <CheckSquare className="h-4 w-4 mr-1" />
                          Shortlist
                        </Button>
                      )}
                      
                      {application.status?.toLowerCase() !== "rejected" && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="flex items-center text-red-600 hover:text-red-700"
                          onClick={() => updateApplicationStatus(application.id, "rejected")}
                        >
                          <XSquare className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      )}
                      
                      <Button 
                        size="sm" 
                        variant="ghost"
                        onClick={() => window.open(`/job-applications/${application.id}`, '_blank')}
                        className="flex items-center ml-auto"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View Full Application
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border rounded-lg">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Briefcase className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No applications found</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-6">
                  {activeTab === "all" 
                    ? "You haven't received any job applications yet. Post a job to start getting applications."
                    : `You don't have any ${activeTab.toLowerCase()} applications at the moment.`}
                </p>
                {activeTab === "all" && (
                  <Button asChild>
                    <Link href="/post-job">Post a New Job</Link>
                  </Button>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-6">
        <Button variant="outline" asChild>
          <Link href="/my-jobs">Manage My Jobs</Link>
        </Button>
        <Button asChild>
          <Link href="/applications-manager">Applications Manager</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function ProfilePage() {
  const { currentUser, isLoading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [skillsFilter, setSkillsFilter] = useState("");
  
  // Initialize forms with current user data
  const jobSeekerForm = useForm<JobSeekerProfileFormValues>({
    resolver: zodResolver(jobSeekerProfileSchema),
    defaultValues: currentUser && currentUser.user.userType === 'jobseeker' && 'firstName' in currentUser.profile
      ? {
          firstName: currentUser.profile.firstName || '',
          lastName: currentUser.profile.lastName || '',
          phoneNumber: currentUser.profile.phoneNumber || '',
          country: currentUser.profile.country || '',
          headline: '',
          bio: '',
          skills: '',
          experience: '',
          education: ''
        }
      : {
          firstName: '',
          lastName: '',
          phoneNumber: '',
          country: '',
          headline: '',
          bio: '',
          skills: '',
          experience: '',
          education: ''
        }
  });
  
  const employerForm = useForm<EmployerProfileFormValues>({
    resolver: zodResolver(employerProfileSchema),
    defaultValues: currentUser && currentUser.user.userType === 'employer' && 'companyName' in currentUser.profile
      ? {
          companyName: currentUser.profile.companyName || '',
          industry: currentUser.profile.industry || '',
          companyType: currentUser.profile.companyType || '',
          phoneNumber: currentUser.profile.phoneNumber || '',
          country: currentUser.profile.country || '',
          website: currentUser.profile.website || '',
          description: '',
          employeeCount: '',
          foundedYear: ''
        }
      : {
          companyName: '',
          industry: '',
          companyType: '',
          phoneNumber: '',
          country: '',
          website: '',
          description: '',
          employeeCount: '',
          foundedYear: ''
        }
  });
  
  // Initialize selected skills from user profile
  useEffect(() => {
    if (currentUser && currentUser.user.userType === 'jobseeker') {
      const profile = currentUser.profile as any;
      const skillsString = profile.skills || '';
      if (skillsString) {
        const skillsArray = skillsString.split(',').map((skill: string) => skill.trim());
        setSelectedSkills(skillsArray);
        // Also initialize the form field
        jobSeekerForm.setValue('skills', skillsString);
      }
    }
  }, [currentUser, jobSeekerForm]);

  // Helper functions for skill management
  const handleSkillToggle = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
    
    // Update the form field
    const newSkillsString = [...selectedSkills, skill]
      .filter(s => s !== skill ? selectedSkills.includes(s) : !selectedSkills.includes(s))
      .join(', ');
    
    jobSeekerForm.setValue('skills', newSkillsString);
  };
  
  const getFilteredSkills = () => {
    if (!skillsFilter) return skillsList;
    return skillsList.filter(skill => 
      skill.toLowerCase().includes(skillsFilter.toLowerCase())
    );
  };
  
  const getUserInitials = () => {
    if (!currentUser) return '';
    
    if (currentUser.user.userType === 'jobseeker' && 'firstName' in currentUser.profile) {
      return `${currentUser.profile.firstName.charAt(0)}${currentUser.profile.lastName.charAt(0)}`;
    } else if (currentUser.user.userType === 'employer' && 'companyName' in currentUser.profile) {
      return currentUser.profile.companyName.charAt(0);
    }
    
    return currentUser.user.email.charAt(0).toUpperCase();
  };

  const onJobSeekerSubmit = async (data: JobSeekerProfileFormValues) => {
    if (!currentUser) return;
    
    setIsSubmitting(true);
    try {
      const res = await apiRequest('PATCH', `/api/profile/jobseeker/${currentUser.profile.id}`, data);
      const updatedProfile = await res.json();
      
      // Update the cache with new user data
      queryClient.setQueryData(['/api/user'], {
        ...currentUser,
        profile: updatedProfile
      });
      
      toast({
        title: 'Profile updated successfully',
        description: 'Your profile has been updated.',
      });
    } catch (error) {
      toast({
        title: 'Error updating profile',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEmployerSubmit = async (data: EmployerProfileFormValues) => {
    if (!currentUser) return;
    
    setIsSubmitting(true);
    try {
      const res = await apiRequest('PATCH', `/api/profile/employer/${currentUser.profile.id}`, data);
      const updatedProfile = await res.json();
      
      // Update the cache with new user data
      queryClient.setQueryData(['/api/user'], {
        ...currentUser,
        profile: updatedProfile
      });
      
      toast({
        title: 'Profile updated successfully',
        description: 'Your company profile has been updated.',
      });
    } catch (error) {
      toast({
        title: 'Error updating profile',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container py-12 max-w-5xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Profile not available</CardTitle>
            <CardDescription>
              Please log in to access your profile.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" onClick={() => window.location.href = '/auth'}>
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-5xl mx-auto px-4">
      <div className="mb-8 flex flex-col md:flex-row md:items-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarFallback className="bg-primary text-white text-xl">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">
            {currentUser.user.userType === 'jobseeker' && 'firstName' in currentUser.profile
              ? `${currentUser.profile.firstName} ${currentUser.profile.lastName}`
              : currentUser.user.userType === 'employer' && 'companyName' in currentUser.profile
              ? currentUser.profile.companyName
              : 'My Profile'}
          </h1>
          <p className="text-gray-500">
            {currentUser.user.email} • {currentUser.user.userType === 'jobseeker' ? 'Job Seeker' : 'Employer'}
          </p>
        </div>
      </div>

      {currentUser.user.userType === 'jobseeker' ? (
        <Card>
          <CardHeader>
            <CardTitle>Job Seeker Profile</CardTitle>
            <CardDescription>
              Update your profile to improve your job matches and visibility to employers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...jobSeekerForm}>
              <form onSubmit={jobSeekerForm.handleSubmit(onJobSeekerSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={jobSeekerForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={jobSeekerForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={jobSeekerForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 000-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={jobSeekerForm.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={jobSeekerForm.control}
                  name="headline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Headline</FormLabel>
                      <FormControl>
                        <Input placeholder="Senior Software Engineer with 10+ years experience" {...field} />
                      </FormControl>
                      <FormDescription>
                        A short summary of your professional title and experience
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={jobSeekerForm.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Summary</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Write about your background, skills, and career goals" 
                          className="resize-none h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <FormLabel>Skills</FormLabel>
                  <FormDescription className="mb-2">
                    Select skills that best represent your expertise
                  </FormDescription>
                  
                  <div className="mb-4">
                    <Input
                      placeholder="Search skills..."
                      value={skillsFilter}
                      onChange={(e) => setSkillsFilter(e.target.value)}
                    />
                  </div>

                  <div className="border rounded-md p-3 space-y-3">
                    {selectedSkills.length > 0 && (
                      <div className="flex flex-wrap gap-2 pb-3 border-b">
                        {selectedSkills.map((skill) => (
                          <Badge key={skill} variant="outline" className="flex items-center gap-1">
                            {skill}
                            <button 
                              type="button" 
                              onClick={() => handleSkillToggle(skill)}
                              className="text-gray-500 hover:text-gray-700"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex flex-col space-y-2 max-h-60 overflow-y-auto">
                      {getFilteredSkills().map((skill) => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`skill-${skill}`}
                            checked={selectedSkills.includes(skill)}
                            onCheckedChange={() => handleSkillToggle(skill)}
                          />
                          <label 
                            htmlFor={`skill-${skill}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {skill}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <FormField
                  control={jobSeekerForm.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Experience</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your work experience, starting with the most recent position" 
                          className="resize-none h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={jobSeekerForm.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Education</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="List your educational background, degrees, certifications, etc." 
                          className="resize-none h-32"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Save Profile
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Employer Profile</CardTitle>
              <CardDescription>
                Update your company profile to attract the best talent
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...employerForm}>
                <form onSubmit={employerForm.handleSubmit(onEmployerSubmit)} className="space-y-6">
                  <FormField
                    control={employerForm.control}
                    name="companyName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Corporation" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={employerForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Write a brief description about your company" 
                            className="resize-none h-20"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={employerForm.control}
                      name="industry"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Industry</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {industries.map((industry) => (
                                <SelectItem key={industry} value={industry}>
                                  {industry}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={employerForm.control}
                      name="companyType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Company Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select company type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Public">Public</SelectItem>
                              <SelectItem value="Private">Private</SelectItem>
                              <SelectItem value="Startup">Startup</SelectItem>
                              <SelectItem value="Non-profit">Non-profit</SelectItem>
                              <SelectItem value="Government">Government</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={employerForm.control}
                      name="country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={employerForm.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={employerForm.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://www.example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                      control={employerForm.control}
                      name="employeeCount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Employees</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 50-100" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={employerForm.control}
                      name="foundedYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Founded Year</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. 2010" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    Save Company Profile
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Post a New Job</CardTitle>
              <CardDescription>Create a job listing to find the right talent</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
                <div className="flex flex-col items-center text-center">
                  <Briefcase className="h-16 w-16 text-primary mb-4" />
                  <h3 className="text-xl font-medium mb-2">Create a Job Listing</h3>
                  <p className="text-gray-500 mb-6 max-w-lg">
                    Post a new job opportunity to find qualified candidates for your company. You can specify job requirements, 
                    responsibilities, qualifications, and other details to attract the right talent.
                  </p>
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                    <Link href="/post-job" className="flex items-center">
                      <svg
                        className="mr-2 h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      Post New Job
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Job Applications Section */}
          <div className="mt-8">
            <Tabs defaultValue="all">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All Applications</TabsTrigger>
                <TabsTrigger value="new">New</TabsTrigger>
                <TabsTrigger value="viewed">Viewed</TabsTrigger>
                <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>All Applications</CardTitle>
                    <CardDescription>
                      Review all applications to your job listings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* We'll fetch applications data in the route API */}
                    <div className="text-center py-8">
                      <Button asChild>
                        <Link href="/applications-manager" className="flex items-center">
                          <Eye className="mr-2 h-4 w-4" />
                          View Applications Manager
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="new" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>New Applications</CardTitle>
                    <CardDescription>Review new applications that need your attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Button asChild>
                        <Link href="/applications-manager?filter=new" className="flex items-center">
                          <Eye className="mr-2 h-4 w-4" />
                          View New Applications
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="viewed" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Viewed Applications</CardTitle>
                    <CardDescription>Applications you have already viewed</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Button asChild>
                        <Link href="/applications-manager?filter=viewed" className="flex items-center">
                          <Eye className="mr-2 h-4 w-4" />
                          View Viewed Applications
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="shortlisted" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Shortlisted Applications</CardTitle>
                    <CardDescription>Candidates you've shortlisted for further consideration</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Button asChild>
                        <Link href="/applications-manager?filter=shortlisted" className="flex items-center">
                          <Eye className="mr-2 h-4 w-4" />
                          View Shortlisted Applications
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="rejected" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Rejected Applications</CardTitle>
                    <CardDescription>Candidates who don't meet your requirements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Button asChild>
                        <Link href="/applications-manager?filter=rejected" className="flex items-center">
                          <Eye className="mr-2 h-4 w-4" />
                          View Rejected Applications
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
}