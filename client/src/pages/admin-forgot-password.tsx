import React, { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";
import ExpertRecruitmentsBanner from "@/components/common/expert-recruitments-banner";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function AdminForgotPassword() {
  const { toast } = useToast();
  const [resetSuccess, setResetSuccess] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: async (data: ForgotPasswordFormData) => {
      const res = await apiRequest("POST", "/api/admin/forgot-password", data);
      return await res.json();
    },
    onSuccess: (data) => {
      setResetSuccess(true);
      
      // For development, show the preview URL if available
      console.log("Password reset response:", data);
      if (data.previewUrl) {
        setPreviewUrl(data.previewUrl);
        console.log("Setting preview URL:", data.previewUrl);
      }
      
      toast({
        title: "Reset email sent",
        description: "If an account with that email exists, a password reset link has been sent.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Reset request failed",
        description: error.message || "An error occurred while processing your request.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPasswordMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Forgot Password</CardTitle>
              <CardDescription className="text-center">
                Enter your email address to receive password reset instructions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {resetSuccess ? (
                <div className="space-y-4 text-center">
                  <div className="flex justify-center">
                    <CheckCircle className="h-12 w-12 text-green-500" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Reset request processed. In production, an email would be sent.
                  </p>
                  
                  <div className="bg-muted p-4 rounded-md text-left">
                    <p className="text-sm font-medium mb-2">Development Mode Information</p>
                    
                    {previewUrl ? (
                      <>
                        <p className="text-xs text-muted-foreground mb-2">
                          In development mode, we're bypassing the email service. 
                          Click the button below to go directly to the password reset page:
                        </p>
                        <a
                          href={previewUrl}
                          rel="noopener noreferrer"
                          className="block mt-3 px-4 py-2 bg-primary text-white rounded text-center hover:bg-primary/90 transition-colors"
                        >
                          Reset Password Now
                        </a>
                        <p className="text-xs text-muted-foreground mt-2">
                          This link contains a valid reset token for development testing.
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs mb-2 text-amber-600 flex items-center">
                          <AlertTriangle className="inline-block mr-1 h-4 w-4" />
                          <span>No preview URL was returned. Check the console for debugging information.</span>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          This could happen if there was an issue with the Ethereal test email service.
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter admin email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={forgotPasswordMutation.isPending}
                    >
                      {forgotPasswordMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending Request
                        </>
                      ) : (
                        'Send Reset Link'
                      )}
                    </Button>
                  </form>
                </Form>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="link" asChild>
                <Link to="/admin-login">Back to Login</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="hidden md:flex md:w-1/2 bg-muted">
          <ExpertRecruitmentsBanner />
        </div>
      </div>
    </div>
  );
}