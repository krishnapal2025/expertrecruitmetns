import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { User as SchemaUser } from "@shared/schema";

// User type definitions for better type safety
interface RegularUser {
  id: number;
  email: string;
  password: string;
  userType: string;
  createdAt: Date | null;
}

interface AdminUserData {
  id: number;
  email: string;
  username?: string;
  userType: string;
}

interface AdminProfileData {
  id: number;
  firstName?: string;
  lastName?: string;
  role: string;
  lastLogin?: Date;
}

interface AdminUser {
  user: AdminUserData;
  profile: AdminProfileData;
}

export function AdminProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  const [location] = useLocation();
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [sessionUser, setSessionUser] = useState<AdminUser | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const [adminSession, setAdminSession] = useState<boolean>(false);
  
  // Detect if we're using a dedicated admin session (either from URL or sessionStorage)
  useEffect(() => {
    // Check URL params first (higher priority)
    const urlParams = new URLSearchParams(window.location.search);
    const sessionType = urlParams.get('sessionType');
    
    if (sessionType === 'admin') {
      sessionStorage.setItem('adminLoginNewTab', 'true');
      setAdminSession(true);
      
      // Clean up the URL without affecting history
      const url = new URL(window.location.href);
      url.searchParams.delete('sessionType');
      window.history.replaceState({}, document.title, url.toString());
    } 
    // Then fall back to session storage
    else if (sessionStorage.getItem('adminLoginNewTab') === 'true') {
      setAdminSession(true);
    }
  }, [location]);
  
  // Fetch admin user data from dedicated endpoint for admin sessions
  const { data: adminUserData, isLoading: adminDataLoading } = useQuery({
    queryKey: ['/api/admin/user', adminSession],
    queryFn: async () => {
      // Only make this request if we're in an admin session
      if (!adminSession) return null;
      
      try {
        const response = await fetch('/api/admin/user', {
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            // Not authenticated, clear session storage
            sessionStorage.removeItem('adminSession');
            return null;
          }
          throw new Error('Failed to fetch admin data');
        }
        
        const data = await response.json();
        // Update session storage with fresh data
        sessionStorage.setItem('adminSession', JSON.stringify(data));
        return data;
      } catch (error) {
        console.error('Error fetching admin user data:', error);
        return null;
      }
    },
    enabled: adminSession,
    refetchOnWindowFocus: true,
    staleTime: 30000, // Refetch admin data every 30 seconds at most
  });
  
  // Update session user state whenever we get fresh admin data
  useEffect(() => {
    if (adminSession) {
      if (adminUserData) {
        setSessionUser(adminUserData);
      } else if (!adminDataLoading) {
        // Try to load from session storage as fallback
        try {
          const storedUserData = sessionStorage.getItem('adminSession');
          if (storedUserData) {
            setSessionUser(JSON.parse(storedUserData));
          }
        } catch (e) {
          console.error("Error loading admin session data:", e);
        }
      }
    }
    setSessionLoaded(true);
  }, [adminSession, adminUserData, adminDataLoading]);
  
  // Determine the active user - use session user for admin tabs, global user otherwise
  const activeUser = adminSession ? sessionUser : user;
  
  // Create a type for all possible user structures
  type AnyUser = RegularUser | AdminUser | null | undefined;
  
  // Function to determine if a user is an admin
  const isAdminUser = (user: AnyUser): boolean => {
    if (!user) return false;
    
    // Handle AdminUser structure (from session storage or admin-specific endpoint)
    if ('user' in user && user.user) {
      return user.user.userType === "admin";
    }
    
    // Handle RegularUser structure (from global auth)
    if ('userType' in user) {
      return user.userType === "admin";
    }
    
    return false;
  };

  // Show error toast if user is not admin
  useEffect(() => {
    if (activeUser && !isAdminUser(activeUser)) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive",
      });
    }
  }, [activeUser, toast]);

  // Show loading state while loading either global or session user
  if ((isLoading && !adminSession) || (adminDataLoading && adminSession) || !sessionLoaded) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  // Not logged in - redirect to login with sessionType=admin parameter
  if (!activeUser) {
    return (
      <Route path={path}>
        <Redirect to={`/admin-login?sessionType=admin`} />
      </Route>
    );
  }

  // Check if user is admin in either the global or session-specific auth
  const isAdmin = isAdminUser(activeUser);
  
  if (!isAdmin) {
    return (
      <Route path={path}>
        <Redirect to="/" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}