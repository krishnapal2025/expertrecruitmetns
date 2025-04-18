import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Briefcase, Building, Globe, Phone, MapPin, AtSign, User as UserIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Countries and industries arrays are reused from auth-page
const countries = [
  "United States", "United Kingdom", "Canada", "Australia", 
  "Germany", "France", "Japan", "China", "India", "Brazil"
];

const industries = [
  "Technology", "Healthcare", "Finance", "Education",
  "Manufacturing", "Retail", "Construction", "Transportation",
  "Hospitality", "Media", "Professional Services"
];

// Job seeker profile form schema
const jobSeekerProfileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phoneNumber: z.string().optional(),
  country: z.string().min(1, "Please select a country"),
  headline: z.string().optional(),
  bio: z.string().optional(),
  skills: z.string().optional(),
  experience: z.string().optional(),
  education: z.string().optional(),
});

// Employer profile form schema
const employerProfileSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  industry: z.string().min(1, "Please select an industry"),
  companyType: z.string().optional(),
  phoneNumber: z.string().optional(),
  country: z.string().min(1, "Please select a country"),
  website: z.string().optional(),
  description: z.string().optional(),
  employeeCount: z.string().optional(),
  foundedYear: z.string().optional(),
});

type JobSeekerProfileFormValues = z.infer<typeof jobSeekerProfileSchema>;
type EmployerProfileFormValues = z.infer<typeof employerProfileSchema>;

export default function ProfilePage() {
  const { currentUser, isLoading } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Initialize forms with current user data
  const jobSeekerForm = useForm<JobSeekerProfileFormValues>({
    resolver: zodResolver(jobSeekerProfileSchema),
    defaultValues: currentUser && currentUser.user.userType === 'jobseeker' && 'firstName' in currentUser.profile
      ? {
          firstName: currentUser.profile.firstName || '',
          lastName: currentUser.profile.lastName || '',
          phoneNumber: currentUser.profile.phoneNumber || '',
          country: currentUser.profile.country || '',
          headline: '',
          bio: '',
          skills: '',
          experience: '',
          education: ''
        }
      : {
          firstName: '',
          lastName: '',
          phoneNumber: '',
          country: '',
          headline: '',
          bio: '',
          skills: '',
          experience: '',
          education: ''
        }
  });
  
  const employerForm = useForm<EmployerProfileFormValues>({
    resolver: zodResolver(employerProfileSchema),
    defaultValues: currentUser && currentUser.user.userType === 'employer' && 'companyName' in currentUser.profile
      ? {
          companyName: currentUser.profile.companyName || '',
          industry: currentUser.profile.industry || '',
          companyType: currentUser.profile.companyType || '',
          phoneNumber: currentUser.profile.phoneNumber || '',
          country: currentUser.profile.country || '',
          website: currentUser.profile.website || '',
          description: '',
          employeeCount: '',
          foundedYear: ''
        }
      : {
          companyName: '',
          industry: '',
          companyType: '',
          phoneNumber: '',
          country: '',
          website: '',
          description: '',
          employeeCount: '',
          foundedYear: ''
        }
  });

  const getUserInitials = () => {
    if (!currentUser) return '';
    
    if (currentUser.user.userType === 'jobseeker' && 'firstName' in currentUser.profile) {
      return `${currentUser.profile.firstName.charAt(0)}${currentUser.profile.lastName.charAt(0)}`;
    } else if (currentUser.user.userType === 'employer' && 'companyName' in currentUser.profile) {
      return currentUser.profile.companyName.charAt(0);
    }
    
    return currentUser.user.email.charAt(0).toUpperCase();
  };

  const onJobSeekerSubmit = async (data: JobSeekerProfileFormValues) => {
    if (!currentUser) return;
    
    setIsSubmitting(true);
    try {
      const res = await apiRequest('PATCH', `/api/profile/jobseeker/${currentUser.profile.id}`, data);
      const updatedProfile = await res.json();
      
      // Update the cache with new user data
      queryClient.setQueryData(['/api/user'], {
        ...currentUser,
        profile: updatedProfile
      });
      
      toast({
        title: 'Profile updated successfully',
        description: 'Your profile has been updated.',
      });
    } catch (error) {
      toast({
        title: 'Error updating profile',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onEmployerSubmit = async (data: EmployerProfileFormValues) => {
    if (!currentUser) return;
    
    setIsSubmitting(true);
    try {
      const res = await apiRequest('PATCH', `/api/profile/employer/${currentUser.profile.id}`, data);
      const updatedProfile = await res.json();
      
      // Update the cache with new user data
      queryClient.setQueryData(['/api/user'], {
        ...currentUser,
        profile: updatedProfile
      });
      
      toast({
        title: 'Profile updated successfully',
        description: 'Your company profile has been updated.',
      });
    } catch (error) {
      toast({
        title: 'Error updating profile',
        description: error instanceof Error ? error.message : 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="container py-12 max-w-5xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle>Profile not available</CardTitle>
            <CardDescription>
              Please log in to access your profile.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" onClick={() => window.location.href = '/auth'}>
              Go to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12 max-w-5xl mx-auto px-4">
      <div className="mb-8 flex flex-col md:flex-row md:items-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarFallback className="bg-primary text-white text-xl">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">
            {currentUser.user.userType === 'jobseeker' && 'firstName' in currentUser.profile
              ? `${currentUser.profile.firstName} ${currentUser.profile.lastName}`
              : currentUser.user.userType === 'employer' && 'companyName' in currentUser.profile
              ? currentUser.profile.companyName
              : 'My Profile'}
          </h1>
          <p className="text-gray-500">
            {currentUser.user.email} • {currentUser.user.userType === 'jobseeker' ? 'Job Seeker' : 'Employer'}
          </p>
        </div>
      </div>

      {currentUser.user.userType === 'jobseeker' ? (
        <Card>
          <CardHeader>
            <CardTitle>Job Seeker Profile</CardTitle>
            <CardDescription>
              Update your profile to improve your job matches and visibility to employers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...jobSeekerForm}>
              <form onSubmit={jobSeekerForm.handleSubmit(onJobSeekerSubmit)} className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={jobSeekerForm.control}
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
                    control={jobSeekerForm.control}
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

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={jobSeekerForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 000-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={jobSeekerForm.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {countries.map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={jobSeekerForm.control}
                  name="headline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Headline</FormLabel>
                      <FormControl>
                        <Input placeholder="Senior Software Engineer with 10+ years experience" {...field} />
                      </FormControl>
                      <FormDescription>
                        A short summary of your professional title and experience
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={jobSeekerForm.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="I am a software engineer with experience in..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={jobSeekerForm.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skills</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="JavaScript, React, Node.js, TypeScript..."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        List your key skills, separated by commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={jobSeekerForm.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Company Name: Position (Year - Year)"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          List your work experience
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={jobSeekerForm.control}
                    name="education"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Education</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="University Name: Degree (Year - Year)"
                            className="min-h-[120px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          List your educational background
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Save Profile
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Employer Profile</CardTitle>
            <CardDescription>
              Update your company profile to attract the best talent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...employerForm}>
              <form onSubmit={employerForm.handleSubmit(onEmployerSubmit)} className="space-y-6">
                <FormField
                  control={employerForm.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Acme Corporation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={employerForm.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {industries.map((industry) => (
                              <SelectItem key={industry} value={industry}>
                                {industry}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={employerForm.control}
                    name="companyType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Type</FormLabel>
                        <FormControl>
                          <Input placeholder="Corporation, LLC, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={employerForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="+1 (555) 000-0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={employerForm.control}
                    name="website"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Website</FormLabel>
                        <FormControl>
                          <Input placeholder="https://www.example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={employerForm.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem key={country} value={country}>
                              {country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={employerForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="We are a leading company in..."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={employerForm.control}
                    name="employeeCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Employees</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 50-100" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={employerForm.control}
                    name="foundedYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Founded Year</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 2010" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Save Company Profile
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}