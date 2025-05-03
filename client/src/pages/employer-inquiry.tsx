import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X, Send, Building } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Helmet } from "react-helmet";
import { apiRequest } from "@/lib/queryClient";
import { MotionDiv } from "@/components/ui/motion-div";
import { useAuth } from "@/hooks/use-auth";

// Define the form schema
const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  company: z.string().min(1, { message: "Company name is required" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
  marketing: z.boolean().optional()
});

type FormValues = z.infer<typeof formSchema>;

export default function EmployerInquiryPage() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const { currentUser } = useAuth();
  
  // Pre-fill form with user profile data if available
  const defaultValues: Partial<FormValues> = {
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    marketing: false
  };

  // If user is logged in and is an employer, pre-fill data
  if (currentUser && currentUser.user.userType === "employer") {
    defaultValues.name = currentUser.user.name || "";
    defaultValues.email = currentUser.user.email;
    defaultValues.phone = currentUser.profile.phoneNumber || "";
    defaultValues.company = currentUser.profile.companyName || "";
  }

  // Set up the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  // Handle form submission
  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const response = await apiRequest("POST", "/api/inquiries", {
        ...values,
        inquiryType: "Employer Inquiry" // Always mark as employer inquiry
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit inquiry");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Inquiry Submitted",
        description: "Thank you for your inquiry. We will contact you shortly.",
        variant: "success",
      });
      form.reset(defaultValues);
    },
    onError: (error: Error) => {
      toast({
        title: "Submission Failed",
        description: error.message || "An error occurred. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (values: FormValues) => {
    mutation.mutate(values);
  };

  return (
    <>
      <Helmet>
        <title>Employer Inquiry | Expert Recruitments LLC</title>
        <meta name="description" content="Submit your employer inquiry to discuss your hiring needs with our expert consultants." />
      </Helmet>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-12">
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Employer Inquiry</h1>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Complete the form below to discuss your hiring needs with our consultants. We'll help you find the perfect talent for your organization.
              </p>
            </div>
          </MotionDiv>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card className="border-primary/10 shadow-md">
                <CardHeader className="bg-primary/5 border-b border-primary/10">
                  <CardTitle className="flex items-center text-2xl text-primary">
                    <Building className="h-6 w-6 mr-2" />
                    Employer Inquiry Form
                  </CardTitle>
                  <CardDescription>
                    Fill out this form and our team will get back to you within 24 hours.
                  </CardDescription>
                </CardHeader>

                {submitted ? (
                  <CardContent className="pt-6 pb-8 px-6">
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <Check className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You for Your Inquiry!</h3>
                      <p className="text-center text-gray-600 mb-6 max-w-md">
                        Your inquiry has been successfully submitted. One of our recruiters will reach out to you soon to discuss your hiring needs.
                      </p>
                      <Button 
                        onClick={() => setSubmitted(false)}
                        variant="outline"
                        className="mt-2"
                      >
                        Submit Another Inquiry
                      </Button>
                    </div>
                  </CardContent>
                ) : (
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                      <CardContent className="space-y-4 pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name*</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your full name" {...field} />
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
                                <FormLabel>Email Address*</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="your.email@company.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number*</FormLabel>
                                <FormControl>
                                  <Input placeholder="+1 123 456 7890" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="company"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Company Name*</FormLabel>
                                <FormControl>
                                  <Input placeholder="Your company name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="message"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Inquiry Details*</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Please provide details about your hiring needs, requirements, and any specific questions you may have."
                                  className="min-h-[120px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="marketing"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 mt-6">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel className="font-normal cursor-pointer">
                                  I would like to receive updates about new services, talent pools, and recruitment insights.
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      </CardContent>
                      <CardFooter className="flex justify-between border-t border-border pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => form.reset(defaultValues)}
                          disabled={mutation.isPending}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Reset
                        </Button>
                        <Button
                          type="submit"
                          disabled={mutation.isPending}
                          className="bg-primary text-white hover:bg-primary/90"
                        >
                          {mutation.isPending ? (
                            <>
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-white"></div>
                              Submitting...
                            </>
                          ) : (
                            <>
                              <Send className="h-4 w-4 mr-2" />
                              Submit Inquiry
                            </>
                          )}
                        </Button>
                      </CardFooter>
                    </form>
                  </Form>
                )}
              </Card>
            </div>

            <div className="md:col-span-1 space-y-6">
              <Card className="border-primary/10 shadow-md bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-primary">Why Partner With Us?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-sm text-gray-700">Access to a vetted talent pool across multiple industries</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-sm text-gray-700">Tailored recruitment solutions for your specific needs</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-sm text-gray-700">Reduced time-to-hire with our streamlined process</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-sm text-gray-700">Dedicated account manager throughout your hiring journey</p>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mr-3 mt-0.5">
                      <Check className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-sm text-gray-700">Expertise in UAE labor market and recruitment regulations</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-primary/10 shadow-md">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-primary">Our Process</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs font-medium">1</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Initial Consultation</h4>
                      <p className="text-xs text-gray-600">We'll discuss your hiring needs and requirements</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs font-medium">2</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Candidate Sourcing</h4>
                      <p className="text-xs text-gray-600">Our team identifies and screens suitable candidates</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs font-medium">3</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Candidate Presentation</h4>
                      <p className="text-xs text-gray-600">Review shortlisted candidates who match your criteria</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs font-medium">4</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Interview Support</h4>
                      <p className="text-xs text-gray-600">We facilitate the interview process between you and candidates</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-xs font-medium">5</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Placement & Follow-up</h4>
                      <p className="text-xs text-gray-600">Assistance with offer negotiation and onboarding support</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}