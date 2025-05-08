import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { adminSignupSchema, type AdminSignup } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { apiRequest, queryClient } from "@/lib/queryClient";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserIcon, ShieldCheck, RefreshCcw } from "lucide-react";
import { Loader2 } from "lucide-react";

// Use the schema we defined in shared/schema.ts
type FormValues = AdminSignup;

export default function SuperAdminSignupPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.userType === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  // Register admin
  const registerMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      console.log("Submitting form data:", data); // Log the data being sent
      
      // Detect deployment environment more comprehensively
      const isFlyIoEnvironment = window.location.hostname.includes('.fly.dev') ||
                               window.location.hostname.endsWith('.fly.io');
      const isReplitEnvironment = window.location.hostname.endsWith('.replit.app');
      const isProduction = process.env.NODE_ENV === 'production' || 
                         window.location.hostname !== 'localhost';
      const isCrossDomainEnvironment = isFlyIoEnvironment || isReplitEnvironment;
      
      console.log("Environment detection:", {
        isFlyIo: isFlyIoEnvironment,
        isReplit: isReplitEnvironment,
        isProduction,
        isCrossDomain: isCrossDomainEnvironment,
        hostname: window.location.hostname
      });
      
      try {
        // Enhanced headers for cross-domain requests
        const customHeaders: Record<string, string> = {
          'X-Client-Environment': isCrossDomainEnvironment ? 'cross-domain' : 'same-origin',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        };
        
        // Set credentials to include for cookie-based authentication
        const res = await apiRequest("POST", "/api/admin/signup", data, {
          credentials: 'include', // Important for cross-domain cookie handling in production
          headers: customHeaders
        });
        console.log("Response status:", res.status); // Log the response status
        
        if (!res.ok) {
          // Handle specific status codes
          if (res.status === 401) {
            // For 401 Unauthorized, provide a more specific message
            throw new Error("Your session has expired. Please refresh the page and try again.");
          }
          
          const errorData = await res.json().catch(() => ({ message: "Unknown error occurred" }));
          console.error("Error response:", errorData);
          throw new Error(errorData.message || "Registration failed");
        }
        
        const responseData = await res.json().catch(() => ({ message: "Failed to parse response" }));
        console.log("Success response:", responseData);
        
        // Check for various deployment environment indicators
        if (responseData.user && responseData.admin) {
          // Check if we have user data without session cookies (common in cross-domain scenarios)
          const hasCookie = document.cookie.includes('connect.sid');
          
          // Log session state for debugging
          console.log("Session state after signup:", {
            cookieExists: hasCookie,
            crossDomain: isCrossDomainEnvironment,
            responseEnvironment: responseData.environment,
            responseHasNotes: !!responseData.notes
          });
          
          // Add deployment environment info if not provided by server
          if (isCrossDomainEnvironment && !responseData.environment) {
            responseData.environment = 'cross-domain';
            responseData.notes = responseData.notes || {
              sessionInfo: "Client detected cross-domain environment",
              clientHostname: window.location.hostname
            };
          }
        }
        
        return responseData;
      } catch (err) {
        console.error("Registration error:", err);
        throw err;
      }
    },
    onSuccess: (data) => {
      console.log("Registration successful:", data);
      
      // Check if there's environment info in the response
      const isDeploymentEnvironment = data.environment === 'cross-domain';
      const hasCrossDomainNotes = data.notes && data.notes.sessionInfo;
      
      if (isDeploymentEnvironment || hasCrossDomainNotes) {
        // Display success with special handling for deployment environments
        toast({
          title: "Registration successful - Deployment environment",
          description: "Your super admin account has been created. In deployment environments, you may need to log in manually with your new credentials.",
          variant: "default",
          duration: 8000, // Longer duration for this important message
        });
        
        // Update query cache with user data if available
        if (data.user) {
          queryClient.setQueryData(["/api/user"], data.user);
          
          // Show session info if provided
          if (hasCrossDomainNotes) {
            console.log("Cross-domain session info:", data.notes);
          }
          
          // Add a slight delay before redirecting to allow reading the message
          setTimeout(() => {
            navigate("/admin-login");
          }, 4000);
        } else {
          console.warn("User data missing from success response in deployment environment");
          navigate("/admin-login");
        }
      } else {
        // Standard success for development environment
        toast({
          title: "Registration successful",
          description: "Your super admin account has been created.",
          variant: "default",
        });
        
        if (data.user) {
          queryClient.setQueryData(["/api/user"], data.user);
        } else {
          console.warn("User data missing from success response");
        }
        
        navigate("/admin");
      }
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast({
        title: "Registration failed",
        description: error.message || "Could not create the super admin account. Please try again.",
        variant: "destructive",
      });
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(adminSignupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      role: "super_admin", // Default to super_admin
      phoneNumber: "+971 ",
    },
  });

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    console.log("Form data validated:", data);
    
    // Ensure role is set to super_admin
    const formData: FormValues = {
      ...data,
      role: "super_admin" as const // Force the role to be super_admin with correct type
    };
    
    // Use the same environment detection as in mutationFn for consistency
    const isFlyIoEnvironment = window.location.hostname.includes('.fly.dev') ||
                             window.location.hostname.endsWith('.fly.io');
    const isReplitEnvironment = window.location.hostname.endsWith('.replit.app');
    const isProduction = process.env.NODE_ENV === 'production' || 
                       window.location.hostname !== 'localhost';
    const isCrossDomainEnvironment = isFlyIoEnvironment || isReplitEnvironment;
    
    // Add specific warnings for different deployment environments
    if (isCrossDomainEnvironment) {
      let environmentName = "deployed";
      let additionalInfo = "";
      
      if (isFlyIoEnvironment) {
        environmentName = "Fly.io";
        additionalInfo = "Cross-domain cookies require special handling in Fly.io environments.";
      } else if (isReplitEnvironment) {
        environmentName = "Replit";
        additionalInfo = "Replit deployments use special session handling.";
      }
      
      console.log(`Detected ${environmentName} environment - adding special handling`);
      
      // Show detailed warning based on environment type
      toast({
        title: `${environmentName} Environment Detected`,
        description: `After successful signup, you may need to log in again with your new credentials. ${additionalInfo}`,
        variant: "default",
        duration: 10000 // Show for 10 seconds
      });
    }
    
    try {
      registerMutation.mutate(formData);
    } catch (error) {
      console.error("Error during mutation:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <Card className="shadow-lg">
          <CardHeader className="space-y-1 text-center bg-primary text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">Create Super Admin Account</CardTitle>
            <CardDescription className="text-white/80">
              Initial setup for Expert Recruitments platform administrator
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6 pb-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700">First Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="John" 
                            className="border-gray-300 focus:border-primary"
                            {...field} 
                          />
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
                        <FormLabel className="text-gray-700">Last Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Doe" 
                            className="border-gray-300 focus:border-primary"
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="your.email@example.com" 
                          className="border-gray-300 focus:border-primary"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="border-gray-300 focus:border-primary"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Password must be at least 6 characters long
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Confirm Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          className="border-gray-300 focus:border-primary"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">Phone Number</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <select 
                            className="w-1/3 rounded-l-md border border-gray-300 p-2 focus:border-primary focus:outline-none"
                            onChange={(e) => {
                              // Extract just the phone number part without the country code prefix
                              const currentNumber = field.value ? field.value.replace(/^\+\d+\s/, '') : '';
                              // Update with new country code
                              field.onChange(`${e.target.value} ${currentNumber}`);
                            }}
                            value={field.value ? field.value.split(' ')[0] : '+971'}
                          >
                            <option value="+971">🇦🇪 +971 (UAE)</option>
                            <option value="+91">🇮🇳 +91 (India)</option>
                            <option value="+1">🇺🇸 +1 (US/Canada)</option>
                            <option value="+44">🇬🇧 +44 (UK)</option>
                            <option value="+966">🇸🇦 +966 (Saudi Arabia)</option>
                            <option value="+65">🇸🇬 +65 (Singapore)</option>
                            <option value="+61">🇦🇺 +61 (Australia)</option>
                            <option value="+49">🇩🇪 +49 (Germany)</option>
                            <option value="+33">🇫🇷 +33 (France)</option>
                          </select>
                          <Input 
                            placeholder="555 123 4567" 
                            className="w-2/3 rounded-l-none border-gray-300 focus:border-primary"
                            onChange={(e) => {
                              // Get the current country code from the field value
                              const countryCode = field.value ? field.value.split(' ')[0] : '+971';
                              // Combine country code with new phone number
                              field.onChange(`${countryCode} ${e.target.value}`);
                            }}
                            value={(field.value ? field.value.replace(/^\+\d+\s/, '') : '') || ''}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800 mt-2">
                  <p><strong>Important:</strong> You are creating a Super Admin account with full administrative privileges.</p>
                  <p className="mt-1">This account will have access to all platform features and user data.</p>
                </div>
                
                <Button
                  type="submit"
                  className="w-full font-medium bg-primary hover:bg-primary/90 text-white transition-colors h-12"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  ) : (
                    <ShieldCheck className="mr-2 h-5 w-5" />
                  )}
                  Create Super Admin Account
                </Button>
                
                {/* Session recovery button */}
                <div className="text-center mt-4">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.reload()}
                    className="text-xs"
                  >
                    <RefreshCcw className="h-3 w-3 mr-1" /> Session expired? Refresh the page
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          
          <CardFooter className="border-t pt-4 flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/admin-login" className="text-primary font-medium hover:underline">
                Sign in here
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}