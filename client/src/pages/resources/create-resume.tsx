import { useState, useRef } from "react";
import { Helmet } from "react-helmet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, Upload, Download, Copy, Printer, Edit, Trash2, 
  File, Loader2, ChevronLeft, ChevronRight, Save
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, 
  DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define form schema using Zod
const resumeFormSchema = z.object({
  // Personal Information
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  
  // Professional Summary
  professionalSummary: z.string().min(50, "Professional summary should be at least 50 characters"),
  
  // Work Experience (simplified for this example)
  workExperience: z.string().min(1, "Work experience is required"),
  
  // Education
  education: z.string().min(1, "Education details are required"),
  
  // Skills
  skills: z.string().min(1, "Skills are required"),
  
  // Additional Information (optional)
  additionalInfo: z.string().optional(),
});

// Template styles for resume
const templates = [
  {
    id: "professional",
    name: "Professional",
    description: "Clean and professional design suitable for corporate environments",
    image: "https://via.placeholder.com/150x200?text=Professional",
  },
  {
    id: "creative",
    name: "Creative",
    description: "Modern design with creative elements for design and marketing roles",
    image: "https://via.placeholder.com/150x200?text=Creative",
  },
  {
    id: "academic",
    name: "Academic",
    description: "Formal layout ideal for academic and research positions",
    image: "https://via.placeholder.com/150x200?text=Academic",
  },
  {
    id: "technical",
    name: "Technical",
    description: "Focused on technical skills and certifications for IT professionals",
    image: "https://via.placeholder.com/150x200?text=Technical",
  },
];

export default function CreateResumePage() {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState("professional");
  const [activeTab, setActiveTab] = useState("details");
  const [isGenerating, setIsGenerating] = useState(false);
  const [resumeGenerated, setResumeGenerated] = useState(false);
  const [finalResumeGenerated, setFinalResumeGenerated] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState<string | null>(null);
  const resumeRef = useRef<HTMLDivElement>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Initialize the form with defaults from user profile if available
  const form = useForm<z.infer<typeof resumeFormSchema>>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: currentUser?.email || "",
      phone: "",
      address: "",
      city: "",
      country: "",
      professionalSummary: "",
      workExperience: "",
      education: "",
      skills: "",
      additionalInfo: "",
    },
  });

  // Handle form submission
  const onSubmit = (values: z.infer<typeof resumeFormSchema>) => {
    // Go directly to preview
    setActiveTab("preview");
    setResumeGenerated(true);
    
    toast({
      title: "Form Submitted",
      description: "Your resume details have been submitted. You can now preview your resume.",
      variant: "default",
    });
  };

  // Handle generating the final resume
  const handleGenerateResume = () => {
    setIsGenerating(true);
    
    // Simulate resume generation process
    setTimeout(() => {
      setIsGenerating(false);
      setFinalResumeGenerated(true);
      setActiveTab("final");
      
      toast({
        title: "Resume Generated Successfully",
        description: "Your professional resume has been created and is ready to download!",
        variant: "default",
      });
    }, 1500);
  };
  
  // Handle delete resume
  const handleDeleteResume = () => {
    setShowDeleteDialog(true);
  };
  
  // Confirm delete resume
  const confirmDeleteResume = () => {
    setShowDeleteDialog(false);
    setFinalResumeGenerated(false);
    setResumeGenerated(false);
    setActiveTab("details");
    
    toast({
      title: "Resume Deleted",
      description: "Your resume has been deleted. You can create a new one.",
      variant: "default",
    });
  };
  
  // Handle download resume
  const handleDownloadResume = (format: string) => {
    setIsDownloading(true);
    setDownloadFormat(format);
    
    // Simulate download process
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadFormat(null);
      
      toast({
        title: `Resume Downloaded as ${format.toUpperCase()}`,
        description: `Your resume has been downloaded in ${format.toUpperCase()} format.`,
        variant: "default",
      });
    }, 1500);
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
          <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
            <div className="md:flex-1">
              <h1 className="text-4xl font-bold mb-2 text-[#5372f1]">Create Your Resume</h1>
              <p className="text-lg text-gray-600 mb-4">Build a professional resume with our easy-to-use template builder to help you stand out to recruiters.</p>
            </div>
            <div className="w-full md:w-auto flex space-x-2">
              {resumeGenerated && (
                <>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Download className="h-4 w-4" />
                    <span>Download</span>
                  </Button>
                  <Button variant="outline" className="flex items-center space-x-2">
                    <Printer className="h-4 w-4" />
                    <span>Print</span>
                  </Button>
                </>
              )}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="details">Create Resume</TabsTrigger>
              <TabsTrigger value="preview" disabled={!resumeGenerated}>Preview</TabsTrigger>
              <TabsTrigger value="final" disabled={!finalResumeGenerated}>Final Resume</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                              <Input placeholder="+1 123 456 7890" {...field} />
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
                              <Input placeholder="123 Main St" {...field} />
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
                              <Input placeholder="New York" {...field} />
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
                              <Input placeholder="United States" {...field} />
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
                    <h3 className="text-xl font-semibold mb-4">Work Experience</h3>
                    <FormField
                      control={form.control}
                      name="workExperience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Experience Details</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="List your work experience with company names, positions, dates, and key responsibilities..." 
                              className="min-h-[150px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Format: Company Name | Position | Dates | Responsibilities
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-xl font-semibold mb-4">Education</h3>
                    <FormField
                      control={form.control}
                      name="education"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Education Details</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="List your educational qualifications with institution names, degrees, and dates..." 
                              className="min-h-[120px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Format: Institution | Degree | Graduation Date | GPA (optional)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-xl font-semibold mb-4">Skills</h3>
                    <FormField
                      control={form.control}
                      name="skills"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Skills</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="List your technical and soft skills..." 
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Separate skills with commas (e.g., Project Management, Microsoft Office, Team Leadership)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h3 className="text-xl font-semibold mb-4">Additional Information (Optional)</h3>
                    <FormField
                      control={form.control}
                      name="additionalInfo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Additional Details</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Include any additional information such as certifications, languages, volunteer work, etc..." 
                              className="min-h-[100px]"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      className="min-w-[120px] bg-[#5372f1] hover:bg-[#4060e0] text-lg py-6 px-8"
                    >
                      Submit
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="preview">
              {resumeGenerated ? (
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
                      <div className={`resume-template resume-${selectedTemplate}`}>
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
                          <p className="text-gray-700 whitespace-pre-wrap">{form.getValues().workExperience}</p>
                        </div>
                        
                        <div className="mb-6">
                          <h2 className="text-xl font-semibold text-[#5372f1] mb-3">Education</h2>
                          <p className="text-gray-700 whitespace-pre-wrap">{form.getValues().education}</p>
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
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <FileText className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Resume Generated Yet</h3>
                  <p className="text-gray-500 mb-4">Please complete the previous steps to generate your resume.</p>
                  <Button onClick={() => setActiveTab("details")}>Start Creating</Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="final">
              {finalResumeGenerated ? (
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
                    <div className={`resume-template`}>
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
                        <p className="text-gray-700 whitespace-pre-wrap">{form.getValues().workExperience}</p>
                      </div>
                      
                      <div className="mb-6">
                        <h2 className="text-xl font-semibold text-[#5372f1] mb-3">Education</h2>
                        <p className="text-gray-700 whitespace-pre-wrap">{form.getValues().education}</p>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-gray-500 text-sm mb-4">
                      Your resume is saved in our system. You can access, edit or download it anytime from your profile.
                    </p>
                    <Button 
                      onClick={() => window.location.href = "/profile"}
                      variant="outline"
                      className="text-[#5372f1]"
                    >
                      Go to Profile
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <FileText className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Final Resume Generated Yet</h3>
                  <p className="text-gray-500 mb-4">Please preview your resume first and click the Generate Resume button.</p>
                  <Button onClick={() => setActiveTab("preview")}>Go to Preview</Button>
                </div>
              )}
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