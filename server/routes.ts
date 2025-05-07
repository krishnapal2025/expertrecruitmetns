import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import * as z from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { db } from "./db"; // Import the database instance for direct SQL
import {
  insertJobSchema,
  insertApplicationSchema,
  adminRegisterSchema,
  adminSignupSchema,
  insertInvitationCodeSchema,
  insertTestimonialSchema,
  insertVacancySchema,
  insertStaffingInquirySchema,
  insertBlogPostSchema,
  User,
  Admin,
  Vacancy,
  StaffingInquiry,
  BlogPost
} from "@shared/schema";
import { hashPassword } from "./auth";
import { generateResetToken, sendPasswordResetEmail, sendVacancyAssignmentEmail, sendInquiryReply } from "./email-service";
import { seedJobs } from "./seed-jobs";
import { generateResumePDF, resumeDataSchema, bufferToStream, ResumeData } from "./pdf-service";
import { handleCvDownload } from "./cv-service";
import { uploadBlogImage, getUploadedFilePath } from "./upload-service";
import path from "path";

// Add ResumeData type to session
declare module "express-session" {
  interface SessionData {
    resumeData?: ResumeData;
  }
}

// In-memory store for real-time updates
const realtimeStore = {
  lastJobId: 0,
  lastApplicationId: 0,
  notifications: [] as { id: number; userId: number; message: string; read: boolean; createdAt: Date }[],
  notificationId: 1
};

import config from './config';

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for Fly.io and other deployment platforms
  app.get("/health", (req, res) => {
    try {
      // Run a basic database check
      const dbStatus = db ? "connected" : "disconnected";

      // Respond with comprehensive system information
      res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        application: config.app.name,
        version: config.app.version,
        platform: process.env.FLY_APP_NAME ? "fly.io" :
                 (process.env.REPL_ID || process.env.REPL_SLUG) ? "replit" :
                 "other",
        database: dbStatus,
        features: {
          emailEnabled: config.email.enabled,
          jobSeedingEnabled: config.features.seedJobs,
          debugMode: config.features.debugMode
        }
      });
    } catch (error) {
      console.error("Health check failed:", error);
      res.status(500).json({
        status: "error",
        message: "System health check failed",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      });
    }
  });

  // Set up authentication routes
  setupAuth(app);
  
  // Serve the uploads directory for uploaded files
  app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
  
  // Image upload endpoint for blog posts (admin only)
  app.post("/api/upload/blog-image", (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.status(403).json({ message: "Unauthorized: Admin access required" });
    }
    
    uploadBlogImage(req, res, function(err) {
      if (err) {
        // Error handled by the middleware
        return;
      }
      
      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }
      
      // Generate URL path for the uploaded file
      const imagePath = getUploadedFilePath(req.file.filename, 'blog-image');
      
      // Return success with file information
      res.status(200).json({
        success: true,
        message: "Image uploaded successfully",
        file: {
          filename: req.file.filename,
          originalname: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          path: imagePath
        }
      });
    });
  });

  // Seed jobs data
  // await seedJobs();

  // Resume PDF endpoints
  // Combined endpoint that handles both forms and API JSON
  app.post("/api/generate-resume-pdf", async (req, res) => {
    try {
      let resumeData: ResumeData;
      let filename = 'resume.pdf';

      // Check if this is form data or JSON API call
      if (req.body.resumeData) {
        // This is from the form submission
        try {
          resumeData = resumeDataSchema.parse(JSON.parse(req.body.resumeData));
          if (req.body.filename) {
            filename = req.body.filename;
          }
        } catch (parseError) {
          console.error('Error parsing resume data from form:', parseError);
          return res.status(400).json({ message: 'Invalid resume data format' });
        }
      } else {
        // This is a direct API call with JSON body
        resumeData = resumeDataSchema.parse(req.body);

        // Store in session for future use
        if (req.session) {
          req.session.resumeData = resumeData;
        }

        // Use name from resume data for filename if not specified
        const safeFirstName = resumeData.personalInfo.firstName.replace(/[^a-zA-Z0-9]/g, '_');
        const safeLastName = resumeData.personalInfo.lastName.replace(/[^a-zA-Z0-9]/g, '_');
        filename = `Resume_${safeFirstName}_${safeLastName}.pdf`;
      }

      // Generate PDF
      const pdfBuffer = await generateResumePDF(resumeData);

      // Make sure filename is safe
      const safeFilename = filename.replace(/[^a-zA-Z0-9_\-\.]/g, '_');

      // Set comprehensive security headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Length', pdfBuffer.length);
      res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
      res.setHeader('Content-Security-Policy', "default-src 'none'");
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
      res.setHeader('Pragma', 'no-cache');

      // Send the PDF buffer as stream to avoid memory issues
      bufferToStream(pdfBuffer).pipe(res);
    } catch (error) {
      console.error('Error generating PDF:', error);

      // Different error responses based on content type expected
      const accepts = req.headers.accept || '';
      if (accepts.includes('application/json')) {
        res.status(500).json({ message: 'Failed to generate PDF' });
      } else {
        // Return HTML error for browser
        res.status(500).send(`
          <html>
            <head><title>Resume Download Error</title></head>
            <body>
              <h2>Error Generating PDF</h2>
              <p>There was a problem generating your resume PDF. Please try again.</p>
              <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
              <p><a href="/resources/create-resume">Return to Resume Builder</a></p>
            </body>
          </html>
        `);
      }
    }
  });

  // GET endpoint for browser's native download functionality (as fallback)
  app.get("/api/download-resume-pdf", async (req, res) => {
    try {
      const { filename } = req.query;

      // Use the filename parameter if provided, otherwise use default
      const safeFilename = filename ?
        String(filename).replace(/[^a-zA-Z0-9_\-\.]/g, '_') :
        'resume.pdf';

      // Check if we have resume data in the session
      if (!req.session || !req.session.resumeData) {
        // For download managers, don't return HTML error - return an empty PDF
        if (req.headers['user-agent']?.toLowerCase().includes('download') ||
            req.headers['user-agent']?.toLowerCase().includes('manager')) {

          // Create a minimal empty PDF
          const pdfBuffer = Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Count 0/Kids[]>>endobj 3 0 obj<</Producer(Resume Generator)>>endobj xref 0 4 0000000000 65535 f 0000000010 00000 n 0000000053 00000 n 0000000100 00000 n trailer<</Size 4/Root 1 0 R/Info 3 0 R>>startxref 150 %%EOF', 'utf-8');

          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Length', pdfBuffer.length);
          res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
          return res.end(pdfBuffer);
        }

        // For browsers, return friendly HTML error
        return res.status(400).send(`
          <html>
            <head><title>Resume Download Error</title></head>
            <body>
              <h2>Resume Data Not Found</h2>
              <p>Please return to the resume builder and try again.</p>
              <p><a href="/resources/create-resume">Return to Resume Builder</a></p>
            </body>
          </html>
        `);
      }

      // Get resume data from session
      const resumeData = req.session.resumeData;

      // Generate PDF
      const pdfBuffer = await generateResumePDF(resumeData);

      // Set comprehensive security headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Length', pdfBuffer.length);
      res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
      res.setHeader('X-Content-Type-Options', 'nosniff');

      // For download managers, don't set some headers that might cause issues
      if (!req.headers['user-agent']?.toLowerCase().includes('download') &&
          !req.headers['user-agent']?.toLowerCase().includes('manager')) {
        res.setHeader('Content-Security-Policy', "default-src 'none'");
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
        res.setHeader('Pragma', 'no-cache');
      }

      // For download managers that don't handle streams well, send the buffer all at once
      if (req.headers['user-agent']?.toLowerCase().includes('download') ||
          req.headers['user-agent']?.toLowerCase().includes('manager')) {
        return res.end(pdfBuffer);
      } else {
        // Send the PDF buffer as stream to avoid memory issues for browsers
        bufferToStream(pdfBuffer).pipe(res);
      }
    } catch (error) {
      console.error('Error generating PDF for download:', error);

      // Check if this is a download manager
      if (req.headers['user-agent']?.toLowerCase().includes('download') ||
          req.headers['user-agent']?.toLowerCase().includes('manager')) {

        // Just return a minimal empty PDF to avoid error popups
        const pdfBuffer = Buffer.from('%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Count 0/Kids[]>>endobj 3 0 obj<</Producer(Resume Generator)>>endobj xref 0 4 0000000000 65535 f 0000000010 00000 n 0000000053 00000 n 0000000100 00000 n trailer<</Size 4/Root 1 0 R/Info 3 0 R>>startxref 150 %%EOF', 'utf-8');

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Length', pdfBuffer.length);
        res.setHeader('Content-Disposition', `attachment; filename="${req.query.filename || 'resume.pdf'}"`);
        return res.end(pdfBuffer);
      }

      // For browsers, return HTML error
      res.status(500).send(`
        <html>
          <head><title>Resume Download Error</title></head>
          <body>
            <h2>Error Generating PDF</h2>
            <p>There was a problem generating your resume PDF. Please try again.</p>
            <p>${error instanceof Error ? error.message : 'Unknown error'}</p>
            <p><a href="/resources/create-resume">Return to Resume Builder</a></p>
          </body>
        </html>
      `);
    }
  });

  // API routes

  // Profile endpoints
  // Get job seeker profile
  app.get("/api/profile/jobseeker/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const jobSeeker = await storage.getJobSeeker(parseInt(id));

      if (!jobSeeker) {
        return res.status(404).json({ message: "Profile not found" });
      }

      // If not authenticated or not the owner, return public profile
      if (!req.isAuthenticated()) {
        // Return public profile (exclude sensitive data)
        const publicProfile = {
          id: jobSeeker.id,
          firstName: jobSeeker.firstName,
          lastName: jobSeeker.lastName,
          country: jobSeeker.country,
        };
        return res.json(publicProfile);
      }

      // Check if current user is the owner
      const user = await storage.getUserByJobSeekerId(parseInt(id));
      if (user && user.id === req.user.id) {
        // Owner can see full profile
        return res.json(jobSeeker);
      } else {
        // Other authenticated users see public profile
        const publicProfile = {
          id: jobSeeker.id,
          firstName: jobSeeker.firstName,
          lastName: jobSeeker.lastName,
          country: jobSeeker.country,
        };
        return res.json(publicProfile);
      }
    } catch (error) {
      console.error("Error fetching job seeker profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Get employer profile
  app.get("/api/profile/employer/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const employer = await storage.getEmployer(parseInt(id));

      if (!employer) {
        return res.status(404).json({ message: "Profile not found" });
      }

      // If not authenticated, return public profile
      if (!req.isAuthenticated()) {
        // Return public profile
        const publicProfile = {
          id: employer.id,
          companyName: employer.companyName,
          industry: employer.industry,
          description: employer.description,
          logoPath: employer.logoPath,
          websiteUrl: employer.websiteUrl
        };
        return res.json(publicProfile);
      }

      // Check if current user is the owner
      const user = await storage.getUserByEmployerId(parseInt(id));
      if (user && user.id === req.user.id) {
        // Owner can see full profile
        return res.json(employer);
      } else {
        // Other authenticated users see public profile
        const publicProfile = {
          id: employer.id,
          companyName: employer.companyName,
          industry: employer.industry,
          description: employer.description,
          logoPath: employer.logoPath,
          websiteUrl: employer.websiteUrl
        };
        return res.json(publicProfile);
      }
    } catch (error) {
      console.error("Error fetching employer profile:", error);
      res.status(500).json({ message: "Failed to fetch profile" });
    }
  });

  // Update job seeker profile
  app.patch("/api/profile/jobseeker/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    try {
      const { id } = req.params;
      const jobSeeker = await storage.getJobSeeker(parseInt(id));

      if (!jobSeeker) {
        return res.status(404).json({ message: "Profile not found" });
      }

      // Check if current user has permission to update this profile
      const user = await storage.getUserByJobSeekerId(parseInt(id));
      if (!user || user.id !== req.user.id) {
        return res.status(403).json({ message: "You don't have permission to update this profile" });
      }

      // Update profile with new data
      const updatedJobSeeker = {
        ...jobSeeker,
        ...req.body
      };

      // Update in storage (simplified as MemStorage doesn't have update method)
      const profile = await storage.updateJobSeeker(updatedJobSeeker);
      res.json(profile);
    } catch (error) {
      console.error("Error updating job seeker profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Update employer profile
  app.patch("/api/profile/employer/:id", async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    try {
      const { id } = req.params;
      const employer = await storage.getEmployer(parseInt(id));

      if (!employer) {
        return res.status(404).json({ message: "Profile not found" });
      }

      // Check if current user has permission to update this profile
      const user = await storage.getUserByEmployerId(parseInt(id));
      if (!user || user.id !== req.user.id) {
        return res.status(403).json({ message: "You don't have permission to update this profile" });
      }

      // Update profile with new data
      const updatedEmployer = {
        ...employer,
        ...req.body
      };

      // Update in storage (simplified as MemStorage doesn't have update method)
      const profile = await storage.updateEmployer(updatedEmployer);
      res.json(profile);
    } catch (error) {
      console.error("Error updating employer profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Get all employers (for directory or search)
  app.get("/api/employers", async (req, res) => {
    try {
      // Get all users
      const users = await storage.getAllUsers();

      // Filter employer users
      const employerUsers = users.filter(user => user.userType === "employer");

      // Get employer profiles for each employer user
      const employers = await Promise.all(
        employerUsers.map(async (user) => {
          const employer = await storage.getEmployerByUserId(user.id);
          if (employer) {
            // Return public profile only
            return {
              id: employer.id,
              companyName: employer.companyName,
              industry: employer.industry,
              description: employer.description || "",
              logoPath: employer.logoPath || "",
              websiteUrl: employer.website || ""
            };
          }
          return null;
        })
      );

      // Filter out null values (in case any employer user didn't have a profile)
      const validEmployers = employers.filter(employer => employer !== null);

      res.json(validEmployers);
    } catch (error) {
      console.error("Error fetching employers:", error);
      res.status(500).json({ message: "Failed to fetch employers" });
    }
  });

  // Get all job seekers (for talent directory)
  app.get("/api/jobseekers", async (req, res) => {
    try {
      // Get all users
      const users = await storage.getAllUsers();

      // Filter job seeker users
      const jobSeekerUsers = users.filter(user => user.userType === "jobseeker");

      // Get job seeker profiles for each job seeker user
      const jobSeekers = await Promise.all(
        jobSeekerUsers.map(async (user) => {
          const jobSeeker = await storage.getJobSeekerByUserId(user.id);
          if (jobSeeker) {
            // Return public profile only to protect privacy
            return {
              id: jobSeeker.id,
              firstName: jobSeeker.firstName,
              lastName: jobSeeker.lastName,
              country: jobSeeker.country,
              skills: jobSeeker.skills || [],
              experience: jobSeeker.experience || ""
            };
          }
          return null;
        })
      );

      // Filter out null values (in case any job seeker user didn't have a profile)
      const validJobSeekers = jobSeekers.filter(jobSeeker => jobSeeker !== null);

      res.json(validJobSeekers);
    } catch (error) {
      console.error("Error fetching job seekers:", error);
      res.status(500).json({ message: "Failed to fetch job seekers" });
    }
  });

  // Endpoint to view job seeker's CV
  app.get("/api/jobseekers/:id/cv", async (req, res) => {
    try {
      const jobSeekerId = parseInt(req.params.id);
      if (isNaN(jobSeekerId)) {
        return res.status(400).json({ message: "Invalid job seeker ID" });
      }

      // Check if request is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to access this resource" });
      }

      // Only allow admin, the job seeker themselves, or employers to view resumes
      const user = req.user;
      const jobSeeker = await storage.getJobSeeker(jobSeekerId);

      if (!jobSeeker) {
        return res.status(404).json({ message: "Job seeker not found" });
      }

      // Check if the current user is the job seeker, an admin, or an employer
      const isAuthorized =
        user.userType === "admin" ||
        (user.userType === "jobseeker" && jobSeeker.userId === user.id) ||
        user.userType === "employer";

      if (!isAuthorized) {
        return res.status(403).json({ message: "You are not authorized to view this resume" });
      }

      // If job seeker has an actual CV uploaded, check if we should serve that
      if (jobSeeker.cvPath && req.query.original === 'true') {
        try {
          // Attempt to serve the original CV file if it exists
          const fs = require('fs');
          const path = require('path');

          // Ensure the path is within our uploads directory (security check)
          const uploadsDir = path.resolve('./uploads');
          const cvPath = path.resolve(jobSeeker.cvPath);

          if (!cvPath.startsWith(uploadsDir)) {
            throw new Error('Invalid file path');
          }

          if (fs.existsSync(cvPath)) {
            // Extract original filename from path or use a default
            const originalFilename = path.basename(cvPath);

            // Determine content type based on file extension
            const ext = path.extname(cvPath).toLowerCase();
            let contentType = 'application/octet-stream'; // Default

            if (ext === '.pdf') contentType = 'application/pdf';
            else if (ext === '.doc') contentType = 'application/msword';
            else if (ext === '.docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

            // Set headers
            res.setHeader('Content-Type', contentType);
            res.setHeader('Content-Disposition', `attachment; filename="${jobSeeker.firstName}_${jobSeeker.lastName}${ext}"`);

            // Stream the file
            const fileStream = fs.createReadStream(cvPath);
            fileStream.pipe(res);
            return;
          }
        } catch (fileError) {
          console.error('Error serving original CV file:', fileError);
          // Continue to fallback PDF generation if file cannot be served
        }
      }

      // Generate a PDF resume if the job seeker has profile data
      // Get the user details to extract email and other contact info
      const jobSeekerUser = await storage.getUserById(jobSeeker.userId);

      if (!jobSeekerUser) {
        return res.status(404).json({ message: "Job seeker user not found" });
      }

      // Create resume data
      const resumeData = {
        personalInfo: {
          firstName: jobSeeker.firstName,
          lastName: jobSeeker.lastName,
          email: jobSeekerUser.email,
          phone: jobSeeker.phoneNumber || "",
          address: jobSeeker.country || "",
          title: "Job Seeker"
        },
        summary: "Professional seeking opportunities in the job market.",
        experience: [
          {
            title: "Job Seeker",
            company: "Looking for opportunities",
            location: jobSeeker.country || "",
            startDate: "Present",
            endDate: "Present",
            description: "Actively seeking new career opportunities."
          }
        ],
        education: [],
        skills: [],
        languages: [],
        certifications: []
      };

      // Generate the PDF
      const pdfBuffer = await generateResumePDF(resumeData);

      // Send the PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="resume_${jobSeeker.firstName}_${jobSeeker.lastName}.pdf"`);
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generating CV:", error);
      res.status(500).json({ message: "Failed to generate CV" });
    }
  });


  // Get all job listings with optional filters
  app.get("/api/jobs", async (req, res) => {
    try {
      const {
        category,
        location,
        jobType,
        specialization,
        minSalary,
        maxSalary,
        keyword
      } = req.query;

      const filters: any = {};
      if (category && category !== 'All Categories') filters.category = category as string;
      if (location && location !== 'All Locations') filters.location = location as string;
      if (jobType && jobType !== 'All Types') filters.jobType = jobType as string;
      if (specialization && specialization !== 'All Specializations') filters.specialization = specialization as string;
      if (minSalary) filters.minSalary = parseInt(minSalary as string);
      if (maxSalary) filters.maxSalary = parseInt(maxSalary as string);
      if (keyword) filters.keyword = keyword as string;

      const jobs = await storage.getJobs(Object.keys(filters).length > 0 ? filters : undefined);

      res.json(jobs);
    } catch (error) {
      console.error("Error fetching jobs:", error);
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  // Get a specific job by ID
  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const jobId = parseInt(req.params.id);
      if (isNaN(jobId)) {
        return res.status(400).json({ message: "Invalid job ID" });
      }

      const job = await storage.getJob(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Get the employer details for the job
      const employer = await storage.getEmployer(job.employerId);

      res.json({ job, employer });
    } catch (error) {
      console.error("Error fetching job:", error);
      res.status(500).json({ message: "Failed to fetch job details" });
    }
  });

  // Create a new job (requires employer or admin authentication)
  app.post("/api/jobs", async (req, res) => {
    try {
      console.log("POST /api/jobs - Request payload:", req.body);
      console.log("POST /api/jobs - Authentication status:", req.isAuthenticated());
      console.log("POST /api/jobs - User:", req.user);
      console.log("POST /api/jobs - Session:", req.session);
      
      // Enhanced authentication check
      if (!req.isAuthenticated() || !req.user) {
        console.log("POST /api/jobs - Authentication failed - No session or user");
        return res.status(401).json({ message: "You must be logged in to post a job. Please refresh the page and try again." });
      }
      
      // Verify that the user type is valid for posting jobs
      if (req.user.userType !== "admin") {
        console.log("POST /api/jobs - User type not authorized:", req.user.userType);
        return res.status(403).json({ message: "Only admins can post jobs" });
      }

      const user = req.user;
      if (user.userType !== "admin") {
        return res.status(403).json({ message: "Only admins can post jobs" });
      }

      // Validate job data - the schema will handle date conversion
      const validatedData = insertJobSchema.parse(req.body);

      // Admin users must select an employer ID via the employerId property
      const employerId = Number(req.body.employerId);

      if (!employerId || isNaN(employerId)) {
        return res.status(400).json({ message: "Admin must select an employer when posting a job" });
      }

      // Verify the employer exists
      const employer = await storage.getEmployer(employerId);
      if (!employer) {
        return res.status(404).json({ message: "Selected employer not found" });
      }

      // Create the job
      const job = await storage.createJob({
        ...validatedData,
        employerId: employerId
      });

      // Update real-time store and create notifications for job seekers
      realtimeStore.lastJobId = Math.max(realtimeStore.lastJobId, job.id);

      // Get all job seekers to send notifications to
      const users = await storage.getAllUsers();
      const jobSeekerUsers = users.filter((u: User) => u.userType === "jobseeker");

      // Create notifications for all job seekers
      jobSeekerUsers.forEach((jobSeekerUser: User) => {
        realtimeStore.notifications.push({
          id: realtimeStore.notificationId++,
          userId: jobSeekerUser.id,
          message: `New job posted: ${job.title} at ${job.company}`,
          read: false,
          createdAt: new Date()
        });
      });

      res.status(201).json(job);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }

      console.error("Error creating job:", error);
      res.status(500).json({ message: "Failed to create job" });
    }
  });

  // Apply for a job (requires jobseeker authentication)
  app.post("/api/jobs/:id/apply", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to apply for a job" });
      }

      const user = req.user;
      if (user.userType !== "jobseeker") {
        return res.status(403).json({ message: "Only job seekers can apply for jobs" });
      }

      const jobId = parseInt(req.params.id);
      if (isNaN(jobId)) {
        return res.status(400).json({ message: "Invalid job ID" });
      }

      // Validate the job exists
      const job = await storage.getJob(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Get jobseeker profile
      const jobSeeker = await storage.getJobSeekerByUserId(user.id);
      if (!jobSeeker) {
        return res.status(404).json({ message: "Job seeker profile not found" });
      }

      // Check if already applied
      const existingApplications = await storage.getApplicationsByJobSeekerId(jobSeeker.id);
      const alreadyApplied = existingApplications.some(app => app.jobId === jobId);

      if (alreadyApplied) {
        return res.status(400).json({ message: "You have already applied for this job" });
      }

      // Validate application data
      const { coverLetter } = req.body;

      // Create the application
      const application = await storage.createApplication({
        jobId,
        jobSeekerId: jobSeeker.id,
        coverLetter
      });

      // Update real-time store for application tracking
      realtimeStore.lastApplicationId = Math.max(realtimeStore.lastApplicationId, application.id);

      // Get the employer who posted this job
      const employer = await storage.getEmployer(job.employerId);
      if (employer) {
        // Get the employer user
        const employerUser = await storage.getUserByEmployerId(employer.id);
        if (employerUser) {
          // Create a notification for the employer
          realtimeStore.notifications.push({
            id: realtimeStore.notificationId++,
            userId: employerUser.id,
            message: `${jobSeeker.firstName} ${jobSeeker.lastName} applied for your job: ${job.title}`,
            read: false,
            createdAt: new Date()
          });
        }
      }

      // Create a notification for admin users
      const adminUsers = await storage.getAdminUsers();
      for (const adminUser of adminUsers) {
        realtimeStore.notifications.push({
          id: realtimeStore.notificationId++,
          userId: adminUser.userId,
          message: `New resume received: ${jobSeeker.firstName} ${jobSeeker.lastName} applied for ${job.title}`,
          type: "resume_received",
          read: false,
          entityId: application.id,
          createdAt: new Date()
        });
      }

      res.status(201).json(application);
    } catch (error) {
      console.error("Error applying for job:", error);
      res.status(500).json({ message: "Failed to apply for job" });
    }
  });

  // Get all applications (for admin or based on user type)
  app.get("/api/applications", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to view applications" });
      }

      const user = req.user;

      if (user.userType === "jobseeker") {
        // Get jobseeker profile
        const jobSeeker = await storage.getJobSeekerByUserId(user.id);
        if (!jobSeeker) {
          return res.status(404).json({ message: "Job seeker profile not found" });
        }

        // Get all applications for this jobseeker
        const applications = await storage.getApplicationsByJobSeekerId(jobSeeker.id);

        // Get job details for each application
        const applicationsWithJobs = await Promise.all(
          applications.map(async (app) => {
            const job = await storage.getJob(app.jobId);
            return { ...app, job };
          })
        );

        res.json(applicationsWithJobs);
      } else if (user.userType === "employer" || user.userType === "admin") {
        let jobs = [];

        if (user.userType === "employer") {
          // Get employer profile
          const employer = await storage.getEmployerByUserId(user.id);
          if (!employer) {
            return res.status(404).json({ message: "Employer profile not found" });
          }

          // Get all jobs for this employer
          const allJobs = await storage.getJobs();
          jobs = allJobs.filter(job => job.employerId === employer.id);
        } else {
          // Admin gets access to all jobs
          jobs = await storage.getJobs();
        }

        // Get applications for all jobs
        let applications: any[] = [];
        for (const job of jobs) {
          const jobApplications = await storage.getApplicationsByJobId(job.id);

          // Add job data to each application
          const appsWithJobs = jobApplications.map(app => ({ ...app, job }));

          // Add job seeker data to each application
          for (let i = 0; i < appsWithJobs.length; i++) {
            const jobSeeker = await storage.getJobSeeker(appsWithJobs[i].jobSeekerId);
            // Create a new object with the jobSeeker property
            appsWithJobs[i] = {
              ...appsWithJobs[i],
              jobSeeker,
              appliedDate: appsWithJobs[i].appliedDate || new Date()
            };
          }

          applications = applications.concat(appsWithJobs);
        }

        res.json(applications);
      } else {
        res.status(403).json({ message: "Unauthorized user type" });
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  // Get a specific application by ID
  app.get("/api/applications/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to access application details" });
      }

      const applicationId = parseInt(req.params.id);
      if (isNaN(applicationId)) {
        return res.status(400).json({ message: "Invalid application ID" });
      }

      const user = req.user;
      const application = await storage.getApplication(applicationId);

      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      // Check authorization:
      // 1. Admin can view any application
      // 2. Job seeker can view their own application
      // 3. Employer can view applications for their jobs
      let authorized = false;

      if (user.userType === "admin") {
        authorized = true;
      } else if (user.userType === "jobseeker") {
        // Get the job seeker profile
        const jobSeeker = await storage.getJobSeekerByUserId(user.id);
        if (jobSeeker && jobSeeker.id === application.jobSeekerId) {
          authorized = true;
        }
      } else if (user.userType === "employer") {
        // Get the employer profile
        const employer = await storage.getEmployerByUserId(user.id);
        if (employer) {
          // Get the job to check if it belongs to this employer
          const job = await storage.getJob(application.jobId);
          if (job && job.employerId === employer.id) {
            authorized = true;
          }
        }
      }

      if (!authorized) {
        return res.status(403).json({ message: "You are not authorized to view this application" });
      }

      // Get job and job seeker details
      const job = await storage.getJob(application.jobId);
      const jobSeeker = await storage.getJobSeeker(application.jobSeekerId);

      // Return comprehensive application data
      res.json({
        ...application,
        job,
        jobSeeker,
        jobTitle: job?.title || 'Unknown',
        jobLocation: job?.location || 'Unknown',
        jobType: job?.jobType || 'Unknown',
        companyName: job?.company || 'Unknown'
      });
    } catch (error) {
      console.error("Error fetching application details:", error);
      res.status(500).json({ message: "Failed to fetch application details" });
    }
  });

  // Get applications by job ID - Used by employers to view applications for a specific job
  app.get("/api/applications/job/:jobId", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to view applications" });
      }

      const user = req.user;
      if (user.userType !== "employer" && user.userType !== "admin") {
        return res.status(403).json({ message: "Only employers or admins can access job applications" });
      }

      const jobId = parseInt(req.params.jobId);
      if (isNaN(jobId)) {
        return res.status(400).json({ message: "Invalid job ID" });
      }

      // Verify the job exists
      const job = await storage.getJob(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // For employers, verify they own the job
      if (user.userType === "employer") {
        const employer = await storage.getEmployerByUserId(user.id);
        if (!employer) {
          return res.status(404).json({ message: "Employer profile not found" });
        }

        if (job.employerId !== employer.id) {
          return res.status(403).json({ message: "You can only view applications for your own jobs" });
        }
      }
      // Admin users can view applications for any job

      // Get applications for this job
      const applications = await storage.getApplicationsByJobId(jobId);

      // Add job seeker data to each application
      const applicationsWithJobSeekers = await Promise.all(
        applications.map(async (app) => {
          const jobSeeker = await storage.getJobSeeker(app.jobSeekerId);
          return {
            ...app,
            jobSeeker,
            jobSeekerName: jobSeeker ? `${jobSeeker.firstName} ${jobSeeker.lastName}` : 'Unknown',
            appliedDate: app.appliedDate || new Date(),
          };
        })
      );

      res.json(applicationsWithJobSeekers);
    } catch (error) {
      console.error("Error fetching applications by job ID:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  // Get applications by job seeker ID - Used by job seekers to view their own applications
  app.get("/api/applications/jobseeker", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to view applications" });
      }

      const user = req.user;
      if (user.userType !== "jobseeker" && user.userType !== "admin") {
        return res.status(403).json({ message: "Only job seekers or admins can access this endpoint" });
      }

      // For job seekers, get their own applications
      // For admins, get all applications for all job seekers
      let applications = [];

      if (user.userType === "jobseeker") {
        // Get the job seeker profile
        const jobSeeker = await storage.getJobSeekerByUserId(user.id);
        if (!jobSeeker) {
          return res.status(404).json({ message: "Job seeker profile not found" });
        }

        // Get all applications for this jobseeker
        applications = await storage.getApplicationsByJobSeekerId(jobSeeker.id);
      } else if (user.userType === "admin") {
        // Get all applications across all job seekers
        const allJobSeekers = await storage.getJobSeekers();
        for (const seeker of allJobSeekers) {
          const seekerApplications = await storage.getApplicationsByJobSeekerId(seeker.id);
          applications = applications.concat(seekerApplications);
        }
      }

      // Get job details for each application
      const applicationsWithJobs = await Promise.all(
        applications.map(async (app) => {
          const job = await storage.getJob(app.jobId);
          return {
            ...app,
            job,
            jobTitle: job?.title || 'Unknown',
            jobLocation: job?.location || 'Unknown',
            jobType: job?.jobType || 'Unknown',
            companyName: job?.companyName || 'Unknown',
            appliedDate: app.appliedDate || new Date()
          };
        })
      );

      res.json(applicationsWithJobs);
    } catch (error) {
      console.error("Error fetching job seeker applications:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  // Get applications for the current job seeker (for the Applied Jobs page)
  app.get("/api/applications/my-applications", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to view your applications" });
      }

      const user = req.user;

      if (user.userType !== "jobseeker" && user.userType !== "admin") {
        return res.status(403).json({ message: "Only job seekers or admins can access this endpoint" });
      }

      // For job seekers, get their own applications
      // For admins, get all applications for all job seekers
      let applications = [];

      if (user.userType === "jobseeker") {
        // Get the job seeker profile
        const jobSeeker = await storage.getJobSeekerByUserId(user.id);
        if (!jobSeeker) {
          return res.status(404).json({ message: "Job seeker profile not found" });
        }

        // Get all applications for this jobseeker
        applications = await storage.getApplicationsByJobSeekerId(jobSeeker.id);
      } else if (user.userType === "admin") {
        // Get all applications across all job seekers
        const allJobSeekers = await storage.getJobSeekers();
        for (const seeker of allJobSeekers) {
          const seekerApplications = await storage.getApplicationsByJobSeekerId(seeker.id);
          applications = applications.concat(seekerApplications);
        }
      }

      // Get job details for each application
      const applicationsWithJobs = await Promise.all(
        applications.map(async (app) => {
          const job = await storage.getJob(app.jobId);
          return {
            ...app,
            job,
            appliedDate: app.appliedDate || new Date(), // Ensure appliedDate is always set
            notes: app.coverLetter || '' // Use coverLetter as notes
          };
        })
      );

      res.json(applicationsWithJobs);
    } catch (error) {
      console.error("Error fetching job seeker applications:", error);
      res.status(500).json({ message: "Failed to fetch your applications" });
    }
  });

  // Delete an application (job seeker can delete their own applications)
  app.delete("/api/applications/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to delete an application" });
      }

      const user = req.user;
      const applicationId = parseInt(req.params.id);

      if (isNaN(applicationId)) {
        return res.status(400).json({ message: "Invalid application ID" });
      }

      // Get the application
      const application = await storage.getApplication(applicationId);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      // Check if this application belongs to the current user (for job seekers)
      if (user.userType === "jobseeker") {
        const jobSeeker = await storage.getJobSeekerByUserId(user.id);
        if (!jobSeeker || application.jobSeekerId !== jobSeeker.id) {
          return res.status(403).json({ message: "You can only delete your own applications" });
        }
      } else if (user.userType === "employer") {
        const employer = await storage.getEmployerByUserId(user.id);
        const job = await storage.getJob(application.jobId);

        if (!employer || !job || job.employerId !== employer.id) {
          return res.status(403).json({ message: "You can only delete applications for your own jobs" });
        }
      } else if (user.userType === "admin") {
        // Admins can delete any application
      } else {
        return res.status(403).json({ message: "Unauthorized to delete applications" });
      }

      // Delete the application
      const result = await storage.deleteApplication(applicationId);

      if (result) {
        res.status(200).json({ message: "Application deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete application" });
      }
    } catch (error) {
      console.error("Error deleting application:", error);
      res.status(500).json({ message: "An error occurred while deleting the application" });
    }
  });

  // Download the original CV for a job application
  app.get("/api/applications/:id/download-cv", async (req, res) => {
    try {
      // Use the dedicated service to handle the CV download
      await handleCvDownload(req, res, storage);
    } catch (error) {
      console.error("Error downloading CV:", error);
      res.status(500).json({ message: "Failed to download CV" });
    }
  });

  // Update application status (employers and admins only)
  app.patch("/api/applications/:id/status", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to update application status" });
      }

      const user = req.user;
      if (user.userType !== "employer" && user.userType !== "admin") {
        return res.status(403).json({ message: "Only employers or admins can update application status" });
      }

      const applicationId = parseInt(req.params.id);
      if (isNaN(applicationId)) {
        return res.status(400).json({ message: "Invalid application ID" });
      }

      // Validate request body
      const { status } = req.body;
      if (!status || !["new", "viewed", "shortlisted", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status value. Must be one of: new, viewed, shortlisted, rejected" });
      }

      // Get the application
      const application = await storage.getApplication(applicationId);
      if (!application) {
        return res.status(404).json({ message: "Application not found" });
      }

      // For employers, verify they own the job this application is for
      if (user.userType === "employer") {
        const employer = await storage.getEmployerByUserId(user.id);
        if (!employer) {
          return res.status(404).json({ message: "Employer profile not found" });
        }

        const job = await storage.getJob(application.jobId);
        if (!job || job.employerId !== employer.id) {
          return res.status(403).json({ message: "You can only update status for applications to your own jobs" });
        }
      }
      // Admin users can update status for any application

      // Update the application status
      const updatedApplication = await storage.updateApplicationStatus(applicationId, status);

      if (updatedApplication) {
        // Get job and jobseeker details for the notification
        const job = await storage.getJob(application.jobId);
        const jobSeeker = await storage.getJobSeeker(application.jobSeekerId);

        if (job && jobSeeker) {
          // Get the job seeker user
          const jobSeekerUser = await storage.getUserById(jobSeeker.userId);

          if (jobSeekerUser) {
            // Create a notification for the job seeker
            const statusMessages = {
              viewed: "Your application has been viewed",
              shortlisted: "Congratulations! You have been shortlisted",
              interviewed: "You have been selected for an interview",
              rejected: "Your application was not selected at this time"
            };

            const statusMessage = statusMessages[status as keyof typeof statusMessages] ||
                                  `Your application status has been updated to: ${status}`;

            // Create a notification in the database instead of just in memory
            await storage.createNotification({
              userId: jobSeekerUser.id,
              message: `${statusMessage} for the ${job.title} position at ${job.company}`,
              type: "application_status",
              entityId: application.id
            });

            console.log(`Created application status notification for user ${jobSeekerUser.id}`);
          }
        }

        res.status(200).json(updatedApplication);
      } else {
        res.status(500).json({ message: "Failed to update application status" });
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      res.status(500).json({ message: "An error occurred while updating the application status" });
    }
  });

  // Get all testimonials
  app.get("/api/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  // Create a new testimonial
  app.post("/api/testimonials", async (req, res) => {
    try {
      // Validate required fields
      const validatedData = insertTestimonialSchema.parse(req.body);

      // If user is authenticated, associate testimonial with user
      let userId = null;
      if (req.isAuthenticated()) {
        userId = req.user.id;
      }

      // Create the testimonial
      const testimonial = await storage.createTestimonial({
        ...validatedData,
        userId: userId || validatedData.userId
      });

      res.status(201).json(testimonial);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }

      console.error("Error creating testimonial:", error);
      res.status(500).json({ message: "Failed to create testimonial" });
    }
  });

  // Get jobs posted by current employer
  app.get("/api/employer/jobs", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to view your posted jobs" });
      }

      const user = req.user;
      if (user.userType !== "employer" && user.userType !== "admin") {
        return res.status(403).json({ message: "Only employers or admins can access this endpoint" });
      }

      let jobs = [];

      if (user.userType === "employer") {
        // Get employer profile
        const employer = await storage.getEmployerByUserId(user.id);
        if (!employer) {
          return res.status(404).json({ message: "Employer profile not found" });
        }

        // Get jobs posted by this employer
        jobs = await storage.getJobsByEmployerId(employer.id);
      } else if (user.userType === "admin") {
        // Admin users get all jobs from all employers
        jobs = await storage.getJobs();
      }

      res.json(jobs);
    } catch (error) {
      console.error("Error fetching employer jobs:", error);
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  // Edit a job (requires employer or admin authentication)
  app.put("/api/jobs/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to edit jobs" });
      }

      const user = req.user;
      if (user.userType !== "employer" && user.userType !== "admin") {
        return res.status(403).json({ message: "Only employers or admins can edit jobs" });
      }

      const jobId = parseInt(req.params.id);
      if (isNaN(jobId)) {
        return res.status(400).json({ message: "Invalid job ID" });
      }

      // Validate the job exists
      const job = await storage.getJob(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // For employers, verify ownership of the job
      if (user.userType === "employer") {
        const employer = await storage.getEmployerByUserId(user.id);
        if (!employer) {
          return res.status(404).json({ message: "Employer profile not found" });
        }

        // Check if job belongs to this employer
        if (job.employerId !== employer.id) {
          return res.status(403).json({ message: "You can only edit your own job listings" });
        }
      }
      // Admin users can edit any job

      // Validate job data
      const validatedData = insertJobSchema.parse(req.body);

      let employerId = job.employerId;

      // If user is an employer, use their employer ID
      if (user.userType === "employer") {
        const employer = await storage.getEmployerByUserId(user.id);
        if (employer) {
          employerId = employer.id;
        }
      }

      // Update the job
      const updatedJob = await storage.updateJob({
        ...job,
        ...validatedData,
        id: jobId,
        employerId: employerId
      });

      res.json(updatedJob);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }

      console.error("Error updating job:", error);
      res.status(500).json({ message: "Failed to update job" });
    }
  });

  // Delete a job (requires employer or admin authentication)
  app.delete("/api/jobs/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to delete jobs" });
      }

      const user = req.user;
      if (user.userType !== "employer" && user.userType !== "admin") {
        return res.status(403).json({ message: "Only employers or admins can delete jobs" });
      }

      const jobId = parseInt(req.params.id);
      if (isNaN(jobId)) {
        return res.status(400).json({ message: "Invalid job ID" });
      }

      // Validate the job exists
      const job = await storage.getJob(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // For employers, verify ownership of the job
      if (user.userType === "employer") {
        const employer = await storage.getEmployerByUserId(user.id);
        if (!employer) {
          return res.status(404).json({ message: "Employer profile not found" });
        }

        // Check if job belongs to this employer
        if (job.employerId !== employer.id) {
          return res.status(403).json({ message: "You can only delete your own job listings" });
        }
      }
      // Admin users can delete any job

      // First, get all applications for this job
      const applications = await storage.getApplicationsByJobId(jobId);

      // Delete all applications associated with this job
      if (applications.length > 0) {
        try {
          for (const application of applications) {
            await storage.deleteApplication(application.id);
          }
        } catch (err) {
          console.error("Error deleting job applications:", err);
          return res.status(500).json({ message: "Failed to delete associated applications" });
        }
      }

      // Now delete the job
      const success = await storage.deleteJob(jobId);
      if (!success) {
        return res.status(500).json({ message: "Failed to delete job" });
      }

      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting job:", error);
      res.status(500).json({ message: "Failed to delete job" });
    }
  });

  // AJAX Real-time updates API endpoints

  // Get real-time job updates (new jobs since last check)
  app.get("/api/realtime/jobs", async (req, res) => {
    try {
      const { since } = req.query;
      const sinceId = parseInt(since as string) || 0;

      // Get all jobs newer than the provided job ID
      const jobs = await storage.getJobs();
      const newJobs = jobs.filter(job => job.id > sinceId);

      // Update lastJobId if we found newer jobs
      if (newJobs.length > 0) {
        const maxId = Math.max(...newJobs.map(job => job.id));
        realtimeStore.lastJobId = Math.max(realtimeStore.lastJobId, maxId);
      }

      res.json({
        jobs: newJobs,
        lastId: realtimeStore.lastJobId
      });
    } catch (error) {
      console.error("Error fetching real-time job updates:", error);
      res.status(500).json({ message: "Failed to fetch job updates" });
    }
  });

  // Get real-time application updates for employers
  app.get("/api/realtime/applications", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to get updates" });
      }

      const { since } = req.query;
      const sinceId = parseInt(since as string) || 0;

      const user = req.user;

      if (user.userType === "employer" || user.userType === "admin") {
        // Get employer profile for employers
        let employerJobs = [];

        if (user.userType === "employer") {
          const employer = await storage.getEmployerByUserId(user.id);
          if (!employer) {
            return res.status(404).json({ message: "Employer profile not found" });
          }

          // Get all jobs for this employer
          const jobs = await storage.getJobs();
          employerJobs = jobs.filter(job => job.employerId === employer.id);
        } else {
          // For admin users, get all jobs
          employerJobs = await storage.getJobs();
        }

        // Get new applications for all jobs
        let newApplications: any[] = [];
        for (const job of employerJobs) {
          const jobApplications = await storage.getApplicationsByJobId(job.id);
          const filteredApplications = jobApplications.filter(app => app.id > sinceId);

          newApplications = newApplications.concat(
            filteredApplications.map(app => ({ ...app, job }))
          );
        }

        // Update lastApplicationId if we found newer applications
        if (newApplications.length > 0) {
          const maxId = Math.max(...newApplications.map(app => app.id));
          realtimeStore.lastApplicationId = Math.max(realtimeStore.lastApplicationId, maxId);
        }

        res.json({
          applications: newApplications,
          lastId: realtimeStore.lastApplicationId
        });
      } else {
        res.status(403).json({ message: "Only employers or admins can access this endpoint" });
      }
    } catch (error) {
      console.error("Error fetching real-time application updates:", error);
      res.status(500).json({ message: "Failed to fetch application updates" });
    }
  });

  // Get notifications for a user
  app.get("/api/realtime/notifications", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to get notifications" });
      }

      const { since } = req.query;
      const sinceId = parseInt(since as string) || 0;

      const userId = req.user.id;
      const userType = req.user.userType;

      console.log(`Fetching notifications for user ID ${userId} (${userType}), since notification ID ${sinceId}`);

      // Get all notifications for this user
      const allNotifications = await storage.getNotifications(userId, 50);
      console.log(`Retrieved ${allNotifications.length} total notifications for user ID ${userId}`);

      if (allNotifications.length > 0) {
        console.log(`Sample notification:`, JSON.stringify(allNotifications[0]));
      }

      // Filter to just the new ones since last check
      const newNotifications = allNotifications.filter(notification => notification.id > sinceId);
      console.log(`Found ${newNotifications.length} new notifications since ID ${sinceId}`);

      // Get the highest ID from the notifications
      const lastId = newNotifications.length > 0
        ? Math.max(...newNotifications.map(n => n.id))
        : (allNotifications.length > 0 ? allNotifications[0]?.id : 0);

      // Count unread notifications
      const unreadCount = await storage.getUnreadNotificationCount(userId);
      console.log(`Unread notification count for user ID ${userId}: ${unreadCount}`);

      res.json({
        notifications: newNotifications,
        lastId: lastId,
        unreadCount: unreadCount
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  // Mark notifications as read
  app.post("/api/realtime/notifications/read", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to update notifications" });
      }

      const { ids } = req.body;
      const userId = req.user.id;

      if (!Array.isArray(ids)) {
        return res.status(400).json({ message: "Invalid notification IDs" });
      }

      // Mark each notification as read
      const updatePromises = ids.map(id => storage.markNotificationAsRead(id));
      await Promise.all(updatePromises);

      // Return updated unread count
      const unreadCount = await storage.getUnreadNotificationCount(userId);

      res.json({
        success: true,
        unreadCount
      });
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      res.status(500).json({ message: "Failed to update notifications" });
    }
  });

  // Mark all notifications as read for the current user
  app.post("/api/realtime/notifications/read-all", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to update notifications" });
      }

      const userId = req.user.id;

      // Mark all user's notifications as read
      const success = await storage.markAllNotificationsAsRead(userId);

      if (!success) {
        return res.status(500).json({ message: "Failed to mark all notifications as read" });
      }

      res.json({
        success: true,
        unreadCount: 0 // All notifications are read, so count is 0
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      res.status(500).json({ message: "Failed to update notifications" });
    }
  });

  // Admin endpoints
  
  // Get admin user data endpoint - specifically for admin dashboard
  app.get("/api/admin/user", async (req, res) => {
    try {
      // Check if the user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = req.user;
      
      // Check if user is an admin
      if (user.userType !== "admin") {
        return res.status(403).json({ 
          message: "Access denied. This endpoint is for administrators only." 
        });
      }
      
      // Get admin profile
      const admin = await storage.getAdminByUserId(user.id);
      
      if (!admin) {
        return res.status(404).json({ message: "Admin profile not found" });
      }
      
      // Return admin data without sensitive information
      res.json({
        id: user.id,
        email: user.email,
        userType: user.userType,
        profile: {
          id: admin.id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          role: admin.role,
          lastLogin: admin.lastLogin
        }
      });
    } catch (error) {
      console.error("Error fetching admin user data:", error);
      res.status(500).json({ message: "Failed to fetch admin user data" });
    }
  });

  // Verify invitation code
  app.post("/api/admin/verify-invitation", async (req, res) => {
    try {
      const { code, email } = req.body;

      if (!code || !email) {
        return res.status(400).json({ message: "Invitation code and email are required" });
      }

      const isValid = await storage.verifyInvitationCode(code, email);

      if (!isValid) {
        return res.status(400).json({ message: "Invalid or expired invitation code" });
      }

      res.json({ valid: true });
    } catch (error) {
      console.error("Error verifying invitation code:", error);
      res.status(500).json({ message: "Failed to verify invitation code" });
    }
  });

  // Create invitation code (requires admin authentication)
  app.post("/api/admin/invitation-codes", async (req, res) => {
    try {
      // Check if user is authenticated and is an admin
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = req.user;

      // Get admin profile
      const admin = await storage.getAdminByUserId(user.id);

      if (!admin) {
        return res.status(403).json({ message: "Only administrators can create invitation codes" });
      }

      // Validate invitation code data
      const validatedData = insertInvitationCodeSchema.parse(req.body);

      // Create invitation code (valid for 7 days by default)
      const expiresAt = req.body.expiresAt
        ? new Date(req.body.expiresAt)
        : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      const invitationCode = await storage.createInvitationCode({
        ...validatedData,
        expiresAt,
        createdBy: user.id
      });

      res.status(201).json(invitationCode);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }

      console.error("Error creating invitation code:", error);
      res.status(500).json({ message: "Failed to create invitation code" });
    }
  });

  // Admin direct signup without invitation code
  app.post("/api/admin/signup", async (req, res) => {
    console.log("Received admin signup request:", { ...req.body, password: '[REDACTED]' });
    
    try {
      console.log("Raw request body:", { ...req.body, password: '[REDACTED]' });
      
      // Force set userType to "admin" regardless of what was sent
      const requestWithUserType = {
        ...req.body,
        userType: "admin" // Always override this field
      };
      
      console.log("Modified request body:", { ...requestWithUserType, password: '[REDACTED]' });
      
      // Validate signup data using our dedicated adminSignupSchema
      console.log("Validating admin signup data with schema");
      const validatedData = adminSignupSchema.parse(requestWithUserType);
      console.log("Validation successful");
      
      // Check if the email is already registered
      console.log("Checking if email already exists:", validatedData.email);
      const existingUser = await storage.getUserByEmail(validatedData.email);
      if (existingUser) {
        console.log("Email already registered:", validatedData.email);
        return res.status(400).json({ message: "Email already registered" });
      }
      console.log("Email check passed, email is available");

      // Hash the password
      console.log("Hashing password");
      const hashedPassword = await hashPassword(validatedData.password);
      console.log("Password hashed successfully");
      
      // Create user with admin userType
      console.log("Creating user record");
      const user = await storage.createUser({
        email: validatedData.email,
        password: hashedPassword,
        userType: "admin" // Always ensure this is "admin"
      });
      console.log("User created successfully with ID:", user.id);

      // Create admin profile
      console.log("Creating admin profile");
      const admin = await storage.createAdmin({
        userId: user.id,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        role: validatedData.role,
        phoneNumber: validatedData.phoneNumber || null
      });
      console.log("Admin profile created successfully with ID:", admin.id);

      // Log in the user
      console.log("Logging in the newly created admin user");
      req.login(user, (err) => {
        if (err) {
          console.error("Error logging in after signup:", err);
          return res.status(500).json({ message: "Signup successful, but failed to log in" });
        }

        console.log("Admin user logged in successfully");
        // Return user and admin profile
        res.status(201).json({ user, admin });
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        console.error("Validation error in admin signup:", validationError);
        return res.status(400).json({ 
          message: validationError.message,
          validationErrors: validationError.errors 
        });
      }

      console.error("Error registering admin:", error);
      res.status(500).json({ message: "Failed to register admin account" });
    }
  });

  // Admin registration with invitation code
  app.post("/api/admin/register", async (req, res) => {
    try {
      // Validate registration data
      const validatedData = adminRegisterSchema.parse(req.body);

      // Verify invitation code
      const isValid = await storage.verifyInvitationCode(
        validatedData.invitationCode,
        validatedData.email
      );

      if (!isValid) {
        return res.status(400).json({ message: "Invalid or expired invitation code" });
      }

      // Hash the password
      const hashedPassword = await hashPassword(validatedData.password);
      
      // Create user with admin userType
      const user = await storage.createUser({
        email: validatedData.email,
        password: hashedPassword,
        userType: "admin"
      });

      // Create admin profile
      const admin = await storage.createAdmin({
        userId: user.id,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        role: validatedData.role,
        phoneNumber: validatedData.phoneNumber || null
      });

      // Mark invitation code as used
      await storage.markInvitationCodeAsUsed(validatedData.invitationCode);

      // Log in the user
      req.login(user, (err) => {
        if (err) {
          console.error("Error logging in after registration:", err);
          return res.status(500).json({ message: "Registration successful, but failed to log in" });
        }

        // Return user and admin profile
        res.status(201).json({ user, admin });
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }

      console.error("Error registering admin:", error);
      res.status(500).json({ message: "Failed to register admin account" });
    }
  });

  // Get admin profile endpoint has been updated

  // Get all invitation codes (admin only)
  app.get("/api/admin/invitation-codes", async (req, res) => {
    try {
      // Check if user is authenticated and is an admin
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = req.user;

      // Get admin profile
      const admin = await storage.getAdminByUserId(user.id);

      if (!admin) {
        return res.status(403).json({ message: "Only administrators can view invitation codes" });
      }

      const invitationCodes = await storage.getInvitationCodes();
      res.json(invitationCodes);
    } catch (error) {
      console.error("Error fetching invitation codes:", error);
      res.status(500).json({ message: "Failed to fetch invitation codes" });
    }
  });

  // Admin Password Reset Routes

  // Update admin recovery email
  app.post("/api/admin/recovery-email", async (req, res) => {
    try {
      // Ensure user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = req.user;

      // Check if user is an admin
      const admin = await storage.getAdminByUserId(user.id);
      if (!admin) {
        return res.status(403).json({ message: "Only administrators can update recovery email" });
      }

      const { recoveryEmail } = req.body;
      if (!recoveryEmail || !recoveryEmail.trim()) {
        return res.status(400).json({ message: "Recovery email is required" });
      }

      // Update recovery email
      const updatedAdmin = await storage.updateAdminRecoveryEmail(admin.id, recoveryEmail);

      res.status(200).json({
        message: "Recovery email updated successfully",
        recoveryEmail: updatedAdmin.recoveryEmail
      });
    } catch (error) {
      console.error("Error updating recovery email:", error);
      res.status(500).json({ message: "Failed to update recovery email" });
    }
  });

  // Request password reset (forgot password)
  app.post("/api/admin/forgot-password", async (req, res) => {
    try {
      console.log("Password reset request received");
      const { email } = req.body;

      if (!email) {
        console.log("Email is required but not provided");
        return res.status(400).json({ message: "Email is required" });
      }

      console.log(`Processing password reset for email: ${email}`);

      // Find the user by email
      const user = await storage.getUserByEmail(email);

      // Don't reveal if user exists or not for security reasons
      if (!user || user.userType !== "admin") {
        console.log(`User not found or not an admin: ${email}`);
        return res.status(200).json({
          message: "If an account with that email exists, a password reset link has been sent"
        });
      }

      // Get admin record
      const admin = await storage.getAdminByUserId(user.id);
      console.log(`Admin record found: ${!!admin}`);

      if (!admin) {
        console.log(`Admin record not found for user ID: ${user.id}`);
        return res.status(200).json({
          message: "If an account with that email exists, a password reset link has been sent"
        });
      }

      // In development mode, we don't need to check for recovery email
      // since we're using Ethereal test accounts
      if (process.env.NODE_ENV !== 'development') {
        // Check if recovery email is set
        console.log(`Recovery email: ${admin.recoveryEmail || 'Not set'}`);
        if (!admin.recoveryEmail) {
          console.log("Recovery email not set");
          return res.status(200).json({
            message: "If an account with that email exists, a password reset link has been sent"
          });
        }
      }

      // Generate reset token
      const resetToken = generateResetToken();
      const tokenExpires = new Date(Date.now() + 3600000); // 1 hour
      console.log(`Generated reset token: ${resetToken}, expires: ${tokenExpires}`);

      // Save reset token to database
      await storage.setPasswordResetToken(admin.id, resetToken, tokenExpires);
      console.log("Reset token saved to database");

      // Send password reset email
      const origin = `${req.protocol}://${req.get('host')}`;
      console.log(`Using origin for reset link: ${origin}`);

      const emailResult = await sendPasswordResetEmail(user, resetToken, origin);
      console.log(`Email sending result: ${JSON.stringify(emailResult)}`);

      if (emailResult.success) {
        // For development/testing, return the preview URL
        if (process.env.NODE_ENV === 'development' && emailResult.previewUrl) {
          console.log(`Preview URL available: ${emailResult.previewUrl}`);
          return res.status(200).json({
            message: "Password reset email sent successfully",
            previewUrl: emailResult.previewUrl
          });
        }

        return res.status(200).json({
          message: "If an account with that email exists, a password reset link has been sent"
        });
      } else {
        console.error("Failed to send password reset email");
        return res.status(500).json({ message: "Failed to send password reset email" });
      }
    } catch (error) {
      console.error("Error handling forgot password:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Reset password using token
  app.post("/api/admin/reset-password", async (req, res) => {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res.status(400).json({ message: "Token and password are required" });
      }

      // Find admin by reset token
      const admin = await storage.getAdminByResetToken(token);

      if (!admin) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      // Get the user
      const user = await storage.getUser(admin.userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Hash the new password
      const hashedPassword = await hashPassword(password);

      // Update password
      await storage.updateUserPassword(user.id, hashedPassword);

      // Clear the reset token
      await storage.clearPasswordResetToken(admin.id);

      res.status(200).json({ message: "Password reset successful" });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ message: "Failed to reset password" });
    }
  });

  // Verify reset token
  app.get("/api/admin/verify-reset-token/:token", async (req, res) => {
    try {
      const { token } = req.params;

      if (!token) {
        return res.status(400).json({ message: "Token is required" });
      }

      // Find admin by reset token
      const admin = await storage.getAdminByResetToken(token);

      if (!admin) {
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      res.status(200).json({ valid: true });
    } catch (error) {
      console.error("Error verifying reset token:", error);
      res.status(500).json({ message: "Failed to verify token" });
    }
  });

  // Get all users (admin only)
  app.get("/api/users", async (req, res) => {
    try {
      // Check if user is authenticated and is an admin
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = req.user;

      // Get admin profile
      const admin = await storage.getAdminByUserId(user.id);

      if (!admin) {
        return res.status(403).json({ message: "Only administrators can view user data" });
      }

      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch user data" });
    }
  });

  // Get all admins (admin only)
  app.get("/api/admin/all", async (req, res) => {
    try {
      // Check if user is authenticated and is an admin
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = req.user;

      // Get admin profile
      const admin = await storage.getAdminByUserId(user.id);

      if (!admin) {
        return res.status(403).json({ message: "Only administrators can view admin list" });
      }

      const admins = await storage.getAllAdmins();

      // Get user info for each admin
      const adminsWithUsers = await Promise.all(
        admins.map(async (adminItem) => {
          const user = await storage.getUser(adminItem.userId);
          return { ...adminItem, user };
        })
      );

      res.json(adminsWithUsers);
    } catch (error) {
      console.error("Error fetching admins:", error);
      res.status(500).json({ message: "Failed to fetch admin list" });
    }
  });

  // Vacancy form submission endpoint (public)
  app.post("/api/vacancy", async (req, res) => {
    try {
      // Validate the vacancy data
      const validatedData = insertVacancySchema.parse(req.body);

      // Set status to "pending" and submitted timestamp
      const vacancy = await storage.createVacancy({
        ...validatedData,
        status: "pending",
        submittedAt: new Date()
      });

      // Create notifications for all admin users about the new vacancy form
      const adminUsers = (await storage.getAllUsers()).filter(u => u.userType === "admin");

      // Create a notification for each admin
      if (adminUsers.length > 0) {
        const notificationPromises = adminUsers.map(admin => {
          return storage.createNotification({
            userId: admin.id,
            message: `New vacancy form submitted by ${validatedData.contactName} from ${validatedData.companyName}`,
            type: "vacancy_form",
            entityId: vacancy.id
          });
        });

        await Promise.all(notificationPromises);
        console.log(`Created ${adminUsers.length} notifications for new vacancy submission`);
      }

      res.status(201).json({
        success: true,
        message: "Vacancy form submitted successfully",
        vacancy
      });
    } catch (error) {
      console.error("Error submitting vacancy form:", error);

      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({
          success: false,
          message: "Validation error",
          errors: validationError.details
        });
      }

      res.status(500).json({
        success: false,
        message: "Failed to submit vacancy form"
      });
    }
  });

  // Get all vacancies (admin only)
  app.get("/api/admin/vacancies", async (req, res) => {
    try {
      // Check if user is authenticated and is an admin
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = req.user;

      // Check userType directly
      if (user.userType !== "admin") {
        return res.status(403).json({ message: "Only administrators can access vacancies" });
      }

      const vacancies = await storage.getVacancies();
      res.json(vacancies);
    } catch (error) {
      console.error("Error fetching vacancies:", error);
      res.status(500).json({ message: "Failed to fetch vacancies" });
    }
  });

  // Delete vacancy (admin only)
  app.delete("/api/admin/vacancies/:id", async (req, res) => {
    try {
      // Check if user is authenticated and is an admin
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = req.user;

      // Check userType directly
      if (user.userType !== "admin") {
        return res.status(403).json({ message: "Only administrators can delete vacancies" });
      }

      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid vacancy ID" });
      }

      // Check if vacancy exists
      const vacancy = await storage.getVacancy(id);
      if (!vacancy) {
        return res.status(404).json({ message: "Vacancy not found" });
      }

      const success = await storage.deleteVacancy(id);
      if (success) {
        res.json({ message: "Vacancy deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete vacancy" });
      }
    } catch (error) {
      console.error("Error deleting vacancy:", error);
      res.status(500).json({ message: "Error deleting vacancy" });
    }
  });

  // Update vacancy status (admin only)
  app.patch("/api/admin/vacancies/:id/status", async (req, res) => {
    try {
      // Check if user is authenticated and is an admin
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = req.user;
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      // Check userType directly
      if (user.userType !== "admin") {
        return res.status(403).json({ message: "Only administrators can update vacancy status" });
      }

      const vacancy = await storage.getVacancy(parseInt(id));

      if (!vacancy) {
        return res.status(404).json({ message: "Vacancy not found" });
      }

      const updatedVacancy = await storage.updateVacancyStatus(parseInt(id), status);
      res.json(updatedVacancy);
    } catch (error) {
      console.error("Error updating vacancy status:", error);
      res.status(500).json({ message: "Failed to update vacancy status" });
    }
  });

  // Assign vacancy to recruiter (admin only)
  app.patch("/api/admin/vacancies/:id/assign", async (req, res) => {
    try {
      // Check if user is authenticated and is an admin
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = req.user;
      const { id } = req.params;
      const { recruiterEmail, recruiterName } = req.body;

      // Validate required fields
      if (!recruiterEmail || !recruiterName) {
        return res.status(400).json({
          success: false,
          message: "Recruiter email and name are required"
        });
      }

      // Validate email format
      if (!recruiterEmail.includes('@')) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format"
        });
      }

      // Check userType directly
      if (user.userType !== "admin") {
        return res.status(403).json({
          success: false,
          message: "Only administrators can assign vacancies"
        });
      }

      const vacancy = await storage.getVacancy(parseInt(id));

      if (!vacancy) {
        return res.status(404).json({
          success: false,
          message: "Vacancy not found"
        });
      }

      // Assign the vacancy to the recruiter
      console.log(`Calling assignVacancyToRecruiter with id=${id}, email=${recruiterEmail}, name=${recruiterName}`);
      console.log(`Method exists: ${typeof storage.assignVacancyToRecruiter === 'function' ? "YES" : "NO"}`);

      let updatedVacancy;
      try {
        updatedVacancy = await storage.assignVacancyToRecruiter(
          parseInt(id),
          recruiterEmail,
          recruiterName
        );

        console.log("Assignment result:", updatedVacancy ? "success" : "failed");

        if (!updatedVacancy) {
          return res.status(500).json({
            success: false,
            message: "Failed to assign vacancy"
          });
        }
      } catch (assignError) {
        console.error("Assignment function error:", assignError);
        return res.status(500).json({
          success: false,
          message: "Error during vacancy assignment process"
        });
      }

      // Send notification email to the recruiter
      const origin = `${req.protocol}://${req.get('host')}`;
      const emailResult = await sendVacancyAssignmentEmail(
        recruiterEmail,
        recruiterName,
        updatedVacancy,
        origin
      );

      res.json({
        success: true,
        vacancy: updatedVacancy,
        emailStatus: emailResult
      });
    } catch (error) {
      console.error("Error assigning vacancy to recruiter:", error);
      res.status(500).json({
        success: false,
        message: "Failed to assign vacancy to recruiter"
      });
    }
  });

  // Staffing Inquiry routes
  // Get all staffing inquiries (admin only)
  app.get("/api/staffing-inquiries", async (req, res) => {
    try {
      console.log("Received request for staffing inquiries");

      const user = req.user as Express.User;
      if (!user || user.userType !== "admin") {
        console.log("User not authorized:", req.user ? req.user.userType : 'not authenticated');
        return res.status(403).json({ message: "Unauthorized" });
      }

      console.log("Fetching staffing inquiries from storage...");
      const inquiries = await storage.getStaffingInquiries();
      console.log("Retrieved inquiries:", inquiries ? inquiries.length : 0);

      // Always return an array, even if empty
      res.json(inquiries || []);
    } catch (error) {
      console.error("Error getting staffing inquiries:", error);
      res.status(500).json({
        message: "Failed to get staffing inquiries",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Get single staffing inquiry
  app.get("/api/staffing-inquiries/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const user = req.user as Express.User;

      if (!user || user.userType !== "admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      const inquiry = await storage.getStaffingInquiry(parseInt(id));

      if (!inquiry) {
        return res.status(404).json({ message: "Staffing inquiry not found" });
      }

      res.json(inquiry);
    } catch (error) {
      console.error("Error getting staffing inquiry:", error);
      res.status(500).json({ message: "Failed to get staffing inquiry" });
    }
  });

  // Test endpoint for debugging
  app.post("/api/test-inquiry", async (req, res) => {
    try {
      console.log("Test inquiry endpoint called with:", req.body);
      res.status(200).json({ message: "Test endpoint working", data: req.body });
    } catch (error) {
      console.error("Error in test endpoint:", error);
      res.status(500).json({ message: "Test endpoint error" });
    }
  });

  // Create staffing inquiry (public)
  app.post("/api/staffing-inquiries", async (req, res) => {
    try {
      console.log("Received staffing inquiry request:", req.body);

      // Skip validation for testing - just use direct SQL
      try {
        // Direct database insert using SQL - Using literal values instead of parameters
        const result = await db.execute(`
          INSERT INTO staffing_inquiries
            (name, email, phone, company, inquiry_type, message, marketing, status, submittedat)
          VALUES
            ('${req.body.name}',
             '${req.body.email}',
             ${req.body.phone ? `'${req.body.phone}'` : 'NULL'},
             ${req.body.company ? `'${req.body.company}'` : 'NULL'},
             '${req.body.inquiryType}',
             '${req.body.message}',
             ${req.body.marketing ? 'TRUE' : 'FALSE'},
             'new',
             NOW())
          RETURNING *
        `);

        console.log("Direct SQL insert result:", result);

        // Create notifications for all admin users
        const adminUsers = (await storage.getAllUsers()).filter(u => u.userType === "admin");

        if (adminUsers.length > 0) {
          // Get the inquiry ID from the result
          const inquiryId = result[0].id;

          const notificationPromises = adminUsers.map(admin => {
            // Customize notification message based on inquiry type
            let notificationMessage = "";

            if (req.body.inquiryType === "business") {
              notificationMessage = `New business inquiry from ${req.body.name} - Employer inquiry`;
            } else if (req.body.inquiryType === "general") {
              notificationMessage = `New general inquiry from ${req.body.name} - Job seeker inquiry`;
            } else {
              notificationMessage = `New ${req.body.inquiryType} inquiry from ${req.body.name}`;
            }

            return storage.createNotification({
              userId: admin.id,
              message: notificationMessage,
              type: "staffing_inquiry",
              entityId: inquiryId
            });
          });

          await Promise.all(notificationPromises);
          console.log(`Created ${adminUsers.length} notifications for new staffing inquiry`);
        }

        res.status(201).json({ success: true, message: "Inquiry submitted successfully" });
      } catch (dbError) {
        console.error("Database error:", dbError);
        throw dbError;
      }
    } catch (error) {
      console.error("Error creating staffing inquiry:", error);
      res.status(500).json({ message: "Failed to create staffing inquiry", error: String(error) });
    }
  });

  // Update staffing inquiry status (admin only)
  app.patch("/api/staffing-inquiries/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const user = req.user as Express.User;

      if (!user || user.userType !== "admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      if (!status || !["new", "contacted", "in_progress", "completed", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const inquiry = await storage.getStaffingInquiry(parseInt(id));

      if (!inquiry) {
        return res.status(404).json({ message: "Staffing inquiry not found" });
      }

      const updatedInquiry = await storage.updateStaffingInquiryStatus(parseInt(id), status);
      res.json(updatedInquiry);
    } catch (error) {
      console.error("Error updating staffing inquiry status:", error);
      res.status(500).json({ message: "Failed to update staffing inquiry status" });
    }
  });

  // Reply to a staffing inquiry (admin only)
  app.post("/api/staffing-inquiries/:id/reply", async (req, res) => {
    try {
      const { id } = req.params;
      const { subject, message } = req.body;
      const user = req.user as Express.User;

      // Authorization check
      if (!user || user.userType !== "admin") {
        return res.status(403).json({ message: "Unauthorized" });
      }

      // Input validation
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      // Get the inquiry details
      const inquiry = await storage.getStaffingInquiry(parseInt(id));

      if (!inquiry) {
        return res.status(404).json({ message: "Staffing inquiry not found" });
      }

      // Get the admin info
      const admin = await storage.getAdmin(user.id);
      const adminName = admin ? `${admin.firstName} ${admin.lastName}` : "Administrator";

      // Send the email reply
      const emailResult = await sendInquiryReply(
        inquiry.email,
        inquiry.name,
        subject || `Re: Your inquiry to Expert Recruitments`,
        message,
        adminName
      );

      if (!emailResult.success) {
        return res.status(500).json({ message: "Failed to send reply email" });
      }

      // Update the inquiry status to 'contacted' if it was 'new'
      if (inquiry.status === 'new' || !inquiry.status) {
        await storage.updateStaffingInquiryStatus(parseInt(id), 'contacted');
      }

      // Create a notification for the user if we can find them
      try {
        // Find the associated user by email
        console.log(`Looking for user with email: ${inquiry.email}`);
        const inquiryUser = await storage.getUserByEmail(inquiry.email);

        if (inquiryUser) {
          console.log(`Found user: ID=${inquiryUser.id}, Type=${inquiryUser.userType}, Email=${inquiryUser.email}`);

          // Double check that this is a valid user that can receive notifications
          if (!inquiryUser.id) {
            console.error("Invalid user object, missing ID:", inquiryUser);
            throw new Error("Invalid user object for notification creation");
          }

          // Create notification with complete required fields
          const notificationData = {
            userId: inquiryUser.id,
            message: `We've replied to your ${inquiry.inquiryType === "business" ? "business" : "general"} inquiry. Check your email.`,
            // Always include the type for proper routing
            type: "inquiry_reply",
            entityId: parseInt(id),
          };

          console.log("Creating notification with data:", JSON.stringify(notificationData));

          // Create the notification
          const notification = await storage.createNotification(notificationData);

          if (!notification || !notification.id) {
            throw new Error("Failed to create notification - invalid response from storage");
          }

          console.log(`Successfully created notification: ID=${notification.id} for user ${inquiryUser.id} (${inquiryUser.userType})`);

          // Also write to stdout to see in logs
          process.stdout.write(`[NOTIFICATION CREATED] userId=${inquiryUser.id}, userType=${inquiryUser.userType}, id=${notification.id}, type=${notificationData.type}\n`);
        } else {
          console.log(`User with email ${inquiry.email} not found for notification`);
        }
      } catch (err) {
        console.error("Could not create notification for inquiry reply:", err);
        console.error(err instanceof Error ? err.stack : String(err));
        // Continue with the operation even if notification creation fails
      }

      res.json({
        success: true,
        message: "Reply sent successfully",
        previewUrl: emailResult.previewUrl
      });
    } catch (error) {
      console.error("Error replying to inquiry:", error);
      res.status(500).json({ message: "Failed to send reply", error: String(error) });
    }
  });

  // Blog Post API Endpoints

  // Get all blog posts (public endpoint)
  app.get("/api/blog-posts", async (req, res) => {
    try {
      // Optional query parameters for filtering
      const { category, tag, authorId, published, limit } = req.query;

      // Get all blog posts with optional filters
      const posts = await storage.getBlogPosts({
        category: category ? String(category) : undefined,
        tag: tag ? String(tag) : undefined,
        authorId: authorId ? parseInt(String(authorId)) : undefined,
        published: published === 'true' ? true : published === 'false' ? false : undefined,
        limit: limit ? parseInt(String(limit)) : undefined
      });

      // If requesting only published posts and not logged in as admin, filter them
      if (!req.isAuthenticated() || req.user.userType !== "admin") {
        const publicPosts = posts.filter(post => post.published);
        return res.json(publicPosts);
      }

      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  // Get blog post by slug (for friendly URLs) - THIS MUST COME BEFORE THE :id ROUTE
  app.get("/api/blog-posts/slug/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      console.log(`Fetching blog post by slug: ${slug}`);
      const post = await storage.getBlogPostBySlug(slug);

      if (!post) {
        console.log(`Blog post with slug '${slug}' not found`);
        return res.status(404).json({ message: "Blog post not found" });
      }

      // If post is not published and user is not admin, don't allow access
      if (!post.published && (!req.isAuthenticated() || req.user.userType !== "admin")) {
        console.log(`Blog post with slug '${slug}' is not published and user is not admin`);
        return res.status(404).json({ message: "Blog post not found" });
      }

      console.log(`Successfully found blog post with slug '${slug}'`);
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post by slug:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Get blog post by ID
  app.get("/api/blog-posts/:id", async (req, res) => {
    try {
      const { id } = req.params;
      console.log(`Fetching blog post by ID: ${id}`);
      const post = await storage.getBlogPost(parseInt(id));

      if (!post) {
        console.log(`Blog post with ID ${id} not found`);
        return res.status(404).json({ message: "Blog post not found" });
      }

      // If post is not published and user is not admin, don't allow access
      if (!post.published && (!req.isAuthenticated() || req.user.userType !== "admin")) {
        console.log(`Blog post with ID ${id} is not published and user is not admin`);
        return res.status(404).json({ message: "Blog post not found" });
      }

      console.log(`Successfully found blog post with ID ${id}`);
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Create a new blog post (admin only)
  app.post("/api/blog-posts", async (req, res) => {
    try {
      // Check authentication
      if (!req.isAuthenticated()) {
        console.log("Unauthorized attempt to create blog post: Not authenticated");
        return res.status(403).json({ message: "Unauthorized: Please log in" });
      }
      
      if (req.user.userType !== "admin") {
        console.log(`Unauthorized attempt to create blog post by user type: ${req.user.userType}`);
        return res.status(403).json({ message: "Unauthorized: Admin access required" });
      }

      console.log("Processing blog post submission from:", req.user.email);
      console.log("Received blog post data:", req.body);

      // Process incoming data
      let processedData = { ...req.body };
      
      // Validate required fields
      if (!processedData.title || !processedData.content) {
        console.log("Missing required fields:", {
          hasTitle: !!processedData.title,
          hasContent: !!processedData.content
        });
        return res.status(400).json({ 
          message: "Missing required fields", 
          details: {
            title: !processedData.title ? "Title is required" : null,
            content: !processedData.content ? "Content is required" : null
          }
        });
      }

      // Generate slug if not provided
      if (!processedData.slug) {
        processedData.slug = processedData.title
          .toLowerCase()
          .replace(/[^\w\s-]/g, '') // Remove special chars
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
          .trim();
        
        console.log("Generated slug:", processedData.slug);
      }

      // Set default values for optional fields
      processedData.readTime = processedData.readTime || "5 min read";
      processedData.published = processedData.published === false ? false : true;
      processedData.publishDate = new Date();

      // If excerpt is not provided, create one from content
      if (!processedData.excerpt && processedData.content) {
        // Strip HTML tags and limit to 150 chars
        const plainText = processedData.content.replace(/<[^>]*>/g, '');
        processedData.excerpt = plainText.substring(0, 150) + (plainText.length > 150 ? '...' : '');
      }

      // Handle tags - ensure it's an array
      if (typeof processedData.tags === 'string') {
        processedData.tags = processedData.tags.split(',').map(tag => tag.trim());
      }

      // Now validate with Zod schema
      const postData = insertBlogPostSchema.parse(processedData);

      // Set author ID to current user
      postData.authorId = req.user.id;

      // Get admin info for author reference
      const admin = await storage.getAdminByUserId(req.user.id);
      if (!admin) {
        return res.status(404).json({ message: "Admin profile not found" });
      }

      // Add admin as author if not specified
      if (!postData.authorId) {
        postData.authorId = admin.id;
      }

      // Create the blog post
      const newPost = await storage.createBlogPost(postData);
      res.status(201).json(newPost);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }

      console.error("Error creating blog post:", error);
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  // Update an existing blog post (admin only)
  app.patch("/api/blog-posts/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.status(403).json({ message: "Unauthorized: Admin access required" });
    }

    try {
      const { id } = req.params;
      const post = await storage.getBlogPost(parseInt(id));

      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      // Update the blog post
      const updatedPost = await storage.updateBlogPost(parseInt(id), req.body);

      if (!updatedPost) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.json(updatedPost);
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        return res.status(400).json({ message: validationError.message });
      }

      console.error("Error updating blog post:", error);
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  // Delete a blog post (admin only)
  app.delete("/api/blog-posts/:id", async (req, res) => {
    if (!req.isAuthenticated() || req.user.userType !== "admin") {
      return res.status(403).json({ message: "Unauthorized: Admin access required" });
    }

    try {
      const { id } = req.params;
      const deleted = await storage.deleteBlogPost(parseInt(id));

      if (!deleted) {
        return res.status(404).json({ message: "Blog post not found" });
      }

      res.status(204).end();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
