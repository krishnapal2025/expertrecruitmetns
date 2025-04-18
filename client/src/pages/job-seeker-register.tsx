import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { jobSeekerRegisterSchema, JobSeekerRegister } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

// Country list with their calling codes
const countries = [
  { name: "United States", code: "+1" },
  { name: "United Kingdom", code: "+44" },
  { name: "Canada", code: "+1" },
  { name: "Australia", code: "+61" },
  { name: "Germany", code: "+49" },
  { name: "France", code: "+33" },
  { name: "Japan", code: "+81" },
  { name: "China", code: "+86" },
  { name: "India", code: "+91" },
  { name: "Brazil", code: "+55" },
  { name: "United Arab Emirates", code: "+971" }
];

export default function JobSeekerRegisterPage() {
  const [, navigate] = useLocation();
  const { currentUser, registerJobSeekerMutation } = useAuth();
  const { toast } = useToast();
  
  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);
  
  // Job seeker registration form
  const jobSeekerForm = useForm<JobSeekerRegister>({
    resolver: zodResolver(jobSeekerRegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      gender: "male",
      dateOfBirth: "",
      country: "",
      phoneNumber: "",
      userType: "jobseeker"
    }
  });
  
  // Track selected country for job seeker to update phone number field
  const [selectedJobSeekerCountryCode, setSelectedJobSeekerCountryCode] = useState<string>("");
  
  // Watch the job seeker country field to update the phone prefix
  const selectedJobSeekerCountry = jobSeekerForm.watch("country");
  
  // Update job seeker country code when country changes
  useEffect(() => {
    if (selectedJobSeekerCountry) {
      const countryData = countries.find(c => c.name === selectedJobSeekerCountry);
      if (countryData) {
        setSelectedJobSeekerCountryCode(countryData.code);
      }
    }
  }, [selectedJobSeekerCountry]);
  
  // Handle job seeker registration submission
  const onJobSeekerSubmit = (data: JobSeekerRegister) => {
    registerJobSeekerMutation.mutate(data, {
      onSuccess: () => {
        navigate("/");
      },
      onError: (error) => {
        // If the error message indicates email is already in use
        if (error.message?.includes("already in use") || error.message?.includes("already exists")) {
          // Show toast notification
          toast({
            title: "Email already registered",
            description: "This email is already registered. Please sign in instead.",
            variant: "default",
          });
          // Navigate to login page
          navigate("/auth?tab=login");
        }
      }
    });
  };
  
  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8">
            {/* Left side: Registration form */}
            <div className="md:col-span-3">
              <Card>
                <CardHeader>
                  <CardTitle>Job Seeker Registration</CardTitle>
                  <CardDescription>Create your job seeker account</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...jobSeekerForm}>
                    <form onSubmit={jobSeekerForm.handleSubmit(onJobSeekerSubmit)} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={jobSeekerForm.control}
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
                          control={jobSeekerForm.control}
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
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={jobSeekerForm.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select gender" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={jobSeekerForm.control}
                          name="dateOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Birth</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={jobSeekerForm.control}
                          name="country"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Country</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select country" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {countries.map((country) => (
                                    <SelectItem key={country.name} value={country.name}>
                                      {country.name} ({country.code})
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={jobSeekerForm.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input 
                                  type="tel"
                                  placeholder="Enter your phone number" 
                                  {...field} 
                                />
                              </FormControl>
                              {selectedJobSeekerCountryCode && (
                                <FormDescription>
                                  Include country code: {selectedJobSeekerCountryCode}
                                </FormDescription>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <FormField
                        control={jobSeekerForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                              <Input placeholder="email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={jobSeekerForm.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={jobSeekerForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <Input type="password" placeholder="••••••••" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={registerJobSeekerMutation.isPending}
                      >
                        {registerJobSeekerMutation.isPending ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : null}
                        Create Job Seeker Account
                      </Button>
                    </form>
                  </Form>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <p className="text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link href="/auth?tab=login" className="text-primary font-medium hover:underline">
                      Sign in
                    </Link>
                  </p>
                </CardFooter>
              </Card>
            </div>
            
            {/* Right side: Hero section */}
            <div className="md:col-span-2 bg-primary text-white rounded-lg p-8 flex flex-col justify-center">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">For Job Seekers</h2>
                <p className="text-primary-foreground/90">
                  Join thousands of job seekers who found their perfect role through our platform.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded mr-3 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Personalized Job Matches</h3>
                    <p className="text-sm text-primary-foreground/80">Get job recommendations based on your skills and experience</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded mr-3 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Industry Connections</h3>
                    <p className="text-sm text-primary-foreground/80">Network with leading employers across diverse sectors</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded mr-3 flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">Career Resources</h3>
                    <p className="text-sm text-primary-foreground/80">Access tools and guidance to advance your professional journey</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-auto pt-6">
                <p className="text-sm text-primary-foreground/70">
                  By joining, you agree to our terms of service and privacy policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}