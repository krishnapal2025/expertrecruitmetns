import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Job } from "@shared/schema";
import { Building, MapPin, Calendar, Briefcase } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface JobCardProps {
  job: Job;
}

export default function JobCard({ job }: JobCardProps) {
  const { currentUser } = useAuth();
  const isJobSeeker = currentUser && currentUser.user.userType === "jobseeker";
  
  // Format date for display
  const formatDate = (dateString: Date | null) => {
    if (!dateString) return "Recent";
    const date = new Date(dateString);
    const now = new Date();
    
    // Calculate difference in days
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else if (diffDays < 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(date);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex-grow">
            <div className="flex items-center text-sm text-gray-500 mb-2">
              <Building className="h-4 w-4 mr-1" />
              <span className="mr-4">Company Name</span>
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(job.postedDate ? job.postedDate : null)}</span>
            </div>
            
            <Link href={`/job/${job.id}`}>
              <div className="block cursor-pointer">
                <h3 className="text-xl font-bold mb-2 hover:text-primary transition-colors">
                  {job.title}
                </h3>
              </div>
            </Link>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="outline" className="text-primary bg-primary/5">
                {job.category}
              </Badge>
              <Badge variant="outline" className="text-primary bg-primary/5">
                {job.jobType}
              </Badge>
              {job.salary && (
                <Badge variant="outline" className="text-primary bg-primary/5">
                  {job.salary}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="h-4 w-4 mr-1" />
              <span>{job.location}</span>
            </div>
            
            <p className="text-gray-600 line-clamp-2 mb-4">
              {job.description}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 md:ml-6 md:flex md:flex-col md:items-end">
            {isJobSeeker ? (
              <Link href={`/job/${job.id}`}>
                <Button>
                  View Job
                </Button>
              </Link>
            ) : (
              <Link href="/job-seeker-register">
                <Button>
                  View Job
                </Button>
              </Link>
            )}
            
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <Briefcase className="h-4 w-4 mr-1" />
              <span>{job.jobType}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
