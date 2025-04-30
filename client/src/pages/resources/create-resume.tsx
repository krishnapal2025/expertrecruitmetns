import { useState } from "react";
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
import { FileText, Upload, Download, Copy, Printer, Check } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

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

  // Initialize the form with defaults from user profile if available
  const form = useForm<z.infer<typeof resumeFormSchema>>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues: {
      firstName: currentUser?.profile?.firstName || "",
      lastName: currentUser?.profile?.lastName || "",
      email: currentUser?.user?.email || "",
      phone: currentUser?.profile?.phone || "",
      address: currentUser?.profile?.address || "",
      city: currentUser?.profile?.city || "",
      country: currentUser?.profile?.country || "",
      professionalSummary: "",
      workExperience: "",
      education: "",
      skills: "",
      additionalInfo: "",
    },
  });

  // Handle form submission
  const onSubmit = (values: z.infer<typeof resumeFormSchema>) => {
    setIsGenerating(true);
    // Simulate resume generation process
    setTimeout(() => {
      setIsGenerating(false);
      setResumeGenerated(true);
      setActiveTab("preview");
      toast({
        title: "Resume Generated",
        description: "Your resume has been created successfully!",
        variant: "success",
      });
    }, 2000);
  };

  // Handle template selection
  const handleTemplateSelection = (templateId: string) => {
    setSelectedTemplate(templateId);
    toast({
      title: "Template Selected",
      description: `You've selected the ${templates.find(t => t.id === templateId)?.name} template.`,
      variant: "default",
    });
  };

  // Define tab change handler
  const handleTabChange = (value: string) => {
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
              <TabsTrigger value="template">Choose Template</TabsTrigger>
              <TabsTrigger value="details">Enter Details</TabsTrigger>
              <TabsTrigger value="preview" disabled={!resumeGenerated}>Preview Resume</TabsTrigger>
            </TabsList>
            
            <TabsContent value="template" className="space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Select a Resume Template</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {templates.map((template) => (
                  <Card 
                    key={template.id} 
                    className={`cursor-pointer transition-all duration-200 hover:shadow-md ${selectedTemplate === template.id ? 'ring-2 ring-primary' : ''}`}
                    onClick={() => handleTemplateSelection(template.id)}
                  >
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <div className="aspect-[3/4] bg-gray-100 rounded-md mb-3 overflow-hidden">
                        <img 
                          src={template.image} 
                          alt={template.name} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <CardDescription className="text-sm">{template.description}</CardDescription>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button 
                        variant={selectedTemplate === template.id ? "default" : "outline"}
                        className="w-full"
                        onClick={() => handleTemplateSelection(template.id)}
                      >
                        {selectedTemplate === template.id ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Selected
                          </>
                        ) : 'Select'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              
              <div className="flex justify-end mt-6">
                <Button onClick={() => setActiveTab("details")}>
                  Continue to Details
                </Button>
              </div>
            </TabsContent>
            
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
                  
                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setActiveTab("template")}
                    >
                      Back to Templates
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isGenerating}
                      className="min-w-[120px]"
                    >
                      {isGenerating ? "Generating..." : "Generate Resume"}
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
                      Edit Resume
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                  <FileText className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Resume Generated Yet</h3>
                  <p className="text-gray-500 mb-4">Please complete the previous steps to generate your resume.</p>
                  <Button onClick={() => setActiveTab("template")}>Start Creating</Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}