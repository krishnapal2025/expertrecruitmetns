import { 
  users, User, InsertUser, 
  jobSeekers, JobSeeker, InsertJobSeeker, 
  employers, Employer, InsertEmployer,
  jobs, Job, InsertJob,
  applications, Application, InsertApplication,
  testimonials, Testimonial, InsertTestimonial
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";
import connectPg from "connect-pg-simple";
import { db, pool } from "./db";
import { eq, like, gte, lte, or, and, sql } from "drizzle-orm";

const MemoryStore = createMemoryStore(session);
const PostgresSessionStore = connectPg(session);

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  getUserByEmployerId(employerId: number): Promise<User | undefined>;
  getUserByJobSeekerId(jobSeekerId: number): Promise<User | undefined>;
  
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
  
  // Testimonial methods
  getTestimonial(id: number): Promise<Testimonial | undefined>;
  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  
  // Session store
  sessionStore: session.Store;
}

// Database storage using PostgreSQL
export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
      tableName: 'sessions'
    });
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
    const [job] = await db.insert(jobs).values(insertJob).returning();
    return job;
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
    const result = await db.delete(jobs).where(eq(jobs.id, id));
    return result.rowCount > 0;
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
    // Start a transaction to update both the application and job
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      
      // Insert application
      const [application] = await db.insert(applications).values(insertApplication).returning();
      
      // Update job application count
      await db
        .update(jobs)
        .set({ applications: sql`${jobs.applications} + 1` })
        .where(eq(jobs.id, insertApplication.jobId));
      
      await client.query('COMMIT');
      return application;
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private jobSeekers: Map<number, JobSeeker>;
  private employers: Map<number, Employer>;
  private jobs: Map<number, Job>;
  private applications: Map<number, Application>;
  private testimonials: Map<number, Testimonial>;
  
  sessionStore: session.Store;
  
  // ID counters
  private userIdCounter: number;
  private jobSeekerIdCounter: number;
  private employerIdCounter: number;
  private jobIdCounter: number;
  private applicationIdCounter: number;
  private testimonialIdCounter: number;

  constructor() {
    this.users = new Map();
    this.jobSeekers = new Map();
    this.employers = new Map();
    this.jobs = new Map();
    this.applications = new Map();
    this.testimonials = new Map();
    
    this.userIdCounter = 1;
    this.jobSeekerIdCounter = 1;
    this.employerIdCounter = 1;
    this.jobIdCounter = 1;
    this.applicationIdCounter = 1;
    this.testimonialIdCounter = 1;
    
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
    return application;
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
}

// Use Database storage for persistent data
export const storage = new DatabaseStorage();
