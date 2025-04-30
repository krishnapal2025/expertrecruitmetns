import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Helmet } from "react-helmet";
import { Download, Save, Trash2, Loader2, Copy, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Define the form schema with zod
const formSchema = z.object({
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
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
      institution: z.string().min(1, { message: "Institution is required" }),
      degree: z.string().min(1, { message: "Degree is required" }),
      fieldOfStudy: z.string(),
      graduationDate: z.string(),
      description: z.string()
    })
  ),
  skills: z.array(
    z.object({
      id: z.string(),
      name: z.string().min(1, { message: "Skill name is required" }),
      level: z.string()
    })
  )
});

// Infer the type from the schema
type FormValues = z.infer<typeof formSchema>;

export default function CreateResumePage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("details");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [finalResumeGenerated, setFinalResumeGenerated] = useState<boolean>(false);
  const [confirmDialog, setConfirmDialog] = useState<boolean>(false);
  
  // Generate ID function
  const generateId = () => Math.random().toString(36).substring(2, 9);

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      professionalSummary: "",
      workExperiences: [
        {
          id: generateId(),
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          currentlyWorking: false,
          description: ""
        }
      ],
      educations: [
        {
          id: generateId(),
          institution: "",
          degree: "",
          fieldOfStudy: "",
          graduationDate: "",
          description: ""
        }
      ],
      skills: [
        {
          id: generateId(),
          name: "",
          level: "Intermediate"
        }
      ]
    }
  });

  // Sample professional summaries
  const sampleSummaries = {
    "default": "Detail-oriented professional with over 5 years of experience in delivering high-quality results in fast-paced environments. Skilled in problem-solving, team collaboration, and adapting to new challenges quickly.",
    "software": "Innovative software developer with 5+ years of experience building scalable applications. Proficient in multiple programming languages and frameworks with a passion for clean, maintainable code and excellent problem-solving skills.",
    "marketing": "Results-driven marketing professional with proven success in developing and executing comprehensive marketing strategies. Skilled in digital marketing, content creation, and analytics with a track record of driving engagement and conversion.",
    "finance": "Strategic finance professional with expertise in financial analysis, reporting, and forecasting. Experienced in optimizing financial operations and providing actionable insights to support business growth and profitability.",
    "sales": "Dynamic sales professional with a consistent history of exceeding targets and building strong client relationships. Skilled in consultative selling, negotiation, and developing tailored solutions to meet client needs."
  };

  // Set up field arrays for repeatable sections
  const { fields: workFields, append: appendWork, remove: removeWork } = useFieldArray({
    control: form.control,
    name: "workExperiences"
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = useFieldArray({
    control: form.control,
    name: "educations"
  });

  const { fields: skillFields, append: appendSkill, remove: removeSkill } = useFieldArray({
    control: form.control,
    name: "skills"
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
  
  // Function to add a new skill
  const addSkill = () => {
    appendSkill({
      id: generateId(),
      name: "",
      level: "Intermediate"
    });
  };

  // Effect to load saved form data from localStorage when component mounts
  useEffect(() => {
    const loadSavedData = () => {
      try {
        console.log("Loading saved form data from localStorage");
        const savedData = localStorage.getItem("resumeFormData");
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          form.reset(parsedData);
        }
      } catch (error) {
        console.error("Error loading saved data:", error);
      }
    };

    loadSavedData();
  }, [form]);

  // Function to save current form data to localStorage
  const saveFormData = async () => {
    try {
      setIsSaving(true);
      const formData = form.getValues();
      localStorage.setItem("resumeFormData", JSON.stringify(formData));
      
      // Add a small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      toast({
        title: "Progress Saved",
        description: "Your resume progress has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "There was a problem saving your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Function to handle form submission for preview
  const onSubmit = (data: FormValues) => {
    try {
      console.log("Form is valid! Proceeding to preview...");
      
      // Save the current form values
      localStorage.setItem("resumePreviewData", JSON.stringify(data));
      
      // Switch to preview tab
      setActiveTab("preview");
    } catch (error) {
      console.error("Error creating preview:", error);
      toast({
        title: "Error",
        description: "There was a problem creating your resume preview. Please check your information and try again.",
        variant: "destructive",
      });
    }
  };

  // Function to generate final resume
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
        setActiveTab("final");
        
        toast({
          title: "Resume Generated Successfully",
          description: "Your professional resume has been created and is ready to download!",
        });
      }, 1500);
    } catch (error) {
      setIsGenerating(false);
      toast({
        title: "Generation Failed",
        description: "There was a problem generating your resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to delete saved resume data
  const handleDeleteResume = () => {
    setConfirmDialog(true);
  };

  // Function to confirm and execute delete
  const confirmDeleteResume = () => {
    localStorage.removeItem("resumeFormData");
    localStorage.removeItem("resumePreviewData");
    localStorage.removeItem("finalResumeData");
    
    form.reset({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      professionalSummary: "",
      workExperiences: [{
        id: generateId(),
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
        description: ""
      }],
      educations: [{
        id: generateId(),
        institution: "",
        degree: "",
        fieldOfStudy: "",
        graduationDate: "",
        description: ""
      }],
      skills: [{
        id: generateId(),
        name: "",
        level: "Intermediate"
      }]
    });
    
    setConfirmDialog(false);
    setFinalResumeGenerated(false);
    setActiveTab("details");
    
    toast({
      title: "Resume Data Deleted",
      description: "All your saved resume data has been removed.",
    });
  };

  // Function to apply a sample professional summary
  const applySampleSummary = (type: string) => {
    const summary = sampleSummaries[type as keyof typeof sampleSummaries] || sampleSummaries.default;
    form.setValue("professionalSummary", summary);
  };

  return (
    <>
      <Helmet>
        <title>Create Your Resume | Expert Recruitments</title>
        <meta 
          name="description" 
          content="Build an ATS-friendly professional resume with our easy-to-use resume builder tool."
        />
      </Helmet>
      
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Create Your Resume</h1>
            <p className="text-gray-600 max-w-3xl">
              Create an ATS-friendly resume that stands out to recruiters. Our builder helps you format your experience professionally and highlights your most relevant qualifications.
            </p>
          </div>
          
          <Tabs 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Resume Details</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="final">Final Resume</TabsTrigger>
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
                    
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Need inspiration? Try a sample:</h4>
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => applySampleSummary("software")}
                        >
                          Software Developer
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => applySampleSummary("marketing")}
                        >
                          Marketing
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => applySampleSummary("finance")}
                        >
                          Finance
                        </Button>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="sm"
                          onClick={() => applySampleSummary("sales")}
                        >
                          Sales
                        </Button>
                      </div>
                    </div>
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
                                  <Input placeholder="Bachelor's, Master's, etc." {...field} />
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
                                  <Input placeholder="Computer Science, Business, etc." {...field} />
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
                                <FormLabel>Graduation Date</FormLabel>
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
                        </div>
                        
                        <FormField
                          control={form.control}
                          name={`educations.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Additional Information (Optional)</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Achievements, GPA, honors, etc."
                                  className="min-h-[80px]"
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
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">Skills</h3>
                      <Button
                        type="button"
                        onClick={addSkill}
                        variant="outline"
                        size="sm"
                        className="text-[#5372f1]"
                      >
                        Add More
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {skillFields.map((field, index) => (
                        <div 
                          key={field.id} 
                          className="p-3 border border-gray-200 rounded-md bg-gray-50 flex items-center"
                        >
                          <div className="flex-grow">
                            <FormField
                              control={form.control}
                              name={`skills.${index}.name`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input 
                                      placeholder="Enter a skill (e.g., JavaScript, Project Management)" 
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          
                          <div className="ml-2">
                            {index > 0 && (
                              <Button
                                type="button"
                                onClick={() => removeSkill(index)}
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-gray-500 hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Remove</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-between pt-4">
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
                      type="submit"
                      className="bg-[#5372f1] hover:bg-[#4060e0]"
                    >
                      Create Resume Preview
                    </Button>
                  </div>
                </form>
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
                  </div>
                </div>
                
                <div className="mb-8 p-6 border border-gray-200 rounded-md bg-white shadow-inner">
                  <div className="mb-6 pb-4 border-b">
                    <h1 className="text-2xl font-bold mb-1">
                      {form.getValues().firstName} {form.getValues().lastName}
                    </h1>
                    <div className="text-gray-600 flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                      <span>{form.getValues().email}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>{form.getValues().phone}</span>
                    </div>
                    <div className="text-gray-600">
                      {form.getValues().address && <span>{form.getValues().address}, </span>}
                      {form.getValues().city && <span>{form.getValues().city}, </span>}
                      {form.getValues().country && <span>{form.getValues().country}</span>}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-2 text-[#5372f1] border-b pb-1">Professional Summary</h2>
                    <p className="text-gray-700 whitespace-pre-line">{form.getValues().professionalSummary}</p>
                  </div>
                  
                  {form.getValues().workExperiences.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-3 text-[#5372f1] border-b pb-1">Work Experience</h2>
                      {form.getValues().workExperiences.map((work, index) => (
                        <div key={work.id || index} className="mb-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between mb-1">
                            <h3 className="font-medium">{work.position}</h3>
                            <div className="text-gray-600 text-sm">
                              {work.startDate} - {work.currentlyWorking ? 'Present' : work.endDate}
                            </div>
                          </div>
                          <div className="text-gray-700 mb-1">{work.company}</div>
                          <p className="text-gray-600 text-sm whitespace-pre-line">{work.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {form.getValues().educations.length > 0 && (
                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-3 text-[#5372f1] border-b pb-1">Education</h2>
                      {form.getValues().educations.map((education, index) => (
                        <div key={education.id || index} className="mb-4">
                          <div className="flex flex-col sm:flex-row sm:justify-between mb-1">
                            <h3 className="font-medium">{education.degree}{education.fieldOfStudy ? ` in ${education.fieldOfStudy}` : ''}</h3>
                            {education.graduationDate && (
                              <div className="text-gray-600 text-sm">{education.graduationDate}</div>
                            )}
                          </div>
                          <div className="text-gray-700 mb-1">{education.institution}</div>
                          {education.description && (
                            <p className="text-gray-600 text-sm">{education.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {form.getValues().skills.length > 0 && (
                    <div>
                      <h2 className="text-lg font-semibold mb-2 text-[#5372f1] border-b pb-1">Skills</h2>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {form.getValues().skills.map((skill, index) => (
                          <span 
                            key={skill.id || index} 
                            className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                          >
                            {skill.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between">
                  <Button 
                    onClick={() => setActiveTab("details")} 
                    variant="outline"
                  >
                    Edit Resume
                  </Button>
                  <Button 
                    onClick={handleGenerateResume}
                    className="bg-[#5372f1] hover:bg-[#4060e0]"
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="mr-2 h-4 w-4" />
                        Generate Final Resume
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="final">
              <div className="bg-white p-6 rounded-lg shadow-md border">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold">Your Final Resume</h2>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <Download className="h-4 w-4" />
                      <span>Download PDF</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <Copy className="h-4 w-4" />
                      <span>Copy Text</span>
                    </Button>
                  </div>
                </div>
                
                {finalResumeGenerated ? (
                  <div className="mb-8 p-8 border border-gray-200 rounded-md bg-white shadow-inner">
                    <div className="text-center mb-8 pb-4 border-b">
                      <h1 className="text-3xl font-bold mb-1">
                        {form.getValues().firstName} {form.getValues().lastName}
                      </h1>
                      <div className="text-gray-600 flex flex-col sm:flex-row sm:justify-center sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 mt-2">
                        <span>{form.getValues().email}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>{form.getValues().phone}</span>
                      </div>
                      <div className="text-gray-600 mt-1">
                        {form.getValues().address && <span>{form.getValues().address}, </span>}
                        {form.getValues().city && <span>{form.getValues().city}, </span>}
                        {form.getValues().country && <span>{form.getValues().country}</span>}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h2 className="text-lg font-semibold mb-2 text-[#5372f1] border-b pb-1">Professional Summary</h2>
                      <p className="text-gray-700 whitespace-pre-line">{form.getValues().professionalSummary}</p>
                    </div>
                    
                    {form.getValues().workExperiences.length > 0 && (
                      <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-3 text-[#5372f1] border-b pb-1">Work Experience</h2>
                        {form.getValues().workExperiences.map((work, index) => (
                          <div key={work.id || index} className="mb-5">
                            <div className="flex flex-col sm:flex-row sm:justify-between mb-1">
                              <h3 className="font-medium">{work.position}</h3>
                              <div className="text-gray-600 text-sm">
                                {work.startDate} - {work.currentlyWorking ? 'Present' : work.endDate}
                              </div>
                            </div>
                            <div className="text-gray-700 mb-1">{work.company}</div>
                            <p className="text-gray-600 text-sm whitespace-pre-line">{work.description}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {form.getValues().educations.length > 0 && (
                      <div className="mb-6">
                        <h2 className="text-lg font-semibold mb-3 text-[#5372f1] border-b pb-1">Education</h2>
                        {form.getValues().educations.map((education, index) => (
                          <div key={education.id || index} className="mb-4">
                            <div className="flex flex-col sm:flex-row sm:justify-between mb-1">
                              <h3 className="font-medium">{education.degree}{education.fieldOfStudy ? ` in ${education.fieldOfStudy}` : ''}</h3>
                              {education.graduationDate && (
                                <div className="text-gray-600 text-sm">{education.graduationDate}</div>
                              )}
                            </div>
                            <div className="text-gray-700 mb-1">{education.institution}</div>
                            {education.description && (
                              <p className="text-gray-600 text-sm">{education.description}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {form.getValues().skills.length > 0 && (
                      <div>
                        <h2 className="text-lg font-semibold mb-2 text-[#5372f1] border-b pb-1">Skills</h2>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {form.getValues().skills.map((skill, index) => (
                            <span 
                              key={skill.id || index} 
                              className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                            >
                              {skill.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="text-gray-400 mb-4">
                      <FileText className="h-16 w-16 mx-auto mb-2" />
                      <p className="text-center">Your final resume hasn't been generated yet.</p>
                    </div>
                    <Button 
                      onClick={() => setActiveTab("preview")}
                      variant="outline"
                    >
                      Go to Preview
                    </Button>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <Button 
                    onClick={handleDeleteResume} 
                    variant="outline"
                    className="text-red-500"
                  >
                    Delete Resume
                  </Button>
                  <Button 
                    onClick={() => setActiveTab("details")} 
                    variant="outline"
                  >
                    Edit Resume
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Resume Data</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete all your resume data? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setConfirmDialog(false)}
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
        </div>
      </div>
    </>
  );
}