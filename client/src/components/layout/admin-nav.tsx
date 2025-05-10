import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ShieldCheck, LogOut, AlertCircle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function AdminNav() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isIsolatedSession, setIsIsolatedSession] = useState(false);
  
  useEffect(() => {
    // Check if this is an isolated admin session
    const isAdminTab = sessionStorage.getItem('adminLoginNewTab') === 'true';
    setIsIsolatedSession(isAdminTab);
    
    // If it's an isolated session, get the user from sessionStorage
    if (isAdminTab) {
      try {
        const storedUserData = sessionStorage.getItem('adminSession');
        if (storedUserData) {
          setAdminUser(JSON.parse(storedUserData));
        }
      } catch (e) {
        console.error("Error parsing admin session data:", e);
      }
    } else {
      // Otherwise, we'll use the regular user from React Query
      const queryUser = queryClient.getQueryData(["/api/user"]);
      if (queryUser) {
        setAdminUser(queryUser);
      }
    }
  }, []);
  
  const handleLogout = async () => {
    try {
      // Make the logout API call
      await apiRequest("POST", "/api/logout");
      
      // Handle isolated admin session
      if (isIsolatedSession) {
        // Clear session storage for this tab
        sessionStorage.removeItem('adminSession');
        sessionStorage.removeItem('adminLoginNewTab');
      } else {
        // Clear global React Query cache for regular session
        queryClient.setQueryData(["/api/user"], null);
      }
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of the admin portal.",
      });
      
      // Redirect to login page
      navigate("/admin-login");
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 p-1.5 mr-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <Link href="/admin-dashboard">
            <a className="font-bold text-gray-800 text-lg">Admin Portal</a>
          </Link>
          
          {isIsolatedSession && (
            <div className="ml-3 flex items-center text-xs text-gray-500 bg-amber-100 px-2 py-1 rounded">
              <AlertCircle className="h-3 w-3 mr-1 text-amber-600" />
              Separate Admin Session
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {adminUser && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">{adminUser.email || 'Admin User'}</span>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
}