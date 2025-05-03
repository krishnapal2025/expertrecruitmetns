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
    if (user.userType === "admin") {
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-gray-700 text-base">Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="your@email.com" 
                        className="border-gray-300 focus:border-primary focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-11"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-gray-700 text-base">Password</FormLabel>
                    <div className="relative">
                      <FormControl>
                        <Input 
                          type={showPassword ? "text" : "password"} 
                          placeholder="Enter your password" 
                          className="border-gray-300 focus:border-primary focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 pr-10 h-11"
                          {...field} 
                        />
                      </FormControl>
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <FormMessage className="text-sm" />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Link href="/admin/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full font-medium bg-[#5372f1] hover:bg-[#4060e0] text-white transition-colors h-12 text-base"
                disabled={loginMutation.isPending}
              >
                {loginMutation.isPending ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Lock className="mr-2 h-5 w-5" />
                )}
                Sign in
              </Button>
            </form>
          </Form>
        </div>

        {/* Right Side - Hero Content */}
        <div className="hidden md:block md:w-3/5 bg-[#5372f1] text-white p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center mb-4">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white p-2 border border-white shadow-sm mr-3">
                <img 
                  src={expertLogo} 
                  alt="Expert Recruitments LLC" 
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg uppercase" style={{ letterSpacing: '0.1em' }}>Expert</span>
                <span className="text-white text-xs">Recruitments LLC</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold mb-3">
              Admin Dashboard
            </h2>
            
            <p className="text-white/90 text-base mb-4">
              Manage recruitment platform, monitor applications, and oversee
              the Expert Recruitments ecosystem.
            </p>
            
            <div className="grid grid-cols-2 gap-3 mb-3">
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