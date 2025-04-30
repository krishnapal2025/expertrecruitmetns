import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Helmet } from "react-helmet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
//import { useAuth } from "@/hooks/use-auth";
import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Copy, Download, Edit, File, FileText, Loader2, Printer, Save, Trash2 } from "lucide-react";

// Resume form schema
const resumeFormSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  address: z.string(),
  city: z.string(),
  country: z.string(),
  professionalSummary: z.string().min(50, { 
    message: "Please provide a professional summary of at least 50 characters" 
  }),
  workExperiences: z.array(
    z.object({
      id: z.string(),
      company: z.string().min(1, { message: "Company name is required" }),
      position: z.string().min(1, { message: "Position is required" }),
      startDate: z.string().min(1, { message: "Start date is required" }),
      endDate: z.string().optional(),
      currentlyWorking: z.boolean().default(false),
      description: z.string().min(20, { 
        message: "Please provide a description of at least 20 characters" 
      })
    })
  ),
  educations: z.array(
    z.object({
      id: z.string(),
      institution: z.string().min(1, { message: "Institution name is required" }),
      degree: z.string().min(1, { message: "Degree is required" }),
      fieldOfStudy: z.string().min(1, { message: "Field of study is required" }),
      graduationDate: z.string().min(1, { message: "Graduation date is required" }),
      description: z.string().optional()
    })
  ),
  skills: z.string().min(5, { message: "Please list your skills" }),
  additionalInfo: z.string().optional()
});

// We've removed the template options since we're using a single professional template

export default function CreateResumePage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  const [isGenerating, setIsGenerating] = useState(false);
  const [resumeGenerated, setResumeGenerated] = useState(true); // Set to true to enable the Preview tab
  const [finalResumeGenerated, setFinalResumeGenerated] = useState(true); // Set to true to enable the Final Resume tab
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<string | null>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formKey, setFormKey] = useState(Date.now()); // Key to force form re-render

  // We'll move this effect after the form is initialized

  // Function to save form data to localStorage
  const saveFormData = () => {
    try {
      setIsSaving(true);
      // Get current form values
      const formData = form.getValues();
      // Save to localStorage
      localStorage.setItem('resumeFormData', JSON.stringify(formData));
      
      toast({
        title: "Form Data Saved",
        description: "Your resume information has been saved locally.",
        variant: "default",
      });
      
      setTimeout(() => {
        setIsSaving(false);
      }, 1000);
    } catch (error) {
      console.error("Error saving form data:", error);
      setIsSaving(false);
      
      toast({
        title: "Error Saving Data",
        description: "There was a problem saving your data. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Create a random ID helper
  const generateId = () => Math.random().toString(36).substring(2, 9);
  
  // Sample professional summaries for different careers 
  const sampleSummaries = {
    "default": "Detail-oriented professional with over 5 years of experience in delivering high-quality results in fast-paced environments. Skilled in problem-solving, team collaboration, and adapting to new challenges quickly.",
    "software": "Innovative software developer with 5+ years of experience building scalable applications. Proficient in multiple programming languages and frameworks with a passion for clean, maintainable code and excellent problem-solving skills.",
    "marketing": "Results-driven marketing professional with proven success in developing and executing comprehensive marketing strategies. Skilled in digital marketing, content creation, and analytics with a track record of driving engagement and conversion.",
    "finance": "Strategic finance professional with expertise in financial analysis, reporting, and forecasting. Experienced in optimizing financial operations and providing actionable insights to support business growth and profitability.",
    "sales": "Dynamic sales professional with a consistent history of exceeding targets and building strong client relationships. Skilled in consultative selling, negotiation, and developing tailored solutions to meet client needs."
  };

  // Sample job descriptions
  const sampleJobs = [
    {
      id: generateId(),
      company: "Tech Innovations Inc.",
      position: "Senior Developer",
      startDate: "2020-01",
      endDate: "",
      currentlyWorking: true,
      description: "Lead development team in creating scalable web applications. Implemented microservices architecture that improved system reliability by 40%. Mentored junior developers and introduced modern CI/CD practices."
    },
    {
      id: generateId(),
      company: "Digital Solutions LLC",
      position: "Web Developer",
      startDate: "2017-03",
      endDate: "2019-12",
      currentlyWorking: false,
      description: "Developed responsive web applications for clients across various industries. Collaborated with design team to implement user-friendly interfaces. Optimized database queries resulting in 30% faster page loads."
    }
  ];
  
  // Sample education entries
  const sampleEducation = [
    {
      id: generateId(),
      institution: "University of Technology",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      graduationDate: "2017",
      description: "Graduated with honors. Specialized in software engineering and data structures. Participated in coding competitions and hackathons."
    }
  ];

  // Initialize the form with defaults
  const form = useForm<z.infer<typeof resumeFormSchema>>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      professionalSummary: sampleSummaries.default,
      workExperiences: sampleJobs,
      educations: sampleEducation,
      skills: "JavaScript, React, TypeScript, Node.js, SQL, Git, Agile Development, Team Leadership, Problem Solving, UI/UX Design",
      additionalInfo: "",
    },
  });
  
  // Setup field arrays for work experiences and education
  const { fields: workFields, append: appendWork, remove: removeWork } = 
    useFieldArray({
      control: form.control,
      name: "workExperiences"
    });
    
  const { fields: educationFields, append: appendEducation, remove: removeEducation } = 
    useFieldArray({
      control: form.control,
      name: "educations"
    });
    
  // Function to add a new work experience
  const addWorkExperience = () => {
    appendWork({
      id: generateId(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      description: ""
    });
  };
  
  // Function to add a new education entry
  const addEducation = () => {
    appendEducation({
      id: generateId(),
      institution: "",
      degree: "",
      fieldOfStudy: "",
      graduationDate: "",
      description: ""
    });
  };
  
  // Effect to load saved form data from localStorage when component mounts
  useEffect(() => {
    try {
      const savedFormData = localStorage.getItem('resumeFormData');
      if (savedFormData) {
        const parsedData = JSON.parse(savedFormData);
        console.log("Loading saved form data from localStorage");
        // Use form.reset instead of form.setValue to reset the entire form
        form.reset(parsedData);
        
        // Force a re-render of the form
        setFormKey(Date.now());
      }
    } catch (error) {
      console.error("Error loading form data from localStorage:", error);
    }
  }, [form]);

  // Handle form submission for preview
  const handleCreatePreview = async (data: any) => {
    try {
      console.log("Form is valid! Proceeding to preview...");
      
      // Save the form data to local storage to prevent data loss
      localStorage.setItem('resumeFormData', JSON.stringify(data));
      
      // Set state to indicate resume is generated
      setResumeGenerated(true);
      
      // This is important: we need to wait for the next render cycle before changing tabs
      setTimeout(() => {
        setActiveTab("preview");
      }, 200);
      
      toast({
        title: "Resume Preview Created",
        description: "Your resume details have been saved. You can now preview your resume.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error during form submission:", error);
      
      toast({
        title: "Something went wrong",
        description: "There was an error processing your form. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle generating the final resume
  const handleGenerateResume = () => {
    try {
      setIsGenerating(true);
      
      // Save the current form values as the final resume
      const resumeData = form.getValues();
      localStorage.setItem('finalResumeData', JSON.stringify(resumeData));
      
      // Simulate resume generation process with a brief delay for better UX
      setTimeout(() => {
        setIsGenerating(false);
        setFinalResumeGenerated(true);
        
        // Use another setTimeout to ensure state updates properly before tab change
        setTimeout(() => {
          setActiveTab("final");
        }, 100);
        
        toast({
          title: "Resume Generated Successfully",
          description: "Your professional resume has been created and is ready to download!",
          variant: "default",
        });
      }, 1500);
    } catch (error) {
      console.error("Error generating final resume:", error);
      setIsGenerating(false);
      
      toast({
        title: "Error Generating Resume",
        description: "There was a problem generating your resume. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle delete resume
  const handleDeleteResume = () => {
    setShowDeleteDialog(true);
  };
  
  // Confirm delete resume
  const confirmDeleteResume = () => {
    try {
      // Clear saved resume data from local storage
      localStorage.removeItem('resumeFormData');
      localStorage.removeItem('finalResumeData');
      
      // Reset the form
      form.reset({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        country: '',
        professionalSummary: '',
        workExperiences: [
          {
            id: generateId(),
            company: '',
            position: '',
            startDate: '',
            endDate: '',
            currentlyWorking: false,
            description: ''
          }
        ],
        educations: [
          {
            id: generateId(),
            institution: '',
            degree: '',
            fieldOfStudy: '',
            graduationDate: '',
            description: ''
          }
        ],
        skills: '',
        additionalInfo: ''
      });
      
      // Reset UI state
      setShowDeleteDialog(false);
      setFinalResumeGenerated(false);
      setResumeGenerated(false);
      setActiveTab("details");
      
      toast({
        title: "Resume Deleted",
        description: "Your resume has been deleted. You can create a new one.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error deleting resume:", error);
      setShowDeleteDialog(false);
      
      toast({
        title: "Error Deleting Resume",
        description: "There was a problem deleting your resume. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle download resume
  const handleDownloadResume = (format: string) => {
    try {
      setIsDownloading(true);
      setDownloadFormat(format);
      
      // Get current form data to ensure we have the latest version
      const resumeData = form.getValues();
      
      // Create a downloadable HTML content from the resume data
      // In a real app, this would call a proper resume generation/PDF service
      const fileName = `${resumeData.firstName}_${resumeData.lastName}_Resume.${format}`;
      
      // Simulate download process
      setTimeout(() => {
        setIsDownloading(false);
        setDownloadFormat(null);
        
        toast({
          title: `Resume Downloaded as ${format.toUpperCase()}`,
          description: `Your resume has been downloaded in ${format.toUpperCase()} format as "${fileName}".`,
          variant: "default",
        });
      }, 1500);
    } catch (error) {
      console.error("Error downloading resume:", error);
      setIsDownloading(false);
      setDownloadFormat(null);
      
      toast({
        title: "Error Downloading Resume",
        description: "There was a problem downloading your resume. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Handle edit resume
  const handleEditResume = () => {
    setIsEditMode(true);
    setActiveTab("details");
  };

  // Define tab change handler
  const handleTabChange = (value: string) => {
    // If trying to go to preview without valid data, prevent it
    if (value === "preview" && !resumeGenerated) {
      toast({
        title: "Submit Form First",
        description: "Please complete and submit the form before previewing.",
        variant: "destructive",
      });
      return;
    }
    
    // If trying to go to final without generating, prevent it
    if (value === "final" && !finalResumeGenerated) {
      toast({
        title: "Generate Resume First",
        description: "Please generate your resume from the preview page first.",
        variant: "destructive",
      });
      return;
    }
    
    setActiveTab(value);
  };

  return (
    <>
      <Helmet>
        <title>Create Resume | Expert Recruitments LLC</title>
        <meta name="description" content="Create a professional resume using our templates to enhance your job search" />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Create Your Professional Resume</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Stand out from the crowd with a professionally designed resume that highlights your skills and experience. 
              Our resume builder makes it easy to create, edit, and download your resume in minutes.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="details">Create Resume</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="final">Final Resume</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <Form {...form}>
                <div className="space-y-8">
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
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
                        control={form.control}
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
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="john.doe@example.com" {...field} />
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
                            <FormLabel>Phone</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter phone number (any format)" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter address (any format)" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter city name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Country</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter country (any format)" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-xl font-semibold mb-4">Professional Summary</h3>
                    <FormField
                      control={form.control}
                      name="professionalSummary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Summary</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Write a professional summary that highlights your experience and skills..." 
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            A compelling summary will help you stand out to recruiters.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">Work Experience</h3>
                      <Button
                        type="button"
                        onClick={addWorkExperience}
                        variant="outline"
                        size="sm"
                        className="text-[#5372f1]"
                      >
                        Add More
                      </Button>
                    </div>
                    
                    {workFields.map((field, index) => (
                      <div 
                        key={field.id} 
                        className="mb-8 p-4 border border-gray-200 rounded-md bg-gray-50 relative"
                      >
                        <div className="absolute right-2 top-2">
                          {index > 0 && (
                            <Button
                              type="button"
                              onClick={() => removeWork(index)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <FormField
                            control={form.control}
                            name={`workExperiences.${index}.company`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company</FormLabel>
                                <FormControl>
                                  <Input placeholder="Company name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`workExperiences.${index}.position`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Position</FormLabel>
                                <FormControl>
                                  <Input placeholder="Job title" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <FormField
                            control={form.control}
                            name={`workExperiences.${index}.startDate`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Start Date</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="month" 
                                    placeholder="YYYY-MM" 
                                    {...field} 
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          {!form.watch(`workExperiences.${index}.currentlyWorking`) && (
                            <FormField
                              control={form.control}
                              name={`workExperiences.${index}.endDate`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>End Date</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="month" 
                                      placeholder="YYYY-MM" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>
                        
                        <div className="mb-4">
                          <FormField
                            control={form.control}
                            name={`workExperiences.${index}.currentlyWorking`}
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    I currently work here
                                  </FormLabel>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name={`workExperiences.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Job Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Describe your responsibilities and achievements..."
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Use bullet points and numbers to highlight achievements. Focus on results, not just tasks.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">Education</h3>
                      <Button
                        type="button"
                        onClick={addEducation}
                        variant="outline"
                        size="sm"
                        className="text-[#5372f1]"
                      >
                        Add More
                      </Button>
                    </div>
                    
                    {educationFields.map((field, index) => (
                      <div 
                        key={field.id} 
                        className="mb-8 p-4 border border-gray-200 rounded-md bg-gray-50 relative"
                      >
                        <div className="absolute right-2 top-2">
                          {index > 0 && (
                            <Button
                              type="button"
                              onClick={() => removeEducation(index)}
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                            >
                              <Trash2 className="h-4 w-4" />
                              <span className="sr-only">Remove</span>
                            </Button>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <FormField
                            control={form.control}
                            name={`educations.${index}.institution`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Institution</FormLabel>
                                <FormControl>
                                  <Input placeholder="University or school name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`educations.${index}.degree`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Degree</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. Bachelor of Science" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <FormField
                            control={form.control}
                            name={`educations.${index}.fieldOfStudy`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Field of Study</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. Computer Science" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name={`educations.${index}.graduationDate`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Graduation Year</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. 2020" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={form.control}
                          name={`educations.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Additional Details (Optional)</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Honors, relevant coursework, thesis, etc."
                                  className="min-h-[100px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-xl font-semibold mb-4">Skills & Additional Information</h3>
                    
                    <div className="mb-6">
                      <FormField
                        control={form.control}
                        name="skills"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Skills</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="List your technical and soft skills, separated by commas..."
                                className="min-h-[100px]"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription>
                              Include both technical skills and soft skills relevant to your target role.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="additionalInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Information (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Certifications, awards, languages, volunteer work, etc."
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Use this section to include any other information that might be relevant to your application.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      type="button"
                      onClick={saveFormData}
                      variant="outline"
                      className="flex items-center space-x-2 text-[#5372f1]"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Progress
                        </>
                      )}
                    </Button>
                    <Button 
                      type="button"
                      onClick={form.handleSubmit(handleCreatePreview)}
                      className="bg-[#5372f1] hover:bg-[#4060e0]"
                    >
                      Create Resume Preview
                    </Button>
                  </div>
                </div>
              </Form>
            </TabsContent>
            
            <TabsContent value="preview">
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Resume Preview</h2>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <Printer className="h-4 w-4" />
                      <span>Print</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <Copy className="h-4 w-4" />
                      <span>Copy</span>
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-md p-8 max-w-4xl mx-auto bg-white shadow-sm">
                  <ScrollArea className="h-[600px] pr-4">
                    {/* This would be replaced with a proper resume preview template */}
                    <div className="resume-template resume-professional">
                      <div className="text-center mb-6">
                        <h1 className="text-3xl font-bold text-[#5372f1] mb-1">{form.getValues().firstName} {form.getValues().lastName}</h1>
                        <p className="text-gray-600">{form.getValues().address}, {form.getValues().city}, {form.getValues().country}</p>
                        <p className="text-gray-600">{form.getValues().email} | {form.getValues().phone}</p>
                      </div>
                      
                      <Separator className="my-6" />
                      
                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-[#5372f1] mb-3">Professional Summary</h2>
                        <p className="text-gray-700 whitespace-pre-wrap">{form.getValues().professionalSummary}</p>
                      </div>
                      
                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-[#5372f1] mb-3">Work Experience</h2>
                        {form.getValues().workExperiences.map((exp, index) => (
                          <div key={exp.id} className="mb-4 pb-4 border-b border-gray-200 last:border-b-0">
                            <div className="flex justify-between mb-1">
                              <h3 className="font-semibold text-lg">{exp.position}</h3>
                              <span className="text-gray-600 text-sm">
                                {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                              </span>
                            </div>
                            <div className="text-gray-700 mb-2">{exp.company}</div>
                            <p className="text-gray-600 whitespace-pre-wrap">{exp.description}</p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-[#5372f1] mb-3">Education</h2>
                        {form.getValues().educations.map((edu, index) => (
                          <div key={edu.id} className="mb-4 pb-4 border-b border-gray-200 last:border-b-0">
                            <div className="flex justify-between mb-1">
                              <h3 className="font-semibold text-lg">{edu.degree} in {edu.fieldOfStudy}</h3>
                              <span className="text-gray-600 text-sm">{edu.graduationDate}</span>
                            </div>
                            <div className="text-gray-700 mb-2">{edu.institution}</div>
                            {edu.description && (
                              <p className="text-gray-600 whitespace-pre-wrap">{edu.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-[#5372f1] mb-3">Skills</h2>
                        <p className="text-gray-700 whitespace-pre-wrap">{form.getValues().skills}</p>
                      </div>
                      
                      {form.getValues().additionalInfo && (
                        <div className="mb-6">
                          <h2 className="text-xl font-semibold text-[#5372f1] mb-3">Additional Information</h2>
                          <p className="text-gray-700 whitespace-pre-wrap">{form.getValues().additionalInfo}</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
                
                <div className="flex justify-between mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("details")}
                  >
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Edit Resume
                  </Button>
                  <Button 
                    onClick={handleGenerateResume}
                    disabled={isGenerating}
                    className="bg-[#5372f1] hover:bg-[#4060e0]"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        Generate Resume
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="final">
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-[#5372f1]">Your Completed Resume</h2>
                  <div className="flex space-x-3">
                    <Button 
                      onClick={handleEditResume}
                      variant="outline" 
                      className="flex items-center space-x-2"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit</span>
                    </Button>
                    <Button 
                      onClick={handleDeleteResume}
                      variant="outline" 
                      className="flex items-center space-x-2 border-red-200 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </Button>
                  </div>
                </div>
                
                <div className="border rounded-md p-8 max-w-4xl mx-auto bg-white shadow-sm mb-8" ref={resumeRef}>
                  <div className="resume-template resume-professional">
                    <div className="text-center mb-6">
                      <h1 className="text-3xl font-bold text-[#5372f1] mb-1">{form.getValues().firstName} {form.getValues().lastName}</h1>
                      <p className="text-gray-600">{form.getValues().address}, {form.getValues().city}, {form.getValues().country}</p>
                      <p className="text-gray-600">{form.getValues().email} | {form.getValues().phone}</p>
                    </div>
                    
                    <Separator className="my-6" />
                    
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-[#5372f1] mb-3">Professional Summary</h2>
                      <p className="text-gray-700 whitespace-pre-wrap">{form.getValues().professionalSummary}</p>
                    </div>
                    
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-[#5372f1] mb-3">Work Experience</h2>
                      {form.getValues().workExperiences.map((exp, index) => (
                        <div key={exp.id} className="mb-4 pb-4 border-b border-gray-200 last:border-b-0">
                          <div className="flex justify-between mb-1">
                            <h3 className="font-semibold text-lg">{exp.position}</h3>
                            <span className="text-gray-600 text-sm">
                              {exp.startDate} - {exp.currentlyWorking ? 'Present' : exp.endDate}
                            </span>
                          </div>
                          <div className="text-gray-700 mb-2">{exp.company}</div>
                          <p className="text-gray-600 whitespace-pre-wrap">{exp.description}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-[#5372f1] mb-3">Education</h2>
                      {form.getValues().educations.map((edu, index) => (
                        <div key={edu.id} className="mb-4 pb-4 border-b border-gray-200 last:border-b-0">
                          <div className="flex justify-between mb-1">
                            <h3 className="font-semibold text-lg">{edu.degree} in {edu.fieldOfStudy}</h3>
                            <span className="text-gray-600 text-sm">{edu.graduationDate}</span>
                          </div>
                          <div className="text-gray-700 mb-2">{edu.institution}</div>
                          {edu.description && (
                            <p className="text-gray-600 whitespace-pre-wrap">{edu.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                    
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-[#5372f1] mb-3">Skills</h2>
                      <p className="text-gray-700 whitespace-pre-wrap">{form.getValues().skills}</p>
                    </div>
                    
                    {form.getValues().additionalInfo && (
                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-[#5372f1] mb-3">Additional Information</h2>
                        <p className="text-gray-700 whitespace-pre-wrap">{form.getValues().additionalInfo}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-gray-50 border rounded-lg p-6 mb-6">
                  <h3 className="text-lg font-semibold mb-4">Download Your Resume</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button 
                      onClick={() => handleDownloadResume('pdf')}
                      disabled={isDownloading && downloadFormat === 'pdf'}
                      className="flex items-center justify-center py-6 bg-[#5372f1] hover:bg-[#4060e0]"
                    >
                      {isDownloading && downloadFormat === 'pdf' ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <File className="mr-2 h-5 w-5" />
                          Download as PDF
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      onClick={() => handleDownloadResume('docx')}
                      disabled={isDownloading && downloadFormat === 'docx'}
                      variant="outline"
                      className="flex items-center justify-center py-6 border-[#5372f1] text-[#5372f1] hover:bg-[#5372f1]/5"
                    >
                      {isDownloading && downloadFormat === 'docx' ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <FileText className="mr-2 h-5 w-5" />
                          Download as Word
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      onClick={() => handleDownloadResume('txt')}
                      disabled={isDownloading && downloadFormat === 'txt'}
                      variant="outline"
                      className="flex items-center justify-center py-6 border-[#5372f1] text-[#5372f1] hover:bg-[#5372f1]/5"
                    >
                      {isDownloading && downloadFormat === 'txt' ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <FileText className="mr-2 h-5 w-5" />
                          Download as Text
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="mb-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">Why Create Your Resume with Expert Recruitments?</h3>
                  <ul className="list-disc pl-5 space-y-2 text-blue-700">
                    <li>Professional templates designed by industry experts</li>
                    <li>ATS-friendly formats to pass automated screening systems</li>
                    <li>Multiple download options for different application requirements</li>
                    <li>Personalized guidance on optimizing your career history</li>
                    <li>Increased visibility to employers in our network</li>
                  </ul>
                  <div className="mt-4">
                    <p className="text-blue-600">Want professional help with your resume? <Button variant="link" className="p-0 h-auto text-blue-700 font-medium underline">Contact our career experts</Button></p>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className="text-gray-500 text-sm mb-4">
                    Your resume is saved in our system. You can access, edit or download it anytime from your profile.
                  </p>
                  <div className="flex justify-center space-x-3">
                    <Button 
                      onClick={() => window.location.href = "/profile"}
                      variant="outline"
                      className="text-[#5372f1]"
                    >
                      Go to Profile
                    </Button>
                    <Button 
                      onClick={() => window.location.href = "/job-board"}
                      variant="outline"
                      className="text-[#5372f1]"
                    >
                      Find Jobs Now
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Resume</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete this resume? This action cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex space-x-2 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDeleteDialog(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={confirmDeleteResume}
                  >
                    Delete Resume
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </Tabs>
        </div>
      </div>
    </>
  );
}