import React, { useEffect, useState } from "react";
import { Application, Job } from "@shared/schema";
import { startRealtimePolling, stopRealtimePolling } from "@/lib/realtime";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

// Combined type for application with embedded job
interface ApplicationWithJob extends Application {
  job: Job;
}

/**
 * Component to show real-time job application updates for employers
 */
export default function RealtimeApplications() {
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const [, navigate] = useLocation();
  const [newApplications, setNewApplications] = useState<ApplicationWithJob[]>([]);
  const [expanded, setExpanded] = useState(false);

  // Setup real-time polling for application updates
  useEffect(() => {
    // Only employers should see this component
    if (currentUser?.user.userType !== "employer") return;

    startRealtimePolling({
      // Poll every 15 seconds
      intervalMs: 15000,
      // Handle new applications
      onNewApplications: (applications) => {
        if (applications.length > 0) {
          setNewApplications(prevApplications => {
            // Create a map of existing applications by ID
            const existingMap = new Map(prevApplications.map(app => [app.id, app]));
            
            // Add new applications
            applications.forEach(app => {
              existingMap.set(app.id, app);
            });
            
            // Convert map back to array
            return Array.from(existingMap.values())
              .sort((a, b) => b.id - a.id) // Sort by ID (newest first)
              .slice(0, 5); // Keep only the 5 most recent
          });
          
          // Show a toast for the newest application
          toast({
            title: "New Job Application",
            description: `New application for ${applications[0].job.title}`,
          });
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

  // Don't render if there are no new applications or user is not an employer
  if (newApplications.length === 0 || currentUser?.user.userType !== "employer") {
    return null;
  }

  return (
    <Card className="mb-6 border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          Recent Applications
        </CardTitle>
        <CardDescription>
          {newApplications.length} new application{newApplications.length !== 1 ? 's' : ''} to your job postings
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          {/* Show only the first application when collapsed, all when expanded */}
          {newApplications.slice(0, expanded ? newApplications.length : 1).map((application) => (
            <div 
              key={application.id} 
              className="border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer"
              onClick={() => navigate(`/applications/${application.id}`)}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium">Application for {application.job.title}</h3>
                <Badge>{application.status}</Badge>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Applied on {new Date(application.appliedDate).toLocaleDateString()}</p>
                {application.coverLetter && (
                  <p className="mt-2 line-clamp-2">
                    "{application.coverLetter.slice(0, 100)}..."
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      {newApplications.length > 1 && (
        <CardFooter>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full text-primary"
            onClick={toggleExpanded}
          >
            {expanded ? 'Show Less' : `Show ${newApplications.length - 1} More Application${newApplications.length !== 2 ? 's' : ''}`}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}