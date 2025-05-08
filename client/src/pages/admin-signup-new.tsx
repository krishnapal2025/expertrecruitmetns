import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { adminSignupSchema, type AdminSignup } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { apiRequest, queryClient } from "@/lib/queryClient";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserIcon, ShieldCheck } from "lucide-react";
import { Loader2 } from "lucide-react";
import ExpertRecruitmentsBanner from "@/components/common/expert-recruitments-banner";

// Use the schema we defined in shared/schema.ts
type FormValues = AdminSignup;

export default function AdminSignupPage() {
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
      try {
        const res = await apiRequest("POST", "/api/admin/signup", data);
        console.log("Response status:", res.status); // Log the response status
        
        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ message: "Unknown error occurred" }));
          console.error("Error response:", errorData);
          throw new Error(errorData.message || "Registration failed");
        }
        
        const responseData = await res.json().catch(() => ({ message: "Failed to parse response" }));
        console.log("Success response:", responseData);
        return responseData;
      } catch (err) {
        console.error("Registration error:", err);
        throw err;
      }
    },
    onSuccess: (data) => {
      console.log("Registration successful:", data);
      toast({
        title: "Registration successful",
        description: "Your admin account has been created.",
        variant: "default",
      });
      if (data.user) {
        queryClient.setQueryData(["/api/user"], data.user);
      } else {
        console.warn("User data missing from success response");
      }
      navigate("/admin");
    },
    onError: (error: Error) => {
      console.error("Mutation error:", error);
      toast({
        title: "Registration failed",
        description: error.message || "Could not create the admin account. Please try again.",
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
      role: "admin",
      phoneNumber: "+971 ",
    },
  });

  // Check for any form validation errors
  useEffect(() => {
    if (Object.keys(form.formState.errors).length > 0) {
      console.error("Form has validation errors:", form.formState.errors);
    }
  }, [form.formState.errors]);

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    console.log("Form data validated:", data);
    
    try {
      registerMutation.mutate(data);
    } catch (error) {
      console.error("Error during mutation:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-6">
      <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-lg overflow-hidden shadow-xl">
        {/* Left Side - Form */}
        <div className="w-full md:w-1/2 bg-white p-8">
          <div className="flex justify-center mb-5">
            <div className="flex items-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 p-2 mr-3">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg uppercase text-gray-800" style={{ letterSpacing: '0.1em' }}>Admin</span>
                <span className="text-xs text-gray-500">Registration</span>
              </div>
            </div>
          </div>
          
          <div className="mb-5 text-center">
            <h1 className="text-xl font-bold text-gray-900">Create an Admin Account</h1>
            <p className="text-sm text-gray-600 mt-1">
              Enter your details to get started
            </p>
          </div>

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
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Role</FormLabel>
                    <FormControl>
                      <select
                        className="w-full rounded-md border border-gray-300 p-2 focus:border-primary focus:outline-none"
                        {...field}
                      >
                        <option value="admin">Administrator</option>
                        <option value="super_admin">Super Administrator</option>
                        <option value="content_manager">Content Manager</option>
                      </select>
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
                    <FormDescription className="text-xs">
                      Please include your country code
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button
                type="submit"
                className="w-full font-medium bg-[#5372f1] hover:bg-[#4060e0] text-white transition-colors h-12"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <UserIcon className="mr-2 h-5 w-5" />
                )}
                Create Admin Account
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/admin-login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Banner */}
        <div className="hidden md:block md:w-1/2 bg-primary">
          <ExpertRecruitmentsBanner />
        </div>
      </div>
    </div>
  );
}