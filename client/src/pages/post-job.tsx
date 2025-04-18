import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Briefcase, Building, Clock, DollarSign, MapPin, Save } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InsertJob } from "@shared/schema";

// Form schema for job posting (Full version)
const jobPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  company: z.string().min(2, "Company name is required"),
  location: z.string().min(2, "Location is required"),
  category: z.string().min(2, "Category is required"),
  jobType: z.string().min(2, "Job type is required"),
  specialization: z.string().optional(),
  experience: z.string().min(2, "Experience level is required"),
  minSalary: z.coerce.number().min(0, "Minimum salary is required"),
  maxSalary: z.coerce.number().min(0, "Maximum salary is required"),
  description: z.string().min(30, "Description must be at least 30 characters"),
  requirements: z.string().min(20, "Requirements must be at least 20 characters"),
  benefits: z.string().min(10, "Benefits must be at least 10 characters"),
  applicationDeadline: z.string().min(1, "Application deadline is required"),
  contactEmail: z.string().email("Must be a valid email address"),
});

// Form schema for simple job notification
const jobNotificationSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  company: z.string().min(2, "Company name is required"),
  location: z.string().min(2, "Location is required"),
  jobType: z.string().min(2, "Job type is required"),
  specialization: z.string().optional(),
  experience: z.string().min(2, "Experience level is required"),
  minSalary: z.coerce.number().min(0, "Minimum salary is required"),
  maxSalary: z.coerce.number().min(0, "Maximum salary is required"),
  applicationDeadline: z.string().min(1, "Application deadline is required"),
  contactEmail: z.string().email("Must be a valid email address"),
});

type JobPostFormValues = z.infer<typeof jobPostSchema>;
type JobNotificationFormValues = z.infer<typeof jobNotificationSchema>;

// Job categories
const categories = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Marketing",
  "Engineering",
  "Sales",
  "Hospitality",
];

// Specializations
const specializations = [
  // Technology
  "Software Development",
  "Data Science",
  "UX/UI Design",
  "DevOps Engineering",
  "Cybersecurity",
  "Cloud Computing",
  "Artificial Intelligence",
  "Machine Learning",
  "Blockchain Development",
  // Finance
  "Investment Banking",
  "Financial Analysis",
  "Risk Management",
  "Wealth Management",
  "Tax Advisory",
  "Corporate Finance",
  // Healthcare
  "Nursing",
  "Pharmacy",
  "Physical Therapy",
  "Medical Research",
  "Healthcare Administration",
  // Marketing
  "Digital Marketing",
  "Brand Management",
  "Content Marketing",
  "Social Media Marketing",
  "Market Research",
  // Engineering
  "Civil Engineering",
  "Mechanical Engineering",
  "Electrical Engineering",
  // Education
  "Teaching",
  "Academic Research",
  "Educational Administration",
  // General
  "Project Management",
  "Customer Support",
  "Human Resources",
  "Operations Management",
];

// Job locations
const locations = [
  // United States
  "New York, NY",
  "San Francisco, CA",
  "Chicago, IL",
  "Los Angeles, CA",
  "Seattle, WA",
  "Boston, MA",
  "Austin, TX",
  "Miami, FL",
  "Denver, CO",
  "Washington, DC",
  // UAE
  "Dubai, UAE",
  "Abu Dhabi, UAE",
  // India
  "Mumbai, India",
  "Delhi, India",
  "Bangalore, India",
  "Hyderabad, India",
  "Chennai, India",
  "Pune, India",
  // Other International
  "London, UK",
  "Toronto, Canada",
  "Sydney, Australia",
  "Paris, France",
  "Munich, Germany",
  "Dublin, Ireland",
  // Remote
  "Remote",
];

// Job types
const jobTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
  "Internship",
  "Remote",
];

// Experience levels
const experienceLevels = [
  "Entry Level (0-1 years)",
  "Junior (1-3 years)",
  "Mid-Level (3-5 years)",
  "Senior (5-10 years)",
  "Expert (10+ years)",
];

export default function PostJobPage() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isPreview, setIsPreview] = useState(false);
  const [formType, setFormType] = useState<"full" | "notification">("full");
  const queryClient = useQueryClient();
  
  // Set up full job form with validation
  const form = useForm<JobPostFormValues>({
    resolver: zodResolver(jobPostSchema),
    defaultValues: {
      title: "",
      company: currentUser?.user.userType === "employer" ? 
        (currentUser?.profile as any).companyName || "" : "",
      location: "",
      category: "",
      jobType: "",
      specialization: "",
      experience: "",
      minSalary: 0,
      maxSalary: 0,
      description: "",
      requirements: "",
      benefits: "",
      applicationDeadline: new Date().toISOString().split('T')[0],
      contactEmail: currentUser?.user.email || "",
    },
  });
  
  // Set up job notification form with validation
  const notificationForm = useForm<JobNotificationFormValues>({
    resolver: zodResolver(jobNotificationSchema),
    defaultValues: {
      title: "",
      company: currentUser?.user.userType === "employer" ? 
        (currentUser?.profile as any).companyName || "" : "",
      location: "",
      jobType: "",
      specialization: "",
      experience: "",
      minSalary: 0,
      maxSalary: 0,
      applicationDeadline: new Date().toISOString().split('T')[0],
      contactEmail: currentUser?.user.email || "",
    },
  });
  
  // Watch form values for preview
  const formValues = form.watch();
  
  // Create job mutation (full job form)
  const createJobMutation = useMutation({
    mutationFn: async (data: JobPostFormValues) => {
      const res = await apiRequest("POST", "/api/jobs", {
        ...data,
        employerId: currentUser?.profile.id,
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Job Posted Successfully",
        description: "Your job has been posted and is now visible to job seekers.",
      });
      
      // Invalidate the jobs query to refresh job listings
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      
      // Redirect to job management page
      setLocation("/my-jobs");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Post Job",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Create job notification mutation (simplified job form)
  const createJobNotificationMutation = useMutation({
    mutationFn: async (data: JobNotificationFormValues) => {
      // Add default values for the required fields that are not in the notification form
      const fullJobData: JobPostFormValues = {
        ...data,
        category: data.specialization ? (
          specializations.indexOf(data.specialization) >= 9 && specializations.indexOf(data.specialization) < 15 ? "Finance" : 
          specializations.indexOf(data.specialization) >= 15 && specializations.indexOf(data.specialization) < 20 ? "Healthcare" : 
          specializations.indexOf(data.specialization) >= 20 && specializations.indexOf(data.specialization) < 25 ? "Marketing" : 
          specializations.indexOf(data.specialization) >= 25 && specializations.indexOf(data.specialization) < 29 ? "Engineering" : 
          specializations.indexOf(data.specialization) >= 30 && specializations.indexOf(data.specialization) < 33 ? "Education" : "Technology"
        ) : "Technology",
        description: `We are looking for a ${data.title} at ${data.company}. This is a ${data.jobType} position.`,
        requirements: `Experience level: ${data.experience}`,
        benefits: "Competitive salary and benefits package.",
      };
      
      const res = await apiRequest("POST", "/api/jobs", {
        ...fullJobData,
        employerId: currentUser?.profile.id,
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Job Notification Posted",
        description: "Your job notification has been posted successfully.",
      });
      
      // Invalidate the jobs query to refresh job listings
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      
      // Reset the form
      notificationForm.reset();
      
      // Redirect to job management page
      setLocation("/my-jobs");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Post Job Notification",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle full form submission
  const onSubmit = (data: JobPostFormValues) => {
    createJobMutation.mutate(data);
  };
  
  // Handle notification form submission
  const onSubmitNotification = (data: JobNotificationFormValues) => {
    createJobNotificationMutation.mutate(data);
  };
  
  // Get currency symbol based on selected location
  const getCurrencySymbol = (location: string): string => {
    if (location.includes("India")) {
      return "₹"; // Indian Rupee
    } else if (location.includes("UAE")) {
      return "AED "; // UAE Dirham
    } else if (location.includes("UK")) {
      return "£"; // British Pound
    } else if (location.includes("Europe") || location.includes("France") || location.includes("Germany")) {
      return "€"; // Euro
    } else if (location.includes("Canada")) {
      return "C$"; // Canadian Dollar
    } else if (location.includes("Australia")) {
      return "A$"; // Australian Dollar
    } else {
      return "$"; // Default to US Dollar
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Post a Job</h1>
        <p className="text-gray-600 mb-8">
          Create a new job listing to find the perfect candidate for your position
        </p>
        
        {!currentUser ? (
          <Alert className="mb-6">
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>
              You need to be logged in as an employer to post jobs. 
              <Button variant="link" onClick={() => setLocation("/auth")}>
                Sign in or register
              </Button>
            </AlertDescription>
          </Alert>
        ) : currentUser.user.userType !== "employer" ? (
          <Alert className="mb-6">
            <AlertTitle>Employer Account Required</AlertTitle>
            <AlertDescription>
              Only employer accounts can post jobs. Your current account is registered as a job seeker.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Form type selection */}
            <div className="flex mb-6 border-b pb-4">
              <Tabs defaultValue="notification" className="w-full" onValueChange={(value) => setFormType(value as "full" | "notification")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="notification">Quick Job Notification</TabsTrigger>
                  <TabsTrigger value="full">Detailed Job Posting</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            
            {/* Toggle between form and preview for detailed job */}
            {formType === "full" && (
              <div className="flex mb-6 border-b pb-4">
                <Button
                  variant={isPreview ? "outline" : "default"}
                  className="mr-2"
                  onClick={() => setIsPreview(false)}
                >
                  Edit Job
                </Button>
                <Button
                  variant={isPreview ? "default" : "outline"}
                  onClick={() => setIsPreview(true)}
                  disabled={!form.formState.isValid}
                >
                  Preview
                </Button>
              </div>
            )}
            
            {isPreview ? (
              // Job Preview
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl font-bold">{formValues.title}</CardTitle>
                        <div className="flex items-center mt-2">
                          <Building className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="text-gray-600">{formValues.company}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium">
                          {formValues.jobType}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {formValues.location}
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {formValues.category}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formValues.experience}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {getCurrencySymbol(formValues.location)}{formValues.minSalary.toLocaleString()} - {getCurrencySymbol(formValues.location)}{formValues.maxSalary.toLocaleString()} per year
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Job Description</h3>
                      <p className="whitespace-pre-line">{formValues.description}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                      <p className="whitespace-pre-line">{formValues.requirements}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Benefits</h3>
                      <p className="whitespace-pre-line">{formValues.benefits}</p>
                    </div>
                    
                    <div className="rounded-lg bg-gray-50 p-4 border">
                      <div className="font-medium mb-2">Application Information</div>
                      <div className="text-sm">
                        <p>
                          <span className="font-medium">Deadline:</span> {new Date(formValues.applicationDeadline).toLocaleDateString()}
                        </p>
                        <p>
                          <span className="font-medium">Contact:</span> {formValues.contactEmail}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={() => onSubmit(form.getValues())}
                      disabled={createJobMutation.isPending}
                    >
                      {createJobMutation.isPending ? "Posting..." : "Post Job Now"}
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            ) : (
              // Job Post Form
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Job Details</CardTitle>
                      <CardDescription>
                        Enter the basic information about the job position
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Title</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Senior Frontend Developer" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your company name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select location" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {locations.map((location) => (
                                    <SelectItem key={location} value={location}>
                                      {location}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Category</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                      {category}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="jobType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Type</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select job type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {jobTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="experience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Experience Level</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select experience level" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {experienceLevels.map((level) => (
                                    <SelectItem key={level} value={level}>
                                      {level}
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
                        control={form.control}
                        name="specialization"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Specialization (Optional)</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select specialization" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {specializations.map((specialization) => (
                                  <SelectItem key={specialization} value={specialization}>
                                    {specialization}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="minSalary"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Minimum Salary</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="e.g., 50000"
                                  min="0"
                                  step="1000"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="maxSalary"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Maximum Salary</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  placeholder="e.g., 80000"
                                  min="0"
                                  step="1000"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Job Description</CardTitle>
                      <CardDescription>
                        Provide details about the role, responsibilities, and benefits
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe the role and responsibilities..."
                                className="min-h-32"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="requirements"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Requirements</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="List the qualifications and skills required..."
                                className="min-h-24"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="benefits"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Benefits</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="List the benefits offered..."
                                className="min-h-20"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Application Information</CardTitle>
                      <CardDescription>
                        Details for candidates to apply for this position
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="applicationDeadline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Application Deadline</FormLabel>
                              <FormControl>
                                <Input 
                                  type="date" 
                                  {...field}
                                  min={new Date().toISOString().split('T')[0]}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="contactEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Contact Email</FormLabel>
                              <FormControl>
                                <Input 
                                  type="email" 
                                  placeholder="Contact email for applications"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" type="button" onClick={() => form.reset()}>
                      Reset
                    </Button>
                    <Button 
                      type="button" 
                      onClick={() => setIsPreview(true)}
                      disabled={!form.formState.isValid}
                    >
                      Preview
                    </Button>
                    <Button 
                      type="submit"
                      disabled={!form.formState.isValid || createJobMutation.isPending}
                    >
                      <Save className="mr-2 h-4 w-4" />
                      {createJobMutation.isPending ? "Posting..." : "Post Job"}
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </>
        )}
      </div>
    </div>
  );
}