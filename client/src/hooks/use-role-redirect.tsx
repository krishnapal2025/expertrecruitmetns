import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

/**
 * A custom hook that handles role-specific redirections throughout the site
 * @returns Functions to handle various redirection scenarios
 */
export function useRoleRedirect() {
  const { currentUser } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  /**
   * Handle clicks on employer-specific features
   * @param e - Click event
   * @param destinationPath - Where to redirect if the user has appropriate access
   * @returns void
   */
  const handleEmployerFeatureClick = (
    e: React.MouseEvent<HTMLElement>,
    destinationPath: string
  ) => {
    e.preventDefault();

    // Not logged in - redirect to employer registration
    if (!currentUser) {
      navigate("/employer-register");
      return;
    }

    // Already an employer - go to the destination
    if (currentUser?.user?.userType === "employer") {
      navigate(destinationPath);
      return;
    }

    // Job seeker trying to access employer features
    if (currentUser?.user?.userType === "jobseeker") {
      toast({
        title: "Employer Feature",
        description: "This feature is only available to employers. Would you like to register as an employer?",
        variant: "default",
        action: (
          <a
            href="/employer-register"
            className="bg-primary hover:bg-primary/90 text-white py-1 px-3 rounded-md text-xs"
            onClick={(e) => {
              e.preventDefault();
              navigate("/employer-register");
            }}
          >
            Register
          </a>
        ),
      });
      return;
    }

    // Admin can access everything
    if (currentUser?.user?.userType === "admin") {
      navigate(destinationPath);
      return;
    }
  };

  /**
   * Handle clicks on jobseeker-specific features
   * @param e - Click event
   * @param destinationPath - Where to redirect if the user has appropriate access
   * @returns void
   */
  const handleJobSeekerFeatureClick = (
    e: React.MouseEvent<HTMLElement>,
    destinationPath: string
  ) => {
    e.preventDefault();

    // Not logged in - redirect to job seeker registration
    if (!currentUser) {
      navigate("/job-seeker-register");
      return;
    }

    // Already a job seeker - go to the destination
    if (currentUser?.user?.userType === "jobseeker") {
      // Special case: if a job seeker is clicking a job seeker signup button, stay on the same page
      if (destinationPath === '/job-seeker-register') {
        // Just scroll to top instead of navigating
        window.scrollTo(0, 0);
      } else {
        navigate(destinationPath);
      }
      return;
    }

    // Employer trying to access job seeker features
    if (currentUser?.user?.userType === "employer") {
      toast({
        title: "Job Seeker Feature",
        description: "This feature is only available to job seekers. Would you like to register as a job seeker?",
        variant: "default",
        action: (
          <a
            href="/job-seeker-register"
            className="bg-primary hover:bg-primary/90 text-white py-1 px-3 rounded-md text-xs"
            onClick={(e) => {
              e.preventDefault();
              navigate("/job-seeker-register");
            }}
          >
            Register
          </a>
        ),
      });
      return;
    }

    // Admin can access everything
    if (currentUser?.user?.userType === "admin") {
      navigate(destinationPath);
      return;
    }
  };

  /**
   * Creates a URL handler that processes role-specific redirection
   * @param userType - 'employer' or 'jobseeker'
   * @param destinationPath - Where to go if user has correct role
   * @param signupPath - Where to redirect for signup (defaults to type-specific registration)
   * @returns A function that handles the click event with proper redirection
   */
  const createRoleSpecificURLHandler = (
    userType: 'employer' | 'jobseeker',
    destinationPath: string,
    signupPath?: string
  ) => {
    return (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();

      // Default signup paths based on requested feature type
      const defaultSignupPath = userType === 'employer' 
        ? '/employer-register' 
        : '/job-seeker-register';
        
      // Use provided signup path or fall back to default
      const redirectSignupPath = signupPath || defaultSignupPath;

      // Not logged in - redirect to appropriate signup
      if (!currentUser) {
        navigate(redirectSignupPath);
        return;
      }

      // User has matching role - proceed to destination
      if (currentUser?.user?.userType === userType) {
        // Special case: if a job seeker is clicking a job seeker signup button, stay on the same page
        if (userType === 'jobseeker' && destinationPath === '/job-seeker-register') {
          // Just scroll to top instead of navigating
          window.scrollTo(0, 0);
        } else {
          navigate(destinationPath);
        }
        return;
      }

      // Different user type - show appropriate message
      const featureTypeLabel = userType === 'employer' ? 'Employer Feature' : 'Job Seeker Feature';
      const roleDescription = userType === 'employer' ? 'employers' : 'job seekers';
      
      toast({
        title: featureTypeLabel,
        description: `This feature is only available to ${roleDescription}. Would you like to register as ${userType === 'employer' ? 'an employer' : 'a job seeker'}?`,
        variant: "default",
        action: (
          <a
            href={redirectSignupPath}
            className="bg-primary hover:bg-primary/90 text-white py-1 px-3 rounded-md text-xs"
            onClick={(e) => {
              e.preventDefault();
              navigate(redirectSignupPath);
            }}
          >
            Register
          </a>
        ),
      });
    };
  };

  return {
    handleEmployerFeatureClick,
    handleJobSeekerFeatureClick,
    createRoleSpecificURLHandler
  };
}