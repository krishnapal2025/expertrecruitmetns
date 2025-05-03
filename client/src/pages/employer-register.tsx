import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { employerRegisterSchema, EmployerRegister } from "@shared/schema";
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

const industries = [
  "Technology", "Healthcare", "Finance", "Education",
  "Manufacturing", "Retail", "Construction", "Transportation",
  "Hospitality", "Media", "Professional Services"
];

const companyTypes = [
  "Corporation", "Limited Liability Company", "Partnership",
  "Sole Proprietorship", "Non-Profit Organization", "Government Agency"
];

export default function EmployerRegisterPage() {
  const [, navigate] = useLocation();
  const { currentUser, registerEmployerMutation } = useAuth();
  const { toast } = useToast();
  
  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);
  
  // Employer registration form
  const employerForm = useForm<EmployerRegister>({
    resolver: zodResolver(employerRegisterSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      companyName: "",
      industry: "",
      companyType: "",
      phoneNumber: "",
      country: "",
      website: "",
      userType: "employer"
    }
  });
  
  // Track selected country for employer to update phone number field
  const [selectedEmployerCountryCode, setSelectedEmployerCountryCode] = useState<string>("");
  
  // Watch the employer country field to update the phone prefix
  const selectedEmployerCountry = employerForm.watch("country");
  
  // Update employer country code when country changes
  useEffect(() => {
    if (selectedEmployerCountry) {
      const countryData = countries.find(c => c.name === selectedEmployerCountry);
      if (countryData) {
        setSelectedEmployerCountryCode(countryData.code);
      }
    }
  }, [selectedEmployerCountry]);
  
  // Handle employer registration submission
  const onEmployerSubmit = (data: EmployerRegister) => {
    registerEmployerMutation.mutate(data, {
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
    <div className="min-h-screen pt-6 pb-12 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 min-h-[36rem]">
            {/* Left side: Registration form */}
            <div className="md:col-span-3">
              <Card className="shadow-lg border-t-4 border-t-primary">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl text-primary font-bold">Employer Registration</CardTitle>
                  <CardDescription className="text-base">Create your employer account and hire top talent in UAE & GCC</CardDescription>
                </CardHeader>
                <CardContent className="px-6 py-2">
                  <Form {...employerForm}>
                    <form onSubmit={employerForm.handleSubmit(onEmployerSubmit)} className="space-y-6">
                      <FormField
                        control={employerForm.control}
                        name="companyName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Company Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Company Ltd." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={employerForm.control}
                          name="industry"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Industry</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select industry" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {industries.map((industry) => (
                                    <SelectItem key={industry} value={industry}>
                                      {industry}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={employerForm.control}
                          name="companyType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company Type</FormLabel>
                              <Select 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select company type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {companyTypes.map((type) => (
                                    <SelectItem key={type} value={type}>
                                      {type}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <FormField
                          control={employerForm.control}
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
                          control={employerForm.control}
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
                              {selectedEmployerCountryCode && (
                                <FormDescription>
                                  Include country code: {selectedEmployerCountryCode}
                                </FormDescription>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={employerForm.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <Input placeholder="https://www.example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Separator className="my-4" />
                      
                      <FormField
                        control={employerForm.control}
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
                          control={employerForm.control}
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
                          control={employerForm.control}
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
                        className="w-full text-base py-6 bg-[#4060e0] hover:bg-[#3050d0] font-bold" 
                        disabled={registerEmployerMutation.isPending}
                      >
                        {registerEmployerMutation.isPending ? (
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        ) : null}
                        Create Employer Account
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
            <div className="md:col-span-2 bg-primary text-white rounded-lg p-8 flex flex-col justify-center shadow-lg h-full min-h-[30rem]">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-3">For Employers</h2>
                <p className="text-primary-foreground/90 text-lg">
                  Connect with talented professionals and grow your team with our comprehensive recruitment tools.
                </p>
              </div>
              
              <div className="space-y-6 mb-4">
                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-full mr-4 flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Talent Acquisition</h3>
                    <p className="text-base text-primary-foreground/90">Access a pool of qualified candidates across UAE & GCC</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-full mr-4 flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Simplified Hiring</h3>
                    <p className="text-base text-primary-foreground/90">Post jobs, screen applicants, and conduct interviews all in one place</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-white/20 p-2 rounded-full mr-4 flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Recruitment Analytics</h3>
                    <p className="text-base text-primary-foreground/90">Track recruitment metrics and optimize your hiring process</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-auto pt-8">
                <div className="bg-white/10 rounded-lg p-4 border border-white/20">
                  <h3 className="font-semibold text-lg mb-2">Join Today and Get:</h3>
                  <p className="text-base text-primary-foreground/90 mb-3">
                    Access to Dubai & UAE's top talent pool for your hiring needs
                  </p>
                  <p className="text-sm text-primary-foreground/70">
                    By joining, you agree to our terms of service and privacy policy
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}