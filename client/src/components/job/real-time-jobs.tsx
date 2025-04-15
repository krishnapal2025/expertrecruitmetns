import React, { useEffect, useState } from "react";
import { Job } from "@shared/schema";
import { startRealtimePolling, stopRealtimePolling } from "@/lib/realtime";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClockIcon, DollarSignIcon, MapPinIcon, BriefcaseIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

/**
 * Component to show real-time job updates as they come in
 */
export default function RealtimeJobs() {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [, navigate] = useLocation();
  const [newJobs, setNewJobs] = useState<Job[]>([]);
  const [expanded, setExpanded] = useState(false);

  // Setup real-time polling for job updates
  useEffect(() => {
    startRealtimePolling({
      // Poll every 15 seconds
      intervalMs: 15000,
      // Handle new jobs
      onNewJobs: (jobs) => {
        if (jobs.length > 0) {
          setNewJobs(prevJobs => {
            // Create a map of existing jobs by ID
            const existingMap = new Map(prevJobs.map(job => [job.id, job]));
            
            // Add new jobs
            jobs.forEach(job => {
              existingMap.set(job.id, job);
            });
            
            // Convert map back to array
            return Array.from(existingMap.values())
              .sort((a, b) => b.id - a.id) // Sort by ID (newest first)
              .slice(0, 5); // Keep only the 5 most recent
          });
          
          // Show a toast for the newest job
          if (currentUser?.user.userType === "jobseeker") {
            toast({
              title: "New Job Posted",
              description: `${jobs[0].title} at ${jobs[0].location}`,
            });
          }
        }
      }
    });
    
    // Clean up polling when component unmounts
    return () => {
      stopRealtimePolling();
    };
  }, [toast, currentUser]);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  // Don't render if there are no new jobs
  if (newJobs.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6 border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          New Job Opportunities
        </CardTitle>
        <CardDescription>
          {newJobs.length} new job{newJobs.length !== 1 ? 's' : ''} posted recently
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          {/* Show only the first job when collapsed, all when expanded */}
          {newJobs.slice(0, expanded ? newJobs.length : 1).map((job) => (
            <div 
              key={job.id} 
              className="border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => navigate(`/jobs/${job.id}`)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">{job.title}</h3>
                <Badge>{job.jobType}</Badge>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex items-center gap-2">
                  <MapPinIcon className="h-4 w-4" /> {job.location}
                </div>
                <div className="flex items-center gap-2">
                  <BriefcaseIcon className="h-4 w-4" /> {job.category}
                </div>
                {job.salary && (
                  <div className="flex items-center gap-2">
                    <DollarSignIcon className="h-4 w-4" /> {job.salary}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4" /> Posted {new Date(job.postedDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      {newJobs.length > 1 && (
        <CardFooter>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-primary"
            onClick={toggleExpanded}
          >
            {expanded ? 'Show Less' : `Show ${newJobs.length - 1} More Job${newJobs.length !== 2 ? 's' : ''}`}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}