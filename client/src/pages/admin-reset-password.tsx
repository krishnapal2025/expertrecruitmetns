import React, { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from "lucide-react";
import ExpertRecruitmentsBanner from "@/components/common/expert-recruitments-banner";

// Password schema
const passwordSchema = z.object({
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9@$!%*?&]/, { message: "Password must contain at least one number or special character" }),
  confirmPassword: z.string()
})
.refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type PasswordFormData = z.infer<typeof passwordSchema>;

export default function AdminResetPassword() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [token, setToken] = useState<string | null>(null);
  const [tokenVerified, setTokenVerified] = useState<boolean | null>(null);
  const [verifying, setVerifying] = useState(true);

  // Get token from URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    
    if (!tokenParam) {
      toast({
        title: "Reset token missing",
        description: "Password reset token is missing. Please use the link from the email.",
        variant: "destructive"
      });
      navigate("/admin/login");
      return;
    }
    
    setToken(tokenParam);

    // Verify token
    const verifyToken = async () => {
      try {
        const response = await fetch(`/api/admin/verify-reset-token/${tokenParam}`);
        const data = await response.json();
        
        if (response.ok && data.valid) {
          setTokenVerified(true);
        } else {
          setTokenVerified(false);
          toast({
            title: "Invalid or expired token",
            description: "Password reset token is invalid or has expired.",
            variant: "destructive"
          });
          setTimeout(() => navigate("/admin/login"), 3000);
        }
      } catch (error) {
        console.error("Error verifying token:", error);
        setTokenVerified(false);
        toast({
          title: "Error verifying token",
          description: "An error occurred while verifying the reset token.",
          variant: "destructive"
        });
        setTimeout(() => navigate("/admin/login"), 3000);
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [navigate, toast]);

  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: async (data: { token: string; password: string }) => {
      const res = await apiRequest("POST", "/api/admin/reset-password", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Password reset successful",
        description: "Your password has been reset. You can now log in with your new password.",
      });
      setTimeout(() => navigate("/admin/login"), 2000);
    },
    onError: (error: Error) => {
      toast({
        title: "Password reset failed",
        description: error.message || "An error occurred while resetting your password.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PasswordFormData) => {
    if (!token) return;
    
    resetPasswordMutation.mutate({
      token,
      password: data.password
    });
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-[350px] shadow-lg">
          <CardHeader className="text-center">
            <CardTitle>Password Reset</CardTitle>
            <CardDescription>Verifying reset token...</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center p-6">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (tokenVerified === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-[350px] shadow-lg">
          <CardHeader className="text-center">
            <CardTitle>Password Reset</CardTitle>
            <CardDescription>Invalid or expired token</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-muted-foreground mb-4">
              The password reset token is invalid or has expired.
            </p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild variant="outline">
              <Link to="/admin/login">Return to Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">
        <div className="w-full md:w-1/2 flex items-center justify-center p-8">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-2xl">Reset Password</CardTitle>
              <CardDescription className="text-center">
                Please enter your new password
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormDescription>
                          Password must be at least 8 characters and include uppercase, lowercase, and a number or special character.
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
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Resetting Password
                      </>
                    ) : (
                      'Reset Password'
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button variant="link" asChild>
                <Link to="/admin/login">Back to Login</Link>
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