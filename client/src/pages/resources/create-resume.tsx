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
  const [previewData, setPreviewData] = useState<ResumeFormValues | null>(null);

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
      setPreviewData(data);
      toast({
        title: "Resume Preview Ready",
        description: "You can now preview your resume before downloading.",
      });
    } catch (error) {
      console.error("Error generating preview:", error);
      toast({
        title: "Error",
        description: "There was an error generating your resume preview. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Function to generate PDF from form data with clean metadata
  const generatePdf = (data: ResumeFormValues) => {
    // Create PDF document with minimal metadata to avoid antivirus flags
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
      compress: true
    });
    
    // Remove potentially problematic metadata
    doc.setProperties({
      title: `Resume - ${data.personalInfo.firstName} ${data.personalInfo.lastName}`,
      subject: 'Professional Resume',
      creator: 'Expert Recruitments Resume Builder',
      producer: 'Expert Recruitments LLC',
      keywords: 'resume,cv,professional',
    });
    
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = 20;
    
    // Using only standard fonts (helvetica) which are embedded in PDF spec
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    
    // Add full name - sanitize inputs to prevent injection
    const fullName = `${data.personalInfo.firstName} ${data.personalInfo.lastName}`.substring(0, 100);
    doc.text(fullName, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 10;
    
    // Add contact info
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    
    const contactInfo = `${data.personalInfo.email} | ${data.personalInfo.phone}`.substring(0, 150);
    doc.text(contactInfo, pageWidth / 2, yPosition, { align: "center" });
    yPosition += 6;
    
    // Add address if available - sanitize address
    if (data.personalInfo.address) {
      let addressParts = [];
      if (data.personalInfo.address) addressParts.push(data.personalInfo.address);
      if (data.personalInfo.city) addressParts.push(data.personalInfo.city);
      if (data.personalInfo.postalCode) addressParts.push(data.personalInfo.postalCode);
      if (data.personalInfo.country) addressParts.push(data.personalInfo.country);
      
      const address = addressParts.join(", ").substring(0, 200);
      doc.text(address, pageWidth / 2, yPosition, { align: "center" });
      yPosition += 10;
    }
    
    // Add separator
    doc.setDrawColor(100, 100, 100);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 8;
    
    // Add summary if available - sanitize summary
    if (data.personalInfo.summary) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Professional Summary", margin, yPosition);
      yPosition += 6;
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const sanitizedSummary = data.personalInfo.summary.substring(0, 1000); // Limit length
      const textLines = doc.splitTextToSize(sanitizedSummary, pageWidth - (margin * 2));
      doc.text(textLines, margin, yPosition);
      yPosition += (textLines.length * 5) + 8;
    }
    
    // Add experience section with sanitized inputs
    if (data.experience.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Work Experience", margin, yPosition);
      yPosition += 6;
      
      data.experience.forEach((exp) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        const position = exp.position.substring(0, 150);
        doc.text(position, margin, yPosition);
        yPosition += 5;
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        let companyText = exp.company;
        if (exp.startDate && exp.endDate) {
          companyText += ` | ${exp.startDate} - ${exp.endDate}`;
        }
        doc.text(companyText.substring(0, 150), margin, yPosition);
        yPosition += 5;
        
        if (exp.description) {
          const sanitizedDesc = exp.description.substring(0, 1000);
          const descLines = doc.splitTextToSize(sanitizedDesc, pageWidth - (margin * 2));
          doc.text(descLines, margin, yPosition);
          yPosition += (descLines.length * 5) + 5;
        } else {
          yPosition += 5;
        }
      });
      
      yPosition += 5;
    }
    
    // Add education section with sanitized inputs
    if (data.education.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Education", margin, yPosition);
      yPosition += 6;
      
      data.education.forEach((edu) => {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        const degree = edu.degree.substring(0, 150);
        doc.text(degree, margin, yPosition);
        yPosition += 5;
        
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        let institutionText = edu.institution;
        if (edu.startDate && edu.endDate) {
          institutionText += ` | ${edu.startDate} - ${edu.endDate}`;
        }
        doc.text(institutionText.substring(0, 150), margin, yPosition);
        yPosition += 5;
        
        if (edu.fieldOfStudy) {
          const fieldText = `Field of Study: ${edu.fieldOfStudy}`.substring(0, 150);
          doc.text(fieldText, margin, yPosition);
          yPosition += 5;
        }
        
        if (edu.description) {
          const sanitizedDesc = edu.description.substring(0, 1000);
          const descLines = doc.splitTextToSize(sanitizedDesc, pageWidth - (margin * 2));
          doc.text(descLines, margin, yPosition);
          yPosition += (descLines.length * 5) + 5;
        } else {
          yPosition += 5;
        }
      });
      
      yPosition += 5;
    }
    
    // Add skills section with sanitized inputs
    if (data.skills.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("Skills", margin, yPosition);
      yPosition += 6;
      
      // Limit the number of skills to prevent bloating
      const limitedSkills = data.skills.slice(0, 20);
      const skillsText = limitedSkills
        .map((skill) => `${skill.name}${skill.level ? ` (${skill.level})` : ""}`)
        .join(", ")
        .substring(0, 500);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const skillLines = doc.splitTextToSize(skillsText, pageWidth - (margin * 2));
      doc.text(skillLines, margin, yPosition);
    }
    
    // Add a footer with creation timestamp (helps avoid identical file hashes)
    const timestamp = new Date().toISOString().split('T')[0];
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated: ${timestamp} | Expert Recruitments LLC`, pageWidth / 2, 285, { align: "center" });
    
    // Reset text color
    doc.setTextColor(0, 0, 0);
    
    try {
      // Generate clean filename with only alphanumeric characters and underscores
      const cleanFirstName = data.personalInfo.firstName.replace(/[^a-zA-Z0-9]/g, "_");
      const cleanLastName = data.personalInfo.lastName.replace(/[^a-zA-Z0-9]/g, "_");
      const safeFilename = `${cleanFirstName}_${cleanLastName}_Resume`;
      
      // Save PDF with sanitized filename
      doc.save(safeFilename + ".pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Fallback to a generic filename if there's an issue
      doc.save("Resume.pdf");
    }
  };

  if (previewData) {
    return (
      <div className="container mx-auto py-10 px-4 md:px-6">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Resume Preview</h1>
              <p className="text-gray-500">
                Review your resume and download it as a PDF.
              </p>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setPreviewData(null)}
              >
                Edit Resume
              </Button>
              <Button 
                onClick={() => {
                  generatePdf(previewData);
                  toast({
                    title: "Resume Downloaded",
                    description: "Your resume has been generated and downloaded successfully!",
                  });
                }}
                className="bg-primary"
              >
                Download PDF
              </Button>
            </div>
          </div>
          
          <Card className="max-w-3xl mx-auto">
            <CardContent className="p-8">
              {/* Preview content */}
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold">
                  {previewData.personalInfo.firstName} {previewData.personalInfo.lastName}
                </h2>
                <p className="text-gray-600 mt-1">
                  {previewData.personalInfo.email} | {previewData.personalInfo.phone}
                </p>
                {previewData.personalInfo.address && (
                  <p className="text-gray-600 mt-1">
                    {previewData.personalInfo.address}
                    {previewData.personalInfo.city && `, ${previewData.personalInfo.city}`}
                    {previewData.personalInfo.postalCode && ` ${previewData.personalInfo.postalCode}`}
                    {previewData.personalInfo.country && `, ${previewData.personalInfo.country}`}
                  </p>
                )}
              </div>
              
              {previewData.personalInfo.summary && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold border-b-2 border-gray-300 pb-1 mb-3">Professional Summary</h3>
                  <p className="text-gray-700">{previewData.personalInfo.summary}</p>
                </div>
              )}
              
              {previewData.experience.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold border-b-2 border-gray-300 pb-1 mb-3">Work Experience</h3>
                  <div className="space-y-4">
                    {previewData.experience.map((exp, index) => (
                      <div key={index}>
                        <h4 className="font-bold">{exp.position}</h4>
                        <p className="text-gray-700">
                          {exp.company}
                          {exp.startDate && exp.endDate && ` | ${exp.startDate} - ${exp.endDate}`}
                        </p>
                        {exp.description && (
                          <p className="text-gray-700 mt-2">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {previewData.education.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold border-b-2 border-gray-300 pb-1 mb-3">Education</h3>
                  <div className="space-y-4">
                    {previewData.education.map((edu, index) => (
                      <div key={index}>
                        <h4 className="font-bold">{edu.degree}</h4>
                        <p className="text-gray-700">
                          {edu.institution}
                          {edu.startDate && edu.endDate && ` | ${edu.startDate} - ${edu.endDate}`}
                        </p>
                        {edu.fieldOfStudy && (
                          <p className="text-gray-700">Field of Study: {edu.fieldOfStudy}</p>
                        )}
                        {edu.description && (
                          <p className="text-gray-700 mt-2">{edu.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {previewData.skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold border-b-2 border-gray-300 pb-1 mb-3">Skills</h3>
                  <p className="text-gray-700">
                    {previewData.skills.map((skill, index) => (
                      <span key={index} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                        {skill.name} {skill.level && `(${skill.level})`}
                      </span>
                    ))}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="col-span-1 md:col-span-2">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2">Create Your Resume</h1>
            <p className="text-gray-500">
              Fill in the form to create a professional resume. Once complete, you can preview and download it as a PDF.
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
                            Preview Resume
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