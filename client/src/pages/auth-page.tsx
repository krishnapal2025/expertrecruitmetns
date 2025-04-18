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
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  
  // Determine initial auth type based on URL (if coming from a Sign Up link)
  const initialAuthType = searchParams.get("type") ? "register" : "login";
  const [authType, setAuthType] = useState<"login" | "register">(initialAuthType);
  const [userType, setUserType] = useState<"jobseeker" | "employer">(
    initialUserType === "employer" ? "employer" : "jobseeker"
  );
  
  const { 
    currentUser, 
    loginMutation, 
    registerJobSeekerMutation, 
    registerEmployerMutation 
  } = useAuth();
  
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
      }
    });
  };
  
  // Handle employer registration submission
  const onEmployerSubmit = (data: EmployerRegister) => {
    registerEmployerMutation.mutate(data, {
      onSuccess: () => {
        navigate("/");
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
              <Tabs
                defaultValue={authType}
                onValueChange={(v) => setAuthType(v as "login" | "register")}
                className="w-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <TabsList>
                    <TabsTrigger value="login">Login</TabsTrigger>
                    <TabsTrigger value="register">Register</TabsTrigger>
                  </TabsList>
                  
                  {authType === "register" && (
                    <div className="space-x-2">
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
                  )}
                </div>
                
                <Card>
                  {/* Login Form */}
                  <TabsContent value="login">
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
                  </TabsContent>
                  
                  {/* Registration Forms */}
                  <TabsContent value="register">
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
                                Sign Up
                              </Button>
                            </form>
                          </Form>
                        </CardContent>
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
                                      <Input placeholder="Acme Corporation" {...field} />
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
                                    <FormLabel>Website Address</FormLabel>
                                    <FormControl>
                                      <Input placeholder="https://example.com" {...field} />
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
                                Sign Up
                              </Button>
                            </form>
                          </Form>
                        </CardContent>
                      </>
                    )}
                  </TabsContent>
                </Card>
              </Tabs>
            </div>
            
            {/* Right side: Hero section */}
            <div className="md:col-span-2 bg-primary text-white rounded-lg p-8 flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-4">Your Career Journey Starts Here</h1>
                <p className="text-lg opacity-90 mb-6">
                  Connect with the best opportunities and talents in the industry. We're here to help you succeed.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <div className="rounded-full bg-white/20 p-1 mr-3 mt-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Access to thousands of job opportunities</span>
                  </li>
                  <li className="flex items-start">
                    <div className="rounded-full bg-white/20 p-1 mr-3 mt-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Professional career guidance and resources</span>
                  </li>
                  <li className="flex items-start">
                    <div className="rounded-full bg-white/20 p-1 mr-3 mt-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Personalized job recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <div className="rounded-full bg-white/20 p-1 mr-3 mt-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Direct connection with top employers</span>
                  </li>
                </ul>
              </div>
              
              <div className="mt-8">
                <p className="text-sm opacity-80">
                  By signing up, you agree to our <Link href="/privacy-policy"><a className="underline">Privacy Policy</a></Link> and <Link href="/terms"><a className="underline">Terms of Service</a></Link>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
