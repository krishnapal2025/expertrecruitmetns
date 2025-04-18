import { useState, useEffect } from "react";
import { useLocation, useSearch, Link } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  jobSeekerRegisterSchema, 
  employerRegisterSchema, 
  loginSchema, 
  type JobSeekerRegister, 
  type EmployerRegister, 
  type LoginCredentials 
} from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, BriefcaseIcon, UserIcon } from "lucide-react";

const countries = [
  "United States", "United Kingdom", "Canada", "Australia", 
  "Germany", "France", "Japan", "China", "India", "Brazil"
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

export default function AuthPage() {
  const [location, navigate] = useLocation();
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const initialUserType = searchParams.get("type") || "jobseeker";
  
  // Determine auth mode based on URL parameters
  const tabParam = searchParams.get("tab");
  const isLoginMode = tabParam === "login";
  const [userType, setUserType] = useState<"jobseeker" | "employer">(
    initialUserType === "employer" ? "employer" : "jobseeker"
  );
  
  const { 
    currentUser, 
    loginMutation, 
    registerJobSeekerMutation, 
    registerEmployerMutation 
  } = useAuth();
  const { toast } = useToast();
  
  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);
  
  // Login form
  const loginForm = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });
  
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
  
  // Handle login submission
  const onLoginSubmit = (data: LoginCredentials) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        navigate("/");
      }
    });
  };
  
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
          // We'll let the login page handle showing a fresh form
        }
      }
    });
  };
  
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
          // We'll let the login page handle showing a fresh form
        }
      }
    });
  };
  
  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8">
            {/* Left side: Auth forms */}
            <div className="md:col-span-3">
              {isLoginMode ? (
                // LOGIN MODE
                <>
                  <div className="mb-4">
                    {/* No header text for login page */}
                  </div>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Welcome Back</CardTitle>
                      <CardDescription>Sign in to access your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Form {...loginForm}>
                        <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                          <FormField
                            control={loginForm.control}
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
                          
                          <FormField
                            control={loginForm.control}
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
                          
                          <div className="flex items-center justify-end">
                            <Link 
                              href="/auth/forgot-password" 
                              className="text-sm text-primary hover:underline"
                            >
                              Forgot password?
                            </Link>
                          </div>
                          
                          <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={loginMutation.isPending}
                          >
                            {loginMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : null}
                            Sign In
                          </Button>
                        </form>
                      </Form>
                    </CardContent>
                    <CardFooter className="flex justify-center">
                      <p className="text-sm text-gray-500">
                        Don't have an account?{" "}
                        <Link href="/auth?type=jobseeker" className="text-primary font-medium hover:underline">
                          Sign up
                        </Link>
                      </p>
                    </CardFooter>
                  </Card>
                </>
              ) : (
                // REGISTER MODE
                <>
                  <div className="flex items-center justify-between mb-4">
                    {/* No header text for registration page */}
                    
                    <div className="ml-auto space-x-2">
                      <Button
                        variant={userType === "jobseeker" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setUserType("jobseeker")}
                      >
                        <UserIcon className="w-4 h-4 mr-2" />
                        Job Seeker
                      </Button>
                      <Button
                        variant={userType === "employer" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setUserType("employer")}
                      >
                        <BriefcaseIcon className="w-4 h-4 mr-2" />
                        Employer
                      </Button>
                    </div>
                  </div>
                  
                  <Card>
                    {userType === "jobseeker" ? (
                      <>
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
                                            <SelectItem key={country} value={country}>
                                              {country}
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
                                        <Input placeholder="+1 (555) 000-0000" {...field} />
                                      </FormControl>
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
                                Create Account
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
                      </>
                    ) : (
                      <>
                        <CardHeader>
                          <CardTitle>Employer Registration</CardTitle>
                          <CardDescription>Create your employer account</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <Form {...employerForm}>
                            <form onSubmit={employerForm.handleSubmit(onEmployerSubmit)} className="space-y-4">
                              <FormField
                                control={employerForm.control}
                                name="companyName"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Company Name</FormLabel>
                                    <FormControl>
                                      <Input placeholder="Acme Inc." {...field} />
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
                                            <SelectItem key={country} value={country}>
                                              {country}
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
                                        <Input placeholder="+1 (555) 000-0000" {...field} />
                                      </FormControl>
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
                                className="w-full" 
                                disabled={registerEmployerMutation.isPending}
                              >
                                {registerEmployerMutation.isPending ? (
                                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                ) : null}
                                Create Account
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
                      </>
                    )}
                  </Card>
                </>
              )}
            </div>
            
            {/* Right side: Hero section */}
            <div className="md:col-span-2">
              <div className="h-full flex flex-col justify-center bg-primary text-primary-foreground rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-4">Join Our Talent Network</h2>
                <p className="mb-6">
                  Connect with top employers and find your dream job or source the best talent for your company.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="bg-white/10 p-2 rounded-full mr-3">
                      <UserIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">For Job Seekers</h3>
                      <p className="text-sm opacity-80">
                        Access thousands of job opportunities tailored to your skills and career goals.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-white/10 p-2 rounded-full mr-3">
                      <BriefcaseIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">For Employers</h3>
                      <p className="text-sm opacity-80">
                        Find the right talent quickly with our advanced matching algorithms and recruitment tools.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-auto pt-8">
                  <div className="text-sm opacity-70">
                    By signing up, you agree to our <Link href="/privacy-policy" className="underline">Privacy Policy</Link> and <Link href="/terms" className="underline">Terms of Service</Link>.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}