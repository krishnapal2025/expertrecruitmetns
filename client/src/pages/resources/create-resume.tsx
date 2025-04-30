import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { jsPDF } from "jspdf";
// @ts-ignore
import 'jspdf-autotable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, FileText, Plus, Trash2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define the schema for the resume form
const resumeFormSchema = z.object({
  personalInfo: z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone number is required"),
    address: z.string().optional(),
    city: z.string().optional(),
    country: z.string().optional(),
    postalCode: z.string().optional(),
    summary: z.string().optional(),
  }),
  education: z.array(
    z.object({
      institution: z.string().min(1, "Institution name is required"),
      degree: z.string().min(1, "Degree is required"),
      fieldOfStudy: z.string().optional(),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      description: z.string().optional(),
    })
  ),
  experience: z.array(
    z.object({
      company: z.string().min(1, "Company name is required"),
      position: z.string().min(1, "Position is required"),
      startDate: z.string().optional(),
      endDate: z.string().optional(),
      description: z.string().optional(),
    })
  ),
  skills: z.array(
    z.object({
      name: z.string().min(1, "Skill name is required"),
      level: z.string().optional(),
    })
  ),
});

type ResumeFormValues = z.infer<typeof resumeFormSchema>;

export default function CreateResumePage() {
  const [activeTab, setActiveTab] = useState("personal");
  const pdfRef = useRef<HTMLDivElement>(null);

  // Default values for the form
  const defaultValues: ResumeFormValues = {
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      country: "",
      postalCode: "",
      summary: "",
    },
    education: [
      {
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    experience: [
      {
        company: "",
        position: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    skills: [
      {
        name: "",
        level: "Beginner",
      },
    ],
  };

  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeFormSchema),
    defaultValues,
  });

  // Field arrays for dynamic fields
  const { fields: educationFields, append: appendEducation, remove: removeEducation } = 
    useFieldArray({ control: form.control, name: "education" });
  
  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = 
    useFieldArray({ control: form.control, name: "experience" });
  
  const { fields: skillFields, append: appendSkill, remove: removeSkill } = 
    useFieldArray({ control: form.control, name: "skills" });

  // Function to handle form submission
  const onSubmit = (data: ResumeFormValues) => {
    try {
      generatePdf(data);
      toast({
        title: "Resume Created",
        description: "Your resume has been generated successfully!",
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Error",
        description: "There was an error generating your resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to generate PDF from form data
  const generatePdf = (data: ResumeFormValues) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = 20;
    
    // Set font
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    
    // Add full name
    const fullName = `${data.personalInfo.firstName} ${data.personalInfo.lastName}`;
    doc.text(fullName, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;
    
    // Add contact info
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    const contactInfo = `${data.personalInfo.email} | ${data.personalInfo.phone}`;
    doc.text(contactInfo, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 6;
    
    // Add address if available
    if (data.personalInfo.address) {
      const address = `${data.personalInfo.address}, ${data.personalInfo.city || ""} ${data.personalInfo.postalCode || ""}, ${data.personalInfo.country || ""}`;
      doc.text(address.trim(), pageWidth / 2, yPosition, { align: "center" });
      yPosition += 10;
    }
    
    // Add separator
    doc.setDrawColor(100, 100, 100);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;
    
    // Add summary if available
    if (data.personalInfo.summary) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Professional Summary", margin, yPosition);
      yPosition += 6;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const textLines = doc.splitTextToSize(data.personalInfo.summary, pageWidth - (margin * 2));
      doc.text(textLines, margin, yPosition);
      yPosition += (textLines.length * 5) + 8;
    }
    
    // Add experience section
    if (data.experience.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Work Experience", margin, yPosition);
      yPosition += 6;
      
      data.experience.forEach((exp) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text(exp.position, margin, yPosition);
        yPosition += 5;
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`${exp.company} ${exp.startDate && exp.endDate ? `| ${exp.startDate} - ${exp.endDate}` : ""}`, margin, yPosition);
        yPosition += 5;
        
        if (exp.description) {
          const descLines = doc.splitTextToSize(exp.description, pageWidth - (margin * 2));
          doc.text(descLines, margin, yPosition);
          yPosition += (descLines.length * 5) + 5;
        } else {
          yPosition += 5;
        }
      });
      
      yPosition += 5;
    }
    
    // Add education section
    if (data.education.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Education", margin, yPosition);
      yPosition += 6;
      
      data.education.forEach((edu) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.text(edu.degree, margin, yPosition);
        yPosition += 5;
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text(`${edu.institution} ${edu.startDate && edu.endDate ? `| ${edu.startDate} - ${edu.endDate}` : ""}`, margin, yPosition);
        yPosition += 5;
        
        if (edu.fieldOfStudy) {
          doc.text(`Field of Study: ${edu.fieldOfStudy}`, margin, yPosition);
          yPosition += 5;
        }
        
        if (edu.description) {
          const descLines = doc.splitTextToSize(edu.description, pageWidth - (margin * 2));
          doc.text(descLines, margin, yPosition);
          yPosition += (descLines.length * 5) + 5;
        } else {
          yPosition += 5;
        }
      });
      
      yPosition += 5;
    }
    
    // Add skills section
    if (data.skills.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Skills", margin, yPosition);
      yPosition += 6;
      
      const skillsText = data.skills.map((skill) => `${skill.name}${skill.level ? ` (${skill.level})` : ""}`).join(", ");
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const skillLines = doc.splitTextToSize(skillsText, pageWidth - (margin * 2));
      doc.text(skillLines, margin, yPosition);
    }
    
    // Save PDF
    doc.save(`${data.personalInfo.firstName}_${data.personalInfo.lastName}_Resume.pdf`);
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="col-span-1 md:col-span-2">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Create Your Resume</h1>
            <p className="text-gray-500">
              Fill in the form to create a professional resume. Once complete, you can download it as a PDF.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resume Builder</CardTitle>
              <CardDescription>
                Enter your information to generate a professional resume.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                </TabsList>

                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)}>
                    <TabsContent value="personal">
                      <div className="space-y-6 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="personalInfo.firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name*</FormLabel>
                                <FormControl>
                                  <Input placeholder="John" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="personalInfo.lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name*</FormLabel>
                                <FormControl>
                                  <Input placeholder="Doe" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="personalInfo.email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email*</FormLabel>
                                <FormControl>
                                  <Input placeholder="john.doe@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="personalInfo.phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone*</FormLabel>
                                <FormControl>
                                  <Input placeholder="+1 234 567 8900" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="personalInfo.address"
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

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <FormField
                            control={form.control}
                            name="personalInfo.city"
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
                            name="personalInfo.country"
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
                          
                          <FormField
                            control={form.control}
                            name="personalInfo.postalCode"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Postal Code</FormLabel>
                                <FormControl>
                                  <Input placeholder="10001" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="personalInfo.summary"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Professional Summary</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="A brief summary of your professional background, skills, and career goals"
                                  className="min-h-[120px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end">
                          <Button type="button" onClick={() => setActiveTab("education")}>
                            Next: Education
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="education">
                      <div className="space-y-6 py-4">
                        {educationFields.map((field, index) => (
                          <div key={field.id} className="p-4 border rounded-md mb-4">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-medium">Education #{index + 1}</h4>
                              {educationFields.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeEducation(index)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Remove
                                </Button>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <FormField
                                control={form.control}
                                name={`education.${index}.institution`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Institution*</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Harvard University" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name={`education.${index}.degree`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Degree*</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Bachelor of Science" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name={`education.${index}.fieldOfStudy`}
                              render={({ field }) => (
                                <FormItem className="mb-4">
                                  <FormLabel>Field of Study</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Computer Science" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <FormField
                                control={form.control}
                                name={`education.${index}.startDate`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Start Date</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Sept 2018" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name={`education.${index}.endDate`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>End Date</FormLabel>
                                    <FormControl>
                                      <Input placeholder="June 2022" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name={`education.${index}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Relevant coursework, achievements, etc."
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

                        <Button
                          type="button"
                          variant="outline"
                          className="mt-2 w-full"
                          onClick={() =>
                            appendEducation({
                              institution: "",
                              degree: "",
                              fieldOfStudy: "",
                              startDate: "",
                              endDate: "",
                              description: "",
                            })
                          }
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Education
                        </Button>

                        <div className="flex justify-between mt-6">
                          <Button type="button" variant="outline" onClick={() => setActiveTab("personal")}>
                            Previous: Personal
                          </Button>
                          <Button type="button" onClick={() => setActiveTab("experience")}>
                            Next: Experience
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="experience">
                      <div className="space-y-6 py-4">
                        {experienceFields.map((field, index) => (
                          <div key={field.id} className="p-4 border rounded-md mb-4">
                            <div className="flex justify-between items-center mb-4">
                              <h4 className="font-medium">Experience #{index + 1}</h4>
                              {experienceFields.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeExperience(index)}
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Remove
                                </Button>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <FormField
                                control={form.control}
                                name={`experience.${index}.company`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Company*</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Google" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name={`experience.${index}.position`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Position*</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Software Engineer" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <FormField
                                control={form.control}
                                name={`experience.${index}.startDate`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Start Date</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Jan 2020" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              <FormField
                                control={form.control}
                                name={`experience.${index}.endDate`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>End Date</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Present" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>

                            <FormField
                              control={form.control}
                              name={`experience.${index}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      placeholder="Describe your responsibilities, achievements, and skills used"
                                      className="min-h-[120px]"
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        ))}

                        <Button
                          type="button"
                          variant="outline"
                          className="mt-2 w-full"
                          onClick={() =>
                            appendExperience({
                              company: "",
                              position: "",
                              startDate: "",
                              endDate: "",
                              description: "",
                            })
                          }
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Experience
                        </Button>

                        <div className="flex justify-between mt-6">
                          <Button type="button" variant="outline" onClick={() => setActiveTab("education")}>
                            Previous: Education
                          </Button>
                          <Button type="button" onClick={() => setActiveTab("skills")}>
                            Next: Skills
                          </Button>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="skills">
                      <div className="space-y-6 py-4">
                        {skillFields.map((field, index) => (
                          <div key={field.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end pb-4 border-b">
                            <div className="md:col-span-2">
                              <FormField
                                control={form.control}
                                name={`skills.${index}.name`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Skill*</FormLabel>
                                    <FormControl>
                                      <Input placeholder="JavaScript" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <FormField
                                control={form.control}
                                name={`skills.${index}.level`}
                                render={({ field }) => (
                                  <FormItem className="flex-grow">
                                    <FormLabel>Level</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select level" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                                        <SelectItem value="Advanced">Advanced</SelectItem>
                                        <SelectItem value="Expert">Expert</SelectItem>
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              
                              {skillFields.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="self-end mb-2"
                                  onClick={() => removeSkill(index)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}

                        <Button
                          type="button"
                          variant="outline"
                          className="mt-2 w-full"
                          onClick={() =>
                            appendSkill({
                              name: "",
                              level: "Beginner",
                            })
                          }
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Skill
                        </Button>

                        <div className="flex justify-between mt-6">
                          <Button type="button" variant="outline" onClick={() => setActiveTab("experience")}>
                            Previous: Experience
                          </Button>
                          <Button type="submit" className="bg-primary">
                            Generate Resume
                          </Button>
                        </div>
                      </div>
                    </TabsContent>
                  </form>
                </Form>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="hidden md:block">
          <div className="sticky top-28">
            <Card>
              <CardHeader>
                <CardTitle>Resume Tips</CardTitle>
                <CardDescription>
                  Follow these guidelines for a professional resume
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Keep it concise</AlertTitle>
                  <AlertDescription>
                    Limit your resume to 1-2 pages. Focus on relevant experience.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-1">Use Action Verbs</h4>
                    <p className="text-sm text-gray-500">
                      Begin bullet points with action verbs like "Implemented," "Developed," or "Managed."
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Quantify Achievements</h4>
                    <p className="text-sm text-gray-500">
                      Include numbers and percentages to demonstrate impact (e.g., "Increased sales by 20%").
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Tailor to the Job</h4>
                    <p className="text-sm text-gray-500">
                      Customize your resume for each position by highlighting relevant skills and experience.
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-1">Proofread Carefully</h4>
                    <p className="text-sm text-gray-500">
                      Typos and grammar errors make a bad impression. Double-check everything.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex items-center justify-center w-full">
                  <FileText className="h-5 w-5 mr-2 text-primary" />
                  <span className="text-sm text-gray-500">PDF will be generated in standard ATS-friendly format</span>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}