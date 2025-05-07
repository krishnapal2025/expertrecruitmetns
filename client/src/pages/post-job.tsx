import { useState, useEffect } from "react";
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
import { Briefcase, Building, Clock, DollarSign, MapPin, Save, Tag, Check } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  "Technology",
  "Finance",
  "Healthcare",
  "Education",
  "Marketing",
  "Engineering",
  "Sales",
  "Hospitality",
];

// Common job titles by category
const commonJobTitles = {
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
    "QA Engineer"
  ],
  "Finance": [
    "Financial Analyst",
    "Accountant",
    "Investment Banker",
    "Financial Advisor",
    "Risk Manager",
    "Compliance Officer",
    "Credit Analyst",
    "Tax Consultant",
    "Financial Controller"
  ],
  "Healthcare": [
    "Registered Nurse",
    "Physician Assistant",
    "Medical Doctor",
    "Healthcare Administrator",
    "Pharmacist",
    "Physical Therapist",
    "Medical Technologist",
    "Dentist",
    "Radiologist"
  ],
  "Education": [
    "Teacher",
    "Professor",
    "Academic Advisor",
    "School Principal",
    "Curriculum Developer",
    "Special Education Teacher",
    "Educational Consultant"
  ],
  "Marketing": [
    "Marketing Manager",
    "Social Media Specialist",
    "Digital Marketing Specialist",
    "SEO Expert",
    "Content Writer",
    "Brand Manager",
    "Public Relations Specialist"
  ],
  "Engineering": [
    "Civil Engineer",
    "Mechanical Engineer",
    "Electrical Engineer",
    "Chemical Engineer",
    "Aerospace Engineer",
    "Environmental Engineer",
    "Structural Engineer"
  ],
  "Sales": [
    "Sales Representative",
    "Account Executive",
    "Sales Manager",
    "Business Development Manager",
    "Customer Success Manager",
    "Territory Manager",
    "Inside Sales Representative"
  ],
  "Hospitality": [
    "Hotel Manager",
    "Event Coordinator",
    "Chef",
    "Restaurant Manager",
    "Concierge",
    "Catering Manager",
    "Tourism Guide"
  ]
};

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

// Common skills by category
const commonSkills = {
  "Technology": [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "Java",
    "AWS",
    "Docker",
    "Kubernetes",
    "SQL",
    "NoSQL",
    "TypeScript",
    "Go",
    "C#",
    "PHP",
    "Ruby",
    "Swift",
    "Linux",
    "Git",
    "CI/CD",
    "HTML/CSS"
  ],
  "Finance": [
    "Financial Analysis",
    "QuickBooks",
    "Excel",
    "SAP",
    "Oracle Financials",
    "Bloomberg Terminal",
    "Financial Modeling",
    "Forecasting",
    "Budgeting",
    "Risk Assessment",
    "CFA",
    "GAAP",
    "IFRS",
    "Tax Preparation",
    "Financial Reporting"
  ],
  "Healthcare": [
    "Electronic Medical Records (EMR)",
    "Patient Care",
    "Medical Billing",
    "CPR",
    "HIPAA Compliance",
    "Medical Terminology",
    "Epic Systems",
    "Cerner",
    "Phlebotomy",
    "ICD-10 Coding",
    "Vital Signs",
    "Patient Assessment",
    "Clinical Documentation"
  ],
  "Marketing": [
    "Google Analytics",
    "Social Media Management",
    "SEO",
    "Content Marketing",
    "Adobe Creative Suite",
    "Email Marketing",
    "Google Ads",
    "Facebook Ads",
    "CRM Software",
    "Copywriting",
    "Market Research",
    "Brand Development",
    "Graphic Design",
    "Video Production",
    "WordPress"
  ],
  "Engineering": [
    "AutoCAD",
    "SolidWorks",
    "MATLAB",
    "PLC Programming",
    "Structural Analysis",
    "HVAC Design",
    "Electrical Design",
    "Civil 3D",
    "Finite Element Analysis",
    "GIS",
    "Project Management",
    "Blueprint Reading",
    "Quality Control",
    "Prototyping"
  ],
  "Sales": [
    "CRM Software",
    "Negotiation",
    "Cold Calling",
    "Account Management",
    "Salesforce",
    "HubSpot",
    "Product Demonstrations",
    "Lead Generation",
    "Sales Forecasting",
    "Client Relationship Management",
    "B2B Sales",
    "B2C Sales",
    "Solution Selling",
    "Contract Negotiation"
  ],
  "Education": [
    "Curriculum Development",
    "Classroom Management",
    "Student Assessment",
    "LMS Platforms",
    "Google Classroom",
    "Blackboard",
    "Canvas",
    "Differentiated Instruction",
    "IEP Development",
    "Educational Technology",
    "Lesson Planning",
    "Student Counseling"
  ],
  "Hospitality": [
    "Hotel Management Software",
    "POS Systems",
    "Customer Service",
    "Event Planning",
    "Food Safety",
    "Inventory Management",
    "Reservation Systems",
    "Guest Relations",
    "Menu Planning",
    "Catering Management",
    "Wine Knowledge",
    "Resort Management"
  ]
};

// Function to get currency symbol based on location
const getCurrencySymbol = (location: string): string => {
  if (!location) return '$'; // Default USD
  
  if (location.includes("India")) return '₹'; // Indian Rupee
  if (location.includes("UAE")) return 'د.إ'; // UAE Dirham
  if (location.includes("UK")) return '£'; // British Pound
  if (location.includes("Europe") || location.includes("France") || location.includes("Germany")) return '€'; // Euro
  if (location.includes("Canada")) return 'C$'; // Canadian Dollar
  if (location.includes("Australia")) return 'A$'; // Australian Dollar
  
  return '$'; // Default USD
};

// Function to get location-specific salary ranges (monthly figures)
const getSalaryRangesByLocation = (location: string) => {
  // Default ranges in USD (annual salaries)
  if (!location || location.includes("USA") || location.includes("United States")) {
    return [
      { label: "Entry Level", min: 2500, max: 4200, period: "monthly" },
      { label: "Junior", min: 4200, max: 6700, period: "monthly" },
      { label: "Mid-Level", min: 6700, max: 10000, period: "monthly" },
      { label: "Senior", min: 10000, max: 15000, period: "monthly" },
      { label: "Expert/Leadership", min: 15000, max: 20800, period: "monthly" },
      { label: "Executive", min: 20800, max: 41600, period: "monthly" },
    ];
  }
  
  // Indian Rupee (INR) - converted to appropriate scales
  else if (location.includes("India")) {
    return [
      { label: "Entry Level", min: 25000, max: 50000, period: "monthly" },
      { label: "Junior", min: 50000, max: 100000, period: "monthly" },
      { label: "Mid-Level", min: 100000, max: 200000, period: "monthly" },
      { label: "Senior", min: 200000, max: 400000, period: "monthly" },
      { label: "Expert/Leadership", min: 400000, max: 670000, period: "monthly" },
      { label: "Executive", min: 670000, max: 1700000, period: "monthly" },
    ];
  }
  
  // UAE Dirham (AED)
  else if (location.includes("UAE")) {
    return [
      { label: "Entry Level", min: 5000, max: 10000, period: "monthly" },
      { label: "Junior", min: 10000, max: 15000, period: "monthly" },
      { label: "Mid-Level", min: 15000, max: 25000, period: "monthly" },
      { label: "Senior", min: 25000, max: 40000, period: "monthly" },
      { label: "Expert/Leadership", min: 40000, max: 58000, period: "monthly" },
      { label: "Executive", min: 58000, max: 125000, period: "monthly" },
    ];
  }
  
  // British Pound (GBP)
  else if (location.includes("UK")) {
    return [
      { label: "Entry Level", min: 2100, max: 2900, period: "monthly" },
      { label: "Junior", min: 2900, max: 4200, period: "monthly" },
      { label: "Mid-Level", min: 4200, max: 5800, period: "monthly" },
      { label: "Senior", min: 5800, max: 8300, period: "monthly" },
      { label: "Expert/Leadership", min: 8300, max: 12500, period: "monthly" },
      { label: "Executive", min: 12500, max: 29000, period: "monthly" },
    ];
  }
  
  // Euro (EUR)
  else if (location.includes("Europe") || location.includes("France") || location.includes("Germany")) {
    return [
      { label: "Entry Level", min: 2500, max: 3700, period: "monthly" },
      { label: "Junior", min: 3700, max: 5000, period: "monthly" },
      { label: "Mid-Level", min: 5000, max: 7100, period: "monthly" },
      { label: "Senior", min: 7100, max: 10000, period: "monthly" },
      { label: "Expert/Leadership", min: 10000, max: 15000, period: "monthly" },
      { label: "Executive", min: 15000, max: 29000, period: "monthly" },
    ];
  }
  
  // Canadian Dollar (CAD)
  else if (location.includes("Canada")) {
    return [
      { label: "Entry Level", min: 3300, max: 5000, period: "monthly" },
      { label: "Junior", min: 5000, max: 7100, period: "monthly" },
      { label: "Mid-Level", min: 7100, max: 10000, period: "monthly" },
      { label: "Senior", min: 10000, max: 13300, period: "monthly" },
      { label: "Expert/Leadership", min: 13300, max: 18300, period: "monthly" },
      { label: "Executive", min: 18300, max: 37500, period: "monthly" },
    ];
  }
  
  // Australian Dollar (AUD)
  else if (location.includes("Australia")) {
    return [
      { label: "Entry Level", min: 4200, max: 5800, period: "monthly" },
      { label: "Junior", min: 5800, max: 7500, period: "monthly" },
      { label: "Mid-Level", min: 7500, max: 10000, period: "monthly" },
      { label: "Senior", min: 10000, max: 13300, period: "monthly" },
      { label: "Expert/Leadership", min: 13300, max: 18300, period: "monthly" },
      { label: "Executive", min: 18300, max: 37500, period: "monthly" },
    ];
  }
  
  // Default to USD for all other locations (monthly salaries)
  else {
    return [
      { label: "Entry Level", min: 2500, max: 4200, period: "monthly" },
      { label: "Junior", min: 4200, max: 6700, period: "monthly" },
      { label: "Mid-Level", min: 6700, max: 10000, period: "monthly" },
      { label: "Senior", min: 10000, max: 15000, period: "monthly" },
      { label: "Expert/Leadership", min: 15000, max: 20800, period: "monthly" },
      { label: "Executive", min: 20800, max: 41600, period: "monthly" },
    ];
  }
};

export default function PostJobPage() {
  const { currentUser, refetchUser } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isPreview, setIsPreview] = useState(false);
  const [companyName, setCompanyName] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [requirementsText, setRequirementsText] = useState<string>('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
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
  
  // Simple function to update company name
  const handleCompanyNameChange = (value: string) => {
    setCompanyName(value);
  };
  
  // Handle category change and reset job title suggestions
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    form.setValue('category', category);
    
    // Reset selected skills when category changes
    setSelectedSkills([]);
    
    // Clear requirements field if needed
    if (form.getValues("requirements")) {
      form.setValue("requirements", "");
    }
  };
  
  // Handle job title selection
  const handleJobTitleSelect = (title: string) => {
    form.setValue('title', title);
  };
  
  // Handle salary range selection
  const handleSalaryRangeSelect = (range: {min: number, max: number, period?: string}) => {
    // Ensure we're setting numeric values and handle any potential null cases
    const minSalary = range.min || 0;
    const maxSalary = range.max || 0;
    
    console.log(`Setting salary range: ${minSalary} - ${maxSalary}`);
    
    // Set the values in the form
    form.setValue('minSalary', minSalary);
    form.setValue('maxSalary', maxSalary);
  };
  
  // Handle skill selection and update requirements field
  const handleSkillToggle = (skill: string) => {
    let updatedSkills: string[];
    
    if (selectedSkills.includes(skill)) {
      // Remove skill if already selected
      updatedSkills = selectedSkills.filter(s => s !== skill);
    } else {
      // Add skill if not already selected
      updatedSkills = [...selectedSkills, skill];
    }
    
    setSelectedSkills(updatedSkills);
    
    // Generate requirements text based on selected skills
    if (updatedSkills.length > 0) {
      const skillsText = updatedSkills.join(', ');
      const currentText = form.getValues('requirements') || '';
      
      // Only update if no skills are already included or if requirements field is empty
      if (!currentText.includes('Required skills:')) {
        const newRequirements = `Required skills: ${skillsText}\n\n${currentText}`;
        form.setValue('requirements', newRequirements.trim());
        setRequirementsText(newRequirements.trim());
      } else {
        // Replace existing skills list
        const newRequirements = currentText.replace(
          /Required skills:.*(?=\n|$)/,
          `Required skills: ${skillsText}`
        );
        form.setValue('requirements', newRequirements.trim());
        setRequirementsText(newRequirements.trim());
      }
    }
  };

  // Create job mutation
  const createJobMutation = useMutation({
    mutationFn: async (data: JobPostFormValues) => {
      // Re-check authentication status before submission
      // This helps ensure the session is still valid
      try {
        console.log("Verifying authentication before POST request...");
        const userCheckRes = await fetch('/api/user', { 
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        // If not authenticated, throw error to prevent job submission
        if (!userCheckRes.ok || userCheckRes.status === 401) {
          console.error("Authentication check failed before job submission");
          throw new Error("Your session has expired. Please refresh the page and login again.");
        }
        
        const user = await userCheckRes.json();
        console.log("Authentication confirmed before request");
        
        // Create a clean job payload with explicit string/number handling and null safety
        // This ensures consistent data types are sent to the server and matches our schema validation
        const payload = {
          // Required fields with trimming
          title: data.title?.trim() || "",
          company: user.user.userType === "admin" && companyName ? 
            companyName.trim() : data.company?.trim() || "",
          location: data.location?.trim() || "",
          category: data.category?.trim() || "",
          jobType: data.jobType?.trim() || "",
          description: data.description?.trim() || "",
          
          // Additional fields - use empty strings to avoid null constraint errors
          requirements: data.requirements?.trim() || "",
          benefits: data.benefits?.trim() || "",
          experience: data.experience?.trim() || "",
          
          // Numeric fields - ensure they are actual numbers and positive
          minSalary: Math.max(0, isNaN(Number(data.minSalary)) ? 0 : Number(data.minSalary)),
          maxSalary: Math.max(0, isNaN(Number(data.maxSalary)) ? 0 : Number(data.maxSalary)),
          
          // Email with validation 
          contactEmail: data.contactEmail?.trim() || "",
          
          // Date field handling - ensure proper format
          applicationDeadline: typeof data.applicationDeadline === 'object' 
            ? (data.applicationDeadline as Date).toISOString().split('T')[0]
            : (data.applicationDeadline?.trim() || new Date().toISOString().split('T')[0]),
          
          // Optional fields with null safety - we won't allow null values for now to prevent errors
          specialization: data.specialization?.trim() || "",
          
          // If we're admin posting on behalf of company, we don't need employerId
          employerId: currentUser?.user.userType === "employer" ? currentUser?.user.id : null
        };
        
        console.log("Submitting job with clean payload:", payload);
        
        // Double-check the main required fields to avoid server errors
        const requiredFields = [
          'title', 'company', 'location', 'category', 'jobType', 'description', 
          'minSalary', 'maxSalary', 'contactEmail', 'applicationDeadline'
        ];
        
        for (const field of requiredFields) {
          if (!payload[field as keyof typeof payload]) {
            throw new Error(`${field} is required but appears to be missing or empty`);
          }
        }
        
        const res = await apiRequest("POST", "/api/jobs", payload);
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Failed to create job");
        }
        return await res.json();
      } catch (error) {
        console.error("Error during job submission:", error);
        throw error;
      }
    },
    onSuccess: (data) => {
      toast({
        title: "Job Posted Successfully",
        description: "Your job has been posted and is now visible in the Post Manager and Jobs Found sections.",
      });
      
      // Invalidate all queries related to jobs to ensure immediate visibility
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/employer/jobs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/realtime/jobs"] });
      
      // Redirect to post manager instead of job board so admin can see and manage the new job
      setLocation("/post-manager");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Post Job",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  const onSubmit = async (data: JobPostFormValues) => {
    // Check if the user is authenticated
    if (!currentUser) {
      // Try to refresh the session before giving up
      try {
        console.log("Attempting to refresh user session before job submission");
        const refreshedUser = await refetchUser();
        if (!refreshedUser) {
          toast({
            title: "Authentication Required",
            description: "You must be logged in to post a job.",
            variant: "destructive",
          });
          return;
        }
        console.log("Successfully refreshed user session:", refreshedUser);
      } catch (error) {
        console.error("Failed to refresh user session:", error);
        toast({
          title: "Authentication Required",
          description: "You must be logged in to post a job. Please refresh the page and try again.",
          variant: "destructive",
        });
        return;
      }
    }

    // Re-check authentication after potential refresh
    if (!currentUser) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to post a job.",
        variant: "destructive",
      });
      return;
    }

    // Check if admin has entered a company name
    if (currentUser.user.userType === "admin" && !companyName.trim()) {
      toast({
        title: "Company Name Required",
        description: "Please enter a company name before posting a job.",
        variant: "destructive",
      });
      return;
    }
    
    // Perform client-side validation for required fields
    const requiredFields = [
      { field: 'title', label: 'Job Title' },
      { field: 'company', label: 'Company Name' },
      { field: 'location', label: 'Location' },
      { field: 'category', label: 'Category' },
      { field: 'jobType', label: 'Job Type' },
      { field: 'description', label: 'Description' }
    ];
    
    const missingFields = requiredFields.filter(
      ({ field }) => !data[field as keyof JobPostFormValues]
    );
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Required Fields",
        description: `Please fill in the following required fields: ${missingFields.map(f => f.label).join(', ')}`,
        variant: "destructive",
      });
      return;
    }
    
    // Check numeric fields
    if (isNaN(Number(data.minSalary)) || Number(data.minSalary) <= 0) {
      toast({
        title: "Invalid Minimum Salary",
        description: "Please enter a valid minimum salary amount.",
        variant: "destructive",
      });
      return;
    }
    
    if (isNaN(Number(data.maxSalary)) || Number(data.maxSalary) <= 0) {
      toast({
        title: "Invalid Maximum Salary",
        description: "Please enter a valid maximum salary amount.",
        variant: "destructive",
      });
      return;
    }

    console.log("Form submission data:", data);
    console.log("Submitting job with user:", currentUser);
    
    // Log exactly what we're sending to the server for debugging
    const cleanData = {
      title: data.title?.trim() || "",
      company: currentUser.user.userType === "admin" ? 
        companyName.trim() : data.company?.trim() || "",
      location: data.location?.trim() || "",
      category: data.category?.trim() || "",
      jobType: data.jobType?.trim() || "",
      minSalary: isNaN(Number(data.minSalary)) ? 0 : Number(data.minSalary),
      maxSalary: isNaN(Number(data.maxSalary)) ? 0 : Number(data.maxSalary),
      description: data.description?.trim() || "",
      requirements: data.requirements?.trim() || "",
      benefits: data.benefits?.trim() || "",
      applicationDeadline: data.applicationDeadline || new Date().toISOString().split('T')[0],
      contactEmail: data.contactEmail?.trim() || "",
      experience: data.experience?.trim() || "",
      specialization: data.specialization?.trim() || null,
      employerId: currentUser?.user.userType === "employer" ? currentUser?.user.id : null
    };
    
    console.log("Clean data to be sent to server:", cleanData);
    // Use the cleanData instead of the raw form data for submission
    createJobMutation.mutate(cleanData as JobPostFormValues);
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
              You need to be logged in as an admin to post jobs. 
              <Button variant="link" onClick={() => setLocation("/admin-login")}>
                Sign in as admin
              </Button>
            </AlertDescription>
          </Alert>
        ) : (currentUser.user.userType !== "admin") ? (
          <Alert className="mb-6">
            <AlertTitle>Admin Account Required</AlertTitle>
            <AlertDescription>
              Only admin accounts can post jobs. Your current account does not have the necessary permissions.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Toggle between form and preview */}
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
              >
                Preview
              </Button>
            </div>
            
            {isPreview ? (
              // Job Preview
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-2xl font-bold">
                          {formValues.title || "[Job Title]"}
                        </CardTitle>
                        <div className="flex items-center mt-2">
                          <Building className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="text-gray-600">
                            {formValues.company || "[Company Name]"}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-flex items-center bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium">
                          {formValues.jobType || "Job Type"}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {formValues.location || "Location"}
                      </div>
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-1" />
                        {formValues.category || "Category"}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {formValues.experience || "Experience Level"}
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {formValues.location ? getCurrencySymbol(formValues.location) : "$"}
                        {(formValues.minSalary > 0 ? formValues.minSalary.toLocaleString() : "Min")} - 
                        {formValues.location ? getCurrencySymbol(formValues.location) : "$"}
                        {(formValues.maxSalary > 0 ? formValues.maxSalary.toLocaleString() : "Max")} per year
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Job Description</h3>
                      <p className="whitespace-pre-line">
                        {formValues.description || "Add a detailed description of the job responsibilities and expectations."}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                      <p className="whitespace-pre-line">
                        {formValues.requirements || "List the skills, qualifications, and experience required for this position."}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Benefits</h3>
                      <p className="whitespace-pre-line">
                        {formValues.benefits || "Describe the benefits, perks, and advantages of working in this role."}
                      </p>
                    </div>
                    
                    <div className="rounded-lg bg-gray-50 p-4 border">
                      <div className="font-medium mb-2">Application Information</div>
                      <div className="text-sm">
                        <p>
                          <span className="font-medium">Deadline:</span> {formValues.applicationDeadline ? new Date(formValues.applicationDeadline).toLocaleDateString() : "Not specified"}
                        </p>
                        <p>
                          <span className="font-medium">Contact:</span> {formValues.contactEmail || "Not specified"}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      onClick={() => {
                        form.handleSubmit(onSubmit)();
                      }}
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
                            {selectedCategory && (
                              <div className="mt-2">
                                <p className="text-sm text-muted-foreground mb-2">Suggested job titles for {selectedCategory}:</p>
                                <ScrollArea className="h-24 w-full rounded-md border p-2">
                                  <div className="flex flex-wrap gap-2">
                                    {commonJobTitles[selectedCategory as keyof typeof commonJobTitles]?.map((title) => (
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
                                onValueChange={(value) => {
                                  field.onChange(value);
                                  handleCategoryChange(value);
                                }} 
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
                      
                      {/* Salary Range Presets */}
                      <div className="bg-slate-50 p-3 rounded-md border">
                        <div className="text-sm font-medium mb-2">
                          Salary Range Presets {formValues.location && `(${formValues.location})`}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {getSalaryRangesByLocation(formValues.location || '').map((range, index) => (
                            <Button 
                              key={index}
                              type="button"
                              variant="outline"
                              size="sm"
                              className="text-xs justify-start"
                              onClick={() => handleSalaryRangeSelect(range)}
                            >
                              {range.label}: {getCurrencySymbol(formValues.location || '')}{range.min.toLocaleString()} - {getCurrencySymbol(formValues.location || '')}{range.max.toLocaleString()} monthly
                            </Button>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Click on a preset to automatically fill the monthly salary range based on {formValues.location ? formValues.location : "default"} salary standards
                        </p>
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
                            {selectedCategory && (
                              <div className="mt-2">
                                <p className="text-sm text-muted-foreground mb-2">Common skills for {selectedCategory}:</p>
                                <ScrollArea className="h-24 w-full rounded-md border p-2">
                                  <div className="flex flex-wrap gap-2">
                                    {commonSkills[selectedCategory as keyof typeof commonSkills]?.map((skill) => (
                                      <Badge 
                                        key={skill}
                                        variant={selectedSkills.includes(skill) ? "default" : "outline"}
                                        className="cursor-pointer"
                                        onClick={() => handleSkillToggle(skill)}
                                      >
                                        <span className="mr-1">{selectedSkills.includes(skill) ? <Check className="h-3 w-3" /> : null}</span>
                                        {skill}
                                      </Badge>
                                    ))}
                                  </div>
                                </ScrollArea>
                                <p className="text-xs text-muted-foreground mt-2">
                                  Click on skills to add them to requirements
                                </p>
                              </div>
                            )}
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
            )}
          </>
        )}
      </div>
    </div>
  );
}