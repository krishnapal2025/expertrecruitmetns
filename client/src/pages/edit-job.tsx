import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { insertJobSchema, Job } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar as CalendarIcon, Briefcase, FileText, Building, Loader2, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormError } from "@/components/ui/form-error";

// Job categories
const jobCategories = [
  "Accounting",
  "Administration",
  "Banking",
  "Business Development",
  "Construction",
  "Consulting",
  "Customer Service",
  "Education",
  "Engineering",
  "Finance",
  "Healthcare",
  "Human Resources",
  "Information Technology",
  "Legal",
  "Management",
  "Manufacturing",
  "Marketing",
  "Media",
  "Operations",
  "Project Management",
  "Research & Development",
  "Retail",
  "Sales",
  "Supply Chain",
  "Other"
];

// Job types
const jobTypes = [
  "Full-time",
  "Part-time",
  "Contract",
  "Temporary",
  "Internship",
  "Remote"
];

// Locations
const locations = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Pune",
  "Ahmedabad",
  "Gurgaon",
  "Noida",
  "Dubai",
  "Abu Dhabi",
  "Sharjah",
  "Ajman",
  "Ras Al Khaimah",
  "Remote"
];

// Specializations
const specializations = [
  "Administrative Support",
  "Architecture",
  "Art & Design",
  "Banking Operations",
  "Business Analysis",
  "Civil Engineering",
  "Cloud Computing",
  "Content Writing",
  "Customer Success",
  "Cybersecurity",
  "Data Analysis",
  "Data Science",
  "DevOps",
  "Digital Marketing",
  "Education & Training",
  "Electrical Engineering",
  "Event Management",
  "Financial Analysis",
  "Full Stack Development",
  "Graphic Design",
  "Healthcare Administration",
  "Human Resources",
  "Investment Banking",
  "IT Support",
  "Legal Services",
  "Logistics",
  "Management Consulting",
  "Manufacturing",
  "Market Research",
  "Mechanical Engineering",
  "Mobile Development",
  "Network Engineering",
  "Nursing",
  "Operations Management",
  "Pharmaceuticals",
  "Product Management",
  "Project Management",
  "Public Relations",
  "Quality Assurance",
  "Recruitment",
  "Sales & Business Development",
  "Social Media Management",
  "Software Engineering",
  "UI/UX Design",
  "Web Development"
];

// Experience levels
const experienceLevels = [
  "Entry Level",
  "1-3 years",
  "3-5 years",
  "5-7 years",
  "7-10 years",
  "10+ years",
  "Senior Level",
  "Executive"
];

// Form schema with validation
const formSchema = insertJobSchema.extend({
  applicationDeadline: z.date({
    required_error: "Application deadline is required",
    invalid_type_error: "Application deadline must be a valid date"
  })
});

type FormData = z.infer<typeof formSchema>;

export default function EditJobPage() {
  const { id } = useParams<{ id: string }>();
  const jobId = parseInt(id);
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined>(undefined);
  
  // Fetch job data
  const { data: jobData, isLoading: isLoadingJob } = useQuery<{ job: Job, employer: any }>({
    queryKey: ["/api/jobs", jobId],
    queryFn: async () => {
      const res = await apiRequest("GET", `/api/jobs/${jobId}`);
      if (!res.ok) throw new Error("Failed to fetch job details");
      return await res.json();
    },
    enabled: !isNaN(jobId)
  });
  
  const job = jobData?.job;
  
  // Set up form with default values from the job data
  const { 
    register, 
    handleSubmit, 
    setValue, 
    watch,
    formState: { errors, isSubmitting } 
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      company: "",
      location: "",
      jobType: "",
      category: "",
      specialization: "",
      experience: "",
      minSalary: 0,
      maxSalary: 0,
      description: "",
      requirements: "",
      benefits: "",
      applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    }
  });
  
  // Fill form with job data once loaded
  useEffect(() => {
    if (job) {
      setValue("title", job.title);
      setValue("company", job.company);
      setValue("location", job.location);
      setValue("jobType", job.jobType);
      setValue("category", job.category);
      setValue("specialization", job.specialization || "");
      setValue("experience", job.experience || "");
      setValue("minSalary", job.minSalary);
      setValue("maxSalary", job.maxSalary);
      setValue("description", job.description);
      setValue("requirements", job.requirements);
      setValue("benefits", job.benefits);
      
      const deadlineDate = new Date(job.applicationDeadline);
      setValue("applicationDeadline", deadlineDate);
      setDeadlineDate(deadlineDate);
    }
  }, [job, setValue]);
  
  // Update job mutation
  const updateJobMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await apiRequest("PUT", `/api/jobs/${jobId}`, data);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to update job");
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Job Updated",
        description: "Your job listing has been successfully updated.",
      });
      
      // Invalidate queries to refresh job listings
      queryClient.invalidateQueries({ queryKey: ["/api/employer/jobs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
      queryClient.invalidateQueries({ queryKey: ["/api/jobs", jobId] });
      
      // Redirect to jobs page
      setLocation("/post-manager");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to Update Job",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Form submission handler
  const onSubmit = async (data: FormData) => {
    updateJobMutation.mutate(data);
  };
  
  // Check if current user has permission to edit this job
  const userCanEdit = 
    // Employers can edit their own jobs
    (currentUser?.user.userType === "employer" && job?.employerId === currentUser?.profile.id) ||
    // Admins and super_admins can edit any job
    (currentUser?.user.userType === "admin" || currentUser?.user.userType === "super_admin");
  
  if (isLoadingJob) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Job Not Found</AlertTitle>
          <AlertDescription>
            The job you're trying to edit doesn't exist or has been removed.
            <div className="mt-4">
              <Button variant="outline" onClick={() => setLocation("/post-manager")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to My Jobs
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  if (!userCanEdit) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertTitle>Permission Denied</AlertTitle>
          <AlertDescription>
            You don't have permission to edit this job. You can only edit jobs that you have posted.
            <div className="mt-4">
              <Button variant="outline" onClick={() => setLocation("/post-manager")}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to My Jobs
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setLocation("/post-manager")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to My Jobs
          </Button>
          
          <h1 className="text-3xl font-bold">Edit Job</h1>
          <p className="text-gray-600 mt-1">
            Update your job listing with the most accurate information
          </p>
        </div>
      
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="h-5 w-5 mr-2" />
              Job Details
            </CardTitle>
            <CardDescription>
              Provide comprehensive details to attract the right candidates
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input 
                    id="title"
                    {...register("title")}
                    placeholder="e.g. Senior Software Engineer"
                  />
                  {errors.title && <FormError>{errors.title.message}</FormError>}
                </div>
                
                <div>
                  <Label htmlFor="company">Company Name</Label>
                  <Input 
                    id="company"
                    {...register("company")}
                    placeholder="e.g. Acme Corporation"
                  />
                  {errors.company && <FormError>{errors.company.message}</FormError>}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Job Category</Label>
                    <Select 
                      value={watch("category")}
                      onValueChange={(value) => setValue("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && <FormError>{errors.category.message}</FormError>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="jobType">Job Type</Label>
                    <Select 
                      value={watch("jobType")}
                      onValueChange={(value) => setValue("jobType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.jobType && <FormError>{errors.jobType.message}</FormError>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Select 
                      value={watch("location")}
                      onValueChange={(value) => setValue("location", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.location && <FormError>{errors.location.message}</FormError>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="specialization">Specialization</Label>
                    <Select 
                      value={watch("specialization")}
                      onValueChange={(value) => setValue("specialization", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        {specializations.map((spec) => (
                          <SelectItem key={spec} value={spec}>
                            {spec}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.specialization && <FormError>{errors.specialization.message}</FormError>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience Level</Label>
                    <Select 
                      value={watch("experience")}
                      onValueChange={(value) => setValue("experience", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        {experienceLevels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.experience && <FormError>{errors.experience.message}</FormError>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Application Deadline</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !deadlineDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {deadlineDate ? format(deadlineDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={deadlineDate}
                          onSelect={(date) => {
                            setDeadlineDate(date);
                            if (date) setValue("applicationDeadline", date);
                          }}
                          initialFocus
                          disabled={(date) => date < new Date()}
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.applicationDeadline && <FormError>{errors.applicationDeadline.message}</FormError>}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minSalary">Minimum Salary</Label>
                    <Input
                      id="minSalary"
                      type="number"
                      placeholder="e.g. 50000"
                      {...register("minSalary", { valueAsNumber: true })}
                    />
                    {errors.minSalary && <FormError>{errors.minSalary.message}</FormError>}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="maxSalary">Maximum Salary</Label>
                    <Input
                      id="maxSalary"
                      type="number"
                      placeholder="e.g. 80000"
                      {...register("maxSalary", { valueAsNumber: true })}
                    />
                    {errors.maxSalary && <FormError>{errors.maxSalary.message}</FormError>}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="description" className="flex items-center">
                    <FileText className="h-4 w-4 mr-2" />
                    Job Description
                  </Label>
                  <Textarea 
                    id="description"
                    {...register("description")}
                    placeholder="Describe the role, responsibilities, and expectations"
                    rows={6}
                  />
                  {errors.description && <FormError>{errors.description.message}</FormError>}
                </div>
                
                <div>
                  <Label htmlFor="requirements">Requirements</Label>
                  <Textarea 
                    id="requirements"
                    {...register("requirements")}
                    placeholder="List the skills, qualifications, and experience required"
                    rows={6}
                  />
                  {errors.requirements && <FormError>{errors.requirements.message}</FormError>}
                </div>
                
                <div>
                  <Label htmlFor="benefits">Benefits & Perks</Label>
                  <Textarea 
                    id="benefits"
                    {...register("benefits")}
                    placeholder="Describe the benefits, perks, and other offerings"
                    rows={4}
                  />
                  {errors.benefits && <FormError>{errors.benefits.message}</FormError>}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => setLocation("/post-manager")}
              >
                Cancel
              </Button>
              
              <Button 
                type="submit"
                disabled={isSubmitting || updateJobMutation.isPending}
              >
                {(isSubmitting || updateJobMutation.isPending) && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Update Job
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}