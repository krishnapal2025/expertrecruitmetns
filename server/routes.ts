import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { 
  insertJobSchema, 
  insertApplicationSchema, 
  adminRegisterSchema, 
  insertInvitationCodeSchema,
  User,
  Admin
} from "@shared/schema";
import { hashPassword } from "./auth";
import { generateResetToken, sendPasswordResetEmail } from "./email-service";
import { seedJobs } from "./seed-jobs";

// In-memory store for real-time updates
const realtimeStore = {
  lastJobId: 0,
  lastApplicationId: 0,
  notifications: [] as { id: number; userId: number; message: string; read: boolean; createdAt: Date }[],
  notificationId: 1
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  
  // Seed jobs data
  await seedJobs();

  // API routes
  
  // Profile endpoints
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

  // Create a new job (requires employer authentication)
  app.post("/api/jobs", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to post a job" });
      }
      
      const user = req.user;
      if (user.userType !== "employer") {
        return res.status(403).json({ message: "Only employers can post jobs" });
      }
      
      // Validate job data - the schema will handle date conversion
      const validatedData = insertJobSchema.parse(req.body);
      
      // Get employer profile
      const employer = await storage.getEmployerByUserId(user.id);
      if (!employer) {
        return res.status(404).json({ message: "Employer profile not found" });
      }
      
      // Create the job
      const job = await storage.createJob({
        ...validatedData,
        employerId: employer.id
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
      } else if (user.userType === "employer") {
        // Get employer profile
        const employer = await storage.getEmployerByUserId(user.id);
        if (!employer) {
          return res.status(404).json({ message: "Employer profile not found" });
        }
        
        // Get all jobs for this employer
        const jobs = await storage.getJobs();
        const employerJobs = jobs.filter(job => job.employerId === employer.id);
        
        // Get applications for all jobs
        let applications: any[] = [];
        for (const job of employerJobs) {
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

  // Get applications for the current job seeker (for the Applied Jobs page)
  app.get("/api/applications/my-applications", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to view your applications" });
      }
      
      const user = req.user;
      
      if (user.userType !== "jobseeker") {
        return res.status(403).json({ message: "Only job seekers can access this endpoint" });
      }
      
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
  
  // Update application status (employers only)
  app.patch("/api/applications/:id/status", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to update application status" });
      }
      
      const user = req.user;
      if (user.userType !== "employer") {
        return res.status(403).json({ message: "Only employers can update application status" });
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
      
      // Verify employer owns the job this application is for
      const employer = await storage.getEmployerByUserId(user.id);
      if (!employer) {
        return res.status(404).json({ message: "Employer profile not found" });
      }
      
      const job = await storage.getJob(application.jobId);
      if (!job || job.employerId !== employer.id) {
        return res.status(403).json({ message: "You can only update status for applications to your own jobs" });
      }
      
      // Update the application status
      const updatedApplication = await storage.updateApplicationStatus(applicationId, status);
      
      if (updatedApplication) {
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
  
  // Get jobs posted by current employer
  app.get("/api/employer/jobs", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to view your posted jobs" });
      }
      
      const user = req.user;
      if (user.userType !== "employer") {
        return res.status(403).json({ message: "Only employers can access this endpoint" });
      }
      
      // Get employer profile
      const employer = await storage.getEmployerByUserId(user.id);
      if (!employer) {
        return res.status(404).json({ message: "Employer profile not found" });
      }
      
      // Get jobs posted by this employer
      const jobs = await storage.getJobsByEmployerId(employer.id);
      
      res.json(jobs);
    } catch (error) {
      console.error("Error fetching employer jobs:", error);
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });
  
  // Edit a job (requires employer authentication)
  app.put("/api/jobs/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to edit jobs" });
      }
      
      const user = req.user;
      if (user.userType !== "employer") {
        return res.status(403).json({ message: "Only employers can edit jobs" });
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
      
      // Get employer profile
      const employer = await storage.getEmployerByUserId(user.id);
      if (!employer) {
        return res.status(404).json({ message: "Employer profile not found" });
      }
      
      // Check if job belongs to this employer
      if (job.employerId !== employer.id) {
        return res.status(403).json({ message: "You can only edit your own job listings" });
      }
      
      // Validate job data
      const validatedData = insertJobSchema.parse(req.body);
      
      // Update the job
      const updatedJob = await storage.updateJob({
        ...job,
        ...validatedData,
        id: jobId,
        employerId: employer.id
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
  
  // Delete a job (requires employer authentication)
  app.delete("/api/jobs/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to delete jobs" });
      }
      
      const user = req.user;
      if (user.userType !== "employer") {
        return res.status(403).json({ message: "Only employers can delete jobs" });
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
      
      // Get employer profile
      const employer = await storage.getEmployerByUserId(user.id);
      if (!employer) {
        return res.status(404).json({ message: "Employer profile not found" });
      }
      
      // Check if job belongs to this employer
      if (job.employerId !== employer.id) {
        return res.status(403).json({ message: "You can only delete your own job listings" });
      }
      
      // Delete the job
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
      
      if (user.userType === "employer") {
        // Get employer profile
        const employer = await storage.getEmployerByUserId(user.id);
        if (!employer) {
          return res.status(404).json({ message: "Employer profile not found" });
        }
        
        // Get all jobs for this employer
        const jobs = await storage.getJobs();
        const employerJobs = jobs.filter(job => job.employerId === employer.id);
        
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
        res.status(403).json({ message: "Only employers can access this endpoint" });
      }
    } catch (error) {
      console.error("Error fetching real-time application updates:", error);
      res.status(500).json({ message: "Failed to fetch application updates" });
    }
  });
  
  // Get notifications for a user
  app.get("/api/realtime/notifications", (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to get notifications" });
      }
      
      const { since } = req.query;
      const sinceId = parseInt(since as string) || 0;
      
      const userId = req.user.id;
      
      // Get unread notifications for this user that are newer than the provided ID
      const userNotifications = realtimeStore.notifications.filter(
        notification => notification.userId === userId && notification.id > sinceId
      );
      
      res.json({
        notifications: userNotifications,
        lastId: userNotifications.length > 0
          ? Math.max(...userNotifications.map(n => n.id))
          : sinceId
      });
    } catch (error) {
      console.error("Error fetching notifications:", error);
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });
  
  // Mark notifications as read
  app.post("/api/realtime/notifications/read", (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "You must be logged in to update notifications" });
      }
      
      const { ids } = req.body;
      const userId = req.user.id;
      
      if (!Array.isArray(ids)) {
        return res.status(400).json({ message: "Invalid notification IDs" });
      }
      
      // Mark notifications as read
      ids.forEach(id => {
        const notification = realtimeStore.notifications.find(
          n => n.id === id && n.userId === userId
        );
        
        if (notification) {
          notification.read = true;
        }
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking notifications as read:", error);
      res.status(500).json({ message: "Failed to update notifications" });
    }
  });

  // Admin endpoints
  
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
      
      // Create user with admin userType
      const user = await storage.createUser({
        email: validatedData.email,
        password: validatedData.password,
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
  
  // Get the current admin's profile
  app.get("/api/admin/user", async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const user = req.user;
      
      if (user.userType !== "admin") {
        return res.status(403).json({ message: "Only administrators can access this resource" });
      }
      
      // Get admin profile
      const admin = await storage.getAdminByUserId(user.id);
      
      if (!admin) {
        return res.status(404).json({ message: "Admin profile not found" });
      }
      
      // Update last login time
      await storage.updateAdminLastLogin(admin.id);
      
      res.json(admin);
    } catch (error) {
      console.error("Error fetching admin profile:", error);
      res.status(500).json({ message: "Failed to fetch admin profile" });
    }
  });
  
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
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      // Find the user by email
      const user = await storage.getUserByEmail(email);
      
      // Don't reveal if user exists or not for security reasons
      if (!user || user.userType !== "admin") {
        return res.status(200).json({ 
          message: "If an account with that email exists, a password reset link has been sent" 
        });
      }
      
      // Get admin record
      const admin = await storage.getAdminByUserId(user.id);
      
      if (!admin) {
        return res.status(200).json({ 
          message: "If an account with that email exists, a password reset link has been sent" 
        });
      }
      
      // Check if recovery email is set
      if (!admin.recoveryEmail) {
        return res.status(200).json({ 
          message: "If an account with that email exists, a password reset link has been sent" 
        });
      }
      
      // Generate reset token
      const resetToken = generateResetToken();
      const tokenExpires = new Date(Date.now() + 3600000); // 1 hour
      
      // Save reset token to database
      await storage.setPasswordResetToken(admin.id, resetToken, tokenExpires);
      
      // Send password reset email
      const emailResult = await sendPasswordResetEmail(user, resetToken, admin.recoveryEmail);
      
      if (emailResult.success) {
        // For development/testing, return the preview URL
        if (process.env.NODE_ENV === 'development' && emailResult.previewUrl) {
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

  const httpServer = createServer(app);
  return httpServer;
}
