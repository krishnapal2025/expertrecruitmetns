import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, ShieldCheck, Lock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import expertLogo from "../assets/er-logo-icon.png";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { queryClient } from "@/lib/queryClient";

// Define form schema
const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const { loginMutation, user } = useAuth();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  
  // If already logged in, redirect to appropriate page
  if (user) {
    if (user.userType === "admin" || user.userType === "super_admin") {
      setLocation("/admin");
    } else {
      setLocation("/");
    }
  }
  
  // Initialize form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  // Handle form submission - use dedicated admin login endpoint
  const onSubmit = async (data: FormValues) => {
    try {
      // Make a direct API call to the admin-only login endpoint
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || 'Login failed');
      }
      
      // Update the user data in React Query cache
      queryClient.setQueryData(["/api/user"], responseData);
      
      toast({
        title: "Login Successful",
        description: "Welcome to your admin dashboard.",
      });
      
      setLocation("/admin");
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-6" style={{ paddingBottom: '10rem' }}>
      <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-lg overflow-hidden shadow-xl">
        {/* Left Side - Form */}
        <div className="w-full md:w-2/5 bg-white p-8">
          <div className="flex justify-center mb-5">
            <div className="flex items-center">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 p-2 mr-3">
                <ShieldCheck className="h-6 w-6 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg uppercase text-gray-800" style={{ letterSpacing: '0.1em' }}>Admin</span>
                <span className="text-xs text-gray-500">Secure Portal</span>
              </div>
            </div>
          </div>
          
          <div className="mb-5 text-center">
            <h1 className="text-xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-sm text-gray-600 mt-1">
              Access restricted to authorized personnel only
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="admin@example.com"
                        type="email"
                        autoComplete="email"
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
                    <div className="relative">
                      <FormControl>
                        <Input
                          placeholder="Enter your password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-500" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full" 
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Log In"
                )}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6">
            <div className="text-center">
              <Link href="/admin/forgot-password" className="text-sm font-medium text-primary hover:underline">
                Forgot your password?
              </Link>
            </div>
            <Separator className="my-4" />
            <div className="text-center">
              <p className="text-xs text-gray-500">
                This portal is for administrative personnel only.
                <br />
                If you're a job seeker or employer, <Link href="/auth" className="text-primary hover:underline">log in here</Link>.
              </p>
            </div>
          </div>
        </div>
        
        {/* Right Side - Information */}
        <div className="w-full md:w-3/5 bg-gradient-to-br from-primary to-primary-600 p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/20"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <img src={expertLogo} alt="Expert Recruitments" className="h-10 w-10 mr-3" />
              <div>
                <h2 className="text-xl font-bold">Expert Recruitments</h2>
                <p className="text-white/80 text-sm">Admin Control Center</p>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-2">Welcome Back</h3>
              <p className="text-white/80 text-sm">
                Access the administrative portal to manage the Expert Recruitments platform.
                Monitor job listings, applications, user accounts, and site content from a central dashboard.
              </p>
            </div>
            
            <div className="space-y-3">
              <Card className="bg-white/10 border-0 backdrop-blur-sm text-white">
                <CardHeader className="py-2 px-4">
                  <CardTitle className="text-base">User Management</CardTitle>
                </CardHeader>
                <CardContent className="py-1 px-4 pb-3">
                  <CardDescription className="text-white/80 text-sm">
                    Manage job seekers, employers, and admin accounts.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-0 backdrop-blur-sm text-white">
                <CardHeader className="py-2 px-4">
                  <CardTitle className="text-base">Content Control</CardTitle>
                </CardHeader>
                <CardContent className="py-1 px-4 pb-3">
                  <CardDescription className="text-white/80 text-sm">
                    Update job listings, blog posts, and site content.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-0 backdrop-blur-sm text-white">
                <CardHeader className="py-2 px-4">
                  <CardTitle className="text-base">Analytics</CardTitle>
                </CardHeader>
                <CardContent className="py-1 px-4 pb-3">
                  <CardDescription className="text-white/80 text-sm">
                    Monitor statistics, user engagement, and metrics.
                  </CardDescription>
                </CardContent>
              </Card>
              
              <Card className="bg-white/10 border-0 backdrop-blur-sm text-white">
                <CardHeader className="py-2 px-4">
                  <CardTitle className="text-base">Security</CardTitle>
                </CardHeader>
                <CardContent className="py-1 px-4 pb-3">
                  <CardDescription className="text-white/80 text-sm">
                    Manage access controls and system security.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <div className="text-white/90 mt-2">
            <p className="font-medium text-sm">
              Expert Recruitments LLC — Connecting exceptional talent with opportunity
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}