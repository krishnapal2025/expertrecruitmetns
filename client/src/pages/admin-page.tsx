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
  const [sessionUser, setSessionUser] = useState<any>(null);
  
  // Check if this is a dedicated admin tab with its own session
  const isAdminTab = sessionStorage.getItem('adminLoginNewTab') === 'true';
  
  useEffect(() => {
    // For admin tabs with separate sessions, get the session user from storage
    if (isAdminTab) {
      try {
        const storedUserData = sessionStorage.getItem('adminSession');
        if (storedUserData) {
          const parsedUser = JSON.parse(storedUserData);
          setSessionUser(parsedUser);
        }
      } catch (e) {
        console.error("Error parsing admin session data", e);
      }
    }
    
    // Use either the session-specific user or the global user
    const activeUser = isAdminTab ? sessionUser : user;
    
    if (!activeUser) {
      setIsLoading(false);
      return;
    }

    // Check if user is admin or super_admin and handle accordingly
    if (activeUser?.user?.userType === "admin" || activeUser?.userType === "admin" || 
        activeUser?.user?.userType === "super_admin" || activeUser?.userType === "super_admin") {
      // Super admins have enhanced access to the admin dashboard
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
  }, [user, toast, sessionUser, isAdminTab]);

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

  // Get the active user - either from the special session or global auth
  const activeUser = isAdminTab ? sessionUser : user;

  // Handle not logged in
  if (!activeUser) {
    return <Redirect to="/admin-login" />;
  }

  return null;
}

export default AdminPage;