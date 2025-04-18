import { useState } from "react";
import { useLocation, Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";

// Schema for resetting password
const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [location, navigate] = useLocation();
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  
  // Get token from URL query parameters
  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token");
  
  // Form handling
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  
  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ResetPasswordFormValues) => {
      try {
        // In a real implementation, this would call an actual API endpoint with the token
        // const res = await apiRequest("POST", "/api/reset-password", {
        //   ...data,
        //   token,
        // });
        // return await res.json();
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate successful response
        return { success: true };
      } catch (error) {
        throw new Error("Failed to reset password. Please try again.");
      }
    },
    onSuccess: () => {
      setIsSuccess(true);
      setTimeout(() => {
        navigate("/auth?tab=login");
      }, 3000);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  const onSubmit = (data: ResetPasswordFormValues) => {
    if (!token) {
      toast({
        title: "Invalid Reset Link",
        description: "Your password reset link is invalid or has expired. Please request a new one.",
        variant: "destructive",
      });
      return;
    }
    
    resetPasswordMutation.mutate(data);
  };
  
  // If no token is provided, show error message
  if (!token && !isSuccess) {
    return (
      <div className="min-h-screen py-12 bg-gray-50">
        <div className="container px-4 mx-auto">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Invalid Reset Link</CardTitle>
                <CardDescription>
                  The password reset link is invalid or has expired
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Please request a new password reset link.
                </p>
                <Button asChild className="w-full">
                  <Link href="/auth/forgot-password">
                    Request New Link
                  </Link>
                </Button>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Link href="/auth?tab=login" className="text-sm text-primary hover:underline">
                  Back to login
                </Link>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="max-w-md mx-auto">
          {!isSuccess && (
            <Link href="/auth?tab=login" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Link>
          )}
          
          <Card>
            <CardHeader>
              <CardTitle>{isSuccess ? "Password Reset Successful" : "Reset Your Password"}</CardTitle>
              <CardDescription>
                {isSuccess 
                  ? "Your password has been successfully reset" 
                  : "Create a new password for your account"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSuccess ? (
                <div className="text-center py-4">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">
                    You will be redirected to the login page shortly.
                  </p>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="••••••••" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm New Password</FormLabel>
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
                      disabled={resetPasswordMutation.isPending}
                    >
                      {resetPasswordMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Reset Password
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
            {!isSuccess && (
              <CardFooter className="flex justify-center">
                <p className="text-sm text-gray-500">
                  Remember your password?{" "}
                  <Link href="/auth?tab=login" className="text-primary font-medium hover:underline">
                    Back to login
                  </Link>
                </p>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}