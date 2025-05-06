import { useAuth } from "@/hooks/use-auth";
import { Redirect, Route } from "wouter";
import { toast } from "@/hooks/use-toast";

interface RoleSpecificRedirectProps {
  path: string;
  component: () => React.JSX.Element;
  requiredUserType: 'jobseeker' | 'employer';
  redirectPath: string;
  message?: string;
}

/**
 * A component that redirects users to appropriate pages based on their user type
 * - If user is not logged in, they'll be redirected to the auth page
 * - If user is logged in with the required user type, they'll see the component
 * - If user is logged in with a different user type, they'll be redirected to the specified path
 */
export function RoleSpecificRedirect({
  path,
  component: Component,
  requiredUserType,
  redirectPath,
  message
}: RoleSpecificRedirectProps) {
  const { currentUser, isLoading } = useAuth();
  
  // If still loading, show a loading state
  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
        </div>
      </Route>
    );
  }
  
  // If not logged in, redirect to auth page
  if (!currentUser || !currentUser.user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }
  
  // If user is logged in but doesn't have the required user type
  if (currentUser.user.userType !== requiredUserType) {
    // Show a toast message if provided
    if (message) {
      toast({
        title: "Access Restricted",
        description: message,
        variant: "default",
      });
    }
    
    return (
      <Route path={path}>
        <Redirect to={redirectPath} />
      </Route>
    );
  }
  
  // User has the correct role type, show the component
  return <Route path={path} component={Component} />;
}

/**
 * A component specifically for redirecting employers to appropriate pages
 */
export function EmployerOnlyRoute({
  path,
  component
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  return (
    <RoleSpecificRedirect
      path={path}
      component={component}
      requiredUserType="employer"
      redirectPath="/"
      message="This feature is only available to employers. If you're a job seeker looking for similar features, please check our job seeker resources."
    />
  );
}

/**
 * A component specifically for redirecting job seekers to appropriate pages
 */
export function JobSeekerOnlyRoute({
  path,
  component
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  return (
    <RoleSpecificRedirect
      path={path}
      component={component}
      requiredUserType="jobseeker"
      redirectPath="/"
      message="This feature is only available to job seekers. If you're an employer looking for recruiting tools, please check our employer resources."
    />
  );
}