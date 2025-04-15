import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { User, JobSeeker, Employer, JobSeekerRegister, EmployerRegister, LoginCredentials } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type UserWithProfile = {
  user: User;
  profile: JobSeeker | Employer;
}

type AuthContextType = {
  currentUser: UserWithProfile | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<UserWithProfile, Error, LoginCredentials>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerJobSeekerMutation: UseMutationResult<UserWithProfile, Error, JobSeekerRegister>;
  registerEmployerMutation: UseMutationResult<UserWithProfile, Error, EmployerRegister>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const {
    data: currentUser,
    error,
    isLoading,
  } = useQuery<UserWithProfile | null, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const res = await apiRequest("POST", "/api/login", credentials);
      return await res.json();
    },
    onSuccess: (data: UserWithProfile) => {
      queryClient.setQueryData(["/api/user"], data);
      toast({
        title: "Login successful",
        description: `Welcome back${data.profile && ", " + (
          'firstName' in data.profile ? data.profile.firstName : data.profile.companyName
        )}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerJobSeekerMutation = useMutation({
    mutationFn: async (data: JobSeekerRegister) => {
      const res = await apiRequest("POST", "/api/register/jobseeker", data);
      return await res.json();
    },
    onSuccess: (data: UserWithProfile) => {
      queryClient.setQueryData(["/api/user"], data);
      toast({
        title: "Registration successful",
        description: `Welcome, ${data.profile && 'firstName' in data.profile ? data.profile.firstName : ''}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerEmployerMutation = useMutation({
    mutationFn: async (data: EmployerRegister) => {
      const res = await apiRequest("POST", "/api/register/employer", data);
      return await res.json();
    },
    onSuccess: (data: UserWithProfile) => {
      queryClient.setQueryData(["/api/user"], data);
      toast({
        title: "Registration successful",
        description: `Welcome, ${data.profile && 'companyName' in data.profile ? data.profile.companyName : ''}!`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logged out successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        currentUser: currentUser ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerJobSeekerMutation,
        registerEmployerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
