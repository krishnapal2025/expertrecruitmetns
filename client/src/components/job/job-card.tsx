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
    <Card className="hover:shadow-lg transition-shadow border border-gray-200">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between">
          <div className="flex-grow">
            <div className="flex items-center text-sm text-gray-600 mb-2">
              {currentUser && (
                <>
                  <Building className="h-4 w-4 mr-1 text-primary" />
                  <span className="mr-4 font-medium">{job.company || "Expert Recruitments"}</span>
                </>
              )}
              <Calendar className="h-4 w-4 mr-1 text-primary" />
              <span>{formatDate(job.postedDate ? job.postedDate : null)}</span>
            </div>
            
            <h3 className="text-xl font-bold mb-3 text-gray-800">
              {job.title}
            </h3>
            
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5 px-3 py-1 rounded-full">
                {job.category}
              </Badge>
              <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5 px-3 py-1 rounded-full">
                {job.jobType}
              </Badge>
              {job.salary && (
                <Badge variant="outline" className="text-primary border-primary/30 bg-primary/5 px-3 py-1 rounded-full">
                  {job.salary}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center text-gray-600 mb-4">
              <MapPin className="h-4 w-4 mr-1 text-primary" />
              <span className="font-medium">{job.location}</span>
            </div>
            
            <p className="text-gray-600 line-clamp-2 mb-4">
              {job.description}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 md:ml-6 md:flex md:flex-col md:items-end">
            {isJobSeeker ? (
              <Button 
                onClick={() => {
                  // Set flag in sessionStorage to indicate we're coming from job-board
                  sessionStorage.setItem("fromJobBoard", "true");
                  window.location.href = `/job/${job.id}`;
                }}
                className="bg-[#4060e0] hover:bg-[#3050d0] px-5 py-2 font-medium"
              >
                View Job
              </Button>
            ) : (
              <Link href="/job-seeker-register">
                <Button className="bg-[#4060e0] hover:bg-[#3050d0] px-5 py-2 font-medium">
                  View Job
                </Button>
              </Link>
            )}
            
            <div className="mt-3 flex items-center text-sm text-gray-600">
              <Briefcase className="h-4 w-4 mr-1 text-primary" />
              <span>{job.jobType}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
