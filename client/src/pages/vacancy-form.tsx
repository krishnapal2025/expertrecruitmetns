import { Helmet } from "react-helmet";
import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { 
  Select, 
  SelectContent, 
  SelectGroup,
  SelectItem, 
  SelectLabel, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon, Briefcase, CheckCircle, User, Building, MapPin, CreditCard, Clock, ChevronRight, FileText } from "lucide-react";
import { Link } from "wouter";

// Create a schema for form validation
const vacancyFormSchema = z.object({
  companyName: z.string().min(2, { message: "Company name is required" }),
  contactName: z.string().min(2, { message: "Contact name is required" }),
  contactEmail: z.string().email({ message: "Please enter a valid email address" }),
  contactPhone: z.string().min(8, { message: "Phone number is required" }),
  jobTitle: z.string().min(2, { message: "Job title is required" }),
  jobDescription: z.string().min(10, { message: "Please provide a detailed job description" }),
  location: z.string().min(2, { message: "Location is required" }),
  industry: z.string().min(2, { message: "Industry is required" }),
  employmentType: z.string().min(1, { message: "Please select an employment type" }),
  currency: z.string().min(1, { message: "Please select a currency" }),
  salaryRange: z.string().optional(),
  requiredSkills: z.string().min(5, { message: "Please list the required skills" }),
  experienceLevel: z.string().min(1, { message: "Please select experience level" }),
  applicationDeadline: z.date({
    required_error: "Please select an application deadline",
  }),
  additionalInformation: z.string().optional(),
});

type VacancyFormValues = z.infer<typeof vacancyFormSchema>;

export default function VacancyFormPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // Initialize form with validation schema
  const form = useForm<VacancyFormValues>({
    resolver: zodResolver(vacancyFormSchema),
    defaultValues: {
      companyName: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      jobTitle: "",
      jobDescription: "",
      location: "",
      industry: "",
      employmentType: "",
      currency: "AED", // Default to UAE currency
      salaryRange: "",
      requiredSkills: "",
      experienceLevel: "",
      additionalInformation: "",
    },
  });

  // Handle form submission
  const onSubmit = async (data: VacancyFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Convert data.applicationDeadline to ISO string
      const formData = {
        ...data,
        applicationDeadline: data.applicationDeadline.toISOString(),
        
        // Mapping from form field names to backend field names
        positionName: data.jobTitle, // Add position name field for admin dashboard compatibility
        experienceRequired: data.experienceLevel,
        skillsRequired: data.requiredSkills,
        requirements: data.employmentType + " - " + data.salaryRange,
      };
      
      // Make the actual API call to the backend
      const response = await fetch("/api/vacancy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit vacancy");
      }
      
      // Show success message
      toast({
        title: "Vacancy submitted successfully!",
        description: "Our team will review your vacancy request and contact you soon.",
        variant: "default",
      });
      
      // Reset form and set success state
      form.reset();
      setIsSuccess(true);
      window.scrollTo(0, 0);
    } catch (error) {
      console.error("Vacancy submission error:", error);
      toast({
        title: "Error submitting vacancy",
        description: error instanceof Error ? error.message : "There was a problem submitting your vacancy. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Industries list
  const industries = [
    "Banking & Finance",
    "Technology & IT",
    "Healthcare",
    "Retail & Consumer Goods",
    "Real Estate & Construction",
    "Oil & Gas",
    "Hospitality & Tourism",
    "Education",
    "Logistics & Supply Chain",
    "Government & Public Sector",
    "Media & Entertainment",
    "Manufacturing",
    "Telecommunications",
    "Legal Services",
    "Consulting",
    "Other"
  ];

  // Employment types
  const employmentTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Temporary",
    "Internship",
    "Remote"
  ];

  // Experience levels
  const experienceLevels = [
    "Entry level",
    "Junior (1-3 years)",
    "Mid-level (3-5 years)",
    "Senior (5-10 years)",
    "Executive (10+ years)"
  ];

  // Currency options
  const currencies = [
    { code: "AED", name: "UAE Dirham (AED)", country: "United Arab Emirates" },
    { code: "INR", name: "Indian Rupee (INR)", country: "India" },
    { code: "USD", name: "US Dollar (USD)", country: "United States" },
    { code: "GBP", name: "British Pound (GBP)", country: "United Kingdom" },
    { code: "EUR", name: "Euro (EUR)", country: "European Union" },
    { code: "SAR", name: "Saudi Riyal (SAR)", country: "Saudi Arabia" },
    { code: "QAR", name: "Qatari Riyal (QAR)", country: "Qatar" },
    { code: "KWD", name: "Kuwaiti Dinar (KWD)", country: "Kuwait" },
    { code: "SGD", name: "Singapore Dollar (SGD)", country: "Singapore" }
  ];

  // Get the selected currency
  const selectedCurrency = form.watch("currency") || "AED";

  // Salary ranges based on currency
  const getSalaryRanges = (currencyCode: string) => {
    switch(currencyCode) {
      case "AED":
        return [
          "Competitive",
          "Less than AED 5,000/month",
          "AED 5,000 - 10,000/month",
          "AED 10,000 - 15,000/month",
          "AED 15,000 - 20,000/month", 
          "AED 20,000 - 30,000/month",
          "AED 30,000 - 50,000/month",
          "Above AED 50,000/month",
          "Negotiable"
        ];
      case "INR":
        return [
          "Competitive",
          "Less than INR 50,000/month",
          "INR 50,000 - 100,000/month",
          "INR 100,000 - 200,000/month",
          "INR 200,000 - 300,000/month", 
          "INR 300,000 - 500,000/month",
          "Above INR 500,000/month",
          "Negotiable"
        ];
      case "USD":
        return [
          "Competitive",
          "Less than USD 3,000/month",
          "USD 3,000 - 5,000/month",
          "USD 5,000 - 8,000/month",
          "USD 8,000 - 12,000/month", 
          "USD 12,000 - 18,000/month",
          "Above USD 18,000/month",
          "Negotiable"
        ];
      case "GBP":
        return [
          "Competitive",
          "Less than GBP 2,500/month",
          "GBP 2,500 - 4,000/month",
          "GBP 4,000 - 6,000/month",
          "GBP 6,000 - 9,000/month", 
          "GBP 9,000 - 15,000/month",
          "Above GBP 15,000/month",
          "Negotiable"
        ];
      case "EUR":
        return [
          "Competitive",
          "Less than EUR 3,000/month",
          "EUR 3,000 - 5,000/month",
          "EUR 5,000 - 7,000/month",
          "EUR 7,000 - 10,000/month", 
          "EUR 10,000 - 15,000/month",
          "Above EUR 15,000/month",
          "Negotiable"
        ];
      case "SAR":
        return [
          "Competitive",
          "Less than SAR 5,000/month",
          "SAR 5,000 - 10,000/month",
          "SAR 10,000 - 15,000/month",
          "SAR 15,000 - 25,000/month", 
          "SAR 25,000 - 40,000/month",
          "Above SAR 40,000/month",
          "Negotiable"
        ];
      case "QAR":
        return [
          "Competitive",
          "Less than QAR 5,000/month",
          "QAR 5,000 - 10,000/month",
          "QAR 10,000 - 15,000/month",
          "QAR 15,000 - 25,000/month", 
          "QAR 25,000 - 40,000/month",
          "Above QAR 40,000/month",
          "Negotiable"
        ];
      case "KWD":
        return [
          "Competitive",
          "Less than KWD 1,000/month",
          "KWD 1,000 - 2,000/month",
          "KWD 2,000 - 3,000/month",
          "KWD 3,000 - 5,000/month", 
          "KWD 5,000 - 8,000/month",
          "Above KWD 8,000/month",
          "Negotiable"
        ];
      case "SGD":
        return [
          "Competitive",
          "Less than SGD 3,000/month",
          "SGD 3,000 - 5,000/month",
          "SGD 5,000 - 8,000/month",
          "SGD 8,000 - 12,000/month", 
          "SGD 12,000 - 18,000/month",
          "Above SGD 18,000/month",
          "Negotiable"
        ];
      default:
        return [
          "Competitive",
          "Entry Level",
          "Mid Level",
          "Senior Level",
          "Executive Level",
          "Negotiable"
        ];
    }
  };

  // Get salary ranges based on selected currency
  const salaryRanges = getSalaryRanges(selectedCurrency);

  return (
    <>
      <Helmet>
        <title>Submit a Vacancy | Expert Recruitments</title>
        <meta name="description" content="Submit your vacancy requirements to Expert Recruitments and let us find the perfect talent for your organization." />
      </Helmet>

      <div className="container mx-auto px-4 py-12 md:py-20">
        {isSuccess ? (
          <motion.div 
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-lg border-none bg-gradient-to-r from-white to-gray-50">
              <CardContent className="pt-10 pb-10 px-8 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <CardTitle className="text-2xl md:text-3xl mb-6">Vacancy Submitted Successfully!</CardTitle>
                <p className="text-gray-600 mb-8 text-lg">
                  Thank you for submitting your vacancy details. Our expert recruitment team will review your requirements and contact you shortly to discuss the next steps in finding the perfect talent for your organization.
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => setIsSuccess(false)} 
                    className="bg-[#5372f1] hover:bg-[#4060e0]"
                  >
                    Submit Another Vacancy
                  </Button>
                  <Link href="/">
                    <Button variant="outline">
                      Return to Home Page
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div 
            className="max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants} className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Submit a Vacancy</h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Fill in the details below to let us know about your hiring needs. Our expert recruitment team will help you find the perfect talent for your organization.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="shadow-lg border-none">
                <CardHeader className="bg-gradient-to-r from-[#5372f1]/10 to-transparent rounded-t-lg">
                  <CardTitle className="flex items-center text-2xl">
                    <Briefcase className="mr-2 h-6 w-6 text-[#5372f1]" />
                    Vacancy Details
                  </CardTitle>
                  <CardDescription>
                    Please provide detailed information about your vacancy to help us find the best candidates.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      {/* Company Information Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                          <Building className="mr-2 h-5 w-5 text-[#5372f1]" />
                          Company Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company Name*</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your company name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="industry"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Industry*</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select industry" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="max-h-[300px]">
                                    <SelectGroup>
                                      <SelectLabel>Industries</SelectLabel>
                                      {industries.map((industry) => (
                                        <SelectItem key={industry} value={industry}>
                                          {industry}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Contact Information Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                          <User className="mr-2 h-5 w-5 text-[#5372f1]" />
                          Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="contactName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Contact Person*</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter contact person's name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="contactPhone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number*</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your phone number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="contactEmail"
                            render={({ field }) => (
                              <FormItem className="md:col-span-2">
                                <FormLabel>Email Address*</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your email address" type="email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Job Details Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                          <FileText className="mr-2 h-5 w-5 text-[#5372f1]" />
                          Job Details
                        </h3>
                        <div className="grid grid-cols-1 gap-6">
                          <FormField
                            control={form.control}
                            name="jobTitle"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Job Title*</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter the job title" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                              control={form.control}
                              name="location"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Location*</FormLabel>
                                  <FormControl>
                                    <div className="relative">
                                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                                      <Input className="pl-9" placeholder="e.g., Dubai, UAE" {...field} />
                                    </div>
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="employmentType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Employment Type*</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select employment type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectGroup>
                                        {employmentTypes.map((type) => (
                                          <SelectItem key={type} value={type}>
                                            {type}
                                          </SelectItem>
                                        ))}
                                      </SelectGroup>
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
                              name="experienceLevel"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Experience Level*</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select experience level" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectGroup>
                                        {experienceLevels.map((level) => (
                                          <SelectItem key={level} value={level}>
                                            {level}
                                          </SelectItem>
                                        ))}
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={form.control}
                              name="salaryRange"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Salary Range</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select salary range" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      <SelectGroup>
                                        {salaryRanges.map((range) => (
                                          <SelectItem key={range} value={range}>
                                            {range}
                                          </SelectItem>
                                        ))}
                                      </SelectGroup>
                                    </SelectContent>
                                  </Select>
                                  <FormDescription>
                                    This information helps attract suitable candidates
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <FormField
                            control={form.control}
                            name="applicationDeadline"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>Application Deadline*</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={`w-full pl-3 text-left font-normal ${
                                          !field.value ? "text-muted-foreground" : ""
                                        }`}
                                      >
                                        {field.value ? (
                                          format(field.value, "PPP")
                                        ) : (
                                          <span>Select a date</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) =>
                                        date < new Date(new Date().setHours(0, 0, 0, 0))
                                      }
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="jobDescription"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Job Description*</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Provide a detailed description of the role, responsibilities, and requirements" 
                                    className="min-h-[120px]" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  Include key responsibilities, daily tasks, and reporting structure
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="requiredSkills"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Required Skills*</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="List the technical skills, qualifications, and competencies required for this role" 
                                    className="min-h-[100px]" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  Separate different skills with commas
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="additionalInformation"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Additional Information</FormLabel>
                                <FormControl>
                                  <Textarea 
                                    placeholder="Provide any additional details that might help us understand your requirements better" 
                                    className="min-h-[100px]" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormDescription>
                                  Company benefits, work culture, growth opportunities, etc.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <CardFooter className="flex justify-between px-0 pt-4">
                        <Button type="button" variant="outline" onClick={() => form.reset()}>
                          Reset Form
                        </Button>
                        <Button 
                          type="submit" 
                          className="bg-[#5372f1] hover:bg-[#4060e0]"
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? (
                            <>
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-opacity-50 border-t-transparent"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              Submit Vacancy
                              <ChevronRight className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="mt-8 text-sm text-center text-gray-500">
              <p>By submitting this form, you agree to our <Link href="/privacy-policy" className="text-[#5372f1] hover:underline">Privacy Policy</Link> and <Link href="/terms" className="text-[#5372f1] hover:underline">Terms of Service</Link>.</p>
            </motion.div>
          </motion.div>
        )}
      </div>
    </>
  );
}