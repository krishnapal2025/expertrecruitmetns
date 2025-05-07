import {
  users, User, InsertUser,
  jobSeekers, JobSeeker, InsertJobSeeker,
  employers, Employer, InsertEmployer,
  jobs, Job, InsertJob,
  applications, Application, InsertApplication,
  testimonials, Testimonial, InsertTestimonial,
  admins, Admin, InsertAdmin,
  invitationCodes, InvitationCode, InsertInvitationCode,
  vacancies, Vacancy, InsertVacancy,
  staffingInquiries, StaffingInquiry, InsertStaffingInquiry,
  blogPosts, BlogPost, InsertBlogPost,
  notifications, Notification, InsertNotification
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { db, type DatabaseInstance } from "./db";
import { eq, like, gte, lte, or, and, sql, desc } from "drizzle-orm";
import pkg from 'pg';
const { Pool } = pkg;
import type { Pool as PgPool } from 'pg';

const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

// For session store - get connection configuration from environment
let pgPool: PgPool | undefined;
try {
  // Only import pool if we're using a database
  if (process.env.DATABASE_URL) {
    pgPool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
} catch (error) {
  console.error("Error setting up database pool for session store:", error);
  // Will fallback to memory store if this fails
}

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  getUserByEmployerId(employerId: number): Promise<User | undefined>;
  getUserByJobSeekerId(jobSeekerId: number): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  updateUserPassword(userId: number, password: string): Promise<User | undefined>;

  // JobSeeker methods
  getJobSeeker(id: number): Promise<JobSeeker | undefined>;
  getJobSeekerByUserId(userId: number): Promise<JobSeeker | undefined>;
  createJobSeeker(jobSeeker: InsertJobSeeker): Promise<JobSeeker>;
  updateJobSeeker(jobSeeker: JobSeeker): Promise<JobSeeker>;

  // Employer methods
  getEmployer(id: number): Promise<Employer | undefined>;
  getEmployerByUserId(userId: number): Promise<Employer | undefined>;
  createEmployer(employer: InsertEmployer): Promise<Employer>;
  updateEmployer(employer: Employer): Promise<Employer>;

  // Job methods
  getJob(id: number): Promise<Job | undefined>;
  getJobs(filters?: {
    category?: string;
    location?: string;
    jobType?: string;
    specialization?: string;
    experience?: string;
    minSalary?: number;
    maxSalary?: number;
    keyword?: string;
  }): Promise<Job[]>;
  getJobsByEmployerId(employerId: number): Promise<Job[]>;
  createJob(job: InsertJob): Promise<Job>;
  updateJob(job: Job): Promise<Job>;
  deleteJob(id: number): Promise<boolean>;

  // Application methods
  getApplication(id: number): Promise<Application | undefined>;
  getApplicationsByJobId(jobId: number): Promise<Application[]>;
  getApplicationsByJobSeekerId(jobSeekerId: number): Promise<Application[]>;
  createApplication(application: InsertApplication): Promise<Application>;
  deleteApplication(id: number): Promise<boolean>;
  updateApplicationStatus(id: number, status: string): Promise<Application | undefined>;

  // Testimonial methods
  getTestimonial(id: number): Promise<Testimonial | undefined>;
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;

  // Admin methods
  getAdmin(id: number): Promise<Admin | undefined>;
  getAdminByUserId(userId: number): Promise<Admin | undefined>;
  getAdminUsers(): Promise<Admin[]>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  updateAdminLastLogin(id: number): Promise<Admin>;
  updateAdminRecoveryEmail(id: number, recoveryEmail: string): Promise<Admin>;
  setPasswordResetToken(adminId: number, token: string, expiryDate: Date): Promise<Admin>;
  getAdminByResetToken(token: string): Promise<Admin | undefined>;
  clearPasswordResetToken(adminId: number): Promise<Admin>;
  getAllAdmins(): Promise<Admin[]>;

  // Invitation code methods
  getInvitationCode(code: string): Promise<InvitationCode | undefined>;
  getInvitationCodes(): Promise<InvitationCode[]>;
  createInvitationCode(invitationCode: InsertInvitationCode): Promise<InvitationCode>;
  verifyInvitationCode(code: string, email: string): Promise<boolean>;
  markInvitationCodeAsUsed(code: string): Promise<InvitationCode | undefined>;

  // Vacancy methods
  getVacancy(id: number): Promise<Vacancy | undefined>;
  getVacancies(): Promise<Vacancy[]>;
  createVacancy(vacancy: InsertVacancy): Promise<Vacancy>;
  updateVacancyStatus(id: number, status: string): Promise<Vacancy | undefined>;
  assignVacancyToRecruiter(id: number, recruiterEmail: string, recruiterName: string): Promise<Vacancy | undefined>;
  deleteVacancy(id: number): Promise<boolean>;
  
  // Staffing Inquiry methods
  getStaffingInquiry(id: number): Promise<StaffingInquiry | undefined>;
  getStaffingInquiries(): Promise<StaffingInquiry[]>;
  createStaffingInquiry(inquiry: InsertStaffingInquiry): Promise<StaffingInquiry>;
  updateStaffingInquiryStatus(id: number, status: string): Promise<StaffingInquiry | undefined>;
  
  // Blog post methods
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  getBlogPosts(filters?: { category?: string; published?: boolean }): Promise<BlogPost[]>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;

  // Notification methods
  getNotifications(userId?: number, limit?: number): Promise<Notification[]>;
  getNotification(id: number): Promise<Notification | undefined>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: number): Promise<Notification | undefined>;
  markAllNotificationsAsRead(userId: number): Promise<boolean>;
  getUnreadNotificationCount(userId: number): Promise<number>;
  
  // Session store
  sessionStore: session.Store;
}

// Database storage using PostgreSQL
export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    if (pgPool) {
      try {
        this.sessionStore = new PostgresSessionStore({
          pool: pgPool,
          createTableIfMissing: true,
          tableName: 'sessions'
        });
        console.log("Using PostgreSQL session store");
      } catch (error) {
        console.error("Failed to initialize PostgreSQL session store, falling back to memory store:", error);
        this.sessionStore = new MemoryStore({
          checkPeriod: 86400000 // prune expired entries every 24h
        });
      }
    } else {
      console.log("No database pool available, using memory session store");
      this.sessionStore = new MemoryStore({
        checkPeriod: 86400000 // prune expired entries every 24h
      });
    }
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUserByEmployerId(employerId: number): Promise<User | undefined> {
    const [employer] = await db.select().from(employers).where(eq(employers.id, employerId));
    if (!employer) return undefined;

    return this.getUser(employer.userId);
  }

  async getUserByJobSeekerId(jobSeekerId: number): Promise<User | undefined> {
    const [jobSeeker] = await db.select().from(jobSeekers).where(eq(jobSeekers.id, jobSeekerId));
    if (!jobSeeker) return undefined;

    return this.getUser(jobSeeker.userId);
  }
  
  // Alias for getUser - used by CV endpoint
  async getUserById(id: number): Promise<User | undefined> {
    return this.getUser(id);
  }

  // JobSeeker methods
  async getJobSeeker(id: number): Promise<JobSeeker | undefined> {
    const [jobSeeker] = await db.select().from(jobSeekers).where(eq(jobSeekers.id, id));
    return jobSeeker;
  }

  async getJobSeekerByUserId(userId: number): Promise<JobSeeker | undefined> {
    const [jobSeeker] = await db.select().from(jobSeekers).where(eq(jobSeekers.userId, userId));
    return jobSeeker;
  }

  async createJobSeeker(insertJobSeeker: InsertJobSeeker): Promise<JobSeeker> {
    const [jobSeeker] = await db.insert(jobSeekers).values(insertJobSeeker).returning();
    return jobSeeker;
  }

  async updateJobSeeker(updatedJobSeeker: JobSeeker): Promise<JobSeeker> {
    const [jobSeeker] = await db
      .update(jobSeekers)
      .set(updatedJobSeeker)
      .where(eq(jobSeekers.id, updatedJobSeeker.id))
      .returning();
    return jobSeeker;
  }

  // Employer methods
  async getEmployer(id: number): Promise<Employer | undefined> {
    const [employer] = await db.select().from(employers).where(eq(employers.id, id));
    return employer;
  }

  async getEmployerByUserId(userId: number): Promise<Employer | undefined> {
    const [employer] = await db.select().from(employers).where(eq(employers.userId, userId));
    return employer;
  }
  
  async getEmployerByCompanyName(companyName: string): Promise<Employer | undefined> {
    const [employer] = await db.select().from(employers).where(eq(employers.companyName, companyName));
    return employer;
  }

  async createEmployer(insertEmployer: InsertEmployer): Promise<Employer> {
    const [employer] = await db.insert(employers).values(insertEmployer).returning();
    return employer;
  }

  async updateEmployer(updatedEmployer: Employer): Promise<Employer> {
    const [employer] = await db
      .update(employers)
      .set(updatedEmployer)
      .where(eq(employers.id, updatedEmployer.id))
      .returning();
    return employer;
  }

  // Job methods
  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job;
  }

  async getJobs(filters?: {
    category?: string;
    location?: string;
    jobType?: string;
    specialization?: string;
    experience?: string;
    minSalary?: number;
    maxSalary?: number;
    keyword?: string;
  }): Promise<Job[]> {
    let query = db.select().from(jobs).where(eq(jobs.isActive, true));

    if (filters) {
      if (filters.category && filters.category !== "All Categories") {
        query = query.where(eq(jobs.category, filters.category));
      }

      if (filters.location && filters.location !== "All Locations") {
        query = query.where(like(jobs.location, `%${filters.location}%`));
      }

      if (filters.jobType && filters.jobType !== "All Types") {
        query = query.where(eq(jobs.jobType, filters.jobType));
      }

      if (filters.specialization && filters.specialization !== "All Specializations") {
        query = query.where(like(jobs.description, `%${filters.specialization}%`));
      }

      if (filters.experience) {
        query = query.where(eq(jobs.experience, filters.experience));
      }

      if (filters.minSalary !== undefined) {
        query = query.where(gte(jobs.minSalary, filters.minSalary));
      }

      if (filters.maxSalary !== undefined) {
        query = query.where(lte(jobs.maxSalary, filters.maxSalary));
      }

      if (filters.keyword) {
        const keyword = `%${filters.keyword}%`;
        query = query.where(
          or(
            like(jobs.title, keyword),
            like(jobs.description, keyword)
          )
        );
      }
    }

    return await query;
  }

  async getJobsByEmployerId(employerId: number): Promise<Job[]> {
    return await db.select().from(jobs).where(eq(jobs.employerId, employerId));
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    try {
      console.log("Creating job with data:", JSON.stringify(insertJob, null, 2));
      
      // Use strict typing for job data to match the database schema exactly
      // This avoids any type mismatches or missing fields
      const jobData = {
        // Required string fields
        title: String(insertJob.title || "Untitled Position"),
        company: String(insertJob.company || "Unknown Company"),
        description: String(insertJob.description || "No description provided"),
        requirements: String(insertJob.requirements || "Please contact for details"),
        benefits: String(insertJob.benefits || "Please contact for details"),
        category: String(insertJob.category || "General"),
        location: String(insertJob.location || "Unspecified"),
        jobType: String(insertJob.jobType || "Full-time"),
        experience: String(insertJob.experience || "Not specified"),
        contactEmail: String(insertJob.contactEmail || "contact@expertrecruitments.com"),
        
        // Integer fields
        minSalary: isNaN(Number(insertJob.minSalary)) ? 0 : Number(insertJob.minSalary),
        maxSalary: isNaN(Number(insertJob.maxSalary)) ? 0 : Number(insertJob.maxSalary),
        
        // Date handling
        applicationDeadline: insertJob.applicationDeadline instanceof Date 
          ? insertJob.applicationDeadline 
          : new Date(),
                    
        // Boolean fields with defaults
        isActive: true,
        
        // Optional fields
        specialization: insertJob.specialization || null,
        salary: insertJob.salary || null,
        
        // Default system fields
        postedDate: new Date(),
        applicationCount: 0
      };
      
      // Handle the employerId field separately to prevent null constraint errors
      // Only include employerId in the insert if it's a valid number
      if (insertJob.employerId != null && !isNaN(Number(insertJob.employerId))) {
        // We know this is valid, so add it to the jobData object
        (jobData as any).employerId = Number(insertJob.employerId);
      }
      
      console.log("Inserting job with strictly typed data:", JSON.stringify(jobData, null, 2));
      
      // Insert the job with properly formatted data
      const [job] = await db.insert(jobs).values(jobData as any).returning();
      console.log("Job created successfully, ID:", job.id);
      return job;
    } catch (error) {
      console.error("Error in createJob:", error);
      console.error("Error details:", error instanceof Error ? error.message : String(error));
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
      
      // Rethrow with more informative message
      if (error instanceof Error) {
        const enhancedError = new Error(`Failed to create job: ${error.message}`);
        enhancedError.stack = error.stack;
        throw enhancedError;
      }
      throw error;
    }
  }

  async updateJob(updatedJob: Job): Promise<Job> {
    const [job] = await db
      .update(jobs)
      .set({ ...updatedJob, updatedAt: new Date() })
      .where(eq(jobs.id, updatedJob.id))
      .returning();
    return job;
  }

  async deleteJob(id: number): Promise<boolean> {
    // If pgPool is available, use a transaction
    if (pgPool) {
      const client = await pgPool.connect();
      try {
        await client.query('BEGIN');
        
        // First delete all applications for this job
        await client.query('DELETE FROM applications WHERE job_id = $1', [id]);
        
        // Then delete the job
        const result = await client.query('DELETE FROM jobs WHERE id = $1', [id]);
        
        if (result.rowCount === 0) {
          await client.query('ROLLBACK');
          return false;
        }
        
        await client.query('COMMIT');
        return true;
      } catch (error) {
        await client.query('ROLLBACK');
        console.error("Error in deleteJob transaction:", error);
        throw error;
      } finally {
        client.release();
      }
    } else {
      // Fallback to direct delete if no transaction support
      try {
        // First delete all applications via Drizzle ORM
        await db.delete(applications).where(eq(applications.jobId, id));
        
        // Then delete the job
        const result = await db.delete(jobs).where(eq(jobs.id, id));
        return result.rowCount > 0;
      } catch (error) {
        console.error("Error in deleteJob without transaction:", error);
        throw error;
      }
    }
  }

  // Application methods
  async getApplication(id: number): Promise<Application | undefined> {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application;
  }

  async getApplicationsByJobId(jobId: number): Promise<Application[]> {
    return await db.select().from(applications).where(eq(applications.jobId, jobId));
  }

  async getApplicationsByJobSeekerId(jobSeekerId: number): Promise<Application[]> {
    return await db.select().from(applications).where(eq(applications.jobSeekerId, jobSeekerId));
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    // If pgPool is available, use a transaction
    if (pgPool) {
      const client = await pgPool.connect();
      try {
        await client.query('BEGIN');

        // Insert application
        const [application] = await db.insert(applications).values(insertApplication).returning();

        // Update job application count
        await db
          .update(jobs)
          .set({
            applicationCount: sql`${jobs.applicationCount} + 1`
          })
          .where(eq(jobs.id, insertApplication.jobId));

        await client.query('COMMIT');

        return application;
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } else {
      // If no transaction support, just do the operations sequentially
      const [application] = await db.insert(applications).values(insertApplication).returning();

      await db
        .update(jobs)
        .set({
          applicationCount: sql`${jobs.applicationCount} + 1`
        })
        .where(eq(jobs.id, insertApplication.jobId));

      return application;
    }
  }

  async deleteApplication(id: number): Promise<boolean> {
    // If pgPool is available, use a transaction
    if (pgPool) {
      const client = await pgPool.connect();
      try {
        await client.query('BEGIN');

        // Get the application
        const [application] = await db.select().from(applications).where(eq(applications.id, id));

        if (!application) {
          await client.query('ROLLBACK');
          return false;
        }

        // Delete application
        const result = await db.delete(applications).where(eq(applications.id, id));

        if (result.rowCount === 0) {
          await client.query('ROLLBACK');
          return false;
        }

        // Update job application count
        await db
          .update(jobs)
          .set({
            applicationCount: sql`${jobs.applicationCount} - 1`
          })
          .where(eq(jobs.id, application.jobId));

        await client.query('COMMIT');
        return true;
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      } finally {
        client.release();
      }
    } else {
      // If no transaction support, just do the operations sequentially
      // Get the application
      const [application] = await db.select().from(applications).where(eq(applications.id, id));

      if (!application) {
        return false;
      }

      // Delete application
      const result = await db.delete(applications).where(eq(applications.id, id));

      if (result.rowCount === 0) {
        return false;
      }

      // Update job application count
      await db
        .update(jobs)
        .set({
          applicationCount: sql`${jobs.applicationCount} - 1`
        })
        .where(eq(jobs.id, application.jobId));

      return true;
    }
  }

  async updateApplicationStatus(id: number, status: string): Promise<Application | undefined> {
    // Validate status
    if (!["new", "viewed", "shortlisted", "rejected"].includes(status)) {
      throw new Error("Invalid status value");
    }

    // Update the application status
    const [updatedApplication] = await db
      .update(applications)
      .set({ status })
      .where(eq(applications.id, id))
      .returning();

    return updatedApplication;
  }

  // Testimonial methods
  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, id));
    return testimonial;
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db.insert(testimonials).values(insertTestimonial).returning();
    return testimonial;
  }

  // Admin methods
  async getAdmin(id: number): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.id, id));
    return admin;
  }

  async getAdminByUserId(userId: number): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.userId, userId));
    return admin;
  }
  
  // Get all admin users
  async getAdminUsers(): Promise<Admin[]> {
    return await db.select().from(admins);
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const [admin] = await db.insert(admins).values(insertAdmin).returning();
    return admin;
  }

  async updateAdminLastLogin(id: number): Promise<Admin> {
    const [admin] = await db
      .update(admins)
      .set({ lastLogin: new Date() })
      .where(eq(admins.id, id))
      .returning();
    return admin;
  }

  async updateUserPassword(userId: number, password: string): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ password })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async updateAdminRecoveryEmail(id: number, recoveryEmail: string): Promise<Admin> {
    const [admin] = await db
      .update(admins)
      .set({ recoveryEmail })
      .where(eq(admins.id, id))
      .returning();
    return admin;
  }

  async setPasswordResetToken(adminId: number, token: string, expiryDate: Date): Promise<Admin> {
    const [admin] = await db
      .update(admins)
      .set({
        resetToken: token,
        resetTokenExpires: expiryDate
      })
      .where(eq(admins.id, adminId))
      .returning();
    return admin;
  }

  async getAdminByResetToken(token: string): Promise<Admin | undefined> {
    const [admin] = await db
      .select()
      .from(admins)
      .where(eq(admins.resetToken, token))
      .where(gt(admins.resetTokenExpires as any, new Date()));
    return admin;
  }

  async clearPasswordResetToken(adminId: number): Promise<Admin> {
    const [admin] = await db
      .update(admins)
      .set({
        resetToken: null,
        resetTokenExpires: null
      })
      .where(eq(admins.id, adminId))
      .returning();
    return admin;
  }

  async getAllAdmins(): Promise<Admin[]> {
    return await db.select().from(admins);
  }

  // Invitation code methods
  async getInvitationCode(code: string): Promise<InvitationCode | undefined> {
    const [invitationCode] = await db.select().from(invitationCodes).where(eq(invitationCodes.code, code));
    return invitationCode;
  }

  async getInvitationCodes(): Promise<InvitationCode[]> {
    return await db.select().from(invitationCodes);
  }

  async createInvitationCode(insertInvitationCode: InsertInvitationCode): Promise<InvitationCode> {
    const [invitationCode] = await db.insert(invitationCodes).values(insertInvitationCode).returning();
    return invitationCode;
  }

  async verifyInvitationCode(code: string, email: string): Promise<boolean> {
    const invitationCode = await this.getInvitationCode(code);

    if (!invitationCode) {
      return false;
    }

    // Check if the code is for the specific email
    if (invitationCode.email !== email) {
      return false;
    }

    // Check if the code is already used
    if (invitationCode.isUsed) {
      return false;
    }

    // Check if the code has expired
    if (new Date() > invitationCode.expiresAt) {
      return false;
    }

    return true;
  }

  async markInvitationCodeAsUsed(code: string): Promise<InvitationCode | undefined> {
    const [invitationCode] = await db
      .update(invitationCodes)
      .set({ isUsed: true })
      .where(eq(invitationCodes.code, code))
      .returning();

    return invitationCode;
  }

  // Vacancy methods
  async getVacancy(id: number): Promise<Vacancy | undefined> {
    const [vacancy] = await db.select().from(vacancies).where(eq(vacancies.id, id));
    return vacancy;
  }

  async getVacancies(): Promise<Vacancy[]> {
    return await db.select().from(vacancies).orderBy(vacancies.submittedAt);
  }

  async createVacancy(insertVacancy: InsertVacancy): Promise<Vacancy> {
    const [vacancy] = await db.insert(vacancies).values(insertVacancy).returning();
    return vacancy;
  }

  async updateVacancyStatus(id: number, status: string): Promise<Vacancy | undefined> {
    const [vacancy] = await db
      .update(vacancies)
      .set({ status })
      .where(eq(vacancies.id, id))
      .returning();
    return vacancy;
  }
  
  async assignVacancyToRecruiter(
    id: number, 
    recruiterEmail: string, 
    recruiterName: string
  ): Promise<Vacancy | undefined> {
    // Get the current status of the vacancy
    const [vacancy] = await db.select().from(vacancies).where(eq(vacancies.id, id));
    if (!vacancy) {
      console.error(`Vacancy with ID ${id} not found`);
      return undefined;
    }
    
    const now = new Date();
    
    // Update status to 'assigned' if it's 'new' or 'pending'
    const newStatus = vacancy.status === 'new' || vacancy.status === 'pending' ? 'assigned' : vacancy.status;
    
    console.log(`Assigning vacancy ID ${id} to ${recruiterName} (${recruiterEmail}), changing status from ${vacancy.status} to ${newStatus}`);
    
    try {
      const [updatedVacancy] = await db
        .update(vacancies)
        .set({ 
          assignedTo: recruiterEmail,
          assignedName: recruiterName,
          assignedAt: now,
          status: newStatus
        })
        .where(eq(vacancies.id, id))
        .returning();
      
      console.log(`Successfully updated vacancy ID ${id} in database`);
      return updatedVacancy;
    } catch (error) {
      console.error(`Error assigning vacancy to recruiter:`, error);
      return undefined;
    }
  }
  
  async deleteVacancy(id: number): Promise<boolean> {
    try {
      console.log(`Attempting to delete vacancy with ID ${id}`);
      const result = await db.delete(vacancies).where(eq(vacancies.id, id));
      const success = result.rowCount > 0;
      
      if (success) {
        console.log(`Successfully deleted vacancy ID ${id}`);
      } else {
        console.log(`No vacancy found with ID ${id} to delete`);
      }
      
      return success;
    } catch (error) {
      console.error(`Error deleting vacancy:`, error);
      return false;
    }
  }

  // Staffing Inquiry methods
  async getStaffingInquiry(id: number): Promise<StaffingInquiry | undefined> {
    // Use direct SQL to avoid column name issues
    const result = await db.execute(`
      SELECT 
        id, 
        name, 
        email, 
        phone, 
        company, 
        inquirytype as "inquiryType", 
        message, 
        marketing, 
        status, 
        submittedat as "submittedAt"
      FROM staffing_inquiries 
      WHERE id = ${id}
      LIMIT 1
    `);
    
    console.log("Single inquiry result:", JSON.stringify(result, null, 2));
    
    // Handle both possible API return formats
    if (Array.isArray(result)) {
      return result.length > 0 ? result[0] : undefined;
    } else if (result && typeof result === 'object' && 'rows' in result) {
      return (result as any).rows.length > 0 ? (result as any).rows[0] : undefined;
    }
    return undefined;
  }

  async getStaffingInquiries(): Promise<StaffingInquiry[]> {
    // Use direct SQL to avoid column name issues
    const result = await db.execute(`
      SELECT 
        id, 
        name, 
        email, 
        phone, 
        company, 
        inquirytype as "inquiryType", 
        message, 
        marketing, 
        status, 
        submittedat as "submittedAt"
      FROM staffing_inquiries 
      ORDER BY submittedat DESC
    `);
    
    console.log("Staffing inquiries SQL result:", JSON.stringify(result, null, 2));
    
    // In newer drizzle-orm versions, the result is the rows array directly
    if (Array.isArray(result)) {
      console.log("Found inquiries:", result.length);
      return result;
    } else if (result && 'rows' in result) {
      // For backwards compatibility with older drizzle-orm versions
      console.log("Found inquiries (in rows property):", (result as any).rows.length);
      return (result as any).rows;
    } else {
      console.log("No valid result format");
      return [];
    }
  }

  async createStaffingInquiry(insertInquiry: InsertStaffingInquiry): Promise<StaffingInquiry> {
    const now = new Date();
    
    // Add default values
    const inquiryData = {
      ...insertInquiry,
      status: "new",
      submittedAt: now
    };
    
    const [inquiry] = await db.insert(staffingInquiries).values(inquiryData).returning();
    return inquiry;
  }

  async updateStaffingInquiryStatus(id: number, status: string): Promise<StaffingInquiry | undefined> {
    // Use direct SQL to avoid column name issues
    const result = await db.execute(`
      UPDATE staffing_inquiries 
      SET status = '${status}' 
      WHERE id = ${id}
      RETURNING id, name, email, phone, company, inquirytype as "inquiryType", message, marketing, status, submittedat as "submittedAt"
    `);
    
    console.log("Update inquiry status result:", JSON.stringify(result, null, 2));
    
    // Handle both possible API return formats
    if (Array.isArray(result)) {
      return result.length > 0 ? result[0] : undefined;
    } else if (result && typeof result === 'object' && 'rows' in result) {
      return (result as any).rows.length > 0 ? (result as any).rows[0] : undefined;
    }
    return undefined;
  }

  // Blog post methods
  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async getBlogPosts(filters?: { category?: string; published?: boolean }): Promise<BlogPost[]> {
    let query = db.select().from(blogPosts);
    
    if (filters) {
      if (filters.category) {
        query = query.where(eq(blogPosts.category, filters.category));
      }
      
      if (filters.published !== undefined) {
        query = query.where(eq(blogPosts.published, filters.published));
      }
    }
    
    // Sort by publish date descending (newest first)
    query = query.orderBy(desc(blogPosts.publishDate));
    
    return await query;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    // Generate a slug from the title if none is provided
    if (!post.slug) {
      post.slug = post.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
        
      // Check if slug exists and append a number if necessary
      let suffix = 1;
      let newSlug = post.slug;
      let existingPost = await this.getBlogPostBySlug(newSlug);
      
      while (existingPost) {
        newSlug = `${post.slug}-${suffix}`;
        suffix++;
        existingPost = await this.getBlogPostBySlug(newSlug);
      }
      
      post.slug = newSlug;
    }
    
    const [createdPost] = await db.insert(blogPosts).values(post).returning();
    return createdPost;
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    // Check if post exists
    const existingPost = await this.getBlogPost(id);
    if (!existingPost) {
      return undefined;
    }
    
    // If slug is being updated, check for uniqueness
    if (post.slug && post.slug !== existingPost.slug) {
      const slugExists = await this.getBlogPostBySlug(post.slug);
      if (slugExists) {
        throw new Error("Slug already exists");
      }
    }
    
    const [updatedPost] = await db
      .update(blogPosts)
      .set(post)
      .where(eq(blogPosts.id, id))
      .returning();
      
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    try {
      // First check if the blog post exists
      const post = await this.getBlogPost(id);
      if (!post) {
        return false;
      }
      
      // If it exists, delete it
      await db.delete(blogPosts).where(eq(blogPosts.id, id));
      
      // Verify deletion was successful
      const checkPost = await this.getBlogPost(id);
      return checkPost === undefined;
    } catch (error) {
      console.error("Error in deleteBlogPost:", error);
      return false;
    }
  }
  
  // Notification methods
  async getNotifications(userId?: number, limit: number = 50): Promise<Notification[]> {
    let query = db.select().from(notifications).orderBy(desc(notifications.createdAt));
    
    if (userId) {
      query = query.where(eq(notifications.userId, userId));
    }
    
    if (limit > 0) {
      query = query.limit(limit);
    }
    
    return await query;
  }
  
  async getNotification(id: number): Promise<Notification | undefined> {
    const [notification] = await db.select().from(notifications).where(eq(notifications.id, id));
    return notification;
  }
  
  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const [notification] = await db.insert(notifications).values(insertNotification).returning();
    return notification;
  }
  
  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const [notification] = await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id))
      .returning();
    return notification;
  }
  
  async markAllNotificationsAsRead(userId: number): Promise<boolean> {
    try {
      await db
        .update(notifications)
        .set({ read: true })
        .where(eq(notifications.userId, userId));
      return true;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      return false;
    }
  }
  
  async getUnreadNotificationCount(userId: number): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(and(
        eq(notifications.userId, userId),
        eq(notifications.read, false)
      ));
    
    return result[0]?.count || 0;
  }
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private jobSeekers: Map<number, JobSeeker>;
  private employers: Map<number, Employer>;
  private jobs: Map<number, Job>;
  private applications: Map<number, Application>;
  private testimonials: Map<number, Testimonial>;
  private admins: Map<number, Admin>;
  private invitationCodes: Map<string, InvitationCode>;
  private vacancies: Map<number, Vacancy>;
  private staffingInquiries: Map<number, StaffingInquiry>;
  private blogPosts: Map<number, BlogPost>;
  private notifications: Map<number, Notification>;

  sessionStore: session.Store;

  // ID counters
  private userIdCounter: number;
  private jobSeekerIdCounter: number;
  private employerIdCounter: number;
  private jobIdCounter: number;
  private applicationIdCounter: number;
  private testimonialIdCounter: number;
  private adminIdCounter: number;
  private vacancyIdCounter: number;
  private staffingInquiryIdCounter: number;
  private blogPostIdCounter: number;
  private notificationIdCounter: number;

  constructor() {
    this.users = new Map();
    this.jobSeekers = new Map();
    this.employers = new Map();
    this.jobs = new Map();
    this.applications = new Map();
    this.testimonials = new Map();
    this.admins = new Map();
    this.invitationCodes = new Map();
    this.vacancies = new Map();
    this.staffingInquiries = new Map();
    this.blogPosts = new Map();
    this.notifications = new Map();

    this.userIdCounter = 1;
    this.jobSeekerIdCounter = 1;
    this.employerIdCounter = 1;
    this.jobIdCounter = 1;
    this.applicationIdCounter = 1;
    this.testimonialIdCounter = 1;
    this.adminIdCounter = 1;
    this.vacancyIdCounter = 1;
    this.staffingInquiryIdCounter = 1;
    this.blogPostIdCounter = 1;
    this.notificationIdCounter = 1;

    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });

    // Add some demo testimonials
    this.createTestimonial({
      userId: null,
      name: "John Smith",
      role: "Software Developer",
      content: "Found my dream job through this platform. The process was smooth and professional.",
      rating: 5
    });

    this.createTestimonial({
      userId: null,
      name: "Sarah Johnson",
      role: "Marketing Manager",
      content: "As an employer, I've found exceptional talent here. The quality of candidates is outstanding.",
      rating: 5
    });

    this.createTestimonial({
      userId: null,
      name: "David Chen",
      role: "HR Director",
      content: "This platform has transformed our hiring process. Highly recommended for all businesses.",
      rating: 4
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUserByEmployerId(employerId: number): Promise<User | undefined> {
    const employer = await this.getEmployer(employerId);
    if (!employer) return undefined;

    return this.users.get(employer.userId);
  }

  async getUserByJobSeekerId(jobSeekerId: number): Promise<User | undefined> {
    const jobSeeker = await this.getJobSeeker(jobSeekerId);
    if (!jobSeeker) return undefined;

    return this.users.get(jobSeeker.userId);
  }

  // JobSeeker methods
  async getJobSeeker(id: number): Promise<JobSeeker | undefined> {
    return this.jobSeekers.get(id);
  }

  async getJobSeekerByUserId(userId: number): Promise<JobSeeker | undefined> {
    return Array.from(this.jobSeekers.values()).find(
      (jobSeeker) => jobSeeker.userId === userId
    );
  }

  async createJobSeeker(insertJobSeeker: InsertJobSeeker): Promise<JobSeeker> {
    const id = this.jobSeekerIdCounter++;
    const jobSeeker: JobSeeker = {
      ...insertJobSeeker,
      id,
      cvPath: null
    };
    this.jobSeekers.set(id, jobSeeker);
    return jobSeeker;
  }

  async updateJobSeeker(jobSeeker: JobSeeker): Promise<JobSeeker> {
    // Check if the job seeker exists
    if (!this.jobSeekers.has(jobSeeker.id)) {
      throw new Error('Job seeker not found');
    }

    // Update in the Map
    this.jobSeekers.set(jobSeeker.id, jobSeeker);
    return jobSeeker;
  }

  // Employer methods
  async getEmployer(id: number): Promise<Employer | undefined> {
    return this.employers.get(id);
  }

  async getEmployerByUserId(userId: number): Promise<Employer | undefined> {
    return Array.from(this.employers.values()).find(
      (employer) => employer.userId === userId
    );
  }

  async createEmployer(insertEmployer: InsertEmployer): Promise<Employer> {
    const id = this.employerIdCounter++;
    const employer: Employer = { ...insertEmployer, id };
    this.employers.set(id, employer);
    return employer;
  }

  async updateEmployer(employer: Employer): Promise<Employer> {
    // Check if the employer exists
    if (!this.employers.has(employer.id)) {
      throw new Error('Employer not found');
    }

    // Update in the Map
    this.employers.set(employer.id, employer);
    return employer;
  }

  // Job methods
  async getJob(id: number): Promise<Job | undefined> {
    return this.jobs.get(id);
  }

  async getJobs(filters?: {
    category?: string;
    location?: string;
    jobType?: string;
    specialization?: string;
    minSalary?: number;
    maxSalary?: number;
    keyword?: string;
  }): Promise<Job[]> {
    let allJobs = Array.from(this.jobs.values()).filter(job => job.isActive);

    if (!filters) return allJobs;

    return allJobs.filter(job => {
      // Filter by category
      if (filters.category && filters.category !== "All Categories" && job.category !== filters.category) return false;

      // Filter by location
      if (filters.location && filters.location !== "All Locations") {
        // Allow partial match on location
        if (!job.location.includes(filters.location)) return false;
      }

      // Filter by job type
      if (filters.jobType && filters.jobType !== "All Types" && job.jobType !== filters.jobType) return false;

      // Filter by specialization (checking in description)
      if (filters.specialization && filters.specialization !== "All Specializations") {
        if (!job.description.includes(filters.specialization)) return false;
      }

      // Filter by salary range
      if (filters.minSalary || filters.maxSalary) {
        // Extract numeric salary from string like "$120,000 - $150,000"
        const salaryMatch = job.salary?.match(/[\d,]+/g);
        if (salaryMatch && salaryMatch.length >= 1) {
          const minSalaryStr = salaryMatch[0].replace(/,/g, '');
          const minSalaryValue = parseInt(minSalaryStr);

          if (filters.minSalary && !isNaN(minSalaryValue) && minSalaryValue < filters.minSalary) {
            return false;
          }

          if (filters.maxSalary && salaryMatch.length >= 2) {
            const maxSalaryStr = salaryMatch[1].replace(/,/g, '');
            const maxSalaryValue = parseInt(maxSalaryStr);

            if (!isNaN(maxSalaryValue) && maxSalaryValue > filters.maxSalary) {
              return false;
            }
          }
        }
      }

      // Filter by keyword (search in title and description)
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        if (!job.title.toLowerCase().includes(keyword) &&
            !job.description.toLowerCase().includes(keyword)) {
          return false;
        }
      }

      return true;
    });
  }

  async createJob(insertJob: InsertJob): Promise<Job> {
    const id = this.jobIdCounter++;
    const now = new Date();

    // Extract company name from title if not provided
    let company = insertJob.company;
    if (!company && insertJob.title?.includes("at ")) {
      const parts = insertJob.title.split(" at ");
      if (parts.length >= 2) {
        company = parts[1];
      }
    }

    // Build default requirements and benefits from description if not provided
    const description = insertJob.description || "";
    let requirements = insertJob.requirements;
    let benefits = insertJob.benefits;

    if (!requirements && description.includes("Requirements:")) {
      const reqParts = description.split("Requirements:");
      if (reqParts.length >= 2) {
        const reqSection = reqParts[1].split("\n\n")[0];
        requirements = reqSection.trim();
      }
    }

    if (!benefits && description.includes("Benefits:")) {
      const benParts = description.split("Benefits:");
      if (benParts.length >= 2) {
        const benSection = benParts[1].split("\n\n")[0];
        benefits = benSection.trim();
      }
    }

    // Parse salary range from text format if minSalary/maxSalary not provided
    let minSalary = insertJob.minSalary;
    let maxSalary = insertJob.maxSalary;

    if ((!minSalary || !maxSalary) && insertJob.salary) {
      const salaryText = insertJob.salary;
      const numbers = salaryText.match(/[\d,]+/g);
      if (numbers && numbers.length >= 2) {
        minSalary = parseInt(numbers[0].replace(/,/g, ''));
        maxSalary = parseInt(numbers[1].replace(/,/g, ''));
      } else if (numbers && numbers.length === 1) {
        const value = parseInt(numbers[0].replace(/,/g, ''));
        minSalary = value * 0.9;
        maxSalary = value * 1.1;
      }
    }

    const applicationDeadline = insertJob.applicationDeadline || new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Create default job
    const job: Job = {
      ...insertJob,
      id,
      company: company || "Unknown Company",
      requirements: requirements || "Please contact employer for detailed requirements.",
      benefits: benefits || "Please contact employer for detailed benefits information.",
      experience: insertJob.experience || "Not specified",
      minSalary: minSalary || 0,
      maxSalary: maxSalary || 0,
      contactEmail: insertJob.contactEmail || "contact@example.com",
      applicationDeadline: applicationDeadline,
      specialization: insertJob.specialization || null,
      salary: insertJob.salary || null,
      postedDate: now,
      isActive: true,
      applicationCount: 0,
      createdAt: now
    };

    this.jobs.set(id, job);
    return job;
  }

  async getJobsByEmployerId(employerId: number): Promise<Job[]> {
    return Array.from(this.jobs.values()).filter(
      (job) => job.employerId === employerId
    );
  }

  async updateJob(job: Job): Promise<Job> {
    // Check if the job exists
    if (!this.jobs.has(job.id)) {
      throw new Error('Job not found');
    }

    // Update in the Map
    this.jobs.set(job.id, job);
    return job;
  }

  async deleteJob(id: number): Promise<boolean> {
    // Check if the job exists
    if (!this.jobs.has(id)) {
      return false;
    }

    // Delete the job
    return this.jobs.delete(id);
  }

  // Application methods
  async getApplication(id: number): Promise<Application | undefined> {
    return this.applications.get(id);
  }

  async getApplicationsByJobId(jobId: number): Promise<Application[]> {
    return Array.from(this.applications.values()).filter(
      (application) => application.jobId === jobId
    );
  }

  async getApplicationsByJobSeekerId(jobSeekerId: number): Promise<Application[]> {
    return Array.from(this.applications.values()).filter(
      (application) => application.jobSeekerId === jobSeekerId
    );
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const id = this.applicationIdCounter++;
    const now = new Date();
    const application: Application = {
      ...insertApplication,
      id,
      appliedDate: now,
      coverLetter: insertApplication.coverLetter || null,
      status: "pending"
    };
    this.applications.set(id, application);

    // Update job application count
    const job = this.jobs.get(application.jobId);
    if (job) {
      job.applications = (job.applications || 0) + 1;
      this.jobs.set(job.id, job);
    }

    return application;
  }

  async deleteApplication(id: number): Promise<boolean> {
    const application = this.applications.get(id);
    if (!application) {
      return false;
    }

    // First reduce the job application count
    const job = this.jobs.get(application.jobId);
    if (job && job.applications > 0) {
      job.applications -= 1;
      this.jobs.set(job.id, job);
    }

    // Then delete the application
    return this.applications.delete(id);
  }

  async updateApplicationStatus(id: number, status: string): Promise<Application | undefined> {
    // Validate status
    if (!["new", "viewed", "shortlisted", "rejected"].includes(status)) {
      throw new Error("Invalid status value");
    }

    // Check if the application exists
    const application = this.applications.get(id);
    if (!application) {
      return undefined;
    }

    // Update the status
    const updatedApplication = { ...application, status };

    // Save back to the Map
    this.applications.set(id, updatedApplication);

    return updatedApplication;
  }

  // Testimonial methods
  async getTestimonial(id: number): Promise<Testimonial | undefined> {
    return this.testimonials.get(id);
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values());
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const id = this.testimonialIdCounter++;
    const testimonial: Testimonial = {
      ...insertTestimonial,
      id,
      userId: insertTestimonial.userId !== undefined ? insertTestimonial.userId : null
    };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }

  // Admin methods
  async getAdmin(id: number): Promise<Admin | undefined> {
    return this.admins.get(id);
  }

  async getAdminByUserId(userId: number): Promise<Admin | undefined> {
    return Array.from(this.admins.values()).find(
      (admin) => admin.userId === userId
    );
  }

  async createAdmin(insertAdmin: InsertAdmin): Promise<Admin> {
    const id = this.adminIdCounter++;
    const admin: Admin = {
      ...insertAdmin,
      id,
      lastLogin: null
    };
    this.admins.set(id, admin);
    return admin;
  }

  async updateAdminLastLogin(id: number): Promise<Admin> {
    const admin = this.admins.get(id);
    if (!admin) {
      throw new Error('Admin not found');
    }

    const updatedAdmin: Admin = {
      ...admin,
      lastLogin: new Date()
    };

    this.admins.set(id, updatedAdmin);
    return updatedAdmin;
  }

  async getAllAdmins(): Promise<Admin[]> {
    return Array.from(this.admins.values());
  }

  // Invitation code methods
  async getInvitationCode(code: string): Promise<InvitationCode | undefined> {
    return this.invitationCodes.get(code);
  }

  async getInvitationCodes(): Promise<InvitationCode[]> {
    return Array.from(this.invitationCodes.values());
  }

  async createInvitationCode(insertInvitationCode: InsertInvitationCode): Promise<InvitationCode> {
    const invitationCode: InvitationCode = {
      ...insertInvitationCode,
      id: this.invitationCodes.size + 1,
      isUsed: false,
      createdAt: new Date()
    };

    this.invitationCodes.set(invitationCode.code, invitationCode);
    return invitationCode;
  }

  async verifyInvitationCode(code: string, email: string): Promise<boolean> {
    const invitationCode = await this.getInvitationCode(code);

    if (!invitationCode) {
      return false;
    }

    // Check if the code is for the specific email
    if (invitationCode.email !== email) {
      return false;
    }

    // Check if the code is already used
    if (invitationCode.isUsed) {
      return false;
    }

    // Check if the code has expired
    if (new Date() > invitationCode.expiresAt) {
      return false;
    }

    return true;
  }

  async markInvitationCodeAsUsed(code: string): Promise<InvitationCode | undefined> {
    const invitationCode = await this.getInvitationCode(code);

    if (!invitationCode) {
      return undefined;
    }

    const updatedInvitationCode: InvitationCode = {
      ...invitationCode,
      isUsed: true
    };

    this.invitationCodes.set(code, updatedInvitationCode);
    return updatedInvitationCode;
  }

  // Admin password reset methods

  async updateUserPassword(userId: number, password: string): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;

    const updatedUser: User = {
      ...user,
      password
    };

    this.users.set(userId, updatedUser);
    return updatedUser;
  }

  async updateAdminRecoveryEmail(id: number, recoveryEmail: string): Promise<Admin> {
    const admin = this.admins.get(id);
    if (!admin) {
      throw new Error("Admin not found");
    }

    const updatedAdmin: Admin = {
      ...admin,
      recoveryEmail
    };

    this.admins.set(id, updatedAdmin);
    return updatedAdmin;
  }

  async setPasswordResetToken(adminId: number, token: string, expiryDate: Date): Promise<Admin> {
    const admin = this.admins.get(adminId);
    if (!admin) {
      throw new Error("Admin not found");
    }

    const updatedAdmin: Admin = {
      ...admin,
      resetToken: token,
      resetTokenExpires: expiryDate
    };

    this.admins.set(adminId, updatedAdmin);
    return updatedAdmin;
  }

  async getAdminByResetToken(token: string): Promise<Admin | undefined> {
    const now = new Date();

    // Find admin with matching token and non-expired timestamp
    for (const admin of this.admins.values()) {
      if (
        admin.resetToken === token &&
        admin.resetTokenExpires &&
        admin.resetTokenExpires > now
      ) {
        return admin;
      }
    }

    return undefined;
  }

  async clearPasswordResetToken(adminId: number): Promise<Admin> {
    const admin = this.admins.get(adminId);
    if (!admin) {
      throw new Error("Admin not found");
    }

    const updatedAdmin: Admin = {
      ...admin,
      resetToken: null,
      resetTokenExpires: null
    };

    this.admins.set(adminId, updatedAdmin);
    return updatedAdmin;
  }

  // Vacancy methods
  async getVacancy(id: number): Promise<Vacancy | undefined> {
    return this.vacancies.get(id);
  }

  async getVacancies(): Promise<Vacancy[]> {
    return Array.from(this.vacancies.values());
  }

  async createVacancy(insertVacancy: InsertVacancy): Promise<Vacancy> {
    const id = this.vacancyIdCounter++;
    const now = new Date();
    
    const vacancy: Vacancy = {
      ...insertVacancy,
      id,
      status: insertVacancy.status || "pending",
      submittedAt: insertVacancy.submittedAt || now,
      reviewedAt: null,
      reviewedBy: null,
      notes: null
    };
    
    this.vacancies.set(id, vacancy);
    return vacancy;
  }

  async updateVacancyStatus(id: number, status: string): Promise<Vacancy | undefined> {
    const vacancy = this.vacancies.get(id);
    if (!vacancy) {
      return undefined;
    }

    const now = new Date();
    const updatedVacancy: Vacancy = {
      ...vacancy,
      status,
      reviewedAt: now
    };

    this.vacancies.set(id, updatedVacancy);
    return updatedVacancy;
  }
  
  async assignVacancyToRecruiter(
    id: number, 
    recruiterEmail: string, 
    recruiterName: string
  ): Promise<Vacancy | undefined> {
    const vacancy = this.vacancies.get(id);
    if (!vacancy) {
      return undefined;
    }

    const now = new Date();
    const updatedVacancy: Vacancy = {
      ...vacancy,
      assignedTo: recruiterEmail,
      assignedName: recruiterName,
      assignedAt: now,
      // If the vacancy is still in 'new' or 'pending' status, update it to 'assigned'
      status: vacancy.status === 'new' || vacancy.status === 'pending' ? 'assigned' : vacancy.status
    };

    this.vacancies.set(id, updatedVacancy);
    return updatedVacancy;
  }
  
  async deleteVacancy(id: number): Promise<boolean> {
    if (!this.vacancies.has(id)) {
      return false;
    }
    
    return this.vacancies.delete(id);
  }
  
  // Staffing Inquiry methods
  async getStaffingInquiry(id: number): Promise<StaffingInquiry | undefined> {
    return this.staffingInquiries.get(id);
  }

  async getStaffingInquiries(): Promise<StaffingInquiry[]> {
    return Array.from(this.staffingInquiries.values());
  }

  async createStaffingInquiry(insertInquiry: InsertStaffingInquiry): Promise<StaffingInquiry> {
    const id = this.staffingInquiryIdCounter++;
    const now = new Date();
    
    const inquiry: StaffingInquiry = {
      ...insertInquiry,
      id,
      status: "new",
      submittedAt: now
    };
    
    this.staffingInquiries.set(id, inquiry);
    return inquiry;
  }

  async updateStaffingInquiryStatus(id: number, status: string): Promise<StaffingInquiry | undefined> {
    const inquiry = this.staffingInquiries.get(id);
    if (!inquiry) {
      return undefined;
    }

    const updatedInquiry: StaffingInquiry = {
      ...inquiry,
      status
    };

    this.staffingInquiries.set(id, updatedInquiry);
    return updatedInquiry;
  }
  
  // Notification methods
  async getNotifications(userId?: number, limit: number = 50): Promise<Notification[]> {
    let notifications = Array.from(this.notifications.values());
    
    // Filter by userId if provided
    if (userId !== undefined) {
      notifications = notifications.filter(n => n.userId === userId);
    }
    
    // Sort by createdAt in descending order (newest first)
    notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    // Apply limit if provided
    if (limit > 0 && notifications.length > limit) {
      notifications = notifications.slice(0, limit);
    }
    
    return notifications;
  }
  
  async getNotification(id: number): Promise<Notification | undefined> {
    return this.notifications.get(id);
  }
  
  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = this.notificationIdCounter++;
    const now = new Date();
    
    const notification: Notification = {
      ...insertNotification,
      id,
      createdAt: now,
      read: false
    };
    
    this.notifications.set(id, notification);
    return notification;
  }
  
  async markNotificationAsRead(id: number): Promise<Notification | undefined> {
    const notification = this.notifications.get(id);
    if (!notification) {
      return undefined;
    }
    
    const updatedNotification: Notification = {
      ...notification,
      read: true
    };
    
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }
  
  async markAllNotificationsAsRead(userId: number): Promise<boolean> {
    try {
      const userNotifications = Array.from(this.notifications.values())
        .filter(n => n.userId === userId);
        
      userNotifications.forEach(notification => {
        this.notifications.set(notification.id, {
          ...notification,
          read: true
        });
      });
      
      return true;
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      return false;
    }
  }
  
  async getUnreadNotificationCount(userId: number): Promise<number> {
    return Array.from(this.notifications.values())
      .filter(n => n.userId === userId && !n.read)
      .length;
  }
}

// Use Database storage for persistent data
console.log("Creating DatabaseStorage instance...");
const dbStorage = new DatabaseStorage();

// Verify assignVacancyToRecruiter method exists
console.log("Checking if assignVacancyToRecruiter method exists:", 
  typeof dbStorage.assignVacancyToRecruiter === 'function' ? "YES" : "NO");

export const storage = dbStorage;
