import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";

// Form validation schema
const ApplicationFormSchema = z.object({
  coverLetter: z.string().min(10, "Cover letter must be at least 10 characters"),
  cv: z.any().optional(),
});

type ApplicationFormValues = z.infer<typeof ApplicationFormSchema>;

interface JobApplyFormProps {
  jobId: number;
  jobTitle: string;
  employerName: string;
  onSuccess: () => void;
}

export default function JobApplyForm({ jobId, jobTitle, employerName, onSuccess }: JobApplyFormProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const { toast } = useToast();
  
  // Form setup with validation
  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(ApplicationFormSchema),
    defaultValues: {
      coverLetter: "",
    },
  });
  
  // Job application mutation
  const applicationMutation = useMutation({
    mutationFn: async (data: ApplicationFormValues & { fileData?: File }) => {
      console.log("Starting application mutation with data", { 
        coverLetter: data.coverLetter,
        hasFile: !!data.fileData,
        fileName: data.fileData?.name || 'none'
      });
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("coverLetter", data.coverLetter);
      
      // Add resume file if provided
      if (data.fileData) {
        // Make sure to use the original file name when appending to FormData
        formData.append("resume", data.fileData, data.fileData.name);
        console.log("Resume attached to FormData:", data.fileData.name, 
                    "Size:", data.fileData.size, 
                    "Type:", data.fileData.type);
      }
      
      console.log("Sending application to server endpoint:", `/api/jobs/${jobId}/apply`);
      
      // Send application data with file to server
      const res = await fetch(`/api/jobs/${jobId}/apply`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });
      
      console.log("Server response status:", res.status);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ message: "Unknown server error" }));
        console.error("Application submission error:", errorData);
        throw new Error(errorData.message || "Failed to submit application");
      }
      
      console.log("Application submitted successfully");
      return res.json();
    },
    onSuccess: () => {
      // Show success message
      toast({
        title: "Application submitted",
        description: `Your application for ${jobTitle} at ${employerName} has been successfully submitted.`,
      });
      
      // Invalidate queries to refresh job applications data
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      
      // Close the dialog
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Application failed",
        description: error.message || "An error occurred while submitting your application.",
        variant: "destructive",
      });
    },
  });
  
  // State to store the file object
  const [fileData, setFileData] = useState<File | null>(null);
  
  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check file type
      if (!file.name.match(/\.(pdf|docx)$/i)) {
        toast({
          title: "Invalid file format",
          description: "Only PDF and DOCX files are allowed for resume uploads.",
          variant: "destructive",
        });
        // Reset the input
        event.target.value = '';
        setFileName("");
        setFileData(null);
        return;
      }
      
      // Check file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Resume file size must be less than 5MB.",
          variant: "destructive",
        });
        // Reset the input
        event.target.value = '';
        setFileName("");
        setFileData(null);
        return;
      }
      
      // Store the file object and filename
      setFileData(file);
      setFileName(file.name);
    }
  };
  
  // Handle form submission
  const onSubmit = (data: ApplicationFormValues) => {
    console.log("Job application form submission started");
    setIsUploading(true);
    
    // Validate resume file is selected
    if (!fileData) {
      toast({
        title: "Resume Required",
        description: "Please upload your resume/CV before submitting the application",
        variant: "destructive",
      });
      setIsUploading(false);
      return;
    }
    
    console.log("Resume file validated, file size:", fileData.size, "bytes");
    
    // Submit application with file
    applicationMutation.mutate(
      { 
        ...data, 
        fileData: fileData 
      },
      {
        onSettled: () => {
          setIsUploading(false);
        }
      }
    );
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="coverLetter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Letter</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Tell the employer why you're a good fit for this position..."
                  className="min-h-[150px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="space-y-2">
          <FormLabel htmlFor="cv">Resume/CV (Optional)</FormLabel>
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="cv"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PDF, DOCX (MAX. 5MB)</p>
                {fileName && (
                  <p className="mt-2 text-sm text-primary font-medium">{fileName}</p>
                )}
              </div>
              <Input
                id="cv"
                type="file"
                className="hidden"
                accept=".pdf,.docx"
                onChange={handleFileChange}
              />
            </label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={applicationMutation.isPending || isUploading}
          >
            {(applicationMutation.isPending || isUploading) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isUploading ? "Uploading..." : "Submit Application"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
