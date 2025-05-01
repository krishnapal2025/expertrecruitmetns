import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

function AdminPage() {
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    if (!user) {
      setIsLoading(false);
      return;
    }

    if (user.userType !== "admin") {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    // Redirect to the new admin dashboard
    navigate("/admin-dashboard");
    
  }, [user, navigate, toast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    navigate("/auth");
    return null;
  }

  return null;
}

export default AdminPage;