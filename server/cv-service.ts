import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { DatabaseStorage } from './storage';
import { Readable } from 'stream';

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
        // Print debugging information
        console.log('CV path from database:', jobSeeker.cvPath);
        
        // Get absolute paths
        const rootDir = path.resolve('.');
        const uploadsDir = path.resolve('./uploads');
        let cvPath = '';
        
        // Normalize the path - handle both relative and absolute paths
        if (jobSeeker.cvPath.startsWith('/') || jobSeeker.cvPath.startsWith('./')) {
          // Path is already relative to root or absolute
          cvPath = path.resolve(jobSeeker.cvPath);
        } else {
          // Path is just a filename, assume it's in uploads directory
          cvPath = path.resolve(path.join('./uploads', jobSeeker.cvPath));
        }
        
        console.log('Root directory:', rootDir);
        console.log('Uploads directory:', uploadsDir);
        console.log('Resolved CV path:', cvPath);
        
        // Security check to prevent directory traversal
        if (!cvPath.startsWith(rootDir)) {
          console.error('Path security check failed: path outside root directory');
          throw new Error('Invalid file path - security violation');
        }
        
        // Check if file exists
        const exists = fs.existsSync(cvPath);
        console.log('File exists:', exists);
        
        if (exists) {
          // Get file stats for additional information
          const stats = fs.statSync(cvPath);
          console.log('File stats:', {
            size: stats.size,
            isFile: stats.isFile(),
            created: stats.birthtime,
            modified: stats.mtime
          });
          
          // Get original file name from path
          const originalFilename = path.basename(cvPath);
          console.log('Original filename:', originalFilename);
          
          // Determine content type based on file extension
          const ext = path.extname(cvPath).toLowerCase();
          let contentType = 'application/octet-stream'; // Default
          
          if (ext === '.pdf') contentType = 'application/pdf';
          else if (ext === '.doc') contentType = 'application/msword';
          else if (ext === '.docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
          
          console.log('Content type:', contentType);
          
          // Set headers for download with original filename
          res.setHeader('Content-Type', contentType);
          res.setHeader('Content-Disposition', `attachment; filename="${originalFilename}"`);
          
          // Read file contents for debugging extremely small files
          if (stats.size < 1024) { // Only for files less than 1KB
            const fileContent = fs.readFileSync(cvPath, 'utf8');
            console.log('File content preview:', fileContent.substring(0, 200));
          }
          
          // Stream the file
          const fileStream = fs.createReadStream(cvPath);
          
          // Handle stream errors
          fileStream.on('error', (err) => {
            console.error('Error streaming file:', err);
            if (!res.headersSent) {
              res.status(500).json({ message: "Error streaming file" });
            }
          });
          
          // Send the file
          fileStream.pipe(res);
          return;
        } else {
          console.log(`CV file not found at path: ${cvPath}`);
          
          // Check if the directory exists
          const dir = path.dirname(cvPath);
          const dirExists = fs.existsSync(dir);
          console.log(`Directory ${dir} exists: ${dirExists}`);
          
          if (dirExists) {
            // List directory contents for debugging
            const dirContents = fs.readdirSync(dir);
            console.log(`Directory contents of ${dir}:`, dirContents);
          }
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