import { and, eq, gt, lt, ilike, or, sql, isNull, not } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import createMemoryStore from "memorystore";
import * as schema from "@shared/schema";
import { db, pool } from "./db";
import {
  type User,
  type InsertUser,
  users,
  type JobSeeker,
  type InsertJobSeeker,
  jobSeekers,
  type Employer,
  type InsertEmployer,
  employers,
  type Job,
  type InsertJob,
  jobs,
  type Application,
  type InsertApplication,
  applications,
  type Testimonial,
  type InsertTestimonial,
  testimonials,
  type Admin,
  type InsertAdmin,
  admins,
  type InvitationCode,
  type InsertInvitationCode,
  invitationCodes,
  type Vacancy,
  type InsertVacancy,
  vacancies,
  type StaffingInquiry,
  type InsertStaffingInquiry,
  staffingInquiries,
  type BlogPost,
  type InsertBlogPost,
  type Notification,
  type InsertNotification,
  blogPosts,
  notifications
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  getUserByEmployerId(employerId: number): Promise<User | undefined>;
  getUserByJobSeekerId(jobSeekerId: number): Promise<User | undefined>;
  removeSuperAdminUsers(): Promise<{ count: number; removedUserIds: number[] }>;
  getUserById(id: number): Promise<User | undefined>;
  updateUserPassword(userId: number, password: string): Promise<User | undefined>;
  deleteUser(userId: number): Promise<boolean>;

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

// Use the db and pool imported from ./db
type DatabaseInstance = typeof db;

const PostgresSessionStore = connectPg(session);

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  db: DatabaseInstance;

  constructor() {
    this.db = db;
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true
    });
  }

  async getUser(id: number) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser) {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllUsers() {
    return await db.select().from(users);
  }

  async getUserByEmployerId(employerId: number) {
    const [employer] = await db.select().from(employers).where(eq(employers.id, employerId));
    if (!employer) return undefined;
    return this.getUser(employer.userId);
  }

  async getUserByJobSeekerId(jobSeekerId: number) {
    const [jobSeeker] = await db.select().from(jobSeekers).where(eq(jobSeekers.id, jobSeekerId));
    if (!jobSeeker) return undefined;
    return this.getUser(jobSeeker.userId);
  }

  async removeSuperAdminUsers() {
    const removedUserIds: number[] = [];
    const superAdminUsers = await db
      .select()
      .from(users)
      .where(eq(users.role, "super_admin"));

    let count = 0;
    for (const user of superAdminUsers) {
      try {
        // Delete the user
        const deleted = await this.deleteUser(user.id);
        if (deleted) {
          count++;
          removedUserIds.push(user.id);
        }
      } catch (error) {
        console.error(`Error deleting super_admin user ${user.id}:`, error);
      }
    }

    return { count, removedUserIds };
  }

  async getUserById(id: number) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getJobSeeker(id: number) {
    const [jobSeeker] = await db.select().from(jobSeekers).where(eq(jobSeekers.id, id));
    return jobSeeker;
  }

  async getJobSeekerByUserId(userId: number) {
    const [jobSeeker] = await db.select().from(jobSeekers).where(eq(jobSeekers.userId, userId));
    return jobSeeker;
  }

  async createJobSeeker(insertJobSeeker: InsertJobSeeker) {
    const [jobSeeker] = await db.insert(jobSeekers).values(insertJobSeeker).returning();
    return jobSeeker;
  }

  async updateJobSeeker(updatedJobSeeker: JobSeeker) {
    const { id, ...updateValues } = updatedJobSeeker;
    const [jobSeeker] = await db
      .update(jobSeekers)
      .set(updateValues)
      .where(eq(jobSeekers.id, id))
      .returning();
    return jobSeeker;
  }

  async getEmployer(id: number) {
    const [employer] = await db.select().from(employers).where(eq(employers.id, id));
    return employer;
  }

  async getEmployerByUserId(userId: number) {
    const [employer] = await db.select().from(employers).where(eq(employers.userId, userId));
    return employer;
  }

  async getEmployerByCompanyName(companyName: string) {
    const [employer] = await db.select().from(employers).where(eq(employers.companyName, companyName));
    return employer;
  }

  async createEmployer(insertEmployer: InsertEmployer) {
    const [employer] = await db.insert(employers).values(insertEmployer).returning();
    return employer;
  }

  async updateEmployer(updatedEmployer: Employer) {
    const { id, ...updateValues } = updatedEmployer;
    const [employer] = await db
      .update(employers)
      .set(updateValues)
      .where(eq(employers.id, id))
      .returning();
    return employer;
  }

  async getJob(id: number) {
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
  }) {
    let query = db.select().from(jobs);

    if (filters) {
      const conditions = [];

      if (filters.category) {
        conditions.push(eq(jobs.category, filters.category));
      }

      if (filters.location) {
        conditions.push(ilike(jobs.location, `%${filters.location}%`));
      }

      if (filters.jobType) {
        conditions.push(eq(jobs.jobType, filters.jobType));
      }

      if (filters.specialization) {
        conditions.push(ilike(jobs.specialization, `%${filters.specialization}%`));
      }

      if (filters.experience) {
        conditions.push(eq(jobs.experience, filters.experience));
      }

      if (filters.minSalary) {
        conditions.push(gt(jobs.maxSalary, filters.minSalary));
      }

      if (filters.maxSalary) {
        conditions.push(lt(jobs.minSalary, filters.maxSalary));
      }

      if (filters.keyword) {
        conditions.push(
          or(
            ilike(jobs.title, `%${filters.keyword}%`),
            ilike(jobs.description, `%${filters.keyword}%`),
            ilike(jobs.company, `%${filters.keyword}%`),
            ilike(jobs.requirements, `%${filters.keyword}%`)
          )
        );
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
    }

    return await query.orderBy(sql`${jobs.createdAt} DESC`);
  }

  async getJobsByEmployerId(employerId: number) {
    return await db.select().from(jobs).where(eq(jobs.employerId, employerId));
  }

  async createJob(insertJob: InsertJob) {
    const [job] = await db.insert(jobs).values(insertJob).returning();
    return job;
  }

  async updateJob(updatedJob: Job) {
    const { id, ...updateValues } = updatedJob;
    const [job] = await db.update(jobs).set(updateValues).where(eq(jobs.id, id)).returning();
    return job;
  }

  async deleteJob(id: number) {
    try {
      // First, delete associated applications
      await db.delete(applications).where(eq(applications.jobId, id));
      
      // Then delete the job itself
      const result = await db.delete(jobs).where(eq(jobs.id, id));
      return result.rowCount > 0;
    } catch (error) {
      console.error("Error deleting job:", error);
      return false;
    }
  }

  async getApplication(id: number) {
    const [application] = await db.select().from(applications).where(eq(applications.id, id));
    return application;
  }

  async getApplicationsByJobId(jobId: number) {
    return await db.select().from(applications).where(eq(applications.jobId, jobId));
  }

  async getApplicationsByJobSeekerId(jobSeekerId: number) {
    return await db.select().from(applications).where(eq(applications.jobSeekerId, jobSeekerId));
  }

  async createApplication(insertApplication: InsertApplication) {
    const [application] = await db.insert(applications).values(insertApplication).returning();
    return application;
  }

  async deleteApplication(id: number) {
    try {
      const result = await db.delete(applications).where(eq(applications.id, id));
      return result.rowCount > 0;
    } catch (error) {
      console.error("Error deleting application:", error);
      return false;
    }
  }

  async updateApplicationStatus(id: number, status: string) {
    try {
      const [application] = await db
        .update(applications)
        .set({ status })
        .where(eq(applications.id, id))
        .returning();
      return application;
    } catch (error) {
      console.error("Error updating application status:", error);
      return undefined;
    }
  }

  async getTestimonial(id: number) {
    const [testimonial] = await db.select().from(testimonials).where(eq(testimonials.id, id));
    return testimonial;
  }

  async getTestimonials() {
    return await db.select().from(testimonials);
  }

  async createTestimonial(insertTestimonial: InsertTestimonial) {
    const [testimonial] = await db
      .insert(testimonials)
      .values(insertTestimonial)
      .returning();
    return testimonial;
  }

  async getAdmin(id: number) {
    const [admin] = await db.select().from(admins).where(eq(admins.id, id));
    return admin;
  }

  async getAdminByUserId(userId: number) {
    const [admin] = await db.select().from(admins).where(eq(admins.userId, userId));
    return admin;
  }

  async getAdminUsers() {
    return await db.select().from(admins);
  }

  async createAdmin(insertAdmin: InsertAdmin) {
    const [admin] = await db.insert(admins).values(insertAdmin).returning();
    return admin;
  }

  async updateAdminLastLogin(id: number) {
    const [admin] = await db
      .update(admins)
      .set({ lastLogin: new Date() })
      .where(eq(admins.id, id))
      .returning();
    return admin;
  }

  async updateUserPassword(userId: number, password: string) {
    try {
      const [user] = await db
        .update(users)
        .set({ password })
        .where(eq(users.id, userId))
        .returning();
      return user;
    } catch (error) {
      console.error("Error updating user password:", error);
      return undefined;
    }
  }

  async deleteUser(userId: number) {
    try {
      // We need to use a transaction to handle referential integrity
      return await db.transaction(async (tx) => {
        try {
          console.log(`Database Storage: Starting transaction to delete user ID: ${userId}`);
          
          // 1. Check if user exists
          const [user] = await tx.select().from(users).where(eq(users.id, userId));
          if (!user) {
            console.log(`Database Storage: User with ID ${userId} not found`);
            return false; // Return false instead of throwing an error for consistent behavior
          }
          
          console.log(`Database Storage: Found user ${userId} to delete, userType: ${user.userType}`);

          // 2. Delete admin record if exists
          await tx.delete(admins).where(eq(admins.userId, userId));

          // 3. Delete jobSeeker record if exists
          const [jobSeeker] = await tx.select().from(jobSeekers).where(eq(jobSeekers.userId, userId));
          if (jobSeeker) {
            // Delete applications associated with this job seeker
            await tx.delete(applications).where(eq(applications.jobSeekerId, jobSeeker.id));
            // Delete the job seeker
            await tx.delete(jobSeekers).where(eq(jobSeekers.id, jobSeeker.id));
          }

          // 4. Delete employer record if exists
          const [employer] = await tx.select().from(employers).where(eq(employers.userId, userId));
          if (employer) {
            // Get jobs for this employer
            const employerJobs = await tx.select().from(jobs).where(eq(jobs.employerId, employer.id));
            
            // Delete applications for all jobs of this employer
            for (const job of employerJobs) {
              await tx.delete(applications).where(eq(applications.jobId, job.id));
            }
            
            // Delete all jobs of this employer
            await tx.delete(jobs).where(eq(jobs.employerId, employer.id));
            
            // Delete the employer
            await tx.delete(employers).where(eq(employers.id, employer.id));
          }
          
          // 5. Delete blog posts by this user
          await tx.delete(blogPosts).where(eq(blogPosts.authorId, userId));
          
          // 6. Delete notifications related to this user
          await tx.delete(notifications).where(eq(notifications.userId, userId));
          
          // 7. Finally delete the user
          const result = await tx.delete(users).where(eq(users.id, userId));
          
          const success = result.rowCount > 0;
          console.log(`Database Storage: User deletion result - rowCount: ${result.rowCount}, success: ${success}`);
          return success;
        } catch (txError) {
          console.error(`Database Storage: Transaction error while deleting user ${userId}:`, txError);
          return false; // Return false instead of rethrowing to provide consistent return values
        }
      });
    } catch (error) {
      console.error(`Database Storage: Error deleting user ${userId}:`, error);
      return false; // Return false instead of rethrowing to maintain consistent error handling
    }
  }

  // Method to update admin recovery email in the database
  async updateAdminRecoveryEmail(id: number, recoveryEmail: string) {
    const [admin] = await db
      .update(admins)
      .set({ recoveryEmail })
      .where(eq(admins.id, id))
      .returning();
    return admin;
  }

  async setPasswordResetToken(adminId: number, token: string, expiryDate: Date) {
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

  async getAdminByResetToken(token: string) {
    const [admin] = await db
      .select()
      .from(admins)
      .where(
        and(
          eq(admins.resetToken, token),
          gt(admins.resetTokenExpires, new Date())
        )
      );
    return admin;
  }

  async clearPasswordResetToken(adminId: number) {
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

  async getAllAdmins() {
    return await db.select().from(admins);
  }

  async getInvitationCode(code: string) {
    const [invitationCode] = await db
      .select()
      .from(invitationCodes)
      .where(eq(invitationCodes.code, code));
    return invitationCode;
  }

  async getInvitationCodes() {
    return await db.select().from(invitationCodes);
  }

  async createInvitationCode(insertInvitationCode: InsertInvitationCode) {
    const [invitationCode] = await db
      .insert(invitationCodes)
      .values(insertInvitationCode)
      .returning();
    return invitationCode;
  }

  async verifyInvitationCode(code: string, email: string) {
    const [invitationCode] = await db
      .select()
      .from(invitationCodes)
      .where(
        and(
          eq(invitationCodes.code, code),
          eq(invitationCodes.email, email),
          eq(invitationCodes.isUsed, false),
          gt(invitationCodes.expiresAt, new Date())
        )
      );
    return !!invitationCode;
  }

  async markInvitationCodeAsUsed(code: string) {
    const [invitationCode] = await db
      .update(invitationCodes)
      .set({ isUsed: true })
      .where(eq(invitationCodes.code, code))
      .returning();
    return invitationCode;
  }

  async getVacancy(id: number) {
    const [vacancy] = await db.select().from(vacancies).where(eq(vacancies.id, id));
    return vacancy;
  }

  async getVacancies() {
    return await db.select().from(vacancies);
  }

  async createVacancy(insertVacancy: InsertVacancy) {
    const [vacancy] = await db.insert(vacancies).values(insertVacancy).returning();
    return vacancy;
  }

  async updateVacancyStatus(id: number, status: string) {
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
  ) {
    const [vacancy] = await db
      .update(vacancies)
      .set({
        recruiterEmail,
        recruiterName,
        assignedAt: new Date()
      })
      .where(eq(vacancies.id, id))
      .returning();
    return vacancy;
  }

  async deleteVacancy(id: number) {
    try {
      const result = await db.delete(vacancies).where(eq(vacancies.id, id));
      return result.rowCount > 0;
    } catch (error) {
      console.error("Error deleting vacancy:", error);
      return false;
    }
  }

  async getStaffingInquiry(id: number) {
    const [inquiry] = await db
      .select()
      .from(staffingInquiries)
      .where(eq(staffingInquiries.id, id));
    return inquiry;
  }

  async getStaffingInquiries() {
    return await db.select().from(staffingInquiries);
  }

  async createStaffingInquiry(insertInquiry: InsertStaffingInquiry) {
    const [inquiry] = await db
      .insert(staffingInquiries)
      .values(insertInquiry)
      .returning();
    return inquiry;
  }

  async updateStaffingInquiryStatus(id: number, status: string) {
    const [inquiry] = await db
      .update(staffingInquiries)
      .set({ status })
      .where(eq(staffingInquiries.id, id))
      .returning();
    return inquiry;
  }

  async getBlogPost(id: number) {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id));
    return post;
  }

  async getBlogPostBySlug(slug: string) {
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return post;
  }

  async getBlogPosts(filters?: { category?: string; published?: boolean }) {
    let query = db.select().from(blogPosts);

    if (filters) {
      const conditions = [];

      if (filters.category) {
        conditions.push(eq(blogPosts.category, filters.category));
      }

      if (filters.published !== undefined) {
        conditions.push(eq(blogPosts.published, filters.published));
      }

      if (conditions.length > 0) {
        query = query.where(and(...conditions));
      }
    }

    const posts = await query.orderBy(sql`${blogPosts.createdAt} DESC`);
    return posts;
  }

  async createBlogPost(post: InsertBlogPost) {
    const [blogPost] = await db.insert(blogPosts).values(post).returning();
    return blogPost;
  }

  async updateBlogPost(id: number, post: Partial<InsertBlogPost>) {
    const [blogPost] = await db
      .update(blogPosts)
      .set(post)
      .where(eq(blogPosts.id, id))
      .returning();
    return blogPost;
  }

  async deleteBlogPost(id: number) {
    try {
      const result = await db.delete(blogPosts).where(eq(blogPosts.id, id));
      return result.rowCount > 0;
    } catch (error) {
      console.error("Error deleting blog post:", error);
      return false;
    }
  }

  async getNotifications(userId?: number, limit: number = 50) {
    let query = db.select().from(notifications);
    
    if (userId !== undefined) {
      query = query.where(eq(notifications.userId, userId));
    }
    
    const results = await query.orderBy(sql`${notifications.createdAt} DESC`).limit(limit);
    return results;
  }

  async getNotification(id: number) {
    const [notification] = await db.select().from(notifications).where(eq(notifications.id, id));
    return notification;
  }

  async createNotification(insertNotification: InsertNotification) {
    const [notification] = await db.insert(notifications).values(insertNotification).returning();
    return notification;
  }

  async markNotificationAsRead(id: number) {
    const [notification] = await db
      .update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, id))
      .returning();
    return notification;
  }

  async markAllNotificationsAsRead(userId: number) {
    const result = await db
      .update(notifications)
      .set({ read: true })
      .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));
    return result.rowCount > 0;
  }

  async getUnreadNotificationCount(userId: number) {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.read, false)));
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
    
    // Create an in-memory session store
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
  }
  
  async getUser(id: number) {
    return this.users.get(id);
  }
  
  async getUserByEmail(email: string) {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return undefined;
  }
  
  async createUser(insertUser: InsertUser) {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }
  
  async getAllUsers() {
    return Array.from(this.users.values());
  }
  
  async getUserByEmployerId(employerId: number) {
    const employer = await this.getEmployer(employerId);
    if (!employer) return undefined;
    return this.getUser(employer.userId);
  }
  
  async getUserByJobSeekerId(jobSeekerId: number) {
    const jobSeeker = await this.getJobSeeker(jobSeekerId);
    if (!jobSeeker) return undefined;
    return this.getUser(jobSeeker.userId);
  }
  
  async removeSuperAdminUsers() {
    const removedUserIds: number[] = [];
    let count = 0;
    
    for (const [id, user] of this.users.entries()) {
      if (user.role === "super_admin") {
        try {
          await this.deleteUser(id);
          count++;
          removedUserIds.push(id);
        } catch (error) {
          console.error(`Error deleting super_admin user ${id}:`, error);
        }
      }
    }
    
    return { count, removedUserIds };
  }
  
  async getUserById(id: number) {
    return this.users.get(id);
  }
  
  async getJobSeeker(id: number) {
    return this.jobSeekers.get(id);
  }
  
  async getJobSeekerByUserId(userId: number) {
    for (const jobSeeker of this.jobSeekers.values()) {
      if (jobSeeker.userId === userId) {
        return jobSeeker;
      }
    }
    return undefined;
  }
  
  async createJobSeeker(insertJobSeeker: InsertJobSeeker) {
    const id = this.jobSeekerIdCounter++;
    const jobSeeker: JobSeeker = {
      ...insertJobSeeker,
      id
    };
    this.jobSeekers.set(id, jobSeeker);
    return jobSeeker;
  }
  
  async updateJobSeeker(jobSeeker: JobSeeker) {
    this.jobSeekers.set(jobSeeker.id, jobSeeker);
    return jobSeeker;
  }
  
  async getEmployer(id: number) {
    return this.employers.get(id);
  }
  
  async getEmployerByUserId(userId: number) {
    for (const employer of this.employers.values()) {
      if (employer.userId === userId) {
        return employer;
      }
    }
    return undefined;
  }
  
  async createEmployer(insertEmployer: InsertEmployer) {
    const id = this.employerIdCounter++;
    const employer: Employer = { ...insertEmployer, id };
    this.employers.set(id, employer);
    return employer;
  }
  
  async updateEmployer(employer: Employer) {
    this.employers.set(employer.id, employer);
    return employer;
  }
  
  async getJob(id: number) {
    return this.jobs.get(id);
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
  }) {
    let jobs = Array.from(this.jobs.values());
    
    if (filters) {
      if (filters.category) {
        jobs = jobs.filter(job => job.category === filters.category);
      }
      if (filters.location) {
        jobs = jobs.filter(job => job.location.toLowerCase().includes(filters.location!.toLowerCase()));
      }
      if (filters.jobType) {
        jobs = jobs.filter(job => job.jobType === filters.jobType);
      }
      if (filters.specialization) {
        jobs = jobs.filter(job => job.specialization?.toLowerCase().includes(filters.specialization!.toLowerCase()));
      }
      if (filters.experience) {
        jobs = jobs.filter(job => job.experience === filters.experience);
      }
      if (filters.minSalary) {
        jobs = jobs.filter(job => job.maxSalary >= filters.minSalary!);
      }
      if (filters.maxSalary) {
        jobs = jobs.filter(job => job.minSalary <= filters.maxSalary!);
      }
      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase();
        jobs = jobs.filter(job => {
          return (
            job.title.toLowerCase().includes(keyword) ||
            job.description.toLowerCase().includes(keyword) ||
            job.company.toLowerCase().includes(keyword) ||
            job.requirements.toLowerCase().includes(keyword)
          );
        });
      }
    }
    
    return jobs.sort((a, b) => {
      const aDate = a.createdAt || new Date(0);
      const bDate = b.createdAt || new Date(0);
      return bDate.getTime() - aDate.getTime();
    });
  }
  
  async createJob(insertJob: InsertJob) {
    const id = this.jobIdCounter++;
    const now = new Date();
    const job: Job = {
      ...insertJob,
      id,
      createdAt: now,
      applicationCount: 0
    };
    this.jobs.set(id, job);
    return job;
  }
  
  async getJobsByEmployerId(employerId: number) {
    return Array.from(this.jobs.values()).filter(job => job.employerId === employerId);
  }
  
  async updateJob(job: Job) {
    this.jobs.set(job.id, job);
    return job;
  }
  
  async deleteJob(id: number) {
    try {
      // Delete all applications for this job
      const applications = Array.from(this.applications.values()).filter(app => app.jobId === id);
      for (const app of applications) {
        this.applications.delete(app.id);
      }
      
      // Delete the job
      return this.jobs.delete(id);
    } catch (error) {
      console.error("Error deleting job:", error);
      return false;
    }
  }
  
  async getApplication(id: number) {
    return this.applications.get(id);
  }
  
  async getApplicationsByJobId(jobId: number) {
    return Array.from(this.applications.values()).filter(app => app.jobId === jobId);
  }
  
  async getApplicationsByJobSeekerId(jobSeekerId: number) {
    return Array.from(this.applications.values()).filter(app => app.jobSeekerId === jobSeekerId);
  }
  
  async createApplication(insertApplication: InsertApplication) {
    const id = this.applicationIdCounter++;
    const now = new Date();
    const application: Application = {
      ...insertApplication,
      id,
      createdAt: now
    };
    this.applications.set(id, application);
    
    // Update job application count
    const job = this.jobs.get(application.jobId);
    if (job) {
      job.applicationCount = (job.applicationCount || 0) + 1;
      this.jobs.set(job.id, job);
    }
    
    return application;
  }
  
  async deleteApplication(id: number) {
    try {
      const application = this.applications.get(id);
      if (application) {
        // Update job application count
        const job = this.jobs.get(application.jobId);
        if (job) {
          job.applicationCount = Math.max(0, (job.applicationCount || 0) - 1);
          this.jobs.set(job.id, job);
        }
        
        return this.applications.delete(id);
      }
      return false;
    } catch (error) {
      console.error("Error deleting application:", error);
      return false;
    }
  }
  
  async updateApplicationStatus(id: number, status: string) {
    try {
      const application = this.applications.get(id);
      if (!application) return undefined;
      
      const updatedApplication: Application = {
        ...application,
        status
      };
      
      this.applications.set(id, updatedApplication);
      return updatedApplication;
    } catch (error) {
      console.error("Error updating application status:", error);
      return undefined;
    }
  }
  
  async getTestimonial(id: number) {
    return this.testimonials.get(id);
  }
  
  async getTestimonials() {
    return Array.from(this.testimonials.values());
  }
  
  async createTestimonial(insertTestimonial: InsertTestimonial) {
    const id = this.testimonialIdCounter++;
    const testimonial: Testimonial = {
      ...insertTestimonial,
      id
    };
    this.testimonials.set(id, testimonial);
    return testimonial;
  }
  
  async getAdmin(id: number) {
    return this.admins.get(id);
  }
  
  async getAdminByUserId(userId: number) {
    for (const admin of this.admins.values()) {
      if (admin.userId === userId) {
        return admin;
      }
    }
    return undefined;
  }
  
  async createAdmin(insertAdmin: InsertAdmin) {
    const id = this.adminIdCounter++;
    const admin: Admin = {
      ...insertAdmin,
      id,
      lastLogin: null,
      recoveryEmail: null,
      resetToken: null,
      resetTokenExpires: null
    };
    this.admins.set(id, admin);
    return admin;
  }
  
  async updateAdminLastLogin(id: number) {
    const admin = this.admins.get(id);
    if (!admin) {
      throw new Error("Admin not found");
    }
    
    const updatedAdmin: Admin = {
      ...admin,
      lastLogin: new Date()
    };
    
    this.admins.set(id, updatedAdmin);
    return updatedAdmin;
  }
  
  async getAllAdmins() {
    return Array.from(this.admins.values());
  }
  
  async getInvitationCode(code: string) {
    return this.invitationCodes.get(code);
  }
  
  async getInvitationCodes() {
    return Array.from(this.invitationCodes.values());
  }
  
  async createInvitationCode(insertInvitationCode: InsertInvitationCode) {
    const invitationCode: InvitationCode = {
      ...insertInvitationCode,
      createdAt: new Date()
    };
    this.invitationCodes.set(invitationCode.code, invitationCode);
    return invitationCode;
  }
  
  async verifyInvitationCode(code: string, email: string) {
    const invitationCode = this.invitationCodes.get(code);
    if (!invitationCode) return false;
    
    return (
      invitationCode.email === email &&
      !invitationCode.isUsed &&
      invitationCode.expiresAt > new Date()
    );
  }
  
  async markInvitationCodeAsUsed(code: string) {
    const invitationCode = this.invitationCodes.get(code);
    if (!invitationCode) return undefined;
    
    const updatedInvitationCode: InvitationCode = {
      ...invitationCode,
      isUsed: true
    };
    
    this.invitationCodes.set(code, updatedInvitationCode);
    return updatedInvitationCode;
  }
  
  async updateUserPassword(userId: number, password: string) {
    const user = this.users.get(userId);
    if (!user) {
      return undefined;
    }
    
    const updatedUser: User = {
      ...user,
      password
    };
    
    this.users.set(userId, updatedUser);
    return updatedUser;
  }
  
  async setPasswordResetToken(adminId: number, token: string, expiryDate: Date) {
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
  
  async getAdminByResetToken(token: string) {
    for (const admin of this.admins.values()) {
      if (
        admin.resetToken === token &&
        admin.resetTokenExpires &&
        admin.resetTokenExpires > new Date()
      ) {
        return admin;
      }
    }
    return undefined;
  }
  
  async clearPasswordResetToken(adminId: number) {
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
  
  async deleteUser(userId: number) {
    try {
      console.log(`MemStorage: Attempting to delete user ID: ${userId}`);
      
      // Check if user exists
      const user = this.users.get(userId);
      if (!user) {
        console.log(`MemStorage: User with ID ${userId} not found`);
        return false;
      }
      
      console.log(`MemStorage: Found user ${userId} to delete, userType: ${user.userType}`);

      // Delete admin record if exists
      for (const [adminId, admin] of this.admins.entries()) {
        if (admin.userId === userId) {
          this.admins.delete(adminId);
          break;
        }
      }

      // Delete jobSeeker record if exists
      let jobSeekerId: number | undefined;
      for (const [id, jobSeeker] of this.jobSeekers.entries()) {
        if (jobSeeker.userId === userId) {
          jobSeekerId = id;
          this.jobSeekers.delete(id);
          break;
        }
      }

      // Delete applications for job seeker
      if (jobSeekerId) {
        for (const [id, application] of this.applications.entries()) {
          if (application.jobSeekerId === jobSeekerId) {
            this.applications.delete(id);
          }
        }
      }

      // Delete employer record if exists
      let employerId: number | undefined;
      for (const [id, employer] of this.employers.entries()) {
        if (employer.userId === userId) {
          employerId = id;
          this.employers.delete(id);
          break;
        }
      }

      // Delete jobs and their applications for employer
      if (employerId) {
        const jobIds: number[] = [];
        for (const [id, job] of this.jobs.entries()) {
          if (job.employerId === employerId) {
            jobIds.push(id);
            this.jobs.delete(id);
          }
        }

        for (const [id, application] of this.applications.entries()) {
          if (jobIds.includes(application.jobId)) {
            this.applications.delete(id);
          }
        }
      }

      // Delete blog posts by this user
      for (const [id, post] of this.blogPosts.entries()) {
        if (post.authorId === userId) {
          this.blogPosts.delete(id);
        }
      }

      // Delete notifications for this user
      for (const [id, notification] of this.notifications.entries()) {
        if (notification.userId === userId) {
          this.notifications.delete(id);
        }
      }

      // Finally delete the user
      const deleted = this.users.delete(userId);
      console.log(`MemStorage: User deletion result - success: ${deleted}`);
      return deleted;
    } catch (error) {
      console.error(`MemStorage: Error deleting user ${userId}:`, error);
      return false; // Return false instead of rethrowing to maintain consistent error handling
    }
  }
  
  async updateAdminRecoveryEmail(id: number, recoveryEmail: string) {
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
  
  async getVacancy(id: number) {
    return this.vacancies.get(id);
  }
  
  async getVacancies() {
    return Array.from(this.vacancies.values());
  }
  
  async createVacancy(insertVacancy: InsertVacancy) {
    const id = this.vacancyIdCounter++;
    const now = new Date();
    
    const vacancy: Vacancy = {
      ...insertVacancy,
      id,
      submittedAt: now,
      status: insertVacancy.status || "new",
      assignedAt: null,
      reviewedAt: null
    };
    
    this.vacancies.set(id, vacancy);
    return vacancy;
  }
  
  async updateVacancyStatus(id: number, status: string) {
    const vacancy = this.vacancies.get(id);
    if (!vacancy) return undefined;
    
    const updatedVacancy: Vacancy = {
      ...vacancy,
      status,
      reviewedAt: new Date()
    };
    
    this.vacancies.set(id, updatedVacancy);
    return updatedVacancy;
  }
  
  async assignVacancyToRecruiter(
    id: number,
    recruiterEmail: string,
    recruiterName: string
  ) {
    const vacancy = this.vacancies.get(id);
    if (!vacancy) return undefined;
    
    const updatedVacancy: Vacancy = {
      ...vacancy,
      recruiterEmail,
      recruiterName,
      assignedAt: new Date()
    };
    
    this.vacancies.set(id, updatedVacancy);
    return updatedVacancy;
  }
  
  async deleteVacancy(id: number) {
    return this.vacancies.delete(id);
  }
  
  async getStaffingInquiry(id: number) {
    return this.staffingInquiries.get(id);
  }
  
  async getStaffingInquiries() {
    return Array.from(this.staffingInquiries.values());
  }
  
  async createStaffingInquiry(insertInquiry: InsertStaffingInquiry) {
    const id = this.staffingInquiryIdCounter++;
    const now = new Date();
    
    const inquiry: StaffingInquiry = {
      id,
      status: "new",
      submittedAt: now,
      email: insertInquiry.email,
      name: insertInquiry.name,
      message: insertInquiry.message,
      inquiry_type: insertInquiry.inquiry_type,
      company: insertInquiry.company ?? null,
      phone: insertInquiry.phone ?? null,
      marketing: insertInquiry.marketing ?? false
    };
    
    this.staffingInquiries.set(id, inquiry);
    return inquiry;
  }
  
  async updateStaffingInquiryStatus(id: number, status: string) {
    const inquiry = this.staffingInquiries.get(id);
    if (!inquiry) return undefined;
    
    const updatedInquiry: StaffingInquiry = {
      ...inquiry,
      status
    };
    
    this.staffingInquiries.set(id, updatedInquiry);
    return updatedInquiry;
  }
  
  async getBlogPost(id: number) {
    return this.blogPosts.get(id);
  }
  
  async getBlogPostBySlug(slug: string) {
    for (const post of this.blogPosts.values()) {
      if (post.slug === slug) {
        return post;
      }
    }
    return undefined;
  }
  
  async getBlogPosts(filters?: { category?: string; published?: boolean }) {
    let posts = Array.from(this.blogPosts.values());
    
    if (filters) {
      if (filters.category) {
        posts = posts.filter(post => post.category === filters.category);
      }
      
      if (filters.published !== undefined) {
        posts = posts.filter(post => post.published === filters.published);
      }
    }
    
    return posts.sort((a, b) => {
      const aDate = a.createdAt || new Date(0);
      const bDate = b.createdAt || new Date(0);
      return bDate.getTime() - aDate.getTime();
    });
  }
  
  async createBlogPost(post: InsertBlogPost) {
    const id = this.blogPostIdCounter++;
    const now = new Date();
    
    const blogPost: BlogPost = {
      ...post,
      id,
      createdAt: now,
      updatedAt: now
    };
    
    this.blogPosts.set(id, blogPost);
    return blogPost;
  }
  
  async updateBlogPost(id: number, post: Partial<InsertBlogPost>) {
    const existingPost = this.blogPosts.get(id);
    if (!existingPost) return undefined;
    
    const updatedPost: BlogPost = {
      ...existingPost,
      ...post,
      updatedAt: new Date()
    };
    
    this.blogPosts.set(id, updatedPost);
    return updatedPost;
  }
  
  async deleteBlogPost(id: number) {
    return this.blogPosts.delete(id);
  }
  
  async getNotifications(userId?: number, limit: number = 50) {
    let notifications = Array.from(this.notifications.values());
    
    if (userId !== undefined) {
      notifications = notifications.filter(n => n.userId === userId);
    }
    
    return notifications
      .sort((a, b) => {
        const aDate = a.createdAt || new Date(0);
        const bDate = b.createdAt || new Date(0);
        return bDate.getTime() - aDate.getTime();
      })
      .slice(0, limit);
  }
  
  async getNotification(id: number) {
    return this.notifications.get(id);
  }
  
  async createNotification(insertNotification: InsertNotification) {
    const id = this.notificationIdCounter++;
    const now = new Date();
    
    const notification: Notification = {
      id,
      createdAt: now,
      read: false,
      message: insertNotification.message,
      type: insertNotification.type,
      userId: insertNotification.userId ?? null,
      entityId: insertNotification.entityId ?? null
    };
    
    this.notifications.set(id, notification);
    return notification;
  }
  
  async markNotificationAsRead(id: number) {
    const notification = this.notifications.get(id);
    if (!notification) return undefined;
    
    const updatedNotification: Notification = {
      ...notification,
      read: true
    };
    
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }
  
  async markAllNotificationsAsRead(userId: number) {
    let updated = false;
    
    for (const [id, notification] of this.notifications.entries()) {
      if (notification.userId === userId && !notification.read) {
        notification.read = true;
        this.notifications.set(id, notification);
        updated = true;
      }
    }
    
    return updated;
  }
  
  async getUnreadNotificationCount(userId: number) {
    let count = 0;
    
    for (const notification of this.notifications.values()) {
      if (notification.userId === userId && !notification.read) {
        count++;
      }
    }
    
    return count;
  }
}

// Choose database or in-memory storage
const dbStorage = new DatabaseStorage();
const memStorage = new MemStorage();

// Export the storage implementation to use
export const storage = dbStorage;