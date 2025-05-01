import React, { useEffect, useState } from "react";
import { useLocation, Redirect } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

function AdminPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    // Check if user is admin and handle accordingly
    if (user.userType === "admin") {
      setRedirectPath("/admin-dashboard");
    } else {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive",
      });
      setRedirectPath("/");
    }
    
    setIsLoading(false);
  }, [user, toast]);

  // Handle the loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Handle redirection
  if (redirectPath) {
    return <Redirect to={redirectPath} />;
  }

  // Handle not logged in
  if (!user) {
    return <Redirect to="/admin-login" />;
  }

  return null;
}

export default AdminPage;