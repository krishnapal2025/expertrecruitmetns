import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  SelectGroup,
  SelectItem,
  SelectLabel,
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

// Form schema for job posting
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
  applicationDeadline: z.string().min(1, "Application deadline is required").refine((val) => {
    try {
      const date = new Date(val);
      return !isNaN(date.getTime());
    } catch {
      return false;
    }
  }, "Please enter a valid date"),
  contactEmail: z.string().email("Must be a valid email address"),
  employerId: z.number().optional(),
});

type JobPostFormValues = z.infer<typeof jobPostSchema>;

// Job categories
const categories = [
  "Technology & IT",
  "Finance & Banking",
  "Healthcare",
  "Education",
  "Marketing & Advertising",
  "Engineering",
  "Construction",
  "Oil & Gas",
  "Retail",
  "Hospitality",
  "Legal",
  "Human Resources",
  "Administration",
  "Sales",
  "Transportation & Logistics",
  "Manufacturing",
  "Real Estate",
  "Customer Service",
  "Other"
];

// Job types
const jobTypes = [
  "Full-Time",
  "Part-Time",
  "Contract",
  "Temporary",
  "Internship",
  "Remote"
];

// Experience levels
const experienceLevels = [
  "Entry Level (0-1 years)",
  "Junior (1-3 years)",
  "Mid-Level (3-5 years)",
  "Senior (5-10 years)",
  "Expert (10+ years)",
  "Executive"
];

// Locations
const locations = [
  "United Arab Emirates (UAE)",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "India",
  "Saudi Arabia",
  "Europe",
  "Singapore",
  "Remote"
];

// Specializations
const specializations = [
  // Technology
  "Software Development",
  "Web Development",
  "Mobile Development",
  "DevOps",
  "Cloud Computing",
  "Data Science",
  "Artificial Intelligence",
  "Machine Learning",
  "Cybersecurity",
  "Network Administration",
  "Database Administration",
  "UI/UX Design",
  "Quality Assurance",
  "Technical Support",
  
  // Finance
  "Accounting",
  "Banking",
  "Investment",
  "Financial Analysis",
  "Risk Management",
  "Insurance",
  "Tax",
  "Audit",
  
  // Healthcare
  "Nursing",
  "Physician",
  "Dental",
  "Pharmacy",
  "Physical Therapy",
  "Mental Health",
  "Healthcare Administration",
  
  // Education
  "Teaching",
  "School Administration",
  "Higher Education",
  "Early Childhood Education",
  "Special Education",
  "Educational Technology",
  
  // Engineering
  "Mechanical Engineering",
  "Electrical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Aerospace Engineering",
  "Environmental Engineering",
  
  // Sales & Marketing
  "Digital Marketing",
  "Social Media",
  "Content Creation",
  "SEO",
  "Sales Management",
  "Advertising",
  "Public Relations",
  "Product Marketing",
  
  // Other
  "General Management",
  "Project Management",
  "Business Analysis",
  "Operations",
  "Supply Chain",
  "Logistics",
  "Customer Success",
  "Research & Development"
];

// Common job titles by category
const jobTitlesByCategory = {
  "Technology & IT": [
    "Software Engineer",
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "DevOps Engineer",
    "Data Scientist",
    "Machine Learning Engineer",
    "Cloud Architect",
    "Systems Administrator",
    "Network Engineer",
    "IT Project Manager",
    "Cybersecurity Analyst",
    "Database Administrator",
    "QA Engineer",
    "UI/UX Designer",
    "Product Manager"
  ],
  "Healthcare": [
    "Registered Nurse",
    "Physician",
    "Medical Assistant",
    "Physical Therapist",
    "Nurse Practitioner",
    "Dental Hygienist",
    "Pharmacist",
    "Medical Technologist",
    "Healthcare Administrator",
    "Occupational Therapist"
  ],
  "Finance & Banking": [
    "Financial Analyst",
    "Accountant",
    "Investment Banker",
    "Financial Advisor",
    "Credit Analyst",
    "Risk Manager",
    "Compliance Officer",
    "Auditor",
    "Tax Consultant",
    "Financial Controller"
  ],
  "Education": [
    "Teacher",
    "Professor",
    "School Principal",
    "School Counselor",
    "Special Education Teacher",
    "Education Administrator",
    "Curriculum Developer",
    "School Psychologist",
    "Academic Advisor"
  ],
  "Engineering": [
    "Mechanical Engineer",
    "Civil Engineer",
    "Electrical Engineer",
    "Chemical Engineer",
    "Structural Engineer",
    "Aerospace Engineer",
    "Petroleum Engineer",
    "Environmental Engineer",
    "Biomedical Engineer"
  ],
  "Marketing & Advertising": [
    "Marketing Manager",
    "Digital Marketing Specialist",
    "SEO Specialist",
    "Social Media Manager",
    "Content Strategist",
    "Brand Manager",
    "Public Relations Specialist",
    "Market Research Analyst",
    "Media Planner"
  ]
};

// Common requirements by category
const requirementsByCategory = {
  "Technology & IT": [
    "Bachelor's degree in Computer Science, Software Engineering, or related field",
    "Proficiency in relevant programming languages (e.g., JavaScript, Python, Java, C#)",
    "Experience with front-end and back-end frameworks",
    "Understanding of software development lifecycle and best practices",
    "Familiarity with database systems (SQL and NoSQL)",
    "Experience with version control systems (Git)",
    "Strong problem-solving and analytical skills",
    "Knowledge of cloud services (AWS, Azure, GCP)",
    "Excellent communication and teamwork abilities",
    "Ability to work in an agile environment"
  ],
  "Finance & Banking": [
    "Bachelor's degree in Finance, Accounting, Economics, or related field",
    "Professional certification (CPA, CFA, or equivalent) preferred",
    "Strong analytical and quantitative skills",
    "Proficiency in financial modeling and analysis",
    "Knowledge of financial regulations and compliance requirements",
    "Experience with financial software and tools",
    "Excellent attention to detail",
    "Strong problem-solving abilities",
    "Effective verbal and written communication skills",
    "Ability to work under pressure and meet deadlines"
  ],
  "Healthcare": [
    "Relevant degree in healthcare or medical field",
    "Required certifications and licenses for the role",
    "Understanding of medical terminology and procedures",
    "Experience with healthcare systems and patient care",
    "Knowledge of healthcare regulations and compliance standards",
    "Strong interpersonal and communication skills",
    "Ability to work in fast-paced environments",
    "Compassion and empathy in patient interactions",
    "Proficiency with relevant medical software",
    "Commitment to patient confidentiality and privacy"
  ],
  "Engineering": [
    "Bachelor's degree in relevant engineering discipline",
    "Professional engineering license or certification (PE, PMP, etc.)",
    "Experience with industry-specific software and tools",
    "Knowledge of applicable codes, standards, and regulations",
    "Strong analytical and problem-solving skills",
    "Ability to read and interpret technical drawings and specifications",
    "Experience with project management and coordination",
    "Understanding of safety protocols and procedures",
    "Excellent communication and teamwork skills",
    "Attention to detail and quality control focus"
  ],
  "Marketing & Advertising": [
    "Bachelor's degree in Marketing, Communications, Business, or related field",
    "Experience with digital marketing platforms and tools",
    "Knowledge of SEO, SEM, and social media marketing",
    "Strong creative and strategic thinking skills",
    "Excellent written and verbal communication abilities",
    "Data analysis and performance measurement capabilities",
    "Understanding of market research methodologies",
    "Experience with CRM systems and marketing automation tools",
    "Ability to manage multiple projects and meet deadlines",
    "Strong presentation and client communication skills"
  ],
  "General": [
    "Relevant degree in field of expertise",
    "X+ years of experience in similar role",
    "Strong communication and interpersonal skills",
    "Excellent problem-solving abilities",
    "Attention to detail and accuracy",
    "Ability to work independently and in a team environment",
    "Proficiency with relevant software tools",
    "Strong organizational and time management skills",
    "Adaptability and willingness to learn",
    "Professional demeanor and work ethic"
  ]
};

// Salary ranges by experience level and category
const salaryRangesByExperience = {
  "Entry Level (0-1 years)": {
    "Technology & IT": { min: 50000, max: 70000 },
    "Finance & Banking": { min: 45000, max: 65000 },
    "Healthcare": { min: 40000, max: 60000 },
    "Engineering": { min: 55000, max: 75000 },
    "Marketing & Advertising": { min: 40000, max: 60000 },
    "Human Resources": { min: 40000, max: 55000 },
    "Legal": { min: 45000, max: 65000 },
    "Default": { min: 40000, max: 60000 }
  },
  "Junior (1-3 years)": {
    "Technology & IT": { min: 70000, max: 90000 },
    "Finance & Banking": { min: 65000, max: 85000 },
    "Healthcare": { min: 60000, max: 80000 },
    "Engineering": { min: 75000, max: 95000 },
    "Marketing & Advertising": { min: 60000, max: 80000 },
    "Human Resources": { min: 55000, max: 75000 },
    "Legal": { min: 65000, max: 90000 },
    "Default": { min: 60000, max: 80000 }
  },
  "Mid-Level (3-5 years)": {
    "Technology & IT": { min: 90000, max: 120000 },
    "Finance & Banking": { min: 85000, max: 110000 },
    "Healthcare": { min: 80000, max: 100000 },
    "Engineering": { min: 95000, max: 125000 },
    "Marketing & Advertising": { min: 80000, max: 105000 },
    "Human Resources": { min: 75000, max: 95000 },
    "Legal": { min: 90000, max: 120000 },
    "Default": { min: 80000, max: 105000 }
  },
  "Senior (5-10 years)": {
    "Technology & IT": { min: 120000, max: 150000 },
    "Finance & Banking": { min: 110000, max: 140000 },
    "Healthcare": { min: 100000, max: 130000 },
    "Engineering": { min: 125000, max: 160000 },
    "Marketing & Advertising": { min: 105000, max: 135000 },
    "Human Resources": { min: 95000, max: 125000 },
    "Legal": { min: 120000, max: 160000 },
    "Default": { min: 105000, max: 140000 }
  },
  "Expert (10+ years)": {
    "Technology & IT": { min: 150000, max: 200000 },
    "Finance & Banking": { min: 140000, max: 180000 },
    "Healthcare": { min: 130000, max: 170000 },
    "Engineering": { min: 160000, max: 210000 },
    "Marketing & Advertising": { min: 135000, max: 175000 },
    "Human Resources": { min: 125000, max: 160000 },
    "Legal": { min: 160000, max: 220000 },
    "Default": { min: 140000, max: 180000 }
  },
  "Executive": {
    "Technology & IT": { min: 200000, max: 300000 },
    "Finance & Banking": { min: 180000, max: 250000 },
    "Healthcare": { min: 170000, max: 240000 },
    "Engineering": { min: 210000, max: 280000 },
    "Marketing & Advertising": { min: 175000, max: 230000 },
    "Human Resources": { min: 160000, max: 210000 },
    "Legal": { min: 220000, max: 300000 },
    "Default": { min: 180000, max: 250000 }
  }
};

export default function PostJobPage() {
  const { currentUser, refetchUser } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isPreview, setIsPreview] = useState(false);
  const [companyName, setCompanyName] = useState<string>('');
  const queryClient = useQueryClient();
  
  // Fetch employers list for admin users to select from
  const { data: employers } = useQuery({
    queryKey: ['/api/employers'],
    queryFn: async () => {
      if (currentUser?.user.userType !== 'admin') return [];
      const res = await apiRequest('GET', '/api/employers');
      if (!res.ok) throw new Error('Failed to fetch employers');
      const employersList = await res.json();
      console.log("Loaded employers:", employersList);
      return employersList;
    },
    enabled: !!currentUser && currentUser.user.userType === 'admin'
  });
  
  // Set up form with validation
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
  
  // Watch form values for preview
  const formValues = form.watch();
  const selectedCategory = form.watch('category');
  const selectedExperience = form.watch('experience');
  
  // Simple function to update company name
  const handleCompanyNameChange = (value: string) => {
    setCompanyName(value);
  };
  
  // Function to suggest salary ranges based on category and experience
  const suggestSalaryRange = () => {
    if (selectedCategory && selectedExperience) {
      const category = selectedCategory;
      const experience = selectedExperience;
      
      const ranges = salaryRangesByExperience[experience as keyof typeof salaryRangesByExperience];
      if (ranges) {
        const categoryRanges = ranges[category as keyof typeof ranges] || ranges["Default"];
        if (categoryRanges) {
          form.setValue('minSalary', categoryRanges.min);
          form.setValue('maxSalary', categoryRanges.max);
          toast({
            title: "Salary Range Updated",
            description: `Suggested salary range for ${category} - ${experience} has been applied.`,
          });
        }
      }
    } else {
      toast({
        title: "Cannot Suggest Salary",
        description: "Please select both a category and experience level first.",
        variant: "destructive",
      });
    }
  };
  
  // Function to suggest job titles based on selected category
  const suggestJobTitles = (selectedCategory: string) => {
    return jobTitlesByCategory[selectedCategory as keyof typeof jobTitlesByCategory] || [];
  };
  
  // Function to load common requirements based on category
  const loadRequirements = (category: string) => {
    const categoryKey = category as keyof typeof requirementsByCategory;
    const requirementsList = requirementsByCategory[categoryKey] || requirementsByCategory.General;
    
    if (requirementsList && requirementsList.length > 0) {
      const requirementsText = requirementsList.map(req => `• ${req}`).join('\n');
      form.setValue('requirements', requirementsText);
      
      toast({
        title: "Requirements Loaded",
        description: `Common requirements for ${category} jobs have been loaded.`,
      });
    }
  };
  
  // Create job mutation
  const createJobMutation = useMutation({
    mutationFn: async (data: JobPostFormValues) => {
      let payload = { ...data };
      
      // If admin is creating a job on behalf of an employer
      if (currentUser?.user.userType === "admin" && companyName) {
        payload.company = companyName;
      }
      
      const res = await apiRequest("POST", "/api/jobs", payload);
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to create job");
      }
      
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: "Job posted successfully",
      });
      
      queryClient.invalidateQueries({ queryKey: ['/api/jobs'] });
      setLocation('/my-jobs');
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = async (data: JobPostFormValues) => {
    createJobMutation.mutate(data);
  };
  
  // If not authenticated or not authorized
  if (!currentUser) {
    return (
      <div className="container max-w-5xl py-10">
        <Alert>
          <AlertTitle>Authentication Required</AlertTitle>
          <AlertDescription>
            You must be logged in as an employer or admin to post jobs.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (currentUser.user.userType !== "employer" && currentUser.user.userType !== "admin") {
    return (
      <div className="container max-w-5xl py-10">
        <Alert>
          <AlertTitle>Unauthorized</AlertTitle>
          <AlertDescription>
            Only employers and administrators can post jobs.
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  // Render job preview if preview is enabled
  if (isPreview) {
    return (
      <div className="container max-w-4xl py-10">
        <Button 
          className="mb-4" 
          variant="outline"
          onClick={() => setIsPreview(false)}
        >
          Back to Editor
        </Button>
        
        <Card className="mb-10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{formValues.title}</CardTitle>
                <CardDescription className="text-lg">{formValues.company}</CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setIsPreview(false)}
              >
                Edit
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 opacity-70" />
                <span>{formValues.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 opacity-70" />
                <span>{formValues.jobType}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 opacity-70" />
                <span>{formValues.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 opacity-70" />
                <span>{formValues.experience}</span>
              </div>
              <div className="flex items-center gap-2 col-span-2">
                <DollarSign className="h-4 w-4 opacity-70" />
                <span>${formValues.minSalary.toLocaleString()} - ${formValues.maxSalary.toLocaleString()} per year</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Description</h3>
              <p className="whitespace-pre-wrap">{formValues.description}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Requirements</h3>
              <p className="whitespace-pre-wrap">{formValues.requirements}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Benefits</h3>
              <p className="whitespace-pre-wrap">{formValues.benefits}</p>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Application Deadline</h3>
                <p>{new Date(formValues.applicationDeadline).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Contact Email</h3>
                <p>{formValues.contactEmail}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="flex justify-between w-full">
              <Button 
                variant="outline" 
                onClick={() => setIsPreview(false)}
              >
                Back to Editor
              </Button>
              <Button 
                onClick={() => onSubmit(formValues)}
                disabled={createJobMutation.isPending}
              >
                {createJobMutation.isPending ? "Posting..." : "Post Job"}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Render post job form
  return (
    <div className="container max-w-5xl py-10">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">Post a Job</h1>
        <p className="text-muted-foreground">
          Fill out the form below to create a new job listing
        </p>
        
        {currentUser?.user.userType === "admin" && (
          <Alert className="mt-4">
            <AlertTitle>Admin Mode</AlertTitle>
            <AlertDescription>
              You are posting a job as an administrator. You can enter any company name.
            </AlertDescription>
          </Alert>
        )}
      </div>
      
      <div className="space-y-8">
        {createJobMutation.error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {createJobMutation.error.message}
            </AlertDescription>
          </Alert>
        )}
        
        {!isPreview && (
          <>
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
                          <div className="flex justify-between items-center">
                            <FormLabel>Job Title</FormLabel>
                            {selectedCategory && (
                              <Select
                                onValueChange={(value) => {
                                  form.setValue('title', value);
                                  toast({
                                    title: "Job Title Selected",
                                    description: `Selected "${value}" as the job title.`,
                                  });
                                }}
                              >
                                <SelectTrigger className="w-[180px]">
                                  <SelectValue placeholder="Select title" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectGroup>
                                    <SelectLabel>Common Titles</SelectLabel>
                                    {suggestJobTitles(selectedCategory).map((title) => (
                                      <SelectItem key={title} value={title}>
                                        {title}
                                      </SelectItem>
                                    ))}
                                  </SelectGroup>
                                </SelectContent>
                              </Select>
                            )}
                          </div>
                          <FormControl>
                            <Input placeholder="e.g., Senior Frontend Developer" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Admin-only employer name input field */}
                    {currentUser?.user.userType === "admin" && (
                      <div className="mb-4">
                        <FormLabel>Enter Employer Company Name</FormLabel>
                        <Input
                          type="text"
                          placeholder="Enter company name"
                          value={companyName || ''}
                          onChange={(e) => {
                            const value = e.target.value;
                            setCompanyName(value);
                          }}
                          className="w-full"
                        />
                        <p className="text-sm text-muted-foreground mt-1">
                          Enter the company name to post on their behalf
                        </p>
                      </div>
                    )}
                    
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
                    
                    {selectedCategory && selectedExperience && (
                      <div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={suggestSalaryRange}
                          className="w-full"
                        >
                          Suggest Salary Range for {selectedCategory} - {selectedExperience}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Job Description</CardTitle>
                    <CardDescription>
                      Provide detailed information about the job
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Describe the job role, responsibilities, and other important details..."
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
                          <div className="flex justify-between items-center">
                            <FormLabel>Requirements</FormLabel>
                            {selectedCategory && (
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1 text-xs"
                                onClick={() => loadRequirements(selectedCategory)}
                              >
                                Load Common Requirements
                              </Button>
                            )}
                          </div>
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
                  >
                    Preview
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createJobMutation.isPending}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    {createJobMutation.isPending ? "Posting..." : "Post Job"}
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
      </div>
    </div>
  );
}