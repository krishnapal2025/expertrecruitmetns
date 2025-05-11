import fs from 'fs';
import path from 'path';
import { Request, Response } from 'express';
import { DatabaseStorage } from './storage';
import { Readable } from 'stream';
import PDFKit from 'pdfkit';

// Add uploads directory if it doesn't exist
try {
  if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads', { recursive: true });
    console.log('Created uploads directory');
  }
} catch (err) {
  console.error('Error checking/creating uploads directory:', err);
}

/**
 * Handles downloading the original CV file for a job application
 * @param req The request object
 * @param res The response object
 * @param storage The database storage instance
 * @param preview If true, file will be displayed inline in browser, otherwise downloaded
 * @param format Optional format override ('pdf' to force PDF conversion)
 */
export async function handleCvDownload(
  req: Request, 
  res: Response, 
  storage: DatabaseStorage,
  preview: boolean = false,
  format?: string
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
    
    if (user.userType === "admin" || user.userType === "super_admin") {
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
    
    // First check if the application has a specific resumePath
    let resumePath = application.resumePath || jobSeeker.cvPath;
    
    // If we have a resume path, serve that
    if (resumePath) {
      try {
        // Print debugging information
        console.log('Resume path from database:', resumePath);
        
        // Get absolute paths
        const rootDir = path.resolve('.');
        const uploadsDir = path.resolve('./uploads');
        let cvPath = '';
        
        // Normalize the path - handle both relative and absolute paths
        if (resumePath.startsWith('/') || resumePath.startsWith('./')) {
          // Path is already relative to root or absolute
          cvPath = path.resolve(resumePath);
        } else {
          // Path is just a filename, assume it's in uploads directory
          cvPath = path.resolve(path.join('./uploads', resumePath));
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
          
          // Set headers for download or preview with original filename
          res.setHeader('Content-Type', contentType);
          
          // If format is 'pdf' and file is not already PDF, convert it
          if (format === 'pdf' && ext !== '.pdf') {
            // Create a sanitized PDF
            const doc = new PDFKit({ margin: 50, compress: true });
            
            // Set metadata to prevent malware detection
            doc.info['Title'] = `${jobSeeker.firstName} ${jobSeeker.lastName} - Resume`;
            doc.info['Author'] = 'Expert Recruitments LLC';
            doc.info['Subject'] = 'Job Application Resume';
            doc.info['Keywords'] = 'resume, recruitment, job application';
            doc.info['CreationDate'] = new Date();
            
            // Add filename as header
            doc.fontSize(16).text(`Resume: ${originalFilename}`, { align: 'center' });
            doc.moveDown(1);
            
            // Add file contents if text-based
            if (ext === '.txt' || ext === '.doc' || ext === '.docx' || stats.size < 1024 * 500) {
              try {
                const fileContent = fs.readFileSync(cvPath, 'utf8');
                doc.fontSize(12).text(fileContent);
              } catch (e) {
                doc.fontSize(12).text(`Original file content cannot be displayed directly in PDF format.
                Please access the original file for complete content.`);
              }
            } else {
              doc.fontSize(12).text(`This resume is available in its original format. 
              The content cannot be fully rendered in PDF format.
              Please access the original file for complete content.`);
            }
            
            // Set filename and send as download
            const pdfFilename = originalFilename.replace(path.extname(originalFilename), '.pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${pdfFilename}"`);
            
            // Stream the PDF
            doc.pipe(res);
            doc.end();
            return;
          }
          
          // Set special headers for PDFs to prevent malware detection
          if (ext === '.pdf') {
            // Chrome sometimes flags downloaded PDFs as malware
            // Set appropriate headers to prevent this
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('Content-Security-Policy', "default-src 'self'");
          }
          
          // Set appropriate content disposition based on preview flag
          const disposition = preview ? 'inline' : 'attachment';
          res.setHeader('Content-Disposition', `${disposition}; filename="${originalFilename}"`);
          
          // Read file contents for debugging extremely small files
          if (stats.size < 1024) { // Only for files less than 1KB
            const fileContent = fs.readFileSync(cvPath, 'utf8');
            console.log('File content preview:', fileContent.substring(0, 200));
          }
          
          console.log('Streaming file to response...');
          
          try {
            // Read the file and send it
            const fileBuffer = fs.readFileSync(cvPath);
            res.send(fileBuffer);
            console.log('File sent successfully!');
            return;
          } catch (readError) {
            console.error('Error reading file:', readError);
            
            // If reading fails, fall back to streaming
            console.log('Falling back to streaming method...');
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
          }
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