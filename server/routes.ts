import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { insertJobSchema, insertApplicationSchema, User } from "@shared/schema";
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
          applications = applications.concat(
            jobApplications.map(app => ({ ...app, job }))
          );
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

  const httpServer = createServer(app);
  return httpServer;
}
