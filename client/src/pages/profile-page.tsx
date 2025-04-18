import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Briefcase, Building, Globe, Phone, MapPin, AtSign, User as UserIcon, Check } from "lucide-react";
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
import { apiRequest, queryClient } from "@/lib/queryClient";

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
        </div>
      )}
    </div>
  );
}