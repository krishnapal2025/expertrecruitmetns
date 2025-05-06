import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export function AdminProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [sessionUser, setSessionUser] = useState<any>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  
  // Check if this is a dedicated admin tab
  const isAdminTab = sessionStorage.getItem('adminLoginNewTab') === 'true';
  
  // Load session user if this is a dedicated admin tab
  useEffect(() => {
    if (isAdminTab) {
      try {
        const storedUserData = sessionStorage.getItem('adminSession');
        if (storedUserData) {
          setSessionUser(JSON.parse(storedUserData));
        }
      } catch (e) {
        console.error("Error loading admin session data:", e);
      }
    }
    setSessionLoaded(true);
  }, [isAdminTab]);
  
  // Use either the separate admin session or the global session
  const activeUser = isAdminTab ? sessionUser : user;
  
  // Check if the user is an admin
  useEffect(() => {
    if (activeUser && 
       (activeUser.userType !== "admin" && 
        (!activeUser.user || activeUser.user.userType !== "admin"))) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive",
      });
    }
  }, [activeUser, toast]);

  // Show loading state while loading either global or session user
  if (isLoading || !sessionLoaded) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  // Not logged in - redirect to login
  if (!activeUser) {
    return (
      <Route path={path}>
        <Redirect to="/admin-login" />
      </Route>
    );
  }

  // Check if user is admin in either the global or session-specific auth
  const isAdmin = 
    activeUser.userType === "admin" || 
    (activeUser.user && activeUser.user.userType === "admin");
  
  if (!isAdmin) {
    return (
      <Route path={path}>
        <Redirect to="/" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}