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
    if (user.user_type === "admin") {
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
  
  // Handle form submission
  const onSubmit = (data: FormValues) => {
    loginMutation.mutate(data, {
      onSuccess: (userData) => {
        if (userData.user.user_type !== "admin") {
          toast({
            title: "Access Denied",
            description: "This login is for administrators only.",
            variant: "destructive",
          });
          return;
        }
        toast({
          title: "Login Successful",
          description: "Welcome to your admin dashboard.",
        });
        setLocation("/admin");
      },
      onError: (error: Error) => {
        toast({
          title: "Login Failed",
          description: error.message || "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex min-h-screen items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-5xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-xl">
          {/* Left Side - Form */}
          <div className="w-full md:w-2/5 bg-white p-6 sm:p-10">
            <div className="flex justify-center mb-6">
              <div className="flex items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 p-2 mr-3">
                  <ShieldCheck className="h-7 w-7 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xl uppercase text-gray-800" style={{ letterSpacing: '0.15em' }}>Admin</span>
                  <span className="text-xs text-gray-500">Secure Portal</span>
                </div>
              </div>
            </div>
            
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
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
                      <FormLabel className="text-gray-700">Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="your@email.com" 
                          className="border-gray-300 focus:border-primary focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                      <div className="relative">
                        <FormControl>
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Enter your password" 
                            className="border-gray-300 focus:border-primary focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 pr-10"
                            {...field} 
                          />
                        </FormControl>
                        <button 
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between items-center text-sm">
                  <div></div>
                  <Link href="/admin-forgot-password" className="text-primary hover:text-primary/80 font-medium">
                    Forgot password?
                  </Link>
                </div>

                <Button 
                  type="submit" 
                  className="w-full font-medium bg-[#5372f1] hover:bg-[#4060e0] text-white py-6 transition-colors"
                  disabled={loginMutation.isPending}
                >
                  {loginMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Lock className="mr-2 h-4 w-4" />
                  )}
                  Sign in
                </Button>
              </form>
            </Form>

            <div className="mt-8">
              <Separator className="mb-4" />
              <div className="text-center">
                <p className="text-gray-600 text-sm">
                  Need an invitation code?{" "}
                  <Link href="/contact-us" className="text-primary hover:text-primary/80 font-medium">
                    Contact Us
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Hero Content */}
          <div className="hidden md:block md:w-3/5 bg-[#5372f1] text-white p-10 flex flex-col justify-between">
            <div className="mb-auto">
              <div className="flex items-center mb-8">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-white p-2 border-2 border-white shadow-md mr-3">
                  <img 
                    src={expertLogo} 
                    alt="Expert Recruitments LLC" 
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-xl uppercase" style={{ letterSpacing: '0.15em' }}>Expert</span>
                  <span className="text-white text-xs">Recruitments LLC</span>
                </div>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Admin Dashboard
              </h2>
              
              <p className="text-white/90 text-lg mb-8">
                Manage your recruitment platform, monitor applications, and oversee
                all aspects of the Expert Recruitments ecosystem.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white/10 border-0 backdrop-blur-sm text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">User Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-white/80">
                      Manage job seekers, employers, and administrative accounts.
                    </CardDescription>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/10 border-0 backdrop-blur-sm text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Content Control</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-white/80">
                      Update job listings, blog posts, and site content.
                    </CardDescription>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/10 border-0 backdrop-blur-sm text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-white/80">
                      Monitor platform statistics, user engagement, and performance metrics.
                    </CardDescription>
                  </CardContent>
                </Card>
                
                <Card className="bg-white/10 border-0 backdrop-blur-sm text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Security</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-white/80">
                      Manage access controls, invitations, and system security.
                    </CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            <div className="mt-8 text-white/90">
              <p className="font-medium">
                Expert Recruitments LLC — Connecting exceptional talent with opportunity
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}