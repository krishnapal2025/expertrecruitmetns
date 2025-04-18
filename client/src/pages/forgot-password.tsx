import { useState } from "react";
import { Link } from "wouter";
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

// Schema for forgot password
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  
  // Form handling
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  
  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordFormValues) => {
      try {
        // In a real implementation, this would call an actual API endpoint
        // For now, we'll just simulate a successful response
        // const res = await apiRequest("POST", "/api/forgot-password", data);
        // return await res.json();
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simulate successful response
        return { success: true };
      } catch (error) {
        throw new Error("Failed to send reset password email. Please try again.");
      }
    },
    onSuccess: () => {
      setIsSubmitted(true);
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
  const onSubmit = (data: ForgotPasswordFormValues) => {
    resetPasswordMutation.mutate(data);
  };
  
  return (
    <div className="min-h-screen py-12 bg-gray-50">
      <div className="container px-4 mx-auto">
        <div className="max-w-md mx-auto">
          <Link href="/auth?tab=login" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Link>
          
          <Card>
            <CardHeader>
              <CardTitle>Forgot Password</CardTitle>
              <CardDescription>
                Enter your email to receive a password reset link
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isSubmitted ? (
                <div className="text-center py-4">
                  <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Check your email</h3>
                  <p className="text-gray-500 mb-4">
                    We've sent a password reset link to {form.getValues().email}
                  </p>
                  <p className="text-sm text-gray-400">
                    Didn't receive an email? Check your spam folder or
                    <button 
                      className="text-primary hover:underline ml-1"
                      onClick={() => setIsSubmitted(false)}
                    >
                      try again
                    </button>
                  </p>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
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
                    
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={resetPasswordMutation.isPending}
                    >
                      {resetPasswordMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : null}
                      Send Reset Link
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-500">
                Remember your password?{" "}
                <Link href="/auth?tab=login" className="text-primary font-medium hover:underline">
                  Back to login
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}