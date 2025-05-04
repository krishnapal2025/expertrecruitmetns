import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { DatabaseStorage } from './storage';

/**
 * Handles downloading the original CV file for a job application
 */
export async function handleCvDownload(
  req: Request, 
  res: Response, 
  storage: DatabaseStorage
): Promise<void> {
  try {
    if (!req.isAuthenticated()) {
      res.status(401).json({ message: "You must be logged in to download CV" });
      return;
    }

    const applicationId = parseInt(req.params.id);
    if (isNaN(applicationId)) {
      res.status(400).json({ message: "Invalid application ID" });
      return;
    }

    const application = await storage.getApplication(applicationId);
    if (!application) {
      res.status(404).json({ message: "Application not found" });
      return;
    }

    // Check authorization: employer who posted the job, job seeker who applied, or admin
    const user = req.user;
    const job = await storage.getJob(application.jobId);
    
    if (!job) {
      res.status(404).json({ message: "Job not found" });
      return;
    }
    
    let authorized = false;
    
    if (user.userType === "admin") {
      authorized = true;
    } else if (user.userType === "employer") {
      const employer = await storage.getEmployerByUserId(user.id);
      if (employer && employer.id === job.employerId) {
        authorized = true;
      }
    } else if (user.userType === "jobseeker") {
      const jobSeeker = await storage.getJobSeekerByUserId(user.id);
      if (jobSeeker && jobSeeker.id === application.jobSeekerId) {
        authorized = true;
      }
    }
    
    if (!authorized) {
      res.status(403).json({ message: "You are not authorized to download this CV" });
      return;
    }
    
    // Get job seeker details
    const jobSeeker = await storage.getJobSeeker(application.jobSeekerId);
    if (!jobSeeker) {
      res.status(404).json({ message: "Job seeker not found" });
      return;
    }
    
    // If job seeker has an actual CV uploaded, serve that
    if (jobSeeker.cvPath) {
      try {
        // Ensure the path is within our uploads directory (security check)
        const uploadsDir = path.resolve('./uploads');
        const cvPath = path.resolve(jobSeeker.cvPath);
        
        if (!cvPath.startsWith(uploadsDir)) {
          throw new Error('Invalid file path');
        }
        
        if (fs.existsSync(cvPath)) {
          // Log to debug file access issues
          console.log(`Serving CV file: ${cvPath}`);
          
          // Get original file name from path
          const originalFilename = path.basename(cvPath);
          
          // Determine content type based on file extension
          const ext = path.extname(cvPath).toLowerCase();
          let contentType = 'application/octet-stream'; // Default
          
          if (ext === '.pdf') contentType = 'application/pdf';
          else if (ext === '.doc') contentType = 'application/msword';
          else if (ext === '.docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          
          // Set headers for download with original filename
          res.setHeader('Content-Type', contentType);
          res.setHeader('Content-Disposition', `attachment; filename="${originalFilename}"`);
          
          // Stream the file
          const fileStream = fs.createReadStream(cvPath);
          fileStream.pipe(res);
          return;
        } else {
          console.log(`CV file not found at path: ${cvPath}`);
        }
      } catch (fileError) {
        console.error('Error serving original CV file:', fileError);
        res.status(500).json({ message: "Failed to retrieve CV file" });
        return;
      }
    } else {
      console.log(`No CV path available for job seeker ID: ${jobSeeker.id}`);
    }
    
    // If no CV file or error accessing it, return error
    res.status(404).json({ message: "CV file not found" });
  } catch (error) {
    console.error("Error downloading CV:", error);
    res.status(500).json({ message: "Failed to download CV" });
  }
}