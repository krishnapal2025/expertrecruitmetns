import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { apiRequest } from "@/lib/queryClient";
import { InsertJob } from "@shared/schema";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// Icons
import {
  Briefcase,
  Building,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  DollarSign,
  Eye,
  FileText,
  Globe,
  Mail,
  MapPin,
  PenTool,
  Save,
  Star,
  Tag,
  Users,
} from "lucide-react";

// Form validation schema
const jobPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  company: z.string().min(2, "Company name is required"),
  location: z.string().min(2, "Location is required"),
  category: z.string().min(2, "Category is required"),
  jobType: z.string().min(2, "Job type is required"),
  specialization: z.string().optional(),
  experience: z.string().min(2, "Experience level is required"),
  minSalary: z.coerce.number().min(0, "Minimum salary is required"),
  maxSalary: z.coerce.number().min(0, "Maximum salary is required")
    .refine(val => val > 0, "Salary must be greater than 0"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  requirements: z.string().min(20, "Requirements must be at least 20 characters"),
  benefits: z.string().min(10, "Benefits description is required"),
  applicationDeadline: z.string().min(1, "Application deadline is required")
    .refine(val => {
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

// Reference data
const JOB_CATEGORIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Marketing",
  "Engineering",
  "Sales",
  "Hospitality",
  "Human Resources",
  "Legal",
  "Administration",
  "Customer Service",
  "Construction",
  "Manufacturing",
  "Retail",
  "Logistics"
];

const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
  "Internship",
  "Remote",
  "Hybrid",
  "Freelance",
  "Seasonal"
];

const EXPERIENCE_LEVELS = [
  "Entry Level (0-1 years)",
  "Junior (1-3 years)",
  "Mid-Level (3-5 years)",
  "Senior (5-10 years)",
  "Expert (10+ years)",
  "Manager",
  "Director",
  "Executive"
];

const LOCATIONS = [
  "United States",
  "Canada",
  "United Kingdom",
  "Germany",
  "France",
  "Australia",
  "India",
  "UAE",
  "Singapore",
  "Hong Kong",
  "Japan",
  "South Korea",
  "Remote"
];

// Common job titles by category
const COMMON_JOB_TITLES = {
  "Technology": [
    "Software Engineer",
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "DevOps Engineer",
    "Data Scientist",
    "Machine Learning Engineer",
    "Cloud Architect",
    "UI/UX Designer",
    "QA Engineer",
    "Product Manager",
    "IT Support Specialist"
  ],
  "Finance": [
    "Financial Analyst",
    "Accountant",
    "Investment Banker",
    "Financial Advisor",
    "Tax Consultant",
    "Compliance Officer",
    "Risk Analyst",
    "Loan Officer",
    "Audit Manager",
    "Financial Controller"
  ],
  "Healthcare": [
    "Registered Nurse",
    "Medical Doctor",
    "Pharmacist",
    "Physical Therapist",
    "Medical Assistant",
    "Healthcare Administrator",
    "Lab Technician",
    "Radiologist",
    "Dentist",
    "Mental Health Counselor"
  ],
  "Education": [
    "Teacher",
    "Professor",
    "School Counselor",
    "Principal",
    "Education Consultant",
    "Special Education Teacher",
    "Curriculum Developer",
    "Academic Advisor",
    "Instructional Designer"
  ],
  "Marketing": [
    "Marketing Manager",
    "Digital Marketing Specialist",
    "SEO Specialist",
    "Content Strategist",
    "Social Media Manager",
    "Brand Manager",
    "Marketing Analyst",
    "Public Relations Specialist",
    "Email Marketing Specialist",
    "Growth Marketer"
  ],
  "Engineering": [
    "Civil Engineer",
    "Mechanical Engineer",
    "Electrical Engineer",
    "Chemical Engineer",
    "Aerospace Engineer",
    "Biomedical Engineer",
    "Structural Engineer",
    "Environmental Engineer",
    "Process Engineer"
  ],
  "Sales": [
    "Sales Representative",
    "Sales Manager",
    "Account Executive",
    "Business Development Manager",
    "Sales Engineer",
    "Retail Sales Associate",
    "Inside Sales Representative",
    "Territory Sales Manager",
    "Sales Director"
  ],
  "Hospitality": [
    "Hotel Manager",
    "Event Coordinator",
    "Chef",
    "Restaurant Manager",
    "Front Desk Manager",
    "Concierge",
    "Catering Manager",
    "Tour Guide",
    "Flight Attendant"
  ],
  "Human Resources": [
    "HR Manager",
    "Recruiter",
    "Talent Acquisition Specialist",
    "HR Generalist",
    "Compensation Analyst",
    "Training and Development Manager",
    "Employee Relations Specialist"
  ],
  "Legal": [
    "Attorney",
    "Legal Assistant",
    "Paralegal",
    "Compliance Officer",
    "Legal Counsel",
    "Contract Manager",
    "Patent Attorney"
  ],
  "Administration": [
    "Administrative Assistant",
    "Office Manager",
    "Executive Assistant",
    "Receptionist",
    "Operations Manager",
    "Facilities Manager"
  ],
  "Customer Service": [
    "Customer Service Representative",
    "Call Center Agent",
    "Customer Success Manager",
    "Technical Support Specialist",
    "Client Relations Manager"
  ]
};

// Common skills by category
const SKILLS_BY_CATEGORY = {
  "Technology": [
    "JavaScript", "TypeScript", "React", "Angular", "Vue.js", 
    "Node.js", "Python", "Java", "C#", ".NET", "C++",
    "AWS", "Azure", "GCP", "Docker", "Kubernetes",
    "SQL", "MongoDB", "Redis", "Git", "CI/CD", 
    "REST API", "GraphQL", "Microservices", "TDD", "Agile"
  ],
  "Finance": [
    "Financial Analysis", "QuickBooks", "SAP", "Excel", "Financial Modeling",
    "Financial Reporting", "Budgeting", "Forecasting", "Risk Assessment", 
    "Banking Regulations", "Investment Analysis", "CPA", "Tax Preparation",
    "Asset Management", "Portfolio Management", "Financial Planning"
  ],
  "Healthcare": [
    "Patient Care", "Medical Records", "HIPAA", "EPIC", "Medical Billing",
    "Clinical Research", "Medical Coding", "CPR", "Patient Advocacy",
    "Healthcare Administration", "Electronic Health Records", "PACS",
    "Medical Terminology", "Case Management", "Care Coordination" 
  ],
  "Education": [
    "Curriculum Development", "Instructional Design", "Classroom Management",
    "Assessment", "Special Education", "STEM", "ESL", "Online Learning",
    "LMS", "Blackboard", "Canvas", "Student Engagement", "Educational Psychology",
    "Differentiated Instruction", "Educational Technology", "IEP Development"
  ],
  "Marketing": [
    "SEO", "SEM", "Google Analytics", "Social Media Marketing", "Content Marketing",
    "Email Marketing", "Adobe Creative Suite", "CRM", "Salesforce", "HubSpot",
    "Market Research", "Brand Strategy", "Campaign Management", "Google Ads",
    "Facebook Ads", "Instagram Marketing", "Influencer Management", "Marketing Automation"
  ],
  "Engineering": [
    "AutoCAD", "Revit", "SolidWorks", "Project Management", "MATLAB",
    "3D Modeling", "Structural Analysis", "Civil Engineering", "Mechanical Design",
    "Electrical Systems", "Thermal Analysis", "Fluid Dynamics", "Materials Science",
    "Six Sigma", "Quality Control", "PLC Programming", "Systems Engineering"
  ],
  "Sales": [
    "CRM", "Salesforce", "Cold Calling", "Lead Generation", "Negotiation",
    "Customer Service", "B2B Sales", "B2C Sales", "Account Management",
    "Sales Forecasting", "Pipeline Management", "HubSpot", "Consultative Selling",
    "Sales Presentations", "Contract Negotiation", "Territory Management"
  ],
  "Hospitality": [
    "Customer Service", "Event Planning", "Food & Beverage Management",
    "Hotel Management", "Reservation Systems", "POS Systems",
    "Inventory Management", "Staff Training", "Opera PMS", "Amadeus",
    "Guest Relations", "Catering", "Restaurant Operations", "Housekeeping"
  ],
};

// Salary ranges for each location by years of experience
const SALARY_RANGES = {
  "United States": {
    "Entry Level (0-1 years)": { min: 40000, max: 60000 },
    "Junior (1-3 years)": { min: 60000, max: 90000 },
    "Mid-Level (3-5 years)": { min: 90000, max: 120000 },
    "Senior (5-10 years)": { min: 120000, max: 180000 },
    "Expert (10+ years)": { min: 180000, max: 250000 },
    "Manager": { min: 130000, max: 200000 },
    "Director": { min: 180000, max: 250000 },
    "Executive": { min: 200000, max: 400000 },
  },
  "Canada": {
    "Entry Level (0-1 years)": { min: 50000, max: 70000 },
    "Junior (1-3 years)": { min: 70000, max: 90000 },
    "Mid-Level (3-5 years)": { min: 90000, max: 120000 },
    "Senior (5-10 years)": { min: 120000, max: 160000 },
    "Expert (10+ years)": { min: 160000, max: 220000 },
    "Manager": { min: 130000, max: 180000 },
    "Director": { min: 160000, max: 230000 },
    "Executive": { min: 180000, max: 300000 },
  },
  "United Kingdom": {
    "Entry Level (0-1 years)": { min: 25000, max: 35000 },
    "Junior (1-3 years)": { min: 35000, max: 50000 },
    "Mid-Level (3-5 years)": { min: 50000, max: 75000 },
    "Senior (5-10 years)": { min: 75000, max: 100000 },
    "Expert (10+ years)": { min: 100000, max: 150000 },
    "Manager": { min: 80000, max: 120000 },
    "Director": { min: 100000, max: 180000 },
    "Executive": { min: 150000, max: 300000 },
  },
  "India": {
    "Entry Level (0-1 years)": { min: 300000, max: 500000 },
    "Junior (1-3 years)": { min: 500000, max: 800000 },
    "Mid-Level (3-5 years)": { min: 800000, max: 1500000 },
    "Senior (5-10 years)": { min: 1500000, max: 2500000 },
    "Expert (10+ years)": { min: 2500000, max: 4000000 },
    "Manager": { min: 2000000, max: 3500000 },
    "Director": { min: 3500000, max: 6000000 },
    "Executive": { min: 6000000, max: 10000000 },
  },
  "UAE": {
    "Entry Level (0-1 years)": { min: 60000, max: 100000 },
    "Junior (1-3 years)": { min: 100000, max: 150000 },
    "Mid-Level (3-5 years)": { min: 150000, max: 250000 },
    "Senior (5-10 years)": { min: 250000, max: 400000 },
    "Expert (10+ years)": { min: 400000, max: 600000 },
    "Manager": { min: 300000, max: 500000 },
    "Director": { min: 500000, max: 800000 },
    "Executive": { min: 800000, max: 1500000 },
  },
};

export default function PostJobPage() {
  const { currentUser } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // States
  const [activeTab, setActiveTab] = useState<string>("details");
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [companyName, setCompanyName] = useState<string>("");
  
  // Initialize form with validation
  const form = useForm<JobPostFormValues>({
    resolver: zodResolver(jobPostSchema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      category: "",
      jobType: "Full-time",
      specialization: "",
      experience: "",
      minSalary: 0,
      maxSalary: 0,
      description: "",
      requirements: "",
      benefits: "",
      applicationDeadline: (() => {
        const date = new Date();
        date.setDate(date.getDate() + 30); // Default deadline: 30 days from now
        return date.toISOString().split('T')[0];
      })(),
      contactEmail: currentUser?.email || "",
    },
  });
  
  // Watch form values for preview
  const formValues = form.watch();
  
  // Create job posting mutation
  const createJobMutation = useMutation({
    mutationFn: async (data: JobPostFormValues) => {
      try {
        // Pre-submission check: verify authentication
        const userCheckRes = await fetch('/api/user', { 
          credentials: 'include',
          headers: { 'Cache-Control': 'no-cache' }
        });
        
        if (!userCheckRes.ok) {
          throw new Error("Your session has expired. Please log in again.");
        }
        
        // Prepare data for submission
        const cleanData = {
          // Core fields
          title: data.title?.trim() || "",
          company: currentUser?.user.userType === "admin" && companyName ? 
            companyName.trim() : data.company?.trim() || "",
          location: data.location?.trim() || "",
          category: data.category?.trim() || "",
          jobType: data.jobType?.trim() || "",
          description: data.description?.trim() || "",
          
          // Additional fields
          requirements: data.requirements?.trim() || "",
          benefits: data.benefits?.trim() || "",
          experience: data.experience?.trim() || "",
          
          // Numeric fields - ensure they are numbers
          minSalary: Math.max(0, isNaN(Number(data.minSalary)) ? 0 : Number(data.minSalary)),
          maxSalary: Math.max(0, isNaN(Number(data.maxSalary)) ? 0 : Number(data.maxSalary)),
          
          // Contact and application details
          contactEmail: data.contactEmail?.trim() || "",
          
          // Date handling - ensure proper ISO format
          applicationDeadline: (() => {
            try {
              // Process date string to ensure consistent format
              if (data.applicationDeadline) {
                const date = new Date(data.applicationDeadline);
                if (!isNaN(date.getTime())) {
                  return date.toISOString().split('T')[0];
                }
              }
              // Fallback: 30 days from now
              const date = new Date();
              date.setDate(date.getDate() + 30);
              return date.toISOString().split('T')[0];
            } catch (error) {
              console.error("Error formatting deadline date:", error);
              return new Date().toISOString().split('T')[0];
            }
          })(),
          
          // Optional fields
          specialization: data.specialization?.trim() || "",
          
          // Reference fields
          employerId: currentUser?.user.userType === "employer" ? currentUser?.user.id : null
        };
        
        // Log what we're sending (helps with debugging)
        console.log("Submitting job with payload:", cleanData);
        
        // Make the API request
        const res = await apiRequest("POST", "/api/jobs", cleanData);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to create job posting");
        }
        
        return await res.json();
      } catch (error: any) {
        console.error("Job creation error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Job posted successfully",
        variant: "default",
      });
      
      // Reset form and states
      form.reset();
      setSelectedCategory("");
      setSelectedSkills([]);
      setCompanyName("");
      setIsPreview(false);
      
      // Update job listings
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      
      // Redirect to job board
      setLocation("/job-board");
    },
    onError: (error: Error) => {
      console.error("Error creating job:", error);
      
      toast({
        title: "Error",
        description: error.message || "Failed to create job. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  // Helper functions
  const handleCategoryChange = (value: string) => {
    form.setValue('category', value);
    setSelectedCategory(value);
    setSelectedSkills([]);
    
    // Clear any skills-based content in requirements
    const currentReq = form.getValues('requirements') || '';
    const newReq = currentReq.replace(/Required skills:.*(?=\n|$)/, '').trim();
    form.setValue('requirements', newReq);
  };
  
  const handleJobTitleSelect = (title: string) => {
    form.setValue('title', title);
  };
  
  const handleSalaryRangeSelect = (location: string, experienceLevel: string) => {
    // Find appropriate salary range for the selected location and experience
    if (!location || !experienceLevel) return;
    
    const locationData = SALARY_RANGES[location as keyof typeof SALARY_RANGES];
    if (!locationData) return;
    
    const experienceData = locationData[experienceLevel as keyof typeof locationData];
    if (!experienceData) return;
    
    const { min, max } = experienceData;
    
    // Set salary values in the form
    form.setValue('minSalary', min);
    form.setValue('maxSalary', max);
  };
  
  const handleSkillToggle = (skill: string) => {
    let updatedSkills: string[];
    
    if (selectedSkills.includes(skill)) {
      updatedSkills = selectedSkills.filter(s => s !== skill);
    } else {
      updatedSkills = [...selectedSkills, skill];
    }
    
    setSelectedSkills(updatedSkills);
    
    // Update requirements text with selected skills
    if (updatedSkills.length > 0) {
      const skillsText = updatedSkills.join(', ');
      const currentText = form.getValues('requirements') || '';
      
      if (!currentText.includes('Required skills:')) {
        const newRequirements = `Required skills: ${skillsText}\n\n${currentText}`;
        form.setValue('requirements', newRequirements.trim());
      } else {
        const newRequirements = currentText.replace(
          /Required skills:.*(?=\n|$)/,
          `Required skills: ${skillsText}`
        );
        form.setValue('requirements', newRequirements.trim());
      }
    }
  };
  
  const getCurrencySymbol = (location: string): string => {
    if (location.includes("India")) return "₹";
    if (location.includes("UAE")) return "AED ";
    if (location.includes("UK")) return "£";
    if (location.includes("Europe") || location.includes("France") || location.includes("Germany")) return "€";
    if (location.includes("Canada")) return "C$";
    if (location.includes("Australia")) return "A$";
    return "$"; // Default to US Dollar
  };
  
  const onSubmit = (data: JobPostFormValues) => {
    // Final validation check
    const requiredFields = [
      { field: 'title', label: 'Title' },
      { field: 'location', label: 'Location' },
      { field: 'category', label: 'Category' },
      { field: 'jobType', label: 'Job Type' },
      { field: 'description', label: 'Description' }
    ];
    
    // Check for missing required fields
    const missingFields = requiredFields.filter(
      ({ field }) => !data[field as keyof JobPostFormValues]
    );
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill in: ${missingFields.map(f => f.label).join(', ')}`,
        variant: "destructive",
      });
      return;
    }
    
    // Company name validation for admin users
    if (currentUser?.user.userType === "admin" && !companyName.trim()) {
      toast({
        title: "Company Name Required",
        description: "Please enter a company name to post on their behalf",
        variant: "destructive",
      });
      return;
    }
    
    // For admin users, copy the company name into the form data
    if (currentUser?.user.userType === "admin" && companyName.trim()) {
      form.setValue('company', companyName.trim());
    }
    
    // Submit the job posting
    createJobMutation.mutate(data);
  };
  
  // Render the form or preview
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Post a Job</h1>
          <p className="text-gray-600">
            Create a new job listing to find the perfect candidate
          </p>
        </div>
        
        {/* Check permissions */}
        {!currentUser ? (
          <Alert className="mb-6">
            <AlertTitle>Authentication Required</AlertTitle>
            <AlertDescription>
              You need to be logged in as an admin to post jobs. 
              <Button variant="link" onClick={() => setLocation("/admin-login")}>
                Sign in as admin
              </Button>
            </AlertDescription>
          </Alert>
        ) : (currentUser.user.userType !== "admin") ? (
          <Alert className="mb-6">
            <AlertTitle>Admin Access Required</AlertTitle>
            <AlertDescription>
              Only admin accounts can post jobs. Your current account doesn't have the necessary permissions.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Toggle between edit and preview */}
            <div className="mb-6 flex gap-4">
              <Button
                variant={isPreview ? "outline" : "default"}
                className="gap-2"
                onClick={() => setIsPreview(false)}
              >
                <PenTool size={16} /> Edit Job
              </Button>
              <Button
                variant={isPreview ? "default" : "outline"}
                className="gap-2"
                onClick={() => setIsPreview(true)}
              >
                <Eye size={16} /> Preview
              </Button>
            </div>
            
            {isPreview ? (
              // Job Preview
              <div className="space-y-6 bg-white rounded-lg overflow-hidden border">
                <Card>
                  <CardHeader className="bg-primary/5">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl font-bold">
                          {formValues.title || "Job Title"}
                        </CardTitle>
                        <div className="flex items-center mt-2 text-gray-600">
                          <Building className="h-4 w-4 mr-1" />
                          <span>
                            {currentUser.user.userType === "admin" ? companyName : formValues.company || "Company Name"}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <Badge variant="secondary">
                          {formValues.jobType || "Job Type"}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          Posted: {new Date().toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-6 space-y-6">
                    {/* Job details */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">Location</h4>
                          <p>{formValues.location || "Location"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <Briefcase className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">Category</h4>
                          <p>{formValues.category || "Category"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <Clock className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">Experience</h4>
                          <p>{formValues.experience || "Experience Level"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <DollarSign className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">Salary Range</h4>
                          <p>
                            {formValues.location ? getCurrencySymbol(formValues.location) : "$"}
                            {(formValues.minSalary > 0 ? formValues.minSalary.toLocaleString() : "Min")} - 
                            {formValues.location ? getCurrencySymbol(formValues.location) : "$"}
                            {(formValues.maxSalary > 0 ? formValues.maxSalary.toLocaleString() : "Max")} per year
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <Calendar className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">Application Deadline</h4>
                          <p>{formValues.applicationDeadline ? new Date(formValues.applicationDeadline).toLocaleDateString() : "Deadline"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-2">
                        <Mail className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-medium">Contact</h4>
                          <p>{formValues.contactEmail || "Email"}</p>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Job details sections */}
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Job Description</h3>
                      <p className="whitespace-pre-line text-gray-700">
                        {formValues.description || "No description provided"}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Requirements</h3>
                      <p className="whitespace-pre-line text-gray-700">
                        {formValues.requirements || "No requirements provided"}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Benefits</h3>
                      <p className="whitespace-pre-line text-gray-700">
                        {formValues.benefits || "No benefits provided"}
                      </p>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="bg-gray-50 border-t flex-col items-stretch gap-4 sm:flex-row sm:justify-between">
                    <div className="text-sm text-gray-500">
                      <p>This is a preview. Submit to post this job.</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsPreview(false)}
                      >
                        Edit
                      </Button>
                      <Button 
                        onClick={() => form.handleSubmit(onSubmit)()}
                        disabled={createJobMutation.isPending}
                      >
                        {createJobMutation.isPending 
                          ? "Posting..." 
                          : "Post Job Now"}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </div>
            ) : (
              // Job Form
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-4 mb-6">
                      <TabsTrigger value="details" className="flex gap-2 items-center">
                        <FileText size={16} /> Basic Details
                      </TabsTrigger>
                      <TabsTrigger value="compensation" className="flex gap-2 items-center">
                        <DollarSign size={16} /> Compensation
                      </TabsTrigger>
                      <TabsTrigger value="description" className="flex gap-2 items-center">
                        <FileText size={16} /> Description
                      </TabsTrigger>
                      <TabsTrigger value="application" className="flex gap-2 items-center">
                        <Users size={16} /> Application
                      </TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="details" className="space-y-4">
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
                                {selectedCategory && (
                                  <div className="mt-2">
                                    <p className="text-sm text-muted-foreground mb-2">Suggested titles for {selectedCategory}:</p>
                                    <ScrollArea className="h-20 w-full rounded-md border p-2">
                                      <div className="flex flex-wrap gap-2">
                                        {COMMON_JOB_TITLES[selectedCategory as keyof typeof COMMON_JOB_TITLES]?.map((title) => (
                                          <Badge 
                                            key={title}
                                            variant={field.value === title ? "default" : "outline"}
                                            className="cursor-pointer"
                                            onClick={() => handleJobTitleSelect(title)}
                                          >
                                            {title}
                                          </Badge>
                                        ))}
                                      </div>
                                    </ScrollArea>
                                  </div>
                                )}
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {/* Admin-only employer name input field */}
                          {currentUser.user.userType === "admin" && (
                            <div className="mb-4">
                              <FormLabel>Employer Company Name</FormLabel>
                              <Input
                                type="text"
                                placeholder="Enter company name for this job posting"
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className="w-full"
                              />
                              <p className="text-sm text-muted-foreground mt-1">
                                Enter the company name as an admin posting on their behalf
                              </p>
                            </div>
                          )}
                          
                          {/* Hidden company field */}
                          <FormField
                            control={form.control}
                            name="company"
                            render={({ field }) => (
                              <FormItem className="hidden">
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                              control={form.control}
                              name="category"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Category</FormLabel>
                                  <Select 
                                    onValueChange={(value) => handleCategoryChange(value)} 
                                    defaultValue={field.value}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {JOB_CATEGORIES.map((category) => (
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
                                      {JOB_TYPES.map((type) => (
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
                          </div>
                          
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
                                    {LOCATIONS.map((location) => (
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
                            name="specialization"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Specialization (Optional)</FormLabel>
                                <FormControl>
                                  <Input 
                                    placeholder="e.g., React, Cloud Computing, Mobile Development" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="compensation" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Experience & Compensation</CardTitle>
                          <CardDescription>
                            Define experience requirements and compensation details
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <FormField
                            control={form.control}
                            name="experience"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Experience Level</FormLabel>
                                <Select 
                                  onValueChange={(value) => {
                                    field.onChange(value);
                                    
                                    // Auto-populate salary range if location is already selected
                                    const location = form.getValues('location');
                                    if (location) {
                                      handleSalaryRangeSelect(location, value);
                                    }
                                  }}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select experience level" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {EXPERIENCE_LEVELS.map((level) => (
                                      <SelectItem key={level} value={level}>
                                        {level}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormDescription>
                                  This will help suggest appropriate salary ranges
                                </FormDescription>
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
                                    <div className="relative">
                                      <span className="absolute left-3 top-2.5 text-gray-500">
                                        {form.getValues('location') ? 
                                          getCurrencySymbol(form.getValues('location')) : "$"}
                                      </span>
                                      <Input
                                        type="number"
                                        className="pl-7"
                                        placeholder="Minimum Annual Salary"
                                        {...field}
                                        onChange={(e) => {
                                          const value = parseInt(e.target.value, 10);
                                          field.onChange(isNaN(value) ? 0 : value);
                                        }}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormDescription>
                                    Minimum yearly salary in {form.getValues('location') || "local"} currency
                                  </FormDescription>
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
                                    <div className="relative">
                                      <span className="absolute left-3 top-2.5 text-gray-500">
                                        {form.getValues('location') ? 
                                          getCurrencySymbol(form.getValues('location')) : "$"}
                                      </span>
                                      <Input
                                        type="number"
                                        className="pl-7"
                                        placeholder="Maximum Annual Salary"
                                        {...field}
                                        onChange={(e) => {
                                          const value = parseInt(e.target.value, 10);
                                          field.onChange(isNaN(value) ? 0 : value);
                                        }}
                                      />
                                    </div>
                                  </FormControl>
                                  <FormDescription>
                                    Maximum yearly salary in {form.getValues('location') || "local"} currency
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="description" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Job Description & Requirements</CardTitle>
                          <CardDescription>
                            Provide detailed information about the position
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Describe the responsibilities and expectations for this role..."
                                    className="min-h-32 resize-y"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Provide a clear description of what the job entails
                                </FormDescription>
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
                                {selectedCategory && (
                                  <div className="mb-3">
                                    <p className="text-sm text-muted-foreground mb-2">Select required skills:</p>
                                    <ScrollArea className="h-24 w-full rounded-md border p-2">
                                      <div className="flex flex-wrap gap-2">
                                        {SKILLS_BY_CATEGORY[selectedCategory as keyof typeof SKILLS_BY_CATEGORY]?.map((skill) => (
                                          <Badge 
                                            key={skill}
                                            variant={selectedSkills.includes(skill) ? "default" : "outline"}
                                            className="cursor-pointer"
                                            onClick={() => handleSkillToggle(skill)}
                                          >
                                            {selectedSkills.includes(skill) && (
                                              <Check className="mr-1 h-3 w-3" />
                                            )}
                                            {skill}
                                          </Badge>
                                        ))}
                                      </div>
                                    </ScrollArea>
                                  </div>
                                )}
                                <FormControl>
                                  <Textarea 
                                    placeholder="List qualifications, skills, and experience required..."
                                    className="min-h-28 resize-y"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Specify education, skills, certifications, etc.
                                </FormDescription>
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
                                    placeholder="List benefits like health insurance, paid time off, 401(k), etc."
                                    className="min-h-24 resize-y"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Describe perks and benefits to attract candidates
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </CardContent>
                      </Card>
                    </TabsContent>
                    
                    <TabsContent value="application" className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Application Information</CardTitle>
                          <CardDescription>
                            Set details for how candidates can apply
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
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
                                  <FormDescription>
                                    Last day candidates can apply for this position
                                  </FormDescription>
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
                                      placeholder="Email for application inquiries"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Email address for candidates to contact with questions
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="application-tips">
                              <AccordionTrigger>Application Tips</AccordionTrigger>
                              <AccordionContent>
                                <ul className="space-y-2 ml-5 list-disc">
                                  <li>Be clear about required versus preferred qualifications</li>
                                  <li>Specify how candidates should apply (e.g., through the platform, direct email)</li>
                                  <li>Set a reasonable deadline to ensure you get enough qualified applicants</li>
                                  <li>Consider including interview process details in the job description</li>
                                </ul>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        </CardContent>
                      </Card>
                      
                      <div className="flex justify-between gap-4 mt-8">
                        <Button 
                          variant="outline" 
                          type="button" 
                          onClick={() => form.reset()}
                        >
                          Reset Form
                        </Button>
                        <div className="flex gap-2">
                          <Button 
                            type="button" 
                            variant="outline"
                            onClick={() => setIsPreview(true)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </Button>
                          <Button 
                            type="submit"
                            disabled={createJobMutation.isPending}
                            className="gap-2"
                          >
                            <Save className="h-4 w-4" />
                            {createJobMutation.isPending ? "Posting..." : "Post Job"}
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </form>
              </Form>
            )}
          </>
        )}
      </div>
    </div>
  );
}