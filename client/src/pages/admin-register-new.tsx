import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { adminRegisterSchema } from "@shared/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LockIcon, UserIcon } from "lucide-react";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = adminRegisterSchema;
type FormValues = z.infer<typeof formSchema>;

function AdminRegisterPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [invitationVerified, setInvitationVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [invitationCode, setInvitationCode] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Check invitation code
  const verifyInvitationMutation = useMutation({
    mutationFn: async (data: { code: string; email: string }) => {
      const res = await apiRequest("POST", "/api/admin/verify-invitation", data);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Invalid invitation code");
      }
      return await res.json();
    },
    onSuccess: () => {
      setInvitationVerified(true);
      toast({
        title: "Invitation code verified",
        description: "You can now complete your registration.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Invalid invitation code",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Register admin
  const registerMutation = useMutation({
    mutationFn: async (data: FormValues) => {
      const res = await apiRequest("POST", "/api/admin/register", data);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Registration failed");
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Registration successful",
        description: "Your admin account has been created.",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      navigate("/admin");
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      role: "admin",
      phoneNumber: "",
      invitationCode: "",
      confirmPassword: "",
    },
  });

  // Handle invitation verification
  const handleVerifyInvitation = () => {
    if (!email || !invitationCode) {
      toast({
        title: "Missing information",
        description: "Please enter both email and invitation code.",
        variant: "destructive",
      });
      return;
    }

    verifyInvitationMutation.mutate({ code: invitationCode, email });
  };

  // Handle form submission
  const onSubmit = (data: FormValues) => {
    registerMutation.mutate({
      ...data,
      email,
      invitationCode,
    });
  };

  // When verification is successful, update the form with verified email and code
  useEffect(() => {
    if (invitationVerified) {
      form.setValue("email", email);
      form.setValue("invitationCode", invitationCode);
    }
  }, [invitationVerified, email, invitationCode, form]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Registration</CardTitle>
          <CardDescription className="text-center">
            Create your admin account with your invitation code
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!invitationVerified ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">Email</label>
                <Input
                  id="email"
                  placeholder="your.email@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="invitationCode" className="text-sm font-medium">Invitation Code</label>
                <Input
                  id="invitationCode"
                  placeholder="Enter your invitation code"
                  value={invitationCode}
                  onChange={(e) => setInvitationCode(e.target.value)}
                  required
                />
                <p className="text-sm text-muted-foreground">
                  You should have received an invitation code from an existing administrator
                </p>
              </div>
              <Button
                className="w-full"
                onClick={handleVerifyInvitation}
                disabled={verifyInvitationMutation.isPending}
              >
                {verifyInvitationMutation.isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LockIcon className="mr-2 h-4 w-4" />
                )}
                Verify Invitation
              </Button>
            </div>
          ) : (
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
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormDescription>
                        Password must be at least 8 characters long
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

                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>
                      <FormControl>
                        <select
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Alert>
                  <AlertDescription>
                    You are registering with email: <strong>{email}</strong>
                  </AlertDescription>
                </Alert>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={registerMutation.isPending}
                >
                  {registerMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <UserIcon className="mr-2 h-4 w-4" />
                  )}
                  Create Admin Account
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <a href="/auth" className="text-primary hover:underline">
              Login here
            </a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default AdminRegisterPage;