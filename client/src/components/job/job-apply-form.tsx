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
    mutationFn: async (data: ApplicationFormValues) => {
      // Send application data to server
      const res = await apiRequest("POST", `/api/jobs/${jobId}/apply`, {
        coverLetter: data.coverLetter,
      });
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
  
  // Handle file upload
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real implementation, we would handle the file upload here
      // For this demo, we'll just store the filename
      setFileName(file.name);
    }
  };
  
  // Handle form submission
  const onSubmit = (data: ApplicationFormValues) => {
    // Simulate file upload if a file was selected
    if (fileName) {
      setIsUploading(true);
      // Simulate upload delay
      setTimeout(() => {
        setIsUploading(false);
        // Submit application
        applicationMutation.mutate(data);
      }, 1500);
    } else {
      // Submit application without file
      applicationMutation.mutate(data);
    }
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
                accept=".pdf,.doc,.docx"
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
