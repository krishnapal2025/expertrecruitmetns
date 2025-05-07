import { useState } from "react";
import { useLocation } from "wouter";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuth } from "@/hooks/use-auth";

// Super admin signup schema with enhanced validation
const superAdminSignupSchema = z.object({
  email: z.string()
    .min(1, "Email is required")
    .email("Invalid email format"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
  securityKey: z.string().min(1, "Super admin security key is required")
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type SuperAdminSignupFormValues = z.infer<typeof superAdminSignupSchema>;

export default function SuperAdminSignupPage() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  // Redirect if already logged in
  if (user) {
    setLocation('/admin-dashboard');
    return null;
  }
  
  const form = useForm<SuperAdminSignupFormValues>({
    resolver: zodResolver(superAdminSignupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
      securityKey: ""
    },
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: SuperAdminSignupFormValues) {
    setIsSubmitting(true);
    
    try {
      // Send data to super admin signup endpoint
      const response = await apiRequest("POST", "/api/super-admin/signup", {
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        securityKey: values.securityKey,
        role: "super_admin", // Explicitly set the role
        userType: "super_admin" // Set the user type
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Super admin registration failed");
      }
      
      // Success - show message and redirect
      toast({
        title: "Super Administrator Created",
        description: "Your super admin account has been created successfully. You can now login.",
        variant: "default",
      });
      
      // Redirect to login page
      setLocation('/admin-login');
      
    } catch (error) {
      console.error("Super admin registration error:", error);
      toast({
        title: "Registration Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Left side with form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Create Super Admin Account</CardTitle>
            <CardDescription className="text-center">
              Enter your details to create a super administrator account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
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
                    control={form.control}
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
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="admin@company.com" 
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <PasswordInput placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormDescription>
                        Use a strong password with mixed characters, numbers, and symbols
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
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <PasswordInput placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="securityKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Super Admin Security Key</FormLabel>
                      <FormControl>
                        <PasswordInput 
                          placeholder="Enter security key" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        This is a high-security key for creating super administrator accounts
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Creating Account..." : "Create Super Admin Account"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <div className="text-center text-sm">
              Already have an admin account?{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto text-primary" 
                onClick={() => setLocation('/admin-login')}
              >
                Sign in
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      {/* Right side with description */}
      <div className="hidden lg:flex lg:flex-1 bg-primary text-primary-foreground">
        <div className="flex flex-col justify-center p-12 max-w-xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Super Administrator Access</h1>
          <p className="text-lg mb-6">
            Super administrators have enhanced privileges beyond regular admin accounts:
          </p>
          <ul className="space-y-4 text-lg">
            <li className="flex items-start">
              <span className="mr-2 text-xl">✓</span>
              <span>Full unrestricted access to all system features and functions</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-xl">✓</span>
              <span>Ability to manage and override all regular administrator actions</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-xl">✓</span>
              <span>Complete control over user management and security settings</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-xl">✓</span>
              <span>Enhanced permissions for creating and managing other administrators</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-xl">✓</span>
              <span>Bypass approval processes and content restrictions</span>
            </li>
          </ul>
          <div className="mt-8 text-lg italic">
            Note: Super admin access should be limited to top-level management only
          </div>
        </div>
      </div>
    </div>
  );
}